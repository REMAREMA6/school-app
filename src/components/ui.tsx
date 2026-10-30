// Shared UI components for React Native — beautiful, mature design
import { View, Text, Pressable, Modal, TextInput, ScrollView, ActivityIndicator, Switch, Platform } from "react-native";
import { useState, ReactNode, useEffect } from "react";

// ============================================================
// Color system
// ============================================================
export const colors = {
  primary: "#2d6a4f",
  primaryLight: "#52b788",
  primaryBg: "#d8f3dc",
  background: "#f8fafc",
  card: "#ffffff",
  foreground: "#0f172a",
  muted: "#f1f5f9",
  mutedFg: "#64748b",
  border: "#e2e8f0",
  destructive: "#dc2626",
  destructiveBg: "#fee2e2",
  warning: "#d97706",
  warningBg: "#fef3c7",
  success: "#16a34a",
  successBg: "#dcfce7",
  info: "#2563eb",
  infoBg: "#dbeafe",
  amber: "#d97706",
  amberBg: "#fef3c7",
};

// ============================================================
// Card
// ============================================================
export function Card({ children, className = "", onPress }: { children: ReactNode; className?: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        ...(onPress ? { shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } } : {}),
      }}
    >
      {children}
    </Pressable>
  );
}

// ============================================================
// Badge
// ============================================================
const badgeColors: Record<string, { bg: string; fg: string }> = {
  CONFIRMED: { bg: colors.successBg, fg: colors.success },
  PUBLISHED: { bg: colors.successBg, fg: colors.success },
  VERIFIED: { bg: colors.successBg, fg: colors.success },
  APPROVED: { bg: colors.amberBg, fg: colors.amber },
  AWAITING_REVIEW: { bg: colors.infoBg, fg: colors.info },
  READY_FOR_REVIEW: { bg: colors.infoBg, fg: colors.info },
  PROCESSING: { bg: colors.amberBg, fg: colors.amber },
  UPLOADED: { bg: colors.muted, fg: colors.mutedFg },
  DRAFT: { bg: colors.muted, fg: colors.mutedFg },
  FLAGGED_INVALID: { bg: colors.destructiveBg, fg: colors.destructive },
  FLAGGED_UNCERTAIN: { bg: colors.amberBg, fg: colors.amber },
  FAILED: { bg: colors.destructiveBg, fg: colors.destructive },
  REVISED: { bg: colors.amberBg, fg: colors.amber },
  ADMIN: { bg: colors.primaryBg, fg: colors.primary },
  PRINCIPAL: { bg: colors.amberBg, fg: colors.amber },
  TEACHER: { bg: colors.muted, fg: colors.mutedFg },
};
const badgeLabels: Record<string, string> = {
  CONFIRMED: "Confirmed", PUBLISHED: "Published", VERIFIED: "Verified",
  APPROVED: "Approved", AWAITING_REVIEW: "Awaiting review", READY_FOR_REVIEW: "Ready for review",
  PROCESSING: "Processing", UPLOADED: "Uploaded", DRAFT: "Draft",
  FLAGGED_INVALID: "Invalid", FLAGGED_UNCERTAIN: "Uncertain", FAILED: "Failed",
  REVISED: "Revised", ADMIN: "Admin", PRINCIPAL: "Principal", TEACHER: "Teacher",
};
export function Badge({ status }: { status: string }) {
  const c = badgeColors[status] || { bg: colors.muted, fg: colors.mutedFg };
  const label = badgeLabels[status] || status;
  return (
    <View style={{ backgroundColor: c.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ color: c.fg, fontSize: 11, fontWeight: "600" }}>{label}</Text>
    </View>
  );
}

// ============================================================
// Button
// ============================================================
export function Btn({ title, onPress, variant = "default", size = "md", icon, disabled }: {
  title: string; onPress?: () => void; variant?: "default" | "outline" | "ghost" | "destructive"; size?: "sm" | "md"; icon?: string; disabled?: boolean;
}) {
  const variants = {
    default: { bg: colors.primary, fg: "#fff", border: colors.primary },
    outline: { bg: "transparent", fg: colors.foreground, border: colors.border },
    ghost: { bg: "transparent", fg: colors.mutedFg, border: "transparent" },
    destructive: { bg: colors.destructive, fg: "#fff", border: colors.destructive },
  };
  const v = variants[variant];
  const padding = size === "sm" ? { px: 10, py: 5 } : { px: 14, py: 8 };
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? colors.muted : v.bg,
        borderWidth: 1,
        borderColor: disabled ? colors.border : v.border,
        borderRadius: 8,
        paddingHorizontal: padding.px,
        paddingVertical: padding.py,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon && <Text style={{ fontSize: 14 }}>{icon}</Text>}
      <Text style={{ color: disabled ? colors.mutedFg : v.fg, fontSize: size === "sm" ? 12 : 13, fontWeight: "600" }}>{title}</Text>
    </Pressable>
  );
}

