import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { 
  ShieldCheck, Lock, Unlock, Key, Trash2, Mail, User, 
  Search, Filter, CheckCircle2, Clock, AlertCircle, RefreshCw, 
  Download, ArrowLeft, LogOut, FileText, ChevronRight, MessageSquare, 
  Sparkles, Check, X, Tag, Edit3, ShieldAlert, Phone, AlertTriangle
} from 'lucide-react';
import { 
  GoogleAuthProvider,
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { HeroAmbientGlow } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';
import { adminStorage, ContactSubmission, DeletionRequest } from '../utils/adminStorage';

interface AdminDashboardPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // Firebase Auth State
  const [adminUser, setAdminUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Form State
  const [authMode, setAuthMode] = useState<'login' | 'forgot'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'deletions' | 'contacts' | 'settings'>('deletions');

  // Security & Inactivity Session State (15 Minutes = 900 Seconds)
  const INACTIVITY_TIMEOUT_SECONDS = 15 * 60;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(INACTIVITY_TIMEOUT_SECONDS);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState<boolean>(false);

  // Data State
  const [deletions, setDeletions] = useState<DeletionRequest[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);

  // Refresh & Toast State
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshToast, setRefreshToast] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Admin Notes Editing State
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  // Prevent search engines from crawling/indexing the admin portal
  useEffect(() => {
    let metaTag = document.querySelector('meta[name="robots"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'robots');
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', 'noindex, nofollow, noarchive');

    return () => {
      metaTag?.setAttribute('content', 'index, follow');
    };
  }, []);

  // Monitor Secure Admin Session & enforce strict Firebase Auth boundaries
  useEffect(() => {
    // Purge any legacy localStorage credentials or session flags
    localStorage.removeItem('less_legal_admin_session');
    localStorage.removeItem('less_legal_admin_creds');

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthLoading(true);
        try {
          const isAuthorized = await adminStorage.verifyAdminCustomClaim(user);
          if (isAuthorized) {
            setAdminUser(user);
            setIsAuthenticated(true);
            const now = Date.now();
            sessionStorage.setItem('less_legal_admin_session', JSON.stringify({ email: user.email, loggedInAt: now, lastActive: now }));
            setRemainingSeconds(INACTIVITY_TIMEOUT_SECONDS);
          } else {
            await signOut(auth);
            sessionStorage.removeItem('less_legal_admin_session');
            setAdminUser(null);
            setIsAuthenticated(false);
            setAuthError(
              isHindi
                ? "पहुँच अस्वीकृत: आपका खाता अधिकृत एडमिन के रूप में पंजीकृत नहीं है।"
                : "Access Denied: Your account is not authorized as an administrator."
            );
          }
        } catch (err) {
          console.error("Error checking admin authorization:", err);
          await signOut(auth);
          sessionStorage.removeItem('less_legal_admin_session');
          setAdminUser(null);
          setIsAuthenticated(false);
          setAuthError(
            isHindi
              ? "सत्यापन विफल! कृपया पुनः प्रयास करें।"
              : "Authorization verification failed! Please try again."
          );
        }
      } else {
        sessionStorage.removeItem('less_legal_admin_session');
        setAdminUser(null);
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [isHindi]);

  // Real-time Inactivity Auto-Logout Timer (15 Minutes) & User Interaction Reset
  useEffect(() => {
    if (!isAuthenticated) return;

    const resetInactivityTimer = () => {
      const now = Date.now();
      const sessStr = sessionStorage.getItem('less_legal_admin_session');
      if (sessStr) {
        try {
          const parsed = JSON.parse(sessStr);
          parsed.lastActive = now;
          sessionStorage.setItem('less_legal_admin_session', JSON.stringify(parsed));
        } catch {}
      }
      setRemainingSeconds(INACTIVITY_TIMEOUT_SECONDS);
    };

    // User activity listeners (debounced)
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    let throttleTimeout: NodeJS.Timeout | null = null;
    const handleActivity = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          resetInactivityTimer();
          throttleTimeout = null;
        }, 1000);
      }
    };

    activityEvents.forEach((ev) => window.addEventListener(ev, handleActivity, { passive: true }));

    // 1-second countdown interval
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleLogout(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      activityEvents.forEach((ev) => window.removeEventListener(ev, handleActivity));
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [isAuthenticated]);

  // Load Data on Mount & Refresh
  const loadData = async () => {
    const localDeletions = adminStorage.getDeletionRequests();
    const localContacts = adminStorage.getContactSubmissions();
    setDeletions(localDeletions);
    setContacts(localContacts);

    if (localContacts.length > 0 && localDeletions.length === 0) {
      setActiveTab('contacts');
    }

    // Sync cloud records asynchronously
    try {
      const [cloudDeletions, cloudContacts] = await Promise.all([
        adminStorage.fetchDeletionRequestsFromCloud(),
        adminStorage.fetchContactSubmissionsFromCloud()
      ]);
      setDeletions(cloudDeletions);
      setContacts(cloudContacts);

      if (cloudContacts.length > 0 && cloudDeletions.length === 0) {
        setActiveTab('contacts');
      }
    } catch {
      // Fallback to local items if offline
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshToast(null);
    try {
      await loadData();
      await new Promise(res => setTimeout(res, 500));
      setRefreshToast(isHindi ? 'डेटा सफलतापूर्वक अपडेट हो गया!' : 'Data refreshed successfully!');
      setTimeout(() => setRefreshToast(null), 3000);
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Real-time Firestore sync listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    loadData();

    // Listen to contact_submissions real-time
    const unsubContacts = onSnapshot(collection(db, 'contact_submissions'), (snapshot) => {
      const cloudItems: ContactSubmission[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        cloudItems.push({
          id: data.id || docSnap.id,
          firestoreDocId: docSnap.id,
          name: data.name || '',
          email: data.email || '',
          subject: data.subject || '',
          transactionId: data.transactionId || undefined,
          message: data.message || '',
          timestamp: data.timestamp || new Date().toISOString(),
          status: data.status || 'Pending',
          adminNotes: data.adminNotes || ''
        });
      });

      const localItems = adminStorage.getContactSubmissions();
      const itemMap = new Map<string, ContactSubmission>();
      localItems.forEach(item => itemMap.set(item.id, item));
      cloudItems.forEach(item => itemMap.set(item.id, item));

      const merged = Array.from(itemMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setContacts(merged);
      try {
        localStorage.setItem('less_legal_contact_submissions', JSON.stringify(merged));
      } catch {}

      if (merged.length > 0) {
        setActiveTab(prev => (prev === 'deletions' ? 'contacts' : prev));
      }
    }, (err) => {
      console.warn('Realtime contacts listener warning:', err);
    });

    // Listen to account_deletion_requests real-time
    const unsubDeletions = onSnapshot(collection(db, 'account_deletion_requests'), (snapshot) => {
      const cloudItems: DeletionRequest[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        cloudItems.push({
          id: data.id || docSnap.id,
          firestoreDocId: docSnap.id,
          ticketId: data.ticketId || '',
          email: data.email || '',
          userId: data.userId || undefined,
          reason: data.reason || undefined,
          timestamp: data.timestamp || new Date().toISOString(),
          status: data.status || 'Pending',
          adminNotes: data.adminNotes || ''
        });
      });

      const localItems = adminStorage.getDeletionRequests();
      const itemMap = new Map<string, DeletionRequest>();
      localItems.forEach(item => itemMap.set(item.id, item));
      cloudItems.forEach(item => itemMap.set(item.id, item));

      const merged = Array.from(itemMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setDeletions(merged);
      try {
        localStorage.setItem('less_legal_deletion_requests', JSON.stringify(merged));
      } catch {}
    }, (err) => {
      console.warn('Realtime deletions listener warning:', err);
    });

    return () => {
      unsubContacts();
      unsubDeletions();
    };
  }, [isAuthenticated]);

  // Auth Handlers
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setAuthSuccessMsg(null);
    setSessionExpiredNotice(false);
    setAuthLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCred = await signInWithPopup(auth, provider);
      const user = userCred.user;

      const isAuthorized = await adminStorage.verifyAdminCustomClaim(user);
      if (isAuthorized) {
        setAdminUser(user);
        setIsAuthenticated(true);
        const now = Date.now();
        sessionStorage.setItem('less_legal_admin_session', JSON.stringify({ email: user.email, loggedInAt: now, lastActive: now }));
        setRemainingSeconds(INACTIVITY_TIMEOUT_SECONDS);
        setAuthError(null);
      } else {
        await signOut(auth);
        sessionStorage.removeItem('less_legal_admin_session');
        setAdminUser(null);
        setIsAuthenticated(false);
        setAuthError(
          isHindi
            ? "पहुँच अस्वीकृत: आपके गूगल खाते के पास एडमिन अधिकार (admin: true) नहीं हैं।"
            : "Access Denied: Your Google account does not have administrator privileges (admin: true)."
        );
      }
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(
          isHindi
            ? "गूगल प्रमाणीकरण विफल! कृपया पुनः प्रयास करें।"
            : "Google authentication failed! Please try again."
        );
      }
      setAdminUser(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async (dueToInactivity = false) => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
    sessionStorage.removeItem('less_legal_admin_session');
    localStorage.removeItem('less_legal_admin_session');
    localStorage.removeItem('less_legal_admin_creds');
    setAdminUser(null);
    setIsAuthenticated(false);
    if (dueToInactivity) {
      setSessionExpiredNotice(true);
      setAuthError(
        isHindi
          ? "सुरक्षा समय सीमा समाप्त (15 मिनट निष्क्रियता)! आपका एडमिन सत्र स्वतः लॉक/लॉगआउट कर दिया गया है।"
          : "Security timeout (15 mins inactivity)! Your admin session has been automatically locked."
      );
    }
  };

  const formatRemainingTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Status Handlers
  const handleUpdateDeletionStatus = (id: string, status: 'Pending' | 'Processing' | 'Completed') => {
    adminStorage.updateDeletionStatus(id, status);
    loadData();
  };

  const handleUpdateContactStatus = (id: string, status: 'Pending' | 'In Progress' | 'Resolved') => {
    adminStorage.updateContactStatus(id, status);
    loadData();
  };

  const handleDeleteDeletionItem = (id: string) => {
    if (confirm(isHindi ? 'क्या आप इस अनुरोध को स्थायी रूप से हटाना चाहते हैं?' : 'Are you sure you want to delete this request permanently?')) {
      adminStorage.deleteDeletionRequest(id);
      loadData();
    }
  };

  const handleDeleteContactItem = (id: string) => {
    if (confirm(isHindi ? 'क्या आप इस संदेश को स्थायी रूप से हटाना चाहते हैं?' : 'Are you sure you want to delete this submission permanently?')) {
      adminStorage.deleteContactSubmission(id);
      loadData();
    }
  };

  const handleSaveNote = (id: string, type: 'deletion' | 'contact') => {
    if (type === 'deletion') {
      const target = deletions.find(d => d.id === id);
      if (target) {
        adminStorage.updateDeletionStatus(id, target.status, noteText);
      }
    } else {
      const target = contacts.find(c => c.id === id);
      if (target) {
        adminStorage.updateContactStatus(id, target.status, noteText);
      }
    }
    setEditingNoteId(null);
    setNoteText('');
    loadData();
  };

  // CSV Exporter
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const keys = Object.keys(data[0]);
    const csvContent = [
      keys.join(','),
      ...data.map(row => keys.map(k => `"${(row[k] || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Lists
  const filteredDeletions = deletions.filter(d => {
    const matchesSearch = 
      d.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.userId && d.userId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.reason && d.reason.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesStatus = true;
    if (statusFilter !== 'ALL') {
      const sf = statusFilter.toUpperCase();
      if (sf === 'PENDING') {
        matchesStatus = d.status.toUpperCase() === 'PENDING';
      } else if (sf === 'PROCESSING') {
        matchesStatus = d.status.toUpperCase() === 'PROCESSING' || d.status.toUpperCase() === 'IN PROGRESS';
      } else if (sf === 'COMPLETED') {
        matchesStatus = d.status.toUpperCase() === 'COMPLETED' || d.status.toUpperCase() === 'RESOLVED';
      }
    }
    return matchesSearch && matchesStatus;
  });

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.transactionId && c.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesStatus = true;
    if (statusFilter !== 'ALL') {
      const sf = statusFilter.toUpperCase();
      if (sf === 'PENDING') {
        matchesStatus = c.status.toUpperCase() === 'PENDING';
      } else if (sf === 'PROCESSING') {
        matchesStatus = c.status.toUpperCase() === 'IN PROGRESS' || c.status.toUpperCase() === 'PROCESSING';
      } else if (sf === 'COMPLETED') {
        matchesStatus = c.status.toUpperCase() === 'RESOLVED' || c.status.toUpperCase() === 'COMPLETED';
      }
    }
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const pendingDeletionsCount = deletions.filter(d => d.status === 'Pending').length;
  const pendingContactsCount = contacts.filter(c => c.status === 'Pending').length;

  // Render Loading Spinner
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4 relative">
        <HeroAmbientGlow />
        <div className="relative z-10 flex flex-col items-center space-y-3 bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-[28px] p-8 shadow-sm">
          <RefreshCw className="w-8 h-8 text-[#C21F2F] animate-spin" />
          <p className="text-sm font-semibold text-slate-600 dark:text-[#B8B3AF]">
            {isHindi ? "सुरक्षित सर्वर प्रमाणीकरण की जाँच की जा रही है..." : "Verifying secure administrator session..."}
          </p>
        </div>
      </div>
    );
  }

  // Render Admin Portal Login / Register Lock Screen if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="relative max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
        <HeroAmbientGlow />
        
        <div className="p-6 sm:p-8 rounded-[28px] border border-white/80 dark:border-white/10 space-y-6 relative z-10 shadow-[0_16px_40px_rgba(0,0,0,0.08)] bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#C21F2F]/10 text-[#C21F2F] dark:text-[#E03A3E] border border-[#C21F2F]/20 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
              {isHindi ? "एडमिन पोर्टल" : "Admin Portal"}
            </h1>
          </div>

          {/* Session Inactivity Expiry Notice */}
          {sessionExpiredNotice && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs text-left font-semibold flex items-start gap-2.5">
              <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>
                <strong className="block font-bold">{isHindi ? "सत्र समाप्ति (Session Timeout)" : "Session Expired"}</strong>
                <span>{isHindi ? "15 मिनट की निष्क्रियता या ब्राउज़र बंद होने के कारण सुरक्षा हेतु सत्र समाप्त कर दिया गया है। कृपया पुनः लॉगिन करें।" : "Your session was locked due to 15 minutes of inactivity or window close. Please log in again."}</span>
              </div>
            </div>
          )}

          {/* Secure Admin Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[11px] font-bold text-slate-600 dark:text-[#B8B3AF] mx-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C21F2F]" />
            <span>{isHindi ? "केवल अधिकृत एडमिन प्रवेश" : "Authorized Personnel Only"}</span>
          </div>

          {/* Error & Success Banners */}
          {authError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs text-left font-semibold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs text-left font-semibold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON */}
          <div className="space-y-4 pt-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="w-full py-3.5 px-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white font-bold text-sm shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{authLoading ? (isHindi ? "प्रमाणीकरण हो रहा है..." : "Authenticating...") : (isHindi ? "गूगल से जारी रखें" : "Continue with Google")}</span>
            </button>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[11px] text-slate-500 dark:text-[#B8B3AF] leading-relaxed text-center">
              {isHindi
                ? "नोट: केवल अधिकृत एडमिन गूगल खातों (admin: true) को ही एडमिन डैशबोर्ड का उपयोग करने की अनुमति है।"
                : "Note: Only authorized Google Accounts with verified administrator claims (admin: true) are granted dashboard access."}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-center text-xs text-slate-500">
            <button
              onClick={() => onNavigate('home')}
              className="text-slate-600 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C21F2F]" />
              <span>{isHindi ? "मुख्य वेबसाइट पर वापस जाएं" : "Back to Website"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Admin Dashboard once authenticated with Firebase
  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 space-y-8 overflow-hidden">
      <HeroAmbientGlow />

      {/* Top Header & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 relative z-10 pb-6 border-b border-white/80 dark:border-white/10">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-white/90 dark:bg-[#121622]/80 border border-slate-200/80 dark:border-white/10 px-3 py-1 rounded-full shadow-2xs mr-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C21F2F]" />
              <span>{isHindi ? "होम पेज" : "Back Home"}</span>
            </button>
            <span className="px-3 py-1 rounded-full bg-[#C21F2F]/10 text-[#C21F2F] dark:text-[#E03A3E] text-xs font-bold border border-[#C21F2F]/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Less Legal Admin Console</span>
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-mono flex items-center gap-1 bg-white/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 px-2.5 py-0.5 rounded-full">
              <User className="w-3 h-3 text-emerald-500" />
              {adminUser?.email || 'admin@lesslegal.in'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
            {isHindi ? "प्रशासनिक डैशबोर्ड" : "Administrative Management Console"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B8B3AF]">
            {isHindi 
              ? "सबमिट किए गए डेटा हटाने के अनुरोधों और सपोर्ट टिकट्स का प्रबंधन करें।" 
              : "Review and manage account deletion requests and user contact submissions in real-time."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Inactivity Auto-Lock Countdown Badge */}
          <div 
            title={isHindi ? "15 मिनट की निष्क्रियता के बाद सत्र स्वतः लॉक हो जाएगा" : "Session automatically locks after 15 minutes of inactivity"}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
              remainingSeconds < 120 
                ? 'bg-red-500/15 border-red-500/40 text-red-600 dark:text-red-400 animate-pulse' 
                : 'bg-white/90 dark:bg-[#121622]/80 border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 backdrop-blur-md shadow-2xs'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>{isHindi ? "ऑटो-लॉक" : "Auto-Lock"}: {formatRemainingTime(remainingSeconds)}</span>
          </div>

          {/* Quick Lock Now Button */}
          <button
            onClick={() => handleLogout(false)}
            title={isHindi ? "डैशबोर्ड को तुरंत लॉक करें" : "Lock Console Immediately"}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{isHindi ? "तत्काल लॉक करें" : "Lock Now"}</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-white/90 dark:bg-[#121622]/80 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C21F2F]' : ''}`} />
            <span className="whitespace-nowrap">{isRefreshing ? (isHindi ? "अपडेट..." : "Refreshing...") : (isHindi ? "रिफ्रेश" : "Refresh")}</span>
          </button>

          <button
            onClick={() => handleLogout(false)}
            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{isHindi ? "लॉग आउट" : "Sign Out"}</span>
          </button>
        </div>
      </div>

      {refreshToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in relative z-10 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{refreshToast}</span>
        </div>
      )}

      {/* Metrics Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 rounded-[22px] border border-white/80 dark:border-white/10 shadow-2xs space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">{isHindi ? "लंबित विलोपन" : "Pending Deletions"}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {pendingDeletionsCount}
          </p>
        </div>

        <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 rounded-[22px] border border-white/80 dark:border-white/10 shadow-2xs space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">{isHindi ? "लंबित सहायता" : "Pending Support"}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {pendingContactsCount}
          </p>
        </div>

        <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 rounded-[22px] border border-white/80 dark:border-white/10 shadow-2xs space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">{isHindi ? "कुल संसाधित" : "Total Processed"}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {deletions.filter(d => d.status === 'Completed').length}
          </p>
        </div>

        <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 rounded-[22px] border border-white/80 dark:border-white/10 shadow-2xs space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
            <Mail className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">{isHindi ? "कुल संदेश" : "Total Support Tickets"}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {contacts.length}
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/80 dark:border-white/10 pb-4 relative z-10">
        <div className="flex items-center gap-1.5 rounded-2xl bg-white/90 dark:bg-[#121622]/80 backdrop-blur-xl p-1.5 border border-white/80 dark:border-white/10 text-xs font-bold shadow-2xs overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('deletions')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'deletions' 
                ? 'bg-white dark:bg-[#1C2230] text-[#C21F2F] dark:text-[#E03A3E] shadow-sm border border-slate-200/50 dark:border-white/10' 
                : 'text-slate-600 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{isHindi ? "खाता विलोपन अनुरोध" : "Account Deletion Requests"} ({deletions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'contacts' 
                ? 'bg-white dark:bg-[#1C2230] text-[#C21F2F] dark:text-[#E03A3E] shadow-sm border border-slate-200/50 dark:border-white/10' 
                : 'text-slate-600 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{isHindi ? "सहायता एवं संपर्क फ़ॉर्म" : "Support Submissions"} ({contacts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'bg-white dark:bg-[#1C2230] text-[#C21F2F] dark:text-[#E03A3E] shadow-sm border border-slate-200/50 dark:border-white/10' 
                : 'text-slate-600 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{isHindi ? "एडमिन सुरक्षा खाता" : "Firebase Account Settings"}</span>
          </button>
        </div>

        {activeTab !== 'settings' && (
          <button
            onClick={() => exportToCSV(activeTab === 'deletions' ? deletions : contacts, activeTab)}
            className="px-3.5 py-2 rounded-xl bg-white/90 dark:bg-[#121622]/80 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-[#B8B3AF] border border-slate-200/80 dark:border-white/10 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-[#C21F2F]" />
            <span className="whitespace-nowrap">{isHindi ? "CSV एक्सपोर्ट करें" : "Export Report"}</span>
          </button>
        )}
      </div>

      {/* Search & Filter Toolbars */}
      {activeTab !== 'settings' && (
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10 bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-3.5 sm:p-4 rounded-2xl border border-white/80 dark:border-white/10 shadow-2xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? "ईमेल, टिकट ID या यूज़र ID द्वारा खोजें..." : "Search by Email, Ticket ID, or User ID..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#C21F2F]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-500 whitespace-nowrap">{isHindi ? "स्थिति:" : "Status:"}</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1C2230] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">{isHindi ? "सभी स्थिति" : "All Statuses"}</option>
              <option value="PENDING">Pending (लंबित)</option>
              <option value="PROCESSING">Processing / In Progress (प्रक्रियाधीन)</option>
              <option value="COMPLETED">Completed / Resolved (पूर्ण/हल)</option>
            </select>
          </div>
        </div>
      )}

      {/* TAB 1: ACCOUNT DELETION REQUESTS */}
      {activeTab === 'deletions' && (
        <div className="space-y-4 relative z-10">
          {filteredDeletions.length === 0 ? (
            <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-12 text-center rounded-[28px] border border-white/80 dark:border-white/10 space-y-3 shadow-2xs">
              <Trash2 className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                {isHindi ? "कोई खाता विलोपन अनुरोध नहीं मिला" : "No Account Deletion Requests Found"}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isHindi 
                  ? "वर्तमान में कोई अनुरोध लंबित नहीं है। मोबाइल ऐप यूज़र्स द्वारा फॉर्म भरने पर यहाँ लिस्ट दिखेगी।" 
                  : "No submissions match your query. Real-time requests from users will appear here automatically."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredDeletions.map((item) => (
                <div key={item.id} className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 sm:p-6 rounded-[24px] border border-white/80 dark:border-white/10 space-y-4 hover:shadow-md transition-all shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#C21F2F]/10 text-[#C21F2F] dark:text-[#E03A3E] border border-[#C21F2F]/20">
                        {item.ticketId}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(item.timestamp).toLocaleString(isHindi ? 'hi-IN' : 'en-US')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateDeletionStatus(item.id, e.target.value as any)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border focus:outline-none cursor-pointer ${
                          item.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : item.status === 'Processing'
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                            : 'bg-red-500/10 text-red-600 border-red-500/30'
                        }`}
                      >
                        <option value="Pending">Pending (लंबित)</option>
                        <option value="Processing">Processing (प्रक्रियाधीन)</option>
                        <option value="Completed">Completed (पूर्ण डेटा साफ़)</option>
                      </select>

                      <button
                        onClick={() => handleDeleteDeletionItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title={isHindi ? "हटाएं" : "Delete Record"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 font-semibold">{isHindi ? "यूज़र ईमेल:" : "User Email:"}</span>
                      <p className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#C21F2F]" />
                        {item.email}
                      </p>
                    </div>

                    {item.userId && (
                      <div className="space-y-1">
                        <span className="text-slate-400 font-semibold">{isHindi ? "यूज़र / ऐप ID:" : "User / App ID:"}</span>
                        <p className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-500" />
                          {item.userId}
                        </p>
                      </div>
                    )}
                  </div>

                  {item.reason && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {isHindi ? "विलोपन का कारण:" : "Reason for Deletion:"}
                      </span>
                      <p className="text-xs text-slate-800 dark:text-[#F5F2EE] leading-relaxed">
                        {item.reason}
                      </p>
                    </div>
                  )}

                  {/* Internal Admin Remarks */}
                  <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {editingNoteId === item.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder={isHindi ? "एडमिन रिमार्क्स / टिप्पणी लिखें..." : "Write internal admin remarks..."}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveNote(item.id, 'deletion')}
                          className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl cursor-pointer text-xs"
                        >
                          {isHindi ? "सहेजें" : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-2 py-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs cursor-pointer"
                        >
                          {isHindi ? "रद्द करें" : "Cancel"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-500 font-semibold">{isHindi ? "एडमिन नोट:" : "Admin Note:"}</span>
                          <span className="text-slate-800 dark:text-[#F5F2EE] font-medium">
                            {item.adminNotes || (isHindi ? "कोई टिप्पणी नहीं" : "No internal note added")}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setEditingNoteId(item.id);
                            setNoteText(item.adminNotes || '');
                          }}
                          className="text-[#C21F2F] hover:underline text-[11px] font-bold cursor-pointer"
                        >
                          {item.adminNotes ? (isHindi ? "संपादित करें" : "Edit Note") : (isHindi ? "+ नोट जोड़ें" : "+ Add Note")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUPPORT & CONTACT SUBMISSIONS */}
      {activeTab === 'contacts' && (
        <div className="space-y-4 relative z-10">
          {filteredContacts.length === 0 ? (
            <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-12 text-center rounded-[28px] border border-white/80 dark:border-white/10 space-y-3 shadow-2xs">
              <Mail className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                {isHindi ? "कोई सहायता फ़ॉर्म सबमिशन नहीं मिला" : "No Support Submissions Found"}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isHindi 
                  ? "वेबसाइट के 'Contact Us' फ़ॉर्म द्वारा भेजे गए नए संदेश यहाँ प्रदर्शित होंगे।" 
                  : "Inquiries submitted via the Contact form will appear here automatically."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredContacts.map((item) => (
                <div key={item.id} className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 sm:p-6 rounded-[24px] border border-white/80 dark:border-white/10 space-y-4 hover:shadow-md transition-all shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({new Date(item.timestamp).toLocaleString(isHindi ? 'hi-IN' : 'en-US')})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateContactStatus(item.id, e.target.value as any)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border focus:outline-none cursor-pointer ${
                          item.status === 'Resolved'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : item.status === 'In Progress'
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                            : 'bg-red-500/10 text-red-600 border-red-500/30'
                        }`}
                      >
                        <option value="Pending">Pending (लंबित)</option>
                        <option value="In Progress">In Progress (प्रक्रियाधीन)</option>
                        <option value="Resolved">Resolved (हल हो गया)</option>
                      </select>

                      <button
                        onClick={() => handleDeleteContactItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title={isHindi ? "हटाएं" : "Delete Submission"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 font-semibold">{isHindi ? "ईमेल आईडी:" : "Email Address:"}</span>
                      <p className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#C21F2F]" />
                        <a href={`mailto:${item.email}`} className="hover:underline text-[#C21F2F]">
                          {item.email}
                        </a>
                      </p>
                    </div>

                    {item.transactionId && (
                      <div className="space-y-1">
                        <span className="text-slate-400 font-semibold">{isHindi ? "ट्रांजैक्शन ID:" : "Transaction ID:"}</span>
                        <p className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-purple-500" />
                          {item.transactionId}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      विषय: {item.subject}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-[#F5F2EE] whitespace-pre-line leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  {/* Internal Admin Remarks */}
                  <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {editingNoteId === item.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder={isHindi ? "एडमिन रिमार्क्स / नोट्स लिखें..." : "Write internal admin remarks..."}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveNote(item.id, 'contact')}
                          className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl cursor-pointer text-xs"
                        >
                          {isHindi ? "सहेजें" : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-2 py-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs cursor-pointer"
                        >
                          {isHindi ? "रद्द करें" : "Cancel"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-500 font-semibold">{isHindi ? "एडमिन नोट:" : "Admin Note:"}</span>
                          <span className="text-slate-800 dark:text-[#F5F2EE] font-medium">
                            {item.adminNotes || (isHindi ? "कोई टिप्पणी नहीं" : "No internal note added")}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setEditingNoteId(item.id);
                            setNoteText(item.adminNotes || '');
                          }}
                          className="text-[#C21F2F] hover:underline text-[11px] font-bold cursor-pointer"
                        >
                          {item.adminNotes ? (isHindi ? "संपादित करें" : "Edit Note") : (isHindi ? "+ नोट जोड़ें" : "+ Add Note")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FIREBASE AUTH SECURITY SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-xl mx-auto space-y-6 relative z-10">
          <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-6 sm:p-8 rounded-[28px] border border-white/80 dark:border-white/10 space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isHindi ? "Firebase प्रमाणीकरण विवरण" : "Firebase Auth Credentials"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHindi 
                    ? "आपका खाता Firebase Cloud Authentication से पूरी तरह सुरक्षित है।" 
                    : "Your session is secured via Firebase Authentication."}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">{isHindi ? "पंजीकृत एडमिन ईमेल:" : "Active Admin Email:"}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{adminUser?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Firebase Auth UID:</span>
                <span className="font-mono text-[11px] text-slate-400">{adminUser?.uid}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">{isHindi ? "सुरक्षा स्थिति:" : "Security Status:"}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[11px]">
                  Encrypted & Verified
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={async () => {
                  if (adminUser?.email) {
                    try {
                      await sendPasswordResetEmail(auth, adminUser.email);
                      alert(isHindi ? `पासवर्ड रीसेट लिंक ${adminUser.email} पर भेज दिया गया है!` : `Password reset link sent to ${adminUser.email}!`);
                    } catch (e) {
                      alert(isHindi ? "रीसेट लिंक भेजने में समस्या आई।" : "Failed to send reset email.");
                    }
                  }
                }}
                className="w-full py-3 rounded-xl bg-white/90 dark:bg-[#121622]/80 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold text-xs border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                <Key className="w-4 h-4 text-[#C21F2F]" />
                <span>{isHindi ? "पासवर्ड बदलने के लिए ईमेल भेजें" : "Send Password Reset Email"}</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs border border-red-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                <LogOut className="w-4 h-4" />
                <span>{isHindi ? "डैशबोर्ड से लॉग आउट करें" : "Sign Out from Dashboard"}</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2 text-xs text-slate-500">
              <span className="font-bold block text-slate-700 dark:text-white">{isHindi ? "सुरक्षा मानक (Zero Hardcoded Secrets):" : "Security Guarantee:"}</span>
              <p className="leading-relaxed">
                {isHindi 
                  ? "कोई भी पासवर्ड या पिन सोर्स कोड में संग्रहीत नहीं है। सभी क्रेडेंशियल्स Google Firebase Authentication द्वारा सुरक्षित सर्वर पर सत्यापित होते हैं।"
                  : "Zero passwords or PINs exist in frontend code. All authentication credentials are verified directly against Google Firebase Authentication servers."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
