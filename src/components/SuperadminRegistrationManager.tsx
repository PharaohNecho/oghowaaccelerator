import React, { useState, useRef } from 'react';
import {
  Ticket,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  QrCode,
  Eye,
  Trash2,
  Plus,
  X,
  ExternalLink,
  MapPin,
  Building,
  User,
  Mail,
  Phone,
  Sparkles,
  Award,
  AlertCircle,
  Copy,
  Check,
  Download,
  Upload,
  Printer,
  FileText,
  Sliders,
  Calendar,
  FileSpreadsheet,
  ArrowUp,
  ArrowDown,
  EyeOff,
  Edit2,
  RotateCcw,
  ListPlus,
  CheckSquare,
  CircleDot,
  AlignLeft,
  Type,
  Hash,
  HelpCircle
} from 'lucide-react';
import { BusinessWeekConfig, RegisteredDelegate, RegistrationFormField, RegistrationFieldType } from '../types';
import { DEFAULT_REGISTRATION_FIELDS } from '../data/mockData';
import { BusinessWeekLogo } from './BusinessWeekLogo';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, cleanForFirestore } from '../lib/firebase';

interface SuperadminRegistrationManagerProps {
  config: BusinessWeekConfig;
  onUpdateConfig: (updated: BusinessWeekConfig) => void;
  onPreviewRegistration?: () => void;
}

// RFC 4180 compliant CSV parser helper
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        cell += '"';
        i++; // skip escaped quote
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      row.push(cell.trim());
      cell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip CRLF
      }
      row.push(cell.trim());
      if (row.some((c) => c.length > 0)) {
        lines.push(row);
      }
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some((c) => c.length > 0)) {
      lines.push(row);
    }
  }

  return lines;
}

