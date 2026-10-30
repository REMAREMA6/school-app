// Shared UI components — matching design screenshots exactly
import { View, Text, Pressable, Modal, TextInput, ScrollView, ActivityIndicator, Platform } from "react-native";
import { useState, ReactNode, useEffect } from "react";

export const C = {
  sidebar: "#1b4332", sidebarActive: "#40916c", sidebarFg: "#b7e4c7", sidebarSection: "#52796f",
  primary: "#2d6a4f", primaryLight: "#52b788", primaryBg: "#d8f3dc",
  bg: "#f8f9fa", card: "#ffffff", fg: "#212529", muted: "#f1f3f5", mutedFg: "#6c757d",
  border: "#e9ecef",
  red: "#e63946", redBg: "#fff5f5",
  amber: "#f4a261", amberBg: "#fff8e1",
  blue: "#4ea8de", blueBg: "#e7f5ff",
  purple: "#9d8df1", purpleBg: "#f3f0ff",
  success: "#2d6a4f", successBg: "#d8f3dc",
};

// Stat card with colored icon circle + trend
export function StatCard({ label, value, trend, trendColor, icon, iconBg, onPress }: {
  label: string; value: string | number; trend?: string; trendColor?: string; icon: string; iconBg: string; onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={{ backgroundColor: C.card, borderRadius: 12, padding: 16, flex: 1, minWidth: 200, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, borderWidth: 1, borderColor: C.border }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: iconBg, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 18 }}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, color: C.mutedFg, fontWeight: "500" }}>{label}</Text>
          <Text style={{ fontSize: 24, fontWeight: "700", color: C.fg }}>{value}</Text>
          {trend && <Text style={{ fontSize: 10, color: trendColor || C.mutedFg, marginTop: 1 }}>{trend}</Text>}
        </View>
      </View>
    </Pressable>
  );
}

// Workflow step — circular icon with arrow connector
export function WorkflowStep({ icon, iconBg, label, desc, count, countBg, onPress }: {
  icon: string; iconBg: string; label: string; desc: string; count: string; countBg: string; onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ alignItems: "center", flex: 1 }}>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: iconBg, alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <Text style={{ fontSize: 11, fontWeight: "600", color: C.fg }}>{label}</Text>
      <Text style={{ fontSize: 9, color: C.mutedFg, textAlign: "center", marginTop: 1 }}>{desc}</Text>
      <View style={{ backgroundColor: countBg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 }}>
        <Text style={{ fontSize: 10, fontWeight: "600", color: C.fg }}>{count}</Text>
      </View>
    </Pressable>
  );
}

// Arrow between workflow steps
export function Arrow() {
  return <Text style={{ fontSize: 14, color: C.mutedFg, alignSelf: "center", marginHorizontal: -2 }}>→</Text>;
}

// Alert box (red, with CTA)
export function AlertBox({ icon, title, count, desc, cta, onPress }: {
  icon: string; title: string; count: string; desc: string; cta: string; onPress?: () => void;
}) {
  return (
    <View style={{ backgroundColor: C.redBg, borderRadius: 10, padding: 16, borderLeftWidth: 4, borderLeftColor: C.red, marginBottom: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
        <Text style={{ fontSize: 13, fontWeight: "700", color: C.red }}>{title}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
        <Text style={{ fontSize: 28, fontWeight: "700", color: C.red }}>{count}</Text>
        <Text style={{ fontSize: 12, color: C.mutedFg, flex: 1 }}>{desc}</Text>
      </View>
      {onPress && (
        <Pressable onPress={onPress} style={{ backgroundColor: C.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, alignSelf: "flex-start", marginTop: 10 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#fff" }}>{cta}</Text>
        </Pressable>
      )}
    </View>
  );
}

// Activity feed item
export function ActivityItem({ icon, iconBg, title, details, time }: {
  icon: string; iconBg: string; title: string; details: string; time: string;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 10, paddingVertical: 8 }}>
      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: iconBg, alignItems: "center", justifyContent: "center", marginTop: 2 }}>
        <Text style={{ fontSize: 12 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, fontWeight: "600", color: C.fg }}>{title}</Text>
        <Text style={{ fontSize: 11, color: C.mutedFg, marginTop: 1 }}>{details}</Text>
      </View>
      <Text style={{ fontSize: 10, color: C.mutedFg, marginTop: 2 }}>{time}</Text>
    </View>
  );
}

