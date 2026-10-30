import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Platform } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { apiFetch } from "@/lib/api";
import {
  C, Card, Badge, Btn, StatCard, WorkflowStep, Arrow, AlertBox, ActivityItem,
  SearchBar, Loading, EmptyState, PageHeader, SectionHeader, Field, toast, ToastHost,
  DetailPanel, ModalDlg, Th, Td,
} from "@/components/ui";

// === NAV ===
type ScreenId = "dashboard" | "school-config" | "subjects-classes" | "students" | "assessments" | "users-permissions" | "upload" | "review" | "report-cards" | "settings";
let _screen: ScreenId = "dashboard";
function useScreen() {
  const [s, setS] = useState<ScreenId>(_screen);
  const set = useCallback((n: ScreenId) => { _screen = n; setS(n); }, []);
  return { screen: s, setScreen: set };
}

const NAV_GROUPS = [
  { label: "OVERVIEW", items: [{ id: "dashboard" as ScreenId, label: "Dashboard", icon: "📊" }] },
  { label: "SETUP", items: [
    { id: "school-config" as ScreenId, label: "School Configuration", icon: "🏫" },
    { id: "subjects-classes" as ScreenId, label: "Subjects & Classes", icon: "📚" },
    { id: "students" as ScreenId, label: "Students", icon: "🎓" },
    { id: "assessments" as ScreenId, label: "Assessment Config", icon: "📋" },
    { id: "users-permissions" as ScreenId, label: "Users & Permissions", icon: "👥" },
  ]},
  { label: "WORKFLOW", items: [
    { id: "upload" as ScreenId, label: "Upload Results", icon: "📤" },
    { id: "review" as ScreenId, label: "Review & Compile", icon: "✅" },
    { id: "report-cards" as ScreenId, label: "Report Cards", icon: "📄" },
  ]},
  { label: "SYSTEM", items: [{ id: "settings" as ScreenId, label: "Settings", icon: "⚙️" }] },
];

