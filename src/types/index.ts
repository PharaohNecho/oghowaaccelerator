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
  websiteUrl?: string;
  isDisplayed?: boolean;
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
  subject: string;
  type: 'Registration' | 'Status Update' | 'Event Ticket' | 'Information Request';
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

