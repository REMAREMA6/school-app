import React, { useMemo, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TextInput, Pressable, StyleSheet, Modal, ActivityIndicator,
  useWindowDimensions, Platform,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import {
  Home, Settings, BookOpen, Users, FileText, Shield, CloudUpload,
  ClipboardCheck, Bell, Sun, Moon, ChevronDown, Search, CalendarDays,
  AlertCircle, Cloud, Clipboard, CheckCircle2, ArrowRight, Eye,
  Pencil, FileCheck, GraduationCap, Menu, X, ArrowUpRight,
  TrendingUp, UserCircle, LogOut, Sliders,
} from 'lucide-react-native';

const COLORS = {
  dark: '#00372D', dark2: '#002F27', green: '#08765F', green2: '#0B8B70',
  ink: '#142F4D', muted: '#647F9E', border: '#DCE6EE', bg: '#F7F9FB',
  blue: '#2675D2', purple: '#7950D2', orange: '#D58A13', red: '#D92E32',
};
const DARK_COLORS = {
  dark2: '#001A14', bg: '#0A1410', card: '#0E1F18', border: '#1A2E24',
  ink: '#E8F0EC', muted: '#8A9D94', text: '#D0E0D8',
};

function Crest({ size = 48, light = false }) {
  const stroke = light ? '#FFFFFF' : '#075340';
  return (
    <Svg width={size} height={size * 1.12} viewBox="0 0 64 72">
      <Path d="M7 8 L32 3 L57 8 L56 42 Q52 58 32 68 Q12 58 8 42 Z" fill="none" stroke={stroke} strokeWidth="3.2" />
      <Path d="M13 13 L32 9 L51 13 L50 41 Q46 53 32 61 Q18 53 14 41 Z" fill="none" stroke={stroke} strokeWidth="1.3" />
      <Path d="M21 23 L28 18 L32 25 L36 18 L43 23 L39 31 L44 42 L37 42 L32 34 L27 42 L20 42 L25 31 Z" fill={stroke} />
      <Path d="M27 46 L37 46 M29 50 L35 50" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="32" cy="15" r="2" fill={stroke} />
    </Svg>
  );
}

// === Toast system ===
let toastId = 0;
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = 'info') => {
    const id = ++toastId;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return { toasts, show };
}

const navGroups = [
  { heading: 'OVERVIEW', links: [['Dashboard', Home]] },
  { heading: 'SETUP', links: [
    ['School Configuration', Settings], ['Subjects & Classes', BookOpen],
    ['Students', Users], ['Assessment Configuration', FileText], ['Users & Permissions', Shield],
  ]},
  { heading: 'WORKFLOW', links: [
    ['Upload Results', CloudUpload], ['Review & Compile', ClipboardCheck], ['Report Cards', FileText],
  ]},
  { heading: 'SYSTEM', links: [['Settings', Sliders]] },
];

const batches = [
  ['JSS1 Mathematics – Test 1', 'JSS1A', 'Mathematics', 'Mr. A. Adeyemi', 'Published', 'Aug 24, 2025'],
  ['SS2 Biology – Test 2', 'SS2B', 'Biology', 'Mrs. O. Bello', 'Verified', 'Aug 23, 2025'],
  ['JSS3 English – Test 1', 'JSS3A', 'English Language', 'Mr. T. Okafor', 'Under Review', 'Aug 22, 2025'],
  ['SS1 Chemistry – Test 2', 'SS1C', 'Chemistry', 'Mrs. E. Hassan', 'Published', 'Aug 21, 2025'],
  ['JSS2 Social Studies – Test 1', 'JSS2B', 'Social Studies', 'Mr. C. Ibrahim', 'Compiled', 'Aug 20, 2025'],
  ['SS3 Physics – Test 2', 'SS3A', 'Physics', 'Mrs. F. Williams', 'Verified', 'Aug 19, 2025'],
  ['JSS1 ICT – Test 1', 'JSS1B', 'ICT', 'Mr. D. Musa', 'Under Review', 'Aug 18, 2025'],
  ['SS2 Government – Test 2', 'SS2A', 'Government', 'Mrs. L. Adebayo', 'Published', 'Aug 17, 2025'],
];