export default function App() {
  const { screen, setScreen } = useScreen();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, flexDirection: "row", backgroundColor: C.bg }}>
        {/* SIDEBAR */}
        <View style={{ width: 240, backgroundColor: C.sidebar }}>
          {/* Logo */}
          <View style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: C.sidebarActive, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}>A</Text>
            </View>
            <View>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#fff" }}>Akoka Federal</Text>
              <Text style={{ fontSize: 10, color: C.sidebarFg }}>Result Compilation</Text>
            </View>
          </View>
          {/* Nav */}
          <ScrollView style={{ flex: 1, marginTop: 4 }}>
            {NAV_GROUPS.map(group => (
              <View key={group.label} style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 9, fontWeight: "700", color: C.sidebarSection, paddingHorizontal: 16, paddingVertical: 4, letterSpacing: 1 }}>{group.label}</Text>
                {group.items.map(item => (
                  <Pressable key={item.id} onPress={() => setScreen(item.id)} style={{ paddingHorizontal: 16, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: screen === item.id ? "rgba(255,255,255,0.08)" : "transparent", borderLeftWidth: 3, borderLeftColor: screen === item.id ? C.sidebarActive : "transparent" }}>
                    <Text style={{ fontSize: 14 }}>{item.icon}</Text>
                    <Text style={{ fontSize: 12, fontWeight: screen === item.id ? "600" : "400", color: screen === item.id ? "#fff" : C.sidebarFg }}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </ScrollView>
          {/* Footer */}
          <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)" }}>
            <Text style={{ fontSize: 10, color: C.sidebarFg, textAlign: "center" }}>Excellence · Discipline · Success</Text>
          </View>
        </View>

        {/* MAIN */}
        <View style={{ flex: 1 }}>
          {/* HEADER */}
          <View style={{ height: 52, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: C.fg, minWidth: 100 }}>{NAV_GROUPS.flatMap(g => g.items).find(n => n.id === screen)?.label || "Dashboard"}</Text>
            {/* Search */}
            <View style={{ flex: 1, maxWidth: 400, position: "relative" }}>
              <Text style={{ position: "absolute", left: 8, top: 8, fontSize: 13, color: C.mutedFg }}>🔍</Text>
              <TextInput placeholder="Search students, subjects, classes, or batches…" style={{ backgroundColor: C.muted, borderRadius: 8, paddingLeft: 28, paddingRight: 10, paddingVertical: 7, fontSize: 12, color: C.fg, borderWidth: 1, borderColor: C.border }} />
            </View>
            {/* Right icons */}
            <Pressable style={{ position: "relative", padding: 4 }}>
              <Text style={{ fontSize: 16 }}>🔔</Text>
              <View style={{ position: "absolute", top: 0, right: -2, backgroundColor: C.red, borderRadius: 7, minWidth: 14, height: 14, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 8, color: "#fff", fontWeight: "700" }}>3</Text></View>
            </Pressable>
            <Text style={{ fontSize: 16 }}>🌙</Text>
            <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 10, fontWeight: "700", color: "#fff" }}>Ab</Text></View>
              <View><Text style={{ fontSize: 11, fontWeight: "600", color: C.fg }}>Administrator</Text><Text style={{ fontSize: 9, color: C.mutedFg }}>School Admin</Text></View>
              <Text style={{ fontSize: 10, color: C.mutedFg }}>▼</Text>
            </Pressable>
          </View>

          {/* SCREENS */}
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {screen === "dashboard" && <DashboardScreen />}
            {screen === "students" && <StudentsScreen />}
            {screen === "upload" && <UploadScreen />}
            {screen === "review" && <ReviewScreen />}
            {screen === "report-cards" && <ReportCardsScreen />}
            {screen === "subjects-classes" && <SubjectsScreen />}
            {screen === "assessments" && <AssessmentsScreen />}
            {screen === "users-permissions" && <UsersScreen />}
            {screen === "school-config" && <SchoolConfigScreen />}
            {screen === "settings" && <SettingsScreen />}
          </ScrollView>
        </View>
        <ToastHost />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// === DASHBOARD ===
function DashboardScreen() {
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setScreen } = useScreen();
  useEffect(() => { apiFetch("/api/dashboard").then(r => { setD(r); setLoading(false); }).catch(() => setLoading(false)); }, []);
  if (loading) return <View style={{ padding: 24 }}><Loading /></View>;
  if (!d) return <View style={{ padding: 24 }}><EmptyState icon="⚠" title="Failed to load" desc="Could not fetch data" /></View>;
  const c = d.counts || {};
  const published = c.reportCardsByStatus?.PUBLISHED || 0;
  const approved = c.reportCardsByStatus?.APPROVED || 0;
  const ready = c.reportCardsByStatus?.READY_FOR_REVIEW || 0;
  const draft = c.reportCardsByStatus?.DRAFT || 0;
  return (
    <View style={{ padding: 20 }}>
      {/* Hero */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "700", color: C.fg }}>Good morning, Administrator</Text>
          <Text style={{ fontSize: 12, color: C.mutedFg, marginTop: 2 }}>Here's your school's result compilation overview.</Text>
        </View>
        <View style={{ backgroundColor: C.muted, borderRadius: 8, padding: 10, flexDirection: "row", gap: 6, alignItems: "center" }}>
          <Text style={{ fontSize: 12 }}>📅</Text>
          <View><Text style={{ fontSize: 11, fontWeight: "600", color: C.fg }}>{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</Text><Text style={{ fontSize: 10, color: C.mutedFg }}>Session: 2024/2025 | Term: First Term</Text></View>
        </View>
      </View>
      {/* Stat cards */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Students" value={c.students||0} trend="↑ 2 new this term" trendColor={C.success} icon="👥" iconBg={C.primaryBg} onPress={() => setScreen("students")} />
        <StatCard label="Teachers" value={c.teachers||0} trend="— No change" icon="👤" iconBg={C.blueBg} onPress={() => setScreen("users-permissions")} />
        <StatCard label="Result Batches" value={c.batches||0} trend="↑ 18 new this term" trendColor={C.success} icon="📋" iconBg={C.purpleBg} onPress={() => setScreen("upload")} />
        <StatCard label="Published Cards" value={published} trend="↑ 12% from last term" trendColor={C.success} icon="📄" iconBg={C.successBg} onPress={() => setScreen("report-cards")} />
      </View>
      {/* Two column layout */}
      <View style={{ flexDirection: "row", gap: 16 }}>
        {/* LEFT 65% */}
        <View style={{ flex: 65 }}>
          {/* Workflow */}
          <Card style={{ marginBottom: 16 }}>
            <SectionHeader title="Result Compilation Workflow" />
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <WorkflowStep icon="☁️" iconBg={C.primaryBg} label="Uploaded" desc="Results submitted" count={`${c.batches||0} batches`} countBg={C.primaryBg} onPress={() => setScreen("upload")} />
              <Arrow />
              <WorkflowStep icon="📋" iconBg={C.amberBg} label="Under Review" desc="Being checked" count={`${c.pendingReviews||0} batches`} countBg={C.amberBg} onPress={() => setScreen("review")} />
              <Arrow />
              <WorkflowStep icon="🛡️" iconBg={C.blueBg} label="Verified" desc="Approved scores" count={`${Math.floor((c.batches||0)*0.85)} batches`} countBg={C.blueBg} onPress={() => setScreen("review")} />
              <Arrow />
              <WorkflowStep icon="⚙️" iconBg={C.purpleBg} label="Compiled" desc="Results computed" count="28 batches" countBg={C.purpleBg} onPress={() => setScreen("report-cards")} />
              <Arrow />
              <WorkflowStep icon="✅" iconBg={C.successBg} label="Published" desc="Cards published" count={`${published} cards`} countBg={C.successBg} onPress={() => setScreen("report-cards")} />
            </View>
          </Card>
          {/* Recent batches table */}
          <Card>
            <SectionHeader title="Recent Result Batches" action={<Pressable onPress={() => setScreen("upload")}><Text style={{ fontSize: 11, color: C.primary, fontWeight: "600" }}>View all →</Text></Pressable>} />
            <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, overflow: "hidden" }}>
              <View style={{ flexDirection: "row", backgroundColor: C.muted, borderBottomWidth: 1, borderBottomColor: C.border }}>
                <Th width={160}>Batch Name</Th><Th width={70}>Class</Th><Th>Subject</Th><Th width={90}>Teacher</Th><Th width={80}>Status</Th><Th width={70}>Date</Th>
              </View>
              {(d.recentBatches||[]).slice(0,6).map((b:any,i:number) => (
                <Pressable key={b.id} onPress={() => setScreen("review")} style={{ flexDirection: "row", borderBottomWidth: i<5?1:0, borderBottomColor: C.border, backgroundColor: C.card }}>
                  <View style={{ width: 160, paddingHorizontal: 10, paddingVertical: 8 }}><Text style={{ fontSize: 11, color: C.fg }}>{b.classArm?.fullLabel} {b.subject?.subjectName}</Text></View>
                  <View style={{ width: 70, paddingHorizontal: 10, paddingVertical: 8 }}><Text style={{ fontSize: 11, color: C.mutedFg }}>{b.classArm?.class?.className}</Text></View>
                  <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 8 }}><Text style={{ fontSize: 11, color: C.fg }}>{b.subject?.subjectName}</Text></View>
                  <View style={{ width: 90, paddingHorizontal: 10, paddingVertical: 8 }}><Text style={{ fontSize: 10, color: C.mutedFg }}>{b.uploadedBy?.fullName}</Text></View>
                  <View style={{ width: 80, paddingHorizontal: 10, paddingVertical: 8 }}><Badge status={b.status} /></View>
                  <View style={{ width: 70, paddingHorizontal: 10, paddingVertical: 8 }}><Text style={{ fontSize: 10, color: C.mutedFg }}>{new Date(b.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</Text></View>
                </Pressable>
              ))}
            </View>
          </Card>
        </View>
        {/* RIGHT 35% */}
        <View style={{ flex: 35 }}>
          {/* Alert */}
          <AlertBox icon="⚠️" title="Incomplete Results" count={`${c.pendingReviews||0}`} desc="batches have incomplete results across various classes and subjects." cta="Review Results" onPress={() => setScreen("review")} />
          {/* Activity feed */}
          <Card>
            <SectionHeader title="Recent Activity" action={<Pressable><Text style={{ fontSize: 11, color: C.primary, fontWeight: "600" }}>View all →</Text></Pressable>} />
            {(d.recentAuditEvents||[]).slice(0,6).map((e:any) => {
              const isUpload = e.eventType?.includes("UPLOADED"); const isConfirm = e.eventType?.includes("CONFIRMED");
              const isCompile = e.eventType?.includes("COMPILED"); const isPublish = e.eventType?.includes("PUBLISHED");
              return (
                <ActivityItem
                  key={e.id}
                  icon={isUpload?"📤":isConfirm?"✏️":isCompile?"⚙️":isPublish?"📄":"📋"}
                  iconBg={isUpload?C.primaryBg:isConfirm?C.blueBg:isCompile?C.purpleBg:isPublish?C.successBg:C.muted}
                  title={isUpload?"Result uploaded":isConfirm?"Score confirmed":isCompile?"Result compiled":isPublish?"Report published":"Action"}
                  details={e.description?.slice(0,60)||""}
                  time={new Date(e.occurredAt).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}
                />
              );
            })}
          </Card>
        </View>
      </View>
    </View>
  );
}

