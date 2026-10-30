import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, Modal, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';

const COLORS = {
  dark2: '#002F27', green: '#08765F',
  ink: '#142F4D', muted: '#647F9E', border: '#DCE6EE', bg: '#F7F9FB',
  blue: '#2675D2', purple: '#7950D2', orange: '#D58A13', red: '#D92E32',
};
const DARK = { dark2: '#001A14', bg: '#0A1410', card: '#0E1F18', border: '#1A2E24', ink: '#E8F0EC', muted: '#8A9D94', text: '#D0E0D8' };

// Lightweight emoji icon — no SVG, no library, ~0 bytes added to bundle
function I({ emoji, size = 20, color }: { emoji: string; size?: number; color?: string }) {
  return <Text style={{ fontSize: size - 4, textAlign: 'center' }}>{emoji}</Text>;
}

function Crest({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 1.12} viewBox="0 0 64 72">
      <Path d="M7 8 L32 3 L57 8 L56 42 Q52 58 32 68 Q12 58 8 42 Z" fill="none" stroke="#FFFFFF" strokeWidth="3.2" />
      <Path d="M13 13 L32 9 L51 13 L50 41 Q46 53 32 61 Q18 53 14 41 Z" fill="none" stroke="#FFFFFF" strokeWidth="1.3" />
      <Path d="M21 23 L28 18 L32 25 L36 18 L43 23 L39 31 L44 42 L37 42 L32 34 L27 42 L20 42 L25 31 Z" fill="#FFFFFF" />
      <Path d="M27 46 L37 46 M29 50 L35 50" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="32" cy="15" r="2" fill="#FFFFFF" />
    </Svg>
  );
}