export const SuperadminRegistrationManager: React.FC<SuperadminRegistrationManagerProps> = ({
  config,
  onUpdateConfig,
  onPreviewRegistration
}) => {
  // Current active form fields (falls back to DEFAULT_REGISTRATION_FIELDS)
  const formFields: RegistrationFormField[] = (config.formFields && config.formFields.length > 0)
    ? [...config.formFields].sort((a, b) => a.order - b.order)
    : DEFAULT_REGISTRATION_FIELDS;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');

  // Badge Inspection Modal State
  const [inspectingDelegate, setInspectingDelegate] = useState<RegisteredDelegate | null>(null);
  const [copiedCode, setCopiedCode] = useState<string>('');

  // Individual Registration Summary / Success Sheet State
  const [summaryDelegate, setSummaryDelegate] = useState<RegisteredDelegate | null>(null);

  // Print Roster / PDF Modal State
  const [isRosterPrintOpen, setIsRosterPrintOpen] = useState<boolean>(false);

  // Edit Registration Page Elements Modal State
  const [isEditingPageElements, setIsEditingPageElements] = useState<boolean>(false);
  const [pageElementsForm, setPageElementsForm] = useState({
    registrationTitle: config.registrationTitle || 'Óghowa Business Week — Participant Registration',
    registrationSubtitle: config.registrationSubtitle || 'Óghowa Business Week · Innovation for Economic Transformation',
    registrationDescription: config.registrationDescription || 'Register to take part in Óghowa Business Week, in collaboration with Benin Tech Fest. Join founders, investors, business leaders and innovators for keynotes, masterclasses, startup pitches and networking in Edo State.',
    registrationCapacity: config.registrationCapacity || 500,
    declarationText: config.declarationText || 'I confirm that the information provided is accurate and consent to its use for registration and for communicating with me about Óghowa Business Week.',
    updatesCheckboxLabel: config.updatesCheckboxLabel || 'Keep me updated about future Óghowa Business Week and Benin Tech Fest events.'
  });

  // ================= REGISTRATION FORM BUILDER STATE =================
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<RegistrationFormField | null>(null);
  const [editFieldForm, setEditFieldForm] = useState<{
    label: string;
    placeholder: string;
    helperText: string;
    required: boolean;
    isVisible: boolean;
    section: 'email' | 'about' | 'participation' | 'consent' | 'custom';
    optionsText: string;
  }>({
    label: '',
    placeholder: '',
    helperText: '',
    required: false,
    isVisible: true,
    section: 'about',
    optionsText: ''
  });

  const [isAddingField, setIsAddingField] = useState<boolean>(false);
  const [newFieldForm, setNewFieldForm] = useState<{
    label: string;
    type: RegistrationFieldType;
    placeholder: string;
    helperText: string;
    required: boolean;
    isVisible: boolean;
    section: 'email' | 'about' | 'participation' | 'consent' | 'custom';
    optionsText: string;
  }>({
    label: '',
    type: 'text',
    placeholder: '',
    helperText: '',
    required: false,
    isVisible: true,
    section: 'custom',
    optionsText: ''
  });

  // CSV Import State & Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importSuccessNotice, setImportSuccessNotice] = useState<string>('');

  // Add Delegate Modal State
  const [isAddingDelegate, setIsAddingDelegate] = useState<boolean>(false);
  const [newDelegateForm, setNewDelegateForm] = useState<Partial<RegisteredDelegate>>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    location: 'Benin City, Edo State, Nigeria',
    persona: 'executive',
    attendanceMode: 'in_person',
    status: 'Accreditation Issued',
    dealRoomInterest: false
  });

  // Toggle Registration Open / Closed
  const handleToggleRegistrationGateway = () => {
    const updatedStatus = config.isRegistrationOpen === false ? true : false;
    onUpdateConfig({
      ...config,
      isRegistrationOpen: updatedStatus
    });
  };

  // Change Delegate Status
  const handleChangeDelegateStatus = async (delegateId: string, newStatus: RegisteredDelegate['status']) => {
    const updatedDelegates = config.delegates.map((d) =>
      d.id === delegateId ? { ...d, status: newStatus } : d
    );
    onUpdateConfig({ ...config, delegates: updatedDelegates });
    try {
      await setDoc(doc(db, 'delegates', delegateId), { status: newStatus }, { merge: true });
    } catch (err) {
      console.error('Failed to update delegate status in Firestore:', err);
    }
  };

  // Delete Participant
  const handleDeleteDelegate = async (delegateId: string) => {
    if (window.confirm('Are you sure you want to revoke and delete this participant accreditation?')) {
      const updatedDelegates = config.delegates.filter((d) => d.id !== delegateId);
      onUpdateConfig({ ...config, delegates: updatedDelegates });
      try {
        await deleteDoc(doc(db, 'delegates', delegateId));
      } catch (err) {
        console.error('Failed to delete delegate from Firestore:', err);
      }
    }
  };

  // Add Delegate Submit
  const handleSaveNewDelegate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDelegateForm.name || !newDelegateForm.email) {
      alert('Delegate name and email are required');
      return;
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const createdDelegate: RegisteredDelegate = {
      id: `del-${Date.now()}`,
      code: `OBW-2026-DELEGATE-${randomDigits}`,
      name: newDelegateForm.name || 'Accredited Delegate',
      email: newDelegateForm.email || '',
      phone: newDelegateForm.phone || '+234 800 000 0000',
      organization: newDelegateForm.organization || 'Independent Operator',
      role: newDelegateForm.role || 'Executive Participant',
      location: newDelegateForm.location || 'Benin City, Nigeria',
      persona: newDelegateForm.persona || 'executive',
      tracks: ['digital_economy', 'investment_pitches'],
      masterclass: 'early_stage_fundraising',
      attendanceMode: (newDelegateForm.attendanceMode as any) || 'in_person',
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: (newDelegateForm.status as RegisteredDelegate['status']) || 'Accreditation Issued',
      dealRoomInterest: newDelegateForm.dealRoomInterest || false
    };

    onUpdateConfig({
      ...config,
      delegates: [createdDelegate, ...config.delegates]
    });

    try {
      await setDoc(doc(db, 'delegates', createdDelegate.id), cleanForFirestore(createdDelegate), { merge: true });
    } catch (err) {
      console.error('Failed to save delegate to Firestore:', err);
    }

    setIsAddingDelegate(false);
    setNewDelegateForm({
      name: '',
      email: '',
      phone: '',
      organization: '',
      role: '',
      location: 'Benin City, Edo State, Nigeria',
      persona: 'executive',
      attendanceMode: 'in_person',
      status: 'Accreditation Issued',
      dealRoomInterest: false
    });
  };

  // Save Page Elements
  const handleSavePageElements = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      ...config,
      registrationTitle: pageElementsForm.registrationTitle,
      registrationSubtitle: pageElementsForm.registrationSubtitle,
      registrationDescription: pageElementsForm.registrationDescription,
      registrationCapacity: Number(pageElementsForm.registrationCapacity) || 500,
      declarationText: pageElementsForm.declarationText,
      updatesCheckboxLabel: pageElementsForm.updatesCheckboxLabel
    });
    setIsEditingPageElements(false);
    setImportSuccessNotice('Registration page elements successfully updated.');
    setTimeout(() => setImportSuccessNotice(''), 4000);
  };

  // ================= FORM BUILDER HANDLERS =================
  // Toggle field visibility on public registration form
  const handleToggleFieldVisibility = (fieldId: string) => {
    const updated = formFields.map((f) =>
      f.id === fieldId ? { ...f, isVisible: f.isVisible === false ? true : false } : f
    );
    onUpdateConfig({ ...config, formFields: updated });
  };

  // Toggle field required flag
  const handleToggleFieldRequired = (fieldId: string) => {
    const updated = formFields.map((f) =>
      f.id === fieldId ? { ...f, required: !f.required } : f
    );
    onUpdateConfig({ ...config, formFields: updated });
  };

  // Move field Up or Down in order
  const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
    const index = formFields.findIndex((f) => f.id === fieldId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formFields.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newFields = [...formFields];
    const [movedField] = newFields.splice(index, 1);
    newFields.splice(targetIndex, 0, movedField);

    // Reassign order numbers sequentially
    const reordered = newFields.map((field, idx) => ({
      ...field,
      order: idx + 1
    }));

    onUpdateConfig({ ...config, formFields: reordered });
  };

  // Open Edit Field Dialog
  const handleOpenEditField = (field: RegistrationFormField) => {
    setEditingField(field);
    setEditFieldForm({
      label: field.label,
      placeholder: field.placeholder || '',
      helperText: field.helperText || '',
      required: field.required,
      isVisible: field.isVisible !== false,
      section: field.section || 'about',
      optionsText: field.options ? field.options.join('\n') : ''
    });
  };

  // Save Edited Field
  const handleSaveEditedField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingField) return;

    const parsedOptions = editFieldForm.optionsText
      ? editFieldForm.optionsText
          .split('\n')
          .map((o) => o.trim())
          .filter(Boolean)
      : undefined;

    const updated = formFields.map((f) => {
      if (f.id === editingField.id) {
        return {
          ...f,
          label: editFieldForm.label.trim() || f.label,
          placeholder: editFieldForm.placeholder.trim(),
          helperText: editFieldForm.helperText.trim(),
          required: editFieldForm.required,
          isVisible: editFieldForm.isVisible,
          section: editFieldForm.section,
          options: parsedOptions && parsedOptions.length > 0 ? parsedOptions : f.options
        };
      }
      return f;
    });

    onUpdateConfig({ ...config, formFields: updated });
    setEditingField(null);
    setImportSuccessNotice(`Field "${editFieldForm.label}" updated successfully.`);
    setTimeout(() => setImportSuccessNotice(''), 3500);
  };

  // Open Add Field Dialog
  const handleOpenAddField = () => {
    setNewFieldForm({
      label: '',
      type: 'text',
      placeholder: '',
      helperText: '',
      required: false,
      isVisible: true,
      section: 'custom',
      optionsText: ''
    });
    setIsAddingField(true);
  };

  // Save New Custom Field
  const handleSaveNewField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldForm.label) {
      alert('Field label is required');
      return;
    }

    const parsedOptions = newFieldForm.optionsText
      ? newFieldForm.optionsText
          .split('\n')
          .map((o) => o.trim())
          .filter(Boolean)
      : undefined;

    const newFieldId = `custom_${Date.now()}`;
    const newField: RegistrationFormField = {
      id: newFieldId,
      label: newFieldForm.label.trim(),
      type: newFieldForm.type,
      placeholder: newFieldForm.placeholder.trim(),
      helperText: newFieldForm.helperText.trim(),
      required: newFieldForm.required,
      isVisible: newFieldForm.isVisible,
      section: newFieldForm.section,
      order: formFields.length + 1,
      options: parsedOptions && parsedOptions.length > 0 ? parsedOptions : undefined,
      isCore: false
    };

    onUpdateConfig({
      ...config,
      formFields: [...formFields, newField]
    });

    setIsAddingField(false);
    setImportSuccessNotice(`New custom field "${newField.label}" added to registration form.`);
    setTimeout(() => setImportSuccessNotice(''), 4000);
  };

  // Delete Custom Field
  const handleDeleteField = (fieldId: string) => {
    const target = formFields.find((f) => f.id === fieldId);
    if (!target) return;
    if (target.isCore) {
      alert('Core standard fields cannot be deleted. You can hide them instead by toggling visibility off.');
      return;
    }

    if (window.confirm(`Delete custom field "${target.label}" from the registration form?`)) {
      const updated = formFields
        .filter((f) => f.id !== fieldId)
        .map((f, idx) => ({ ...f, order: idx + 1 }));
      onUpdateConfig({ ...config, formFields: updated });
    }
  };

  // Reset Form Schema to Default Standard Fields
  const handleResetFormFields = () => {
    if (window.confirm('Reset registration form fields to official default questions? All custom fields will be reset.')) {
      onUpdateConfig({ ...config, formFields: DEFAULT_REGISTRATION_FIELDS });
      setImportSuccessNotice('Registration form layout reset to default questions.');
      setTimeout(() => setImportSuccessNotice(''), 4000);
    }
  };

  // CSV Import handler for Google Forms export
  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length < 2) {
          alert('The uploaded CSV file does not contain enough data.');
          return;
        }

        const headers = rows[0].map((h) => h.toLowerCase().trim());
        const findIdx = (keywords: string[]) =>
          headers.findIndex((h) => keywords.some((k) => h.includes(k)));

        const nameIdx = headers.findIndex(
          (h) => h.includes('name') && !h.includes('organ') && !h.includes('school') && !h.includes('business')
        );
        const emailIdx = headers.findIndex((h) => h.includes('email'));
        const phoneIdx = findIdx(['phone', 'whatsapp', 'number', 'mobile']);
        const orgIdx = findIdx(['organis', 'organiz', 'business', 'school', 'company', 'firm']);
        const roleIdx = findIdx(['job', 'role', 'title', 'position']);
        const locIdx = findIdx(['city', 'state', 'country', 'location']);
        const personaIdx = findIdx(['describ', 'persona', 'category', 'which best']);
        const modeIdx = findIdx(['attend in person', 'in person', 'attendance', 'remotely', 'will you attend']);
        const sponsorIdx = findIdx(['sponsor', 'exhibit']);
        const timeIdx = findIdx(['timestamp', 'date', 'time']);

        const existingEmails = new Set(config.delegates.map((d) => d.email.toLowerCase().trim()));
        const newDelegates: RegisteredDelegate[] = [];

        for (let r = 1; r < rows.length; r++) {
          const row = rows[r];
          if (row.length === 0 || row.every((c) => !c)) continue;

          const email = (emailIdx !== -1 ? row[emailIdx] : '').trim();
          const name = (nameIdx !== -1 ? row[nameIdx] : '').trim() || (email ? email.split('@')[0] : 'Participant');
          if (!email && !name) continue;

          // Prevent exact duplicate email additions
          if (email && existingEmails.has(email.toLowerCase())) continue;

          const phone = (phoneIdx !== -1 ? row[phoneIdx] : '').trim() || '+234 800 000 0000';
          const organization = (orgIdx !== -1 ? row[orgIdx] : '').trim() || 'Independent';
          const role = (roleIdx !== -1 ? row[roleIdx] : '').trim() || 'Professional Delegate';
          const location = (locIdx !== -1 ? row[locIdx] : '').trim() || 'Benin City, Edo State, Nigeria';
          const personaRaw = (personaIdx !== -1 ? row[personaIdx] : '').trim();
          const modeRaw = (modeIdx !== -1 ? row[modeIdx] : '').toLowerCase();
          const attendanceMode: 'in_person' | 'virtual' =
            modeRaw.includes('remote') || modeRaw.includes('no') || modeRaw.includes('virtual')
              ? 'virtual'
              : 'in_person';

          const sponsorRaw = (sponsorIdx !== -1 ? row[sponsorIdx] : '').toLowerCase();
          const dealRoomInterest =
            sponsorRaw.includes('sponsor') || sponsorRaw.includes('exhibit') || sponsorRaw.includes('both');

          const registeredAt =
            timeIdx !== -1 && row[timeIdx]
              ? row[timeIdx].trim()
              : new Date().toISOString().substring(0, 16).replace('T', ' ');

          const randomDigits = Math.floor(1000 + Math.random() * 9000);

          const newDel: RegisteredDelegate = {
            id: `del-csv-${Date.now()}-${r}`,
            code: `OBW-2026-DELEGATE-${randomDigits}`,
            name,
            email: email || `delegate-${randomDigits}@registered.obw`,
            phone,
            organization,
            role,
            location,
            persona: personaRaw || 'executive',
            tracks: ['digital_economy', 'business_growth'],
            masterclass: 'early_stage_fundraising',
            attendanceMode,
            registeredAt,
            status: 'Accreditation Issued',
            dealRoomInterest
          };

          newDelegates.push(newDel);
          if (email) existingEmails.add(email.toLowerCase());
        }

        if (newDelegates.length === 0) {
          alert('No new unique registrations found to import (delegates with matching emails may already be present).');
          return;
        }

        onUpdateConfig({
          ...config,
          delegates: [...newDelegates, ...config.delegates]
        });

        for (const del of newDelegates) {
          setDoc(doc(db, 'delegates', del.id), cleanForFirestore(del), { merge: true }).catch((err) =>
            console.error('Failed to save imported delegate to Firestore:', err)
          );
        }

        setImportSuccessNotice(`Successfully imported ${newDelegates.length} delegates from Google Form CSV and saved to server!`);
        setTimeout(() => setImportSuccessNotice(''), 6000);
      } catch (err) {
        console.error(err);
        alert('Failed to parse the CSV file. Please verify it is a valid CSV export from Google Forms.');
      } finally {
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  // CSV Export handler
  const handleExportCsv = () => {
    const header = [
      'Reference Code',
      'Full Name',
      'Email',
      'Phone',
      'Organization',
      'Job Role',
      'Location',
      'Category / Persona',
      'Attendance Mode',
      'Status',
      'Deal Room Pitch',
      'Registration Date'
    ];

    const rows = config.delegates.map((d) => [
      `"${d.code}"`,
      `"${d.name.replace(/"/g, '""')}"`,
      `"${d.email.replace(/"/g, '""')}"`,
      `"${d.phone.replace(/"/g, '""')}"`,
      `"${d.organization.replace(/"/g, '""')}"`,
      `"${d.role.replace(/"/g, '""')}"`,
      `"${d.location.replace(/"/g, '""')}"`,
      `"${d.persona.replace(/"/g, '""')}"`,
      `"${d.attendanceMode === 'in_person' ? 'In-Person (Victor Uwaifo Hub)' : 'Virtual Stream'}"`,
      `"${d.status}"`,
      `"${d.dealRoomInterest ? 'Yes' : 'No'}"`,
      `"${d.registeredAt}"`
    ]);

    const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Oghowa_Business_Week_2026_Registrations_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter delegates list
  const filteredDelegates = config.delegates.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.organization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : d.status.toLowerCase().includes(statusFilter.toLowerCase());

    const matchesMode =
      modeFilter === 'all' ? true : d.attendanceMode === modeFilter;

    return matchesSearch && matchesStatus && matchesMode;
  });

  // Calculate live stats
  const totalDelegates = config.delegates.length;
  const inPersonCount = config.delegates.filter((d) => d.attendanceMode === 'in_person').length;
  const virtualCount = config.delegates.filter((d) => d.attendanceMode === 'virtual').length;
  const accreditedCount = config.delegates.filter(
    (d) => d.status.includes('Accreditation Issued') || d.status.includes('VIP')
  ).length;
  const dealRoomApplicants = config.delegates.filter((d) => d.dealRoomInterest).length;

  const visibleFieldsCount = formFields.filter((f) => f.isVisible !== false).length;
  const customFieldsCount = formFields.filter((f) => !f.isCore).length;

  return (
    <div className="space-y-6">
      {/* Hidden file input for Google Form CSV import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCsvImport}
        accept=".csv,text/csv"
        className="hidden"
      />

      {/* Import / Element Update Feedback Banner */}
      {importSuccessNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{importSuccessNotice}</span>
          </div>
          <button
            onClick={() => setImportSuccessNotice('')}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. TOP GATEWAY STATUS BANNER & PRIMARY CONTROLS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                config.isRegistrationOpen !== false ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <h3 className="text-xl font-bold text-[#0B1E48]">
              Registration Gateway Status:{' '}
              <span className={config.isRegistrationOpen !== false ? 'text-emerald-700' : 'text-rose-700'}>
                {config.isRegistrationOpen !== false ? 'OPEN & ACCEPTING PASSES' : 'PAUSED BY SUPERADMIN'}
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Control live registrations, arrange form fields, add custom questions, and toggle field visibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Form Builder & Field Manager Trigger Button */}
          <button
            onClick={() => setIsFormBuilderOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border border-rose-200 shadow-2xs"
            title="Edit registration form fields, add questions, and arrange visibility"
          >
            <ListPlus className="w-3.5 h-3.5 text-rose-600" />
            <span>Form Builder & Fields ({visibleFieldsCount} Visible)</span>
          </button>

          {/* Edit Registration Page Elements */}
          <button
            onClick={() => {
              setPageElementsForm({
                registrationTitle: config.registrationTitle || 'Óghowa Business Week — Participant Registration',
                registrationSubtitle: config.registrationSubtitle || 'Óghowa Business Week · Innovation for Economic Transformation',
                registrationDescription: config.registrationDescription || 'Register to take part in Óghowa Business Week, in collaboration with Benin Tech Fest. Join founders, investors, business leaders and innovators for keynotes, masterclasses, startup pitches and networking in Edo State.',
                registrationCapacity: config.registrationCapacity || 500,
                declarationText: config.declarationText || 'I confirm that the information provided is accurate and consent to its use for registration and for communicating with me about Óghowa Business Week.',
                updatesCheckboxLabel: config.updatesCheckboxLabel || 'Keep me updated about future Óghowa Business Week and Benin Tech Fest events.'
              });
              setIsEditingPageElements(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border border-slate-300"
            title="Edit registration page title, description, and consent copy"
          >
            <Sliders className="w-3.5 h-3.5 text-[#0B1E48]" />
            <span>Edit Page Text</span>
          </button>

          {/* Toggle Gateway */}
          <button
            onClick={handleToggleRegistrationGateway}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
              config.isRegistrationOpen !== false
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {config.isRegistrationOpen !== false ? 'Pause Gateway' : 'Reopen Gateway'}
            </span>
          </button>

          {onPreviewRegistration && (
            <button
              onClick={onPreviewRegistration}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Preview Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. REGISTRATION STATS DASHBOARD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Enrolled</span>
          <p className="text-2xl font-black text-[#0B1E48] mt-1">{totalDelegates}</p>
          <span className="text-[11px] text-slate-500">Cap: {config.registrationCapacity || 500} Participants</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Accredited Passes</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{accreditedCount}</p>
          <span className="text-[11px] text-slate-500">RFID badges cleared</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-[#0B1E48] uppercase tracking-wider block">In-Person Participants</span>
          <p className="text-2xl font-black text-[#0B1E48] mt-1">{inPersonCount}</p>
          <span className="text-[11px] text-slate-500">Victor Uwaifo Hub</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Virtual Global Stream</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{virtualCount}</p>
          <span className="text-[11px] text-slate-500">Remote attendees</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Deal Room Pitches</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{dealRoomApplicants}</p>
          <span className="text-[11px] text-slate-500">₦50M Syndicate</span>
        </div>
      </div>

      {/* 3. PARTICIPANTS ROSTER CONTROLS, IMPORT/EXPORT & TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#0B1E48]">Live Registered Participants Roster</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage participant records, import Google Form registrations, and export CSV/PDF summaries.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Import Google Form CSV */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              title="Import registration data from existing Google Form CSV"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Import Google Form CSV</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              title="Download entire participant ledger as CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            {/* Export PDF / Print Roster */}
            <button
              onClick={() => setIsRosterPrintOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              title="Generate printable PDF ledger of registrations"
            >
              <Printer className="w-3.5 h-3.5 text-purple-600" />
              <span>Print / PDF Ledger</span>
            </button>

            {/* Add Delegate */}
            <button
              onClick={() => setIsAddingDelegate(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#00231b] hover:bg-[#0e3a2f] rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#FEF3C7]" />
              <span>Manual Accreditation</span>
            </button>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, code (OBW-2026-...), or organization..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#00231b] focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#00231b] focus:outline-hidden font-medium"
            >
              <option value="all">All Accreditation Statuses</option>
              <option value="accreditation">Accreditation Issued</option>
              <option value="vip">Fast-Track VIP</option>
              <option value="pending">Pending Review</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#00231b] focus:outline-hidden font-medium"
            >
              <option value="all">All Attendance Modes</option>
              <option value="in_person">In-Person Physical Pass</option>
              <option value="virtual">Virtual Global Stream</option>
            </select>
          </div>
        </div>

        {/* Delegates Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Reference Code</th>
                <th className="p-3.5">Delegate Details</th>
                <th className="p-3.5">Organization & Role</th>
                <th className="p-3.5">Mode & Pitch</th>
                <th className="p-3.5">Accreditation Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDelegates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No participants found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDelegates.map((delegate) => (
                  <tr key={delegate.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 whitespace-nowrap font-mono font-bold text-[#00231b]">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#FEF3C7] text-[#B45309] px-2 py-0.5 rounded text-[11px]">
                          {delegate.code}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                        {delegate.registeredAt}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-800 text-sm">{delegate.name}</div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{delegate.email}</span>
                      </div>
                      <div className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-300" />
                        <span>{delegate.phone}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-slate-700">{delegate.organization}</div>
                      <div className="text-slate-500 text-[11px]">{delegate.role}</div>
                      <div className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        <span>{delegate.location}</span>
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          delegate.attendanceMode === 'in_person'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {delegate.attendanceMode === 'in_person' ? 'Physical Pass' : 'Virtual Pass'}
                      </span>
                      {delegate.dealRoomInterest && (
                        <span className="block mt-1 text-[10px] font-extrabold text-[#B45309]">
                          ★ ₦50M Deal Room Pitch
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <select
                        value={delegate.status}
                        onChange={(e) =>
                          handleChangeDelegateStatus(
                            delegate.id,
                            e.target.value as RegisteredDelegate['status']
                          )
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer focus:outline-hidden ${
                          delegate.status.includes('VIP')
                            ? 'bg-purple-50 text-purple-700 border-purple-300'
                            : delegate.status.includes('Issued')
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : delegate.status.includes('Declined')
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}
                      >
                        <option value="Accreditation Issued">Accreditation Issued</option>
                        <option value="Fast-Track VIP">Fast-Track VIP</option>
                        <option value="Pending Verification">Pending Verification</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Summary / Success Sheet */}
                        <button
                          onClick={() => setSummaryDelegate(delegate)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                          title="View and print individual registration sheet / voucher"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Summary Sheet</span>
                        </button>

                        {/* View Digital Badge */}
                        <button
                          onClick={() => setInspectingDelegate(delegate)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-[#00231b] hover:text-white text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                          title="Inspect live accreditation digital pass"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Badge</span>
                        </button>

                        {/* Revoke */}
                        <button
                          onClick={() => handleDeleteDelegate(delegate.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Revoke and delete registration"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: REGISTRATION FORM BUILDER & FIELD MANAGER ================= */}
      {isFormBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto border border-slate-200 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
                    <ListPlus className="w-4 h-4" />
                    <span>Dynamic Schema Engine</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#0B1E48]">
                    Registration Form Builder & Field Manager
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Control which fields are visible on the public registration form, reorder fields, edit questions, and add custom fields.
                  </p>
                </div>

                <button
                  onClick={() => setIsFormBuilderOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Ribbon & Overview */}
              <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-700"><strong>{visibleFieldsCount}</strong> Visible</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span className="text-slate-700"><strong>{formFields.length - visibleFieldsCount}</strong> Hidden</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span className="text-slate-700"><strong>{customFieldsCount}</strong> Custom</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetFormFields}
                    className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    title="Restore default 14 standard questions"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reset Layout</span>
                  </button>

                  <button
                    onClick={handleOpenAddField}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Field</span>
                  </button>
                </div>
              </div>

              {/* Fields List */}
              <div className="space-y-3">
                {formFields.map((field, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === formFields.length - 1;

                  return (
                    <div
                      key={field.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                        field.isVisible !== false
                          ? 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                          : 'bg-slate-50/80 border-dashed border-slate-300 opacity-60'
                      }`}
                    >
                      {/* Left: Reorder Controls + Info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Up / Down Reorder buttons */}
                        <div className="flex flex-col gap-1 shrink-0 pt-0.5">
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => handleMoveField(field.id, 'up')}
                            className={`p-1 rounded transition cursor-pointer ${
                              isFirst ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                            title="Move field up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => handleMoveField(field.id, 'down')}
                            className={`p-1 rounded transition cursor-pointer ${
                              isLast ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                            title="Move field down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Order Number Badge */}
                        <div className="w-6 h-6 rounded-md bg-slate-100 font-bold text-[10px] text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                          #{field.order}
                        </div>

                        {/* Field Label, Helper, and Type preview */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-bold text-[#0B1E48] text-sm tracking-tight truncate">
                              {field.label}
                            </h4>

                            {/* Required Badge */}
                            {field.required ? (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.2 rounded-full">
                                Required *
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.2 rounded-full">
                                Optional
                              </span>
                            )}

                            {/* Field Type Badge */}
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.2 rounded uppercase">
                              {field.type}
                            </span>

                            {/* Section Badge */}
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.2 rounded capitalize">
                              {field.section}
                            </span>

                            {/* Custom Field Badge */}
                            {!field.isCore && (
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.2 rounded">
                                Custom
                              </span>
                            )}
                          </div>

                          {field.helperText && (
                            <p className="text-xs text-slate-500 truncate" title={field.helperText}>
                              {field.helperText}
                            </p>
                          )}

                          {/* Options pills preview */}
                          {field.options && field.options.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              {field.options.slice(0, 4).map((opt) => (
                                <span
                                  key={opt}
                                  className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                                >
                                  {opt}
                                </span>
                              ))}
                              {field.options.length > 4 && (
                                <span className="text-[10px] text-slate-400 font-semibold">
                                  +{field.options.length - 4} more choices
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Controls & Toggles */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        {/* Visibility Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleFieldVisibility(field.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                            field.isVisible !== false
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
                          }`}
                          title={field.isVisible !== false ? 'Click to hide this field' : 'Click to make this field visible'}
                        >
                          {field.isVisible !== false ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>

                        {/* Required Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleFieldRequired(field.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                            field.required
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 font-bold'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Toggle required status"
                        >
                          {field.required ? 'Mandatory (*)' : 'Optional'}
                        </button>

                        {/* Edit Field Details */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditField(field)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition border border-slate-200"
                          title="Edit question text, helper, and choices"
                        >
                          <Edit2 className="w-3 h-3 text-[#0B1E48]" />
                          <span>Edit</span>
                        </button>

                        {/* Delete Custom Field */}
                        {!field.isCore && (
                          <button
                            type="button"
                            onClick={() => handleDeleteField(field.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition"
                            title="Delete custom field"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Done button */}
            <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Changes are updated immediately and applied dynamically to the public registration form.
              </span>
              <button
                type="button"
                onClick={() => setIsFormBuilderOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT FIELD DETAILS ================= */}
      {editingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingField(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase mb-1">
              <Edit2 className="w-4 h-4" />
              <span>Field Configuration</span>
            </div>
            <h3 className="text-xl font-bold text-[#0B1E48] mb-1">
              Edit Field Details
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Customize the label, description, placeholder and options for this question.
            </p>

            <form onSubmit={handleSaveEditedField} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Question / Field Label *</label>
                <input
                  type="text"
                  value={editFieldForm.label}
                  onChange={(e) => setEditFieldForm({ ...editFieldForm, label: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Helper Description / Subtitle</label>
                <input
                  type="text"
                  value={editFieldForm.helperText}
                  onChange={(e) => setEditFieldForm({ ...editFieldForm, helperText: e.target.value })}
                  placeholder="e.g. Include your country code, e.g. +234…"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Placeholder Text</label>
                <input
                  type="text"
                  value={editFieldForm.placeholder}
                  onChange={(e) => setEditFieldForm({ ...editFieldForm, placeholder: e.target.value })}
                  placeholder="e.g. Your organisation or Independent"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Form Section</label>
                  <select
                    value={editFieldForm.section}
                    onChange={(e) => setEditFieldForm({ ...editFieldForm, section: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="email">Primary Email Card</option>
                    <option value="about">Section 1: About You</option>
                    <option value="participation">Section 2: Your Participation</option>
                    <option value="custom">Section: Additional Details</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Field Type (Read-Only)</label>
                  <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-sm font-mono text-slate-700 capitalize">
                    {editingField.type}
                  </div>
                </div>
              </div>

              {/* Options Editor (if type is select, radio, or checkbox) */}
              {(editingField.type === 'select' || editingField.type === 'radio' || editingField.type === 'checkbox') && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Selectable Options (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={editFieldForm.optionsText}
                    onChange={(e) => setEditFieldForm({ ...editFieldForm, optionsText: e.target.value })}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Enter each selectable choice on a separate line.
                  </span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFieldForm.required}
                    onChange={(e) => setEditFieldForm({ ...editFieldForm, required: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Field is mandatory (*)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFieldForm.isVisible}
                    onChange={(e) => setEditFieldForm({ ...editFieldForm, isVisible: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Visible on public form</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingField(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Field Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW CUSTOM FIELD ================= */}
      {isAddingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddingField(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase mb-1">
              <Plus className="w-4 h-4" />
              <span>Form Extension</span>
            </div>
            <h3 className="text-xl font-bold text-[#0B1E48] mb-1">
              Add New Registration Field
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Add a new custom question to capture attendee information during registration.
            </p>

            <form onSubmit={handleSaveNewField} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Question / Field Label *</label>
                <input
                  type="text"
                  value={newFieldForm.label}
                  onChange={(e) => setNewFieldForm({ ...newFieldForm, label: e.target.value })}
                  placeholder="e.g. LinkedIn Profile URL, Industry Sector, Pitch Deck Link"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Input Type</label>
                  <select
                    value={newFieldForm.type}
                    onChange={(e) => setNewFieldForm({ ...newFieldForm, type: e.target.value as RegistrationFieldType })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="text">Single-line Text</option>
                    <option value="textarea">Multi-line Textarea</option>
                    <option value="number">Numeric Input</option>
                    <option value="select">Dropdown Select</option>
                    <option value="radio">Multiple Choice (Radio)</option>
                    <option value="checkbox">Multi-Select (Checkboxes)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Section Assignment</label>
                  <select
                    value={newFieldForm.section}
                    onChange={(e) => setNewFieldForm({ ...newFieldForm, section: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="about">Section 1: About You</option>
                    <option value="participation">Section 2: Your Participation</option>
                    <option value="custom">Section: Additional Details</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Helper Instructions (Optional)</label>
                <input
                  type="text"
                  value={newFieldForm.helperText}
                  onChange={(e) => setNewFieldForm({ ...newFieldForm, helperText: e.target.value })}
                  placeholder="e.g. Provide direct URL or link"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Placeholder (Optional)</label>
                <input
                  type="text"
                  value={newFieldForm.placeholder}
                  onChange={(e) => setNewFieldForm({ ...newFieldForm, placeholder: e.target.value })}
                  placeholder="e.g. https://linkedin.com/in/..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              {/* Options input if type is select, radio, or checkbox */}
              {(newFieldForm.type === 'select' || newFieldForm.type === 'radio' || newFieldForm.type === 'checkbox') && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Selectable Choices (One per line) *
                  </label>
                  <textarea
                    rows={4}
                    value={newFieldForm.optionsText}
                    onChange={(e) => setNewFieldForm({ ...newFieldForm, optionsText: e.target.value })}
                    placeholder="Choice 1&#10;Choice 2&#10;Choice 3"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-mono"
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Provide each option on a new line.
                  </span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFieldForm.required}
                    onChange={(e) => setNewFieldForm({ ...newFieldForm, required: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Field is required (*)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFieldForm.isVisible}
                    onChange={(e) => setNewFieldForm({ ...newFieldForm, isVisible: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Visible by default</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingField(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Field to Form</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: VIEW ACCREDITATION BADGE PASS ================= */}
      {inspectingDelegate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-[#E5DFD5]">
            <button
              onClick={() => setInspectingDelegate(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider bg-[#FEF3C7] px-3 py-1 rounded-full">
                Accreditation Pass Inspector
              </span>
              <h3 className="text-xl font-bold text-[#00231b] mt-1">Official Delegate Badge</h3>
              <p className="text-xs text-slate-500">Presented by the participant at the physical or virtual venue check-in.</p>
            </div>

            {/* DIGITAL BADGE VISUAL */}
            <div className="rounded-2xl bg-white border-2 border-[#00231b] shadow-xl overflow-hidden relative font-sans">
              {/* Lanyard Clip Hole */}
              <div className="w-full bg-[#00231b] py-2 flex justify-center items-center border-b border-[#316858]">
                <div className="w-16 h-3 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-6 h-1 bg-[#00231b] rounded-full" />
                </div>
              </div>

              {/* Badge Header with Logo */}
              <div className="p-4 bg-gradient-to-b from-[#FBF9F5] to-white border-b border-[#E5DFD5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BusinessWeekLogo size="sm" />
                  <div>
                    <span className="text-xs font-black text-[#00231b] block leading-tight">Óghowa Business Week</span>
                    <span className="text-[9px] text-[#52605B]">Official Summit Pass • 2026</span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {inspectingDelegate.status}
                </span>
              </div>

              {/* Attendee Info Body */}
              <div className="p-5 text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-[#00231b] text-white flex items-center justify-center mx-auto text-xl font-black shadow-md border-2 border-[#FEF3C7]">
                  {inspectingDelegate.name.substring(0, 2).toUpperCase()}
                </div>
                <h4 className="text-lg font-black text-[#00231b]">{inspectingDelegate.name}</h4>
                <p className="text-xs font-bold text-[#B45309]">{inspectingDelegate.role}</p>
                <p className="text-xs text-slate-600">{inspectingDelegate.organization}</p>
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{inspectingDelegate.location}</span>
                </p>
              </div>

              {/* Custom Answers if present */}
              {inspectingDelegate.customAnswers && Object.keys(inspectingDelegate.customAnswers).length > 0 && (
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-left text-xs space-y-1.5">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wider">Custom Responses</span>
                  {Object.entries(inspectingDelegate.customAnswers).map(([k, v]) => (
                    <div key={k} className="text-slate-700">
                      <span className="font-semibold text-slate-900">{k}:</span> {Array.isArray(v) ? v.join(', ') : String(v)}
                    </div>
                  ))}
                </div>
              )}

              {/* QR Code and Barcode Box */}
              <div className="bg-[#FBF9F5] p-4 border-t border-[#E5DFD5] text-center space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs inline-block">
                    <QrCode className="w-16 h-16 text-[#00231b]" />
                  </div>
                  <div className="text-left text-[11px] space-y-1">
                    <span className="text-slate-400 uppercase text-[9px] font-bold block">RFID Accreditation</span>
                    <span className="font-mono font-bold text-slate-800 block">{inspectingDelegate.code}</span>
                    <span className="text-emerald-700 font-semibold block text-[10px]">
                      {inspectingDelegate.attendanceMode === 'in_person'
                        ? '● Victor Uwaifo Creative Hub'
                        : '● Global Virtual Stream'}
                    </span>
                  </div>
                </div>

                {/* Barcode Strip */}
                <div className="h-6 bg-slate-800/10 rounded flex items-center justify-center px-4 mt-2">
                  <div className="font-mono text-[9px] tracking-widest text-slate-600">
                    ||| | |||| | ||| |||| || | |||| || |
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-2.5 text-xs">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inspectingDelegate.code);
                  setCopiedCode(inspectingDelegate.code);
                  setTimeout(() => setCopiedCode(''), 2500);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedCode === inspectingDelegate.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setSummaryDelegate(inspectingDelegate);
                  setInspectingDelegate(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Summary Sheet</span>
              </button>

              <button
                onClick={() => setInspectingDelegate(null)}
                className="px-4 py-2.5 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: INDIVIDUAL REGISTRATION SUMMARY / SUCCESS SHEET ================= */}
      {summaryDelegate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto border border-slate-200 print:p-0 print:border-none print:shadow-none">
            <button
              onClick={() => setSummaryDelegate(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Registration Sheet Container */}
            <div id="printable-summary-sheet" className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
                <div className="flex items-center gap-3">
                  <BusinessWeekLogo size="md" />
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#0B1E48] tracking-tight">
                      Óghowa Business Week 2026
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold">
                      In Collaboration with Benin Tech Fest • Official Delegate Registration Voucher
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-black text-xs uppercase tracking-wider rounded-full border border-emerald-200">
                    {summaryDelegate.status}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Recorded: {summaryDelegate.registeredAt}
                  </span>
                </div>
              </div>

              {/* Reference ID & Barcode Callout */}
              <div className="bg-[#F8FAFC] p-4.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Official Accreditation Reference ID
                  </span>
                  <span className="text-2xl font-black font-mono text-[#0B1E48] tracking-wider block mt-0.5">
                    {summaryDelegate.code}
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cryptographically Signed & Registered in Edo State Innovation Roster</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shrink-0">
                  <QrCode className="w-14 h-14 text-[#0B1E48]" />
                  <div className="text-[10px] text-slate-500 font-mono">
                    <div>SCAN AT ENTRANCE</div>
                    <div className="font-bold text-slate-800">VICTOR UWAIFO HUB</div>
                    <div className="text-slate-400">BENIN CITY, EDO</div>
                  </div>
                </div>
              </div>

              {/* Participant Full Details Grid */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-xs">
                <div className="bg-slate-100 px-4 py-2.5 font-bold uppercase text-[10px] text-slate-600 tracking-wider">
                  Accredited Participant Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Full Name</span>
                      <span className="text-sm font-bold text-slate-900 block mt-0.5">{summaryDelegate.name}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Email Address</span>
                      <span className="text-xs font-semibold text-slate-800 block mt-0.5">{summaryDelegate.email}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Phone / WhatsApp</span>
                      <span className="text-xs font-semibold text-slate-800 block mt-0.5">{summaryDelegate.phone}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Organization / School</span>
                      <span className="text-sm font-bold text-slate-900 block mt-0.5">{summaryDelegate.organization}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Job Title / Role</span>
                      <span className="text-xs font-semibold text-slate-800 block mt-0.5">{summaryDelegate.role}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">City, State & Country</span>
                      <span className="text-xs font-semibold text-slate-800 block mt-0.5">{summaryDelegate.location}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/50 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Attendance Mode</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {summaryDelegate.attendanceMode === 'in_person' ? 'Physical (Victor Uwaifo Hub)' : 'Virtual Global Stream'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Participant Category</span>
                    <span className="font-bold text-slate-800 mt-0.5 block capitalize">
                      {summaryDelegate.persona}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Deal Syndicate Room</span>
                    <span className={`font-bold mt-0.5 block ${summaryDelegate.dealRoomInterest ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {summaryDelegate.dealRoomInterest ? 'Yes (₦50M Deal Pitch)' : 'General Plenary'}
                    </span>
                  </div>
                </div>

                {/* Additional Custom Field Responses */}
                {summaryDelegate.customAnswers && Object.keys(summaryDelegate.customAnswers).length > 0 && (
                  <div className="border-t border-slate-100 bg-purple-50/30 p-4">
                    <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider block mb-2">
                      Additional Question Answers
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {Object.entries(summaryDelegate.customAnswers).map(([k, v]) => (
                        <div key={k} className="p-2.5 rounded-lg bg-white border border-purple-100">
                          <span className="text-slate-400 text-[10px] block font-bold">{k}</span>
                          <span className="font-semibold text-slate-800 block mt-0.5">
                            {Array.isArray(v) ? v.join(', ') : String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Event Logistics & Access Notice */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>Summit Event Notice • November 16 – 21, 2026</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  <strong>Venue:</strong> Victor Uwaifo Creative Hub, Benin City, Edo State. Please present this sheet (digital on phone or printed hardcopy) alongside a valid form of identification at the accreditation desk to receive your RFID physical badge and summit delegate pack.
                </p>
              </div>
            </div>

            {/* Print & Action Buttons */}
            <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-200 print:hidden">
              <button
                type="button"
                onClick={() => setSummaryDelegate(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                Close Sheet
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#FEF3C7]" />
                <span>Print Registration Sheet / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: FULL PARTICIPANTS ROSTER PRINT / PDF VIEW ================= */}
      {isRosterPrintOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto border border-slate-200 print:p-0 print:border-none print:shadow-none">
            <button
              onClick={() => setIsRosterPrintOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-slate-200 pb-5 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BusinessWeekLogo size="md" />
                <div>
                  <h3 className="text-xl font-black text-[#0B1E48]">
                    Óghowa Business Week 2026 — Official Participant Ledger
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Venue: Victor Uwaifo Creative Hub • Accredited Participants Roster
                  </p>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="font-bold text-[#0B1E48] block">Total: {config.delegates.length} Participants</span>
                <span className="text-[10px] text-slate-400">Generated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Printable Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl mb-6">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Participant</th>
                    <th className="p-2.5">Organization & Role</th>
                    <th className="p-2.5">Location</th>
                    <th className="p-2.5">Mode</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {config.delegates.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-slate-900">{d.code}</td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900">{d.name}</div>
                        <div className="text-slate-500 text-[10px]">{d.email}</div>
                      </td>
                      <td className="p-2.5">
                        <div className="font-semibold text-slate-800">{d.organization}</div>
                        <div className="text-slate-500 text-[10px]">{d.role}</div>
                      </td>
                      <td className="p-2.5 text-slate-600">{d.location}</td>
                      <td className="p-2.5 whitespace-nowrap">
                        <span className="text-[10px] font-bold">
                          {d.attendanceMode === 'in_person' ? 'Physical' : 'Virtual'}
                        </span>
                      </td>
                      <td className="p-2.5 whitespace-nowrap">
                        <span className="text-[10px] font-bold text-emerald-700">{d.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Print action buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 print:hidden">
              <button
                type="button"
                onClick={() => setIsRosterPrintOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#FEF3C7]" />
                <span>Print Ledger / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT REGISTRATION PAGE ELEMENTS ================= */}
      {isEditingPageElements && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditingPageElements(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase mb-1">
              <Sliders className="w-4 h-4" />
              <span>Page Customization</span>
            </div>
            <h3 className="text-xl font-bold text-[#0B1E48] mb-1">
              Edit Registration Page Elements
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Customize registration page headings, descriptions, capacity limit, and legal consent statements.
            </p>

            <form onSubmit={handleSavePageElements} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Registration Page Title
                </label>
                <input
                  type="text"
                  value={pageElementsForm.registrationTitle}
                  onChange={(e) =>
                    setPageElementsForm({ ...pageElementsForm, registrationTitle: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Subtitle / Theme Line
                </label>
                <input
                  type="text"
                  value={pageElementsForm.registrationSubtitle}
                  onChange={(e) =>
                    setPageElementsForm({ ...pageElementsForm, registrationSubtitle: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Registration Overview Description
                </label>
                <textarea
                  rows={3}
                  value={pageElementsForm.registrationDescription}
                  onChange={(e) =>
                    setPageElementsForm({ ...pageElementsForm, registrationDescription: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Total Capacity Limit (Participants)
                </label>
                <input
                  type="number"
                  min={1}
                  value={pageElementsForm.registrationCapacity}
                  onChange={(e) =>
                    setPageElementsForm({
                      ...pageElementsForm,
                      registrationCapacity: Number(e.target.value) || 500
                    })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Used by the real-time vacant seats calculator on the registration header.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Participant Consent Declaration Statement
                </label>
                <textarea
                  rows={2}
                  value={pageElementsForm.declarationText}
                  onChange={(e) =>
                    setPageElementsForm({ ...pageElementsForm, declarationText: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Updates & Communications Opt-in Label
                </label>
                <input
                  type="text"
                  value={pageElementsForm.updatesCheckboxLabel}
                  onChange={(e) =>
                    setPageElementsForm({ ...pageElementsForm, updatesCheckboxLabel: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingPageElements(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#FEF3C7]" />
                  <span>Save Page Elements</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: MANUAL ACCREDITATION / ADD DELEGATE ================= */}
      {isAddingDelegate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-[#0B1E48] mb-4">
              Manual VIP Delegate Accreditation
            </h3>
            <p className="text-xs text-slate-500 -mt-3 mb-4">
              Directly issue an official pass for keynote speakers, government liaisons, or sponsors.
            </p>

            <form onSubmit={handleSaveNewDelegate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Delegate Full Name</label>
                <input
                  type="text"
                  value={newDelegateForm.name || ''}
                  onChange={(e) => setNewDelegateForm({ ...newDelegateForm, name: e.target.value })}
                  placeholder="Osagie Egharevba"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newDelegateForm.email || ''}
                    onChange={(e) => setNewDelegateForm({ ...newDelegateForm, email: e.target.value })}
                    placeholder="delegate@company.com"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newDelegateForm.phone || ''}
                    onChange={(e) => setNewDelegateForm({ ...newDelegateForm, phone: e.target.value })}
                    placeholder="+234 801 234 5678"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Organization / Firm</label>
                  <input
                    type="text"
                    value={newDelegateForm.organization || ''}
                    onChange={(e) => setNewDelegateForm({ ...newDelegateForm, organization: e.target.value })}
                    placeholder="Edo Innovation Hub / Pan-African VC"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Job Role</label>
                  <input
                    type="text"
                    value={newDelegateForm.role || ''}
                    onChange={(e) => setNewDelegateForm({ ...newDelegateForm, role: e.target.value })}
                    placeholder="Managing Partner"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Attendance Mode</label>
                  <select
                    value={newDelegateForm.attendanceMode || 'in_person'}
                    onChange={(e) =>
                      setNewDelegateForm({ ...newDelegateForm, attendanceMode: e.target.value as any })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="in_person">In-Person (Victor Uwaifo Hub)</option>
                    <option value="virtual">Virtual Global Stream</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Accreditation Level</label>
                  <select
                    value={newDelegateForm.status || 'Accreditation Issued'}
                    onChange={(e) =>
                      setNewDelegateForm({
                        ...newDelegateForm,
                        status: e.target.value as RegisteredDelegate['status']
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white font-bold"
                  >
                    <option value="Accreditation Issued">Accreditation Issued</option>
                    <option value="Fast-Track VIP">Fast-Track VIP</option>
                    <option value="Pending Verification">Pending Verification</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="dealRoomInterestCheck"
                  checked={newDelegateForm.dealRoomInterest || false}
                  onChange={(e) =>
                    setNewDelegateForm({ ...newDelegateForm, dealRoomInterest: e.target.checked })
                  }
                  className="w-4 h-4 text-[#00231b] rounded"
                />
                <label htmlFor="dealRoomInterestCheck" className="text-slate-800 font-bold">
                  Grant Access to the ₦50,000,000 Deal Syndicate Pitch Room
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingDelegate(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold shadow-xs cursor-pointer"
                >
                  Issue VIP Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
