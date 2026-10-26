export interface Mentor {
  id: string;
  name: string;
  role: string;
  organization: string;
  previousRoles?: string;
  avatar: string;
  bio: string;
  domain: 'FinTech' | 'HealthTech' | 'EdTech' | 'Product & Engineering' | 'Fundraising & VC' | 'Legal & Compliance' | 'Growth & Go-To-Market' | 'Operations';
  expertise: string[];
  location: string;
  sessionsCount: number;
  rating: number;
  availableDays: string[];
  slots: string[];
  linkedinUrl: string;
  featured?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: 'Press Release' | 'Venture Spotlight' | 'Ecosystem News' | 'Program Updates' | 'Research & Insights';
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  summary: string;
  content: string[];
  coverImage: string;
  tags: string[];
  featured?: boolean;
}

export interface Venture {
  id: string;
  name: string;
  sector: string;
  tagline: string;
  description: string;
  founder: string;
  metrics: {
    label: string;
    value: string;
  }[];
  cohort: string;
  websiteUrl?: string;
  stage: 'Idea' | 'Incubation' | 'Accelerated' | 'Scaling' | 'Upcoming';
  logoText: string;
  badgeColor: string;
  highlights: string[];
  isDisplayed?: boolean;
}

export interface PartnerItem {
  id: string;
  name: string;
  category: string;
  logo: string;
  logoUrl?: string;
  websiteUrl?: string;
  isDisplayed?: boolean;
}

export interface SmtpSettings {
  senderEmail: string;
  incomingServer: string;
  imapPort: number;
  pop3Port: number;
  outgoingServer: string;
  smtpPort: number;
  useSsl: boolean;
  status: 'Connected' | 'Ready';
  lastTestedAt?: string;
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  eventDate: string;
  location: string;
  badge: string;
  imageUrl: string;
  registerLink: string;
  seatsAvailable?: number;
  isDisplayed: boolean;
  order: number;
}

export interface ApplicationSubmission {
  id: string;
  startupName: string;
  sector: string;
  stage: string;
  founderName: string;
  email: string;
  phone: string;
  city: string;
  summary: string;
  traction: string;
  deckName?: string;
  status: 'Under Review' | 'Screening' | 'Pitch Evaluation' | 'Interview Scheduled' | 'Accepted' | 'Declined';
  submittedAt: string;
  cohort: string;
  programTrack: string;
  reviewerNotes?: string;
}

export interface EmailNotification {
  id: string;
  recipient: string;
  recipientName: string;
  sender?: string;
  smtpServer?: string;
  subject: string;
  type: 'Registration' | 'Status Update' | 'Event Ticket' | 'Information Request' | 'Broadcast' | 'Accreditation';
  timestamp: string;
  content: string;
  statusBadge?: string;
  read?: boolean;
}

export interface Booking {
  id: string;
  mentorId: string;
  mentorName: string;
  founderName: string;
  founderEmail: string;
  startupName: string;
  topic: string;
  date: string;
  timeSlot: string;
  notes: string;
  meetingLink: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface SummitTrack {
  id: string;
  tag: string;
  title: string;
  desc: string;
  isDisplayed: boolean;
}

export interface SummitSpeaker {
  id: string;
  name: string;
  role: string;
  topic: string;
  image: string;
  isDisplayed: boolean;
}

export interface SummitScheduleItem {
  time: string;
  title: string;
  speaker: string;
}

export interface SummitDaySchedule {
  day: number;
  title: string;
  date: string;
  theme: string;
  events: SummitScheduleItem[];
}

export interface RegisteredDelegate {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  country?: string;
  state?: string;
  city?: string;
  location: string;
  persona: string;
  otherPersona?: string;
  tracks: string[];
  interests?: string[];
  masterclass?: string;
  attendanceMode: string;
  exhibitSponsorInterest?: string;
  discoverySource?: string;
  otherDiscoverySource?: string;
  accessibilityRequirements?: string;
  expectations?: string;
  declarationConfirmed?: boolean;
  receiveUpdates?: boolean;
  registeredAt: string;
  status: 'Accreditation Issued' | 'Fast-Track VIP' | 'Pending Verification' | 'Declined';
  dealRoomInterest?: boolean;
}

export interface BusinessWeekConfig {
  summitTitle: string;
  dates: string;
  venueName: string;
  venueAddress: string;
  dealFundAmount: string;
  expectedDelegates: string;
  capacityWindowText: string;
  isRegistrationOpen: boolean;
  tracks: SummitTrack[];
  speakers: SummitSpeaker[];
  schedule: SummitDaySchedule[];
  delegates: RegisteredDelegate[];
}

