import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalSearchModal from './components/GlobalSearchModal';
import RegistrationModal from './components/RegistrationModal';
import RegistrationPassModal from './components/RegistrationPassModal';
import CertificateModal from './components/CertificateModal';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import ClubsPage from './pages/ClubsPage';
import ClubDetailPage from './pages/ClubDetailPage';
import CalendarPage from './pages/CalendarPage';
import CampusMapPage from './pages/CampusMapPage';
import GalleryPage from './pages/GalleryPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import StudentDashboard from './pages/StudentDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return hash || 'home';
  });

  // Modals state
  const [searchOpen, setSearchOpen] = useState(false);
  const [registerEvent, setRegisterEvent] = useState(null);
  const [activePass, setActivePass] = useState(null);
  const [activeCert, setActiveCert] = useState(null);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      setCurrentRoute(hash || 'home');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (route) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  // Render current view
  const renderPage = () => {
    // Event details route: events/:slug
    if (currentRoute.startsWith('events/')) {
      const slug = currentRoute.replace('events/', '');
      return (
        <EventDetailPage
          slugOrId={slug}
          onNavigate={navigateTo}
          onRegisterEvent={(ev) => setRegisterEvent(ev)}
          onViewPass={(pass) => setActivePass(pass)}
        />
      );
    }

    // Club details route: clubs/:slug
    if (currentRoute.startsWith('clubs/')) {
      const slug = currentRoute.replace('clubs/', '');
      return (
        <ClubDetailPage
          slugOrId={slug}
          onNavigate={navigateTo}
          onRegisterEvent={(ev) => setRegisterEvent(ev)}
        />
      );
    }

    // Verify certificate: verify/:id
    if (currentRoute.startsWith('verify')) {
      const certId = currentRoute.includes('/') ? currentRoute.split('/')[1] : '';
      return <VerifyCertificatePage certIdProp={certId} />;
    }

    switch (currentRoute) {
      case 'home':
        return (
          <HomePage
            onNavigate={navigateTo}
            onRegisterEvent={(ev) => setRegisterEvent(ev)}
          />
        );
      case 'events':
        return (
          <EventsPage
            onNavigate={navigateTo}
            onRegisterEvent={(ev) => setRegisterEvent(ev)}
          />
        );
      case 'clubs':
        return <ClubsPage onNavigate={navigateTo} />;
      case 'calendar':
        return <CalendarPage onNavigate={navigateTo} />;
      case 'map':
        return <CampusMapPage onNavigate={navigateTo} />;
      case 'gallery':
        return <GalleryPage onNavigate={navigateTo} />;
      case 'announcements':
        return <AnnouncementsPage onNavigate={navigateTo} />;
      case 'dashboard':
        return (
          <StudentDashboard
            onNavigate={navigateTo}
            onOpenPass={(pass) => setActivePass(pass)}
            onOpenCert={(cert) => setActiveCert(cert)}
          />
        );
      case 'organizer-dashboard':
        return <OrganizerDashboard onNavigate={navigateTo} />;
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'register':
        return <RegisterPage onNavigate={navigateTo} />;
      case 'about':
        return <AboutPage onNavigate={navigateTo} />;
      case 'contact':
        return <ContactPage onNavigate={navigateTo} />;
      default:
        return <NotFoundPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Global Interactive Modals */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigateTo}
      />

      <RegistrationModal
        event={registerEvent}
        isOpen={!!registerEvent}
        onClose={() => setRegisterEvent(null)}
        onSuccess={(reg) => {
          setActivePass(reg);
        }}
        onNavigate={navigateTo}
      />

      <RegistrationPassModal
        registration={activePass}
        isOpen={!!activePass}
        onClose={() => setActivePass(null)}
      />

      <CertificateModal
        certificate={activeCert}
        isOpen={!!activeCert}
        onClose={() => setActiveCert(null)}
      />
    </div>
  );
}
