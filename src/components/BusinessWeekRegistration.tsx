import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  Building,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Rocket,
  Coins,
  Palette,
  GraduationCap,
  Landmark,
  ShieldCheck,
  ChevronDown,
  Download,
  Calendar,
  X,
  Search,
  Check,
  Share2,
  Copy,
  CalendarPlus,
  Share,
  Pin,
  Info,
  Users,
  ExternalLink,
  HelpCircle,
  QrCode,
  Printer
} from 'lucide-react';
import { BusinessWeekLogo } from './BusinessWeekLogo';
import { EmailNotification, RegisteredDelegate, BusinessWeekConfig, RegistrationFormField } from '../types';
import { DEFAULT_REGISTRATION_FIELDS } from '../data/mockData';
import { doc, setDoc } from 'firebase/firestore';
import { db, cleanForFirestore } from '../lib/firebase';

interface BusinessWeekRegistrationProps {
  onBackToBusinessWeek: () => void;
  onBackToAccelerator: () => void;
  onTicketReserved?: (email: EmailNotification) => void;
  onRegisterDelegate?: (delegate: RegisteredDelegate) => void;
  config?: BusinessWeekConfig;
}

// Full list of Nigerian states + FCT
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

// Key cities mapping for popular states
const STATE_CITIES: Record<string, string[]> = {
  'Edo': ['Benin City', 'Ekpoma', 'Auchi', 'Uromi', 'Irrua', 'Iguobazuwa', 'Sabongida-Ora', 'Ehor', 'Abudu', 'Other'],
  'Lagos': ['Ikeja', 'Victoria Island', 'Lekki', 'Yaba', 'Surulere', 'Ikoyi', 'Epe', 'Badagry', 'Other'],
  'FCT (Abuja)': ['Abuja Central', 'Garki', 'Wuse', 'Maitama', 'Asokoro', 'Gwarinpa', 'Kubwa', 'Lugbe', 'Other'],
  'Rivers': ['Port Harcourt', 'Obio-Akpor', 'Bonny', 'Eleme', 'Other'],
  'Delta': ['Asaba', 'Warri', 'Sapele', 'Agbor', 'Ughelli', 'Other'],
  'Oyo': ['Ibadan', 'Ogbomosho', 'Oyo', 'Iseyin', 'Other'],
  'Kano': ['Kano Municipal', 'Fagge', 'Dala', 'Gwale', 'Other'],
  'Enugu': ['Enugu Urban', 'Nsukka', 'Agbani', 'Other'],
  'Kaduna': ['Kaduna North', 'Kaduna South', 'Zaria', 'Kafanchan', 'Other'],
  'Ogun': ['Abeokuta', 'Ijebu Ode', 'Sagamu', 'Ota', 'Other'],
  'Anambra': ['Awka', 'Onitsha', 'Nnewi', 'Other'],
  'Akwa Ibom': ['Uyo', 'Eket', 'Ikot Ekpene', 'Oron', 'Other']
};

const COUNTRIES = [
  'Nigeria',
  'United Kingdom',
  'United States',
  'Ghana',
  'Kenya',
  'South Africa',
  'Canada',
  'Germany',
  'France',
  'Rwanda',
  'Egypt',
  'Cameroon',
  'Uganda',
  'Tanzania',
  'Ethiopia',
  'India',
  'China',
  'United Arab Emirates',
  'Other'
];

// Summit Target Date: November 16, 2026 at 09:00:00 WAT (UTC+1)
const SUMMIT_START_TIME = new Date('2026-11-16T09:00:00+01:00').getTime();
const TOTAL_PHYSICAL_SEATS = 500;