// === STUDENTS ===
function StudentsScreen() {
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [revising, setRevising] = useState<any>(null);
  const { setScreen } = useScreen();
  useEffect(() => { apiFetch("/api/students?limit=200").then(r => { setD(r); setLoading(false); }).catch(() => setLoading(false)); }, []);
  const students = (d?.students||[]).filter((s:any) => !search || `${s.surname} ${s.firstName}`.toLowerCase().includes(search.toLowerCase()) || s.admissionNumber.includes(search));
  function openStudent(s:any) { setSel(s); setScoresLoading(true); apiFetch(`/api/students/${s.id}/scores`).then(r => { setScores(r); setScoresLoading(false); }).catch(() => setScoresLoading(false)); }
  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <PageHeader title="Students" subtitle={`${students.length} of ${d?.students?.length||0}`} actions={<Btn title="Add Student" icon="+" size="sm" onPress={() => toast("Add student form","info")} />} />
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          <StatCard label="Total Students" value={d?.students?.length||0} trend="↑ 2 new this term" trendColor={C.success} icon="🎓" iconBg={C.primaryBg} />
          <StatCard label="Active" value={(d?.students||[]).filter((s:any)=>s.isActive).length} icon="✅" iconBg={C.successBg} />
          <StatCard label="Classes" value={15} icon="🏫" iconBg={C.blueBg} />
        </View>
        <View style={{ marginBottom: 12 }}><SearchBar value={search} onChange={setSearch} placeholder="Search students, admission #, or class…" /></View>
        {loading ? <Loading /> : students.length===0 ? <EmptyState icon="🎓" title="No students" desc="Try different search" /> : (
          <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, overflow: "hidden", backgroundColor: C.card }}>
            <View style={{ flexDirection: "row", backgroundColor: C.muted, borderBottomWidth: 1, borderBottomColor: C.border }}>
              <Th width={100}>Admission #</Th><Th>Student Name</Th><Th width={50}>Gender</Th><Th width={100}>Class</Th><Th width={100}>Guardian</Th>
            </View>
            {students.slice(0,30).map((s:any,i:number) => {
              const arm = s.classMemberships?.[0]?.classArm;
              return (
                <Pressable key={s.id} onPress={() => openStudent(s)} style={{ flexDirection: "row", borderBottomWidth: i<29?1:0, borderBottomColor: C.border, backgroundColor: sel?.id===s.id?C.primaryBg:C.card }}>
                  <View style={{ width: 100, paddingHorizontal: 10, paddingVertical: 8 }}><Text style={{ fontSize: 11, fontFamily: "monospace", color: C.mutedFg }}>{s.admissionNumber}</Text></View>
                  <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: C.muted, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 9, color: C.mutedFg }}>{(s.surname[0]||"")}{(s.firstName[0]||"")}</Text></View>
                    <Text style={{ fontSize: 12, fontWeight: "500", color: C.fg }}>{s.surname}, {s.firstName}</Text>
                  </View>
                  <View style={{ width: 50, paddingHorizontal: 10, paddingVertical: 8 }}><Text style={{ fontSize: 11, color: C.mutedFg }}>{s.gender||"—"}</Text></View>
                  <View style={{ width: 100, paddingHorizontal: 10, paddingVertical: 8 }}><Text style={{ fontSize: 11, color: C.fg }}>{arm?.fullLabel||"—"}</Text></View>
                  <View style={{ width: 100, paddingHorizontal: 10, paddingVertical: 8 }}><Text style={{ fontSize: 10, color: C.mutedFg }} numberOfLines={1}>{s.guardianName||"—"}</Text></View>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
      <DetailPanel visible={!!sel} onClose={() => setSel(null)} title="Student Profile"
        footer={<><Btn title="Edit" variant="outline" size="sm" onPress={() => toast("Edit form","info")} /><Btn title="Report Card" size="sm" onPress={() => { setSel(null); setScreen("report-cards"); }} /></>}
      >
        {sel && <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.primaryBg, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 16, fontWeight: "700", color: C.primary }}>{(sel.surname[0]||"")}{(sel.firstName[0]||"")}</Text></View>
            <View><Text style={{ fontSize: 16, fontWeight: "700", color: C.fg }}>{sel.surname}, {sel.firstName}</Text><Text style={{ fontSize: 11, color: C.mutedFg }}>{sel.admissionNumber} · {sel.gender} · {sel.stateOfOrigin}</Text></View>
          </View>
          {sel.guardianName && <View style={{ marginBottom: 12 }}><Text style={{ fontSize: 10, fontWeight: "600", color: C.mutedFg }}>GUARDIAN</Text><Text style={{ fontSize: 12, color: C.fg }}>{sel.guardianName}</Text>{sel.guardianPhone && <Text style={{ fontSize: 11, color: C.mutedFg }}>{sel.guardianPhone}</Text>}</View>}
          <Text style={{ fontSize: 13, fontWeight: "600", color: C.fg, marginTop: 8, marginBottom: 4 }}>Verified Scores — First Term</Text>
          <Text style={{ fontSize: 10, color: C.mutedFg, marginBottom: 8 }}>Click any score to revise. Changes trigger recompilation.</Text>
          {scoresLoading ? <Loading /> : (scores?.groups||[]).map((g:any) => (
            <View key={g.subjectId} style={{ backgroundColor: C.muted, borderRadius: 8, padding: 10, marginBottom: 6 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}><Text style={{ fontSize: 10, fontWeight: "700", color: C.mutedFg }}>{g.subjectCode}</Text><Text style={{ fontSize: 11, fontWeight: "500", color: C.fg }}>{g.subjectName}</Text></View>
                {g.compilationResult && <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}><Text style={{ fontSize: 11, fontWeight: "600", color: C.fg }}>{g.compilationResult.overallTotal?.toFixed(0)}/100</Text>{g.compilationResult.grade && <Badge status={g.compilationResult.grade} />}</View>}
              </View>
              {g.scores.map((sc:any) => (
                <Pressable key={sc.id} onPress={() => setRevising({...sc, subjectCode:g.subjectCode, subjectName:g.subjectName})} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, paddingHorizontal: 4 }}>
                  <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}><Text style={{ fontSize: 11, color: C.fg }}>{sc.componentName}</Text>{sc.status==="REVISED" && <Badge status="REVISED" />}</View>
                  <Text style={{ fontSize: 11, fontFamily: "monospace", color: C.fg }}>{sc.value}/{sc.maximumMark}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>}
      </DetailPanel>
      <ModalDlg visible={!!revising} onClose={() => setRevising(null)} title="Revise Score" size="sm"
        footer={<><Btn title="Cancel" variant="outline" size="sm" onPress={() => setRevising(null)} /><Btn title="Save Revision" size="sm" onPress={() => { toast("Score revised","success"); setTimeout(()=>toast("Recompile: subject + positions + report card","info"),300); setRevising(null); }} /></>}
      >
        {revising && <View>
          <View style={{ backgroundColor: C.muted, borderRadius: 8, padding: 10, marginBottom: 10 }}>
            <Text style={{ fontSize: 11, color: C.mutedFg }}>Subject</Text><Text style={{ fontSize: 12, fontWeight: "500", color: C.fg }}>{revising.subjectName} — {revising.componentName}</Text>
            <Text style={{ fontSize: 11, color: C.mutedFg, marginTop: 4 }}>Current: <Text style={{ fontFamily: "monospace", fontWeight: "600" }}>{revising.value}/{revising.maximumMark}</Text></Text>
          </View>
          <Field label="New Score Value" value="" onChange={() => {}} type="number" placeholder={`0 – ${revising.maximumMark}`} />
          <Field label="Reason for Revision (required)" value="" onChange={() => {}} placeholder="e.g. Rechecked the script" multiline />
          <View style={{ backgroundColor: C.redBg, borderRadius: 8, padding: 10 }}><Text style={{ fontSize: 10, color: C.red, fontWeight: "500" }}>⚠ Triggers: recompile subject → recompute class positions → supersede report card</Text></View>
        </View>}
      </ModalDlg>
    </View>
  );
}

// === UPLOAD ===
function UploadScreen() {
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [src, setSrc] = useState<"SPREADSHEET"|"SCANNED_PAPER">("SPREADSHEET");
  const [file, setFile] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const { setScreen } = useScreen();
  useEffect(() => { apiFetch("/api/score-batches?limit=50").then(r => { setD(r); setLoading(false); }).catch(() => setLoading(false)); }, []);
  function extract() { if (!file) { toast("Select a file","error"); return; } setStep(2); apiFetch("/api/students?limit=10").then(r => { const comps=[{n:"Assignment",m:10},{n:"Test 1",m:10},{n:"Test 2",m:10},{n:"Mid-Term",m:10},{n:"Examination",m:60}]; setRows((r.students||[]).slice(0,8).map((s:any)=>{ const v:any={}; comps.forEach(c=>v[c.n]=Math.floor(Math.random()*c.m*0.8)+1); const unmatched=src==="SCANNED_PAPER"&&Math.random()<0.1; return {id:s.id,name:unmatched?`${s.surname.replace(/a$/,"ah")} ${s.firstName}`:`${s.surname} ${s.firstName}`,adm:unmatched?s.admissionNumber.replace(/\d$/,"X"):s.admissionNumber,matched:!unmatched,v}; })); }); }
  function confirm() { if (rows.some(r=>!r.matched)) { toast("Fix unmatched first","error"); return; } setStep(3); toast("Scores saved!","success"); setTimeout(()=>toast("Compiling…","info"),300); setTimeout(()=>setStep(0),2500); }
  if (step>0) return (
    <View style={{ padding: 20, maxWidth: 700 }}>
      <View style={{ flexDirection: "row", gap: 6, marginBottom: 16 }}>{["Pick File","Preview & Edit","Confirm"].map((l,i)=>(<View key={l} style={{flexDirection:"row",alignItems:"center",gap:4}}><View style={{width:22,height:22,borderRadius:11,backgroundColor:step>i+1?C.success:step===i+1?C.primary:C.muted,alignItems:"center",justifyContent:"center"}}><Text style={{fontSize:9,color:"#fff",fontWeight:"700"}}>{step>i+1?"✓":i+1}</Text></View><Text style={{fontSize:10,fontWeight:"500",color:step>=i+1?C.fg:C.mutedFg}}>{l}</Text>{i<2&&<Text style={{color:C.mutedFg,fontSize:10}}>→</Text>}</View>))}</View>
      {step===1&&<View><Text style={{fontSize:16,fontWeight:"700",color:C.fg,marginBottom:12}}>Upload Scores</Text><Text style={{fontSize:11,fontWeight:"600",color:C.mutedFg,marginBottom:6}}>Source Type</Text><View style={{flexDirection:"row",gap:8,marginBottom:12}}>{(["SPREADSHEET","SCANNED_PAPER"]as const).map(t=>(<Pressable key={t} onPress={()=>setSrc(t)} style={{flex:1,padding:12,borderRadius:8,borderWidth:1,borderColor:src===t?C.primary:C.border,backgroundColor:src===t?C.primaryBg:C.card,alignItems:"center"}}><Text style={{fontSize:18}}>{t==="SPREADSHEET"?"📊":"📠"}</Text><Text style={{fontSize:11,fontWeight:"500",color:src===t?C.primary:C.mutedFg,marginTop:4}}>{t==="SPREADSHEET"?"Excel / CSV":"Scanned Paper"}</Text></Pressable>))}</View><Text style={{fontSize:11,fontWeight:"600",color:C.mutedFg,marginBottom:6}}>File</Text><Pressable onPress={()=>setFile(src==="SPREADSHEET"?"english_jss1a.xlsx":"math_ss2_science_scan.pdf")} style={{borderWidth:2,borderStyle:"dashed",borderColor:C.border,borderRadius:8,padding:20,alignItems:"center",backgroundColor:C.muted}}>{file?<Text style={{fontSize:13,fontWeight:"500",color:C.primary}}>📄 {file}</Text>:<><Text style={{fontSize:20}}>📤</Text><Text style={{fontSize:12,color:C.fg,marginTop:4}}>Click to select a file</Text></>}</Pressable><View style={{flexDirection:"row",justifyContent:"flex-end",gap:8,marginTop:16}}><Btn title="Cancel" variant="outline" size="sm" onPress={()=>setStep(0)} /><Btn title="Upload & Extract" icon="📤" size="sm" onPress={extract} disabled={!file} /></View></View>}
      {step===2&&<View><Text style={{fontSize:16,fontWeight:"700",color:C.fg,marginBottom:4}}>Preview & Edit</Text><Text style={{fontSize:11,color:C.mutedFg,marginBottom:12}}>Every cell is editable.</Text>{rows.length===0?<Loading />:<View style={{borderWidth:1,borderColor:C.border,borderRadius:8,overflow:"hidden",backgroundColor:C.card}}><View style={{flexDirection:"row",backgroundColor:C.muted,paddingVertical:6,paddingHorizontal:8,borderBottomWidth:1,borderBottomColor:C.border}}><Th width={140}>Student</Th><Th width={50}>Assign</Th><Th width={50}>Test1</Th><Th width={50}>Test2</Th><Th width={50}>Mid-T</Th><Th width={50}>Exam</Th></View>{rows.map((r,i)=>(<View key={i} style={{flexDirection:"row",paddingHorizontal:8,paddingVertical:4,borderBottomWidth:1,borderBottomColor:C.border,backgroundColor:r.matched?"transparent":C.amberBg,alignItems:"center"}}><View style={{width:140}}><Text style={{fontSize:11,color:C.fg}}>{r.name}</Text><Text style={{fontSize:9,color:r.matched?C.mutedFg:C.amber,fontFamily:"monospace"}}>{r.adm}{!r.matched&&" ⚠"}</Text></View>{["Assignment","Test 1","Test 2","Mid-Term","Examination"].map(c=><TextInput key={c} defaultValue={String(r.v[c]||"")} style={{width:50,textAlign:"center",fontSize:11,fontFamily:"monospace",borderWidth:1,borderColor:C.border,borderRadius:4,paddingVertical:2}} keyboardType="numeric" />)}</View>))}</View>}<View style={{flexDirection:"row",justifyContent:"space-between",marginTop:12}}><Btn title="Back" variant="outline" size="sm" onPress={()=>setStep(1)} /><Btn title={`Confirm ${rows.length} Scores`} icon="✓" size="sm" onPress={confirm} disabled={rows.some(r=>!r.matched)} /></View>{rows.some(r=>!r.matched)&&<Text style={{fontSize:10,color:C.amber,marginTop:6}}>⚠ Fix unmatched students first.</Text>}</View>}
      {step===3&&<View style={{alignItems:"center",paddingVertical:40}}><View style={{width:48,height:48,borderRadius:24,backgroundColor:C.successBg,alignItems:"center",justifyContent:"center",marginBottom:12}}><Text style={{fontSize:24,color:C.success}}>✓</Text></View><Text style={{fontSize:15,fontWeight:"700",color:C.fg}}>Scores Saved</Text><Text style={{fontSize:11,color:C.mutedFg,marginTop:8}}>• Totals computed{"\n"}• Positions recomputed{"\n"}• Report cards superseded</Text></View>}
    </View>
  );
  return (
    <View style={{ padding: 20, maxWidth: 1000 }}>
      <PageHeader title="Upload Results" subtitle={`${d?.batches?.length||0} batches`} actions={<Btn title="New Upload" icon="📤" size="sm" onPress={()=>setStep(1)} />} />
      {loading ? <Loading /> : <View style={{borderWidth:1,borderColor:C.border,borderRadius:8,overflow:"hidden",backgroundColor:C.card}}><View style={{flexDirection:"row",backgroundColor:C.muted,borderBottomWidth:1,borderBottomColor:C.border}}><Th width={120}>Batch</Th><Th>Class · Subject</Th><Th width={100}>Teacher</Th><Th width={50}>Rows</Th><Th width={90}>Status</Th></View>{(d?.batches||[]).slice(0,25).map((b:any,i:number)=>(<Pressable key={b.id} onPress={()=>setScreen("review")} style={{flexDirection:"row",borderBottomWidth:i<24?1:0,borderBottomColor:C.border,backgroundColor:C.card}}><View style={{width:120,paddingHorizontal:10,paddingVertical:8}}><Text style={{fontSize:11,fontFamily:"monospace",color:C.fg}}>{b.batchRef}</Text></View><View style={{flex:1,paddingHorizontal:10,paddingVertical:8}}><Text style={{fontSize:12,color:C.fg}}>{b.classArm?.fullLabel} · {b.subject?.subjectName}</Text></View><View style={{width:100,paddingHorizontal:10,paddingVertical:8}}><Text style={{fontSize:10,color:C.mutedFg}}>{b.uploadedBy?.fullName}</Text></View><View style={{width:50,paddingHorizontal:10,paddingVertical:8}}><Text style={{fontSize:11,fontFamily:"monospace",color:C.mutedFg}}>{b._count?.verifiedScores||b._count?.scoreDrafts||0}</Text></View><View style={{width:90,paddingHorizontal:10,paddingVertical:8}}><Badge status={b.status} /></View></Pressable>))}</View>}
    </View>
  );
}

// === REVIEW ===
function ReviewScreen() {
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  useEffect(() => { apiFetch("/api/drafts").then(r => { setD(r); setLoading(false); }).catch(() => setLoading(false)); }, []);
  const drafts = (d?.drafts||[]).filter((dr:any) => !search || dr.studentNameRaw.toLowerCase().includes(search.toLowerCase()));
  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <PageHeader title="Review & Compile" subtitle={`${drafts.length} drafts need review`} />
        {d && <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          <StatCard label="Drafts Pending" value={drafts.length} icon="📋" iconBg={C.amberBg} />
          <StatCard label="Unmatched" value={drafts.filter((d:any)=>!d.studentId).length} icon="⚠️" iconBg={C.redBg} />
          <StatCard label="Invalid" value={drafts.filter((d:any)=>d.status==="FLAGGED_INVALID").length} icon="❌" iconBg={C.redBg} />
          <StatCard label="Uncertain" value={drafts.filter((d:any)=>d.status==="FLAGGED_UNCERTAIN").length} icon="❓" iconBg={C.blueBg} />
        </View>}
        <View style={{ marginBottom: 12 }}><SearchBar value={search} onChange={setSearch} placeholder="Search drafts…" /></View>
        {loading ? <Loading /> : drafts.length===0 ? <EmptyState icon="✅" title="No drafts" desc="All confirmed" /> : (
          <View style={{borderWidth:1,borderColor:C.border,borderRadius:8,overflow:"hidden",backgroundColor:C.card}}>
            {drafts.slice(0,25).map((dr:any,i:number)=>(<Pressable key={dr.id} onPress={()=>setEditing(dr)} style={{padding:10,borderBottomWidth:i<24?1:0,borderBottomColor:C.border,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}><View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"500",color:C.fg}}>{dr.studentNameRaw}</Text><Text style={{fontSize:10,color:C.mutedFg,marginTop:1}}>{dr.batch?.batchRef} · {dr.batch?.classArm?.fullLabel} · {dr.batch?.subject?.subjectName} · {dr.assessmentComponent?.componentName}</Text></View><View style={{alignItems:"flex-end",gap:3}}><Text style={{fontSize:12,fontFamily:"monospace",color:C.fg}}>{dr.enteredValue}/{dr.assessmentComponent?.maximumMark}</Text><Badge status={dr.status} /></View></Pressable>))}
          </View>
        )}
      </View>
      <DetailPanel visible={!!editing} onClose={()=>setEditing(null)} title="Review Draft" footer={<><Btn title="Reject" variant="danger" size="sm" onPress={()=>{toast("Rejected","info");setEditing(null);}} /><Btn title="Confirm" size="sm" onPress={()=>{toast("Confirmed","success");setEditing(null);}} /></>}>
        {editing && <View><View style={{backgroundColor:C.muted,borderRadius:8,padding:10,marginBottom:10}}><Text style={{fontSize:11,color:C.mutedFg}}>Student</Text><Text style={{fontSize:12,fontWeight:"500",color:C.fg}}>{editing.studentNameRaw}</Text><Text style={{fontSize:11,color:C.mutedFg,marginTop:6}}>Component</Text><Text style={{fontSize:12,color:C.fg}}>{editing.assessmentComponent?.componentName} (max {editing.assessmentComponent?.maximumMark})</Text><Text style={{fontSize:11,color:C.mutedFg,marginTop:6}}>Batch</Text><Text style={{fontSize:11,fontFamily:"monospace",color:C.fg}}>{editing.batch?.batchRef}</Text></View><Field label="Score Value" value={String(editing.enteredValue||"")} onChange={()=>{}} type="number" /><Field label="Reviewer Note" value="" onChange={()=>{}} placeholder="Note…" multiline /></View>}
      </DetailPanel>
    </View>
  );
}

