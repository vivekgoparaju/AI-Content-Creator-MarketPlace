import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { CreatorProfilePage } from './pages/CreatorProfilePage';
import { AIBriefStudioPage } from './pages/AIBriefStudioPage';
import { BriefsPage } from './pages/BriefsPage';
import { CreatorStudioPage } from './pages/CreatorStudioPage';
import { api } from './services/api';

function MainApp() {
  const { user, isCreator, isBrand } = useAuth();
  const [activePage, setActivePage] = useState('landing');
  const [selectedCreatorId, setSelectedCreatorId] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [featuredCreators, setFeaturedCreators] = useState([]);

  useEffect(() => {
    // Load top creators for landing page
    api.searchCreators({ page_size: 6 })
      .then((data) => {
        setFeaturedCreators(data.creators || []);
      })
      .catch((err) => {
        console.error('Failed to load featured creators:', err);
      });
  }, []);

  const handleSelectCreator = (id) => {
    setSelectedCreatorId(id);
    setActivePage('creator-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBriefSaved = (savedBrief) => {
    setActivePage('briefs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC] text-[#171923]">
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage
            onExplore={() => {
              setActivePage('discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenStudio={() => {
              setActivePage('ai-studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCreator={handleSelectCreator}
            featuredCreators={featuredCreators}
          />
        )}

        {activePage === 'discover' && (
          <DiscoveryPage onSelectCreator={handleSelectCreator} />
        )}

        {activePage === 'creator-profile' && (
          <CreatorProfilePage
            creatorId={selectedCreatorId || 1}
            onBack={() => {
              setActivePage('discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenEditor={() => {
              setActivePage('creator-studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'ai-studio' && (
          <AIBriefStudioPage
            onBriefSaved={handleBriefSaved}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {activePage === 'briefs' && (
          <BriefsPage
            onOpenStudio={() => {
              setActivePage('ai-studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'creator-studio' && (
          <CreatorStudioPage />
        )}
      </main>

      <Footer setActivePage={setActivePage} />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
