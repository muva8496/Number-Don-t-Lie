import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { signInWithGoogle, signOutAuthor } from '../lib/firebase';
import { OWNER_EMAIL, isOwnerEmail } from '../config/auth';
import { Shield, ShieldAlert, CheckCircle, LogOut, ArrowLeft, KeyRound, Code2, Download, Edit3 } from 'lucide-react';

interface AdminPortalProps {
  currentUser: User | null;
  isAuthorMode: boolean;
  onClose: () => void;
  onOpenStudio: () => void;
  onOpenSourceInspector: () => void;
  onDownloadZip: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  isAuthorMode,
  onClose,
  onOpenStudio,
  onOpenSourceInspector,
  onDownloadZip
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setErrorMsg(null);
      const user = await signInWithGoogle();
      if (!isOwnerEmail(user.email)) {
        setErrorMsg(`Account ${user.email} is not authorized for Author Mode.`);
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Authentication failed.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutAuthor();
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Sign out failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#071610] border border-[#d4af37]/35 rounded shadow-2xl p-6 sm:p-8 text-[#f5f2ea]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20 mb-6">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-5 h-5 text-[#d4af37]" />
            <h2 className="font-serif text-xl font-bold tracking-tight text-[#f5f2ea]">
              NDL Author Portal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#879287] hover:text-[#f5f2ea] inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Book</span>
          </button>
        </div>

        {/* State 1: Signed In as Author (Author Mode ACTIVE) */}
        {currentUser && isAuthorMode && (
          <div className="space-y-6">
            <div className="p-4 bg-[#0d261b] border border-emerald-500/40 rounded-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#f5f2ea]">
                    Author Mode Active
                  </h3>
                  <p className="text-xs text-[#c9c3b4] mt-1 font-mono">
                    Signed in as {currentUser.email}
                  </p>
                  <p className="text-xs text-[#879287] mt-1">
                    Author-only controls (Jekyll Files Explorer, Export .zip) are now unlocked in the top bar.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenStudio();
                }}
                className="w-full py-2.5 px-4 bg-[#e6c86e] hover:bg-[#d4af37] text-[#071610] text-xs font-semibold rounded-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-[#071610]" />
                <span>Launch Writing Studio</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenSourceInspector();
                }}
                className="w-full py-2.5 px-4 bg-[#0d221a] border border-[#d4af37]/40 hover:border-[#d4af37] text-[#f5f2ea] text-xs font-medium rounded-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-[#d4af37]" />
                <span>Open Jekyll Files Inspector</span>
              </button>

              <button
                onClick={onDownloadZip}
                className="w-full py-2.5 px-4 bg-[#0d221a] border border-[#d4af37]/40 hover:border-[#d4af37] text-[#f5f2ea] text-xs font-medium rounded-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#d4af37]" />
                <span>Export Jekyll Project (.zip)</span>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full py-2 px-4 bg-transparent border border-red-500/30 hover:border-red-500 text-red-300 hover:text-red-200 text-xs rounded-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer mt-4"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Author Mode</span>
              </button>
            </div>
          </div>
        )}

        {/* State 2: Signed in but NOT the Owner (Unauthorized) */}
        {currentUser && !isAuthorMode && (
          <div className="space-y-6">
            <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-sm">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-bold text-sm text-red-200">
                    Access Denied
                  </h3>
                  <p className="text-xs text-red-300/80 mt-1 font-mono">
                    {currentUser.email} is not authorized for Author Mode.
                  </p>
                  <p className="text-xs text-[#879287] mt-2">
                    Author privileges are restricted to the site owner ({OWNER_EMAIL}).
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleSignOut}
                className="w-full py-2 px-4 bg-[#0d221a] border border-red-500/40 hover:border-red-400 text-xs text-red-300 rounded-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 px-4 bg-transparent text-xs text-[#879287] hover:text-[#f5f2ea] transition-colors cursor-pointer"
              >
                Return to Book
              </button>
            </div>
          </div>
        )}

        {/* State 3: Not Signed In (Visitor on discreet route) */}
        {!currentUser && (
          <div className="space-y-6">
            <p className="text-xs leading-relaxed text-[#c9c3b4]">
              This discreet entry point is reserved for the site author to unlock repository export tools, drafts, and Jekyll source files.
            </p>

            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 text-xs text-red-300 rounded-sm">
                {errorMsg}
              </div>
            )}

            <div className="p-4 bg-[#092016] border border-[#d4af37]/20 rounded-sm space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Shield className="w-4 h-4" />
                <span className="font-semibold">Security Policy</span>
              </div>
              <p className="text-[#879287] leading-relaxed">
                Authentication uses Google Firebase Authentication. Only sign-ins matching <code className="text-[#e6c86e] font-mono">{OWNER_EMAIL}</code> activate author privileges.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="w-full py-2.5 px-4 bg-[#d4af37] hover:bg-[#e6c86e] text-[#071610] text-xs font-semibold rounded-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isSigningIn ? 'Signing in with Google...' : 'Sign in with Google (Author Only)'}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 px-4 bg-transparent text-xs text-[#879287] hover:text-[#f5f2ea] transition-colors cursor-pointer"
              >
                Cancel and Return to Book
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
