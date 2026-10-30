// Shared UI components — Linear-inspired, split-panel design
import { View, Text, Pressable, Modal, TextInput, ScrollView, ActivityIndicator, Switch, Platform } from "react-native";
import { useState, ReactNode, useEffect } from "react";

export const C = {
  primary: "#1a5d3a", primaryLight: "#2d8659", primaryBg: "#e8f5ee",
  bg: "#f7f8fa", card: "#ffffff", fg: "#1a1d21", muted: "#f0f1f3", mutedFg: "#6b7280",
  border: "#e5e7eb", destructive: "#dc2626", destructiveBg: "#fef2f2",
  warning: "#d97706", warningBg: "#fffbeb", success: "#16a34a", successBg: "#f0fdf4",
  info: "#2563eb", infoBg: "#eff6ff", sidebar: "#0f3528", sidebarFg: "#c8e6d5",
};

export function Card({ children, style }: { children: ReactNode; style?: any }) {
  return <View style={{ backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 16, ...style }}>{children}</View>;
}

const badgeMap: Record<string, { bg: string; fg: string; label: string }> = {
  CONFIRMED: { bg: C.successBg, fg: C.success, label: "Confirmed" },
  PUBLISHED: { bg: C.successBg, fg: C.success, label: "Published" },
  VERIFIED: { bg: C.successBg, fg: C.success, label: "Verified" },
  APPROVED: { bg: C.warningBg, fg: C.warning, label: "Approved" },
  AWAITING_REVIEW: { bg: C.infoBg, fg: C.info, label: "Awaiting review" },
  READY_FOR_REVIEW: { bg: C.infoBg, fg: C.info, label: "Ready for review" },
  PROCESSING: { bg: C.warningBg, fg: C.warning, label: "Processing" },
  UPLOADED: { bg: C.muted, fg: C.mutedFg, label: "Uploaded" },
  DRAFT: { bg: C.muted, fg: C.mutedFg, label: "Draft" },
  FLAGGED_INVALID: { bg: C.destructiveBg, fg: C.destructive, label: "Invalid" },
  FLAGGED_UNCERTAIN: { bg: C.warningBg, fg: C.warning, label: "Uncertain" },
  FAILED: { bg: C.destructiveBg, fg: C.destructive, label: "Failed" },
  REVISED: { bg: C.warningBg, fg: C.warning, label: "Revised" },
  ADMIN: { bg: C.primaryBg, fg: C.primary, label: "Admin" },
  PRINCIPAL: { bg: C.warningBg, fg: C.warning, label: "Principal" },
  TEACHER: { bg: C.muted, fg: C.mutedFg, label: "Teacher" },
  PENDING_REVIEW: { bg: C.muted, fg: C.mutedFg, label: "Pending" },
  SUPERSEDED: { bg: C.muted, fg: C.mutedFg, label: "Superseded" },
};
export function Badge({ status }: { status: string }) {
  const b = badgeMap[status] || { bg: C.muted, fg: C.mutedFg, label: status };
  return <View style={{ backgroundColor: b.bg, borderRadius: 5, paddingHorizontal: 8, paddingVertical: 2 }}><Text style={{ color: b.fg, fontSize: 10, fontWeight: "600" }}>{b.label}</Text></View>;
}

export function Btn({ title, onPress, variant = "default", size = "md", icon, disabled }: {
  title: string; onPress?: () => void; variant?: "default" | "outline" | "ghost" | "danger"; size?: "sm" | "md"; icon?: string; disabled?: boolean;
}) {
  const v = {
    default: { bg: C.primary, fg: "#fff", border: C.primary },
    outline: { bg: "transparent", fg: C.fg, border: C.border },
    ghost: { bg: "transparent", fg: C.mutedFg, border: "transparent" },
    danger: { bg: C.destructive, fg: "#fff", border: C.destructive },
  }[variant];
  const pad = size === "sm" ? { px: 10, py: 5 } : { px: 14, py: 8 };
  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ backgroundColor: disabled ? C.muted : v.bg, borderWidth: 1, borderColor: disabled ? C.border : v.border, borderRadius: 7, paddingHorizontal: pad.px, paddingVertical: pad.py, flexDirection: "row", alignItems: "center", gap: 6, opacity: disabled ? 0.5 : 1 }}>
      {icon && <Text style={{ fontSize: 13 }}>{icon}</Text>}
      <Text style={{ color: disabled ? C.mutedFg : v.fg, fontSize: size === "sm" ? 12 : 13, fontWeight: "600" }}>{title}</Text>
    </Pressable>
  );
}