// ============================================================
// Modal / Dialog
// ============================================================
export function ModalSheet({ visible, onClose, title, children, footer, size = "md" }: {
  visible: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; size?: "sm" | "md" | "lg";
}) {
  const widths = { sm: 320, md: 480, lg: 640 };
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 20 }} onPress={onClose}>
        <Pressable style={{ backgroundColor: colors.card, borderRadius: 16, width: widths[size], maxWidth: "90%", maxHeight: "85%", overflow: "hidden" }} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>{title}</Text>
            <Pressable onPress={onClose} style={{ padding: 4 }}>
              <Text style={{ fontSize: 20, color: colors.mutedFg }}>✕</Text>
            </Pressable>
          </View>
          {/* Body */}
          <ScrollView style={{ paddingHorizontal: 20, paddingVertical: 16 }} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
          {/* Footer */}
          {footer && (
            <View style={{ paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>
              {footer}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ============================================================
// Input
// ============================================================
export function Field({ label, value, onChangeText, placeholder, type = "text", multiline }: {
  label: string; value: string; onChangeText?: (v: string) => void; placeholder?: string; type?: "text" | "number"; multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.mutedFg, marginBottom: 4, textTransform: "uppercase" }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={type === "number" ? "numeric" : "default"}
        multiline={multiline}
        editable={!!onChangeText}
        style={{
          backgroundColor: onChangeText ? colors.muted : colors.background,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          fontSize: 14,
          color: colors.foreground,
          minHeight: multiline ? 80 : 38,
        }}
      />
    </View>
  );
}

// ============================================================
// Toast system
// ============================================================
interface Toast { id: number; msg: string; type: "success" | "error" | "info" | "warning"; }
let toastId = 0;
let toastCallback: ((t: Toast) => void) | null = null;
export function showToast(msg: string, type: Toast["type"] = "info") {
  if (toastCallback) toastCallback({ id: ++toastId, msg, type });
}
export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    toastCallback = (t) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3500);
    };
    return () => { toastCallback = null; };
  }, []);
  const tColors = { success: colors.success, error: colors.destructive, info: colors.info, warning: colors.amber };
  return (
    <View style={{ position: "absolute", top: 50, right: 16, zIndex: 9999, gap: 8 }}>
      {toasts.map(t => (
        <View key={t.id} style={{ backgroundColor: colors.card, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: tColors[t.type], shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, maxWidth: 360 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: tColors[t.type] }} />
            <Text style={{ fontSize: 13, color: colors.foreground, flex: 1 }}>{t.msg}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ============================================================
// Stat card
// ============================================================
export function StatCard({ label, value, hint, icon, tone, onPress }: {
  label: string; value: string | number; hint?: string; icon?: string; tone?: string; onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, flex: 1, minWidth: 140, ...(onPress ? { shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } } : {}) }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View>
          <Text style={{ fontSize: 11, fontWeight: "600", color: colors.mutedFg, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</Text>
          <Text style={{ fontSize: 24, fontWeight: "700", color: tone || colors.foreground, marginTop: 4 }}>{value}</Text>
          {hint && <Text style={{ fontSize: 11, color: colors.mutedFg, marginTop: 2 }}>{hint}</Text>}
        </View>
        {icon && <Text style={{ fontSize: 20 }}>{icon}</Text>}
      </View>
    </Pressable>
  );
}

// ============================================================
// Empty state
// ============================================================
export function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 48 }}>
      <Text style={{ fontSize: 32, marginBottom: 8 }}>{icon}</Text>
      <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground }}>{title}</Text>
      <Text style={{ fontSize: 13, color: colors.mutedFg, marginTop: 4, textAlign: "center", maxWidth: 300 }}>{description}</Text>
    </View>
  );
}

// ============================================================
// Loading
// ============================================================
export function Loading() {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 48 }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ fontSize: 13, color: colors.mutedFg, marginTop: 8 }}>Loading…</Text>
    </View>
  );
}

// ============================================================
// Section header
// ============================================================
export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 16 }}>
      <View>
        <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>{title}</Text>
        {subtitle && <Text style={{ fontSize: 13, color: colors.mutedFg, marginTop: 2 }}>{subtitle}</Text>}
      </View>
      {action}
    </View>
  );
}
