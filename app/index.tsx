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
  UserRound, ChevronUp, Check, Trash2, Layers, BookMarked, Save, FlaskConical,
  Languages, Calculator, Globe2, Code2, Leaf, Scale, TrendingUp, Microscope,
  ChevronLeft, ChevronRight, Printer, ShieldCheck, Clock3, User as UserIcon,
  Trophy, GripVertical, SlidersHorizontal,
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

// === SUBJECTS & CLASSES DATA ===
const INITIAL_CLASSES = [
  { id: 'jss1', name: 'JSS1', arms: [{ code: 'JSS1A', students: 14 }, { code: 'JSS1B', students: 15 }, { code: 'JSS1C', students: 13 }], total: 42, expanded: true },
  { id: 'jss2', name: 'JSS2', arms: [{ code: 'JSS2A', students: 19 }, { code: 'JSS2B', students: 19 }], total: 38, expanded: false },
  { id: 'jss3', name: 'JSS3', arms: [{ code: 'JSS3A', students: 18 }, { code: 'JSS3B', students: 18 }], total: 36, expanded: false },
  { id: 'ss1', name: 'SS1', arms: [{ code: 'SS1A', students: 14 }, { code: 'SS1B', students: 13 }, { code: 'SS1C', students: 13 }], total: 40, expanded: false },
  { id: 'ss2', name: 'SS2', arms: [{ code: 'SS2A', students: 19 }, { code: 'SS2B', students: 18 }], total: 37, expanded: false },
  { id: 'ss3', name: 'SS3', arms: [{ code: 'SS3A', students: 18 }, { code: 'SS3B', students: 17 }], total: 35, expanded: false },
];

const INITIAL_SUBJECTS = [
  { code: 'MAT', name: 'Mathematics', category: 'Science', grades: 'JSS1 – SS3', type: 'Core', description: 'Study of numbers, quantities, structure, space, and change. Foundation for analytical thinking and problem-solving.', Ic: Calculator },
  { code: 'ENG', name: 'English Language', category: 'Languages', grades: 'JSS1 – SS3', type: 'Core', description: 'Development of reading, writing, speaking, and listening skills in English. Foundation for all communication.', Ic: Languages },
  { code: 'BIO', name: 'Biology', category: 'Science', grades: 'JSS1 – SS3', type: 'Core', description: 'Study of living organisms and their structure, function, growth, origin, evolution, and distribution.', Ic: Microscope },
  { code: 'CHE', name: 'Chemistry', category: 'Science', grades: 'JSS1 – SS3', type: 'Core', description: 'Study of matter, its properties, composition, structure, and the changes it undergoes during chemical reactions.', Ic: FlaskConical },
  { code: 'PHY', name: 'Physics', category: 'Science', grades: 'JSS1 – SS3', type: 'Core', description: 'Study of matter, energy, motion, and force, and their interactions across the universe.', Ic: TrendingUp },
  { code: 'CCT', name: 'Civic Education', category: 'Social Science', grades: 'JSS1 – SS3', type: 'Core', description: 'Study of rights, responsibilities, and duties of citizens, governance, and civic engagement.', Ic: Scale },
  { code: 'ICT', name: 'Information & Communication Technology', category: 'Technology', grades: 'JSS1 – SS3', type: 'Core', description: 'Study of computer systems, networks, and digital communication tools used in modern society.', Ic: Code2 },
  { code: 'SST', name: 'Social Studies', category: 'Social Science', grades: 'JSS1 – JSS3', type: 'Core', description: 'Integrated study of social sciences and humanities to promote civic competence and social understanding.', Ic: Globe2 },
  { code: 'AGR', name: 'Agricultural Science', category: 'Science', grades: 'JSS1 – SS3', type: 'Elective', description: 'Study of farming, crop cultivation, livestock rearing, and agricultural technology for food production.', Ic: Leaf },
  { code: 'GEO', name: 'Geography', category: 'Social Science', grades: 'JSS1 – SS3', type: 'Elective', description: 'Study of Earth\'s lands, features, inhabitants, and phenomena, and the interactions between them.', Ic: Globe2 },
  { code: 'ECO', name: 'Economics', category: 'Social Science', grades: 'SS1 – SS3', type: 'Elective', description: 'Study of production, distribution, and consumption of goods and services, and economic decision-making.', Ic: TrendingUp },
  { code: 'GOV', name: 'Government', category: 'Social Science', grades: 'SS1 – SS3', type: 'Elective', description: 'Study of political institutions, processes, theories, and the structure of government.', Ic: Scale },
];

const SUBJECT_CATEGORY_COLORS: Record<string, [string, string]> = {
  'Science': ['#DFF5E9', '#08754F'],
  'Languages': ['#E0ECFF', '#236FD0'],
  'Social Science': ['#FFF0D4', '#C27A08'],
  'Technology': ['#EFE4FF', '#7443C8'],
  'Arts': ['#FFE1E1', '#D92E32'],
};