export function StatCard({ label, value, hint, trend, onPress }: {
  label: string; value: string | number; hint?: string; trend?: string; onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={{ backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14, flex: 1, minWidth: 130 }}>
      <Text style={{ fontSize: 11, color: C.mutedFg, fontWeight: "500" }}>{label}</Text>
      <Text style={{ fontSize: 26, fontWeight: "700", color: C.fg, marginTop: 2 }}>{value}</Text>
      {(hint || trend) && <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
        {trend && <Text style={{ fontSize: 11, color: C.success, fontWeight: "600" }}>{trend}</Text>}
        {hint && <Text style={{ fontSize: 11, color: C.mutedFg }}>{hint}</Text>}
      </View>}
    </Pressable>
  );
}

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <View style={{ position: "relative", flex: 1 }}>
      <Text style={{ position: "absolute", left: 10, top: 9, fontSize: 14, color: C.mutedFg }}>🔍</Text>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingLeft: 32, paddingRight: 10, paddingVertical: 8, fontSize: 13, color: C.fg }} />
    </View>
  );
}

export function Loading() {
  return <View style={{ alignItems: "center", paddingVertical: 40 }}><ActivityIndicator size="large" color={C.primary} /><Text style={{ fontSize: 12, color: C.mutedFg, marginTop: 8 }}>Loading…</Text></View>;
}

export function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return <View style={{ alignItems: "center", paddingVertical: 40 }}><Text style={{ fontSize: 28, marginBottom: 6 }}>{icon}</Text><Text style={{ fontSize: 14, fontWeight: "600", color: C.fg }}>{title}</Text><Text style={{ fontSize: 12, color: C.mutedFg, marginTop: 4, textAlign: "center", maxWidth: 280 }}>{desc}</Text></View>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 16 }}>
      <View><Text style={{ fontSize: 20, fontWeight: "700", color: C.fg }}>{title}</Text>{subtitle && <Text style={{ fontSize: 12, color: C.mutedFg, marginTop: 2 }}>{subtitle}</Text>}</View>
      {actions && <View style={{ flexDirection: "row", gap: 8 }}>{actions}</View>}
    </View>
  );
}

export function WarnBox({ text, onPress }: { text: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ backgroundColor: C.destructiveBg, borderRadius: 8, padding: 12, flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <Text style={{ fontSize: 14 }}>⚠</Text>
      <Text style={{ fontSize: 12, color: C.destructive, fontWeight: "500", flex: 1 }}>{text}</Text>
      {onPress && <Text style={{ fontSize: 12, color: C.destructive, fontWeight: "700" }}>Review →</Text>}
    </Pressable>
  );
}

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

// Toast system
interface Toast { id: number; msg: string; type: "success" | "error" | "info" | "warning"; }
let toastId = 0; let toastCb: ((t: Toast) => void) | null = null;
export function toast(msg: string, type: Toast["type"] = "info") { if (toastCb) toastCb({ id: ++toastId, msg, type }); }
export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => { toastCb = (t) => { setToasts(p => [...p, t]); setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 3500); }; return () => { toastCb = null; }; }, []);
  const tc = { success: C.success, error: C.destructive, info: C.info, warning: C.warning };
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

// Detail panel (right side)
export function DetailPanel({ visible, onClose, title, children, footer, width = 400 }: {
  visible: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; width?: number;
}) {
  if (!visible) return null;
  return (
    <View style={{ width, borderLeftWidth: 1, borderLeftColor: C.border, backgroundColor: C.card, maxHeight: "100%" }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 14, fontWeight: "700", color: C.fg }}>{title}</Text>
        <Pressable onPress={onClose} style={{ padding: 4 }}><Text style={{ fontSize: 18, color: C.mutedFg }}>✕</Text></Pressable>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16 }}>{children}</View>
      </ScrollView>
      {footer && <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border, flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>{footer}</View>}
    </View>
  );
}

// Modal (for forms that need center-screen focus)
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

// Table helpers
export function Th({ children, width, align }: { children: ReactNode; width?: number; align?: "left" | "right" | "center" }) {
  return <View style={{ width, paddingHorizontal: 8, paddingVertical: 6 }}><Text style={{ fontSize: 10, fontWeight: "700", color: C.mutedFg, textTransform: "uppercase", textAlign: align || "left" }}>{children}</Text></View>;
}
export function Td({ children, width, align }: { children: ReactNode; width?: number; align?: "left" | "right" | "center" }) {
  return <View style={{ width, paddingHorizontal: 8, paddingVertical: 6 }}><Text style={{ fontSize: 12, color: C.fg, textAlign: align || "left" }}>{children}</Text></View>;
}
