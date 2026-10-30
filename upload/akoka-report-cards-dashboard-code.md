# Akoka Federal Academy — Report Cards Dashboard

A React Native Web recreation of the supplied 1536 × 960 desktop screenshot.

> **Accuracy note:** This recreates the visible layout, colours, hierarchy, sample data, table, controls, and report-card preview. The school crest is drawn as an original SVG approximation because the screenshot does not provide the original crest artwork as a separate asset. Exact pixel identity for the crest, proprietary font, and tiny icon details cannot be guaranteed without the original assets.

## 1. Create the project

This implementation uses **Expo + React Native Web** so the same React Native components render in a desktop browser.

```bash
npx create-expo-app@latest akoka-report-dashboard
cd akoka-report-dashboard
npx expo install react-native-web react-dom @expo/metro-runtime react-native-svg
npm install lucide-react-native
```

Replace the generated `App.js` with the code in section 2.

Start the web app:

```bash
npx expo start --web
```

Open the browser at the local URL and set the viewport to **1536 × 960** for the closest comparison with the reference image.

## 2. `App.js`

```jsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path, Polygon, Line, Circle, Rect } from 'react-native-svg';
import {
  Home,
  Settings,
  BookOpen,
  Users,
  FileText,
  Shield,
  CloudUpload,
  ClipboardCheck,
  Bell,
  Sun,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2,
  Eye,
  Printer,
  MoreVertical,
  FileDown,
  Edit3,
  CheckCircle2,
  GraduationCap,
  Menu,
  X,
  CalendarDays,
  ChartNoAxesColumn,
} from 'lucide-react-native';

const C = {
  deep: '#003F32',
  deep2: '#002F27',
  green: '#08765F',
  green2: '#0B8B70',
  paleGreen: '#DDF5EC',
  ink: '#102F50',
  muted: '#6382A8',
  line: '#DCE8F2',
  line2: '#E8EFF5',
  bg: '#F7FAFC',
  white: '#FFFFFF',
  blue: '#2878D5',
  paleBlue: '#E1F0FF',
  orange: '#D88A12',
  paleOrange: '#FFF0D4',
  purple: '#8052D5',
  palePurple: '#F0E7FF',
};

const students = [
  { initials: 'JI', name: 'Hajara Abubakar', admission: 'AK/2024/0012', className: 'JSS3A', status: 'Published', date: 'Aug 24, 2025', tone: '#DCEBFF', action: 'print' },
  { initials: 'MO', name: 'Chukwuemeka Okafor', admission: 'AK/2023/0084', className: 'JSS3B', status: 'Awaiting Approval', date: 'Aug 23, 2025', tone: '#D9EAFE', action: 'approve' },
  { initials: 'AK', name: 'Amina Ibrahim', admission: 'AK/2024/0031', className: 'JSS2A', status: 'Draft', date: 'Aug 22, 2025', tone: '#EADFFF', action: 'edit' },
  { initials: 'AN', name: 'Oluwaseun Adeyemi', admission: 'AK/2022/0068', className: 'JSS3A', status: 'Published', date: 'Aug 21, 2025', tone: '#D9F4EA', action: 'print' },
  { initials: 'FH', name: 'Ifeoma Nwosu', admission: 'AK/2023/0045', className: 'SS1B', status: 'Under Review', date: 'Aug 20, 2025', tone: '#EEDFFF', action: 'none' },
  { initials: 'PA', name: 'Abdulrahman Bello', admission: 'AK/2024/0076', className: 'JSS2B', status: 'Draft', date: 'Aug 18, 2025', tone: '#D9F4EA', action: 'edit' },
  { initials: 'PY', name: 'Zainab Yusuf', admission: 'AK/2023/0029', className: 'SS3B', status: 'Awaiting Approval', date: 'Aug 17, 2025', tone: '#EADFFF', action: 'approve' },
  { initials: 'TB', name: 'Tunde Balogun', admission: 'AK/2024/0057', className: 'JSS1B', status: 'Published', date: 'Aug 16, 2025', tone: '#DCEBFF', action: 'print' },
  { initials: 'FK', name: 'Fatima Hashim', admission: 'AK/2024/0061', className: 'SS2A', status: 'Draft', date: 'Aug 15, 2025', tone: '#DCE8F4', action: 'edit' },
  { initials: 'IK', name: 'Ibrahim Musa', admission: 'AK/2023/0074', className: 'JSS3C', status: 'Under Review', date: 'Aug 14, 2025', tone: '#DCEBFF', action: 'none' },
];

const subjects = [
  ['1', 'Mathematics', '32', '52', '84', 'B2', 'Good'],
  ['2', 'English Language', '34', '50', '84', 'B2', 'Good'],
  ['3', 'Biology', '28', '48', '76', 'B3', 'Fair'],
  ['4', 'Chemistry', '30', '46', '76', 'B3', 'Fair'],
  ['5', 'Physics', '32', '50', '82', 'B2', 'Good'],
  ['6', 'Agricultural Science', '30', '48', '78', 'B3', 'Fair'],
  ['7', 'Economics', '34', '56', '90', 'A1', 'Excellent'],
  ['8', 'Government', '32', '58', '90', 'A1', 'Good'],
  ['9', 'Literature-in-English', '28', '44', '72', 'C4', 'Fair'],
  ['10', 'Civic Education', '36', '54', '90', 'A1', 'Excellent'],
  ['11', 'Computer Studies', '34', '52', '86', 'B2', 'Good'],
  ['12', 'Basic Science', '30', '48', '78', 'B3', 'Fair'],
];

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

function SmallButton({ children, onPress, style }) {
  return <Pressable onPress={onPress} style={[s.smallButton, style]}>{children}</Pressable>;
}

function NavItem({ icon: Icon, label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[s.navItem, active && s.navActive]}>
      <Icon size={22} color="#F2FFFB" strokeWidth={2.2} />
      <Text style={s.navText}>{label}</Text>
    </Pressable>
  );
}

function Sidebar({ activePage, setActivePage, collapsed, setCollapsed }) {
  const sections = [
    { title: 'OVERVIEW', items: [{ label: 'Dashboard', icon: Home }] },
    { title: 'SETUP', items: [
      { label: 'School Configuration', icon: Settings },
      { label: 'Subjects & Classes', icon: BookOpen },
      { label: 'Students', icon: Users },
      { label: 'Assessment Configuration', icon: FileText },
      { label: 'Users & Permissions', icon: Shield },
    ]},
    { title: 'WORKFLOW', items: [
      { label: 'Upload Results', icon: CloudUpload },
      { label: 'Review & Compile', icon: ClipboardCheck },
      { label: 'Report Cards', icon: FileText },
    ]},
    { title: 'SYSTEM', items: [{ label: 'Settings', icon: Settings }] },
  ];
  return (
    <View style={[s.sidebar, collapsed && s.sidebarCollapsed]}>
      <View style={s.brand}>
        <Crest size={48} light />
        {!collapsed && <View style={{ flex: 1 }}>
          <Text style={s.brandName}>Akoka Federal</Text>
          <Text style={s.brandName}>Academy</Text>
          <Text style={s.brandSub}>Result Compilation System</Text>
        </View>}
        <Pressable onPress={() => setCollapsed(!collapsed)} style={s.collapseButton}>
          {collapsed ? <Menu size={17} color="#FFFFFF" /> : <X size={15} color="#CBE7DF" />}
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={s.navScroll}>
        {sections.map(section => (
          <View key={section.title} style={s.navSection}>
            {!collapsed && <Text style={s.navSectionTitle}>{section.title}</Text>}
            {section.items.map(item => (
              <NavItem key={item.label} icon={item.icon} label={collapsed ? '' : item.label}
                active={activePage === item.label}
                onPress={() => setActivePage(item.label)} />
            ))}
          </View>
        ))}
      </ScrollView>
      {!collapsed && <View style={s.sidebarFooter}>
        <GraduationCap color="#E8FFF7" size={30} />
        <View>
          <Text style={s.footerSchool}>Akoka Federal Academy</Text>
          <Text style={s.footerMotto}>Excellence  ·  Discipline  ·  Success</Text>
        </View>
      </View>}
    </View>
  );
}

function SelectField({ label, value, width = 180 }) {
  return (
    <View style={[s.filterField, { width }]}>
      <Text style={s.filterLabel}>{label}</Text>
      <Pressable style={s.selectBox}>
        <Text style={s.selectValue}>{value}</Text>
        <ChevronDown size={14} color="#5B7DA3" />
      </Pressable>
    </View>
  );
}

function StatCard({ icon: Icon, label, value, change, tint, iconColor }) {
  return (
    <View style={s.statCard}>
      <View style={[s.statIcon, { backgroundColor: tint }]}>
        <Icon size={23} color={iconColor} strokeWidth={2.2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.statLabel}>{label}</Text>
        <Text style={s.statValue}>{value}</Text>
        <Text style={s.statChange}>↑  {change} from last term</Text>
      </View>
    </View>
  );
}

function Status({ status }) {
  const map = {
    Published: [ '#D9F4EA', '#08765F' ],
    'Awaiting Approval': [ '#DCEBFF', '#176CC7' ],
    Draft: [ '#FFF0D4', '#C47B0B' ],
    'Under Review': [ '#EEE4FF', '#7649C8' ],
  };
  const [bg, color] = map[status] || map.Draft;
  return <View style={[s.status, { backgroundColor: bg }]}><Text style={[s.statusText, { color }]}>{status === 'Draft' ? '› ' : ''}{status}</Text></View>;
}

function StudentRow({ student, onSelect }) {
  return (
    <View style={s.studentRow}>
      <View style={[s.avatar, { backgroundColor: student.tone }]}><Text style={s.avatarText}>{student.initials}</Text></View>
      <Text numberOfLines={1} style={[s.cellText, s.nameCell]}>{student.name}</Text>
      <Text style={[s.cellText, s.admissionCell]}>{student.admission}</Text>
      <Text style={[s.cellText, s.classCell]}>{student.className}</Text>
      <View style={s.sessionCell}><Text style={s.cellText}>2024/2025</Text><Text style={s.cellText}>Second Term</Text></View>
      <View style={s.statusCell}><Status status={student.status} /></View>
      <Text style={[s.cellText, s.dateCell]}>{student.date}</Text>
      <View style={s.actionsCell}>
        <SmallButton onPress={() => onSelect(student)}><Eye size={14} color="#35658F" /></SmallButton>
        {student.action !== 'none' && <SmallButton onPress={() => onSelect(student)}>
          {student.action === 'print' ? <Printer size={14} color="#35658F" /> :
           student.action === 'approve' ? <CheckCircle2 size={14} color="#10A477" /> :
           <Edit3 size={14} color="#35658F" />}
        </SmallButton>}
        <SmallButton onPress={() => onSelect(student)}><MoreVertical size={15} color="#35658F" /></SmallButton>
      </View>
    </View>
  );
}

function ReportCardPreview() {
  return (
    <View style={s.previewPanel}>
      <View style={s.previewHeader}>
        <Text style={s.previewTitle}>Report Card Preview</Text>
        <View style={s.previewActions}>
          <Pressable style={s.previewDarkButton}><FileDown size={12} color="#FFFFFF" /><Text style={s.previewDarkText}>Generate PDF</Text></Pressable>
          <Pressable style={s.previewPrint}><Printer size={13} color="#245C88" /><Text style={s.previewPrintText}>Print</Text></Pressable>
        </View>
      </View>
      <View style={s.paper}>
        <View style={s.paperHeading}>
          <Crest size={38} />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={s.paperSchool}>AKOKA FEDERAL ACADEMY</Text>
            <Text style={s.paperMotto}>Knowledge  |  Discipline  |  Excellence</Text>
          </View>
        </View>
        <Text style={s.paperSubtitle}>SECONDARY SCHOOL REPORT CARD</Text>
        <View style={s.paperSession}><Text>Academic Session: 2024/2025</Text><Text>|</Text><Text>Term: Second Term</Text></View>
        <View style={s.studentInfo}>
          <View style={s.infoColumn}>
            <Text>Student Name:  <Text style={s.infoBold}>Hajara Abubakar</Text></Text>
            <Text>Admission No:  <Text style={s.infoBold}>AK/2024/0012</Text></Text>
            <Text>Class:  <Text style={s.infoBold}>JSS3A</Text></Text>
            <Text>Date of Birth:  <Text style={s.infoBold}>Mar 12, 2008 (17 years)</Text></Text>
          </View>
          <View style={s.infoColumn}>
            <Text>Gender:  <Text style={s.infoBold}>Female</Text></Text>
            <Text>Class Teacher:  <Text style={s.infoBold}>Mrs. Grace Okafor</Text></Text>
            <Text>Position:  <Text style={s.infoBold}>3rd of 40</Text></Text>
            <Text>Resumption Date:  <Text style={s.infoBold}>Aug 18, 2025</Text></Text>
          </View>
        </View>
        <View style={s.scoreTable}>
          <View style={[s.scoreRow, s.scoreHead]}>
            {['S/N', 'SUBJECT', 'CA\\n(Max 40)', 'EXAM\\n(Max 60)', 'TOTAL\\n(Max 100)', 'GRADE', 'REMARK'].map((v, i) =>
              <View key={v} style={[s.scoreCell, i === 1 && s.subjectCol]}><Text style={s.scoreHeadText}>{v}</Text></View>)}
          </View>
          {subjects.map((row, idx) => (
            <View key={row[0]} style={[s.scoreRow, idx % 2 === 1 && { backgroundColor: '#FAFCFE' }]}>
              {row.map((value, i) => <View key={i} style={[s.scoreCell, i === 1 && s.subjectCol]}>
                <Text numberOfLines={1} style={[s.scoreText, i === 6 && { color: value === 'Excellent' ? '#0A9A68' : value === 'Fair' ? '#D58B16' : '#188A64' }]}>{value}</Text>
              </View>)}
            </View>
          ))}
        </View>
        <View style={s.resultSummary}>
          <Text>Class Position: <Text style={s.infoBold}>3rd of 40</Text></Text>
          <Text>Total Score: <Text style={s.infoBold}>944 / 1,200</Text></Text>
          <Text>Average: <Text style={s.infoBold}>78.7%</Text></Text>
          <Text>Grade: <Text style={s.infoBold}>B3</Text></Text>
        </View>
        <View style={s.assessmentCards}>
          <View style={s.assessmentBox}>
            <Text style={s.assessTitle}>Attendance</Text>
            <View style={s.attendanceContent}>
              <View><Text>Present:  78</Text><Text>Absent:   4</Text><Text>Late:       2</Text><Text>Total:    84</Text></View>
              <View style={s.donut}><Text style={s.donutText}>92.9%</Text></View>
            </View>
          </View>
          <View style={s.assessmentBox}>
            <Text style={s.assessTitle}>Affective Assessment</Text>
            <Text>Score:  <Text style={s.infoBold}>85 / 100</Text></Text>
            <Text>Grade:  <Text style={s.infoBold}>A1</Text></Text>
            <Text style={s.assessDescription}>Excellent attitude and cooperation.</Text>
          </View>
          <View style={s.assessmentBox}>
            <Text style={s.assessTitle}>Psychomotor Assessment</Text>
            <Text>Score:  <Text style={s.infoBold}>80 / 100</Text></Text>
            <Text>Grade:  <Text style={s.infoBold}>B2</Text></Text>
            <Text style={s.assessDescription}>Good practical skills and participation.</Text>
          </View>
        </View>
        <View style={s.commentBlock}>
          <Text style={s.commentTitle}>Class Teacher's Comment</Text>
          <Text>Hajara is a diligent and consistent student. She shows great potential and should continue to work hard.</Text>
        </View>
        <View style={s.commentBlock}>
          <Text style={s.commentTitle}>Principal's Comment</Text>
          <Text>Well done, Hajara. Keep up the good work.</Text>
        </View>
        <View style={s.signatureLine}>
          <Text>Akoka Federal Academy</Text><Text>|</Text><Text>Resumption Date: Aug 18, 2025</Text>
        </View>
        <View style={s.paperFooter}>
          <Pressable style={s.editScores}><Edit3 size={11} color="#FFFFFF" /><Text style={s.editScoresText}>Edit Underlying Scores</Text></Pressable>
          <Text style={s.readOnly}>Compiled scores, grades and positions are read-only. Edit the source records if needed.</Text>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const [activePage, setActivePage] = useState('Report Cards');
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [page, setPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);

  const filteredStudents = useMemo(() =>
    students.filter(item => `${item.name} ${item.admission} ${item.className}`.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const compact = width < 1120;
  const sidebarWidth = collapsed ? 76 : 255;

  return (
    <View style={[s.app, darkMode && { backgroundColor: '#EEF3F6' }]}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <View style={[s.main, { marginLeft: sidebarWidth }]}>
        <View style={s.topbar}>
          <View>
            <Text style={s.pageTitle}>{activePage}</Text>
            <Text style={s.pageSubtitle}>Generate, review, approve, and publish student report cards.</Text>
          </View>
          <View style={s.topbarRight}>
            <Pressable style={s.bell}><Bell size={20} color="#37668E" /><View style={s.notification}><Text style={s.notificationText}>3</Text></View></Pressable>
            <Pressable style={s.themeToggle} onPress={() => setDarkMode(!darkMode)}>
              <Sun size={16} color="#5B7DA3" /><View style={s.toggleTrack}><View style={s.toggleKnob} /></View>
            </Pressable>
            <View style={s.topDivider} />
            <View style={s.adminAvatar}><Text style={s.adminInitials}>AD</Text></View>
            <View><Text style={s.adminName}>Administrator</Text><Text style={s.adminRole}>School Admin</Text></View>
            <ChevronDown size={15} color="#47749B" />
          </View>
        </View>

        <ScrollView style={s.pageScroll} contentContainerStyle={s.pageContent} showsVerticalScrollIndicator={false}>
          <View style={s.filters}>
            <SelectField label="Academic Session" value="2024/2025" width={190} />
            <SelectField label="Term" value="Second Term" width={185} />
            <SelectField label="Class" value="JSS3" width={166} />
            <SelectField label="Class Arm" value="All Arms" width={185} />
            <SelectField label="Publication Status" value="All Statuses" width={202} />
          </View>

          <View style={s.statsRow}>
            <StatCard icon={FileDown} label="Total Report Cards" value="82" change="12%" tint="#DDF5EC" iconColor="#08765F" />
            <StatCard icon={FileText} label="Drafts" value="18" change="5%" tint="#FFF0D4" iconColor="#D58B16" />
            <StatCard icon={Users} label="Awaiting Approval" value="24" change="8%" tint="#DCEBFF" iconColor="#2478D0" />
            <StatCard icon={ClipboardCheck} label="Published" value="40" change="15%" tint="#DDF5EC" iconColor="#08765F" />
            <View style={s.statsActions}>
              <Pressable style={s.generateButton}><FileDown size={14} color="#FFFFFF" /><Text style={s.generateText}>Generate PDF</Text></Pressable>
              <Pressable style={s.printButton}><Printer size={14} color="#245C88" /><Text style={s.printText}>Print</Text></Pressable>
            </View>
          </View>

          <View style={[s.contentGrid, compact && { flexDirection: 'column' }]}>
            <View style={s.directory}>
              <Text style={s.sectionTitle}>Report Card Directory</Text>
              <View style={s.searchRow}>
                <View style={s.searchBox}><Search size={17} color="#6C8DB2" /><TextInput value={search} onChangeText={setSearch} placeholder="Search by student name, admission number..." placeholderTextColor="#86A0BF" style={s.searchInput} /></View>
                <Pressable style={s.clearButton} onPress={() => setSearch('')}><Trash2 size={14} color="#35658F" /><Text style={s.clearText}>Clear Filters</Text></Pressable>
              </View>
              <View style={s.table}>
                <View style={s.tableHeader}>
                  <Text style={[s.tableHeading, s.nameCell]}>Student Name</Text>
                  <Text style={[s.tableHeading, s.admissionCell]}>Admission No.</Text>
                  <Text style={[s.tableHeading, s.classCell]}>Class & Arm</Text>
                  <Text style={[s.tableHeading, s.sessionCell]}>Session / Term</Text>
                  <Text style={[s.tableHeading, s.statusCell]}>Status</Text>
                  <Text style={[s.tableHeading, s.dateCell]}>Last Compiled</Text>
                  <Text style={[s.tableHeading, s.actionsCell]}>Actions</Text>
                </View>
                {filteredStudents.map(student => <StudentRow key={student.admission} student={student} onSelect={setSelectedStudent} />)}
                {filteredStudents.length === 0 && <Text style={s.emptyText}>No matching report cards found.</Text>}
              </View>
              <View style={s.tableFooter}>
                <Text style={s.showingText}>Showing 1–{filteredStudents.length} of 82 report cards</Text>
                <View style={s.pagination}>
                  <Pressable style={s.pageButton} onPress={() => setPage(Math.max(1, page - 1))}><ChevronLeft size={14} color="#52799F" /></Pressable>
                  {[1, 2, 3, 4, 5].map(n => <Pressable key={n} onPress={() => setPage(n)} style={[s.pageButton, page === n && s.pageCurrent]}><Text style={[s.pageNumber, page === n && { color: '#FFFFFF' }]}>{n}</Text></Pressable>)}
                  <Text style={s.pageNumber}>...</Text>
                  <Pressable onPress={() => setPage(9)} style={s.pageButton}><Text style={s.pageNumber}>9</Text></Pressable>
                  <Pressable style={s.pageButton} onPress={() => setPage(Math.min(9, page + 1))}><ChevronRight size={14} color="#52799F" /></Pressable>
                </View>
              </View>
              {selectedStudent && <View style={s.selectionNotice}><Text style={s.selectionText}>Selected: {selectedStudent.name} · {selectedStudent.status}</Text><Pressable onPress={() => setSelectedStudent(null)}><X size={14} color="#35658F" /></Pressable></View>}
            </View>
            {!compact && <View style={s.previewColumn}><ReportCardPreview /></View>}
            {compact && <ReportCardPreview />}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  app: { flex: 1, minHeight: '100vh', backgroundColor: '#F7FAFC', flexDirection: 'row', fontFamily: 'Arial, sans-serif' },
  sidebar: { width: 255, backgroundColor: C.deep2, position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 10, paddingHorizontal: 10, paddingTop: 18, paddingBottom: 18 },
  sidebarCollapsed: { width: 76, paddingHorizontal: 8 },
  brand: { height: 74, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.12)', marginBottom: 20 },
  brandName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', lineHeight: 19 },
  brandSub: { color: '#E1F4EE', fontSize: 11, marginTop: 3 },
  collapseButton: { position: 'absolute', right: -2, top: 4, padding: 3, opacity: 0.0 },
  navScroll: { flex: 1 },
  navSection: { marginBottom: 22 },
  navSectionTitle: { color: '#D6EAE4', fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginHorizontal: 13, marginBottom: 9 },
  navItem: { height: 43, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 13, borderRadius: 7, marginBottom: 2 },
  navActive: { backgroundColor: '#126B57', borderWidth: 1, borderColor: 'rgba(90,205,169,0.18)' },
  navText: { color: '#F4FFFC', fontSize: 13, fontWeight: '500' },
  sidebarFooter: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 12, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)' },
  footerSchool: { color: '#FFFFFF', fontWeight: '700', fontSize: 11 },
  footerMotto: { color: '#C6E3D9', fontSize: 9, marginTop: 5 },
  main: { flex: 1, minWidth: 0, marginLeft: 255 },
  topbar: { height: 72, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E1EAF1', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  pageTitle: { color: '#064936', fontSize: 23, fontWeight: '800', letterSpacing: -0.4 },
  pageSubtitle: { color: '#6484A9', fontSize: 12, marginTop: 1 },
  topbarRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bell: { padding: 7, position: 'relative' },
  notification: { position: 'absolute', right: 2, top: 0, backgroundColor: '#E53945', width: 15, height: 15, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  notificationText: { color: '#FFFFFF', fontSize: 9, fontWeight: '700' },
  themeToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#DCE8F0', borderRadius: 20, padding: 4 },
  toggleTrack: { width: 34, height: 18, borderRadius: 10, backgroundColor: '#0A624F', justifyContent: 'center', paddingHorizontal: 2, alignItems: 'flex-end' },
  toggleKnob: { width: 14, height: 14, backgroundColor: '#FFFFFF', borderRadius: 8 },
  topDivider: { width: 1, height: 34, backgroundColor: '#DCE6EE', marginHorizontal: 4 },
  adminAvatar: { width: 39, height: 39, borderRadius: 20, backgroundColor: '#003E32', alignItems: 'center', justifyContent: 'center' },
  adminInitials: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  adminName: { color: '#183B5D', fontSize: 12, fontWeight: '700' },
  adminRole: { color: '#6C89A9', fontSize: 11, marginTop: 3 },
  pageScroll: { flex: 1 },
  pageContent: { padding: 19, paddingBottom: 28, minWidth: 950 },
  filters: { flexDirection: 'row', gap: 14, marginBottom: 20, flexWrap: 'nowrap' },
  filterField: { gap: 6 },
  filterLabel: { color: '#42668D', fontSize: 11, fontWeight: '700' },
  selectBox: { height: 33, borderWidth: 1, borderColor: '#D6E4EF', borderRadius: 6, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 11 },
  selectValue: { color: '#52769D', fontSize: 11 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 15, position: 'relative', paddingRight: 0 },
  statCard: { flex: 1, minWidth: 140, height: 100, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE8F1', borderRadius: 6, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 15 },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statLabel: { color: '#456A91', fontSize: 10, fontWeight: '600' },
  statValue: { color: '#102F50', fontSize: 22, fontWeight: '800', marginTop: 4 },
  statChange: { color: '#079675', fontSize: 10, marginTop: 3 },
  statsActions: { position: 'absolute', right: 9, top: 9, flexDirection: 'row', gap: 6 },
  generateButton: { height: 31, paddingHorizontal: 12, borderRadius: 5, backgroundColor: '#003F32', flexDirection: 'row', alignItems: 'center', gap: 7 },
  generateText: { color: '#FFFFFF', fontSize: 9, fontWeight: '700' },
  printButton: { height: 31, paddingHorizontal: 12, borderRadius: 5, borderWidth: 1, borderColor: '#D5E3ED', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 7 },
  printText: { color: '#245C88', fontSize: 9, fontWeight: '700' },
  contentGrid: { flexDirection: 'row', gap: 15, alignItems: 'flex-start' },
  directory: { flex: 1.7, minWidth: 0, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE8F1', borderRadius: 6, padding: 10 },
  sectionTitle: { color: '#102F50', fontSize: 15, fontWeight: '800', marginBottom: 14 },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  searchBox: { flex: 1, height: 34, borderWidth: 1, borderColor: '#D6E4EF', borderRadius: 6, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, gap: 10 },
  searchInput: { flex: 1, color: '#284D72', fontSize: 11, outlineStyle: 'none' },
  clearButton: { height: 34, borderWidth: 1, borderColor: '#D6E4EF', borderRadius: 6, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 7 },
  clearText: { color: '#456A91', fontSize: 10, fontWeight: '600' },
  table: { borderWidth: 1, borderColor: '#E1EAF2', borderRadius: 7, overflow: 'hidden' },
  tableHeader: { height: 41, backgroundColor: '#F3F7FA', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, gap: 7 },
  tableHeading: { color: '#345D85', fontSize: 9, fontWeight: '700' },
  studentRow: { minHeight: 53, borderTopWidth: 1, borderTopColor: '#E8EFF5', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, gap: 7 },
  avatar: { width: 29, height: 29, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { color: '#1762B5', fontSize: 11, fontWeight: '800' },
  cellText: { color: '#476C93', fontSize: 9, lineHeight: 14 },
  nameCell: { flex: 1.35, minWidth: 105 },
  admissionCell: { flex: 0.95, minWidth: 83 },
  classCell: { flex: 0.55, minWidth: 48 },
  sessionCell: { flex: 0.9, minWidth: 80, gap: 1 },
  statusCell: { flex: 1, minWidth: 100 },
  dateCell: { flex: 0.8, minWidth: 82 },
  actionsCell: { flex: 0.8, minWidth: 72, flexDirection: 'row', alignItems: 'center', gap: 4 },
  status: { alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 9, paddingVertical: 4 },
  statusText: { fontSize: 9, fontWeight: '600' },
  smallButton: { width: 26, height: 27, borderWidth: 1, borderColor: '#E0EAF2', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  emptyText: { color: '#6C89A9', textAlign: 'center', padding: 24, fontSize: 12 },
  tableFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingHorizontal: 4 },
  showingText: { color: '#6282A6', fontSize: 10 },
  pagination: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pageButton: { width: 22, height: 23, borderWidth: 1, borderColor: '#E1EAF2', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  pageCurrent: { backgroundColor: '#064C3B', borderColor: '#064C3B' },
  pageNumber: { color: '#52769B', fontSize: 10 },
  selectionNotice: { marginTop: 10, padding: 9, borderRadius: 5, backgroundColor: '#EAF5F1', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectionText: { color: '#08765F', fontSize: 11 },
  previewColumn: { width: '36%', minWidth: 390 },
  previewPanel: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE8F1', borderRadius: 6, padding: 10, width: '100%' },
  previewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  previewTitle: { color: '#102F50', fontSize: 14, fontWeight: '800' },
  previewActions: { flexDirection: 'row', gap: 6 },
  previewDarkButton: { height: 24, paddingHorizontal: 9, backgroundColor: '#06483B', borderRadius: 4, flexDirection: 'row', alignItems: 'center', gap: 5 },
  previewDarkText: { color: '#FFFFFF', fontSize: 8, fontWeight: '700' },
  previewPrint: { height: 24, paddingHorizontal: 10, borderWidth: 1, borderColor: '#DCE8F1', borderRadius: 4, flexDirection: 'row', alignItems: 'center', gap: 5 },
  previewPrintText: { color: '#245C88', fontSize: 8, fontWeight: '700' },
  paper: { borderWidth: 1, borderColor: '#9FC8D6', borderRadius: 2, padding: 8, backgroundColor: '#FFFFFF' },
  paperHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 35, minHeight: 43 },
  paperSchool: { color: '#123A57', fontFamily: 'Georgia, serif', fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },
  paperMotto: { color: '#3B6C8C', fontSize: 8, fontStyle: 'italic', marginTop: 3 },
  paperSubtitle: { color: '#123A57', fontFamily: 'Georgia, serif', fontSize: 11, fontWeight: '800', textAlign: 'center', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#B8D1DC' },
  paperSession: { height: 21, borderBottomWidth: 1, borderBottomColor: '#B8D1DC', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, color: '#315C7D', fontSize: 8 },
  studentInfo: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#B8D1DC', paddingVertical: 6 },
  infoColumn: { flex: 1, gap: 3, paddingHorizontal: 5 },
  infoBold: { color: '#173B59', fontWeight: '700' },
  scoreTable: { borderWidth: 1, borderColor: '#B8D0DB', marginTop: 6 },
  scoreRow: { flexDirection: 'row', minHeight: 16, borderBottomWidth: 1, borderBottomColor: '#DDE8ED', alignItems: 'center' },
  scoreHead: { backgroundColor: '#EEF4F7', minHeight: 30 },
  scoreCell: { flex: 0.8, minWidth: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2, borderRightWidth: 1, borderRightColor: '#DDE8ED', height: '100%' },
  subjectCol: { flex: 2.1, alignItems: 'flex-start', paddingLeft: 6 },
  scoreHeadText: { color: '#254E6B', fontSize: 7, fontWeight: '800', textAlign: 'center' },
  scoreText: { color: '#3B6080', fontSize: 7 },
  resultSummary: { minHeight: 25, borderWidth: 1, borderColor: '#DDE8ED', borderTopWidth: 0, backgroundColor: '#F8FBFC', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', paddingHorizontal: 3 },
  assessmentCards: { flexDirection: 'row', gap: 6, marginTop: 6 },
  assessmentBox: { flex: 1, minHeight: 78, borderWidth: 1, borderColor: '#DCE8EF', borderRadius: 5, padding: 6, gap: 3 },
  assessTitle: { color: '#315A7B', fontSize: 8, fontWeight: '800', marginBottom: 2 },
  attendanceContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  donut: { width: 27, height: 27, borderRadius: 15, borderWidth: 2, borderColor: '#0DA875', alignItems: 'center', justifyContent: 'center' },
  donutText: { color: '#0B8C69', fontSize: 5, fontWeight: '800' },
  assessDescription: { color: '#6483A0', fontSize: 7, lineHeight: 10, marginTop: 2 },
  commentBlock: { borderWidth: 1, borderColor: '#DCE8EF', borderTopWidth: 0, paddingHorizontal: 8, paddingVertical: 5, gap: 3 },
  commentTitle: { color: '#315A7B', fontSize: 8, fontWeight: '800' },
  signatureLine: { height: 23, borderBottomWidth: 1, borderColor: '#DCE8EF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, color: '#537797', fontSize: 7 },
  paperFooter: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingTop: 7 },
  editScores: { height: 24, paddingHorizontal: 10, backgroundColor: '#06483B', borderRadius: 4, flexDirection: 'row', alignItems: 'center', gap: 5 },
  editScoresText: { color: '#FFFFFF', fontSize: 8, fontWeight: '700' },
  readOnly: { color: '#6483A0', fontSize: 7, flex: 1, lineHeight: 10 },
});
```

## 3. Notes about the recreation

- The target is a **desktop-first browser layout**, not a phone-first native screen.
- The sidebar, filters, statistics, directory, and report preview are all rendered with React Native components.
- The search field filters the sample student rows.
- The pagination buttons update the selected page state.
- Clicking a student row's action buttons shows a small selected-student notice.
- The filter dropdowns and PDF/Print controls are visual controls in this front-end example. They are not connected to a backend or actual PDF generation/printing workflow.
- The report-card values and student records are mock data based on the screenshot.
- The crest is a custom SVG approximation. To make it exact, replace the `Crest` component with the academy's original transparent PNG or SVG logo.
- The icon set uses `lucide-react-native`. If the original app used a different icon pack or bespoke SVG icons, small differences in stroke shape may remain.

## 4. Matching the reference viewport

For the closest visual comparison:

1. Open the app in a desktop browser.
2. Set browser zoom to 100%.
3. Set the viewport to 1536 × 960.
4. Keep the browser's device emulation disabled.

The screenshot is a fixed desktop composition. At narrower widths, this implementation stacks the report preview below the directory rather than squeezing the desktop table into an unreadable width.
