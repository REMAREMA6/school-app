import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, Modal, useWindowDimensions } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import {
  Home, Settings, BookOpen, Users, FileText, Shield, CloudUpload,
  ClipboardCheck, Bell, Sun, Moon, ChevronDown, Search, CalendarDays,
  AlertCircle, Clipboard, CheckCircle2, ArrowRight, Eye,
  Pencil, FileCheck, GraduationCap, Menu, X, ArrowUpRight,
  UserCircle, LogOut, Sliders, Plus, MoreVertical, MapPin, School as SchoolIcon,
  UserRound, ChevronUp, Check,
} from 'lucide-react-native';

const C = {
  dark2: '#002F27', green: '#08765F', ink: '#142F4D', muted: '#647F9E',
  border: '#DCE6EE', bg: '#F7F9FB', blue: '#2675D2', purple: '#7950D2',
  orange: '#D58A13', red: '#D92E32',
};
const DK = { bg: '#0A1410', card: '#0E1F18', border: '#1A2E24', ink: '#E8F0EC', muted: '#8A9D94', text: '#D0E0D8', dark2: '#001A14' };
const TC = { green: '#08704F', blue: '#176DDA', purple: '#6E35D4', orange: '#D2870B' };
const TBG = { green: '#DFF5E9', blue: '#E0ECFF', purple: '#EFE4FF', orange: '#FFF0D4' };
const SS: Record<string, [string, string]> = { Published: ['#D9F4E6', '#08754F'], Verified: ['#DFECFF', '#236FD0'], 'Under Review': ['#FFF0D4', '#C27A08'], Compiled: ['#EFE3FF', '#7443C8'] };

function Crest({ size = 48 }: { size?: number }) {
  return (<Svg width={size} height={size * 1.12} viewBox="0 0 64 72"><Path d="M7 8 L32 3 L57 8 L56 42 Q52 58 32 68 Q12 58 8 42 Z" fill="none" stroke="#FFFFFF" strokeWidth="3.2" /><Path d="M13 13 L32 9 L51 13 L50 41 Q46 53 32 61 Q18 53 14 41 Z" fill="none" stroke="#FFFFFF" strokeWidth="1.3" /><Path d="M21 23 L28 18 L32 25 L36 18 L43 23 L39 31 L44 42 L37 42 L32 34 L27 42 L20 42 L25 31 Z" fill="#FFFFFF" /><Path d="M27 46 L37 46 M29 50 L35 50" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" /><Circle cx="32" cy="15" r="2" fill="#FFFFFF" /></Svg>);
}

let tid = 0;
function useToasts() {
  const [toasts, setToasts] = useState<{id:number;msg:string;type:string}[]>([]);
  const show = useCallback((msg: string, type = 'info') => { const id = ++tid; setToasts(p => [...p, { id, msg, type }]); setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000); }, []);
  return { toasts, show };
}

