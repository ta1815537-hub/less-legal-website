import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Lock, CheckCircle2, AlertTriangle, Search, Filter, 
  Trash2, Mail, Phone, ExternalLink, Copy, Check, Download, 
  MessageSquare, User, Clock, ShieldAlert, Sparkles, Server, 
  ChevronRight, Save, Edit3, Eye, FileText, Send
} from 'lucide-react';
import { 
  adminStorage, 
  JobApplication, 
  SiteAppConfig 
} from '../utils/adminStorage';
import { useLanguage } from '../context/LanguageContext';

interface AdminHiringControlPanelProps {
  adminEmail?: string;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

export const AdminHiringControlPanel: React.FC<AdminHiringControlPanelProps> = ({
  adminEmail,
  onShowToast
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // State
  const [config, setConfig] = useState<SiteAppConfig>(adminStorage.getSiteAppConfig());
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Candidate Note editing
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load config and listen to applications
  useEffect(() => {
    // Config listener
    const unsubConfig = adminStorage.listenSiteAppConfig((cfg) => {
      setConfig(cfg);
    });

    // Job applications real-time listener
    const unsubApps = adminStorage.listenJobApplications((apps) => {
      setApplications(apps);
    });

    return () => {
      unsubConfig();
      unsubApps();
    };
  }, []);

  // Save Portal Control Status
  const handleSavePortalStatus = async (newStatus: 'maintenance' | 'open' | 'closed') => {
    setIsSavingConfig(true);
    try {
      const updated: SiteAppConfig = {
        ...config,
        hiringPortalStatus: newStatus,
        lastUpdated: new Date().toISOString(),
        updatedBy: adminEmail || 'Admin'
      };
      await adminStorage.updateSiteAppConfig(updated);
      setConfig(updated);
      onShowToast(
        isHindi 
          ? `हायरिंग पोर्टल स्थिति '${newStatus === 'maintenance' ? 'मेंटेनेंस (Locked)' : newStatus === 'open' ? 'ओपन (स्वीकार्य)' : 'बंद'}' पर सेट हो गई!` 
          : `Hiring portal status updated to '${newStatus.toUpperCase()}'!`,
        'success'
      );
    } catch (err) {
      console.error('Failed to update portal status', err);
      onShowToast(isHindi ? 'स्थिति अपडेट करने में विफल!' : 'Failed to update portal status!', 'error');
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Save Custom Maintenance Notice Message
  const handleSaveMaintenanceMessage = async () => {
    setIsSavingConfig(true);
    try {
      const updated: SiteAppConfig = {
        ...config,
        lastUpdated: new Date().toISOString(),
        updatedBy: adminEmail || 'Admin'
      };
      await adminStorage.updateSiteAppConfig(updated);
      setConfig(updated);
      onShowToast(isHindi ? 'मेंटेनेंस संदेश सफलतापूर्वक सहेजा गया!' : 'Maintenance notice saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to save message', err);
      onShowToast(isHindi ? 'संदेश सहेजने में विफल!' : 'Failed to save notice message!', 'error');
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Status Updater for candidate application
  const handleUpdateAppStatus = async (id: string, status: JobApplication['status']) => {
    try {
      await adminStorage.updateJobApplicationStatus(id, status);
      onShowToast(isHindi ? 'उम्मीदवार की स्थिति अपडेट हो गई!' : 'Application status updated!', 'success');
    } catch (err) {
      console.error('Failed to update app status', err);
      onShowToast(isHindi ? 'स्थिति अपडेट विफल!' : 'Failed to update status!', 'error');
    }
  };

  // Save internal admin note
  const handleSaveAdminNote = async (id: string) => {
    try {
      const target = applications.find(a => a.id === id);
      if (target) {
        await adminStorage.updateJobApplicationStatus(id, target.status, noteInput);
        setEditingNoteId(null);
        setNoteInput('');
        onShowToast(isHindi ? 'आंतरिक नोट सहेजा गया!' : 'Admin note saved!', 'success');
      }
    } catch (err) {
      console.error('Failed to save note', err);
      onShowToast(isHindi ? 'नोट सहेजने में विफल!' : 'Failed to save note!', 'error');
    }
  };

  // Delete application
  const handleDeleteApp = async (id: string) => {
    if (confirm(isHindi ? 'क्या आप इस आवेदन को स्थायी रूप से हटाना चाहते हैं?' : 'Are you sure you want to delete this candidate application?')) {
      try {
        await adminStorage.deleteJobApplication(id);
        onShowToast(isHindi ? 'आवेदन हटा दिया गया!' : 'Application deleted successfully!', 'success');
      } catch (err) {
        console.error('Failed to delete app', err);
        onShowToast(isHindi ? 'आवेदन हटाने में विफल!' : 'Failed to delete application!', 'error');
      }
    }
  };

  // Copy candidate details
  const handleCopyCandidate = (app: JobApplication) => {
    const text = `Candidate: ${app.fullName}\nRole: ${app.roleTitle || app.roleId}\nPhone: ${app.phone}\nEmail: ${app.email}\nExperience: ${app.experience}\nPortfolio: ${app.portfolioUrl || 'N/A'}\nMessage: ${app.aboutYou || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(app.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (applications.length === 0) {
      onShowToast(isHindi ? 'एक्सपोर्ट हेतु कोई आवेदन उपलब्ध नहीं है' : 'No applications to export', 'error');
      return;
    }
    const headers = ['ID', 'FullName', 'Role', 'Email', 'Phone', 'Experience', 'Portfolio', 'Status', 'SubmittedAt', 'AdminNotes'];
    const rows = applications.map(a => [
      `"${a.id}"`,
      `"${a.fullName.replace(/"/g, '""')}"`,
      `"${(a.roleTitle || a.roleId).replace(/"/g, '""')}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.experience}"`,
      `"${(a.portfolioUrl || '').replace(/"/g, '""')}"`,
      `"${a.status}"`,
      `"${a.submittedAt}"`,
      `"${(a.adminNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Less_Creation_Candidates_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery) ||
      (app.roleTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.aboutYou || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || app.roleId === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate stats
  const totalApps = applications.length;
  const newAppsCount = applications.filter(a => a.status === 'New').length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const contactedCount = applications.filter(a => a.status === 'Contacted').length;

  const isServerLocked = (config.hiringPortalStatus || 'maintenance') === 'maintenance';

  return (
    <div className="space-y-6 relative z-10">
      {/* SECTION 1: MASTER HIRING PORTAL SERVER CONTROLLER */}
      <div className="p-5 sm:p-6 rounded-[24px] bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${
              isServerLocked 
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' 
                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            }`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isHindi ? 'हायरिंग पोर्टल व सर्वर कंट्रोल सेक्शन' : 'Hiring Portal & Server Control Section'}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                  isServerLocked 
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30' 
                    : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                }`}>
                  {isServerLocked ? (isHindi ? '🔒 सर्वर मेंटेनेंस (Locked)' : '🔒 Under Maintenance (Locked)') : (isHindi ? '🟢 लाइव (चालू)' : '🟢 Online (Open)')}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {isHindi 
                  ? 'यहाँ से आप जॉब फॉर्म सबमिशन बटन को लॉक/अनलॉक कर सकते हैं और मेंटेनेंस सूचना बदल सकते हैं।'
                  : 'Control whether candidates can submit job applications or if the server stays locked under maintenance.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{isHindi ? 'उम्मीदवार CSV' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

        {/* State Toggle Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleSavePortalStatus('maintenance')}
            disabled={isSavingConfig}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
              config.hiringPortalStatus === 'maintenance'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-900 dark:text-amber-200 shadow-xs'
                : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-amber-500/30'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
                <span>{isHindi ? '1. सर्वर मेंटेनेंस (Locked)' : '1. Under Maintenance (Locked)'}</span>
                {config.hiringPortalStatus === 'maintenance' && <Check className="w-3.5 h-3.5 text-amber-600" />}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {isHindi ? 'फॉर्म सबमिट बटन लॉक रहेगा। कोई डेटा नहीं भेजा जाएगा।' : 'Submit button is locked. No applications will be sent.'}
              </p>
            </div>
          </button>

          <button
            onClick={() => handleSavePortalStatus('open')}
            disabled={isSavingConfig}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
              config.hiringPortalStatus === 'open'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-900 dark:text-emerald-200 shadow-xs'
                : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-emerald-500/30'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
                <span>{isHindi ? '2. खुला / चालू (Open for Applications)' : '2. Open for Applications'}</span>
                {config.hiringPortalStatus === 'open' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {isHindi ? 'फॉर्म सबमिट बटन अनलॉक रहेगा। उम्मीदवार डेटा सीधे यहाँ दिखेगा।' : 'Applications active. Candidates can submit & data appears here.'}
              </p>
            </div>
          </button>

          <button
            onClick={() => handleSavePortalStatus('closed')}
            disabled={isSavingConfig}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
              config.hiringPortalStatus === 'closed'
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-900 dark:text-rose-200 shadow-xs'
                : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-rose-500/30'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
                <span>{isHindi ? '3. पूर्णतः बंद (Closed)' : '3. Closed'}</span>
                {config.hiringPortalStatus === 'closed' && <Check className="w-3.5 h-3.5 text-rose-600" />}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {isHindi ? 'हायरिंग बंद घोषित की जाएगी।' : 'Hiring cycle announced closed.'}
              </p>
            </div>
          </button>
        </div>

        {/* Maintenance Message Editors */}
        <div className="pt-2 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isHindi ? 'मेंटेनेंस सूचना (हिंदी)' : 'Maintenance Banner Text (Hindi)'}
              </label>
              <textarea
                rows={2}
                value={config.hiringMaintenanceMessageHi || ''}
                onChange={(e) => setConfig({ ...config, hiringMaintenanceMessageHi: e.target.value })}
                placeholder="हायरिंग व आवेदन सर्वर वर्तमान में मेंटेनेंस पर है..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isHindi ? 'मेंटेनेंस सूचना (English)' : 'Maintenance Banner Text (English)'}
              </label>
              <textarea
                rows={2}
                value={config.hiringMaintenanceMessageEn || ''}
                onChange={(e) => setConfig({ ...config, hiringMaintenanceMessageEn: e.target.value })}
                placeholder="Hiring application server is currently under maintenance..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveMaintenanceMessage}
              disabled={isSavingConfig}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingConfig ? (isHindi ? 'सहेज रहे हैं...' : 'Saving...') : (isHindi ? 'सूचना संदेश सहेजें' : 'Save Notice Message')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 rounded-[22px] border border-white/80 dark:border-white/10 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <Briefcase className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{isHindi ? 'कुल आवेदन' : 'Total Applications'}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{totalApps}</p>
        </div>

        <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 rounded-[22px] border border-white/80 dark:border-white/10 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{isHindi ? 'नए (समीक्षा बाकी)' : 'New / Unreviewed'}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{newAppsCount}</p>
        </div>

        <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 rounded-[22px] border border-white/80 dark:border-white/10 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{isHindi ? 'शॉर्टलिस्टेड' : 'Shortlisted'}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{shortlistedCount}</p>
        </div>

        <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 rounded-[22px] border border-white/80 dark:border-white/10 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <MessageSquare className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{isHindi ? 'संपर्क किया गया' : 'Contacted'}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{contactedCount}</p>
        </div>
      </div>

      {/* SECTION 3: SEARCH & FILTERS TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-3.5 sm:p-4 rounded-2xl border border-white/80 dark:border-white/10 shadow-2xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? 'नाम, ईमेल, फोन नंबर या कौशल से खोजें...' : 'Search by name, email, phone or skills...'}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-500">{isHindi ? 'भूमिका:' : 'Role:'}</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1C2230] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">{isHindi ? 'सभी रोल्स' : 'All Roles'}</option>
              <option value="android-dev">Android Developer</option>
              <option value="react-frontend">React / Frontend Engineer</option>
              <option value="ui-ux-designer">UI/UX Designer</option>
              <option value="legal-researcher">Legal Researcher</option>
              <option value="growth-support">Growth & Support</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500">{isHindi ? 'स्थिति:' : 'Status:'}</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1C2230] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">{isHindi ? 'सभी स्थितियां' : 'All Statuses'}</option>
              <option value="New">New (नया)</option>
              <option value="Reviewed">Reviewed (समीक्षित)</option>
              <option value="Shortlisted">Shortlisted (चयनित)</option>
              <option value="Contacted">Contacted (संपर्क किया)</option>
              <option value="Rejected">Rejected (अस्वीकृत)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 4: CANDIDATE APPLICATION CARDS */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-12 text-center rounded-[28px] border border-white/80 dark:border-white/10 space-y-3 shadow-2xs">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              {isHindi ? 'वर्तमान में कोई उम्मीदवार आवेदन नहीं है' : 'No Candidate Applications Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {isServerLocked 
                ? (isHindi ? 'सर्वर वर्तमान में मेंटेनेंस मोड पर है (Locked), इसलिए नए आवेदन रोके गए हैं। जब आप ऊपर से सर्वर को "ओपन" करेंगे, तो उम्मीदवार द्वारा फॉर्म भरते ही यहाँ तुरंत लाइव दिखेगा।' : 'Hiring portal is currently under maintenance (Locked). When you toggle status to "Open", candidate submissions will appear here automatically in real time.')
                : (isHindi ? 'जैसे ही उम्मीदवार वेबसाइट पर फॉर्म सबमिट करेंगे, उनका डेटा यहाँ रियल-टाइम में स्वतः दिखेगा।' : 'Applications submitted by candidates will appear here automatically in real time.')}
            </p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 sm:p-6 rounded-[24px] border border-white/80 dark:border-white/10 space-y-4 hover:shadow-md transition-all shadow-2xs"
            >
              {/* Header row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm">
                    {app.fullName.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        {app.fullName}
                      </h4>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500">
                        {app.id}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(app.submittedAt).toLocaleString(isHindi ? 'hi-IN' : 'en-US')}
                    </span>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2">
                  <select
                    value={app.status}
                    onChange={(e) => handleUpdateAppStatus(app.id, e.target.value as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border cursor-pointer ${
                      app.status === 'New' 
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' 
                        : app.status === 'Shortlisted'
                        ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30'
                        : app.status === 'Contacted'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        : app.status === 'Rejected'
                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-200'
                    }`}
                  >
                    <option value="New">New (नया)</option>
                    <option value="Reviewed">Reviewed (समीक्षित)</option>
                    <option value="Shortlisted">Shortlisted (चयनित)</option>
                    <option value="Contacted">Contacted (संपर्क किया)</option>
                    <option value="Rejected">Rejected (अस्वीकृत)</option>
                    <option value="Archived">Archived (संग्रहित)</option>
                  </select>

                  <button
                    onClick={() => handleDeleteApp(app.id)}
                    title={isHindi ? 'आवेदन हटाएं' : 'Delete Application'}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Meta information tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {app.roleTitle || app.roleId}
                </span>

                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  {isHindi ? 'अनुभव:' : 'Exp:'} {app.experience}
                </span>

                {app.portfolioUrl && (
                  <a
                    href={app.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{isHindi ? 'पोर्टफोलियो / गिटहब' : 'Portfolio / GitHub'}</span>
                  </a>
                )}
              </div>

              {/* Pitch / Message */}
              {app.aboutYou && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {isHindi ? 'उम्मीदवार का संदेश / प्रोजेक्ट्स:' : 'Candidate Summary / Projects:'}
                  </strong>
                  {app.aboutYou}
                </div>
              )}

              {/* Contact Actions Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/10">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <a
                    href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${app.fullName}, this is Anurag Gurauli from Less Creation regarding your application for ${app.roleTitle || 'the role'}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp ({app.phone})</span>
                  </a>

                  <a
                    href={`mailto:${app.email}?subject=${encodeURIComponent(
                      `Less Creation Job Application - ${app.roleTitle || 'Candidate Profile'}`
                    )}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email ({app.email})</span>
                  </a>

                  <button
                    onClick={() => handleCopyCandidate(app)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 border border-slate-200 dark:border-white/10 cursor-pointer transition-colors"
                  >
                    {copiedId === app.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === app.id ? (isHindi ? 'कॉपी हो गया' : 'Copied') : (isHindi ? 'डेटा कॉपी करें' : 'Copy')}</span>
                  </button>
                </div>

                {/* Internal Admin Notes Toggle */}
                <div>
                  {editingNoteId === app.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder={isHindi ? 'एडमिन नोट दर्ज करें...' : 'Enter internal admin note...'}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveAdminNote(app.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer hover:bg-blue-700"
                      >
                        {isHindi ? 'सहेजें' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                      >
                        {isHindi ? 'रद्द' : 'Cancel'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingNoteId(app.id);
                        setNoteInput(app.adminNotes || '');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{app.adminNotes ? `${isHindi ? 'नोट:' : 'Note:'} ${app.adminNotes}` : (isHindi ? '+ एडमिन नोट जोड़ें' : '+ Add Note')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
