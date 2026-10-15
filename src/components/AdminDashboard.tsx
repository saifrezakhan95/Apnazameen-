import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Check, 
  Trash2, 
  Edit3, 
  Plus, 
  Download, 
  TrendingUp, 
  PhoneCall, 
  MessageCircle, 
  Calendar, 
  FileText, 
  Settings, 
  AlertTriangle, 
  RefreshCw,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Globe,
  Copy
} from 'lucide-react';
import { 
  Property, 
  PropertySubmission, 
  BuyerRequirement, 
  SiteVisitRequest, 
  ListingReport, 
  PlatformSettings, 
  VerificationStatus, 
  AvailabilityStatus 
} from '../types';
import { mockStore, AnalyticsSummary } from '../data/mockStore';
import { formatINR, buildWhatsAppLink } from '../utils/formatters';
import { PropertyFormModal } from './PropertyFormModal';

interface AdminDashboardProps {
  settings: PlatformSettings;
  properties: Property[];
  onClose: () => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  properties,
  onClose,
  onRefreshData,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'listings' | 'submissions' | 'buyers' | 'visits' | 'reports' | 'settings'>('listings');

  // Submissions State
  const [submissions, setSubmissions] = useState<PropertySubmission[]>(mockStore.getSubmissions());
  const [buyerReqs, setBuyerReqs] = useState<BuyerRequirement[]>(mockStore.getBuyerRequirements());
  const [siteVisits, setSiteVisits] = useState<SiteVisitRequest[]>(mockStore.getSiteVisits());
  const [reports, setReports] = useState<ListingReport[]>(mockStore.getReports());
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(mockStore.getAnalytics());

  // Edit/Add Property Form State
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Safe In-UI Delete & Reject Modals (never use window.confirm or window.prompt)
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [submissionToReject, setSubmissionToReject] = useState<PropertySubmission | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [feedbackBanner, setFeedbackBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Property Filters in Admin
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<string>('all');
  const [adminAvailabilityFilter, setAdminAvailabilityFilter] = useState<string>('all');

  // Settings State
  const [editableSettings, setEditableSettings] = useState<PlatformSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    try {
      navigator.clipboard?.writeText(text);
      setCopiedRecord(label);
      setTimeout(() => setCopiedRecord(null), 2500);
    } catch {
      // Fallback
      setCopiedRecord(label);
      setTimeout(() => setCopiedRecord(null), 2500);
    }
  };