// Status badge — color-coded pills
const statusColors: Record<string, { bg: string; fg: string; label: string }> = {
  CONFIRMED: { bg: C.successBg, fg: C.success, label: "Verified" },
  PUBLISHED: { bg: C.successBg, fg: C.success, label: "Published" },
  VERIFIED: { bg: C.blueBg, fg: C.blue, label: "Verified" },
  COMPILED: { bg: C.purpleBg, fg: C.purple, label: "Compiled" },
  APPROVED: { bg: C.amberBg, fg: C.amber, label: "Approved" },
  AWAITING_REVIEW: { bg: C.amberBg, fg: C.amber, label: "Under Review" },
  READY_FOR_REVIEW: { bg: C.blueBg, fg: C.blue, label: "Ready" },
  PROCESSING: { bg: C.amberBg, fg: C.amber, label: "Processing" },
  UPLOADED: { bg: C.muted, fg: C.mutedFg, label: "Uploaded" },
  DRAFT: { bg: C.muted, fg: C.mutedFg, label: "Draft" },
  FLAGGED_INVALID: { bg: C.redBg, fg: C.red, label: "Invalid" },
  FLAGGED_UNCERTAIN: { bg: C.amberBg, fg: C.amber, label: "Uncertain" },
  REVISED: { bg: C.amberBg, fg: C.amber, label: "Revised" },
  ADMIN: { bg: C.primaryBg, fg: C.primary, label: "Admin" },
  PRINCIPAL: { bg: C.amberBg, fg: C.amber, label: "Principal" },
  TEACHER: { bg: C.muted, fg: C.mutedFg, label: "Teacher" },
  PENDING_REVIEW: { bg: C.muted, fg: C.mutedFg, label: "Pending" },
  SUPERSEDED: { bg: C.muted, fg: C.mutedFg, label: "Superseded" },
};
export function Badge({ status }: { status: string }) {
  const s = statusColors[status] || { bg: C.muted, fg: C.mutedFg, label: status };
  return <View style={{ backgroundColor: s.bg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}><Text style={{ fontSize: 10, fontWeight: "600", color: s.fg }}>{s.label}</Text></View>;
}

// Button
export function Btn({ title, onPress, variant = "default", size = "md", icon, disabled }: {
  title: string; onPress?: () => void; variant?: "default" | "outline" | "ghost" | "danger"; size?: "sm" | "md"; icon?: string; disabled?: boolean;
}) {
  const v = { default: { bg: C.primary, fg: "#fff", border: C.primary }, outline: { bg: "transparent", fg: C.fg, border: C.border }, ghost: { bg: "transparent", fg: C.mutedFg, border: "transparent" }, danger: { bg: C.red, fg: "#fff", border: C.red } }[variant];
  const p = size === "sm" ? { px: 10, py: 5 } : { px: 14, py: 8 };
  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ backgroundColor: disabled ? C.muted : v.bg, borderWidth: 1, borderColor: disabled ? C.border : v.border, borderRadius: 8, paddingHorizontal: p.px, paddingVertical: p.py, flexDirection: "row", alignItems: "center", gap: 6, opacity: disabled ? 0.5 : 1 }}>
      {icon && <Text style={{ fontSize: 13 }}>{icon}</Text>}
      <Text style={{ color: disabled ? C.mutedFg : v.fg, fontSize: size === "sm" ? 12 : 13, fontWeight: "600" }}>{title}</Text>
    </Pressable>
  );
}

// Search bar
export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <View style={{ position: "relative", flex: 1 }}>
      <Text style={{ position: "absolute", left: 10, top: 9, fontSize: 13, color: C.mutedFg }}>🔍</Text>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingLeft: 32, paddingRight: 10, paddingVertical: 8, fontSize: 13, color: C.fg }} />
    </View>
  );
}

// Table header cell
export function Th({ children, width, align }: { children: ReactNode; width?: number; align?: "left" | "right" | "center" }) {
  return <View style={{ width, paddingHorizontal: 10, paddingVertical: 8 }}><Text style={{ fontSize: 10, fontWeight: "700", color: C.mutedFg, textTransform: "uppercase", letterSpacing: 0.3, textAlign: align || "left" }}>{children}</Text></View>;
}

// Table data cell
export function Td({ children, width, align }: { children: ReactNode; width?: number; align?: "left" | "right" | "center" }) {
  return <View style={{ width, paddingHorizontal: 10, paddingVertical: 8 }}><Text style={{ fontSize: 12, color: C.fg, textAlign: align || "left" }}>{children}</Text></View>;
}

// Section header
export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <Text style={{ fontSize: 14, fontWeight: "700", color: C.fg }}>{title}</Text>
      {action}
    </View>
  );
}

