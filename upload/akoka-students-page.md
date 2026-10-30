# Akoka Federal Academy — Students Page

React Native Web implementation of the supplied Students screen, following the existing dashboard conventions: shared sidebar and top bar, green palette, Lucide icons, compact tables, cards, and local React state.

**Target:** Desktop web using Expo + React Native Web.  
**Scope:** Students directory, search, class/status filters, pagination, selected-student profile panel, and an Add Student form. Data is illustrative and local to the screen; connect the handlers to your backend/API for persistence.

## Run

Reuse the dependencies in the existing project, or install:

```bash
npx expo install react-native-web react-dom @expo/metro-runtime react-native-svg
npm install lucide-react-native
```

Save the code below as `App.js`, then run:

```bash
npx expo start --web
```

## `App.js`

```jsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, TextInput, Pressable, StyleSheet,
  useWindowDimensions, Modal,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import {
  Home, Settings, BookOpen, Users, FileText, Shield, CloudUpload,
  ClipboardCheck, Bell, Sun, ChevronDown, ChevronLeft, ChevronRight,
  Search, CalendarDays, Pencil, GraduationCap, Menu, X, Plus,
  MoreVertical, Printer, UserRound, ShieldCheck, Clock3, User,
  ArrowUpRight, Eye,
} from 'lucide-react-native';

const C = {
  dark: '#00372D', dark2: '#002F27', green: '#08765F', green2: '#0B8B70',
  ink: '#142F4D', muted: '#647F9E', border: '#DCE6EE', bg: '#F7F9FB',
  blue: '#2675D2', purple: '#7950D2', orange: '#D58A13', red: '#D92E32',
};

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

const initialStudents = [
  { id: '1', initials: 'HA', name: 'Hajara Abubakar', admission: 'AK/2024/0012', gender: 'Female', classArm: 'JSS1A', guardian: 'Fatima Abubakar', status: 'Active', tone: 'green', dob: '14 Mar 2012', age: '13 years', phone: '+234 803 456 7890', session: '2024/2025', admissionYear: '2024', teacher: 'Mrs. O. Bello', scores: [['Mathematics', '78 / 100'], ['English Language', '84 / 100'], ['Basic Science', '81 / 100']], activity: [['Student record updated', '2 days ago'], ['Scores verified', '5 days ago']] },
  { id: '2', initials: 'CO', name: 'Chukwuemeka Okafor', admission: 'AK/2023/0084', gender: 'Male', classArm: 'SS2B', guardian: 'Emmanuel Okafor', status: 'Active', tone: 'blue', dob: '08 Nov 2008', age: '16 years', phone: '+234 803 123 4567', session: '2024/2025', admissionYear: '2023', teacher: 'Mr. T. Okafor', scores: [['Mathematics', '82 / 100'], ['English Language', '76 / 100'], ['Physics', '79 / 100']], activity: [['Scores verified', '1 day ago'], ['Class placement updated', '1 week ago']] },
  { id: '3', initials: 'AI', name: 'Amina Ibrahim', admission: 'AK/2024/0031', gender: 'Female', classArm: 'JSS2A', guardian: 'Musa Ibrahim', status: 'Active', tone: 'purple', dob: '21 Jun 2011', age: '14 years', phone: '+234 806 123 4567', session: '2024/2025', admissionYear: '2024', teacher: 'Mrs. L. Adebayo', scores: [['Mathematics', '88 / 100'], ['English Language', '80 / 100'], ['Basic Science', '85 / 100']], activity: [['Student record updated', '3 days ago'], ['Scores verified', '1 week ago']] },
  { id: '4', initials: 'OA', name: 'Oluwaseun Adeyemi', admission: 'AK/2022/0068', gender: 'Male', classArm: 'SS3A', guardian: 'Kemi Adeyemi', status: 'Active', tone: 'blue', dob: '04 Feb 2007', age: '18 years', phone: '+234 805 222 1190', session: '2024/2025', admissionYear: '2022', teacher: 'Mr. A. Adeyemi', scores: [['Mathematics', '91 / 100'], ['English Language', '83 / 100'], ['Physics', '87 / 100']], activity: [['Scores verified', '2 days ago'], ['Report card generated', '1 week ago']] },
  { id: '5', initials: 'IN', name: 'Ifeoma Nwosu', admission: 'AK/2023/0045', gender: 'Female', classArm: 'SS1B', guardian: 'Chukwuma Nwosu', status: 'Inactive', tone: 'purple', dob: '17 Sep 2009', age: '15 years', phone: '+234 809 321 4567', session: '2024/2025', admissionYear: '2023', teacher: 'Mrs. E. Hassan', scores: [['Mathematics', '65 / 100'], ['English Language', '72 / 100'], ['Biology', '69 / 100']], activity: [['Status changed to inactive', '2 weeks ago'], ['Scores verified', '3 weeks ago']] },
  { id: '6', initials: 'AB', name: 'Abdulrahman Bello', admission: 'AK/2024/0076', gender: 'Male', classArm: 'JSS2B', guardian: 'Aisha Bello', status: 'Active', tone: 'green', dob: '29 Jan 2011', age: '14 years', phone: '+234 802 555 0192', session: '2024/2025', admissionYear: '2024', teacher: 'Mrs. O. Bello', scores: [['Mathematics', '74 / 100'], ['English Language', '77 / 100'], ['Basic Science', '80 / 100']], activity: [['Student record updated', '4 days ago'], ['Scores verified', '6 days ago']] },
  { id: '7', initials: 'ZY', name: 'Zainab Yusuf', admission: 'AK/2023/0029', gender: 'Female', classArm: 'SS3B', guardian: 'Bashir Yusuf', status: 'Active', tone: 'purple', dob: '11 Dec 2007', age: '17 years', phone: '+234 807 444 8890', session: '2024/2025', admissionYear: '2023', teacher: 'Mr. C. Ibrahim', scores: [['Mathematics', '86 / 100'], ['English Language', '90 / 100'], ['Chemistry', '82 / 100']], activity: [['Scores verified', '2 days ago'], ['Report card generated', '4 days ago']] },
  { id: '8', initials: 'TB', name: 'Tunde Balogun', admission: 'AK/2024/0057', gender: 'Male', classArm: 'JSS1B', guardian: 'Funmilayo Balogun', status: 'Inactive', tone: 'blue', dob: '03 Apr 2012', age: '13 years', phone: '+234 814 777 0112', session: '2024/2025', admissionYear: '2024', teacher: 'Mr. D. Musa', scores: [['Mathematics', '71 / 100'], ['English Language', '68 / 100'], ['Basic Science', '73 / 100']], activity: [['Status changed to inactive', '1 month ago'], ['Student record updated', '1 month ago']] },
];

function Crest({ size = 48, light = false }) {
  const stroke = light ? '#FFFFFF' : '#075340';
  return (
    <Svg width={size} height={size * 1.12} viewBox="0 0 64 72">
      <Path d="M7 8 L32 3 L57 8 L56 42 Q52 58 32 68 Q12 58 8 42 Z" fill="none" stroke={stroke} strokeWidth="3.2" />
      <Path d="M13 13 L32 9 L51 13 L50 41 Q46 53 32 61 Q18 53 14 41 Z" fill="none" stroke={stroke} strokeWidth="1.3" />
      <Path d="M21 23 L28 18 L32 25 L36 18 L43 23 L39 31 L44 42 L37 42 L32 34 L27 42 L20 42 L25 31 Z" fill={stroke} />
      <Circle cx="32" cy="15" r="2" fill={stroke} />
    </Svg>
  );
}

function Sidebar({ active, setActive, collapsed }) {
  return <View style={[s.sidebar, collapsed && { width: 76 }]}>
    <View style={s.brand}><Crest size={48} light />{!collapsed && <View style={{ flex: 1 }}>
      <Text style={s.brandName}>Akoka Federal</Text><Text style={s.brandName}>Academy</Text>
      <Text style={s.brandSub}>Result Compilation System</Text>
    </View>}</View>
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {navGroups.map(group => <View key={group.heading} style={s.navGroup}>
        {!collapsed && <Text style={s.navHeading}>{group.heading}</Text>}
        {group.links.map(([label, Icon]) => <Pressable key={label} onPress={() => setActive(label)} style={[s.navLink, active === label && s.navSelected]}>
          <Icon size={20} color="#F1FFFA" strokeWidth={2.2} />
          {!collapsed && <Text style={s.navLabel}>{label}</Text>}
        </Pressable>)}
      </View>)}
    </ScrollView>
    {!collapsed && <View style={s.sideFooter}><GraduationCap size={26} color="#E8FFF7" /><View>
      <Text style={s.footerName}>Akoka Federal Academy</Text><Text style={s.footerMotto}>Excellence  ·  Discipline  ·  Success</Text>
    </View></View>}
  </View>;
}

function TopBar({ active, search, setSearch, collapsed, setCollapsed, dark, setDark }) {
  return <View style={s.topbar}>
    <View style={s.topLeft}>
      <Pressable onPress={() => setCollapsed(!collapsed)}><Menu size={19} color="#45698D" /></Pressable>
      <Text numberOfLines={1} style={s.topTitle}>{active}</Text>
    </View>
    <View style={s.globalSearch}><Search size={16} color="#8299B1" />
      <TextInput value={search} onChangeText={setSearch} placeholder="Search students, admission numbers, or classes..." placeholderTextColor="#8097B0" style={s.globalSearchInput} />
    </View>
    <View style={s.topRight}>
      <View style={s.bellWrap}><Bell size={19} color="#41698F" /><View style={s.badge}><Text style={s.badgeText}>3</Text></View></View>
      <Pressable onPress={() => setDark(!dark)} style={s.themeSwitch}><Sun size={15} color="#637F9D" /><View style={s.switchTrack}><View style={[s.switchDot, dark && { alignSelf: 'flex-start' }]} /></View></Pressable>
      <View style={s.topSeparator} /><View style={s.adminCircle}><Text style={s.adminInitials}>AD</Text></View>
      <View><Text style={s.adminName}>Administrator</Text><Text style={s.adminRole}>School Admin</Text></View><ChevronDown size={14} color="#527493" />
    </View>
  </View>;
}

function StatusPill({ status }) {
  return <View style={[s.statusPill, status === 'Inactive' ? s.inactivePill : s.activePill]}>
    <Text style={[s.statusText, status === 'Inactive' && { color: '#64748B' }]}>{status}</Text>
  </View>;
}

function Avatar({ student, size = 36 }) {
  const tones = {
    green: ['#D7F3E5', '#075B46'], blue: ['#DCE9FF', '#2467D1'],
    purple: ['#EBDDFF', '#6E35D4'], orange: ['#FFF0D4', '#B8790B'],
  };
  const [bg, fg] = tones[student.tone] || tones.green;
  return <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
    <Text style={[s.avatarText, { color: fg, fontSize: size * 0.34 }]}>{student.initials}</Text>
  </View>;
}

function StatCard({ icon: Icon, label, value, change, tone }) {
  const tones = { green: ['#DDF5E8', '#08754F'], blue: ['#DFECFF', '#176DDA'], purple: ['#EFE3FF', '#6E35D4'] };
  const [bg, fg] = tones[tone];
  return <View style={s.statCard}>
    <View style={[s.statIcon, { backgroundColor: bg }]}><Icon size={25} color={fg} /></View>
    <View style={{ flex: 1, minWidth: 0 }}>
      <Text style={s.statLabel}>{label}</Text><Text style={s.statValue}>{value}</Text>
      <View style={s.statChange}><ArrowUpRight size={14} color="#08754F" /><Text style={s.statChangeText}>{change}</Text></View>
    </View>
  </View>;
}

function StudentDirectory({ students, selectedId, onSelect, search, setSearch, classFilter, setClassFilter, statusFilter, setStatusFilter, onAdd, page, setPage }) {
  const classes = ['All Classes', 'JSS1A', 'JSS1B', 'JSS2A', 'JSS2B', 'SS1B', 'SS2B', 'SS3A', 'SS3B'];
  const statuses = ['All Statuses', 'Active', 'Inactive'];
  const filtered = useMemo(() => students.filter(student => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || [student.name, student.admission, student.classArm, student.guardian].some(value => value.toLowerCase().includes(q));
    const matchesClass = classFilter === 'All Classes' || student.classArm === classFilter;
    const matchesStatus = statusFilter === 'All Statuses' || student.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  }), [students, search, classFilter, statusFilter]);
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const chooseFilter = (setter, value) => { setter(value); setPage(1); };

  return <View style={s.directoryCard}>
    <View style={s.directoryHeader}>
      <Text style={s.sectionTitle}>Students Directory</Text>
      <Pressable style={s.primaryButton} onPress={onAdd}><Plus size={17} color="#FFFFFF" /><Text style={s.primaryButtonText}>Add Student</Text></Pressable>
    </View>
    <View style={s.filters}>
      <View style={s.directorySearch}><Search size={16} color="#8299B1" /><TextInput value={search} onChangeText={v => { setSearch(v); setPage(1); }} placeholder="Search by name or admission number..." placeholderTextColor="#8097B0" style={s.filterInput} /></View>
      <View style={s.filterSelect}><Text style={s.filterSelectText}>{classFilter}</Text><ChevronDown size={15} color="#41698F" /><View style={s.selectOptions}>{/* native-style picker below */}</View></View>
      <View style={s.filterSelect}><Text style={s.filterSelectText}>{statusFilter}</Text><ChevronDown size={15} color="#41698F" /></View>
    </View>
    <View style={s.filterControls}>
      <View style={s.filterControlSlot}>
        {classes.map(item => <Pressable key={item} onPress={() => chooseFilter(setClassFilter, item)} style={[s.filterOption, classFilter === item && s.filterOptionActive]}><Text style={[s.filterOptionText, classFilter === item && s.filterOptionTextActive]}>{item}</Text></Pressable>)}
      </View>
      <View style={s.filterControlSlot}>
        {statuses.map(item => <Pressable key={item} onPress={() => chooseFilter(setStatusFilter, item)} style={[s.filterOption, statusFilter === item && s.filterOptionActive]}><Text style={[s.filterOptionText, statusFilter === item && s.filterOptionTextActive]}>{item}</Text></Pressable>)}
      </View>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={s.table}>
        <View style={[s.studentRow, s.tableHeader]}>
          {['Student Name', 'Admission No.', 'Gender', 'Class & Arm', 'Guardian', 'Status', 'Actions'].map((label, i) =>
            <Text key={label} style={[s.tableHeadText, { width: [178, 120, 82, 92, 132, 82, 38][i] }]}>{label}</Text>)}
        </View>
        {visible.map(student => <Pressable key={student.id} onPress={() => onSelect(student.id)} style={[s.studentRow, s.tableBodyRow, selectedId === student.id && s.selectedRow]}>
          <View style={[s.nameCell, { width: 178 }]}><Avatar student={student} size={34} /><Text numberOfLines={1} style={s.studentName}>{student.name}</Text></View>
          <Text numberOfLines={1} style={[s.tableCell, { width: 120 }]}>{student.admission}</Text>
          <Text style={[s.tableCell, { width: 82 }]}>{student.gender}</Text>
          <Text style={[s.tableCell, { width: 92 }]}>{student.classArm}</Text>
          <Text numberOfLines={1} style={[s.tableCell, { width: 132 }]}>{student.guardian}</Text>
          <View style={{ width: 82, alignItems: 'flex-start' }}><StatusPill status={student.status} /></View>
          <Pressable style={{ width: 38, alignItems: 'center', justifyContent: 'center' }} onPress={() => onSelect(student.id)}><MoreVertical size={17} color="#41698F" /></Pressable>
        </Pressable>)}
        {!visible.length && <View style={s.emptyRows}><Text style={s.emptyText}>No students match your filters.</Text></View>}
      </View>
    </ScrollView>
    <View style={s.pagination}>
      <Text style={s.paginationInfo}>Showing {filtered.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length} students</Text>
      <View style={s.pageButtons}>
        <Pressable onPress={() => setPage(Math.max(1, safePage - 1))} style={s.pageButton}><ChevronLeft size={16} color="#41698F" /></Pressable>
        {Array.from({ length: pageCount }, (_, i) => i + 1).slice(0, 3).map(number => <Pressable key={number} onPress={() => setPage(number)} style={[s.pageButton, safePage === number && s.pageButtonActive]}><Text style={[s.pageNumber, safePage === number && s.pageNumberActive]}>{number}</Text></Pressable>)}
        {pageCount > 4 && <Text style={s.pageEllipsis}>…</Text>}
        {pageCount > 3 && <Pressable onPress={() => setPage(pageCount)} style={[s.pageButton, safePage === pageCount && s.pageButtonActive]}><Text style={[s.pageNumber, safePage === pageCount && s.pageNumberActive]}>{pageCount}</Text></Pressable>}
        <Pressable onPress={() => setPage(Math.min(pageCount, safePage + 1))} style={s.pageButton}><ChevronRight size={16} color="#41698F" /></Pressable>
      </View>
    </View>
  </View>;
}

function InfoSection({ icon: Icon, title, children }) {
  return <View style={s.infoSection}>
    <View style={s.infoHeading}><Icon size={19} color="#244361" /><Text style={s.infoTitle}>{title}</Text></View>
    {children}
  </View>;
}

function InfoRows({ rows }) {
  return <View style={s.infoBox}>{rows.map(([label, value]) => <View key={label} style={s.infoRow}>
    <Text style={s.infoLabel}>{label}</Text><Text numberOfLines={1} style={s.infoValue}>{value}</Text>
  </View>)}</View>;
}

function StudentProfile({ student, onClose, onEdit, onViewReport, onGenerateReport }) {
  if (!student) return <View style={[s.profileCard, s.noSelection]}><UserRound size={34} color="#9BAEC0" /><Text style={s.noSelectionTitle}>Select a student</Text><Text style={s.noSelectionText}>Choose a student from the directory to view their profile.</Text></View>;
  return <ScrollView style={s.profileCard} contentContainerStyle={s.profileContent} showsVerticalScrollIndicator={false}>
    <View style={s.profileDate}>
      <CalendarDays size={19} color="#41698F" /><View style={{ flex: 1 }}>
        <Text style={s.profileDateTitle}>Tuesday, 26 August 2025</Text>
        <Text style={s.profileDateSub}>Academic Session: {student.session}  |  Term: Second Term</Text>
      </View><Pressable onPress={onClose}><X size={19} color="#59728F" /></Pressable>
    </View>
    <View style={s.profileIdentity}>
      <Avatar student={student} size={60} /><View style={{ flex: 1, minWidth: 0 }}>
        <View style={s.identityNameLine}><Text numberOfLines={1} style={s.profileName}>{student.name}</Text><StatusPill status={student.status} /></View>
        <Text style={s.profileAdmission}>{student.admission}</Text>
      </View>
    </View>
    <View style={s.profileActions}>
      <Pressable style={s.editStudentButton} onPress={onEdit}><Pencil size={14} color="#FFFFFF" /><Text style={s.editStudentText}>Edit Student</Text></Pressable>
      <Pressable style={s.outlineAction} onPress={onViewReport}><FileText size={15} color="#274968" /><Text style={s.outlineActionText}>View Report Card</Text></Pressable>
      <Pressable style={s.outlineAction} onPress={onGenerateReport}><Printer size={15} color="#274968" /><Text style={s.outlineActionText}>Generate Report Card</Text></Pressable>
    </View>
    <InfoSection icon={UserRound} title="Personal Information">
      <InfoRows rows={ [['Gender', student.gender], ['Date of Birth', student.dob], ['Age', student.age]] } />
    </InfoSection>
    <InfoSection icon={User} title="Guardian Information">
      <InfoRows rows={ [['Guardian Name', student.guardian], ['Phone Number', student.phone]] } />
    </InfoSection>
    <InfoSection icon={GraduationCap} title="Academic Information">
      <InfoRows rows={ [['Academic Session', student.session], ['First Admission', student.admissionYear], ['Class Teacher', student.teacher]] } />
    </InfoSection>
    <InfoSection icon={ShieldCheck} title="Verified Scores">
      <View style={s.infoBox}>{student.scores.map(([subject, score]) => <View key={subject} style={s.scoreRow}>
        <Text numberOfLines={1} style={s.scoreSubject}>{subject}</Text><Text style={s.scoreValue}>{score}</Text><View style={s.verifiedPill}><Text style={s.verifiedText}>Verified</Text></View>
      </View>)}</View>
    </InfoSection>
    <InfoSection icon={Clock3} title="Recent Academic Activity">
      <View style={s.activityList}>{student.activity.map(([title, time], index) => <View key={title} style={s.activityRow}>
        <View style={s.activityTimeline}>{index === 0 && <View style={s.activityDot} />}<View style={s.activityLine} /></View>
        <Text style={s.activityTitle}>{title}</Text><Text style={s.activityTime}>{time}</Text>
      </View>)}</View>
    </InfoSection>
  </ScrollView>;
}

function StudentModal({ visible, student, onClose, onSave }) {
  const [form, setForm] = useState({});
  React.useEffect(() => {
    setForm(student ? { ...student } : { name: '', admission: '', gender: 'Female', classArm: 'JSS1A', guardian: '', status: 'Active', initials: '', tone: 'green', dob: '', age: '', phone: '', session: '2024/2025', admissionYear: '2025', teacher: '', scores: [], activity: [] });
  }, [student, visible]);
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const save = () => {
    if (!form.name?.trim() || !form.admission?.trim()) return;
    const initials = form.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
    onSave({ ...form, id: form.id || String(Date.now()), initials, tone: form.tone || 'green' });
    onClose();
  };
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={s.modalBackdrop}><View style={s.modalCard}>
      <View style={s.modalHeader}><View><Text style={s.modalTitle}>{student ? 'Edit Student' : 'Add Student'}</Text><Text style={s.modalSubtitle}>Enter the student's record details.</Text></View><Pressable onPress={onClose}><X size={20} color="#41698F" /></Pressable></View>
      <ScrollView style={{ maxHeight: 520 }} contentContainerStyle={s.modalFields}>
        {[['name', 'Student Name', 'e.g. Hajara Abubakar'], ['admission', 'Admission Number', 'e.g. AK/2025/0013'], ['guardian', 'Guardian Name', 'Enter guardian name'], ['phone', 'Guardian Phone', '+234...'], ['dob', 'Date of Birth', 'e.g. 14 Mar 2012'], ['teacher', 'Class Teacher', 'Enter class teacher']].map(([key, label, placeholder]) =>
          <View key={key} style={s.modalField}><Text style={s.modalLabel}>{label}</Text><TextInput value={form[key] || ''} onChangeText={value => update(key, value)} placeholder={placeholder} placeholderTextColor="#93A4B6" style={s.modalInput} /></View>)}
        <View style={s.modalField}><Text style={s.modalLabel}>Gender</Text><View style={s.modalChoiceRow}>{['Female', 'Male'].map(value => <Pressable key={value} onPress={() => update('gender', value)} style={[s.choiceButton, form.gender === value && s.choiceButtonActive]}><Text style={[s.choiceText, form.gender === value && s.choiceTextActive]}>{value}</Text></Pressable>)}</View></View>
        <View style={s.modalField}><Text style={s.modalLabel}>Class & Arm</Text><View style={s.modalChoiceRow}>{['JSS1A', 'JSS1B', 'JSS2A', 'JSS2B', 'SS1B', 'SS2B', 'SS3A', 'SS3B'].map(value => <Pressable key={value} onPress={() => update('classArm', value)} style={[s.choiceButton, form.classArm === value && s.choiceButtonActive]}><Text style={[s.choiceText, form.classArm === value && s.choiceTextActive]}>{value}</Text></Pressable>)}</View></View>
        <View style={s.modalField}><Text style={s.modalLabel}>Status</Text><View style={s.modalChoiceRow}>{['Active', 'Inactive'].map(value => <Pressable key={value} onPress={() => update('status', value)} style={[s.choiceButton, form.status === value && s.choiceButtonActive]}><Text style={[s.choiceText, form.status === value && s.choiceTextActive]}>{value}</Text></Pressable>)}</View></View>
      </ScrollView>
      <View style={s.modalFooter}><Pressable style={s.cancelButton} onPress={onClose}><Text style={s.cancelButtonText}>Cancel</Text></Pressable><Pressable style={s.primaryButton} onPress={save}><Text style={s.primaryButtonText}>Save Student</Text></Pressable></View>
    </View></View>
  </Modal>;
}

export default function App() {
  const { width } = useWindowDimensions();
  const compact = width < 1180;
  const [active, setActive] = useState('Students');
  const [globalSearch, setGlobalSearch] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [students, setStudents] = useState(initialStudents);
  const [selectedId, setSelectedId] = useState('1');
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [notice, setNotice] = useState('');
  const selectedStudent = students.find(student => student.id === selectedId) || null;

  const openAdd = () => { setEditingStudent(null); setModalVisible(true); };
  const openEdit = () => { setEditingStudent(selectedStudent); setModalVisible(true); };
  const saveStudent = student => {
    setStudents(current => current.some(item => item.id === student.id)
      ? current.map(item => item.id === student.id ? student : item)
      : [student, ...current]);
    setSelectedId(student.id);
    setNotice('Student record saved locally.');
  };
  const actionNotice = message => setNotice(message);

  return <View style={[s.app, dark && { backgroundColor: '#EAF0F4' }]}>
    <Sidebar active={active} setActive={setActive} collapsed={collapsed} />
    <View style={s.main}>
      <TopBar active={active} search={globalSearch} setSearch={setGlobalSearch} collapsed={collapsed} setCollapsed={setCollapsed} dark={dark} setDark={setDark} />
      <View style={s.contentLayout}>
        <ScrollView style={s.mainScroll} contentContainerStyle={s.mainContent} showsVerticalScrollIndicator={false}>
          <View style={s.pageHeading}>
            <View style={{ flex: 1 }}><Text style={s.pageTitle}>Students</Text><Text style={s.pageSubtitle}>Manage student records, class placement, and academic profiles.</Text></View>
            <View style={s.dateCard}><CalendarDays size={20} color="#41698F" /><View><Text style={s.dateTitle}>Tuesday, 26 August 2025</Text><Text style={s.dateSubtitle}>Academic Session: 2024/2025  |  Term: Second Term</Text></View></View>
          </View>
          <View style={s.statsRow}>
            <StatCard icon={Users} label="Total Students" value="140" change="2 new this term" tone="green" />
            <StatCard icon={UserRound} label="Active Students" value="136" change="2 new this term" tone="blue" />
            <StatCard icon={Users} label="Class Arms" value="18" change="1 new this term" tone="purple" />
          </View>
          <StudentDirectory students={students} selectedId={selectedId} onSelect={setSelectedId} search={search || globalSearch} setSearch={setSearch} classFilter={classFilter} setClassFilter={setClassFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onAdd={openAdd} page={page} setPage={setPage} />
          {notice ? <Pressable style={s.notice} onPress={() => setNotice('')}><Text style={s.noticeText}>{notice}  ×</Text></Pressable> : null}
        </ScrollView>
        {!compact && <View style={s.profileColumn}>
          <StudentProfile student={selectedStudent} onClose={() => setSelectedId(null)} onEdit={openEdit}
            onViewReport={() => actionNotice(`Report card view requested for ${selectedStudent?.name || 'student'}.`)}
            onGenerateReport={() => actionNotice(`Report card generation requested for ${selectedStudent?.name || 'student'}.`)} />
        </View>}
      </View>
      {compact && selectedStudent && <View style={s.mobileProfileBar}><Avatar student={selectedStudent} size={32} /><View style={{ flex: 1 }}><Text style={s.mobileProfileName}>{selectedStudent.name}</Text><Text style={s.mobileProfileSub}>{selectedStudent.admission}</Text></View><Pressable onPress={() => actionNotice(`Profile selected: ${selectedStudent.name}`)}><Eye size={18} color="#41698F" /></Pressable></View>}
    </View>
    <StudentModal visible={modalVisible} student={editingStudent} onClose={() => setModalVisible(false)} onSave={saveStudent} />
  </View>;
}

const s = StyleSheet.create({
  app: { flex: 1, flexDirection: 'row', backgroundColor: '#F7F9FB', minHeight: '100vh', fontFamily: 'Arial' },
  sidebar: { width: 258, backgroundColor: '#00372D', paddingTop: 18, paddingHorizontal: 10, minHeight: '100vh' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 10, paddingBottom: 26 },
  brandName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', lineHeight: 19 },
  brandSub: { color: '#D2E6DF', fontSize: 10, marginTop: 3 },
  navGroup: { marginBottom: 16 },
  navHeading: { color: '#C6DCD5', fontSize: 10, fontWeight: '800', letterSpacing: 0.6, marginHorizontal: 12, marginBottom: 8, marginTop: 4 },
  navLink: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 10, paddingHorizontal: 13, borderRadius: 7, marginBottom: 3, minHeight: 38 },
  navSelected: { backgroundColor: '#176451' },
  navLabel: { color: '#F2FBF8', fontSize: 12, fontWeight: '500' },
  sideFooter: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 8, paddingVertical: 22 },
  footerName: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  footerMotto: { color: '#D0E5DE', fontSize: 9, marginTop: 4 },
  main: { flex: 1, minWidth: 0, backgroundColor: '#F7F9FB' },
  topbar: { minHeight: 69, flexDirection: 'row', alignItems: 'center', gap: 20, paddingHorizontal: 22, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E0E7ED' },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, width: 196 },
  topTitle: { color: '#142F4D', fontSize: 22, fontWeight: '700', flexShrink: 1 },
  globalSearch: { height: 39, flex: 1, maxWidth: 520, borderWidth: 1, borderColor: '#D7E2EB', borderRadius: 7, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF' },
  globalSearchInput: { flex: 1, color: '#142F4D', fontSize: 12, outlineStyle: 'none' },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 13, marginLeft: 'auto' },
  bellWrap: { padding: 5, position: 'relative' },
  badge: { position: 'absolute', right: 0, top: -2, width: 15, height: 15, borderRadius: 8, backgroundColor: '#E53838', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '700' },
  themeSwitch: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: '#E0E7ED', borderRadius: 20, paddingHorizontal: 5, paddingVertical: 4 },
  switchTrack: { width: 30, height: 16, borderRadius: 9, backgroundColor: '#0B6A50', justifyContent: 'center', paddingHorizontal: 2 },
  switchDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF', alignSelf: 'flex-end' },
  topSeparator: { width: 1, height: 36, backgroundColor: '#DCE5EC', marginHorizontal: 2 },
  adminCircle: { width: 37, height: 37, borderRadius: 20, backgroundColor: '#064C3C', alignItems: 'center', justifyContent: 'center' },
  adminInitials: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  adminName: { color: '#142F4D', fontSize: 12, fontWeight: '700' },
  adminRole: { color: '#647F9E', fontSize: 10, marginTop: 3 },
  contentLayout: { flex: 1, flexDirection: 'row', minHeight: 0 },
  mainScroll: { flex: 1, minWidth: 0 },
  mainContent: { padding: 23, paddingBottom: 30, gap: 18 },
  pageHeading: { flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 2 },
  pageTitle: { color: '#064C3C', fontSize: 29, fontWeight: '800', letterSpacing: -0.5 },
  pageSubtitle: { color: '#647F9E', fontSize: 13, marginTop: 4 },
  dateCard: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 12, paddingVertical: 11, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, backgroundColor: '#FFFFFF' },
  dateTitle: { color: '#244361', fontSize: 11, fontWeight: '600' },
  dateSubtitle: { color: '#647F9E', fontSize: 9, marginTop: 5 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, minWidth: 0, minHeight: 122, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, padding: 17, flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  statIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statLabel: { color: '#244361', fontSize: 12, marginTop: 2 },
  statValue: { color: '#142F4D', fontSize: 28, fontWeight: '800', marginTop: 3 },
  statChange: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 8 },
  statChangeText: { color: '#08754F', fontSize: 10, fontWeight: '600' },
  directoryCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7, padding: 12 },
  directoryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { color: '#142F4D', fontSize: 17, fontWeight: '800' },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, minHeight: 34, paddingHorizontal: 14, borderRadius: 6, backgroundColor: '#00513D' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  filters: { flexDirection: 'row', gap: 9, marginBottom: 10 },
  directorySearch: { flex: 1, minWidth: 150, height: 36, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10 },
  filterInput: { flex: 1, minWidth: 0, color: '#142F4D', fontSize: 11, outlineStyle: 'none' },
  filterSelect: { width: 150, minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 11, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6 },
  filterSelectText: { color: '#244361', fontSize: 11 },
  filterControls: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  filterControlSlot: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, alignItems: 'center' },
  filterOption: { display: 'none', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 5, borderWidth: 1, borderColor: '#DCE6EE' },
  filterOptionActive: { backgroundColor: '#E2F4EC', borderColor: '#B8E3D0' },
  filterOptionText: { fontSize: 10, color: '#41698F' },
  filterOptionTextActive: { color: '#075B46', fontWeight: '700' },
  table: { minWidth: 724, flex: 1 },
  studentRow: { flexDirection: 'row', alignItems: 'center' },
  tableHeader: { minHeight: 38, paddingHorizontal: 10, backgroundColor: '#F0F3F6', borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  tableHeadText: { color: '#244361', fontSize: 10, fontWeight: '800', paddingRight: 5 },
  tableBodyRow: { minHeight: 49, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#E8EEF3' },
  selectedRow: { backgroundColor: '#E4F6ED', borderWidth: 1, borderColor: '#9DD9BF', borderRadius: 5 },
  nameCell: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 8 },
  avatar: { alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontWeight: '800' },
  studentName: { color: '#142F4D', fontSize: 10, fontWeight: '700', flexShrink: 1 },
  tableCell: { color: '#244361', fontSize: 10, paddingRight: 5 },
  statusPill: { borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  activePill: { backgroundColor: '#D7F3E5' },
  inactivePill: { backgroundColor: '#E9EEF4' },
  statusText: { color: '#075B46', fontSize: 9, fontWeight: '700' },
  emptyRows: { padding: 24, alignItems: 'center' },
  emptyText: { color: '#647F9E', fontSize: 12 },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 12 },
  paginationInfo: { color: '#647F9E', fontSize: 10 },
  pageButtons: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  pageButton: { minWidth: 28, height: 29, paddingHorizontal: 6, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  pageButtonActive: { backgroundColor: '#006044', borderColor: '#006044' },
  pageNumber: { color: '#41698F', fontSize: 11 },
  pageNumberActive: { color: '#FFFFFF', fontWeight: '800' },
  pageEllipsis: { color: '#647F9E', paddingHorizontal: 2 },
  profileColumn: { width: 378, borderLeftWidth: 2, borderLeftColor: '#D5E0E8', backgroundColor: '#F8FAFC', padding: 16, paddingLeft: 14 },
  profileCard: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 7 },
  profileContent: { paddingBottom: 14 },
  profileDate: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' },
  profileDateTitle: { color: '#244361', fontSize: 11, fontWeight: '700' },
  profileDateSub: { color: '#647F9E', fontSize: 9, marginTop: 5 },
  profileIdentity: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 10 },
  identityNameLine: { flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap' },
  profileName: { color: '#142F4D', fontSize: 14, fontWeight: '800', maxWidth: 175 },
  profileAdmission: { color: '#647F9E', fontSize: 11, marginTop: 5 },
  profileActions: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingBottom: 12 },
  editStudentButton: { minHeight: 32, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: '#00513D', borderRadius: 5 },
  editStudentText: { color: '#FFFFFF', fontSize: 9, fontWeight: '700' },
  outlineAction: { minHeight: 32, paddingHorizontal: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5 },
  outlineActionText: { color: '#274968', fontSize: 9, fontWeight: '600' },
  infoSection: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 9, borderTopWidth: 1, borderTopColor: '#E7EDF2' },
  infoHeading: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 },
  infoTitle: { color: '#142F4D', fontSize: 13, fontWeight: '800' },
  infoBox: { borderWidth: 1, borderColor: '#E1E9F0', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 7 },
  infoRow: { flexDirection: 'row', alignItems: 'center', minHeight: 25, gap: 8 },
  infoLabel: { color: '#647F9E', fontSize: 10, flex: 1 },
  infoValue: { color: '#244361', fontSize: 10, fontWeight: '600', flex: 1.1 },
  scoreRow: { minHeight: 27, flexDirection: 'row', alignItems: 'center', gap: 5, borderBottomWidth: 1, borderBottomColor: '#EEF2F5' },
  scoreSubject: { color: '#244361', fontSize: 9, flex: 1.5 },
  scoreValue: { color: '#244361', fontSize: 9, fontWeight: '700', flex: 0.8 },
  verifiedPill: { backgroundColor: '#D7F3E5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  verifiedText: { color: '#075B46', fontSize: 8, fontWeight: '700' },
  activityList: { paddingTop: 1 },
  activityRow: { minHeight: 28, flexDirection: 'row', alignItems: 'center', gap: 10 },
  activityTimeline: { width: 13, alignItems: 'center', alignSelf: 'stretch', justifyContent: 'center' },
  activityDot: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: '#08765F', zIndex: 1 },
  activityLine: { width: 1, flex: 1, backgroundColor: '#A9D9C5' },
  activityTitle: { color: '#244361', fontSize: 10, flex: 1 },
  activityTime: { color: '#647F9E', fontSize: 9, width: 70 },
  noSelection: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 },
  noSelectionTitle: { color: '#142F4D', fontSize: 15, fontWeight: '700' },
  noSelectionText: { color: '#647F9E', fontSize: 11, textAlign: 'center' },
  mobileProfileBar: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderTopWidth: 1, borderTopColor: '#DCE6EE', backgroundColor: '#FFFFFF' },
  mobileProfileName: { color: '#142F4D', fontSize: 12, fontWeight: '700' },
  mobileProfileSub: { color: '#647F9E', fontSize: 10, marginTop: 3 },
  notice: { padding: 10, borderRadius: 6, backgroundColor: '#DDF5E8', alignSelf: 'flex-start' },
  noticeText: { color: '#075B46', fontSize: 11, fontWeight: '600' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(6, 28, 40, 0.45)', justifyContent: 'center', alignItems: 'center', padding: 18 },
  modalCard: { width: '100%', maxWidth: 600, maxHeight: '90%', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E2EAF0' },
  modalTitle: { color: '#142F4D', fontSize: 20, fontWeight: '800' },
  modalSubtitle: { color: '#647F9E', fontSize: 12, marginTop: 5 },
  modalFields: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingTop: 16, paddingBottom: 12 },
  modalField: { width: '48%', flexGrow: 1, minWidth: 190, gap: 6 },
  modalLabel: { color: '#244361', fontSize: 11, fontWeight: '700' },
  modalInput: { height: 38, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6, paddingHorizontal: 10, color: '#142F4D', fontSize: 12, outlineStyle: 'none' },
  modalChoiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  choiceButton: { paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 5 },
  choiceButtonActive: { borderColor: '#0B765B', backgroundColor: '#E2F4EC' },
  choiceText: { color: '#41698F', fontSize: 10 },
  choiceTextActive: { color: '#075B46', fontWeight: '700' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#E2EAF0' },
  cancelButton: { minHeight: 35, paddingHorizontal: 16, justifyContent: 'center', borderWidth: 1, borderColor: '#DCE6EE', borderRadius: 6 },
  cancelButtonText: { color: '#274968', fontSize: 11, fontWeight: '700' },
});
```

## Notes

- The sidebar and top bar follow the dashboard convention. The Students item is highlighted.
- Search, class/status filters, pagination, student selection, and the Add/Edit Student modal use local React state.
- The screenshot shows a directory total of 140 students, 136 active students, and 18 class arms. The bundled sample dataset contains eight visible example records; connect the directory to your API for the full 140 records.
- Report-card actions currently show a local confirmation notice. Wire them to the report-card screen/API.
- The right profile panel displays personal, guardian, academic, score, and recent-activity information for the selected student.