const NAV = [
  { h: 'OVERVIEW', l: [['Dashboard', Home]] },
  { h: 'SETUP', l: [['School Configuration', Settings], ['Subjects & Classes', BookOpen], ['Students', Users], ['Assessment Configuration', FileText], ['Users & Permissions', Shield]] },
  { h: 'WORKFLOW', l: [['Upload Results', CloudUpload], ['Review & Compile', ClipboardCheck], ['Report Cards', FileText]] },
  { h: 'SYSTEM', l: [['Settings', Sliders]] },
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

const ACTS = [
  { t: 'Result uploaded', d: 'JSS2B Mathematics – Test 1 by Mr. A. Adeyemi', time: '2h ago', Ic: CloudUpload, tone: 'green' },
  { t: 'Score corrected', d: 'SS1C Chemistry – Test 2 by Mrs. E. Hassan', time: '4h ago', Ic: Pencil, tone: 'blue' },
  { t: 'Result compiled', d: 'JSS3A English – Test 1 by Mr. T. Okafor', time: '6h ago', Ic: CheckCircle2, tone: 'purple' },
  { t: 'Report card published', d: 'SS2B Biology – Term 2 by Mrs. O. Bello', time: '8h ago', Ic: FileCheck, tone: 'green' },
  { t: 'Result uploaded', d: 'SS1A Physics – Test 1 by Mr. D. Musa', time: '10h ago', Ic: CloudUpload, tone: 'green' },
  { t: 'Score corrected', d: 'JSS1A Mathematics – Test 1 by Mr. A. Adeyemi', time: '12h ago', Ic: Pencil, tone: 'blue' },
  { t: 'Report card published', d: 'SS3C Further Maths – Term 2 by Mrs. L. Adebayo', time: '14h ago', Ic: FileCheck, tone: 'green' },
];

const WF = [
  { l: 'Uploaded', d: 'Results submitted\nby teachers', c: '243 batches', Ic: CloudUpload, tone: 'green' },
  { l: 'Under Review', d: 'Being checked\nby admin', c: '48 batches', Ic: Clipboard, tone: 'orange' },
  { l: 'Verified', d: 'Results verified\nand approved', c: '37 batches', Ic: Shield, tone: 'blue' },
  { l: 'Compiled', d: 'Class results\ncompiled', c: '28 batches', Ic: Settings, tone: 'purple' },
  { l: 'Published', d: 'Report cards\npublished', c: '82 batches', Ic: CheckCircle2, tone: 'green' },
];

const NOTIFS = [{ t: '31 batches have incomplete results', time: '1h ago', type: 'alert' }, { t: '48 batches awaiting review', time: '3h ago', type: 'warning' }, { t: '82 report cards published', time: '5h ago', type: 'success' }];

// === SCHOOL CONFIG DATA ===
const INITIAL_TERMS = [
  { id: 'first', name: 'First Term', startDate: 'Sep 8, 2025', endDate: 'Dec 12, 2025', status: 'Active' },
  { id: 'second', name: 'Second Term', startDate: 'Jan 5, 2026', endDate: 'Apr 10, 2026', status: 'Upcoming' },
  { id: 'third', name: 'Third Term', startDate: 'May 4, 2026', endDate: 'Jul 31, 2026', status: 'Upcoming' },
];
const INITIAL_GRADES = [
  { grade: 'A1', description: 'Excellent', min: '70', max: '100', remark: 'Outstanding performance', credit: true },
  { grade: 'B2', description: 'Very Good', min: '60', max: '69', remark: 'Above average', credit: true },
  { grade: 'B3', description: 'Good', min: '50', max: '59', remark: 'Average', credit: true },
  { grade: 'C4', description: 'Credit', min: '45', max: '49', remark: 'Fair', credit: true },
  { grade: 'C5', description: 'Credit', min: '40', max: '44', remark: 'Below average', credit: true },
  { grade: 'C6', description: 'Credit', min: '35', max: '39', remark: 'Poor', credit: true },
  { grade: 'D7', description: 'Pass', min: '30', max: '34', remark: 'Very poor', credit: true },
  { grade: 'E8', description: 'Pass', min: '20', max: '29', remark: 'Low performance', credit: false },
  { grade: 'F9', description: 'Fail', min: '0', max: '19', remark: 'No credit', credit: false },
];

// === SCHOOL CONFIG SCREEN ===
function SchoolConfigScreen({ search, show }: { search: string; show: (msg: string, type?: string) => void }) {
  const [terms, setTerms] = useState(INITIAL_TERMS);
  const [grades, setGrades] = useState(INITIAL_GRADES);
  const [school, setSchool] = useState({ name: 'Akoka Federal Academy', location: 'Lagos, Nigeria', type: 'Secondary School', month: 'September' });
  const [sessionExpanded, setSessionExpanded] = useState(true);
  const [editModal, setEditModal] = useState<{ visible: boolean; title: string; fields: any[]; mode: string }>({ visible: false, title: '', fields: [], mode: '' });
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const filteredTerms = useMemo(() => {
    if (!search.trim()) return terms;
    return terms.filter(t => `${t.name} ${t.startDate} ${t.endDate} ${t.status}`.toLowerCase().includes(search.toLowerCase()));
  }, [terms, search]);

  function openEditor(title: string, fields: any[], mode: string) {
    setEditValues(Object.fromEntries(fields.map(f => [f.key, f.value ?? ''])));
    setEditModal({ visible: true, title, fields, mode });
  }

  function saveEditor() {
    const { mode } = editModal;
    if (mode === 'school') {
      setSchool({ name: editValues.name || school.name, location: editValues.location || school.location, type: editValues.type || school.type, month: editValues.month || school.month });
      show('School information updated', 'success');
    } else if (mode === 'session') {
      show(`${editValues.year || 'New session'} entered — demo does not persist sessions`, 'info');
    } else if (mode.startsWith('term:')) {
      const id = mode.slice(5);
      setTerms(curr => curr.map(t => t.id === id ? { ...t, name: editValues.name || t.name, startDate: editValues.startDate || t.startDate, endDate: editValues.endDate || t.endDate, status: editValues.status || t.status } : t));
      show('Term updated', 'success');
    } else if (mode === 'grades') {
      setGrades(curr => curr.map(g => ({ ...g, min: editValues[`${g.grade}_min`] ?? g.min, max: editValues[`${g.grade}_max`] ?? g.max, remark: editValues[`${g.grade}_remark`] ?? g.remark })));
      show('Grading scale updated', 'success');
    }
    setEditModal(c => ({ ...c, visible: false }));
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 30, maxWidth: 1600, alignSelf: 'center', width: '100%' }} showsVerticalScrollIndicator={false}>
      {/* Page header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#064333', fontSize: 26, fontWeight: '800', letterSpacing: -0.3 }}>School Configuration</Text>
          <Text style={{ color: '#647F9E', fontSize: 13, marginTop: 5 }}>Manage school information, academic sessions, terms, and grading rules.</Text>
        </View>
        <Pressable onPress={() => openEditor('Edit School Information', [{ key: 'name', label: 'School Name', value: school.name }, { key: 'location', label: 'Location', value: school.location }, { key: 'type', label: 'School Type', value: school.type }, { key: 'month', label: 'Academic Year Start Month', value: school.month }], 'school')} style={{ backgroundColor: '#00513D', borderRadius: 7, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 15, paddingVertical: 9 }}>
          <Pencil size={15} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Edit School</Text>
        </Pressable>
      </View>

      {/* School Information card */}
      <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE7EE', borderRadius: 8, padding: 15, marginBottom: 14 }}>
        <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800', marginBottom: 10, paddingHorizontal: 8 }}>School Information</Text>
        <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 4 }}>
          {/* Logo tile */}
          <View style={{ width: 120, height: 100, borderRadius: 8, backgroundColor: '#E3F5EC', alignItems: 'center', justifyContent: 'center', marginRight: 30 }}>
            <Svg width={70} height={78} viewBox="0 0 64 72"><Path d="M7 8 L32 3 L57 8 L56 42 Q52 58 32 68 Q12 58 8 42 Z" fill="none" stroke="#075340" strokeWidth="3.2" /><Path d="M13 13 L32 9 L51 13 L50 41 Q46 53 32 61 Q18 53 14 41 Z" fill="none" stroke="#075340" strokeWidth="1.3" /><Path d="M21 23 L28 18 L32 25 L36 18 L43 23 L39 31 L44 42 L37 42 L32 34 L27 42 L20 42 L25 31 Z" fill="#075340" /><Path d="M27 46 L37 46 M29 50 L35 50" stroke="#075340" strokeWidth="2" strokeLinecap="round" /><Circle cx="32" cy="15" r="2" fill="#075340" /></Svg>
            <Text style={{ color: '#075340', fontSize: 11, fontWeight: '800', marginTop: 4 }}>AFA</Text>
          </View>
          {/* Details */}
          <View style={{ flex: 1.2 }}>
            <Text style={{ color: '#6C83A0', fontSize: 10, marginBottom: 7 }}>School Name</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><UserRound size={16} color="#204B60" /><Text style={{ color: '#19334F', fontSize: 12, fontWeight: '600' }}>{school.name}</Text></View>
            <Text style={{ color: '#6C83A0', fontSize: 10, marginTop: 17, marginBottom: 7 }}>Location</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><MapPin size={16} color="#204B60" /><Text style={{ color: '#19334F', fontSize: 12, fontWeight: '600' }}>{school.location}</Text></View>
          </View>
          <View style={{ flex: 0.9, borderLeftWidth: 1, borderLeftColor: '#DCE6EE', paddingLeft: 30 }}>
            <Text style={{ color: '#6C83A0', fontSize: 10, marginBottom: 7 }}>School Type</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><SchoolIcon size={16} color="#204B60" /><Text style={{ color: '#19334F', fontSize: 11, fontWeight: '600' }}>{school.type}</Text></View>
            <Text style={{ color: '#6C83A0', fontSize: 10, marginTop: 17, marginBottom: 7 }}>Academic Year Start</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><CalendarDays size={16} color="#204B60" /><Text style={{ color: '#19334F', fontSize: 12, fontWeight: '600' }}>{school.month}</Text></View>
          </View>
        </View>
      </View>

      {/* Academic Sessions */}
      <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE7EE', borderRadius: 8, padding: 15, marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 11 }}>
          <View style={{ flex: 1 }}><Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800' }}>Academic Sessions</Text><Text style={{ color: '#6A83A0', fontSize: 11, marginTop: 5 }}>Manage academic sessions and term dates.</Text></View>
          <Pressable onPress={() => openEditor('Add Academic Session', [{ key: 'year', label: 'Academic Session', value: '2026/2027' }, { key: 'start', label: 'Start', value: 'September 2026' }, { key: 'end', label: 'End', value: 'August 2027' }], 'session')} style={{ borderWidth: 1, borderColor: '#D5E0E9', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: '#FFFFFF' }}>
            <Plus size={15} color="#274968" /><Text style={{ color: '#274968', fontSize: 10, fontWeight: '700' }}>Add Session</Text>
          </Pressable>
        </View>
        {/* Session panel */}
        <View style={{ borderWidth: 1, borderColor: '#E0E8EF', borderRadius: 6, padding: 11 }}>
          <Pressable onPress={() => setSessionExpanded(!sessionExpanded)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingBottom: 11 }}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={{ color: '#142F4D', fontSize: 16, fontWeight: '800' }}>2025/2026</Text>
                <View style={{ backgroundColor: '#DDF5E8', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ color: '#08754F', fontSize: 9, fontWeight: '700' }}>Current Session</Text></View>
              </View>
              <Text style={{ color: '#6C83A0', fontSize: 10, marginTop: 4 }}>Academic year: September 2025 – August 2026</Text>
            </View>
            {sessionExpanded ? <ChevronUp size={17} color="#45698D" /> : <ChevronDown size={17} color="#45698D" />}
          </Pressable>
          {sessionExpanded && (
            <View style={{ borderWidth: 1, borderColor: '#E3EAF0', borderRadius: 6, overflow: 'hidden' }}>
              <View style={{ flexDirection: 'row', backgroundColor: '#F0F3F5', paddingVertical: 8, paddingHorizontal: 14 }}>
                {['Term', 'Start Date', 'End Date', 'Status', 'Actions'].map((h, i) => <Text key={h} style={{ flex: i === 0 ? 1.2 : i === 4 ? 1.05 : 1.15, fontSize: 9, fontWeight: '800', color: '#334F6E' }}>{h}</Text>)}
              </View>
              {filteredTerms.map(term => (
                <View key={term.id} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#E8EEF3' }}>
                  <Text style={{ flex: 1.2, fontSize: 10, fontWeight: '600', color: '#405D7D' }}>{term.name}</Text>
                  <Text style={{ flex: 1.15, fontSize: 10, color: '#405D7D' }}>{term.startDate}</Text>
                  <Text style={{ flex: 1.15, fontSize: 10, color: '#405D7D' }}>{term.endDate}</Text>
                  <View style={{ flex: 1.15 }}><View style={{ backgroundColor: term.status === 'Active' ? '#D9F4E6' : '#DFECFF', borderRadius: 12, paddingHorizontal: 11, paddingVertical: 4, alignSelf: 'flex-start' }}><Text style={{ color: term.status === 'Active' ? '#08754F' : '#236FD0', fontSize: 9, fontWeight: '700' }}>{term.status}</Text></View></View>
                  <View style={{ flex: 1.05, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Pressable onPress={() => openEditor(`Edit ${term.name}`, [{ key: 'name', label: 'Term Name', value: term.name }, { key: 'startDate', label: 'Start Date', value: term.startDate }, { key: 'endDate', label: 'End Date', value: term.endDate }, { key: 'status', label: 'Status', value: term.status }], `term:${term.id}`)} style={{ height: 27, minWidth: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 5 }}>
                      <Pencil size={12} color="#274968" /><Text style={{ color: '#274968', fontSize: 9, fontWeight: '600' }}>Edit</Text>
                    </Pressable>
                    <Pressable onPress={() => show(`${term.name}: ${term.startDate} → ${term.endDate} (${term.status})`, 'info')}><MoreVertical size={16} color="#244666" /></Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Grading Scale */}
      <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE7EE', borderRadius: 8, padding: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 11 }}>
          <View style={{ flex: 1 }}><Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800' }}>Grading Scale</Text><Text style={{ color: '#6A83A0', fontSize: 11, marginTop: 5 }}>Manage grading boundaries and credit status.</Text></View>
          <Pressable onPress={() => openEditor('Edit Grading Scale', grades.flatMap(g => [{ key: `${g.grade}_min`, label: `${g.grade} Min %`, value: g.min }, { key: `${g.grade}_max`, label: `${g.grade} Max %`, value: g.max }, { key: `${g.grade}_remark`, label: `${g.grade} Remark`, value: g.remark }]), 'grades')} style={{ borderWidth: 1, borderColor: '#D5E0E9', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: '#FFFFFF' }}>
            <Pencil size={15} color="#274968" /><Text style={{ color: '#274968', fontSize: 10, fontWeight: '700' }}>Edit Grading</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ minWidth: 800 }}>
            <View style={{ flexDirection: 'row', backgroundColor: '#F0F3F5', paddingVertical: 7, paddingHorizontal: 15 }}>
              {['Grade', 'Description', 'Min %', 'Max %', 'Remark', 'Credit'].map((h, i) => <Text key={h} style={{ flex: [0.7, 1.1, 1.45, 1.55, 2.0, 1.0][i], fontSize: 9, fontWeight: '800', color: '#334F6E' }}>{h}</Text>)}
            </View>
            {grades.map(g => (
              <View key={g.grade} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#E8EEF3' }}>
                <Text style={{ flex: 0.7, fontSize: 10, fontWeight: '700', color: '#405D7D' }}>{g.grade}</Text>
                <Text style={{ flex: 1.1, fontSize: 10, color: '#405D7D' }}>{g.description}</Text>
                <Text style={{ flex: 1.45, fontSize: 10, color: '#405D7D' }}>{g.min}</Text>
                <Text style={{ flex: 1.55, fontSize: 10, color: '#405D7D' }}>{g.max}</Text>
                <Text numberOfLines={1} style={{ flex: 2.0, fontSize: 10, color: '#405D7D' }}>{g.remark}</Text>
                <View style={{ flex: 1.0 }}><View style={{ backgroundColor: g.credit ? '#D9F4E6' : '#FFE1E1', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' }}><Text style={{ color: g.credit ? '#08754F' : '#D92E32', fontSize: 9, fontWeight: '700' }}>{g.credit ? 'Credit' : 'No Credit'}</Text></View></View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Edit Modal */}
      <Modal visible={editModal.visible} transparent animationType="fade" onRequestClose={() => setEditModal(c => ({ ...c, visible: false }))}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(8,25,38,0.45)', alignItems: 'center', justifyContent: 'center', padding: 20 }} onPress={() => setEditModal(c => ({ ...c, visible: false }))}>
          <View style={{ width: '100%', maxWidth: 520, maxHeight: '85%', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 22 }} onPress={(e: any) => e.stopPropagation()}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <Text style={{ color: '#142F4D', fontSize: 17, fontWeight: '800', flex: 1 }}>{editModal.title}</Text>
              <Pressable onPress={() => setEditModal(c => ({ ...c, visible: false }))}><X size={19} color="#45698D" /></Pressable>
            </View>
            <ScrollView style={{ maxHeight: 380 }} keyboardShouldPersistTaps="handled">
              {editModal.fields.map(f => (
                <View key={f.key} style={{ marginBottom: 14 }}>
                  <Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>{f.label}</Text>
                  <TextInput value={String(editValues[f.key] ?? '')} onChangeText={v => setEditValues(curr => ({ ...curr, [f.key]: v }))} placeholder={f.placeholder || f.label} placeholderTextColor="#8097B0" style={{ height: 39, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 11, color: '#19334F', fontSize: 12 }} />
                </View>
              ))}
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <Pressable onPress={() => setEditModal(c => ({ ...c, visible: false }))} style={{ paddingHorizontal: 15, paddingVertical: 9, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6 }}><Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700' }}>Cancel</Text></Pressable>
              <Pressable onPress={saveEditor} style={{ backgroundColor: '#00513D', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 15, paddingVertical: 9 }}><Check size={15} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Save Changes</Text></Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
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
  const [selBatch, setSelBatch] = useState<any>(null);
  const { toasts, show } = useToasts();
  const narrow = width < 1200;
  const veryNarrow = width < 900;
  // At 1920px, use wider max-width for content to fill the screen nicely
  const wideContent = width >= 1600;

  React.useEffect(() => { if (veryNarrow) setCollapsed(true); else setCollapsed(false); }, [width]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, flexDirection: 'row', minHeight: '100vh', backgroundColor: dark ? DK.bg : C.bg }}>
        {/* SIDEBAR */}
        <View style={{ width: collapsed ? 76 : 255, backgroundColor: C.dark2, paddingTop: 17, paddingBottom: 17, paddingHorizontal: 11, flexShrink: 0 }}>
          <View style={{ height: 75, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.13)', marginBottom: 20 }}>
            <Crest size={collapsed ? 36 : 48} />
            {!collapsed && <View><Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>Akoka Federal</Text><Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>Academy</Text><Text style={{ color: '#DCEFE9', fontSize: 10, marginTop: 3 }}>Result Compilation System</Text></View>}
          </View>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {NAV.map(g => <View key={g.h} style={{ marginBottom: 21 }}>
              {!collapsed && <Text style={{ color: '#D4E8E1', fontSize: 10, fontWeight: '700', letterSpacing: 0.45, marginHorizontal: 12, marginBottom: 9 }}>{g.h}</Text>}
              {g.l.map(([label, Ic]: any) => (
                <Pressable key={label} onPress={() => { setActive(label); show(`Navigated to ${label}`, 'info'); }} style={{ height: 38, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 13, borderRadius: 6, marginBottom: 1, backgroundColor: active === label ? '#176B58' : 'transparent', borderWidth: active === label ? 1 : 0, borderColor: 'rgba(112,218,181,0.16)' }}>
                  <Ic size={20} color="#F1FFFA" strokeWidth={2.2} />
                  {!collapsed && <Text style={{ color: '#F5FFFC', fontSize: 12, fontWeight: active === label ? '700' : '500' }}>{label}</Text>}
                </Pressable>
              ))}
            </View>)}
          </ScrollView>
          {!collapsed && <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)' }}>
            <GraduationCap size={27} color="#E8FFF7" />
            <View><Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>Akoka Federal Academy</Text><Text style={{ color: '#C8E2D9', fontSize: 8, marginTop: 5 }}>Excellence · Discipline · Success</Text></View>
          </View>}
        </View>

        {/* MAIN */}
        <View style={{ flex: 1, minWidth: 0 }}>
          {/* TOP BAR */}
          <View style={{ height: 60, backgroundColor: dark ? DK.card : '#FFFFFF', borderBottomWidth: 1, borderBottomColor: dark ? DK.border : '#E2EAF0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 20 }}>
            <Pressable onPress={() => setCollapsed(!collapsed)} style={{ padding: 4 }}><Menu size={19} color={dark ? DK.muted : '#45698D'} /></Pressable>
            <Text style={{ color: dark ? DK.ink : '#152D48', fontSize: 18, fontWeight: '800', minWidth: 80 }}>{active}</Text>
            {!veryNarrow && <View style={{ height: 37, flex: 1, maxWidth: 450, borderWidth: 1, borderColor: dark ? DK.border : '#D7E1E9', borderRadius: 7, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 10, backgroundColor: dark ? DK.card : '#FFFFFF' }}>
              <Search size={16} color="#8299B1" /><TextInput value={search} onChangeText={setSearch} placeholder="Search students, subjects, classes, or batches..." placeholderTextColor="#8097B0" style={{ flex: 1, fontSize: 12, color: dark ? DK.text : '#3B5B7B', padding: 0 }} />
            </View>}
            <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 13 }}>
              <Pressable onPress={() => { setShowNotif(!showNotif); setShowAdmin(false); }} style={{ position: 'relative', padding: 6 }}>
                <Bell size={19} color={dark ? DK.muted : '#41698F'} />
                <View style={{ position: 'absolute', top: 0, right: 0, width: 15, height: 15, borderRadius: 8, backgroundColor: C.red, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#FFFFFF', fontSize: 8, fontWeight: '800' }}>3</Text></View>
              </Pressable>
              <Pressable onPress={() => { setDark(!dark); show(dark ? 'Light mode' : 'Dark mode', 'info'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: dark ? DK.border : '#DFE7ED', borderRadius: 20, padding: 4 }}>
                {dark ? <Moon size={15} color="#E8C84A" /> : <Sun size={15} color="#637F9D" />}
                <View style={{ width: 32, height: 17, borderRadius: 10, backgroundColor: '#07533F', paddingHorizontal: 2, justifyContent: 'center' }}><View style={{ width: 13, height: 13, borderRadius: 7, backgroundColor: '#FFFFFF', alignSelf: dark ? 'flex-start' : 'flex-end' }} /></View>
              </Pressable>
              {!veryNarrow && <View style={{ width: 1, height: 30, backgroundColor: dark ? DK.border : '#DCE5EC' }} />}
              {!veryNarrow && <Pressable onPress={() => { setShowAdmin(!showAdmin); setShowNotif(false); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#003D31', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>AD</Text></View>
                <View><Text style={{ color: dark ? DK.ink : '#1B3551', fontSize: 11, fontWeight: '700' }}>Administrator</Text><Text style={{ color: dark ? DK.muted : '#6D849E', fontSize: 9 }}>School Admin</Text></View>
                <ChevronDown size={14} color="#527493" />
              </Pressable>}
            </View>
          </View>

          {/* DROPDOWNS */}
          {showNotif && <View style={{ position: 'absolute', top: 55, right: 120, width: 320, backgroundColor: dark ? DK.card : '#FFFFFF', borderWidth: 1, borderColor: dark ? DK.border : '#E2EAF0', borderRadius: 10, zIndex: 100, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 4 } }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: dark ? DK.border : '#E2EAF0' }}>
              <Text style={{ color: dark ? DK.ink : '#142F4D', fontSize: 14, fontWeight: '700' }}>Notifications</Text>
              <Pressable onPress={() => setShowNotif(false)}><X size={16} color="#647F9E" /></Pressable>
            </View>
            {NOTIFS.map((n, i) => <Pressable key={i} onPress={() => { setShowNotif(false); show(n.t, 'info'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: dark ? DK.border : '#E2EAF0' }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: n.type === 'alert' ? C.red : n.type === 'warning' ? C.orange : C.green }} />
              <View style={{ flex: 1 }}><Text style={{ color: dark ? DK.text : '#213B57', fontSize: 12, fontWeight: '500' }}>{n.t}</Text><Text style={{ color: dark ? DK.muted : '#7187A0', fontSize: 10, marginTop: 2 }}>{n.time}</Text></View>
            </Pressable>)}
          </View>}

          {showAdmin && <View style={{ position: 'absolute', top: 55, right: 20, width: 180, backgroundColor: dark ? DK.card : '#FFFFFF', borderWidth: 1, borderColor: dark ? DK.border : '#E2EAF0', borderRadius: 10, zIndex: 100, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 4 } }}>
            {[[UserCircle, 'My Profile'], [Settings, 'Settings'], [LogOut, 'Sign Out', true]].map(([Ic, label, danger]: any, i) => (
              <Pressable key={i} onPress={() => { setShowAdmin(false); show(label, 'info'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: dark ? DK.border : '#E2EAF0' }}>
                <Ic size={16} color={danger ? C.red : '#41698F'} /><Text style={{ color: danger ? C.red : (dark ? DK.text : '#213B57'), fontSize: 12, fontWeight: '500' }}>{label}</Text>
              </Pressable>
            ))}
          </View>}

          {/* CONTENT — switches between Dashboard and School Configuration */}
          {active === 'School Configuration' ? (
            <SchoolConfigScreen search={search} show={show} />
          ) : (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingBottom: 30, maxWidth: wideContent ? 1600 : '100%', alignSelf: 'center', width: '100%' }} showsVerticalScrollIndicator={false}>
            {/* Welcome */}
            <View style={{ flexDirection: narrow ? 'column' : 'row', justifyContent: 'space-between', alignItems: narrow ? 'flex-start' : 'center', marginBottom: 20, gap: narrow ? 12 : 0 }}>
              <View><Text style={{ color: dark ? DK.ink : '#064333', fontSize: 26, fontWeight: '800', letterSpacing: -0.3 }}>Good morning, Administrator</Text><Text style={{ color: dark ? DK.muted : '#647F9E', fontSize: 13, marginTop: 6 }}>Here's your school's result compilation overview.</Text></View>
              <View style={{ borderWidth: 1, borderColor: dark ? DK.border : '#DFE7ED', borderRadius: 8, backgroundColor: dark ? DK.card : '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, minWidth: narrow ? 0 : 350 }}>
                <CalendarDays size={17} color="#5C7695" /><View><Text style={{ color: dark ? DK.ink : '#3F5B79', fontSize: 11, fontWeight: '600' }}>Tuesday, 26 August 2025</Text><Text style={{ color: dark ? DK.muted : '#7187A0', fontSize: 10, marginTop: 3 }}>Academic Session: 2024/2025 | Term: Second Term</Text></View>
              </View>
            </View>

            {/* Stats */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
              {[['Total Students', '140', '↑ 2 new this term', 'green', Users, false], ['Teachers', '12', '— No change', 'blue', Users, true], ['Result Batches', '243', '↑ 18 new this term', 'purple', FileText, false], ['Published Report Cards', '82', '↑ 12% from last term', 'green', FileText, false]].map(([label, val, trend, tone, Ic, noChange]: any) => (
                <Pressable key={label} onPress={() => show(`${label}: ${val}`, 'info')} style={{ flex: 1, minWidth: 200, minHeight: 120, backgroundColor: dark ? DK.card : '#FFFFFF', borderWidth: 1, borderColor: dark ? DK.border : '#E0E8EF', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 18, flexDirection: 'row', alignItems: 'flex-start', gap: 14, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}>
                  <View style={{ width: 42, height: 42, borderRadius: 11, backgroundColor: TBG[tone as keyof typeof TBG], alignItems: 'center', justifyContent: 'center' }}><Ic size={22} color={TC[tone as keyof typeof TC]} strokeWidth={2.3} /></View>
                  <View style={{ flex: 1 }}><Text style={{ color: dark ? DK.muted : '#4D6683', fontSize: 11, fontWeight: '600' }}>{label}</Text><Text style={{ color: dark ? DK.ink : '#102C48', fontSize: 24, fontWeight: '800', marginTop: 6 }}>{val}</Text><Text style={{ color: noChange ? '#7188A2' : '#08784F', fontSize: 10, fontWeight: '600', marginTop: 6 }}>{trend}</Text></View>
                </Pressable>
              ))}
            </View>

            {/* Workflow + Alert */}
            <View style={{ flexDirection: narrow ? 'column' : 'row', gap: 16, marginBottom: 20 }}>
              <View style={{ flex: 1, minWidth: 0, backgroundColor: dark ? DK.card : '#FFFFFF', borderWidth: 1, borderColor: dark ? DK.border : '#DFE7EE', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}>
                <Text style={{ color: dark ? DK.ink : '#142F4D', fontSize: 15, fontWeight: '800' }}>Result Compilation Workflow</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 18 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    {WF.map((s, i) => (
                      <React.Fragment key={s.l}>
                        <Pressable onPress={() => show(`${s.l}: ${s.c}`, 'info')} style={{ alignItems: 'center', width: 130 }}>
                          <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: TBG[s.tone as keyof typeof TBG], alignItems: 'center', justifyContent: 'center' }}><s.Ic size={24} color={TC[s.tone as keyof typeof TC]} strokeWidth={2.4} /></View>
                          <Text style={{ color: dark ? DK.ink : '#17334F', fontSize: 12, fontWeight: '800', marginTop: 10 }}>{s.l}</Text>
                          <Text style={{ color: dark ? DK.muted : '#627A96', fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 6 }}>{s.d}</Text>
                          <View style={{ backgroundColor: TBG[s.tone as keyof typeof TBG], borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, marginTop: 8 }}><Text style={{ color: TC[s.tone as keyof typeof TC], fontSize: 9, fontWeight: '700' }}>{s.c}</Text></View>
                        </Pressable>
                        {i < 4 && <View style={{ marginTop: 18, marginHorizontal: -2 }}><ArrowRight size={18} color="#91A6BD" /></View>}
                      </React.Fragment>
                    ))}
                  </View>
                </ScrollView>
              </View>
              <View style={{ width: narrow ? '100%' : '30%', backgroundColor: '#FFF9F8', borderWidth: 1, borderColor: '#F4C9C7', borderRadius: 8, padding: 18 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: C.red, alignItems: 'center', justifyContent: 'center' }}><AlertCircle size={22} color="#FFFFFF" fill="#D92E32" /></View>
                  <Text style={{ color: C.red, fontSize: 16, fontWeight: '800' }}>Incomplete Results</Text>
                </View>
                <Text style={{ color: '#D9383C', fontSize: 40, fontWeight: '800', marginTop: 12 }}>31</Text>
                <Text style={{ color: '#637B96', fontSize: 12, lineHeight: 18 }}>batches have incomplete results across various classes and subjects.</Text>
                <Pressable onPress={() => show('Opening review screen...', 'info')} style={{ backgroundColor: '#00513D', borderRadius: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 9, marginTop: 14, alignSelf: 'flex-start' }}>
                  <Eye size={16} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Review Results</Text>
                </Pressable>
              </View>
            </View>

            {/* Batches + Activity */}
            <View style={{ flexDirection: narrow ? 'column' : 'row', gap: 18 }}>
              <View style={{ flex: narrow ? 1 : 1.65, minWidth: 0, backgroundColor: dark ? DK.card : '#FFFFFF', borderWidth: 1, borderColor: dark ? DK.border : '#DFE7EE', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ color: dark ? DK.ink : '#142F4D', fontSize: 15, fontWeight: '800' }}>Recent Result Batches</Text>
                  <Pressable onPress={() => show('View all batches', 'info')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Text style={{ color: '#3E5F80', fontSize: 11, fontWeight: '600' }}>View all</Text><ArrowUpRight size={13} color="#55799B" /></Pressable>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ minWidth: 700 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: dark ? DK.dark2 : '#F2F5F7', paddingVertical: 9, paddingHorizontal: 10, borderRadius: 5, marginBottom: 2 }}>
                      {['Batch Name', 'Class', 'Subject', 'Teacher', 'Status', 'Date'].map(h => <Text key={h} style={{ flex: h === 'Batch Name' ? 1.6 : 1, fontSize: 10, fontWeight: '800', color: dark ? DK.muted : '#334F6E' }}>{h}</Text>)}
                    </View>
                    {BATCHES.filter(r => r.join(' ').toLowerCase().includes(search.toLowerCase())).map((row, i) => {
                      const [bg, fg] = SS[row[4]] || SS.Verified;
                      return (
                        <Pressable key={i} onPress={() => setSelBatch(row)} style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: dark ? DK.border : '#E8EEF3' }}>
                          <Text numberOfLines={1} style={{ flex: 1.6, fontSize: 10, color: dark ? DK.text : '#405D7D' }}>{row[0]}</Text>
                          <Text style={{ flex: 1, fontSize: 10, color: dark ? DK.text : '#405D7D' }}>{row[1]}</Text>
                          <Text style={{ flex: 1, fontSize: 10, color: dark ? DK.text : '#405D7D' }}>{row[2]}</Text>
                          <Text numberOfLines={1} style={{ flex: 1, fontSize: 10, color: dark ? DK.text : '#405D7D' }}>{row[3]}</Text>
                          <View style={{ flex: 1 }}><View style={{ backgroundColor: bg, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3, alignSelf: 'flex-start' }}><Text style={{ color: fg, fontSize: 9, fontWeight: '700' }}>{row[4]}</Text></View></View>
                          <Text style={{ flex: 1, fontSize: 10, color: dark ? DK.muted : '#405D7D' }}>{row[5]}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
              <View style={{ flex: 1, minWidth: 0, backgroundColor: dark ? DK.card : '#FFFFFF', borderWidth: 1, borderColor: dark ? DK.border : '#DFE7EE', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ color: dark ? DK.ink : '#142F4D', fontSize: 15, fontWeight: '800' }}>Recent Activity</Text>
                  <Pressable onPress={() => show('View all activity', 'info')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Text style={{ color: '#3E5F80', fontSize: 11, fontWeight: '600' }}>View all</Text><ArrowUpRight size={13} color="#55799B" /></Pressable>
                </View>
                {ACTS.map((a, i) => (
                  <Pressable key={i} onPress={() => show(`${a.t}: ${a.d}`, 'info')} style={{ flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: dark ? DK.border : '#E9EFF4' }}>
                    <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: TBG[a.tone as keyof typeof TBG], alignItems: 'center', justifyContent: 'center' }}><a.Ic size={18} color={TC[a.tone as keyof typeof TC]} strokeWidth={2.3} /></View>
                    <View style={{ flex: 1, minWidth: 0 }}><Text style={{ color: dark ? DK.ink : '#213B57', fontSize: 11, fontWeight: '800' }}>{a.t}</Text><Text numberOfLines={1} style={{ color: dark ? DK.muted : '#7187A0', fontSize: 10, marginTop: 3 }}>{a.d}</Text></View>
                    <Text style={{ color: dark ? DK.muted : '#6C83A0', fontSize: 10 }}>{a.time}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
          )}
        </View>

        {/* BATCH MODAL */}
        {selBatch && <Modal visible transparent animationType="fade" onRequestClose={() => setSelBatch(null)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => setSelBatch(null)}>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, width: 460, maxWidth: '90%', overflow: 'hidden' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#142F4D' }}>Batch Details</Text>
                <Pressable onPress={() => setSelBatch(null)}><X size={18} color="#647F9E" /></Pressable>
              </View>
              <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#647F9E', textTransform: 'uppercase' }}>Batch Name</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#213B57', marginBottom: 16 }}>{selBatch[0]}</Text>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                  <View style={{ flex: 1 }}><Text style={{ fontSize: 10, fontWeight: '700', color: '#647F9E' }}>Class</Text><Text style={{ fontSize: 13, color: '#213B57' }}>{selBatch[1]}</Text></View>
                  <View style={{ flex: 1 }}><Text style={{ fontSize: 10, fontWeight: '700', color: '#647F9E' }}>Subject</Text><Text style={{ fontSize: 13, color: '#213B57' }}>{selBatch[2]}</Text></View>
                </View>
                <View style={{ flexDirection: 'row', gap: 20, marginTop: 16 }}>
                  <View style={{ flex: 1 }}><Text style={{ fontSize: 10, fontWeight: '700', color: '#647F9E' }}>Teacher</Text><Text style={{ fontSize: 13, color: '#213B57' }}>{selBatch[3]}</Text></View>
                  <View style={{ flex: 1 }}><Text style={{ fontSize: 10, fontWeight: '700', color: '#647F9E' }}>Date</Text><Text style={{ fontSize: 13, color: '#213B57' }}>{selBatch[5]}</Text></View>
                </View>
                <View style={{ marginTop: 16 }}><Text style={{ fontSize: 10, fontWeight: '700', color: '#647F9E' }}>Status</Text>{(() => { const [bg, fg] = SS[selBatch[4]] || SS.Verified; return <View style={{ backgroundColor: bg, borderRadius: 11, paddingHorizontal: 11, paddingVertical: 4, alignSelf: 'flex-start', marginTop: 6 }}><Text style={{ color: fg, fontSize: 11, fontWeight: '700' }}>{selBatch[4]}</Text></View>; })()}</View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingHorizontal: 20, paddingVertical: 13, borderTopWidth: 1, borderTopColor: '#E2EAF0' }}>
                <Pressable onPress={() => setSelBatch(null)} style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 7, borderWidth: 1, borderColor: '#DCE6EE' }}><Text style={{ fontSize: 12, fontWeight: '600', color: '#213B57' }}>Close</Text></Pressable>
                <Pressable onPress={() => { setSelBatch(null); show('Opening batch details...', 'info'); }} style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 7, backgroundColor: '#00513D' }}><Text style={{ fontSize: 12, fontWeight: '600', color: '#FFFFFF' }}>View Details</Text></Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>}

        {/* TOASTS */}
        <View style={{ position: 'absolute', top: 75, right: 20, zIndex: 9999, gap: 8 }}>
          {toasts.map(t => { const tc: Record<string, string> = { success: C.green, error: C.red, info: C.blue, warning: C.orange }; return (
            <View key={t.id} style={{ backgroundColor: '#FFFFFF', borderRadius: 9, paddingHorizontal: 16, paddingVertical: 11, borderWidth: 1, borderColor: '#E2EAF0', borderLeftWidth: 4, borderLeftColor: tc[t.type] || C.blue, maxWidth: 340, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}>
              <Text style={{ color: '#213B57', fontSize: 12, fontWeight: '500' }}>{t.msg}</Text>
            </View>
          ); })}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
