import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useScreen, type ScreenId } from "@/lib/store";
import { apiFetch } from "@/lib/api";

// Icons as text (avoiding extra dependencies)
const NAV_ITEMS: { id: ScreenId; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "school-config", label: "School Config", icon: "🏫" },
  { id: "subjects-classes", label: "Subjects", icon: "📚" },
  { id: "students", label: "Students", icon: "🎓" },
  { id: "assessments", label: "Assessments", icon: "📋" },
  { id: "users-permissions", label: "Users", icon: "👥" },
  { id: "upload", label: "Upload", icon: "📤" },
  { id: "review", label: "Review", icon: "✅" },
  { id: "report-cards", label: "Report Cards", icon: "📄" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export default function App() {
  const { screen, setScreen } = useScreen();

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 flex-row bg-background">
        {/* Sidebar (web/desktop) */}
        <View className="hidden md:flex w-64 border-r border-border bg-card">
          <View className="p-4 border-b border-border">
            <Text className="text-base font-bold text-foreground">Akoka Federal Academy</Text>
            <Text className="text-xs text-muted-foreground mt-1">Result Compiler</Text>
          </View>
          <ScrollView className="flex-1">
            {NAV_ITEMS.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => setScreen(item.id)}
                className={`px-4 py-3 flex-row items-center gap-3 ${screen === item.id ? "bg-primary/10" : ""}`}
              >
                <Text className="text-lg">{item.icon}</Text>
                <Text className={`text-sm ${screen === item.id ? "text-primary font-semibold" : "text-foreground"}`}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <View className="p-3 border-t border-border">
            <Text className="text-[10px] text-muted-foreground">Demo dataset · 140 students</Text>
          </View>
        </View>

        {/* Main content */}
        <View className="flex-1">
          {/* Mobile top bar */}
          <View className="md:hidden flex-row items-center justify-between p-3 border-b border-border bg-card">
            <Text className="text-sm font-bold text-foreground">Akoka Federal Academy</Text>
            <Text className="text-lg">📊</Text>
          </View>

          {/* Screen content */}
          <ScrollView className="flex-1">
            {screen === "dashboard" && <DashboardScreen />}
            {screen === "school-config" && <SchoolConfigScreen />}
            {screen === "subjects-classes" && <SubjectsScreen />}
            {screen === "students" && <StudentsScreen />}
            {screen === "assessments" && <AssessmentsScreen />}
            {screen === "users-permissions" && <UsersScreen />}
            {screen === "upload" && <UploadScreen />}
            {screen === "review" && <ReviewScreen />}
            {screen === "report-cards" && <ReportCardsScreen />}
            {screen === "settings" && <SettingsScreen />}
          </ScrollView>

          {/* Mobile bottom navigation */}
          <View className="md:hidden flex-row border-t border-border bg-card">
            {NAV_ITEMS.slice(0, 5).map((item) => (
              <Pressable
                key={item.id}
                onPress={() => setScreen(item.id)}
                className="flex-1 items-center py-2"
              >
                <Text className="text-base">{item.icon}</Text>
                <Text className={`text-[9px] ${screen === item.id ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                  {item.label.split(" ")[0]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ============================================================
// Dashboard Screen
// ============================================================
function DashboardScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setScreen } = useScreen();

  useEffect(() => {
    apiFetch("/api/dashboard").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <View className="p-6 items-center justify-center"><ActivityIndicator size="large" color="#2d6a4f" /></View>;
  }

  if (!data) {
    return <View className="p-6"><Text className="text-foreground">Failed to load dashboard data.</Text></View>;
  }

  const c = data.counts || {};
  const school = data.school || {};

  return (
    <View className="p-6">
      <Text className="text-2xl font-bold text-foreground">Dashboard</Text>
      <Text className="text-sm text-muted-foreground mt-1 mb-6">
        {school.name} · {data.activeTerm?.termName} {data.activeSession?.sessionName}
      </Text>

      {/* KPI cards */}
      <View className="flex-row flex-wrap gap-3 mb-6">
        <StatCard label="Students" value={c.students || 0} hint={`${c.arms || 0} class arms`} onPress={() => setScreen("students")} />
        <StatCard label="Teachers" value={c.teachers || 0} hint="Active staff" onPress={() => setScreen("users-permissions")} />
        <StatCard label="Batches" value={c.batches || 0} hint={`${c.pendingReviewBatches || 0} need review`} onPress={() => setScreen("upload")} />
        <StatCard label="Report Cards" value={(c.publishedCards || 0) + (c.approvedCards || 0) + (c.readyCards || 0) + (c.draftCards || 0)} hint={`${c.publishedCards || 0} published`} onPress={() => setScreen("report-cards")} />
      </View>

      {/* Workflow */}
      <View className="bg-card rounded-lg p-4 border border-border mb-4">
        <Text className="text-sm font-semibold text-foreground mb-3">Report Card Workflow</Text>
        <View className="flex-row flex-wrap gap-3">
          <WorkflowStep label="Draft" count={c.draftCards || 0} onPress={() => setScreen("report-cards")} />
          <WorkflowStep label="Ready" count={c.readyCards || 0} onPress={() => setScreen("report-cards")} />
          <WorkflowStep label="Approved" count={c.approvedCards || 0} onPress={() => setScreen("report-cards")} />
          <WorkflowStep label="Published" count={c.publishedCards || 0} onPress={() => setScreen("report-cards")} />
        </View>
      </View>

      {/* Recent batches */}
      <View className="bg-card rounded-lg border border-border mb-4">
        <Text className="text-sm font-semibold text-foreground p-4 border-b border-border">Recent Uploads</Text>
        {(data.recentBatches || []).slice(0, 5).map((batch: any) => (
          <Pressable key={batch.id} className="p-3 border-b border-border/50" onPress={() => setScreen("review")}>
            <Text className="text-sm text-foreground">{batch.classArm?.fullLabel} · {batch.subject?.subjectName}</Text>
            <Text className="text-xs text-muted-foreground mt-1">{batch.batchRef} · {batch.uploadedBy?.fullName}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function StatCard({ label, value, hint, onPress }: { label: string; value: number; hint: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} className="bg-card rounded-lg p-4 border border-border flex-1 min-w-[140px]">
      <Text className="text-xs text-muted-foreground uppercase">{label}</Text>
      <Text className="text-2xl font-bold text-foreground mt-1">{value}</Text>
      <Text className="text-xs text-muted-foreground mt-1">{hint}</Text>
    </Pressable>
  );
}

function WorkflowStep({ label, count, onPress }: { label: string; count: number; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} className="bg-secondary rounded-lg p-3 border border-border flex-1 min-w-[80px]">
      <Text className="text-xl font-bold text-foreground">{count}</Text>
      <Text className="text-xs text-muted-foreground">{label}</Text>
    </Pressable>
  );
}

// ============================================================
// School Configuration Screen
// ============================================================
function SchoolConfigScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiFetch("/api/school-config").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  if (loading) return <Loading />;
  if (!data) return <Error msg="Failed to load school config" />;
  const s = data.school || {};
  return (
    <View className="p-6">
      <Text className="text-2xl font-bold text-foreground">School Configuration</Text>
      <View className="bg-card rounded-lg p-4 border border-border mt-4">
        <Text className="text-lg font-bold text-foreground">{s.name}</Text>
        <Text className="text-sm text-muted-foreground italic mt-1">"{s.motto}"</Text>
        <Text className="text-sm text-foreground mt-3">{s.addressLine}</Text>
        <Text className="text-sm text-foreground">{s.state}, {s.country}</Text>
        <Text className="text-sm text-muted-foreground mt-2">Established: {s.establishedYear}</Text>
      </View>
      <Text className="text-base font-semibold text-foreground mt-6 mb-3">Academic Sessions</Text>
      {(data.sessions || []).map((session: any) => (
        <View key={session.id} className="bg-card rounded-lg p-4 border border-border mb-3">
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-semibold text-foreground">{session.sessionName}</Text>
            {session.isActive && <Text className="text-xs text-primary font-semibold">● Active</Text>}
          </View>
          <View className="flex-row flex-wrap gap-2 mt-2">
            {(session.terms || []).map((term: any) => (
              <View key={term.id} className="bg-secondary rounded p-2 flex-1 min-w-[100px]">
                <Text className="text-xs font-medium text-foreground">{term.termName}</Text>
                {term.isActive && <Text className="text-[10px] text-primary">● Active</Text>}
                <Text className="text-[10px] text-muted-foreground mt-1">
                  {term.startDate ? new Date(term.startDate).toLocaleDateString('en-GB', {day:'numeric',month:'short'}) : '—'} → {term.endDate ? new Date(term.endDate).toLocaleDateString('en-GB', {day:'numeric',month:'short'}) : '—'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
      <Text className="text-base font-semibold text-foreground mt-6 mb-3">Grading Scale (WAEC 9-point)</Text>
      <View className="bg-card rounded-lg border border-border overflow-hidden">
        {(data.gradingBoundaries || []).map((b: any) => {
          const remark = (data.gradeRemarks || []).find((r: any) => r.grade === b.grade)?.remark || '—';
          return (
            <View key={b.id} className="flex-row p-3 border-b border-border/50">
              <Text className="text-sm font-bold text-foreground w-12">{b.grade}</Text>
              <Text className="text-sm text-foreground flex-1">{b.label}{b.isCredit ? ' ★' : ''}</Text>
              <Text className="text-sm text-muted-foreground w-20 text-right">{b.minPercent}-{b.maxPercent}%</Text>
              <Text className="text-xs text-muted-foreground flex-1 ml-2">{remark}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ============================================================
// Subjects & Classes Screen
// ============================================================
function SubjectsScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    apiFetch("/api/subjects-classes").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  if (loading) return <Loading />;
  if (!data) return <Error msg="Failed to load subjects" />;
  const subjects = (data.subjects || []).filter((s: any) =>
    !search || s.subjectName.toLowerCase().includes(search.toLowerCase()) || s.subjectCode.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <View className="p-6">
      <Text className="text-2xl font-bold text-foreground">Subjects & Classes</Text>
      <Text className="text-sm text-muted-foreground mt-1 mb-4">{data.subjects?.length || 0} subjects · {data.classes?.length || 0} classes · {data.classes?.reduce((s:number,c:any)=>s+(c.classArms?.length||0),0) || 0} arms</Text>
      <TextInput placeholder="Search subjects…" value={search} onChangeText={setSearch} className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground mb-4" />
      <View className="bg-card rounded-lg border border-border overflow-hidden">
        {subjects.map((s: any) => (
          <View key={s.id} className="flex-row items-center p-3 border-b border-border/50">
            <Text className="text-xs font-mono text-muted-foreground w-12">{s.subjectCode}</Text>
            <Text className="text-sm text-foreground flex-1">{s.subjectName}</Text>
            <Text className="text-xs text-muted-foreground w-20">{s.category}</Text>
            <Text className="text-xs text-muted-foreground w-16">{s.isCore ? 'Core' : ''}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ============================================================
// Students Screen
// ============================================================
function StudentsScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    apiFetch("/api/students?limit=200").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  if (loading) return <Loading />;
  if (!data) return <Error msg="Failed to load students" />;
  const students = (data.students || []).filter((s: any) =>
    !search || `${s.surname} ${s.firstName}`.toLowerCase().includes(search.toLowerCase()) || s.admissionNumber.includes(search)
  );
  return (
    <View className="p-6">
      <Text className="text-2xl font-bold text-foreground">Students</Text>
      <Text className="text-sm text-muted-foreground mt-1 mb-4">{students.length} of {data.students?.length || 0} students</Text>
      <TextInput placeholder="Search by name or admission number…" value={search} onChangeText={setSearch} className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground mb-4" />
      <View className="bg-card rounded-lg border border-border overflow-hidden">
        {students.slice(0, 50).map((s: any) => {
          const arm = s.classMemberships?.[0]?.classArm;
          return (
            <Pressable key={s.id} className="flex-row items-center p-3 border-b border-border/50">
              <View className="w-10 h-10 rounded-full bg-secondary items-center justify-center mr-3">
                <Text className="text-xs text-muted-foreground">{(s.surname[0]||'')}{(s.firstName[0]||'')}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-foreground">{s.surname}, {s.firstName}</Text>
                <Text className="text-xs text-muted-foreground font-mono">{s.admissionNumber}</Text>
              </View>
              <Text className="text-xs text-muted-foreground">{arm?.fullLabel || '—'}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ============================================================
// Assessments Screen
// ============================================================
function AssessmentsScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiFetch("/api/assessments?limit=50").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  if (loading) return <Loading />;
  if (!data) return <Error msg="Failed to load assessments" />;
  return (
    <View className="p-6">
      <Text className="text-2xl font-bold text-foreground">Assessment Configuration</Text>
      <Text className="text-sm text-muted-foreground mt-1 mb-4">{data.configs?.length || 0} configurations · CA 40 + Exam 60 = 100</Text>
      <View className="flex-row flex-wrap gap-3">
        {(data.configs || []).slice(0, 20).map((cfg: any) => {
          const caTotal = (cfg.components || []).filter((c:any) => c.componentType === 'CONTINUOUS_ASSESSMENT').reduce((s:number,c:any)=>s+c.maximumMark,0);
          return (
            <View key={cfg.id} className="bg-card rounded-lg p-4 border border-border flex-1 min-w-[280px]">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-xs font-mono text-muted-foreground">{cfg.subject?.subjectCode}</Text>
                <Text className="text-xs text-muted-foreground">{cfg.classArm?.fullLabel}</Text>
              </View>
              <Text className="text-sm font-semibold text-foreground">{cfg.subject?.subjectName}</Text>
              <View className="mt-2">
                {(cfg.components || []).map((c: any) => (
                  <View key={c.id} className="flex-row justify-between">
                    <Text className="text-xs text-foreground">{c.componentName}</Text>
                    <Text className="text-xs font-mono text-muted-foreground">{c.maximumMark}</Text>
                  </View>
                ))}
              </View>
              <View className="flex-row gap-3 mt-2 pt-2 border-t border-border">
                <Text className="text-xs text-muted-foreground">CA: {caTotal}/40</Text>
                <Text className="text-xs text-muted-foreground">Exam: 60</Text>
                <Text className="text-xs text-primary font-semibold">Total: 100</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ============================================================
// Users Screen
// ============================================================
function UsersScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiFetch("/api/users").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  if (loading) return <Loading />;
  if (!data) return <Error msg="Failed to load users" />;
  return (
    <View className="p-6">
      <Text className="text-2xl font-bold text-foreground">Users & Permissions</Text>
      <Text className="text-sm text-muted-foreground mt-1 mb-4">{data.users?.length || 0} staff accounts</Text>
      <View className="flex-row flex-wrap gap-3">
        {(data.users || []).map((u: any) => {
          const formTeacher = (u.teacherAssignments || []).find((a:any) => a.assignmentType === 'FORM_TEACHER');
          const subjectCount = (u.teacherAssignments || []).filter((a:any) => a.assignmentType === 'SUBJECT_TEACHING').length;
          return (
            <View key={u.id} className="bg-card rounded-lg p-4 border border-border flex-1 min-w-[280px]">
              <View className="flex-row items-center gap-3 mb-2">
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                  <Text className="text-xs text-primary font-semibold">{u.fullName?.split(' ').map((n:string)=>n[0]).slice(0,2).join('')}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">{u.fullName}</Text>
                  <Text className="text-xs text-muted-foreground">{u.email}</Text>
                </View>
                <View className="bg-primary/10 px-2 py-1 rounded">
                  <Text className="text-xs text-primary font-semibold">{u.role}</Text>
                </View>
              </View>
              {formTeacher && (
                <Text className="text-xs text-muted-foreground mt-1">Form teacher: {formTeacher.classArm?.fullLabel}</Text>
              )}
              <Text className="text-xs text-muted-foreground mt-1">Teaches {subjectCount} subject{subjectCount === 1 ? '' : 's'}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ============================================================
// Upload Screen
// ============================================================
function UploadScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiFetch("/api/score-batches?limit=50").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  if (loading) return <Loading />;
  if (!data) return <Error msg="Failed to load batches" />;
  return (
    <View className="p-6">
      <Text className="text-2xl font-bold text-foreground">Upload Results</Text>
      <Text className="text-sm text-muted-foreground mt-1 mb-4">{data.batches?.length || 0} score submission batches</Text>
      <View className="bg-card rounded-lg border border-border overflow-hidden">
        {(data.batches || []).slice(0, 30).map((b: any) => (
          <Pressable key={b.id} className="p-3 border-b border-border/50">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-medium text-foreground">{b.classArm?.fullLabel} · {b.subject?.subjectName}</Text>
                <Text className="text-xs text-muted-foreground mt-1">{b.batchRef} · {b.uploadedBy?.fullName}</Text>
              </View>
              <View className="items-end">
                <View className={`px-2 py-1 rounded ${b.status === 'CONFIRMED' ? 'bg-emerald-100' : b.status === 'AWAITING_REVIEW' ? 'bg-blue-100' : 'bg-amber-100'}`}>
                  <Text className="text-xs font-semibold">{b.status?.replace(/_/g,' ')}</Text>
                </View>
                <Text className="text-xs text-muted-foreground mt-1">{b._count?.verifiedScores || b._count?.scoreDrafts || 0} rows</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ============================================================
// Review Screen
// ============================================================
function ReviewScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiFetch("/api/drafts").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  if (loading) return <Loading />;
  if (!data) return <Error msg="Failed to load drafts" />;
  return (
    <View className="p-6">
      <Text className="text-2xl font-bold text-foreground">Review & Compile</Text>
      <Text className="text-sm text-muted-foreground mt-1 mb-4">{data.drafts?.length || 0} drafts flagged for review</Text>
      <View className="bg-card rounded-lg border border-border overflow-hidden">
        {(data.drafts || []).slice(0, 30).map((d: any) => (
          <View key={d.id} className="p-3 border-b border-border/50">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-medium text-foreground">{d.studentNameRaw}</Text>
                <Text className="text-xs text-muted-foreground mt-1">{d.batch?.batchRef} · {d.batch?.classArm?.fullLabel} · {d.batch?.subject?.subjectName}</Text>
                <Text className="text-xs text-muted-foreground">{d.assessmentComponent?.componentName}</Text>
              </View>
              <View className="items-end">
                <Text className="text-sm font-mono text-foreground">{d.enteredValue}/{d.assessmentComponent?.maximumMark}</Text>
                <View className={`px-2 py-0.5 rounded mt-1 ${d.status === 'FLAGGED_INVALID' ? 'bg-red-100' : d.status === 'FLAGGED_UNCERTAIN' ? 'bg-amber-100' : 'bg-gray-100'}`}>
                  <Text className="text-[10px] font-semibold">{d.status?.replace(/_/g,' ')}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ============================================================
// Report Cards Screen
// ============================================================
function ReportCardsScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiFetch("/api/report-cards?limit=50").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  if (loading) return <Loading />;
  if (!data) return <Error msg="Failed to load report cards" />;
  return (
    <View className="p-6">
      <Text className="text-2xl font-bold text-foreground">Report Cards</Text>
      <Text className="text-sm text-muted-foreground mt-1 mb-4">{data.cards?.length || 0} report cards</Text>
      <View className="flex-row flex-wrap gap-3">
        {(data.cards || []).slice(0, 24).map((c: any) => {
          const pos = c.classPositions?.[0];
          const arm = c.student?.classMemberships?.[0]?.classArm;
          return (
            <View key={c.id} className="bg-card rounded-lg p-4 border border-border flex-1 min-w-[240px]">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">{c.student?.surname}, {c.student?.firstName}</Text>
                  <Text className="text-xs text-muted-foreground font-mono">{c.student?.admissionNumber}</Text>
                  <Text className="text-xs text-muted-foreground">{arm?.fullLabel || '—'}</Text>
                </View>
                <View className={`px-2 py-1 rounded ${c.status === 'PUBLISHED' ? 'bg-emerald-100' : c.status === 'APPROVED' ? 'bg-amber-100' : c.status === 'READY_FOR_REVIEW' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Text className="text-xs font-semibold">{c.status?.replace(/_/g,' ')}</Text>
                </View>
              </View>
              <View className="flex-row gap-3 mt-2 pt-2 border-t border-border">
                <Text className="text-xs text-muted-foreground">Position: {pos ? `${pos.position}/${pos.numStudentsInArm}` : '—'}</Text>
                <Text className="text-xs text-muted-foreground">Avg: {pos ? pos.averageScore?.toFixed(1) : '—'}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ============================================================
// Settings Screen
// ============================================================
function SettingsScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiFetch("/api/audit?limit=30").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  if (loading) return <Loading />;
  if (!data) return <Error msg="Failed to load settings" />;
  return (
    <View className="p-6">
      <Text className="text-2xl font-bold text-foreground">Settings</Text>
      <Text className="text-sm text-muted-foreground mt-1 mb-4">System preferences and audit log</Text>
      <View className="bg-card rounded-lg p-4 border border-border mb-4">
        <Text className="text-sm font-semibold text-foreground mb-3">General Settings</Text>
        <View className="flex-row justify-between py-2 border-b border-border/50">
          <Text className="text-sm text-muted-foreground">School name</Text>
          <Text className="text-sm text-foreground">Akoka Federal Academy</Text>
        </View>
        <View className="flex-row justify-between py-2 border-b border-border/50">
          <Text className="text-sm text-muted-foreground">Default grading</Text>
          <Text className="text-sm text-foreground">WAEC 9-point</Text>
        </View>
        <View className="flex-row justify-between py-2 border-b border-border/50">
          <Text className="text-sm text-muted-foreground">Language</Text>
          <Text className="text-sm text-foreground">English (Nigeria)</Text>
        </View>
        <View className="flex-row justify-between py-2">
          <Text className="text-sm text-muted-foreground">Timezone</Text>
          <Text className="text-sm text-foreground">Africa/Lagos</Text>
        </View>
      </View>
      <Text className="text-base font-semibold text-foreground mb-3">Audit Log (Last 30 Events)</Text>
      <View className="bg-card rounded-lg border border-border overflow-hidden">
        {(data.events || []).slice(0, 20).map((e: any) => (
          <View key={e.id} className="p-3 border-b border-border/50">
            <Text className="text-sm text-foreground">{e.description}</Text>
            <Text className="text-xs text-muted-foreground mt-1">{e.actor?.fullName || 'System'} · {new Date(e.occurredAt).toLocaleString('en-GB', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ============================================================
// Shared components
// ============================================================
function Loading() {
  return <View className="p-6 items-center"><ActivityIndicator size="large" color="#2d6a4f" /><Text className="text-sm text-muted-foreground mt-3">Loading…</Text></View>;
}
function Error({ msg }: { msg: string }) {
  return <View className="p-6"><Text className="text-sm text-destructive">{msg}</Text></View>;
}