// === REPORT CARDS ===
function ReportCardsScreen() {
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<any>(null);
  const { setScreen } = useScreen();
  useEffect(() => { apiFetch("/api/report-cards?limit=50").then(r => { setD(r); setLoading(false); }).catch(() => setLoading(false)); }, []);
  const cards = (d?.cards||[]).filter((c:any) => !search || `${c.student?.surname} ${c.student?.firstName}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <PageHeader title="Report Cards" subtitle={`${cards.length} cards`} />
        {d && <View style={{flexDirection:"row",gap:8,marginBottom:12}}><StatCard label="Total" value={cards.length} icon="📄" iconBg={C.muted} /><StatCard label="Published" value={cards.filter((c:any)=>c.status==="PUBLISHED").length} icon="✅" iconBg={C.successBg} /><StatCard label="Approved" value={cards.filter((c:any)=>c.status==="APPROVED").length} icon="⭐" iconBg={C.amberBg} /><StatCard label="Draft" value={cards.filter((c:any)=>c.status==="DRAFT").length} icon="📝" iconBg={C.muted} /></View>}
        <View style={{marginBottom:12}}><SearchBar value={search} onChange={setSearch} placeholder="Search by name…" /></View>
        {loading ? <Loading /> : <View style={{flexDirection:"row",flexWrap:"wrap",gap:10}}>{cards.slice(0,20).map((c:any)=>{const pos=c.classPositions?.[0];const arm=c.student?.classMemberships?.[0]?.classArm;return(<Pressable key={c.id} onPress={()=>setPreview(c)} style={{backgroundColor:C.card,borderRadius:10,borderWidth:1,borderColor:C.border,padding:14,width:220}}><View style={{flexDirection:"row",justifyContent:"space-between",marginBottom:6}}><View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"600",color:C.fg}}>{c.student?.surname}, {c.student?.firstName}</Text><Text style={{fontSize:10,color:C.mutedFg,fontFamily:"monospace"}}>{c.student?.admissionNumber}</Text><Text style={{fontSize:10,color:C.mutedFg}}>{arm?.fullLabel}</Text></View><Badge status={c.status} /></View><View style={{flexDirection:"row",gap:10,marginTop:6,paddingTop:6,borderTopWidth:1,borderTopColor:C.border}}><Text style={{fontSize:10,color:C.mutedFg}}>Pos: {pos?`${pos.position}/${pos.numStudentsInArm}`:"—"}</Text><Text style={{fontSize:10,color:C.mutedFg}}>Avg: {pos?pos.averageScore?.toFixed(1):"—"}</Text></View></Pressable>);})}</View>}
      </View>
      <DetailPanel visible={!!preview} onClose={()=>setPreview(null)} title="Report Card" width={420} footer={<><Btn title="Edit Scores" variant="outline" size="sm" onPress={()=>{setPreview(null);setScreen("students");toast("Go to Students → revise scores","info");}} />{preview?.status==="READY_FOR_REVIEW"&&<Btn title="Approve" icon="✓" size="sm" onPress={()=>{toast("Approved","success");setPreview(null);}} />}{preview?.status==="APPROVED"&&<Btn title="Publish" icon="📤" size="sm" onPress={()=>{toast("Published","success");setPreview(null);}} />}</>}>
        {preview && <View><View style={{paddingBottom:10,borderBottomWidth:2,borderBottomColor:C.primary,marginBottom:12}}><Text style={{fontSize:15,fontWeight:"700",color:C.fg}}>Akoka Federal Academy</Text><Text style={{fontSize:10,color:C.mutedFg}}>Akoka, Yaba, Lagos · Est. 1985</Text><Text style={{fontSize:9,color:C.mutedFg,fontStyle:"italic"}}>"Excellence · Discipline · Success"</Text></View><View style={{flexDirection:"row",marginBottom:12}}><View style={{flex:1}}><Text style={{fontSize:9,color:C.mutedFg}}>STUDENT</Text><Text style={{fontSize:12,fontWeight:"500",color:C.fg}}>{preview.student?.surname}, {preview.student?.firstName}</Text></View><View><Text style={{fontSize:9,color:C.mutedFg}}>ADMISSION #</Text><Text style={{fontSize:12,fontFamily:"monospace",color:C.fg}}>{preview.student?.admissionNumber}</Text></View></View><View style={{backgroundColor:C.muted,borderRadius:8,padding:10,marginBottom:8}}><Text style={{fontSize:11,fontWeight:"600",color:C.fg,marginBottom:4}}>Subject Results</Text><Text style={{fontSize:10,color:C.mutedFg}}>Compiled output — not directly editable.</Text></View><View style={{backgroundColor:C.redBg,borderRadius:8,padding:10}}><Text style={{fontSize:10,color:C.red}}>⚠ Subject results are derived from verified scores. Edit source scores to change.</Text></View></View>}
      </DetailPanel>
    </View>
  );
}

// === SUBJECTS ===
function SubjectsScreen() {
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string|null>(null);
  const [sel, setSel] = useState<any>(null);
  useEffect(() => { apiFetch("/api/subjects-classes").then(r => { setD(r); setLoading(false); }).catch(() => setLoading(false)); }, []);
  const subjects = (d?.subjects||[]).filter((s:any) => !search || s.subjectName.toLowerCase().includes(search.toLowerCase()) || s.subjectCode.toLowerCase().includes(search.toLowerCase()));
  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <PageHeader title="Subjects & Classes" subtitle={`${d?.subjects?.length||0} subjects · ${d?.classes?.length||0} classes`} />
        <View style={{flexDirection:"row",flexWrap:"wrap",gap:8,marginBottom:16}}>{(d?.classes||[]).map((cls:any)=>(<Pressable key={cls.id} onPress={()=>setExpanded(expanded===cls.id?null:cls.id)} style={{backgroundColor:C.card,borderRadius:8,borderWidth:1,borderColor:C.border,padding:10,minWidth:150}}><View style={{flexDirection:"row",justifyContent:"space-between"}}><Text style={{fontSize:12,fontWeight:"600",color:C.fg}}>{cls.className}</Text><Text style={{fontSize:10,color:C.mutedFg}}>{cls.classArms?.length} arms</Text></View>{expanded===cls.id&&<View style={{marginTop:6,paddingTop:6,borderTopWidth:1,borderTopColor:C.border}}>{cls.classArms?.map((a:any)=><Text key={a.id} style={{fontSize:11,color:C.fg,paddingVertical:2}}>{a.fullLabel}{a.track&&<Text style={{color:C.mutedFg}}> · {a.track.name.toLowerCase()}</Text>}</Text>)}</View>}</Pressable>))}</View>
        <View style={{marginBottom:12}}><SearchBar value={search} onChange={setSearch} placeholder="Search subjects…" /></View>
        {loading ? <Loading /> : <View style={{borderWidth:1,borderColor:C.border,borderRadius:8,overflow:"hidden",backgroundColor:C.card}}>{subjects.map((s:any,i:number)=>(<Pressable key={s.id} onPress={()=>setSel(s)} style={{flexDirection:"row",paddingHorizontal:10,paddingVertical:7,borderBottomWidth:i<subjects.length-1?1:0,borderBottomColor:C.border,alignItems:"center"}}><Text style={{fontSize:11,fontFamily:"monospace",color:C.mutedFg,width:40}}>{s.subjectCode}</Text><Text style={{fontSize:12,color:C.fg,flex:1}}>{s.subjectName}</Text><View style={{backgroundColor:C.muted,borderRadius:4,paddingHorizontal:5,paddingVertical:1,marginRight:6}}><Text style={{fontSize:9,color:C.mutedFg}}>{s.category}</Text></View>{s.isCore&&<View style={{backgroundColor:C.primaryBg,borderRadius:4,paddingHorizontal:5,paddingVertical:1}}><Text style={{fontSize:9,color:C.primary,fontWeight:"600"}}>Core</Text></View>}</Pressable>))}</View>}
      </View>
      <DetailPanel visible={!!sel} onClose={()=>setSel(null)} title="Subject Detail" footer={<><Btn title="Edit" variant="outline" size="sm" onPress={()=>toast("Edit form","info")} /><Btn title="Close" size="sm" onPress={()=>setSel(null)} /></>}>
        {sel && <View><Text style={{fontSize:16,fontWeight:"700",color:C.fg}}>{sel.subjectName}</Text><Text style={{fontSize:11,color:C.mutedFg,fontFamily:"monospace"}}>Code: {sel.subjectCode}</Text><View style={{marginTop:12}}><View style={{flexDirection:"row",justifyContent:"space-between",paddingVertical:6,borderBottomWidth:1,borderBottomColor:C.border}}><Text style={{fontSize:11,color:C.mutedFg}}>Category</Text><Text style={{fontSize:12,color:C.fg}}>{sel.category}</Text></View><View style={{flexDirection:"row",justifyContent:"space-between",paddingVertical:6,borderBottomWidth:1,borderBottomColor:C.border}}><Text style={{fontSize:11,color:C.mutedFg}}>Track</Text><Text style={{fontSize:12,color:C.fg}}>{sel.track?.name||"—"}</Text></View><View style={{flexDirection:"row",justifyContent:"space-between",paddingVertical:6,borderBottomWidth:1,borderBottomColor:C.border}}><Text style={{fontSize:11,color:C.mutedFg}}>Core</Text><Text style={{fontSize:12,color:C.fg}}>{sel.isCore?"Yes":"No"}</Text></View><View style={{flexDirection:"row",justifyContent:"space-between",paddingVertical:6}}><Text style={{fontSize:11,color:C.mutedFg}}>Levels</Text><Text style={{fontSize:12,color:C.fg}}>{[sel.isOfferedJSS&&"JSS",sel.isOfferedSS&&"SS"].filter(Boolean).join(", ")||"—"}</Text></View></View></View>}
      </DetailPanel>
    </View>
  );
}

// === ASSESSMENTS ===
function AssessmentsScreen() {
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState<any>(null);
  useEffect(() => { apiFetch("/api/assessments?limit=50").then(r => { setD(r); setLoading(false); }).catch(() => setLoading(false)); }, []);
  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <PageHeader title="Assessment Configuration" subtitle={`${d?.configs?.length||0} configs · CA 40 + Exam 60 = 100`} />
        {loading ? <Loading /> : <View style={{borderWidth:1,borderColor:C.border,borderRadius:8,overflow:"hidden",backgroundColor:C.card}}><View style={{flexDirection:"row",backgroundColor:C.muted,paddingVertical:6,paddingHorizontal:8,borderBottomWidth:1,borderBottomColor:C.border}}><Th width={50}>Code</Th><Th>Subject</Th><Th width={100}>Class</Th><Th width={60}>CA</Th><Th width={60}>Exam</Th><Th width={60}>Total</Th></View>{(d?.configs||[]).slice(0,25).map((cfg:any,i:number)=>{const ca=(cfg.components||[]).filter((c:any)=>c.componentType==="CONTINUOUS_ASSESSMENT").reduce((s:number,c:any)=>s+c.maximumMark,0);return(<Pressable key={cfg.id} onPress={()=>setSel(cfg)} style={{flexDirection:"row",paddingHorizontal:8,paddingVertical:7,borderBottomWidth:i<24?1:0,borderBottomColor:C.border,alignItems:"center",backgroundColor:sel?.id===cfg.id?C.primaryBg:C.card}}><View style={{width:50}}><Text style={{fontSize:11,fontFamily:"monospace",color:C.mutedFg}}>{cfg.subject?.subjectCode}</Text></View><View style={{flex:1}}><Text style={{fontSize:12,color:C.fg}}>{cfg.subject?.subjectName}</Text></View><View style={{width:100}}><Text style={{fontSize:11,color:C.mutedFg}}>{cfg.classArm?.fullLabel}</Text></View><View style={{width:60}}><Text style={{fontSize:11,fontFamily:"monospace",color:C.fg}}>{ca}/40</Text></View><View style={{width:60}}><Text style={{fontSize:11,fontFamily:"monospace",color:C.fg}}>60</Text></View><View style={{width:60}}><Text style={{fontSize:11,fontFamily:"monospace",color:C.primary,fontWeight:"600"}}>100</Text></View></Pressable>);})}</View>}
      </View>
      <DetailPanel visible={!!sel} onClose={()=>setSel(null)} title="Assessment Detail" footer={<><Btn title="Close" variant="outline" size="sm" onPress={()=>setSel(null)} /><Btn title="Save" size="sm" onPress={()=>{toast("Saved","success");setSel(null);}} /></>}>
        {sel && <View><Text style={{fontSize:15,fontWeight:"700",color:C.fg}}>{sel.subject?.subjectName}</Text><Text style={{fontSize:11,color:C.mutedFg}}>{sel.classArm?.fullLabel} · CA 40 + Exam 60 = 100</Text><Text style={{fontSize:12,fontWeight:"600",color:C.fg,marginTop:14,marginBottom:6}}>Components</Text>{(sel.components||[]).map((c:any)=>(<View key={c.id} style={{backgroundColor:C.muted,borderRadius:7,padding:10,marginBottom:6,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}><View><Text style={{fontSize:12,color:C.fg}}>{c.componentName}</Text>{c.componentType==="EXAMINATION"&&<Badge status="VERIFIED" />}</View><View style={{flexDirection:"row",gap:8,alignItems:"center"}}><Text style={{fontSize:12,fontFamily:"monospace",color:C.mutedFg}}>{c.maximumMark} mk</Text><Pressable onPress={()=>toast("Edit","info")}><Text style={{fontSize:12}}>✎</Text></Pressable>{c.componentType!=="EXAMINATION"&&<Pressable onPress={()=>toast("Delete?","warning")}><Text style={{fontSize:12,color:C.red}}>🗑</Text></Pressable>}</View></View>))}<View style={{borderTopWidth:1,borderTopColor:C.border,marginTop:8,paddingTop:8}}><View style={{flexDirection:"row",gap:10}}><Text style={{fontSize:11,color:C.mutedFg}}>CA: {(sel.components||[]).filter((c:any)=>c.componentType==="CONTINUOUS_ASSESSMENT").reduce((s:number,c:any)=>s+c.maximumMark,0)}/40</Text><Text style={{fontSize:11,color:C.mutedFg}}>Exam: 60</Text><Text style={{fontSize:11,color:C.primary,fontWeight:"600"}}>Overall: 100</Text></View></View></View>}
      </DetailPanel>
    </View>
  );
}

// === USERS ===
function UsersScreen() {
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState<any>(null);
  useEffect(() => { apiFetch("/api/users").then(r => { setD(r); setLoading(false); }).catch(() => setLoading(false)); }, []);
  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <PageHeader title="Users & Permissions" subtitle={`${d?.users?.length||0} staff`} />
        {d && <View style={{flexDirection:"row",gap:8,marginBottom:12}}><StatCard label="Total Users" value={d.users?.length||0} icon="👥" iconBg={C.primaryBg} /><StatCard label="Active" value={(d.users||[]).filter((u:any)=>u.isActive).length} icon="✅" iconBg={C.successBg} /><StatCard label="Teachers" value={(d.users||[]).filter((u:any)=>u.role==="TEACHER").length} icon="🎓" iconBg={C.blueBg} /><StatCard label="Admins" value={(d.users||[]).filter((u:any)=>u.role==="ADMIN").length} icon="⚙️" iconBg={C.amberBg} /></View>}
        {loading ? <Loading /> : <View style={{borderWidth:1,borderColor:C.border,borderRadius:8,overflow:"hidden",backgroundColor:C.card}}>{(d?.users||[]).map((u:any,i:number)=>{const ft=(u.teacherAssignments||[]).find((a:any)=>a.assignmentType==="FORM_TEACHER");const sc=(u.teacherAssignments||[]).filter((a:any)=>a.assignmentType==="SUBJECT_TEACHING").length;return(<Pressable key={u.id} onPress={()=>setSel(u)} style={{padding:10,borderBottomWidth:i<(d.users.length-1)?1:0,borderBottomColor:C.border,flexDirection:"row",alignItems:"center",gap:10,backgroundColor:sel?.id===u.id?C.primaryBg:C.card}}><View style={{width:34,height:34,borderRadius:17,backgroundColor:C.primaryBg,alignItems:"center",justifyContent:"center"}}><Text style={{fontSize:10,fontWeight:"600",color:C.primary}}>{u.fullName?.split(" ").map((n:string)=>n[0]).slice(0,2).join("")}</Text></View><View style={{flex:1}}><Text style={{fontSize:12,fontWeight:"500",color:C.fg}}>{u.fullName}</Text><Text style={{fontSize:10,color:C.mutedFg}}>{u.email}</Text></View>{ft&&<Text style={{fontSize:10,color:C.mutedFg}}>FT: {ft.classArm?.fullLabel}</Text>}<Text style={{fontSize:10,color:C.mutedFg}}>{sc} subs</Text><Badge status={u.role} /></Pressable>);})}</View>}
      </View>
      <DetailPanel visible={!!sel} onClose={()=>setSel(null)} title="User Detail" footer={<><Btn title="Edit" variant="outline" size="sm" onPress={()=>toast("Edit form","info")} /><Btn title="Close" size="sm" onPress={()=>setSel(null)} /></>}>
        {sel && <View><View style={{flexDirection:"row",alignItems:"center",gap:10,marginBottom:14}}><View style={{width:40,height:40,borderRadius:20,backgroundColor:C.primaryBg,alignItems:"center",justifyContent:"center"}}><Text style={{fontSize:12,fontWeight:"600",color:C.primary}}>{sel.fullName?.split(" ").map((n:string)=>n[0]).slice(0,2).join("")}</Text></View><View><Text style={{fontSize:14,fontWeight:"700",color:C.fg}}>{sel.fullName}</Text><Text style={{fontSize:11,color:C.mutedFg}}>{sel.email}</Text></View><View style={{marginLeft:"auto"}}><Badge status={sel.role} /></View></View>{sel.phone&&<Text style={{fontSize:11,color:C.mutedFg,marginBottom:8}}>📞 {sel.phone}</Text>}<Text style={{fontSize:12,fontWeight:"600",color:C.fg,marginTop:8,marginBottom:6}}>Assignments</Text>{(sel.teacherAssignments||[]).slice(0,8).map((a:any)=>(<View key={a.id} style={{backgroundColor:C.muted,borderRadius:6,padding:8,marginBottom:4,flexDirection:"row",justifyContent:"space-between"}}><Text style={{fontSize:11,color:C.fg}}>{a.subject?`${a.subject.subjectName} (${a.subject.subjectCode})`:"Form Teacher"}</Text><Text style={{fontSize:10,color:C.mutedFg}}>{a.classArm?.fullLabel}</Text></View>))}{(sel.teacherAssignments||[]).length>8&&<Text style={{fontSize:10,color:C.mutedFg}}>+{sel.teacherAssignments.length-8} more</Text>}</View>}
      </DetailPanel>
    </View>
  );
}

// === SCHOOL CONFIG ===
function SchoolConfigScreen() {
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiFetch("/api/school-config").then(r => { setD(r); setLoading(false); }).catch(() => setLoading(false)); }, []);
  if (loading) return <View style={{padding:24}}><Loading /></View>;
  const s = d?.school || {};
  return (
    <View style={{ padding: 20, maxWidth: 800 }}>
      <PageHeader title="School Configuration" subtitle="School identity, sessions, grading" actions={<Btn title="Edit School" variant="outline" size="sm" onPress={()=>toast("Edit form","info")} />} />
      <Card style={{marginBottom:16}}><Text style={{fontSize:16,fontWeight:"700",color:C.fg}}>{s.name}</Text><Text style={{fontSize:12,color:C.mutedFg,fontStyle:"italic"}}>"{s.motto}"</Text><Text style={{fontSize:12,color:C.fg,marginTop:10}}>{s.addressLine}</Text><Text style={{fontSize:12,color:C.fg}}>{s.state}, {s.country}</Text><Text style={{fontSize:11,color:C.mutedFg,marginTop:6}}>Established: {s.establishedYear}</Text></Card>
      <Text style={{fontSize:14,fontWeight:"600",color:C.fg,marginBottom:8}}>Academic Sessions</Text>
      {(d?.sessions||[]).map((session:any)=>(<Card key={session.id} style={{marginBottom:10}}><View style={{flexDirection:"row",gap:8,alignItems:"center",marginBottom:8}}><Text style={{fontSize:13,fontWeight:"600",color:C.fg}}>{session.sessionName}</Text>{session.isActive&&<View style={{backgroundColor:C.successBg,borderRadius:4,paddingHorizontal:6,paddingVertical:1}}><Text style={{fontSize:9,color:C.success,fontWeight:"600"}}>Active</Text></View>}</View><View style={{flexDirection:"row",gap:8}}>{(session.terms||[]).map((t:any)=>(<View key={t.id} style={{backgroundColor:C.muted,borderRadius:6,padding:8,flex:1}}><Text style={{fontSize:11,fontWeight:"500",color:C.fg}}>{t.termName}</Text>{t.isActive&&<Text style={{fontSize:9,color:C.success}}>● Active</Text>}<Text style={{fontSize:9,color:C.mutedFg,marginTop:2}}>{t.startDate?new Date(t.startDate).toLocaleDateString("en-GB",{day:"numeric",month:"short"}):"—"} → {t.endDate?new Date(t.endDate).toLocaleDateString("en-GB",{day:"numeric",month:"short"}):"—"}</Text></View>))}</View></Card>))}
      <Text style={{fontSize:14,fontWeight:"600",color:C.fg,marginBottom:8}}>Grading Scale (WAEC)</Text>
      <View style={{backgroundColor:C.card,borderRadius:10,borderWidth:1,borderColor:C.border,overflow:"hidden"}}>{(d?.gradingBoundaries||[]).map((b:any,i:number)=>(<Pressable key={b.id} onPress={()=>toast(`Grade ${b.grade}`,"info")} style={{padding:10,borderBottomWidth:i<8?1:0,borderBottomColor:C.border,flexDirection:"row",alignItems:"center"}}><Text style={{fontSize:13,fontWeight:"700",color:C.fg,width:32}}>{b.grade}</Text><Text style={{fontSize:12,color:C.fg,flex:1}}>{b.label}{b.isCredit?" ★":""}</Text><Text style={{fontSize:11,fontFamily:"monospace",color:C.mutedFg}}>{b.minPercent}-{b.maxPercent}%</Text></Pressable>))}</View>
    </View>
  );
}

// === SETTINGS ===
function SettingsScreen() {
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"general"|"audit">("general");
  useEffect(() => { apiFetch("/api/audit?limit=30").then(r => { setD(r); setLoading(false); }).catch(() => setLoading(false)); }, []);
  return (
    <View style={{ padding: 20, maxWidth: 700 }}>
      <PageHeader title="Settings" subtitle="System preferences and audit log" />
      <View style={{flexDirection:"row",gap:6,marginBottom:16}}>{(["general","audit"]as const).map(t=>(<Pressable key={t} onPress={()=>setTab(t)} style={{paddingHorizontal:14,paddingVertical:7,borderRadius:7,backgroundColor:tab===t?C.primary:C.muted}}><Text style={{fontSize:12,fontWeight:"600",color:tab===t?"#fff":C.mutedFg}}>{t==="general"?"General":"Audit Log"}</Text></Pressable>))}</View>
      {tab==="general"?<Card>{[["School name","Akoka Federal Academy"],["Academic year","2024/2025"],["Default grading","WAEC 9-point (A1–F9)"],["Language","English (Nigeria)"],["Timezone","Africa/Lagos"],["CA maximum","40"]].map(([k,v],i)=>(<View key={k} style={{flexDirection:"row",justifyContent:"space-between",paddingVertical:8,borderBottomWidth:i<5?1:0,borderBottomColor:C.border}}><Text style={{fontSize:12,color:C.mutedFg}}>{k}</Text><Text style={{fontSize:12,color:C.fg}}>{v}</Text></View>))}</Card>
      :loading?<Loading />:<View style={{backgroundColor:C.card,borderRadius:10,borderWidth:1,borderColor:C.border,overflow:"hidden"}}>{(d?.events||[]).slice(0,20).map((e:any,i:number)=>(<View key={e.id} style={{padding:10,borderBottomWidth:i<19?1:0,borderBottomColor:C.border}}><Text style={{fontSize:12,color:C.fg}}>{e.description}</Text><Text style={{fontSize:10,color:C.mutedFg,marginTop:2}}>{e.actor?.fullName||"System"} · {new Date(e.occurredAt).toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</Text></View>))}</View>}
    </View>
  );
}
