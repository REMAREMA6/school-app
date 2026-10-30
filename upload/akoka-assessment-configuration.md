# Akoka Federal Academy — Assessment Configuration Page

React Native Web implementation of the supplied Assessment Configuration screen. It follows the existing Students page conventions: shared dark-green sidebar, top bar, typography, compact tables, status pills, borders, and local React state.

**Target:** Desktop web using Expo + React Native Web.  
**Scope:** CA/examination summary cards, searchable and filterable configuration directory, pagination, selected configuration panel, CA Components and Settings tabs, add/edit/delete component interactions, and save/close controls. Data is illustrative and stored locally in component state; connect handlers to your API for persistence.

## Run

Reuse the dependencies in your existing project, or install:

```bash
npx expo install react-native-web react-dom @expo/metro-runtime react-native-svg
npm install lucide-react-native
```

Save the code below as `AssessmentConfiguration.js` and render `<AssessmentConfiguration />` from your app. If you use the same shared shell as the Students page, retain the `Sidebar` and `TopBar` conventions already in your project rather than duplicating them.

```jsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, TextInput, Pressable, StyleSheet,
  useWindowDimensions, Modal, Switch,
} from 'react-native';
import {
  Home, Settings, BookOpen, Users, FileText, Shield, CloudUpload,
  ClipboardCheck, Bell, Sun, ChevronDown, ChevronLeft, ChevronRight,
  Search, CalendarDays, Pencil, GraduationCap, Menu, X, Plus,
  MoreVertical, Printer, UserRound, ShieldCheck, Clock3, User,
  ArrowUpRight, Eye, BookMarked, Trophy, GripVertical, Trash2,
  CheckCircle2, AlertCircle, SlidersHorizontal, Save, ChevronRight as Right,
} from 'lucide-react-native';

const C = {
  dark: '#00372D', dark2: '#002F27', green: '#08765F', green2: '#0B8B70',
  ink: '#142F4D', muted: '#647F9E', border: '#DCE6EE', bg: '#F7F9FB',
  blue: '#2675D2', purple: '#7950D2', orange: '#D58A13', red: '#D92E32',
  paleGreen: '#E1F6EC', paleBlue: '#E5EEFF', palePurple: '#F0E7FF',
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

const seedConfigurations = [
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

function Sidebar({ active = 'Assessment Configuration', setActive = () => {}, collapsed = false }) {
  return <View style={[s.sidebar, collapsed && { width: 76 }]}>
    <View style={s.brand}><View style={s.crest}><GraduationCap size={25} color="#FFF" /></View>{!collapsed && <View style={{ flex: 1 }}>
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
      <TextInput value={search} onChangeText={setSearch} placeholder="Search students, subjects, classes, or batches..." placeholderTextColor="#8097B0" style={s.globalSearchInput} />
    </View>
    <View style={s.topRight}>
      <View style={s.bellWrap}><Bell size={19} color="#41698F" /><View style={s.badge}><Text style={s.badgeText}>3</Text></View></View>
      <View style={s.themeSwitch}><Sun size={15} color="#637F9D" /><Switch value={dark} onValueChange={setDark} trackColor={{ false: '#CCD8E2', true: C.green }} thumbColor="#FFF" /></View>
      <View style={s.topSeparator} /><View style={s.adminCircle}><Text style={s.adminInitials}>AD</Text></View>
      <View><Text style={s.adminName}>Administrator</Text><Text style={s.adminRole}>School Admin</Text></View><ChevronDown size={14} color="#527493" />
    </View>
  </View>;
}

function Button({ children, onPress, primary = false, danger = false, style }) {
  return <Pressable onPress={onPress} style={[s.button, primary && s.primaryButton, danger && s.dangerButton, style]}>
    {children}
  </Pressable>;
}
function Pill({ children, tone = 'green' }) {
  return <View style={[s.pill, tone === 'red' && s.pillRed, tone === 'blue' && s.pillBlue]}><Text style={[s.pillText, tone === 'red' && { color: C.red }, tone === 'blue' && { color: C.blue }]}>{children}</Text></View>;
}
function Field({ label, value, onChangeText, keyboardType, placeholder }) {
  return <View style={s.field}><Text style={s.fieldLabel}>{label}</Text><TextInput value={String(value ?? '')} onChangeText={onChangeText} keyboardType={keyboardType} placeholder={placeholder} placeholderTextColor={C.muted} style={s.input} /></View>;
}
function SelectField({ label, value, options, onChange }) {
  return <View style={s.field}><Text style={s.fieldLabel}>{label}</Text><View style={s.selectWrap}>
    <Text style={s.selectValue}>{value}</Text><Pressable onPress={() => onChange(options[(options.indexOf(value) + 1) % options.length])}><ChevronDown size={15} color={C.muted} /></Pressable>
  </View><Text style={s.helper}>Tap the value to cycle through available options.</Text></View>;
}

export default function AssessmentConfiguration() {
  const { width } = useWindowDimensions();
  const compact = width < 1100;
  const [active, setActive] = useState('Assessment Configuration');
  const [globalSearch, setGlobalSearch] = useState('');
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [page, setPage] = useState(1);
  const [configs, setConfigs] = useState(seedConfigurations);
  const [selectedId, setSelectedId] = useState(1);
  const [tab, setTab] = useState('CA Components');
  const [modal, setModal] = useState(null);
  const [componentDraft, setComponentDraft] = useState({ name: '', marks: '5' });
  const [editingComponentId, setEditingComponentId] = useState(null);
  const [dark, setDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notice, setNotice] = useState('');
  const [formDraft, setFormDraft] = useState(null);

  const selected = configs.find(c => c.id === selectedId) || configs[0];
  const componentTotal = selected.components.reduce((sum, c) => sum + Number(c.marks || 0), 0);
  const totalMarks = Number(selected.caMax) + Number(selected.examMax);
  const allClasses = ['All Classes', 'JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
  const subjects = ['All Subjects', ...Array.from(new Set(configs.map(c => c.subject)))];
  const filtered = useMemo(() => configs.filter(c =>
    (c.className + ' ' + c.subject).toLowerCase().includes(query.toLowerCase()) &&
    (c.className + ' ' + c.subject + ' ' + c.status).toLowerCase().includes(globalSearch.toLowerCase()) &&
    (classFilter === 'All Classes' || c.className === classFilter) &&
    (subjectFilter === 'All Subjects' || c.subject === subjectFilter)
  ), [configs, query, globalSearch, classFilter, subjectFilter]);
  const pageSize = 10;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const updateSelected = patch => setConfigs(old => old.map(c => c.id === selected.id ? { ...c, ...patch } : c));
  const openNewConfiguration = () => {
    setFormDraft({ className: 'JSS1', subject: '', caMax: '40', examMax: '60', status: 'Active', components: [], passMark: '40', rounding: 'Whole number', allowMissing: false });
    setModal('configuration');
  };
  const saveConfiguration = () => {
    if (!formDraft?.subject?.trim()) { setNotice('Enter a subject name before saving.'); return; }
    const item = { ...formDraft, id: Math.max(0, ...configs.map(c => c.id)) + 1, caMax: Number(formDraft.caMax), examMax: Number(formDraft.examMax), passMark: Number(formDraft.passMark), components: formDraft.components || [] };
    setConfigs(old => [...old, item]); setSelectedId(item.id); setModal(null); setNotice('Configuration added locally.');
  };
  const openComponent = component => {
    setEditingComponentId(component?.id ?? null);
    setComponentDraft(component ? { name: component.name, marks: String(component.marks) } : { name: '', marks: '5' });
    setModal('component');
  };
  const saveComponent = () => {
    if (!componentDraft.name.trim() || Number(componentDraft.marks) < 0) { setNotice('Enter a component name and valid marks.'); return; }
    const component = { id: editingComponentId ?? Date.now(), name: componentDraft.name.trim(), marks: Number(componentDraft.marks) };
    updateSelected({ components: editingComponentId
      ? selected.components.map(c => c.id === editingComponentId ? component : c)
      : [...selected.components, component] });
    setModal(null); setNotice('Component updated locally.');
  };
  const deleteComponent = id => {
    updateSelected({ components: selected.components.filter(c => c.id !== id) });
    setNotice('Component removed locally.');
  };
  const openEditConfiguration = () => {
    setFormDraft({ ...selected, caMax: String(selected.caMax), examMax: String(selected.examMax), passMark: String(selected.passMark) });
    setModal('editConfiguration');
  };
  const saveEditConfiguration = () => {
    updateSelected({ ...formDraft, caMax: Number(formDraft.caMax), examMax: Number(formDraft.examMax), passMark: Number(formDraft.passMark) });
    setModal(null); setNotice('Configuration settings saved locally.');
  };

  return <View style={[s.app, dark && { backgroundColor: '#EAF0F4' }]}>
    <Sidebar active={active} setActive={setActive} collapsed={collapsed} />
    <View style={s.main}>
      <TopBar active={active} search={globalSearch} setSearch={setGlobalSearch} collapsed={collapsed} setCollapsed={setCollapsed} dark={dark} setDark={setDark} />
      <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
        <View style={s.pageHeading}>
          <View><Text style={s.pageTitle}>Assessment Configuration</Text><Text style={s.pageSubtitle}>Configure continuous assessment components and examination weightings.</Text></View>
        </View>
        {notice ? <Pressable onPress={() => setNotice('')} style={s.notice}><Text style={s.noticeText}>{notice}  ×</Text></Pressable> : null}

        <View style={[s.summaryRow, compact && { flexWrap: 'wrap' }]}>
          <View style={[s.summaryCard, compact && { minWidth: 220 }]}><View style={[s.summaryIcon, { backgroundColor: C.paleGreen }]}><FileText size={25} color={C.green} /></View><View style={{ flex: 1 }}><Text style={s.summaryLabel}>Continuous Assessment (CA)</Text><View style={s.summaryValueLine}><Text style={s.summaryValue}>40</Text><Text style={s.summaryUnit}>marks</Text></View><Text style={s.summaryFoot}>40% of total</Text></View></View>
          <View style={[s.summaryCard, compact && { minWidth: 220 }]}><View style={[s.summaryIcon, { backgroundColor: C.paleBlue }]}><FileText size={25} color="#4F5CFF" /></View><View style={{ flex: 1 }}><Text style={s.summaryLabel}>Examination</Text><View style={s.summaryValueLine}><Text style={s.summaryValue}>60</Text><Text style={s.summaryUnit}>marks</Text></View><Text style={s.summaryFoot}>60% of total</Text></View></View>
          <View style={[s.summaryCard, compact && { minWidth: 220 }]}><View style={[s.summaryIcon, { backgroundColor: C.palePurple }]}><Trophy size={25} color={C.purple} /></View><View style={{ flex: 1 }}><Text style={s.summaryLabel}>Total</Text><View style={s.summaryValueLine}><Text style={s.summaryValue}>100</Text><Text style={s.summaryUnit}>marks</Text></View><Text style={s.summaryFoot}>100%</Text></View></View>
        </View>

        <View style={[s.workspace, compact && { flexDirection: 'column' }]}>
          <View style={[s.directoryCard, compact && { width: '100%' }]}>
            <View style={s.sectionHeader}><Text style={s.sectionTitle}>Assessment Configuration</Text><Button primary onPress={openNewConfiguration}><Plus size={17} color="#FFF" /><Text style={s.primaryButtonText}>Add Configuration</Text></Button></View>
            <View style={[s.filters, compact && { flexWrap: 'wrap' }]}>
              <View style={[s.searchInputWrap, { flex: 1 }]}><Search size={16} color={C.muted} /><TextInput value={query} onChangeText={v => { setQuery(v); setPage(1); }} placeholder="Search by subject or class..." placeholderTextColor={C.muted} style={s.searchInput} /></View>
              <View style={s.filterBox}><Text style={s.filterText}>{classFilter}</Text><Pressable onPress={() => { setClassFilter(allClasses[(allClasses.indexOf(classFilter) + 1) % allClasses.length]); setPage(1); }}><ChevronDown size={15} color={C.muted} /></Pressable></View>
              <View style={s.filterBox}><Text numberOfLines={1} style={s.filterText}>{subjectFilter}</Text><Pressable onPress={() => { setSubjectFilter(subjects[(subjects.indexOf(subjectFilter) + 1) % subjects.length]); setPage(1); }}><ChevronDown size={15} color={C.muted} /></Pressable></View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <View style={{ minWidth: 680, flex: 1 }}>
                <View style={s.tableHead}><Text style={[s.th, { width: 108 }]}>Class</Text><Text style={[s.th, { flex: 1.5 }]}>Subject</Text><Text style={[s.th, { width: 105 }]}>CA Max</Text><Text style={[s.th, { width: 105 }]}>Exam Max</Text><Text style={[s.th, { width: 82 }]}>Total</Text><Text style={[s.th, { width: 95 }]}>Status</Text><Text style={[s.th, { width: 34 }]} /></View>
                {rows.map(row => <Pressable key={row.id} onPress={() => { setSelectedId(row.id); setTab('CA Components'); }} style={[s.tableRow, selectedId === row.id && s.selectedRow]}>
                  <Text style={[s.td, { width: 108 }]}>{row.className}</Text><Text numberOfLines={1} style={[s.td, { flex: 1.5, fontWeight: selectedId === row.id ? '700' : '500' }]}>{row.subject}</Text><Text style={[s.td, { width: 105 }]}>{row.caMax}</Text><Text style={[s.td, { width: 105 }]}>{row.examMax}</Text><Text style={[s.td, { width: 82 }]}>{Number(row.caMax) + Number(row.examMax)}</Text><View style={{ width: 95, justifyContent: 'center' }}><Pill>{row.status}</Pill></View><Pressable style={{ width: 34, alignItems: 'center', justifyContent: 'center' }} onPress={() => { setSelectedId(row.id); setModal('rowActions'); }}><MoreVertical size={17} color={C.muted} /></Pressable>
                </Pressable>)}
              </View>
            </ScrollView>
            <View style={s.pagination}><Text style={s.paginationInfo}>Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} of {filtered.length || 24} configurations</Text><View style={s.pageButtons}>
              <Pressable style={s.pageButton} onPress={() => setPage(Math.max(1, page - 1))}><ChevronLeft size={16} color={C.muted} /></Pressable>
              {Array.from({ length: Math.min(3, pages) }, (_, i) => i + 1).map(p => <Pressable key={p} onPress={() => setPage(p)} style={[s.pageButton, page === p && s.pageButtonActive]}><Text style={[s.pageButtonText, page === p && { color: '#FFF' }]}>{p}</Text></Pressable>)}
              {pages > 3 && <Text style={s.paginationInfo}>…</Text>}
              <Pressable style={s.pageButton} onPress={() => setPage(Math.min(pages, page + 1))}><ChevronRight size={16} color={C.muted} /></Pressable>
            </View></View>
          </View>

          <View style={[s.detailCard, compact && { width: '100%' }]}>
            <View style={s.detailHeader}>
              <View style={s.detailIcon}><BookOpen size={23} color={C.dark} /></View>
              <View style={{ flex: 1 }}><View style={s.detailTitleLine}><Text numberOfLines={1} style={s.detailTitle}>{selected.className} – {selected.subject}</Text><Pill>{selected.status}</Pill></View><Text style={s.detailSubtitle}>Class: {selected.className}  |  Subject: {selected.subject}</Text></View>
              <Pressable onPress={() => setSelectedId(configs.find(c => c.id !== selected.id)?.id || selected.id)}><X size={19} color={C.muted} /></Pressable>
            </View>
            <View style={s.marksSummary}>
              <View style={s.marksCell}><Text style={s.marksLabel}>CA Maximum</Text><Text style={s.marksValue}>{selected.caMax}</Text><Text style={s.marksUnit}>marks</Text></View>
              <View style={s.marksCell}><Text style={s.marksLabel}>Exam Maximum</Text><Text style={s.marksValue}>{selected.examMax}</Text><Text style={s.marksUnit}>marks</Text></View>
              <View style={s.marksCell}><Text style={s.marksLabel}>Total</Text><Text style={s.marksValue}>{totalMarks}</Text><Text style={s.marksUnit}>marks</Text></View>
            </View>
            <View style={s.tabs}><Pressable onPress={() => setTab('CA Components')} style={[s.tab, tab === 'CA Components' && s.tabActive]}><Text style={[s.tabText, tab === 'CA Components' && s.tabTextActive]}>CA Components</Text></Pressable><Pressable onPress={() => setTab('Settings')} style={[s.tab, tab === 'Settings' && s.tabActive]}><Text style={[s.tabText, tab === 'Settings' && s.tabTextActive]}>Settings</Text></Pressable></View>

            {tab === 'CA Components' ? <>
              <Text style={s.detailSectionTitle}>Continuous Assessment Components</Text>
              <View style={s.componentTable}>
                <View style={s.componentHead}><Text style={{ width: 24 }} /><Text style={[s.componentTh, { flex: 1 }]}>Component</Text><Text style={[s.componentTh, { width: 112 }]}>Maximum Marks</Text><Text style={[s.componentTh, { width: 76 }]}>Actions</Text></View>
                {selected.components.map(component => <View key={component.id} style={s.componentRow}><GripVertical size={15} color={C.muted} /><Text numberOfLines={1} style={[s.componentName, { flex: 1 }]}>{component.name}</Text><Text style={[s.componentMarks, { width: 112 }]}>{component.marks}</Text><View style={s.componentActions}><Pressable onPress={() => openComponent(component)} style={s.iconButton}><Pencil size={15} color={C.ink} /></Pressable><Pressable onPress={() => deleteComponent(component.id)} style={[s.iconButton, { marginLeft: 6 }]}><Trash2 size={15} color={C.red} /></Pressable></View></View>)}
                {!selected.components.length && <Text style={s.emptyText}>No CA components yet. Add one below.</Text>}
              </View>
              <Button primary onPress={() => openComponent(null)} style={{ alignSelf: 'flex-start', marginTop: 14 }}><Plus size={17} color="#FFF" /><Text style={s.primaryButtonText}>Add CA Component</Text></Button>
              <View style={[s.validationBox, componentTotal <= Number(selected.caMax) ? s.validationGood : s.validationBad]}><View style={s.validationRow}><Text style={s.validationLabel}>CA Total</Text><Text style={s.validationNumber}>{componentTotal} / {selected.caMax}</Text><View style={{ flex: 1 }} /><CheckCircle2 size={16} color={componentTotal <= Number(selected.caMax) ? '#087A50' : C.red} /><Text style={[s.validationStatus, componentTotal > Number(selected.caMax) && { color: C.red }]}>{componentTotal <= Number(selected.caMax) ? 'Matches CA Maximum' : 'Exceeds CA Maximum'}</Text></View></View>
              {componentTotal > Number(selected.caMax) && <View style={s.warningBox}><AlertCircle size={17} color={C.red} /><View style={{ flex: 1 }}><Text style={s.warningTitle}>Component total exceeds CA maximum</Text><Text style={s.warningText}>Total is {componentTotal}, which is {componentTotal - Number(selected.caMax)} marks over the configured CA maximum ({selected.caMax}).</Text></View></View>}
            </> : <>
              <Text style={s.detailSectionTitle}>Assessment Settings</Text>
              <Field label="CA Maximum Marks" value={formDraft?.caMax ?? selected.caMax} keyboardType="numeric" onChangeText={v => setFormDraft(old => ({ ...(old || selected), caMax: v }))} />
              <Field label="Examination Maximum Marks" value={formDraft?.examMax ?? selected.examMax} keyboardType="numeric" onChangeText={v => setFormDraft(old => ({ ...(old || selected), examMax: v }))} />
              <Field label="Pass Mark" value={formDraft?.passMark ?? selected.passMark} keyboardType="numeric" onChangeText={v => setFormDraft(old => ({ ...(old || selected), passMark: v }))} />
              <SelectField label="Rounding Rule" value={formDraft?.rounding ?? selected.rounding} options={['Whole number', '1 decimal place', '2 decimal places']} onChange={v => setFormDraft(old => ({ ...(old || selected), rounding: v }))} />
              <View style={s.switchSetting}><View style={{ flex: 1 }}><Text style={s.fieldLabel}>Allow missing CA scores</Text><Text style={s.helper}>Permit compilation when a component score has not been entered.</Text></View><Switch value={formDraft?.allowMissing ?? selected.allowMissing} onValueChange={v => setFormDraft(old => ({ ...(old || selected), allowMissing: v }))} trackColor={{ true: C.green }} /></View>
              <Button primary onPress={saveEditConfiguration} style={{ alignSelf: 'flex-start', marginTop: 12 }}><Save size={16} color="#FFF" /><Text style={s.primaryButtonText}>Save Settings</Text></Button>
            </>}
            <View style={s.detailFooter}><Button onPress={() => { setNotice('Changes discarded.'); setTab('CA Components'); setFormDraft(null); }} style={{ flex: 1 }}><Text style={s.buttonText}>Close Without Saving</Text></Button><Button primary onPress={() => { if (tab === 'Settings' && formDraft) saveEditConfiguration(); else { setNotice('Changes saved in this session. Connect an API to persist them.'); } }} style={{ flex: 1 }}><Text style={s.primaryButtonText}>Save All Changes</Text></Button></View>
          </View>
        </View>
      </ScrollView>
    </View>

    <Modal visible={!!modal} transparent animationType="fade" onRequestClose={() => setModal(null)}>
      <View style={s.modalBackdrop}><View style={s.modalCard}>
        <View style={s.modalHeader}><Text style={s.modalTitle}>{modal === 'component' ? (editingComponentId ? 'Edit CA Component' : 'Add CA Component') : modal === 'configuration' ? 'Add Configuration' : modal === 'editConfiguration' ? 'Edit Configuration Settings' : 'Configuration Actions'}</Text><Pressable onPress={() => setModal(null)}><X size={20} color={C.muted} /></Pressable></View>
        {modal === 'component' ? <><Field label="Component Name" value={componentDraft.name} onChangeText={v => setComponentDraft(old => ({ ...old, name: v }))} placeholder="e.g. Assignment" /><Field label="Maximum Marks" value={componentDraft.marks} keyboardType="numeric" onChangeText={v => setComponentDraft(old => ({ ...old, marks: v }))} /><View style={s.modalActions}><Button onPress={() => setModal(null)}><Text style={s.buttonText}>Cancel</Text></Button><Button primary onPress={saveComponent}><Text style={s.primaryButtonText}>Save Component</Text></Button></View></>
        : modal === 'configuration' || modal === 'editConfiguration' ? <><Field label="Subject" value={formDraft?.subject} onChangeText={v => setFormDraft(old => ({ ...old, subject: v }))} placeholder="Enter subject name" /><SelectField label="Class" value={formDraft?.className || 'JSS1'} options={['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3']} onChange={v => setFormDraft(old => ({ ...old, className: v }))} /><Field label="CA Maximum Marks" value={formDraft?.caMax} keyboardType="numeric" onChangeText={v => setFormDraft(old => ({ ...old, caMax: v }))} /><Field label="Examination Maximum Marks" value={formDraft?.examMax} keyboardType="numeric" onChangeText={v => setFormDraft(old => ({ ...old, examMax: v }))} /><View style={s.modalActions}><Button onPress={() => setModal(null)}><Text style={s.buttonText}>Cancel</Text></Button><Button primary onPress={modal === 'configuration' ? saveConfiguration : saveEditConfiguration}><Text style={s.primaryButtonText}>Save Configuration</Text></Button></View></>
        : <><Text style={s.modalHelp}>Selected: {selected.className} — {selected.subject}</Text><View style={s.modalActions}><Button danger onPress={() => { setConfigs(old => old.filter(c => c.id !== selected.id)); const next = configs.find(c => c.id !== selected.id); if (next) setSelectedId(next.id); setModal(null); setNotice('Configuration removed locally.'); }}><Trash2 size={15} color={C.red} /><Text style={{ color: C.red, fontWeight: '700' }}>Delete</Text></Button><Button onPress={openEditConfiguration}><Pencil size={15} color={C.ink} /><Text style={s.buttonText}>Edit Settings</Text></Button><Button onPress={() => setModal(null)}><Text style={s.buttonText}>Cancel</Text></Button></View></>}
      </View></View>
    </Modal>
  </View>;
}

const s = StyleSheet.create({
  app: { flex: 1, flexDirection: 'row', backgroundColor: C.bg, minHeight: '100vh' },
  sidebar: { width: 263, backgroundColor: C.dark2, paddingHorizontal: 10, paddingTop: 18, paddingBottom: 18 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 10, marginBottom: 24 },
  crest: { width: 48, height: 54, borderWidth: 2, borderColor: '#E6FFF5', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  brandName: { color: '#FFF', fontSize: 16, fontWeight: '700', lineHeight: 18 },
  brandSub: { color: '#D2E8E1', fontSize: 10, marginTop: 3 },
  navGroup: { marginBottom: 18 },
  navHeading: { color: '#C3DDD5', fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginHorizontal: 12, marginBottom: 8, marginTop: 3 },
  navLink: { height: 40, flexDirection: 'row', alignItems: 'center', gap: 13, borderRadius: 7, paddingHorizontal: 13, marginBottom: 3 },
  navSelected: { backgroundColor: '#176451', borderWidth: 1, borderColor: '#287D68' },
  navLabel: { color: '#F3FFFB', fontSize: 12, fontWeight: '500' },
  sideFooter: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingHorizontal: 10, paddingTop: 20 },
  footerName: { color: '#FFF', fontWeight: '700', fontSize: 10 },
  footerMotto: { color: '#D2E8E1', fontSize: 9, marginTop: 5 },
  main: { flex: 1, minWidth: 0 },
  topbar: { minHeight: 72, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: C.border, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 20 },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: 235 },
  topTitle: { fontSize: 21, fontWeight: '800', color: C.ink, flexShrink: 1 },
  globalSearch: { flex: 1, maxWidth: 440, height: 39, borderWidth: 1, borderColor: C.border, borderRadius: 7, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 10 },
  globalSearchInput: { flex: 1, color: C.ink, fontSize: 12, outlineStyle: 'none' },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 11, marginLeft: 'auto' },
  bellWrap: { position: 'relative', padding: 5 },
  badge: { position: 'absolute', right: 0, top: -3, width: 15, height: 15, borderRadius: 8, backgroundColor: '#E63139', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  themeSwitch: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 5 },
  topSeparator: { width: 1, height: 35, backgroundColor: C.border, marginHorizontal: 5 },
  adminCircle: { width: 39, height: 39, borderRadius: 20, backgroundColor: C.dark, alignItems: 'center', justifyContent: 'center' },
  adminInitials: { color: '#FFF', fontWeight: '800', fontSize: 12 },
  adminName: { color: C.ink, fontWeight: '800', fontSize: 12 },
  adminRole: { color: C.muted, fontSize: 10, marginTop: 3 },
  page: { padding: 20, paddingBottom: 34, gap: 16 },
  pageHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 15 },
  pageTitle: { color: C.dark, fontSize: 27, fontWeight: '800' },
  pageSubtitle: { color: C.muted, fontSize: 13, marginTop: 3 },
  notice: { backgroundColor: C.paleGreen, borderColor: '#B5E5D1', borderWidth: 1, padding: 10, borderRadius: 7 },
  noticeText: { color: C.dark, fontSize: 12, fontWeight: '600' },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: { flex: 1, minHeight: 122, backgroundColor: '#FFF', borderWidth: 1, borderColor: C.border, borderRadius: 7, padding: 18, flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  summaryIcon: { width: 52, height: 52, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  summaryLabel: { color: C.muted, fontSize: 11, fontWeight: '600', marginTop: 4 },
  summaryValueLine: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 5 },
  summaryValue: { color: C.ink, fontSize: 29, fontWeight: '800' },
  summaryUnit: { color: C.ink, fontSize: 11 },
  summaryFoot: { color: C.green, fontSize: 11, fontWeight: '700', marginTop: 5 },
  workspace: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  directoryCard: { flex: 1.45, minWidth: 0, backgroundColor: '#FFF', borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 14 },
  sectionTitle: { color: C.ink, fontSize: 17, fontWeight: '800' },
  button: { minHeight: 37, paddingHorizontal: 12, borderWidth: 1, borderColor: C.border, borderRadius: 6, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButton: { backgroundColor: C.dark, borderColor: C.dark, shadowColor: '#00372D', shadowOpacity: 0.1, shadowRadius: 3 },
  primaryButtonText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  buttonText: { color: C.ink, fontSize: 11, fontWeight: '700' },
  dangerButton: { borderColor: '#FFC6C8', backgroundColor: '#FFF' },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  searchInputWrap: { minWidth: 180, height: 36, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: C.border, borderRadius: 6, paddingHorizontal: 10 },
  searchInput: { flex: 1, minWidth: 0, fontSize: 11, color: C.ink, outlineStyle: 'none' },
  filterBox: { width: 170, height: 36, borderWidth: 1, borderColor: C.border, borderRadius: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  filterText: { color: C.ink, fontSize: 11, flex: 1 },
  tableHead: { height: 40, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4F7', paddingHorizontal: 12, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  th: { color: '#385779', fontSize: 10, fontWeight: '800' },
  tableRow: { minHeight: 46, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#EAF0F4' },
  selectedRow: { backgroundColor: '#EAF7F1', borderWidth: 1, borderColor: '#A5DDC6', borderRadius: 5 },
  td: { color: '#355779', fontSize: 11, paddingRight: 7 },
  pill: { alignSelf: 'flex-start', backgroundColor: '#D9F5E8', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 14 },
  pillText: { color: '#08734E', fontSize: 10, fontWeight: '700' },
  pillRed: { backgroundColor: '#FFE5E5' },
  pillBlue: { backgroundColor: '#E2EDFF' },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 14 },
  paginationInfo: { color: C.muted, fontSize: 11 },
  pageButtons: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  pageButton: { minWidth: 30, height: 30, borderWidth: 1, borderColor: C.border, borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  pageButtonActive: { backgroundColor: C.green, borderColor: C.green },
  pageButtonText: { color: C.ink, fontSize: 11, fontWeight: '700' },
  detailCard: { flex: 1, minWidth: 320, backgroundColor: '#FFF', borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 14 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 18 },
  detailIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: C.paleGreen, alignItems: 'center', justifyContent: 'center' },
  detailTitleLine: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  detailTitle: { color: C.ink, fontSize: 16, fontWeight: '800', flexShrink: 1 },
  detailSubtitle: { color: C.muted, fontSize: 11, marginTop: 8 },
  marksSummary: { flexDirection: 'row', borderWidth: 1, borderColor: C.border, borderRadius: 6, paddingVertical: 9, marginBottom: 16 },
  marksCell: { flex: 1, paddingHorizontal: 12, borderRightWidth: 1, borderRightColor: C.border },
  marksLabel: { color: C.muted, fontSize: 10 },
  marksValue: { color: C.ink, fontSize: 22, fontWeight: '800', marginTop: 6 },
  marksUnit: { color: C.muted, fontSize: 10, marginTop: 3 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 18 },
  tab: { minWidth: 135, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: C.green },
  tabText: { color: C.muted, fontSize: 11, fontWeight: '700' },
  tabTextActive: { color: C.green },
  detailSectionTitle: { color: C.ink, fontSize: 13, fontWeight: '800', marginBottom: 12 },
  componentTable: { borderWidth: 1, borderColor: C.border, borderRadius: 6, overflow: 'hidden' },
  componentHead: { minHeight: 38, backgroundColor: '#F1F5F8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 8 },
  componentTh: { color: '#385779', fontSize: 10, fontWeight: '800' },
  componentRow: { minHeight: 43, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 8, borderTopWidth: 1, borderTopColor: '#EAF0F4' },
  componentName: { color: '#355779', fontSize: 11 },
  componentMarks: { color: '#355779', fontSize: 11 },
  componentActions: { width: 76, flexDirection: 'row', justifyContent: 'flex-end' },
  iconButton: { width: 31, height: 31, borderWidth: 1, borderColor: C.border, borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  emptyText: { padding: 14, color: C.muted, fontSize: 12 },
  validationBox: { marginTop: 12, borderRadius: 8, paddingHorizontal: 13, paddingVertical: 13, borderWidth: 1 },
  validationGood: { backgroundColor: '#EAF8F1', borderColor: '#D1F0E1' },
  validationBad: { backgroundColor: '#FFF0F1', borderColor: '#FFD6D9' },
  validationRow: { flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap' },
  validationLabel: { color: '#1D6A4C', fontSize: 11, fontWeight: '800' },
  validationNumber: { color: C.ink, fontSize: 12, fontWeight: '800', marginLeft: 16 },
  validationStatus: { color: '#087A50', fontSize: 10, fontWeight: '700' },
  warningBox: { flexDirection: 'row', gap: 10, marginTop: 10, padding: 13, borderWidth: 1, borderColor: '#FFD1D5', backgroundColor: '#FFF0F1', borderRadius: 8 },
  warningTitle: { color: C.red, fontSize: 11, fontWeight: '800' },
  warningText: { color: C.muted, fontSize: 10, marginTop: 6, lineHeight: 15 },
  detailFooter: { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: '#EEF2F5', paddingTop: 14, marginTop: 18 },
  field: { marginBottom: 13 },
  fieldLabel: { color: C.ink, fontSize: 11, fontWeight: '700', marginBottom: 6 },
  input: { minHeight: 38, borderWidth: 1, borderColor: C.border, borderRadius: 5, paddingHorizontal: 10, fontSize: 12, color: C.ink, backgroundColor: '#FFF', outlineStyle: 'none' },
  selectWrap: { minHeight: 38, borderWidth: 1, borderColor: C.border, borderRadius: 5, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectValue: { color: C.ink, fontSize: 12 },
  helper: { color: C.muted, fontSize: 10, marginTop: 5 },
  switchSetting: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(5,25,35,0.42)', alignItems: 'center', justifyContent: 'center', padding: 18 },
  modalCard: { width: '100%', maxWidth: 480, backgroundColor: '#FFF', borderRadius: 10, padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { color: C.ink, fontSize: 17, fontWeight: '800' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  modalHelp: { color: C.muted, fontSize: 12, marginBottom: 16 },
});
```

## Integration notes

- This component is self-contained so it can be tested independently. If your app already has shared `Sidebar` and `TopBar` components, replace the local versions with imports from your existing shared components.
- Search and filters work against the local sample configuration list; pagination updates the visible rows.
- Selecting a row updates the detail panel. The CA Components tab supports adding, editing, and deleting components.
- The panel warns when the sum of component marks exceeds the CA maximum. The example values intentionally reproduce the screenshot's warning state only when the selected component values exceed the configured maximum.
- The Settings tab exposes CA maximum, exam maximum, pass mark, rounding, and missing-score settings.
- All changes are local React state. Wire save/delete actions to your backend and replace illustrative records with real configuration data before production use.