  // Search in admin
  const [adminSearch, setAdminSearch] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'admin123' || pinInput === '9876') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect PIN. (Default demo PIN is: admin123)');
    }
  };

  const reloadAll = () => {
    setSubmissions(mockStore.getSubmissions());
    setBuyerReqs(mockStore.getBuyerRequirements());
    setSiteVisits(mockStore.getSiteVisits());
    setReports(mockStore.getReports());
    setAnalytics(mockStore.getAnalytics());
    onRefreshData();
  };

  // Property Create & Edit Actions
  const handleSaveProperty = (savedProp: Property) => {
    if (editingProperty) {
      mockStore.updateProperty(savedProp);
      setEditingProperty(null);
      setFeedbackBanner({ 
        type: 'success', 
        message: `Property ${savedProp.id} ("${savedProp.title}") updated successfully!` 
      });
    } else {
      mockStore.addProperty(savedProp);
      setIsAddingNew(false);
      setFeedbackBanner({ 
        type: 'success', 
        message: `New property ${savedProp.id} ("${savedProp.title}") listed successfully and is now live!` 
      });
    }
    reloadAll();
    setTimeout(() => setFeedbackBanner(null), 4500);
  };

  // Safe Property Deletion Action
  const confirmDeleteProperty = () => {
    if (propertyToDelete) {
      const id = propertyToDelete.id;
      const title = propertyToDelete.title;
      mockStore.deleteProperty(id);
      setPropertyToDelete(null);
      reloadAll();
      setFeedbackBanner({ 
        type: 'success', 
        message: `Property ${id} ("${title}") was permanently deleted.` 
      });
      setTimeout(() => setFeedbackBanner(null), 4000);
    }
  };

  // Property Availability & Verification Quick Toggles
  const handleUpdateAvailability = (id: string, status: AvailabilityStatus) => {
    const prop = mockStore.getPropertyById(id);
    if (prop) {
      prop.availability = status;
      prop.lastUpdated = new Date().toISOString().split('T')[0];
      mockStore.updateProperty(prop);
      reloadAll();
      setFeedbackBanner({ type: 'success', message: `Status for ${id} updated to ${status}.` });
      setTimeout(() => setFeedbackBanner(null), 3000);
    }
  };

  const handleUpdateVerification = (id: string, status: VerificationStatus) => {
    const prop = mockStore.getPropertyById(id);
    if (prop) {
      prop.verificationStatus = status;
      prop.lastUpdated = new Date().toISOString().split('T')[0];
      prop.verifiedBy = 'Admin Moderator';
      prop.verificationDate = new Date().toISOString().split('T')[0];
      mockStore.updateProperty(prop);
      reloadAll();
      setFeedbackBanner({ type: 'success', message: `Verification for ${id} updated to ${status}.` });
      setTimeout(() => setFeedbackBanner(null), 3000);
    }
  };

  const handleToggleFeatured = (id: string) => {
    const prop = mockStore.getPropertyById(id);
    if (prop) {
      prop.isFeatured = !prop.isFeatured;
      mockStore.updateProperty(prop);
      reloadAll();
      setFeedbackBanner({ 
        type: 'success', 
        message: prop.isFeatured ? `${id} marked as Featured on Homepage.` : `${id} unfeatured.` 
      });
      setTimeout(() => setFeedbackBanner(null), 3000);
    }
  };

  // Submissions Actions (No window.alert or window.prompt)
  const handleApproveSubmission = (subId: string) => {
    const newProp = mockStore.approveSubmission(subId, 'contact_verified');
    if (newProp) {
      reloadAll();
      setFeedbackBanner({ 
        type: 'success', 
        message: `Submission approved! Created new active listing ID: ${newProp.id} ("${newProp.title}")` 
      });
      setTimeout(() => setFeedbackBanner(null), 5000);
    }
  };

  const openRejectModal = (sub: PropertySubmission) => {
    setSubmissionToReject(sub);
    setRejectionReason('Details could not be verified by local coordinator');
  };

  const confirmRejectSubmission = () => {
    if (submissionToReject) {
      const reason = rejectionReason.trim() || 'Incomplete or unverified details';
      mockStore.rejectSubmission(submissionToReject.id, reason);
      setSubmissionToReject(null);
      setRejectionReason('');
      reloadAll();
      setFeedbackBanner({ type: 'success', message: `Submission ${submissionToReject.id} was rejected.` });
      setTimeout(() => setFeedbackBanner(null), 3500);
    }
  };

  // Site Visit Actions
  const handleUpdateVisitStatus = (visitId: string, status: SiteVisitRequest['status']) => {
    mockStore.updateSiteVisitStatus(visitId, status);
    reloadAll();
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.updateSettings(editableSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
    reloadAll();
    onRefreshData();
  };

  // Export CSV Download
  const handleExportPropertiesCSV = () => {
    const csv = mockStore.exportPropertiesToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `apnazameen_properties_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportRequirementsCSV = () => {
    const csv = mockStore.exportRequirementsToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `apnazameen_buyer_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProperties = properties.filter((p) => {
    if (adminCategoryFilter !== 'all' && p.category !== adminCategoryFilter) return false;
    if (adminAvailabilityFilter !== 'all' && p.availability !== adminAvailabilityFilter) return false;
    if (!adminSearch.trim()) return true;
    const q = adminSearch.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.locality.toLowerCase().includes(q) ||
      p.contactName.toLowerCase().includes(q) ||
      p.contactPhone.includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col">
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-stone-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                ApnaZameen Admin & Operations Center
              </h2>
              <p className="text-[11px] text-stone-400">
                Chakia & Chandauli Real Estate Moderation, Verification & Lead CRM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Admin Session Active
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {!isAuthenticated ? (
            /* Authentication Screen */
            <div className="max-w-md mx-auto py-12 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8 text-stone-800" />
              </div>
              <div>
                <h3 className="text-xl font-black text-stone-900">Operator Authentication</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Access to private buyer budgets, seller phone logs, and verification tools is restricted to authorized local administrators.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter Admin PIN / Passkey (e.g. admin123)"
                  className="w-full px-4 py-2.5 text-center text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-widest"
                  autoFocus
                />
                {authError && <p className="text-xs text-red-600 font-semibold">{authError}</p>}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
                >
                  Unlock Admin Console
                </button>
              </form>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 text-left">
                💡 <strong>Demo Helper:</strong> Use default passcode <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">admin123</code> to test the complete backend and listing management workflow.
              </div>
            </div>
          ) : (
            /* Authenticated Admin Dashboard */
            <div className="space-y-6">
              {/* Operation Feedback Toast / Banner */}
              {feedbackBanner && (
                <div className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold shadow-xs transition ${
                  feedbackBanner.type === 'success'
                    ? 'bg-emerald-50 text-emerald-950 border border-emerald-300'
                    : 'bg-red-50 text-red-950 border border-red-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {feedbackBanner.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{feedbackBanner.message}</span>
                  </div>
                  <button
                    onClick={() => setFeedbackBanner(null)}
                    className="p-1 hover:opacity-70 text-stone-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Summary Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Live Properties</span>
                  <span className="text-2xl font-black text-stone-900">{properties.length}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    {properties.filter((p) => p.availability === 'available').length} Active for Sale
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Submissions Queue</span>
                  <span className="text-2xl font-black text-amber-950">
                    {submissions.filter((s) => s.status === 'pending_review').length}
                  </span>
                  <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">Pending Review</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">Buyer Leads</span>
                  <span className="text-2xl font-black text-blue-950">{buyerReqs.length}</span>
                  <span className="text-[10px] text-blue-700 font-semibold block mt-0.5">Purchase Requests</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                  <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">Site Visits</span>
                  <span className="text-2xl font-black text-purple-950">{siteVisits.length}</span>
                  <span className="text-[10px] text-purple-700 font-semibold block mt-0.5">Appointments</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">WhatsApp Clicks</span>
                  <span className="text-2xl font-black text-emerald-950">{analytics.whatsappClicks}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Direct Lead Inquiries</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-2">
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setActiveTab('listings')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === 'listings'
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    Properties ({properties.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      activeTab === 'submissions'
                        ? 'bg-amber-600 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>Submissions</span>
                    {submissions.filter((s) => s.status === 'pending_review').length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px]">
                        {submissions.filter((s) => s.status === 'pending_review').length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('buyers')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === 'buyers'
                        ? 'bg-blue-600 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    Buyer Leads ({buyerReqs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('visits')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === 'visits'
                        ? 'bg-purple-600 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    Site Visits ({siteVisits.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === 'reports'
                        ? 'bg-red-600 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    Reported ({reports.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      activeTab === 'settings'
                        ? 'bg-stone-700 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </button>
                </div>

                {/* CSV Export & Data Backup buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportPropertiesCSV}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 flex items-center gap-1"
                    title="Export Properties to CSV (Open in Google Sheets/Excel)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export Properties CSV</span>
                  </button>
                  <button
                    onClick={handleExportRequirementsCSV}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 flex items-center gap-1"
                    title="Export Buyer Leads to CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export Buyer Leads</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: PROPERTIES MANAGER */}
              {activeTab === 'listings' && (
                <div className="space-y-4">
                  {/* Top Action Bar: Search, Filters & Add Property Button */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                      <div className="relative flex-1 min-w-[180px] max-w-xs">
                        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={adminSearch}
                          onChange={(e) => setAdminSearch(e.target.value)}
                          placeholder="Search ID, title, locality, phone..."
                          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-300"
                        />
                      </div>

                      <select
                        value={adminCategoryFilter}
                        onChange={(e) => setAdminCategoryFilter(e.target.value)}
                        className="text-xs py-1.5 px-2.5 rounded-xl border border-stone-300 bg-white font-medium"
                      >
                        <option value="all">All Categories</option>
                        <option value="agricultural_land">Agricultural Land</option>
                        <option value="residential_plot">Residential Plot</option>
                        <option value="commercial_land">Commercial Land</option>
                        <option value="commercial_shop">Commercial Shop</option>
                        <option value="house_villa">House / Villa</option>
                      </select>

                      <select
                        value={adminAvailabilityFilter}
                        onChange={(e) => setAdminAvailabilityFilter(e.target.value)}
                        className="text-xs py-1.5 px-2.5 rounded-xl border border-stone-300 bg-white font-medium"
                      >
                        <option value="all">All Statuses</option>
                        <option value="available">Available</option>
                        <option value="under_discussion">Under Token</option>
                        <option value="sold">Sold Out</option>
                      </select>
                    </div>

                    {/* Prominent "+ List New Property" Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProperty(null);
                        setIsAddingNew(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/25 transition cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>+ List New Property (नया प्लॉट जोड़ें)</span>
                    </button>
                  </div>

                  {/* Listings Table */}
                  <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-stone-700">
                        <thead className="bg-stone-100 text-stone-600 font-bold uppercase text-[10px] tracking-wider border-b border-stone-200">
                          <tr>
                            <th className="py-3 px-3">Property</th>
                            <th className="py-3 px-3">Category</th>
                            <th className="py-3 px-3">Price & Area</th>
                            <th className="py-3 px-3">Contact</th>
                            <th className="py-3 px-3">Verification</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {filteredProperties.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-stone-400">
                                <p className="font-semibold text-xs">No properties found matching your criteria.</p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProperty(null);
                                    setIsAddingNew(true);
                                  }}
                                  className="mt-2 text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>List your first property</span>
                                </button>
                              </td>
                            </tr>
                          ) : (
                            filteredProperties.map((p) => (
                              <tr key={p.id} className="hover:bg-stone-50 transition">
                                <td className="py-3 px-3">
                                  <div className="font-bold text-stone-900 font-mono text-emerald-800 flex items-center gap-1.5">
                                    <span>{p.id}</span>
                                    {p.isFeatured && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold font-sans">
                                        Featured
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-semibold text-stone-800 line-clamp-1 max-w-xs">{p.title}</div>
                                  <div className="text-[11px] text-stone-500">{p.locality}, {p.tehsil}</div>
                                </td>

                                <td className="py-3 px-3 whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded bg-stone-100 font-medium text-[11px]">
                                    {p.category.replace('_', ' ')}
                                  </span>
                                </td>

                                <td className="py-3 px-3 whitespace-nowrap">
                                  <div className="font-bold text-stone-900">{formatINR(p.price)}</div>
                                  <div className="text-[11px] text-stone-500">
                                    {p.plotArea} {p.plotAreaUnit}
                                  </div>
                                </td>

                                <td className="py-3 px-3">
                                  <div className="font-semibold text-stone-800">{p.contactName}</div>
                                  <div className="text-[11px] text-stone-500">{p.contactPhone}</div>
                                  <div className="text-[10px] text-emerald-700 font-medium capitalize">{p.contactRole}</div>
                                </td>

                                <td className="py-3 px-3">
                                  <select
                                    value={p.verificationStatus}
                                    onChange={(e) => handleUpdateVerification(p.id, e.target.value as VerificationStatus)}
                                    className="text-[11px] p-1 rounded-lg border border-stone-300 font-semibold bg-white"
                                  >
                                    <option value="pending_review">Pending Review</option>
                                    <option value="contact_verified">Contact Verified</option>
                                    <option value="availability_confirmed">Availability Confirmed</option>
                                    <option value="documents_reviewed">Title Docs Reviewed</option>
                                  </select>
                                </td>

                                <td className="py-3 px-3">
                                  <select
                                    value={p.availability}
                                    onChange={(e) => handleUpdateAvailability(p.id, e.target.value as AvailabilityStatus)}
                                    className={`text-[11px] p-1 rounded-lg border font-bold ${
                                      p.availability === 'available'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                        : p.availability === 'sold'
                                        ? 'bg-red-50 text-red-800 border-red-300'
                                        : 'bg-amber-50 text-amber-800 border-amber-300'
                                    }`}
                                  >
                                    <option value="available">Available</option>
                                    <option value="under_discussion">Under Token</option>
                                    <option value="sold">Sold Out</option>
                                  </select>
                                </td>

                                <td className="py-3 px-3 text-right whitespace-nowrap space-x-1">
                                  {/* Edit Property Button */}
                                  <button
                                    type="button"
                                    onClick={() => setEditingProperty(p)}
                                    className="p-1.5 rounded-lg text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 transition border border-stone-200 hover:border-emerald-300"
                                    title="Edit Full Property Details (Price, Area, Photos, Contact)"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Toggle Featured Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleFeatured(p.id)}
                                    className={`p-1.5 rounded-lg border transition ${
                                      p.isFeatured ? 'bg-amber-100 text-amber-800 border-amber-300' : 'text-stone-400 hover:text-amber-600 border-stone-200'
                                    }`}
                                    title={p.isFeatured ? 'Featured on Homepage (Click to Unfeature)' : 'Mark as Featured Listing'}
                                  >
                                    ★
                                  </button>

                                  {/* Delete Property Button (Safe In-App Modal, No window.confirm) */}
                                  <button
                                    type="button"
                                    onClick={() => setPropertyToDelete(p)}
                                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition border border-stone-200 hover:border-red-300"
                                    title="Delete Property Permanently"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SUBMISSIONS MODERATION QUEUE */}
              {activeTab === 'submissions' && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    🛡️ <strong>Listing Moderation Rule:</strong> New submissions are NOT published publicly until you review the submitter's phone number and property title. Approving creates a live listing with initial verified status.
                  </div>

                  {submissions.length === 0 ? (
                    <div className="text-center py-12 text-stone-400 text-xs">
                      No property submissions in queue.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {submissions.map((sub) => (
                        <div key={sub.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-mono text-xs font-bold text-stone-500">{sub.id}</span>
                              <h4 className="font-bold text-stone-900 text-sm mt-0.5">{sub.title}</h4>
                              <p className="text-xs text-stone-500">{sub.locality}, {sub.tehsil}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              sub.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sub.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {sub.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl">
                            <div>Price: <strong>{formatINR(sub.price)}</strong></div>
                            <div>Area: <strong>{sub.plotArea} {sub.plotAreaUnit}</strong></div>
                            <div>Submitter: <strong>{sub.submitterName} ({sub.submitterType})</strong></div>
                            <div>Phone: <strong>{sub.phone}</strong></div>
                          </div>

                          <p className="text-xs text-stone-600 italic">"{sub.description}"</p>

                          {sub.status === 'pending_review' && (
                            <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                              <a
                                href={`tel:${sub.phone}`}
                                className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 flex items-center gap-1"
                              >
                                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Call Submitter</span>
                              </a>

                              <button
                                onClick={() => handleApproveSubmission(sub.id)}
                                className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve & Publish</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => openRejectModal(sub)}
                                className="py-1.5 px-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs cursor-pointer transition"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: BUYER LEADS */}
              {activeTab === 'buyers' && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900">
                    🔒 <strong>Confidential Buyer Registry:</strong> These buyer leads are hidden from public view. You can match them with available properties and directly initiate WhatsApp dialogue.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {buyerReqs.map((req) => (
                      <div key={req.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono text-xs font-bold text-stone-400">{req.id}</span>
                            <h4 className="font-bold text-stone-900 text-sm">{req.fullName}</h4>
                            <p className="text-xs text-stone-500">Submitted: {req.dateSubmitted}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                            {req.category.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="bg-stone-50 p-2.5 rounded-xl text-xs space-y-1">
                          <div>Budget: <strong>{formatINR(req.minBudget)} – {formatINR(req.maxBudget)}</strong></div>
                          <div>Preferred Area: <strong>{req.requiredAreaMin} to {req.requiredAreaMax} {req.areaUnit}</strong></div>
                          <div>Intended Use: <strong>{req.intendedUse.replace('_', ' ')}</strong></div>
                          <div>Road Access: <strong>{req.roadAccessRequirement}</strong></div>
                          {req.notes && <div className="text-stone-500 italic mt-1">"{req.notes}"</div>}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                          <span className="font-bold text-xs text-stone-700">{req.phone}</span>
                          <div className="flex items-center gap-2">
                            <a
                              href={buildWhatsAppLink(
                                req.whatsapp || req.phone,
                                `Hello ${req.fullName}, I am following up on your property requirement on ApnaZameen (${req.category.replace('_', ' ')} in budget ${formatINR(req.maxBudget)} in Chakia/Chandauli). We have some verified matching options.`
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp Buyer</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SITE VISITS */}
              {activeTab === 'visits' && (
                <div className="space-y-4">
                  {siteVisits.length === 0 ? (
                    <div className="text-center py-12 text-stone-400 text-xs">
                      No site visit requests recorded yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {siteVisits.map((v) => (
                        <div key={v.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-stone-500">{v.id}</span>
                              <strong className="text-stone-900">{v.visitorName}</strong>
                              <span className="text-stone-500">({v.phone})</span>
                            </div>
                            <div className="text-stone-700 mt-1">
                              Property: <strong>{v.propertyTitle}</strong> (ID: {v.propertyId})
                            </div>
                            <div className="text-stone-500 mt-0.5">
                              Date: <strong>{v.preferredDate}</strong> • Slot: <strong>{v.preferredTimeSlot.replace(/_/g, ' ')}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={v.status}
                              onChange={(e) => handleUpdateVisitStatus(v.id, e.target.value as any)}
                              className="p-1.5 rounded-xl border border-stone-300 font-bold text-xs"
                            >
                              <option value="pending_confirmation">Pending Confirmation</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>

                            <a
                              href={`tel:${v.phone}`}
                              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
                              title="Call Visitor"
                            >
                              <PhoneCall className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: REPORTS */}
              {activeTab === 'reports' && (
                <div className="space-y-3">
                  {reports.length === 0 ? (
                    <div className="text-center py-12 text-stone-400 text-xs">
                      No community reports filed.
                    </div>
                  ) : (
                    reports.map((rep) => (
                      <div key={rep.id} className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-red-950">Property: {rep.propertyTitle} ({rep.propertyId})</span>
                          <span className="text-red-700 font-mono">{rep.dateReported}</span>
                        </div>
                        <div className="font-semibold text-red-800">Reason: {rep.reason.replace(/_/g, ' ')}</div>
                        <p className="text-stone-700">{rep.details}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 6: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-3xl text-xs">
                  <form onSubmit={handleSaveSettings} className="space-y-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <div>
                        <h3 className="font-extrabold text-sm text-stone-900">Website & Platform Configuration</h3>
                        <p className="text-stone-500 text-[11px]">Configure your custom domain, brand details, and contact points.</p>
                      </div>
                      {settingsSaved && (
                        <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl font-bold flex items-center gap-1.5 text-xs animate-in fade-in">
                          <Check className="w-3.5 h-3.5" />
                          <span>Settings saved!</span>
                        </div>
                      )}
                    </div>

                    {/* DOMAIN & WEB ADDRESS SECTION */}
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                          <Globe className="w-4 h-4 text-amber-600" />
                          <span>Custom Domain & Web Address</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold text-[10px] uppercase tracking-wider">
                          Domain Setup
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-700 mb-1">
                            Primary Custom Domain
                          </label>
                          <input
                            type="text"
                            value={editableSettings.customDomain || ''}
                            onChange={(e) => {
                              const dom = e.target.value.trim().toLowerCase();
                              setEditableSettings({
                                ...editableSettings,
                                customDomain: dom,
                                websiteUrl: dom ? (dom.startsWith('http') ? dom : `https://${dom}`) : ''
                              });
                            }}
                            placeholder="e.g. apnazameen.in or www.apnazameen.com"
                            className="w-full p-2.5 rounded-xl border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                          />
                          <p className="text-[10px] text-stone-500 mt-1">
                            Your purchased domain from GoDaddy, Hostinger, Namecheap, etc.
                          </p>
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">
                            Canonical Website URL
                          </label>
                          <input
                            type="url"
                            value={editableSettings.websiteUrl || ''}
                            onChange={(e) => setEditableSettings({ ...editableSettings, websiteUrl: e.target.value })}
                            placeholder="https://apnazameen.in"
                            className="w-full p-2.5 rounded-xl border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                          />
                          <p className="text-[10px] text-stone-500 mt-1">
                            Used in SEO OpenGraph cards, WhatsApp shares, and canonical links.
                          </p>
                        </div>
                      </div>

                      {/* Domain Presets & Registrar Links */}
                      <div className="pt-2 border-t border-amber-200/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-950">
                            Recommended Domains for ApnaZameen:
                          </span>
                          <span className="text-[10px] text-amber-700 font-medium">
                            Tap to auto-fill
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { domain: 'apnazameen.page.gd', label: 'apnazameen.page.gd', badge: '★ Active DNS / Connected' },
                            { domain: 'apnazameen.in', label: 'apnazameen.in', badge: 'Best for India & UP' },
                            { domain: 'apnazameen.com', label: 'apnazameen.com', badge: '.com Global' },
                            { domain: 'apnazameen.co.in', label: 'apnazameen.co.in', badge: 'Commercial IN' },
                            { domain: 'apnazameenup.in', label: 'apnazameenup.in', badge: 'UP Regional' },
                            { domain: 'apnazameenproperties.com', label: 'apnazameenproperties.com', badge: 'Keyword' },
                          ].map((item) => {
                            const isSelected = editableSettings.customDomain === item.domain;
                            return (
                              <button
                                key={item.domain}
                                type="button"
                                onClick={() => {
                                  setEditableSettings({
                                    ...editableSettings,
                                    customDomain: item.domain,
                                    websiteUrl: `https://${item.domain}`,
                                    adminEmail: `contact@${item.domain}`,
                                  });
                                }}
                                className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono transition flex items-center gap-1.5 ${
                                  isSelected
                                    ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                                    : 'bg-white hover:bg-amber-100/70 border-amber-300/80 text-stone-800'
                                }`}
                              >
                                <span>{item.domain}</span>
                                <span
                                  className={`text-[9px] px-1 py-0.2 rounded font-sans font-semibold ${
                                    isSelected
                                      ? 'bg-amber-700 text-white'
                                      : 'bg-amber-100 text-amber-900'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex items-center gap-3 pt-1 text-[11px] text-stone-600">
                          <span className="font-semibold text-stone-700">Check Availability:</span>
                          <a
                            href={`https://in.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${encodeURIComponent(editableSettings.customDomain || 'apnazameen.in')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-800 hover:text-amber-950 underline font-medium inline-flex items-center gap-0.5"
                          >
                            <span>GoDaddy</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <span>•</span>
                          <a
                            href={`https://www.hostinger.in/domain-name-search?domain=${encodeURIComponent(editableSettings.customDomain || 'apnazameen.in')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-800 hover:text-amber-950 underline font-medium inline-flex items-center gap-0.5"
                          >
                            <span>Hostinger</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <span>•</span>
                          <a
                            href={`https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(editableSettings.customDomain || 'apnazameen.in')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-800 hover:text-amber-950 underline font-medium inline-flex items-center gap-0.5"
                          >
                            <span>Namecheap</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>

                      {editableSettings.customDomain && (
                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={editableSettings.websiteUrl || `https://${editableSettings.customDomain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-200/60 hover:bg-amber-200 text-amber-900 font-bold text-[11px] transition"
                          >
                            <span>Current Configured Address: {editableSettings.customDomain}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* BRANDING */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Platform Name</label>
                        <input
                          type="text"
                          value={editableSettings.platformName}
                          onChange={(e) => setEditableSettings({ ...editableSettings, platformName: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-stone-300 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Tagline</label>
                        <input
                          type="text"
                          value={editableSettings.tagline || ''}
                          onChange={(e) => setEditableSettings({ ...editableSettings, tagline: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Local District & State</label>
                        <input
                          type="text"
                          value={editableSettings.localDistrict}
                          onChange={(e) => setEditableSettings({ ...editableSettings, localDistrict: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Primary Tehsil / Area</label>
                        <input
                          type="text"
                          value={editableSettings.primaryTehsil}
                          onChange={(e) => setEditableSettings({ ...editableSettings, primaryTehsil: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-stone-300"
                        />
                      </div>
                    </div>

                    {/* CONTACT POINTS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          Admin WhatsApp Number (Country code 91, no plus sign)
                        </label>
                        <input
                          type="text"
                          value={editableSettings.adminWhatsAppNumber}
                          onChange={(e) => setEditableSettings({ ...editableSettings, adminWhatsAppNumber: e.target.value })}
                          placeholder="e.g. 919876543210"
                          className="w-full p-2.5 rounded-xl border border-stone-300 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Admin Helpline Phone (Display)</label>
                        <input
                          type="text"
                          value={editableSettings.adminPhoneNumber}
                          onChange={(e) => setEditableSettings({ ...editableSettings, adminPhoneNumber: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Official Contact Email</label>
                        <input
                          type="email"
                          value={editableSettings.adminEmail || ''}
                          onChange={(e) => setEditableSettings({ ...editableSettings, adminEmail: e.target.value })}
                          placeholder="e.g. contact@apnazameen.in"
                          className="w-full p-2.5 rounded-xl border border-stone-300 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Office Address</label>
                        <input
                          type="text"
                          value={editableSettings.officeAddress || ''}
                          onChange={(e) => setEditableSettings({ ...editableSettings, officeAddress: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-stone-300"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between">
                      <button
                        type="submit"
                        className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-sm flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Platform Settings</span>
                      </button>
                    </div>
                  </form>

                  {/* STEP-BY-STEP DOMAIN SETUP & DNS GUIDE */}
                  <div className="p-5 rounded-2xl bg-stone-900 text-stone-200 border border-stone-800 space-y-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-white font-black text-sm">
                          <Globe className="w-4 h-4 text-emerald-400" />
                          <span>How to Point Any Custom Domain to Your Website</span>
                        </div>
                        <p className="text-stone-400 text-xs mt-0.5">
                          Follow these 3 quick steps in your domain registrar (GoDaddy, Hostinger, Namecheap, BigRock, or Cloudflare).
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-bold text-[10px]">
                        DNS Guide
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Active Domain & URL Badge */}
                      <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Active Domain & DNS Endpoint</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white text-sm">
                              {editableSettings.customDomain || 'apnazameen.page.gd'}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-200 text-[9px] font-bold">
                              Connected
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-300">
                            Canonical URL: <a href={editableSettings.websiteUrl || `https://${editableSettings.customDomain || 'apnazameen.page.gd'}`} target="_blank" rel="noopener noreferrer" className="text-emerald-300 underline font-mono">{editableSettings.websiteUrl || `https://${editableSettings.customDomain || 'apnazameen.page.gd'}`}</a>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://dnschecker.org/#A/${encodeURIComponent(editableSettings.customDomain || 'apnazameen.page.gd')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Check DNS Live</span>
                          </a>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/60 space-y-2">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5">
                          <span>Step 1: Open DNS Management in your Registrar or DNS Provider</span>
                        </div>
                        <p className="text-stone-300 leading-relaxed text-[11px]">
                          Log in to your DNS panel (for <strong>{editableSettings.customDomain || 'apnazameen.page.gd'}</strong>) and open <strong>DNS Records / Zone Editor</strong>.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/60 space-y-2">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5">
                          <span>Step 2: Add or Update DNS Records</span>
                        </div>
                        <p className="text-stone-300 text-[11px]">
                          Add the following DNS records for <code>{editableSettings.customDomain || 'apnazameen.page.gd'}</code>:
                        </p>

                        <div className="overflow-x-auto mt-2">
                          <table className="w-full text-left font-mono text-[11px] border border-stone-700 rounded-lg overflow-hidden">
                            <thead className="bg-stone-950 text-stone-400 font-sans">
                              <tr>
                                <th className="p-2 border-b border-stone-700">Type</th>
                                <th className="p-2 border-b border-stone-700">Name / Host</th>
                                <th className="p-2 border-b border-stone-700">Target / Value</th>
                                <th className="p-2 border-b border-stone-700">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800 text-stone-200">
                              <tr>
                                <td className="p-2 font-bold text-emerald-400 font-sans">CNAME</td>
                                <td className="p-2">www</td>
                                <td className="p-2 text-stone-300">ghs.googlehosted.com</td>
                                <td className="p-2">
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard('ghs.googlehosted.com', 'cname')}
                                    className="px-2 py-1 rounded bg-stone-700 hover:bg-stone-600 text-[10px] text-white flex items-center gap-1"
                                  >
                                    <Copy className="w-2.5 h-2.5" />
                                    <span>{copiedRecord === 'cname' ? 'Copied!' : 'Copy'}</span>
                                  </button>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 font-bold text-emerald-400 font-sans">A Record</td>
                                <td className="p-2">@ (root)</td>
                                <td className="p-2 text-stone-300">216.239.32.21</td>
                                <td className="p-2">
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard('216.239.32.21', 'a1')}
                                    className="px-2 py-1 rounded bg-stone-700 hover:bg-stone-600 text-[10px] text-white flex items-center gap-1"
                                  >
                                    <Copy className="w-2.5 h-2.5" />
                                    <span>{copiedRecord === 'a1' ? 'Copied!' : 'Copy'}</span>
                                  </button>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 font-bold text-emerald-400 font-sans">A Record (Backup)</td>
                                <td className="p-2">@ (root)</td>
                                <td className="p-2 text-stone-300">216.239.34.21</td>
                                <td className="p-2">
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard('216.239.34.21', 'a2')}
                                    className="px-2 py-1 rounded bg-stone-700 hover:bg-stone-600 text-[10px] text-white flex items-center gap-1"
                                  >
                                    <Copy className="w-2.5 h-2.5" />
                                    <span>{copiedRecord === 'a2' ? 'Copied!' : 'Copy'}</span>
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/60 space-y-1.5">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5">
                          <span>Step 3: SSL & Propagation</span>
                        </div>
                        <p className="text-stone-300 leading-relaxed text-[11px]">
                          DNS records typically take between <strong>15 minutes to a few hours</strong> to propagate worldwide. Once connected to <code>{editableSettings.customDomain || 'apnazameen.page.gd'}</code>, a free SSL certificate (<code>https://</code>) provides green padlock security.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ADD / EDIT PROPERTY MODAL */}
        {(isAddingNew || editingProperty) && (
          <PropertyFormModal
            propertyToEdit={editingProperty}
            settings={settings}
            onClose={() => {
              setIsAddingNew(false);
              setEditingProperty(null);
            }}
            onSave={handleSaveProperty}
          />
        )}

        {/* DELETE PROPERTY IN-APP CONFIRMATION MODAL */}
        {propertyToDelete && (
          <div className="fixed inset-0 z-70 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Delete Property Listing?</h3>
                  <p className="text-xs font-mono text-emerald-800 font-bold">{propertyToDelete.id}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                <div className="font-bold text-stone-900 text-sm line-clamp-1">{propertyToDelete.title}</div>
                <div className="text-stone-500">{propertyToDelete.locality}, {propertyToDelete.tehsil}</div>
                <div className="text-emerald-700 font-bold text-sm pt-1">{formatINR(propertyToDelete.price)} • {propertyToDelete.plotArea} {propertyToDelete.plotAreaUnit}</div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Are you sure you want to delete this listing permanently? It will be removed immediately from public search and the database.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setPropertyToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteProperty}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Listing</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REJECT SUBMISSION IN-APP MODAL */}
        {submissionToReject && (
          <div className="fixed inset-0 z-70 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Reject Submission?</h3>
                  <p className="text-xs font-mono text-stone-500">{submissionToReject.id} • {submissionToReject.submitterName}</p>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Select or enter the reason for rejecting <strong>"{submissionToReject.title}"</strong>:
              </p>

              <div className="space-y-1.5">
                {[
                  'Duplicate property listing',
                  'Phone number unreachable / invalid',
                  'Owner did not authorize this listing',
                  'Incomplete land details or dispute reported',
                ].map((presetReason) => (
                  <button
                    key={presetReason}
                    type="button"
                    onClick={() => setRejectionReason(presetReason)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition border cursor-pointer ${
                      rejectionReason === presetReason
                        ? 'bg-red-50 border-red-300 text-red-900 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {presetReason}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Or type custom rejection reason..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500"
              />

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionToReject(null);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmRejectSubmission}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
