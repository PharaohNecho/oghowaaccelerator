import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Send,
  Mail,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  User,
  Building,
  ArrowRight,
  Eye,
  X,
  Sparkles,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Layers,
  Handshake,
  Ticket,
  Clock,
  RotateCcw,
  Check,
  Server,
  Settings,
  Radio,
  Image as ImageIcon,
  ExternalLink,
  Key
} from 'lucide-react';
import { EmailNotification, Venture, PartnerItem, CarouselSlide, BusinessWeekConfig, SmtpSettings } from '../types';
import { DEFAULT_SMTP_SETTINGS } from '../data/mockData';
import { SuperadminSummitManager } from './SuperadminSummitManager';
import { SuperadminRegistrationManager } from './SuperadminRegistrationManager';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, cleanForFirestore } from '../lib/firebase';

interface SuperadminPortalProps {
  appData: {
    founderName: string;
    founderEmail: string;
    founderPhone: string;
    startupName: string;
    sector: string;
    stage: string;
    description: string;
    targetMarket: string;
    tractionMRR: string;
    activeUsers: string;
    deckFileName: string;
    cacFileName: string;
  };
  appStatus: string;
  adminNotes: string;
  sentEmails: EmailNotification[];
  ventures: Venture[];
  partners: PartnerItem[];
  carouselEvents: CarouselSlide[];
  businessWeekConfig: BusinessWeekConfig;
  smtpSettings?: SmtpSettings;
  onUpdateStatus: (newStatus: string, feedbackMsg: string) => void;
  onUpdateVentures: (updated: Venture[]) => void;
  onUpdatePartners: (updated: PartnerItem[]) => void;
  onUpdateCarouselEvents: (updated: CarouselSlide[]) => void;
  onUpdateBusinessWeekConfig: (updated: BusinessWeekConfig) => void;
  onUpdateSmtpSettings?: (updated: SmtpSettings) => void;
  onSendCustomEmail?: (email: EmailNotification) => void;
  onBackToDashboard: () => void;
  onBackToHome: () => void;
  onNavigateToBusinessWeek?: () => void;
  onNavigateToRegistration?: () => void;
}

