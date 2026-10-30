# Akoka Federal Academy — School Configuration Page

A standalone React Native Web implementation of the School Configuration page, following the conventions used by the existing Akoka Federal Academy Results Dashboard.

**Reference screenshot:** School Configuration Dashboard UI  
**Recommended runtime:** Expo + React Native Web  
**Implementation target:** Replace the dashboard's main content with the School Configuration page while preserving the shared application shell.

## 1. Requirements

- Keep the existing React Native Web approach and styling conventions.
- Reuse the dashboard's shared sidebar, top navigation, crest, colors, and Lucide icon style.
- Highlight **School Configuration** in the sidebar.
- Recreate the page layout and content shown in the reference screenshot.
- Implement frontend interactions using local React state.
- Do not claim that actions persist to a database; backend persistence is not included.

## 2. Install dependencies

If using the existing dashboard project, retain its dependencies. Otherwise:

```bash
npx create-expo-app@latest akoka-school-configuration
cd akoka-school-configuration
npx expo install react-native-web react-dom @expo/metro-runtime react-native-svg
npm install lucide-react-native
```

Save the implementation below as `App.js`, then run:

```bash
npx expo start --web
```

For visual comparison, use a desktop viewport close to **1471 × 1024** at 100% browser zoom.

## 3. `App.js`

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
  Modal,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
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
  Search,
  CalendarDays,
  Pencil,
  GraduationCap,
  Menu,
  Plus,
  MoreVertical,
  MapPin,
  School,
  UserRound,
  ChevronUp,
  X,
  Check,
} from 'lucide-react-native';

const COLORS = {
  dark: '#00372D',
  dark2: '#002F27',
  green: '#08765F',
  green2: '#0B8B70',
  ink: '#142F4D',
  muted: '#647F9E',
  border: '#DCE6EE',
  bg: '#F7F9FB',
  blue: '#2675D2',
  red: '#D92E32',
  successBg: '#D9F4E6',
  success: '#08754F',
  upcomingBg: '#DFECFF',
  upcoming: '#236FD0',
};

const navGroups = [
  { heading: 'OVERVIEW', links: [['Dashboard', Home]] },
  {
    heading: 'SETUP',
    links: [
      ['School Configuration', Settings],
      ['Subjects & Classes', BookOpen],
      ['Students', Users],
      ['Assessment Configuration', FileText],
      ['Users & Permissions', Shield],
    ],
  },
  {
    heading: 'WORKFLOW',
    links: [
      ['Upload Results', CloudUpload],
      ['Review & Compile', ClipboardCheck],
      ['Report Cards', FileText],
    ],
  },
  { heading: 'SYSTEM', links: [['Settings', Settings]] },
];

const initialTerms = [
  { id: 'first', name: 'First Term', startDate: 'Sep 8, 2025', endDate: 'Dec 12, 2025', status: 'Active' },
  { id: 'second', name: 'Second Term', startDate: 'Jan 5, 2026', endDate: 'Apr 10, 2026', status: 'Upcoming' },
  { id: 'third', name: 'Third Term', startDate: 'May 4, 2026', endDate: 'Jul 31, 2026', status: 'Upcoming' },
];

