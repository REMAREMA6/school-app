import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from "react-native";
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
// Placeholder screens (will be filled in next)
// ============================================================
function SchoolConfigScreen() { return <Placeholder title="School Configuration" />; }
function SubjectsScreen() { return <Placeholder title="Subjects & Classes" />; }
function StudentsScreen() { return <Placeholder title="Students" />; }
function AssessmentsScreen() { return <Placeholder title="Assessment Configuration" />; }
function UsersScreen() { return <Placeholder title="Users & Permissions" />; }
function UploadScreen() { return <Placeholder title="Upload Results" />; }
function ReviewScreen() { return <Placeholder title="Review & Compile" />; }
function ReportCardsScreen() { return <Placeholder title="Report Cards" />; }
function SettingsScreen() { return <Placeholder title="Settings" />; }

function Placeholder({ title }: { title: string }) {
  return (
    <View className="p-6">
      <Text className="text-2xl font-bold text-foreground">{title}</Text>
      <Text className="text-sm text-muted-foreground mt-4">This screen is being built...</Text>
    </View>
  );
}