const activities = [
  { title: 'Result uploaded', detail: 'JSS2B Mathematics – Test 1 by Mr. A. Adeyemi', time: '2h ago', icon: CloudUpload, tone: 'green' },
  { title: 'Score corrected', detail: 'SS1C Chemistry – Test 2 by Mrs. E. Hassan', time: '4h ago', icon: Pencil, tone: 'blue' },
  { title: 'Result compiled', detail: 'JSS3A English – Test 1 by Mr. T. Okafor', time: '6h ago', icon: CheckCircle2, tone: 'purple' },
  { title: 'Report card published', detail: 'SS2B Biology – Term 2 by Mrs. O. Bello', time: '8h ago', icon: FileCheck, tone: 'green' },
  { title: 'Result uploaded', detail: 'SS1A Physics – Test 1 by Mr. D. Musa', time: '10h ago', icon: CloudUpload, tone: 'green' },
  { title: 'Score corrected', detail: 'JSS1A Mathematics – Test 1 by Mr. A. Adeyemi', time: '12h ago', icon: Pencil, tone: 'blue' },
  { title: 'Report card published', detail: 'JSS3C Further Mathematics – Term 2 by Mrs. L. Adebayo', time: '14h ago', icon: FileCheck, tone: 'green' },
];

const notifications = [
  { title: '31 batches have incomplete results', time: '1h ago', type: 'alert' },
  { title: '48 batches awaiting review', time: '3h ago', type: 'warning' },
  { title: '82 report cards published', time: '5h ago', type: 'success' },
];

function Sidebar({ active, setActive, collapsed, dark }) {
  const sb = dark ? DARK_COLORS : COLORS;
  return (
    <View style={[s.sidebar, collapsed && { width: 76 }, dark && { backgroundColor: DARK_COLORS.dark2 }]}>
      <View style={s.brand}>
        <Crest size={collapsed ? 36 : 48} light />
        {!collapsed && <View style={{ flex: 1 }}>
          <Text style={s.brandName}>Akoka Federal</Text>
          <Text style={s.brandName}>Academy</Text>
          <Text style={s.brandSub}>Result Compilation System</Text>
        </View>}
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {navGroups.map(group => <View key={group.heading} style={s.navGroup}>
          {!collapsed && <Text style={s.navHeading}>{group.heading}</Text>}
          {group.links.map(([label, Icon]) => (
            <Pressable key={label} onPress={() => setActive(label)}
              style={[s.navLink, active === label && (dark ? s.navSelectedDark : s.navSelected)]}>
              <Icon size={20} color="#F1FFFA" strokeWidth={2.2} />
              {!collapsed && <Text style={[s.navLabel, active === label && { fontWeight: '700' }]}>{label}</Text>}
            </Pressable>
          ))}
        </View>)}
      </ScrollView>
      {!collapsed && <View style={s.sideFooter}>
        <GraduationCap size={27} color="#E8FFF7" />
        <View><Text style={s.footerName}>Akoka Federal Academy</Text><Text style={s.footerMotto}>Excellence  ·  Discipline  ·  Success</Text></View>
      </View>}
    </View>
  );
}

function StatCard({ icon: Icon, label, value, change, tone = 'green', noChange = false, dark, onPress }) {
  const tc = { green: '#08704F', blue: '#176DDA', purple: '#6E35D4', orange: '#D2870B' };
  return (
    <Pressable onPress={onPress} style={[s.statCard, dark && { backgroundColor: DARK_COLORS.card, borderColor: DARK_COLORS.border }]}>
      <View style={[s.statIcon, s[`tone_${tone}`]]}><Icon size={24} color={tc[tone]} strokeWidth={2.3} /></View>
      <View style={{ flex: 1 }}>
        <Text style={[s.statLabel, dark && { color: DARK_COLORS.muted }]}>{label}</Text>
        <Text style={[s.statValue, dark && { color: DARK_COLORS.ink }]}>{value}</Text>
        <Text style={[s.statChange, noChange && { color: '#7188A2' }]}>{noChange ? '—  No change' : `↑  ${change}`}</Text>
      </View>
    </Pressable>
  );
}

const workflow = [
  { label: 'Uploaded', detail: 'Results submitted\nby teachers', count: '243 batches', icon: CloudUpload, tone: 'green' },
  { label: 'Under Review', detail: 'Being checked\nby admin', count: '48 batches', icon: Clipboard, tone: 'orange' },
  { label: 'Verified', detail: 'Results verified\nand approved', count: '37 batches', icon: Shield, tone: 'blue' },
  { label: 'Compiled', detail: 'Class results\ncompiled', count: '28 batches', icon: Settings, tone: 'purple' },
  { label: 'Published', detail: 'Report cards\npublished', count: '82 batches', icon: CheckCircle2, tone: 'green' },
];

