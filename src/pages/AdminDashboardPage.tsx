import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { 
  ShieldCheck, Lock, Unlock, Key, Trash2, Mail, User, 
  Search, Filter, CheckCircle2, Clock, AlertCircle, RefreshCw, 
  Download, ArrowLeft, LogOut, FileText, ChevronRight, MessageSquare, 
  Sparkles, Check, X, Tag, Edit3, ShieldAlert, Phone, UserCheck, KeyRound, AlertTriangle
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
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
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'deletions' | 'contacts' | 'settings'>('deletions');

  // Data State
  const [deletions, setDeletions] = useState<DeletionRequest[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);

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

  // Monitor Firebase Auth status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      setIsAuthenticated(!!user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load Data on Mount & Refresh
  const loadData = async () => {
    setDeletions(adminStorage.getDeletionRequests());
    setContacts(adminStorage.getContactSubmissions());

    // Sync cloud records asynchronously
    try {
      const [cloudDeletions, cloudContacts] = await Promise.all([
        adminStorage.fetchDeletionRequestsFromCloud(),
        adminStorage.fetchContactSubmissionsFromCloud()
      ]);
      setDeletions(cloudDeletions);
      setContacts(cloudContacts);
    } catch {
      // Fallback to local items if offline
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Auth Handlers
  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);
    setAuthLoading(true);

    try {
      await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
      setEmailInput('');
      setPasswordInput('');
    } catch (err: any) {
      console.error('Firebase Login error:', err);
      let msg = isHindi ? 'लॉगिन विफल! कृपया ईमेल और पासवर्ड की जाँच करें।' : 'Login failed! Please check credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = isHindi ? 'अमान्य ईमेल या पासवर्ड! कृपया क्रेडेंशियल पुनः जांचें।' : 'Invalid email or password!';
      } else if (err.code === 'auth/too-many-requests') {
        msg = isHindi ? 'बहुत अधिक असफल प्रयास! कृपया थोड़ी देर बाद प्रयास करें।' : 'Too many attempts! Try again later.';
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFirebaseRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    if (passwordInput !== confirmPasswordInput) {
      setAuthError(isHindi ? 'पासवर्ड मेल नहीं खाते हैं!' : 'Passwords do not match!');
      return;
    }
    if (passwordInput.length < 6) {
      setAuthError(isHindi ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए!' : 'Password must be at least 6 characters!');
      return;
    }

    setAuthLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
      setAuthSuccessMsg(isHindi ? 'एडमिन खाता Firebase Auth में सफलतापूर्वक बन गया!' : 'Admin account created successfully in Firebase Auth!');
      setEmailInput('');
      setPasswordInput('');
      setConfirmPasswordInput('');
    } catch (err: any) {
      console.error('Registration error:', err);
      let msg = err.message;
      if (err.code === 'auth/email-already-in-use') {
        msg = isHindi ? 'यह ईमेल पहले से पंजीकृत है! कृपया "लॉगिन करें" पर जाएं।' : 'This email is already registered! Please switch to Login.';
      } else if (err.code === 'auth/weak-password') {
        msg = isHindi ? 'पासवर्ड कमजोर है! कम से कम 6 अक्षर दर्ज करें।' : 'Password is weak! Enter at least 6 characters.';
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    if (!emailInput.trim()) {
      setAuthError(isHindi ? 'कृपया अपनी पंजीकृत ईमेल आईडी दर्ज करें!' : 'Please enter your registered email address!');
      return;
    }

    setAuthLoading(true);
    try {
      await sendPasswordResetEmail(auth, emailInput.trim());
      setAuthSuccessMsg(isHindi ? 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है!' : 'Password reset link sent to your email!');
    } catch (err: any) {
      console.error('Reset error:', err);
      setAuthError(isHindi ? 'पासवर्ड रीसेट ईमेल भेजने में विफल।' : 'Failed to send reset email.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAdminUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
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
    const matchesStatus = statusFilter === 'ALL' || d.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.transactionId && c.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || c.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const pendingDeletionsCount = deletions.filter(d => d.status === 'Pending').length;
  const pendingContactsCount = contacts.filter(c => c.status === 'Pending').length;

  // Render Loading Spinner
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-[#C21F2F] animate-spin" />
        <p className="text-sm font-semibold text-slate-600 dark:text-[#B8B3AF]">
          {isHindi ? "Firebase क्लाउड प्रमाणीकरण की जाँच की जा रही है..." : "Authenticating with Firebase Cloud Auth..."}
        </p>
      </div>
    );
  }

  // Render Firebase Auth Login/Register Lock Screen if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="relative max-w-lg mx-auto px-4 py-12 sm:py-16 space-y-6">
        <HeroAmbientGlow />
        
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 relative z-10 shadow-xl bg-white/90 dark:bg-[#0D0D0F]/95 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#C21F2F]/10 text-[#C21F2F] dark:text-[#E03A3E] border border-[#C21F2F]/20 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
              {isHindi ? "सुरक्षित एडमिन लॉगिन" : "Firebase Admin Portal"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B8B3AF]">
              {isHindi 
                ? "यह पोर्टल Firebase Authentication से सुरक्षित है। कोई भी पासवर्ड कोड में मौजूद नहीं है।" 
                : "Secured with Firebase Cloud Authentication. Zero passwords in source code."}
            </p>
          </div>

          {/* Auth Switcher Tabs */}
          <div className="flex rounded-2xl bg-slate-100 dark:bg-[#151518] p-1 border border-slate-200 dark:border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setAuthError(null); setAuthSuccessMsg(null); }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'login' 
                  ? 'bg-white dark:bg-[#202025] text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isHindi ? "लॉगिन करें" : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setAuthError(null); setAuthSuccessMsg(null); }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'register' 
                  ? 'bg-white dark:bg-[#202025] text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isHindi ? "नया खाता बनाएं" : "Create Account"}
            </button>
          </div>

          {/* Error & Success Banners */}
          {authError && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs text-left font-semibold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs text-left font-semibold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {/* MODE 1: LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleFirebaseLogin} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-[#B8B3AF]">
                  {isHindi ? "एडमिन ईमेल ID" : "Admin Email Address"}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#151518] border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#C21F2F]"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#B8B3AF]">
                    {isHindi ? "पासवर्ड" : "Password"}
                  </label>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setAuthError(null); setAuthSuccessMsg(null); }}
                    className="text-[11px] font-bold text-[#C21F2F] hover:underline cursor-pointer"
                  >
                    {isHindi ? "पासवर्ड भूल गए?" : "Forgot password?"}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#151518] border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#C21F2F]"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#C21F2F] hover:bg-[#a81927] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>{isHindi ? "Firebase लॉगिन करें" : "Sign In with Firebase"}</span>
              </button>
            </form>
          )}

          {/* MODE 2: REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleFirebaseRegister} className="space-y-4 text-left">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                ℹ️ {isHindi 
                  ? "पहली बार एडमिन खाता बनाने के लिए अपनी ईमेल आईडी और गुप्त पासवर्ड यहाँ दर्ज करें।" 
                  : "Register your secure Admin credentials directly into Firebase Cloud Auth."}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-[#B8B3AF]">
                  {isHindi ? "एडमिन ईमेल ID" : "Admin Email Address"}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#151518] border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#C21F2F]"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-[#B8B3AF]">
                  {isHindi ? "पासवर्ड (कम से कम 6 अक्षर)" : "New Password (Min 6 chars)"}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#151518] border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#C21F2F]"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-[#B8B3AF]">
                  {isHindi ? "पासवर्ड की पुष्टि करें" : "Confirm Password"}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#151518] border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#C21F2F]"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#C21F2F] hover:bg-[#a81927] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isHindi ? "खाता बनाएं और लॉगिन करें" : "Register Admin Account"}</span>
              </button>
            </form>
          )}

          {/* MODE 3: FORGOT PASSWORD */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-[#B8B3AF]">
                  {isHindi ? "पंजीकृत एडमिन ईमेल ID" : "Registered Admin Email Address"}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#151518] border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#C21F2F]"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#C21F2F] hover:bg-[#a81927] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>{isHindi ? "पासवर्ड रीसेट लिंक भेजें" : "Send Password Reset Link"}</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(null); setAuthSuccessMsg(null); }}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                ← {isHindi ? "लॉगिन पृष्ठ पर वापस" : "Back to Login"}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={() => onNavigate('home')}
              className="text-slate-600 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isHindi ? "वेबसाइट पर वापस" : "Back to Website"}</span>
            </button>
            <span className="text-[11px] font-mono">Firebase Auth Integrated</span>
          </div>
        </div>
      </div>
    );
  }

  // Render Admin Dashboard once authenticated with Firebase
  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-8 overflow-hidden bg-slate-50 dark:bg-[#080808] transition-colors duration-300">
      <HeroAmbientGlow />

      {/* Top Header & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 relative z-10 pb-6 border-b border-slate-200 dark:border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#C21F2F]/10 text-[#C21F2F] dark:text-[#E03A3E] text-xs font-bold border border-[#C21F2F]/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Less Legal Admin Console</span>
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-mono flex items-center gap-1 bg-slate-200/60 dark:bg-white/5 px-2.5 py-0.5 rounded-full">
              <User className="w-3 h-3 text-emerald-500" />
              {adminUser?.email || 'admin@firebase.com'}
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

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="px-4 py-2.5 rounded-xl bg-slate-200/70 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-700 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-white border border-slate-300/80 dark:border-white/10 font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isHindi ? "रिफ्रेश" : "Refresh Data"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isHindi ? "लॉग आउट" : "Sign Out"}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">{isHindi ? "लंबित विलोपन" : "Pending Deletions"}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {pendingDeletionsCount}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">{isHindi ? "लंबित सहायता" : "Pending Support"}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {pendingContactsCount}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">{isHindi ? "कुल हटाए गए" : "Total Processed"}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {deletions.filter(d => d.status === 'Completed').length}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
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
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 dark:border-white/10 pb-4 relative z-10">
        <div className="flex items-center gap-2 rounded-2xl bg-slate-200/60 dark:bg-white/5 p-1 border border-slate-300/80 dark:border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveTab('deletions')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'deletions' 
                ? 'bg-white dark:bg-[#1A1A1E] text-[#C21F2F] dark:text-[#E03A3E] shadow-sm' 
                : 'text-slate-600 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>{isHindi ? "खाता विलोपन अनुरोध" : "Account Deletion Requests"} ({deletions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'contacts' 
                ? 'bg-white dark:bg-[#1A1A1E] text-[#C21F2F] dark:text-[#E03A3E] shadow-sm' 
                : 'text-slate-600 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{isHindi ? "सहायता एवं संपर्क फ़ॉर्म" : "Support Submissions"} ({contacts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'settings' 
                ? 'bg-white dark:bg-[#1A1A1E] text-[#C21F2F] dark:text-[#E03A3E] shadow-sm' 
                : 'text-slate-600 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isHindi ? "एडमिन सुरक्षा खाता" : "Firebase Account Settings"}</span>
          </button>
        </div>

        {activeTab !== 'settings' && (
          <button
            onClick={() => exportToCSV(activeTab === 'deletions' ? deletions : contacts, activeTab)}
            className="px-3.5 py-2 rounded-xl bg-slate-200/70 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-700 dark:text-[#B8B3AF] border border-slate-300/80 dark:border-white/10 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#C21F2F]" />
            <span>{isHindi ? "CSV एक्सपोर्ट करें" : "Export Report"}</span>
          </button>
        )}
      </div>

      {/* Search & Filter Toolbars */}
      {activeTab !== 'settings' && (
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10 bg-slate-100/80 dark:bg-[#121215] p-3.5 rounded-2xl border border-slate-200 dark:border-white/10">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? "ईमेल, टिकट ID या यूज़र ID द्वारा खोजें..." : "Search by Email, Ticket ID, or User ID..."}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#C21F2F]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-500">{isHindi ? "स्थिति:" : "Status:"}</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
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
            <div className="glass-panel p-12 text-center rounded-3xl border border-slate-200 dark:border-white/10 space-y-3">
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
                <div key={item.id} className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 hover:border-slate-300 dark:hover:border-white/20 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-white/5 pb-3">
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
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#151518] border border-slate-200/80 dark:border-white/5 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {isHindi ? "विलोपन का कारण:" : "Reason for Deletion:"}
                      </span>
                      <p className="text-xs text-slate-800 dark:text-[#F5F2EE] leading-relaxed">
                        {item.reason}
                      </p>
                    </div>
                  )}

                  {/* Internal Admin Remarks */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {editingNoteId === item.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder={isHindi ? "एडमिन रिमार्क्स / टिप्पणी लिखें..." : "Write internal admin remarks..."}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#151518] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
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
            <div className="glass-panel p-12 text-center rounded-3xl border border-slate-200 dark:border-white/10 space-y-3">
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
                <div key={item.id} className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 hover:border-slate-300 dark:hover:border-white/20 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-white/5 pb-3">
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

                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#151518] border border-slate-200/80 dark:border-white/5 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      विषय: {item.subject}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-[#F5F2EE] whitespace-pre-line leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  {/* Internal Admin Remarks */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {editingNoteId === item.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder={isHindi ? "एडमिन रिमार्क्स / नोट्स लिखें..." : "Write internal admin remarks..."}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#151518] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
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
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6">
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

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#151518] border border-slate-200 dark:border-white/10 space-y-3 text-xs">
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
                className="w-full py-3 rounded-xl bg-slate-200/70 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold text-xs border border-slate-300/80 dark:border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4 text-[#C21F2F]" />
                <span>{isHindi ? "पासवर्ड बदलने के लिए ईमेल भेजें" : "Send Password Reset Email"}</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs border border-red-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
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
