import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Layers,
  Users,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Check,
  Save,
  RotateCcw,
  ExternalLink,
  Tag,
  Building,
  Award
} from 'lucide-react';
import { BusinessWeekConfig, SummitTrack, SummitSpeaker, SummitScheduleItem } from '../types';

interface SuperadminSummitManagerProps {
  config: BusinessWeekConfig;
  onUpdateConfig: (updated: BusinessWeekConfig) => void;
  onPreviewSummit?: () => void;
}

export const SuperadminSummitManager: React.FC<SuperadminSummitManagerProps> = ({
  config,
  onUpdateConfig,
  onPreviewSummit
}) => {
  // Sub-tabs: 'settings' | 'tracks' | 'speakers' | 'schedule'
  const [subTab, setSubTab] = useState<'settings' | 'tracks' | 'speakers' | 'schedule'>('settings');

  // Core Summit Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    summitTitle: config.summitTitle || 'Óghowa Business Week 2026',
    dates: config.dates || 'October 24 – 28, 2026',
    venueName: config.venueName || 'Victor Uwaifo Creative Hub & Edo Innovates Campus',
    venueAddress: config.venueAddress || 'Airport Road, GRA, Benin City, Edo State, Nigeria',
    dealFundAmount: config.dealFundAmount || '₦50,000,000',
    expectedDelegates: config.expectedDelegates || '2,500+'
  });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Track Edit / Add State
  const [editingTrack, setEditingTrack] = useState<SummitTrack | null>(null);
  const [isNewTrack, setIsNewTrack] = useState<boolean>(false);
  const [trackForm, setTrackForm] = useState<Partial<SummitTrack>>({});

  // Speaker Edit / Add State
  const [editingSpeaker, setEditingSpeaker] = useState<SummitSpeaker | null>(null);
  const [isNewSpeaker, setIsNewSpeaker] = useState<boolean>(false);
  const [speakerForm, setSpeakerForm] = useState<Partial<SummitSpeaker>>({});

  // Schedule Management State
  const [activeDay, setActiveDay] = useState<number>(1);
  const [editingEvent, setEditingEvent] = useState<{ day: number; index: number; event: SummitScheduleItem } | null>(null);
  const [isNewEvent, setIsNewEvent] = useState<boolean>(false);
  const [eventForm, setEventForm] = useState<SummitScheduleItem>({ time: '10:00 AM', title: '', speaker: '' });

  // Handle saving core settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      ...config,
      summitTitle: settingsForm.summitTitle,
      dates: settingsForm.dates,
      venueName: settingsForm.venueName,
      venueAddress: settingsForm.venueAddress,
      dealFundAmount: settingsForm.dealFundAmount,
      expectedDelegates: settingsForm.expectedDelegates
    });
    setSaveSuccessMsg('Summit settings updated successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Track Handlers
  const handleToggleTrackDisplay = (trackId: string) => {
    const updatedTracks = config.tracks.map((t) =>
      t.id === trackId ? { ...t, isDisplayed: t.isDisplayed === false ? true : false } : t
    );
    onUpdateConfig({ ...config, tracks: updatedTracks });
  };

  const handleDeleteTrack = (trackId: string) => {
    if (window.confirm('Are you sure you want to delete this thematic track?')) {
      const updatedTracks = config.tracks.filter((t) => t.id !== trackId);
      onUpdateConfig({ ...config, tracks: updatedTracks });
    }
  };

  const handleOpenAddTrack = () => {
    setIsNewTrack(true);
    setEditingTrack({ id: `track-${Date.now()}`, tag: `Track 0${config.tracks.length + 1}`, title: '', desc: '', isDisplayed: true });
    setTrackForm({
      id: `track-${Date.now()}`,
      tag: `Track 0${config.tracks.length + 1}`,
      title: '',
      desc: '',
      isDisplayed: true
    });
  };

  const handleOpenEditTrack = (track: SummitTrack) => {
    setIsNewTrack(false);
    setEditingTrack(track);
    setTrackForm({ ...track });
  };

  const handleSaveTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackForm.title) {
      alert('Track title is required');
      return;
    }
    const finalTrack: SummitTrack = {
      id: trackForm.id || `track-${Date.now()}`,
      tag: trackForm.tag || 'Track',
      title: trackForm.title || 'Untitled Track',
      desc: trackForm.desc || '',
      isDisplayed: trackForm.isDisplayed !== false
    };

    let updatedTracks: SummitTrack[];
    if (isNewTrack) {
      updatedTracks = [...config.tracks, finalTrack];
    } else {
      updatedTracks = config.tracks.map((t) => (t.id === finalTrack.id ? finalTrack : t));
    }
    onUpdateConfig({ ...config, tracks: updatedTracks });
    setEditingTrack(null);
  };

  // Speaker Handlers
  const handleToggleSpeakerDisplay = (speakerId: string) => {
    const updatedSpeakers = config.speakers.map((s) =>
      s.id === speakerId ? { ...s, isDisplayed: s.isDisplayed === false ? true : false } : s
    );
    onUpdateConfig({ ...config, speakers: updatedSpeakers });
  };

  const handleDeleteSpeaker = (speakerId: string) => {
    if (window.confirm('Are you sure you want to remove this keynote speaker?')) {
      const updatedSpeakers = config.speakers.filter((s) => s.id !== speakerId);
      onUpdateConfig({ ...config, speakers: updatedSpeakers });
    }
  };

  const handleOpenAddSpeaker = () => {
    setIsNewSpeaker(true);
    setEditingSpeaker({ id: `spk-${Date.now()}`, name: '', role: '', topic: '', image: '', isDisplayed: true });
    setSpeakerForm({
      id: `spk-${Date.now()}`,
      name: '',
      role: '',
      topic: '',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isDisplayed: true
    });
  };

  const handleOpenEditSpeaker = (speaker: SummitSpeaker) => {
    setIsNewSpeaker(false);
    setEditingSpeaker(speaker);
    setSpeakerForm({ ...speaker });
  };

  const handleSaveSpeaker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!speakerForm.name) {
      alert('Speaker name is required');
      return;
    }
    const finalSpeaker: SummitSpeaker = {
      id: speakerForm.id || `spk-${Date.now()}`,
      name: speakerForm.name || 'Untitled Speaker',
      role: speakerForm.role || '',
      topic: speakerForm.topic || '',
      image: speakerForm.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      isDisplayed: speakerForm.isDisplayed !== false
    };

    let updatedSpeakers: SummitSpeaker[];
    if (isNewSpeaker) {
      updatedSpeakers = [...config.speakers, finalSpeaker];
    } else {
      updatedSpeakers = config.speakers.map((s) => (s.id === finalSpeaker.id ? finalSpeaker : s));
    }
    onUpdateConfig({ ...config, speakers: updatedSpeakers });
    setEditingSpeaker(null);
  };

  // Schedule Event Handlers
  const handleOpenAddEvent = (dayNumber: number) => {
    setIsNewEvent(true);
    setEditingEvent({ day: dayNumber, index: -1, event: { time: '10:00 AM', title: '', speaker: '' } });
    setEventForm({ time: '10:00 AM', title: '', speaker: '' });
  };

  const handleOpenEditEvent = (dayNumber: number, index: number, event: SummitScheduleItem) => {
    setIsNewEvent(false);
    setEditingEvent({ day: dayNumber, index, event });
    setEventForm({ ...event });
  };

  const handleDeleteEvent = (dayNumber: number, index: number) => {
    if (window.confirm('Delete this session from the schedule?')) {
      const updatedSchedule = config.schedule.map((daySchedule) => {
        if (daySchedule.day === dayNumber) {
          const updatedEvents = [...daySchedule.events];
          updatedEvents.splice(index, 1);
          return { ...daySchedule, events: updatedEvents };
        }
        return daySchedule;
      });
      onUpdateConfig({ ...config, schedule: updatedSchedule });
    }
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title) {
      alert('Session title is required');
      return;
    }

    const updatedSchedule = config.schedule.map((daySchedule) => {
      if (daySchedule.day === activeDay) {
        let updatedEvents = [...daySchedule.events];
        if (isNewEvent) {
          updatedEvents.push({ ...eventForm });
        } else if (editingEvent && editingEvent.index >= 0) {
          updatedEvents[editingEvent.index] = { ...eventForm };
        }
        return { ...daySchedule, events: updatedEvents };
      }
      return daySchedule;
    });

    onUpdateConfig({ ...config, schedule: updatedSchedule });
    setEditingEvent(null);
  };

  const currentDaySchedule = config.schedule.find((d) => d.day === activeDay) || config.schedule[0];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Summit Summary */}
      <div className="bg-[#00231b] text-white p-6 rounded-2xl shadow-md border border-[#316858]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#FEF3C7] font-bold block mb-1">
            Óghowa Business Week — Dedicated Summit Control
          </span>
          <h2 className="text-xl sm:text-2xl font-black">{config.summitTitle}</h2>
          <p className="text-xs text-[#d1dfdb] mt-1">
            {config.dates} • {config.venueName} • ₦50M Syndicate Room
          </p>
        </div>

        {onPreviewSummit && (
          <button
            onClick={onPreviewSummit}
            className="px-4 py-2 bg-[#FEF3C7] hover:bg-white text-[#00231b] font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
          >
            <span>Live Summit Page Preview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setSubTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            subTab === 'settings'
              ? 'bg-[#00231b] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Summit Identity & Deal Fund</span>
        </button>

        <button
          onClick={() => setSubTab('tracks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            subTab === 'tracks'
              ? 'bg-[#00231b] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Thematic Tracks ({config.tracks.length})</span>
        </button>

        <button
          onClick={() => setSubTab('speakers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            subTab === 'speakers'
              ? 'bg-[#00231b] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Keynote Speakers ({config.speakers.length})</span>
        </button>

        <button
          onClick={() => setSubTab('schedule')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            subTab === 'schedule'
              ? 'bg-[#00231b] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>5-Day Agenda & Sessions</span>
        </button>
      </div>

      {/* ================= SUB-TAB 1: SUMMIT IDENTITY & VENUE ================= */}
      {subTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0B1E48]">Summit Identity, Deal Fund & Venue</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Changes made here reflect in real-time across the Óghowa Business Week landing and registration pages.
              </p>
            </div>
            {saveSuccessMsg && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                {saveSuccessMsg}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Summit Official Title
                </label>
                <input
                  type="text"
                  value={settingsForm.summitTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, summitTitle: e.target.value })}
                  placeholder="Óghowa Business Week 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#00231b] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Summit Dates
                </label>
                <input
                  type="text"
                  value={settingsForm.dates}
                  onChange={(e) => setSettingsForm({ ...settingsForm, dates: e.target.value })}
                  placeholder="October 24 – 28, 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#00231b] focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Deal Room Fund Amount
                </label>
                <input
                  type="text"
                  value={settingsForm.dealFundAmount}
                  onChange={(e) => setSettingsForm({ ...settingsForm, dealFundAmount: e.target.value })}
                  placeholder="₦50,000,000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-amber-700 focus:ring-2 focus:ring-[#00231b] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Expected Delegates
                </label>
                <input
                  type="text"
                  value={settingsForm.expectedDelegates}
                  onChange={(e) => setSettingsForm({ ...settingsForm, expectedDelegates: e.target.value })}
                  placeholder="2,500+"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#00231b] focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={settingsForm.venueName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, venueName: e.target.value })}
                  placeholder="Victor Uwaifo Creative Hub & Edo Innovates Campus"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#00231b] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Venue Physical Address
                </label>
                <input
                  type="text"
                  value={settingsForm.venueAddress}
                  onChange={(e) => setSettingsForm({ ...settingsForm, venueAddress: e.target.value })}
                  placeholder="Airport Road, GRA, Benin City, Edo State, Nigeria"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#00231b] focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#FEF3C7]" />
                <span>Save Summit Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= SUB-TAB 2: THEMATIC TRACKS ================= */}
      {subTab === 'tracks' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#0B1E48]">Thematic Tracks Management</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Toggle track visibility or edit title and curriculum focus for the 2026 summit.
              </p>
            </div>

            <button
              onClick={handleOpenAddTrack}
              className="px-4 py-2 text-xs font-bold text-white bg-[#00231b] hover:bg-[#0e3a2f] rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#FEF3C7]" />
              <span>Add New Track</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {config.tracks.map((track) => (
              <div
                key={track.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                  track.isDisplayed !== false
                    ? 'border-slate-200'
                    : 'border-dashed border-slate-300 opacity-60 bg-slate-50/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#B45309] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">
                      {track.tag}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        track.isDisplayed !== false
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {track.isDisplayed !== false ? 'Live on Summit' : 'Hidden'}
                    </span>
                  </div>

                  <h4 className="font-bold text-[#00231b] text-base mb-1.5">{track.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{track.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleTrackDisplay(track.id)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    title={track.isDisplayed !== false ? 'Hide from public site' : 'Make visible on public site'}
                  >
                    {track.isDisplayed !== false ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Show</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditTrack(track)}
                      className="p-1.5 text-slate-500 hover:text-[#00231b] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="Edit Track"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTrack(track.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete Track"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: KEYNOTE SPEAKERS ================= */}
      {subTab === 'speakers' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#0B1E48]">Keynote Speakers & Faculty</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage keynote faculty profiles, headshot images, and presentation topics.
              </p>
            </div>

            <button
              onClick={handleOpenAddSpeaker}
              className="px-4 py-2 text-xs font-bold text-white bg-[#00231b] hover:bg-[#0e3a2f] rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#FEF3C7]" />
              <span>Add Speaker</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {config.speakers.map((speaker) => (
              <div
                key={speaker.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-xs flex flex-col justify-between transition-all ${
                  speaker.isDisplayed !== false
                    ? 'border-slate-200'
                    : 'border-dashed border-slate-300 opacity-60 bg-slate-50/70'
                }`}
              >
                <div>
                  <div className="relative h-44 bg-slate-200 overflow-hidden">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs ${
                          speaker.isDisplayed !== false
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        {speaker.isDisplayed !== false ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h4 className="font-bold text-[#00231b] text-base">{speaker.name}</h4>
                    <p className="text-[11px] font-semibold text-[#B45309] leading-tight">{speaker.role}</p>
                    <p className="text-xs text-slate-600 italic line-clamp-2 mt-2">"{speaker.topic}"</p>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleSpeakerDisplay(speaker.id)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    {speaker.isDisplayed !== false ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Show</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditSpeaker(speaker)}
                      className="p-1.5 text-slate-500 hover:text-[#00231b] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="Edit Speaker"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSpeaker(speaker.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete Speaker"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 4: 5-DAY AGENDA & SCHEDULE ================= */}
      {subTab === 'schedule' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#0B1E48]">5-Day Summit Agenda Control</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize session times, plenary keynotes, and breakout workshops across all five days.
              </p>
            </div>

            <button
              onClick={() => handleOpenAddEvent(activeDay)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#00231b] hover:bg-[#0e3a2f] rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#FEF3C7]" />
              <span>Add Session to Day {activeDay}</span>
            </button>
          </div>

          {/* Day Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {config.schedule.map((dayItem) => (
              <button
                key={dayItem.day}
                onClick={() => setActiveDay(dayItem.day)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeDay === dayItem.day
                    ? 'bg-[#00231b] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <span>Day {dayItem.day}</span>
                <span className="opacity-80 text-[10px] ml-1.5 font-normal">
                  ({dayItem.events.length} sessions)
                </span>
              </button>
            ))}
          </div>

          {/* Active Day Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
              <div>
                <span className="text-[11px] font-bold text-[#B45309] uppercase tracking-wider">
                  {currentDaySchedule.date}
                </span>
                <h4 className="text-lg font-bold text-[#00231b]">{currentDaySchedule.title}</h4>
              </div>
              <span className="px-3 py-1 bg-[#FEF3C7] text-[#B45309] text-xs font-bold rounded-full self-start sm:self-center">
                {currentDaySchedule.theme}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {currentDaySchedule.events.map((evt, idx) => (
                <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="sm:w-32 shrink-0">
                    <span className="font-mono text-xs font-bold text-[#00231b] bg-slate-100 px-2 py-1 rounded">
                      {evt.time}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h5 className="text-sm font-bold text-slate-800">{evt.title}</h5>
                    <p className="text-xs text-slate-500">Led by: <strong className="text-slate-700">{evt.speaker}</strong></p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                    <button
                      onClick={() => handleOpenEditEvent(activeDay, idx, evt)}
                      className="p-1.5 text-slate-500 hover:text-[#00231b] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="Edit Session"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(activeDay, idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete Session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* 1. Track Edit Modal */}
      {editingTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-[#0B1E48] mb-4">
              {isNewTrack ? 'Add New Thematic Track' : 'Edit Thematic Track'}
            </h3>
            <form onSubmit={handleSaveTrack} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Track Tag / Code</label>
                <input
                  type="text"
                  value={trackForm.tag || ''}
                  onChange={(e) => setTrackForm({ ...trackForm, tag: e.target.value })}
                  placeholder="Track 01"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Track Title</label>
                <input
                  type="text"
                  value={trackForm.title || ''}
                  onChange={(e) => setTrackForm({ ...trackForm, title: e.target.value })}
                  placeholder="Digital Economy & Software Ecosystem"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description / Focus Areas</label>
                <textarea
                  rows={3}
                  value={trackForm.desc || ''}
                  onChange={(e) => setTrackForm({ ...trackForm, desc: e.target.value })}
                  placeholder="Brief description of debates, keynotes, and commercial opportunities in this track."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="trackDisplayCheck"
                  checked={trackForm.isDisplayed !== false}
                  onChange={(e) => setTrackForm({ ...trackForm, isDisplayed: e.target.checked })}
                  className="w-4 h-4 text-[#00231b] rounded"
                />
                <label htmlFor="trackDisplayCheck" className="text-slate-800 font-bold">
                  Make visible on Óghowa Business Week landing page
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTrack(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Speaker Edit Modal */}
      {editingSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-[#0B1E48] mb-4">
              {isNewSpeaker ? 'Add Keynote Speaker' : 'Edit Keynote Speaker'}
            </h3>
            <form onSubmit={handleSaveSpeaker} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Speaker Full Name</label>
                <input
                  type="text"
                  value={speakerForm.name || ''}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, name: e.target.value })}
                  placeholder="Dr. Aisosa Edebiri"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Role & Organization</label>
                <input
                  type="text"
                  value={speakerForm.role || ''}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, role: e.target.value })}
                  placeholder="Managing Partner, Sahara Frontier Capital"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Session Keynote Topic</label>
                <input
                  type="text"
                  value={speakerForm.topic || ''}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, topic: e.target.value })}
                  placeholder="Sub-National Venture Economics & Early-Stage Syndicates"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Photo Image URL</label>
                <input
                  type="url"
                  value={speakerForm.image || ''}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="speakerDisplayCheck"
                  checked={speakerForm.isDisplayed !== false}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, isDisplayed: e.target.checked })}
                  className="w-4 h-4 text-[#00231b] rounded"
                />
                <label htmlFor="speakerDisplayCheck" className="text-slate-800 font-bold">
                  Display in Faculty & Speakers lineup
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSpeaker(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Speaker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Schedule Session Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-[#0B1E48] mb-4">
              {isNewEvent ? `Add Session to Day ${activeDay}` : `Edit Day ${activeDay} Session`}
            </h3>
            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Session Time Slot</label>
                <input
                  type="text"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  placeholder="10:00 AM"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Session Title</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="Keynote: Building Africa's Next Innovation Corridor"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Led By / Speaker</label>
                <input
                  type="text"
                  value={eventForm.speaker}
                  onChange={(e) => setEventForm({ ...eventForm, speaker: e.target.value })}
                  placeholder="Edo State Innovation Council & Guests"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
