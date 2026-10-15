import { 
  Property, 
  PlatformSettings, 
  BuyerRequirement, 
  SiteVisitRequest, 
  PropertySubmission, 
  ListingReport 
} from '../types';
import { initialProperties, initialSettings, sampleBuyerRequirements } from './seedData';

const STORAGE_KEYS = {
  PROPERTIES: 'apnazameen_properties_v4',
  SETTINGS: 'apnazameen_settings_v4',
  BUYER_REQUIREMENTS: 'apnazameen_buyer_reqs_v4',
  SITE_VISITS: 'apnazameen_site_visits_v4',
  SUBMISSIONS: 'apnazameen_submissions_v4',
  REPORTS: 'apnazameen_reports_v4',
  ANALYTICS: 'apnazameen_analytics_v4',
};

export interface AnalyticsSummary {
  whatsappClicks: number;
  callClicks: number;
  siteVisitsRequested: number;
  totalSubmissions: number;
  totalRequirements: number;
}

export const mockStore = {
  getSettings(): PlatformSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSettings));
      return initialSettings;
    }
    try {
      const parsed = JSON.parse(raw);
      // Migrate legacy default domain to apnazameen.page.gd
      if (parsed.customDomain === 'apnazameen.in' || !parsed.customDomain) {
        parsed.customDomain = initialSettings.customDomain;
        parsed.websiteUrl = initialSettings.websiteUrl;
        if (parsed.adminEmail === 'contact@apnazameen.in') {
          parsed.adminEmail = initialSettings.adminEmail;
        }
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
      }
      return { ...initialSettings, ...parsed };
    } catch {
      return initialSettings;
    }
  },

  updateSettings(settings: PlatformSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getProperties(): Property[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(initialProperties));
      return initialProperties;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialProperties;
    }
  },

  saveProperties(properties: Property[]) {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  },

  getPropertyById(id: string): Property | undefined {
    const list = this.getProperties();
    return list.find((p) => p.id.toLowerCase() === id.toLowerCase());
  },

  addProperty(property: Property) {
    const list = this.getProperties();
    list.unshift(property);
    this.saveProperties(list);
  },

  updateProperty(updated: Property) {
    const list = this.getProperties().map((p) => (p.id === updated.id ? updated : p));
    this.saveProperties(list);
  },

  deleteProperty(id: string) {
    const targetId = id.trim().toLowerCase();
    const list = this.getProperties().filter((p) => p.id.trim().toLowerCase() !== targetId);
    this.saveProperties(list);
  },

  incrementMetric(propertyId: string, metric: 'views' | 'whatsapp' | 'call') {
    const list = this.getProperties().map((p) => {
      if (p.id === propertyId) {
        if (metric === 'views') p.viewsCount = (p.viewsCount || 0) + 1;
        if (metric === 'whatsapp') p.whatsappClicksCount = (p.whatsappClicksCount || 0) + 1;
        if (metric === 'call') p.callClicksCount = (p.callClicksCount || 0) + 1;
      }
      return p;
    });
    this.saveProperties(list);

    // Global analytics
    const analytics = this.getAnalytics();
    if (metric === 'whatsapp') analytics.whatsappClicks += 1;
    if (metric === 'call') analytics.callClicks += 1;
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  },

  // Submissions (Pending Moderation Queue)
  getSubmissions(): PropertySubmission[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addSubmission(submission: PropertySubmission) {
    const list = this.getSubmissions();
    list.unshift(submission);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));

    const analytics = this.getAnalytics();
    analytics.totalSubmissions += 1;
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  },

  approveSubmission(submissionId: string, customVerificationStatus = 'contact_verified'): Property | null {
    const subs = this.getSubmissions();
    const sub = subs.find((s) => s.id === submissionId);
    if (!sub) return null;

    // Convert into a published property
    const newPropertyId = `APZ-${Math.floor(100 + Math.random() * 900)}`;
    const newProp: Property = {
      id: newPropertyId,
      title: sub.title,
      category: sub.category,
      price: sub.price,
      isPriceNegotiable: sub.isPriceNegotiable,
      locality: sub.locality,
      tehsil: sub.tehsil || 'Chakia',
      district: sub.district || 'Chandauli',
      state: 'Uttar Pradesh',
      plotArea: sub.plotArea,
      plotAreaUnit: sub.plotAreaUnit,
      roadWidthFt: sub.roadWidthFt || 20,
      roadType: 'pucca_tar',
      facingDirection: (sub.facingDirection as any) || 'East',
      boundaryWall: 'open',
      electricityAvailable: true,
      legalRecordType: 'freehold_registry',
      description: sub.description,
      images: [
        sub.imageUrl ||
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      ],
      landmarks: ['Local Panchayat Area'],
      verificationStatus: customVerificationStatus as any,
      verificationNotes: `Approved after phone verification with submitter ${sub.submitterName}.`,
      verifiedBy: 'Admin Moderator',
      verificationDate: new Date().toISOString().split('T')[0],
      contactName: sub.submitterName,
      contactRole: sub.submitterType,
      contactPhone: sub.phone,
      contactWhatsApp: sub.whatsapp || sub.phone,
      showPhonePublicly: true,
      isFeatured: false,
      availability: 'available',
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      enquiriesCount: 0,
      whatsappClicksCount: 0,
      callClicksCount: 0,
    };

    this.addProperty(newProp);

    // Update submission status
    const updatedSubs = subs.map((s) => (s.id === submissionId ? { ...s, status: 'approved' as const } : s));
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updatedSubs));

    return newProp;
  },

  rejectSubmission(submissionId: string, reason: string) {
    const subs = this.getSubmissions().map((s) =>
      s.id === submissionId ? { ...s, status: 'rejected' as const, rejectionReason: reason } : s
    );
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));
  },

  // Buyer Requirements
  getBuyerRequirements(): BuyerRequirement[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BUYER_REQUIREMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BUYER_REQUIREMENTS, JSON.stringify(sampleBuyerRequirements));
      return sampleBuyerRequirements;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return sampleBuyerRequirements;
    }
  },

  addBuyerRequirement(req: BuyerRequirement) {
    const list = this.getBuyerRequirements();
    list.unshift(req);
    localStorage.setItem(STORAGE_KEYS.BUYER_REQUIREMENTS, JSON.stringify(list));

    const analytics = this.getAnalytics();
    analytics.totalRequirements += 1;
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  },

  updateBuyerRequirementStatus(id: string, status: BuyerRequirement['status']) {
    const list = this.getBuyerRequirements().map((r) => (r.id === id ? { ...r, status } : r));
    localStorage.setItem(STORAGE_KEYS.BUYER_REQUIREMENTS, JSON.stringify(list));
  },

  // Site Visits
  getSiteVisits(): SiteVisitRequest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SITE_VISITS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addSiteVisit(request: SiteVisitRequest) {
    const list = this.getSiteVisits();
    list.unshift(request);
    localStorage.setItem(STORAGE_KEYS.SITE_VISITS, JSON.stringify(list));

    const analytics = this.getAnalytics();
    analytics.siteVisitsRequested += 1;
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  },

  updateSiteVisitStatus(id: string, status: SiteVisitRequest['status']) {
    const list = this.getSiteVisits().map((v) => (v.id === id ? { ...v, status } : v));
    localStorage.setItem(STORAGE_KEYS.SITE_VISITS, JSON.stringify(list));
  },

  // Reports
  getReports(): ListingReport[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addReport(report: ListingReport) {
    const list = this.getReports();
    list.unshift(report);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list));
  },

  // Analytics
  getAnalytics(): AnalyticsSummary {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    const defaults: AnalyticsSummary = {
      whatsappClicks: 210,
      callClicks: 96,
      siteVisitsRequested: 18,
      totalSubmissions: 7,
      totalRequirements: 14,
    };
    if (!raw) return defaults;
    try {
      return { ...defaults, ...JSON.parse(raw) };
    } catch {
      return defaults;
    }
  },

  // Reset to default seed
  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(initialProperties));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSettings));
    localStorage.setItem(STORAGE_KEYS.BUYER_REQUIREMENTS, JSON.stringify(sampleBuyerRequirements));
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.SITE_VISITS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.ANALYTICS);
  },

  // Export to CSV helper for zero-cost spreadsheet operation
  exportPropertiesToCSV(): string {
    const properties = this.getProperties();
    const headers = [
      'ID',
      'Title',
      'Category',
      'Price (INR)',
      'Locality',
      'Tehsil',
      'Area',
      'Unit',
      'Road Width (Ft)',
      'Facing',
      'Verification Status',
      'Availability',
      'Contact Name',
      'Contact Phone',
      'Date Added',
    ];

    const rows = properties.map((p) => [
      `"${p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.price,
      `"${p.locality}"`,
      `"${p.tehsil}"`,
      p.plotArea,
      `"${p.plotAreaUnit}"`,
      p.roadWidthFt,
      `"${p.facingDirection || ''}"`,
      `"${p.verificationStatus}"`,
      `"${p.availability}"`,
      `"${p.contactName}"`,
      `"${p.contactPhone}"`,
      `"${p.dateAdded}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },

  exportRequirementsToCSV(): string {
    const reqs = this.getBuyerRequirements();
    const headers = [
      'ID',
      'Buyer Name',
      'Phone',
      'Preferred Localities',
      'Category',
      'Min Budget',
      'Max Budget',
      'Required Area Min',
      'Required Area Max',
      'Unit',
      'Intended Use',
      'Road Access Need',
      'Date Submitted',
      'Status',
    ];

    const rows = reqs.map((r) => [
      `"${r.id}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.phone}"`,
      `"${r.preferredLocalities.join('; ')}"`,
      `"${r.category}"`,
      r.minBudget,
      r.maxBudget,
      r.requiredAreaMin,
      r.requiredAreaMax,
      `"${r.areaUnit}"`,
      `"${r.intendedUse}"`,
      `"${r.roadAccessRequirement}"`,
      `"${r.dateSubmitted}"`,
      `"${r.status}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },
};
