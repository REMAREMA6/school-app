import { useEffect, useState, ReactNode, useCallback } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Switch, Platform } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { apiFetch } from "@/lib/api";
import {
  colors, Card, Badge, Btn, ModalSheet, Field, showToast, ToastContainer,
  StatCard, EmptyState, Loading, SectionHeader,
} from "@/components/ui";

// ============================================================
// Navigation
// ============================================================
type ScreenId = "dashboard" | "school-config" | "subjects-classes" | "students" | "assessments" | "users-permissions" | "upload" | "review" | "report-cards" | "settings";
let _screen: ScreenId = "dashboard";
const _listeners: Set<(s: ScreenId) => void> = new Set();
function useScreen() {
  const [s, setS] = useState<ScreenId>(_screen);
  const set = useCallback((next: ScreenId) => { _screen = next; setS(next); _listeners.forEach(l => l(next)); }, []);
  return { screen: s, setScreen: set };
}

const NAV: { id: ScreenId; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "students", label: "Students", icon: "🎓" },
  { id: "upload", label: "Upload", icon: "📤" },
  { id: "review", label: "Review", icon: "✅" },
  { id: "report-cards", label: "Report Cards", icon: "📄" },
  { id: "subjects-classes", label: "Subjects", icon: "📚" },
  { id: "assessments", label: "Assessments", icon: "📋" },
  { id: "users-permissions", label: "Users", icon: "👥" },
  { id: "school-config", label: "School", icon: "🏫" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

// ============================================================
// App Shell
// ============================================================
export default function App() {
  const { screen, setScreen } = useScreen();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, flexDirection: "row", backgroundColor: colors.background }}>
        {/* Sidebar — desktop only */}
        {Platform.OS === "web" && (
          <View style={{ width: 240, borderRightWidth: 1, borderRightColor: colors.border, backgroundColor: colors.card }}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 18 }}>🎓</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>Akoka Federal</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedFg }}>Result Compiler</Text>
                </View>
              </View>
            </View>
            <ScrollView style={{ flex: 1 }}>
              {NAV.map(item => (
                <Pressable key={item.id} onPress={() => setScreen(item.id)} style={{
                  paddingHorizontal: 16, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 10,
                  backgroundColor: screen === item.id ? colors.primaryBg : "transparent",
                  borderLeftWidth: 3, borderLeftColor: screen === item.id ? colors.primary : "transparent",
                }}>
                  <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                  <Text style={{ fontSize: 13, fontWeight: screen === item.id ? "600" : "400", color: screen === item.id ? colors.primary : colors.foreground }}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
              <Text style={{ fontSize: 10, color: colors.mutedFg }}>Demo · 140 students · React Native Web</Text>
            </View>
          </View>
        )}

        {/* Main content */}
        <View style={{ flex: 1 }}>
          {/* Top bar */}
          <View style={{ height: 52, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.card, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>{NAV.find(n => n.id === screen)?.label}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ backgroundColor: colors.muted, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ fontSize: 11, color: colors.mutedFg }}>2024/2025 · First Term</Text>
              </View>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primaryBg, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: colors.primary }}>AA</Text>
              </View>
            </View>
          </View>

          {/* Screen content */}
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

          {/* Mobile bottom nav */}
          {Platform.OS !== "web" && (
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card }}>
              {NAV.slice(0, 5).map(item => (
                <Pressable key={item.id} onPress={() => setScreen(item.id)} style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}>
                  <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                  <Text style={{ fontSize: 9, color: screen === item.id ? colors.primary : colors.mutedFg, fontWeight: screen === item.id ? "600" : "400" }}>{item.label.split(" ")[0]}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <ToastContainer />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function DashboardScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setScreen } = useScreen();
  useEffect(() => { apiFetch("/api/dashboard").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false)); }, []);
  if (loading) return <View style={{ padding: 24 }}><Loading /></View>;
  if (!data) return <View style={{ padding: 24 }}><EmptyState icon="⚠️" title="Failed to load" description="Could not fetch dashboard data." /></View>;
  const c = data.counts || {};
  return (
    <View style={{ padding: 24, maxWidth: 900 }}>
      <SectionHeader title="Dashboard" subtitle={`${data.school?.name || "School"} · ${data.activeTerm?.termName || ""} ${data.activeSession?.sessionName || ""}`} action={<Btn title="Upload" icon="📤" size="sm" onPress={() => setScreen("upload")} />} />
      {/* KPIs */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <StatCard label="Students" value={c.students || 0} hint={`${c.arms || 0} class arms`} icon="🎓" onPress={() => setScreen("students")} />
        <StatCard label="Teachers" value={c.teachers || 0} hint="Active staff" icon="👥" onPress={() => setScreen("users-permissions")} />
        <StatCard label="Batches" value={c.batches || 0} hint={`${c.pendingReviewBatches || 0} need review`} icon="📤" tone={c.pendingReviewBatches > 0 ? colors.warning : undefined} onPress={() => setScreen("upload")} />
        <StatCard label="Report Cards" value={(c.publishedCards||0)+(c.approvedCards||0)+(c.readyCards||0)+(c.draftCards||0)} hint={`${c.publishedCards||0} published`} icon="📄" tone={colors.primary} onPress={() => setScreen("report-cards")} />
      </View>
      {/* Workflow */}
      <Card className="" >
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 12 }}>Report Card Workflow</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {[
            { label: "Draft", count: c.draftCards || 0, color: colors.mutedFg },
            { label: "Ready", count: c.readyCards || 0, color: colors.info },
            { label: "Approved", count: c.approvedCards || 0, color: colors.amber },
            { label: "Published", count: c.publishedCards || 0, color: colors.success },
          ].map(s => (
            <Pressable key={s.label} onPress={() => setScreen("report-cards")} style={{ flex: 1, backgroundColor: colors.muted, borderRadius: 8, padding: 12, alignItems: "center" }}>
              <Text style={{ fontSize: 22, fontWeight: "700", color: s.color }}>{s.count}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedFg }}>{s.label}</Text>
            </Pressable>
          ))}
        </View>
      </Card>
      {/* Recent uploads */}
      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginTop: 20, marginBottom: 8 }}>Recent Uploads</Text>
      <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
        {(data.recentBatches || []).slice(0, 6).map((b: any) => (
          <Pressable key={b.id} onPress={() => setScreen("review")} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: colors.foreground }}>{b.classArm?.fullLabel} · {b.subject?.subjectName}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedFg, marginTop: 2 }}>{b.batchRef} · {b.uploadedBy?.fullName}</Text>
            </View>
            <Badge status={b.status} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ============================================================