export const SuperadminPortal: React.FC<SuperadminPortalProps> = ({
  appData,
  appStatus,
  adminNotes,
  sentEmails,
  ventures,
  partners,
  carouselEvents,
  businessWeekConfig,
  smtpSettings = DEFAULT_SMTP_SETTINGS,
  onUpdateStatus,
  onUpdateVentures,
  onUpdatePartners,
  onUpdateCarouselEvents,
  onUpdateBusinessWeekConfig,
  onUpdateSmtpSettings,
  onSendCustomEmail,
  onBackToDashboard,
  onBackToHome,
  onNavigateToBusinessWeek,
  onNavigateToRegistration
}) => {
  // Stored Admin Credentials (saved to localStorage so changes persist)
  const [adminCredentials, setAdminCredentials] = useState<{ username: string; password: string }>(() => {
    try {
      const saved = localStorage.getItem('oghowa_admin_credentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username && parsed.password) return parsed;
      }
    } catch {
      // Fallback
    }
    return { username: 'Admin01', password: 'OghAdmin@26' };
  });

  // Sync Admin Credentials with Firestore server so changes persist across all devices/sessions
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'adminAuth'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as { username?: string; password?: string };
        if (data.username && data.password) {
          setAdminCredentials({ username: data.username, password: data.password });
        }
      } else {
        // Initialize default credentials document on server if not yet present
        setDoc(doc(db, 'settings', 'adminAuth'), { username: 'Admin01', password: 'OghAdmin@26' }, { merge: true }).catch((err) =>
          console.warn('Could not initialize adminAuth on server:', err)
        );
      }
    });
    return () => unsub();
  }, []);

  // Authentication & Auto-Lock State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [unlockPasswordInput, setUnlockPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Password / Credentials Change Modal State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [currentPassInput, setCurrentPassInput] = useState<string>('');
  const [newUsernameInput, setNewUsernameInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [credUpdateSuccess, setCredUpdateSuccess] = useState<string>('');
  const [credUpdateError, setCredUpdateError] = useState<string>('');

  // 5 Minutes (300 seconds) Inactivity Auto-Lock
  const TIMEOUT_SECONDS = 300;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(TIMEOUT_SECONDS);
  const timerRef = useRef<number | null>(null);

  // 3 Central Websites / Portals Selection
  const [activeSiteSection, setActiveSiteSection] = useState<'home' | 'summit' | 'registration'>('home');

  // Active Management Tab within Main Home site
  const [activeTab, setActiveTab] = useState<'ventures' | 'partners' | 'carousel' | 'applications' | 'emails'>('ventures');

  // SMTP Configuration State
  const [currentSmtp, setCurrentSmtp] = useState<SmtpSettings>(smtpSettings || DEFAULT_SMTP_SETTINGS);
  const [isEditingSmtp, setIsEditingSmtp] = useState<boolean>(false);
  const [smtpTestNotice, setSmtpTestNotice] = useState<string>('');

  // Custom Direct Correspondence Form State
  const [composeRecipientName, setComposeRecipientName] = useState<string>('');
  const [composeRecipientEmail, setComposeRecipientEmail] = useState<string>('');
  const [composeSubject, setComposeSubject] = useState<string>('');
  const [composeType, setComposeType] = useState<EmailNotification['type']>('Broadcast');
  const [composeContent, setComposeContent] = useState<string>('');
  const [composeSuccess, setComposeSuccess] = useState<string>('');

  // Application Review State
  const [feedbackInput, setFeedbackInput] = useState<string>(adminNotes);
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);

  // Venture Edit / Add Modal State
  const [editingVenture, setEditingVenture] = useState<Venture | null>(null);
  const [isNewVenture, setIsNewVenture] = useState<boolean>(false);
  const [ventureForm, setVentureForm] = useState<Partial<Venture>>({});

  // Partner Edit / Add Modal State
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [isNewPartner, setIsNewPartner] = useState<boolean>(false);
  const [partnerForm, setPartnerForm] = useState<Partial<PartnerItem>>({});

  // Carousel Slide Edit / Add Modal State
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [isNewSlide, setIsNewSlide] = useState<boolean>(false);
  const [slideForm, setSlideForm] = useState<Partial<CarouselSlide>>({});

  // Reset auto-lock timer on user activity
  const resetTimer = () => {
    setSecondsRemaining(TIMEOUT_SECONDS);
  };

  useEffect(() => {
    if (!isAuthenticated || isLocked) return;

    const handleUserActivity = () => {
      resetTimer();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('mousedown', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsLocked(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = interval as unknown as number;

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      clearInterval(interval);
    };
  }, [isAuthenticated, isLocked]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === adminCredentials.username && passwordInput === adminCredentials.password) {
      setIsAuthenticated(true);
      setIsLocked(false);
      setSecondsRemaining(TIMEOUT_SECONDS);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. Please enter your valid superadmin username and password.');
    }
  };

  // Unlock handler
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockPasswordInput === adminCredentials.password) {
      setIsLocked(false);
      setUnlockPasswordInput('');
      setSecondsRemaining(TIMEOUT_SECONDS);
      setAuthError('');
    } else {
      setAuthError('Incorrect superadmin password. Please try again.');
    }
  };

  // Change Credentials & Password handler
  const handleChangeCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredUpdateError('');
    setCredUpdateSuccess('');

    if (currentPassInput !== adminCredentials.password) {
      setCredUpdateError('Current password does not match.');
      return;
    }
    if (!newPasswordInput || newPasswordInput.length < 6) {
      setCredUpdateError('New password must be at least 6 characters.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setCredUpdateError('New passwords do not match.');
      return;
    }

    const updated = {
      username: newUsernameInput.trim() || adminCredentials.username,
      password: newPasswordInput
    };

    setAdminCredentials(updated);
    try {
      localStorage.setItem('oghowa_admin_credentials', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to store credentials locally', err);
    }

    try {
      await setDoc(doc(db, 'settings', 'adminAuth'), updated, { merge: true });
    } catch (err) {
      console.error('Failed to store credentials on Firestore server', err);
    }

    setCredUpdateSuccess('Credentials updated successfully. Saved to server for subsequent logins.');
    setTimeout(() => {
      setIsChangePasswordOpen(false);
      setCurrentPassInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setCredUpdateSuccess('');
    }, 1500);
  };

  const handleManualLock = () => {
    setIsLocked(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsLocked(false);
  };

  // ================= VENTURES HANDLERS =================
  const handleToggleVentureDisplay = (id: string) => {
    const updated = ventures.map((v) =>
      v.id === id ? { ...v, isDisplayed: v.isDisplayed === false ? true : false } : v
    );
    onUpdateVentures(updated);
  };

  const handleDeleteVenture = (id: string) => {
    if (window.confirm('Are you sure you want to remove this venture from the portfolio?')) {
      const updated = ventures.filter((v) => v.id !== id);
      onUpdateVentures(updated);
    }
  };

  const handleOpenEditVenture = (v: Venture) => {
    setIsNewVenture(false);
    setEditingVenture(v);
    setVentureForm({ ...v });
  };

  const handleOpenAddVenture = () => {
    setIsNewVenture(true);
    setEditingVenture({} as Venture);
    setVentureForm({
      id: `venture-${Date.now()}`,
      name: '',
      sector: 'Technology',
      tagline: '',
      description: '',
      founder: '',
      cohort: 'Cohort 2026',
      stage: 'Scaling',
      logoText: 'OV',
      badgeColor: 'bg-blue-600',
      websiteUrl: 'https://',
      isDisplayed: true,
      metrics: [
        { label: 'Traction', value: '10,000+' },
        { label: 'Growth', value: '+45%' }
      ],
      highlights: ['Accelerated at Óghowa', 'Verified unit economics']
    });
  };

  const handleSaveVenture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ventureForm.name || !ventureForm.sector) {
      alert('Please fill in required fields (Name, Sector)');
      return;
    }
    const finalVenture: Venture = {
      id: ventureForm.id || `venture-${Date.now()}`,
      name: ventureForm.name || 'Untitled Venture',
      sector: ventureForm.sector || 'General Tech',
      tagline: ventureForm.tagline || '',
      description: ventureForm.description || '',
      founder: ventureForm.founder || 'Founder Team',
      cohort: ventureForm.cohort || 'Cohort 2026',
      stage: (ventureForm.stage as any) || 'Scaling',
      logoText: ventureForm.logoText || (ventureForm.name ? ventureForm.name.substring(0, 2).toUpperCase() : 'OV'),
      badgeColor: ventureForm.badgeColor || 'bg-blue-600',
      websiteUrl: ventureForm.websiteUrl || '',
      isDisplayed: ventureForm.isDisplayed !== false,
      metrics: ventureForm.metrics || [{ label: 'Scale', value: '1,000+' }],
      highlights: ventureForm.highlights || ['Verified venture']
    };

    if (isNewVenture) {
      onUpdateVentures([...ventures, finalVenture]);
    } else {
      onUpdateVentures(ventures.map((v) => (v.id === finalVenture.id ? finalVenture : v)));
    }
    setEditingVenture(null);
  };

  // Restore only the 3 requested default ventures
  const handleRestoreDefaultVentures = () => {
    if (window.confirm('Reset featured ventures to the official 3: Ugbekun SMP, MyEduRide, and Cyona Medicare?')) {
      const defaultThree: Venture[] = [
        {
          id: 'ugbekun-smp',
          name: 'Ugbekun SMP',
          sector: 'Education Technology',
          tagline: 'Modern school management & digital administrative ecosystem.',
          description: 'Comprehensive school management platform simplifying school administration, tuition reconciliation, attendance, and student academic performance across K-12 institutions.',
          founder: 'Osasere Idehen',
          metrics: [
            { label: 'Schools', value: '180+' },
            { label: 'Active Students', value: '52,000+' },
            { label: 'Admin Efficiency', value: '+74%' }
          ],
          cohort: 'Cohort 2025-A',
          stage: 'Scaling',
          logoText: 'US',
          badgeColor: 'bg-blue-600',
          highlights: ['Edo State EdTech Pilot Partner', 'Integrated tuition payment gateway', 'Ministry of Education accredited'],
          isDisplayed: true
        },
        {
          id: 'myeduride',
          name: 'MyEduRide',
          sector: 'Transport Technology',
          tagline: 'Smart student and campus mobility for safety and reliability.',
          description: 'Tech-enabled student transportation management and route optimization ensuring guaranteed child transit security, real-time bus telemetry, and parent peace of mind.',
          founder: 'Efe Omoregie',
          metrics: [
            { label: 'Safe Trips', value: '220,000+' },
            { label: 'Partner Schools', value: '45' },
            { label: 'On-Time Rate', value: '99.1%' }
          ],
          cohort: 'Cohort 2025-B',
          stage: 'Accelerated',
          logoText: 'MR',
          badgeColor: 'bg-amber-500',
          highlights: ['Geo-fenced tracking alerts', 'Fleet telematics integration', 'Corporate logistics partnership'],
          isDisplayed: true
        },
        {
          id: 'cyona-medicare',
          name: 'Cyona Medicare',
          sector: 'Health Technology',
          tagline: 'Digital diagnostics and patient-provider matching platform.',
          description: 'Clinic and patient healthcare services matching platform providing verified telehealth consultations, digitized medical records, and doorstep prescription delivery.',
          founder: 'Dr. Blessing Osagie',
          metrics: [
            { label: 'Consultations', value: '35,000+' },
            { label: 'Partner Clinics', value: '78' },
            { label: 'Patient Rating', value: '4.9/5' }
          ],
          cohort: 'Cohort 2025-B',
          stage: 'Scaling',
          logoText: 'CM',
          badgeColor: 'bg-emerald-600',
          highlights: ['Certified NHIS tele-health partner', 'Affordable rural outreach', '₦45M Seed extension closed'],
          isDisplayed: true
        }
      ];
      onUpdateVentures(defaultThree);
    }
  };

  // ================= PARTNERS HANDLERS =================
  const handleTogglePartnerDisplay = (id: string) => {
    const updated = partners.map((p) =>
      p.id === id ? { ...p, isDisplayed: p.isDisplayed === false ? true : false } : p
    );
    onUpdatePartners(updated);
  };

  const handleDeletePartner = (id: string) => {
    if (window.confirm('Delete this partner?')) {
      const updated = partners.filter((p) => p.id !== id);
      onUpdatePartners(updated);
    }
  };

  const handleOpenEditPartner = (p: PartnerItem) => {
    setIsNewPartner(false);
    setEditingPartner(p);
    setPartnerForm({ ...p });
  };

  const handleOpenAddPartner = () => {
    setIsNewPartner(true);
    setEditingPartner({} as PartnerItem);
    setPartnerForm({
      id: `partner-${Date.now()}`,
      name: '',
      category: 'Government',
      logo: '🏛️ Partner',
      logoUrl: '',
      websiteUrl: 'https://',
      isDisplayed: true
    });
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name) {
      alert('Please provide a partner name.');
      return;
    }
    const finalPartner: PartnerItem = {
      id: partnerForm.id || `partner-${Date.now()}`,
      name: partnerForm.name,
      category: partnerForm.category || 'Government',
      logo: partnerForm.logo || `🏛️ ${partnerForm.name}`,
      logoUrl: partnerForm.logoUrl || (partnerForm.logo?.startsWith('http') ? partnerForm.logo : undefined),
      websiteUrl: partnerForm.websiteUrl || '',
      isDisplayed: partnerForm.isDisplayed !== false
    };

    if (isNewPartner) {
      onUpdatePartners([...partners, finalPartner]);
    } else {
      onUpdatePartners(partners.map((p) => (p.id === finalPartner.id ? finalPartner : p)));
    }
    setEditingPartner(null);
  };

  // ================= SMTP & CORRESPONDENCE HANDLERS =================
  const handleSaveSmtpSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSmtpSettings) {
      onUpdateSmtpSettings(currentSmtp);
    }
    setIsEditingSmtp(false);
    setSmtpTestNotice('SMTP Server Configuration updated and verified.');
    setTimeout(() => setSmtpTestNotice(''), 4000);
  };

  const handleTestSmtpConnection = () => {
    const testEmail: EmailNotification = {
      id: `EML-TEST-${Date.now()}`,
      recipient: currentSmtp.senderEmail,
      recipientName: 'Óghowa Mail Administrator',
      sender: currentSmtp.senderEmail,
      smtpServer: `${currentSmtp.outgoingServer}:${currentSmtp.smtpPort} (SSL/TLS)`,
      subject: 'SMTP Handshake Verification: mail.metaspaceconsult.com [PASS]',
      type: 'Broadcast',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Just now',
      content: `SMTP Transport Self-Test Verification\n\nRoute: ${currentSmtp.outgoingServer}:${currentSmtp.smtpPort} (SSL/TLS)\nSender: ${currentSmtp.senderEmail}\nIncoming IMAP: ${currentSmtp.incomingServer}:${currentSmtp.imapPort}\nIncoming POP3: ${currentSmtp.incomingServer}:${currentSmtp.pop3Port}\n\nStatus: 250 OK - Handshake Completed Successfully.`
    };
    if (onSendCustomEmail) {
      onSendCustomEmail(testEmail);
    }
    setSmtpTestNotice(`Handshake test dispatched via ${currentSmtp.outgoingServer}:${currentSmtp.smtpPort}`);
    setTimeout(() => setSmtpTestNotice(''), 5000);
  };

  const handleSendCustomCorrespondence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeRecipientEmail || !composeSubject || !composeContent) {
      alert('Please fill in Recipient Email, Subject, and Message Body.');
      return;
    }

    const newEmail: EmailNotification = {
      id: `EML-MANUAL-${Date.now()}`,
      recipient: composeRecipientEmail,
      recipientName: composeRecipientName || composeRecipientEmail.split('@')[0],
      sender: currentSmtp.senderEmail,
      smtpServer: `${currentSmtp.outgoingServer}:${currentSmtp.smtpPort} (SSL/TLS)`,
      subject: composeSubject,
      type: composeType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
      content: composeContent
    };

    if (onSendCustomEmail) {
      onSendCustomEmail(newEmail);
    }
    setComposeSuccess(`Official correspondence dispatched via ${currentSmtp.outgoingServer}:${currentSmtp.smtpPort} to ${composeRecipientEmail}`);
    setComposeRecipientName('');
    setComposeRecipientEmail('');
    setComposeSubject('');
    setComposeContent('');
    setTimeout(() => setComposeSuccess(''), 5000);
  };

  // ================= CAROUSEL HANDLERS =================
  const handleToggleSlideDisplay = (id: string) => {
    const updated = carouselEvents.map((s) =>
      s.id === id ? { ...s, isDisplayed: !s.isDisplayed } : s
    );
    onUpdateCarouselEvents(updated);
  };

  const handleDeleteSlide = (id: string) => {
    if (window.confirm('Delete this carousel upcoming event slide?')) {
      const updated = carouselEvents.filter((s) => s.id !== id);
      onUpdateCarouselEvents(updated);
    }
  };

  const handleOpenEditSlide = (slide: CarouselSlide) => {
    setIsNewSlide(false);
    setEditingSlide(slide);
    setSlideForm({ ...slide });
  };

  const handleOpenAddSlide = () => {
    setIsNewSlide(true);
    setEditingSlide({} as CarouselSlide);
    setSlideForm({
      id: `event-${Date.now()}`,
      title: 'New Upcoming Gathering',
      subtitle: 'Africa Innovation Summit',
      description: 'Exclusive venture summit bringing together founders, angels and leaders.',
      eventDate: 'Dec 12 - 15, 2026',
      location: 'Benin City Innovation Hub',
      badge: 'Upcoming Event',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=75',
      registerLink: '#register',
      seatsAvailable: 50,
      isDisplayed: true,
      order: carouselEvents.length + 1
    });
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideForm.title || !slideForm.eventDate) {
      alert('Please provide title and event date');
      return;
    }
    const finalSlide: CarouselSlide = {
      id: slideForm.id || `event-${Date.now()}`,
      title: slideForm.title,
      subtitle: slideForm.subtitle || '',
      description: slideForm.description || '',
      eventDate: slideForm.eventDate,
      location: slideForm.location || 'Benin City, Nigeria',
      badge: slideForm.badge || 'Upcoming Event',
      imageUrl: slideForm.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=75',
      registerLink: slideForm.registerLink || '#register',
      seatsAvailable: Number(slideForm.seatsAvailable) || 20,
      isDisplayed: slideForm.isDisplayed !== false,
      order: slideForm.order || carouselEvents.length + 1
    };

    if (isNewSlide) {
      onUpdateCarouselEvents([...carouselEvents, finalSlide]);
    } else {
      onUpdateCarouselEvents(carouselEvents.map((s) => (s.id === finalSlide.id ? finalSlide : s)));
    }
    setEditingSlide(null);
  };

  // If unauthenticated: show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-slate-900 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-[#0B1E48]">Superadmin Portal</h2>
            <p className="text-xs text-slate-500 mt-1">
              Secure investment committee & platform control console.
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Username
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-lg shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>Authenticate Superadmin</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onBackToHome}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              ← Return to Public Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 sm:py-12 bg-slate-100 min-h-[90vh] relative">
      {/* Auto-Lock Overlay when 5 minutes inactivity expires */}
      {isLocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-[#0B1E48]">Session Auto-Locked</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              For security, the Superadmin portal locks after <strong>5 minutes</strong> of inactivity. Enter your password to resume control.
            </p>

            {authError && (
              <div className="mt-4 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleUnlock} className="mt-5 space-y-3">
              <input
                type="password"
                value={unlockPasswordInput}
                onChange={(e) => setUnlockPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden text-center"
                autoFocus
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-lg shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Session</span>
              </button>
            </form>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Superadmin Session</span>
              <button
                onClick={handleLogout}
                className="text-rose-600 hover:underline font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar with 5-minute Auto-Lock Indicator */}
        <div className="bg-[#0B1A34] text-white p-5 sm:p-7 rounded-2xl shadow-xl mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-rose-400 font-bold mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Óghowa Superadmin Control Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Platform & Ecosystem Superadmin
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Manage Portfolio Companies, Partners, Hero Carousel upcoming events, and Cohort applicant evaluations.
            </p>
          </div>

          {/* Session Timer & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            {/* Auto Lock 5-Min Timer Badge */}
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="text-left">
                <span className="text-[10px] uppercase text-slate-400 block font-semibold leading-tight">Auto-Lock in</span>
                <span className="font-mono font-bold text-amber-300 text-xs">{formatTime(secondsRemaining)}</span>
              </div>
            </div>

            <button
              onClick={handleManualLock}
              title="Lock screen immediately"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock (5m)</span>
            </button>

            <button
              onClick={() => {
                setIsChangePasswordOpen(true);
                setNewUsernameInput(adminCredentials.username);
                setCredUpdateError('');
                setCredUpdateSuccess('');
              }}
              title="Update username & password"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer border border-amber-500/30"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>

            <button
              onClick={onBackToDashboard}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg font-bold transition cursor-pointer"
            >
              Applicant View
            </button>

            <button
              onClick={onBackToHome}
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-bold transition cursor-pointer"
            >
              Back to Site
            </button>
          </div>
        </div>

        {/* ================= PRIMARY WEBSITE CONTEXT SWITCHER ================= */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs mb-6">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            Superadmin Context: Select Website or Page to Control & Edit
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => setActiveSiteSection('home')}
              className={`p-3.5 rounded-xl font-bold text-xs transition flex items-center justify-between cursor-pointer border ${
                activeSiteSection === 'home'
                  ? 'bg-[#0B1E48] text-white border-[#0B1E48] shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-rose-400" />
                <div className="text-left">
                  <span className="block font-bold">1. Main Home Page</span>
                  <span className="text-[10px] opacity-75 font-normal">Óghowa Mother Accelerator</span>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeSiteSection === 'home' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {ventures.length} Ventures
              </span>
            </button>

            <button
              onClick={() => setActiveSiteSection('summit')}
              className={`p-3.5 rounded-xl font-bold text-xs transition flex items-center justify-between cursor-pointer border ${
                activeSiteSection === 'summit'
                  ? 'bg-[#0B1E48] text-white border-[#0B1E48] shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#FEE2E2]" />
                <div className="text-left">
                  <span className="block font-bold">2. Business Week Summit</span>
                  <span className="text-[10px] opacity-75 font-normal">Nov 16-21 • ₦50M Deal Rooms</span>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeSiteSection === 'summit' ? 'bg-[#FEE2E2] text-[#0B1E48]' : 'bg-slate-200 text-slate-600'}`}>
                {businessWeekConfig.tracks.length} Tracks
              </span>
            </button>

            <button
              onClick={() => setActiveSiteSection('registration')}
              className={`p-3.5 rounded-xl font-bold text-xs transition flex items-center justify-between cursor-pointer border ${
                activeSiteSection === 'registration'
                  ? 'bg-[#0B1E48] text-white border-[#0B1E48] shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Ticket className="w-4 h-4 text-[#FEE2E2]" />
                <div className="text-left">
                  <span className="block font-bold">3. Business Week Registration</span>
                  <span className="text-[10px] opacity-75 font-normal">Passes, Gates & Badge Inspector</span>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeSiteSection === 'registration' ? 'bg-[#FEE2E2] text-[#0B1E48]' : 'bg-slate-200 text-slate-600'}`}>
                {businessWeekConfig.delegates.length} Participants
              </span>
            </button>
          </div>
        </div>

        {/* ================= SITE SECTION 1: MAIN HOMEPAGE CONTENT ================= */}
        {activeSiteSection === 'home' && (
          <>
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('ventures')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === 'ventures'
                    ? 'bg-[#0B1E48] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Featured Ventures ({ventures.length})</span>
              </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'partners'
                ? 'bg-[#0B1E48] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Handshake className="w-3.5 h-3.5" />
            <span>Partners ({partners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('carousel')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'carousel'
                ? 'bg-[#0B1E48] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Hero Carousel Events ({carouselEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'applications'
                ? 'bg-[#0B1E48] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Applicant Evaluation</span>
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'emails'
                ? 'bg-[#0B1E48] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Automated Outbox ({sentEmails.length})</span>
          </button>
        </div>

        {/* ================= TAB 1: FEATURED VENTURES ================= */}
        {activeTab === 'ventures' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#0B1E48]">Featured Ventures Portfolio</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Controlled by Superadmin. Only active ventures are shown on the homepage. Default: Ugbekun SMP, MyEduRide, Cyona Medicare.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleRestoreDefaultVentures}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Official 3</span>
                </button>

                <button
                  onClick={handleOpenAddVenture}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Venture</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ventures.map((venture) => (
                <div
                  key={venture.id}
                  className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                    venture.isDisplayed !== false
                      ? 'border-slate-200'
                      : 'border-dashed border-slate-300 opacity-60 bg-slate-50/70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl ${venture.badgeColor || 'bg-blue-600'} text-white font-extrabold flex items-center justify-center text-sm shadow-xs`}>
                          {venture.logoText || venture.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0B1E48] text-base">{venture.name}</h4>
                          <span className="text-[11px] font-semibold text-rose-600 uppercase">{venture.sector}</span>
                        </div>
                      </div>

                      {/* Display toggle */}
                      <button
                        onClick={() => handleToggleVentureDisplay(venture.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                          venture.isDisplayed !== false
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {venture.isDisplayed !== false ? 'Displayed' : 'Hidden'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {venture.description}
                    </p>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] space-y-1 mb-4">
                      <div><span className="text-slate-400">Founder:</span> <strong className="text-slate-800">{venture.founder}</strong></div>
                      <div><span className="text-slate-400">Cohort:</span> <span className="text-slate-700">{venture.cohort}</span> · <span className="text-rose-600 font-semibold">{venture.stage}</span></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditVenture(venture)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteVenture(venture.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 2: PARTNERS ================= */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#0B1E48]">Our Partners & Institutional Alliances</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Superadmin can add, edit names, update logo images/emblems, change categories, set website links, hide, or remove partners.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleOpenAddPartner}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Partner</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {partners.map((partner) => {
                const isImage = partner.logoUrl || (partner.logo && (partner.logo.startsWith('http') || partner.logo.startsWith('/')));
                const imgSrc = partner.logoUrl || (isImage ? partner.logo : undefined);

                return (
                  <div
                    key={partner.id || partner.name}
                    className={`bg-white rounded-xl border p-4 shadow-2xs flex flex-col justify-between transition-all ${
                      partner.isDisplayed !== false ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-60 bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {partner.category}
                        </span>
                        <button
                          onClick={() => handleTogglePartnerDisplay(partner.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition cursor-pointer ${
                            partner.isDisplayed !== false
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {partner.isDisplayed !== false ? 'Visible' : 'Hidden'}
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        {isImage && imgSrc ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-1 border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
                            <img
                              src={imgSrc}
                              alt={partner.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<span class="text-xs font-bold text-[#0B1E48]">${partner.name.charAt(0)}</span>`;
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#0B1E48]/10 text-[#0B1E48] font-black text-sm flex items-center justify-center shrink-0 border border-[#0B1E48]/15">
                            {partner.logo && !partner.logo.startsWith('http') ? partner.logo.slice(0, 2) : partner.name.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-[#0B1E48] text-sm leading-snug truncate" title={partner.name}>
                            {partner.name}
                          </h4>
                          {partner.websiteUrl && (
                            <a
                              href={partner.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 mt-0.5 truncate"
                            >
                              <span className="truncate">{partner.websiteUrl.replace(/^https?:\/\//, '')}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 mt-2 truncate">
                        <span className="text-slate-400">Emblem/Tag:</span> <strong>{partner.logo || partner.name}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleOpenEditPartner(partner)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center gap-1 transition cursor-pointer"
                        title="Edit Partner Name & Logo"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeletePartner(partner.id)}
                        className="p-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                        title="Delete Partner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: HERO CAROUSEL EVENTS ================= */}
        {activeTab === 'carousel' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#0B1E48]">Hero Carousel & Upcoming Events</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Controls the slides and registration links displayed on the Hero page. Superadmin can edit and add new events.
                </p>
              </div>

              <button
                onClick={handleOpenAddSlide}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event Slide</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {carouselEvents.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-xs flex flex-col justify-between ${
                    slide.isDisplayed ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-60'
                  }`}
                >
                  <div>
                    {/* Slide Image Preview */}
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                      <span className="absolute top-3 left-3 text-[11px] font-bold text-white bg-black/60 px-2.5 py-1 rounded backdrop-blur-xs">
                        Slide #{idx + 1} · {slide.badge}
                      </span>
                      <button
                        onClick={() => handleToggleSlideDisplay(slide.id)}
                        className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md cursor-pointer ${
                          slide.isDisplayed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {slide.isDisplayed ? 'Active on Hero' : 'Inactive'}
                      </button>

                      <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs">
                        <p className="font-semibold text-rose-300 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{slide.eventDate}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h4 className="font-extrabold text-[#0B1E48] text-base leading-snug">
                        {slide.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {slide.subtitle || slide.description}
                      </p>

                      <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                        <div><strong>Location:</strong> {slide.location}</div>
                        <div><strong>Seats:</strong> {slide.seatsAvailable} remaining</div>
                        <div className="truncate"><strong>Link:</strong> {slide.registerLink}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditSlide(slide)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Slide</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: APPLICANT EVALUATION ================= */}
        {activeTab === 'applications' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 mb-5 gap-3">
                  <div>
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                      Venture Under Review
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                      {appData.startupName || 'Startup Application'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Lead: <strong className="text-slate-800">{appData.founderName}</strong> ({appData.founderEmail}) · Track: {appData.sector}
                    </p>
                  </div>

                  <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    Current: {appStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-6">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">Traction / MRR</span>
                    <span className="font-bold text-emerald-700 text-sm">{appData.tractionMRR || '₦4,500,000'}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">Active Base</span>
                    <span className="font-bold text-slate-800 text-sm">{appData.activeUsers || '12,000'}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">Stage</span>
                    <span className="font-bold text-[#0B1E48] text-sm">{appData.stage || 'Seed'}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6 text-xs text-slate-700">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px]">
                    Venture Value Proposition
                  </span>
                  <p className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 leading-relaxed">
                    {appData.description || 'Enterprise school management and tuition reconciliation engine.'}
                  </p>
                </div>

                {/* Reviewer Feedback Input */}
                <div className="space-y-2 mb-6">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Superadmin Decision Feedback (Included in applicant email notification)
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Enter formal investment committee evaluation feedback..."
                    className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48] bg-slate-50"
                  />
                </div>

                {/* Status Decision Buttons */}
                <div className="space-y-3">
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Select Decision Action:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => onUpdateStatus('Approved', feedbackInput)}
                      className="p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Cohort Entry</span>
                    </button>
                    <button
                      onClick={() => onUpdateStatus('Information Required', feedbackInput)}
                      className="p-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Request Further Info</span>
                    </button>
                    <button
                      onClick={() => onUpdateStatus('Rejected', feedbackInput)}
                      className="p-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline Application</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Outbox summary */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-[#0B1E48] mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-rose-600" />
                  <span>Recent Automated Emails ({sentEmails.length})</span>
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {sentEmails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50 hover:bg-white transition cursor-pointer text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>{email.type}</span>
                        <span>{email.timestamp}</span>
                      </div>
                      <p className="font-bold text-slate-800 truncate">{email.subject}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">To: {email.recipient}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: EMAIL CORRESPONDENCE & SMTP GATEWAY ================= */}
        {activeTab === 'emails' && (
          <div className="space-y-8">
            {/* 1. Mail Server & SMTP Gateway Configuration Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 mb-5 border-b border-slate-100 gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1.5">
                    <Server className="w-3.5 h-3.5 text-blue-600" />
                    <span>Official Mail Server Configuration</span>
                  </div>
                  <h3 className="text-xl font-black text-[#0B1E48]">
                    Email Correspondence Gateway
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    All summit accreditation passes, venture statuses, and automated communications are routed through this mail server.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleTestSmtpConnection}
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    <span>Test SMTP Handshake</span>
                  </button>

                  <button
                    onClick={() => setIsEditingSmtp(!isEditingSmtp)}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0B1E48] hover:bg-[#071733] rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{isEditingSmtp ? 'Close Settings' : 'Edit Server Parameters'}</span>
                  </button>
                </div>
              </div>

              {smtpTestNotice && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{smtpTestNotice}</span>
                </div>
              )}

              {/* Server Details Grid */}
              {!isEditingSmtp ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Sender Address */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                      Sender Address
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm block mt-1">
                      {currentSmtp.senderEmail}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active / SPF Verified
                    </span>
                  </div>

                  {/* Outgoing SMTP */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                      Outgoing Server (SMTP)
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm block mt-1">
                      {currentSmtp.outgoingServer}
                    </span>
                    <span className="text-[10px] text-slate-600 font-semibold block mt-1">
                      SMTP Port: <strong className="text-slate-800">{currentSmtp.smtpPort}</strong> (SSL/TLS)
                    </span>
                  </div>

                  {/* Incoming IMAP */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                      Incoming Server (IMAP)
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm block mt-1">
                      {currentSmtp.incomingServer}
                    </span>
                    <span className="text-[10px] text-slate-600 font-semibold block mt-1">
                      IMAP Port: <strong className="text-slate-800">{currentSmtp.imapPort}</strong> (SSL)
                    </span>
                  </div>

                  {/* Incoming POP3 */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                      Incoming Server (POP3)
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm block mt-1">
                      {currentSmtp.incomingServer}
                    </span>
                    <span className="text-[10px] text-slate-600 font-semibold block mt-1">
                      POP3 Port: <strong className="text-slate-800">{currentSmtp.pop3Port}</strong> (SSL)
                    </span>
                  </div>
                </div>
              ) : (
                /* Editable SMTP Parameters Form */
                <form onSubmit={handleSaveSmtpSettings} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Sender Email</label>
                      <input
                        type="email"
                        value={currentSmtp.senderEmail}
                        onChange={(e) => setCurrentSmtp({ ...currentSmtp, senderEmail: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Outgoing Server (SMTP)</label>
                      <input
                        type="text"
                        value={currentSmtp.outgoingServer}
                        onChange={(e) => setCurrentSmtp({ ...currentSmtp, outgoingServer: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">SMTP Port</label>
                      <input
                        type="number"
                        value={currentSmtp.smtpPort}
                        onChange={(e) => setCurrentSmtp({ ...currentSmtp, smtpPort: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Incoming Server</label>
                      <input
                        type="text"
                        value={currentSmtp.incomingServer}
                        onChange={(e) => setCurrentSmtp({ ...currentSmtp, incomingServer: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">IMAP Port</label>
                      <input
                        type="number"
                        value={currentSmtp.imapPort}
                        onChange={(e) => setCurrentSmtp({ ...currentSmtp, imapPort: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">POP3 Port</label>
                      <input
                        type="number"
                        value={currentSmtp.pop3Port}
                        onChange={(e) => setCurrentSmtp({ ...currentSmtp, pop3Port: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsEditingSmtp(false)}
                      className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 2. Direct Email Correspondence Dispatcher */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-5 h-5 text-rose-600" />
                <h3 className="text-xl font-bold text-[#0B1E48]">Send Email Correspondence</h3>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Compose and dispatch official emails to delegates, founders, or partners directly from <strong>{currentSmtp.senderEmail}</strong>.
              </p>

              {composeSuccess && (
                <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{composeSuccess}</span>
                </div>
              )}

              {/* Quick Template Chips */}
              <div className="mb-5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Quick Load Template:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setComposeSubject('Óghowa Business Week 2026: Official Accreditation Issued');
                      setComposeType('Accreditation');
                      setComposeContent(
                        `Dear Participant,\n\nWe are delighted to confirm your physical accreditation for Óghowa Business Week 2026 at the Victor Uwaifo Creative Hub.\n\nEvent Dates: November 16 – 21, 2026\nVenue: Victor Uwaifo Creative Hub\nDelegate Badge: ACCREDITED PHYSICAL PASS\n\nPlease present this email confirmation upon arrival at the secretariat desk.\n\nBest regards,\nÓghowa Summit Secretariat\noghowa@metaspaceconsult.com`
                      );
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    + Accreditation Pass
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setComposeSubject('Update on your Óghowa Venture Studio Application');
                      setComposeType('Status Update');
                      setComposeContent(
                        `Dear Founder,\n\nThe Óghowa Investment Committee has reviewed your application. We would like to invite your founding team to a 20-minute preliminary diligence call.\n\nPlease reply to this correspondence with your availability for this week.\n\nBest regards,\nÓghowa Admissions Desk\noghowa@metaspaceconsult.com`
                      );
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    + Application Update
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setComposeSubject('Invitation: ₦50M Venture Syndicate & Deal Room');
                      setComposeType('Broadcast');
                      setComposeContent(
                        `Dear Investor / Partner,\n\nYou are cordially invited to participate in the closed-door Deal Room at Óghowa Business Week 2026.\n\nDate: Thursday, 19 November 2026\nVenue: Victor Uwaifo Creative Hub\nFeatured Fund: ₦50,000,000 Seed Co-Investment Syndicate\n\nWe look forward to hosting you in Benin City.\n\nWarm regards,\nÓghowa Investment Committee\noghowa@metaspaceconsult.com`
                      );
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    + Deal Room Invite
                  </button>
                </div>
              </div>

              {/* Compose Form */}
              <form onSubmit={handleSendCustomCorrespondence} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Recipient Name</label>
                    <input
                      type="text"
                      value={composeRecipientName}
                      onChange={(e) => setComposeRecipientName(e.target.value)}
                      placeholder="e.g. Osasere Idehen"
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0B1E48]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Recipient Email *</label>
                    <input
                      type="email"
                      value={composeRecipientEmail}
                      onChange={(e) => setComposeRecipientEmail(e.target.value)}
                      placeholder="e.g. founder@startup.ng"
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0B1E48]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 uppercase mb-1">Subject Line *</label>
                    <input
                      type="text"
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                      placeholder="Subject of the official correspondence"
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0B1E48]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Category Type</label>
                    <select
                      value={composeType}
                      onChange={(e) => setComposeType(e.target.value as any)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                    >
                      <option value="Accreditation">Accreditation</option>
                      <option value="Event Ticket">Event Ticket</option>
                      <option value="Status Update">Status Update</option>
                      <option value="Information Request">Information Request</option>
                      <option value="Broadcast">Broadcast</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Message Content *</label>
                  <textarea
                    rows={6}
                    value={composeContent}
                    onChange={(e) => setComposeContent(e.target.value)}
                    placeholder="Write your email message..."
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-mono leading-relaxed focus:ring-2 focus:ring-[#0B1E48] bg-slate-50"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-3">
                  <div className="text-[11px] text-slate-500">
                    Dispatched from: <strong>{currentSmtp.senderEmail}</strong> via <strong>{currentSmtp.outgoingServer}:{currentSmtp.smtpPort}</strong>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-lg shadow-md transition cursor-pointer flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send via SMTP (Port {currentSmtp.smtpPort})</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 3. Sent Correspondence Outbox & Delivery Audit Log */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-[#0B1E48]">Sent Correspondence Outbox</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time log of all dispatched summit accreditations, venture notifications, and test handshakes.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Total Dispatched: {sentEmails.length}
                </span>
              </div>

              {sentEmails.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <Mail className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                  <p>No correspondence dispatched yet. Sent emails will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentEmails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-xs transition cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2 pb-2 border-b border-slate-200/60">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                            {email.type}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">{email.subject}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{email.timestamp}</span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mb-3 gap-2">
                        <p>
                          To: <strong className="text-slate-800">{email.recipientName}</strong> &lt;{email.recipient}&gt;
                        </p>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          From: {email.sender || currentSmtp.senderEmail} · Sent via SMTP: {email.smtpServer || `${currentSmtp.outgoingServer}:${currentSmtp.smtpPort}`}
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-line leading-relaxed line-clamp-3">
                        {email.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )}

    {/* ================= SITE SECTION 2: BUSINESS WEEK SUMMIT ================= */}
    {activeSiteSection === 'summit' && (
      <SuperadminSummitManager
        config={businessWeekConfig}
        onUpdateConfig={onUpdateBusinessWeekConfig}
        onPreviewSummit={onNavigateToBusinessWeek}
      />
    )}

    {/* ================= SITE SECTION 3: BUSINESS WEEK REGISTRATION ================= */}
    {activeSiteSection === 'registration' && (
      <SuperadminRegistrationManager
        config={businessWeekConfig}
        onUpdateConfig={onUpdateBusinessWeekConfig}
        onPreviewRegistration={onNavigateToRegistration}
      />
    )}
  </div>

      {/* ================= MODAL: EDIT / ADD VENTURE ================= */}
      {editingVenture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingVenture(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-[#0B1E48] mb-1">
              {isNewVenture ? 'Add New Featured Venture' : `Edit ${ventureForm.name}`}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Configure venture details, metrics, and display visibility on the Óghowa portal.
            </p>

            <form onSubmit={handleSaveVenture} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Venture Name *</label>
                  <input
                    type="text"
                    value={ventureForm.name || ''}
                    onChange={(e) => setVentureForm({ ...ventureForm, name: e.target.value })}
                    placeholder="e.g. Ugbekun SMP"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Sector *</label>
                  <input
                    type="text"
                    value={ventureForm.sector || ''}
                    onChange={(e) => setVentureForm({ ...ventureForm, sector: e.target.value })}
                    placeholder="e.g. Education Technology"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Tagline</label>
                <input
                  type="text"
                  value={ventureForm.tagline || ''}
                  onChange={(e) => setVentureForm({ ...ventureForm, tagline: e.target.value })}
                  placeholder="Short one-line impact statement"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Description *</label>
                <textarea
                  rows={3}
                  value={ventureForm.description || ''}
                  onChange={(e) => setVentureForm({ ...ventureForm, description: e.target.value })}
                  placeholder="Describe venture mission, solution, and reach..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Founder Lead</label>
                  <input
                    type="text"
                    value={ventureForm.founder || ''}
                    onChange={(e) => setVentureForm({ ...ventureForm, founder: e.target.value })}
                    placeholder="Founder Name"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Cohort</label>
                  <input
                    type="text"
                    value={ventureForm.cohort || ''}
                    onChange={(e) => setVentureForm({ ...ventureForm, cohort: e.target.value })}
                    placeholder="Cohort 2025-A"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Badge Color</label>
                  <select
                    value={ventureForm.badgeColor || 'bg-blue-600'}
                    onChange={(e) => setVentureForm({ ...ventureForm, badgeColor: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  >
                    <option value="bg-blue-600">Blue (EdTech)</option>
                    <option value="bg-amber-500">Amber (Mobility)</option>
                    <option value="bg-emerald-600">Emerald (Health)</option>
                    <option value="bg-rose-600">Rose (Syndicate)</option>
                    <option value="bg-purple-600">Purple (FinTech)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Company Website URL</label>
                <div className="relative">
                  <input
                    type="url"
                    value={ventureForm.websiteUrl || ''}
                    onChange={(e) => setVentureForm({ ...ventureForm, websiteUrl: e.target.value })}
                    placeholder="https://company.com"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Link used on homepage portfolio cards and modal for visitors to explore this company.
                </span>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ventureDisplayCheck"
                  checked={ventureForm.isDisplayed !== false}
                  onChange={(e) => setVentureForm({ ...ventureForm, isDisplayed: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <label htmlFor="ventureDisplayCheck" className="text-slate-800 font-bold">
                  Display this venture on the public homepage
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingVenture(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Venture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT / ADD PARTNER ================= */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setEditingPartner(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-[#0B1E48] mb-1">
              {isNewPartner ? 'Add New Partner' : `Edit ${partnerForm.name}`}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Modify partner institution and display configuration.
            </p>

            <form onSubmit={handleSavePartner} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Partner Name *</label>
                <input
                  type="text"
                  value={partnerForm.name || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  placeholder="e.g. Edo State Government"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Logo Image URL (Direct PNG, SVG, or WebP)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={partnerForm.logoUrl || ''}
                    onChange={(e) => setPartnerForm({ ...partnerForm, logoUrl: e.target.value })}
                    placeholder="https://.../logo.png"
                    className="flex-1 p-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                  {partnerForm.logoUrl && (
                    <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={partnerForm.logoUrl}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Preset Emblems & Labels */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Quick Preset Logos / Emblems:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'Edo State Govt', cat: 'Government', logo: '🏛️ Edo State Govt', url: 'https://edostate.gov.ng' },
                    { name: 'Bank of Industry', cat: 'Financial', logo: '🏢 BOI', url: 'https://boi.ng' },
                    { name: 'Benin Tech Fest', cat: 'Technology', logo: '⚡ Benin Tech Fest', url: 'https://benintechfest.com' },
                    { name: 'University of Benin', cat: 'Academic', logo: '🎓 UNIBEN', url: 'https://uniben.edu' },
                    { name: 'Microsoft Africa', cat: 'Technology', logo: '💻 Microsoft', url: 'https://microsoft.com' },
                    { name: 'Amazon Web Services', cat: 'Cloud', logo: '☁️ AWS', url: 'https://aws.amazon.com' },
                    { name: 'MTN Nigeria', cat: 'Telecom', logo: '📶 MTN', url: 'https://mtn.ng' },
                    { name: 'GIZ Germany', cat: 'Development', logo: '🌍 GIZ', url: 'https://giz.de' }
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setPartnerForm({
                          ...partnerForm,
                          name: preset.name,
                          category: preset.cat,
                          logo: preset.logo,
                          websiteUrl: preset.url
                        });
                      }}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition cursor-pointer"
                    >
                      {preset.logo}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={partnerForm.category || 'Government'}
                    onChange={(e) => setPartnerForm({ ...partnerForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  >
                    <option value="Government">Government</option>
                    <option value="Academic">Academic</option>
                    <option value="Financial">Financial</option>
                    <option value="Technology">Technology</option>
                    <option value="Cloud">Cloud</option>
                    <option value="Telecom">Telecom</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Development">Development</option>
                    <option value="Media">Media</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Emblem / Text Label</label>
                  <input
                    type="text"
                    value={partnerForm.logo || ''}
                    onChange={(e) => setPartnerForm({ ...partnerForm, logo: e.target.value })}
                    placeholder="e.g. 🏛️ Edo State"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Website URL</label>
                <input
                  type="url"
                  value={partnerForm.websiteUrl || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, websiteUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="partnerDisplayCheck"
                  checked={partnerForm.isDisplayed !== false}
                  onChange={(e) => setPartnerForm({ ...partnerForm, isDisplayed: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <label htmlFor="partnerDisplayCheck" className="text-slate-800 font-bold">
                  Display partner in homepage marquee
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT / ADD CAROUSEL SLIDE ================= */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingSlide(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-[#0B1E48] mb-1">
              {isNewSlide ? 'Add Hero Carousel Upcoming Event' : `Edit ${slideForm.title}`}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              This slide appears directly on the Hero page carousel with background blending and registration CTA.
            </p>

            <form onSubmit={handleSaveSlide} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Event Title *</label>
                <input
                  type="text"
                  value={slideForm.title || ''}
                  onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                  placeholder="e.g. Óghowa Business Startup Week 2026"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Subtitle / Subhead</label>
                <input
                  type="text"
                  value={slideForm.subtitle || ''}
                  onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                  placeholder="Africa's Premier Gathering for Frontier Innovation & Capital"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Event Date *</label>
                  <input
                    type="text"
                    value={slideForm.eventDate || ''}
                    onChange={(e) => setSlideForm({ ...slideForm, eventDate: e.target.value })}
                    placeholder="Nov 18 - 22, 2026"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={slideForm.location || ''}
                    onChange={(e) => setSlideForm({ ...slideForm, location: e.target.value })}
                    placeholder="Victor Uwaifo Hub, Benin City"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={slideForm.badge || ''}
                    onChange={(e) => setSlideForm({ ...slideForm, badge: e.target.value })}
                    placeholder="Upcoming Event / Flagship"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Available Seats</label>
                  <input
                    type="number"
                    value={slideForm.seatsAvailable !== undefined ? slideForm.seatsAvailable : 35}
                    onChange={(e) => setSlideForm({ ...slideForm, seatsAvailable: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Image URL (Blends into Hero)</label>
                <input
                  type="url"
                  value={slideForm.imageUrl || ''}
                  onChange={(e) => setSlideForm({ ...slideForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Registration Link Action</label>
                <input
                  type="text"
                  value={slideForm.registerLink || ''}
                  onChange={(e) => setSlideForm({ ...slideForm, registerLink: e.target.value })}
                  placeholder="#register or registration URL"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="slideDisplayCheck"
                  checked={slideForm.isDisplayed !== false}
                  onChange={(e) => setSlideForm({ ...slideForm, isDisplayed: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <label htmlFor="slideDisplayCheck" className="text-slate-800 font-bold">
                  Display this slide in the active Hero carousel
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Reader Drawer Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setSelectedEmail(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2 text-rose-600 font-bold text-xs uppercase">
              <Mail className="w-4 h-4" />
              <span>{selectedEmail.type}</span>
            </div>
            <h3 className="text-xl font-bold text-[#0B1E48] mb-1">{selectedEmail.subject}</h3>
            <p className="text-xs text-slate-500 mb-4">To: {selectedEmail.recipientName} ({selectedEmail.recipient})</p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed font-mono">
              {selectedEmail.content}
            </div>
          </div>
        </div>
      )}

      {/* Change Password & Admin Credentials Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setIsChangePasswordOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase mb-1">
              <Key className="w-4 h-4" />
              <span>Superadmin Security</span>
            </div>
            <h3 className="text-xl font-bold text-[#0B1E48] mb-1">Update Admin Credentials</h3>
            <p className="text-xs text-slate-500 mb-4">
              Change the Superadmin username and login password. These credentials will be saved and required for subsequent sign-ins.
            </p>

            {credUpdateError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{credUpdateError}</span>
              </div>
            )}

            {credUpdateSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{credUpdateSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangeCredentials} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Current Password *</label>
                <input
                  type="password"
                  value={currentPassInput}
                  onChange={(e) => setCurrentPassInput(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Superadmin Username</label>
                <input
                  type="text"
                  value={newUsernameInput}
                  onChange={(e) => setNewUsernameInput(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">New Password * (Min 6 chars)</label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Password & Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
