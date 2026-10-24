import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Sparkles, X, Check, Ticket, User, Mail, Building, ArrowRight, ShieldCheck } from 'lucide-react';
import { EmailNotification, BusinessWeekConfig } from '../types';

interface EventCountdownProps {
  onTicketReserved?: (email: EmailNotification) => void;
  onOpenBusinessWeek?: () => void;
  onRegisterForBusinessWeek?: () => void;
  config?: BusinessWeekConfig;
}

// Target Date: November 16, 2026 at 09:00:00 WAT (UTC+1)
const SUMMIT_START_TIME = new Date('2026-11-16T09:00:00+01:00').getTime();
const TOTAL_PHYSICAL_SEATS = 500;

export const EventCountdown: React.FC<EventCountdownProps> = ({
  onTicketReserved,
  onOpenBusinessWeek,
  onRegisterForBusinessWeek,
  config
}) => {
  const [isSeatModalOpen, setIsSeatModalOpen] = useState<boolean>(false);
  const [seatReserved, setSeatReserved] = useState<boolean>(false);
  const [attendeeName, setAttendeeName] = useState<string>('');
  const [attendeeEmail, setAttendeeEmail] = useState<string>('');
  const [attendeeOrg, setAttendeeOrg] = useState<string>('');
  const [additionalReservedCount, setAdditionalReservedCount] = useState<number>(0);

  // Live Vacant Seats calculation
  const totalRegistered = 342 + (config?.delegates?.length || 0) + additionalReservedCount;
  const vacantSeats = Math.max(0, TOTAL_PHYSICAL_SEATS - totalRegistered);

  // Accurate Real-Time Countdown Timer Engine
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
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSeatRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (vacantSeats > 0) {
      setAdditionalReservedCount((prev) => prev + 1);
      setSeatReserved(true);

      const ticketEmail: EmailNotification = {
        id: `EML-${Math.floor(1000 + Math.random() * 9000)}`,
        recipient: attendeeEmail || 'innovator@venture.africa',
        recipientName: attendeeName || 'Founder / Attendee',
        subject: 'Confirmed: Your Participant Pass to Óghowa Business Week 2026',
        type: 'Event Ticket',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
        content: `Dear ${attendeeName || 'Innovator'},\n\nYour seat for Óghowa Business Week 2026 is officially confirmed!\n\nTheme: Innovation for Economic Transformation\nDates: November 16 – 21, 2026\nVenue: Victor Uwaifo Creative Hub & Edo Innovates Campus, Benin City\nCredential ID: OBW-2026-${Math.floor(100000 + Math.random() * 900000)}\nOrganization: ${attendeeOrg || 'Independent'}\n\nPlease present this email confirmation or your mobile badge at the registration desk for instant accreditation.`
      };

      if (onTicketReserved) {
        onTicketReserved(ticketEmail);
      }
    }
  };

  return (
    <section id="events" className="bg-[#0B1E3D] text-white py-12 sm:py-16 border-y border-slate-800 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-[#0E2854] via-[#102F64] to-[#14366E] rounded-2xl p-6 sm:p-8 lg:p-10 border border-blue-400/25 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Event Details */}
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase mb-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Óghowa Business Week 2026</span>
            </div>

            <h3
              onClick={onOpenBusinessWeek}
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight ${
                onOpenBusinessWeek ? 'cursor-pointer hover:text-blue-200 transition-colors' : ''
              }`}
            >
              Óghowa Business Week
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              Under the theme <strong className="text-white">"Innovation for Economic Transformation"</strong>, in collaboration with Benin Tech Fest. Join founders, investors, business leaders, and innovators for keynotes, masterclasses, startup pitches, and high-impact networking in Edo State.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-semibold">
              <span className="bg-blue-900/70 px-3 py-1.5 rounded-md border border-blue-400/25 flex items-center gap-1.5 text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Benin City, Edo State</span>
              </span>

              <span className="bg-rose-950/70 text-rose-300 px-3 py-1.5 rounded-md border border-rose-500/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                <span>Only <strong className="text-white font-extrabold">{vacantSeats}</strong> vacant physical seats remaining (out of {TOTAL_PHYSICAL_SEATS} capacity)!</span>
              </span>
            </div>
          </div>

          {/* Real-time Accurate Ticking Countdown & Pass Reservation */}
          <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
              <div className="bg-[#07152B] px-3 sm:px-4 py-3 rounded-xl border border-slate-700/80 min-w-[68px] sm:min-w-[76px] shadow-inner">
                <span className="block text-2xl sm:text-3xl font-black text-white font-mono">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Days</span>
              </div>

              <div className="bg-[#07152B] px-3 sm:px-4 py-3 rounded-xl border border-slate-700/80 min-w-[68px] sm:min-w-[76px] shadow-inner">
                <span className="block text-2xl sm:text-3xl font-black text-white font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hours</span>
              </div>

              <div className="bg-[#07152B] px-3 sm:px-4 py-3 rounded-xl border border-slate-700/80 min-w-[68px] sm:min-w-[76px] shadow-inner">
                <span className="block text-2xl sm:text-3xl font-black text-white font-mono">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mins</span>
              </div>

              <div className="bg-[#07152B] px-3 sm:px-4 py-3 rounded-xl border border-slate-700/80 min-w-[68px] sm:min-w-[76px] shadow-inner">
                <span className="block text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Secs</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              {onOpenBusinessWeek && (
                <button
                  onClick={onOpenBusinessWeek}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs bg-white text-[#0B1E48] hover:bg-slate-100 active:scale-98 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Summit Page</span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </button>
              )}

              <button
                onClick={() => {
                  if (onRegisterForBusinessWeek) {
                    onRegisterForBusinessWeek();
                  } else {
                    setSeatReserved(false);
                    setIsSeatModalOpen(true);
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 active:scale-98 text-white shadow-lg shadow-rose-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>Register for Pass</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TICKET RESERVATION MODAL */}
      {isSeatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-slate-900 border border-slate-100">
            <button
              onClick={() => setIsSeatModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!seatReserved ? (
              <form onSubmit={handleSeatRegistration} className="space-y-4">
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2 ring-4 ring-rose-50">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Live Participant Registration</span>
                  <h3 className="text-xl font-black text-[#0B1E48] mt-1">
                    Reserve Your Business Week Pass
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Only <strong className="text-rose-600">{vacantSeats}</strong> physical seats remaining out of {TOTAL_PHYSICAL_SEATS} capacity.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      className="w-full text-xs pl-9 pr-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                      placeholder="e.g. Osasere Idehen"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                      placeholder="founder@venture.africa"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Startup / Organization *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={attendeeOrg}
                      onChange={(e) => setAttendeeOrg(e.target.value)}
                      className="w-full text-xs pl-9 pr-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                      placeholder="e.g. Independent or Tech Startup"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-500">
                  Includes full access to the 4-day program: Policy Forum, The Founder's Blueprint, VC Day, and Grand Finale Demo Day.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-lg text-xs font-bold shadow-md transition cursor-pointer"
                >
                  Confirm Instant Pass & Dispatch Ticket
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black text-[#0B1E48]">Pass Confirmed & Dispatched!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your event credential has been dispatched to{' '}
                  <strong className="text-slate-900">{attendeeEmail || 'your email'}</strong>. Live vacant physical seats remaining:{' '}
                  <strong className="text-rose-600">{vacantSeats}</strong>.
                </p>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-left text-xs text-blue-900 space-y-1">
                  <p className="font-bold">Next Steps:</p>
                  <p>Check the automated email dispatched to your inbox with your credential ID and accreditation barcode.</p>
                </div>

                <button
                  onClick={() => {
                    setIsSeatModalOpen(false);
                    setSeatReserved(false);
                  }}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