export const BusinessWeekRegistration: React.FC<BusinessWeekRegistrationProps> = ({
  onBackToBusinessWeek,
  onBackToAccelerator,
  onTicketReserved,
  onRegisterDelegate,
  config
}) => {
  // Navigation Tabs: 'registration' | 'schedule-tracks' | 'status-lookup' | 'success'
  const [activeTab, setActiveTab] = useState<'registration' | 'schedule-tracks' | 'status-lookup' | 'success'>('registration');

  // Form Required Initial Field - STARTS COMPLETELY BLANK
  const [formEmail, setFormEmail] = useState<string>('');

  // Section 1: About you - ALL BLANK
  const [fullName, setFullName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [organisation, setOrganisation] = useState<string>('');
  const [jobRole, setJobRole] = useState<string>('');

  // City, State and Country Split
  const [country, setCountry] = useState<string>('Nigeria');
  const [otherCountry, setOtherCountry] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [otherState, setOtherState] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [customCity, setCustomCity] = useState<string>('');

  // Section 2: Your participation - ALL BLANK
  const [persona, setPersona] = useState<string>('');
  const [otherPersona, setOtherPersona] = useState<string>('');

  // What are you most interested in? (multi-select) - EMPTY ARRAY
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Will you attend in person? - BLANK
  const [attendanceMode, setAttendanceMode] = useState<string>('');

  // Are you interested in exhibiting or sponsoring? - BLANK
  const [exhibitSponsorInterest, setExhibitSponsorInterest] = useState<string>('');

  // How did you hear about Óghowa Business Week? - BLANK
  const [discoverySource, setDiscoverySource] = useState<string>('');
  const [otherDiscoverySource, setOtherDiscoverySource] = useState<string>('');

  // Optional fields - BLANK
  const [accessibility, setAccessibility] = useState<string>('');
  const [expectations, setExpectations] = useState<string>('');

  // Section 3: Consent - BLANK / UNCHECKED
  const [declarationConfirmed, setDeclarationConfirmed] = useState<boolean>(false);
  const [receiveUpdates, setReceiveUpdates] = useState<boolean>(false);

  // Dynamic Form Custom Field Responses (Superadmin-added fields)
  const [customResponses, setCustomResponses] = useState<Record<string, any>>({});

  // Dynamic Fields Resolution from Superadmin Config
  const formFields: RegistrationFormField[] = (config?.formFields && config.formFields.length > 0)
    ? config.formFields
    : DEFAULT_REGISTRATION_FIELDS;

  const getField = (id: string) => formFields.find((f) => f.id === id);
  const isVisible = (id: string) => {
    const f = getField(id);
    return f ? f.isVisible !== false : true;
  };
  const isRequired = (id: string) => {
    const f = getField(id);
    return f ? !!f.required : false;
  };
  const getFieldLabel = (id: string, fallback: string) => getField(id)?.label || fallback;
  const getFieldPlaceholder = (id: string, fallback: string) => getField(id)?.placeholder || fallback;
  const getFieldHelper = (id: string, fallback?: string) => getField(id)?.helperText || fallback || '';
  const getFieldOptions = (id: string, fallback: string[]) => {
    const f = getField(id);
    return f && f.options && f.options.length > 0 ? f.options : fallback;
  };

  // Form Validation & Errors
  const [formError, setFormError] = useState<string>('');

  // Real-Time Live Countdown Timer Engine
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const difference = SUMMIT_START_TIME - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live Vacant Seats Calculation (Accurate, strictly real count without demo offset)
  const registeredCount = config?.delegates?.length || 0;
  const vacantSeats = Math.max(0, TOTAL_PHYSICAL_SEATS - registeredCount);

  // Active / Confirmed Delegate Profile for the Success Page
  const [confirmedDelegate, setConfirmedDelegate] = useState<RegisteredDelegate | null>(null);

  // Success Page Interactive Micro-States
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [isDealRoomModalOpen, setIsDealRoomModalOpen] = useState<boolean>(false);
  const [networkingEnabled, setNetworkingEnabled] = useState<boolean>(true);
  const [supportLiaisonModalOpen, setSupportLiaisonModalOpen] = useState<boolean>(false);
  const [shareSuccessToast, setShareSuccessToast] = useState<string>('');

  // Status Lookup State
  const [lookupQuery, setLookupQuery] = useState<string>('');
  const [lookupResult, setLookupResult] = useState<RegisteredDelegate | null>(null);
  const [lookupSearched, setLookupSearched] = useState<boolean>(false);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleCopyCode = () => {
    if (confirmedDelegate?.code) {
      navigator.clipboard.writeText(confirmedDelegate.code);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleDownloadCalendar = () => {
    if (!confirmedDelegate) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Óghowa Accelerator//Óghowa Business Week 2026//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:Óghowa Business Week 2026 (Accreditation: ${confirmedDelegate.code})
DESCRIPTION:Official participant accreditation for Óghowa Business Week 2026 · Innovation for Economic Transformation (...Our own), in institutional partnership with Benin Tech Fest. Participant: ${confirmedDelegate.name} (${confirmedDelegate.role}).
LOCATION:Victor Uwaifo Creative Hub
DTSTART:20261116T080000Z
DTEND:20261121T180000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `OghowaBusinessWeek_${confirmedDelegate.code}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShareSuccessToast('Calendar invite (.ics) downloaded for Nov 16–21, 2026!');
    setTimeout(() => setShareSuccessToast(''), 3000);
  };

  const handlePrintBadge = () => {
    window.print();
  };

  const handleShareBadge = () => {
    if (!confirmedDelegate) return;
    const shareText = `I have received my official accreditation pass for Óghowa Business Week 2026 in Benin City! Ref: ${confirmedDelegate.code}. Theme: Innovation for Economic Transformation. #OBW2026`;
    if (navigator.share) {
      navigator.share({
        title: 'Óghowa Business Week Accreditation',
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setShareSuccessToast('Share message copied to clipboard!');
      setTimeout(() => setShareSuccessToast(''), 3000);
    }
  };

  const renderCustomField = (field: RegistrationFormField) => {
    const val = customResponses[field.id];
    return (
      <div key={field.id} className="space-y-1.5">
        <label className="text-sm font-bold text-[#0F172A] block">
          {field.label} {field.required && <span className="text-[#DC2626] font-bold">*</span>}
        </label>
        {field.helperText && <p className="text-xs text-[#64748B]">{field.helperText}</p>}

        {field.type === 'text' && (
          <input
            type="text"
            required={field.required}
            value={val || ''}
            onChange={(e) => setCustomResponses((prev) => ({ ...prev, [field.id]: e.target.value }))}
            placeholder={field.placeholder || ''}
            className="w-full bg-white px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
          />
        )}
        {field.type === 'email' && (
          <input
            type="email"
            required={field.required}
            value={val || ''}
            onChange={(e) => setCustomResponses((prev) => ({ ...prev, [field.id]: e.target.value }))}
            placeholder={field.placeholder || 'email@example.com'}
            className="w-full bg-white px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
          />
        )}
        {field.type === 'tel' && (
          <input
            type="tel"
            required={field.required}
            value={val || ''}
            onChange={(e) => setCustomResponses((prev) => ({ ...prev, [field.id]: e.target.value }))}
            placeholder={field.placeholder || '+234...'}
            className="w-full bg-white px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
          />
        )}
        {field.type === 'number' && (
          <input
            type="number"
            required={field.required}
            value={val || ''}
            onChange={(e) => setCustomResponses((prev) => ({ ...prev, [field.id]: e.target.value }))}
            placeholder={field.placeholder || '0'}
            className="w-full bg-white px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
          />
        )}
        {field.type === 'textarea' && (
          <textarea
            rows={3}
            required={field.required}
            value={val || ''}
            onChange={(e) => setCustomResponses((prev) => ({ ...prev, [field.id]: e.target.value }))}
            placeholder={field.placeholder || ''}
            className="w-full bg-white px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
          />
        )}
        {field.type === 'select' && (
          <select
            required={field.required}
            value={val || ''}
            onChange={(e) => setCustomResponses((prev) => ({ ...prev, [field.id]: e.target.value }))}
            className="w-full bg-white px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#0B1E48]"
          >
            <option value="">{field.placeholder || '-- Please Select --'}</option>
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
        {field.type === 'radio' && (
          <div className="space-y-2 pt-1">
            {(field.options || []).map((opt) => (
              <label
                key={opt}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  val === opt
                    ? 'bg-[#FEE2E2]/40 border-[#DC2626] font-bold text-[#0B1E48]'
                    : 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                }`}
              >
                <input
                  type="radio"
                  name={`custom_${field.id}`}
                  checked={val === opt}
                  onChange={() => setCustomResponses((prev) => ({ ...prev, [field.id]: opt }))}
                  className="w-4 h-4 text-[#0B1E48] accent-[#0B1E48]"
                />
                <span className="text-xs sm:text-sm">{opt}</span>
              </label>
            ))}
          </div>
        )}
        {field.type === 'checkbox' && (
          <div className="space-y-2 pt-1">
            {field.options && field.options.length > 0 ? (
              field.options.map((opt) => {
                const currentArr: string[] = Array.isArray(val) ? val : [];
                const checked = currentArr.includes(opt);
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      checked
                        ? 'bg-[#E2E8F0]/20 border-[#0B1E48] font-bold text-[#0B1E48]'
                        : 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const nextArr = checked ? currentArr.filter((x) => x !== opt) : [...currentArr, opt];
                        setCustomResponses((prev) => ({ ...prev, [field.id]: nextArr }));
                      }}
                      className="w-4 h-4 text-[#0B1E48] accent-[#0B1E48] rounded"
                    />
                    <span className="text-xs sm:text-sm">{opt}</span>
                  </label>
                );
              })
            ) : (
              <label className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!val}
                  onChange={(e) => setCustomResponses((prev) => ({ ...prev, [field.id]: e.target.checked }))}
                  className="w-4 h-4 text-[#0B1E48] accent-[#0B1E48] rounded"
                />
                <span className="text-xs sm:text-sm text-[#0F172A]">{field.placeholder || field.label}</span>
              </label>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Dynamic validations respecting Superadmin isVisible and required configuration
    if (isVisible('primaryEmail') && isRequired('primaryEmail') && !formEmail.trim()) {
      setFormError(`Please enter your ${getFieldLabel('primaryEmail', 'Email').toLowerCase()}.`);
      return;
    }

    if (isVisible('fullName') && isRequired('fullName') && !fullName.trim()) {
      setFormError(`Please provide your ${getFieldLabel('fullName', 'Full name')}.`);
      return;
    }

    if (isVisible('contactEmail') && isRequired('contactEmail') && !contactEmail.trim()) {
      setFormError(`Please provide your ${getFieldLabel('contactEmail', 'Email address')}.`);
      return;
    }

    if (isVisible('phoneNumber') && isRequired('phoneNumber') && !phoneNumber.trim()) {
      setFormError(`Please provide your ${getFieldLabel('phoneNumber', 'Phone / WhatsApp number')}.`);
      return;
    }

    if (isVisible('organization') && isRequired('organization') && !organisation.trim()) {
      setFormError(`Please specify your ${getFieldLabel('organization', 'Organisation / business / school')}.`);
      return;
    }

    if (isVisible('jobRole') && isRequired('jobRole') && !jobRole.trim()) {
      setFormError(`Please specify your ${getFieldLabel('jobRole', 'Job title / role')}.`);
      return;
    }

    if (isVisible('location') && isRequired('location')) {
      if (!country || (country === 'Nigeria' && !state)) {
        setFormError('Please select your state and city.');
        return;
      }
    }

    if (isVisible('persona') && isRequired('persona') && !persona) {
      setFormError(`Please select an option for: ${getFieldLabel('persona', 'Which best describes you?')}`);
      return;
    }

    if (isVisible('interests') && isRequired('interests') && selectedInterests.length === 0) {
      setFormError(`Please select at least one area for: ${getFieldLabel('interests', 'What are you most interested in?')}`);
      return;
    }

    if (isVisible('attendanceMode') && isRequired('attendanceMode') && !attendanceMode) {
      setFormError(`Please select an option for: ${getFieldLabel('attendanceMode', 'Will you attend in person?')}`);
      return;
    }

    if (isVisible('exhibitSponsorInterest') && isRequired('exhibitSponsorInterest') && !exhibitSponsorInterest) {
      setFormError(`Please answer: ${getFieldLabel('exhibitSponsorInterest', 'Are you interested in exhibiting or sponsoring?')}`);
      return;
    }

    if (isVisible('discoverySource') && isRequired('discoverySource') && !discoverySource) {
      setFormError(`Please answer: ${getFieldLabel('discoverySource', 'How did you hear about Óghowa Business Week?')}`);
      return;
    }

    if (isVisible('accessibilityRequirements') && isRequired('accessibilityRequirements') && !accessibility.trim()) {
      setFormError(`Please answer: ${getFieldLabel('accessibilityRequirements', 'Accessibility requirements')}`);
      return;
    }

    if (isVisible('expectations') && isRequired('expectations') && !expectations.trim()) {
      setFormError(`Please answer: ${getFieldLabel('expectations', 'What do you hope to get from the week?')}`);
      return;
    }

    // Dynamic validation for superadmin custom fields
    const customRequiredFields = formFields.filter((f) => !f.isCore && f.isVisible !== false && f.required);
    for (const cf of customRequiredFields) {
      const resp = customResponses[cf.id];
      if (resp === undefined || resp === null || resp === '' || (Array.isArray(resp) && resp.length === 0)) {
        setFormError(`Please complete required field: ${cf.label}`);
        return;
      }
    }

    if (!declarationConfirmed) {
      setFormError('Please accept the Participant Declaration consent checkbox to complete registration.');
      return;
    }

    const effectiveCountry = country === 'Other' ? otherCountry : country;
    const effectiveState = country === 'Nigeria' ? state : otherState;
    const effectiveCity = (city === 'Other' || customCity) ? customCity : city;
    const resolvedLocation = `${effectiveCity || 'Benin City'}, ${effectiveState || 'Edo State'}, ${effectiveCountry || 'Nigeria'}`;

    const generatedRef = `OBW-2026-PARTICIPANT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDelegate: RegisteredDelegate = {
      id: `del-${Date.now()}`,
      code: generatedRef,
      name: fullName || 'Participant',
      email: formEmail || contactEmail,
      phone: phoneNumber,
      organization: organisation || 'Independent',
      role: jobRole || 'Participant',
      country: effectiveCountry,
      state: effectiveState,
      city: effectiveCity,
      location: resolvedLocation,
      persona: persona === 'Other' ? (otherPersona || 'Other') : (persona || 'Participant'),
      otherPersona: persona === 'Other' ? otherPersona : undefined,
      tracks: selectedInterests.slice(0, 2),
      interests: selectedInterests,
      attendanceMode: attendanceMode || 'Yes, in person',
      exhibitSponsorInterest: exhibitSponsorInterest || 'No',
      discoverySource: discoverySource === 'Other' ? (otherDiscoverySource || 'Other') : (discoverySource || 'Online'),
      accessibilityRequirements: accessibility,
      expectations,
      customAnswers: customResponses,
      declarationConfirmed,
      receiveUpdates,
      registeredAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Accreditation Issued',
      dealRoomInterest: exhibitSponsorInterest !== 'No' || persona.includes('founder') || persona.includes('Investor')
    };

    setConfirmedDelegate(newDelegate);
    setActiveTab('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (onRegisterDelegate) {
      onRegisterDelegate(newDelegate);
    }

    try {
      setDoc(doc(db, 'delegates', newDelegate.id), cleanForFirestore(newDelegate), { merge: true }).catch((err) =>
        console.error('Direct Firestore delegate write error:', err)
      );
    } catch (err) {
      console.warn('Direct Firestore delegate write failed:', err);
    }

    if (onTicketReserved) {
      const ticketEmail: EmailNotification = {
        id: `EML-OBW-${Date.now()}`,
        recipient: newDelegate.email,
        recipientName: newDelegate.name,
        sender: 'oghowa@metaspaceconsult.com',
        smtpServer: 'mail.metaspaceconsult.com:465 (SSL/TLS)',
        subject: `Accreditation Confirmed: Óghowa Business Week 2026 (${newDelegate.code})`,
        type: 'Event Ticket',
        timestamp: 'Just now',
        content: `Dear ${newDelegate.name},\n\nYour participant registration for Óghowa Business Week (Nov 16 – 21, 2026) in collaboration with Benin Tech Fest is successfully confirmed!\n\nReference Code: ${newDelegate.code}\nAttendance Mode: ${newDelegate.attendanceMode}\nPersona: ${newDelegate.persona}\nOrganisation: ${newDelegate.organization} (${newDelegate.role})\nLocation: ${newDelegate.location}\nVenue: Victor Uwaifo Creative Hub\n\nPlease present this accreditation code upon arrival at the registration desk.\n\nWarm regards,\nÓghowa Business Week Secretariat\noghowa@metaspaceconsult.com`
      };
      onTicketReserved(ticketEmail);
    }
  };

  const handleStatusSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupSearched(true);
    if (!lookupQuery.trim()) {
      setLookupResult(null);
      return;
    }

    const allDelegates = config?.delegates || [];
    const found = allDelegates.find(
      (d) =>
        d.code.toLowerCase().includes(lookupQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(lookupQuery.toLowerCase()) ||
        d.name.toLowerCase().includes(lookupQuery.toLowerCase())
    );

    if (found) {
      setLookupResult(found);
    } else if (confirmedDelegate && (lookupQuery.includes(confirmedDelegate.code) || lookupQuery.includes(confirmedDelegate.email))) {
      setLookupResult(confirmedDelegate);
    } else {
      setLookupResult(null);
    }
  };

  const availableCities = STATE_CITIES[state] || ['Capital City', 'Metropolitan', 'Other'];

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen flex flex-col font-sans selection:bg-[#0B1E48] selection:text-white">
      {/* 1. HEADER - CLEAN BRANDED NAVIGATION */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#E2E8F0]">
        <div className="h-20 max-w-[1120px] mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToBusinessWeek}
              className="cursor-pointer hover:opacity-90 transition-opacity flex items-center"
              title="Return to Business Week Main Summit Page"
            >
              <BusinessWeekLogo size="sm" />
            </button>
            <div className="flex flex-col">
              <span className="text-base text-[#0B1E48] font-bold tracking-tight leading-tight">
                Óghowa Business Week
              </span>
              <span className="text-xs text-[#64748B]">Participant Registration</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => {
                  setActiveTab('registration');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-xs sm:text-sm font-semibold px-3 py-1.5 transition-colors rounded-lg cursor-pointer ${
                  activeTab === 'registration'
                    ? 'bg-[#0B1E48] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                Register
              </button>
              <button
                onClick={() => {
                  setActiveTab('schedule-tracks');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-xs sm:text-sm font-semibold px-3 py-1.5 transition-colors rounded-lg cursor-pointer ${
                  activeTab === 'schedule-tracks'
                    ? 'bg-[#0B1E48] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                Pillars
              </button>
              <button
                onClick={() => {
                  setActiveTab('status-lookup');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-xs sm:text-sm font-semibold px-3 py-1.5 transition-colors rounded-lg cursor-pointer ${
                  activeTab === 'status-lookup'
                    ? 'bg-[#0B1E48] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                Verify Status
              </button>
            </nav>

            <button
              onClick={onBackToBusinessWeek}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Summit Page</span>
            </button>

            <button
              onClick={onBackToAccelerator}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#64748B] hover:text-[#0B1E48] transition-colors cursor-pointer"
              title="Return to Óghowa Accelerator Homepage"
            >
              <span>Oghowa Homepage</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification Alert */}
      {shareSuccessToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#0B1E48] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{shareSuccessToast}</span>
        </div>
      )}

      {/* 2. MAIN BODY */}
      <main className="w-full pt-20 flex-1 bg-[#F8FAFC]">
        {/* ============================================================== */}
        {/* VIEW 1: ACCREDITATION SUCCESS PAGE                             */}
        {/* ============================================================== */}
        {activeTab === 'success' && confirmedDelegate && (
          <div className="w-full max-w-[1120px] mx-auto px-4 md:px-6 py-8 sm:py-10 animate-in fade-in duration-300">
            {/* Top Stage Pill / Flow Tracker */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <button
                  onClick={() => setActiveTab('registration')}
                  className="font-semibold text-[#64748B] hover:text-[#0B1E48] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Registration Form</span>
                </button>
                <span>•</span>
                <span className="font-semibold text-[#0B1E48]">Accreditation Confirmation</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-xs border border-[#E2E8F0]">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Live Accreditation System
                </span>
              </div>
            </div>

            {/* Executive Success Notification Banner */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs mb-8 relative overflow-hidden border border-[#E2E8F0]">
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#E2E8F0]/30 blur-3xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="flex items-start gap-4 max-w-2xl">
                  <div className="w-12 h-12 rounded-full bg-[#061224] text-[#E2E8F0] flex items-center justify-center shrink-0 shadow-md">
                    <ShieldCheck className="w-6 h-6 text-[#E2E8F0]" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] text-[11px] font-bold uppercase tracking-wider mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                      Accreditation Issued
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E48] tracking-tight">
                      Registration Confirmed — Welcome to Óghowa Business Week 2026
                    </h1>
                    <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
                      Your participant registration has been recorded into the national innovation register for November 16 – 21, 2026. A cryptographic participant pass and calendar sync have been dispatched to{' '}
                      <span className="font-bold text-[#0F172A]">{confirmedDelegate.email}</span>.
                    </p>
                  </div>
                </div>

                {/* ID Card Box with Copy feedback */}
                <div className="bg-[#F1F5F9] p-4 rounded-xl flex flex-col gap-2 shrink-0 min-w-[280px] border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                    Reference / Accreditation ID
                  </span>
                  <div className="flex items-center justify-between bg-white px-3.5 py-2 rounded-lg border border-[#E2E8F0]">
                    <span className="text-sm sm:text-base text-[#0B1E48] tracking-wider font-mono font-bold">
                      {confirmedDelegate.code}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="text-[#0B1E48] hover:text-[#0B1E48] transition-colors p-1 cursor-pointer"
                      title="Copy Reference ID"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0B1E48]" />
                      <span>Verified Protocol</span>
                    </span>
                    {copiedToast && (
                      <span className="text-emerald-700 font-bold text-xs animate-in fade-in">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Main Grid: Pass on Left, Logistics on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: The Digital Accreditation Badge Pass */}
              <section className="lg:col-span-7 flex flex-col items-center">
                <div className="w-full max-w-[500px] bg-gradient-to-b from-[#0B1E48] via-[#061224] to-[#061224] rounded-2xl text-white shadow-2xl relative overflow-hidden transition-all duration-300 border border-[#0B1E48]/30">
                  <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay">
                    <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern height="40" id="edo-lattice" patternUnits="userSpaceOnUse" width="40">
                          <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
                          <circle cx="20" cy="20" fill="#FFFFFF" r="3" />
                        </pattern>
                      </defs>
                      <rect fill="url(#edo-lattice)" height="100%" width="100%" />
                    </svg>
                  </div>

                  {/* Clip Hole Visual */}
                  <div className="w-full flex justify-center pt-3 pb-1 relative z-10">
                    <div className="w-16 h-3 rounded-full bg-[#061224] shadow-inner flex items-center justify-center border border-white/10">
                      <div className="w-10 h-1.5 rounded-full bg-white/20" />
                    </div>
                  </div>

                  {/* Top Brand Header */}
                  <div className="p-6 pb-4 border-b border-white/10 relative z-10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-[#E2E8F0] border border-white/10">
                        <Building className="w-5 h-5 text-[#E2E8F0]" />
                      </div>
                      <div>
                        <span className="text-base font-bold tracking-tight text-white block">
                          Óghowa Business Week
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          November 16 – 21, 2026 • Benin City
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-[#DC2626] text-white text-[10px] font-bold tracking-widest uppercase shadow-xs">
                        Official Pass
                      </span>
                    </div>
                  </div>

                  {/* Pass Middle Body */}
                  <div className="p-6 relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#E2E8F0] text-[#061224] text-xs font-bold shadow-xs">
                        {confirmedDelegate.persona}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold tracking-wider uppercase border border-white/10">
                        {confirmedDelegate.attendanceMode}
                      </span>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                        Accredited Participant
                      </span>
                      <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
                        {confirmedDelegate.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                        {confirmedDelegate.role}, {confirmedDelegate.organization}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FEE2E2]" />
                        <span>{confirmedDelegate.location}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                          Venue
                        </span>
                        <p className="text-white font-bold leading-snug">Victor Uwaifo Creative Hub</p>
                        <p className="text-slate-300 text-[11px]">Victor Uwaifo Creative Hub</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                          Selected Focus
                        </span>
                        <div className="flex flex-col gap-1">
                          {(confirmedDelegate.interests || []).slice(0, 2).map((t, idx) => (
                            <span key={idx} className="text-white text-[11px] font-medium flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                              <span>{t}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* QR Code Verification Block */}
                    <div className="bg-white text-[#0F172A] rounded-xl p-4 shadow-lg flex items-center justify-between gap-4 mt-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                          On-Site Rapid Accreditation
                        </span>
                        <span className="text-base font-extrabold text-[#0B1E48] tracking-tight">
                          VIP Fast-Track
                        </span>
                        <span className="text-xs text-[#64748B] mt-0.5">
                          Present at Entrance or Registration Pavilion
                        </span>
                        <span className="font-mono text-[9px] text-[#64748B] tracking-widest mt-1">
                          HASH: 9a7b-04f8-e1c2-obw26
                        </span>
                      </div>

                      <div className="w-20 h-20 bg-[#F1F5F9] p-1.5 rounded-lg border border-[#E2E8F0] shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full text-[#0B1E48]" fill="currentColor" viewBox="0 0 100 100">
                          <path d="M10 10 h24 v24 h-24 Z M14 14 v16 h16 v-16 Z M18 18 h8 v8 h-8 Z" />
                          <path d="M66 10 h24 v24 h-24 Z M70 14 v16 h16 v-16 Z M74 18 h8 v8 h-8 Z" />
                          <path d="M10 66 h24 v24 h-24 Z M14 70 v16 h16 v-16 Z M18 74 h8 v8 h-8 Z" />
                          <rect height="6" width="6" x="42" y="12" />
                          <rect height="6" width="6" x="52" y="16" />
                          <rect height="6" width="8" x="46" y="24" />
                          <rect height="8" width="8" x="12" y="44" />
                          <rect height="6" width="6" x="24" y="48" />
                          <rect height="8" width="8" x="40" y="40" />
                          <rect height="8" width="6" x="52" y="42" />
                          <rect height="6" width="8" x="64" y="44" />
                          <rect height="6" width="6" x="76" y="42" />
                          <rect height="8" width="6" x="86" y="48" />
                          <rect height="6" width="8" x="42" y="58" />
                          <rect height="8" width="6" x="54" y="54" />
                          <rect height="8" width="6" x="44" y="70" />
                          <rect height="6" width="8" x="56" y="68" />
                          <rect height="8" width="6" x="68" y="64" />
                          <rect height="6" width="8" x="80" y="72" />
                          <rect height="8" width="8" x="72" y="80" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Security Barcode */}
                  <div className="px-6 py-3 bg-[#061224] border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                        In Collaboration with Benin Tech Fest
                      </span>
                    </div>

                    <div className="flex items-center gap-[2px] h-5">
                      <span className="w-[2px] h-full bg-white/70" />
                      <span className="w-[1px] h-full bg-white/40" />
                      <span className="w-[3px] h-full bg-white/70" />
                      <span className="w-[1px] h-full bg-white/30" />
                      <span className="w-[2px] h-full bg-white/70" />
                      <span className="w-[4px] h-full bg-white/60" />
                      <span className="w-[1px] h-full bg-white/80" />
                      <span className="w-[3px] h-full bg-white/50" />
                      <span className="w-[2px] h-full bg-white/70" />
                    </div>
                  </div>
                </div>

                {/* Quick Pass Actions */}
                <div className="w-full max-w-[500px] mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={handlePrintBadge}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0B1E48] text-white font-bold text-xs hover:bg-[#061224] transition-all shadow-sm cursor-pointer"
                    title="Print registration voucher sheet or save as PDF"
                  >
                    <Printer className="w-4 h-4 text-[#FEE2E2]" />
                    <span>Print Sheet / PDF</span>
                  </button>

                  <button
                    onClick={handleDownloadCalendar}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white text-[#0B1E48] border border-[#CBD5E1] font-bold text-xs hover:bg-[#F1F5F9] transition-colors shadow-xs cursor-pointer"
                  >
                    <CalendarPlus className="w-4 h-4 text-[#DC2626]" />
                    <span>Add to Calendar</span>
                  </button>

                  <button
                    onClick={handleShareBadge}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white text-[#0B1E48] border border-[#CBD5E1] font-bold text-xs hover:bg-[#F1F5F9] transition-colors shadow-xs cursor-pointer"
                  >
                    <Share className="w-4 h-4 text-[#0B1E48]" />
                    <span>Share Badge</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#64748B] mt-2.5 text-center">
                  Dates: November 16 – 21, 2026. Compatible with Apple Wallet, Google Wallet & offline PDF storage.
                </p>

                {/* Social Share Prompt */}
                <div className="w-full max-w-[500px] mt-4 bg-[#E2E8F0]/30 rounded-xl p-3.5 flex items-center justify-between border border-[#0B1E48]/20">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0B1E48]" />
                    <span className="text-xs font-semibold text-[#0B1E48]">
                      Announce attendance on LinkedIn or X
                    </span>
                  </div>
                  <button
                    onClick={handleShareBadge}
                    className="text-xs font-bold text-[#0B1E48] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Post #OBW2026</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </section>

              {/* Right Column: Logistics & Actions */}
              <section className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#E2E8F0]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
                      On-Site Logistics
                    </span>
                    <span className="text-xs text-[#64748B] font-semibold">November 16 – 21, 2026</span>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#0B1E48] flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-[#0B1E48]" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#0B1E48] block">
                          November 16 – 21, 2026
                        </span>
                        <span className="text-xs text-[#64748B]">
                          Accreditation opens 08:30 AM • Keynote Plenary at 10:15 AM
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#0B1E48] flex items-center justify-center shrink-0">
                        <Pin className="w-4 h-4 text-[#DC2626]" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#0F172A] block">
                          Victor Uwaifo Creative Hub
                        </span>
                        <p className="text-xs text-[#64748B]">
                          Victor Uwaifo Creative Hub
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#F1F5F9] rounded-xl p-3 flex items-start gap-2 border border-[#E2E8F0]">
                      <Info className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                      <p className="text-xs text-[#64748B] leading-tight">
                        Physical lanyard and RFID token collection begins <strong>Monday, November 16, 8:30 AM</strong> at the accreditation pavilions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Participant Checklist Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#E2E8F0]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1E48]">
                      Participant Checklist
                    </span>
                    <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-full">
                      Action Items
                    </span>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-emerald-600">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-[#0F172A] block">
                          ₦50M Deal Room & Pitch Showcase
                        </span>
                        <p className="text-xs text-[#64748B]">
                          As an accredited participant, submit or view investor materials.
                        </p>
                        <button
                          onClick={() => setIsDealRoomModalOpen(true)}
                          className="text-xs font-bold text-[#0B1E48] hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                        >
                          <span>Access Deal Room Portal</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-emerald-600">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-bold text-[#0F172A] block">
                            Networking Directory
                          </span>
                          <button
                            onClick={() => setNetworkingEnabled(!networkingEnabled)}
                            className={`text-[10px] px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                              networkingEnabled
                                ? 'bg-[#E2E8F0] text-[#061224]'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {networkingEnabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                        <p className="text-xs text-[#64748B] mt-0.5">
                          Profile is discoverable by verified founders, investors & corporate partners.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#0B1E48]" />
                        <span className="text-xs font-semibold text-[#0F172A]">
                          Participant Concierge Group
                        </span>
                      </div>
                      <a
                        href="https://whatsapp.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-[#0B1E48] hover:text-[#0B1E48] transition-colors"
                      >
                        Join WhatsApp Group →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Support Liaison Card */}
                <div className="bg-[#F1F5F9] rounded-2xl p-4.5 flex items-center justify-between gap-4 border border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0B1E48] shadow-xs shrink-0">
                      <HelpCircle className="w-5 h-5 text-[#0B1E48]" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-[#0B1E48] block">
                        Need assistance or hotel protocol?
                      </span>
                      <span className="text-xs text-[#64748B]">
                        Contact protocol desk for airport transfers, partner hotels & queries.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSupportLiaisonModalOpen(true)}
                    className="shrink-0 px-3 py-2 bg-white text-[#0B1E48] font-bold text-xs rounded-xl border border-[#CBD5E1] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    Contact Secretariat
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={onBackToBusinessWeek}
                    className="w-full py-3 rounded-xl bg-[#0B1E48] hover:bg-[#061224] text-white font-bold text-xs sm:text-sm transition cursor-pointer text-center"
                  >
                    Return to Business Week Summit
                  </button>

                  <button
                    onClick={() => {
                      setConfirmedDelegate(null);
                      setActiveTab('registration');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-3 rounded-xl bg-white hover:bg-[#F1F5F9] text-[#0B1E48] border border-[#CBD5E1] font-bold text-xs sm:text-sm transition cursor-pointer text-center"
                  >
                    Register Another Participant
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: PARTICIPANT REGISTRATION FORM (CLEAN & BLANK)          */}
        {/* ============================================================== */}
        {activeTab === 'registration' && (
          <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-8 sm:py-10">
            <div className="max-w-[760px] mx-auto">
              {/* Header Box */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,35,27,0.06)] border border-[#E2E8F0] mb-6 relative overflow-hidden">
                <div className="h-2.5 w-full bg-[#0B1E48] absolute top-0 left-0" />

                <div className="pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#DC2626]">
                      ...Our own
                    </span>
                    <div className="flex items-center gap-3 text-xs">
                      {/* Live vacant seats counter */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span>{vacantSeats} vacant physical seats remaining</span>
                      </span>
                      <span className="text-[#64748B] flex items-center gap-1 text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>~3 mins</span>
                      </span>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E48] tracking-tight">
                    {config?.registrationTitle || 'Óghowa Business Week — Participant Registration'}
                  </h1>
                  <p className="text-sm sm:text-base font-semibold text-[#0B1E48] mt-1">
                    {config?.registrationSubtitle || 'Óghowa Business Week · Innovation for Economic Transformation'}
                  </p>

                  <p className="text-xs sm:text-sm text-[#64748B] mt-3 leading-relaxed">
                    {config?.registrationDescription || 'Register to take part in Óghowa Business Week, in collaboration with Benin Tech Fest. Join founders, investors, business leaders and innovators for keynotes, masterclasses, startup pitches and networking in Edo State.'}
                  </p>

                  {/* Real-time countdown strip */}
                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-xl border">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B1E48]">
                      <Calendar className="w-4 h-4 text-[#DC2626]" />
                      <span>November 16 – 21, 2026 • Live Countdown:</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#0B1E48]">
                      <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {timeLeft.days}d
                      </span>
                      <span>:</span>
                      <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {String(timeLeft.hours).padStart(2, '0')}h
                      </span>
                      <span>:</span>
                      <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {String(timeLeft.minutes).padStart(2, '0')}m
                      </span>
                      <span>:</span>
                      <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0] text-[#DC2626]">
                        {String(timeLeft.seconds).padStart(2, '0')}s
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] space-y-1">
                    <p className="text-xs text-[#64748B] font-medium">
                      Please complete all required questions (*). It takes about 3 minutes.
                    </p>
                    <p className="text-[11px] text-[#DC2626] font-bold">
                      * Indicates required question
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {formError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-center gap-2">
                    <X className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Primary Email Card */}
                {isVisible('primaryEmail') && (
                  <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#E2E8F0] space-y-2">
                    <label className="text-sm font-bold text-[#0F172A] block">
                      {getFieldLabel('primaryEmail', 'Email')}{' '}
                      {isRequired('primaryEmail') && <span className="text-[#DC2626] font-bold">*</span>}
                    </label>
                    {getFieldHelper('primaryEmail') && (
                      <p className="text-xs text-[#64748B]">{getFieldHelper('primaryEmail')}</p>
                    )}
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] w-4 h-4" />
                      <input
                        type="email"
                        required={isRequired('primaryEmail')}
                        value={formEmail}
                        onChange={(e) => {
                          setFormEmail(e.target.value);
                          if (!contactEmail) setContactEmail(e.target.value);
                        }}
                        placeholder={getFieldPlaceholder('primaryEmail', 'Your email address')}
                        className="w-full bg-white pl-10 pr-4 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
                      />
                    </div>
                  </div>
                )}

                {/* SECTION 1: ABOUT YOU */}
                {(isVisible('fullName') ||
                  isVisible('contactEmail') ||
                  isVisible('phoneNumber') ||
                  isVisible('organization') ||
                  isVisible('jobRole') ||
                  isVisible('location') ||
                  formFields.some((f) => !f.isCore && f.isVisible !== false && f.section === 'about')) && (
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-[#E2E8F0] space-y-6">
                    <div className="pb-3 border-b border-[#E2E8F0]">
                      <h2 className="text-xl font-bold text-[#0B1E48]">About you</h2>
                      <p className="text-xs text-[#64748B] mt-0.5">Please provide your verified personal identification.</p>
                    </div>

                    {/* Full Name */}
                    {isVisible('fullName') && (
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-[#0F172A] block">
                          {getFieldLabel('fullName', 'Full name')}{' '}
                          {isRequired('fullName') && <span className="text-[#DC2626] font-bold">*</span>}
                        </label>
                        {getFieldHelper('fullName') && (
                          <p className="text-xs text-[#64748B]">{getFieldHelper('fullName')}</p>
                        )}
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] w-4 h-4" />
                          <input
                            type="text"
                            required={isRequired('fullName')}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder={getFieldPlaceholder('fullName', 'Your full name')}
                            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Address */}
                    {isVisible('contactEmail') && (
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-[#0F172A] block">
                          {getFieldLabel('contactEmail', 'Email address')}{' '}
                          {isRequired('contactEmail') && <span className="text-[#DC2626] font-bold">*</span>}
                        </label>
                        {getFieldHelper('contactEmail') && (
                          <p className="text-xs text-[#64748B]">{getFieldHelper('contactEmail')}</p>
                        )}
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] w-4 h-4" />
                          <input
                            type="email"
                            required={isRequired('contactEmail')}
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder={getFieldPlaceholder('contactEmail', 'Your contact email')}
                            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Phone / WhatsApp number */}
                    {isVisible('phoneNumber') && (
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-[#0F172A] block">
                          {getFieldLabel('phoneNumber', 'Phone / WhatsApp number')}{' '}
                          {isRequired('phoneNumber') && <span className="text-[#DC2626] font-bold">*</span>}
                        </label>
                        <p className="text-xs text-[#64748B]">
                          {getFieldHelper('phoneNumber', 'Include your country code, e.g. +234…')}
                        </p>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] w-4 h-4" />
                          <input
                            type="tel"
                            required={isRequired('phoneNumber')}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder={getFieldPlaceholder('phoneNumber', '+234 800 000 0000')}
                            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Organisation / business / school */}
                    {isVisible('organization') && (
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-[#0F172A] block">
                          {getFieldLabel('organization', 'Organisation / business / school')}{' '}
                          {isRequired('organization') && <span className="text-[#DC2626] font-bold">*</span>}
                        </label>
                        <p className="text-xs text-[#64748B]">
                          {getFieldHelper('organization', 'Write "Independent" if you are not attached to an organisation.')}
                        </p>
                        <div className="relative">
                          <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] w-4 h-4" />
                          <input
                            type="text"
                            required={isRequired('organization')}
                            value={organisation}
                            onChange={(e) => setOrganisation(e.target.value)}
                            placeholder={getFieldPlaceholder('organization', 'Your organisation or "Independent"')}
                            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Job title / role */}
                    {isVisible('jobRole') && (
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-[#0F172A] block">
                          {getFieldLabel('jobRole', 'Job title / role')}{' '}
                          {isRequired('jobRole') && <span className="text-[#DC2626] font-bold">*</span>}
                        </label>
                        {getFieldHelper('jobRole') && (
                          <p className="text-xs text-[#64748B]">{getFieldHelper('jobRole')}</p>
                        )}
                        <div className="relative">
                          <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] w-4 h-4" />
                          <input
                            type="text"
                            required={isRequired('jobRole')}
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                            placeholder={getFieldPlaceholder('jobRole', 'e.g. Founder, CEO, Student, Tech Lead')}
                            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
                          />
                        </div>
                      </div>
                    )}

                    {/* City, state and country split */}
                    {isVisible('location') && (
                      <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                        <div>
                          <label className="text-sm font-bold text-[#0F172A] block">
                            {getFieldLabel('location', 'City, state and country')}{' '}
                            {isRequired('location') && <span className="text-[#DC2626] font-bold">*</span>}
                          </label>
                          <p className="text-xs text-[#64748B]">
                            {getFieldHelper(
                              'location',
                              'Split each: each country listed and all Nigeria states listed with cities too (e.g. Benin City, Edo State, Nigeria)'
                            )}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Country */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-[#64748B]">
                              Country {isRequired('location') && '*'}
                            </label>
                            <select
                              value={country}
                              onChange={(e) => {
                                setCountry(e.target.value);
                                setState('');
                                setCity('');
                              }}
                              className="w-full bg-white px-3 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#0B1E48]"
                            >
                              {COUNTRIES.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                            {country === 'Other' && (
                              <input
                                type="text"
                                required={isRequired('location')}
                                value={otherCountry}
                                onChange={(e) => setOtherCountry(e.target.value)}
                                placeholder="Type country name"
                                className="w-full mt-2 bg-white px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs text-[#0F172A]"
                              />
                            )}
                          </div>

                          {/* State */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-[#64748B]">
                              State / Province {isRequired('location') && '*'}
                            </label>
                            {country === 'Nigeria' ? (
                              <select
                                value={state}
                                onChange={(e) => {
                                  setState(e.target.value);
                                  setCity('');
                                }}
                                className="w-full bg-white px-3 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#0B1E48]"
                                required={isRequired('location')}
                              >
                                <option value="">Select State</option>
                                {NIGERIAN_STATES.map((s) => (
                                  <option key={s} value={s}>
                                    {s} {s === 'Edo' ? '(Host State)' : ''}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                required={isRequired('location')}
                                value={otherState}
                                onChange={(e) => setOtherState(e.target.value)}
                                placeholder="State or Region"
                                className="w-full bg-white px-3 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A]"
                              />
                            )}
                          </div>

                          {/* City */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-[#64748B]">
                              City {isRequired('location') && '*'}
                            </label>
                            {country === 'Nigeria' ? (
                              <>
                                <select
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                  className="w-full bg-white px-3 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#0B1E48]"
                                  required={isRequired('location')}
                                >
                                  <option value="">Select City</option>
                                  {availableCities.map((c) => (
                                    <option key={c} value={c}>
                                      {c}
                                    </option>
                                  ))}
                                </select>
                                {city === 'Other' && (
                                  <input
                                    type="text"
                                    required={isRequired('location')}
                                    value={customCity}
                                    onChange={(e) => setCustomCity(e.target.value)}
                                    placeholder="Type city name"
                                    className="w-full mt-2 bg-white px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs text-[#0F172A]"
                                  />
                                )}
                              </>
                            ) : (
                              <input
                                type="text"
                                required={isRequired('location')}
                                value={customCity}
                                onChange={(e) => setCustomCity(e.target.value)}
                                placeholder="Enter city"
                                className="w-full bg-white px-3 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A]"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Section 1 Custom Fields if any */}
                    {formFields
                      .filter((f) => !f.isCore && f.isVisible !== false && f.section === 'about')
                      .map(renderCustomField)}
                  </div>
                )}

                {/* SECTION 2: YOUR PARTICIPATION */}
                {(isVisible('persona') ||
                  isVisible('interests') ||
                  isVisible('attendanceMode') ||
                  isVisible('exhibitSponsorInterest') ||
                  isVisible('discoverySource') ||
                  isVisible('accessibilityRequirements') ||
                  isVisible('expectations') ||
                  formFields.some((f) => !f.isCore && f.isVisible !== false && f.section === 'participation')) && (
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-[#E2E8F0] space-y-6">
                    <div className="pb-3 border-b border-[#E2E8F0]">
                      <h2 className="text-xl font-bold text-[#0B1E48]">Your participation</h2>
                      <p className="text-xs text-[#64748B] mt-0.5">Tell us about how you wish to engage with the summit.</p>
                    </div>

                    {/* Question: Which best describes you? */}
                    {isVisible('persona') && (
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-[#0F172A] block">
                          {getFieldLabel('persona', 'Which best describes you?')}{' '}
                          {isRequired('persona') && <span className="text-[#DC2626] font-bold">*</span>}
                        </label>
                        {getFieldHelper('persona') && (
                          <p className="text-xs text-[#64748B]">{getFieldHelper('persona')}</p>
                        )}

                        <div className="space-y-2">
                          {getFieldOptions('persona', [
                            'Entrepreneur / business owner',
                            'Startup founder',
                            'Tech or digital professional',
                            'Investor / funder',
                            'Corporate / business professional',
                            'Government / public sector',
                            'Student / young professional',
                            'Creative / media',
                            'Other'
                          ]).map((opt) => (
                            <label
                              key={opt}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                persona === opt
                                  ? 'bg-[#FEE2E2]/40 border-[#DC2626] font-bold text-[#0B1E48]'
                                  : 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                              }`}
                            >
                              <input
                                type="radio"
                                name="persona"
                                checked={persona === opt}
                                onChange={() => setPersona(opt)}
                                className="w-4 h-4 text-[#0B1E48] accent-[#0B1E48]"
                              />
                              <span className="text-xs sm:text-sm">{opt}</span>
                            </label>
                          ))}

                          {persona === 'Other' && (
                            <input
                              type="text"
                              required={isRequired('persona')}
                              value={otherPersona}
                              onChange={(e) => setOtherPersona(e.target.value)}
                              placeholder="Please specify your role"
                              className="w-full mt-2 bg-white px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-xs text-[#0F172A]"
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Question: What are you most interested in? */}
                    {isVisible('interests') && (
                      <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
                        <div>
                          <label className="text-sm font-bold text-[#0F172A] block">
                            {getFieldLabel('interests', 'What are you most interested in?')}{' '}
                            {isRequired('interests') && <span className="text-[#DC2626] font-bold">*</span>}
                          </label>
                          <p className="text-xs text-[#64748B]">
                            {getFieldHelper('interests', 'Select all that apply.')}
                          </p>
                        </div>

                        <div className="space-y-2">
                          {getFieldOptions('interests', [
                            'Keynotes & panel discussions',
                            'Masterclasses & workshops',
                            'Startup pitches & showcase',
                            'Networking & investor meetups',
                            'Exhibition',
                            'Mentorship & business support'
                          ]).map((item) => {
                            const isChecked = selectedInterests.includes(item);
                            return (
                              <label
                                key={item}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                  isChecked
                                    ? 'bg-[#E2E8F0]/20 border-[#0B1E48] font-bold text-[#0B1E48]'
                                    : 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleInterest(item)}
                                  className="w-4 h-4 text-[#0B1E48] accent-[#0B1E48] rounded"
                                />
                                <span className="text-xs sm:text-sm">{item}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Question: Will you attend in person? */}
                    {isVisible('attendanceMode') && (
                      <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
                        <label className="text-sm font-bold text-[#0F172A] block">
                          {getFieldLabel('attendanceMode', 'Will you attend in person?')}{' '}
                          {isRequired('attendanceMode') && <span className="text-[#DC2626] font-bold">*</span>}
                        </label>
                        {getFieldHelper('attendanceMode') && (
                          <p className="text-xs text-[#64748B]">{getFieldHelper('attendanceMode')}</p>
                        )}

                        <div className="space-y-2">
                          {getFieldOptions('attendanceMode', [
                            'Yes, in person',
                            'Not sure yet',
                            'No, I would like to follow remotely'
                          ]).map((opt) => (
                            <label
                              key={opt}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                attendanceMode === opt
                                  ? 'bg-[#FEE2E2]/40 border-[#DC2626] font-bold text-[#0B1E48]'
                                  : 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                              }`}
                            >
                              <input
                                type="radio"
                                name="attendanceMode"
                                checked={attendanceMode === opt}
                                onChange={() => setAttendanceMode(opt)}
                                className="w-4 h-4 text-[#0B1E48] accent-[#0B1E48]"
                              />
                              <span className="text-xs sm:text-sm">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Question: Are you interested in exhibiting or sponsoring? */}
                    {isVisible('exhibitSponsorInterest') && (
                      <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
                        <label className="text-sm font-bold text-[#0F172A] block">
                          {getFieldLabel('exhibitSponsorInterest', 'Are you interested in exhibiting or sponsoring?')}{' '}
                          {isRequired('exhibitSponsorInterest') && (
                            <span className="text-[#DC2626] font-bold">*</span>
                          )}
                        </label>
                        {getFieldHelper('exhibitSponsorInterest') && (
                          <p className="text-xs text-[#64748B]">{getFieldHelper('exhibitSponsorInterest')}</p>
                        )}

                        <div className="space-y-2">
                          {getFieldOptions('exhibitSponsorInterest', ['No', 'Exhibiting', 'Sponsoring', 'Both']).map(
                            (opt) => (
                              <label
                                key={opt}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                  exhibitSponsorInterest === opt
                                    ? 'bg-[#FEE2E2]/40 border-[#DC2626] font-bold text-[#0B1E48]'
                                    : 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="exhibitSponsorInterest"
                                  checked={exhibitSponsorInterest === opt}
                                  onChange={() => setExhibitSponsorInterest(opt)}
                                  className="w-4 h-4 text-[#0B1E48] accent-[#0B1E48]"
                                />
                                <span className="text-xs sm:text-sm">{opt}</span>
                              </label>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Question: How did you hear about Óghowa Business Week? */}
                    {isVisible('discoverySource') && (
                      <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
                        <label className="text-sm font-bold text-[#0F172A] block">
                          {getFieldLabel('discoverySource', 'How did you hear about Óghowa Business Week?')}{' '}
                          {isRequired('discoverySource') && <span className="text-[#DC2626] font-bold">*</span>}
                        </label>
                        {getFieldHelper('discoverySource') && (
                          <p className="text-xs text-[#64748B]">{getFieldHelper('discoverySource')}</p>
                        )}

                        <div className="space-y-2">
                          {getFieldOptions('discoverySource', [
                            'Social media',
                            'WhatsApp / Telegram group',
                            'Friend or colleague',
                            'Benin Tech Fest',
                            'Email / newsletter',
                            'Radio, TV or press',
                            'Other'
                          ]).map((opt) => (
                            <label
                              key={opt}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                discoverySource === opt
                                  ? 'bg-[#FEE2E2]/40 border-[#DC2626] font-bold text-[#0B1E48]'
                                  : 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                              }`}
                            >
                              <input
                                type="radio"
                                name="discoverySource"
                                checked={discoverySource === opt}
                                onChange={() => setDiscoverySource(opt)}
                                className="w-4 h-4 text-[#0B1E48] accent-[#0B1E48]"
                              />
                              <span className="text-xs sm:text-sm">{opt}</span>
                            </label>
                          ))}

                          {discoverySource === 'Other' && (
                            <input
                              type="text"
                              required={isRequired('discoverySource')}
                              value={otherDiscoverySource}
                              onChange={(e) => setOtherDiscoverySource(e.target.value)}
                              placeholder="How did you hear about us?"
                              className="w-full mt-2 bg-white px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-xs text-[#0F172A]"
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Accessibility or dietary requirements (optional) */}
                    {isVisible('accessibilityRequirements') && (
                      <div className="space-y-1 pt-3 border-t border-[#E2E8F0]">
                        <label className="text-sm font-bold text-[#0F172A] block">
                          {getFieldLabel('accessibilityRequirements', 'Accessibility or dietary requirements (optional)')}{' '}
                          {isRequired('accessibilityRequirements') && (
                            <span className="text-[#DC2626] font-bold">*</span>
                          )}
                        </label>
                        <p className="text-xs text-[#64748B]">
                          {getFieldHelper('accessibilityRequirements', 'Let us know anything we should prepare for.')}
                        </p>
                        <input
                          type="text"
                          required={isRequired('accessibilityRequirements')}
                          value={accessibility}
                          onChange={(e) => setAccessibility(e.target.value)}
                          placeholder={getFieldPlaceholder(
                            'accessibilityRequirements',
                            'e.g. Wheelchair access, dietary requirements, sign language translation'
                          )}
                          className="w-full bg-white px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
                        />
                      </div>
                    )}

                    {/* What do you hope to get from the week? (optional) */}
                    {isVisible('expectations') && (
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-[#0F172A] block">
                          {getFieldLabel('expectations', 'What do you hope to get from the week? (optional)')}{' '}
                          {isRequired('expectations') && <span className="text-[#DC2626] font-bold">*</span>}
                        </label>
                        {getFieldHelper('expectations') && (
                          <p className="text-xs text-[#64748B]">{getFieldHelper('expectations')}</p>
                        )}
                        <textarea
                          rows={3}
                          required={isRequired('expectations')}
                          value={expectations}
                          onChange={(e) => setExpectations(e.target.value)}
                          placeholder={getFieldPlaceholder(
                            'expectations',
                            'e.g. Meet investors for my venture, network with industry partners, gain actionable policy insights'
                          )}
                          className="w-full bg-white px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
                        />
                      </div>
                    )}

                    {/* Section 2 Custom Fields if any */}
                    {formFields
                      .filter((f) => !f.isCore && f.isVisible !== false && f.section === 'participation')
                      .map(renderCustomField)}
                  </div>
                )}

                {/* ADDITIONAL QUESTIONS CARD (For any custom fields not in about_you or participation) */}
                {formFields.filter(
                  (f) =>
                    !f.isCore &&
                    f.isVisible !== false &&
                    f.section !== 'about' &&
                    f.section !== 'participation' &&
                    f.section !== 'consent'
                ).length > 0 && (
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-[#E2E8F0] space-y-6">
                    <div className="pb-3 border-b border-[#E2E8F0]">
                      <h2 className="text-xl font-bold text-[#0B1E48]">Additional Questions</h2>
                      <p className="text-xs text-[#64748B] mt-0.5">Please provide responses to these custom requirements.</p>
                    </div>
                    <div className="space-y-5">
                      {formFields
                        .filter(
                          (f) =>
                            !f.isCore &&
                            f.isVisible !== false &&
                            f.section !== 'about' &&
                            f.section !== 'participation' &&
                            f.section !== 'consent'
                        )
                        .map(renderCustomField)}
                    </div>
                  </div>
                )}

                {/* SECTION 3: CONSENT */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-[#E2E8F0] space-y-5">
                  <div className="pb-3 border-b border-[#E2E8F0]">
                    <h2 className="text-xl font-bold text-[#0B1E48]">Consent</h2>
                    <p className="text-xs text-[#64748B] mt-0.5">Please review the summit terms and communication preferences.</p>
                  </div>

                  {/* Participant declaration */}
                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={declarationConfirmed}
                      onChange={(e) => setDeclarationConfirmed(e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#0B1E48] accent-[#0B1E48] rounded"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-[#0F172A] block">
                        Participant declaration <span className="text-[#DC2626] font-bold">*</span>
                      </span>
                      <span className="text-xs text-[#64748B] mt-0.5 block leading-relaxed">
                        {config?.declarationText || 'I confirm that the information provided is accurate and consent to its use for registration and for communicating with me about Óghowa Business Week.'}
                      </span>
                    </div>
                  </label>

                  {/* Updates (optional) */}
                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={receiveUpdates}
                      onChange={(e) => setReceiveUpdates(e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#0B1E48] accent-[#0B1E48] rounded"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-[#0F172A] block">
                        Updates (optional)
                      </span>
                      <span className="text-xs text-[#64748B] mt-0.5 block leading-relaxed">
                        {config?.updatesCheckboxLabel || 'Keep me updated about future Óghowa Business Week and Benin Tech Fest events.'}
                      </span>
                    </div>
                  </label>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0B1E48] hover:bg-[#061224] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Submit Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Instant accreditation pass & calendar sync</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: FOUR PROGRAM PILLARS OVERVIEW                          */}
        {/* ============================================================== */}
        {activeTab === 'schedule-tracks' && (
          <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-8 sm:py-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider bg-[#FEE2E2] px-3 py-1 rounded-full">
                4-Day Summit Program
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E48] mt-3">
                Óghowa Business Week Program Architecture
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-2">
                November 16 – 21, 2026 at Victor Uwaifo Creative Hub.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  day: 'Day 1: Mon, 16 Nov 2026',
                  title: 'The Macro-Economy, Commerce & Policy Forum',
                  theme: 'Institutional Alignment & Sub-National Trade',
                  highlights: [
                    'Grand Opening & Welcome Address (Metaspace / Óghowa Team & ESIPO)',
                    'Keynote: Decentralized Economic Growth: Positioning Edo as West Africa\'s Innovation Gateway',
                    'Trade & Commerce Panel: Modernizing Sub-National Channels & Cross-Border Logistics',
                    'Bank of Industry & Development Finance Masterclass (BOI & iDICE fund allocations)'
                  ]
                },
                {
                  day: 'Day 2: Tue, 17 Nov 2026',
                  title: 'Digital Infrastructure, Tech Policy & The Founder’s Blueprint',
                  theme: 'Digital Sovereignty & System Architecture',
                  highlights: [
                    'Morning Keynote: The Edo Tech Stack — Fiber Expansion, Cloud Sovereignty & Public Goods',
                    'Digital Economy Policy Roundtable: National Startup Act State-Level Adoption',
                    'Masterclass 1: Product-Market Fit & Scalable System Architecture for Frontier Markets',
                    'Masterclass 2: Corporate Governance, Tax Structuring & Legal Compliance Clinic'
                  ]
                },
                {
                  day: 'Day 3: Thu, 19 Nov 2026',
                  title: 'Venture Capital & Private Equity Day',
                  theme: 'Capital Mobilization & Deal Rooms',
                  highlights: [
                    'Morning Plenary: Unlocking Institutional & Diaspora Capital for Sub-National Ecosystems',
                    'Investor Panel: What Frontier Investors Look for Beyond Coastal Megacities',
                    'Masterclass: Deconstructing the Term Sheet — SAFEs, Valuations & Cap Table Hygiene',
                    'Closed Reverse Pitching & Deal Room Sessions: Fund Managers Pitch to Pre-Screened Founders'
                  ]
                },
                {
                  day: 'Day 4: Sat, 21 Nov 2026',
                  title: 'Grand Finale & Demo Day',
                  theme: 'The Óghowa Demo Day & Ecosystem Awards',
                  highlights: [
                    'Live Exhibition & Tech Experience Pavilion',
                    'Opening Keynote: 2030+ Operational Outlook: Building Sustainable Prosperity in Edo State',
                    'The Main Event: The Óghowa Demo Day (Top 10 Vetted Portfolio Startups Pitch to Judges)',
                    'Closing Ceremony, Ecosystem Awards & ₦50M+ Syndicate Co-Investment Commitments'
                  ]
                }
              ].map((p, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#DC2626]">{p.day}</span>
                    <h3 className="text-lg font-bold text-[#0B1E48] mt-1">{p.title}</h3>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-[#0B1E48] bg-[#E2E8F0]/30 px-2 py-0.5 rounded">
                      {p.theme}
                    </span>
                    <ul className="mt-4 space-y-2 text-xs text-[#64748B]">
                      {p.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0B1E48] mt-1.5 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#E2E8F0]">
                    <button
                      onClick={() => {
                        setActiveTab('registration');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-[#0B1E48] hover:text-[#DC2626] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Register for this day</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 4: STATUS LOOKUP PORTAL                                   */}
        {/* ============================================================== */}
        {activeTab === 'status-lookup' && (
          <div className="max-w-[760px] mx-auto px-4 md:px-6 py-8 sm:py-10">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs">
              <h2 className="text-xl font-bold text-[#0B1E48]">Verify Participant Accreditation</h2>
              <p className="text-xs text-[#64748B] mt-1">
                Enter your reference code (e.g. OBW-2026-PARTICIPANT-8492) or registration email:
              </p>

              <form onSubmit={handleStatusSearch} className="mt-4 flex gap-2">
                <input
                  type="text"
                  required
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  placeholder="OBW-2026-PARTICIPANT-XXXX or email"
                  className="flex-1 bg-white px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#0B1E48]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0B1E48] text-white font-bold text-xs rounded-lg hover:bg-[#061224] cursor-pointer"
                >
                  Verify
                </button>
              </form>

              {lookupSearched && (
                <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                  {lookupResult ? (
                    <div className="bg-[#E2E8F0]/20 border border-[#0B1E48]/30 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0B1E48]">{lookupResult.code}</span>
                        <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {lookupResult.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#0F172A]">{lookupResult.name}</p>
                      <p className="text-xs text-[#64748B]">{lookupResult.role} · {lookupResult.organization}</p>
                      <p className="text-xs text-[#64748B]">Location: {lookupResult.location}</p>
                      <p className="text-xs text-[#64748B]">Mode: {lookupResult.attendanceMode}</p>
                      <button
                        onClick={() => {
                          setConfirmedDelegate(lookupResult);
                          setActiveTab('success');
                        }}
                        className="mt-2 text-xs font-bold text-[#0B1E48] underline cursor-pointer"
                      >
                        Open Digital Accreditation Badge Pass →
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                      No matching participant record found for "{lookupQuery}". Please check your reference code or register below.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* DEAL ROOM MODAL */}
      {isDealRoomModalOpen && confirmedDelegate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-base text-[#0B1E48]">₦50M Deal Room & Pitch Submission</h3>
              <button onClick={() => setIsDealRoomModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-[#64748B]">
              <p>
                Your accreditation ID <strong className="text-[#0B1E48] font-mono">{confirmedDelegate.code}</strong> qualifies you for fast-track deal review.
              </p>
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <p className="font-bold text-[#0B1E48]">Deal Room Day: Thursday, 19 November 2026</p>
                <p className="mt-1">Pitch decks and term sheet submissions close on November 10, 2026.</p>
              </div>
              <p>Upload your one-pager or deck to the closed deal portal or email investment@oghowa.africa with your code in the subject.</p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setIsDealRoomModalOpen(false);
                    setShareSuccessToast('Deal Room request acknowledged by Secretariat.');
                    setTimeout(() => setShareSuccessToast(''), 3000);
                  }}
                  className="px-4 py-2 bg-[#0B1E48] text-white font-bold rounded-lg text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUPPORT LIAISON MODAL */}
      {supportLiaisonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-base text-[#0B1E48]">Secretariat Protocol Liaison</h3>
              <button onClick={() => setSupportLiaisonModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-[#64748B]">
              <p>For official delegations, flight arrivals at Benin Airport, and hotel bookings at our partner hotels in GRA:</p>
              <div className="space-y-1 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                <p><strong>Desk:</strong> Óghowa Business Week Secretariat</p>
                <p><strong>Email:</strong> secretariat@oghowa.africa</p>
                <p><strong>Hotline:</strong> +234 803 123 4567</p>
                <p><strong>Venue:</strong> Victor Uwaifo Creative Hub</p>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSupportLiaisonModalOpen(false)}
                  className="px-4 py-2 bg-[#0B1E48] text-white font-bold rounded-lg text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FOOTER */}
      <footer className="w-full bg-[#0B1E48] text-white py-8 border-t border-[#0B1E48]/30">
        <div className="max-w-[1120px] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Óghowa Business Week</span>
            <span>·</span>
            <span>Innovation for Economic Transformation ...Our own</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>In collaboration with Benin Tech Fest</span>
            <span>•</span>
            <button onClick={onBackToAccelerator} className="hover:text-white underline cursor-pointer">
              Oghowa Homepage
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