// Toast system
let tid = 0;
function useToasts() {
  const [toasts, setToasts] = useState<{id:number;msg:string;type:string}[]>([]);
  const show = useCallback((msg: string, type = 'info') => {
    const id = ++tid; setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return { toasts, show };
}

const NAV = [
  { heading: 'OVERVIEW', links: [['Dashboard', '📊']] },
  { heading: 'SETUP', links: [['School Configuration', '🏫'], ['Subjects & Classes', '📚'], ['Students', '🎓'], ['Assessment Configuration', '📋'], ['Users & Permissions', '👥']] },
  { heading: 'WORKFLOW', links: [['Upload Results', '📤'], ['Review & Compile', '✅'], ['Report Cards', '📄']] },
  { heading: 'SYSTEM', links: [['Settings', '⚙️']] },
];

const BATCHES = [
  ['JSS1 Mathematics – Test 1', 'JSS1A', 'Mathematics', 'Mr. A. Adeyemi', 'Published', 'Aug 24'],
  ['SS2 Biology – Test 2', 'SS2B', 'Biology', 'Mrs. O. Bello', 'Verified', 'Aug 23'],
  ['JSS3 English – Test 1', 'JSS3A', 'English Language', 'Mr. T. Okafor', 'Under Review', 'Aug 22'],
  ['SS1 Chemistry – Test 2', 'SS1C', 'Chemistry', 'Mrs. E. Hassan', 'Published', 'Aug 21'],
  ['JSS2 Social Studies – Test 1', 'JSS2B', 'Social Studies', 'Mr. C. Ibrahim', 'Compiled', 'Aug 20'],
  ['SS3 Physics – Test 2', 'SS3A', 'Physics', 'Mrs. F. Williams', 'Verified', 'Aug 19'],
  ['JSS1 ICT – Test 1', 'JSS1B', 'ICT', 'Mr. D. Musa', 'Under Review', 'Aug 18'],
  ['SS2 Government – Test 2', 'SS2A', 'Government', 'Mrs. L. Adebayo', 'Published', 'Aug 17'],
];

const ACTIVITIES = [
  { t: 'Result uploaded', d: 'JSS2B Mathematics – Test 1 by Mr. A. Adeyemi', time: '2h ago', icon: '📤', tone: 'green' },
  { t: 'Score corrected', d: 'SS1C Chemistry – Test 2 by Mrs. E. Hassan', time: '4h ago', icon: '✏️', tone: 'blue' },
  { t: 'Result compiled', d: 'JSS3A English – Test 1 by Mr. T. Okafor', time: '6h ago', icon: '⚙️', tone: 'purple' },
  { t: 'Report card published', d: 'SS2B Biology – Term 2 by Mrs. O. Bello', time: '8h ago', icon: '📄', tone: 'green' },
  { t: 'Result uploaded', d: 'SS1A Physics – Test 1 by Mr. D. Musa', time: '10h ago', icon: '📤', tone: 'green' },
  { t: 'Score corrected', d: 'JSS1A Mathematics – Test 1 by Mr. A. Adeyemi', time: '12h ago', icon: '✏️', tone: 'blue' },
  { t: 'Report card published', d: 'SS3C Further Maths – Term 2 by Mrs. L. Adebayo', time: '14h ago', icon: '📄', tone: 'green' },
];

const NOTIFS = [
  { title: '31 batches have incomplete results', time: '1h ago', type: 'alert' },
  { title: '48 batches awaiting review', time: '3h ago', type: 'warning' },
  { title: '82 report cards published', time: '5h ago', type: 'success' },
];

const TONE_BG = { green: '#DFF5E9', blue: '#E0ECFF', purple: '#EFE4FF', orange: '#FFF0D4' };
const TONE_FG = { green: '#08704F', blue: '#176DDA', purple: '#6E35D4', orange: '#D2870B' };
const STATUS_STYLES: Record<string, [string, string]> = {
  Published: ['#D9F4E6', '#08754F'], Verified: ['#DFECFF', '#236FD0'],
  'Under Review': ['#FFF0D4', '#C27A08'], Compiled: ['#EFE3FF', '#7443C8'],
};

export default function App() {
  const { width } = useWindowDimensions();
  const [active, setActive] = useState('Dashboard');
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selBatch, setSelBatch] = useState<any>(null);
  const { toasts, show } = useToasts();
  const narrow = width < 1200;
  const veryNarrow = width < 900;

  React.useEffect(() => {
    if (veryNarrow) setCollapsed(true);
    else setCollapsed(false);
  }, [width]);

  const sb = dark ? DARK : COLORS;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, flexDirection: 'row', minHeight: '100vh', backgroundColor: dark ? DARK.bg : COLORS.bg }}>
        {/* SIDEBAR */}
        <View style={{ width: collapsed ? 76 : 255, backgroundColor: COLORS.dark2, paddingTop: 17, paddingBottom: 17, paddingHorizontal: 11 }}>
          <View style={{ height: 75, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.13)', marginBottom: 20 }}>
            <Crest size={collapsed ? 36 : 48} />
            {!collapsed && <View><Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>Akoka Federal</Text><Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>Academy</Text><Text style={{ color: '#DCEFE9', fontSize: 10, marginTop: 3 }}>Result Compilation System</Text></View>}
          </View>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {NAV.map(g => <View key={g.heading} style={{ marginBottom: 21 }}>
              {!collapsed && <Text style={{ color: '#D4E8E1', fontSize: 10, fontWeight: '700', letterSpacing: 0.45, marginHorizontal: 12, marginBottom: 9 }}>{g.heading}</Text>}
              {g.links.map(([label, emoji]) => (
                <Pressable key={label} onPress={() => { setActive(label); show(`Navigated to ${label}`, 'info'); }} style={{ height: 38, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 13, borderRadius: 6, marginBottom: 1, backgroundColor: active === label ? '#176B58' : 'transparent', borderWidth: active === label ? 1 : 0, borderColor: 'rgba(112,218,181,0.16)' }}>
                  <I emoji={emoji} size={20} />
                  {!collapsed && <Text style={{ color: '#F5FFFC', fontSize: 12, fontWeight: active === label ? '700' : '500' }}>{label}</Text>}
                </Pressable>
              ))}
            </View>)}
          </ScrollView>
          {!collapsed && <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)' }}>
            <I emoji="🎓" size={27} />
            <View><Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>Akoka Federal Academy</Text><Text style={{ color: '#C8E2D9', fontSize: 8, marginTop: 5 }}>Excellence · Discipline · Success</Text></View>
          </View>}
        </View>

        {/* MAIN */}
        <View style={{ flex: 1, minWidth: 0 }}>
          {/* TOP BAR */}
          <View style={{ height: 60, backgroundColor: dark ? DARK.card : '#FFFFFF', borderBottomWidth: 1, borderBottomColor: dark ? DARK.border : '#E2EAF0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 20 }}>
            <Pressable onPress={() => setCollapsed(!collapsed)} style={{ padding: 4 }}><I emoji="☰" size={19} /></Pressable>
            <Text style={{ color: dark ? DARK.ink : '#152D48', fontSize: 18, fontWeight: '800', minWidth: 80 }}>{active}</Text>
            {!veryNarrow && <View style={{ height: 37, flex: 1, maxWidth: 400, borderWidth: 1, borderColor: dark ? DARK.border : '#D7E1E9', borderRadius: 7, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 8, backgroundColor: dark ? DARK.card : '#FFFFFF' }}>
              <I emoji="🔍" size={16} />
              <TextInput value={search} onChangeText={setSearch} placeholder="Search students, subjects, batches..." placeholderTextColor="#8097B0" style={{ flex: 1, fontSize: 11, color: dark ? DARK.text : '#3B5B7B', padding: 0 }} />
            </View>}
            <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Pressable onPress={() => { setShowNotif(!showNotif); setShowAdmin(false); }} style={{ position: 'relative', padding: 6 }}>
                <I emoji="🔔" size={19} />
                <View style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, borderRadius: 8, backgroundColor: COLORS.red, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#FFFFFF', fontSize: 8, fontWeight: '800' }}>3</Text></View>
              </Pressable>
              <Pressable onPress={() => { setDark(!dark); show(dark ? 'Light mode' : 'Dark mode', 'info'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: dark ? DARK.border : '#DFE7ED', borderRadius: 20, padding: 4 }}>
                <I emoji={dark ? '🌙' : '☀️'} size={15} />
                <View style={{ width: 30, height: 16, borderRadius: 8, backgroundColor: '#07533F', paddingHorizontal: 2, justifyContent: 'center' }}><View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF', alignSelf: dark ? 'flex-start' : 'flex-end' }} /></View>
              </Pressable>
              {!veryNarrow && <View style={{ width: 1, height: 30, backgroundColor: dark ? DARK.border : '#DCE5EC' }} />}
              {!veryNarrow && <Pressable onPress={() => { setShowAdmin(!showAdmin); setShowNotif(false); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#003D31', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>AD</Text></View>
                <View><Text style={{ color: dark ? DARK.ink : '#1B3551', fontSize: 11, fontWeight: '700' }}>Administrator</Text><Text style={{ color: dark ? DARK.muted : '#6D849E', fontSize: 9 }}>School Admin</Text></View>
                <I emoji="▼" size={14} />
              </Pressable>}
            </View>
          </View>

          {/* NOTIFICATION DROPDOWN */}
          {showNotif && <View style={{ position: 'absolute', top: 55, right: 100, width: 300, backgroundColor: dark ? DARK.card : '#FFFFFF', borderWidth: 1, borderColor: dark ? DARK.border : '#E2EAF0', borderRadius: 10, zIndex: 100, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: dark ? DARK.border : '#E2EAF0' }}>
              <Text style={{ color: dark ? DARK.ink : '#142F4D', fontSize: 14, fontWeight: '700' }}>Notifications</Text>
              <Pressable onPress={() => setShowNotif(false)}><I emoji="✕" size={16} /></Pressable>
            </View>
            {NOTIFS.map((n, i) => <Pressable key={i} onPress={() => { setShowNotif(false); show(n.title, 'info'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: dark ? DARK.border : '#E2EAF0' }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: n.type === 'alert' ? COLORS.red : n.type === 'warning' ? COLORS.orange : COLORS.green }} />
              <View style={{ flex: 1 }}><Text style={{ color: dark ? DARK.text : '#213B57', fontSize: 12, fontWeight: '500' }}>{n.title}</Text><Text style={{ color: dark ? DARK.muted : '#7187A0', fontSize: 10, marginTop: 2 }}>{n.time}</Text></View>
            </Pressable>)}
          </View>}

          {/* ADMIN DROPDOWN */}
          {showAdmin && <View style={{ position: 'absolute', top: 55, right: 20, width: 180, backgroundColor: dark ? DARK.card : '#FFFFFF', borderWidth: 1, borderColor: dark ? DARK.border : '#E2EAF0', borderRadius: 10, zIndex: 100, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
            {[['👤', 'My Profile'], ['⚙️', 'Settings'], ['🚪', 'Sign Out']].map(([emoji, label], i) => (
              <Pressable key={i} onPress={() => { setShowAdmin(false); show(label, 'info'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: dark ? DARK.border : '#E2EAF0' }}>
                <I emoji={emoji} size={16} /><Text style={{ color: label === 'Sign Out' ? COLORS.red : (dark ? DARK.text : '#213B57'), fontSize: 12, fontWeight: '500' }}>{label}</Text>
              </Pressable>
            ))}
          </View>}

          {/* CONTENT */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
            {/* Welcome */}
            <View style={{ flexDirection: narrow ? 'column' : 'row', justifyContent: 'space-between', alignItems: narrow ? 'flex-start' : 'center', marginBottom: 16, gap: narrow ? 12 : 0 }}>
              <View><Text style={{ color: dark ? DARK.ink : '#064333', fontSize: 24, fontWeight: '800' }}>Good morning, Administrator</Text><Text style={{ color: dark ? DARK.muted : '#647F9E', fontSize: 12, marginTop: 4 }}>Here's your school's result compilation overview.</Text></View>
              <View style={{ borderWidth: 1, borderColor: dark ? DARK.border : '#DFE7ED', borderRadius: 7, backgroundColor: dark ? DARK.card : '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, minWidth: narrow ? 0 : 320 }}>
                <I emoji="📅" size={17} /><View><Text style={{ color: dark ? DARK.ink : '#3F5B79', fontSize: 11, fontWeight: '600' }}>Tuesday, 26 August 2025</Text><Text style={{ color: dark ? DARK.muted : '#7187A0', fontSize: 10, marginTop: 2 }}>Academic Session: 2024/2025 | Term: Second Term</Text></View>
              </View>
            </View>

            {/* Stat cards */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              {[['Total Students', '140', '↑ 2 new this term', 'green', '👥', true], ['Teachers', '12', '— No change', 'blue', '👤', true], ['Result Batches', '243', '↑ 18 new this term', 'purple', '📋', true], ['Published Report Cards', '82', '↑ 12% from last term', 'green', '📄', true]].map(([label, val, trend, tone, icon, clickable]: any) => (
                <Pressable key={label} onPress={() => clickable && show(`${label}: ${val}`, 'info')} style={{ flex: 1, minWidth: 200, minHeight: 110, backgroundColor: dark ? DARK.card : '#FFFFFF', borderWidth: 1, borderColor: dark ? DARK.border : '#E0E8EF', borderRadius: 7, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: TONE_BG[tone as keyof typeof TONE_BG], alignItems: 'center', justifyContent: 'center' }}><I emoji={icon} size={24} /></View>
                  <View style={{ flex: 1 }}><Text style={{ color: dark ? DARK.muted : '#4D6683', fontSize: 11, fontWeight: '600', marginTop: 4 }}>{label}</Text><Text style={{ color: dark ? DARK.ink : '#102C48', fontSize: 22, fontWeight: '800', marginTop: 4 }}>{val}</Text><Text style={{ color: trend.includes('No change') ? '#7188A2' : '#08784F', fontSize: 10, fontWeight: '600', marginTop: 4 }}>{trend}</Text></View>
                </Pressable>
              ))}
            </View>

            {/* Workflow + Alert */}
            <View style={{ flexDirection: narrow ? 'column' : 'row', gap: 14, marginBottom: 16 }}>
              <View style={{ flex: 1, minWidth: 0, backgroundColor: dark ? DARK.card : '#FFFFFF', borderWidth: 1, borderColor: dark ? DARK.border : '#DFE7EE', borderRadius: 7, padding: 14 }}>
                <Text style={{ color: dark ? DARK.ink : '#142F4D', fontSize: 14, fontWeight: '800' }}>Result Compilation Workflow</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 4 }}>
                    {[['☁️', 'Uploaded', 'Results submitted\nby teachers', '243 batches', 'green'], ['📋', 'Under Review', 'Being checked\nby admin', '48 batches', 'orange'], ['🛡️', 'Verified', 'Results verified\nand approved', '37 batches', 'blue'], ['⚙️', 'Compiled', 'Class results\ncompiled', '28 batches', 'purple'], ['✅', 'Published', 'Report cards\npublished', '82 batches', 'green']].map(([icon, label, desc, count, tone]: any, i: number) => (
                      <React.Fragment key={label}>
                        <Pressable onPress={() => show(`${label}: ${count}`, 'info')} style={{ alignItems: 'center', minWidth: 110 }}>
                          <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: TONE_BG[tone as keyof typeof TONE_BG], alignItems: 'center', justifyContent: 'center' }}><I emoji={icon} size={24} /></View>
                          <Text style={{ color: dark ? DARK.ink : '#17334F', fontSize: 11, fontWeight: '800', marginTop: 8 }}>{label}</Text>
                          <Text style={{ color: dark ? DARK.muted : '#627A96', fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: 4 }}>{desc}</Text>
                          <View style={{ backgroundColor: TONE_BG[tone as keyof typeof TONE_BG], borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginTop: 8 }}><Text style={{ color: TONE_FG[tone as keyof typeof TONE_FG], fontSize: 9, fontWeight: '700' }}>{count}</Text></View>
                        </Pressable>
                        {i < 4 && <Text style={{ color: '#91A6BD', fontSize: 14, marginTop: 16 }}>→</Text>}
                      </React.Fragment>
                    ))}
                  </View>
                </ScrollView>
              </View>
              {/* Alert */}
              <View style={{ width: narrow ? '100%' : '30%', backgroundColor: '#FFF9F8', borderWidth: 1, borderColor: '#F4C9C7', borderRadius: 7, padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.red, alignItems: 'center', justifyContent: 'center' }}><I emoji="⚠️" size={20} /></View>
                  <Text style={{ color: COLORS.red, fontSize: 14, fontWeight: '800' }}>Incomplete Results</Text>
                </View>
                <Text style={{ color: '#D9383C', fontSize: 36, fontWeight: '800', marginTop: 10 }}>31</Text>
                <Text style={{ color: '#637B96', fontSize: 11, lineHeight: 17 }}>batches have incomplete results across various classes and subjects.</Text>
                <Pressable onPress={() => show('Opening review screen...', 'info')} style={{ backgroundColor: '#00513D', borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, marginTop: 12, alignSelf: 'flex-start' }}>
                  <I emoji="👁" size={16} /><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Review Results</Text>
                </Pressable>
              </View>
            </View>

            {/* Batches + Activity */}
            <View style={{ flexDirection: narrow ? 'column' : 'row', gap: 16 }}>
              {/* Batches */}
              <View style={{ flex: narrow ? 1 : 1.65, minWidth: 0, backgroundColor: dark ? DARK.card : '#FFFFFF', borderWidth: 1, borderColor: dark ? DARK.border : '#DFE7EE', borderRadius: 7, padding: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ color: dark ? DARK.ink : '#142F4D', fontSize: 14, fontWeight: '800' }}>Recent Result Batches</Text>
                  <Pressable onPress={() => show('View all batches', 'info')}><Text style={{ color: '#3E5F80', fontSize: 10, fontWeight: '600' }}>View all ↗</Text></Pressable>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ minWidth: 650 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: dark ? DARK.dark2 : '#F2F5F7', paddingVertical: 8, paddingHorizontal: 8, borderRadius: 4, marginBottom: 2 }}>
                      {['Batch Name', 'Class', 'Subject', 'Teacher', 'Status', 'Date'].map(h => <Text key={h} style={{ flex: h === 'Batch Name' ? 1.6 : 1, fontSize: 9, fontWeight: '800', color: dark ? DARK.muted : '#334F6E' }}>{h}</Text>)}
                    </View>
                    {BATCHES.filter(r => r.join(' ').toLowerCase().includes(search.toLowerCase())).map((row, i) => {
                      const [bg, fg] = STATUS_STYLES[row[4]] || STATUS_STYLES.Verified;
                      return (
                        <Pressable key={i} onPress={() => setSelBatch(row)} style={{ flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: dark ? DARK.border : '#E8EEF3' }}>
                          <Text numberOfLines={1} style={{ flex: 1.6, fontSize: 9, color: dark ? DARK.text : '#405D7D' }}>{row[0]}</Text>
                          <Text style={{ flex: 1, fontSize: 9, color: dark ? DARK.text : '#405D7D' }}>{row[1]}</Text>
                          <Text style={{ flex: 1, fontSize: 9, color: dark ? DARK.text : '#405D7D' }}>{row[2]}</Text>
                          <Text numberOfLines={1} style={{ flex: 1, fontSize: 9, color: dark ? DARK.text : '#405D7D' }}>{row[3]}</Text>
                          <View style={{ flex: 1 }}><View style={{ backgroundColor: bg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' }}><Text style={{ color: fg, fontSize: 8, fontWeight: '700' }}>{row[4]}</Text></View></View>
                          <Text style={{ flex: 1, fontSize: 9, color: dark ? DARK.muted : '#405D7D' }}>{row[5]}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
              {/* Activity */}
              <View style={{ flex: 1, minWidth: 0, backgroundColor: dark ? DARK.card : '#FFFFFF', borderWidth: 1, borderColor: dark ? DARK.border : '#DFE7EE', borderRadius: 7, padding: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ color: dark ? DARK.ink : '#142F4D', fontSize: 14, fontWeight: '800' }}>Recent Activity</Text>
                  <Pressable onPress={() => show('View all activity', 'info')}><Text style={{ color: '#3E5F80', fontSize: 10, fontWeight: '600' }}>View all ↗</Text></Pressable>
                </View>
                {ACTIVITIES.map((a, i) => (
                  <Pressable key={i} onPress={() => show(`${a.t}: ${a.d}`, 'info')} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: dark ? DARK.border : '#E9EFF4' }}>
                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: TONE_BG[a.tone as keyof typeof TONE_BG], alignItems: 'center', justifyContent: 'center' }}><I emoji={a.icon} size={18} /></View>
                    <View style={{ flex: 1, minWidth: 0 }}><Text style={{ color: dark ? DARK.ink : '#213B57', fontSize: 10, fontWeight: '800' }}>{a.t}</Text><Text numberOfLines={1} style={{ color: dark ? DARK.muted : '#7187A0', fontSize: 9, marginTop: 2 }}>{a.d}</Text></View>
                    <Text style={{ color: dark ? DARK.muted : '#6C83A0', fontSize: 9 }}>{a.time}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>

        {/* BATCH MODAL */}
        {selBatch && (
          <Modal visible transparent animationType="fade" onRequestClose={() => setSelBatch(null)}>
            <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => setSelBatch(null)}>
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, width: 440, maxWidth: '90%', overflow: 'hidden' }} onPress={(e: any) => e.stopPropagation()}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#142F4D' }}>Batch Details</Text>
                  <Pressable onPress={() => setSelBatch(null)}><I emoji="✕" size={18} /></Pressable>
                </View>
                <View style={{ padding: 18 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#647F9E', textTransform: 'uppercase' }}>Batch Name</Text>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: '#213B57', marginBottom: 14 }}>{selBatch[0]}</Text>
                  <View style={{ flexDirection: 'row', gap: 20 }}>
                    <View style={{ flex: 1 }}><Text style={{ fontSize: 10, fontWeight: '700', color: '#647F9E' }}>Class</Text><Text style={{ fontSize: 13, color: '#213B57' }}>{selBatch[1]}</Text></View>
                    <View style={{ flex: 1 }}><Text style={{ fontSize: 10, fontWeight: '700', color: '#647F9E' }}>Subject</Text><Text style={{ fontSize: 13, color: '#213B57' }}>{selBatch[2]}</Text></View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 20, marginTop: 14 }}>
                    <View style={{ flex: 1 }}><Text style={{ fontSize: 10, fontWeight: '700', color: '#647F9E' }}>Teacher</Text><Text style={{ fontSize: 13, color: '#213B57' }}>{selBatch[3]}</Text></View>
                    <View style={{ flex: 1 }}><Text style={{ fontSize: 10, fontWeight: '700', color: '#647F9E' }}>Date</Text><Text style={{ fontSize: 13, color: '#213B57' }}>{selBatch[5]}</Text></View>
                  </View>
                  <View style={{ marginTop: 14 }}><Text style={{ fontSize: 10, fontWeight: '700', color: '#647F9E' }}>Status</Text>
                    <View style={{ marginTop: 6 }}>{(() => { const [bg, fg] = STATUS_STYLES[selBatch[4]] || STATUS_STYLES.Verified; return <View style={{ backgroundColor: bg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' }}><Text style={{ color: fg, fontSize: 10, fontWeight: '700' }}>{selBatch[4]}</Text></View>; })()}</View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingHorizontal: 18, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E2EAF0' }}>
                  <Pressable onPress={() => setSelBatch(null)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: '#DCE6EE' }}><Text style={{ fontSize: 12, fontWeight: '600', color: '#213B57' }}>Close</Text></Pressable>
                  <Pressable onPress={() => { setSelBatch(null); show('Opening batch details...', 'info'); }} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, backgroundColor: '#00513D' }}><Text style={{ fontSize: 12, fontWeight: '600', color: '#FFFFFF' }}>View Details</Text></Pressable>
                </View>
              </View>
            </Pressable>
          </Modal>
        )}

        {/* TOASTS */}
        <View style={{ position: 'absolute', top: 70, right: 16, zIndex: 9999, gap: 8 }}>
          {toasts.map(t => {
            const tc: Record<string, string> = { success: COLORS.green, error: COLORS.red, info: COLORS.blue, warning: COLORS.orange };
            return <View key={t.id} style={{ backgroundColor: '#FFFFFF', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#E2EAF0', borderLeftWidth: 4, borderLeftColor: tc[t.type] || COLORS.blue, maxWidth: 320, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }}><Text style={{ color: '#213B57', fontSize: 12, fontWeight: '500' }}>{t.msg}</Text></View>;
          })}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