// STUDENTS — searchable, with detail panel + score revision
// ============================================================
function StudentsScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [revising, setRevising] = useState<any>(null);

  useEffect(() => { apiFetch("/api/students?limit=200").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const students = (data?.students || []).filter((s: any) =>
    !search || `${s.surname} ${s.firstName}`.toLowerCase().includes(search.toLowerCase()) || s.admissionNumber.includes(search)
  );

  function openStudent(s: any) {
    setSelected(s);
    setScoresLoading(true);
    apiFetch(`/api/students/${s.id}/scores`).then(d => { setScores(d); setScoresLoading(false); }).catch(() => setScoresLoading(false));
  }

  return (
    <View style={{ padding: 24, maxWidth: 900 }}>
      <SectionHeader title="Students" subtitle={`${students.length} of ${data?.students?.length || 0} students`} />
      <TextInput placeholder="Search by name or admission number…" value={search} onChangeText={setSearch} style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, marginBottom: 16 }} />
      {loading ? <Loading /> : students.length === 0 ? <EmptyState icon="🎓" title="No students found" description="Try a different search." /> : (
        <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
          {students.slice(0, 50).map(s => {
            const arm = s.classMemberships?.[0]?.classArm;
            return (
              <Pressable key={s.id} onPress={() => openStudent(s)} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.muted, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                  <Text style={{ fontSize: 12, color: colors.mutedFg }}>{(s.surname[0]||"")}{(s.firstName[0]||"")}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "500", color: colors.foreground }}>{s.surname}, {s.firstName}</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedFg }}>{s.admissionNumber} · {arm?.fullLabel || "—"}</Text>
                </View>
                <Text style={{ fontSize: 16, color: colors.mutedFg }}>›</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Student detail modal */}
      <ModalSheet visible={!!selected} onClose={() => setSelected(null)} title="Student Detail" size="lg"
        footer={<><Btn title="Edit" variant="outline" size="sm" onPress={() => { showToast("Edit student form would open here", "info"); }} /><Btn title="View Scores" size="sm" onPress={() => {}} /></>}
      >
        {selected && (
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryBg, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.primary }}>{(selected.surname[0]||"")}{(selected.firstName[0]||"")}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>{selected.surname}, {selected.firstName}</Text>
                <Text style={{ fontSize: 12, color: colors.mutedFg }}>{selected.admissionNumber} · {selected.gender} · {selected.stateOfOrigin}</Text>
              </View>
            </View>
            {/* Verified scores */}
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>Verified Scores — First Term 2024/2025</Text>
            <Text style={{ fontSize: 11, color: colors.mutedFg, marginBottom: 12 }}>Click any score to revise it. Changes trigger recompilation.</Text>
            {scoresLoading ? <Loading /> : (
              (scores?.groups || []).map((g: any) => (
                <View key={g.subjectId} style={{ backgroundColor: colors.muted, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text style={{ fontSize: 11, fontWeight: "700", color: colors.mutedFg }}>{g.subjectCode}</Text>
                      <Text style={{ fontSize: 12, fontWeight: "500", color: colors.foreground }}>{g.subjectName}</Text>
                    </View>
                    {g.compilationResult && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>{g.compilationResult.overallTotal?.toFixed(0)}/100</Text>
                        {g.compilationResult.grade && <Badge status={g.compilationResult.grade} />}
                      </View>
                    )}
                  </View>
                  {g.scores.map((sc: any) => (
                    <Pressable key={sc.id} onPress={() => setRevising({ ...sc, subjectCode: g.subjectCode, subjectName: g.subjectName })} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={{ fontSize: 12, color: colors.foreground }}>{sc.componentName}</Text>
                        {sc.status === "REVISED" && <Badge status="REVISED" />}
                      </View>
                      <Text style={{ fontSize: 12, fontFamily: "monospace", color: colors.foreground }}>{sc.value}/{sc.maximumMark}</Text>
                    </Pressable>
                  ))}
                </View>
              ))
            )}
          </View>
        )}
      </ModalSheet>

      {/* Revise score modal */}
      <ModalSheet visible={!!revising} onClose={() => setRevising(null)} title="Revise Score" size="sm"
        footer={<><Btn title="Cancel" variant="outline" size="sm" onPress={() => setRevising(null)} /><Btn title="Save Revision" size="sm" onPress={() => {
          showToast("Score revised. Recompilation queued:", "success");
          setTimeout(() => showToast("• Subject total + grade recomputed", "info"), 200);
          setTimeout(() => showToast("• Class positions recomputed for arm", "info"), 400);
          setTimeout(() => showToast("• Report card marked SUPERSEDED", "warning"), 600);
          setRevising(null);
        }} /></>}
      >
        {revising && (
          <View>
            <View style={{ backgroundColor: colors.muted, borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: colors.mutedFg }}>Subject</Text>
              <Text style={{ fontSize: 13, fontWeight: "500", color: colors.foreground }}>{revising.subjectName} — {revising.componentName}</Text>
              <Text style={{ fontSize: 12, color: colors.mutedFg, marginTop: 6 }}>Current value</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>{revising.value} / {revising.maximumMark}</Text>
            </View>
            <Field label="New Score Value" value="" onChangeText={() => {}} placeholder={`0 – ${revising.maximumMark}`} type="number" />
            <Field label="Reason for Revision (required)" value="" onChangeText={() => {}} placeholder="e.g. Rechecked the script; actual mark is 17 not 7." multiline />
            <View style={{ backgroundColor: colors.warningBg, borderRadius: 8, padding: 12, marginTop: 8 }}>
              <Text style={{ fontSize: 11, color: colors.warning, fontWeight: "500" }}>⚠ This will trigger:</Text>
              <Text style={{ fontSize: 11, color: colors.warning, marginTop: 4 }}>• Recompile subject total + grade{"\n"}• Recompute class positions for entire arm{"\n"}• Mark existing report card as SUPERSEDED</Text>
            </View>
          </View>
        )}
      </ModalSheet>
    </View>
  );
}