const initialGrades = [
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

function Sidebar({ active, setActive, collapsed }) {
  return (
    <View style={[s.sidebar, collapsed && s.sidebarCollapsed]}>
      <View style={s.brand}>
        <Crest size={45} light />
        {!collapsed && (
          <View style={{ flex: 1 }}>
            <Text style={s.brandName}>Akoka Federal</Text>
            <Text style={s.brandName}>Academy</Text>
            <Text style={s.brandSub}>Result Compilation System</Text>
          </View>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {navGroups.map((group) => (
          <View key={group.heading} style={s.navGroup}>
            {!collapsed && <Text style={s.navHeading}>{group.heading}</Text>}
            {group.links.map(([label, Icon]) => (
              <Pressable
                key={label}
                onPress={() => setActive(label)}
                style={[s.navLink, active === label && s.navSelected]}
              >
                <Icon size={20} color="#F1FFFA" strokeWidth={2.2} />
                {!collapsed && <Text style={s.navLabel}>{label}</Text>}
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>

      {!collapsed && (
        <View style={s.sideFooter}>
          <GraduationCap size={27} color="#E8FFF7" />
          <View>
            <Text style={s.footerName}>Akoka Federal Academy</Text>
            <Text style={s.footerMotto}>Excellence  ·  Discipline  ·  Success</Text>
          </View>
        </View>
      )}
    </View>
  );
}

function TopBar({ active, search, setSearch, collapsed, setCollapsed, dark, setDark }) {
  return (
    <View style={s.topbar}>
      <View style={s.topLeft}>
        <Pressable onPress={() => setCollapsed(!collapsed)} style={s.menuButton}>
          <Menu size={19} color="#45698D" />
        </Pressable>
        <Text numberOfLines={1} style={s.topTitle}>{active}</Text>
      </View>

      <View style={s.globalSearch}>
        <Search size={16} color="#8299B1" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search students, subjects, classes, or batches..."
          placeholderTextColor="#8097B0"
          style={s.globalSearchInput}
        />
      </View>

      <View style={s.topRight}>
        <View style={s.bellWrap}>
          <Bell size={19} color="#41698F" />
          <View style={s.badge}><Text style={s.badgeText}>3</Text></View>
        </View>
        <Pressable onPress={() => setDark(!dark)} style={s.themeSwitch}>
          <Sun size={15} color="#637F9D" />
          <View style={s.switchTrack}>
            <View style={[s.switchDot, dark && s.switchDotOff]} />
          </View>
        </Pressable>
        <View style={s.topSeparator} />
        <View style={s.adminCircle}><Text style={s.adminInitials}>AD</Text></View>
        <View>
          <Text style={s.adminName}>Administrator</Text>
          <Text style={s.adminRole}>School Admin</Text>
        </View>
        <ChevronDown size={14} color="#527493" />
      </View>
    </View>
  );
}

function SectionCard({ children, style }) {
  return <View style={[s.sectionCard, style]}>{children}</View>;
}

function SectionHeader({ title, subtitle, actionLabel, onAction, actionIcon: ActionIcon = Pencil }) {
  return (
    <View style={s.sectionHeader}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={s.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={s.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel ? (
        <Pressable style={s.outlineButton} onPress={onAction}>
          <ActionIcon size={15} color="#274968" />
          <Text style={s.outlineButtonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function SchoolInformation({ onEdit }) {
  return (
    <SectionCard>
      <View style={s.schoolCardHeading}>
        <Text style={s.sectionTitle}>School Information</Text>
      </View>
      <View style={s.schoolInfoBody}>
        <View style={s.schoolLogoTile}>
          <Crest size={83} />
          <Text style={s.logoInitials}>AFA</Text>
        </View>

        <View style={s.schoolDetailsLeft}>
          <Text style={s.fieldLabel}>School Name</Text>
          <View style={s.fieldValueRow}>
            <UserRound size={16} color="#204B60" />
            <Text style={s.fieldValue}>Akoka Federal Academy</Text>
          </View>
          <Text style={[s.fieldLabel, { marginTop: 17 }]}>Location</Text>
          <View style={s.fieldValueRow}>
            <MapPin size={16} color="#204B60" />
            <Text style={s.fieldValue}>Lagos, Nigeria</Text>
          </View>
        </View>

        <View style={s.schoolDetailsRight}>
          <Text style={s.fieldLabel}>School Type</Text>
          <View style={s.fieldValueRow}>
            <School size={16} color="#204B60" />
            <Text style={s.fieldValueSmall}>Secondary School</Text>
          </View>
          <Text style={[s.fieldLabel, { marginTop: 17 }]}>Academic Year Start Month</Text>
          <View style={s.fieldValueRow}>
            <CalendarDays size={16} color="#204B60" />
            <Text style={s.fieldValue}>September</Text>
          </View>
        </View>
      </View>
      <View style={s.schoolEditOverlay}>
        <Pressable style={s.primaryButton} onPress={onEdit}>
          <Pencil size={15} color="#FFFFFF" />
          <Text style={s.primaryButtonText}>Edit School</Text>
        </Pressable>
      </View>
    </SectionCard>
  );
}

function StatusPill({ status }) {
  const active = status === 'Active';
  return (
    <View style={[s.statusPill, active ? s.statusActive : s.statusUpcoming]}>
      <Text style={[s.statusText, { color: active ? '#08754F' : '#236FD0' }]}>{status}</Text>
    </View>
  );
}

function TermsTable({ terms, onEdit, onMore }) {
  return (
    <View style={s.tableFrame}>
      <View style={[s.termRow, s.tableHead]}>
        {[
          ['Term', 1.2],
          ['Start Date', 1.15],
          ['End Date', 1.15],
          ['Status', 1.15],
          ['Actions', 1.05],
        ].map(([label, flex]) => (
          <Text key={label} style={[s.tableHeaderText, { flex }]}>{label}</Text>
        ))}
      </View>

      {terms.map((term) => (
        <View key={term.id} style={s.termRow}>
          <Text style={[s.tableCell, { flex: 1.2, fontWeight: '600' }]}>{term.name}</Text>
          <Text style={[s.tableCell, { flex: 1.15 }]}>{term.startDate}</Text>
          <Text style={[s.tableCell, { flex: 1.15 }]}>{term.endDate}</Text>
          <View style={{ flex: 1.15, alignItems: 'flex-start' }}>
            <StatusPill status={term.status} />
          </View>
          <View style={[s.termActions, { flex: 1.05 }]}>
            <Pressable style={s.editTermButton} onPress={() => onEdit(term)}>
              <Pencil size={13} color="#274968" />
              <Text style={s.editTermText}>Edit</Text>
            </Pressable>
            <Pressable style={s.moreButton} onPress={() => onMore(term)}>
              <MoreVertical size={17} color="#244666" />
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

function AcademicSessions({ terms, setTerms, onAddSession, onEditTerm, onTermMenu }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <SectionCard>
      <SectionHeader
        title="Academic Sessions"
        subtitle="Manage academic sessions and term dates for the school."
        actionLabel="Add Session"
        actionIcon={Plus}
        onAction={onAddSession}
      />

      <View style={s.sessionPanel}>
        <Pressable style={s.sessionTitleRow} onPress={() => setExpanded(!expanded)}>
          <View>
            <View style={s.sessionTitleLine}>
              <Text style={s.sessionYear}>2025/2026</Text>
              <View style={s.currentPill}><Text style={s.currentPillText}>Current Session</Text></View>
            </View>
            <Text style={s.sessionDateRange}>Academic year: September 2025 – August 2026</Text>
          </View>
          {expanded ? <ChevronUp size={17} color="#45698D" /> : <ChevronDown size={17} color="#45698D" />}
        </Pressable>

        {expanded ? (
          <TermsTable terms={terms} onEdit={onEditTerm} onMore={onTermMenu} />
        ) : null}
      </View>
    </SectionCard>
  );
}

function GradingScale({ grades, onEdit }) {
  return (
    <SectionCard>
      <SectionHeader
        title="Grading Scale"
        subtitle="Manage grading boundaries and credit status for each grade."
        actionLabel="Edit Grading Scale"
        onAction={onEdit}
      />

      <View style={s.gradeTableFrame}>
        <View style={[s.gradeRow, s.tableHead]}>
          {[
            ['Grade', 0.7],
            ['Description', 1.1],
            ['Minimum Percentage', 1.45],
            ['Maximum Percentage', 1.55],
            ['Remark', 2.0],
            ['Credit Status', 1.0],
          ].map(([label, flex]) => (
            <Text key={label} style={[s.tableHeaderText, { flex }]}>{label}</Text>
          ))}
        </View>

        {grades.map((item) => (
          <View key={item.grade} style={s.gradeRow}>
            <Text style={[s.tableCell, { flex: 0.7, fontWeight: '700' }]}>{item.grade}</Text>
            <Text style={[s.tableCell, { flex: 1.1 }]}>{item.description}</Text>
            <Text style={[s.tableCell, { flex: 1.45 }]}>{item.min}</Text>
            <Text style={[s.tableCell, { flex: 1.55 }]}>{item.max}</Text>
            <Text numberOfLines={1} style={[s.tableCell, { flex: 2.0 }]}>{item.remark}</Text>
            <View style={{ flex: 1.0, alignItems: 'flex-start' }}>
              <View style={[s.creditPill, item.credit ? s.creditYes : s.creditNo]}>
                <Text style={[s.creditText, { color: item.credit ? '#08754F' : '#D92E32' }]}>
                  {item.credit ? 'Credit' : 'No Credit'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

function EditModal({ visible, title, fields, onClose, onSave }) {
  const [values, setValues] = useState({});

  React.useEffect(() => {
    if (visible) setValues(Object.fromEntries(fields.map((field) => [field.key, field.value ?? ''])));
  }, [visible, fields]);

  function update(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.modalBackdrop}>
        <View style={s.modalCard}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{title}</Text>
            <Pressable onPress={onClose} style={s.modalClose}><X size={19} color="#45698D" /></Pressable>
          </View>

          <ScrollView style={{ maxHeight: 420 }} keyboardShouldPersistTaps="handled">
            {fields.map((field) => (
              <View key={field.key} style={s.modalField}>
                <Text style={s.modalLabel}>{field.label}</Text>
                <TextInput
                  value={String(values[field.key] ?? '')}
                  onChangeText={(value) => update(field.key, value)}
                  placeholder={field.placeholder || field.label}
                  placeholderTextColor="#8097B0"
                  style={s.modalInput}
                />
              </View>
            ))}
          </ScrollView>

          <View style={s.modalActions}>
            <Pressable style={s.cancelButton} onPress={onClose}><Text style={s.cancelButtonText}>Cancel</Text></Pressable>
            <Pressable style={s.primaryButton} onPress={() => onSave(values)}>
              <Check size={15} color="#FFFFFF" />
              <Text style={s.primaryButtonText}>Save Changes</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function NoticeModal({ visible, title, message, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.modalBackdrop}>
        <View style={s.noticeCard}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{title}</Text>
            <Pressable onPress={onClose} style={s.modalClose}><X size={19} color="#45698D" /></Pressable>
          </View>
          <Text style={s.noticeText}>{message}</Text>
          <Pressable style={[s.primaryButton, { alignSelf: 'flex-end', marginTop: 20 }]} onPress={onClose}>
            <Text style={s.primaryButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const [active, setActive] = useState('School Configuration');
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [terms, setTerms] = useState(initialTerms);
  const [grades, setGrades] = useState(initialGrades);
  const [school, setSchool] = useState({
    name: 'Akoka Federal Academy',
    location: 'Lagos, Nigeria',
    type: 'Secondary School',
    month: 'September',
  });
  const [editModal, setEditModal] = useState({ visible: false, title: '', fields: [], mode: '' });
  const [notice, setNotice] = useState({ visible: false, title: '', message: '' });

  const narrow = width < 1050;
  const filteredTerms = useMemo(() => {
    if (!search.trim()) return terms;
    return terms.filter((term) => `${term.name} ${term.startDate} ${term.endDate} ${term.status}`.toLowerCase().includes(search.toLowerCase()));
  }, [terms, search]);

  function openEditor(title, fields, mode) {
    setEditModal({ visible: true, title, fields, mode });
  }

  function editSchool() {
    openEditor('Edit School Information', [
      { key: 'name', label: 'School Name', value: school.name },
      { key: 'location', label: 'Location', value: school.location },
      { key: 'type', label: 'School Type', value: school.type },
      { key: 'month', label: 'Academic Year Start Month', value: school.month },
    ], 'school');
  }

  function addSession() {
    openEditor('Add Academic Session', [
      { key: 'year', label: 'Academic Session', value: '2026/2027', placeholder: 'e.g. 2026/2027' },
      { key: 'start', label: 'Academic Year Start', value: 'September 2026' },
      { key: 'end', label: 'Academic Year End', value: 'August 2027' },
    ], 'session');
  }

  function editTerm(term) {
    openEditor(`Edit ${term.name}`, [
      { key: 'name', label: 'Term Name', value: term.name },
      { key: 'startDate', label: 'Start Date', value: term.startDate },
      { key: 'endDate', label: 'End Date', value: term.endDate },
      { key: 'status', label: 'Status', value: term.status },
    ], `term:${term.id}`);
  }

  function editGradingScale() {
    const fields = grades.flatMap((grade) => [
      { key: `${grade.grade}_min`, label: `${grade.grade} — Minimum Percentage`, value: grade.min },
      { key: `${grade.grade}_max`, label: `${grade.grade} — Maximum Percentage`, value: grade.max },
      { key: `${grade.grade}_remark`, label: `${grade.grade} — Remark`, value: grade.remark },
    ]);
    openEditor('Edit Grading Scale', fields, 'grades');
  }

  function saveEditor(values) {
    const { mode } = editModal;

    if (mode === 'school') {
      setSchool({
        name: values.name || school.name,
        location: values.location || school.location,
        type: values.type || school.type,
        month: values.month || school.month,
      });
    } else if (mode === 'session') {
      const year = values.year || '2026/2027';
      setNotice({
        visible: true,
        title: 'Session details entered',
        message: `${year} (${values.start || 'start date not set'} – ${values.end || 'end date not set'}) has been entered in this form. This demo does not yet save academic sessions to a backend.`,
      });
      setEditModal((current) => ({ ...current, visible: false }));
      return;
    } else if (mode.startsWith('term:')) {
      const id = mode.slice(5);
      setTerms((current) => current.map((term) => term.id === id ? {
        ...term,
        name: values.name || term.name,
        startDate: values.startDate || term.startDate,
        endDate: values.endDate || term.endDate,
        status: values.status === 'Active' || values.status === 'Upcoming' ? values.status : term.status,
      } : term));
    } else if (mode === 'grades') {
      setGrades((current) => current.map((grade) => ({
        ...grade,
        min: values[`${grade.grade}_min`] ?? grade.min,
        max: values[`${grade.grade}_max`] ?? grade.max,
        remark: values[`${grade.grade}_remark`] ?? grade.remark,
      })));
    }

    setEditModal((current) => ({ ...current, visible: false }));
  }

  function showTermMenu(term) {
    setNotice({
      visible: true,
      title: `${term.name} actions`,
      message: `Term: ${term.name}\nStart: ${term.startDate}\nEnd: ${term.endDate}\nStatus: ${term.status}\n\nUse Edit to change these details. Additional session-management actions require backend rules.`,
    });
  }

  return (
    <View style={[s.app, dark && { backgroundColor: '#EFF3F6' }]}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} />

      <View style={[s.main, { marginLeft: collapsed ? 76 : 255 }]}>
        <TopBar
          active={active}
          search={search}
          setSearch={setSearch}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          dark={dark}
          setDark={setDark}
        />

        <ScrollView style={s.contentScroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <View style={s.pageHeader}>
            <View style={{ flex: 1 }}>
              <Text style={s.pageTitle}>School Configuration</Text>
              <Text style={s.pageSubtitle}>Manage school information, academic sessions, terms, and grading rules.</Text>
            </View>
            <Pressable style={s.primaryButton} onPress={editSchool}>
              <Pencil size={15} color="#FFFFFF" />
              <Text style={s.primaryButtonText}>Edit School</Text>
            </Pressable>
          </View>

          <SchoolInformation onEdit={editSchool} />

          <AcademicSessions
            terms={filteredTerms}
            setTerms={setTerms}
            onAddSession={addSession}
            onEditTerm={editTerm}
            onTermMenu={showTermMenu}
          />

          <GradingScale grades={grades} onEdit={editGradingScale} />
        </ScrollView>
      </View>

      <EditModal
        visible={editModal.visible}
        title={editModal.title}
        fields={editModal.fields}
        onClose={() => setEditModal((current) => ({ ...current, visible: false }))}
        onSave={saveEditor}
      />

      <NoticeModal
        visible={notice.visible}
        title={notice.title}
        message={notice.message}
        onClose={() => setNotice((current) => ({ ...current, visible: false }))}
      />
    </View>
  );
}

const s = StyleSheet.create({
  app: {
    flex: 1,
    minHeight: '100vh',
    flexDirection: 'row',
    backgroundColor: '#F7F9FB',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: 255,
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 5,
    backgroundColor: COLORS.dark2,
    paddingHorizontal: 11,
    paddingTop: 17,
    paddingBottom: 17,
  },
  sidebarCollapsed: { width: 76 },
  brand: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.13)',
    marginBottom: 20,
  },
  brandName: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', lineHeight: 18 },
  brandSub: { color: '#DCEFE9', fontSize: 10, marginTop: 3 },
  navGroup: { marginBottom: 21 },
  navHeading: {
    color: '#D4E8E1',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.45,
    marginHorizontal: 12,
    marginBottom: 9,
  },
  navLink: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 13,
    borderRadius: 6,
    marginBottom: 1,
  },
  navSelected: {
    backgroundColor: '#176B58',
    borderWidth: 1,
    borderColor: 'rgba(112,218,181,0.16)',
  },
  navLabel: { color: '#F5FFFC', fontSize: 12, fontWeight: '500' },
  sideFooter: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  footerName: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  footerMotto: { color: '#C8E2D9', fontSize: 8, marginTop: 5 },
  main: { flex: 1, minWidth: 0, marginLeft: 255 },
  topbar: {
    height: 69,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2EAF0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 23,
    gap: 25,
  },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 210 },
  menuButton: { padding: 2 },
  topTitle: { color: '#152D48', fontSize: 21, fontWeight: '800' },
  globalSearch: {
    height: 37,
    width: '36%',
    maxWidth: 455,
    minWidth: 150,
    borderWidth: 1,
    borderColor: '#D7E1E9',
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  globalSearchInput: { flex: 1, fontSize: 11, color: '#3B5B7B', outlineStyle: 'none' },
  topRight: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 13 },
  bellWrap: { position: 'relative', padding: 6 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 8,
    backgroundColor: '#E23B42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800' },
  themeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#DFE7ED',
    borderRadius: 20,
    padding: 4,
  },
  switchTrack: {
    width: 32,
    height: 17,
    borderRadius: 10,
    backgroundColor: '#07533F',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchDot: { width: 13, height: 13, borderRadius: 7, backgroundColor: '#FFFFFF' },
  switchDotOff: { alignSelf: 'flex-start' },
  topSeparator: { width: 1, height: 34, backgroundColor: '#DCE5EC', marginHorizontal: 4 },
  adminCircle: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: '#003D31',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminInitials: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  adminName: { color: '#1B3551', fontSize: 11, fontWeight: '700' },
  adminRole: { color: '#6D849E', fontSize: 9, marginTop: 3 },
  contentScroll: { flex: 1 },
  content: { padding: 23, paddingTop: 17, paddingBottom: 30, gap: 14 },
  pageHeader: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  pageTitle: { color: '#064333', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  pageSubtitle: { color: '#647F9E', fontSize: 13, marginTop: 5 },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE7EE',
    borderRadius: 7,
    padding: 15,
  },
  schoolCardHeading: { marginBottom: 10, paddingHorizontal: 8 },
  sectionTitle: { color: '#142F4D', fontSize: 15, fontWeight: '800' },
  sectionSubtitle: { color: '#6A83A0', fontSize: 11, marginTop: 5 },
  schoolInfoBody: {
    minHeight: 105,
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 10,
    paddingBottom: 4,
  },
  schoolLogoTile: {
    width: 126,
    height: 104,
    borderRadius: 8,
    backgroundColor: '#E3F5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 35,
    position: 'relative',
  },
  logoInitials: {
    position: 'absolute',
    top: 59,
    color: '#075340',
    fontSize: 11,
    fontWeight: '800',
  },
  schoolDetailsLeft: { flex: 1.25, paddingTop: 1 },
  schoolDetailsRight: {
    flex: 0.95,
    borderLeftWidth: 1,
    borderLeftColor: '#DCE6EE',
    paddingLeft: 35,
    paddingTop: 1,
  },
  fieldLabel: { color: '#6C83A0', fontSize: 10, marginBottom: 7 },
  fieldValueRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  fieldValue: { color: '#19334F', fontSize: 12, fontWeight: '600' },
  fieldValueSmall: { color: '#19334F', fontSize: 11, fontWeight: '600' },
  schoolEditOverlay: { position: 'absolute', top: -67, right: 0 },
  primaryButton: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingHorizontal: 15,
    borderRadius: 6,
    backgroundColor: '#00513D',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  sectionHeader: {
    minHeight: 39,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 11,
  },
  outlineButton: {
    minHeight: 33,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D5E0E9',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  outlineButtonText: { color: '#274968', fontSize: 10, fontWeight: '700' },
  sessionPanel: {
    borderWidth: 1,
    borderColor: '#E0E8EF',
    borderRadius: 6,
    padding: 11,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 11,
  },
  sessionTitleLine: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sessionYear: { color: '#142F4D', fontSize: 16, fontWeight: '800' },
  currentPill: { backgroundColor: '#DDF5E8', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  currentPillText: { color: '#08754F', fontSize: 9, fontWeight: '700' },
  sessionDateRange: { color: '#6C83A0', fontSize: 10, marginTop: 4 },
  tableFrame: { borderWidth: 1, borderColor: '#E3EAF0', borderRadius: 6, overflow: 'hidden' },
  termRow: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF3',
  },
  tableHead: { minHeight: 30, backgroundColor: '#F0F3F5', borderBottomWidth: 0 },
  tableHeaderText: { color: '#334F6E', fontSize: 9, fontWeight: '800' },
  tableCell: { color: '#405D7D', fontSize: 10, minWidth: 0 },
  statusPill: { borderRadius: 12, paddingHorizontal: 11, paddingVertical: 4 },
  statusActive: { backgroundColor: '#D9F4E6' },
  statusUpcoming: { backgroundColor: '#DFECFF' },
  statusText: { fontSize: 9, fontWeight: '700' },
  termActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  editTermButton: {
    height: 29,
    minWidth: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#D7E1E9',
    borderRadius: 5,
  },
  editTermText: { color: '#274968', fontSize: 10, fontWeight: '600' },
  moreButton: { padding: 5 },
  gradeTableFrame: { borderWidth: 1, borderColor: '#E3EAF0', borderRadius: 6, overflow: 'hidden' },
  gradeRow: {
    minHeight: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF3',
  },
  creditPill: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  creditYes: { backgroundColor: '#D9F4E6' },
  creditNo: { backgroundColor: '#FFE1E1' },
  creditText: { fontSize: 9, fontWeight: '700' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 25, 38, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 22,
  },
  noticeCard: { width: '100%', maxWidth: 450, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 22 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  modalTitle: { color: '#142F4D', fontSize: 17, fontWeight: '800', flex: 1 },
  modalClose: { padding: 5 },
  modalField: { marginBottom: 14 },
  modalLabel: { color: '#405D7D', fontSize: 11, fontWeight: '700', marginBottom: 6 },
  modalInput: {
    height: 39,
    borderWidth: 1,
    borderColor: '#D7E1E9',
    borderRadius: 6,
    paddingHorizontal: 11,
    color: '#19334F',
    fontSize: 12,
    outlineStyle: 'none',
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 18 },
  cancelButton: {
    minHeight: 34,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D7E1E9',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: { color: '#405D7D', fontSize: 11, fontWeight: '700' },
  noticeText: { color: '#526D89', fontSize: 12, lineHeight: 19 },
});
```

## 4. Page behavior

- **Sidebar:** retains the shared navigation and highlights School Configuration. Sidebar items update the selected navigation label; routing to other pages is not implemented here.
- **Global search:** filters the displayed academic term rows by term name, dates, or status.
- **Edit School:** opens a form and updates the school information shown on the page.
- **Add Session:** opens a form for session details. The demo displays a notice rather than adding a persistent session record.
- **Edit term:** updates the selected term's name, dates, and status in local state.
- **Term menu:** displays the selected term's details and explains that additional management actions need to be implemented.
- **Edit Grading Scale:** allows editing grade percentage boundaries and remarks.
- **Session accordion:** expands and collapses the current academic session.
- **Theme control and sidebar collapse:** retain the dashboard's presentation-level controls.

## 5. Implementation boundaries

This is a frontend page recreation. It uses sample data based on the reference screenshot and local React state. It does **not** connect to a backend, save changes across reloads, or implement actual navigation to other screens. The crest is an SVG approximation; use the official school logo asset for an exact match.

## 6. Visual reference checklist

- Dark green sidebar with School Configuration selected.
- Shared top bar with page title, global search, notifications, theme switch, and administrator profile.
- School Configuration heading, subtitle, and Edit School action.
- School Information card with logo tile and four school details.
- Academic Sessions card with current session label, date range, three terms, status badges, Edit actions, and overflow menus.
- Grading Scale table with A1 through F9 and credit status pills.
- Light backgrounds, thin borders, compact typography, and responsive layout consistent with the existing dashboard.
