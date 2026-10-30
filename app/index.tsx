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
  Trophy, GripVertical, SlidersHorizontal, Mail, Phone, KeyRound, Briefcase,
  FileSpreadsheet, Upload, ArrowRight as ArrowRightIcon, RefreshCw, Download,
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
  const [reportCardModal, setReportCardModal] = useState(false);
  const [generateModal, setGenerateModal] = useState(false);

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
                  <Pressable onPress={() => setReportCardModal(true)} style={{ minHeight: 32, paddingHorizontal: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, backgroundColor: '#FFFFFF' }}>
                    <FileText size={15} color="#274968" /><Text style={{ color: '#274968', fontSize: 9, fontWeight: '600' }}>View Report Card</Text>
                  </Pressable>
                  <Pressable onPress={() => setGenerateModal(true)} style={{ minHeight: 32, paddingHorizontal: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, backgroundColor: '#FFFFFF' }}>
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

      {/* View Report Card Modal — full report card preview */}
      {selectedStudent && (
        <Modal visible={reportCardModal} transparent animationType="fade" onRequestClose={() => setReportCardModal(false)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(6,28,40,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => setReportCardModal(false)}>
            <View style={{ width: '100%', maxWidth: 600, maxHeight: '90%', backgroundColor: '#FFFFFF', borderRadius: 10, overflow: 'hidden' }} onPress={(e: any) => e.stopPropagation()}>
              {/* Action bar */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2EAF0', backgroundColor: '#FAFCFD' }}>
                <Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800' }}>Report Card — {selectedStudent.name}</Text>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                  <Pressable onPress={() => show(`PDF download requested for ${selectedStudent.name} (demo)`, 'info')} style={{ width: 30, height: 30, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Download size={14} color="#274968" /></Pressable>
                  <Pressable onPress={() => show(`Print requested for ${selectedStudent.name} (demo)`, 'info')} style={{ width: 30, height: 30, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Printer size={14} color="#274968" /></Pressable>
                  <Pressable onPress={() => setReportCardModal(false)} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}><X size={16} color="#59728F" /></Pressable>
                </View>
              </View>

              <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                {/* School header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 14, borderBottomWidth: 2, borderBottomColor: '#00372D' }}>
                  <Svg width={42} height={47} viewBox="0 0 64 72"><Path d="M7 8 L32 3 L57 8 L56 42 Q52 58 32 68 Q12 58 8 42 Z" fill="none" stroke="#075340" strokeWidth="3.2" /><Path d="M13 13 L32 9 L51 13 L50 41 Q46 53 32 61 Q18 53 14 41 Z" fill="none" stroke="#075340" strokeWidth="1.3" /><Path d="M21 23 L28 18 L32 25 L36 18 L43 23 L39 31 L44 42 L37 42 L32 34 L27 42 L20 42 L25 31 Z" fill="#075340" /><Circle cx="32" cy="15" r="2" fill="#075340" /></Svg>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#00372D', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 }}>Akoka Federal Academy</Text>
                    <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 2 }}>12 Akoka Road, Yaba, Lagos</Text>
                    <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 1 }}>Excellence · Discipline · Success</Text>
                  </View>
                  <View style={{ backgroundColor: '#00372D', borderRadius: 6, paddingHorizontal: 9, paddingVertical: 4 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '800' }}>TERMLY REPORT</Text>
                  </View>
                </View>

                {/* Student info */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, padding: 10, backgroundColor: '#F8FAFC', borderRadius: 6, borderWidth: 1, borderColor: '#E3EAF0' }}>
                  {[['Student Name', selectedStudent.name], ['Admission No.', selectedStudent.admission], ['Class & Arm', selectedStudent.classArm], ['Session', selectedStudent.session], ['Term', 'Second Term'], ['Gender', selectedStudent.gender]].map(([label, value]: any) => (
                    <View key={label} style={{ flexBasis: '47%', flexGrow: 1, minWidth: 130 }}>
                      <Text style={{ color: '#647F9E', fontSize: 8, fontWeight: '700' }}>{label.toUpperCase()}</Text>
                      <Text style={{ color: '#142F4D', fontSize: 11, fontWeight: '700', marginTop: 2 }}>{value}</Text>
                    </View>
                  ))}
                </View>

                {/* Subject scores table */}
                <View style={{ marginTop: 12, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, overflow: 'hidden' }}>
                  <View style={{ flexDirection: 'row', backgroundColor: '#00372D', paddingVertical: 8 }}>
                    {['Subject', 'CA /40', 'Exam /60', 'Total /100', 'Grade', 'Remark'].map((h, i) => (
                      <Text key={h} style={{ flex: [2, 0.9, 0.9, 1, 0.7, 1.3][i], color: '#FFFFFF', fontSize: 9, fontWeight: '800', textAlign: i === 0 || i === 5 ? 'left' : 'center', paddingHorizontal: 6 }}>{h}</Text>
                    ))}
                  </View>
                  {REPORT_CARD_SUBJECTS.map((s, i) => {
                    const [gbg, gfg] = GRADE_COLORS[s.grade] || ['#E2EAF0', '#334F6E'];
                    return (
                      <View key={s.subject} style={{ flexDirection: 'row', paddingVertical: 9, backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#E8EEF3' }}>
                        <Text numberOfLines={1} style={{ flex: 2, color: '#142F4D', fontSize: 10, fontWeight: '600', paddingHorizontal: 6 }}>{s.subject}</Text>
                        <Text style={{ flex: 0.9, color: '#244361', fontSize: 10, textAlign: 'center' }}>{s.ca}</Text>
                        <Text style={{ flex: 0.9, color: '#244361', fontSize: 10, textAlign: 'center' }}>{s.exam}</Text>
                        <Text style={{ flex: 1, color: '#142F4D', fontSize: 11, fontWeight: '800', textAlign: 'center' }}>{s.total}</Text>
                        <View style={{ flex: 0.7, alignItems: 'center' }}><View style={{ backgroundColor: gbg, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 }}><Text style={{ color: gfg, fontSize: 9, fontWeight: '800' }}>{s.grade}</Text></View></View>
                        <Text numberOfLines={1} style={{ flex: 1.3, color: '#244361', fontSize: 9, paddingHorizontal: 6 }}>{s.remark}</Text>
                      </View>
                    );
                  })}
                  <View style={{ flexDirection: 'row', paddingVertical: 10, backgroundColor: '#F0F7F4', borderTopWidth: 2, borderTopColor: '#08765F' }}>
                    <Text style={{ flex: 2, color: '#00372D', fontSize: 10, fontWeight: '800', paddingHorizontal: 6 }}>TOTAL</Text>
                    <Text style={{ flex: 0.9, color: '#08754F', fontSize: 10, fontWeight: '800', textAlign: 'center' }}>268</Text>
                    <Text style={{ flex: 0.9, color: '#08754F', fontSize: 10, fontWeight: '800', textAlign: 'center' }}>395</Text>
                    <Text style={{ flex: 1, color: '#08754F', fontSize: 11, fontWeight: '800', textAlign: 'center' }}>663</Text>
                    <Text style={{ flex: 0.7 }} />
                    <Text style={{ flex: 1.3, color: '#647F9E', fontSize: 9, paddingHorizontal: 6 }}>Out of 800</Text>
                  </View>
                </View>

                {/* Summary stats */}
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  {[['Overall Average', '83.4%'], ['Subjects Offered', '8'], ['Class Position', '3rd of 14']].map(([label, value]: any) => (
                    <View key={label} style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, backgroundColor: '#FAFCFD', alignItems: 'center' }}>
                      <Text style={{ color: '#647F9E', fontSize: 9, fontWeight: '700' }}>{label.toUpperCase()}</Text>
                      <Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800', marginTop: 4 }}>{value}</Text>
                    </View>
                  ))}
                </View>

                {/* Teacher's + Principal's comments */}
                <View style={{ marginTop: 12 }}>
                  <Text style={{ color: '#00372D', fontSize: 11, fontWeight: '800', marginBottom: 5 }}>Class Teacher's Comment</Text>
                  <View style={{ borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, padding: 10, backgroundColor: '#FAFCFD', marginBottom: 10 }}>
                    <Text style={{ color: '#244361', fontSize: 10, lineHeight: 15, fontStyle: 'italic' }}>"A diligent and respectful student. {selectedStudent.name.split(' ')[0]} has shown consistent improvement this term and participates actively in class discussions. Keep up the excellent work."</Text>
                    <Text style={{ color: '#647F9E', fontSize: 9, marginTop: 6 }}>— Mrs. O. Bello (Form Teacher, {selectedStudent.classArm})</Text>
                  </View>
                  <Text style={{ color: '#00372D', fontSize: 11, fontWeight: '800', marginBottom: 5 }}>Principal's Comment</Text>
                  <View style={{ borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, padding: 10, backgroundColor: '#FAFCFD' }}>
                    <Text style={{ color: '#244361', fontSize: 10, lineHeight: 15, fontStyle: 'italic' }}>"An impressive performance this term. We look forward to continued excellence in the coming session."</Text>
                    <Text style={{ color: '#647F9E', fontSize: 9, marginTop: 6 }}>— Mr. A. Adeyemi (Principal)</Text>
                  </View>
                </View>
              </ScrollView>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E2EAF0' }}>
                <Pressable onPress={() => setReportCardModal(false)} style={{ paddingHorizontal: 16, paddingVertical: 9, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}><Text style={{ color: '#274968', fontSize: 11, fontWeight: '700' }}>Close</Text></Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Generate Report Card Modal */}
      {selectedStudent && (
        <Modal visible={generateModal} transparent animationType="fade" onRequestClose={() => setGenerateModal(false)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(6,28,40,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => setGenerateModal(false)}>
            <View style={{ width: '100%', maxWidth: 460, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 22 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' }}>
                <View><Text style={{ color: '#142F4D', fontSize: 16, fontWeight: '800' }}>Generate Report Card</Text><Text style={{ color: '#647F9E', fontSize: 11, marginTop: 3 }}>Create a printable report card for {selectedStudent.name}.</Text></View>
                <Pressable onPress={() => setGenerateModal(false)}><X size={19} color="#41698F" /></Pressable>
              </View>
              <View style={{ borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 6, padding: 12, marginBottom: 14, backgroundColor: '#F8FAFC' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: STU_TONES[selectedStudent.tone]?.[0] || '#DFF5E9', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: STU_TONES[selectedStudent.tone]?.[1] || '#075B46', fontSize: 14, fontWeight: '800' }}>{selectedStudent.initials}</Text></View>
                  <View><Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '700' }}>{selectedStudent.name}</Text><Text style={{ color: '#647F9E', fontSize: 10, marginTop: 2 }}>{selectedStudent.admission} · {selectedStudent.classArm}</Text></View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderWidth: 1, borderColor: '#FFE1B5', backgroundColor: '#FFF7E6', borderRadius: 6, marginBottom: 14 }}>
                <AlertCircle size={15} color="#D58A13" />
                <Text style={{ color: '#6B5A3F', fontSize: 10, flex: 1, lineHeight: 14 }}>Generation compiles verified scores for {selectedStudent.name} for Second Term 2024/2025 into a print-ready PDF. This is a demo — no real PDF will be produced. Wire to the Report Cards screen + PDF service for production.</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                <Pressable onPress={() => setGenerateModal(false)} style={{ minHeight: 35, paddingHorizontal: 16, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Text style={{ color: '#274968', fontSize: 11, fontWeight: '700' }}>Cancel</Text></Pressable>
                <Pressable onPress={() => { setGenerateModal(false); setReportCardModal(true); show(`Report card generated for ${selectedStudent.name} (demo)`, 'success'); }} style={{ minHeight: 35, paddingHorizontal: 16, backgroundColor: '#00513D', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 7 }}><Printer size={14} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Generate & Preview</Text></Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
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

// === USERS & PERMISSIONS DATA ===
const INITIAL_USERS = [
  { id: '1', initials: 'AJ', name: 'Adebayo Johnson', email: 'adebayo.johnson@akoka.edu.ng', phone: '0803 456 7890', role: 'Administrator', classes: '—', subjects: '—', status: 'Active', tone: 'green', gender: 'Male', dateJoined: 'Jan 5, 2024', activity: [['User login from 192.168.1.10', '2 hours ago'], ['Permissions updated for 3 users', '1 day ago'], ['New administrator account created', '3 days ago']] as [string, string][] },
  { id: '2', initials: 'GO', name: 'Mrs. Grace Okafor', email: 'grace.okafor@akoka.edu.ng', phone: '0806 123 4567', role: 'Form Teacher', classes: 'JSS1A', subjects: 'Mathematics, English Language', status: 'Active', tone: 'blue', gender: 'Female', dateJoined: 'Aug 12, 2024', activity: [['JSS1A attendance submitted', '3 hours ago'], ['Mathematics Test 1 scores uploaded', '1 day ago'], ['Class report generated', '4 days ago']] as [string, string][] },
  { id: '3', initials: 'EI', name: 'Emmanuel Ibe', email: 'emmanuel.ibe@akoka.edu.ng', phone: '0812 345 6789', role: 'Subject Teacher', classes: 'SS1B, SS2B', subjects: 'Physics, Chemistry', status: 'Active', tone: 'purple', gender: 'Male', dateJoined: 'Sep 3, 2024', activity: [['SS1B Physics Test 1 verified', '5 hours ago'], ['Chemistry scores compiled', '2 days ago']] as [string, string][] },
  { id: '4', initials: 'BA', name: 'Blessing Adekunle', email: 'blessing.adekunle@akoka.edu.ng', phone: '0703 987 6543', role: 'Subject Teacher', classes: 'JSS3A, SS3A', subjects: 'Biology, Agricultural Science', status: 'Active', tone: 'orange', gender: 'Female', dateJoined: 'Sep 5, 2024', activity: [['SS3A Biology practical uploaded', '6 hours ago'], ['Agric Science project graded', '3 days ago']] as [string, string][] },
  { id: '5', initials: 'ST', name: 'Samuel Tunde', email: 'samuel.tunde@akoka.edu.ng', phone: '0809 111 2233', role: 'Form Teacher', classes: 'SS2A', subjects: '—', status: 'Active', tone: 'blue', gender: 'Male', dateJoined: 'Aug 22, 2024', activity: [['SS2A attendance submitted', '1 hour ago'], ['Parent meeting notes uploaded', '2 days ago']] as [string, string][] },
  { id: '6', initials: 'OL', name: 'Oluwaseun Lawal', email: 'lawal.oluwaseun@akoka.edu.ng', phone: '0814 555 6677', role: 'Subject Teacher', classes: 'SS1A, SS1B', subjects: 'English Language, Literature-in-English', status: 'Active', tone: 'purple', gender: 'Male', dateJoined: 'Sep 8, 2024', activity: [['Literature essay graded', '4 hours ago'], ['SS1B English Test 1 uploaded', '1 day ago']] as [string, string][] },
  { id: '7', initials: 'FH', name: 'Fatima Hashim', email: 'fatima.hashim@akoka.edu.ng', phone: '0706 222 3344', role: 'Subject Teacher', classes: 'JSS2B, JSS3B', subjects: 'Civic Education, Government', status: 'Active', tone: 'orange', gender: 'Female', dateJoined: 'Sep 10, 2024', activity: [['JSS3B Civic Ed scores uploaded', '7 hours ago'], ['Government assignment graded', '5 days ago']] as [string, string][] },
  { id: '8', initials: 'AB', name: 'Ahmed Bello', email: 'ahmed.bello@akoka.edu.ng', phone: '0807 888 9999', role: 'Exam Officer', classes: '—', subjects: '—', status: 'Active', tone: 'green', gender: 'Male', dateJoined: 'Jul 1, 2024', activity: [['Exam schedule published', '1 day ago'], ['Question papers reviewed', '1 week ago']] as [string, string][] },
  { id: '9', initials: 'ZM', name: 'Zainab Musa', email: 'zainab.musa@akoka.edu.ng', phone: '0815 666 7788', role: 'Librarian', classes: '—', subjects: '—', status: 'Active', tone: 'blue', gender: 'Female', dateJoined: 'Oct 15, 2024', activity: [['Library inventory updated', '2 days ago'], ['New textbooks catalogued', '1 week ago']] as [string, string][] },
  { id: '10', initials: 'IK', name: 'Ibrahim Kanu', email: 'ibrahim.kanu@akoka.edu.ng', phone: '0708 444 5566', role: 'ICT Support', classes: '—', subjects: '—', status: 'Inactive', tone: 'purple', gender: 'Male', dateJoined: 'Mar 20, 2024', activity: [['Account deactivated', '2 weeks ago'], ['Last login from 192.168.1.45', '3 weeks ago']] as [string, string][] },
];

const ROLE_BADGE: Record<string, [string, string]> = {
  'Administrator': ['#FFE1E1', '#D92E32'],
  'Form Teacher': ['#DFF5E9', '#08754F'],
  'Subject Teacher': ['#E0ECFF', '#176DDA'],
  'Exam Officer': ['#FFF0D4', '#C27A08'],
  'Librarian': ['#EFE3FF', '#6E35D4'],
  'ICT Support': ['#E2EAF0', '#334F6E'],
};

const USER_TONES: Record<string, [string, string]> = {
  green: ['#DFF5E9', '#075B46'], blue: ['#DCE9FF', '#2467D1'],
  purple: ['#EBDDFF', '#6E35D4'], orange: ['#FFF0D4', '#B8790B'],
};

// === USERS & PERMISSIONS SCREEN ===
function UsersPermissionsScreen({ search: globalSearch, show }: { search: string; show: (msg: string, type?: string) => void }) {
  const { width } = useWindowDimensions();
  const compact = width < 1180;
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selectedId, setSelectedId] = useState<string | null>('2');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<'Assignments' | 'Activity Log'>('Assignments');
  const [assignmentType, setAssignmentType] = useState<'Form Teacher' | 'Subject Teacher'>('Form Teacher');
  const [assignmentDraft, setAssignmentDraft] = useState({ className: '', arm: '', subject: '' });
  const [assignments, setAssignments] = useState<{ type: string; label: string }[]>([
    { type: 'Form Teacher', label: 'JSS1A — Form Teacher' },
    { type: 'Subject Teacher', label: 'Mathematics — JSS1A' },
    { type: 'Subject Teacher', label: 'English Language — JSS1A' },
  ]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [rowActions, setRowActions] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [addForm, setAddForm] = useState<any>({ name: '', email: '', phone: '', role: 'Subject Teacher', gender: 'Male', status: 'Active' });

  const selectedUser = users.find(u => u.id === selectedId) || null;
  const effectiveSearch = (search || globalSearch).trim().toLowerCase();
  const roles = ['All Roles', 'Administrator', 'Form Teacher', 'Subject Teacher', 'Exam Officer', 'Librarian', 'ICT Support'];
  const statuses = ['All Statuses', 'Active', 'Inactive'];

  const filtered = useMemo(() => users.filter(u => {
    const matchesSearch = !effectiveSearch || [u.name, u.email, u.phone].some(v => v.toLowerCase().includes(effectiveSearch));
    const matchesRole = roleFilter === 'All Roles' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All Statuses' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  }), [users, effectiveSearch, roleFilter, statusFilter]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function saveAssignment() {
    if (!assignmentDraft.className || !assignmentDraft.arm) { show('Class and Arm are required', 'error'); return; }
    if (assignmentType === 'Subject Teacher' && !assignmentDraft.subject) { show('Subject is required for Subject Teacher assignments', 'error'); return; }
    const label = assignmentType === 'Form Teacher'
      ? `${assignmentDraft.className}${assignmentDraft.arm} — Form Teacher`
      : `${assignmentDraft.subject} — ${assignmentDraft.className}${assignmentDraft.arm}`;
    setAssignments(curr => [...curr, { type: assignmentType, label }]);
    setAssignmentDraft({ className: '', arm: '', subject: '' });
    show('Assignment added', 'success');
  }

  function saveAddUser() {
    if (!addForm.name?.trim() || !addForm.email?.trim()) { show('Name and email are required', 'error'); return; }
    const initials = addForm.name.trim().split(/\s+/).slice(0, 2).map((p: string) => p[0]).join('').toUpperCase();
    const user = { ...addForm, id: String(Date.now()), initials, classes: '—', subjects: '—', tone: 'green', dateJoined: 'Just now', activity: [['Account created', 'just now']] as [string, string][] };
    setUsers(curr => [user, ...curr]);
    setAddModal(false);
    setAddForm({ name: '', email: '', phone: '', role: 'Subject Teacher', gender: 'Male', status: 'Active' });
    setSelectedId(user.id);
    show(`${user.name} added`, 'success');
  }

  function saveEditUser() {
    if (!editForm.name?.trim()) { show('Name is required', 'error'); return; }
    setUsers(curr => curr.map(u => u.id === selectedUser!.id ? { ...u, ...editForm } : u));
    setEditModal(false);
    show('User updated', 'success');
  }

  function toggleUserStatus(id: string) {
    setUsers(curr => curr.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
    setRowActions(null);
    show('User status updated', 'info');
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', minHeight: 0 }}>
      <ScrollView style={{ flex: 1, minWidth: 0 }} contentContainerStyle={{ padding: 24, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {/* Page header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 18, flexWrap: 'wrap' }}>
          <View style={{ flex: 1, minWidth: 280 }}>
            <Text style={{ color: '#064333', fontSize: 26, fontWeight: '800', letterSpacing: -0.3 }}>Users & Permissions</Text>
            <Text style={{ color: '#647F9E', fontSize: 13, marginTop: 5 }}>Manage school staff, teaching assignments, and account roles.</Text>
          </View>
          <Pressable onPress={() => setAddModal(true)} style={{ backgroundColor: '#00513D', borderRadius: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 37, paddingHorizontal: 15 }}>
            <Plus size={16} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Add User</Text>
          </Pressable>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          {[['Total Users', '18', '↑ 2 new this term', 'green', Users], ['Active Users', '16', '↑ 1 new this term', 'blue', UserRound], ['Teachers', '12', '↑ 1 new this term', 'purple', GraduationCap], ['Administrators', '2', '— No change', 'orange', Shield]].map(([label, value, change, tone, Ic]: any) => {
            const [bg, fg] = USER_TONES[tone] || USER_TONES.green;
            return (
              <View key={label} style={{ flex: 1, minWidth: 200, minHeight: 110, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, padding: 17, flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}><Ic size={24} color={fg} /></View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ color: '#244361', fontSize: 11, fontWeight: '600' }}>{label}</Text>
                  <Text style={{ color: '#142F4D', fontSize: 24, fontWeight: '800', marginTop: 4 }}>{value}</Text>
                  <Text style={{ color: '#08754F', fontSize: 10, fontWeight: '600', marginTop: 6 }}>{change}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Directory card */}
        <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, padding: 14 }}>
          {/* Filters */}
          <View style={{ flexDirection: 'row', gap: 9, marginBottom: 10, flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: 200, height: 36, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, backgroundColor: '#FFFFFF' }}>
              <Search size={16} color="#8299B1" />
              <TextInput value={search} onChangeText={v => { setSearch(v); setPage(1); }} placeholder="Search by name, email or phone..." placeholderTextColor="#8097B0" style={{ flex: 1, fontSize: 11, color: '#142F4D', padding: 0 }} />
            </View>
            <Pressable onPress={() => { setRoleFilter(roles[(roles.indexOf(roleFilter) + 1) % roles.length]); setPage(1); }} style={{ minHeight: 36, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}>
              <Text style={{ color: '#244361', fontSize: 11, fontWeight: '600' }}>{roleFilter}</Text><ChevronDown size={15} color="#41698F" />
            </Pressable>
            <Pressable onPress={() => { setStatusFilter(statuses[(statuses.indexOf(statusFilter) + 1) % statuses.length]); setPage(1); }} style={{ minHeight: 36, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}>
              <Text style={{ color: '#244361', fontSize: 11, fontWeight: '600' }}>{statusFilter}</Text><ChevronDown size={15} color="#41698F" />
            </Pressable>
          </View>

          {/* Filter chips */}
          <View style={{ flexDirection: 'row', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
            {roles.map(item => (
              <Pressable key={item} onPress={() => { setRoleFilter(item); setPage(1); }} style={{ paddingHorizontal: 9, paddingVertical: 5, borderRadius: 5, borderWidth: 1, borderColor: roleFilter === item ? '#B8E3D0' : '#DCE6EE', backgroundColor: roleFilter === item ? '#E2F4EC' : 'transparent' }}>
                <Text style={{ fontSize: 10, fontWeight: roleFilter === item ? '700' : '500', color: roleFilter === item ? '#075B46' : '#41698F' }}>{item}</Text>
              </Pressable>
            ))}
          </View>

          {/* Table */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: 1000 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 38, paddingHorizontal: 10, backgroundColor: '#F0F3F6', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                {['Name', 'Email', 'Phone', 'Role', 'Classes', 'Subjects', 'Status', ''].map((h, i) => (
                  <Text key={h} style={{ width: [180, 200, 110, 130, 100, 160, 80, 38][i], fontSize: 10, fontWeight: '800', color: '#244361', paddingRight: 5 }}>{h}</Text>
                ))}
              </View>
              {visible.map(u => {
                const [bg, fg] = USER_TONES[u.tone] || USER_TONES.green;
                const [rbg, rfg] = ROLE_BADGE[u.role] || ['#E2EAF0', '#334F6E'];
                return (
                  <Pressable key={u.id} onPress={() => setSelectedId(u.id)} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 49, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#E8EEF3', backgroundColor: selectedId === u.id ? '#E4F6ED' : 'transparent' }}>
                    <View style={{ width: 180, flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 8 }}>
                      <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Text style={{ color: fg, fontSize: 12, fontWeight: '800' }}>{u.initials}</Text></View>
                      <Text numberOfLines={1} style={{ color: '#142F4D', fontSize: 11, fontWeight: '700', flexShrink: 1 }}>{u.name}</Text>
                    </View>
                    <Text numberOfLines={1} style={{ width: 200, fontSize: 10, color: '#244361', paddingRight: 5 }}>{u.email}</Text>
                    <Text style={{ width: 110, fontSize: 10, color: '#244361', paddingRight: 5 }}>{u.phone}</Text>
                    <View style={{ width: 130 }}><View style={{ backgroundColor: rbg, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3, alignSelf: 'flex-start' }}><Text style={{ color: rfg, fontSize: 9, fontWeight: '700' }}>{u.role}</Text></View></View>
                    <Text numberOfLines={1} style={{ width: 100, fontSize: 10, color: '#244361', paddingRight: 5 }}>{u.classes}</Text>
                    <Text numberOfLines={1} style={{ width: 160, fontSize: 10, color: '#244361', paddingRight: 5 }}>{u.subjects}</Text>
                    <View style={{ width: 80 }}><View style={{ backgroundColor: u.status === 'Active' ? '#D7F3E5' : '#FFE5E5', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' }}><Text style={{ color: u.status === 'Active' ? '#075B46' : '#D92E32', fontSize: 9, fontWeight: '700' }}>{u.status}</Text></View></View>
                    <Pressable onPress={() => setRowActions(rowActions === u.id ? null : u.id)} style={{ width: 38, alignItems: 'center' }}>
                      <MoreVertical size={17} color="#41698F" />
                      {rowActions === u.id && (
                        <View style={{ position: 'absolute', top: 30, right: 0, width: 150, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, zIndex: 100, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}>
                          {[['View', () => { setSelectedId(u.id); setRowActions(null); }], ['Edit', () => { setEditForm({ ...u }); setEditModal(true); setRowActions(null); }], [u.status === 'Active' ? 'Deactivate' : 'Activate', () => toggleUserStatus(u.id)]].map(([label, action]: any) => (
                            <Pressable key={label} onPress={action} style={{ paddingHorizontal: 12, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#E8EEF3' }}>
                              <Text style={{ color: '#244361', fontSize: 11, fontWeight: '500' }}>{label}</Text>
                            </Pressable>
                          ))}
                        </View>
                      )}
                    </Pressable>
                  </Pressable>
                );
              })}
              {!visible.length && <View style={{ padding: 24, alignItems: 'center' }}><Text style={{ color: '#647F9E', fontSize: 12 }}>No users match your filters.</Text></View>}
            </View>
          </ScrollView>

          {/* Pagination */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 12 }}>
            <Text style={{ color: '#647F9E', fontSize: 10 }}>Showing {filtered.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length || 18} users</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Pressable onPress={() => setPage(Math.max(1, safePage - 1))} style={{ minWidth: 28, height: 29, paddingHorizontal: 6, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><ChevronLeft size={16} color="#41698F" /></Pressable>
              {Array.from({ length: Math.min(2, pageCount) }, (_, i) => i + 1).map(number => (
                <Pressable key={number} onPress={() => setPage(number)} style={{ minWidth: 28, height: 29, paddingHorizontal: 6, borderWidth: 1, borderColor: safePage === number ? '#006044' : '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: safePage === number ? '#006044' : '#FFFFFF' }}>
                  <Text style={{ color: safePage === number ? '#FFFFFF' : '#41698F', fontSize: 11, fontWeight: safePage === number ? '800' : '500' }}>{number}</Text>
                </Pressable>
              ))}
              <Pressable onPress={() => setPage(Math.min(pageCount, safePage + 1))} style={{ minWidth: 28, height: 29, paddingHorizontal: 6, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><ChevronRight size={16} color="#41698F" /></Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Right details panel */}
      {!compact && (
        <View style={{ width: 378, borderLeftWidth: 2, borderLeftColor: '#D5E0E8', backgroundColor: '#F8FAFC', padding: 16 }}>
          <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7 }} contentContainerStyle={{ paddingBottom: 14 }} showsVerticalScrollIndicator={false}>
            {!selectedUser ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', padding: 30, gap: 10 }}>
                <Users size={34} color="#9BAEC0" />
                <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '700' }}>Select a user</Text>
                <Text style={{ color: '#647F9E', fontSize: 11, textAlign: 'center' }}>Choose a user from the directory to view their details.</Text>
              </View>
            ) : (
              <>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' }}>
                  <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: USER_TONES[selectedUser.tone]?.[0] || '#DFF5E9', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: USER_TONES[selectedUser.tone]?.[1] || '#075B46', fontSize: 17, fontWeight: '800' }}>{selectedUser.initials}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                      <Text numberOfLines={1} style={{ color: '#142F4D', fontSize: 14, fontWeight: '800', maxWidth: 175 }}>{selectedUser.name}</Text>
                      <View style={{ backgroundColor: ROLE_BADGE[selectedUser.role]?.[0] || '#E2EAF0', borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3 }}><Text style={{ color: ROLE_BADGE[selectedUser.role]?.[1] || '#334F6E', fontSize: 9, fontWeight: '700' }}>{selectedUser.role}</Text></View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 }}><Mail size={11} color="#647F9E" /><Text numberOfLines={1} style={{ color: '#647F9E', fontSize: 10 }}>{selectedUser.email}</Text></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 }}><Phone size={11} color="#647F9E" /><Text style={{ color: '#647F9E', fontSize: 10 }}>{selectedUser.phone}</Text></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 8 }}>
                      <View style={{ backgroundColor: selectedUser.status === 'Active' ? '#D7F3E5' : '#FFE5E5', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ color: selectedUser.status === 'Active' ? '#075B46' : '#D92E32', fontSize: 9, fontWeight: '700' }}>{selectedUser.status}</Text></View>
                    </View>
                  </View>
                  <Pressable onPress={() => setSelectedId(null)}><X size={19} color="#59728F" /></Pressable>
                </View>

                {/* Action buttons */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingBottom: 12, flexWrap: 'wrap' }}>
                  <Pressable onPress={() => { setEditForm({ ...selectedUser }); setEditModal(true); }} style={{ minHeight: 32, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: '#00513D', borderRadius: 5 }}>
                    <Pencil size={13} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '700' }}>Edit User</Text>
                  </Pressable>
                  <Pressable onPress={() => setProfileModal(true)} style={{ minHeight: 32, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, backgroundColor: '#FFFFFF' }}>
                    <Eye size={13} color="#274968" /><Text style={{ color: '#274968', fontSize: 9, fontWeight: '600' }}>View Profile</Text>
                  </Pressable>
                  <Pressable onPress={() => setResetConfirm(true)} style={{ minHeight: 32, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: '#FFC6C8', borderRadius: 5, backgroundColor: '#FFFFFF' }}>
                    <KeyRound size={13} color="#D92E32" /><Text style={{ color: '#D92E32', fontSize: 9, fontWeight: '600' }}>Reset Password</Text>
                  </Pressable>
                </View>

                {/* Basic Information */}
                <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 9, borderTopWidth: 1, borderTopColor: '#E7EDF2' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 }}><UserIcon size={19} color="#244361" /><Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800' }}>Basic Information</Text></View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    {[['Full Name', selectedUser.name], ['Role', selectedUser.role], ['Email', selectedUser.email], ['Gender', selectedUser.gender], ['Phone', selectedUser.phone], ['Date Joined', selectedUser.dateJoined]].map(([label, value]: any) => (
                      <View key={label} style={{ flexBasis: '47%', flexGrow: 1, minWidth: 130 }}>
                        <Text style={{ color: '#647F9E', fontSize: 9, fontWeight: '700', marginBottom: 3 }}>{label.toUpperCase()}</Text>
                        <Text numberOfLines={1} style={{ color: '#244361', fontSize: 11, fontWeight: '600' }}>{value}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Assigned Classes */}
                <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 9, borderTopWidth: 1, borderTopColor: '#E7EDF2' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 }}>
                    <GraduationCap size={19} color="#244361" /><Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800' }}>Assigned Classes</Text>
                    <View style={{ backgroundColor: '#DFF5E9', borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3 }}><Text style={{ color: '#075B46', fontSize: 9, fontWeight: '700' }}>{selectedUser.classes === '—' ? '0' : selectedUser.classes.split(',').length} classes</Text></View>
                  </View>
                  {selectedUser.classes === '—' ? <Text style={{ color: '#647F9E', fontSize: 11 }}>No classes assigned</Text> : (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {selectedUser.classes.split(', ').map((c: string) => (
                        <View key={c} style={{ backgroundColor: '#E2F4EC', borderWidth: 1, borderColor: '#B8E3D0', borderRadius: 14, paddingHorizontal: 11, paddingVertical: 5 }}><Text style={{ color: '#075B46', fontSize: 10, fontWeight: '700' }}>{c}</Text></View>
                      ))}
                    </View>
                  )}
                </View>

                {/* Assigned Subjects */}
                <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 9, borderTopWidth: 1, borderTopColor: '#E7EDF2' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 }}>
                    <BookOpen size={19} color="#244361" /><Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800' }}>Assigned Subjects</Text>
                    <View style={{ backgroundColor: '#E0ECFF', borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3 }}><Text style={{ color: '#176DDA', fontSize: 9, fontWeight: '700' }}>{selectedUser.subjects === '—' ? '0' : selectedUser.subjects.split(',').length} subjects</Text></View>
                  </View>
                  {selectedUser.subjects === '—' ? <Text style={{ color: '#647F9E', fontSize: 11 }}>No subjects assigned</Text> : (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {selectedUser.subjects.split(', ').map((s: string) => (
                        <View key={s} style={{ backgroundColor: '#E0ECFF', borderWidth: 1, borderColor: '#B8CFE3', borderRadius: 14, paddingHorizontal: 11, paddingVertical: 5 }}><Text style={{ color: '#176DDA', fontSize: 10, fontWeight: '700' }}>{s}</Text></View>
                      ))}
                    </View>
                  )}
                </View>

                {/* Tabs */}
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DCE6EE', paddingHorizontal: 12, marginTop: 4 }}>
                  {(['Assignments', 'Activity Log'] as const).map(t => (
                    <Pressable key={t} onPress={() => setTab(t)} style={{ minWidth: 110, paddingVertical: 11, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: tab === t ? '#08765F' : 'transparent' }}>
                      <Text style={{ color: tab === t ? '#08765F' : '#647F9E', fontSize: 11, fontWeight: 700 }}>{t}</Text>
                    </Pressable>
                  ))}
                </View>

                {/* Tab content */}
                <View style={{ paddingHorizontal: 12, paddingTop: 14, paddingBottom: 9 }}>
                  {tab === 'Assignments' ? (
                    <View>
                      {/* Existing assignments list */}
                      <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800', marginBottom: 9 }}>Current Assignments</Text>
                      <View style={{ borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 6, marginBottom: 14 }}>
                        {assignments.length ? assignments.map((a, i) => (
                          <View key={i} style={{ minHeight: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, borderBottomWidth: i < assignments.length - 1 ? 1 : 0, borderBottomColor: '#EEF2F5' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <View style={{ width: 26, height: 26, borderRadius: 6, backgroundColor: a.type === 'Form Teacher' ? '#DFF5E9' : '#E0ECFF', alignItems: 'center', justifyContent: 'center' }}>
                                <Briefcase size={13} color={a.type === 'Form Teacher' ? '#075B46' : '#176DDA'} />
                              </View>
                              <Text style={{ color: '#244361', fontSize: 11, fontWeight: '500' }}>{a.label}</Text>
                            </View>
                            <Pressable onPress={() => setAssignments(curr => curr.filter((_, idx) => idx !== i))}><X size={14} color="#647F9E" /></Pressable>
                          </View>
                        )) : <Text style={{ padding: 14, color: '#647F9E', fontSize: 11 }}>No assignments yet.</Text>}
                      </View>

                      {/* Add assignment form */}
                      <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800', marginBottom: 9 }}>Add Assignment</Text>
                      <View style={{ borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 6, padding: 12 }}>
                        {/* Assignment type */}
                        <Text style={{ color: '#244361', fontSize: 10, fontWeight: '700', marginBottom: 6 }}>Assignment Type</Text>
                        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
                          {(['Form Teacher', 'Subject Teacher'] as const).map(t => (
                            <Pressable key={t} onPress={() => setAssignmentType(t)} style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: assignmentType === t ? '#0B765B' : '#DCE6EE', borderRadius: 5, backgroundColor: assignmentType === t ? '#E2F4EC' : 'transparent' }}>
                              <Text style={{ color: assignmentType === t ? '#075B46' : '#41698F', fontSize: 10, fontWeight: assignmentType === t ? '700' : '500' }}>{t === 'Form Teacher' ? 'Form Teacher (Class Arm)' : 'Subject Teacher (Subject + Class)'}</Text>
                            </Pressable>
                          ))}
                        </View>
                        {/* Class dropdown */}
                        <View style={{ marginBottom: 10 }}>
                          <Text style={{ color: '#244361', fontSize: 10, fontWeight: '700', marginBottom: 5 }}>Class *</Text>
                          <Pressable onPress={() => { const opts = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3']; const cur = assignmentDraft.className; setAssignmentDraft((d: any) => ({ ...d, className: opts[(opts.indexOf(cur) + 1) % opts.length] })); }} style={{ minHeight: 36, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                            <Text style={{ color: '#142F4D', fontSize: 11 }}>{assignmentDraft.className || 'Select class'}</Text>
                            <ChevronDown size={14} color="#647F9E" />
                          </Pressable>
                        </View>
                        {/* Arm dropdown */}
                        <View style={{ marginBottom: 10 }}>
                          <Text style={{ color: '#244361', fontSize: 10, fontWeight: '700', marginBottom: 5 }}>Arm *</Text>
                          <Pressable onPress={() => { const opts = ['A', 'B', 'C']; const cur = assignmentDraft.arm; setAssignmentDraft((d: any) => ({ ...d, arm: opts[(opts.indexOf(cur) + 1) % opts.length] })); }} style={{ minHeight: 36, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                            <Text style={{ color: '#142F4D', fontSize: 11 }}>{assignmentDraft.arm || 'Select arm'}</Text>
                            <ChevronDown size={14} color="#647F9E" />
                          </Pressable>
                        </View>
                        {/* Subject dropdown (only for Subject Teacher) */}
                        {assignmentType === 'Subject Teacher' && (
                          <View style={{ marginBottom: 12 }}>
                            <Text style={{ color: '#244361', fontSize: 10, fontWeight: '700', marginBottom: 5 }}>Subject (optional for Form Teacher)</Text>
                            <Pressable onPress={() => { const opts = ['Mathematics', 'English Language', 'Biology', 'Chemistry', 'Physics', 'Civic Education']; const cur = assignmentDraft.subject; setAssignmentDraft((d: any) => ({ ...d, subject: opts[(opts.indexOf(cur) + 1) % opts.length] })); }} style={{ minHeight: 36, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                              <Text style={{ color: '#142F4D', fontSize: 11 }}>{assignmentDraft.subject || 'Select subject'}</Text>
                              <ChevronDown size={14} color="#647F9E" />
                            </Pressable>
                          </View>
                        )}
                        {/* Buttons */}
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <Pressable onPress={() => setAssignmentDraft({ className: '', arm: '', subject: '' })} style={{ flex: 1, minHeight: 32, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                            <Text style={{ color: '#244361', fontSize: 10, fontWeight: '700' }}>Cancel</Text>
                          </Pressable>
                          <Pressable onPress={saveAssignment} style={{ flex: 1, minHeight: 32, backgroundColor: '#00513D', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>Save Assignment</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800', marginBottom: 9 }}>Recent Activity</Text>
                      {selectedUser.activity.map(([title, time]: any, index: number) => (
                        <View key={title} style={{ minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <View style={{ width: 13, alignItems: 'center' }}>{index === 0 && <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#08765F' }} />}</View>
                          <Text style={{ color: '#244361', fontSize: 11, flex: 1 }}>{title}</Text>
                          <Text style={{ color: '#647F9E', fontSize: 9 }}>{time}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      )}

      {/* Add User Modal */}
      <Modal visible={addModal} transparent animationType="fade" onRequestClose={() => setAddModal(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(6,28,40,0.45)', justifyContent: 'center', alignItems: 'center', padding: 18 }} onPress={() => setAddModal(false)}>
          <View style={{ width: '100%', maxWidth: 520, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' }}>
              <Text style={{ color: '#142F4D', fontSize: 17, fontWeight: '800' }}>Add User</Text>
              <Pressable onPress={() => setAddModal(false)}><X size={19} color="#41698F" /></Pressable>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {[['name', 'Full Name', 'e.g. Mrs. Grace Okafor'], ['email', 'Email', 'user@akoka.edu.ng'], ['phone', 'Phone', '0803 456 7890']].map(([key, label, placeholder]: any) => (
                <View key={key} style={{ width: '100%' }}>
                  <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>{label}</Text>
                  <TextInput value={addForm[key] || ''} onChangeText={v => setAddForm((c: any) => ({ ...c, [key]: v }))} placeholder={placeholder} placeholderTextColor="#93A4B6" style={{ height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, color: '#142F4D', fontSize: 12 }} />
                </View>
              ))}
              <View style={{ width: '48%', flexGrow: 1, minWidth: 200 }}>
                <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Role</Text>
                <Pressable onPress={() => { const opts = ['Administrator', 'Form Teacher', 'Subject Teacher', 'Exam Officer', 'Librarian', 'ICT Support']; const cur = addForm.role; setAddForm((c: any) => ({ ...c, role: opts[(opts.indexOf(cur) + 1) % opts.length] })); }} style={{ height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                  <Text style={{ color: '#142F4D', fontSize: 12 }}>{addForm.role}</Text><ChevronDown size={14} color="#647F9E" />
                </Pressable>
              </View>
              <View style={{ width: '48%', flexGrow: 1, minWidth: 200 }}>
                <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Gender</Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {['Male', 'Female'].map(value => (
                    <Pressable key={value} onPress={() => setAddForm((c: any) => ({ ...c, gender: value }))} style={{ paddingHorizontal: 10, paddingVertical: 9, borderWidth: 1, borderColor: addForm.gender === value ? '#0B765B' : '#DCE6EE', borderRadius: 5, backgroundColor: addForm.gender === value ? '#E2F4EC' : 'transparent' }}>
                      <Text style={{ color: addForm.gender === value ? '#075B46' : '#41698F', fontSize: 10, fontWeight: addForm.gender === value ? '700' : '500' }}>{value}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View style={{ width: '100%' }}>
                <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Status</Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {['Active', 'Inactive'].map(value => (
                    <Pressable key={value} onPress={() => setAddForm((c: any) => ({ ...c, status: value }))} style={{ paddingHorizontal: 10, paddingVertical: 9, borderWidth: 1, borderColor: addForm.status === value ? '#0B765B' : '#DCE6EE', borderRadius: 5, backgroundColor: addForm.status === value ? '#E2F4EC' : 'transparent' }}>
                      <Text style={{ color: addForm.status === value ? '#075B46' : '#41698F', fontSize: 10, fontWeight: addForm.status === value ? '700' : '500' }}>{value}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingTop: 14, marginTop: 14, borderTopWidth: 1, borderTopColor: '#E2EAF0' }}>
              <Pressable onPress={() => setAddModal(false)} style={{ minHeight: 35, paddingHorizontal: 16, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Text style={{ color: '#274968', fontSize: 11, fontWeight: '700' }}>Cancel</Text></Pressable>
              <Pressable onPress={saveAddUser} style={{ minHeight: 35, paddingHorizontal: 16, backgroundColor: '#00513D', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Add User</Text></Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Edit User Modal */}
      <Modal visible={editModal} transparent animationType="fade" onRequestClose={() => setEditModal(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(6,28,40,0.45)', justifyContent: 'center', alignItems: 'center', padding: 18 }} onPress={() => setEditModal(false)}>
          <View style={{ width: '100%', maxWidth: 520, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' }}>
              <Text style={{ color: '#142F4D', fontSize: 17, fontWeight: '800' }}>Edit User</Text>
              <Pressable onPress={() => setEditModal(false)}><X size={19} color="#41698F" /></Pressable>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {[['name', 'Full Name'], ['email', 'Email'], ['phone', 'Phone']].map(([key, label]: any) => (
                <View key={key} style={{ width: '100%' }}>
                  <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>{label}</Text>
                  <TextInput value={editForm[key] || ''} onChangeText={v => setEditForm((c: any) => ({ ...c, [key]: v }))} style={{ height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, color: '#142F4D', fontSize: 12 }} />
                </View>
              ))}
              <View style={{ width: '48%', flexGrow: 1, minWidth: 200 }}>
                <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Role</Text>
                <Pressable onPress={() => { const opts = ['Administrator', 'Form Teacher', 'Subject Teacher', 'Exam Officer', 'Librarian', 'ICT Support']; const cur = editForm.role; setEditForm((c: any) => ({ ...c, role: opts[(opts.indexOf(cur) + 1) % opts.length] })); }} style={{ height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                  <Text style={{ color: '#142F4D', fontSize: 12 }}>{editForm.role}</Text><ChevronDown size={14} color="#647F9E" />
                </Pressable>
              </View>
              <View style={{ width: '48%', flexGrow: 1, minWidth: 200 }}>
                <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Status</Text>
                <Pressable onPress={() => setEditForm((c: any) => ({ ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' }))} style={{ height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                  <Text style={{ color: '#142F4D', fontSize: 12 }}>{editForm.status}</Text><ChevronDown size={14} color="#647F9E" />
                </Pressable>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingTop: 14, marginTop: 14, borderTopWidth: 1, borderTopColor: '#E2EAF0' }}>
              <Pressable onPress={() => setEditModal(false)} style={{ minHeight: 35, paddingHorizontal: 16, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Text style={{ color: '#274968', fontSize: 11, fontWeight: '700' }}>Cancel</Text></Pressable>
              <Pressable onPress={saveEditUser} style={{ minHeight: 35, paddingHorizontal: 16, backgroundColor: '#00513D', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Save Changes</Text></Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Reset Password Confirmation */}
      <Modal visible={resetConfirm} transparent animationType="fade" onRequestClose={() => setResetConfirm(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(6,28,40,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => setResetConfirm(false)}>
          <View style={{ width: '100%', maxWidth: 420, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 22 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFF9F8', borderWidth: 1, borderColor: '#FFC6C8', alignItems: 'center', justifyContent: 'center' }}><KeyRound size={18} color="#D92E32" /></View>
              <Text style={{ color: '#142F4D', fontSize: 16, fontWeight: '800' }}>Reset Password?</Text>
            </View>
            <Text style={{ color: '#647F9E', fontSize: 12, lineHeight: 18 }}>This will send a password reset link to <Text style={{ fontWeight: '700', color: '#213B57' }}>{selectedUser?.email}</Text>. The user will be required to set a new password on next login. This is a UI-only placeholder — connect your authentication backend to enable real resets.</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <Pressable onPress={() => setResetConfirm(false)} style={{ paddingHorizontal: 15, paddingVertical: 9, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}><Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700' }}>Cancel</Text></Pressable>
              <Pressable onPress={() => { setResetConfirm(false); show(`Password reset link sent to ${selectedUser?.email} (UI placeholder)`, 'info'); }} style={{ backgroundColor: '#D92E32', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 15, paddingVertical: 9 }}><KeyRound size={14} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Send Reset Link</Text></Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* View Profile Modal */}
      {selectedUser && (
        <Modal visible={profileModal} transparent animationType="fade" onRequestClose={() => setProfileModal(false)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(6,28,40,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => setProfileModal(false)}>
            <View style={{ width: '100%', maxWidth: 540, maxHeight: '90%', backgroundColor: '#FFFFFF', borderRadius: 10, overflow: 'hidden' }} onPress={(e: any) => e.stopPropagation()}>
              {/* Header banner */}
              <View style={{ backgroundColor: '#00372D', padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: USER_TONES[selectedUser.tone]?.[0] || '#DFF5E9', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' }}>
                  <Text style={{ color: USER_TONES[selectedUser.tone]?.[1] || '#075B46', fontSize: 19, fontWeight: '800' }}>{selectedUser.initials}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '800' }} numberOfLines={1}>{selectedUser.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 }}>
                    <View style={{ backgroundColor: ROLE_BADGE[selectedUser.role]?.[0] || '#E2EAF0', borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3 }}><Text style={{ color: ROLE_BADGE[selectedUser.role]?.[1] || '#334F6E', fontSize: 9, fontWeight: '700' }}>{selectedUser.role}</Text></View>
                    <View style={{ backgroundColor: selectedUser.status === 'Active' ? '#D7F3E5' : '#FFE5E5', borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3 }}><Text style={{ color: selectedUser.status === 'Active' ? '#075B46' : '#D92E32', fontSize: 9, fontWeight: '700' }}>{selectedUser.status}</Text></View>
                  </View>
                </View>
                <Pressable onPress={() => setProfileModal(false)}><X size={20} color="#FFFFFF" /></Pressable>
              </View>

              <ScrollView contentContainerStyle={{ padding: 18 }} showsVerticalScrollIndicator={false}>
                {/* Contact */}
                <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800', marginBottom: 8 }}>Contact Information</Text>
                <View style={{ borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 6, padding: 12, marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 }}>
                    <Mail size={14} color="#647F9E" />
                    <Text style={{ color: '#244361', fontSize: 11, flex: 1 }}>{selectedUser.email}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 }}>
                    <Phone size={14} color="#647F9E" />
                    <Text style={{ color: '#244361', fontSize: 11, flex: 1 }}>{selectedUser.phone}</Text>
                  </View>
                </View>

                {/* Personal */}
                <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800', marginBottom: 8 }}>Personal Information</Text>
                <View style={{ borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 6, marginBottom: 16 }}>
                  {[['Full Name', selectedUser.name], ['Role', selectedUser.role], ['Gender', selectedUser.gender], ['Date Joined', selectedUser.dateJoined]].map(([l, v]: any, i: number) => (
                    <View key={l} style={{ flexDirection: 'row', paddingVertical: 9, paddingHorizontal: 12, borderBottomWidth: i < 3 ? 1 : 0, borderBottomColor: '#E8EEF3' }}>
                      <Text style={{ flex: 1, color: '#647F9E', fontSize: 11 }}>{l}</Text>
                      <Text style={{ flex: 1.3, color: '#244361', fontSize: 11, fontWeight: '600' }}>{v}</Text>
                    </View>
                  ))}
                </View>

                {/* Assignments */}
                <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800', marginBottom: 8 }}>Class & Subject Assignments</Text>
                <View style={{ borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 6, padding: 12, marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ color: '#647F9E', fontSize: 10, fontWeight: '700' }}>CLASSES</Text>
                    <View style={{ backgroundColor: '#DFF5E9', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}><Text style={{ color: '#075B46', fontSize: 9, fontWeight: '700' }}>{selectedUser.classes === '—' ? '0' : selectedUser.classes.split(',').length} assigned</Text></View>
                  </View>
                  {selectedUser.classes === '—' ? <Text style={{ color: '#647F9E', fontSize: 11, marginBottom: 12 }}>No classes assigned</Text> : (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                      {selectedUser.classes.split(', ').map((c: string) => (
                        <View key={c} style={{ backgroundColor: '#E2F4EC', borderWidth: 1, borderColor: '#B8E3D0', borderRadius: 14, paddingHorizontal: 11, paddingVertical: 5 }}><Text style={{ color: '#075B46', fontSize: 10, fontWeight: '700' }}>{c}</Text></View>
                      ))}
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ color: '#647F9E', fontSize: 10, fontWeight: '700' }}>SUBJECTS</Text>
                    <View style={{ backgroundColor: '#E0ECFF', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}><Text style={{ color: '#176DDA', fontSize: 9, fontWeight: '700' }}>{selectedUser.subjects === '—' ? '0' : selectedUser.subjects.split(',').length} assigned</Text></View>
                  </View>
                  {selectedUser.subjects === '—' ? <Text style={{ color: '#647F9E', fontSize: 11 }}>No subjects assigned</Text> : (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {selectedUser.subjects.split(', ').map((s: string) => (
                        <View key={s} style={{ backgroundColor: '#E0ECFF', borderWidth: 1, borderColor: '#B8CFE3', borderRadius: 14, paddingHorizontal: 11, paddingVertical: 5 }}><Text style={{ color: '#176DDA', fontSize: 10, fontWeight: '700' }}>{s}</Text></View>
                      ))}
                    </View>
                  )}
                </View>

                {/* Recent Activity */}
                <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800', marginBottom: 8 }}>Recent Activity</Text>
                <View style={{ borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 6, padding: 12 }}>
                  {selectedUser.activity.map(([title, time]: any, i: number) => (
                    <View key={i} style={{ minHeight: 28, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={{ width: 13, alignItems: 'center' }}>{i === 0 && <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#08765F' }} />}</View>
                      <Text style={{ color: '#244361', fontSize: 11, flex: 1 }}>{title}</Text>
                      <Text style={{ color: '#647F9E', fontSize: 9 }}>{time}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* Footer */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingHorizontal: 18, paddingVertical: 13, borderTopWidth: 1, borderTopColor: '#E2EAF0' }}>
                <Pressable onPress={() => setProfileModal(false)} style={{ paddingHorizontal: 16, paddingVertical: 9, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}><Text style={{ color: '#274968', fontSize: 11, fontWeight: '700' }}>Close</Text></Pressable>
                <Pressable onPress={() => { setProfileModal(false); setEditForm({ ...selectedUser }); setEditModal(true); }} style={{ backgroundColor: '#00513D', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9 }}><Pencil size={13} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Edit User</Text></Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

// === UPLOAD RESULTS DATA ===
const UPLOAD_HISTORY = [
  { id: '1', batch: 'JSS1A_Maths_T2_2025', sourceType: 'Excel/CSV', classArm: 'JSS1A', subject: 'Mathematics', uploadedBy: 'Tunde Balogun', date: 'Aug 24, 2025 10:32 AM', records: 42, status: 'Under Review' },
  { id: '2', batch: 'SS2B_Eng_T2_2025', sourceType: 'PDF', classArm: 'SS2B', subject: 'English Language', uploadedBy: 'Adebayo Johnson', date: 'Aug 23, 2025 04:17 PM', records: 38, status: 'Draft' },
  { id: '3', batch: 'JSS3A_Sci_T2_2025', sourceType: 'Excel/CSV', classArm: 'JSS3A', subject: 'Biology', uploadedBy: 'Emmanuel Ibe', date: 'Aug 22, 2025 11:45 AM', records: 36, status: 'Verified' },
  { id: '4', batch: 'SS1B_Comp_T2_2025', sourceType: 'PDF', classArm: 'SS1B', subject: 'Computer Studies', uploadedBy: 'Grace Okafor', date: 'Aug 21, 2025 02:20 PM', records: 41, status: 'Rejected' },
  { id: '5', batch: 'JSS2A_Eng_T2_2025', sourceType: 'Excel/CSV', classArm: 'JSS2A', subject: 'English Language', uploadedBy: 'Blessing Adekunle', date: 'Aug 20, 2025 09:15 AM', records: 40, status: 'Under Review' },
  { id: '6', batch: 'SS3C_Gov_T2_2025', sourceType: 'Excel/CSV', classArm: 'SS3C', subject: 'Government', uploadedBy: 'Fatima Hashim', date: 'Aug 18, 2025 03:42 PM', records: 37, status: 'Verified' },
];

const UPLOAD_STATUS_COLORS: Record<string, [string, string]> = {
  'Under Review': ['#FFF0D4', '#C27A08'],
  'Draft': ['#E0ECFF', '#176DDA'],
  'Verified': ['#D9F4E6', '#08754F'],
  'Rejected': ['#FFE1E1', '#D92E32'],
};

// === UPLOAD RESULTS SCREEN ===
function UploadResultsScreen({ search: globalSearch, show }: { search: string; show: (msg: string, type?: string) => void }) {
  const { width } = useWindowDimensions();
  const compact = width < 1100;
  const [step, setStep] = useState(1);
  const [sourceType, setSourceType] = useState<'Excel/CSV' | 'PDF'>('Excel/CSV');
  const [session, setSession] = useState('2024/2025');
  const [term, setTerm] = useState('Second Term');
  const [classArm, setClassArm] = useState('JSS1A');
  const [subject, setSubject] = useState('Mathematics');
  const [assessmentConfig, setAssessmentConfig] = useState('JSS1 - Mathematics (40/60)');
  const [selectedFile, setSelectedFile] = useState<{ name: string; sizeKB: number } | null>(null);
  const [validationMsg, setValidationMsg] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [page, setPage] = useState(1);
  const [viewUpload, setViewUpload] = useState<any>(null);
  const [rowActions, setRowActions] = useState<string | null>(null);

  const sessions = ['2024/2025', '2025/2026'];
  const terms = ['First Term', 'Second Term', 'Third Term'];
  const classArms = ['JSS1A', 'JSS1B', 'JSS2A', 'JSS2B', 'JSS3A', 'SS1A', 'SS1B', 'SS2A', 'SS2B', 'SS3A', 'SS3B', 'SS3C'];
  const subjects = ['Mathematics', 'English Language', 'Biology', 'Chemistry', 'Physics', 'Computer Studies', 'Government', 'Civic Education'];
  const assessmentOptions = [`${classArm.split(/(\d+)/)[0]}${classArm.match(/\d+/)?.[0] || ''} - ${subject} (40/60)`];
  const sources = ['All Sources', 'Excel/CSV', 'PDF'];
  const statuses = ['All Statuses', 'Under Review', 'Draft', 'Verified', 'Rejected'];

  const effectiveSearch = (historySearch || globalSearch).trim().toLowerCase();
  const filteredHistory = useMemo(() => UPLOAD_HISTORY.filter(u => {
    const matchesSearch = !effectiveSearch || [u.batch, u.sourceType, u.classArm, u.subject, u.uploadedBy, u.status].some(v => v.toLowerCase().includes(effectiveSearch));
    const matchesSource = sourceFilter === 'All Sources' || u.sourceType === sourceFilter;
    const matchesStatus = statusFilter === 'All Statuses' || u.status === statusFilter;
    return matchesSearch && matchesSource && matchesStatus;
  }), [effectiveSearch, sourceFilter, statusFilter]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filteredHistory.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleHistory = filteredHistory.slice((safePage - 1) * pageSize, safePage * pageSize);

  function resetWizard() {
    setStep(1);
    setSourceType('Excel/CSV');
    setSession('2024/2025');
    setTerm('Second Term');
    setClassArm('JSS1A');
    setSubject('Mathematics');
    setAssessmentConfig('JSS1 - Mathematics (40/60)');
    setSelectedFile(null);
    setValidationMsg('');
  }

  function pickFile() {
    // Demo file picker - simulates selecting a file (since this is a static web bundle, no real picker)
    const fakeFiles = sourceType === 'Excel/CSV'
      ? [{ name: 'JSS1A_Mathematics_T2_2025.xlsx', sizeKB: 245 }, { name: 'scores_export.csv', sizeKB: 89 }]
      : [{ name: 'Scanned_Results_JSS1A.pdf', sizeKB: 1840 }, { name: 'result_sheet_SS1B.pdf', sizeKB: 2210 }];
    const pick = fakeFiles[Math.floor(Math.random() * fakeFiles.length)];
    if (pick.sizeKB > 10240) { setValidationMsg('File exceeds 10 MB maximum size.'); return; }
    const expectedExts = sourceType === 'Excel/CSV' ? ['.xlsx', '.csv'] : ['.pdf'];
    const ext = '.' + pick.name.split('.').pop()?.toLowerCase();
    if (!expectedExts.includes(ext)) { setValidationMsg(`File type ${ext} is not supported for ${sourceType} source.`); return; }
    setSelectedFile(pick);
    setValidationMsg('');
  }

  function nextStep() {
    if (step === 1) {
      if (!selectedFile) { setValidationMsg('Please select a file to upload.'); return; }
      setValidationMsg('');
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  }

  function confirmUpload() {
    show(`Upload submitted for ${classArm} ${subject} — ${selectedFile?.name || 'no file'} (demo flow, not persisted to backend)`, 'info');
    resetWizard();
  }

  function clearFilters() {
    setHistorySearch('');
    setSourceFilter('All Sources');
    setStatusFilter('All Statuses');
    setPage(1);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 30, maxWidth: 1600, alignSelf: 'center', width: '100%' }} showsVerticalScrollIndicator={false}>
      {/* Page header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 15, marginBottom: 18, flexWrap: 'wrap' }}>
        <View style={{ flex: 1, minWidth: 280 }}>
          <Text style={{ color: '#064333', fontSize: 26, fontWeight: '800', letterSpacing: -0.3 }}>Upload Results</Text>
          <Text style={{ color: '#647F9E', fontSize: 13, marginTop: 5 }}>Import student scores from spreadsheets or scanned result sheets.</Text>
        </View>
        <Pressable onPress={resetWizard} style={{ backgroundColor: '#00513D', borderRadius: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 37, paddingHorizontal: 15 }}>
          <Plus size={16} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>New Upload</Text>
        </Pressable>
      </View>

      {/* Workflow stepper */}
      <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 8, padding: 18, marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          {[
            { num: 1, label: 'Select Source', desc: 'Choose file type and upload your file' },
            { num: 2, label: 'Preview & Edit', desc: 'Review data, fix errors, and map columns' },
            { num: 3, label: 'Confirm Upload', desc: 'Save and submit for verification' },
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <View style={{ flex: 1, alignItems: 'center', minWidth: 0 }}>
                <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: step === s.num ? '#00513D' : step > s.num ? '#08754F' : '#DCE6EE', alignItems: 'center', justifyContent: 'center', borderWidth: step === s.num ? 2 : 0, borderColor: '#9DD9BF' }}>
                  {step > s.num ? <Check size={18} color="#FFFFFF" /> : <Text style={{ color: step === s.num ? '#FFFFFF' : '#647F9E', fontSize: 15, fontWeight: '800' }}>{s.num}</Text>}
                </View>
                <Text style={{ color: step === s.num ? '#00513D' : step > s.num ? '#08754F' : '#647F9E', fontSize: 12, fontWeight: '800', marginTop: 8 }}>{s.label}</Text>
                <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 4, textAlign: 'center', lineHeight: 14 }}>{s.desc}</Text>
              </View>
              {i < 2 && <View style={{ height: 2, flex: 0.3, backgroundColor: step > s.num ? '#08754F' : '#DCE6EE', marginHorizontal: -4, marginBottom: 36 }} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Step 1: Select Source & Upload Details */}
      {step === 1 && (
        <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 8, padding: 18, marginBottom: 14 }}>
          <View style={{ flexDirection: compact ? 'column' : 'row', gap: 24 }}>
            {/* Left: Source selector */}
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800', marginBottom: 4 }}>Start New Upload</Text>
              <Text style={{ color: '#647F9E', fontSize: 11, marginBottom: 14 }}>Choose your source type and provide the required details.</Text>
              {/* Excel/CSV card */}
              <Pressable onPress={() => setSourceType('Excel/CSV')} style={{ borderWidth: 2, borderColor: sourceType === 'Excel/CSV' ? '#08754F' : '#DCE6EE', borderRadius: 8, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: sourceType === 'Excel/CSV' ? '#F0F8F4' : '#FFFFFF' }}>
                <View style={{ width: 44, height: 44, borderRadius: 11, backgroundColor: '#DFF5E9', alignItems: 'center', justifyContent: 'center' }}><FileSpreadsheet size={24} color="#08704F" /></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800' }}>Excel/CSV Spreadsheet</Text>
                  <Text style={{ color: '#647F9E', fontSize: 11, marginTop: 4 }}>Upload results from Excel or CSV files.</Text>
                </View>
                {sourceType === 'Excel/CSV' && <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#08754F', alignItems: 'center', justifyContent: 'center' }}><Check size={14} color="#FFFFFF" /></View>}
              </Pressable>
              {/* PDF card */}
              <Pressable onPress={() => setSourceType('PDF')} style={{ borderWidth: 2, borderColor: sourceType === 'PDF' ? '#08754F' : '#DCE6EE', borderRadius: 8, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: sourceType === 'PDF' ? '#F0F8F4' : '#FFFFFF' }}>
                <View style={{ width: 44, height: 44, borderRadius: 11, backgroundColor: '#FFE1E1', alignItems: 'center', justifyContent: 'center' }}><FileText size={24} color="#D92E32" /></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800' }}>Scanned PDF Result Sheet</Text>
                  <Text style={{ color: '#647F9E', fontSize: 11, marginTop: 4 }}>Upload scanned result sheets (PDF).</Text>
                </View>
                {sourceType === 'PDF' && <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#08754F', alignItems: 'center', justifyContent: 'center' }}><Check size={14} color="#FFFFFF" /></View>}
              </Pressable>
            </View>

            {/* Right: Upload details */}
            <View style={{ flex: 1.2, minWidth: 0 }}>
              <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800', marginBottom: 4 }}>Upload Details</Text>
              <Text style={{ color: '#647F9E', fontSize: 11, marginBottom: 14 }}>All fields are required</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {[
                  { label: 'Academic Session', value: session, setter: setSession, options: sessions },
                  { label: 'Term', value: term, setter: setTerm, options: terms },
                  { label: 'Class Arm', value: classArm, setter: setClassArm, options: classArms },
                  { label: 'Subject', value: subject, setter: setSubject, options: subjects },
                ].map(f => (
                  <View key={f.label} style={{ flexBasis: '47%', flexGrow: 1, minWidth: 200 }}>
                    <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>{f.label}</Text>
                    <Pressable onPress={() => f.setter(f.options[(f.options.indexOf(f.value) + 1) % f.options.length])} style={{ height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                      <Text style={{ color: '#142F4D', fontSize: 12 }}>{f.value}</Text>
                      <ChevronDown size={15} color="#647F9E" />
                    </Pressable>
                  </View>
                ))}
                <View style={{ flexBasis: '100%', flexGrow: 1 }}>
                  <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Assessment Configuration</Text>
                  <Pressable onPress={() => setAssessmentConfig(`${classArm.split(/(\d+)/)[0]}${classArm.match(/\d+/)?.[0] || ''} - ${subject} (40/60)`)} style={{ height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                    <Text style={{ color: '#142F4D', fontSize: 12 }}>{assessmentConfig}</Text>
                    <ChevronDown size={15} color="#647F9E" />
                  </Pressable>
                </View>
              </View>

              {/* File picker */}
              <Pressable onPress={pickFile} style={{ marginTop: 14, borderWidth: 2, borderStyle: 'dashed', borderColor: selectedFile ? '#08754F' : '#B8C7D5', borderRadius: 8, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: selectedFile ? '#F0F8F4' : '#FAFCFD' }}>
                {selectedFile ? (
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#DFF5E9', alignItems: 'center', justifyContent: 'center' }}>
                        {sourceType === 'Excel/CSV' ? <FileSpreadsheet size={22} color="#08704F" /> : <FileText size={22} color="#D92E32" />}
                      </View>
                      <View>
                        <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '700' }}>{selectedFile.name}</Text>
                        <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 3 }}>{(selectedFile.sizeKB / 1024).toFixed(2)} MB</Text>
                      </View>
                    </View>
                    <Pressable onPress={() => { setSelectedFile(null); setValidationMsg(''); }} style={{ marginTop: 6, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, backgroundColor: '#FFFFFF' }}>
                      <Text style={{ color: '#41698F', fontSize: 10, fontWeight: '600' }}>Remove file</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <CloudUpload size={36} color="#41698F" />
                    <Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '700' }}>Click to select file or drag and drop</Text>
                    <Text style={{ color: '#647F9E', fontSize: 11 }}>Supports: .xlsx, .csv, .pdf (Max 10MB)</Text>
                  </>
                )}
              </Pressable>
              {validationMsg && (
                <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderWidth: 1, borderColor: '#FFD1D5', backgroundColor: '#FFF0F1', borderRadius: 6 }}>
                  <AlertCircle size={15} color="#D92E32" />
                  <Text style={{ color: '#D92E32', fontSize: 11, fontWeight: '600' }}>{validationMsg}</Text>
                </View>
              )}

              {/* Buttons */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
                <Pressable onPress={resetWizard} style={{ minHeight: 35, paddingHorizontal: 16, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                  <Text style={{ color: '#274968', fontSize: 11, fontWeight: '700' }}>Cancel</Text>
                </Pressable>
                <Pressable onPress={nextStep} style={{ minHeight: 35, paddingHorizontal: 16, backgroundColor: '#00513D', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Next: Preview & Edit</Text>
                  <ArrowRightIcon size={14} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Step 2: Preview & Edit */}
      {step === 2 && (
        <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 8, padding: 18, marginBottom: 14 }}>
          <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800', marginBottom: 4 }}>Preview & Edit</Text>
          <Text style={{ color: '#647F9E', fontSize: 11, marginBottom: 14 }}>Review data, fix errors, and map columns before confirming.</Text>
          {/* Selected file summary */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, marginBottom: 14, backgroundColor: '#FAFCFD' }}>
            <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#DFF5E9', alignItems: 'center', justifyContent: 'center' }}>
              {sourceType === 'Excel/CSV' ? <FileSpreadsheet size={20} color="#08704F" /> : <FileText size={20} color="#D92E32" />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '700' }}>{selectedFile?.name}</Text>
              <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 3 }}>{(selectedFile!.sizeKB / 1024).toFixed(2)} MB · {sourceType}</Text>
            </View>
          </View>
          {/* Parser limitation notice */}
          {sourceType === 'PDF' ? (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderWidth: 1, borderColor: '#FFE1B5', backgroundColor: '#FFF7E6', borderRadius: 8 }}>
              <AlertCircle size={18} color="#D58A13" />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#8B5A00', fontSize: 12, fontWeight: '800' }}>PDF parsing not implemented</Text>
                <Text style={{ color: '#6B5A3F', fontSize: 11, marginTop: 4, lineHeight: 16 }}>This demo does not include OCR or PDF extraction. In production, integrate a PDF parser (e.g. pdf-parse) or OCR service to extract student scores from scanned result sheets.</Text>
              </View>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderWidth: 1, borderColor: '#DCE6EE', backgroundColor: '#FAFCFD', borderRadius: 8 }}>
              <AlertCircle size={18} color="#41698F" />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800' }}>Spreadsheet parser not wired</Text>
                <Text style={{ color: '#647F9E', fontSize: 11, marginTop: 4, lineHeight: 16 }}>Connect a parser (e.g. xlsx / papaparse) to display parsed rows and column-mapping controls here. No fake parsed data is shown.</Text>
              </View>
            </View>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 14 }}>
            <Pressable onPress={() => setStep(1)} style={{ minHeight: 35, paddingHorizontal: 16, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
              <Text style={{ color: '#274968', fontSize: 11, fontWeight: '700' }}>← Back to Source</Text>
            </Pressable>
            <Pressable onPress={nextStep} style={{ minHeight: 35, paddingHorizontal: 16, backgroundColor: '#00513D', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Continue to Confirm</Text>
              <ArrowRightIcon size={14} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      )}

      {/* Step 3: Confirm Upload */}
      {step === 3 && (
        <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 8, padding: 18, marginBottom: 14 }}>
          <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800', marginBottom: 4 }}>Confirm Upload</Text>
          <Text style={{ color: '#647F9E', fontSize: 11, marginBottom: 14 }}>Review the summary and submit for verification.</Text>
          <View style={{ borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6 }}>
            {[
              ['Academic Session', session],
              ['Term', term],
              ['Class Arm', classArm],
              ['Subject', subject],
              ['Assessment Configuration', assessmentConfig],
              ['File Name', selectedFile?.name || '—'],
              ['File Size', selectedFile ? `${(selectedFile.sizeKB / 1024).toFixed(2)} MB` : '—'],
              ['Source Type', sourceType],
            ].map(([label, value]: any, i: number) => (
              <View key={label} style={{ flexDirection: 'row', paddingVertical: 11, paddingHorizontal: 14, borderBottomWidth: i < 7 ? 1 : 0, borderBottomColor: '#E8EEF3' }}>
                <Text style={{ flex: 1, color: '#647F9E', fontSize: 11 }}>{label}</Text>
                <Text style={{ flex: 1.3, color: '#142F4D', fontSize: 11, fontWeight: '600' }}>{value}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 12, padding: 12, borderWidth: 1, borderColor: '#FFE1B5', backgroundColor: '#FFF7E6', borderRadius: 8 }}>
            <AlertCircle size={16} color="#D58A13" />
            <Text style={{ color: '#6B5A3F', fontSize: 11, flex: 1, lineHeight: 16 }}>Demo flow only — no records are persisted or submitted for verification. Wire the action to your upload API for production use.</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 14 }}>
            <Pressable onPress={() => setStep(2)} style={{ minHeight: 35, paddingHorizontal: 16, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
              <Text style={{ color: '#274968', fontSize: 11, fontWeight: '700' }}>← Back to Preview</Text>
            </Pressable>
            <Pressable onPress={confirmUpload} style={{ minHeight: 35, paddingHorizontal: 16, backgroundColor: '#00513D', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <CloudUpload size={14} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Submit Upload</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Upload History */}
      <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 8, padding: 14 }}>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ color: '#142F4D', fontSize: 16, fontWeight: '800' }}>Upload History</Text>
          <Text style={{ color: '#647F9E', fontSize: 11, marginTop: 4 }}>View and manage your uploaded result files. Uploaded data is reviewed before it becomes verified score data.</Text>
        </View>

        {/* Filters */}
        <View style={{ flexDirection: 'row', gap: 9, marginBottom: 10, flexWrap: 'wrap' }}>
          <View style={{ flex: 1, minWidth: 200, height: 36, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, backgroundColor: '#FFFFFF' }}>
            <Search size={16} color="#8299B1" />
            <TextInput value={historySearch} onChangeText={v => { setHistorySearch(v); setPage(1); }} placeholder="Search uploads..." placeholderTextColor="#8097B0" style={{ flex: 1, fontSize: 11, color: '#142F4D', padding: 0 }} />
          </View>
          <Pressable onPress={() => { setSourceFilter(sources[(sources.indexOf(sourceFilter) + 1) % sources.length]); setPage(1); }} style={{ minHeight: 36, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}>
            <Text style={{ color: '#244361', fontSize: 11, fontWeight: '600' }}>{sourceFilter}</Text><ChevronDown size={15} color="#41698F" />
          </Pressable>
          <Pressable onPress={() => { setStatusFilter(statuses[(statuses.indexOf(statusFilter) + 1) % statuses.length]); setPage(1); }} style={{ minHeight: 36, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}>
            <Text style={{ color: '#244361', fontSize: 11, fontWeight: '600' }}>{statusFilter}</Text><ChevronDown size={15} color="#41698F" />
          </Pressable>
          <Pressable onPress={clearFilters} style={{ minHeight: 36, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}>
            <RefreshCw size={14} color="#41698F" /><Text style={{ color: '#41698F', fontSize: 11, fontWeight: '600' }}>Clear Filters</Text>
          </Pressable>
        </View>

        {/* Table */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ minWidth: 1100 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 38, paddingHorizontal: 10, backgroundColor: '#F0F3F6', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
              {['Batch Name', 'Source', 'Class Arm', 'Subject', 'Uploaded By', 'Upload Date', 'Records', 'Status', 'Actions'].map((h, i) => (
                <Text key={h} style={{ width: [180, 100, 80, 130, 130, 145, 65, 100, 90][i], fontSize: 10, fontWeight: '800', color: '#244361', paddingRight: 5 }}>{h}</Text>
              ))}
            </View>
            {visibleHistory.map(u => {
              const [sbg, sfg] = UPLOAD_STATUS_COLORS[u.status] || ['#E2EAF0', '#334F6E'];
              return (
                <View key={u.id} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 46, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#E8EEF3' }}>
                  <Text numberOfLines={1} style={{ width: 180, fontSize: 11, fontWeight: '600', color: '#355779', paddingRight: 7 }}>{u.batch}</Text>
                  <View style={{ width: 100, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {u.sourceType === 'Excel/CSV' ? <FileSpreadsheet size={14} color="#08704F" /> : <FileText size={14} color="#D92E32" />}
                    <Text style={{ fontSize: 10, color: '#355779' }}>{u.sourceType}</Text>
                  </View>
                  <Text style={{ width: 80, fontSize: 10, color: '#355779', paddingRight: 5 }}>{u.classArm}</Text>
                  <Text numberOfLines={1} style={{ width: 130, fontSize: 10, color: '#355779', paddingRight: 5 }}>{u.subject}</Text>
                  <Text numberOfLines={1} style={{ width: 130, fontSize: 10, color: '#355779', paddingRight: 5 }}>{u.uploadedBy}</Text>
                  <Text style={{ width: 145, fontSize: 10, color: '#355779', paddingRight: 5 }}>{u.date}</Text>
                  <Text style={{ width: 65, fontSize: 10, color: '#355779', fontWeight: '700', paddingRight: 5 }}>{u.records}</Text>
                  <View style={{ width: 100 }}><View style={{ backgroundColor: sbg, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3, alignSelf: 'flex-start' }}><Text style={{ color: sfg, fontSize: 9, fontWeight: '700' }}>{u.status}</Text></View></View>
                  <View style={{ width: 90, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Pressable onPress={() => setViewUpload(u)} style={{ width: 28, height: 28, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Eye size={14} color="#274968" /></Pressable>
                    <Pressable onPress={() => setRowActions(rowActions === u.id ? null : u.id)} style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}><MoreVertical size={16} color="#41698F" /></Pressable>
                    {rowActions === u.id && (
                      <View style={{ position: 'absolute', top: 30, right: 0, width: 140, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, zIndex: 100, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}>
                        {[['View Details', () => { setViewUpload(u); setRowActions(null); }], ['Download', () => { show(`Download requested for ${u.batch} (demo only)`, 'info'); setRowActions(null); }], [u.status === 'Rejected' ? 'Resubmit' : 'Archive', () => { show(`${u.status === 'Rejected' ? 'Resubmit' : 'Archive'} requested for ${u.batch} (demo only)`, 'info'); setRowActions(null); }]].map(([label, action]: any) => (
                          <Pressable key={label} onPress={action} style={{ paddingHorizontal: 12, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#E8EEF3' }}>
                            <Text style={{ color: '#244361', fontSize: 11, fontWeight: '500' }}>{label}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
            {!visibleHistory.length && <View style={{ padding: 24, alignItems: 'center' }}><Text style={{ color: '#647F9E', fontSize: 12 }}>No uploads match your filters.</Text></View>}
          </View>
        </ScrollView>

        {/* Pagination */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 12 }}>
          <Text style={{ color: '#647F9E', fontSize: 10 }}>Showing {filteredHistory.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filteredHistory.length)} of {filteredHistory.length} uploads</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Pressable onPress={() => setPage(Math.max(1, safePage - 1))} style={{ minWidth: 28, height: 29, paddingHorizontal: 6, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><ChevronLeft size={16} color="#41698F" /></Pressable>
            {Array.from({ length: Math.min(3, pageCount) }, (_, i) => i + 1).map(p => (
              <Pressable key={p} onPress={() => setPage(p)} style={{ minWidth: 28, height: 29, paddingHorizontal: 6, borderWidth: 1, borderColor: safePage === p ? '#006044' : '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: safePage === p ? '#006044' : '#FFFFFF' }}>
                <Text style={{ color: safePage === p ? '#FFFFFF' : '#41698F', fontSize: 11, fontWeight: safePage === p ? '800' : '500' }}>{p}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setPage(Math.min(pageCount, safePage + 1))} style={{ minWidth: 28, height: 29, paddingHorizontal: 6, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><ChevronRight size={16} color="#41698F" /></Pressable>
          </View>
        </View>
      </View>

      {/* View Upload Modal */}
      {viewUpload && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setViewUpload(null)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(6,28,40,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => setViewUpload(null)}>
            <View style={{ width: '100%', maxWidth: 480, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 22 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' }}>
                <Text style={{ color: '#142F4D', fontSize: 17, fontWeight: '800' }}>Upload Details</Text>
                <Pressable onPress={() => setViewUpload(null)}><X size={19} color="#41698F" /></Pressable>
              </View>
              <View style={{ borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6 }}>
                {[
                  ['Batch Name', viewUpload.batch],
                  ['Source Type', viewUpload.sourceType],
                  ['Class Arm', viewUpload.classArm],
                  ['Subject', viewUpload.subject],
                  ['Uploaded By', viewUpload.uploadedBy],
                  ['Upload Date', viewUpload.date],
                  ['Records', String(viewUpload.records)],
                  ['Status', viewUpload.status],
                ].map(([label, value]: any, i: number) => (
                  <View key={label} style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: i < 7 ? 1 : 0, borderBottomColor: '#E8EEF3' }}>
                    <Text style={{ flex: 1, color: '#647F9E', fontSize: 11 }}>{label}</Text>
                    <Text style={{ flex: 1.3, color: '#142F4D', fontSize: 11, fontWeight: '600' }}>{value}</Text>
                  </View>
                ))}
              </View>
              <Pressable onPress={() => setViewUpload(null)} style={{ alignSelf: 'flex-end', marginTop: 16, minHeight: 35, paddingHorizontal: 16, backgroundColor: '#00513D', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Close</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}
    </ScrollView>
  );
}

// === REVIEW & COMPILE DATA ===
const REVIEW_BATCHES = [
  { id: '1', name: 'JSS1A_Maths_T2_2025', classArm: 'JSS1A', subject: 'Mathematics', source: 'Excel/CSV', uploadedBy: 'Tunde Balogun', date: 'Aug 24, 2025 10:32 AM', status: 'Under Review', total: 50, reviewed: 34, unmatched: 3, invalid: 2, uncertain: 6 },
  { id: '2', name: 'SS2B_Eng_T2_2025', classArm: 'SS2B', subject: 'English Language', source: 'PDF', uploadedBy: 'Adebayo Johnson', date: 'Aug 23, 2025 04:17 PM', status: 'Draft', total: 38, reviewed: 0, unmatched: 5, invalid: 4, uncertain: 2 },
  { id: '3', name: 'JSS3A_Sci_T2_2025', classArm: 'JSS3A', subject: 'Biology', source: 'Excel/CSV', uploadedBy: 'Emmanuel Ibe', date: 'Aug 22, 2025 11:45 AM', status: 'Verified', total: 36, reviewed: 36, unmatched: 0, invalid: 0, uncertain: 0 },
  { id: '4', name: 'SS1B_Comp_T2_2025', classArm: 'SS1B', subject: 'Computer Studies', source: 'PDF', uploadedBy: 'Grace Okafor', date: 'Aug 21, 2025 02:20 PM', status: 'Rejected', total: 41, reviewed: 12, unmatched: 8, invalid: 6, uncertain: 3 },
  { id: '5', name: 'JSS2A_Eng_T2_2025', classArm: 'JSS2A', subject: 'English Language', source: 'Excel/CSV', uploadedBy: 'Blessing Adekunle', date: 'Aug 20, 2025 09:15 AM', status: 'Draft', total: 40, reviewed: 0, unmatched: 2, invalid: 1, uncertain: 1 },
  { id: '6', name: 'SS3C_Gov_T2_2025', classArm: 'SS3C', subject: 'Government', source: 'Excel/CSV', uploadedBy: 'Fatima Hashim', date: 'Aug 18, 2025 03:42 PM', status: 'Under Review', total: 37, reviewed: 18, unmatched: 1, invalid: 1, uncertain: 2 },
];

const REVIEW_RECORDS = [
  { id: 'r1', name: 'Hajara Abubakar', admission: 'AK/2024/0012', initials: 'HA', tone: 'green', scores: { assgn: 5, t1: 5, t2: 5, prac: 5, proj: 20 }, exam: 58, total: 98, match: 'Matched', validation: 'Valid' },
  { id: 'r2', name: 'Chukwuemeka Okafor', admission: 'AK/2023/0084', initials: 'CO', tone: 'blue', scores: { assgn: 5, t1: 5, t2: 5, prac: 5, proj: 20 }, exam: 56, total: 96, match: 'Unmatched', validation: 'Valid' },
  { id: 'r3', name: 'Amina Ibrahim', admission: 'AK/2024/0031', initials: 'AI', tone: 'purple', scores: { assgn: 5, t1: 5, t2: 4, prac: 5, proj: 19 }, exam: 52, total: 90, match: 'Matched', validation: 'Invalid' },
  { id: 'r4', name: 'Oluwaseun Adeyemi', admission: 'AK/2022/0068', initials: 'OA', tone: 'blue', scores: { assgn: 5, t1: 5, t2: 5, prac: 5, proj: 20 }, exam: 60, total: 100, match: 'Matched', validation: 'Valid' },
  { id: 'r5', name: 'Ifeoma Nwosu', admission: 'AK/2023/0045', initials: 'IN', tone: 'purple', scores: { assgn: 5, t1: 5, t2: 5, prac: 5, proj: 20 }, exam: 48, total: 88, match: 'Matched', validation: 'Valid' },
  { id: 'r6', name: 'Abdulrahman Bello', admission: 'AK/2024/0076', initials: 'AB', tone: 'green', scores: { assgn: 5, t1: 5, t2: 5, prac: 5, proj: 20 }, exam: 54, total: 94, match: 'Matched', validation: 'Uncertain' },
  { id: 'r7', name: 'Zainab Yusuf', admission: 'AK/2023/0029', initials: 'ZY', tone: 'purple', scores: { assgn: 5, t1: 4, t2: 5, prac: 5, proj: 20 }, exam: 50, total: 89, match: 'Matched', validation: 'Valid' },
  { id: 'r8', name: 'Tunde Balogun', admission: 'AK/2024/0057', initials: 'TB', tone: 'blue', scores: { assgn: 5, t1: 5, t2: 5, prac: 5, proj: 20 }, exam: 55, total: 95, match: 'Matched', validation: 'Valid' },
  { id: 'r9', name: 'Fatima Hashim', admission: 'AK/2024/0061', initials: 'FH', tone: 'orange', scores: { assgn: 5, t1: 5, t2: 4, prac: 5, proj: 19 }, exam: 49, total: 87, match: 'Matched', validation: 'Invalid' },
  { id: 'r10', name: 'Ibrahim Musa', admission: 'AK/2023/0074', initials: 'IM', tone: 'green', scores: { assgn: 5, t1: 5, t2: 5, prac: 5, proj: 20 }, exam: 57, total: 97, match: 'Unmatched', validation: 'Valid' },
];

const MATCH_COLORS: Record<string, [string, string]> = {
  'Matched': ['#D7F3E5', '#075B46'],
  'Unmatched': ['#FFF0D4', '#C27A08'],
};
const VALIDATION_COLORS: Record<string, [string, string]> = {
  'Valid': ['#D9F4E6', '#08754F'],
  'Invalid': ['#FFE1E1', '#D92E32'],
  'Uncertain': ['#EFE3FF', '#6E35D4'],
};

// === REVIEW & COMPILE SCREEN ===
function ReviewCompileScreen({ search: globalSearch, show }: { search: string; show: (msg: string, type?: string) => void }) {
  const { width } = useWindowDimensions();
  const veryCompact = width < 900;
  const compact = width < 1400;
  const [batches, setBatches] = useState(REVIEW_BATCHS_INIT());
  const [selectedBatchId, setSelectedBatchId] = useState('1');
  const [records, setRecords] = useState(REVIEW_RECORDS);
  const [selectedRecordId, setSelectedRecordId] = useState('r2');
  const [batchSearch, setBatchSearch] = useState('');
  const [batchStatusFilter, setBatchStatusFilter] = useState('All Statuses');
  const [studentSearch, setStudentSearch] = useState('');
  const [matchFilter, setMatchFilter] = useState('All Match Statuses');
  const [sort, setSort] = useState('Student Name (A-Z)');
  const [selected, setSelected] = useState<string[]>([]);
  const [tab, setTab] = useState<'Details' | 'Scores' | 'Activity'>('Details');
  const [assignmentType, setAssignmentType] = useState<'Form Teacher' | 'Subject Teacher'>('Form Teacher');
  const [assignmentClass, setAssignmentClass] = useState('');
  const [assignmentSubject, setAssignmentSubject] = useState('');
  const [editRecord, setEditRecord] = useState<any>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [rejectConfirm, setRejectConfirm] = useState<any>(null);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);

  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const selectedRecord = records.find(r => r.id === selectedRecordId) || null;
  const batchStatuses = ['All Statuses', 'Under Review', 'Draft', 'Verified', 'Rejected'];
  const matchStatuses = ['All Match Statuses', 'Matched', 'Unmatched'];
  const sortOptions = ['Student Name (A-Z)', 'Student Name (Z-A)', 'Total (High-Low)', 'Total (Low-High)'];

  const effectiveBatchSearch = (batchSearch || globalSearch).trim().toLowerCase();
  const filteredBatches = useMemo(() => batches.filter(b => {
    const matchesSearch = !effectiveBatchSearch || `${b.name} ${b.classArm} ${b.subject} ${b.uploadedBy}`.toLowerCase().includes(effectiveBatchSearch);
    const matchesStatus = batchStatusFilter === 'All Statuses' || b.status === batchStatusFilter;
    return matchesSearch && matchesStatus;
  }), [batches, effectiveBatchSearch, batchStatusFilter]);

  const filteredRecords = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();
    let list = records.filter(r => {
      const matchesSearch = !q || `${r.name} ${r.admission}`.toLowerCase().includes(q);
      const matchesFilter = matchFilter === 'All Match Statuses' || r.match === matchFilter;
      return matchesSearch && matchesFilter;
    });
    if (sort === 'Student Name (A-Z)') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'Student Name (Z-A)') list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === 'Total (High-Low)') list = [...list].sort((a, b) => b.total - a.total);
    else if (sort === 'Total (Low-High)') list = [...list].sort((a, b) => a.total - b.total);
    return list;
  }, [records, studentSearch, matchFilter, sort]);

  const reviewedCount = records.length;
  const progressPct = selectedBatch.total ? Math.round((reviewedCount / selectedBatch.total) * 100) : 0;
  const hasBlockingIssues = selectedBatch.unmatched > 0 || selectedBatch.invalid > 0;

  function applySummaryFilter(type: 'unmatched' | 'invalid' | 'uncertain' | 'draft') {
    if (type === 'draft') { setBatchStatusFilter('Draft'); show('Filtered: Draft batches', 'info'); return; }
    setMatchFilter(type === 'unmatched' ? 'Unmatched' : 'All Match Statuses');
    show(`Focused on ${type} issues for ${selectedBatch.name}`, 'info');
  }

  function toggleSelect(id: string) {
    setSelected(curr => curr.includes(id) ? curr.filter(x => x !== id) : [...curr, id]);
  }
  function toggleSelectAll() {
    setSelected(curr => curr.length === filteredRecords.length ? [] : filteredRecords.map(r => r.id));
  }
  function applyBulk(action: string) {
    if (!selected.length) { show('No records selected', 'info'); setBulkOpen(false); return; }
    show(`${action} applied to ${selected.length} record(s) (demo only)`, 'info');
    setSelected([]);
    setBulkOpen(false);
  }

  function openEdit(r: any) {
    setEditRecord(r);
    setEditValues({ ...r.scores, exam: r.exam });
  }
  function saveEdit() {
    if (!editRecord) return;
    const assgn = Number(editValues.assgn || 0), t1 = Number(editValues.t1 || 0), t2 = Number(editValues.t2 || 0), prac = Number(editValues.prac || 0), proj = Number(editValues.proj || 0), exam = Number(editValues.exam || 0);
    if ([assgn, t1, t2, prac, proj].some(v => v < 0 || v > 10) || proj > 20 || exam > 60) { show('Score exceeds component maximum', 'error'); return; }
    const total = assgn + t1 + t2 + prac + proj + exam;
    setRecords(curr => curr.map(r => r.id === editRecord.id ? { ...r, scores: { assgn, t1, t2, prac, proj }, exam, total } : r));
    setEditRecord(null);
    show(`${editRecord.name} updated`, 'success');
  }

  function rejectBatch() {
    if (!rejectConfirm) return;
    setBatches(curr => curr.map(b => b.id === rejectConfirm.id ? { ...b, status: 'Rejected' } : b));
    show(`${rejectConfirm.name} rejected`, 'info');
    setRejectConfirm(null);
  }
  function saveDraft() {
    show(`${selectedBatch.name} draft saved (demo only — not persisted)`, 'info');
  }
  function confirmBatch() {
    if (hasBlockingIssues) { show('Cannot confirm — blocking issues remain', 'error'); return; }
    setBatches(curr => curr.map(b => b.id === selectedBatch.id ? { ...b, status: 'Verified', reviewed: b.total } : b));
    show(`${selectedBatch.name} confirmed for verification (demo only)`, 'success');
  }
  function removeRecord(id: string) {
    setRecords(curr => curr.filter(r => r.id !== id));
    if (selectedRecordId === id) setSelectedRecordId(records[0]?.id || null);
    show('Record removed', 'info');
    setRemoveConfirm(null);
  }
  function addAssignment() {
    if (!assignmentClass || (assignmentType === 'Subject Teacher' && !assignmentSubject)) { show('Class and Subject are required', 'error'); return; }
    show(`Assignment added: ${assignmentType} — ${assignmentClass}${assignmentType === 'Subject Teacher' ? ' / ' + assignmentSubject : ''} (demo only)`, 'success');
    setAssignmentClass(''); setAssignmentSubject('');
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', minHeight: 0 }}>
      <ScrollView style={{ flex: 1, minWidth: 0 }} contentContainerStyle={{ padding: 24, paddingBottom: 30, width: '100%' }} showsVerticalScrollIndicator={false}>
        {/* Page header */}
        <View style={{ marginBottom: 18 }}>
          <Text style={{ color: '#064333', fontSize: 26, fontWeight: '800', letterSpacing: -0.3 }}>Review & Compile</Text>
          <Text style={{ color: '#647F9E', fontSize: 13, marginTop: 5 }}>Review imported scores, correct errors, verify results, and prepare compilation.</Text>
        </View>

        {/* Summary cards */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          {[['Draft Records Awaiting Review', '42', 'From 6 batches', 'amber', FileText, () => applySummaryFilter('draft')],
            ['Unmatched Students', '12', 'Requires attention', 'blue', Users, () => applySummaryFilter('unmatched')],
            ['Invalid Scores', '8', 'Need correction', 'red', AlertCircle, () => applySummaryFilter('invalid')],
            ['Uncertain Values', '6', 'Needs verification', 'purple', AlertCircle, () => applySummaryFilter('uncertain')]].map(([label, value, sub, tone, Ic, action]: any) => {
            const tones: Record<string, [string, string]> = { amber: ['#FFF0D4', '#C27A08'], blue: ['#E0ECFF', '#176DDA'], red: ['#FFE1E1', '#D92E32'], purple: ['#EFE3FF', '#6E35D4'] };
            const [bg, fg] = tones[tone];
            return (
              <Pressable key={label} onPress={action} style={{ flex: 1, minWidth: 200, minHeight: 100, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}><Ic size={24} color={fg} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#647F9E', fontSize: 10, fontWeight: '600' }}>{label}</Text>
                  <Text style={{ color: '#142F4D', fontSize: 22, fontWeight: '800', marginTop: 4 }}>{value}</Text>
                  <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 4 }}>{sub}</Text>
                </View>
                <ChevronRight size={18} color="#9BAEC0" />
              </Pressable>
            );
          })}
        </View>

        {/* Workspace: batches + review */}
        <View style={{ flexDirection: veryCompact ? 'column' : 'row', gap: 14 }}>
          {/* Left: Batches panel */}
          <View style={{ width: veryCompact ? '100%' : 280, flexShrink: 0 }}>
            <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 8, padding: 12 }}>
              <Text style={{ color: '#142F4D', fontSize: 14, fontWeight: '800', marginBottom: 10 }}>Uploaded Batches</Text>
              <View style={{ flexDirection: 'row', gap: 7, marginBottom: 10 }}>
                <View style={{ flex: 1, height: 32, flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, paddingHorizontal: 8, backgroundColor: '#FFFFFF' }}>
                  <Search size={13} color="#8299B1" />
                  <TextInput value={batchSearch} onChangeText={setBatchSearch} placeholder="Search batches..." placeholderTextColor="#8097B0" style={{ flex: 1, fontSize: 10, color: '#142F4D', padding: 0 }} />
                </View>
                <Pressable onPress={() => setBatchStatusFilter(batchStatuses[(batchStatuses.indexOf(batchStatusFilter) + 1) % batchStatuses.length])} style={{ height: 32, paddingHorizontal: 9, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFFFFF' }}>
                  <Text numberOfLines={1} style={{ color: '#244361', fontSize: 10, fontWeight: '600', maxWidth: 75 }}>{batchStatusFilter}</Text><ChevronDown size={12} color="#647F9E" />
                </Pressable>
              </View>
              <ScrollView style={{ maxHeight: 480 }} showsVerticalScrollIndicator={false}>
                {filteredBatches.map(b => {
                  const [sbg, sfg] = UPLOAD_STATUS_COLORS[b.status] || ['#E2EAF0', '#334F6E'];
                  const isSel = b.id === selectedBatchId;
                  return (
                    <Pressable key={b.id} onPress={() => { setSelectedBatchId(b.id); setMatchFilter('All Match Statuses'); }} style={{ borderWidth: 1.5, borderColor: isSel ? '#08754F' : '#E3EAF0', borderRadius: 6, padding: 10, marginBottom: 7, backgroundColor: isSel ? '#F0F7F4' : '#FFFFFF' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text numberOfLines={1} style={{ color: '#142F4D', fontSize: 11, fontWeight: '700', flex: 1 }}>{b.name}</Text>
                        <View style={{ backgroundColor: sbg, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 }}><Text style={{ color: sfg, fontSize: 8, fontWeight: '700' }}>{b.status}</Text></View>
                      </View>
                      <Text style={{ color: '#647F9E', fontSize: 9, marginBottom: 4 }}>{b.classArm} · {b.subject} · {b.source}</Text>
                      <Text style={{ color: '#647F9E', fontSize: 9 }}>{b.uploadedBy} · {b.date}</Text>
                    </Pressable>
                  );
                })}
                {!filteredBatches.length && <Text style={{ padding: 14, color: '#647F9E', fontSize: 11, textAlign: 'center' }}>No batches match.</Text>}
              </ScrollView>
              <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 6 }}>Showing 1–{filteredBatches.length} of {batches.length} batches</Text>
            </View>
          </View>

          {/* Center: Review workspace */}
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 8, padding: 14 }}>
              {/* Batch header */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' }}>
                <View style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: '#DFF5E9', alignItems: 'center', justifyContent: 'center' }}><FileSpreadsheet size={22} color="#08704F" /></View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <Text style={{ color: '#142F4D', fontSize: 14, fontWeight: '800' }}>{selectedBatch.name}</Text>
                    <View style={{ backgroundColor: UPLOAD_STATUS_COLORS[selectedBatch.status]?.[0] || '#E2EAF0', borderRadius: 11, paddingHorizontal: 8, paddingVertical: 3 }}><Text style={{ color: UPLOAD_STATUS_COLORS[selectedBatch.status]?.[1] || '#334F6E', fontSize: 9, fontWeight: '700' }}>{selectedBatch.status}</Text></View>
                  </View>
                  <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 6 }}>Class: {selectedBatch.classArm}  ·  Subject: {selectedBatch.subject}  ·  Source: {selectedBatch.source}</Text>
                  <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 3 }}>Uploaded by: {selectedBatch.uploadedBy}  ·  {selectedBatch.date}</Text>
                </View>
              </View>

              {/* Progress */}
              <View style={{ marginTop: 12, marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <Text style={{ color: '#142F4D', fontSize: 11, fontWeight: '700' }}>Review Progress</Text>
                  <Text style={{ color: '#08754F', fontSize: 11, fontWeight: '800' }}>{progressPct}%</Text>
                </View>
                <View style={{ height: 8, backgroundColor: '#E3EAF0', borderRadius: 4, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${Math.min(progressPct, 100)}%`, backgroundColor: '#08765F' }} />
                </View>
                <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 4 }}>{reviewedCount} of {selectedBatch.total} records reviewed</Text>
              </View>

              {/* Validation warning */}
              {(selectedBatch.unmatched > 0 || selectedBatch.invalid > 0) && (
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderWidth: 1, borderColor: '#FFD1D5', backgroundColor: '#FFF0F1', borderRadius: 6, marginBottom: 12 }}>
                  <AlertCircle size={17} color="#D92E32" />
                  <Text style={{ color: '#D92E32', fontSize: 11, flex: 1, lineHeight: 16 }}>There {selectedBatch.unmatched === 1 ? 'is' : 'are'} {selectedBatch.unmatched} unmatched student{selectedBatch.unmatched > 1 ? 's' : ''} and {selectedBatch.invalid} invalid score{selectedBatch.invalid > 1 ? 's' : ''} in this batch. Please review and correct before confirming.</Text>
                </View>
              )}

              {/* Toolbar */}
              <View style={{ flexDirection: 'row', gap: 7, marginBottom: 10, flexWrap: 'wrap' }}>
                <View style={{ flex: 1, minWidth: 160, height: 32, flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, paddingHorizontal: 8, backgroundColor: '#FFFFFF' }}>
                  <Search size={13} color="#8299B1" />
                  <TextInput value={studentSearch} onChangeText={setStudentSearch} placeholder="Search students..." placeholderTextColor="#8097B0" style={{ flex: 1, fontSize: 10, color: '#142F4D', padding: 0 }} />
                </View>
                <Pressable onPress={() => setSort(sortOptions[(sortOptions.indexOf(sort) + 1) % sortOptions.length])} style={{ height: 32, paddingHorizontal: 9, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFFFFF' }}>
                  <Text numberOfLines={1} style={{ color: '#244361', fontSize: 10, fontWeight: '600', maxWidth: 110 }}>{sort}</Text><ChevronDown size={12} color="#647F9E" />
                </Pressable>
                <Pressable onPress={() => setMatchFilter(matchStatuses[(matchStatuses.indexOf(matchFilter) + 1) % matchStatuses.length])} style={{ height: 32, paddingHorizontal: 9, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFFFFF' }}>
                  <Text numberOfLines={1} style={{ color: '#244361', fontSize: 10, fontWeight: '600', maxWidth: 90 }}>{matchFilter}</Text><ChevronDown size={12} color="#647F9E" />
                </Pressable>
                <Pressable onPress={() => setBulkOpen(!bulkOpen)} style={{ height: 32, paddingHorizontal: 10, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFFFFF' }}>
                  <Text style={{ color: '#244361', fontSize: 10, fontWeight: '600' }}>Bulk Actions</Text>
                  <ChevronDown size={12} color="#647F9E" />
                </Pressable>
              </View>

              {/* Bulk actions dropdown */}
              {bulkOpen && (
                <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10, padding: 8, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, backgroundColor: '#FAFCFD', flexWrap: 'wrap' }}>
                  <Text style={{ color: '#647F9E', fontSize: 10, alignSelf: 'center' }}>{selected.length} selected</Text>
                  <View style={{ flex: 1 }} />
                  {['Mark Valid', 'Mark Uncertain', 'Match', 'Reject'].map(a => (
                    <Pressable key={a} onPress={() => applyBulk(a)} style={{ paddingHorizontal: 9, paddingVertical: 5, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 4, backgroundColor: '#FFFFFF' }}>
                      <Text style={{ color: '#244361', fontSize: 10, fontWeight: '600' }}>{a}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Score table */}
              <ScrollView horizontal showsHorizontalScrollIndicator>
                <View style={{ minWidth: 900 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 36, paddingHorizontal: 8, backgroundColor: '#F0F3F6', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                    <Pressable onPress={toggleSelectAll} style={{ width: 28, height: 22, justifyContent: 'center' }}>
                      <View style={{ width: 14, height: 14, borderRadius: 3, borderWidth: 1.5, borderColor: selected.length === filteredRecords.length && filteredRecords.length > 0 ? '#08754F' : '#9BAEC0', backgroundColor: selected.length === filteredRecords.length && filteredRecords.length > 0 ? '#08754F' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                        {selected.length === filteredRecords.length && filteredRecords.length > 0 && <Check size={10} color="#FFFFFF" />}
                      </View>
                    </Pressable>
                    {['Student', 'Assgn.', 'T1', 'T2', 'Prac.', 'Proj.', 'Exam', 'Total', 'Match', 'Validation', 'Actions'].map((h, i) => (
                      <Text key={h} style={{ width: [200, 50, 45, 45, 50, 50, 50, 55, 90, 90, 70][i], fontSize: 10, fontWeight: '800', color: '#244361', paddingRight: 4, textAlign: i >= 1 && i <= 7 ? 'center' : 'left' }}>{h}</Text>
                    ))}
                  </View>
                  {filteredRecords.map(r => {
                    const [mbg, mfg] = MATCH_COLORS[r.match] || ['#E2EAF0', '#334F6E'];
                    const [vbg, vfg] = VALIDATION_COLORS[r.validation] || ['#E2EAF0', '#334F6E'];
                    const isIssue = r.match !== 'Matched' || r.validation !== 'Valid';
                    const isSel = r.id === selectedRecordId;
                    const isChk = selected.includes(r.id);
                    const [bg, fg] = STU_TONES[r.tone] || STU_TONES.green;
                    return (
                      <Pressable key={r.id} onPress={() => setSelectedRecordId(r.id)} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 42, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#E8EEF3', backgroundColor: isIssue ? '#FFF9F8' : (isSel ? '#E4F6ED' : 'transparent') }}>
                        <Pressable onPress={() => toggleSelect(r.id)} style={{ width: 28, height: 22, justifyContent: 'center' }}>
                          <View style={{ width: 14, height: 14, borderRadius: 3, borderWidth: 1.5, borderColor: isChk ? '#08754F' : '#9BAEC0', backgroundColor: isChk ? '#08754F' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                            {isChk && <Check size={10} color="#FFFFFF" />}
                          </View>
                        </Pressable>
                        <View style={{ width: 200, flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 4 }}>
                          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Text style={{ color: fg, fontSize: 10, fontWeight: '800' }}>{r.initials}</Text></View>
                          <View style={{ flex: 1, minWidth: 0 }}>
                            <Text numberOfLines={1} style={{ color: '#142F4D', fontSize: 10, fontWeight: '700' }}>{r.name}</Text>
                            <Text style={{ color: '#647F9E', fontSize: 9 }}>{r.admission}</Text>
                          </View>
                        </View>
                        {[r.scores.assgn, r.scores.t1, r.scores.t2, r.scores.prac, r.scores.proj, r.exam, r.total].map((v, i) => (
                          <Text key={i} style={{ width: [50, 45, 45, 50, 50, 50, 55][i], fontSize: 10, color: '#355779', textAlign: 'center', fontWeight: i === 6 ? '800' : '500' }}>{v}</Text>
                        ))}
                        <View style={{ width: 90 }}><View style={{ backgroundColor: mbg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' }}><Text style={{ color: mfg, fontSize: 9, fontWeight: '700' }}>{r.match}</Text></View></View>
                        <View style={{ width: 90 }}><View style={{ backgroundColor: vbg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' }}><Text style={{ color: vfg, fontSize: 9, fontWeight: '700' }}>{r.validation}</Text></View></View>
                        <View style={{ width: 70, flexDirection: 'row', gap: 5 }}>
                          <Pressable onPress={() => openEdit(r)} style={{ width: 26, height: 26, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Pencil size={13} color="#274968" /></Pressable>
                          <Pressable onPress={() => setRemoveConfirm(r.id)} style={{ width: 26, height: 26, borderWidth: 1, borderColor: '#FFC6C8', borderRadius: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Trash2 size={13} color="#D92E32" /></Pressable>
                        </View>
                      </Pressable>
                    );
                  })}
                  {!filteredRecords.length && <Text style={{ padding: 24, color: '#647F9E', fontSize: 11, textAlign: 'center' }}>No records match.</Text>}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Right: Student details + review summary + actions */}
      {!veryCompact && (
        <View style={{ width: 380, borderLeftWidth: 2, borderLeftColor: '#D5E0E8', backgroundColor: '#F8FAFC', padding: 16 }}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 14 }} showsVerticalScrollIndicator={false}>
            {!selectedRecord ? (
              <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, padding: 24, alignItems: 'center', gap: 10 }}>
                <Users size={32} color="#9BAEC0" />
                <Text style={{ color: '#142F4D', fontSize: 14, fontWeight: '700' }}>Select a student</Text>
                <Text style={{ color: '#647F9E', fontSize: 11, textAlign: 'center' }}>Choose a record from the table to view details.</Text>
              </View>
            ) : (
              <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' }}>
                  <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: STU_TONES[selectedRecord.tone]?.[0] || '#DFF5E9', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: STU_TONES[selectedRecord.tone]?.[1] || '#075B46', fontSize: 15, fontWeight: '800' }}>{selectedRecord.initials}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text numberOfLines={1} style={{ color: '#142F4D', fontSize: 13, fontWeight: '800' }}>{selectedRecord.name}</Text>
                    <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 3 }}>{selectedRecord.admission}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                      <View style={{ backgroundColor: MATCH_COLORS[selectedRecord.match]?.[0] || '#E2EAF0', borderRadius: 11, paddingHorizontal: 8, paddingVertical: 3 }}><Text style={{ color: MATCH_COLORS[selectedRecord.match]?.[1] || '#334F6E', fontSize: 9, fontWeight: '700' }}>{selectedRecord.match}</Text></View>
                      <View style={{ backgroundColor: VALIDATION_COLORS[selectedRecord.validation]?.[0] || '#E2EAF0', borderRadius: 11, paddingHorizontal: 8, paddingVertical: 3 }}><Text style={{ color: VALIDATION_COLORS[selectedRecord.validation]?.[1] || '#334F6E', fontSize: 9, fontWeight: '700' }}>{selectedRecord.validation}</Text></View>
                    </View>
                  </View>
                  <Pressable onPress={() => setSelectedRecordId(null)}><X size={18} color="#59728F" /></Pressable>
                </View>

                {/* Tabs */}
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DCE6EE', paddingHorizontal: 12 }}>
                  {(['Details', 'Scores', 'Activity'] as const).map(t => (
                    <Pressable key={t} onPress={() => setTab(t)} style={{ minWidth: 80, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: tab === t ? '#08765F' : 'transparent' }}>
                      <Text style={{ color: tab === t ? '#08765F' : '#647F9E', fontSize: 11, fontWeight: 700 }}>{t}</Text>
                    </Pressable>
                  ))}
                </View>

                <View style={{ padding: 12 }}>
                  {tab === 'Details' ? (
                    <View>
                      {/* Student Information */}
                      <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800', marginBottom: 8 }}>Student Information</Text>
                      <View style={{ borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 5, padding: 10, marginBottom: 12 }}>
                        {[['Full Name', selectedRecord.name], ['Gender', 'Male'], ['Date of Birth', 'Mar 12, 2008 (17 years)']].map(([l, v]: any) => (
                          <View key={l} style={{ flexDirection: 'row', paddingVertical: 4 }}>
                            <Text style={{ flex: 1, color: '#647F9E', fontSize: 10 }}>{l}</Text>
                            <Text style={{ flex: 1.2, color: '#244361', fontSize: 10, fontWeight: '600' }}>{v}</Text>
                          </View>
                        ))}
                      </View>
                      {/* Guardian */}
                      <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800', marginBottom: 8 }}>Guardian Information</Text>
                      <View style={{ borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 5, padding: 10, marginBottom: 12 }}>
                        {[['Name', 'Mr. Emmanuel Okafor'], ['Phone', '0806 123 4567'], ['Relationship', 'Father']].map(([l, v]: any) => (
                          <View key={l} style={{ flexDirection: 'row', paddingVertical: 4 }}>
                            <Text style={{ flex: 1, color: '#647F9E', fontSize: 10 }}>{l}</Text>
                            <Text style={{ flex: 1.2, color: '#244361', fontSize: 10, fontWeight: '600' }}>{v}</Text>
                          </View>
                        ))}
                      </View>
                      {/* Academic */}
                      <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800', marginBottom: 8 }}>Academic Information</Text>
                      <View style={{ borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 5, padding: 10, marginBottom: 12 }}>
                        {[['Class', selectedBatch.classArm], ['Admission Number', selectedRecord.admission], ['Current Session', '2024/2025']].map(([l, v]: any) => (
                          <View key={l} style={{ flexDirection: 'row', paddingVertical: 4 }}>
                            <Text style={{ flex: 1, color: '#647F9E', fontSize: 10 }}>{l}</Text>
                            <Text style={{ flex: 1.2, color: '#244361', fontSize: 10, fontWeight: '600' }}>{v}</Text>
                          </View>
                        ))}
                      </View>
                      {/* Add Assignment */}
                      <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800', marginBottom: 8 }}>Add Assignment</Text>
                      <View style={{ borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 5, padding: 10 }}>
                        <Text style={{ color: '#244361', fontSize: 10, fontWeight: '700', marginBottom: 5 }}>Assignment Type</Text>
                        <View style={{ flexDirection: 'row', gap: 5, marginBottom: 9 }}>
                          {(['Form Teacher', 'Subject Teacher'] as const).map(t => (
                            <Pressable key={t} onPress={() => setAssignmentType(t)} style={{ flex: 1, paddingHorizontal: 8, paddingVertical: 7, borderWidth: 1, borderColor: assignmentType === t ? '#0B765B' : '#DCE6EE', borderRadius: 4, backgroundColor: assignmentType === t ? '#E2F4EC' : 'transparent' }}>
                              <Text style={{ color: assignmentType === t ? '#075B46' : '#41698F', fontSize: 9, fontWeight: assignmentType === t ? '700' : '500' }}>{t === 'Form Teacher' ? 'Form Teacher' : 'Subject Teacher'}</Text>
                            </Pressable>
                          ))}
                        </View>
                        <Text style={{ color: '#244361', fontSize: 10, fontWeight: '700', marginBottom: 4 }}>Class Arm *</Text>
                        <Pressable onPress={() => { const opts = ['JSS1A', 'JSS1B', 'JSS2A', 'SS1A', 'SS2B']; setAssignmentClass(opts[(opts.indexOf(assignmentClass) + 1) % opts.length]); }} style={{ height: 32, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 4, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, backgroundColor: '#FFFFFF' }}>
                          <Text style={{ color: '#142F4D', fontSize: 10 }}>{assignmentClass || 'Select class arm'}</Text>
                          <ChevronDown size={12} color="#647F9E" />
                        </Pressable>
                        {assignmentType === 'Subject Teacher' && (
                          <>
                            <Text style={{ color: '#244361', fontSize: 10, fontWeight: '700', marginBottom: 4 }}>Subject *</Text>
                            <Pressable onPress={() => { const opts = ['Mathematics', 'English Language', 'Biology', 'Chemistry']; setAssignmentSubject(opts[(opts.indexOf(assignmentSubject) + 1) % opts.length]); }} style={{ height: 32, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 4, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, backgroundColor: '#FFFFFF' }}>
                              <Text style={{ color: '#142F4D', fontSize: 10 }}>{assignmentSubject || 'Select subject'}</Text>
                              <ChevronDown size={12} color="#647F9E" />
                            </Pressable>
                          </>
                        )}
                        <Pressable onPress={addAssignment} style={{ backgroundColor: '#00513D', borderRadius: 4, paddingVertical: 8, alignItems: 'center' }}>
                          <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>Add Assignment</Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : tab === 'Scores' ? (
                    <View>
                      <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800', marginBottom: 8 }}>Score Breakdown</Text>
                      <View style={{ borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 5 }}>
                        {[['Assignment', String(selectedRecord.scores.assgn), '5'], ['Test 1', String(selectedRecord.scores.t1), '5'], ['Test 2', String(selectedRecord.scores.t2), '5'], ['Practical', String(selectedRecord.scores.prac), '5'], ['Project', String(selectedRecord.scores.proj), '20'], ['Examination', String(selectedRecord.exam), '60'], ['Total', String(selectedRecord.total), '100']].map(([label, val, max]: any, i: number) => (
                          <View key={label} style={{ flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: i < 6 ? 1 : 0, borderBottomColor: '#EEF2F5', backgroundColor: i === 6 ? '#F0F7F4' : 'transparent' }}>
                            <Text style={{ flex: 2, color: '#244361', fontSize: 10, fontWeight: i === 6 ? '800' : '500' }}>{label}</Text>
                            <Text style={{ flex: 1, color: i === 6 ? '#08754F' : '#142F4D', fontSize: 11, fontWeight: '800', textAlign: 'center' }}>{val}</Text>
                            <Text style={{ flex: 1, color: '#647F9E', fontSize: 10, textAlign: 'center' }}>/{max}</Text>
                          </View>
                        ))}
                      </View>
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                        <View style={{ flex: 1, backgroundColor: MATCH_COLORS[selectedRecord.match]?.[0], borderRadius: 6, padding: 8, alignItems: 'center' }}>
                          <Text style={{ color: '#647F9E', fontSize: 9 }}>Match</Text>
                          <Text style={{ color: MATCH_COLORS[selectedRecord.match]?.[1], fontSize: 11, fontWeight: '800', marginTop: 2 }}>{selectedRecord.match}</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: VALIDATION_COLORS[selectedRecord.validation]?.[0], borderRadius: 6, padding: 8, alignItems: 'center' }}>
                          <Text style={{ color: '#647F9E', fontSize: 9 }}>Validation</Text>
                          <Text style={{ color: VALIDATION_COLORS[selectedRecord.validation]?.[1], fontSize: 11, fontWeight: '800', marginTop: 2 }}>{selectedRecord.validation}</Text>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800', marginBottom: 8 }}>Recent Activity</Text>
                      {[
                        ['Record reviewed by administrator', '2 hours ago'],
                        ['Score edited: T2 from 4 to 5', '1 day ago'],
                        ['Imported from JSS1A_Maths_T2_2025', '3 days ago'],
                      ].map(([title, time]: any, i: number) => (
                        <View key={i} style={{ minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <View style={{ width: 13, alignItems: 'center' }}>{i === 0 && <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#08765F' }} />}</View>
                          <Text style={{ color: '#244361', fontSize: 10, flex: 1 }}>{title}</Text>
                          <Text style={{ color: '#647F9E', fontSize: 9 }}>{time}</Text>
                        </View>
                      ))}
                      <Text style={{ color: '#647F9E', fontSize: 9, marginTop: 8, fontStyle: 'italic' }}>Demo events — wire to audit API for real history.</Text>
                    </View>
                  )}
                </View>

                {/* Review Summary card */}
                <View style={{ margin: 12, marginTop: 0, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, padding: 10, backgroundColor: '#FAFCFD' }}>
                  <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800', marginBottom: 8 }}>Review Summary</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {[['Total Rows', selectedBatch.total, '#647F9E', Users], ['Unmatched', selectedBatch.unmatched, '#C27A08', Users], ['Invalid', selectedBatch.invalid, '#D92E32', AlertCircle], ['Uncertain', selectedBatch.uncertain, '#6E35D4', AlertCircle]].map(([label, val, color, Ic]: any) => (
                      <View key={label} style={{ flexBasis: '47%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 }}>
                        <Ic size={14} color={color} />
                        <View><Text style={{ color: '#647F9E', fontSize: 9 }}>{label}</Text><Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800' }}>{val}</Text></View>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Bottom actions */}
                <View style={{ paddingHorizontal: 12, paddingBottom: 12, borderTopWidth: 1, borderTopColor: '#EEF2F5', paddingTop: 12 }}>
                  <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
                    <Pressable onPress={saveDraft} style={{ flex: 1, height: 32, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                      <Text style={{ color: '#244361', fontSize: 10, fontWeight: '700' }}>Save Draft</Text>
                    </Pressable>
                    <Pressable onPress={() => setRejectConfirm(selectedBatch)} style={{ flex: 1, height: 32, borderWidth: 1, borderColor: '#FFC6C8', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                      <Text style={{ color: '#D92E32', fontSize: 10, fontWeight: '700' }}>Reject Batch</Text>
                    </Pressable>
                  </View>
                  <Pressable onPress={confirmBatch} disabled={hasBlockingIssues} style={{ height: 34, borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: hasBlockingIssues ? '#C9D6DE' : '#00513D' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>{hasBlockingIssues ? 'Resolve Issues to Confirm' : 'Confirm Batch'}</Text>
                  </Pressable>
                  <Text style={{ color: '#647F9E', fontSize: 9, textAlign: 'center', marginTop: 8 }}>Results will be verified before becoming official score data.</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Edit Score Modal */}
      {editRecord && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setEditRecord(null)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(6,28,40,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => setEditRecord(null)}>
            <View style={{ width: '100%', maxWidth: 440, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' }}>
                <View><Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800' }}>Edit Score</Text><Text style={{ color: '#647F9E', fontSize: 11, marginTop: 2 }}>{editRecord.name} · {editRecord.admission}</Text></View>
                <Pressable onPress={() => setEditRecord(null)}><X size={18} color="#41698F" /></Pressable>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {[['assgn', 'Assignment', '5'], ['t1', 'Test 1', '5'], ['t2', 'Test 2', '5'], ['prac', 'Practical', '5'], ['proj', 'Project', '20'], ['exam', 'Examination', '60']].map(([key, label, max]: any) => (
                  <View key={key} style={{ width: '47%', flexGrow: 1, minWidth: 130 }}>
                    <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 5 }}>{label} (max {max})</Text>
                    <TextInput value={String(editValues[key] ?? '')} onChangeText={v => setEditValues((c: any) => ({ ...c, [key]: v }))} keyboardType="numeric" style={{ height: 36, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, paddingHorizontal: 10, fontSize: 12, color: '#142F4D' }} />
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E2EAF0' }}>
                <Pressable onPress={() => setEditRecord(null)} style={{ height: 34, paddingHorizontal: 14, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Text style={{ color: '#274968', fontSize: 11, fontWeight: '700' }}>Cancel</Text></Pressable>
                <Pressable onPress={saveEdit} style={{ height: 34, paddingHorizontal: 14, backgroundColor: '#00513D', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Save Changes</Text></Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Reject Confirmation */}
      {rejectConfirm && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setRejectConfirm(null)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(6,28,40,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => setRejectConfirm(null)}>
            <View style={{ width: '100%', maxWidth: 400, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 22 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFF9F8', borderWidth: 1, borderColor: '#FFC6C8', alignItems: 'center', justifyContent: 'center' }}><AlertCircle size={18} color="#D92E32" /></View>
                <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800' }}>Reject Batch?</Text>
              </View>
              <Text style={{ color: '#647F9E', fontSize: 12, lineHeight: 18 }}>This will mark <Text style={{ fontWeight: '700', color: '#213B57' }}>{rejectConfirm.name}</Text> as Rejected. The original uploader will need to re-upload a corrected file. This action cannot be undone.</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
                <Pressable onPress={() => setRejectConfirm(null)} style={{ paddingHorizontal: 15, paddingVertical: 9, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}><Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700' }}>Cancel</Text></Pressable>
                <Pressable onPress={rejectBatch} style={{ backgroundColor: '#D92E32', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 15, paddingVertical: 9 }}><Trash2 size={14} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Reject Batch</Text></Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Remove Record Confirmation */}
      {removeConfirm && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setRemoveConfirm(null)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(6,28,40,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => setRemoveConfirm(null)}>
            <View style={{ width: '100%', maxWidth: 400, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 22 }}>
              <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800', marginBottom: 12 }}>Remove Record?</Text>
              <Text style={{ color: '#647F9E', fontSize: 12, lineHeight: 18 }}>This will remove the student record from this batch. The original file data is unaffected. Demo only — not persisted.</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
                <Pressable onPress={() => setRemoveConfirm(null)} style={{ paddingHorizontal: 15, paddingVertical: 9, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}><Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700' }}>Cancel</Text></Pressable>
                <Pressable onPress={() => removeRecord(removeConfirm)} style={{ backgroundColor: '#D92E32', borderRadius: 6, paddingHorizontal: 15, paddingVertical: 9 }}><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Remove</Text></Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

// Helper used by ReviewCompileScreen — returns the seed batches array (kept separate for clarity)
function REVIEW_BATCHS_INIT() { return REVIEW_BATCHES.map(b => ({ ...b })); }

// === REPORT CARDS DATA ===
const REPORT_CARDS_DATA = [
  { id: '1', studentName: 'Hajara Abubakar', admission: 'AK/2024/0012', initials: 'HA', tone: 'green', classArm: 'JSS1A', session: '2024/2025', term: 'Second Term', status: 'Published', generatedDate: 'Aug 25, 2025', average: 84.6, position: '3rd of 14', subjectsCount: 8 },
  { id: '2', studentName: 'Chukwuemeka Okafor', admission: 'AK/2023/0084', initials: 'CO', tone: 'blue', classArm: 'SS2B', session: '2024/2025', term: 'Second Term', status: 'Published', generatedDate: 'Aug 25, 2025', average: 79.3, position: '5th of 19', subjectsCount: 9 },
  { id: '3', studentName: 'Amina Ibrahim', admission: 'AK/2024/0031', initials: 'AI', tone: 'purple', classArm: 'JSS2A', session: '2024/2025', term: 'Second Term', status: 'Ready for Review', generatedDate: 'Aug 24, 2025', average: 81.0, position: '4th of 19', subjectsCount: 8 },
  { id: '4', studentName: 'Oluwaseun Adeyemi', admission: 'AK/2022/0068', initials: 'OA', tone: 'blue', classArm: 'SS3A', session: '2024/2025', term: 'Second Term', status: 'Published', generatedDate: 'Aug 25, 2025', average: 87.8, position: '1st of 18', subjectsCount: 9 },
  { id: '5', studentName: 'Ifeoma Nwosu', admission: 'AK/2023/0045', initials: 'IN', tone: 'purple', classArm: 'SS1B', session: '2024/2025', term: 'Second Term', status: 'Draft', generatedDate: 'Aug 23, 2025', average: 72.0, position: '8th of 15', subjectsCount: 9 },
  { id: '6', studentName: 'Abdulrahman Bello', admission: 'AK/2024/0076', initials: 'AB', tone: 'green', classArm: 'JSS2B', session: '2024/2025', term: 'Second Term', status: 'Ready for Review', generatedDate: 'Aug 24, 2025', average: 77.4, position: '6th of 19', subjectsCount: 8 },
  { id: '7', studentName: 'Zainab Yusuf', admission: 'AK/2023/0029', initials: 'ZY', tone: 'purple', classArm: 'SS3B', session: '2024/2025', term: 'Second Term', status: 'Published', generatedDate: 'Aug 25, 2025', average: 88.9, position: '1st of 17', subjectsCount: 9 },
  { id: '8', studentName: 'Tunde Balogun', admission: 'AK/2024/0057', initials: 'TB', tone: 'blue', classArm: 'JSS1B', session: '2024/2025', term: 'Second Term', status: 'Draft', generatedDate: 'Aug 23, 2025', average: 70.5, position: '9th of 13', subjectsCount: 8 },
  { id: '9', studentName: 'Fatima Hashim', admission: 'AK/2024/0061', initials: 'FH', tone: 'orange', classArm: 'JSS3B', session: '2024/2025', term: 'Second Term', status: 'Ready for Review', generatedDate: 'Aug 24, 2025', average: 75.8, position: '7th of 18', subjectsCount: 8 },
  { id: '10', studentName: 'Ibrahim Musa', admission: 'AK/2023/0074', initials: 'IM', tone: 'green', classArm: 'SS3A', session: '2024/2025', term: 'Second Term', status: 'Published', generatedDate: 'Aug 25, 2025', average: 85.4, position: '2nd of 18', subjectsCount: 9 },
];

const REPORT_CARD_SUBJECTS = [
  { subject: 'Mathematics', ca: 32, exam: 52, total: 84, grade: 'B2', remark: 'Very Good' },
  { subject: 'English Language', ca: 35, exam: 49, total: 84, grade: 'B2', remark: 'Very Good' },
  { subject: 'Basic Science', ca: 36, exam: 51, total: 87, grade: 'A1', remark: 'Excellent' },
  { subject: 'Social Studies', ca: 33, exam: 48, total: 81, grade: 'B2', remark: 'Very Good' },
  { subject: 'Civic Education', ca: 34, exam: 50, total: 84, grade: 'B2', remark: 'Very Good' },
  { subject: 'Mathematics (Practical)', ca: 30, exam: 47, total: 77, grade: 'B3', remark: 'Good' },
  { subject: 'Computer Studies', ca: 37, exam: 53, total: 90, grade: 'A1', remark: 'Excellent' },
  { subject: 'Agricultural Science', ca: 31, exam: 45, total: 76, grade: 'B3', remark: 'Good' },
];

const GRADE_COLORS: Record<string, [string, string]> = {
  'A1': ['#D9F4E6', '#08754F'],
  'B2': ['#DFF5E9', '#08704F'],
  'B3': ['#E0ECFF', '#176DDA'],
  'C4': ['#E0ECFF', '#176DDA'],
  'C5': ['#EFE3FF', '#6E35D4'],
  'C6': ['#EFE3FF', '#6E35D4'],
  'D7': ['#FFF0D4', '#C27A08'],
  'E8': ['#FFE1E1', '#D92E32'],
  'F9': ['#FFE1E1', '#D92E32'],
};

const REPORT_STATUS_COLORS: Record<string, [string, string]> = {
  'Published': ['#D9F4E6', '#08754F'],
  'Ready for Review': ['#FFF0D4', '#C27A08'],
  'Draft': ['#E0ECFF', '#176DDA'],
};

// === REPORT CARDS SCREEN ===
function ReportCardsScreen({ search: globalSearch, show }: { search: string; show: (msg: string, type?: string) => void }) {
  const { width } = useWindowDimensions();
  const compact = width < 1180;
  const [cards, setCards] = useState(REPORT_CARDS_DATA);
  const [selectedId, setSelectedId] = useState<string | null>('1');
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [page, setPage] = useState(1);
  const [rowActions, setRowActions] = useState<string | null>(null);
  const [bulkModal, setBulkModal] = useState(false);
  const [bulkForm, setBulkForm] = useState({ classArm: 'JSS1A', term: 'Second Term' });

  const selected = cards.find(c => c.id === selectedId) || null;
  const classes = ['All Classes', 'JSS1A', 'JSS1B', 'JSS2A', 'JSS2B', 'JSS3B', 'SS1B', 'SS2B', 'SS3A', 'SS3B'];
  const statuses = ['All Statuses', 'Published', 'Ready for Review', 'Draft'];

  const effectiveSearch = (search || globalSearch).trim().toLowerCase();
  const filtered = useMemo(() => cards.filter(c => {
    const matchesSearch = !effectiveSearch || `${c.studentName} ${c.admission} ${c.classArm}`.toLowerCase().includes(effectiveSearch);
    const matchesClass = classFilter === 'All Classes' || c.classArm === classFilter;
    const matchesStatus = statusFilter === 'All Statuses' || c.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  }), [cards, effectiveSearch, classFilter, statusFilter]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const publishedCount = cards.filter(c => c.status === 'Published').length;
  const readyCount = cards.filter(c => c.status === 'Ready for Review').length;
  const draftCount = cards.filter(c => c.status === 'Draft').length;

  function publishCard(id: string) {
    setCards(curr => curr.map(c => c.id === id ? { ...c, status: 'Published', generatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) } : c));
    setRowActions(null);
    show(`Report card published for ${cards.find(c => c.id === id)?.studentName}`, 'success');
  }
  function unpublishCard(id: string) {
    setCards(curr => curr.map(c => c.id === id ? { ...c, status: 'Ready for Review' } : c));
    setRowActions(null);
    show(`Report card moved back to review`, 'info');
  }
  function generateBulk() {
    show(`Bulk generation started for ${bulkForm.classArm} — ${bulkForm.term} (demo only)`, 'info');
    setBulkModal(false);
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', minHeight: 0 }}>
      <ScrollView style={{ flex: 1, minWidth: 0 }} contentContainerStyle={{ padding: 24, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {/* Page header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 15, marginBottom: 18, flexWrap: 'wrap' }}>
          <View style={{ flex: 1, minWidth: 280 }}>
            <Text style={{ color: '#064333', fontSize: 26, fontWeight: '800', letterSpacing: -0.3 }}>Report Cards</Text>
            <Text style={{ color: '#647F9E', fontSize: 13, marginTop: 5 }}>View, generate, download, and print individual student report cards.</Text>
          </View>
          <Pressable onPress={() => setBulkModal(true)} style={{ backgroundColor: '#00513D', borderRadius: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 37, paddingHorizontal: 15 }}>
            <Plus size={16} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Bulk Generate</Text>
          </Pressable>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          {[['Total Report Cards', String(cards.length), 'Across all classes', 'green', FileText], ['Published', String(publishedCount), 'Ready to distribute', 'blue', CheckCircle2], ['Ready for Review', String(readyCount), 'Awaiting approval', 'orange', AlertCircle], ['Draft', String(draftCount), 'Incomplete results', 'purple', FileText]].map(([label, value, sub, tone, Ic]: any) => {
            const tones: Record<string, [string, string]> = { green: ['#DFF5E9', '#08754F'], blue: ['#E0ECFF', '#176DDA'], orange: ['#FFF0D4', '#C27A08'], purple: ['#EFE3FF', '#6E35D4'] };
            const [bg, fg] = tones[tone];
            return (
              <View key={label} style={{ flex: 1, minWidth: 200, minHeight: 110, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, padding: 17, flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}><Ic size={24} color={fg} /></View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ color: '#244361', fontSize: 11, fontWeight: '600' }}>{label}</Text>
                  <Text style={{ color: '#142F4D', fontSize: 24, fontWeight: '800', marginTop: 4 }}>{value}</Text>
                  <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 6 }}>{sub}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Directory card */}
        <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, padding: 14 }}>
          {/* Filters */}
          <View style={{ flexDirection: 'row', gap: 9, marginBottom: 10, flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: 200, height: 36, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, backgroundColor: '#FFFFFF' }}>
              <Search size={16} color="#8299B1" />
              <TextInput value={search} onChangeText={v => { setSearch(v); setPage(1); }} placeholder="Search by student name or admission number..." placeholderTextColor="#8097B0" style={{ flex: 1, fontSize: 11, color: '#142F4D', padding: 0 }} />
            </View>
            <Pressable onPress={() => { setClassFilter(classes[(classes.indexOf(classFilter) + 1) % classes.length]); setPage(1); }} style={{ minHeight: 36, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}>
              <Text style={{ color: '#244361', fontSize: 11, fontWeight: '600' }}>{classFilter}</Text><ChevronDown size={15} color="#41698F" />
            </Pressable>
            <Pressable onPress={() => { setStatusFilter(statuses[(statuses.indexOf(statusFilter) + 1) % statuses.length]); setPage(1); }} style={{ minHeight: 36, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}>
              <Text style={{ color: '#244361', fontSize: 11, fontWeight: '600' }}>{statusFilter}</Text><ChevronDown size={15} color="#41698F" />
            </Pressable>
          </View>

          {/* Filter chips */}
          <View style={{ flexDirection: 'row', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
            {statuses.map(item => (
              <Pressable key={item} onPress={() => { setStatusFilter(item); setPage(1); }} style={{ paddingHorizontal: 9, paddingVertical: 5, borderRadius: 5, borderWidth: 1, borderColor: statusFilter === item ? '#B8E3D0' : '#DCE6EE', backgroundColor: statusFilter === item ? '#E2F4EC' : 'transparent' }}>
                <Text style={{ fontSize: 10, fontWeight: statusFilter === item ? '700' : '500', color: statusFilter === item ? '#075B46' : '#41698F' }}>{item}</Text>
              </Pressable>
            ))}
          </View>

          {/* Table */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: 1000 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 38, paddingHorizontal: 10, backgroundColor: '#F0F3F6', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                {['Student', 'Admission No.', 'Class', 'Term', 'Average', 'Position', 'Status', 'Actions'].map((h, i) => (
                  <Text key={h} style={{ width: [170, 130, 75, 130, 75, 100, 130, 90][i], fontSize: 10, fontWeight: '800', color: '#244361', paddingRight: 5 }}>{h}</Text>
                ))}
              </View>
              {visible.map(c => {
                const [bg, fg] = STU_TONES[c.tone] || STU_TONES.green;
                const [sbg, sfg] = REPORT_STATUS_COLORS[c.status] || ['#E2EAF0', '#334F6E'];
                return (
                  <Pressable key={c.id} onPress={() => setSelectedId(c.id)} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 49, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#E8EEF3', backgroundColor: selectedId === c.id ? '#E4F6ED' : 'transparent' }}>
                    <View style={{ width: 170, flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 8 }}>
                      <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Text style={{ color: fg, fontSize: 12, fontWeight: '800' }}>{c.initials}</Text></View>
                      <Text numberOfLines={1} style={{ color: '#142F4D', fontSize: 11, fontWeight: '700', flexShrink: 1 }}>{c.studentName}</Text>
                    </View>
                    <Text numberOfLines={1} style={{ width: 130, fontSize: 10, color: '#244361', paddingRight: 5 }}>{c.admission}</Text>
                    <Text style={{ width: 75, fontSize: 10, color: '#244361', paddingRight: 5 }}>{c.classArm}</Text>
                    <Text numberOfLines={1} style={{ width: 130, fontSize: 10, color: '#244361', paddingRight: 5 }}>{c.term}</Text>
                    <Text style={{ width: 75, fontSize: 10, color: '#244361', fontWeight: '700', paddingRight: 5 }}>{c.average.toFixed(1)}%</Text>
                    <Text numberOfLines={1} style={{ width: 100, fontSize: 10, color: '#244361', paddingRight: 5 }}>{c.position}</Text>
                    <View style={{ width: 130 }}><View style={{ backgroundColor: sbg, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' }}><Text style={{ color: sfg, fontSize: 9, fontWeight: '700' }}>{c.status}</Text></View></View>
                    <View style={{ width: 90, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Pressable onPress={() => setSelectedId(c.id)} style={{ width: 28, height: 28, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Eye size={14} color="#274968" /></Pressable>
                      <Pressable onPress={() => setRowActions(rowActions === c.id ? null : c.id)} style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}><MoreVertical size={16} color="#41698F" /></Pressable>
                      {rowActions === c.id && (
                        <View style={{ position: 'absolute', top: 30, right: 0, width: 160, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, zIndex: 100, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}>
                          {[['Download PDF', () => { show(`PDF download requested for ${c.studentName} (demo)`, 'info'); setRowActions(null); }], ['Print', () => { show(`Print requested for ${c.studentName} (demo)`, 'info'); setRowActions(null); }], c.status === 'Published' ? ['Unpublish', () => unpublishCard(c.id)] : ['Publish', () => publishCard(c.id)]].map(([label, action]: any) => (
                            <Pressable key={label} onPress={action} style={{ paddingHorizontal: 12, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#E8EEF3' }}>
                              <Text style={{ color: '#244361', fontSize: 11, fontWeight: '500' }}>{label}</Text>
                            </Pressable>
                          ))}
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
              {!visible.length && <View style={{ padding: 24, alignItems: 'center' }}><Text style={{ color: '#647F9E', fontSize: 12 }}>No report cards match your filters.</Text></View>}
            </View>
          </ScrollView>

          {/* Pagination */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 12 }}>
            <Text style={{ color: '#647F9E', fontSize: 10 }}>Showing {filtered.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length} report cards</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Pressable onPress={() => setPage(Math.max(1, safePage - 1))} style={{ minWidth: 28, height: 29, paddingHorizontal: 6, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><ChevronLeft size={16} color="#41698F" /></Pressable>
              {Array.from({ length: Math.min(2, pageCount) }, (_, i) => i + 1).map(number => (
                <Pressable key={number} onPress={() => setPage(number)} style={{ minWidth: 28, height: 29, paddingHorizontal: 6, borderWidth: 1, borderColor: safePage === number ? '#006044' : '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: safePage === number ? '#006044' : '#FFFFFF' }}>
                  <Text style={{ color: safePage === number ? '#FFFFFF' : '#41698F', fontSize: 11, fontWeight: safePage === number ? '800' : '500' }}>{number}</Text>
                </Pressable>
              ))}
              <Pressable onPress={() => setPage(Math.min(pageCount, safePage + 1))} style={{ minWidth: 28, height: 29, paddingHorizontal: 6, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><ChevronRight size={16} color="#41698F" /></Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Right — Report Card Preview Panel */}
      {!compact && (
        <View style={{ width: 480, borderLeftWidth: 2, borderLeftColor: '#D5E0E8', backgroundColor: '#F8FAFC', padding: 16 }}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 14 }} showsVerticalScrollIndicator={false}>
            {!selected ? (
              <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, padding: 28, alignItems: 'center', gap: 10 }}>
                <FileText size={34} color="#9BAEC0" />
                <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '700' }}>Select a report card</Text>
                <Text style={{ color: '#647F9E', fontSize: 11, textAlign: 'center' }}>Choose a student from the directory to preview their report card.</Text>
              </View>
            ) : (
              <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, overflow: 'hidden' }}>
                {/* Action bar */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#E2EAF0', backgroundColor: '#FAFCFD' }}>
                  <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '800' }}>Report Card Preview</Text>
                  <View style={{ flexDirection: 'row', gap: 5 }}>
                    <Pressable onPress={() => show(`PDF download requested for ${selected.studentName} (demo)`, 'info')} style={{ width: 30, height: 30, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Download size={14} color="#274968" /></Pressable>
                    <Pressable onPress={() => show(`Print requested for ${selected.studentName} (demo)`, 'info')} style={{ width: 30, height: 30, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Printer size={14} color="#274968" /></Pressable>
                    <Pressable onPress={() => setSelectedId(null)} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}><X size={16} color="#59728F" /></Pressable>
                  </View>
                </View>

                {/* Report card document */}
                <View style={{ padding: 16 }}>
                  {/* School header */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 14, borderBottomWidth: 2, borderBottomColor: '#00372D' }}>
                    <Svg width={42} height={47} viewBox="0 0 64 72"><Path d="M7 8 L32 3 L57 8 L56 42 Q52 58 32 68 Q12 58 8 42 Z" fill="none" stroke="#075340" strokeWidth="3.2" /><Path d="M13 13 L32 9 L51 13 L50 41 Q46 53 32 61 Q18 53 14 41 Z" fill="none" stroke="#075340" strokeWidth="1.3" /><Path d="M21 23 L28 18 L32 25 L36 18 L43 23 L39 31 L44 42 L37 42 L32 34 L27 42 L20 42 L25 31 Z" fill="#075340" /><Circle cx="32" cy="15" r="2" fill="#075340" /></Svg>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#00372D', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 }}>Akoka Federal Academy</Text>
                      <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 2 }}>12 Akoka Road, Yaba, Lagos</Text>
                      <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 1 }}>Excellence · Discipline · Success</Text>
                    </View>
                    <View style={{ backgroundColor: '#00372D', borderRadius: 6, paddingHorizontal: 9, paddingVertical: 4 }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '800' }}>TERMLY REPORT</Text>
                    </View>
                  </View>

                  {/* Student info */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, padding: 10, backgroundColor: '#F8FAFC', borderRadius: 6, borderWidth: 1, borderColor: '#E3EAF0' }}>
                    {[
                      ['Student Name', selected.studentName],
                      ['Admission No.', selected.admission],
                      ['Class & Arm', selected.classArm],
                      ['Session', selected.session],
                      ['Term', selected.term],
                      ['Date Generated', selected.generatedDate],
                    ].map(([label, value]: any) => (
                      <View key={label} style={{ flexBasis: '47%', flexGrow: 1, minWidth: 130 }}>
                        <Text style={{ color: '#647F9E', fontSize: 8, fontWeight: '700' }}>{label.toUpperCase()}</Text>
                        <Text style={{ color: '#142F4D', fontSize: 11, fontWeight: '700', marginTop: 2 }}>{value}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Subject scores table */}
                  <View style={{ marginTop: 12, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, overflow: 'hidden' }}>
                    <View style={{ flexDirection: 'row', backgroundColor: '#00372D', paddingVertical: 8 }}>
                      {['Subject', 'CA /40', 'Exam /60', 'Total /100', 'Grade', 'Remark'].map((h, i) => (
                        <Text key={h} style={{ flex: [2, 0.9, 0.9, 1, 0.7, 1.3][i], color: '#FFFFFF', fontSize: 9, fontWeight: '800', textAlign: i === 0 || i === 5 ? 'left' : 'center', paddingHorizontal: 6 }}>{h}</Text>
                      ))}
                    </View>
                    {REPORT_CARD_SUBJECTS.map((s, i) => {
                      const [gbg, gfg] = GRADE_COLORS[s.grade] || ['#E2EAF0', '#334F6E'];
                      return (
                        <View key={s.subject} style={{ flexDirection: 'row', paddingVertical: 9, backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#E8EEF3' }}>
                          <Text numberOfLines={1} style={{ flex: 2, color: '#142F4D', fontSize: 10, fontWeight: '600', paddingHorizontal: 6 }}>{s.subject}</Text>
                          <Text style={{ flex: 0.9, color: '#244361', fontSize: 10, textAlign: 'center' }}>{s.ca}</Text>
                          <Text style={{ flex: 0.9, color: '#244361', fontSize: 10, textAlign: 'center' }}>{s.exam}</Text>
                          <Text style={{ flex: 1, color: '#142F4D', fontSize: 11, fontWeight: '800', textAlign: 'center' }}>{s.total}</Text>
                          <View style={{ flex: 0.7, alignItems: 'center' }}><View style={{ backgroundColor: gbg, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 }}><Text style={{ color: gfg, fontSize: 9, fontWeight: '800' }}>{s.grade}</Text></View></View>
                          <Text numberOfLines={1} style={{ flex: 1.3, color: '#244361', fontSize: 9, paddingHorizontal: 6 }}>{s.remark}</Text>
                        </View>
                      );
                    })}
                    {/* Totals row */}
                    <View style={{ flexDirection: 'row', paddingVertical: 10, backgroundColor: '#F0F7F4', borderTopWidth: 2, borderTopColor: '#08765F' }}>
                      <Text style={{ flex: 2, color: '#00372D', fontSize: 10, fontWeight: '800', paddingHorizontal: 6 }}>TOTAL</Text>
                      <Text style={{ flex: 0.9, color: '#08754F', fontSize: 10, fontWeight: '800', textAlign: 'center' }}>268</Text>
                      <Text style={{ flex: 0.9, color: '#08754F', fontSize: 10, fontWeight: '800', textAlign: 'center' }}>395</Text>
                      <Text style={{ flex: 1, color: '#08754F', fontSize: 11, fontWeight: '800', textAlign: 'center' }}>663</Text>
                      <Text style={{ flex: 0.7 }} />
                      <Text style={{ flex: 1.3, color: '#647F9E', fontSize: 9, paddingHorizontal: 6 }}>Out of 800</Text>
                    </View>
                  </View>

                  {/* Summary stats */}
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                    {[['Overall Average', `${selected.average.toFixed(1)}%`], ['Class Position', selected.position], ['Subjects Offered', String(selected.subjectsCount)]].map(([label, value]: any) => (
                      <View key={label} style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, backgroundColor: '#FAFCFD', alignItems: 'center' }}>
                        <Text style={{ color: '#647F9E', fontSize: 9, fontWeight: '700' }}>{label.toUpperCase()}</Text>
                        <Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800', marginTop: 4 }}>{value}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Attendance */}
                  <View style={{ marginTop: 12 }}>
                    <Text style={{ color: '#00372D', fontSize: 11, fontWeight: '800', marginBottom: 6 }}>Attendance</Text>
                    <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5 }}>
                      {[['Days Open', '64'], ['Days Present', '60'], ['Days Absent', '4']].map(([label, value]: any, i: number) => (
                        <View key={label} style={{ flex: 1, padding: 8, borderRightWidth: i < 2 ? 1 : 0, borderRightColor: '#DCE6EE', alignItems: 'center' }}>
                          <Text style={{ color: '#647F9E', fontSize: 9 }}>{label}</Text>
                          <Text style={{ color: '#142F4D', fontSize: 13, fontWeight: '800', marginTop: 3 }}>{value}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Affective & Psychomotor */}
                  <View style={{ marginTop: 12 }}>
                    <Text style={{ color: '#00372D', fontSize: 11, fontWeight: '800', marginBottom: 6 }}>Affective & Psychomotor Assessment</Text>
                    <View style={{ borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, overflow: 'hidden' }}>
                      {[['Punctuality', '5'], ['Neatness', '5'], ['Attitude to Work', '4'], ['Relationship with Peers', '5'], ['Leadership', '4'], ['Sports/Games', '5']].map(([trait, rating]: any, i: number) => (
                        <View key={trait} style={{ flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 9, borderBottomWidth: i < 5 ? 1 : 0, borderBottomColor: '#E8EEF3', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                          <Text style={{ flex: 1, color: '#244361', fontSize: 10 }}>{trait}</Text>
                          <Text style={{ color: '#08754F', fontSize: 10, fontWeight: '800' }}>{rating} / 5</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Teacher's comment */}
                  <View style={{ marginTop: 12 }}>
                    <Text style={{ color: '#00372D', fontSize: 11, fontWeight: '800', marginBottom: 5 }}>Class Teacher's Comment</Text>
                    <View style={{ borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, padding: 10, backgroundColor: '#FAFCFD' }}>
                      <Text style={{ color: '#244361', fontSize: 10, lineHeight: 15, fontStyle: 'italic' }}>"A diligent and respectful student. {selected.studentName.split(' ')[0]} has shown consistent improvement this term and participates actively in class discussions. Keep up the excellent work."</Text>
                      <Text style={{ color: '#647F9E', fontSize: 9, marginTop: 6 }}>— Mrs. O. Bello (Form Teacher, {selected.classArm})</Text>
                    </View>
                  </View>

                  {/* Principal's comment */}
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ color: '#00372D', fontSize: 11, fontWeight: '800', marginBottom: 5 }}>Principal's Comment</Text>
                    <View style={{ borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, padding: 10, backgroundColor: '#FAFCFD' }}>
                      <Text style={{ color: '#244361', fontSize: 10, lineHeight: 15, fontStyle: 'italic' }}>"An impressive performance this term. We look forward to continued excellence in the coming session. A role model for peers."</Text>
                      <Text style={{ color: '#647F9E', fontSize: 9, marginTop: 6 }}>— Mr. A. Adeyemi (Principal)</Text>
                    </View>
                  </View>

                  {/* Status footer */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E2EAF0' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                      <View style={{ backgroundColor: REPORT_STATUS_COLORS[selected.status]?.[0], borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3 }}><Text style={{ color: REPORT_STATUS_COLORS[selected.status]?.[1], fontSize: 9, fontWeight: '700' }}>{selected.status}</Text></View>
                      <Text style={{ color: '#647F9E', fontSize: 9 }}>Generated {selected.generatedDate}</Text>
                    </View>
                    {selected.status !== 'Published' && (
                      <Pressable onPress={() => publishCard(selected.id)} style={{ backgroundColor: '#00513D', borderRadius: 5, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6 }}>
                        <CheckCircle2 size={12} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '700' }}>Publish</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Bulk Generate Modal */}
      <Modal visible={bulkModal} transparent animationType="fade" onRequestClose={() => setBulkModal(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(6,28,40,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => setBulkModal(false)}>
          <View style={{ width: '100%', maxWidth: 460, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 22 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' }}>
              <View><Text style={{ color: '#142F4D', fontSize: 16, fontWeight: '800' }}>Bulk Generate Report Cards</Text><Text style={{ color: '#647F9E', fontSize: 11, marginTop: 3 }}>Generate report cards for all students in a class.</Text></View>
              <Pressable onPress={() => setBulkModal(false)}><X size={19} color="#41698F" /></Pressable>
            </View>
            <View style={{ marginBottom: 13 }}>
              <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Class Arm</Text>
              <Pressable onPress={() => { const opts = classes.slice(1); setBulkForm(f => ({ ...f, classArm: opts[(opts.indexOf(f.classArm) + 1) % opts.length] })); }} style={{ height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                <Text style={{ color: '#142F4D', fontSize: 12 }}>{bulkForm.classArm}</Text><ChevronDown size={14} color="#647F9E" />
              </Pressable>
            </View>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Term</Text>
              <Pressable onPress={() => { const opts = ['First Term', 'Second Term', 'Third Term']; setBulkForm(f => ({ ...f, term: opts[(opts.indexOf(f.term) + 1) % opts.length] })); }} style={{ height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                <Text style={{ color: '#142F4D', fontSize: 12 }}>{bulkForm.term}</Text><ChevronDown size={14} color="#647F9E" />
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 10, borderWidth: 1, borderColor: '#FFE1B5', backgroundColor: '#FFF7E6', borderRadius: 6, marginBottom: 14 }}>
              <AlertCircle size={15} color="#D58A13" />
              <Text style={{ color: '#6B5A3F', fontSize: 10, flex: 1, lineHeight: 14 }}>Bulk generation will create report cards for all students with verified scores in {bulkForm.classArm} for {bulkForm.term}. This is a demo only — no real PDFs will be generated.</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <Pressable onPress={() => setBulkModal(false)} style={{ minHeight: 35, paddingHorizontal: 16, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}><Text style={{ color: '#274968', fontSize: 11, fontWeight: '700' }}>Cancel</Text></Pressable>
              <Pressable onPress={generateBulk} style={{ minHeight: 35, paddingHorizontal: 16, backgroundColor: '#00513D', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 7 }}><FileText size={14} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Generate</Text></Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// === SETTINGS DATA ===
const AUDIT_LOG = [
  { id: '1', timestamp: 'Aug 26, 2025 10:12 AM', user: 'Tunde Balogun', action: 'Score Correction', record: 'JSS1A - Mathematics', details: 'Corrected score from 72 to 78 for Hajara Abubakar' },
  { id: '2', timestamp: 'Aug 26, 2025 09:45 AM', user: 'Grace Okafor', action: 'Batch Confirmed', record: 'JSS1A_Maths_T2_2025', details: 'Batch confirmed for 42 records' },
  { id: '3', timestamp: 'Aug 26, 2025 08:30 AM', user: 'Emmanuel Ibe', action: 'Student Updated', record: 'AK/2024/0012', details: 'Updated guardian contact information' },
  { id: '4', timestamp: 'Aug 26, 2025 07:15 AM', user: 'Fatima Hashim', action: 'Report Card Published', record: 'AK/2024/0061', details: 'Published JSS3 report card for Ibrahim Musa' },
  { id: '5', timestamp: 'Aug 25, 2025 04:22 PM', user: 'Adebayo Johnson', action: 'Batch Under Review', record: 'SS2B_Eng_T2_2025', details: 'Moved batch to review stage' },
  { id: '6', timestamp: 'Aug 25, 2025 11:03 AM', user: 'Mrs. Grace Okafor', action: 'User Login', record: 'System', details: 'Administrator login from 196.0.0.45' },
  { id: '7', timestamp: 'Aug 24, 2025 03:17 PM', user: 'Chukwuemeka Okafor', action: 'Subject Assignment', record: 'Mathematics - JSS1A', details: 'Assigned Mathematics to JSS1A' },
  { id: '8', timestamp: 'Aug 24, 2025 10:56 AM', user: 'Ibrahim Kanu', action: 'Result Upload', record: 'JSS3A_Sci_T2_2025', details: 'Uploaded 36 records from Excel file' },
];

const AUDIT_ACTION_COLORS: Record<string, [string, string]> = {
  'Score Correction': ['#E0ECFF', '#176DDA'],
  'Batch Confirmed': ['#D9F4E6', '#08754F'],
  'Student Updated': ['#EFE3FF', '#6E35D4'],
  'Report Card Published': ['#DFF5E9', '#08765F'],
  'Batch Under Review': ['#FFF0D4', '#C27A08'],
  'User Login': ['#E2EAF0', '#4D6683'],
  'Subject Assignment': ['#EFE3FF', '#6E35D4'],
  'Result Upload': ['#E0ECFF', '#176DDA'],
};

const DEFAULT_GENERAL = {
  schoolName: 'Akoka Federal Academy',
  academicYear: '2024/2025',
  gradingScale: 'A1 - F9 (9-point)',
  language: 'English',
  timeZone: 'Africa/Lagos (WAT)',
  caMax: '40',
};

// === SETTINGS SCREEN ===
function SettingsScreen({ show }: { search: string; show: (msg: string, type?: string) => void }) {
  const { width } = useWindowDimensions();
  const veryCompact = width < 900;
  const [tab, setTab] = useState<'General' | 'Notifications' | 'Security' | 'Audit Log'>('General');
  const [general, setGeneral] = useState({ ...DEFAULT_GENERAL });
  const [generalDraft, setGeneralDraft] = useState({ ...DEFAULT_GENERAL });
  const [generalErrors, setGeneralErrors] = useState<Record<string, string>>({});
  const [notifications, setNotifications] = useState({
    newUploads: true,
    batchUpdates: true,
    reportCards: true,
    systemAlerts: true,
  });
  const [security, setSecurity] = useState({
    requireApproval: true,
    allowBulk: true,
    twoFactor: false,
    sessionTimeout: '30 minutes',
  });
  const [resetConfirm, setResetConfirm] = useState(false);

  const gradingScales = ['A1 - F9 (9-point)', 'A - E (5-point)', 'A - D (4-point)'];
  const languages = ['English', 'Yoruba', 'Hausa', 'Igbo', 'French'];
  const timeZones = ['Africa/Lagos (WAT)', 'Africa/Abuja (WAT)', 'UTC', 'Europe/London (GMT)'];
  const timeouts = ['15 minutes', '30 minutes', '1 hour', '2 hours', '4 hours'];

  function validateGeneral(g: typeof general): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!g.schoolName?.trim()) errs.schoolName = 'School name is required';
    if (!g.academicYear?.trim()) errs.academicYear = 'Academic year is required';
    else if (!/^\d{4}\/\d{4}$/.test(g.academicYear)) errs.academicYear = 'Format: YYYY/YYYY';
    const caNum = Number(g.caMax);
    if (!g.caMax || isNaN(caNum)) errs.caMax = 'Numeric value required';
    else if (caNum < 10 || caNum > 60) errs.caMax = 'Must be between 10 and 60';
    return errs;
  }
  function saveGeneral() {
    const errs = validateGeneral(generalDraft);
    setGeneralErrors(errs);
    if (Object.keys(errs).length) { show('Please fix the highlighted fields', 'error'); return; }
    setGeneral({ ...generalDraft });
    show('General settings saved (demo only)', 'success');
  }
  function resetGeneral() {
    setGeneralDraft({ ...DEFAULT_GENERAL });
    setGeneralErrors({});
    setResetConfirm(false);
    show('Settings reset to defaults', 'info');
  }

  function Toggle({ on, onToggle, disabled }: { on: boolean; onToggle: () => void; disabled?: boolean }) {
    return (
      <Pressable onPress={disabled ? undefined : onToggle} style={{ opacity: disabled ? 0.5 : 1 }}>
        <View style={{ width: 38, height: 22, borderRadius: 11, backgroundColor: on ? '#08765F' : '#CCD8E2', paddingHorizontal: 2, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFFFFF', alignSelf: on ? 'flex-end' : 'flex-start', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } }} />
        </View>
      </Pressable>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 30, maxWidth: 1600, alignSelf: 'center', width: '100%' }} showsVerticalScrollIndicator={false}>
      {/* Page header */}
      <View style={{ marginBottom: 18 }}>
        <Text style={{ color: '#064333', fontSize: 26, fontWeight: '800', letterSpacing: -0.3 }}>Settings</Text>
        <Text style={{ color: '#647F9E', fontSize: 13, marginTop: 5 }}>Customize application preferences and result compilation workflows.</Text>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DCE6EE', marginBottom: 18, gap: 4 }}>
        {(['General', 'Notifications', 'Security', 'Audit Log'] as const).map(t => (
          <Pressable key={t} onPress={() => setTab(t)} style={{ paddingHorizontal: 16, paddingVertical: 11, borderBottomWidth: 2, borderBottomColor: tab === t ? '#08765F' : 'transparent' }}>
            <Text style={{ color: tab === t ? '#08765F' : '#647F9E', fontSize: 12, fontWeight: tab === t ? '800' : '600' }}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {/* Layout: General (left) + Notifications/Security (right top) + Audit Log (right bottom) */}
      <View style={{ flexDirection: veryCompact ? 'column' : 'row', gap: 14, alignItems: 'flex-start' }}>
        {/* General Settings — left column, or first tab */}
        {(!veryCompact || tab === 'General') && (
          <View style={{ width: veryCompact ? '100%' : 380, flexShrink: 0 }}>
            <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 8, padding: 16 }}>
              <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800', marginBottom: 4 }}>General Settings</Text>
              <Text style={{ color: '#647F9E', fontSize: 11, marginBottom: 14 }}>Configure basic application settings and school information.</Text>

              {/* School Name */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 5 }}>School Name *</Text>
                <TextInput value={generalDraft.schoolName} onChangeText={v => setGeneralDraft(d => ({ ...d, schoolName: v }))} style={{ height: 38, borderWidth: 1, borderColor: generalErrors.schoolName ? '#FFC6C8' : '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, fontSize: 12, color: '#142F4D', backgroundColor: '#FFFFFF' }} />
                {generalErrors.schoolName && <Text style={{ color: '#D92E32', fontSize: 10, marginTop: 3 }}>{generalErrors.schoolName}</Text>}
              </View>

              {/* Academic Year */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 5 }}>Academic Year Start *</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 38, borderWidth: 1, borderColor: generalErrors.academicYear ? '#FFC6C8' : '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, backgroundColor: '#FFFFFF' }}>
                  <CalendarDays size={15} color="#647F9E" />
                  <TextInput value={generalDraft.academicYear} onChangeText={v => setGeneralDraft(d => ({ ...d, academicYear: v }))} placeholder="YYYY/YYYY" style={{ flex: 1, marginLeft: 8, fontSize: 12, color: '#142F4D', padding: 0 }} />
                </View>
                {generalErrors.academicYear ? <Text style={{ color: '#D92E32', fontSize: 10, marginTop: 3 }}>{generalErrors.academicYear}</Text> : <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 3 }}>Format: YYYY/YYYY</Text>}
              </View>

              {/* Grading Scale */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 5 }}>Grading Scale *</Text>
                <Pressable onPress={() => setGeneralDraft(d => ({ ...d, gradingScale: gradingScales[(gradingScales.indexOf(d.gradingScale) + 1) % gradingScales.length] }))} style={{ height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                  <Text style={{ color: '#142F4D', fontSize: 12 }}>{generalDraft.gradingScale}</Text><ChevronDown size={15} color="#647F9E" />
                </Pressable>
              </View>

              {/* Language */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 5 }}>Language *</Text>
                <Pressable onPress={() => setGeneralDraft(d => ({ ...d, language: languages[(languages.indexOf(d.language) + 1) % languages.length] }))} style={{ height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                  <Text style={{ color: '#142F4D', fontSize: 12 }}>{generalDraft.language}</Text><ChevronDown size={15} color="#647F9E" />
                </Pressable>
              </View>

              {/* Time Zone */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 5 }}>Time Zone *</Text>
                <Pressable onPress={() => setGeneralDraft(d => ({ ...d, timeZone: timeZones[(timeZones.indexOf(d.timeZone) + 1) % timeZones.length] }))} style={{ height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                  <Text style={{ color: '#142F4D', fontSize: 12 }} numberOfLines={1}>{generalDraft.timeZone}</Text><ChevronDown size={15} color="#647F9E" />
                </Pressable>
                <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 3 }}>Current time: Aug 26, 2025 10:22 AM</Text>
              </View>

              {/* CA Max */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 5 }}>Continuous Assessment Maximum *</Text>
                <TextInput value={generalDraft.caMax} onChangeText={v => setGeneralDraft(d => ({ ...d, caMax: v }))} keyboardType="numeric" style={{ height: 38, borderWidth: 1, borderColor: generalErrors.caMax ? '#FFC6C8' : '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, fontSize: 12, color: '#142F4D', backgroundColor: '#FFFFFF' }} />
                {generalErrors.caMax ? <Text style={{ color: '#D92E32', fontSize: 10, marginTop: 3 }}>{generalErrors.caMax}</Text> : <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 3 }}>Must be between 10 and 60</Text>}
              </View>

              {/* Buttons */}
              <View style={{ flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: '#E2EAF0', paddingTop: 14 }}>
                <Pressable onPress={() => setResetConfirm(true)} style={{ flex: 1, height: 36, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                  <Text style={{ color: '#274968', fontSize: 11, fontWeight: '700' }}>Reset to Default</Text>
                </Pressable>
                <Pressable onPress={saveGeneral} style={{ flex: 1, height: 36, backgroundColor: '#00513D', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Save Changes</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Right column — Notifications + Security + Audit Log stacked */}
        {(!veryCompact || tab !== 'General') && (
          <View style={{ flex: 1, minWidth: 0, gap: 14 }}>
            {/* Notifications + Security side-by-side */}
            {(!veryCompact || tab === 'Notifications' || tab === 'Security') && (
              <View style={{ flexDirection: veryCompact ? 'column' : 'row', gap: 14 }}>
                {/* Notifications */}
                {(!veryCompact || tab === 'Notifications') && (
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 8, padding: 16 }}>
                      <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800', marginBottom: 4 }}>Notifications</Text>
                      <Text style={{ color: '#647F9E', fontSize: 11, marginBottom: 14 }}>Manage when and how you receive notifications.</Text>
                      {[
                        { key: 'newUploads', icon: CloudUpload, title: 'New Result Uploads', desc: 'Get notified when new result batches are uploaded.' },
                        { key: 'batchUpdates', icon: ClipboardCheck, title: 'Batch Status Updates', desc: 'Receive updates on batch review and verification status.' },
                        { key: 'reportCards', icon: FileText, title: 'Report Card Updates', desc: 'Get notified about report card approvals and publications.' },
                        { key: 'systemAlerts', icon: AlertCircle, title: 'System Alerts', desc: 'Important system and security notifications.' },
                      ].map(p => (
                        <View key={p.key} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 11, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#E8EEF3' }}>
                          <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#DFF5E9', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><p.icon size={18} color="#08704F" /></View>
                          <View style={{ flex: 1, minWidth: 0 }}>
                            <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '700' }}>{p.title}</Text>
                            <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 3 }}>{p.desc}</Text>
                          </View>
                          <Toggle on={(notifications as any)[p.key]} onToggle={() => setNotifications(n => ({ ...n, [p.key]: !(n as any)[p.key] }))} />
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Security */}
                {(!veryCompact || tab === 'Security') && (
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 8, padding: 16 }}>
                      <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800', marginBottom: 4 }}>Security</Text>
                      <Text style={{ color: '#647F9E', fontSize: 11, marginBottom: 14 }}>Configure security and workflow settings.</Text>
                      {[
                        { key: 'requireApproval', icon: ShieldCheck, title: 'Require Approval for Publishing', desc: 'Enable approval workflow before publishing report cards.' },
                        { key: 'allowBulk', icon: Layers, title: 'Allow Bulk Operations', desc: 'Permit bulk actions for multiple records.' },
                        { key: 'twoFactor', icon: Shield, title: 'Two-Factor Authentication', desc: 'Require 2FA for administrator accounts. (Preference only — backend setup required.)' },
                      ].map(p => (
                        <View key={p.key} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 11, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#E8EEF3' }}>
                          <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#E0ECFF', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><p.icon size={18} color="#176DDA" /></View>
                          <View style={{ flex: 1, minWidth: 0 }}>
                            <Text style={{ color: '#142F4D', fontSize: 12, fontWeight: '700' }}>{p.title}</Text>
                            <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 3 }}>{p.desc}</Text>
                          </View>
                          <Toggle on={(security as any)[p.key]} onToggle={() => setSecurity(s => ({ ...s, [p.key]: !(s as any)[p.key] }))} />
                        </View>
                      ))}
                      <View style={{ marginTop: 14, marginBottom: 14 }}>
                        <Text style={{ color: '#244361', fontSize: 11, fontWeight: '700', marginBottom: 5 }}>Session Timeout</Text>
                        <Pressable onPress={() => setSecurity(s => ({ ...s, sessionTimeout: timeouts[(timeouts.indexOf(s.sessionTimeout) + 1) % timeouts.length] }))} style={{ height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                          <Text style={{ color: '#142F4D', fontSize: 12 }}>{security.sessionTimeout}</Text><ChevronDown size={15} color="#647F9E" />
                        </Pressable>
                      </View>
                      <Pressable onPress={() => show('Security settings saved (demo only)', 'success')} style={{ height: 36, backgroundColor: '#00513D', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Save Changes</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Audit Log */}
            {(!veryCompact || tab === 'Audit Log') && (
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 8, padding: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View>
                      <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800' }}>Audit Log</Text>
                      <Text style={{ color: '#647F9E', fontSize: 11, marginTop: 3 }}>Latest 50 activity events in the system.</Text>
                    </View>
                    <Pressable onPress={() => show('View Full Log requested (demo only — no full audit route exists)', 'info')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}>
                      <Text style={{ color: '#274968', fontSize: 11, fontWeight: '700' }}>View Full Log</Text>
                      <ArrowUpRight size={13} color="#55799B" />
                    </Pressable>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ minWidth: 900 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 36, paddingHorizontal: 10, backgroundColor: '#F0F3F6', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                        {['Timestamp', 'User', 'Action', 'Affected Record', 'Event Details'].map((h, i) => (
                          <Text key={h} style={{ width: [150, 150, 160, 170, 280][i], fontSize: 10, fontWeight: '800', color: '#244361', paddingRight: 5 }}>{h}</Text>
                        ))}
                      </View>
                      {AUDIT_LOG.map((row, idx) => {
                        const [abg, afg] = AUDIT_ACTION_COLORS[row.action] || ['#E2EAF0', '#334F6E'];
                        return (
                          <View key={row.id} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 42, paddingHorizontal: 10, borderBottomWidth: idx < AUDIT_LOG.length - 1 ? 1 : 0, borderBottomColor: '#E8EEF3' }}>
                            <Text style={{ width: 150, fontSize: 10, color: '#355779', paddingRight: 5 }}>{row.timestamp}</Text>
                            <Text numberOfLines={1} style={{ width: 150, fontSize: 10, color: '#355779', fontWeight: '600', paddingRight: 5 }}>{row.user}</Text>
                            <View style={{ width: 160 }}><View style={{ backgroundColor: abg, borderRadius: 11, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' }}><Text style={{ color: afg, fontSize: 9, fontWeight: '700' }}>{row.action}</Text></View></View>
                            <Text numberOfLines={1} style={{ width: 170, fontSize: 10, color: '#355779', paddingRight: 5 }}>{row.record}</Text>
                            <Text numberOfLines={2} style={{ width: 280, fontSize: 10, color: '#355779', paddingRight: 5 }}>{row.details}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </ScrollView>
                  <Text style={{ color: '#647F9E', fontSize: 10, marginTop: 10, fontStyle: 'italic' }}>Showing 8 of 8 sample events. Demo data — wire to audit API for real events.</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Reset Confirmation */}
      <Modal visible={resetConfirm} transparent animationType="fade" onRequestClose={() => setResetConfirm(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(6,28,40,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => setResetConfirm(false)}>
          <View style={{ width: '100%', maxWidth: 400, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 22 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFF7E6', borderWidth: 1, borderColor: '#FFE1B5', alignItems: 'center', justifyContent: 'center' }}><AlertCircle size={18} color="#D58A13" /></View>
              <Text style={{ color: '#142F4D', fontSize: 15, fontWeight: '800' }}>Reset to Defaults?</Text>
            </View>
            <Text style={{ color: '#647F9E', fontSize: 12, lineHeight: 18 }}>This will discard your current changes and restore the default values for all General Settings fields. This action cannot be undone.</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <Pressable onPress={() => setResetConfirm(false)} style={{ paddingHorizontal: 15, paddingVertical: 9, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, backgroundColor: '#FFFFFF' }}><Text style={{ color: '#405D7D', fontSize: 11, fontWeight: '700' }}>Cancel</Text></Pressable>
              <Pressable onPress={resetGeneral} style={{ backgroundColor: '#D58A13', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 15, paddingVertical: 9 }}><RefreshCw size={14} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Reset</Text></Pressable>
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

          {/* CONTENT — switches between Dashboard, School Configuration, Subjects & Classes, Students, Assessment Configuration, Users & Permissions, Upload Results, Review & Compile, Report Cards, and Settings */}
          {active === 'School Configuration' ? (
            <SchoolConfigScreen search={search} show={show} />
          ) : active === 'Subjects & Classes' ? (
            <SubjectsAndClassesScreen search={search} show={show} />
          ) : active === 'Students' ? (
            <StudentsScreen search={search} show={show} />
          ) : active === 'Assessment Configuration' ? (
            <AssessmentConfigScreen search={search} show={show} />
          ) : active === 'Users & Permissions' ? (
            <UsersPermissionsScreen search={search} show={show} />
          ) : active === 'Upload Results' ? (
            <UploadResultsScreen search={search} show={show} />
          ) : active === 'Review & Compile' ? (
            <ReviewCompileScreen search={search} show={show} />
          ) : active === 'Report Cards' ? (
            <ReportCardsScreen search={search} show={show} />
          ) : active === 'Settings' ? (
            <SettingsScreen search={search} show={show} />
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
                <Pressable key={label} onPress={() => {
                  const target = label === 'Total Students' ? 'Students' : label === 'Teachers' ? 'Users & Permissions' : label === 'Result Batches' ? 'Upload Results' : label === 'Published Report Cards' ? 'Report Cards' : null;
                  if (target) { setActive(target); show(`Opening ${target}...`, 'info'); } else { show(`${label}: ${val}`, 'info'); }
                }} style={{ flex: 1, minWidth: 200, minHeight: 120, backgroundColor: dark ? DK.card : '#FFFFFF', borderWidth: 1, borderColor: dark ? DK.border : '#E0E8EF', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 18, flexDirection: 'row', alignItems: 'flex-start', gap: 14, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}>
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
                        <Pressable onPress={() => {
                          const target = s.l === 'Uploaded' ? 'Upload Results' : s.l === 'Published' || s.l === 'Compiled' ? 'Report Cards' : 'Review & Compile';
                          setActive(target);
                          show(`Opening ${target}...`, 'info');
                        }} style={{ alignItems: 'center', width: 130 }}>
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
                <Pressable onPress={() => { setActive('Review & Compile'); show('Opening Review & Compile...', 'info'); }} style={{ backgroundColor: '#00513D', borderRadius: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 9, marginTop: 14, alignSelf: 'flex-start' }}>
                  <Eye size={16} color="#FFFFFF" /><Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Review Results</Text>
                </Pressable>
              </View>
            </View>

            {/* Batches + Activity */}
            <View style={{ flexDirection: narrow ? 'column' : 'row', gap: 18 }}>
              <View style={{ flex: narrow ? 1 : 1.65, minWidth: 0, backgroundColor: dark ? DK.card : '#FFFFFF', borderWidth: 1, borderColor: dark ? DK.border : '#DFE7EE', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ color: dark ? DK.ink : '#142F4D', fontSize: 15, fontWeight: '800' }}>Recent Result Batches</Text>
                  <Pressable onPress={() => { setActive('Review & Compile'); show('Opening Review & Compile...', 'info'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Text style={{ color: '#3E5F80', fontSize: 11, fontWeight: '600' }}>View all</Text><ArrowUpRight size={13} color="#55799B" /></Pressable>
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
                  <Pressable onPress={() => { setActive('Settings'); show('Opening Settings → Audit Log...', 'info'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Text style={{ color: '#3E5F80', fontSize: 11, fontWeight: '600' }}>View all</Text><ArrowUpRight size={13} color="#55799B" /></Pressable>
                </View>
                {ACTS.map((a, i) => (
                  <Pressable key={i} onPress={() => {
                    const target = a.t === 'Result uploaded' ? 'Upload Results' : a.t === 'Score corrected' || a.t === 'Result compiled' ? 'Review & Compile' : a.t === 'Report card published' ? 'Report Cards' : null;
                    if (target) { setActive(target); show(`Opening ${target}...`, 'info'); } else { show(`${a.t}: ${a.d}`, 'info'); }
                  }} style={{ flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: dark ? DK.border : '#E9EFF4' }}>
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
                <Pressable onPress={() => { setSelBatch(null); setActive('Review & Compile'); show('Opening Review & Compile...', 'info'); }} style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 7, backgroundColor: '#00513D' }}><Text style={{ fontSize: 12, fontWeight: '600', color: '#FFFFFF' }}>View Details</Text></Pressable>
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
