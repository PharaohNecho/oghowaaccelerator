import React, { useState, useEffect, Suspense, lazy } from 'react';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
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
import { EmailNotification, Venture, PartnerItem, CarouselSlide, BusinessWeekConfig, RegisteredDelegate } from './types';
import { FEATURED_VENTURES, PARTNERS_LIST, DEFAULT_CAROUSEL_EVENTS, DEFAULT_BUSINESS_WEEK_CONFIG } from './data/mockData';

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
const BusinessWeekLanding = lazy(() =>
  import('./components/BusinessWeekLanding').then((m) => ({ default: m.BusinessWeekLanding }))
);
const BusinessWeekRegistration = lazy(() =>
  import('./components/BusinessWeekRegistration').then((m) => ({ default: m.BusinessWeekRegistration }))
);

function ViewFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#0B1E48] border-t-rose-600 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Óghowa Portal...</p>
      </div>
    </div>
  );
}

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<
    'home' | 'apply' | 'dashboard' | 'admin' | 'mentors' | 'news' | 'business-week' | 'business-week-register'
  >('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Dynamic Portfolio Ventures controlled by Superadmin (Default: Ugbekun SMP, MyEduRide, Cyona Medicare)
  const [ventures, setVentures] = useState<Venture[]>(FEATURED_VENTURES);

  // Dynamic Ecosystem Partners controlled by Superadmin
  const [partners, setPartners] = useState<PartnerItem[]>(PARTNERS_LIST);

  // Dynamic Hero Carousel Slides controlled by Superadmin
  const [carouselEvents, setCarouselEvents] = useState<CarouselSlide[]>(DEFAULT_CAROUSEL_EVENTS);

  // Dynamic Business Week Summit & Registration Configuration controlled by Superadmin
  const [businessWeekConfig, setBusinessWeekConfig] = useState<BusinessWeekConfig>(DEFAULT_BUSINESS_WEEK_CONFIG);

  // Current Logged-in User
  const [currentUser, setCurrentUser] = useState({
    name: 'Victory Usiobaifo',
    email: 'usiobaifovictory245@gmail.com',
    role: 'founder'
  });

  // Startup Application State
  const [appData, setAppData] = useState({
    founderName: 'Victory Usiobaifo',
    founderEmail: 'usiobaifovictory245@gmail.com',
    founderPhone: '+234 803 123 4567',
    startupName: 'Ugbekun SMP',
    sector: 'Education Technology',
    stage: 'Scaling',
    description: 'Comprehensive school management platform simplifying school administration, tuition reconciliation, attendance, and student academic performance across K-12 institutions.',
    targetMarket: 'K-12 schools, state education ministries, and low-cost private educators.',
    tractionMRR: '₦4,800,000',
    activeUsers: '52,000',
    deckFileName: 'UgbekunSMP_PitchDeck.pdf',
    cacFileName: 'CAC_Registration_RC198273.pdf'
  });

  // Application Evaluation Status
  const [appStatus, setAppStatus] = useState<string>('Screening');
  const [adminNotes, setAdminNotes] = useState<string>(
    'Strong initial traction in Edo and Lagos states. Please confirm financial model projections for Q1 2027.'
  );

  // Simulated Automated Email Outbox
  const [sentEmails, setSentEmails] = useState<EmailNotification[]>([
    {
      id: 'EML-001',
      recipient: 'usiobaifovictory245@gmail.com',
      recipientName: 'Victory Usiobaifo',
      subject: 'Welcome to Óghowa Venture Ecosystem - Application Initiated',
      type: 'Registration',
      timestamp: 'Today, 09:14 AM',
      content:
        'Dear Victory,\n\nWelcome to Óghowa Venture Ecosystem!\n\nYour founder account is active and your startup application for "Ugbekun SMP" has been registered in our Cohort 2026 selection database.\n\nPlease monitor your Applicant Dashboard for live milestone progression and investment committee updates.\n\nWarm regards,\nÓghowa Admissions Team'
    }
  ]);

  // ================= FIRESTORE REAL-TIME SYNCHRONIZATION =================
  useEffect(() => {
    // 1. Ventures Firestore Listener
    const venturesPath = 'ventures';
    const unsubVentures = onSnapshot(
      collection(db, venturesPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Venture[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          setVentures(list);
        }
      },
      (error) => {
        if (error.code === 'permission-denied') {
          handleFirestoreError(error, OperationType.LIST, venturesPath);
        }
      }
    );

    // 2. Partners Firestore Listener
    const partnersPath = 'partners';
    const unsubPartners = onSnapshot(
      collection(db, partnersPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: PartnerItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          setPartners(list);
        }
      },
      (error) => {
        if (error.code === 'permission-denied') {
          handleFirestoreError(error, OperationType.LIST, partnersPath);
        }
      }
    );

    // 3. Carousel Events Firestore Listener
    const carouselPath = 'carouselEvents';
    const unsubCarousel = onSnapshot(
      collection(db, carouselPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: CarouselSlide[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          setCarouselEvents(list);
        }
      },
      (error) => {
        if (error.code === 'permission-denied') {
          handleFirestoreError(error, OperationType.LIST, carouselPath);
        }
      }
    );

    return () => {
      unsubVentures();
      unsubPartners();
      unsubCarousel();
    };
  }, []);

  // Update Ventures with Firestore sync
  const handleUpdateVentures = async (updated: Venture[]) => {
    setVentures(updated);
    try {
      for (const v of updated) {
        await setDoc(doc(db, 'ventures', v.id), v, { merge: true });
      }
    } catch {
      console.warn('Persisting to Firestore: local state updated');
    }
  };

  // Update Partners with Firestore sync
  const handleUpdatePartners = async (updated: PartnerItem[]) => {
    setPartners(updated);
    try {
      for (const p of updated) {
        await setDoc(doc(db, 'partners', p.id), p, { merge: true });
      }
    } catch {
      console.warn('Persisting to Firestore: local state updated');
    }
  };

  // Update Carousel Events with Firestore sync
  const handleUpdateCarouselEvents = async (updated: CarouselSlide[]) => {
    setCarouselEvents(updated);
    try {
      for (const s of updated) {
        await setDoc(doc(db, 'carouselEvents', s.id), s, { merge: true });
      }
    } catch {
      console.warn('Persisting to Firestore: local state updated');
    }
  };

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
      content: `Dear ${submissionData.founderName},\n\nWe have received your complete application for ${submissionData.startupName} (Sector: ${submissionData.sector}).\n\nYour documents (${submissionData.deckFileName} & ${submissionData.cacFileName}) have been uploaded to the diligence vault and allocated to our sector screening leads.\n\nYou can track the progress of your application directly on your founder dashboard.\n\nBest regards,\nÓghowa Admissions Desk`
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

  const handleOpenBusinessWeek = () => {
    setCurrentView('business-week');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBusinessWeekRegistration = () => {
    setCurrentView('business-week-register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user navigated to the dedicated Óghowa Business Week summit main page:
  if (currentView === 'business-week') {
    return (
      <Suspense fallback={<ViewFallback />}>
        <BusinessWeekLanding
          config={businessWeekConfig}
          onBackToAccelerator={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenRegistration={handleOpenBusinessWeekRegistration}
          onOpenApply={handleStartJourney}
        />
      </Suspense>
    );
  }

  // If user navigated to the dedicated Óghowa Business Week Registration page:
  if (currentView === 'business-week-register') {
    return (
      <Suspense fallback={<ViewFallback />}>
        <BusinessWeekRegistration
          config={businessWeekConfig}
          onBackToBusinessWeek={handleOpenBusinessWeek}
          onBackToAccelerator={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onTicketReserved={handleTicketReserved}
          onRegisterDelegate={(newDelegate: RegisteredDelegate) => {
            setBusinessWeekConfig((prev) => ({
              ...prev,
              delegates: [newDelegate, ...prev.delegates]
            }));
          }}
        />
      </Suspense>
    );
  }

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
            {/* A. Hero Section with Blended Images and Superadmin-Editable Carousel */}
            <Hero
              onStartJourney={handleStartJourney}
              onExploreEcosystem={handleExploreEcosystem}
              onOpenMentors={() => {
                setCurrentView('mentors');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              carouselEvents={carouselEvents}
              onOpenBusinessWeek={handleOpenBusinessWeek}
              onRegisterForBusinessWeek={handleOpenBusinessWeekRegistration}
              config={businessWeekConfig}
            />

            {/* B. Dynamic Business Week Countdown & Live Seats Tracker */}
            <EventCountdown
              onTicketReserved={handleTicketReserved}
              onOpenBusinessWeek={handleOpenBusinessWeek}
              onRegisterForBusinessWeek={handleOpenBusinessWeekRegistration}
              config={businessWeekConfig}
            />

            {/* C. Who We Serve */}
            <WhoWeServe
              onSelectAudience={() => {
                setCurrentView('apply');
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
              onOpenBusinessWeek={handleOpenBusinessWeek}
            />

            {/* F. Infrastructure That Builds Businesses */}
            <Infrastructure />

            {/* G. Our Impact Numbers */}
            <ImpactStats />

            {/* H. Featured Ventures (Controlled by Superadmin: Ugbekun SMP, MyEduRide, Cyona Medicare) */}
            <FeaturedVentures ventures={ventures} />

            {/* I. Partners Strip (Modifiable by Superadmin) */}
            <PartnersMarquee partners={partners} />
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

        {/* 4. Superadmin Portal with 5-minute Auto-Lock, Credentials & Control Over All Elements */}
        {currentView === 'admin' && (
          <Suspense fallback={<ViewFallback />}>
            <SuperadminPortal
              appData={appData}
              appStatus={appStatus}
              adminNotes={adminNotes}
              sentEmails={sentEmails}
              ventures={ventures}
              partners={partners}
              carouselEvents={carouselEvents}
              businessWeekConfig={businessWeekConfig}
              onUpdateStatus={handleStatusUpdate}
              onUpdateVentures={handleUpdateVentures}
              onUpdatePartners={handleUpdatePartners}
              onUpdateCarouselEvents={handleUpdateCarouselEvents}
              onUpdateBusinessWeekConfig={setBusinessWeekConfig}
              onBackToDashboard={() => {
                setCurrentView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToBusinessWeek={handleOpenBusinessWeek}
              onNavigateToRegistration={handleOpenBusinessWeekRegistration}
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