// ============================================================
// UPLOAD — multi-step: pick → preview → edit → confirm
// ============================================================
function UploadScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadStep, setUploadStep] = useState(0); // 0 = list, 1 = pick, 2 = preview, 3 = success
  const [sourceType, setSourceType] = useState<"SPREADSHEET" | "SCANNED_PAPER">("SPREADSHEET");
  const [fileName, setFileName] = useState("");
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const { setScreen } = useScreen();

  useEffect(() => { apiFetch("/api/score-batches?limit=50").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false)); }, []);

  function startUpload() {
    setUploadStep(1);
    setFileName("");
    setPreviewRows([]);
  }

  function handleExtract() {
    if (!fileName) { showToast("Please select a file first", "error"); return; }
    setUploadStep(2);
    // Generate fake preview rows from the students API
    apiFetch("/api/students?limit=12").then(d => {
      const components = [{name:"Assignment",max:10},{name:"Test 1",max:10},{name:"Test 2",max:10},{name:"Mid-Term",max:10},{name:"Examination",max:60}];
      const rows = (d.students || []).slice(0, 10).map((s:any) => {
        const vals:any = {};
        components.forEach(c => { vals[c.name] = Math.floor(Math.random() * c.max * 0.8) + 1; });
        const unmatched = sourceType === "SCANNED_PAPER" && Math.random() < 0.1;
        return { id: s.id, name: unmatched ? `${s.surname.replace(/a$/,"ah")} ${s.firstName}` : `${s.surname} ${s.firstName}`, adm: unmatched ? s.admissionNumber.replace(/\d$/,"X") : s.admissionNumber, matched: !unmatched, vals };
      });
      setPreviewRows(rows);
    });
  }

  function handleConfirm() {
    const issues = previewRows.filter(r => !r.matched);
    if (issues.length > 0) { showToast(`${issues.length} unmatched students — fix before confirming`, "error"); return; }
    setUploadStep(3);
    showToast("Scores saved as verified!", "success");
    setTimeout(() => showToast("Compiling subject totals + grades…", "info"), 300);
    setTimeout(() => showToast("Computing class positions…", "info"), 600);
    setTimeout(() => showToast("Report cards marked SUPERSEDED → new versions", "warning"), 900);
    setTimeout(() => { setUploadStep(0); }, 3000);
  }

  if (uploadStep > 0) {
    return (
      <View style={{ padding: 24, maxWidth: 700 }}>
        {/* Step indicator */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 }}>
          {["Pick File","Preview & Edit","Confirm"].map((label, i) => (
            <View key={label} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: uploadStep > i ? colors.success : uploadStep === i+1 ? colors.primary : colors.muted, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 10, color: "#fff", fontWeight: "700" }}>{uploadStep > i ? "✓" : i+1}</Text>
              </View>
              <Text style={{ fontSize: 11, fontWeight: "500", color: uploadStep >= i+1 ? colors.foreground : colors.mutedFg }}>{label}</Text>
              {i < 2 && <Text style={{ color: colors.mutedFg }}>→</Text>}
            </View>
          ))}
        </View>

        {/* Step 1: Pick file */}
        {uploadStep === 1 && (
          <View>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, marginBottom: 16 }}>Upload Scores</Text>
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.mutedFg, marginBottom: 8 }}>Source Type</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
              {(["SPREADSHEET","SCANNED_PAPER"] as const).map(t => (
                <Pressable key={t} onPress={() => setSourceType(t)} style={{ flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: sourceType === t ? colors.primary : colors.border, backgroundColor: sourceType === t ? colors.primaryBg : colors.card, alignItems: "center" }}>
                  <Text style={{ fontSize: 20 }}>{t === "SPREADSHEET" ? "📊" : "📠"}</Text>
                  <Text style={{ fontSize: 12, fontWeight: "500", color: sourceType === t ? colors.primary : colors.mutedFg, marginTop: 4 }}>{t === "SPREADSHEET" ? "Excel / CSV" : "Scanned Paper"}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.mutedFg, marginBottom: 8 }}>File</Text>
            <Pressable onPress={() => setFileName(sourceType === "SPREADSHEET" ? "english_jss1a.xlsx" : "math_ss2_science_scan.pdf")} style={{ borderWidth: 2, borderStyle: "dashed", borderColor: colors.border, borderRadius: 8, padding: 24, alignItems: "center", backgroundColor: colors.muted }}>
              {fileName ? (
                <>
                  <Text style={{ fontSize: 14, fontWeight: "500", color: colors.primary }}>📄 {fileName}</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedFg, marginTop: 4 }}>Click to replace</Text>
                </>
              ) : (
                <>
                  <Text style={{ fontSize: 24, marginBottom: 8 }}>📤</Text>
                  <Text style={{ fontSize: 13, color: colors.foreground }}>Click to select a file</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedFg, marginTop: 2 }}>{sourceType === "SPREADSHEET" ? "xlsx, csv up to 10MB" : "pdf, jpg, png up to 20MB"}</Text>
                </>
              )}
            </Pressable>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
              <Btn title="Cancel" variant="outline" size="sm" onPress={() => setUploadStep(0)} />
              <Btn title="Upload & Extract" icon="📤" size="sm" onPress={handleExtract} disabled={!fileName} />
            </View>
          </View>
        )}

        {/* Step 2: Preview & edit */}
        {uploadStep === 2 && (
          <View>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}>Preview & Edit Extracted Rows</Text>
            <Text style={{ fontSize: 12, color: colors.mutedFg, marginBottom: 16 }}>Every cell below is editable. Fix mistakes, then confirm to save as verified scores.</Text>
            {previewRows.length === 0 ? <Loading /> : (
              <>
                <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                  <View style={{ backgroundColor: colors.muted, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}><Text style={{ fontSize: 11, color: colors.foreground }}>{previewRows.length} rows</Text></View>
                  {previewRows.some(r => !r.matched) && <View style={{ backgroundColor: colors.warningBg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}><Text style={{ fontSize: 11, color: colors.warning }}>{previewRows.filter(r => !r.matched).length} unmatched</Text></View>}
                </View>
                <View style={{ backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
                  {/* Header */}
                  <View style={{ flexDirection: "row", backgroundColor: colors.muted, paddingVertical: 8, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: colors.mutedFg, flex: 1 }}>STUDENT</Text>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: colors.mutedFg, width: 50, textAlign: "center" }}>ASSIGN</Text>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: colors.mutedFg, width: 50, textAlign: "center" }}>TEST 1</Text>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: colors.mutedFg, width: 50, textAlign: "center" }}>TEST 2</Text>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: colors.mutedFg, width: 50, textAlign: "center" }}>MID-T</Text>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: colors.mutedFg, width: 60, textAlign: "center" }}>EXAM</Text>
                  </View>
                  {/* Rows */}
                  {previewRows.map((r, i) => (
                    <View key={i} style={{ flexDirection: "row", paddingVertical: 6, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: r.matched ? "transparent" : colors.warningBg }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 12, color: colors.foreground }}>{r.name}</Text>
                        <Text style={{ fontSize: 10, color: r.matched ? colors.mutedFg : colors.warning, fontFamily: "monospace" }}>{r.adm}{!r.matched && " ⚠"}</Text>
                      </View>
                      {["Assignment","Test 1","Test 2","Mid-Term","Examination"].map(comp => (
                        <TextInput key={comp} defaultValue={String(r.vals[comp] || "")} style={{ width: comp === "Examination" ? 60 : 50, textAlign: "center", fontSize: 12, fontFamily: "monospace", color: colors.foreground, borderWidth: 1, borderColor: colors.border, borderRadius: 4, marginHorizontal: 2, paddingVertical: 2 }} keyboardType="numeric" />
                      ))}
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
                  <Btn title="Back" variant="outline" size="sm" onPress={() => setUploadStep(1)} />
                  <Btn title={`Confirm & Save ${previewRows.length} Scores`} icon="✓" size="sm" onPress={handleConfirm} disabled={previewRows.some(r => !r.matched)} />
                </View>
                {previewRows.some(r => !r.matched) && <Text style={{ fontSize: 11, color: colors.warning, marginTop: 8 }}>⚠ Fix all unmatched students before confirming.</Text>}
              </>
            )}
          </View>
        )}

        {/* Step 3: Success */}
        {uploadStep === 3 && (
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.successBg, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Text style={{ fontSize: 28, color: colors.success }}>✓</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>Verified Scores Saved</Text>
            <Text style={{ fontSize: 12, color: colors.mutedFg, marginTop: 4 }}>{previewRows.length} scores saved</Text>
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 11, color: colors.mutedFg, fontWeight: "600" }}>Downstream compilation queued:</Text>
              <Text style={{ fontSize: 11, color: colors.mutedFg, marginTop: 4 }}>• Subject totals + grades computed{"\n"}• Class positions recomputed for arm{"\n"}• Report cards marked SUPERSEDED</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  // Batch list
  return (
    <View style={{ padding: 24, maxWidth: 900 }}>
      <SectionHeader title="Upload Results" subtitle={`${data?.batches?.length || 0} score submission batches`} action={<Btn title="New Upload" icon="📤" size="sm" onPress={startUpload} />} />
      {loading ? <Loading /> : (
        <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
          {(data?.batches || []).slice(0, 30).map((b: any) => (
            <Pressable key={b.id} onPress={() => { setScreen("review"); }} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "500", color: colors.foreground }}>{b.classArm?.fullLabel} · {b.subject?.subjectName}</Text>
                <Text style={{ fontSize: 11, color: colors.mutedFg, marginTop: 2 }}>{b.batchRef} · {b.uploadedBy?.fullName} · {b._count?.verifiedScores || b._count?.scoreDrafts || 0} rows</Text>
              </View>
              <Badge status={b.status} />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// ============================================================
// REVIEW — drafts needing review, click to edit
// ============================================================
function ReviewScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  useEffect(() => { apiFetch("/api/drafts").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false)); }, []);
  return (
    <View style={{ padding: 24, maxWidth: 900 }}>
      <SectionHeader title="Review & Compile" subtitle={`${data?.drafts?.length || 0} drafts flagged for review`} />
      {loading ? <Loading /> : (data?.drafts || []).length === 0 ? <EmptyState icon="✅" title="No drafts need review" description="All imported scores have been confirmed." /> : (
        <View style={{ backgroundColor: colors.warningBg, borderRadius: 8, padding: 12, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 14 }}>⚠</Text>
          <Text style={{ fontSize: 13, color: colors.warning, fontWeight: "500" }}>{data.drafts.length} drafts need your attention</Text>
        </View>
      )}
      <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
        {(data?.drafts || []).slice(0, 30).map((d: any) => (
          <Pressable key={d.id} onPress={() => setEditing(d)} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: colors.foreground }}>{d.studentNameRaw}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedFg, marginTop: 2 }}>{d.batch?.batchRef} · {d.batch?.classArm?.fullLabel} · {d.batch?.subject?.subjectName} · {d.assessmentComponent?.componentName}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 13, fontFamily: "monospace", color: colors.foreground }}>{d.enteredValue}/{d.assessmentComponent?.maximumMark}</Text>
              <View style={{ marginTop: 4 }}><Badge status={d.status} /></View>
            </View>
          </Pressable>
        ))}
      </View>
      {/* Edit draft modal */}
      <ModalSheet visible={!!editing} onClose={() => setEditing(null)} title="Review Draft" size="md"
        footer={<>
          <Btn title="Reject" variant="destructive" size="sm" onPress={() => { showToast("Draft rejected", "info"); setEditing(null); }} />
          <Btn title="Confirm" size="sm" onPress={() => { showToast("Draft confirmed as verified score", "success"); setEditing(null); }} />
        </>}>
        {editing && (
          <View>
            <View style={{ backgroundColor: colors.muted, borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: colors.mutedFg }}>Student</Text>
              <Text style={{ fontSize: 13, fontWeight: "500", color: colors.foreground }}>{editing.studentNameRaw}</Text>
              <Text style={{ fontSize: 12, color: colors.mutedFg, marginTop: 6 }}>Component</Text>
              <Text style={{ fontSize: 13, color: colors.foreground }}>{editing.assessmentComponent?.componentName} (max {editing.assessmentComponent?.maximumMark})</Text>
              <Text style={{ fontSize: 12, color: colors.mutedFg, marginTop: 6 }}>Batch</Text>
              <Text style={{ fontSize: 12, fontFamily: "monospace", color: colors.foreground }}>{editing.batch?.batchRef}</Text>
            </View>
            <Field label="Score Value" value={String(editing.enteredValue || "")} onChangeText={() => {}} type="number" />
            <Field label="Reviewer Note (optional)" value="" onChangeText={() => {}} placeholder="Add a note for the audit log…" multiline />
          </View>
        )}
      </ModalSheet>
    </View>
  );
}

