import React, { useState } from 'react';
import {
  Users,
  Search,
  Star,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle,
  X,
  Sparkles,
  MapPin,
  Check,
  Video
} from 'lucide-react';
import { Mentor, Booking } from '../types';
import { MENTORS_LIST } from '../data/mockData';

interface MentorsDirectoryProps {
  onBackToHome: () => void;
}

export const MentorsDirectory: React.FC<MentorsDirectoryProps> = ({ onBackToHome }) => {
  const [mentors, setMentors] = useState<Mentor[]>(MENTORS_LIST);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBookingMentor, setActiveBookingMentor] = useState<Mentor | null>(null);
  const [bookingConfirmation, setBookingConfirmation] = useState<Booking | null>(null);
  const [showApplyAsMentor, setShowApplyAsMentor] = useState<boolean>(false);

  // Booking Form State
  const [bookDate, setBookDate] = useState<string>('Next Tuesday');
  const [bookSlot, setBookSlot] = useState<string>('10:00 AM WAT');
  const [bookTopic, setBookTopic] = useState<string>('Pitch Deck & Fundraising Strategy');
  const [bookFounderName, setBookFounderName] = useState<string>('Osasere Idehen');
  const [bookStartupName, setBookStartupName] = useState<string>('Ogbelekon Tech');
  const [bookNotes, setBookNotes] = useState<string>('We are preparing for our Seed extension round and would appreciate feedback on unit economics.');

  const domains = [
    'All',
    'FinTech',
    'HealthTech',
    'Product & Engineering',
    'Fundraising & VC',
    'Legal & Compliance',
    'Growth & Go-To-Market',
    'Operations'
  ];

  const filteredMentors = mentors.filter((m) => {
    const matchesDomain = selectedDomain === 'All' || m.domain === selectedDomain;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.expertise.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBookingMentor) return;

    const newBooking: Booking = {
      id: `BOK-${Math.floor(1000 + Math.random() * 9000)}`,
      mentorId: activeBookingMentor.id,
      mentorName: activeBookingMentor.name,
      founderName: bookFounderName,
      founderEmail: 'founder@oghowaventures.demo',
      startupName: bookStartupName,
      topic: bookTopic,
      date: bookDate,
      timeSlot: bookSlot,
      notes: bookNotes,
      meetingLink: `https://meet.google.com/ogh-ment-${Math.random().toString(36).substring(2, 7)}`,
      status: 'Confirmed'
    };

    setBookingConfirmation(newBooking);
    setActiveBookingMentor(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>World-Class Operator Network</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1E48] tracking-tight">
            Óghowa Mentor Network
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Get hands-on counsel from exited founders, senior technical architects, institutional investors, and domain specialists who have built at African scale.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowApplyAsMentor(true)}
              className="px-4 py-2 text-xs font-semibold text-[#0B1E48] bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition"
            >
              Apply to Become a Mentor
            </button>
            <span className="text-xs text-slate-500 font-medium">
              Over 500+ founder sessions completed in 2026
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-10 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mentors by name, company (e.g. Paystack, AWS), or skill (e.g. API Architecture, Seed Pitch)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
            />
          </div>

          {/* Domain Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedDomain === dom
                    ? 'bg-[#0B1E48] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>

        {/* Mentors Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-6">
                {/* Mentor Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      loading="lazy"
                      decoding="async"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-slate-100"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" title="Verified Active Mentor" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-[#0B1E48] truncate">
                        {mentor.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{mentor.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-rose-600 truncate mt-0.5">
                      {mentor.role}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {mentor.organization}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {mentor.bio}
                </p>

                {/* Expertise Badges */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {mentor.expertise.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats row */}
                <div className="py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{mentor.location}</span>
                  </span>
                  <span className="font-semibold text-slate-700">
                    {mentor.sessionsCount} sessions
                  </span>
                </div>
              </div>

              {/* Action Button: Book Office Hours */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Slots available this week
                </span>

                <button
                  onClick={() => {
                    setActiveBookingMentor(mentor);
                    setBookSlot(mentor.slots[0] || '10:00 AM WAT');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0B1E48] hover:bg-[#153474] rounded-lg shadow-xs transition cursor-pointer"
                >
                  Book 1-on-1 Office Hours
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No mentors match your search criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDomain('All'); }}
              className="mt-3 text-xs font-semibold text-rose-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* MODAL 1: BOOK OFFICE HOURS */}
      {activeBookingMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
            {/* Header */}
            <div className="bg-[#0B1E48] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeBookingMentor.avatar}
                  alt={activeBookingMentor.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/20"
                />
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Book Session with {activeBookingMentor.name}
                  </h3>
                  <p className="text-xs text-rose-300 font-medium">
                    {activeBookingMentor.role} · {activeBookingMentor.organization}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveBookingMentor(null)}
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Founder Name & Startup
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={bookFounderName}
                    onChange={(e) => setBookFounderName(e.target.value)}
                    placeholder="Your Name"
                    className="px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                  <input
                    type="text"
                    required
                    value={bookStartupName}
                    onChange={(e) => setBookStartupName(e.target.value)}
                    placeholder="Startup Name"
                    className="px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Session Topic & Focus Area
                </label>
                <select
                  value={bookTopic}
                  onChange={(e) => setBookTopic(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                >
                  <option>Pitch Deck & Fundraising Strategy</option>
                  <option>Technical Architecture & Cloud Scaling</option>
                  <option>Go-To-Market & B2B Pilot Acquisition</option>
                  <option>Legal Structuring, IP & SAFE Terms</option>
                  <option>Product Roadmapping & Design Sprint</option>
                  <option>Edo / West Africa Market Access</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Available Day
                  </label>
                  <select
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  >
                    {activeBookingMentor.availableDays.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Time Slot
                  </label>
                  <select
                    value={bookSlot}
                    onChange={(e) => setBookSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  >
                    {activeBookingMentor.slots.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Context / Questions for the Mentor
                </label>
                <textarea
                  rows={3}
                  required
                  value={bookNotes}
                  onChange={(e) => setBookNotes(e.target.value)}
                  placeholder="Share 2-3 specific questions you need help answering during this 30-min office hour..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sponsored by Óghowa Accelerator · 100% Free for African Founders</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveBookingMentor(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition"
                >
                  Confirm & Schedule Call
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG */}
      {bookingConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center border border-slate-100">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50/50">
              <Video className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-[#0B1E48] mb-1">
              Office Hours Confirmed!
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Your mentorship consultation with <span className="font-semibold text-slate-800">{bookingConfirmation.mentorName}</span> has been confirmed.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left space-y-2 mb-5">
              <p><span className="text-slate-400">Date & Slot:</span> <span className="font-semibold text-slate-800">{bookingConfirmation.date} at {bookingConfirmation.timeSlot}</span></p>
              <p><span className="text-slate-400">Topic:</span> <span className="font-semibold text-slate-800">{bookingConfirmation.topic}</span></p>
              <p><span className="text-slate-400">Meeting Link:</span> <span className="font-mono text-blue-600 font-semibold">{bookingConfirmation.meetingLink}</span></p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert("Calendar invite file (.ics) downloaded! Added to Google Calendar.");
                  setBookingConfirmation(null);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-[#0B1E48] hover:bg-[#153474] rounded-lg transition"
              >
                Add to Calendar
              </button>
              <button
                onClick={() => setBookingConfirmation(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: APPLY AS MENTOR */}
      {showApplyAsMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
            <button
              onClick={() => setShowApplyAsMentor(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-rose-600" />
              <h3 className="text-xl font-bold text-[#0B1E48]">Join Óghowa as a Mentor</h3>
            </div>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Give back to Africa's emerging founders, scout early angel deals, and help build regional venture champions.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for your interest! The Óghowa Venture Team will review your profile and reach out within 48 hours.");
                setShowApplyAsMentor(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input required placeholder="Your Name" className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Company & Title</label>
                <input required placeholder="e.g. VP of Product at Moniepoint" className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">LinkedIn Profile</label>
                <input required type="url" placeholder="https://linkedin.com/in/..." className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Domain Expertise</label>
                <select className="w-full px-3 py-2 rounded-lg border border-slate-300">
                  <option>FinTech & Payments</option>
                  <option>Software Architecture & AI</option>
                  <option>Fundraising & Cap Tables</option>
                  <option>HealthTech & Regulatory</option>
                  <option>Enterprise Sales & Growth</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Estimated Commitment</label>
                <select className="w-full px-3 py-2 rounded-lg border border-slate-300">
                  <option>1 hour per month (2 founder sessions)</option>
                  <option>2 hours per month (4 founder sessions)</option>
                  <option>Venture Studio Resident Advisor</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowApplyAsMentor(false)}
                  className="px-4 py-2 font-medium text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
                >
                  Submit Mentor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
