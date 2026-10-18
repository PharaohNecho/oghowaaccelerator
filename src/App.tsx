import React, { useState, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EventCountdown } from './components/EventCountdown';
import { WhoWeServe } from './components/WhoWeServe';
import { Journey } from './components/Journey';
import { FlagshipPlatforms } from './components/FlagshipPlatforms';
import { Infrastructure } from './components/Infrastructure';
import { ImpactStats } from './components/ImpactStats';
import { FeaturedVentures } from './components/FeaturedVentures';
import { PartnersMarquee } from './components/PartnersMarquee';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { EmailNotification } from './types';

// Code-split heavy views for high-performance loading
const ApplicationPortal = lazy(() =>
  import('./components/ApplicationPortal').then((m) => ({ default: m.ApplicationPortal }))
);
const ApplicantDashboard = lazy(() =>
  import('./components/ApplicantDashboard').then((m) => ({ default: m.ApplicantDashboard }))
);
const SuperadminPortal = lazy(() =>
  import('./components/SuperadminPortal').then((m) => ({ default: m.SuperadminPortal }))
);
const MentorsDirectory = lazy(() =>
  import('./components/MentorsDirectory').then((m) => ({ default: m.MentorsDirectory }))
);
const NewsFeed = lazy(() =>
  import('./components/NewsFeed').then((m) => ({ default: m.NewsFeed }))
);

function ViewFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#0B1E48] border-t-rose-600 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Loading Óghowa Portal...</p>
      </div>
    </div>
  );
}

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'home' | 'apply' | 'dashboard' | 'admin' | 'mentors' | 'news'>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Current Logged-in User
  const [currentUser, setCurrentUser] = useState({
    name: 'Osahon Ehigiator',
    email: 'osahon@edutechpulse.ng',
    role: 'founder'
  });

  // Startup Application State
  const [appData, setAppData] = useState({
    founderName: 'Osahon Ehigiator',
    founderEmail: 'osahon@edutechpulse.ng',
    founderPhone: '+234 803 123 4567',
    startupName: 'Edutech Pulse',
    sector: 'Education Technology',
    stage: 'Seed Stage',
    description: 'An AI-powered foundational literacy engine and smart tuition reconciliation platform for primary schools across Sub-Saharan Africa.',
    targetMarket: 'K-12 schools, state education ministries, and low-cost private educators.',
    tractionMRR: '₦3,800,000',
    activeUsers: '14,200',
    deckFileName: 'EdutechPulse_PitchDeck_Q4.pdf',
    cacFileName: 'CAC_Registration_RC198273.pdf'
  });

  // Application Evaluation Status
  const [appStatus, setAppStatus] = useState<string>('Under Review'); // 'Draft' | 'Submitted' | 'Under Review' | 'Information Required' | 'Approved' | 'Rejected'
  const [adminNotes, setAdminNotes] = useState<string>(
    'Strong initial traction in Edo and Lagos states. Please confirm financial model projections for Q1 2026.'
  );

  // Simulated Automated Email Outbox
  const [sentEmails, setSentEmails] = useState<EmailNotification[]>([
    {
      id: 'EML-001',
      recipient: 'osahon@edutechpulse.ng',
      recipientName: 'Osahon Ehigiator',
      subject: 'Welcome to Óghowa Venture Ecosystem - Application Initiated',
      type: 'Registration',
      timestamp: 'Today, 09:14 AM',
      content:
        'Dear Osahon,\n\nWelcome to Óghowa Venture Ecosystem!\n\nYour founder account is active and your startup application for "Edutech Pulse" has been registered in our Cohort 2026 selection database.\n\nPlease monitor your Applicant Dashboard for live milestone progression and investment committee updates.\n\nWarm regards,\nÓghowa Admissions Team'
    }
  ]);

  // Automated Status Change Email Dispatcher
  const handleStatusUpdate = (newStatus: string, feedbackMsg = '') => {
    setAppStatus(newStatus);
    setAdminNotes(feedbackMsg);

    const newEmail: EmailNotification = {
      id: `EML-00${sentEmails.length + 1}`,
      recipient: appData.founderEmail,
      recipientName: appData.founderName,
      subject: `Update on your Óghowa Venture Application: ${newStatus.toUpperCase()}`,
      type: newStatus === 'Information Required' ? 'Information Request' : 'Status Update',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
      content: `Dear ${appData.founderName},\n\nThe Óghowa Investment Committee has updated the review status for your venture "${appData.startupName}" to: "${newStatus.toUpperCase()}".\n\nReviewer Feedback Notes:\n"${
        feedbackMsg || 'No additional remarks provided.'
      }"\n\nPlease log in to your Applicant Dashboard to review timeline deliverables or schedule your diligence session.\n\nBest regards,\nÓghowa Investment Committee`
    };

    setSentEmails([newEmail, ...sentEmails]);
  };

  // Submit Formal Application & Dispatch Confirmation Email
  const handleSubmitApplication = (submissionData: typeof appData) => {
    setAppData(submissionData);
    setAppStatus('Under Review');

    const confirmationEmail: EmailNotification = {
      id: `EML-00${sentEmails.length + 1}`,
      recipient: submissionData.founderEmail,
      recipientName: submissionData.founderName,
      subject: `Application Confirmed: ${submissionData.startupName} is Under Review`,
      type: 'Registration',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
      content: `Dear ${submissionData.founderName},\n\nWe have received your complete 5-step application for ${submissionData.startupName} (Sector: ${submissionData.sector}).\n\nYour documents (${submissionData.deckFileName} & ${submissionData.cacFileName}) have been uploaded to the diligence vault and allocated to our sector screening leads.\n\nYou can track the progress of your application directly on your founder dashboard.\n\nBest regards,\nÓghowa Admissions Desk`
    };

    setSentEmails([confirmationEmail, ...sentEmails]);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ticket Reservation Handler
  const handleTicketReserved = (ticketEmail: EmailNotification) => {
    setSentEmails([ticketEmail, ...sentEmails]);
  };

  const handleStartJourney = () => {
    setCurrentView('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreEcosystem = () => {
    setCurrentView('home');
    setTimeout(() => {
      const el = document.getElementById('ecosystem');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navbar with Announcement Bar */}
      <Navbar
        activeView={currentView}
        setActiveView={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenApply={handleStartJourney}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        appStatus={appStatus}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* A. Hero Section */}
            <Hero
              onStartJourney={handleStartJourney}
              onExploreEcosystem={handleExploreEcosystem}
              onOpenMentors={() => {
                setCurrentView('mentors');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* B. Dynamic Business Startup Week Countdown & Live Seats Tracker */}
            <EventCountdown onTicketReserved={handleTicketReserved} />

            {/* C. Who We Serve */}
            <WhoWeServe
              onSelectAudience={(aud) => {
                if (aud === 'founders' || aud === 'universities') {
                  setCurrentView('apply');
                } else {
                  setCurrentView('apply');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* D. The Óghowa Journey */}
            <Journey onStartApplication={handleStartJourney} />

            {/* E. Flagship Platforms */}
            <FlagshipPlatforms
              onApplyForPlatform={() => {
                setCurrentView('apply');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* F. Infrastructure That Builds Businesses (Deep Royal Blue Ribbon) */}
            <Infrastructure />

            {/* G. Our Impact Numbers */}
            <ImpactStats />

            {/* H. Featured Ventures */}
            <FeaturedVentures />

            {/* I. Partners Strip */}
            <PartnersMarquee />
          </>
        )}

        {/* 2. Startup Application Portal */}
        {currentView === 'apply' && (
          <Suspense fallback={<ViewFallback />}>
            <ApplicationPortal
              appData={appData}
              setAppData={setAppData}
              onSubmitApplication={handleSubmitApplication}
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDashboard={() => {
                setCurrentView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </Suspense>
        )}

        {/* 3. Applicant Dashboard */}
        {currentView === 'dashboard' && (
          <Suspense fallback={<ViewFallback />}>
            <ApplicantDashboard
              appData={appData}
              appStatus={appStatus}
              adminNotes={adminNotes}
              onOpenApply={() => {
                setCurrentView('apply');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAdmin={() => {
                setCurrentView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </Suspense>
        )}

        {/* 4. Superadmin Review & Automated Email Console */}
        {currentView === 'admin' && (
          <Suspense fallback={<ViewFallback />}>
            <SuperadminPortal
              appData={appData}
              appStatus={appStatus}
              adminNotes={adminNotes}
              sentEmails={sentEmails}
              onUpdateStatus={handleStatusUpdate}
              onBackToDashboard={() => {
                setCurrentView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </Suspense>
        )}

        {/* 5. Mentors Directory */}
        {currentView === 'mentors' && (
          <Suspense fallback={<ViewFallback />}>
            <MentorsDirectory
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </Suspense>
        )}

        {/* 6. News & Insights Feed */}
        {currentView === 'news' && (
          <Suspense fallback={<ViewFallback />}>
            <NewsFeed
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenApply={handleStartJourney}
            />
          </Suspense>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenApply={handleStartJourney}
        onNavigate={(view) => {
          if (view === 'portal') {
            setCurrentView('apply');
          } else {
            setCurrentView(view);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Auth / Role Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUserRole={currentUser.role}
        onSelectRole={(r) => {
          setCurrentUser((prev) => ({ ...prev, role: r.toLowerCase() }));
          if (r.toLowerCase() === 'founder') {
            setCurrentView('dashboard');
          } else if (r.toLowerCase() === 'investor' || r.toLowerCase() === 'mentor') {
            setCurrentView('admin');
          }
        }}
        onOpenPortal={() => {
          setCurrentView('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