// Card
export function Card({ children, style }: { children: ReactNode; style?: any }) {
  return <View style={{ backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 16, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, ...style }}>{children}</View>;
}

// Field
export function Field({ label, value, onChange, placeholder, type, multiline }: {
  label: string; value: string; onChange?: (v: string) => void; placeholder?: string; type?: "text" | "number"; multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 11, fontWeight: "600", color: C.mutedFg, marginBottom: 3 }}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} keyboardType={type === "number" ? "numeric" : "default"} multiline={multiline} editable={!!onChange} style={{ backgroundColor: onChange ? C.card : C.muted, borderWidth: 1, borderColor: C.border, borderRadius: 7, paddingHorizontal: 10, paddingVertical: 7, fontSize: 13, color: C.fg, minHeight: multiline ? 70 : 36 }} />
    </View>
  );
}

// Detail panel (right side)
export function DetailPanel({ visible, onClose, title, children, footer, width = 400 }: {
  visible: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; width?: number;
}) {
  if (!visible) return null;
  return (
    <View style={{ width, borderLeftWidth: 1, borderLeftColor: C.border, backgroundColor: C.card }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 14, fontWeight: "700", color: C.fg }}>{title}</Text>
        <Pressable onPress={onClose}><Text style={{ fontSize: 18, color: C.mutedFg }}>✕</Text></Pressable>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}><View style={{ padding: 16 }}>{children}</View></ScrollView>
      {footer && <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border, flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>{footer}</View>}
    </View>
  );
}

// Modal
export function ModalDlg({ visible, onClose, title, children, footer, size = "md" }: {
  visible: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; size?: "sm" | "md" | "lg";
}) {
  const w = { sm: 340, md: 480, lg: 640 }[size];
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 20 }} onPress={onClose}>
        <Pressable style={{ backgroundColor: C.card, borderRadius: 14, width: w, maxWidth: "90%", maxHeight: "80%", overflow: "hidden" }} onPress={(e) => e.stopPropagation()}>
          <View style={{ paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: C.fg }}>{title}</Text>
            <Pressable onPress={onClose}><Text style={{ fontSize: 18, color: C.mutedFg }}>✕</Text></Pressable>
          </View>
          <ScrollView style={{ paddingHorizontal: 18, paddingVertical: 14 }}>{children}</ScrollView>
          {footer && <View style={{ paddingHorizontal: 18, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border, flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>{footer}</View>}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Loading
export function Loading() {
  return <View style={{ alignItems: "center", paddingVertical: 40 }}><ActivityIndicator size="large" color={C.primary} /><Text style={{ fontSize: 12, color: C.mutedFg, marginTop: 8 }}>Loading…</Text></View>;
}

// Empty state
export function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return <View style={{ alignItems: "center", paddingVertical: 40 }}><Text style={{ fontSize: 28, marginBottom: 6 }}>{icon}</Text><Text style={{ fontSize: 14, fontWeight: "600", color: C.fg }}>{title}</Text><Text style={{ fontSize: 12, color: C.mutedFg, marginTop: 4, textAlign: "center", maxWidth: 280 }}>{desc}</Text></View>;
}

// Page header
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 16 }}>
      <View><Text style={{ fontSize: 20, fontWeight: "700", color: C.fg }}>{title}</Text>{subtitle && <Text style={{ fontSize: 12, color: C.mutedFg, marginTop: 2 }}>{subtitle}</Text>}</View>
      {actions && <View style={{ flexDirection: "row", gap: 8 }}>{actions}</View>}
    </View>
  );
}

// Toast system
interface Toast { id: number; msg: string; type: "success" | "error" | "info" | "warning"; }
let toastId = 0; let toastCb: ((t: Toast) => void) | null = null;
export function toast(msg: string, type: Toast["type"] = "info") { if (toastCb) toastCb({ id: ++toastId, msg, type }); }
export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => { toastCb = (t) => { setToasts(p => [...p, t]); setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 3500); }; return () => { toastCb = null; }; }, []);
  const tc = { success: C.success, error: C.red, info: C.blue, warning: C.amber };
  return (
    <View style={{ position: "absolute", top: 60, right: 16, zIndex: 9999, gap: 8 }}>
      {toasts.map(t => (
        <View key={t.id} style={{ backgroundColor: C.card, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: tc[t.type], maxWidth: 340, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tc[t.type] }} />
            <Text style={{ fontSize: 12, color: C.fg, flex: 1 }}>{t.msg}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
