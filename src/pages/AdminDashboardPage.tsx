import React, { useState, useEffect, useCallback } from 'react';
import { PageRoute } from '../types';
import {
  ArrowLeft, ShieldCheck, Lock, LogOut, RefreshCw, HelpCircle,
  Globe, Briefcase, Trash2, AlertCircle, CheckCircle2, Flame,
  Mail, Clock, UserCheck, ShieldAlert
} from 'lucide-react';
import {
  adminStorage,
  ContactSubmission,
  DeletionRequest
} from '../utils/adminStorage';
import { auth, db, googleProvider } from '../firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AdminWebsiteControlPanel } from '../components/AdminWebsiteControlPanel';
import { AdminHiringControlPanel } from '../components/AdminHiringControlPanel';

interface AdminDashboardPageProps {
  onNavigate: (route: PageRoute, params?: any) => void;
}

const PRIMARY_ADMIN_EMAIL = 'advocatetiwaribaba@gmail.com';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  // Real Firebase Auth + Firestore Admin Verification State (No PIN bypass)
  const [authLoading, setAuthLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<FirebaseUser | null>(null);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Top-level Admin Portal Tabs
  const [activeTab, setActiveTab] = useState<'website' | 'hiring' | 'tickets' | 'deletions'>('website');

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  // Support Inquiries & Deletion Requests State
  const [tickets, setTickets] = useState<ContactSubmission[]>([]);
  const [deletions, setDeletions] = useState<DeletionRequest[]>([]);
  const [isSyncingQueue, setIsSyncingQueue] = useState(false);

  // Verify user against Firestore rules (`advocatetiwaribaba@gmail.com` or `admins/{uid}`)
  const verifyAdminPrivilege = useCallback(async (user: FirebaseUser): Promise<boolean> => {
    if (user.email && user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL) {
      return true;
    }
    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      return adminDoc.exists();
    } catch {
      return false;
    }
  }, []);

  // Firebase Auth Listener
  useEffect(() => {
    // Clear any stale legacy bypass session keys
    try {
      localStorage.removeItem('less_admin_auth_session');
    } catch {}

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAdminUser(null);
        setIsAuthorizedAdmin(false);
        setAuthLoading(false);
        return;
      }

      setAdminUser(user);
      const allowed = await verifyAdminPrivilege(user);
      setIsAuthorizedAdmin(allowed);
      setAuthLoading(false);
    });

    return () => unsubAuth();
  }, [verifyAdminPrivilege]);

  // Load Support Inquiries & Deletion Requests once verified
  const refreshQueues = useCallback(async () => {
    setIsSyncingQueue(true);
    try {
      const [loadedTickets, loadedDeletions] = await Promise.all([
        adminStorage.getContactSubmissions(),
        adminStorage.getDeletionRequestsForAdmin()
      ]);
      setTickets(loadedTickets);
      setDeletions(loadedDeletions);
    } catch (err) {
      console.error('Queue sync failed:', err);
    } finally {
      setIsSyncingQueue(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorizedAdmin) {
      refreshQueues();
    }
  }, [isAuthorizedAdmin, refreshQueues]);

  // Google Sign-In Handler
  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setAuthError('');
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setAdminUser(res.user);
        const allowed = await verifyAdminPrivilege(res.user);
        setIsAuthorizedAdmin(allowed);
        if (!allowed) {
          setAuthError(`Access denied for ${res.user.email || res.user.uid}. Please sign in with the authorized administrator Google account.`);
        }
      }
    } catch (err: any) {
      console.error('Google Auth error:', err);
      setAuthError(err?.message || 'Google Sign-In could not be completed. Please allow popups and try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setAdminUser(null);
    setIsAuthorizedAdmin(false);
    setAuthError('');
  };

  // Support Inquiry Handlers
  const handleUpdateTicketStatus = async (ticketId: string, status: ContactSubmission['status']) => {
    await adminStorage.updateContactSubmissionStatus(ticketId, status);
    setTickets(prev => prev.map(t => (t.id === ticketId || t.firestoreDocId === ticketId) ? { ...t, status } : t));
    showToast(`Ticket status updated to ${status}`, 'success');
  };

  const handleDeleteTicket = async (ticketId: string) => {
    await adminStorage.deleteContactSubmission(ticketId);
    setTickets(prev => prev.filter(t => t.id !== ticketId && t.firestoreDocId !== ticketId));
    showToast('Inquiry removed from queue', 'success');
  };

  // Account Deletion Request Handlers
  const handleUpdateDeletionStatus = async (reqId: string, status: DeletionRequest['status']) => {
    const ok = await adminStorage.updateDeletionRequestStatus(reqId, status, adminUser?.email || 'Admin');
    if (ok) {
      setDeletions(prev => prev.map(r => (r.id === reqId || r.firestoreDocId === reqId) ? { ...r, status } : r));
      showToast(`Deletion request marked as ${status}`, 'success');
    } else {
      showToast('Failed to update deletion request status', 'error');
    }
  };

  // ==========================================
  // 1. INITIALIZING AUTH CHECK
  // ==========================================
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center animate-pulse">
            <ShieldCheck className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-xs font-mono text-stone-400">Verifying Firebase Admin Session...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. UNAUTHENTICATED / ACCESS DENIED SCREEN
  // ==========================================
  if (!adminUser || !isAuthorizedAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 pb-28 text-white">
        <div className="w-full max-w-md bg-[#0D1220] border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto shadow-lg">
              {adminUser ? <ShieldAlert className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {adminUser ? 'Unauthorized Account' : 'Admin Control Portal'}
            </h1>
            <p className="text-xs text-stone-400 leading-relaxed">
              {adminUser
                ? 'Signed-in Google account does not have administrator permissions in Firestore.'
                : 'Authorized administrator Google Sign-In required for Firestore & content control.'}
            </p>
          </div>

          {adminUser && (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1 font-mono">
              <div className="text-stone-400">Signed in as:</div>
              <div className="text-white font-bold break-all">{adminUser.email}</div>
              <div className="text-[10px] text-stone-500 break-all">UID: {adminUser.uid}</div>
            </div>
          )}

          {authError && (
            <div className="p-3 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={isAuthenticating}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>
                {isAuthenticating
                  ? 'Signing in with Google...'
                  : adminUser
                    ? 'Switch Authorized Google Account'
                    : 'Sign In with Google (Admin)'}
              </span>
            </button>

            {adminUser && (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Current Account</span>
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-500">
            <span>Less Creation Admin Security</span>
            <button onClick={() => onNavigate('home')} className="hover:text-stone-300 transition-colors cursor-pointer">
              ← Back to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. AUTHORIZED FULL ORIGINAL ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-6 text-white">
      
      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-24 right-4 sm:right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-2.5 text-xs font-bold backdrop-blur-xl transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/90 border-red-500/40 text-red-300'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shadow-lg shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-xl font-bold text-white tracking-tight">
                Admin Control Center
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold whitespace-nowrap">
                <Flame className="w-2.5 h-2.5 text-emerald-400" />
                <span>Firestore Live</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-mono truncate">
              {adminUser.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={refreshQueues}
            disabled={isSyncingQueue}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-stone-300 border border-white/10 inline-flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingQueue ? 'animate-spin' : ''}`} />
            <span>Sync Queues</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-xs font-semibold text-red-400 border border-red-500/20 inline-flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white border border-white/10 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Site</span>
          </button>
        </div>
      </div>

      {/* Single-line Horizontal Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('website')}
          className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
            activeTab === 'website'
              ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
              : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span>Website, Articles & Apps Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('hiring')}
          className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
            activeTab === 'hiring'
              ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
              : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 shrink-0" />
          <span>Hiring & Careers Portal</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
            activeTab === 'tickets'
              ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
              : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Support Inquiries ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deletions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
            activeTab === 'deletions'
              ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
              : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5 shrink-0" />
          <span>Deletion Requests ({deletions.length})</span>
        </button>
      </div>

      {/* TAB 1: FULL ORIGINAL WEBSITE, ARTICLES, BANNERS, APPS, NOTICES, STORIES CONTROL PANEL */}
      {activeTab === 'website' && (
        <AdminWebsiteControlPanel
          adminEmail={adminUser.email || undefined}
          onNavigate={onNavigate}
          onShowToast={showToast}
        />
      )}

      {/* TAB 2: FULL ORIGINAL HIRING & CAREERS PORTAL */}
      {activeTab === 'hiring' && (
        <AdminHiringControlPanel
          adminEmail={adminUser.email || undefined}
          onShowToast={showToast}
        />
      )}

      {/* TAB 3: SUPPORT INQUIRIES (FIRESTORE contact_submissions) */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-400" />
              <span>Contact & Legal Support Tickets ({tickets.length})</span>
            </h2>
          </div>

          {tickets.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#0D1220] border border-white/10 text-center text-xs text-stone-400">
              No support inquiries found in Firestore.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {tickets.map((t) => {
                const docKey = t.firestoreDocId || t.id;
                return (
                  <div
                    key={docKey}
                    className="p-5 rounded-2xl bg-[#0D1220] border border-white/10 space-y-3 shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white">{t.name}</span>
                          <span className="text-xs font-mono text-stone-400">{t.email}</span>
                          <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase">
                            {t.status}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-stone-300 mt-1">
                          Subject: {t.subject} {t.category ? `(${t.category})` : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-500">
                        <Clock className="w-3 h-3" />
                        <span>{t.createdAt || t.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed whitespace-pre-line">
                      {t.message}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(['Pending', 'In Review', 'Resolved', 'Closed'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateTicketStatus(docKey, st)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase cursor-pointer whitespace-nowrap transition-all ${
                              t.status === st
                                ? 'bg-red-600 text-white'
                                : 'bg-white/5 hover:bg-white/10 text-stone-400 border border-white/10'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handleDeleteTicket(docKey)}
                        className="px-3 py-1 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ACCOUNT DELETION REQUESTS (FIRESTORE account_deletion_requests) */}
      {activeTab === 'deletions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-red-400" />
              <span>Play Store Account & Data Deletion Requests ({deletions.length})</span>
            </h2>
          </div>

          {deletions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#0D1220] border border-white/10 text-center text-xs text-stone-400">
              No account deletion requests found in Firestore.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {deletions.map((req) => {
                const docKey = req.firestoreDocId || req.id;
                return (
                  <div
                    key={docKey}
                    className="p-5 rounded-2xl bg-[#0D1220] border border-white/10 space-y-3 shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white font-mono">{req.id}</span>
                          <span className="text-xs text-stone-300">{req.email}</span>
                          {req.userId && (
                            <span className="text-[10px] font-mono text-stone-400 bg-white/5 px-2 py-0.5 rounded">
                              UID: {req.userId}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase">
                            {req.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-400 mt-1">
                          Submitted: {req.submittedAt || req.timestamp} {req.processedBy ? `• Processed by: ${req.processedBy}` : ''}
                        </div>
                      </div>
                    </div>

                    {req.reason && (
                      <p className="text-xs text-stone-300 leading-relaxed">
                        Reason: {req.reason}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {(['PENDING', 'IN PROGRESS', 'COMPLETED', 'REJECTED'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateDeletionStatus(docKey, st)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase cursor-pointer whitespace-nowrap transition-all ${
                            req.status === st
                              ? 'bg-red-600 text-white'
                              : 'bg-white/5 hover:bg-white/10 text-stone-400 border border-white/10'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
