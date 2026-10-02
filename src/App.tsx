/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense } from 'react';
import { User } from 'firebase/auth';
import { Analytics } from '@vercel/analytics/react';
import { onAuthChange, signOutAuthor } from './lib/firebase';
import { isOwnerEmail } from './config/auth';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CoverView } from './components/CoverView';
import { ChapterView } from './components/ChapterView';
import { TrailView } from './components/TrailView';
import { ToolkitView } from './components/ToolkitView';
import { AboutView } from './components/AboutView';
import { TagsView } from './components/TagsView';
import { DashboardRoomView } from './components/DashboardRoomView';
import { WorkWithMeView } from './components/WorkWithMeView';
import { AdminPortal } from './components/AdminPortal';

// Lazy-load author tools and studio dependencies so they are NEVER loaded for public visitors
const LazyAuthorTools = React.lazy(() => import('./components/author/AuthorTools'));

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('cover');
  const [activeChapterId, setActiveChapterId] = useState<string>('chapter-1');
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // Requirement: Author mode flag (false by default)
  const [isAuthorMode, setIsAuthorMode] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Author modal states
  const [isSourceInspectorOpen, setIsSourceInspectorOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Discreet route /#/admin
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(() => {
    return window.location.hash === '#/admin';
  });

  // Listen to hash changes for the discreet route /#/admin
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/admin') {
        setIsAdminPortalOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      if (user && isOwnerEmail(user.email)) {
        setIsAuthorMode(true);
      } else {
        setIsAuthorMode(false);
        setIsSourceInspectorOpen(false);
        setIsStudioOpen(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectChapter = (chapterId: string) => {
    setActiveChapterId(chapterId);
    setCurrentTab('chapter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPost = (postId: string | null) => {
    setActivePostId(postId);
    setCurrentTab('trail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    try {
      await signOutAuthor();
      setIsAuthorMode(false);
      setIsSourceInspectorOpen(false);
      setIsStudioOpen(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const closeAdminPortal = () => {
    setIsAdminPortalOpen(false);
    if (window.location.hash === '#/admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#071610] text-[#f5f2ea]">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      {/* Header with strictly gated author controls */}
      <Header
        currentTab={currentTab}
        onNavigate={navigateTo}
        isAuthorMode={isAuthorMode}
        authorEmail={currentUser?.email}
        onOpenStudio={() => setIsStudioOpen(true)}
        onOpenSourceInspector={() => setIsSourceInspectorOpen(true)}
        onDownloadZip={() => setIsSourceInspectorOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area: Public Visitor Views */}
      <main id="main-content" className="site-main" role="main">
        {currentTab === 'cover' && (
          <CoverView
            onSelectChapter={handleSelectChapter}
            onSelectPost={handleSelectPost}
            onNavigate={navigateTo}
            isAuthorMode={isAuthorMode}
            onOpenSourceInspector={() => setIsSourceInspectorOpen(true)}
          />
        )}

        {currentTab === 'chapter' && (
          <ChapterView
            chapterId={activeChapterId}
            onSelectChapter={handleSelectChapter}
            onSelectPost={handleSelectPost}
            onNavigate={navigateTo}
          />
        )}

        {currentTab === 'trail' && (
          <TrailView
            activePostId={activePostId}
            onSelectPost={handleSelectPost}
            onSelectChapter={handleSelectChapter}
            onNavigate={navigateTo}
          />
        )}

        {currentTab === 'dashboards' && (
          <DashboardRoomView onNavigate={navigateTo} />
        )}

        {currentTab === 'toolkit' && <ToolkitView />}

        {currentTab === 'about' && <AboutView />}

        {currentTab === 'work-with-me' && <WorkWithMeView />}

        {currentTab === 'tags' && (
          <TagsView
            onSelectChapter={handleSelectChapter}
            onSelectPost={handleSelectPost}
          />
        )}
      </main>

      {/* Footer Colophon */}
      <Footer
        onNavigate={navigateTo}
        isAuthorMode={isAuthorMode}
        onOpenSourceInspector={() => setIsSourceInspectorOpen(true)}
      />

      {/* AUTHOR TOOLS & WRITING STUDIO: Conditionally rendered AND lazy-loaded.
          When isAuthorMode is false, this component and all studio/markdown/zip bundles are NEVER imported or rendered in the DOM */}
      {isAuthorMode && (
        <Suspense fallback={null}>
          <LazyAuthorTools
            isStudioOpen={isStudioOpen}
            onCloseStudio={() => setIsStudioOpen(false)}
            isInspectorOpen={isSourceInspectorOpen}
            onCloseInspector={() => setIsSourceInspectorOpen(false)}
          />
        </Suspense>
      )}

      {/* Discreet /#/admin Route Portal */}
      {isAdminPortalOpen && (
        <AdminPortal
          currentUser={currentUser}
          isAuthorMode={isAuthorMode}
          onClose={closeAdminPortal}
          onOpenStudio={() => setIsStudioOpen(true)}
          onOpenSourceInspector={() => setIsSourceInspectorOpen(true)}
          onDownloadZip={() => setIsSourceInspectorOpen(true)}
        />
      )}

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
