# Akoka Federal Academy — Results Dashboard

A standalone React Native Web implementation of the supplied Akoka Federal Academy dashboard screenshot.

**Target reference:** 1471 × 1024 desktop screenshot.  
**Recommended runtime:** Expo + React Native Web.  
**Important accuracy note:** This is a close visual recreation based on the screenshot, not the original source project. The crest is an SVG approximation; exact school branding requires the original logo asset. Data is illustrative and all backend actions are placeholders.

## 1. Create the project

```bash
npx create-expo-app@latest akoka-results-dashboard
cd akoka-results-dashboard
npx expo install react-native-web react-dom @expo/metro-runtime react-native-svg
npm install lucide-react-native
```

Replace `App.js` with the complete code below.

Run:

```bash
npx expo start --web
```

For the closest visual match, view it at a desktop viewport of approximately **1471 × 1024**, browser zoom 100%.

## 2. `App.js`

```jsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, TextInput, Pressable, StyleSheet, useWindowDimensions,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import {
  Home, Settings, BookOpen, Users, FileText, Shield, CloudUpload,
  ClipboardCheck, Bell, Sun, ChevronDown, Search, CalendarDays,
  AlertCircle, Cloud, Clipboard, CheckCircle2, ArrowRight, Eye,
  Pencil, FileCheck, GraduationCap, Menu, X, ArrowUpRight,
} from 'lucide-react-native';

const COLORS = {
  dark: '#00372D', dark2: '#002F27', green: '#08765F', green2: '#0B8B70',
  ink: '#142F4D', muted: '#647F9E', border: '#DCE6EE', bg: '#F7F9FB',
  blue: '#2675D2', purple: '#7950D2', orange: '#D58A13', red: '#D92E32',
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

const navGroups = [
  { heading: 'OVERVIEW', links: [['Dashboard', Home]] },
  { heading: 'SETUP', links: [
    ['School Configuration', Settings], ['Subjects & Classes', BookOpen],
    ['Students', Users], ['Assessment Configuration', FileText], ['Users & Permissions', Shield],
  ]},
  { heading: 'WORKFLOW', links: [
    ['Upload Results', CloudUpload], ['Review & Compile', ClipboardCheck], ['Report Cards', FileText],
  ]},
  { heading: 'SYSTEM', links: [['Settings', Settings]] },
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

function Sidebar({ active, setActive, collapsed }) {
  return (
    <View style={[s.sidebar, collapsed && { width: 76 }]}>
      <View style={s.brand}>
        <Crest size={48} light />
        {!collapsed && <View style={{ flex: 1 }}>
          <Text style={s.brandName}>Akoka Federal</Text>
          <Text style={s.brandName}>Academy</Text>
          <Text style={s.brandSub}>Result Compilation System</Text>
        </View>}
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {navGroups.map(group => <View key={group.heading} style={s.navGroup}>
          {!collapsed && <Text style={s.navHeading}>{group.heading}</Text>}
          {group.links.map(([label, Icon]) => <Pressable key={label} onPress={() => setActive(label)}
            style={[s.navLink, active === label && s.navSelected]}>
            <Icon size={20} color="#F1FFFA" strokeWidth={2.2} />
            {!collapsed && <Text style={s.navLabel}>{label}</Text>}
          </Pressable>)}
        </View>)}
      </ScrollView>
      {!collapsed && <View style={s.sideFooter}>
        <GraduationCap size={27} color="#E8FFF7" />
        <View><Text style={s.footerName}>Akoka Federal Academy</Text><Text style={s.footerMotto}>Excellence  ·  Discipline  ·  Success</Text></View>
      </View>}
    </View>
  );
}

function StatCard({ icon: Icon, label, value, change, tone = 'green', noChange = false }) {
  return (
    <View style={s.statCard}>
      <View style={[s.statIcon, s[`tone_${tone}`]]}><Icon size={24} color={tone === 'green' ? '#08704F' : tone === 'blue' ? '#176DDA' : tone === 'purple' ? '#6E35D4' : '#D2870B'} strokeWidth={2.3} /></View>
      <View style={{ flex: 1 }}>
        <Text style={s.statLabel}>{label}</Text>
        <Text style={s.statValue}>{value}</Text>
        <Text style={[s.statChange, noChange && { color: '#7188A2' }]}>{noChange ? '—  No change' : `↑  ${change}`}</Text>
      </View>
    </View>
  );
}

const workflow = [
  { label: 'Uploaded', detail: 'Results submitted\\nby teachers', count: '243 batches', icon: CloudUpload, tone: 'green' },
  { label: 'Under Review', detail: 'Being checked\\nby admin', count: '48 batches', icon: Clipboard, tone: 'orange' },
  { label: 'Verified', detail: 'Results verified\\nand approved', count: '37 batches', icon: Shield, tone: 'blue' },
  { label: 'Compiled', detail: 'Class results\\ncompiled', count: '28 batches', icon: Settings, tone: 'purple' },
  { label: 'Published', detail: 'Report cards\\npublished', count: '82 batches', icon: CheckCircle2, tone: 'green' },
];

function WorkflowCard() {
  return (
    <View style={s.workflowCard}>
      <Text style={s.panelTitle}>Result Compilation Workflow</Text>
      <View style={s.workflowSteps}>
        {workflow.map((step, i) => {
          const Icon = step.icon;
          return <React.Fragment key={step.label}>
            <View style={s.workflowStep}>
              <View style={[s.workflowIcon, s[`tone_${step.tone}`]]}><Icon size={24} color={step.tone === 'green' ? '#08704F' : step.tone === 'orange' ? '#D2870B' : step.tone === 'blue' ? '#176DDA' : '#6E35D4'} strokeWidth={2.4} /></View>
              <Text style={s.workflowLabel}>{step.label}</Text>
              <Text style={s.workflowDetail}>{step.detail}</Text>
              <View style={[s.countPill, s[`pill_${step.tone}`]]}><Text style={[s.countText, { color: step.tone === 'orange' ? '#C47B0B' : step.tone === 'blue' ? '#236AC1' : step.tone === 'purple' ? '#7044C6' : '#08704F' }]}>{step.count}</Text></View>
            </View>
            {i < workflow.length - 1 && <ArrowRight size={19} color="#91A6BD" style={s.workflowArrow} />}
          </React.Fragment>;
        })}
      </View>
    </View>
  );
}

function IncompleteCard() {
  return (
    <View style={s.incompleteCard}>
      <View style={s.incompleteHeading}><View style={s.alertCircle}><AlertCircle size={25} color="#FFFFFF" fill="#D92E32" /></View><Text style={s.incompleteTitle}>Incomplete Results</Text></View>
      <Text style={s.incompleteNumber}>31</Text>
      <Text style={s.incompleteCopy}>batches have incomplete results{'\n'}across various classes and subjects.</Text>
      <Pressable style={s.reviewButton}><Eye size={16} color="#FFFFFF" /><Text style={s.reviewButtonText}>Review Results</Text></Pressable>
    </View>
  );
}

function StatusPill({ status }) {
  const styles = {
    Published: [ '#D9F4E6', '#08754F' ], Verified: [ '#DFECFF', '#236FD0' ],
    'Under Review': [ '#FFF0D4', '#C27A08' ], Compiled: [ '#EFE3FF', '#7443C8' ],
  };
  const [bg, color] = styles[status] || styles.Verified;
  return <View style={[s.statusPill, { backgroundColor: bg }]}><Text style={[s.statusText, { color }]}>{status}</Text></View>;
}

function RecentBatches({ search }) {
  const filtered = useMemo(() => batches.filter(row => row.join(' ').toLowerCase().includes(search.toLowerCase())), [search]);
  const headers = ['Batch Name', 'Class', 'Subject', 'Teacher', 'Status', 'Date'];
  return (
    <View style={s.recentCard}>
      <View style={s.panelHeader}><Text style={s.panelTitle}>Recent Result Batches</Text><Pressable style={s.viewAll}><Text style={s.viewAllText}>View all</Text><ArrowUpRight size={14} color="#55799B" /></Pressable></View>
      <View style={s.batchTable}>
        <View style={[s.batchRow, s.batchHead]}>{headers.map(h => <Text key={h} style={[s.batchCell, s.batchHeaderText]}>{h}</Text>)}</View>
        {filtered.map((row, idx) => <View key={idx} style={s.batchRow}>
          <Text numberOfLines={1} style={[s.batchCell, s.batchName]}>{row[0]}</Text>
          <Text style={s.batchCell}>{row[1]}</Text><Text style={s.batchCell}>{row[2]}</Text>
          <Text numberOfLines={1} style={s.batchCell}>{row[3]}</Text>
          <View style={s.batchCell}><StatusPill status={row[4]} /></View>
          <Text style={s.batchCell}>{row[5]}</Text>
        </View>)}
        {filtered.length === 0 && <Text style={s.noResults}>No matching batches found.</Text>}
      </View>
    </View>
  );
}

function RecentActivity() {
  return (
    <View style={s.activityCard}>
      <View style={s.panelHeader}><Text style={s.panelTitle}>Recent Activity</Text><Pressable style={s.viewAll}><Text style={s.viewAllText}>View all</Text><ArrowUpRight size={14} color="#55799B" /></Pressable></View>
      {activities.map((item, i) => {
        const Icon = item.icon;
        return <View key={i} style={s.activityRow}>
          <View style={[s.activityIcon, s[`tone_${item.tone}`]]}><Icon size={19} color={item.tone === 'green' ? '#08704F' : item.tone === 'blue' ? '#176DDA' : '#6E35D4'} strokeWidth={2.3} /></View>
          <View style={s.activityText}><Text style={s.activityTitle}>{item.title}</Text><Text numberOfLines={1} style={s.activityDetail}>{item.detail}</Text></View>
          <Text style={s.activityTime}>{item.time}</Text>
        </View>;
      })}
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const [active, setActive] = useState('Dashboard');
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const narrow = width < 1120;

  return (
    <View style={[s.app, dark && { backgroundColor: '#EFF3F6' }]}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} />
      <View style={[s.main, { marginLeft: collapsed ? 76 : 255 }]}>
        <View style={s.topbar}>
          <View style={s.topLeft}>
            <Pressable onPress={() => setCollapsed(!collapsed)} style={s.menuButton}><Menu size={19} color="#45698D" /></Pressable>
            <Text style={s.topTitle}>{active}</Text>
          </View>
          <View style={s.globalSearch}><Search size={16} color="#8299B1" /><TextInput value={search} onChangeText={setSearch} placeholder="Search students, subjects, classes, or batches..." placeholderTextColor="#8097B0" style={s.globalSearchInput} /></View>
          <View style={s.topRight}>
            <View style={s.bellWrap}><Bell size={19} color="#41698F" /><View style={s.badge}><Text style={s.badgeText}>3</Text></View></View>
            <Pressable onPress={() => setDark(!dark)} style={s.themeSwitch}><Sun size={15} color="#637F9D" /><View style={s.switchTrack}><View style={s.switchDot} /></View></Pressable>
            <View style={s.topSeparator} />
            <View style={s.adminCircle}><Text style={s.adminInitials}>AD</Text></View>
            <View><Text style={s.adminName}>Administrator</Text><Text style={s.adminRole}>School Admin</Text></View>
            <ChevronDown size={14} color="#527493" />
          </View>
        </View>

        <ScrollView style={s.contentScroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <View style={s.welcomeRow}>
            <View><Text style={s.welcomeTitle}>Good morning, Administrator</Text><Text style={s.welcomeSubtitle}>Here's your school's result compilation overview.</Text></View>
            <View style={s.dateCard}><CalendarDays size={17} color="#5C7695" /><View><Text style={s.dateMain}>Tuesday, 26 August 2025</Text><Text style={s.dateSub}>Academic Session: 2024/2025  |  Term: Second Term</Text></View></View>
          </View>

          <View style={s.statsGrid}>
            <StatCard icon={Users} label="Total Students" value="140" change="2 new this term" />
            <StatCard icon={Users} label="Teachers" value="12" noChange tone="blue" />
            <StatCard icon={FileText} label="Result Batches" value="243" change="18 new this term" tone="purple" />
            <StatCard icon={FileText} label="Published Report Cards" value="82" change="12% from last term" />
          </View>

          <View style={[s.workflowRow, narrow && { flexDirection: 'column' }]}>
            <View style={{ flex: 1, minWidth: 0 }}><WorkflowCard /></View>
            <View style={[s.incompleteWrap, narrow && { width: '100%' }]}><IncompleteCard /></View>
          </View>

          <View style={[s.bottomGrid, narrow && { flexDirection: 'column' }]}>
            <View style={{ flex: 1.65, minWidth: 0 }}><RecentBatches search={search} /></View>
            <View style={{ flex: 1, minWidth: 0 }}><RecentActivity /></View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  app: { flex: 1, minHeight: '100vh', flexDirection: 'row', backgroundColor: '#F7F9FB', fontFamily: 'Arial, sans-serif' },
  sidebar: { width: 255, position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 5, backgroundColor: COLORS.dark2, paddingHorizontal: 11, paddingTop: 17, paddingBottom: 17 },
  brand: { height: 75, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.13)', marginBottom: 20 },
  brandName: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', lineHeight: 18 },
  brandSub: { color: '#DCEFE9', fontSize: 10, marginTop: 3 },
  navGroup: { marginBottom: 21 },
  navHeading: { color: '#D4E8E1', fontSize: 10, fontWeight: '700', letterSpacing: 0.45, marginHorizontal: 12, marginBottom: 9 },
  navLink: { height: 38, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 13, borderRadius: 6, marginBottom: 1 },
  navSelected: { backgroundColor: '#176B58', borderWidth: 1, borderColor: 'rgba(112,218,181,0.16)' },
  navLabel: { color: '#F5FFFC', fontSize: 12, fontWeight: '500' },
  sideFooter: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)' },
  footerName: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  footerMotto: { color: '#C8E2D9', fontSize: 8, marginTop: 5 },
  main: { flex: 1, minWidth: 0, marginLeft: 255 },
  topbar: { height: 69, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2EAF0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 23, gap: 25 },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 210 },
  menuButton: { padding: 2 },
  topTitle: { color: '#152D48', fontSize: 21, fontWeight: '800' },
  globalSearch: { height: 37, width: '36%', maxWidth: 455, minWidth: 200, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 7, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 10 },
  globalSearchInput: { flex: 1, fontSize: 11, color: '#3B5B7B', outlineStyle: 'none' },
  topRight: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 13 },
  bellWrap: { position: 'relative', padding: 6 },
  badge: { position: 'absolute', top: 0, right: 0, width: 14, height: 14, borderRadius: 8, backgroundColor: '#E23B42', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800' },
  themeSwitch: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: '#DFE7ED', borderRadius: 20, padding: 4 },
  switchTrack: { width: 32, height: 17, borderRadius: 10, backgroundColor: '#07533F', alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 2 },
  switchDot: { width: 13, height: 13, borderRadius: 7, backgroundColor: '#FFFFFF' },
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
  statsGrid: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  statCard: { flex: 1, minWidth: 0, height: 132, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E8EF', borderRadius: 7, paddingHorizontal: 19, paddingVertical: 19, flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
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
  workflowSteps: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', marginTop: 20 },
  workflowStep: { flex: 1, alignItems: 'center', minWidth: 0 },
  workflowIcon: { width: 51, height: 51, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  workflowLabel: { color: '#17334F', fontSize: 12, fontWeight: '800', marginTop: 11 },
  workflowDetail: { color: '#627A96', fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: 9, minHeight: 34 },
  countPill: { minWidth: 91, paddingHorizontal: 10, height: 23, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  pill_green: { backgroundColor: '#E6F7EE' },
  pill_orange: { backgroundColor: '#FFF3DC' },
  pill_blue: { backgroundColor: '#E7F0FF' },
  pill_purple: { backgroundColor: '#F0E8FF' },
  countText: { fontSize: 9, fontWeight: '700' },
  workflowArrow: { marginTop: 16, flexShrink: 0 },
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
});
```

## 3. What is implemented

- Desktop sidebar with active Dashboard navigation state.
- Header with global search, notification badge, theme toggle, and administrator profile.
- Welcome heading and academic date/session panel.
- Four dashboard metric cards.
- Five-step result compilation workflow.
- Incomplete-results warning panel and review button.
- Recent result batches table with status badges.
- Recent activity list with matching icon treatments.
- Global search filters the recent result batch list.
- Sidebar can collapse and expand.
- The layout stacks the workflow and lower panels at narrower widths.

## 4. What is intentionally not connected

This is a front-end recreation, not a complete school management backend. The following are visual/demo controls until connected to real services:

- Search is local to the sample batch data.
- The date/session panel is static sample content.
- Review Results and View all do not navigate to implemented pages.
- Notification, administrator menu, and theme switch are presentation-level controls.
- No real result upload, verification, compilation, publication, or database persistence is implemented.

## 5. Matching the screenshot

Use a desktop browser at roughly **1471 × 1024**, with zoom at 100%. The source image does not contain separate original logo or icon assets, so the crest is recreated as a vector approximation and the icons use Lucide. For a pixel-accurate crest, replace the `Crest` component with the school's official SVG or transparent PNG.
