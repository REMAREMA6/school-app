/**
 * Express API server for the Akoka Federal Academy result compilation app.
 *
 * Wraps Prisma queries against the seeded SQLite database and exposes a
 * read-only JSON API used by the result compilation front-end.
 *
 * Run with:
 *   node mini-services/api/index.js
 *
 * Endpoints (all GET):
 *   /api/dashboard
 *   /api/students
 *   /api/students/:id
 *   /api/students/:id/scores
 *   /api/report-cards
 *   /api/report-cards/:id
 *   /api/subjects-classes
 *   /api/school-config
 *   /api/assessments
 *   /api/users
 *   /api/score-batches
 *   /api/score-batches/:id
 *   /api/drafts
 *   /api/audit
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the Expo web build (static files from dist/)
app.use(express.static(path.join(__dirname, '..', '..', 'dist')));

// Optional query helper
function take(req, def = 50, max = 200) {
  const v = parseInt(req.query.limit, 10);
  if (Number.isFinite(v) && v > 0) return Math.min(v, max);
  return def;
}
function skipVal(req) {
  const v = parseInt(req.query.offset, 10);
  if (Number.isFinite(v) && v >= 0) return v;
  return 0;
}

// ---------------------------------------------------------------------------
// GET /api/dashboard
// ---------------------------------------------------------------------------
app.get('/api/dashboard', async (req, res) => {
  try {
    const school = await prisma.school.findFirst({
      include: {
        academicSessions: {
          orderBy: { startDate: 'desc' },
          include: { terms: { orderBy: { termNumber: 'asc' } } },
        },
      },
    });
    if (!school) return res.status(404).json({ error: 'School not found' });

    const activeSession = school.academicSessions.find((s) => s.isActive) || null;
    const activeTerm = activeSession
      ? activeSession.terms.find((t) => t.isActive) || null
      : null;

    const [
      studentCount,
      teacherCount,
      batchCount,
      reportCardStatusGroups,
      pendingReviews,
      incompleteResults,
      recentBatches,
      recentAuditEvents,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.user.count({ where: { role: { in: ['TEACHER', 'PRINCIPAL', 'ADMIN'] } } }),
      prisma.scoreSubmissionBatch.count(),
      prisma.reportCard.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.scoreSubmissionBatch.count({
        where: { status: { in: ['AWAITING_REVIEW', 'PROCESSING', 'UPLOADED'] } },
      }),
      prisma.compilationResult.count({ where: { isComplete: false } }),
      prisma.scoreSubmissionBatch.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          classArm: { select: { id: true, fullLabel: true } },
          subject: { select: { id: true, subjectName: true, subjectCode: true } },
          uploadedBy: { select: { id: true, fullName: true } },
        },
      }),
      prisma.auditEvent.findMany({
        take: 12,
        orderBy: { occurredAt: 'desc' },
        include: {
          actor: { select: { id: true, fullName: true } },
        },
      }),
    ]);

    const reportCardCounts = {};
    for (const g of reportCardStatusGroups) reportCardCounts[g.status] = g._count;

    res.json({
      school: {
        id: school.id,
        name: school.name,
        motto: school.motto,
        addressLine: school.addressLine,
        state: school.state,
        country: school.country,
        establishedYear: school.establishedYear,
      },
      activeSession: activeSession
        ? { id: activeSession.id, sessionName: activeSession.sessionName, startDate: activeSession.startDate, endDate: activeSession.endDate }
        : null,
      activeTerm: activeTerm
        ? { id: activeTerm.id, termName: activeTerm.termName, termNumber: activeTerm.termNumber, startDate: activeTerm.startDate, endDate: activeTerm.endDate }
        : null,
      counts: {
        students: studentCount,
        teachers: teacherCount,
        batches: batchCount,
        pendingReviews,
        incompleteResults,
        reportCardsByStatus: reportCardCounts,
      },
      recentBatches,
      recentAuditEvents,
    });
  } catch (err) {
    console.error('dashboard error', err);
    res.status(500).json({ error: 'Failed to load dashboard', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/students?classArmId=&search=
// ---------------------------------------------------------------------------
app.get('/api/students', async (req, res) => {
  try {
    const { classArmId, search } = req.query;
    const where = {};
    if (classArmId) {
      where.classMemberships = { some: { classArmId, isCurrent: true } };
    }
    if (search && String(search).trim()) {
      const s = String(search).trim();
      where.OR = [
        { surname: { contains: s } },
        { firstName: { contains: s } },
        { otherNames: { contains: s } },
        { admissionNumber: { contains: s } },
      ];
    }
    const limit = take(req, 100, 500);
    const offset = skipVal(req);
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: [{ surname: 'asc' }, { firstName: 'asc' }],
        include: {
          classMemberships: {
            where: { isCurrent: true },
            take: 1,
            include: { classArm: true },
          },
        },
      }),
      prisma.student.count({ where }),
    ]);
    res.json({ total, count: students.length, students });
  } catch (err) {
    console.error('students error', err);
    res.status(500).json({ error: 'Failed to fetch students', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/students/:id
// ---------------------------------------------------------------------------
app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: {
        classMemberships: {
          orderBy: { createdAt: 'desc' },
          include: {
            classArm: { include: { class: true, track: true } },
            term: { include: { session: true } },
          },
        },
        school: true,
      },
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error('student detail error', err);
    res.status(500).json({ error: 'Failed to fetch student', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/students/:id/scores  (verified scores grouped by subject for active term)
// ---------------------------------------------------------------------------
app.get('/api/students/:id/scores', async (req, res) => {
  try {
    const activeTerm = await prisma.term.findFirst({
      where: { isActive: true },
      include: { session: true },
    });
    if (!activeTerm) return res.status(404).json({ error: 'No active term' });

    const verified = await prisma.verifiedScore.findMany({
      where: { studentId: req.params.id, termId: activeTerm.id },
      include: {
        assessmentComponent: true,
        assessmentConfiguration: {
          include: { subject: true },
        },
      },
    });

    const bySubject = {};
    for (const v of verified) {
      const subj = v.assessmentConfiguration.subject;
      if (!bySubject[subj.id]) {
        bySubject[subj.id] = {
          subjectId: subj.id,
          subjectCode: subj.subjectCode,
          subjectName: subj.subjectName,
          category: subj.category,
          caMaximum: v.assessmentConfiguration.caMaximum,
          examMaximum: v.assessmentConfiguration.examMaximum,
          components: [],
        };
      }
      bySubject[subj.id].components.push({
        componentId: v.assessmentComponentId,
        componentName: v.assessmentComponent.componentName,
        componentType: v.assessmentComponent.componentType,
        maximumMark: v.assessmentComponent.maximumMark,
        value: v.value,
        status: v.status,
      });
    }

    // Add compilation results per subject
    const compilations = await prisma.compilationResult.findMany({
      where: { studentId: req.params.id, termId: activeTerm.id },
    });
    for (const c of compilations) {
      if (bySubject[c.subjectId]) {
        bySubject[c.subjectId].compilation = {
          caTotal: c.caTotal,
          examScore: c.examScore,
          overallTotal: c.overallTotal,
          overallMaximum: c.overallMaximum,
          grade: c.grade,
          gradeLabel: c.gradeLabel,
          remark: c.remark,
          subjectPositionInArm: c.subjectPositionInArm,
          isComplete: c.isComplete,
          incompleteReason: c.incompleteReason,
        };
      }
    }

    res.json({
      studentId: req.params.id,
      term: activeTerm,
      subjects: Object.values(bySubject),
    });
  } catch (err) {
    console.error('student scores error', err);
    res.status(500).json({ error: 'Failed to fetch scores', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/report-cards?status=&classArmId=&search=
// ---------------------------------------------------------------------------
app.get('/api/report-cards', async (req, res) => {
  try {
    const { status, classArmId, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (classArmId) where.classArmId = classArmId;
    if (search && String(search).trim()) {
      const s = String(search).trim();
      where.student = {
        OR: [
          { surname: { contains: s } },
          { firstName: { contains: s } },
          { admissionNumber: { contains: s } },
        ],
      };
    }
    const limit = take(req, 100, 500);
    const offset = skipVal(req);
    const [cards, total] = await Promise.all([
      prisma.reportCard.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          student: { select: { id: true, surname: true, firstName: true, admissionNumber: true, gender: true } },
          classArm: { select: { id: true, fullLabel: true } },
          term: { select: { id: true, termName: true } },
          approvedBy: { select: { id: true, fullName: true } },
        },
      }),
      prisma.reportCard.count({ where }),
    ]);
    res.json({ total, count: cards.length, reportCards: cards });
  } catch (err) {
    console.error('report-cards error', err);
    res.status(500).json({ error: 'Failed to fetch report cards', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/report-cards/:id
// ---------------------------------------------------------------------------
app.get('/api/report-cards/:id', async (req, res) => {
  try {
    const card = await prisma.reportCard.findUnique({
      where: { id: req.params.id },
      include: {
        student: true,
        classArm: { include: { class: true, track: true } },
        term: { include: { session: true } },
        approvedBy: { select: { id: true, fullName: true, role: true } },
      },
    });
    if (!card) return res.status(404).json({ error: 'Report card not found' });

    const [compilationResults, classPosition] = await Promise.all([
      prisma.compilationResult.findMany({
        where: { studentId: card.studentId, termId: card.termId },
        include: { subject: true },
        orderBy: { subject: { sortOrder: 'asc' } },
      }),
      prisma.classPosition.findUnique({
        where: {
          studentId_termId: { studentId: card.studentId, termId: card.termId },
        },
      }),
    ]);

    res.json({
      ...card,
      affectiveTraits: card.affectiveTraitsJson ? JSON.parse(card.affectiveTraitsJson) : null,
      psychomotorTraits: card.psychomotorTraitsJson ? JSON.parse(card.psychomotorTraitsJson) : null,
      compilationResults,
      classPosition,
    });
  } catch (err) {
    console.error('report-card detail error', err);
    res.status(500).json({ error: 'Failed to fetch report card', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/subjects-classes
// ---------------------------------------------------------------------------
app.get('/api/subjects-classes', async (req, res) => {
  try {
    const [classes, arms, subjects, assignments] = await Promise.all([
      prisma.class.findMany({
        orderBy: { sortOrder: 'asc' },
        include: { classArms: { orderBy: { sortOrder: 'asc' } } },
      }),
      prisma.classArm.findMany({
        orderBy: { sortOrder: 'asc' },
        include: { class: true, track: true },
      }),
      prisma.subject.findMany({
        orderBy: { sortOrder: 'asc' },
        include: { track: true },
      }),
      prisma.classSubjectAssignment.findMany({
        include: {
          classArm: { select: { id: true, fullLabel: true } },
          subject: { select: { id: true, subjectCode: true, subjectName: true, category: true } },
        },
      }),
    ]);
    res.json({
      classes,
      classArms: arms,
      subjects,
      classSubjectAssignments: assignments,
    });
  } catch (err) {
    console.error('subjects-classes error', err);
    res.status(500).json({ error: 'Failed to fetch subjects and classes', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/school-config
// ---------------------------------------------------------------------------
app.get('/api/school-config', async (req, res) => {
  try {
    const school = await prisma.school.findFirst({
      include: {
        academicSessions: {
          orderBy: { startDate: 'desc' },
          include: { terms: { orderBy: { termNumber: 'asc' } } },
        },
        gradingBoundaries: { orderBy: { sortOrder: 'asc' } },
        gradeRemarks: true,
      },
    });
    if (!school) return res.status(404).json({ error: 'School not found' });
    res.json(school);
  } catch (err) {
    console.error('school-config error', err);
    res.status(500).json({ error: 'Failed to fetch school config', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/assessments?classArmId=
// ---------------------------------------------------------------------------
app.get('/api/assessments', async (req, res) => {
  try {
    const { classArmId } = req.query;
    const where = {};
    if (classArmId) where.classArmId = classArmId;
    const limit = take(req, 100, 500);
    const offset = skipVal(req);
    const [configs, total] = await Promise.all([
      prisma.assessmentConfiguration.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          classArm: { select: { id: true, fullLabel: true } },
          subject: { select: { id: true, subjectCode: true, subjectName: true, category: true } },
          term: { select: { id: true, termName: true } },
          components: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { classArm: { sortOrder: 'asc' } },
      }),
      prisma.assessmentConfiguration.count({ where }),
    ]);
    res.json({ total, count: configs.length, assessmentConfigurations: configs });
  } catch (err) {
    console.error('assessments error', err);
    res.status(500).json({ error: 'Failed to fetch assessments', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/users
// ---------------------------------------------------------------------------
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: [{ role: 'asc' }, { fullName: 'asc' }],
      include: {
        teacherAssignments: {
          include: {
            classArm: { select: { id: true, fullLabel: true } },
            subject: { select: { id: true, subjectCode: true, subjectName: true } },
          },
        },
      },
    });
    res.json({ count: users.length, users });
  } catch (err) {
    console.error('users error', err);
    res.status(500).json({ error: 'Failed to fetch users', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/score-batches?status=
// ---------------------------------------------------------------------------
app.get('/api/score-batches', async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const limit = take(req, 100, 500);
    const offset = skipVal(req);
    const [batches, total, statusGroups] = await Promise.all([
      prisma.scoreSubmissionBatch.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          classArm: { select: { id: true, fullLabel: true } },
          subject: { select: { id: true, subjectCode: true, subjectName: true } },
          term: { select: { id: true, termName: true } },
          uploadedBy: { select: { id: true, fullName: true } },
        },
      }),
      prisma.scoreSubmissionBatch.count({ where }),
      prisma.scoreSubmissionBatch.groupBy({ by: ['status'], _count: true }),
    ]);
    const statusCounts = {};
    for (const g of statusGroups) statusCounts[g.status] = g._count;
    res.json({ total, count: batches.length, statusCounts, scoreBatches: batches });
  } catch (err) {
    console.error('score-batches error', err);
    res.status(500).json({ error: 'Failed to fetch batches', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/score-batches/:id
// ---------------------------------------------------------------------------
app.get('/api/score-batches/:id', async (req, res) => {
  try {
    const batch = await prisma.scoreSubmissionBatch.findUnique({
      where: { id: req.params.id },
      include: {
        classArm: { include: { class: true, track: true } },
        subject: true,
        term: { include: { session: true } },
        uploadedBy: { select: { id: true, fullName: true, role: true } },
        assessmentConfiguration: { include: { components: { orderBy: { sortOrder: 'asc' } } } },
      },
    });
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    const [drafts, verified, auditEvents] = await Promise.all([
      prisma.scoreDraft.findMany({
        where: { batchId: batch.id },
        include: {
          student: { select: { id: true, surname: true, firstName: true, admissionNumber: true } },
          assessmentComponent: { select: { id: true, componentName: true, maximumMark: true } },
        },
        orderBy: { createdAt: 'asc' },
        take: 500,
      }),
      prisma.verifiedScore.findMany({
        where: { scoreSubmissionBatchId: batch.id },
        include: {
          student: { select: { id: true, surname: true, firstName: true, admissionNumber: true } },
          assessmentComponent: { select: { id: true, componentName: true, maximumMark: true } },
        },
        orderBy: { student: { surname: 'asc' } },
        take: 500,
      }),
      prisma.auditEvent.findMany({
        where: { batchId: batch.id },
        orderBy: { occurredAt: 'desc' },
        include: { actor: { select: { id: true, fullName: true } } },
      }),
    ]);

    res.json({
      ...batch,
      drafts,
      verifiedScores: verified,
      auditEvents,
    });
  } catch (err) {
    console.error('score-batch detail error', err);
    res.status(500).json({ error: 'Failed to fetch batch', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/drafts  (drafts needing review)
// ---------------------------------------------------------------------------
app.get('/api/drafts', async (req, res) => {
  try {
    const limit = take(req, 200, 1000);
    const offset = skipVal(req);
    const where = {
      status: { in: ['PENDING_REVIEW', 'FLAGGED_INVALID', 'FLAGGED_UNCERTAIN'] },
    };
    const [drafts, total, statusGroups] = await Promise.all([
      prisma.scoreDraft.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          batch: {
            select: {
              id: true,
              batchRef: true,
              status: true,
              classArm: { select: { id: true, fullLabel: true } },
              subject: { select: { id: true, subjectCode: true, subjectName: true } },
            },
          },
          student: { select: { id: true, surname: true, firstName: true, admissionNumber: true } },
          assessmentComponent: { select: { id: true, componentName: true, maximumMark: true } },
        },
      }),
      prisma.scoreDraft.count({ where }),
      prisma.scoreDraft.groupBy({ by: ['status'], _count: true }),
    ]);
    const statusCounts = {};
    for (const g of statusGroups) statusCounts[g.status] = g._count;
    res.json({ total, count: drafts.length, statusCounts, drafts });
  } catch (err) {
    console.error('drafts error', err);
    res.status(500).json({ error: 'Failed to fetch drafts', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/audit
// ---------------------------------------------------------------------------
app.get('/api/audit', async (req, res) => {
  try {
    const limit = take(req, 50, 200);
    const offset = skipVal(req);
    const where = {};
    if (req.query.eventType) where.eventType = req.query.eventType;
    const [events, total, typeGroups] = await Promise.all([
      prisma.auditEvent.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { occurredAt: 'desc' },
        include: {
          actor: { select: { id: true, fullName: true } },
          batch: { select: { id: true, batchRef: true } },
        },
      }),
      prisma.auditEvent.count({ where }),
      prisma.auditEvent.groupBy({ by: ['eventType'], _count: true }),
    ]);
    const typeCounts = {};
    for (const g of typeGroups) typeCounts[g.eventType] = g._count;
    res.json({ total, count: events.length, typeCounts, auditEvents: events });
  } catch (err) {
    console.error('audit error', err);
    res.status(500).json({ error: 'Failed to fetch audit events', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// 404
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Akoka Federal Academy server listening on http://localhost:${PORT}`);
    console.log(`App: http://localhost:${PORT}/`);
    console.log(`API: http://localhost:${PORT}/api/dashboard`);
  });
  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down API...');
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}

module.exports = app;
