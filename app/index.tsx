import { useEffect, useState, ReactNode, useCallback } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Platform } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { apiFetch } from "@/lib/api";
import {
  C, Card, Badge, Btn, StatCard, SearchBar, Loading, EmptyState, PageHeader,
  WarnBox, Field, toast, ToastHost, DetailPanel, ModalDlg, Th, Td,
} from "@/components/ui";

// === NAVIGATION ===
type ScreenId = "dashboard" | "students" | "upload" | "review" | "report-cards" | "subjects-classes" | "assessments" | "users-permissions" | "school-config" | "settings";
let _screen: ScreenId = "dashboard";
const _listeners: Set<(s: ScreenId) => void> = new Set();
function useScreen() {
  const [s, setS] = useState<ScreenId>(_screen);
  const set = useCallback((n: ScreenId) => { _screen = n; setS(n); _listeners.forEach(l => l(n)); }, []);
  return { screen: s, setScreen: set };
}
const NAV: { id: ScreenId; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "students", label: "Students", icon: "🎓" },
  { id: "upload", label: "Upload Results", icon: "📤" },
  { id: "review", label: "Review & Compile", icon: "✅" },
  { id: "report-cards", label: "Report Cards", icon: "📄" },
  { id: "subjects-classes", label: "Subjects & Classes", icon: "📚" },
  { id: "assessments", label: "Assessments", icon: "📋" },
  { id: "users-permissions", label: "Users", icon: "👥" },
  { id: "school-config", label: "School Config", icon: "🏫" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export default function App() {
  const { screen, setScreen } = useScreen();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, flexDirection: "row", backgroundColor: C.bg }}>
        {/* SIDEBAR */}
        <View style={{ width: 232, backgroundColor: C.sidebar }}>
          <View style={{ padding: 16, flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 7, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 16 }}>🎓</Text>
            </View>
            <View><Text style={{ fontSize: 13, fontWeight: "700", color: "#fff" }}>Akoka Federal</Text><Text style={{ fontSize: 10, color: C.sidebarFg }}>Result Compiler</Text></View>
          </View>
          <ScrollView style={{ flex: 1, marginTop: 4 }}>
            {NAV.map(item => (
              <Pressable key={item.id} onPress={() => setScreen(item.id)} style={{ paddingHorizontal: 14, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: screen === item.id ? "rgba(255,255,255,0.08)" : "transparent", borderLeftWidth: 3, borderLeftColor: screen === item.id ? C.primaryLight : "transparent" }}>
                <Text style={{ fontSize: 15 }}>{item.icon}</Text>
                <Text style={{ fontSize: 12, fontWeight: screen === item.id ? "600" : "400", color: screen === item.id ? "#fff" : C.sidebarFg }}>{item.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)" }}>
            <Text style={{ fontSize: 10, color: C.sidebarFg }}>Demo · 140 students</Text>
          </View>
        </View>

        {/* MAIN AREA */}
        <View style={{ flex: 1 }}>
          {/* TOP BAR */}
          <View style={{ height: 50, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }}>
            <View><Text style={{ fontSize: 13, fontWeight: "600", color: C.fg }}>Good morning, Administrator</Text><Text style={{ fontSize: 10, color: C.mutedFg }}>2024/2025 · First Term</Text></View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ backgroundColor: C.muted, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, flexDirection: "row", gap: 4 }}><Text style={{ fontSize: 10, color: C.mutedFg }}>🔔 3</Text></View>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.primaryBg, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 10, fontWeight: "600", color: C.primary }}>AA</Text></View>
            </View>
          </View>

          {/* SCREEN CONTENT */}
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} horizontal={false}>
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
  if (!d) return <View style={{ padding: 24 }}><EmptyState icon="⚠" title="Failed to load" desc="Could not fetch dashboard data" /></View>;
  const c = d.counts || {};
  return (
    <View style={{ padding: 20, maxWidth: 1100 }}>
      <PageHeader title="Dashboard" subtitle="School-wide result compilation progress" />
      {/* Stats */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
        <StatCard label="Students" value={c.students||0} hint="across 15 arms" trend="+2" onPress={() => setScreen("students")} />
        <StatCard label="Teachers" value={c.teachers||0} hint="active staff" onPress={() => setScreen("users-permissions")} />
        <StatCard label="Batches" value={c.batches||0} hint={`${c.pendingReviewBatches||0} pending`} onPress={() => setScreen("upload")} />
        <StatCard label="Published" value={c.publishedCards||0} hint="report cards" trend="+5" onPress={() => setScreen("report-cards")} />
      </View>
      {/* Workflow */}
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: C.fg, marginBottom: 10 }}>Result Compilation Workflow</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {[{l:"Uploaded",v:c.batches||0},{l:"In Review",v:c.pendingReviewBatches||0},{l:"Verified",v:c.batches?Math.floor(c.batches*0.85):0},{l:"Compiled",v:1987},{l:"Published",v:c.publishedCards||0}].map((s,i) => (
            <Pressable key={i} onPress={() => setScreen(i<2?"upload":i===4?"report-cards":"review")} style={{ flex: 1, backgroundColor: C.muted, borderRadius: 8, padding: 10, alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: i===4?C.success:C.fg }}>{s.v}</Text>
              <Text style={{ fontSize: 10, color: C.mutedFg, marginTop: 2 }}>{s.l}</Text>
            </Pressable>
          ))}
        </View>
      </Card>
      {/* Alert */}
      {(c.pendingReviewBatches > 0) && <WarnBox text={`${c.pendingReviewBatches} batches have incomplete results or drafts awaiting review`} onPress={() => setScreen("review")} />}
      {/* Recent batches + Activity */}
      <View style={{ flexDirection: "row", gap: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: C.fg, marginBottom: 8 }}>Recent Uploads</Text>
          <View style={{ backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>
            {(d.recentBatches||[]).slice(0,5).map((b:any,i:number) => (
              <Pressable key={b.id} onPress={() => setScreen("review")} style={{ padding: 10, borderBottomWidth: i<4?1:0, borderBottomColor: C.border, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}><Text style={{ fontSize: 12, fontWeight: "500", color: C.fg }}>{b.classArm?.fullLabel} · {b.subject?.subjectName}</Text><Text style={{ fontSize: 10, color: C.mutedFg, marginTop: 1 }}>{b.batchRef} · {b.uploadedBy?.fullName}</Text></View>
                <Badge status={b.status} />
              </Pressable>
            ))}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: C.fg, marginBottom: 8 }}>Recent Activity</Text>
          <View style={{ backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>
            {(d.recentAuditEvents||[]).slice(0,5).map((e:any,i:number) => (
              <View key={e.id} style={{ padding: 10, borderBottomWidth: i<4?1:0, borderBottomColor: C.border }}>
                <Text style={{ fontSize: 12, color: C.fg }}>{e.description}</Text>
                <Text style={{ fontSize: 10, color: C.mutedFg, marginTop: 1 }}>{e.actor?.fullName||"System"} · {new Date(e.occurredAt).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</Text>
              </View>
            ))}
          </View>
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
  function openStudent(s:any) {
    setSel(s); setScoresLoading(true);
    apiFetch(`/api/students/${s.id}/scores`).then(r => { setScores(r); setScoresLoading(false); }).catch(() => setScoresLoading(false));
  }
  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      {/* LEFT: List */}
      <View style={{ flex: 1, padding: 20 }}>
        <PageHeader title="Students" subtitle={`${students.length} of ${d?.students?.length||0}`} actions={<Btn title="Add Student" icon="+" size="sm" onPress={() => toast("Add student form would open","info")} />} />
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}><SearchBar value={search} onChange={setSearch} placeholder="Search by name or admission number…" /></View>
        {loading ? <Loading /> : students.length === 0 ? <EmptyState icon="🎓" title="No students" desc="Try a different search" /> : (
          <View style={{ backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>
            <View style={{ flexDirection: "row", backgroundColor: C.muted, paddingVertical: 6, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.border }}>
              <Th width={120}>Admission #</Th><Th>Student</Th><Th width={100}>Class</Th><Th width={60}>Gender</Th>
            </View>
            {students.slice(0,40).map((s:any,i:number) => {
              const arm = s.classMemberships?.[0]?.classArm;
              return (
                <Pressable key={s.id} onPress={() => openStudent(s)} style={{ flexDirection: "row", paddingHorizontal: 8, paddingVertical: 8, borderBottomWidth: i<39?1:0, borderBottomColor: C.border, backgroundColor: sel?.id===s.id?C.primaryBg:"transparent", alignItems: "center" }}>
                  <View style={{ width: 120 }}><Text style={{ fontSize: 11, fontFamily: "monospace", color: C.mutedFg }}>{s.admissionNumber}</Text></View>
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.muted, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 10, color: C.mutedFg }}>{(s.surname[0]||"")}{(s.firstName[0]||"")}</Text></View>
                    <View><Text style={{ fontSize: 12, fontWeight: "500", color: C.fg }}>{s.surname}, {s.firstName}</Text>{s.otherNames && <Text style={{ fontSize: 10, color: C.mutedFg }}>{s.otherNames}</Text>}</View>
                  </View>
                  <View style={{ width: 100 }}><Text style={{ fontSize: 11, color: C.mutedFg }}>{arm?.fullLabel||"—"}</Text></View>
                  <View style={{ width: 60 }}><Text style={{ fontSize: 11, color: C.mutedFg }}>{s.gender||"—"}</Text></View>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
      {/* RIGHT: Detail panel */}
      <DetailPanel visible={!!sel} onClose={() => setSel(null)} title="Student Detail"
        footer={<><Btn title="Edit" variant="outline" size="sm" onPress={() => toast("Edit form would open","info")} /><Btn title="Report Card" size="sm" onPress={() => { setSel(null); setScreen("report-cards"); }} /></>}
      >
        {sel && (
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.primaryBg, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 14, fontWeight: "600", color: C.primary }}>{(sel.surname[0]||"")}{(sel.firstName[0]||"")}</Text></View>
              <View><Text style={{ fontSize: 15, fontWeight: "700", color: C.fg }}>{sel.surname}, {sel.firstName}</Text><Text style={{ fontSize: 11, color: C.mutedFg }}>{sel.admissionNumber} · {sel.gender} · {sel.stateOfOrigin}</Text></View>
            </View>
            {sel.guardianName && <View style={{ marginBottom: 8 }}><Text style={{ fontSize: 10, color: C.mutedFg, fontWeight: "600" }}>GUARDIAN</Text><Text style={{ fontSize: 12, color: C.fg }}>{sel.guardianName}</Text>{sel.guardianPhone && <Text style={{ fontSize: 11, color: C.mutedFg }}>{sel.guardianPhone}</Text>}</View>}
            <Text style={{ fontSize: 12, fontWeight: "600", color: C.fg, marginTop: 12, marginBottom: 4 }}>Verified Scores — First Term</Text>
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
          </View>
        )}
      </DetailPanel>
      {/* Revise modal */}
      <ModalDlg visible={!!revising} onClose={() => setRevising(null)} title="Revise Score" size="sm"
        footer={<><Btn title="Cancel" variant="outline" size="sm" onPress={() => setRevising(null)} /><Btn title="Save" size="sm" onPress={() => { toast("Score revised","success"); setTimeout(()=>toast("Recompile: subject + positions + report card","info"),300); setRevising(null); }} /></>}
      >
        {revising && <View>
          <View style={{ backgroundColor: C.muted, borderRadius: 8, padding: 10, marginBottom: 10 }}>
            <Text style={{ fontSize: 11, color: C.mutedFg }}>Subject</Text><Text style={{ fontSize: 12, fontWeight: "500", color: C.fg }}>{revising.subjectName} — {revising.componentName}</Text>
            <Text style={{ fontSize: 11, color: C.mutedFg, marginTop: 4 }}>Current: <Text style={{ fontFamily: "monospace", fontWeight: "600" }}>{revising.value}/{revising.maximumMark}</Text></Text>
          </View>
          <Field label="New Score Value" value="" onChange={() => {}} type="number" placeholder={`0 – ${revising.maximumMark}`} />
          <Field label="Reason for Revision (required)" value="" onChange={() => {}} placeholder="e.g. Rechecked the script" multiline />
          <View style={{ backgroundColor: C.warningBg, borderRadius: 8, padding: 10 }}><Text style={{ fontSize: 10, color: C.warning, fontWeight: "500" }}>⚠ Triggers: recompile subject → recompute class positions → supersede report card</Text></View>
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
  function extract() {
    if (!file) { toast("Select a file first","error"); return; }
    setStep(2);
    apiFetch("/api/students?limit=10").then(r => {
      const comps = [{n:"Assignment",m:10},{n:"Test 1",m:10},{n:"Test 2",m:10},{n:"Mid-Term",m:10},{n:"Examination",m:60}];
      setRows((r.students||[]).slice(0,8).map((s:any) => {
        const v:any = {}; comps.forEach(c => v[c.n] = Math.floor(Math.random()*c.m*0.8)+1);
        const unmatched = src==="SCANNED_PAPER" && Math.random()<0.1;
        return { id:s.id, name: unmatched?`${s.surname.replace(/a$/,"ah")} ${s.firstName}`:`${s.surname} ${s.firstName}`, adm: unmatched?s.admissionNumber.replace(/\d$/,"X"):s.admissionNumber, matched:!unmatched, v };
      }));
    });
  }
  function confirm() {
    if (rows.some(r=>!r.matched)) { toast("Fix unmatched students first","error"); return; }
    setStep(3); toast("Scores saved as verified!","success");
    setTimeout(()=>toast("Compiling totals + positions…","info"),300);
    setTimeout(()=>{ setStep(0); },2500);
  }
  if (step > 0) {
    return (
      <View style={{ padding: 20, maxWidth: 700 }}>
        <View style={{ flexDirection: "row", gap: 6, marginBottom: 16 }}>
          {["Pick File","Preview & Edit","Confirm"].map((l,i) => (
            <View key={l} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: step>i+1?C.success:step===i+1?C.primary:C.muted, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 9, color: "#fff", fontWeight: "700" }}>{step>i+1?"✓":i+1}</Text></View>
              <Text style={{ fontSize: 10, fontWeight: "500", color: step>=i+1?C.fg:C.mutedFg }}>{l}</Text>
              {i<2 && <Text style={{ color: C.mutedFg, fontSize: 10 }}>→</Text>}
            </View>
          ))}
        </View>
        {step===1 && <View>
          <Text style={{ fontSize: 16, fontWeight: "700", color: C.fg, marginBottom: 12 }}>Upload Scores</Text>
          <Text style={{ fontSize: 11, fontWeight: "600", color: C.mutedFg, marginBottom: 6 }}>Source Type</Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
            {(["SPREADSHEET","SCANNED_PAPER"] as const).map(t => (
              <Pressable key={t} onPress={() => setSrc(t)} style={{ flex:1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: src===t?C.primary:C.border, backgroundColor: src===t?C.primaryBg:C.card, alignItems: "center" }}>
                <Text style={{ fontSize: 18 }}>{t==="SPREADSHEET"?"📊":"📠"}</Text><Text style={{ fontSize: 11, fontWeight: "500", color: src===t?C.primary:C.mutedFg, marginTop: 4 }}>{t==="SPREADSHEET"?"Excel / CSV":"Scanned Paper"}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={{ fontSize: 11, fontWeight: "600", color: C.mutedFg, marginBottom: 6 }}>File</Text>
          <Pressable onPress={() => setFile(src==="SPREADSHEET"?"english_jss1a.xlsx":"math_ss2_science_scan.pdf")} style={{ borderWidth: 2, borderStyle: "dashed", borderColor: C.border, borderRadius: 8, padding: 20, alignItems: "center", backgroundColor: C.muted }}>
            {file ? <Text style={{ fontSize: 13, fontWeight: "500", color: C.primary }}>📄 {file}</Text> : <><Text style={{ fontSize: 20 }}>📤</Text><Text style={{ fontSize: 12, color: C.fg, marginTop: 4 }}>Click to select a file</Text></>}
          </Pressable>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 16 }}><Btn title="Cancel" variant="outline" size="sm" onPress={() => setStep(0)} /><Btn title="Upload & Extract" icon="📤" size="sm" onPress={extract} disabled={!file} /></View>
        </View>}
        {step===2 && <View>
          <Text style={{ fontSize: 16, fontWeight: "700", color: C.fg, marginBottom: 4 }}>Preview & Edit</Text>
          <Text style={{ fontSize: 11, color: C.mutedFg, marginBottom: 12 }}>Every cell is editable. Fix mistakes, then confirm.</Text>
          {rows.length===0 ? <Loading /> : <View style={{ backgroundColor: C.card, borderRadius: 8, borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>
            <View style={{ flexDirection: "row", backgroundColor: C.muted, paddingVertical: 6, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.border }}>
              <Th width={140}>Student</Th><Th width={50}>Assign</Th><Th width={50}>Test 1</Th><Th width={50}>Test 2</Th><Th width={50}>Mid-T</Th><Th width={50}>Exam</Th>
            </View>
            {rows.map((r,i) => (
              <View key={i} style={{ flexDirection: "row", paddingHorizontal: 8, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: r.matched?"transparent":C.warningBg, alignItems: "center" }}>
                <View style={{ width: 140 }}><Text style={{ fontSize: 11, color: C.fg }}>{r.name}</Text><Text style={{ fontSize: 9, color: r.matched?C.mutedFg:C.warning, fontFamily: "monospace" }}>{r.adm}{!r.matched && " ⚠"}</Text></View>
                {["Assignment","Test 1","Test 2","Mid-Term","Examination"].map(c => <TextInput key={c} defaultValue={String(r.v[c]||"")} style={{ width: 50, textAlign: "center", fontSize: 11, fontFamily: "monospace", borderWidth: 1, borderColor: C.border, borderRadius: 4, paddingVertical: 2 }} keyboardType="numeric" />)}
              </View>
            ))}
          </View>}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}><Btn title="Back" variant="outline" size="sm" onPress={() => setStep(1)} /><Btn title={`Confirm ${rows.length} Scores`} icon="✓" size="sm" onPress={confirm} disabled={rows.some(r=>!r.matched)} /></View>
          {rows.some(r=>!r.matched) && <Text style={{ fontSize: 10, color: C.warning, marginTop: 6 }}>⚠ Fix unmatched students before confirming.</Text>}
        </View>}
        {step===3 && <View style={{ alignItems: "center", paddingVertical: 40 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.successBg, alignItems: "center", justifyContent: "center", marginBottom: 12 }}><Text style={{ fontSize: 24, color: C.success }}>✓</Text></View>
          <Text style={{ fontSize: 15, fontWeight: "700", color: C.fg }}>Verified Scores Saved</Text>
          <Text style={{ fontSize: 11, color: C.mutedFg, marginTop: 8 }}>• Subject totals computed{"\n"}• Class positions recomputed{"\n"}• Report cards superseded</Text>
        </View>}
      </View>
    );
  }
  return (
    <View style={{ padding: 20, maxWidth: 1000 }}>
      <PageHeader title="Upload Results" subtitle={`${d?.batches?.length||0} batches`} actions={<Btn title="New Upload" icon="📤" size="sm" onPress={() => setStep(1)} />} />
      {loading ? <Loading /> : <View style={{ backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>
        <View style={{ flexDirection: "row", backgroundColor: C.muted, paddingVertical: 6, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.border }}>
          <Th width={120}>Batch</Th><Th>Class · Subject</Th><Th width={100}>Teacher</Th><Th width={50}>Rows</Th><Th width={90}>Status</Th>
        </View>
        {(d?.batches||[]).slice(0,25).map((b:any,i:number) => (
          <Pressable key={b.id} onPress={() => setScreen("review")} style={{ flexDirection: "row", paddingHorizontal: 8, paddingVertical: 7, borderBottomWidth: i<24?1:0, borderBottomColor: C.border, alignItems: "center" }}>
            <View style={{ width: 120 }}><Text style={{ fontSize: 11, fontFamily: "monospace", color: C.fg }}>{b.batchRef}</Text></View>
            <View style={{ flex: 1 }}><Text style={{ fontSize: 12, color: C.fg }}>{b.classArm?.fullLabel} · {b.subject?.subjectName}</Text></View>
            <View style={{ width: 100 }}><Text style={{ fontSize: 10, color: C.mutedFg }}>{b.uploadedBy?.fullName}</Text></View>
            <View style={{ width: 50 }}><Text style={{ fontSize: 11, fontFamily: "monospace", color: C.mutedFg }}>{b._count?.verifiedScores||b._count?.scoreDrafts||0}</Text></View>
            <View style={{ width: 90 }}><Badge status={b.status} /></View>
          </Pressable>
        ))}
      </View>}
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
  const drafts = (d?.drafts||[]).filter((dr:any) => !search || dr.studentNameRaw.toLowerCase().includes(search.toLowerCase()) || dr.batch?.batchRef.toLowerCase().includes(search.toLowerCase()));
  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <PageHeader title="Review & Compile" subtitle={`${drafts.length} drafts need review`} />
        {d && <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          <StatCard label="Drafts" value={drafts.length} />
          <StatCard label="Unmatched" value={drafts.filter((d:any)=>!d.studentId).length} />
          <StatCard label="Invalid" value={drafts.filter((d:any)=>d.status==="FLAGGED_INVALID").length} />
          <StatCard label="Uncertain" value={drafts.filter((d:any)=>d.status==="FLAGGED_UNCERTAIN").length} />
        </View>}
        <View style={{ marginBottom: 12 }}><SearchBar value={search} onChange={setSearch} placeholder="Search drafts…" /></View>
        {loading ? <Loading /> : drafts.length===0 ? <EmptyState icon="✅" title="No drafts" desc="All scores confirmed" /> : (
          <View style={{ backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>
            {drafts.slice(0,25).map((dr:any,i:number) => (
              <Pressable key={dr.id} onPress={() => setEditing(dr)} style={{ padding: 10, borderBottomWidth: i<24?1:0, borderBottomColor: C.border, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}><Text style={{ fontSize: 12, fontWeight: "500", color: C.fg }}>{dr.studentNameRaw}</Text><Text style={{ fontSize: 10, color: C.mutedFg, marginTop: 1 }}>{dr.batch?.batchRef} · {dr.batch?.classArm?.fullLabel} · {dr.batch?.subject?.subjectName} · {dr.assessmentComponent?.componentName}</Text></View>
                <View style={{ alignItems: "flex-end", gap: 3 }}><Text style={{ fontSize: 12, fontFamily: "monospace", color: C.fg }}>{dr.enteredValue}/{dr.assessmentComponent?.maximumMark}</Text><Badge status={dr.status} /></View>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <DetailPanel visible={!!editing} onClose={() => setEditing(null)} title="Review Draft"
        footer={<><Btn title="Reject" variant="danger" size="sm" onPress={() => { toast("Draft rejected","info"); setEditing(null); }} /><Btn title="Confirm" size="sm" onPress={() => { toast("Draft confirmed","success"); setEditing(null); }} /></>}
      >
        {editing && <View>
          <View style={{ backgroundColor: C.muted, borderRadius: 8, padding: 10, marginBottom: 10 }}>
            <Text style={{ fontSize: 11, color: C.mutedFg }}>Student</Text><Text style={{ fontSize: 12, fontWeight: "500", color: C.fg }}>{editing.studentNameRaw}</Text>
            <Text style={{ fontSize: 11, color: C.mutedFg, marginTop: 6 }}>Component</Text><Text style={{ fontSize: 12, color: C.fg }}>{editing.assessmentComponent?.componentName} (max {editing.assessmentComponent?.maximumMark})</Text>
            <Text style={{ fontSize: 11, color: C.mutedFg, marginTop: 6 }}>Batch</Text><Text style={{ fontSize: 11, fontFamily: "monospace", color: C.fg }}>{editing.batch?.batchRef}</Text>
          </View>
          <Field label="Score Value" value={String(editing.enteredValue||"")} onChange={() => {}} type="number" />
          <Field label="Reviewer Note" value="" onChange={() => {}} placeholder="Note for audit log…" multiline />
        </View>}
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
  const cards = (d?.cards||[]).filter((c:any) => !search || `${c.student?.surname} ${c.student?.firstName}`.toLowerCase().includes(search.toLowerCase()) || c.student?.admissionNumber.includes(search));
  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <PageHeader title="Report Cards" subtitle={`${cards.length} cards`} />
        {d && <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          <StatCard label="Total" value={cards.length} />
          <StatCard label="Published" value={cards.filter((c:any)=>c.status==="PUBLISHED").length} />
          <StatCard label="Approved" value={cards.filter((c:any)=>c.status==="APPROVED").length} />
          <StatCard label="Draft" value={cards.filter((c:any)=>c.status==="DRAFT").length} />
        </View>}
        <View style={{ marginBottom: 12 }}><SearchBar value={search} onChange={setSearch} placeholder="Search by name or admission #" /></View>
        {loading ? <Loading /> : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {cards.slice(0,20).map((c:any) => {
              const pos = c.classPositions?.[0]; const arm = c.student?.classMemberships?.[0]?.classArm;
              return (
                <Pressable key={c.id} onPress={() => setPreview(c)} style={{ backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14, width: 220 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                    <View style={{ flex: 1 }}><Text style={{ fontSize: 12, fontWeight: "600", color: C.fg }}>{c.student?.surname}, {c.student?.firstName}</Text><Text style={{ fontSize: 10, color: C.mutedFg, fontFamily: "monospace" }}>{c.student?.admissionNumber}</Text><Text style={{ fontSize: 10, color: C.mutedFg }}>{arm?.fullLabel}</Text></View>
                    <Badge status={c.status} />
                  </View>
                  <View style={{ flexDirection: "row", gap: 10, marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: C.border }}>
                    <Text style={{ fontSize: 10, color: C.mutedFg }}>Pos: {pos?`${pos.position}/${pos.numStudentsInArm}`:"—"}</Text>
                    <Text style={{ fontSize: 10, color: C.mutedFg }}>Avg: {pos?pos.averageScore?.toFixed(1):"—"}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
      <DetailPanel visible={!!preview} onClose={() => setPreview(null)} title="Report Card" width={420}
        footer={<>
          <Btn title="Edit Scores" variant="outline" size="sm" onPress={() => { setPreview(null); setScreen("students"); toast("Go to Students → click student → revise scores","info"); }} />
          {preview?.status==="READY_FOR_REVIEW" && <Btn title="Approve" icon="✓" size="sm" onPress={() => { toast("Report card approved","success"); setPreview(null); }} />}
          {preview?.status==="APPROVED" && <Btn title="Publish" icon="📤" size="sm" onPress={() => { toast("Report card published","success"); setPreview(null); }} />}
        </>}
      >
        {preview && <View>
          <View style={{ paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: C.primary, marginBottom: 12 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: C.fg }}>Akoka Federal Academy</Text>
            <Text style={{ fontSize: 10, color: C.mutedFg }}>Akoka, Yaba, Lagos · Est. 1985</Text>
            <Text style={{ fontSize: 9, color: C.mutedFg, fontStyle: "italic" }}>"Knowledge · Discipline · Service"</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <View style={{ flex: 1 }}><Text style={{ fontSize: 9, color: C.mutedFg }}>STUDENT</Text><Text style={{ fontSize: 12, fontWeight: "500", color: C.fg }}>{preview.student?.surname}, {preview.student?.firstName}</Text></View>
            <View><Text style={{ fontSize: 9, color: C.mutedFg }}>ADMISSION #</Text><Text style={{ fontSize: 12, fontFamily: "monospace", color: C.fg }}>{preview.student?.admissionNumber}</Text></View>
          </View>
          <View style={{ backgroundColor: C.muted, borderRadius: 8, padding: 10, marginBottom: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: C.fg, marginBottom: 4 }}>Subject Results</Text>
            <Text style={{ fontSize: 10, color: C.mutedFg }}>Compiled output — not directly editable. Edit source scores to change.</Text>
          </View>
          <View style={{ backgroundColor: C.warningBg, borderRadius: 8, padding: 10 }}>
            <Text style={{ fontSize: 10, color: C.warning }}>⚠ Subject results are derived from verified scores. To change a grade, revise the source score → system recompiles.</Text>
          </View>
        </View>}
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
        {/* Class cards */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {(d?.classes||[]).map((cls:any) => (
            <Pressable key={cls.id} onPress={() => setExpanded(expanded===cls.id?null:cls.id)} style={{ backgroundColor: C.card, borderRadius: 8, borderWidth: 1, borderColor: C.border, padding: 10, minWidth: 150 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: C.fg }}>{cls.className}</Text>
                <Text style={{ fontSize: 10, color: C.mutedFg }}>{cls.classArms?.length} arms</Text>
              </View>
              {expanded===cls.id && <View style={{ marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: C.border }}>
                {cls.classArms?.map((a:any) => <Text key={a.id} style={{ fontSize: 11, color: C.fg, paddingVertical: 2 }}>{a.fullLabel}{a.track && <Text style={{ color: C.mutedFg }}> · {a.track.name.toLowerCase()}</Text>}</Text>)}
              </View>}
            </Pressable>
          ))}
        </View>
        <View style={{ marginBottom: 12 }}><SearchBar value={search} onChange={setSearch} placeholder="Search subjects…" /></View>
        {loading ? <Loading /> : <View style={{ backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>
          {subjects.map((s:any,i:number) => (
            <Pressable key={s.id} onPress={() => setSel(s)} style={{ flexDirection: "row", paddingHorizontal: 8, paddingVertical: 7, borderBottomWidth: i<subjects.length-1?1:0, borderBottomColor: C.border, alignItems: "center" }}>
              <Text style={{ fontSize: 11, fontFamily: "monospace", color: C.mutedFg, width: 40 }}>{s.subjectCode}</Text>
              <Text style={{ fontSize: 12, color: C.fg, flex: 1 }}>{s.subjectName}</Text>
              <View style={{ backgroundColor: C.muted, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1, marginRight: 6 }}><Text style={{ fontSize: 9, color: C.mutedFg }}>{s.category}</Text></View>
              {s.isCore && <View style={{ backgroundColor: C.primaryBg, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}><Text style={{ fontSize: 9, color: C.primary, fontWeight: "600" }}>Core</Text></View>}
            </Pressable>
          ))}
        </View>}
      </View>
      <DetailPanel visible={!!sel} onClose={() => setSel(null)} title="Subject Detail"
        footer={<><Btn title="Edit" variant="outline" size="sm" onPress={() => toast("Edit form would open","info")} /><Btn title="Close" size="sm" onPress={() => setSel(null)} /></>}
      >
        {sel && <View>
          <Text style={{ fontSize: 16, fontWeight: "700", color: C.fg }}>{sel.subjectName}</Text>
          <Text style={{ fontSize: 11, color: C.mutedFg, fontFamily: "monospace" }}>Code: {sel.subjectCode}</Text>
          <View style={{ marginTop: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.border }}><Text style={{ fontSize: 11, color: C.mutedFg }}>Category</Text><Text style={{ fontSize: 12, color: C.fg }}>{sel.category}</Text></View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.border }}><Text style={{ fontSize: 11, color: C.mutedFg }}>Track</Text><Text style={{ fontSize: 12, color: C.fg }}>{sel.track?.name||"—"}</Text></View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.border }}><Text style={{ fontSize: 11, color: C.mutedFg }}>Core</Text><Text style={{ fontSize: 12, color: C.fg }}>{sel.isCore?"Yes":"No"}</Text></View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}><Text style={{ fontSize: 11, color: C.mutedFg }}>Levels</Text><Text style={{ fontSize: 12, color: C.fg }}>{[sel.isOfferedJSS&&"JSS",sel.isOfferedSS&&"SS"].filter(Boolean).join(", ")||"—"}</Text></View>
          </View>
        </View>}
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
        {loading ? <Loading /> : (
          <View style={{ backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>
            <View style={{ flexDirection: "row", backgroundColor: C.muted, paddingVertical: 6, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.border }}>
              <Th width={50}>Code</Th><Th>Subject</Th><Th width={100}>Class</Th><Th width={60}>CA</Th><Th width={60}>Exam</Th><Th width={60}>Total</Th>
            </View>
            {(d?.configs||[]).slice(0,25).map((cfg:any,i:number) => {
              const ca = (cfg.components||[]).filter((c:any)=>c.componentType==="CONTINUOUS_ASSESSMENT").reduce((s:number,c:any)=>s+c.maximumMark,0);
              return (
                <Pressable key={cfg.id} onPress={() => setSel(cfg)} style={{ flexDirection: "row", paddingHorizontal: 8, paddingVertical: 7, borderBottomWidth: i<24?1:0, borderBottomColor: C.border, alignItems: "center", backgroundColor: sel?.id===cfg.id?C.primaryBg:"transparent" }}>
                  <View style={{ width: 50 }}><Text style={{ fontSize: 11, fontFamily: "monospace", color: C.mutedFg }}>{cfg.subject?.subjectCode}</Text></View>
                  <View style={{ flex: 1 }}><Text style={{ fontSize: 12, color: C.fg }}>{cfg.subject?.subjectName}</Text></View>
                  <View style={{ width: 100 }}><Text style={{ fontSize: 11, color: C.mutedFg }}>{cfg.classArm?.fullLabel}</Text></View>
                  <View style={{ width: 60 }}><Text style={{ fontSize: 11, fontFamily: "monospace", color: C.fg }}>{ca}/40</Text></View>
                  <View style={{ width: 60 }}><Text style={{ fontSize: 11, fontFamily: "monospace", color: C.fg }}>60</Text></View>
                  <View style={{ width: 60 }}><Text style={{ fontSize: 11, fontFamily: "monospace", color: C.primary, fontWeight: "600" }}>100</Text></View>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
      <DetailPanel visible={!!sel} onClose={() => setSel(null)} title="Assessment Detail"
        footer={<><Btn title="Close" variant="outline" size="sm" onPress={() => setSel(null)} /><Btn title="Save Changes" size="sm" onPress={() => { toast("Changes saved","success"); setSel(null); }} /></>}
      >
        {sel && <View>
          <Text style={{ fontSize: 15, fontWeight: "700", color: C.fg }}>{sel.subject?.subjectName}</Text>
          <Text style={{ fontSize: 11, color: C.mutedFg }}>{sel.classArm?.fullLabel} · CA 40 + Exam 60 = 100</Text>
          <Text style={{ fontSize: 12, fontWeight: "600", color: C.fg, marginTop: 14, marginBottom: 6 }}>Components</Text>
          {(sel.components||[]).map((c:any) => (
            <View key={c.id} style={{ backgroundColor: C.muted, borderRadius: 7, padding: 10, marginBottom: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View><Text style={{ fontSize: 12, color: C.fg }}>{c.componentName}</Text>{c.componentType==="EXAMINATION" && <Badge status="VERIFIED" />}</View>
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <Text style={{ fontSize: 12, fontFamily: "monospace", color: C.mutedFg }}>{c.maximumMark} mk</Text>
                <Pressable onPress={() => toast("Edit component","info")}><Text style={{ fontSize: 12 }}>✎</Text></Pressable>
                {c.componentType!=="EXAMINATION" && <Pressable onPress={() => toast("Delete component?","warning")}><Text style={{ fontSize: 12, color: C.destructive }}>🗑</Text></Pressable>}
              </View>
            </View>
          ))}
          <View style={{ borderTopWidth: 1, borderTopColor: C.border, marginTop: 8, paddingTop: 8 }}>
            <View style={{ flexDirection: "row", gap: 10 }}><Text style={{ fontSize: 11, color: C.mutedFg }}>CA total: {(sel.components||[]).filter((c:any)=>c.componentType==="CONTINUOUS_ASSESSMENT").reduce((s:number,c:any)=>s+c.maximumMark,0)}/40</Text><Text style={{ fontSize: 11, color: C.mutedFg }}>Exam: 60</Text><Text style={{ fontSize: 11, color: C.primary, fontWeight: "600" }}>Overall: 100</Text></View>
          </View>
        </View>}
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
        {d && <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          <StatCard label="Total" value={d.users?.length||0} />
          <StatCard label="Active" value={(d.users||[]).filter((u:any)=>u.isActive).length} />
          <StatCard label="Teachers" value={(d.users||[]).filter((u:any)=>u.role==="TEACHER").length} />
          <StatCard label="Admins" value={(d.users||[]).filter((u:any)=>u.role==="ADMIN").length} />
        </View>}
        {loading ? <Loading /> : <View style={{ backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>
          {(d?.users||[]).map((u:any,i:number) => {
            const ft = (u.teacherAssignments||[]).find((a:any)=>a.assignmentType==="FORM_TEACHER");
            const sc = (u.teacherAssignments||[]).filter((a:any)=>a.assignmentType==="SUBJECT_TEACHING").length;
            return (
              <Pressable key={u.id} onPress={() => setSel(u)} style={{ padding: 10, borderBottomWidth: i<(d.users.length-1)?1:0, borderBottomColor: C.border, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: sel?.id===u.id?C.primaryBg:"transparent" }}>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.primaryBg, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 10, fontWeight: "600", color: C.primary }}>{u.fullName?.split(" ").map((n:string)=>n[0]).slice(0,2).join("")}</Text></View>
                <View style={{ flex: 1 }}><Text style={{ fontSize: 12, fontWeight: "500", color: C.fg }}>{u.fullName}</Text><Text style={{ fontSize: 10, color: C.mutedFg }}>{u.email}</Text></View>
                {ft && <Text style={{ fontSize: 10, color: C.mutedFg }}>FT: {ft.classArm?.fullLabel}</Text>}
                <Text style={{ fontSize: 10, color: C.mutedFg }}>{sc} subs</Text>
                <Badge status={u.role} />
              </Pressable>
            );
          })}
        </View>}
      </View>
      <DetailPanel visible={!!sel} onClose={() => setSel(null)} title="User Detail"
        footer={<><Btn title="Edit" variant="outline" size="sm" onPress={() => toast("Edit form would open","info")} /><Btn title="Close" size="sm" onPress={() => setSel(null)} /></>}
      >
        {sel && <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.primaryBg, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 12, fontWeight: "600", color: C.primary }}>{sel.fullName?.split(" ").map((n:string)=>n[0]).slice(0,2).join("")}</Text></View>
            <View><Text style={{ fontSize: 14, fontWeight: "700", color: C.fg }}>{sel.fullName}</Text><Text style={{ fontSize: 11, color: C.mutedFg }}>{sel.email}</Text></View>
            <View style={{ marginLeft: "auto" }}><Badge status={sel.role} /></View>
          </View>
          {sel.phone && <Text style={{ fontSize: 11, color: C.mutedFg, marginBottom: 8 }}>📞 {sel.phone}</Text>}
          <Text style={{ fontSize: 12, fontWeight: "600", color: C.fg, marginTop: 8, marginBottom: 6 }}>Assignments</Text>
          {(sel.teacherAssignments||[]).slice(0,8).map((a:any) => (
            <View key={a.id} style={{ backgroundColor: C.muted, borderRadius: 6, padding: 8, marginBottom: 4, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 11, color: C.fg }}>{a.subject ? `${a.subject.subjectName} (${a.subject.subjectCode})` : "Form Teacher"}</Text>
              <Text style={{ fontSize: 10, color: C.mutedFg }}>{a.classArm?.fullLabel}</Text>
            </View>
          ))}
          {(sel.teacherAssignments||[]).length > 8 && <Text style={{ fontSize: 10, color: C.mutedFg }}>+{sel.teacherAssignments.length - 8} more</Text>}
        </View>}
      </DetailPanel>
    </View>
  );
}

// === SCHOOL CONFIG ===
function SchoolConfigScreen() {
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiFetch("/api/school-config").then(r => { setD(r); setLoading(false); }).catch(() => setLoading(false)); }, []);
  if (loading) return <View style={{ padding: 24 }}><Loading /></View>;
  const s = d?.school || {};
  return (
    <View style={{ padding: 20, maxWidth: 800 }}>
      <PageHeader title="School Configuration" subtitle="School identity, sessions, grading" actions={<Btn title="Edit School" variant="outline" size="sm" onPress={() => toast("Edit school form would open","info")} />} />
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: C.fg }}>{s.name}</Text>
        <Text style={{ fontSize: 12, color: C.mutedFg, fontStyle: "italic" }}>"{s.motto}"</Text>
        <Text style={{ fontSize: 12, color: C.fg, marginTop: 10 }}>{s.addressLine}</Text>
        <Text style={{ fontSize: 12, color: C.fg }}>{s.state}, {s.country}</Text>
        <Text style={{ fontSize: 11, color: C.mutedFg, marginTop: 6 }}>Established: {s.establishedYear}</Text>
      </Card>
      <Text style={{ fontSize: 14, fontWeight: "600", color: C.fg, marginBottom: 8 }}>Academic Sessions</Text>
      {(d?.sessions||[]).map((session:any) => (
        <Card key={session.id} style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: C.fg }}>{session.sessionName}</Text>
            {session.isActive && <View style={{ backgroundColor: C.successBg, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 }}><Text style={{ fontSize: 9, color: C.success, fontWeight: "600" }}>Active</Text></View>}
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(session.terms||[]).map((t:any) => (
              <View key={t.id} style={{ backgroundColor: C.muted, borderRadius: 6, padding: 8, flex: 1 }}>
                <Text style={{ fontSize: 11, fontWeight: "500", color: C.fg }}>{t.termName}</Text>
                {t.isActive && <Text style={{ fontSize: 9, color: C.success }}>● Active</Text>}
                <Text style={{ fontSize: 9, color: C.mutedFg, marginTop: 2 }}>{t.startDate?new Date(t.startDate).toLocaleDateString("en-GB",{day:"numeric",month:"short"}):"—"} → {t.endDate?new Date(t.endDate).toLocaleDateString("en-GB",{day:"numeric",month:"short"}):"—"}</Text>
              </View>
            ))}
          </View>
        </Card>
      ))}
      <Text style={{ fontSize: 14, fontWeight: "600", color: C.fg, marginBottom: 8 }}>Grading Scale (WAEC)</Text>
      <View style={{ backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>
        {(d?.gradingBoundaries||[]).map((b:any,i:number) => (
          <Pressable key={b.id} onPress={() => toast(`Grade ${b.grade} — ${b.label} (${b.minPercent}-${b.maxPercent}%)`,"info")} style={{ padding: 10, borderBottomWidth: i<8?1:0, borderBottomColor: C.border, flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: C.fg, width: 32 }}>{b.grade}</Text>
            <Text style={{ fontSize: 12, color: C.fg, flex: 1 }}>{b.label}{b.isCredit?" ★":""}</Text>
            <Text style={{ fontSize: 11, fontFamily: "monospace", color: C.mutedFg }}>{b.minPercent}-{b.maxPercent}%</Text>
          </Pressable>
        ))}
      </View>
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
      <View style={{ flexDirection: "row", gap: 6, marginBottom: 16 }}>
        {(["general","audit"] as const).map(t => (
          <Pressable key={t} onPress={() => setTab(t)} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 7, backgroundColor: tab===t?C.primary:C.muted }}>
            <Text style={{ fontSize: 12, fontWeight: "600", color: tab===t?"#fff":C.mutedFg }}>{t==="general"?"General":"Audit Log"}</Text>
          </Pressable>
        ))}
      </View>
      {tab==="general" ? (
        <Card>
          {[
            ["School name","Akoka Federal Academy"],["Academic year","2024/2025"],["Default grading","WAEC 9-point (A1–F9)"],
            ["Language","English (Nigeria)"],["Timezone","Africa/Lagos"],["CA maximum","40"]
          ].map(([k,v],i) => (
            <View key={k} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: i<5?1:0, borderBottomColor: C.border }}>
              <Text style={{ fontSize: 12, color: C.mutedFg }}>{k}</Text><Text style={{ fontSize: 12, color: C.fg }}>{v}</Text>
            </View>
          ))}
        </Card>
      ) : loading ? <Loading /> : (
        <View style={{ backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>
          {(d?.events||[]).slice(0,20).map((e:any,i:number) => (
            <View key={e.id} style={{ padding: 10, borderBottomWidth: i<19?1:0, borderBottomColor: C.border }}>
              <Text style={{ fontSize: 12, color: C.fg }}>{e.description}</Text>
              <Text style={{ fontSize: 10, color: C.mutedFg, marginTop: 2 }}>{e.actor?.fullName||"System"} · {new Date(e.occurredAt).toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