// === SUBJECTS & CLASSES SCREEN ===
function SubjectsAndClassesScreen({ search, show }: { search: string; show: (msg: string, type?: string) => void }) {
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [selectedCode, setSelectedCode] = useState<string>('BIO');
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [addModal, setAddModal] = useState<{ visible: boolean; mode: 'class' | 'subject' }>({ visible: false, mode: 'subject' });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const selected = subjects.find(s => s.code === selectedCode) || subjects[0];

  // Initialize edit values whenever the selected subject changes
  React.useEffect(() => {
    if (selected) {
      setEditValues({
        code: selected.code,
        name: selected.name,
        category: selected.category,
        grades: selected.grades,
        type: selected.type,
        description: selected.description,
      });
    }
  }, [selectedCode]);

  const filteredSubjects = useMemo(() => {
    if (!search.trim()) return subjects;
    const q = search.toLowerCase();
    return subjects.filter(s => `${s.code} ${s.name} ${s.category} ${s.grades} ${s.type}`.toLowerCase().includes(q));
  }, [subjects, search]);

  const filteredClasses = useMemo(() => {
    if (!search.trim()) return classes;
    const q = search.toLowerCase();
    return classes.filter(c => `${c.name} ${c.arms.map(a => a.code).join(' ')}`.toLowerCase().includes(q));
  }, [classes, search]);

  function toggleClass(id: string) {
    setClasses(curr => curr.map(c => c.id === id ? { ...c, expanded: !c.expanded } : c));
  }

  function saveSubject() {
    if (!editValues.name || !editValues.code) { show('Subject code and name are required', 'error'); return; }
    setSubjects(curr => curr.map(s => s.code === selectedCode ? { ...s, name: editValues.name, category: editValues.category || s.category, grades: editValues.grades || s.grades, type: editValues.type || s.type, description: editValues.description || s.description } : s));
    show(`${editValues.name} updated`, 'success');
  }

  function deleteSubject() {
    if (!confirmDelete) return;
    const subj = subjects.find(s => s.code === confirmDelete);
    setSubjects(curr => curr.filter(s => s.code !== confirmDelete));
    setConfirmDelete(null);
    if (selectedCode === confirmDelete && subjects.length > 1) {
      setSelectedCode(subjects.find(s => s.code !== confirmDelete)!.code);
    }
    show(`${subj?.name || 'Subject'} deleted`, 'info');
  }

  function addNewSubject() {
    const code = (editValues.code || '').toUpperCase().trim();
    if (!code || !editValues.name) { show('Code and name are required', 'error'); return; }
    if (subjects.some(s => s.code === code)) { show(`Subject code ${code} already exists`, 'error'); return; }
    const Ic = BookMarked;
    setSubjects(curr => [...curr, { code, name: editValues.name, category: editValues.category || 'Science', grades: editValues.grades || 'JSS1 – SS3', type: editValues.type || 'Core', description: editValues.description || '', Ic }]);
    setAddModal({ visible: false, mode: 'subject' });
    setEditValues({});
    setSelectedCode(code);
    show(`${editValues.name} added`, 'success');
  }

  function addNewClassArm() {
    const name = (editValues.className || '').toUpperCase().trim();
    const armCode = (editValues.armCode || '').toUpperCase().trim();
    const students = parseInt(editValues.armStudents || '0', 10) || 0;
    if (!name || !armCode) { show('Class name and arm code are required', 'error'); return; }
    if (classes.some(c => c.name === name)) {
      // Add arm to existing class
      setClasses(curr => curr.map(c => c.name === name ? { ...c, arms: [...c.arms, { code: armCode, students }], total: c.total + students, expanded: true } : c));
      show(`${armCode} added to ${name}`, 'success');
    } else {
      setClasses(curr => [...curr, { id: name.toLowerCase(), name, arms: [{ code: armCode, students }], total: students, expanded: true }]);
      show(`Class ${name} with arm ${armCode} added`, 'success');
    }
    setAddModal({ visible: false, mode: 'class' });
    setEditValues({});
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 30, maxWidth: 1600, alignSelf: 'center', width: '100%' }} showsVerticalScrollIndicator={false}>
      {/* Page header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 16, flexWrap: 'wrap' }}>
        <View style={{ flex: 1, minWidth: 280 }}>
          <Text style={{ color: '#064333', fontSize: 26, fontWeight: '800', letterSpacing: -0.3 }}>Subjects & Classes</Text>
          <Text style={{ color: '#647F9E', fontSize: 13, marginTop: 5 }}>Manage classes, arms, and the subject library offered by the school.</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          <Pressable onPress={() => { setEditValues({ className: '', armCode: '', armStudents: '' }); setAddModal({ visible: true, mode: 'class' }); }} style={{ borderWidth: 1, borderColor: '#D5E0E9', borderRadius: 7, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: '#FFFFFF' }}>
            <Plus size={15} color="#274968" /><Text style={{ color: '#274968', fontSize: 12, fontWeight: '700' }}>Add Class/Arm</Text>
          </Pressable>
          <Pressable onPress={() => { setEditValues({ code: '', name: '', category: 'Science', grades: 'JSS1 – SS3', type: 'Core', description: '' }); setAddModal({ visible: true, mode: 'subject' }); }} style={{ backgroundColor: '#00513D', borderRadius: 7, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 15, paddingVertical: 9 }}>
            <Plus size={15} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Add Subject</Text>
          </Pressable>
        </View>
      </View>

      {/* Main split layout: left = classes + subjects table, right = edit panel */}
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
        {/* LEFT COLUMN */}
        <View style={{ flex: 1.7, minWidth: 0 }}>
          {/* Classes & Arms */}
          <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE7EE', borderRadius: 8, padding: 15, marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
                <View style={{ width: 30, height: 30, borderRadius: 7, backgroundColor: '#DFF5E9', alignItems: 'center', justifyContent: 'center' }}><Layers size={17} color="#08704F" /></View>
                <View><Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800' }}>Classes & Arms</Text><Text style={{ color: '#6A83A0', fontSize: 11, marginTop: 2 }}>{classes.length} classes · {classes.reduce((s, c) => s + c.arms.length, 0)} arms · {classes.reduce((s, c) => s + c.total, 0)} students</Text></View>
              </View>
            </View>

            {filteredClasses.map(cls => (
              <View key={cls.id} style={{ borderWidth: 1, borderColor: '#E3EAF0', borderRadius: 6, marginBottom: 7, overflow: 'hidden' }}>
                <Pressable onPress={() => toggleClass(cls.id)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 11, backgroundColor: cls.expanded ? '#F0F7F4' : '#FFFFFF' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#003D31', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>{cls.name}</Text></View>
                    <View>
                      <Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '700' }}>{cls.name}</Text>
                      <Text style={{ color: '#6A83A0', fontSize: 10, marginTop: 2 }}>{cls.arms.length} arm{cls.arms.length > 1 ? 's' : ''} · {cls.total} students</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    {!cls.expanded && <View style={{ flexDirection: 'row', gap: 4 }}>{cls.arms.slice(0, 4).map(a => <View key={a.code} style={{ backgroundColor: '#E3EAF0', borderRadius: 9, paddingHorizontal: 7, paddingVertical: 2 }}><Text style={{ color: '#334F6E', fontSize: 8, fontWeight: '700' }}>{a.code}</Text></View>)}</View>}
                    {cls.expanded ? <ChevronUp size={16} color="#45698D" /> : <ChevronDown size={16} color="#45698D" />}
                  </View>
                </Pressable>
                {cls.expanded && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E3EAF0', backgroundColor: '#FAFCFB' }}>
                    {cls.arms.map(a => (
                      <Pressable key={a.code} onPress={() => show(`${a.code}: ${a.students} students`, 'info')} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: '#FFFFFF' }}>
                        <View style={{ width: 26, height: 26, borderRadius: 6, backgroundColor: '#DFF5E9', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#08704F', fontSize: 9, fontWeight: '800' }}>{a.code.slice(-1)}</Text></View>
                        <View><Text style={{ color: '#142F4D', fontSize: 11, fontWeight: '700' }}>{a.code}</Text><Text style={{ color: '#6A83A0', fontSize: 9, marginTop: 1 }}>{a.students} students</Text></View>
                      </Pressable>
                    ))}
                    <Pressable onPress={() => { setEditValues({ className: cls.name, armCode: '', armStudents: '' }); setAddModal({ visible: true, mode: 'class' }); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#D5E0E9', borderStyle: 'dashed', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 12, backgroundColor: '#FFFFFF' }}>
                      <Plus size={13} color="#274968" /><Text style={{ color: '#274968', fontSize: 10, fontWeight: '700' }}>Add Arm</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Subject Library */}
          <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE7EE', borderRadius: 8, padding: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
                <View style={{ width: 30, height: 30, borderRadius: 7, backgroundColor: '#E0ECFF', alignItems: 'center', justifyContent: 'center' }}><BookMarked size={17} color="#236FD0" /></View>
                <View><Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800' }}>Subject Library</Text><Text style={{ color: '#6A83A0', fontSize: 11, marginTop: 2 }}>{subjects.length} subjects · {subjects.filter(s => s.type === 'Core').length} core · {subjects.filter(s => s.type === 'Elective').length} elective</Text></View>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ minWidth: 620 }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#F0F3F5', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 5, marginBottom: 2 }}>
                  {['Code', 'Subject Name', 'Category', 'Applicable Grade', 'Type', ''].map((h, i) => <Text key={h} style={{ flex: [0.55, 1.6, 1.1, 1.0, 0.75, 0.4][i], fontSize: 10, fontWeight: '800', color: '#334F6E' }}>{h}</Text>)}
                </View>
                {filteredSubjects.map(s => {
                  const [cbg, cfg] = SUBJECT_CATEGORY_COLORS[s.category] || ['#E3EAF0', '#334F6E'];
                  const isSel = s.code === selectedCode;
                  return (
                    <Pressable key={s.code} onPress={() => setSelectedCode(s.code)} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E8EEF3', backgroundColor: isSel ? '#F0F7F4' : 'transparent' }}>
                      <View style={{ flex: 0.55 }}><View style={{ backgroundColor: '#003D31', borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3, alignSelf: 'flex-start' }}><Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '800' }}>{s.code}</Text></View></View>
                      <View style={{ flex: 1.6, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        {s.Ic && <s.Ic size={14} color="#45698D" />}
                        <Text numberOfLines={1} style={{ fontSize: 11, fontWeight: '600', color: '#213B57' }}>{s.name}</Text>
                      </View>
                      <View style={{ flex: 1.1 }}><View style={{ backgroundColor: cbg, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3, alignSelf: 'flex-start' }}><Text style={{ color: cfg, fontSize: 9, fontWeight: '700' }}>{s.category}</Text></View></View>
                      <Text style={{ flex: 1.0, fontSize: 10, color: '#405D7D' }}>{s.grades}</Text>
                      <View style={{ flex: 0.75 }}><View style={{ backgroundColor: s.type === 'Core' ? '#D9F4E6' : '#FFF0D4', borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3, alignSelf: 'flex-start' }}><Text style={{ color: s.type === 'Core' ? '#08754F' : '#C27A08', fontSize: 9, fontWeight: '700' }}>{s.type}</Text></View></View>
                      <View style={{ flex: 0.4, alignItems: 'flex-end' }}><MoreVertical size={15} color="#244666" /></View>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* RIGHT COLUMN — Edit Subject Panel */}
        <View style={{ flex: 1, minWidth: 280, maxWidth: 380 }}>
          {selected ? (
            <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE7EE', borderRadius: 8, padding: 18, position: 'sticky', top: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800' }}>Edit Subject</Text>
                <Pressable onPress={() => show('More options', 'info')}><MoreVertical size={16} color="#244666" /></Pressable>
              </View>

              {/* Subject icon + name header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E3EAF0', marginBottom: 16 }}>
                <View style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: SUBJECT_CATEGORY_COLORS[selected.category]?.[0] || '#E3EAF0', alignItems: 'center', justifyContent: 'center' }}>
                  {selected.Ic && <selected.Ic size={24} color={SUBJECT_CATEGORY_COLORS[selected.category]?.[1] || '#334F6E'} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#142F4D', fontSize: 14, fontWeight: '800' }}>{selected.name}</Text>
                  <Text style={{ color: '#6A83A0', fontSize: 10, marginTop: 3 }}>Code: {selected.code}</Text>
                </View>
              </View>

              {/* Editable fields */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: '#405D7D', fontSize: 10, fontWeight: '700', marginBottom: 5 }}>Subject Code</Text>
                <TextInput value={editValues.code ?? ''} onChangeText={v => setEditValues(c => ({ ...c, code: v }))} style={{ height: 36, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 10, color: '#19334F', fontSize: 12, backgroundColor: '#F8FBFD' }} />
              </View>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: '#405D7D', fontSize: 10, fontWeight: '700', marginBottom: 5 }}>Subject Name</Text>
                <TextInput value={editValues.name ?? ''} onChangeText={v => setEditValues(c => ({ ...c, name: v }))} style={{ height: 36, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 10, color: '#19334F', fontSize: 12 }} />
              </View>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#405D7D', fontSize: 10, fontWeight: '700', marginBottom: 5 }}>Category</Text>
                  <TextInput value={editValues.category ?? ''} onChangeText={v => setEditValues(c => ({ ...c, category: v }))} style={{ height: 36, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 10, color: '#19334F', fontSize: 12 }} />
                </View>
                <View style={{ flex: 0.85 }}>
                  <Text style={{ color: '#405D7D', fontSize: 10, fontWeight: '700', marginBottom: 5 }}>Type</Text>
                  <TextInput value={editValues.type ?? ''} onChangeText={v => setEditValues(c => ({ ...c, type: v }))} style={{ height: 36, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 10, color: '#19334F', fontSize: 12 }} />
                </View>
              </View>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: '#405D7D', fontSize: 10, fontWeight: '700', marginBottom: 5 }}>Applicable Grades</Text>
                <TextInput value={editValues.grades ?? ''} onChangeText={v => setEditValues(c => ({ ...c, grades: v }))} style={{ height: 36, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 10, color: '#19334F', fontSize: 12 }} />
              </View>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: '#405D7D', fontSize: 10, fontWeight: '700', marginBottom: 5 }}>Description</Text>
                <TextInput value={editValues.description ?? ''} onChangeText={v => setEditValues(c => ({ ...c, description: v }))} multiline numberOfLines={4} style={{ minHeight: 84, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, color: '#19334F', fontSize: 11, textAlignVertical: 'top' }} />
              </View>

              {/* Action buttons */}
              <View style={{ borderTopWidth: 1, borderTopColor: '#E3EAF0', paddingTop: 14, gap: 8 }}>
                <Pressable onPress={() => setConfirmDelete(selected.code)} style={{ borderWidth: 1, borderColor: '#F4C9C7', backgroundColor: '#FFF9F8', borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 9 }}>
                  <Trash2 size={14} color="#D92E32" /><Text style={{ color: '#D92E32', fontSize: 11, fontWeight: '700' }}>Delete Subject</Text>
                </Pressable>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable onPress={() => { if (selected) setEditValues({ code: selected.code, name: selected.name, category: selected.category, grades: selected.grades, type: selected.type, description: selected.description }); show('Changes discarded', 'info'); }} style={{ flex: 1, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 9 }}><Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700' }}>Cancel</Text></Pressable>
                  <Pressable onPress={saveSubject} style={{ flex: 1, backgroundColor: '#00513D', borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9 }}><Save size={14} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Save</Text></Pressable>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE7EE', borderRadius: 8, padding: 28, alignItems: 'center' }}>
              <BookMarked size={36} color="#B8C7D5" />
              <Text style={{ color: '#647F9E', fontSize: 13, fontWeight: '600', marginTop: 12 }}>Select a subject</Text>
              <Text style={{ color: '#7B93AB', fontSize: 11, marginTop: 4, textAlign: 'center' }}>Click any row in the Subject Library to view and edit its details here.</Text>
            </View>
          )}
        </View>
      </View>

      {/* Add Modal */}
      <Modal visible={addModal.visible} transparent animationType="fade" onRequestClose={() => setAddModal(c => ({ ...c, visible: false }))}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(8,25,38,0.45)', alignItems: 'center', justifyContent: 'center', padding: 20 }} onPress={() => setAddModal(c => ({ ...c, visible: false }))}>
          <View style={{ width: '100%', maxWidth: 480, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 22 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <Text style={{ color: '#142F4D', fontSize: 17, fontWeight: '800' }}>{addModal.mode === 'subject' ? 'Add Subject' : 'Add Class / Arm'}</Text>
              <Pressable onPress={() => setAddModal(c => ({ ...c, visible: false }))}><X size={19} color="#45698D" /></Pressable>
            </View>
            {addModal.mode === 'subject' ? (
              <View>
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                  <View style={{ flex: 0.5 }}>
                    <Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Code</Text>
                    <TextInput value={editValues.code ?? ''} onChangeText={v => setEditValues(c => ({ ...c, code: v }))} placeholder="e.g. HIS" placeholderTextColor="#8097B0" style={{ height: 39, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 11, color: '#19334F', fontSize: 12 }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Subject Name</Text>
                    <TextInput value={editValues.name ?? ''} onChangeText={v => setEditValues(c => ({ ...c, name: v }))} placeholder="e.g. History" placeholderTextColor="#8097B0" style={{ height: 39, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 11, color: '#19334F', fontSize: 12 }} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Category</Text>
                    <TextInput value={editValues.category ?? ''} onChangeText={v => setEditValues(c => ({ ...c, category: v }))} placeholder="Science / Arts / ..." placeholderTextColor="#8097B0" style={{ height: 39, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 11, color: '#19334F', fontSize: 12 }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Type</Text>
                    <TextInput value={editValues.type ?? ''} onChangeText={v => setEditValues(c => ({ ...c, type: v }))} placeholder="Core / Elective" placeholderTextColor="#8097B0" style={{ height: 39, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 11, color: '#19334F', fontSize: 12 }} />
                  </View>
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Applicable Grades</Text>
                  <TextInput value={editValues.grades ?? ''} onChangeText={v => setEditValues(c => ({ ...c, grades: v }))} placeholder="e.g. JSS1 – SS3" placeholderTextColor="#8097B0" style={{ height: 39, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 11, color: '#19334F', fontSize: 12 }} />
                </View>
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Description</Text>
                  <TextInput value={editValues.description ?? ''} onChangeText={v => setEditValues(c => ({ ...c, description: v }))} multiline numberOfLines={3} placeholder="Brief description of the subject..." placeholderTextColor="#8097B0" style={{ minHeight: 70, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 11, paddingVertical: 8, color: '#19334F', fontSize: 12, textAlignVertical: 'top' }} />
                </View>
              </View>
            ) : (
              <View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Class Name (existing or new)</Text>
                  <TextInput value={editValues.className ?? ''} onChangeText={v => setEditValues(c => ({ ...c, className: v }))} placeholder="e.g. JSS1 or SS4" placeholderTextColor="#8097B0" style={{ height: 39, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 11, color: '#19334F', fontSize: 12 }} />
                </View>
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Arm Code</Text>
                    <TextInput value={editValues.armCode ?? ''} onChangeText={v => setEditValues(c => ({ ...c, armCode: v }))} placeholder="e.g. JSS1D" placeholderTextColor="#8097B0" style={{ height: 39, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 11, color: '#19334F', fontSize: 12 }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Students</Text>
                    <TextInput value={editValues.armStudents ?? ''} onChangeText={v => setEditValues(c => ({ ...c, armStudents: v }))} placeholder="0" keyboardType="numeric" placeholderTextColor="#8097B0" style={{ height: 39, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6, paddingHorizontal: 11, color: '#19334F', fontSize: 12 }} />
                  </View>
                </View>
              </View>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              <Pressable onPress={() => setAddModal(c => ({ ...c, visible: false }))} style={{ paddingHorizontal: 15, paddingVertical: 9, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6 }}><Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700' }}>Cancel</Text></Pressable>
              <Pressable onPress={addModal.mode === 'subject' ? addNewSubject : addNewClassArm} style={{ backgroundColor: '#00513D', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 15, paddingVertical: 9 }}><Plus size={15} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Add</Text></Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Delete Confirmation */}
      <Modal visible={!!confirmDelete} transparent animationType="fade" onRequestClose={() => setConfirmDelete(null)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(8,25,38,0.45)', alignItems: 'center', justifyContent: 'center', padding: 20 }} onPress={() => setConfirmDelete(null)}>
          <View style={{ width: '100%', maxWidth: 400, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 22 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFF9F8', borderWidth: 1, borderColor: '#F4C9C7', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={18} color="#D92E32" /></View>
              <Text style={{ color: '#142F4D', fontSize: 16, fontWeight: '800' }}>Delete Subject?</Text>
            </View>
            <Text style={{ color: '#647F9E', fontSize: 12, lineHeight: 18 }}>This will remove <Text style={{ fontWeight: '700', color: '#213B57' }}>{subjects.find(s => s.code === confirmDelete)?.name}</Text> from the subject library. Classes currently offering this subject will need to be reassigned. This action cannot be undone.</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <Pressable onPress={() => setConfirmDelete(null)} style={{ paddingHorizontal: 15, paddingVertical: 9, borderWidth: 1, borderColor: '#D7E1E9', borderRadius: 6 }}><Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700' }}>Cancel</Text></Pressable>
              <Pressable onPress={deleteSubject} style={{ backgroundColor: '#D92E32', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 15, paddingVertical: 9 }}><Trash2 size={14} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Delete</Text></Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

// === STUDENTS DATA ===
const INITIAL_STUDENTS = [
  { id: '1', initials: 'HA', name: 'Hajara Abubakar', admission: 'AK/2024/0012', gender: 'Female', classArm: 'JSS1A', guardian: 'Fatima Abubakar', status: 'Active', tone: 'green', dob: '14 Mar 2012', age: '13 years', phone: '+234 803 456 7890', session: '2024/2025', admissionYear: '2024', teacher: 'Mrs. O. Bello', scores: [['Mathematics', '78 / 100'], ['English Language', '84 / 100'], ['Basic Science', '81 / 100']] as [string, string][], activity: [['Student record updated', '2 days ago'], ['Scores verified', '5 days ago']] as [string, string][] },
  { id: '2', initials: 'CO', name: 'Chukwuemeka Okafor', admission: 'AK/2023/0084', gender: 'Male', classArm: 'SS2B', guardian: 'Emmanuel Okafor', status: 'Active', tone: 'blue', dob: '08 Nov 2008', age: '16 years', phone: '+234 803 123 4567', session: '2024/2025', admissionYear: '2023', teacher: 'Mr. T. Okafor', scores: [['Mathematics', '82 / 100'], ['English Language', '76 / 100'], ['Physics', '79 / 100']] as [string, string][], activity: [['Scores verified', '1 day ago'], ['Class placement updated', '1 week ago']] as [string, string][] },
  { id: '3', initials: 'AI', name: 'Amina Ibrahim', admission: 'AK/2024/0031', gender: 'Female', classArm: 'JSS2A', guardian: 'Musa Ibrahim', status: 'Active', tone: 'purple', dob: '21 Jun 2011', age: '14 years', phone: '+234 806 123 4567', session: '2024/2025', admissionYear: '2024', teacher: 'Mrs. L. Adebayo', scores: [['Mathematics', '88 / 100'], ['English Language', '80 / 100'], ['Basic Science', '85 / 100']] as [string, string][], activity: [['Student record updated', '3 days ago'], ['Scores verified', '1 week ago']] as [string, string][] },
  { id: '4', initials: 'OA', name: 'Oluwaseun Adeyemi', admission: 'AK/2022/0068', gender: 'Male', classArm: 'SS3A', guardian: 'Kemi Adeyemi', status: 'Active', tone: 'blue', dob: '04 Feb 2007', age: '18 years', phone: '+234 805 222 1190', session: '2024/2025', admissionYear: '2022', teacher: 'Mr. A. Adeyemi', scores: [['Mathematics', '91 / 100'], ['English Language', '83 / 100'], ['Physics', '87 / 100']] as [string, string][], activity: [['Scores verified', '2 days ago'], ['Report card generated', '1 week ago']] as [string, string][] },
  { id: '5', initials: 'IN', name: 'Ifeoma Nwosu', admission: 'AK/2023/0045', gender: 'Female', classArm: 'SS1B', guardian: 'Chukwuma Nwosu', status: 'Inactive', tone: 'purple', dob: '17 Sep 2009', age: '15 years', phone: '+234 809 321 4567', session: '2024/2025', admissionYear: '2023', teacher: 'Mrs. E. Hassan', scores: [['Mathematics', '65 / 100'], ['English Language', '72 / 100'], ['Biology', '69 / 100']] as [string, string][], activity: [['Status changed to inactive', '2 weeks ago'], ['Scores verified', '3 weeks ago']] as [string, string][] },
  { id: '6', initials: 'AB', name: 'Abdulrahman Bello', admission: 'AK/2024/0076', gender: 'Male', classArm: 'JSS2B', guardian: 'Aisha Bello', status: 'Active', tone: 'green', dob: '29 Jan 2011', age: '14 years', phone: '+234 802 555 0192', session: '2024/2025', admissionYear: '2024', teacher: 'Mrs. O. Bello', scores: [['Mathematics', '74 / 100'], ['English Language', '77 / 100'], ['Basic Science', '80 / 100']] as [string, string][], activity: [['Student record updated', '4 days ago'], ['Scores verified', '6 days ago']] as [string, string][] },
  { id: '7', initials: 'ZY', name: 'Zainab Yusuf', admission: 'AK/2023/0029', gender: 'Female', classArm: 'SS3B', guardian: 'Bashir Yusuf', status: 'Active', tone: 'purple', dob: '11 Dec 2007', age: '17 years', phone: '+234 807 444 8890', session: '2024/2025', admissionYear: '2023', teacher: 'Mr. C. Ibrahim', scores: [['Mathematics', '86 / 100'], ['English Language', '90 / 100'], ['Chemistry', '82 / 100']] as [string, string][], activity: [['Scores verified', '2 days ago'], ['Report card generated', '4 days ago']] as [string, string][] },
  { id: '8', initials: 'TB', name: 'Tunde Balogun', admission: 'AK/2024/0057', gender: 'Male', classArm: 'JSS1B', guardian: 'Funmilayo Balogun', status: 'Inactive', tone: 'blue', dob: '03 Apr 2012', age: '13 years', phone: '+234 814 777 0112', session: '2024/2025', admissionYear: '2024', teacher: 'Mr. D. Musa', scores: [['Mathematics', '71 / 100'], ['English Language', '68 / 100'], ['Basic Science', '73 / 100']] as [string, string][], activity: [['Status changed to inactive', '1 month ago'], ['Student record updated', '1 month ago']] as [string, string][] },
];

const STU_TONES: Record<string, [string, string]> = {
  green: ['#D7F3E5', '#075B46'], blue: ['#DCE9FF', '#2467D1'],
  purple: ['#EBDDFF', '#6E35D4'], orange: ['#FFF0D4', '#B8790B'],
};

// === STUDENTS SCREEN ===
function StudentsScreen({ search: globalSearch, show }: { search: string; show: (msg: string, type?: string) => void }) {
  const { width } = useWindowDimensions();
  const compact = width < 1180;
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [selectedId, setSelectedId] = useState<string | null>('1');
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  const selectedStudent = students.find(s => s.id === selectedId) || null;
  const effectiveSearch = (search || globalSearch).trim().toLowerCase();
  const classes = ['All Classes', 'JSS1A', 'JSS1B', 'JSS2A', 'JSS2B', 'SS1B', 'SS2B', 'SS3A', 'SS3B'];
  const statuses = ['All Statuses', 'Active', 'Inactive'];

  const filtered = useMemo(() => students.filter(s => {
    const matchesSearch = !effectiveSearch || [s.name, s.admission, s.classArm, s.guardian].some(v => v.toLowerCase().includes(effectiveSearch));
    const matchesClass = classFilter === 'All Classes' || s.classArm === classFilter;
    const matchesStatus = statusFilter === 'All Statuses' || s.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  }), [students, effectiveSearch, classFilter, statusFilter]);

  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function chooseFilter(setter: (v: string) => void, value: string) { setter(value); setPage(1); }

  function openAdd() { setEditingStudent(null); setForm({ name: '', admission: '', gender: 'Female', classArm: 'JSS1A', guardian: '', status: 'Active', tone: 'green', dob: '', age: '', phone: '', session: '2024/2025', admissionYear: '2025', teacher: '', scores: [], activity: [] }); setModalVisible(true); }
  function openEdit() { if (!selectedStudent) return; setEditingStudent(selectedStudent); setForm({ ...selectedStudent }); setModalVisible(true); }
  function saveStudent() {
    if (!form.name?.trim() || !form.admission?.trim()) { show('Name and admission number are required', 'error'); return; }
    const initials = form.name.trim().split(/\s+/).slice(0, 2).map((p: string) => p[0]).join('').toUpperCase();
    const student = { ...form, id: form.id || String(Date.now()), initials, tone: form.tone || 'green' };
    setStudents(curr => curr.some(s => s.id === student.id) ? curr.map(s => s.id === student.id ? student : s) : [student, ...curr]);
    setSelectedId(student.id);
    setModalVisible(false);
    show(`${student.name} saved`, 'success');
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', minHeight: 0 }}>
      <ScrollView style={{ flex: 1, minWidth: 0 }} contentContainerStyle={{ padding: 24, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {/* Page header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 18, flexWrap: 'wrap' }}>
          <View style={{ flex: 1, minWidth: 280 }}>
            <Text style={{ color: '#064333', fontSize: 26, fontWeight: '800', letterSpacing: -0.3 }}>Students</Text>
            <Text style={{ color: '#647F9E', fontSize: 13, marginTop: 5 }}>Manage student records, class placement, and academic profiles.</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 12, paddingVertical: 11, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, backgroundColor: '#FFFFFF' }}>
            <CalendarDays size={20} color="#41698F" />
            <View><Text style={{ color: '#244361', fontSize: 11, fontWeight: '600' }}>Tuesday, 26 August 2025</Text><Text style={{ color: '#647F9E', fontSize: 9, marginTop: 5 }}>Academic Session: 2024/2025  |  Term: Second Term</Text></View>
          </View>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          {[['Total Students', '140', '2 new this term', 'green', Users], ['Active Students', '136', '2 new this term', 'blue', UserRound], ['Class Arms', '18', '1 new this term', 'purple', Users]].map(([label, value, change, tone, Ic]: any) => {
            const [bg, fg] = STU_TONES[tone] || STU_TONES.green;
            return (
              <View key={label} style={{ flex: 1, minWidth: 200, minHeight: 110, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, padding: 17, flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}><Ic size={24} color={fg} /></View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ color: '#244361', fontSize: 11, fontWeight: '600' }}>{label}</Text>
                  <Text style={{ color: '#142F4D', fontSize: 24, fontWeight: '800', marginTop: 4 }}>{value}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}><ArrowUpRight size={13} color="#08754F" /><Text style={{ color: '#08754F', fontSize: 10, fontWeight: '600' }}>{change}</Text></View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Directory card */}
        <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, padding: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: '#142F4D', fontSize: 16, fontWeight: '800' }}>Students Directory</Text>
            <Pressable onPress={openAdd} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, minHeight: 34, paddingHorizontal: 14, borderRadius: 6, backgroundColor: '#00513D' }}>
              <Plus size={15} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Add Student</Text>
            </Pressable>
          </View>

          {/* Filters */}
          <View style={{ flexDirection: 'row', gap: 9, marginBottom: 10, flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: 200, height: 36, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, backgroundColor: '#FFFFFF' }}>
              <Search size={16} color="#8299B1" />
              <TextInput value={search} onChangeText={v => { setSearch(v); setPage(1); }} placeholder="Search by name or admission number..." placeholderTextColor="#8097B0" style={{ flex: 1, fontSize: 11, color: '#142F4D', padding: 0 }} />
            </View>
            <Pressable style={{ minHeight: 36, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}>
              <Text style={{ color: '#244361', fontSize: 11, fontWeight: '600' }}>{classFilter}</Text><ChevronDown size={15} color="#41698F" />
            </Pressable>
            <Pressable style={{ minHeight: 36, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}>
              <Text style={{ color: '#244361', fontSize: 11, fontWeight: '600' }}>{statusFilter}</Text><ChevronDown size={15} color="#41698F" />
            </Pressable>
          </View>

          {/* Filter chips */}
          <View style={{ flexDirection: 'row', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
            {classes.map(item => (
              <Pressable key={item} onPress={() => chooseFilter(setClassFilter, item)} style={{ paddingHorizontal: 9, paddingVertical: 5, borderRadius: 5, borderWidth: 1, borderColor: classFilter === item ? '#B8E3D0' : '#DCE6EE', backgroundColor: classFilter === item ? '#E2F4EC' : 'transparent' }}>
                <Text style={{ fontSize: 10, fontWeight: classFilter === item ? '700' : '500', color: classFilter === item ? '#075B46' : '#41698F' }}>{item}</Text>
              </Pressable>
            ))}
            <View style={{ width: 1, backgroundColor: '#DCE6EE', marginHorizontal: 4 }} />
            {statuses.map(item => (
              <Pressable key={item} onPress={() => chooseFilter(setStatusFilter, item)} style={{ paddingHorizontal: 9, paddingVertical: 5, borderRadius: 5, borderWidth: 1, borderColor: statusFilter === item ? '#B8E3D0' : '#DCE6EE', backgroundColor: statusFilter === item ? '#E2F4EC' : 'transparent' }}>
                <Text style={{ fontSize: 10, fontWeight: statusFilter === item ? '700' : '500', color: statusFilter === item ? '#075B46' : '#41698F' }}>{item}</Text>
              </Pressable>
            ))}
          </View>

          {/* Table */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: 724 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 38, paddingHorizontal: 10, backgroundColor: '#F0F3F6', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                {['Student Name', 'Admission No.', 'Gender', 'Class & Arm', 'Guardian', 'Status', 'Actions'].map((label, i) => (
                  <Text key={label} style={{ width: [178, 120, 82, 92, 132, 82, 38][i], fontSize: 10, fontWeight: '800', color: '#244361', paddingRight: 5 }}>{label}</Text>
                ))}
              </View>
              {visible.map(s => {
                const [bg, fg] = STU_TONES[s.tone] || STU_TONES.green;
                return (
                  <Pressable key={s.id} onPress={() => setSelectedId(s.id)} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 49, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#E8EEF3', backgroundColor: selectedId === s.id ? '#E4F6ED' : 'transparent', borderWidth: selectedId === s.id ? 1 : 0, borderColor: selectedId === s.id ? '#9DD9BF' : 'transparent', borderRadius: selectedId === s.id ? 5 : 0 }}>
                    <View style={{ width: 178, flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 8 }}>
                      <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Text style={{ color: fg, fontSize: 12, fontWeight: '800' }}>{s.initials}</Text></View>
                      <Text numberOfLines={1} style={{ color: '#142F4D', fontSize: 11, fontWeight: '700', flexShrink: 1 }}>{s.name}</Text>
                    </View>
                    <Text numberOfLines={1} style={{ width: 120, fontSize: 10, color: '#244361', paddingRight: 5 }}>{s.admission}</Text>
                    <Text style={{ width: 82, fontSize: 10, color: '#244361', paddingRight: 5 }}>{s.gender}</Text>
                    <Text style={{ width: 92, fontSize: 10, color: '#244361', paddingRight: 5 }}>{s.classArm}</Text>
                    <Text numberOfLines={1} style={{ width: 132, fontSize: 10, color: '#244361', paddingRight: 5 }}>{s.guardian}</Text>
                    <View style={{ width: 82 }}><View style={{ backgroundColor: s.status === 'Active' ? '#D7F3E5' : '#E9EEF4', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' }}><Text style={{ color: s.status === 'Active' ? '#075B46' : '#64748B', fontSize: 9, fontWeight: '700' }}>{s.status}</Text></View></View>
                    <View style={{ width: 38, alignItems: 'center' }}><MoreVertical size={17} color="#41698F" /></View>
                  </Pressable>
                );
              })}
              {!visible.length && <View style={{ padding: 24, alignItems: 'center' }}><Text style={{ color: '#647F9E', fontSize: 12 }}>No students match your filters.</Text></View>}
            </View>
          </ScrollView>

          {/* Pagination */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 12 }}>
            <Text style={{ color: '#647F9E', fontSize: 10 }}>Showing {filtered.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length} students</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Pressable onPress={() => setPage(Math.max(1, safePage - 1))} style={{ minWidth: 28, height: 29, paddingHorizontal: 6, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><ChevronLeft size={16} color="#41698F" /></Pressable>
              {Array.from({ length: pageCount }, (_, i) => i + 1).slice(0, 3).map(number => (
                <Pressable key={number} onPress={() => setPage(number)} style={{ minWidth: 28, height: 29, paddingHorizontal: 6, borderWidth: 1, borderColor: safePage === number ? '#006044' : '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: safePage === number ? '#006044' : '#FFFFFF' }}>
                  <Text style={{ color: safePage === number ? '#FFFFFF' : '#41698F', fontSize: 11, fontWeight: safePage === number ? '800' : '500' }}>{number}</Text>
                </Pressable>
              ))}
              <Pressable onPress={() => setPage(Math.min(pageCount, safePage + 1))} style={{ minWidth: 28, height: 29, paddingHorizontal: 6, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><ChevronRight size={16} color="#41698F" /></Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Right profile panel */}
      {!compact && (
        <View style={{ width: 378, borderLeftWidth: 2, borderLeftColor: '#D5E0E8', backgroundColor: '#F8FAFC', padding: 16 }}>
          <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7 }} contentContainerStyle={{ paddingBottom: 14 }} showsVerticalScrollIndicator={false}>
            {!selectedStudent ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', padding: 30, gap: 10 }}>
                <UserRound size={34} color="#9BAEC0" />
                <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '700' }}>Select a student</Text>
                <Text style={{ color: '#647F9E', fontSize: 11, textAlign: 'center' }}>Choose a student from the directory to view their profile.</Text>
              </View>
            ) : (
              <>
                {/* Date header */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' }}>
                  <CalendarDays size={19} color="#41698F" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700' }}>Tuesday, 26 August 2025</Text>
                    <Text style={{ color: '#647F9E', fontSize: 9, marginTop: 5 }}>Academic Session: {selectedStudent.session}  |  Term: Second Term</Text>
                  </View>
                  <Pressable onPress={() => setSelectedId(null)}><X size={19} color="#59728F" /></Pressable>
                </View>

                {/* Identity */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 10 }}>
                  <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: STU_TONES[selectedStudent.tone]?.[0] || '#D7F3E5', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: STU_TONES[selectedStudent.tone]?.[1] || '#075B46', fontSize: 20, fontWeight: '800' }}>{selectedStudent.initials}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                      <Text numberOfLines={1} style={{ color: '#142F4D', fontSize: 14, fontWeight: '800', maxWidth: 175 }}>{selectedStudent.name}</Text>
                      <View style={{ backgroundColor: selectedStudent.status === 'Active' ? '#D7F3E5' : '#E9EEF4', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 }}><Text style={{ color: selectedStudent.status === 'Active' ? '#075B46' : '#64748B', fontSize: 9, fontWeight: '700' }}>{selectedStudent.status}</Text></View>
                    </View>
                    <Text style={{ color: '#647F9E', fontSize: 11, marginTop: 5 }}>{selectedStudent.admission}</Text>
                  </View>
                </View>

                {/* Action buttons */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingBottom: 12 }}>
                  <Pressable onPress={openEdit} style={{ minHeight: 32, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: '#00513D', borderRadius: 5 }}>
                    <Pencil size={14} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '700' }}>Edit Student</Text>
                  </Pressable>
                  <Pressable onPress={() => show(`Report card view requested for ${selectedStudent.name}`, 'info')} style={{ minHeight: 32, paddingHorizontal: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, backgroundColor: '#FFFFFF' }}>
                    <FileText size={15} color="#274968" /><Text style={{ color: '#274968', fontSize: 9, fontWeight: '600' }}>View Report Card</Text>
                  </Pressable>
                  <Pressable onPress={() => show(`Report card generation requested for ${selectedStudent.name}`, 'info')} style={{ minHeight: 32, paddingHorizontal: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, backgroundColor: '#FFFFFF' }}>
                    <Printer size={15} color="#274968" /><Text style={{ color: '#274968', fontSize: 9, fontWeight: '600' }}>Generate</Text>
                  </Pressable>
                </View>

                {/* Personal Information */}
                {([
                  [UserRound, 'Personal Information', [['Gender', selectedStudent.gender], ['Date of Birth', selectedStudent.dob], ['Age', selectedStudent.age]]],
                  [UserIcon, 'Guardian Information', [['Guardian Name', selectedStudent.guardian], ['Phone Number', selectedStudent.phone]]],
                  [GraduationCap, 'Academic Information', [['Academic Session', selectedStudent.session], ['First Admission', selectedStudent.admissionYear], ['Class Teacher', selectedStudent.teacher]]],
                ] as any).map(([Ic, title, rows]: any) => (
                  <View key={title} style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 9, borderTopWidth: 1, borderTopColor: '#E7EDF2' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 }}><Ic size={19} color="#244361" /><Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800' }}>{title}</Text></View>
                    <View style={{ borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 7 }}>
                      {rows.map(([label, value]: any) => (
                        <View key={label} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 25, gap: 8 }}>
                          <Text style={{ color: '#647F9E', fontSize: 10, flex: 1 }}>{label}</Text>
                          <Text numberOfLines={1} style={{ color: '#244361', fontSize: 10, fontWeight: '600', flex: 1.1 }}>{value}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}

                {/* Verified Scores */}
                <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 9, borderTopWidth: 1, borderTopColor: '#E7EDF2' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 }}><ShieldCheck size={19} color="#244361" /><Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800' }}>Verified Scores</Text></View>
                  <View style={{ borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 7 }}>
                    {selectedStudent.scores.map(([subject, score]: any) => (
                      <View key={subject} style={{ minHeight: 27, flexDirection: 'row', alignItems: 'center', gap: 5, borderBottomWidth: 1, borderBottomColor: '#EEF2F5' }}>
                        <Text numberOfLines={1} style={{ color: '#244361', fontSize: 10, flex: 1.5 }}>{subject}</Text>
                        <Text style={{ color: '#244361', fontSize: 10, fontWeight: '700', flex: 0.8 }}>{score}</Text>
                        <View style={{ backgroundColor: '#D7F3E5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}><Text style={{ color: '#075B46', fontSize: 8, fontWeight: '700' }}>Verified</Text></View>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Recent Activity */}
                <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 9, borderTopWidth: 1, borderTopColor: '#E7EDF2' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 }}><Clock3 size={19} color="#244361" /><Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800' }}>Recent Academic Activity</Text></View>
                  {selectedStudent.activity.map(([title, time]: any, index: number) => (
                    <View key={title} style={{ minHeight: 28, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={{ width: 13, alignItems: 'center' }}>{index === 0 && <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#08765F' }} />}</View>
                      <Text style={{ color: '#244361', fontSize: 10, flex: 1 }}>{title}</Text>
                      <Text style={{ color: '#647F9E', fontSize: 9, width: 70 }}>{time}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      )}

      {/* Add/Edit Student Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(6, 28, 40, 0.45)', justifyContent: 'center', alignItems: 'center', padding: 18 }} onPress={() => setModalVisible(false)}>
          <View style={{ width: '100%', maxWidth: 600, maxHeight: '90%', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20 }} onPress={(e: any) => e.stopPropagation()}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' }}>
              <View><Text style={{ color: '#142F4D', fontSize: 18, fontWeight: '800' }}>{editingStudent ? 'Edit Student' : 'Add Student'}</Text><Text style={{ color: '#647F9E', fontSize: 12, marginTop: 5 }}>Enter the student's record details.</Text></View>
              <Pressable onPress={() => setModalVisible(false)}><X size={20} color="#41698F" /></Pressable>
            </View>
            <ScrollView style={{ maxHeight: 520 }} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingTop: 16, paddingBottom: 12 }}>
              {[['name', 'Student Name', 'e.g. Hajara Abubakar'], ['admission', 'Admission Number', 'e.g. AK/2025/0013'], ['guardian', 'Guardian Name', 'Enter guardian name'], ['phone', 'Guardian Phone', '+234...'], ['dob', 'Date of Birth', 'e.g. 14 Mar 2012'], ['teacher', 'Class Teacher', 'Enter class teacher']].map(([key, label, placeholder]: any) => (
                <View key={key} style={{ width: '48%', flexGrow: 1, minWidth: 190, gap: 6 }}>
                  <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700' }}>{label}</Text>
                  <TextInput value={form[key] || ''} onChangeText={v => setForm((c: any) => ({ ...c, [key]: v }))} placeholder={placeholder} placeholderTextColor="#93A4B6" style={{ height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, color: '#142F4D', fontSize: 12 }} />
                </View>
              ))}
              <View style={{ width: '100%', gap: 6 }}>
                <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700' }}>Gender</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {['Female', 'Male'].map(value => (
                    <Pressable key={value} onPress={() => setForm((c: any) => ({ ...c, gender: value }))} style={{ paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: form.gender === value ? '#0B765B' : '#DCE6EE', borderRadius: 5, backgroundColor: form.gender === value ? '#E2F4EC' : 'transparent' }}>
                      <Text style={{ color: form.gender === value ? '#075B46' : '#41698F', fontSize: 10, fontWeight: form.gender === value ? '700' : '500' }}>{value}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View style={{ width: '100%', gap: 6 }}>
                <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700' }}>Class & Arm</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {['JSS1A', 'JSS1B', 'JSS2A', 'JSS2B', 'SS1B', 'SS2B', 'SS3A', 'SS3B'].map(value => (
                    <Pressable key={value} onPress={() => setForm((c: any) => ({ ...c, classArm: value }))} style={{ paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: form.classArm === value ? '#0B765B' : '#DCE6EE', borderRadius: 5, backgroundColor: form.classArm === value ? '#E2F4EC' : 'transparent' }}>
                      <Text style={{ color: form.classArm === value ? '#075B46' : '#41698F', fontSize: 10, fontWeight: form.classArm === value ? '700' : '500' }}>{value}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View style={{ width: '100%', gap: 6 }}>
                <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700' }}>Status</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {['Active', 'Inactive'].map(value => (
                    <Pressable key={value} onPress={() => setForm((c: any) => ({ ...c, status: value }))} style={{ paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: form.status === value ? '#0B765B' : '#DCE6EE', borderRadius: 5, backgroundColor: form.status === value ? '#E2F4EC' : 'transparent' }}>
                      <Text style={{ color: form.status === value ? '#075B46' : '#41698F', fontSize: 10, fontWeight: form.status === value ? '700' : '500' }}>{value}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#E2EAF0' }}>
              <Pressable onPress={() => setModalVisible(false)} style={{ minHeight: 35, paddingHorizontal: 16, justifyContent: 'center', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}><Text style={{ color: '#274968', fontSize: 11, fontWeight: '700' }}>Cancel</Text></Pressable>
              <Pressable onPress={saveStudent} style={{ minHeight: 35, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: '#00513D', borderRadius: 6 }}><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Save Student</Text></Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// === ASSESSMENT CONFIG DATA ===
const SEED_CONFIGS = [
  { id: 1, className: 'JSS1', subject: 'Mathematics', caMax: 40, examMax: 60, status: 'Active', components: [{ id: 1, name: 'Assignment', marks: 5 }, { id: 2, name: 'Test 1', marks: 5 }, { id: 3, name: 'Test 2', marks: 5 }, { id: 4, name: 'Practical', marks: 5 }, { id: 5, name: 'Project', marks: 20 }], passMark: 40, rounding: 'Whole number', allowMissing: false },
  { id: 2, className: 'JSS1', subject: 'English Language', caMax: 40, examMax: 60, status: 'Active', components: [{ id: 6, name: 'Assignment', marks: 10 }, { id: 7, name: 'Test', marks: 10 }, { id: 8, name: 'Classwork', marks: 20 }], passMark: 40, rounding: 'Whole number', allowMissing: false },
  { id: 3, className: 'JSS1', subject: 'Biology', caMax: 40, examMax: 60, status: 'Active', components: [{ id: 9, name: 'Assignment', marks: 10 }, { id: 10, name: 'Test', marks: 10 }, { id: 11, name: 'Practical', marks: 20 }], passMark: 40, rounding: 'Whole number', allowMissing: false },
  { id: 4, className: 'JSS2', subject: 'Mathematics', caMax: 40, examMax: 60, status: 'Active', components: [{ id: 12, name: 'Assignment', marks: 10 }, { id: 13, name: 'Test', marks: 10 }, { id: 14, name: 'Project', marks: 20 }], passMark: 40, rounding: 'Whole number', allowMissing: false },
  { id: 5, className: 'JSS2', subject: 'Chemistry', caMax: 40, examMax: 60, status: 'Active', components: [{ id: 15, name: 'Assignment', marks: 10 }, { id: 16, name: 'Test', marks: 10 }, { id: 17, name: 'Practical', marks: 20 }], passMark: 40, rounding: 'Whole number', allowMissing: false },
  { id: 6, className: 'JSS3', subject: 'Physics', caMax: 40, examMax: 60, status: 'Active', components: [{ id: 18, name: 'Assignment', marks: 10 }, { id: 19, name: 'Test', marks: 10 }, { id: 20, name: 'Practical', marks: 20 }], passMark: 40, rounding: 'Whole number', allowMissing: false },
  { id: 7, className: 'SS1', subject: 'Government', caMax: 40, examMax: 60, status: 'Active', components: [{ id: 21, name: 'Assignment', marks: 10 }, { id: 22, name: 'Test', marks: 10 }, { id: 23, name: 'Project', marks: 20 }], passMark: 40, rounding: 'Whole number', allowMissing: false },
  { id: 8, className: 'SS1', subject: 'Literature-in-English', caMax: 40, examMax: 60, status: 'Active', components: [{ id: 24, name: 'Assignment', marks: 10 }, { id: 25, name: 'Test', marks: 10 }, { id: 26, name: 'Classwork', marks: 20 }], passMark: 40, rounding: 'Whole number', allowMissing: false },
  { id: 9, className: 'SS2', subject: 'Economics', caMax: 40, examMax: 60, status: 'Active', components: [{ id: 27, name: 'Assignment', marks: 10 }, { id: 28, name: 'Test', marks: 10 }, { id: 29, name: 'Project', marks: 20 }], passMark: 40, rounding: 'Whole number', allowMissing: false },
  { id: 10, className: 'SS3', subject: 'Biology', caMax: 40, examMax: 60, status: 'Active', components: [{ id: 30, name: 'Assignment', marks: 10 }, { id: 31, name: 'Test', marks: 10 }, { id: 32, name: 'Practical', marks: 20 }], passMark: 40, rounding: 'Whole number', allowMissing: false },
  { id: 11, className: 'SS2', subject: 'Mathematics', caMax: 40, examMax: 60, status: 'Active', components: [{ id: 33, name: 'Assignment', marks: 10 }, { id: 34, name: 'Test', marks: 10 }, { id: 35, name: 'Project', marks: 20 }], passMark: 40, rounding: 'Whole number', allowMissing: false },
  { id: 12, className: 'SS3', subject: 'English Language', caMax: 40, examMax: 60, status: 'Active', components: [{ id: 36, name: 'Assignment', marks: 10 }, { id: 37, name: 'Test', marks: 10 }, { id: 38, name: 'Classwork', marks: 20 }], passMark: 40, rounding: 'Whole number', allowMissing: false },
];

// === ASSESSMENT CONFIG SCREEN ===
function AssessmentConfigScreen({ search: globalSearch, show }: { search: string; show: (msg: string, type?: string) => void }) {
  const { width } = useWindowDimensions();
  const compact = width < 1100;
  const [configs, setConfigs] = useState(SEED_CONFIGS);
  const [selectedId, setSelectedId] = useState(1);
  const [tab, setTab] = useState<'CA Components' | 'Settings'>('CA Components');
  const [modal, setModal] = useState<string | null>(null);
  const [componentDraft, setComponentDraft] = useState<any>({ name: '', marks: '5' });
  const [editingComponentId, setEditingComponentId] = useState<number | null>(null);
  const [formDraft, setFormDraft] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [page, setPage] = useState(1);

  const selected = configs.find(c => c.id === selectedId) || configs[0];
  const componentTotal = selected.components.reduce((sum: number, c: any) => sum + Number(c.marks || 0), 0);
  const totalMarks = Number(selected.caMax) + Number(selected.examMax);
  const allClasses = ['All Classes', 'JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
  const subjects = ['All Subjects', ...Array.from(new Set(configs.map(c => c.subject)))];

  const filtered = useMemo(() => configs.filter(c => {
    const q = (query || globalSearch).toLowerCase();
    const matchesQuery = !q || `${c.className} ${c.subject} ${c.status}`.toLowerCase().includes(q);
    const matchesClass = classFilter === 'All Classes' || c.className === classFilter;
    const matchesSubject = subjectFilter === 'All Subjects' || c.subject === subjectFilter;
    return matchesQuery && matchesClass && matchesSubject;
  }), [configs, query, globalSearch, classFilter, subjectFilter]);

  const pageSize = 10;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function updateSelected(patch: any) {
    setConfigs(old => old.map(c => c.id === selected.id ? { ...c, ...patch } : c));
  }
  function openNewConfiguration() {
    setFormDraft({ className: 'JSS1', subject: '', caMax: '40', examMax: '60', status: 'Active', components: [], passMark: '40', rounding: 'Whole number', allowMissing: false });
    setModal('configuration');
  }
  function openEditConfiguration() {
    setFormDraft({ ...selected, caMax: String(selected.caMax), examMax: String(selected.examMax), passMark: String(selected.passMark) });
    setModal('editConfiguration');
  }
  function saveConfiguration() {
    if (!formDraft?.subject?.trim()) { show('Enter a subject name before saving', 'error'); return; }
    const item = { ...formDraft, id: Math.max(0, ...configs.map(c => c.id)) + 1, caMax: Number(formDraft.caMax), examMax: Number(formDraft.examMax), passMark: Number(formDraft.passMark), components: formDraft.components || [] };
    setConfigs(old => [...old, item]);
    setSelectedId(item.id);
    setModal(null);
    show(`${item.className} ${item.subject} configuration added`, 'success');
  }
  function saveEditConfiguration() {
    updateSelected({ ...formDraft, caMax: Number(formDraft.caMax), examMax: Number(formDraft.examMax), passMark: Number(formDraft.passMark) });
    setModal(null);
    show('Configuration settings saved', 'success');
  }
  function deleteConfiguration() {
    const next = configs.find(c => c.id !== selected.id);
    setConfigs(old => old.filter(c => c.id !== selected.id));
    if (next) setSelectedId(next.id);
    setModal(null);
    show(`${selected.className} ${selected.subject} configuration deleted`, 'info');
  }
  function openComponent(component: any) {
    setEditingComponentId(component?.id ?? null);
    setComponentDraft(component ? { name: component.name, marks: String(component.marks) } : { name: '', marks: '5' });
    setModal('component');
  }
  function saveComponent() {
    if (!componentDraft.name.trim() || Number(componentDraft.marks) < 0) { show('Enter a component name and valid marks', 'error'); return; }
    const component = { id: editingComponentId ?? Date.now(), name: componentDraft.name.trim(), marks: Number(componentDraft.marks) };
    updateSelected({
      components: editingComponentId
        ? selected.components.map((c: any) => c.id === editingComponentId ? component : c)
        : [...selected.components, component]
    });
    setModal(null);
    show(`Component ${component.name} saved`, 'success');
  }
  function deleteComponent(id: number) {
    updateSelected({ components: selected.components.filter((c: any) => c.id !== id) });
    show('Component removed', 'info');
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 30, maxWidth: 1600, alignSelf: 'center', width: '100%' }} showsVerticalScrollIndicator={false}>
      {/* Page header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 15, marginBottom: 18, flexWrap: 'wrap' }}>
        <View style={{ flex: 1, minWidth: 280 }}>
          <Text style={{ color: '#064333', fontSize: 26, fontWeight: '800', letterSpacing: -0.3 }}>Assessment Configuration</Text>
          <Text style={{ color: '#647F9E', fontSize: 13, marginTop: 5 }}>Configure continuous assessment components and examination weightings.</Text>
        </View>
        <Pressable onPress={openNewConfiguration} style={{ backgroundColor: '#00513D', borderRadius: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 37, paddingHorizontal: 15 }}>
          <Plus size={16} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Add Configuration</Text>
        </Pressable>
      </View>

      {/* Summary cards */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {[['Continuous Assessment (CA)', '40', 'marks', '40% of total', '#DFF5E9', '#08754F', FileText], ['Examination', '60', 'marks', '60% of total', '#E0ECFF', '#176DDA', FileText], ['Total', '100', 'marks', '100%', '#EFE3FF', '#6E35D4', Trophy]].map(([label, value, unit, foot, bg, fg, Ic]: any) => (
          <View key={label} style={{ flex: 1, minWidth: 220, minHeight: 110, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, padding: 17, flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
            <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}><Ic size={24} color={fg} /></View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#647F9E', fontSize: 11, fontWeight: '600' }}>{label}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5, marginTop: 5 }}>
                <Text style={{ color: '#142F4D', fontSize: 26, fontWeight: '800' }}>{value}</Text>
                <Text style={{ color: '#142F4D', fontSize: 11 }}>{unit}</Text>
              </View>
              <Text style={{ color: '#08754F', fontSize: 11, fontWeight: '700', marginTop: 5 }}>{foot}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Workspace: directory + detail */}
      <View style={{ flexDirection: compact ? 'column' : 'row', gap: 12, alignItems: 'stretch' }}>
        {/* Left: Directory */}
        <View style={{ flex: 1.45, minWidth: 0, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 8, padding: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 14 }}>
            <Text style={{ color: '#142F4D', fontSize: 16, fontWeight: '800' }}>Assessment Configuration</Text>
          </View>
          {/* Filters */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: 180, height: 36, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, backgroundColor: '#FFFFFF' }}>
              <Search size={16} color="#647F9E" />
              <TextInput value={query} onChangeText={v => { setQuery(v); setPage(1); }} placeholder="Search by subject or class..." placeholderTextColor="#8097B0" style={{ flex: 1, fontSize: 11, color: '#142F4D', padding: 0 }} />
            </View>
            <Pressable onPress={() => { setClassFilter(allClasses[(allClasses.indexOf(classFilter) + 1) % allClasses.length]); setPage(1); }} style={{ width: 150, height: 36, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, backgroundColor: '#FFFFFF' }}>
              <Text numberOfLines={1} style={{ color: '#142F4D', fontSize: 11, flex: 1 }}>{classFilter}</Text><ChevronDown size={15} color="#647F9E" />
            </Pressable>
            <Pressable onPress={() => { setSubjectFilter(subjects[(subjects.indexOf(subjectFilter) + 1) % subjects.length]); setPage(1); }} style={{ width: 170, height: 36, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, backgroundColor: '#FFFFFF' }}>
              <Text numberOfLines={1} style={{ color: '#142F4D', fontSize: 11, flex: 1 }}>{subjectFilter}</Text><ChevronDown size={15} color="#647F9E" />
            </Pressable>
          </View>

          {/* Table */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: 680 }}>
              <View style={{ height: 40, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4F7', paddingHorizontal: 12, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                {['Class', 'Subject', 'CA Max', 'Exam Max', 'Total', 'Status', ''].map((h, i) => (
                  <Text key={h} style={{ width: [108, undefined, 105, 105, 82, 95, 34][i], flex: i === 1 ? 1.5 : undefined, color: '#385779', fontSize: 10, fontWeight: '800' }}>{h}</Text>
                ))}
              </View>
              {rows.map((row: any) => (
                <Pressable key={row.id} onPress={() => { setSelectedId(row.id); setTab('CA Components'); }} style={{ minHeight: 46, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#EAF0F4', backgroundColor: selectedId === row.id ? '#EAF7F1' : 'transparent', borderWidth: selectedId === row.id ? 1 : 0, borderColor: selectedId === row.id ? '#A5DDC6' : 'transparent', borderRadius: selectedId === row.id ? 5 : 0 }}>
                  <Text style={{ width: 108, color: '#355779', fontSize: 11, paddingRight: 7 }}>{row.className}</Text>
                  <Text numberOfLines={1} style={{ flex: 1.5, color: '#355779', fontSize: 11, fontWeight: selectedId === row.id ? 700 : 500, paddingRight: 7 }}>{row.subject}</Text>
                  <Text style={{ width: 105, color: '#355779', fontSize: 11, paddingRight: 7 }}>{row.caMax}</Text>
                  <Text style={{ width: 105, color: '#355779', fontSize: 11, paddingRight: 7 }}>{row.examMax}</Text>
                  <Text style={{ width: 82, color: '#355779', fontSize: 11, paddingRight: 7 }}>{Number(row.caMax) + Number(row.examMax)}</Text>
                  <View style={{ width: 95, justifyContent: 'center' }}><View style={{ alignSelf: 'flex-start', backgroundColor: '#D9F5E8', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 14 }}><Text style={{ color: '#08734E', fontSize: 10, fontWeight: 700 }}>{row.status}</Text></View></View>
                  <Pressable onPress={() => { setSelectedId(row.id); setModal('rowActions'); }} style={{ width: 34, alignItems: 'center', justifyContent: 'center' }}><MoreVertical size={17} color="#647F9E" /></Pressable>
                </Pressable>
              ))}
              {!rows.length && <View style={{ padding: 24, alignItems: 'center' }}><Text style={{ color: '#647F9E', fontSize: 12 }}>No configurations match your filters.</Text></View>}
            </View>
          </ScrollView>

          {/* Pagination */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 14 }}>
            <Text style={{ color: '#647F9E', fontSize: 11 }}>Showing {filtered.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length} configurations</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Pressable onPress={() => setPage(Math.max(1, safePage - 1))} style={{ minWidth: 30, height: 30, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><ChevronLeft size={16} color="#647F9E" /></Pressable>
              {Array.from({ length: Math.min(3, pages) }, (_, i) => i + 1).map(p => (
                <Pressable key={p} onPress={() => setPage(p)} style={{ minWidth: 30, height: 30, borderWidth: 1, borderColor: safePage === p ? '#08765F' : '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: safePage === p ? '#08765F' : '#FFFFFF' }}>
                  <Text style={{ color: safePage === p ? '#FFFFFF' : '#142F4D', fontSize: 11, fontWeight: 700 }}>{p}</Text>
                </Pressable>
              ))}
              <Pressable onPress={() => setPage(Math.min(pages, safePage + 1))} style={{ minWidth: 30, height: 30, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><ChevronRight size={16} color="#647F9E" /></Pressable>
            </View>
          </View>
        </View>

        {/* Right: Detail panel */}
        <View style={{ flex: 1, minWidth: 320, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 8, padding: 14 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 18 }}>
            <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#DFF5E9', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={23} color="#00372D" /></View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Text numberOfLines={1} style={{ color: '#142F4D', fontSize: 16, fontWeight: '800', flexShrink: 1 }}>{selected.className} – {selected.subject}</Text>
                <View style={{ backgroundColor: '#D9F5E8', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 14 }}><Text style={{ color: '#08734E', fontSize: 10, fontWeight: 700 }}>{selected.status}</Text></View>
              </View>
              <Text style={{ color: '#647F9E', fontSize: 11, marginTop: 8 }}>Class: {selected.className}  |  Subject: {selected.subject}</Text>
            </View>
            <Pressable onPress={() => { const next = configs.find(c => c.id !== selected.id); if (next) setSelectedId(next.id); }}><X size={19} color="#647F9E" /></Pressable>
          </View>

          {/* Marks summary */}
          <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingVertical: 9, marginBottom: 16 }}>
            {[['CA Maximum', selected.caMax], ['Exam Maximum', selected.examMax], ['Total', totalMarks]].map(([label, value]: any, i: number) => (
              <View key={label} style={{ flex: 1, paddingHorizontal: 12, borderRightWidth: i < 2 ? 1 : 0, borderRightColor: '#DCE6EE' }}>
                <Text style={{ color: '#647F9E', fontSize: 10 }}>{label}</Text>
                <Text style={{ color: '#142F4D', fontSize: 22, fontWeight: '800', marginTop: 6 }}>{value}</Text>
                <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 3 }}>marks</Text>
              </View>
            ))}
          </View>

          {/* Tabs */}
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DCE6EE', marginBottom: 18 }}>
            {(['CA Components', 'Settings'] as const).map(t => (
              <Pressable key={t} onPress={() => setTab(t)} style={{ minWidth: 135, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: tab === t ? '#08765F' : 'transparent' }}>
                <Text style={{ color: tab === t ? '#08765F' : '#647F9E', fontSize: 11, fontWeight: 700 }}>{t}</Text>
              </Pressable>
            ))}
          </View>

          {/* Tab content */}
          {tab === 'CA Components' ? (
            <View>
              <Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800', marginBottom: 12 }}>Continuous Assessment Components</Text>
              <View style={{ borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, overflow: 'hidden' }}>
                <View style={{ minHeight: 38, backgroundColor: '#F1F5F8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 8 }}>
                  <View style={{ width: 24 }} />
                  <Text style={{ flex: 1, color: '#385779', fontSize: 10, fontWeight: 800 }}>Component</Text>
                  <Text style={{ width: 112, color: '#385779', fontSize: 10, fontWeight: 800 }}>Maximum Marks</Text>
                  <Text style={{ width: 76, color: '#385779', fontSize: 10, fontWeight: 800 }}>Actions</Text>
                </View>
                {selected.components.map((component: any) => (
                  <View key={component.id} style={{ minHeight: 43, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 8, borderTopWidth: 1, borderTopColor: '#EAF0F4' }}>
                    <GripVertical size={15} color="#647F9E" />
                    <Text numberOfLines={1} style={{ flex: 1, color: '#355779', fontSize: 11 }}>{component.name}</Text>
                    <Text style={{ width: 112, color: '#355779', fontSize: 11 }}>{component.marks}</Text>
                    <View style={{ width: 76, flexDirection: 'row', justifyContent: 'flex-end' }}>
                      <Pressable onPress={() => openComponent(component)} style={{ width: 31, height: 31, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Pencil size={15} color="#142F4D" /></Pressable>
                      <Pressable onPress={() => deleteComponent(component.id)} style={{ width: 31, height: 31, marginLeft: 6, borderWidth: 1, borderColor: '#FFC6C8', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Trash2 size={15} color="#D92E32" /></Pressable>
                    </View>
                  </View>
                ))}
                {!selected.components.length && <Text style={{ padding: 14, color: '#647F9E', fontSize: 12 }}>No CA components yet. Add one below.</Text>}
              </View>
              <Pressable onPress={() => openComponent(null)} style={{ alignSelf: 'flex-start', marginTop: 14, backgroundColor: '#00513D', borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, minHeight: 34, paddingHorizontal: 13 }}>
                <Plus size={15} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700 }}>Add CA Component</Text>
              </Pressable>

              {/* Validation */}
              <View style={{ marginTop: 12, borderRadius: 8, paddingHorizontal: 13, paddingVertical: 13, borderWidth: 1, backgroundColor: componentTotal <= Number(selected.caMax) ? '#EAF8F1' : '#FFF0F1', borderColor: componentTotal <= Number(selected.caMax) ? '#D1F0E1' : '#FFD6D9' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                  <Text style={{ color: '#1D6A4C', fontSize: 11, fontWeight: 800 }}>CA Total</Text>
                  <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: 800, marginLeft: 16 }}>{componentTotal} / {selected.caMax}</Text>
                  <View style={{ flex: 1 }} />
                  <CheckCircle2 size={16} color={componentTotal <= Number(selected.caMax) ? '#087A50' : '#D92E32'} />
                  <Text style={{ color: componentTotal <= Number(selected.caMax) ? '#087A50' : '#D92E32', fontSize: 10, fontWeight: 700 }}>{componentTotal <= Number(selected.caMax) ? 'Matches CA Maximum' : 'Exceeds CA Maximum'}</Text>
                </View>
              </View>
              {componentTotal > Number(selected.caMax) && (
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10, padding: 13, borderWidth: 1, borderColor: '#FFD1D5', backgroundColor: '#FFF0F1', borderRadius: 8 }}>
                  <AlertCircle size={17} color="#D92E32" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#D92E32', fontSize: 11, fontWeight: 800 }}>Component total exceeds CA maximum</Text>
                    <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 6, lineHeight: 15 }}>Total is {componentTotal}, which is {componentTotal - Number(selected.caMax)} marks over the configured CA maximum ({selected.caMax}).</Text>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View>
              <Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800', marginBottom: 12 }}>Assessment Settings</Text>
              {[
                { label: 'CA Maximum Marks', key: 'caMax', keyboardType: 'numeric' },
                { label: 'Examination Maximum Marks', key: 'examMax', keyboardType: 'numeric' },
                { label: 'Pass Mark', key: 'passMark', keyboardType: 'numeric' },
              ].map(f => (
                <View key={f.key} style={{ marginBottom: 13 }}>
                  <Text style={{ color: '#142F4D', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>{f.label}</Text>
                  <TextInput
                    value={String(formDraft?.[f.key] ?? selected[f.key])}
                    onChangeText={v => setFormDraft((old: any) => ({ ...(old || selected), [f.key]: v }))}
                    keyboardType={f.keyboardType as any}
                    style={{ minHeight: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, paddingHorizontal: 10, fontSize: 12, color: '#142F4D', backgroundColor: '#FFFFFF' }}
                  />
                </View>
              ))}
              {/* Rounding selector */}
              <View style={{ marginBottom: 13 }}>
                <Text style={{ color: '#142F4D', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Rounding Rule</Text>
                <Pressable onPress={() => { const opts = ['Whole number', '1 decimal place', '2 decimal places']; const cur = formDraft?.rounding ?? selected.rounding; setFormDraft((old: any) => ({ ...(old || selected), rounding: opts[(opts.indexOf(cur) + 1) % opts.length] })); }} style={{ minHeight: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                  <Text style={{ color: '#142F4D', fontSize: 12 }}>{formDraft?.rounding ?? selected.rounding}</Text>
                  <ChevronDown size={15} color="#647F9E" />
                </Pressable>
                <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 5 }}>Tap the value to cycle through available options.</Text>
              </View>
              {/* Allow missing toggle */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#142F4D', fontSize: 11, fontWeight: 700 }}>Allow missing CA scores</Text>
                  <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 5 }}>Permit compilation when a component score has not been entered.</Text>
                </View>
                <Pressable onPress={() => setFormDraft((old: any) => ({ ...(old || selected), allowMissing: !((old || selected).allowMissing) }))} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 20, paddingHorizontal: 5, paddingVertical: 4, backgroundColor: '#FFFFFF' }}>
                  <SlidersHorizontal size={15} color="#637F9D" />
                  <View style={{ width: 30, height: 16, borderRadius: 9, backgroundColor: (formDraft?.allowMissing ?? selected.allowMissing) ? '#08765F' : '#CCD8E2', paddingHorizontal: 2, justifyContent: 'center' }}>
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF', alignSelf: (formDraft?.allowMissing ?? selected.allowMissing) ? 'flex-end' : 'flex-start' }} />
                  </View>
                </Pressable>
              </View>
              <Pressable onPress={saveEditConfiguration} style={{ alignSelf: 'flex-start', marginTop: 12, backgroundColor: '#00513D', borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, minHeight: 34, paddingHorizontal: 13 }}>
                <Save size={15} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700 }}>Save Settings</Text>
              </Pressable>
            </View>
          )}

          {/* Footer */}
          <View style={{ flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: '#EEF2F5', paddingTop: 14, marginTop: 18 }}>
            <Pressable onPress={() => { show('Changes discarded', 'info'); setTab('CA Components'); setFormDraft(null); }} style={{ flex: 1, minHeight: 35, paddingHorizontal: 12, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
              <Text style={{ color: '#142F4D', fontSize: 11, fontWeight: 700 }}>Close Without Saving</Text>
            </Pressable>
            <Pressable onPress={() => { if (tab === 'Settings' && formDraft) saveEditConfiguration(); else { show('Changes saved in this session', 'success'); } }} style={{ flex: 1, minHeight: 35, paddingHorizontal: 12, backgroundColor: '#00513D', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700 }}>Save All Changes</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Modals */}
      <Modal visible={!!modal} transparent animationType="fade" onRequestClose={() => setModal(null)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(5,25,35,0.42)', alignItems: 'center', justifyContent: 'center', padding: 18 }} onPress={() => setModal(null)}>
          <View style={{ width: '100%', maxWidth: 480, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20, maxHeight: '90%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={{ color: '#142F4D', fontSize: 17, fontWeight: 800 }}>{modal === 'component' ? (editingComponentId ? 'Edit CA Component' : 'Add CA Component') : modal === 'configuration' ? 'Add Configuration' : modal === 'editConfiguration' ? 'Edit Configuration Settings' : 'Configuration Actions'}</Text>
              <Pressable onPress={() => setModal(null)}><X size={20} color="#647F9E" /></Pressable>
            </View>
            {modal === 'component' ? (
              <View>
                <View style={{ marginBottom: 13 }}>
                  <Text style={{ color: '#142F4D', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Component Name</Text>
                  <TextInput value={componentDraft.name} onChangeText={v => setComponentDraft((old: any) => ({ ...old, name: v }))} placeholder="e.g. Assignment" placeholderTextColor="#8097B0" style={{ minHeight: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, paddingHorizontal: 10, fontSize: 12, color: '#142F4D', backgroundColor: '#FFFFFF' }} />
                </View>
                <View style={{ marginBottom: 13 }}>
                  <Text style={{ color: '#142F4D', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Maximum Marks</Text>
                  <TextInput value={String(componentDraft.marks)} onChangeText={v => setComponentDraft((old: any) => ({ ...old, marks: v }))} keyboardType="numeric" style={{ minHeight: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, paddingHorizontal: 10, fontSize: 12, color: '#142F4D', backgroundColor: '#FFFFFF' }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                  <Pressable onPress={() => setModal(null)} style={{ minHeight: 35, paddingHorizontal: 14, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Text style={{ color: '#142F4D', fontSize: 11, fontWeight: 700 }}>Cancel</Text></Pressable>
                  <Pressable onPress={saveComponent} style={{ minHeight: 35, paddingHorizontal: 14, backgroundColor: '#00513D', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700 }}>Save Component</Text></Pressable>
                </View>
              </View>
            ) : modal === 'configuration' || modal === 'editConfiguration' ? (
              <View>
                <View style={{ marginBottom: 13 }}>
                  <Text style={{ color: '#142F4D', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Subject</Text>
                  <TextInput value={formDraft?.subject || ''} onChangeText={v => setFormDraft((old: any) => ({ ...old, subject: v }))} placeholder="Enter subject name" placeholderTextColor="#8097B0" style={{ minHeight: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, paddingHorizontal: 10, fontSize: 12, color: '#142F4D', backgroundColor: '#FFFFFF' }} />
                </View>
                <View style={{ marginBottom: 13 }}>
                  <Text style={{ color: '#142F4D', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Class</Text>
                  <Pressable onPress={() => { const opts = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3']; const cur = formDraft?.className || 'JSS1'; setFormDraft((old: any) => ({ ...old, className: opts[(opts.indexOf(cur) + 1) % opts.length] })); }} style={{ minHeight: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                    <Text style={{ color: '#142F4D', fontSize: 12 }}>{formDraft?.className || 'JSS1'}</Text>
                    <ChevronDown size={15} color="#647F9E" />
                  </Pressable>
                </View>
                <View style={{ marginBottom: 13 }}>
                  <Text style={{ color: '#142F4D', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>CA Maximum Marks</Text>
                  <TextInput value={String(formDraft?.caMax || '')} onChangeText={v => setFormDraft((old: any) => ({ ...old, caMax: v }))} keyboardType="numeric" style={{ minHeight: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, paddingHorizontal: 10, fontSize: 12, color: '#142F4D', backgroundColor: '#FFFFFF' }} />
                </View>
                <View style={{ marginBottom: 13 }}>
                  <Text style={{ color: '#142F4D', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Examination Maximum Marks</Text>
                  <TextInput value={String(formDraft?.examMax || '')} onChangeText={v => setFormDraft((old: any) => ({ ...old, examMax: v }))} keyboardType="numeric" style={{ minHeight: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, paddingHorizontal: 10, fontSize: 12, color: '#142F4D', backgroundColor: '#FFFFFF' }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                  <Pressable onPress={() => setModal(null)} style={{ minHeight: 35, paddingHorizontal: 14, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Text style={{ color: '#142F4D', fontSize: 11, fontWeight: 700 }}>Cancel</Text></Pressable>
                  <Pressable onPress={modal === 'configuration' ? saveConfiguration : saveEditConfiguration} style={{ minHeight: 35, paddingHorizontal: 14, backgroundColor: '#00513D', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700 }}>Save Configuration</Text></Pressable>
                </View>
              </View>
            ) : (
              <View>
                <Text style={{ color: '#647F9E', fontSize: 12, marginBottom: 16 }}>Selected: {selected.className} — {selected.subject}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
                  <Pressable onPress={deleteConfiguration} style={{ minHeight: 35, paddingHorizontal: 14, borderWidth: 1, borderColor: '#FFC6C8', borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#FFFFFF' }}>
                    <Trash2 size={15} color="#D92E32" /><Text style={{ color: '#D92E32', fontSize: 11, fontWeight: 700 }}>Delete</Text>
                  </Pressable>
                  <Pressable onPress={openEditConfiguration} style={{ minHeight: 35, paddingHorizontal: 14, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#FFFFFF' }}>
                    <Pencil size={15} color="#142F4D" /><Text style={{ color: '#142F4D', fontSize: 11, fontWeight: 700 }}>Edit Settings</Text>
                  </Pressable>
                  <Pressable onPress={() => setModal(null)} style={{ minHeight: 35, paddingHorizontal: 14, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Text style={{ color: '#142F4D', fontSize: 11, fontWeight: 700 }}>Cancel</Text></Pressable>
                </View>
              </View>
            )}
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

          {/* CONTENT — switches between Dashboard, School Configuration, Subjects & Classes, Students, and Assessment Configuration */}
          {active === 'School Configuration' ? (
            <SchoolConfigScreen search={search} show={show} />
          ) : active === 'Subjects & Classes' ? (
            <SubjectsAndClassesScreen search={search} show={show} />
          ) : active === 'Students' ? (
            <StudentsScreen search={search} show={show} />
          ) : active === 'Assessment Configuration' ? (
            <AssessmentConfigScreen search={search} show={show} />
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