// ============================================================
// REPORT CARDS — list + preview (output is NOT editable)
// ============================================================
function ReportCardsScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<any>(null);
  const { setScreen } = useScreen();
  useEffect(() => { apiFetch("/api/report-cards?limit=50").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false)); }, []);
  return (
    <View style={{ padding: 24, maxWidth: 900 }}>
      <SectionHeader title="Report Cards" subtitle={`${data?.cards?.length || 0} report cards`} />
      {loading ? <Loading /> : (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {(data?.cards || []).slice(0, 24).map((c: any) => {
            const pos = c.classPositions?.[0];
            const arm = c.student?.classMemberships?.[0]?.classArm;
            return (
              <Pressable key={c.id} onPress={() => { setPreview(c); }} style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, flex: 1, minWidth: 220 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>{c.student?.surname}, {c.student?.firstName}</Text>
                    <Text style={{ fontSize: 11, color: colors.mutedFg, fontFamily: "monospace" }}>{c.student?.admissionNumber}</Text>
                    <Text style={{ fontSize: 11, color: colors.mutedFg }}>{arm?.fullLabel || "—"}</Text>
                  </View>
                  <Badge status={c.status} />
                </View>
                <View style={{ flexDirection: "row", gap: 12, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <Text style={{ fontSize: 11, color: colors.mutedFg }}>Position: {pos ? `${pos.position}/${pos.numStudentsInArm}` : "—"}</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedFg }}>Avg: {pos ? pos.averageScore?.toFixed(1) : "—"}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
      {/* Report card preview modal */}
      <ModalSheet visible={!!preview} onClose={() => setPreview(null)} title="Report Card Preview" size="lg"
        footer={<>
          <Btn title="Edit Scores" variant="outline" size="sm" onPress={() => { setPreview(null); setScreen("students"); showToast("Navigate to Students → click student → revise scores", "info"); }} />
          {preview?.status === "READY_FOR_REVIEW" && <Btn title="Approve" icon="✓" size="sm" onPress={() => { showToast("Report card approved", "success"); setPreview(null); }} />}
          {preview?.status === "APPROVED" && <Btn title="Publish" icon="📤" size="sm" onPress={() => { showToast("Report card published to student", "success"); setPreview(null); }} />}
        </>}>
        {preview && (
          <View>
            {/* School header */}
            <View style={{ paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: colors.primary, marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>Akoka Federal Academy</Text>
              <Text style={{ fontSize: 11, color: colors.mutedFg }}>Akoka, Yaba, Lagos · Est. 1985</Text>
              <Text style={{ fontSize: 10, color: colors.mutedFg, fontStyle: "italic" }}>"Knowledge · Discipline · Service"</Text>
            </View>
            {/* Student info */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}>
              <View style={{ flex: 1, minWidth: 150 }}><Text style={{ fontSize: 10, color: colors.mutedFg }}>STUDENT</Text><Text style={{ fontSize: 13, fontWeight: "500", color: colors.foreground }}>{preview.student?.surname}, {preview.student?.firstName}</Text></View>
              <View style={{ flex: 1, minWidth: 120 }}><Text style={{ fontSize: 10, color: colors.mutedFg }}>ADMISSION #</Text><Text style={{ fontSize: 13, fontFamily: "monospace", color: colors.foreground }}>{preview.student?.admissionNumber}</Text></View>
            </View>
            {/* Subject results (READ-ONLY — compiled output) */}
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>Subject Results (compiled — not directly editable)</Text>
            <View style={{ backgroundColor: colors.muted, borderRadius: 8, padding: 12 }}>
              <Text style={{ fontSize: 11, color: colors.mutedFg }}>Subject results are derived from verified scores. To change a grade, edit the underlying score → system recompiles.</Text>
            </View>
            <View style={{ marginTop: 12, backgroundColor: colors.warningBg, borderRadius: 8, padding: 12 }}>
              <Text style={{ fontSize: 11, color: colors.warning, fontWeight: "500" }}>⚠ Report card subject results are compiled outputs. Edit the source scores to change them.</Text>
            </View>
          </View>
        )}
      </ModalSheet>
    </View>
  );
}

// ============================================================
// SUBJECTS & CLASSES
// ============================================================
function SubjectsScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => { apiFetch("/api/subjects-classes").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false)); }, []);
  const subjects = (data?.subjects || []).filter((s: any) => !search || s.subjectName.toLowerCase().includes(search.toLowerCase()) || s.subjectCode.toLowerCase().includes(search.toLowerCase()));
  return (
    <View style={{ padding: 24, maxWidth: 900 }}>
      <SectionHeader title="Subjects & Classes" subtitle={`${data?.subjects?.length || 0} subjects · ${data?.classes?.length || 0} classes`} />
      <TextInput placeholder="Search subjects…" value={search} onChangeText={setSearch} style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, marginBottom: 16 }} />
      {loading ? <Loading /> : (
        <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
          {subjects.map(s => (
            <Pressable key={s.id} onPress={() => showToast(`${s.subjectName} (${s.subjectCode}) — ${s.category}`, "info")} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 11, fontFamily: "monospace", color: colors.mutedFg, width: 40 }}>{s.subjectCode}</Text>
              <Text style={{ fontSize: 13, color: colors.foreground, flex: 1 }}>{s.subjectName}</Text>
              <View style={{ backgroundColor: colors.muted, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginRight: 8 }}><Text style={{ fontSize: 10, color: colors.mutedFg }}>{s.category}</Text></View>
              {s.isCore && <View style={{ backgroundColor: colors.primaryBg, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}><Text style={{ fontSize: 10, color: colors.primary, fontWeight: "600" }}>Core</Text></View>}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// ============================================================
// ASSESSMENTS
// ============================================================
function AssessmentsScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiFetch("/api/assessments?limit=50").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false)); }, []);
  return (
    <View style={{ padding: 24, maxWidth: 900 }}>
      <SectionHeader title="Assessment Configuration" subtitle={`${data?.configs?.length || 0} configs · CA 40 + Exam 60 = 100`} />
      {loading ? <Loading /> : (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {(data?.configs || []).slice(0, 20).map((cfg: any) => {
            const caTotal = (cfg.components || []).filter((c:any) => c.componentType === "CONTINUOUS_ASSESSMENT").reduce((s:number,c:any) => s + c.maximumMark, 0);
            return (
              <Pressable key={cfg.id} onPress={() => showToast(`${cfg.subject?.subjectName} — ${cfg.classArm?.fullLabel}`, "info")} style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, flex: 1, minWidth: 260 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Text style={{ fontSize: 10, fontFamily: "monospace", color: colors.mutedFg }}>{cfg.subject?.subjectCode}</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedFg }}>{cfg.classArm?.fullLabel}</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>{cfg.subject?.subjectName}</Text>
                {(cfg.components || []).map((c: any) => (
                  <View key={c.id} style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
                    <Text style={{ fontSize: 12, color: colors.foreground }}>{c.componentName}</Text>
                    <Text style={{ fontSize: 12, fontFamily: "monospace", color: colors.mutedFg }}>{c.maximumMark}</Text>
                  </View>
                ))}
                <View style={{ flexDirection: "row", gap: 12, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <Text style={{ fontSize: 11, color: colors.mutedFg }}>CA: {caTotal}/40</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedFg }}>Exam: 60</Text>
                  <Text style={{ fontSize: 11, color: colors.primary, fontWeight: "600" }}>Total: 100</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ============================================================
// USERS
// ============================================================
function UsersScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiFetch("/api/users").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false)); }, []);
  return (
    <View style={{ padding: 24, maxWidth: 900 }}>
      <SectionHeader title="Users & Permissions" subtitle={`${data?.users?.length || 0} staff accounts`} />
      {loading ? <Loading /> : (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {(data?.users || []).map((u: any) => {
            const formTeacher = (u.teacherAssignments || []).find((a:any) => a.assignmentType === "FORM_TEACHER");
            const subjectCount = (u.teacherAssignments || []).filter((a:any) => a.assignmentType === "SUBJECT_TEACHING").length;
            return (
              <Pressable key={u.id} onPress={() => showToast(`${u.fullName} — ${u.role}`, "info")} style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, flex: 1, minWidth: 280 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryBg, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 11, fontWeight: "600", color: colors.primary }}>{u.fullName?.split(" ").map((n:string)=>n[0]).slice(0,2).join("")}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>{u.fullName}</Text>
                    <Text style={{ fontSize: 11, color: colors.mutedFg }}>{u.email}</Text>
                  </View>
                  <Badge status={u.role} />
                </View>
                {formTeacher && <Text style={{ fontSize: 11, color: colors.mutedFg, marginTop: 4 }}>Form teacher: {formTeacher.classArm?.fullLabel}</Text>}
                <Text style={{ fontSize: 11, color: colors.mutedFg, marginTop: 2 }}>Teaches {subjectCount} subject{subjectCount === 1 ? "" : "s"}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ============================================================
// SCHOOL CONFIG
// ============================================================
function SchoolConfigScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiFetch("/api/school-config").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false)); }, []);
  if (loading) return <View style={{ padding: 24 }}><Loading /></View>;
  const s = data?.school || {};
  return (
    <View style={{ padding: 24, maxWidth: 700 }}>
      <SectionHeader title="School Configuration" subtitle="School identity, sessions, grading" action={<Btn title="Edit" variant="outline" size="sm" onPress={() => showToast("Edit school info form would open here", "info")} />} />
      <Card>
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>{s.name}</Text>
        <Text style={{ fontSize: 12, color: colors.mutedFg, fontStyle: "italic", marginTop: 2 }}>"{s.motto}"</Text>
        <Text style={{ fontSize: 13, color: colors.foreground, marginTop: 12 }}>{s.addressLine}</Text>
        <Text style={{ fontSize: 13, color: colors.foreground }}>{s.state}, {s.country}</Text>
        <Text style={{ fontSize: 12, color: colors.mutedFg, marginTop: 8 }}>Established: {s.establishedYear}</Text>
      </Card>
      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginTop: 20, marginBottom: 8 }}>Academic Sessions</Text>
      {(data?.sessions || []).map((session: any) => (
        <Card key={session.id} className="" >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>{session.sessionName}</Text>
            {session.isActive && <View style={{ backgroundColor: colors.successBg, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}><Text style={{ fontSize: 10, color: colors.success, fontWeight: "600" }}>Active</Text></View>}
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(session.terms || []).map((term: any) => (
              <View key={term.id} style={{ backgroundColor: colors.muted, borderRadius: 6, padding: 8, flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: "500", color: colors.foreground }}>{term.termName}</Text>
                {term.isActive && <Text style={{ fontSize: 10, color: colors.success }}>● Active</Text>}
                <Text style={{ fontSize: 10, color: colors.mutedFg, marginTop: 2 }}>{term.startDate ? new Date(term.startDate).toLocaleDateString("en-GB", {day:"numeric",month:"short"}) : "—"} → {term.endDate ? new Date(term.endDate).toLocaleDateString("en-GB", {day:"numeric",month:"short"}) : "—"}</Text>
              </View>
            ))}
          </View>
        </Card>
      ))}
      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginTop: 20, marginBottom: 8 }}>Grading Scale (WAEC 9-point)</Text>
      <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
        {(data?.gradingBoundaries || []).map((b: any) => {
          const remark = (data?.gradeRemarks || []).find((r: any) => r.grade === b.grade)?.remark || "—";
          return (
            <Pressable key={b.id} onPress={() => showToast(`Grade ${b.grade} — ${b.label} (${b.minPercent}-${b.maxPercent}%)`, "info")} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground, width: 32 }}>{b.grade}</Text>
              <Text style={{ fontSize: 13, color: colors.foreground, flex: 1 }}>{b.label}{b.isCredit ? " ★" : ""}</Text>
              <Text style={{ fontSize: 12, fontFamily: "monospace", color: colors.mutedFg, width: 70, textAlign: "right" }}>{b.minPercent}-{b.maxPercent}%</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ============================================================
// SETTINGS
// ============================================================
function SettingsScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"general" | "audit">("general");
  useEffect(() => { apiFetch("/api/audit?limit=30").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false)); }, []);
  return (
    <View style={{ padding: 24, maxWidth: 700 }}>
      <SectionHeader title="Settings" subtitle="System preferences and audit log" />
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        {(["general","audit"] as const).map(t => (
          <Pressable key={t} onPress={() => setTab(t)} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: tab === t ? colors.primary : colors.muted }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: tab === t ? "#fff" : colors.mutedFg }}>{t === "general" ? "General" : "Audit Log"}</Text>
          </Pressable>
        ))}
      </View>
      {tab === "general" ? (
        <Card>
          <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 13, color: colors.mutedFg }}>School name</Text><Text style={{ fontSize: 13, color: colors.foreground }}>Akoka Federal Academy</Text>
          </View>
          <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 13, color: colors.mutedFg }}>Default grading</Text><Text style={{ fontSize: 13, color: colors.foreground }}>WAEC 9-point</Text>
          </View>
          <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 13, color: colors.mutedFg }}>Language</Text><Text style={{ fontSize: 13, color: colors.foreground }}>English (Nigeria)</Text>
          </View>
          <View style={{ paddingVertical: 8, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 13, color: colors.mutedFg }}>Timezone</Text><Text style={{ fontSize: 13, color: colors.foreground }}>Africa/Lagos</Text>
          </View>
        </Card>
      ) : loading ? <Loading /> : (
        <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
          {(data?.events || []).slice(0, 20).map((e: any) => (
            <View key={e.id} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ fontSize: 13, color: colors.foreground }}>{e.description}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedFg, marginTop: 2 }}>{e.actor?.fullName || "System"} · {new Date(e.occurredAt).toLocaleString("en-GB", {day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