function WorkflowCard({ dark, onStep }) {
  const tc = { green: '#08704F', orange: '#D2870B', blue: '#176DDA', purple: '#6E35D4' };
  return (
    <View style={[s.workflowCard, dark && { backgroundColor: DARK_COLORS.card, borderColor: DARK_COLORS.border }]}>
      <Text style={[s.panelTitle, dark && { color: DARK_COLORS.ink }]}>Result Compilation Workflow</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 20 }}>
        <View style={s.workflowSteps}>
          {workflow.map((step, i) => {
            const Icon = step.icon;
            return <React.Fragment key={step.label}>
              <Pressable onPress={() => onStep(step)} style={s.workflowStep}>
                <View style={[s.workflowIcon, s[`tone_${step.tone}`]]}><Icon size={24} color={tc[step.tone]} strokeWidth={2.4} /></View>
                <Text style={[s.workflowLabel, dark && { color: DARK_COLORS.ink }]}>{step.label}</Text>
                <Text style={[s.workflowDetail, dark && { color: DARK_COLORS.muted }]}>{step.detail}</Text>
                <View style={[s.countPill, s[`pill_${step.tone}`]]}><Text style={[s.countText, { color: tc[step.tone] }]}>{step.count}</Text></View>
              </Pressable>
              {i < workflow.length - 1 && <View style={s.workflowArrowWrap}><ArrowRight size={19} color="#91A6BD" /></View>}
            </React.Fragment>;
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function IncompleteCard({ dark, onReview }) {
  return (
    <View style={[s.incompleteCard, dark && { backgroundColor: '#1A0E0C', borderColor: '#3A1A18' }]}>
      <View style={s.incompleteHeading}>
        <View style={s.alertCircle}><AlertCircle size={25} color="#FFFFFF" fill="#D92E32" /></View>
        <Text style={s.incompleteTitle}>Incomplete Results</Text>
      </View>
      <Text style={s.incompleteNumber}>31</Text>
      <Text style={[s.incompleteCopy, dark && { color: DARK_COLORS.muted }]}>batches have incomplete results{'\n'}across various classes and subjects.</Text>
      <Pressable onPress={onReview} style={s.reviewButton}><Eye size={16} color="#FFFFFF" /><Text style={s.reviewButtonText}>Review Results</Text></Pressable>
    </View>
  );
}

function StatusPill({ status }) {
  const styles = {
    Published: ['#D9F4E6', '#08754F'], Verified: ['#DFECFF', '#236FD0'],
    'Under Review': ['#FFF0D4', '#C27A08'], Compiled: ['#EFE3FF', '#7443C8'],
  };
  const [bg, color] = styles[status] || styles.Verified;
  return <View style={[s.statusPill, { backgroundColor: bg }]}><Text style={[s.statusText, { color }]}>{status}</Text></View>;
}

function RecentBatches({ search, dark, onRowPress }) {
  const filtered = useMemo(() => batches.filter(row => row.join(' ').toLowerCase().includes(search.toLowerCase())), [search]);
  const headers = ['Batch Name', 'Class', 'Subject', 'Teacher', 'Status', 'Date'];
  return (
    <View style={[s.recentCard, dark && { backgroundColor: DARK_COLORS.card, borderColor: DARK_COLORS.border }]}>
      <View style={s.panelHeader}>
        <Text style={[s.panelTitle, dark && { color: DARK_COLORS.ink }]}>Recent Result Batches</Text>
        <Pressable style={s.viewAll} onPress={() => {}}><Text style={s.viewAllText}>View all</Text><ArrowUpRight size={14} color="#55799B" /></Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: 700 }}>
          <View style={[s.batchRow, s.batchHead, dark && { backgroundColor: DARK_COLORS.dark2 }]}>
            {headers.map(h => <Text key={h} style={[s.batchCell, s.batchHeaderText, dark && { color: DARK_COLORS.muted }]}>{h}</Text>)}
          </View>
          {filtered.map((row, idx) => (
            <Pressable key={idx} onPress={() => onRowPress(row)} style={[s.batchRow, dark && { borderBottomColor: DARK_COLORS.border }]}>
              <Text numberOfLines={1} style={[s.batchCell, s.batchName, dark && { color: DARK_COLORS.text }]}>{row[0]}</Text>
              <Text style={[s.batchCell, dark && { color: DARK_COLORS.text }]}>{row[1]}</Text>
              <Text style={[s.batchCell, dark && { color: DARK_COLORS.text }]}>{row[2]}</Text>
              <Text numberOfLines={1} style={[s.batchCell, dark && { color: DARK_COLORS.text }]}>{row[3]}</Text>
              <View style={s.batchCell}><StatusPill status={row[4]} /></View>
              <Text style={[s.batchCell, dark && { color: DARK_COLORS.muted }]}>{row[5]}</Text>
            </Pressable>
          ))}
          {filtered.length === 0 && <Text style={[s.noResults, dark && { color: DARK_COLORS.muted }]}>No matching batches found.</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

function RecentActivity({ dark, onItemPress }) {
  const tc = { green: '#08704F', blue: '#176DDA', purple: '#6E35D4' };
  return (
    <View style={[s.activityCard, dark && { backgroundColor: DARK_COLORS.card, borderColor: DARK_COLORS.border }]}>
      <View style={s.panelHeader}>
        <Text style={[s.panelTitle, dark && { color: DARK_COLORS.ink }]}>Recent Activity</Text>
        <Pressable style={s.viewAll} onPress={() => {}}><Text style={s.viewAllText}>View all</Text><ArrowUpRight size={14} color="#55799B" /></Pressable>
      </View>
      {activities.map((item, i) => {
        const Icon = item.icon;
        return (
          <Pressable key={i} onPress={() => onItemPress(item)} style={[s.activityRow, dark && { borderBottomColor: DARK_COLORS.border }]}>
            <View style={[s.activityIcon, s[`tone_${item.tone}`]]}><Icon size={19} color={tc[item.tone]} strokeWidth={2.3} /></View>
            <View style={s.activityText}>
              <Text style={[s.activityTitle, dark && { color: DARK_COLORS.ink }]}>{item.title}</Text>
              <Text numberOfLines={1} style={[s.activityDetail, dark && { color: DARK_COLORS.muted }]}>{item.detail}</Text>
            </View>
            <Text style={[s.activityTime, dark && { color: DARK_COLORS.muted }]}>{item.time}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// === Notification dropdown ===
function NotificationDropdown({ visible, onClose, dark }) {
  if (!visible) return null;
  return (
    <View style={[s.dropdown, dark && { backgroundColor: DARK_COLORS.card, borderColor: DARK_COLORS.border }]}>
      <View style={s.dropdownHeader}>
        <Text style={[s.dropdownTitle, dark && { color: DARK_COLORS.ink }]}>Notifications</Text>
        <Pressable onPress={onClose}><X size={16} color="#647F9E" /></Pressable>
      </View>
      {notifications.map((n, i) => (
        <Pressable key={i} onPress={onClose} style={[s.dropdownItem, dark && { borderBottomColor: DARK_COLORS.border }]}>
          <View style={[s.dropdownDot, n.type === 'alert' && { backgroundColor: COLORS.red }, n.type === 'warning' && { backgroundColor: COLORS.orange }, n.type === 'success' && { backgroundColor: COLORS.green }]} />
          <View style={{ flex: 1 }}>
            <Text style={[s.dropdownItemText, dark && { color: DARK_COLORS.text }]}>{n.title}</Text>
            <Text style={[s.dropdownItemTime, dark && { color: DARK_COLORS.muted }]}>{n.time}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

// === Admin menu dropdown ===
function AdminDropdown({ visible, onClose, dark }) {
  if (!visible) return null;
  const menuItems = [
    { label: 'My Profile', icon: UserCircle },
    { label: 'Settings', icon: Settings },
    { label: 'Sign Out', icon: LogOut, danger: true },
  ];
  return (
    <View style={[s.dropdown, { right: 20, top: 60, width: 200 }, dark && { backgroundColor: DARK_COLORS.card, borderColor: DARK_COLORS.border }]}>
      {menuItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <Pressable key={i} onPress={() => { onClose(); }} style={[s.dropdownItem, { paddingVertical: 10 }, dark && { borderBottomColor: DARK_COLORS.border }]}>
            <Icon size={16} color={item.danger ? COLORS.red : '#41698F'} />
            <Text style={[s.dropdownItemText, item.danger && { color: COLORS.red }, dark && !item.danger && { color: DARK_COLORS.text }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// === Batch detail modal ===
function BatchModal({ visible, batch, onClose, dark }) {
  if (!batch) return null;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.modalOverlay} onPress={onClose}>
        <View style={[s.modalCard, dark && { backgroundColor: DARK_COLORS.card, borderColor: DARK_COLORS.border }]}>
          <View style={s.modalHeader}>
            <Text style={[s.modalTitle, dark && { color: DARK_COLORS.ink }]}>Batch Details</Text>
            <Pressable onPress={onClose}><X size={18} color="#647F9E" /></Pressable>
          </View>
          <View style={{ padding: 20 }}>
            <Text style={[s.modalLabel, dark && { color: DARK_COLORS.muted }]}>BATCH NAME</Text>
            <Text style={[s.modalValue, dark && { color: DARK_COLORS.ink }]}>{batch[0]}</Text>
            <View style={{ flexDirection: 'row', gap: 20, marginTop: 16 }}>
              <View style={{ flex: 1 }}><Text style={[s.modalLabel, dark && { color: DARK_COLORS.muted }]}>CLASS</Text><Text style={[s.modalValue, dark && { color: DARK_COLORS.ink }]}>{batch[1]}</Text></View>
              <View style={{ flex: 1 }}><Text style={[s.modalLabel, dark && { color: DARK_COLORS.muted }]}>SUBJECT</Text><Text style={[s.modalValue, dark && { color: DARK_COLORS.ink }]}>{batch[2]}</Text></View>
            </View>
            <View style={{ flexDirection: 'row', gap: 20, marginTop: 16 }}>
              <View style={{ flex: 1 }}><Text style={[s.modalLabel, dark && { color: DARK_COLORS.muted }]}>TEACHER</Text><Text style={[s.modalValue, dark && { color: DARK_COLORS.ink }]}>{batch[3]}</Text></View>
              <View style={{ flex: 1 }}><Text style={[s.modalLabel, dark && { color: DARK_COLORS.muted }]}>DATE</Text><Text style={[s.modalValue, dark && { color: DARK_COLORS.ink }]}>{batch[5]}</Text></View>
            </View>
            <View style={{ marginTop: 16 }}><Text style={[s.modalLabel, dark && { color: DARK_COLORS.muted }]}>STATUS</Text><View style={{ marginTop: 6 }}><StatusPill status={batch[4]} /></View></View>
          </View>
          <View style={s.modalFooter}>
            <Pressable onPress={onClose} style={[s.modalBtn, s.modalBtnOutline]}><Text style={s.modalBtnText}>Close</Text></Pressable>
            <Pressable onPress={() => { onClose(); }} style={[s.modalBtn, s.modalBtnPrimary]}><Text style={[s.modalBtnText, { color: '#fff' }]}>View Details</Text></Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

// === Toast container ===
function ToastContainer({ toasts }) {
  const tc = { success: COLORS.green, error: COLORS.red, info: COLORS.blue, warning: COLORS.orange };
  return (
    <View style={s.toastContainer}>
      {toasts.map(t => (
        <View key={t.id} style={[s.toast, { borderLeftColor: tc[t.type] }]}>
          <Text style={s.toastText}>{t.msg}</Text>
        </View>
      ))}
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const [active, setActive] = useState('Dashboard');
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const { toasts, show } = useToasts();

  const narrow = width < 1200;
  const veryNarrow = width < 900;

  // Auto-collapse sidebar on very narrow screens
  React.useEffect(() => {
    if (veryNarrow && !collapsed) setCollapsed(true);
    if (!veryNarrow && collapsed && width > 900) setCollapsed(false);
  }, [width]);

  const sidebarWidth = collapsed ? 76 : 255;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[s.app, dark && { backgroundColor: DARK_COLORS.bg }]}>
        <Sidebar active={active} setActive={(label) => { setActive(label); show(`Navigated to ${label}`, 'info'); }} collapsed={collapsed} dark={dark} />
        <View style={[s.main, { marginLeft: sidebarWidth }]}>
          {/* Top bar */}
          <View style={[s.topbar, dark && { backgroundColor: DARK_COLORS.card, borderBottomColor: DARK_COLORS.border }]}>
            <View style={s.topLeft}>
              <Pressable onPress={() => setCollapsed(!collapsed)} style={s.menuButton}><Menu size={19} color="#45698D" /></Pressable>
              <Text style={[s.topTitle, dark && { color: DARK_COLORS.ink }]}>{active}</Text>
            </View>
            {!veryNarrow && (
              <View style={[s.globalSearch, dark && { borderColor: DARK_COLORS.border, backgroundColor: DARK_COLORS.card }]}>
                <Search size={16} color="#8299B1" />
                <TextInput value={search} onChangeText={setSearch} placeholder="Search students, subjects, classes, or batches..." placeholderTextColor="#8097B0" style={[s.globalSearchInput, dark && { color: DARK_COLORS.text }]} />
              </View>
            )}
            <View style={s.topRight}>
              <Pressable onPress={() => { setShowNotif(!showNotif); setShowAdmin(false); }} style={s.bellWrap}>
                <Bell size={19} color={dark ? DARK_COLORS.muted : '#41698F'} />
                <View style={s.badge}><Text style={s.badgeText}>3</Text></View>
              </Pressable>
              <Pressable onPress={() => { setDark(!dark); show(dark ? 'Light mode' : 'Dark mode', 'info'); }} style={s.themeSwitch}>
                {dark ? <Moon size={15} color="#E8C84A" /> : <Sun size={15} color="#637F9D" />}
                <View style={s.switchTrack}><View style={[s.switchDot, dark && { alignSelf: 'flex-start' }]} /></View>
              </Pressable>
              {!veryNarrow && <View style={[s.topSeparator, dark && { backgroundColor: DARK_COLORS.border }]} />}
              {!veryNarrow && (
                <Pressable onPress={() => { setShowAdmin(!showAdmin); setShowNotif(false); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={s.adminCircle}><Text style={s.adminInitials}>AD</Text></View>
                  <View><Text style={[s.adminName, dark && { color: DARK_COLORS.ink }]}>Administrator</Text><Text style={[s.adminRole, dark && { color: DARK_COLORS.muted }]}>School Admin</Text></View>
                  <ChevronDown size={14} color="#527493" />
                </Pressable>
              )}
            </View>
          </View>

          {/* Dropdowns */}
          <NotificationDropdown visible={showNotif} onClose={() => setShowNotif(false)} dark={dark} />
          <AdminDropdown visible={showAdmin} onClose={() => setShowAdmin(false)} dark={dark} />

          {/* Content */}
          <ScrollView style={s.contentScroll} contentContainerStyle={[s.content, veryNarrow && { paddingHorizontal: 12 }]} showsVerticalScrollIndicator={false}>
            {/* Welcome */}
            <View style={[s.welcomeRow, narrow && { flexDirection: 'column', gap: 12 }]}>
              <View>
                <Text style={[s.welcomeTitle, dark && { color: DARK_COLORS.ink }]}>Good morning, Administrator</Text>
                <Text style={[s.welcomeSubtitle, dark && { color: DARK_COLORS.muted }]}>Here's your school's result compilation overview.</Text>
              </View>
              <View style={[s.dateCard, narrow && { minWidth: 0, width: '100%' }, dark && { backgroundColor: DARK_COLORS.card, borderColor: DARK_COLORS.border }]}>
                <CalendarDays size={17} color="#5C7695" />
                <View>
                  <Text style={[s.dateMain, dark && { color: DARK_COLORS.ink }]}>Tuesday, 26 August 2025</Text>
                  <Text style={[s.dateSub, dark && { color: DARK_COLORS.muted }]}>Academic Session: 2024/2025  |  Term: Second Term</Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View style={[s.statsGrid, narrow && { flexWrap: 'wrap' }]}>
              <StatCard icon={Users} label="Total Students" value="140" change="2 new this term" dark={dark} onPress={() => show('140 students across 15 class arms', 'info')} />
              <StatCard icon={Users} label="Teachers" value="12" noChange tone="blue" dark={dark} onPress={() => show('12 active teachers', 'info')} />
              <StatCard icon={FileText} label="Result Batches" value="243" change="18 new this term" tone="purple" dark={dark} onPress={() => show('243 batches uploaded', 'info')} />
              <StatCard icon={FileText} label="Published Report Cards" value="82" change="12% from last term" dark={dark} onPress={() => show('82 report cards published', 'success')} />
            </View>

            {/* Workflow + Alert */}
            <View style={[s.workflowRow, narrow && { flexDirection: 'column' }]}>
              <View style={{ flex: 1, minWidth: 0 }}><WorkflowCard dark={dark} onStep={(step) => show(`${step.label}: ${step.count}`, 'info')} /></View>
              <View style={[s.incompleteWrap, narrow && { width: '100%' }]}><IncompleteCard dark={dark} onReview={() => show('Opening review screen...', 'info')} /></View>
            </View>

            {/* Batches + Activity */}
            <View style={[s.bottomGrid, narrow && { flexDirection: 'column' }]}>
              <View style={{ flex: 1.65, minWidth: 0 }}><RecentBatches search={search} dark={dark} onRowPress={(row) => setSelectedBatch(row)} /></View>
              <View style={{ flex: 1, minWidth: 0 }}><RecentActivity dark={dark} onItemPress={(item) => show(`${item.title}: ${item.detail}`, 'info')} /></View>
            </View>
          </ScrollView>
        </View>

        {/* Modals */}
        <BatchModal visible={!!selectedBatch} batch={selectedBatch} onClose={() => setSelectedBatch(null)} dark={dark} />

        {/* Toasts */}
        <ToastContainer toasts={toasts} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  app: { flex: 1, minHeight: '100vh', flexDirection: 'row', backgroundColor: '#F7F9FB' },
  sidebar: { width: 255, ...(Platform.OS === 'web' ? { position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 5 } : {}), backgroundColor: COLORS.dark2, paddingHorizontal: 11, paddingTop: 17, paddingBottom: 17 },
  brand: { height: 75, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.13)', marginBottom: 20 },
  brandName: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', lineHeight: 18 },
  brandSub: { color: '#DCEFE9', fontSize: 10, marginTop: 3 },
  navGroup: { marginBottom: 21 },
  navHeading: { color: '#D4E8E1', fontSize: 10, fontWeight: '700', letterSpacing: 0.45, marginHorizontal: 12, marginBottom: 9 },
  navLink: { height: 38, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 13, borderRadius: 6, marginBottom: 1 },
  navSelected: { backgroundColor: '#176B58', borderWidth: 1, borderColor: 'rgba(112,218,181,0.16)' },
  navSelectedDark: { backgroundColor: '#0D3329', borderWidth: 1, borderColor: 'rgba(112,218,181,0.16)' },
  navLabel: { color: '#F5FFFC', fontSize: 12, fontWeight: '500' },
  sideFooter: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)' },
  footerName: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  footerMotto: { color: '#C8E2D9', fontSize: 8, marginTop: 5 },
  main: { flex: 1, minWidth: 0 },
  topbar: { height: 69, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2EAF0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 23, gap: 25 },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 100 },
  menuButton: { padding: 2 },
  topTitle: { color: '#152D48', fontSize: 21, fontWeight: '800' },
  globalSearch: { height: 37, flex: 1, maxWidth: 455, minWidth: 150, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 7, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 10, backgroundColor: '#FFFFFF' },
  globalSearchInput: { flex: 1, fontSize: 11, color: '#3B5B7B', outlineStyle: 'none', padding: 0 },
  topRight: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 13 },
  bellWrap: { position: 'relative', padding: 6 },
  badge: { position: 'absolute', top: 0, right: 0, width: 14, height: 14, borderRadius: 8, backgroundColor: '#E23B42', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800' },
  themeSwitch: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: '#DFE7ED', borderRadius: 20, padding: 4 },
  switchTrack: { width: 32, height: 17, borderRadius: 10, backgroundColor: '#07533F', paddingHorizontal: 2, justifyContent: 'center' },
  switchDot: { width: 13, height: 13, borderRadius: 7, backgroundColor: '#FFFFFF', alignSelf: 'flex-end' },
  topSeparator: { width: 1, height: 34, backgroundColor: '#DCE5EC', marginHorizontal: 4 },
  adminCircle: { width: 36, height: 36, borderRadius: 20, backgroundColor: '#003D31', alignItems: 'center', justifyContent: 'center' },
  adminInitials: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  adminName: { color: '#1B3551', fontSize: 11, fontWeight: '700' },
  adminRole: { color: '#6D849E', fontSize: 9, marginTop: 3 },
  contentScroll: { flex: 1 },
  content: { padding: 23, paddingBottom: 30 },
  welcomeRow: { minHeight: 80, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  welcomeTitle: { color: '#064333', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  welcomeSubtitle: { color: '#647F9E', fontSize: 13, marginTop: 7 },
  dateCard: { minWidth: 365, minHeight: 63, borderWidth: 1, borderColor: '#DFE7ED', borderRadius: 7, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 11 },
  dateMain: { color: '#3F5B79', fontSize: 11, fontWeight: '600' },
  dateSub: { color: '#7187A0', fontSize: 10, marginTop: 9 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 20 },
  statCard: { flex: 1, minWidth: 200, minHeight: 132, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E8EF', borderRadius: 7, paddingHorizontal: 19, paddingVertical: 19, flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  statIcon: { width: 43, height: 43, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tone_green: { backgroundColor: '#DFF5E9' },
  tone_blue: { backgroundColor: '#E0ECFF' },
  tone_purple: { backgroundColor: '#EFE4FF' },
  tone_orange: { backgroundColor: '#FFF0D4' },
  statLabel: { color: '#4D6683', fontSize: 11, fontWeight: '600', marginTop: 7 },
  statValue: { color: '#102C48', fontSize: 25, fontWeight: '800', marginTop: 8 },
  statChange: { color: '#08784F', fontSize: 10, fontWeight: '600', marginTop: 9 },
  workflowRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  workflowCard: { minHeight: 235, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE7EE', borderRadius: 7, padding: 15 },
  panelTitle: { color: '#142F4D', fontSize: 15, fontWeight: '800' },
  workflowSteps: { flexDirection: 'row', alignItems: 'flex-start', gap: 5 },
  workflowStep: { alignItems: 'center', minWidth: 120 },
  workflowIcon: { width: 51, height: 51, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  workflowLabel: { color: '#17334F', fontSize: 12, fontWeight: '800', marginTop: 11 },
  workflowDetail: { color: '#627A96', fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: 9, minHeight: 34 },
  countPill: { minWidth: 91, paddingHorizontal: 10, height: 23, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  pill_green: { backgroundColor: '#E6F7EE' },
  pill_orange: { backgroundColor: '#FFF3DC' },
  pill_blue: { backgroundColor: '#E7F0FF' },
  pill_purple: { backgroundColor: '#F0E8FF' },
  countText: { fontSize: 9, fontWeight: '700' },
  workflowArrowWrap: { marginTop: 16, flexShrink: 0 },
  incompleteWrap: { width: '31%' },
  incompleteCard: { minHeight: 235, backgroundColor: '#FFF9F8', borderWidth: 1, borderColor: '#F4C9C7', borderRadius: 7, padding: 18 },
  incompleteHeading: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  alertCircle: { width: 38, height: 38, borderRadius: 20, backgroundColor: '#D92E32', alignItems: 'center', justifyContent: 'center' },
  incompleteTitle: { color: '#D92E32', fontSize: 16, fontWeight: '800' },
  incompleteNumber: { color: '#D9383C', fontSize: 43, fontWeight: '800', marginTop: 13, lineHeight: 48 },
  incompleteCopy: { color: '#637B96', fontSize: 12, lineHeight: 19, marginTop: 1 },
  reviewButton: { height: 36, alignSelf: 'flex-start', minWidth: 153, borderRadius: 6, backgroundColor: '#00513D', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingHorizontal: 14, marginTop: 17 },
  reviewButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  bottomGrid: { flexDirection: 'row', gap: 20, alignItems: 'stretch' },
  recentCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE7EE', borderRadius: 7, padding: 15, minHeight: 416 },
  activityCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE7EE', borderRadius: 7, padding: 15, minHeight: 416 },
  panelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  viewAll: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  viewAllText: { color: '#3E5F80', fontSize: 10, fontWeight: '600' },
  batchTable: { borderRadius: 6, overflow: 'hidden' },
  batchRow: { minHeight: 39, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E8EEF3', paddingHorizontal: 10, gap: 7 },
  batchHead: { minHeight: 37, backgroundColor: '#F2F5F7', borderBottomWidth: 0 },
  batchCell: { flex: 1, minWidth: 0, color: '#405D7D', fontSize: 9 },
  batchName: { flex: 1.65 },
  batchHeaderText: { color: '#334F6E', fontSize: 9, fontWeight: '800' },
  statusPill: { alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 8, fontWeight: '700' },
  noResults: { textAlign: 'center', color: '#7187A0', fontSize: 11, padding: 25 },
  activityRow: { minHeight: 55, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E9EFF4', gap: 12 },
  activityIcon: { width: 35, height: 35, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  activityText: { flex: 1, minWidth: 0, gap: 5 },
  activityTitle: { color: '#213B57', fontSize: 10, fontWeight: '800' },
  activityDetail: { color: '#7187A0', fontSize: 9 },
  activityTime: { color: '#6C83A0', fontSize: 9, alignSelf: 'flex-start', marginTop: 13 },
  // Dropdown
  dropdown: { position: 'absolute', top: 60, right: 80, width: 320, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2EAF0', borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, zIndex: 100 },
  dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' },
  dropdownTitle: { color: '#142F4D', fontSize: 14, fontWeight: '700' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' },
  dropdownDot: { width: 8, height: 8, borderRadius: 4 },
  dropdownItemText: { color: '#213B57', fontSize: 12, fontWeight: '500' },
  dropdownItemTime: { color: '#7187A0', fontSize: 10, marginTop: 2 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 14, width: 480, maxWidth: '90%', overflow: 'hidden', borderWidth: 1, borderColor: '#E2EAF0' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' },
  modalTitle: { color: '#142F4D', fontSize: 16, fontWeight: '700' },
  modalLabel: { color: '#647F9E', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  modalValue: { color: '#213B57', fontSize: 13, fontWeight: '500' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E2EAF0' },
  modalBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
  modalBtnOutline: { borderWidth: 1, borderColor: '#DCE6EE' },
  modalBtnPrimary: { backgroundColor: '#00513D' },
  modalBtnText: { fontSize: 12, fontWeight: '600', color: '#213B57' },
  // Toast
  toastContainer: { position: 'absolute', top: 80, right: 20, zIndex: 9999, gap: 8 },
  toast: { backgroundColor: '#FFFFFF', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#E2EAF0', borderLeftWidth: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, maxWidth: 340 },
  toastText: { color: '#213B57', fontSize: 12, fontWeight: '500' },
});
