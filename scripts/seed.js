/**
 * Seed script for the Akoka Federal Academy result compilation app.
 *
 * Wipes the database and populates it with realistic Nigerian secondary
 * school demonstration data:
 *   - 1 school
 *   - 2 academic sessions (3 terms each)
 *   - 4 subject tracks
 *   - 6 classes, 15 class arms
 *   - ~32 NERDC subjects
 *   - WAEC 9-point grading boundaries
 *   - 13 users (1 admin, 1 principal, 11 teachers)
 *   - 140 students across all arms
 *   - assessment configurations, score submission batches, drafts,
 *     verified scores, compilation results, class positions,
 *     report cards and audit events.
 *
 * Usage:
 *   node scripts/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Deterministic PRNG (mulberry32, seed 0x1a1875c4)
// ---------------------------------------------------------------------------
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(0x1a1875c4);
const rand = () => rng();
const randInt = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const chance = (p) => rng() < p;
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

function gaussian(mean, stddev) {
  let u = 0,
    v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + z * stddev;
}

// ---------------------------------------------------------------------------
// Name pools (Yoruba / Igbo / Hausa / minority)
// ---------------------------------------------------------------------------
const yorubaSurnames = [
  'Adeyemi', 'Ogunleye', 'Adewale', 'Olatunji', 'Bakare', 'Fashola',
  'Adekunle', 'Ajayi', 'Adebayo', 'Ojo', 'Olanrewaju', 'Oyewole',
  'Balogun', 'Akande', 'Adejumo', 'Odunsi', 'Fasina', 'Oshodi',
  'Oyediran', 'Adeniran', 'Adepoju', 'Adesanya', 'Bankole', 'Adewumi',
  'Odukoya', 'Olaniyan', 'Adesiyan', 'Ogunwale', 'Ashaye', 'Akinwale',
  'Ogunjimi', 'Oyelowo', 'Adebola', 'Olawale', 'Akinola', 'Soyinka',
  'Adeyemo',
];
const yorubaFirstNames = [
  'Tunde', 'Bola', 'Segun', 'Femi', 'Yemi', 'Sade', 'Kemi', 'Bisi', 'Tolu',
  'Dara', 'Yetunde', 'Folake', 'Ayo', 'Dele', 'Kunle', 'Bayo', 'Ola', 'Tope',
  'Damilola', 'Seyi', 'Bimbo', 'Wale', 'Funke', 'Tobi', 'Adunni', 'Gbenga',
];
const igboSurnames = [
  'Okafor', 'Nwosu', 'Eze', 'Anozie', 'Obi', 'Nwankwo', 'Chukwu', 'Igwe',
  'Nwogu', 'Okeke', 'Iroegbu', 'Nwachukwu', 'Obianika', 'Ezeilo', 'Ezea',
  'Udeh', 'Udo', 'Emenike', 'Nwadike', 'Okoli', 'Onuoha', 'Madu', 'Ezeji',
  'Nwanna', 'Ibeanu',
];
const igboFirstNames = [
  'Chidi', 'Emeka', 'Ngozi', 'Ifeoma', 'Obinna', 'Chioma', 'Uche', 'Onyeka',
  'Nneka', 'Tochi', 'Ekene', 'Chukwuemeka', 'Kelechi', 'Somto', 'Adaobi',
  'Chinwe', 'Obiefuna', 'Amaka', 'Chinaza', 'Ifeanyi',
];
const hausaSurnames = [
  'Bello', 'Abubakar', 'Mohammed', 'Yusuf', 'Sani', 'Adamu', 'Ibrahim',
  'Musa', 'Aliyu', 'Isa', 'Abdullahi', 'Garba', 'Hassan', 'Lawal', 'Bala',
  'Bashir', 'Tukur', 'Yakubu', 'Shehu', 'Shittu', 'Suleiman', 'Danjuma',
];
const hausaFirstNames = [
  'Aisha', 'Fatima', 'Hauwa', 'Zainab', 'Hadiza', 'Yusuf', 'Sani', 'Bello',
  'Adamu', 'Abubakar', 'Musa', 'Ibrahim', 'Aminu', 'Kabir', 'Nasir',
  'Rukayya', 'Halima', 'Maryam', 'Salihu',
];
const minoritySurnames = [
  'Osemwegie', 'Eboigbe', 'Osayande', 'Igbinedion', 'Idahosa', 'Terhemba',
  'Tarkaa', 'Iorapuu', 'Ebi', 'Okaba', 'Iyalla', 'Tubo', 'Oghre', 'Okpako',
  'Adjaro', 'Akpofure', 'Okowa', 'Edevbie', 'Omojola', 'Douye',
];
const minorityFirstNames = [
  'Ese', 'Tega', 'Okiemute', 'Onajite', 'Ebiowei', 'Pero', 'Akpeni',
  'Weyinmi', 'Eseoghene', 'Ovie', 'Tagbo', 'Ifueko', 'Uyiekpen', 'Tari',
  'Preye',
];

const statesYoruba = ['Lagos', 'Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti', 'Kwara'];
const statesIgbo = ['Anambra', 'Imo', 'Enugu', 'Abia', 'Ebonyi', 'Delta'];
const statesHausa = ['Kano', 'Katsina', 'Kaduna', 'Sokoto', 'Jigawa', 'Zamfara', 'Borno'];
const statesMinority = ['Edo', 'Delta', 'Rivers', 'Bayelsa', 'Benue', 'Taraba', 'Cross River'];

const religions = ['Christianity', 'Islam', 'Christianity', 'Christianity', 'Islam'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const classTeacherComments = [
  'A diligent and well-behaved student. Keep it up.',
  'A promising student who can do better with more effort.',
  'An obedient and hardworking student. Continue this way.',
  'Needs to improve in attendance and participation in class.',
  'A quiet but serious student. Sustained effort will yield better results.',
  'A brilliant student with excellent conduct. Highly recommended.',
  'Capable of better performance if more attention is given to studies.',
  'A cheerful student who relates well with peers and teachers.',
  'A cooperative student with satisfactory progress this term.',
  'Below expectation. More dedication is required next term.',
  'An excellent student who is a role model to classmates.',
  'Improved steadily over the term. Maintain the momentum.',
];
const principalComments = [
  'A commendable performance. Keep up the good work.',
  'Satisfactory result. Aim higher next term.',
  'Good effort. Greater dedication will produce better results.',
  'A wonderful report. We are proud of your progress.',
  'There is room for improvement. Work harder next term.',
  'An outstanding report. Sustain the excellence.',
  'Encouraging performance. Continue to strive for the best.',
  'More effort is needed to realize your full potential.',
];

const affectiveKeys = [
  'Punctuality', 'Neatness', 'Politeness', 'Honesty', 'Self-control',
  'Cooperation', 'Leadership', 'Attentiveness', 'Perseverance', 'Initiative',
];
const psychomotorKeys = [
  'Handwriting', 'Sports', 'Drawing/Painting', 'Crafts', 'Music',
  'Manual Skills', 'Speech', 'Practical Work',
];
const traitRatings = ['A', 'A', 'B', 'B', 'C', 'C', 'D'];

// ---------------------------------------------------------------------------
// Subjects
// ---------------------------------------------------------------------------
const SUBJECTS = [
  // code, name, category, track, isJSS, isSS, isCore
  { code: 'ENG', name: 'English Language', category: 'CORE', track: null, jss: true, ss: true, core: true },
  { code: 'MTH', name: 'General Mathematics', category: 'CORE', track: 'JUNIOR', jss: true, ss: false, core: true },
  { code: 'MAT', name: 'Mathematics', category: 'CORE', track: null, jss: false, ss: true, core: true },
  { code: 'BSC', name: 'Basic Science', category: 'SCIENCE', track: 'JUNIOR', jss: true, ss: false, core: false },
  { code: 'BT',  name: 'Basic Technology', category: 'PREVOCATIONAL', track: 'JUNIOR', jss: true, ss: false, core: false },
  { code: 'CCA', name: 'Cultural and Creative Arts', category: 'ARTS', track: 'JUNIOR', jss: true, ss: false, core: false },
  { code: 'BUS', name: 'Business Studies', category: 'COMMERCIAL', track: 'JUNIOR', jss: true, ss: false, core: false },
  { code: 'PVS', name: 'Pre-Vocational Studies', category: 'PREVOCATIONAL', track: 'JUNIOR', jss: true, ss: false, core: false },
  { code: 'PHE', name: 'Physical and Health Education', category: 'PREVOCATIONAL', track: 'JUNIOR', jss: true, ss: false, core: false },
  { code: 'SCS', name: 'Social and Citizenship Studies', category: 'ARTS', track: 'JUNIOR', jss: true, ss: false, core: false },
  { code: 'CMP', name: 'Computer Studies', category: 'SCIENCE', track: null, jss: true, ss: true, core: false },
  { code: 'CIV', name: 'Civic Education', category: 'CORE', track: null, jss: true, ss: true, core: true },
  { code: 'CRS', name: 'Christian Religious Studies', category: 'RELIGION', track: null, jss: true, ss: true, core: false },
  { code: 'IRS', name: 'Islamic Religious Studies', category: 'RELIGION', track: null, jss: true, ss: true, core: false },
  { code: 'YOR', name: 'Yoruba Language', category: 'LANGUAGE', track: null, jss: true, ss: true, core: false },
  { code: 'IBO', name: 'Igbo Language', category: 'LANGUAGE', track: null, jss: true, ss: true, core: false },
  { code: 'HAU', name: 'Hausa Language', category: 'LANGUAGE', track: null, jss: true, ss: true, core: false },
  { code: 'FRE', name: 'French', category: 'LANGUAGE', track: null, jss: true, ss: true, core: false },
  { code: 'PHY', name: 'Physics', category: 'SCIENCE', track: 'SCIENCE', jss: false, ss: true, core: false },
  { code: 'CHM', name: 'Chemistry', category: 'SCIENCE', track: 'SCIENCE', jss: false, ss: true, core: false },
  { code: 'BIO', name: 'Biology', category: 'SCIENCE', track: 'SCIENCE', jss: false, ss: true, core: false },
  { code: 'FMT', name: 'Further Mathematics', category: 'SCIENCE', track: 'SCIENCE', jss: false, ss: true, core: false },
  { code: 'AGR', name: 'Agricultural Science', category: 'PREVOCATIONAL', track: 'SCIENCE', jss: false, ss: true, core: false },
  { code: 'GEO', name: 'Geography', category: 'ARTS', track: null, jss: false, ss: true, core: false },
  { code: 'LIT', name: 'Literature in English', category: 'ARTS', track: 'ARTS', jss: false, ss: true, core: false },
  { code: 'GOV', name: 'Government', category: 'ARTS', track: 'ARTS', jss: false, ss: true, core: false },
  { code: 'HIS', name: 'History', category: 'ARTS', track: 'ARTS', jss: false, ss: true, core: false },
  { code: 'VAR', name: 'Visual Arts', category: 'ARTS', track: 'ARTS', jss: false, ss: true, core: false },
  { code: 'ECO', name: 'Economics', category: 'COMMERCIAL', track: 'COMMERCIAL', jss: false, ss: true, core: false },
  { code: 'ACC', name: 'Financial Accounting', category: 'COMMERCIAL', track: 'COMMERCIAL', jss: false, ss: true, core: false },
  { code: 'COM', name: 'Commerce', category: 'COMMERCIAL', track: 'COMMERCIAL', jss: false, ss: true, core: false },
  { code: 'MKT', name: 'Marketing', category: 'COMMERCIAL', track: 'COMMERCIAL', jss: false, ss: true, core: false },
];

// WAEC 9-point grading boundaries
const GRADE_BOUNDARIES = [
  { grade: 'A1', label: 'Excellent', min: 75, max: 100, credit: true },
  { grade: 'B2', label: 'Very Good', min: 70, max: 74, credit: true },
  { grade: 'B3', label: 'Good', min: 65, max: 69, credit: true },
  { grade: 'C4', label: 'Credit', min: 60, max: 64, credit: true },
  { grade: 'C5', label: 'Credit', min: 55, max: 59, credit: true },
  { grade: 'C6', label: 'Credit', min: 50, max: 54, credit: true },
  { grade: 'D7', label: 'Pass', min: 45, max: 49, credit: false },
  { grade: 'E8', label: 'Pass', min: 40, max: 44, credit: false },
  { grade: 'F9', label: 'Fail', min: 0, max: 39, credit: false },
];

const GRADE_REMARKS = [
  { grade: 'A1', remark: 'Excellent performance. Keep it up.' },
  { grade: 'B2', remark: 'Very good performance.' },
  { grade: 'B3', remark: 'Good performance.' },
  { grade: 'C4', remark: 'A credit pass. Solid effort.' },
  { grade: 'C5', remark: 'A credit pass.' },
  { grade: 'C6', remark: 'A minimum credit pass.' },
  { grade: 'D7', remark: 'Ordinary pass. More effort needed.' },
  { grade: 'E8', remark: 'Bare pass. Significant improvement required.' },
  { grade: 'F9', remark: 'Fail. Urgent remediation is needed.' },
];

function gradeForPercent(percent, boundaries) {
  for (const b of boundaries) {
    if (percent >= b.min && percent <= b.max) return b;
  }
  return boundaries[boundaries.length - 1];
}

// CA component templates per subject category.
function buildComponents(category) {
  if (category === 'SCIENCE' || category === 'CORE') {
    return [
      { name: 'Assignment', type: 'CONTINUOUS_ASSESSMENT', max: 10 },
      { name: 'Test 1', type: 'CONTINUOUS_ASSESSMENT', max: 10 },
      { name: 'Test 2', type: 'CONTINUOUS_ASSESSMENT', max: 10 },
      { name: 'Mid-Term Test', type: 'CONTINUOUS_ASSESSMENT', max: 10 },
      { name: 'Examination', type: 'EXAMINATION', max: 60 },
    ];
  }
  if (category === 'ARTS' || category === 'COMMERCIAL') {
    return [
      { name: 'Assignment 1', type: 'CONTINUOUS_ASSESSMENT', max: 5 },
      { name: 'Assignment 2', type: 'CONTINUOUS_ASSESSMENT', max: 5 },
      { name: 'Test', type: 'CONTINUOUS_ASSESSMENT', max: 15 },
      { name: 'Mid-Term Test', type: 'CONTINUOUS_ASSESSMENT', max: 15 },
      { name: 'Examination', type: 'EXAMINATION', max: 60 },
    ];
  }
  if (category === 'LANGUAGE' || category === 'RELIGION') {
    return [
      { name: 'Assignment', type: 'CONTINUOUS_ASSESSMENT', max: 10 },
      { name: 'Test', type: 'CONTINUOUS_ASSESSMENT', max: 15 },
      { name: 'Mid-Term Test', type: 'CONTINUOUS_ASSESSMENT', max: 15 },
      { name: 'Examination', type: 'EXAMINATION', max: 60 },
    ];
  }
  if (category === 'PREVOCATIONAL') {
    return [
      { name: 'Practical', type: 'CONTINUOUS_ASSESSMENT', max: 20 },
      { name: 'Continuous Test', type: 'CONTINUOUS_ASSESSMENT', max: 20 },
      { name: 'Examination', type: 'EXAMINATION', max: 60 },
    ];
  }
  // fallback (should not happen)
  return [
    { name: 'Assignment', type: 'CONTINUOUS_ASSESSMENT', max: 10 },
    { name: 'Test', type: 'CONTINUOUS_ASSESSMENT', max: 15 },
    { name: 'Mid-Term Test', type: 'CONTINUOUS_ASSESSMENT', max: 15 },
    { name: 'Examination', type: 'EXAMINATION', max: 60 },
  ];
}

// ---------------------------------------------------------------------------
// Helpers for Nigerian names
// ---------------------------------------------------------------------------
function generateNigerianName(idx) {
  // rotate through pools for diversity
  const pool = idx % 4;
  let surname, firstName, otherNames, state, religion;
  if (pool === 0) {
    surname = pick(yorubaSurnames);
    firstName = pick(yorubaFirstNames);
    otherNames = chance(0.5) ? pick(yorubaFirstNames) : null;
    state = pick(statesYoruba);
    religion = chance(0.6) ? 'Christianity' : 'Islam';
  } else if (pool === 1) {
    surname = pick(igboSurnames);
    firstName = pick(igboFirstNames);
    otherNames = chance(0.5) ? pick(igboFirstNames) : null;
    state = pick(statesIgbo);
    religion = 'Christianity';
  } else if (pool === 2) {
    surname = pick(hausaSurnames);
    firstName = pick(hausaFirstNames);
    otherNames = chance(0.4) ? pick(hausaFirstNames) : null;
    state = pick(statesHausa);
    religion = 'Islam';
  } else {
    surname = pick(minoritySurnames);
    firstName = pick(minorityFirstNames);
    otherNames = chance(0.4) ? pick(minorityFirstNames) : null;
    state = pick(statesMinority);
    religion = chance(0.55) ? 'Christianity' : 'Islam';
  }
  return { surname, firstName, otherNames, state, religion };
}

function pad(n, len) {
  return String(n).padStart(len, '0');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('Clearing existing data...');
  await prisma.$transaction([
    prisma.auditEvent.deleteMany(),
    prisma.reportCard.deleteMany(),
    prisma.classPosition.deleteMany(),
    prisma.compilationResult.deleteMany(),
    prisma.verifiedScore.deleteMany(),
    prisma.scoreDraft.deleteMany(),
    prisma.scoreSubmissionBatch.deleteMany(),
    prisma.assessmentComponent.deleteMany(),
    prisma.assessmentConfiguration.deleteMany(),
    prisma.studentClassMembership.deleteMany(),
    prisma.student.deleteMany(),
    prisma.teacherAssignment.deleteMany(),
    prisma.user.deleteMany(),
    prisma.gradeRemark.deleteMany(),
    prisma.gradingBoundary.deleteMany(),
    prisma.classSubjectAssignment.deleteMany(),
    prisma.subject.deleteMany(),
    prisma.classArm.deleteMany(),
    prisma.class.deleteMany(),
    prisma.term.deleteMany(),
    prisma.academicSession.deleteMany(),
    prisma.subjectTrack.deleteMany(),
    prisma.school.deleteMany(),
  ]);

  // 1. School
  console.log('Creating school...');
  const school = await prisma.school.create({
    data: {
      name: 'Akoka Federal Academy',
      motto: 'Knowledge · Discipline · Service',
      addressLine: '12 Akoka Road, Yaba',
      state: 'Lagos',
      country: 'Nigeria',
      establishedYear: 1985,
      isActive: true,
    },
  });

  // 2. Subject Tracks
  console.log('Creating subject tracks...');
  const tracks = {};
  for (const t of ['JUNIOR', 'SCIENCE', 'ARTS', 'COMMERCIAL']) {
    tracks[t] = await prisma.subjectTrack.create({ data: { name: t } });
  }

  // 3. Academic sessions + terms
  console.log('Creating academic sessions and terms...');
  const sessions = {};
  const termsBySession = {};

  sessions['2023/2024'] = await prisma.academicSession.create({
    data: {
      schoolId: school.id,
      sessionName: '2023/2024',
      isActive: false,
      startDate: new Date('2023-09-11'),
      endDate: new Date('2024-07-26'),
    },
  });
  termsBySession['2023/2024'] = await Promise.all([
    prisma.term.create({
      data: {
        sessionId: sessions['2023/2024'].id,
        termNumber: 1,
        termName: 'First Term',
        startDate: new Date('2023-09-11'),
        endDate: new Date('2024-01-26'),
        isActive: false,
      },
    }),
    prisma.term.create({
      data: {
        sessionId: sessions['2023/2024'].id,
        termNumber: 2,
        termName: 'Second Term',
        startDate: new Date('2024-02-05'),
        endDate: new Date('2024-04-19'),
        isActive: false,
      },
    }),
    prisma.term.create({
      data: {
        sessionId: sessions['2023/2024'].id,
        termNumber: 3,
        termName: 'Third Term',
        startDate: new Date('2024-04-29'),
        endDate: new Date('2024-07-26'),
        isActive: false,
      },
    }),
  ]);

  sessions['2024/2025'] = await prisma.academicSession.create({
    data: {
      schoolId: school.id,
      sessionName: '2024/2025',
      isActive: true,
      startDate: new Date('2024-09-09'),
      endDate: new Date('2025-07-25'),
    },
  });
  termsBySession['2024/2025'] = await Promise.all([
    prisma.term.create({
      data: {
        sessionId: sessions['2024/2025'].id,
        termNumber: 1,
        termName: 'First Term',
        startDate: new Date('2024-09-09'),
        endDate: new Date('2025-01-24'),
        isActive: true,
      },
    }),
    prisma.term.create({
      data: {
        sessionId: sessions['2024/2025'].id,
        termNumber: 2,
        termName: 'Second Term',
        startDate: new Date('2025-02-03'),
        endDate: new Date('2025-04-18'),
        isActive: false,
      },
    }),
    prisma.term.create({
      data: {
        sessionId: sessions['2024/2025'].id,
        termNumber: 3,
        termName: 'Third Term',
        startDate: new Date('2025-04-28'),
        endDate: new Date('2025-07-25'),
        isActive: false,
      },
    }),
  ]);
  const activeTerm = termsBySession['2024/2025'][0];

  // 4. Classes and class arms
  console.log('Creating classes and class arms...');
  const classDefs = [
    { name: 'JSS 1', level: 'JUNIOR', year: 1, sortOrder: 1 },
    { name: 'JSS 2', level: 'JUNIOR', year: 2, sortOrder: 2 },
    { name: 'JSS 3', level: 'JUNIOR', year: 3, sortOrder: 3 },
    { name: 'SS 1', level: 'SENIOR', year: 1, sortOrder: 4 },
    { name: 'SS 2', level: 'SENIOR', year: 2, sortOrder: 5 },
    { name: 'SS 3', level: 'SENIOR', year: 3, sortOrder: 6 },
  ];
  const classes = {};
  for (const c of classDefs) {
    classes[c.name] = await prisma.class.create({
      data: {
        schoolId: school.id,
        className: c.name,
        classLevel: c.level,
        yearNumber: c.year,
        sortOrder: c.sortOrder,
      },
    });
  }

  // armName, fullLabel, className, track
  const armDefs = [
    { arm: 'A', full: 'JSS 1A', className: 'JSS 1', track: 'JUNIOR' },
    { arm: 'B', full: 'JSS 1B', className: 'JSS 1', track: 'JUNIOR' },
    { arm: 'A', full: 'JSS 2A', className: 'JSS 2', track: 'JUNIOR' },
    { arm: 'B', full: 'JSS 2B', className: 'JSS 2', track: 'JUNIOR' },
    { arm: 'A', full: 'JSS 3A', className: 'JSS 3', track: 'JUNIOR' },
    { arm: 'B', full: 'JSS 3B', className: 'JSS 3', track: 'JUNIOR' },
    { arm: 'Science', full: 'SS 1 Science', className: 'SS 1', track: 'SCIENCE' },
    { arm: 'Arts', full: 'SS 1 Arts', className: 'SS 1', track: 'ARTS' },
    { arm: 'Commercial', full: 'SS 1 Commercial', className: 'SS 1', track: 'COMMERCIAL' },
    { arm: 'Science', full: 'SS 2 Science', className: 'SS 2', track: 'SCIENCE' },
    { arm: 'Arts', full: 'SS 2 Arts', className: 'SS 2', track: 'ARTS' },
    { arm: 'Commercial', full: 'SS 2 Commercial', className: 'SS 2', track: 'COMMERCIAL' },
    { arm: 'Science', full: 'SS 3 Science', className: 'SS 3', track: 'SCIENCE' },
    { arm: 'Arts', full: 'SS 3 Arts', className: 'SS 3', track: 'ARTS' },
    { arm: 'Commercial', full: 'SS 3 Commercial', className: 'SS 3', track: 'COMMERCIAL' },
  ];
  const arms = [];
  for (let i = 0; i < armDefs.length; i++) {
    const a = armDefs[i];
    const arm = await prisma.classArm.create({
      data: {
        classId: classes[a.className].id,
        armName: a.arm,
        fullLabel: a.full,
        trackId: tracks[a.track].id,
        sortOrder: i + 1,
      },
    });
    arms.push({ ...arm, _className: a.className, _track: a.track });
  }

  // 5. Subjects
  console.log('Creating subjects...');
  const subjects = {};
  for (let i = 0; i < SUBJECTS.length; i++) {
    const s = SUBJECTS[i];
    const trackId = s.track ? tracks[s.track].id : null;
    const subj = await prisma.subject.create({
      data: {
        subjectCode: s.code,
        subjectName: s.name,
        category: s.category,
        trackId,
        isOfferedJSS: s.jss,
        isOfferedSS: s.ss,
        isCore: s.core,
        sortOrder: i + 1,
      },
    });
    subjects[s.code] = subj;
  }

  // 6. Class-subject assignments
  console.log('Creating class-subject assignments...');
  /** @type {{classArmId:string, subjectId:string, arm:any, subject:any}[]} */
  const assignments = [];
  for (const arm of arms) {
    const codes = [];
    if (arm._track === 'JUNIOR') {
      for (const s of SUBJECTS) if (s.jss) codes.push(s.code);
    } else {
      // SS arm: core + languages + religion + geography + track-specific
      for (const s of SUBJECTS) {
        if (!s.ss) continue;
        if (s.core) codes.push(s.code);
        else if (s.category === 'LANGUAGE' || s.category === 'RELIGION') codes.push(s.code);
        else if (s.code === 'GEO') codes.push(s.code); // geography offered to all SS
        else if (s.track === arm._track) codes.push(s.code);
        // Economics is COMMERCIAL track but commonly taken by Arts students too
        else if (arm._track === 'ARTS' && s.code === 'ECO') codes.push(s.code);
        // Agricultural Science commonly taken by Science and some Commercial students
        else if (arm._track === 'COMMERCIAL' && s.code === 'AGR') codes.push(s.code);
      }
    }
    for (const code of codes) {
      const a = await prisma.classSubjectAssignment.create({
        data: {
          classArmId: arm.id,
          subjectId: subjects[code].id,
          isOffered: true,
        },
      });
      assignments.push({ ...a, arm, subject: subjects[code] });
    }
  }

  // 7. Grading boundaries + remarks
  console.log('Creating grading boundaries and remarks...');
  for (let i = 0; i < GRADE_BOUNDARIES.length; i++) {
    const b = GRADE_BOUNDARIES[i];
    await prisma.gradingBoundary.create({
      data: {
        schoolId: school.id,
        grade: b.grade,
        label: b.label,
        minPercent: b.min,
        maxPercent: b.max,
        isCredit: b.credit,
        sortOrder: i + 1,
      },
    });
  }
  for (const r of GRADE_REMARKS) {
    await prisma.gradeRemark.create({
      data: { schoolId: school.id, grade: r.grade, remark: r.remark },
    });
  }
  const boundaries = GRADE_BOUNDARIES; // local reference for grade computation

  // 8. Users
  console.log('Creating users...');
  const admin = await prisma.user.create({
    data: {
      schoolId: school.id,
      email: 'admin@akokafederal.edu.ng',
      passwordHash: 'demo-hash-admin',
      role: 'ADMIN',
      fullName: 'Adeyemi Babatunde',
      phone: '+2348012345678',
      isActive: true,
    },
  });
  const principal = await prisma.user.create({
    data: {
      schoolId: school.id,
      email: 'principal@akokafederal.edu.ng',
      passwordHash: 'demo-hash-principal',
      role: 'PRINCIPAL',
      fullName: 'Ogunleye Folake',
      phone: '+2348023456789',
      isActive: true,
    },
  });

  const teacherSeed = [
    { fullName: 'Okoro Chidi', email: 'c.okoro@akokafederal.edu.ng', phone: '+2348031110001' },
    { fullName: 'Nwosu Ngozi', email: 'n.nwosu@akokafederal.edu.ng', phone: '+2348031110002' },
    { fullName: 'Bello Abubakar', email: 'a.bello@akokafederal.edu.ng', phone: '+2348031110003' },
    { fullName: 'Adewale Bisi', email: 'b.adewale@akokafederal.edu.ng', phone: '+2348031110004' },
    { fullName: 'Eze Emeka', email: 'e.eze@akokafederal.edu.ng', phone: '+2348031110005' },
    { fullName: 'Bakare Yetunde', email: 'y.bakare@akokafederal.edu.ng', phone: '+2348031110006' },
    { fullName: 'Yusuf Sani', email: 's.yusuf@akokafederal.edu.ng', phone: '+2348031110007' },
    { fullName: 'Okafor Chioma', email: 'c.okafor@akokafederal.edu.ng', phone: '+2348031110008' },
    { fullName: 'Adekunle Femi', email: 'f.adekunle@akokafederal.edu.ng', phone: '+2348031110009' },
    { fullName: 'Mohammed Aisha', email: 'a.mohammed@akokafederal.edu.ng', phone: '+2348031110010' },
    { fullName: 'Olatunji Dele', email: 'd.olatunji@akokafederal.edu.ng', phone: '+2348031110011' },
  ];
  const teachers = [];
  for (const t of teacherSeed) {
    const u = await prisma.user.create({
      data: {
        schoolId: school.id,
        email: t.email,
        passwordHash: 'demo-hash-teacher',
        role: 'TEACHER',
        fullName: t.fullName,
        phone: t.phone,
        isActive: true,
      },
    });
    teachers.push(u);
  }

  // 9. Teacher assignments
  console.log('Creating teacher assignments...');
  // Form teacher per arm (round-robin across the 11 teachers)
  for (let i = 0; i < arms.length; i++) {
    const teacher = teachers[i % teachers.length];
    await prisma.teacherAssignment.create({
      data: {
        userId: teacher.id,
        schoolId: school.id,
        assignmentType: 'FORM_TEACHER',
        classArmId: arms[i].id,
        subjectId: null,
      },
    });
  }

  // Subject teacher per assignment (one teacher per subject across all arms)
  const subjectTeacher = {}; // subjectId -> userId
  for (const s of SUBJECTS) {
    subjectTeacher[subjects[s.code].id] = teachers[randInt(0, teachers.length - 1)].id;
  }
  for (const a of assignments) {
    await prisma.teacherAssignment.create({
      data: {
        userId: subjectTeacher[a.subjectId],
        schoolId: school.id,
        assignmentType: 'SUBJECT_TEACHER',
        classArmId: a.classArmId,
        subjectId: a.subjectId,
      },
    });
  }

  // 10. Students (140) distributed across arms + class memberships
  console.log('Generating students...');
  // counts per arm: 6 JSS × 11 = 66, 9 SS × ~8 = 74 → 140 total
  const jssCounts = [12, 12, 11, 12, 12, 11]; // 70 across 6 JSS arms
  const ssCounts = [8, 7, 8, 7, 8, 7, 8, 7, 10]; // 70 across 9 SS arms
  let admissionSeq = 1;
  /** @type {{id:string, arm:any, firstName:string, surname:string, gender:string}[]} */
  const studentsByArm = {};
  let studentIdx = 0;
  for (let ai = 0; ai < arms.length; ai++) {
    const arm = arms[ai];
    const count = ai < 6 ? jssCounts[ai] : ssCounts[ai - 6];
    studentsByArm[arm.id] = [];
    for (let i = 0; i < count; i++) {
      const name = generateNigerianName(studentIdx++);
      const gender = chance(0.5) ? 'M' : 'F';
      const yearOffset = arm._track === 'JUNIOR' ? randInt(10, 13) : randInt(13, 17);
      const admissionYear = 2020 + ((arm._className === 'JSS 1' ? 0 :
        arm._className === 'JSS 2' ? 1 :
        arm._className === 'JSS 3' ? 2 :
        arm._className === 'SS 1' ? 3 :
        arm._className === 'SS 2' ? 4 : 5));
      const admissionNumber = `${admissionYear}/${pad(admissionSeq, 3)}`;
      admissionSeq++;
      const dob = new Date(2010 + (arm._track === 'JUNIOR' ? randInt(0, 3) : randInt(3, 6)),
        randInt(0, 11), randInt(1, 28));
      const guardianName = `${name.surname} ${pick(['Mathias', 'Joy', 'David', 'Grace', 'Samuel', 'Patience', 'Paul', 'Esther'])}`;
      const guardianPhone = `+23480${randInt(10000000, 99999999)}`;
      const student = await prisma.student.create({
        data: {
          schoolId: school.id,
          admissionNumber,
          surname: name.surname,
          firstName: name.firstName,
          otherNames: name.otherNames,
          gender,
          dateOfBirth: dob,
          bloodGroup: pick(bloodGroups),
          guardianName,
          guardianPhone,
          homeAddress: `${randInt(1, 80)} ${pick(['Akoka Road', 'Yaba Avenue', 'Herbert Macaulay Way', 'Iwaya Road', 'Bariga Street'])}, Lagos`,
          nationality: 'Nigerian',
          stateOfOrigin: name.state,
          religion: name.religion,
          admissionDate: new Date(admissionYear, 8, 9),
          isActive: true,
        },
      });
      await prisma.studentClassMembership.create({
        data: {
          studentId: student.id,
          classArmId: arm.id,
          termId: activeTerm.id,
          isCurrent: true,
        },
      });
      studentsByArm[arm.id].push({
        id: student.id,
        arm,
        surname: student.surname,
        firstName: student.firstName,
        gender,
      });
    }
  }
  const totalStudents = Object.values(studentsByArm).reduce((a, b) => a + b.length, 0);
  console.log(`  created ${totalStudents} students`);

  // 11. Assessment configurations + components (per arm×subject for active term)
  console.log('Creating assessment configurations...');
  const configs = {}; // key: `${armId}:${subjectId}` -> { id, components: [{id, name, type, max}] }
  const adminId = admin.id;
  for (const a of assignments) {
    const subject = a.subject;
    const compTemplate = buildComponents(subject.category);
    const config = await prisma.assessmentConfiguration.create({
      data: {
        classArmId: a.classArmId,
        subjectId: subject.id,
        termId: activeTerm.id,
        classSubjectAssignmentId: a.id,
        caMaximum: 40,
        examMaximum: 60,
        overallMaximum: 100,
        version: 1,
        createdByUserId: adminId,
      },
    });
    const components = [];
    for (let i = 0; i < compTemplate.length; i++) {
      const c = compTemplate[i];
      const comp = await prisma.assessmentComponent.create({
        data: {
          assessmentConfigurationId: config.id,
          componentName: c.name,
          componentType: c.type,
          maximumMark: c.max,
          sortOrder: i + 1,
        },
      });
      components.push({ id: comp.id, name: c.name, type: c.type, max: c.max });
    }
    configs[`${a.classArmId}:${subject.id}`] = { id: config.id, components, subjectId: subject.id };
  }

  // 12. Score submission batches + drafts + verified scores
  console.log('Creating score submission batches, drafts and verified scores...');
  /** @type {{id:string, armId:string, subjectId:string, status:string, sourceType:string, students:any[], config:{id:string, components:any[]}}[]} */
  const batches = [];
  let batchCounter = 0;
  const now = new Date();
  // Pre-compute batch status allocations (~85/8/4/3)
  function decideBatchStatus() {
    const r = rng();
    if (r < 0.85) return 'CONFIRMED';
    if (r < 0.93) return 'AWAITING_REVIEW';
    if (r < 0.97) return 'PROCESSING';
    return 'UPLOADED';
  }
  for (const a of assignments) {
    const config = configs[`${a.classArmId}:${a.subjectId}`];
    const subject = a.subject;
    const armStudents = studentsByArm[a.classArmId] || [];
    if (armStudents.length === 0) continue;
    const status = decideBatchStatus();
    const sourceType = chance(0.6) ? 'SPREADSHEET' : 'SCANNED_PAPER';
    batchCounter++;
    const batchRef = `BAT-2024-${pad(batchCounter, 4)}`;
    const uploadedBy = teachers[randInt(0, teachers.length - 1)].id;
    const uploadedAt = new Date(now.getTime() - randInt(1, 30) * 86400000);
    const totalRows = armStudents.length * config.components.length;
    const validRows = status === 'CONFIRMED' ? totalRows :
      Math.max(1, Math.floor(totalRows * (0.7 + rng() * 0.25)));
    const invalidRows = totalRows - validRows;
    const extractedAt = status === 'UPLOADED' ? null :
      new Date(uploadedAt.getTime() + randInt(1, 24) * 3600000);
    const confirmedAt = status === 'CONFIRMED' ?
      new Date(extractedAt.getTime() + randInt(1, 72) * 3600000) : null;
    const batch = await prisma.scoreSubmissionBatch.create({
      data: {
        batchRef,
        classArmId: a.classArmId,
        subjectId: subject.id,
        termId: activeTerm.id,
        assessmentConfigurationId: config.id,
        sourceType,
        sourceFileName: sourceType === 'SPREADSHEET'
          ? `${subject.subjectCode}_${a.arm.fullLabel.replace(/\s+/g, '_')}_scores.xlsx`
          : `${subject.subjectCode}_${a.arm.fullLabel.replace(/\s+/g, '_')}_scan.pdf`,
        sourceFilePath: `/uploads/${batchRef}.${sourceType === 'SPREADSHEET' ? 'xlsx' : 'pdf'}`,
        uploadedByUserId: uploadedBy,
        status,
        totalRows,
        validRows,
        invalidRows,
        extractedAt,
        confirmedAt,
        notes: status === 'CONFIRMED'
          ? 'All scores verified and confirmed.'
          : status === 'AWAITING_REVIEW'
          ? 'Awaiting teacher review of extracted scores.'
          : status === 'PROCESSING'
          ? 'Extraction in progress.'
          : 'Upload received, awaiting extraction.',
        createdAt: uploadedAt,
      },
    });

    // For non-confirmed batches, create score drafts (with some flagged invalid/uncertain/unmatched)
    if (status !== 'CONFIRMED') {
      const draftData = [];
      for (const s of armStudents) {
        for (const comp of config.components) {
          // ~10% flagged invalid/uncertain/unmatched
          const r = rng();
          let draftStatus = 'PENDING_REVIEW';
          let isUncertain = false;
          let validationIssues = null;
          let studentId = s.id;
          let admissionNumberRaw = `${s.surname} ${s.firstName}`.toLowerCase().replace(/\s/g, '/');
          let studentNameRaw = `${s.surname} ${s.firstName}`;
          let enteredValue = null;
          let extractionConfidence = null;
          if (r < 0.03) {
            // unmatched student
            draftStatus = 'FLAGGED_INVALID';
            studentId = null;
            studentNameRaw = `${pick(yorubaSurnames)} ${pick(yorubaFirstNames)}`;
            admissionNumberRaw = `2024/${pad(randInt(100, 999), 3)}`;
            validationIssues = 'Student name/admission number not found in class roster.';
            enteredValue = chance(0.5) ? randInt(0, comp.max) : null;
            extractionConfidence = sourceType === 'SCANNED_PAPER' ? Math.round(rng() * 50) / 100 : null;
          } else if (r < 0.08) {
            // invalid (above maximum)
            draftStatus = 'FLAGGED_INVALID';
            enteredValue = comp.max + randInt(1, 15);
            validationIssues = `Entered value ${enteredValue} exceeds component maximum ${comp.max}.`;
            extractionConfidence = sourceType === 'SCANNED_PAPER' ? Math.round((30 + rng() * 40)) / 100 : null;
          } else if (r < 0.15) {
            // uncertain (low confidence extraction)
            draftStatus = 'FLAGGED_UNCERTAIN';
            isUncertain = true;
            enteredValue = randInt(0, comp.max);
            extractionConfidence = sourceType === 'SCANNED_PAPER' ? Math.round((20 + rng() * 30)) / 100 : null;
            validationIssues = 'Low extraction confidence on handwritten value.';
          } else {
            enteredValue = randInt(0, comp.max);
            extractionConfidence = sourceType === 'SCANNED_PAPER' ? Math.round((70 + rng() * 30)) / 100 : null;
          }
          draftData.push({
            batchId: batch.id,
            studentId,
            studentNameRaw,
            admissionNumberRaw,
            assessmentComponentId: comp.id,
            enteredValue,
            isMissing: enteredValue === null,
            isUncertain,
            extractionConfidence,
            validationIssues,
            status: draftStatus,
          });
        }
      }
      // chunk createMany to avoid huge queries
      const CHUNK = 200;
      for (let i = 0; i < draftData.length; i += CHUNK) {
        await prisma.scoreDraft.createMany({ data: draftData.slice(i, i + CHUNK) });
      }
    } else {
      // CONFIRMED: create verified scores with realistic distribution
      const verifiedData = [];
      for (const s of armStudents) {
        // Per-student ability
        const ability = clamp(gaussian(0.55, 0.15), 0.2, 0.95);
        for (const comp of config.components) {
          const mean = ability * comp.max;
          const stddev = 0.08 * comp.max + 1.0;
          let value = gaussian(mean, stddev);
          value = clamp(Math.round(value * 100) / 100, 0, comp.max);
          verifiedData.push({
            studentId: s.id,
            assessmentComponentId: comp.id,
            assessmentConfigurationId: config.id,
            termId: activeTerm.id,
            scoreSubmissionBatchId: batch.id,
            value,
            status: 'VERIFIED',
            wasManuallyCorrected: chance(0.05),
            originalExtractedValue: chance(0.05) ? Math.max(0, value - randInt(1, 3)) : null,
            confirmedByUserId: adminId,
            confirmedAt: confirmedAt,
            createdAt: confirmedAt,
          });
        }
      }
      const CHUNK = 200;
      for (let i = 0; i < verifiedData.length; i += CHUNK) {
        await prisma.verifiedScore.createMany({ data: verifiedData.slice(i, i + CHUNK) });
      }
    }
    batches.push({
      id: batch.id,
      armId: a.classArmId,
      subjectId: subject.id,
      status,
      sourceType,
      students: armStudents,
      config,
      createdAt: uploadedAt,
      confirmedAt,
    });
  }
  const confirmedBatches = batches.filter((b) => b.status === 'CONFIRMED');
  const nonConfirmedBatches = batches.filter((b) => b.status !== 'CONFIRMED');
  console.log(`  created ${batches.length} batches (${confirmedBatches.length} confirmed, ${nonConfirmedBatches.length} non-confirmed)`);

  // 13. Compilation results from verified scores
  console.log('Compiling results...');
  /** @type {Map<string, {studentId:string, subjectId:string, armId:string, configId:string, compResults:Map<string, number>}>} */
  // For each confirmed batch, compute per-student compilation results
  const studentSubjectTotals = {}; // `${studentId}:${armId}` -> { total, count, subjects: [] }
  let compilationCount = 0;
  for (const b of confirmedBatches) {
    const armId = b.armId;
    // Fetch verified scores for this batch
    const verified = await prisma.verifiedScore.findMany({
      where: { scoreSubmissionBatchId: b.id },
      select: { studentId: true, assessmentComponentId: true, value: true },
    });
    // Group by student
    const byStudent = {};
    for (const v of verified) {
      if (!byStudent[v.studentId]) byStudent[v.studentId] = {};
      byStudent[v.studentId][v.assessmentComponentId] = v.value;
    }
    for (const s of b.students) {
      const studentComponents = byStudent[s.id] || {};
      let caTotal = 0;
      let examScore = 0;
      for (const comp of b.config.components) {
        const v = studentComponents[comp.id];
        if (v == null) continue;
        if (comp.type === 'EXAMINATION') examScore += v;
        else caTotal += v;
      }
      const overallTotal = Math.round((caTotal + examScore) * 100) / 100;
      const grade = gradeForPercent(overallTotal, boundaries);
      const isComplete = b.config.components.every((c) => studentComponents[c.id] != null);
      await prisma.compilationResult.create({
        data: {
          studentId: s.id,
          subjectId: b.subjectId,
          classArmId: armId,
          termId: activeTerm.id,
          assessmentConfigurationId: b.config.id,
          caTotal: Math.round(caTotal * 100) / 100,
          examScore: Math.round(examScore * 100) / 100,
          overallTotal,
          overallMaximum: 100,
          grade: grade.grade,
          gradeLabel: grade.label,
          remark: pick(GRADE_REMARKS.filter((r) => r.grade === grade.grade)).remark,
          subjectPositionInArm: null, // will set later
          isComplete,
          incompleteReason: isComplete ? null : 'One or more component scores missing.',
          recalculatedAt: b.confirmedAt || new Date(),
          createdAt: b.confirmedAt || new Date(),
        },
      });
      compilationCount++;
      const key = `${s.id}:${armId}`;
      if (!studentSubjectTotals[key]) {
        studentSubjectTotals[key] = {
          studentId: s.id,
          armId,
          total: 0,
          count: 0,
        };
      }
      studentSubjectTotals[key].total += overallTotal;
      studentSubjectTotals[key].count += 1;
    }
  }
  console.log(`  created ${compilationCount} compilation results`);

  // 14. Class positions within arm (based on aggregate total)
  console.log('Computing class positions...');
  let positionCount = 0;
  for (const arm of arms) {
    const armStudents = studentsByArm[arm.id] || [];
    if (armStudents.length === 0) continue;
    // Build entries
    const entries = armStudents.map((s) => {
      const key = `${s.id}:${arm.id}`;
      const t = studentSubjectTotals[key];
      const total = t ? t.total : 0;
      const count = t ? t.count : 0;
      const average = count > 0 ? total / count : 0;
      const isComplete = count > 0 && count === assignments.filter((a) => a.classArmId === arm.id).length;
      return { studentId: s.id, total, count, average, isComplete };
    });
    entries.sort((a, b) => b.total - a.total);
    const numStudents = entries.length;
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      await prisma.classPosition.create({
        data: {
          studentId: e.studentId,
          classArmId: arm.id,
          termId: activeTerm.id,
          totalAggregate: Math.round(e.total * 100) / 100,
          averageScore: Math.round(e.average * 100) / 100,
          subjectCount: e.count,
          position: i + 1,
          numStudentsInArm: numStudents,
          isComplete: e.isComplete,
          recalculatedAt: new Date(),
        },
      });
      positionCount++;
    }
  }
  console.log(`  created ${positionCount} class positions`);

  // 15. Report cards (one per student for active term)
  console.log('Creating report cards...');
  // Status distribution: 60% PUBLISHED, 15% APPROVED, 15% READY_FOR_REVIEW, 10% DRAFT
  const nextTermBegins = new Date('2025-02-03');
  let published = 0, approved = 0, ready = 0, draft = 0;
  for (const arm of arms) {
    const armStudents = studentsByArm[arm.id] || [];
    for (const s of armStudents) {
      const r = rng();
      let status;
      if (r < 0.6) status = 'PUBLISHED';
      else if (r < 0.75) status = 'APPROVED';
      else if (r < 0.9) status = 'READY_FOR_REVIEW';
      else status = 'DRAFT';

      const present = randInt(58, 78);
      const total = randInt(75, 80);
      const affective = {};
      for (const k of affectiveKeys) affective[k] = pick(traitRatings);
      const psychomotor = {};
      for (const k of psychomotorKeys) psychomotor[k] = pick(traitRatings);

      const approvedBy = (status === 'APPROVED' || status === 'PUBLISHED') ? principal.id : null;
      const approvedAt = (status === 'APPROVED' || status === 'PUBLISHED') ?
        new Date(now.getTime() - randInt(1, 10) * 86400000) : null;
      const publishedAt = status === 'PUBLISHED' ?
        new Date(now.getTime() - randInt(0, 5) * 86400000) : null;

      await prisma.reportCard.create({
        data: {
          studentId: s.id,
          classArmId: arm.id,
          termId: activeTerm.id,
          status,
          pdfFilePath: status === 'PUBLISHED' ? `/reports/${s.id}.pdf` : null,
          pdfGeneratedAt: status === 'PUBLISHED' ? publishedAt : null,
          approvedByUserId: approvedBy,
          approvedAt,
          publishedAt,
          attendancePresentDays: present,
          attendanceTotalDays: total,
          affectiveTraitsJson: JSON.stringify(affective),
          psychomotorTraitsJson: JSON.stringify(psychomotor),
          classTeacherComment: pick(classTeacherComments),
          principalComment: status === 'PUBLISHED' || status === 'APPROVED' ? pick(principalComments) : null,
          nextTermBegins,
          version: 1,
        },
      });
      if (status === 'PUBLISHED') published++;
      else if (status === 'APPROVED') approved++;
      else if (status === 'READY_FOR_REVIEW') ready++;
      else draft++;
    }
  }
  console.log(`  created ${published + approved + ready + draft} report cards (${published} published, ${approved} approved, ${ready} ready, ${draft} draft)`);

  // 16. Audit events (sample of key actions)
  console.log('Creating audit events...');
  // USER_CREATED for users
  for (const u of [admin, principal, ...teachers]) {
    await prisma.auditEvent.create({
      data: {
        schoolId: school.id,
        eventType: 'USER_CREATED',
        actorUserId: admin.id,
        description: `User account created: ${u.fullName} (${u.role}).`,
        metadataJson: JSON.stringify({ userId: u.id, role: u.role }),
        occurredAt: new Date(now.getTime() - randInt(40, 90) * 86400000),
      },
    });
  }
  // STUDENT_CREATED (sample)
  for (const arm of arms) {
    const armStudents = studentsByArm[arm.id] || [];
    for (const s of armStudents.slice(0, 3)) {
      await prisma.auditEvent.create({
        data: {
          schoolId: school.id,
          eventType: 'STUDENT_CREATED',
          actorUserId: admin.id,
          targetStudentId: s.id,
          targetClassArmId: arm.id,
          description: `Student record created: ${s.surname} ${s.firstName} in ${arm.fullLabel}.`,
          metadataJson: JSON.stringify({ classArmId: arm.id }),
          occurredAt: new Date(now.getTime() - randInt(35, 60) * 86400000),
        },
      });
    }
  }
  // BATCH_UPLOADED + BATCH_CONFIRMED (sample)
  for (let i = 0; i < batches.length; i += 3) {
    const b = batches[i];
    await prisma.auditEvent.create({
      data: {
        schoolId: school.id,
        eventType: 'BATCH_UPLOADED',
        batchId: b.id,
        targetClassArmId: b.armId,
        targetSubjectId: b.subjectId,
        description: `Score batch ${b.id.slice(-6)} uploaded (${b.sourceType}).`,
        metadataJson: JSON.stringify({ status: b.status, sourceType: b.sourceType }),
        occurredAt: b.createdAt,
      },
    });
    if (b.status === 'CONFIRMED') {
      await prisma.auditEvent.create({
        data: {
          schoolId: school.id,
          eventType: 'BATCH_CONFIRMED',
          actorUserId: admin.id,
          batchId: b.id,
          targetClassArmId: b.armId,
          targetSubjectId: b.subjectId,
          description: `Score batch ${b.id.slice(-6)} confirmed.`,
          metadataJson: JSON.stringify({ confirmedAt: b.confirmedAt }),
          occurredAt: b.confirmedAt || now,
        },
      });
    }
  }
  // RESULT_COMPILED (sample)
  for (let i = 0; i < confirmedBatches.length; i += 8) {
    const b = confirmedBatches[i];
    await prisma.auditEvent.create({
      data: {
        schoolId: school.id,
        eventType: 'RESULT_COMPILED',
        actorUserId: admin.id,
        batchId: b.id,
        targetClassArmId: b.armId,
        targetSubjectId: b.subjectId,
        description: `Results compiled for subject ${b.subjectId.slice(-6)} in arm ${b.armId.slice(-6)}.`,
        metadataJson: JSON.stringify({ termId: activeTerm.id }),
        occurredAt: b.confirmedAt || now,
      },
    });
  }
  // REPORT_CARD_GENERATED / APPROVED / PUBLISHED (sample)
  const reportCards = await prisma.reportCard.findMany({
    take: 60,
    orderBy: { createdAt: 'desc' },
    select: { id: true, studentId: true, status: true, approvedAt: true, publishedAt: true, createdAt: true },
  });
  for (const rc of reportCards) {
    if (rc.status === 'PUBLISHED' || rc.status === 'APPROVED' || rc.status === 'READY_FOR_REVIEW') {
      await prisma.auditEvent.create({
        data: {
          schoolId: school.id,
          eventType: 'REPORT_CARD_GENERATED',
          actorUserId: admin.id,
          targetStudentId: rc.studentId,
          description: `Report card ${rc.id.slice(-6)} generated.`,
          metadataJson: JSON.stringify({ status: rc.status }),
          occurredAt: rc.createdAt,
        },
      });
    }
    if (rc.status === 'APPROVED' || rc.status === 'PUBLISHED') {
      await prisma.auditEvent.create({
        data: {
          schoolId: school.id,
          eventType: 'REPORT_CARD_APPROVED',
          actorUserId: principal.id,
          targetStudentId: rc.studentId,
          description: `Report card ${rc.id.slice(-6)} approved by principal.`,
          metadataJson: JSON.stringify({ reportCardId: rc.id }),
          occurredAt: rc.approvedAt || rc.createdAt,
        },
      });
    }
    if (rc.status === 'PUBLISHED') {
      await prisma.auditEvent.create({
        data: {
          schoolId: school.id,
          eventType: 'REPORT_CARD_PUBLISHED',
          actorUserId: principal.id,
          targetStudentId: rc.studentId,
          description: `Report card ${rc.id.slice(-6)} published.`,
          metadataJson: JSON.stringify({ reportCardId: rc.id }),
          occurredAt: rc.publishedAt || rc.createdAt,
        },
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n=== SEED SUMMARY ===');
  const counts = {
    schools: await prisma.school.count(),
    subjectTracks: await prisma.subjectTrack.count(),
    academicSessions: await prisma.academicSession.count(),
    terms: await prisma.term.count(),
    classes: await prisma.class.count(),
    classArms: await prisma.classArm.count(),
    subjects: await prisma.subject.count(),
    classSubjectAssignments: await prisma.classSubjectAssignment.count(),
    gradingBoundaries: await prisma.gradingBoundary.count(),
    gradeRemarks: await prisma.gradeRemark.count(),
    users: await prisma.user.count(),
    teacherAssignments: await prisma.teacherAssignment.count(),
    students: await prisma.student.count(),
    studentClassMemberships: await prisma.studentClassMembership.count(),
    assessmentConfigurations: await prisma.assessmentConfiguration.count(),
    assessmentComponents: await prisma.assessmentComponent.count(),
    scoreSubmissionBatches: await prisma.scoreSubmissionBatch.count(),
    scoreDrafts: await prisma.scoreDraft.count(),
    verifiedScores: await prisma.verifiedScore.count(),
    compilationResults: await prisma.compilationResult.count(),
    classPositions: await prisma.classPosition.count(),
    reportCards: await prisma.reportCard.count(),
    auditEvents: await prisma.auditEvent.count(),
  };
  for (const [k, v] of Object.entries(counts)) {
    console.log(`  ${k.padEnd(28)} ${v}`);
  }
  // Batch status breakdown
  const statuses = await prisma.scoreSubmissionBatch.groupBy({ by: ['status'], _count: true });
  console.log('\n  Batch status breakdown:');
  for (const s of statuses) console.log(`    ${s.status.padEnd(18)} ${s._count}`);
  // Report card status breakdown
  const rcStatuses = await prisma.reportCard.groupBy({ by: ['status'], _count: true });
  console.log('\n  Report card status breakdown:');
  for (const s of rcStatuses) console.log(`    ${s.status.padEnd(20)} ${s._count}`);
  console.log('\nSeed complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
