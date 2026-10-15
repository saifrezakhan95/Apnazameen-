/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, 
  Grid, 
  List, 
  MapPin, 
  Ruler, 
  SlidersHorizontal, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Trees, 
  LandPlot, 
  PlusCircle, 
  FileText, 
  ChevronRight, 
  CheckCircle2, 
  ArrowUpDown, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { 
  Property, 
  PlatformSettings, 
  FilterState, 
  MeasurementUnit, 
  PropertySubmission, 
  BuyerRequirement, 
  SiteVisitRequest, 
  ListingReport 
} from './types';
import { mockStore } from './data/mockStore';
import { Language, translations } from './utils/translations';
import { formatCategoryName, formatUnitName } from './utils/formatters';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { PostPropertyModal } from './components/PostPropertyModal';
import { BuyerRequirementModal } from './components/BuyerRequirementModal';
import { SiteVisitModal } from './components/SiteVisitModal';
import { ReportListingModal } from './components/ReportListingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ArchitectureAnalysisModal } from './components/ArchitectureAnalysisModal';
import { LegalTrustModal } from './components/LegalTrustModal';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';

export default function App() {
  // Global Settings and Language
  const [settings, setSettings] = useState<PlatformSettings>(() => mockStore.getSettings());
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  // Properties State
  const [properties, setProperties] = useState<Property[]>(() => mockStore.getProperties());

  // Modal States
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [siteVisitProperty, setSiteVisitProperty] = useState<Property | null>(null);
  const [reportProperty, setReportProperty] = useState<Property | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  // View Mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    locality: 'all',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    areaUnit: 'bigha',
    verificationStatus: 'all',
    availability: 'all',
    sortBy: 'newest',
    searchQuery: '',
  });

  const reloadData = () => {
    setProperties(mockStore.getProperties());
    setSettings(mockStore.getSettings());
  };

  // Distinct localities for dropdowns
  const localities = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => {
      if (p.locality) set.add(p.locality);
    });
    return Array.from(set).sort();
  }, [properties]);



  // Filtered and Sorted Catalogue
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Category filter
      if (filters.category !== 'all' && p.category !== filters.category) return false;

      // Locality filter
      if (filters.locality !== 'all' && p.locality !== filters.locality) return false;

      // Price filter
      if (filters.minPrice !== '' && p.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice !== '' && p.price > Number(filters.maxPrice)) return false;

      // Area filter
      if (filters.minArea !== '' && p.plotArea < Number(filters.minArea)) return false;
      if (filters.maxArea !== '' && p.plotArea > Number(filters.maxArea)) return false;

      // Verification Status
      if (filters.verificationStatus !== 'all' && p.verificationStatus !== filters.verificationStatus) return false;

      // Availability
      if (filters.availability !== 'all' && p.availability !== filters.availability) return false;

      // Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesId = p.id.toLowerCase().includes(q);
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesLoc = p.locality.toLowerCase().includes(q);
        const matchesTehsil = p.tehsil.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesLoc && !matchesTehsil && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'area_asc') return a.plotArea - b.plotArea;
      if (filters.sortBy === 'area_desc') return b.plotArea - a.plotArea;
      // Default: newest
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    });
  }, [properties, filters]);

  // Metric tracking handler
  const handleTrackMetric = (propertyId: string, metric: 'whatsapp' | 'call') => {
    mockStore.incrementMetric(propertyId, metric);
  };

  // Property Submission handler
  const handlePropertySubmission = (submission: PropertySubmission) => {
    mockStore.addSubmission(submission);
    reloadData();
  };

  // Buyer Requirement handler
  const handleRequirementSubmission = (requirement: BuyerRequirement) => {
    mockStore.addBuyerRequirement(requirement);
    reloadData();
  };

  // Site Visit handler
  const handleSiteVisitSubmission = (req: SiteVisitRequest) => {
    mockStore.addSiteVisit(req);
    reloadData();
  };

  // Report handler
  const handleReportSubmission = (report: ListingReport) => {
    mockStore.addReport(report);
    reloadData();
  };

  // Quick reset filters
  const resetFilters = () => {
    setFilters({
      category: 'all',
      locality: 'all',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      areaUnit: 'bigha',
      verificationStatus: 'all',
      availability: 'all',
      sortBy: 'newest',
      searchQuery: '',
    });
  };

  const hasActiveFilters = 
    filters.category !== 'all' ||
    filters.locality !== 'all' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.minArea !== '' ||
    filters.maxArea !== '' ||
    filters.verificationStatus !== 'all' ||
    filters.availability !== 'all' ||
    filters.searchQuery !== '';

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Header */}
      <Header
        settings={settings}
        language={language}
        onLanguageChange={setLanguage}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenRequirementModal={() => setIsRequirementModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenLegalModal={() => setIsLegalModalOpen(true)}
        onSelectCategory={(cat) => setFilters({ ...filters, category: cat })}
      />

      {/* Hero Section */}
      <Hero
        settings={settings}
        language={language}
        localities={localities}
        selectedCategory={filters.category}
        selectedLocality={filters.locality}
        searchQuery={filters.searchQuery}
        onCategoryChange={(cat) => setFilters({ ...filters, category: cat })}
        onLocalityChange={(loc) => setFilters({ ...filters, locality: loc })}
        onSearchQueryChange={(q) => setFilters({ ...filters, searchQuery: q })}
        onSearchSubmit={() => {
          setIsRequirementModalOpen(true);
        }}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenRequirementModal={() => setIsRequirementModalOpen(true)}
      />

      {/* Browse Properties by Locality / Village Section */}
      <section className="bg-stone-100/70 border-t border-stone-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-black text-stone-900">
              {t.browseByLocality}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {language === 'hi'
                ? 'अपने पसंदीदा गांव या तहसील में उपलब्ध कृषि व आवासीय जमीनें देखें'
                : `Quickly filter listings across major villages and corridors in ${settings.localDistrict}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
            <button
              onClick={() => {
                setFilters({ ...filters, locality: 'all' });
                setIsRequirementModalOpen(true);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filters.locality === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-emerald-500'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>All Areas ({properties.length})</span>
            </button>

            {localities.map((loc) => {
              const count = properties.filter((p) => p.locality === loc).length;
              return (
                <button
                  key={loc}
                  onClick={() => {
                    setFilters({ ...filters, locality: loc });
                    setIsRequirementModalOpen(true);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    filters.locality === loc
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:border-emerald-500'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{loc}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-600">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* How ApnaZameen Works (Trust & Transparency Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
            Simple • Transparent • Local
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            {t.howItWorksTitle}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Built specifically to solve unverified broker spam in Tier-2 & Tier-3 towns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg">
              1
            </div>
            <h4 className="text-base font-bold text-stone-900">{t.step1Title}</h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {t.step1Desc}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg">
              2
            </div>
            <h4 className="text-base font-bold text-stone-900">{t.step2Title}</h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {t.step2Desc}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-lg">
              3
            </div>
            <h4 className="text-base font-bold text-stone-900">{t.step3Title}</h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {t.step3Desc}
            </p>
          </div>
        </div>

        {/* Verification Policy Banner */}
        <div className="p-6 rounded-3xl bg-emerald-950 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {language === 'hi' ? 'कठोर सत्यापन मानक' : 'Strict Verification Standards'}
            </span>
            <h4 className="text-lg sm:text-xl font-black">
              {language === 'hi' ? 'कोई भी फर्जी लिस्टिंग नहीं' : 'No Auto-Publishing of Unverified Land'}
            </h4>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-xl">
              Every post submitted goes through our moderation queue to confirm the seller's active mobile number, local tehsil boundaries, and asking price before being published.
            </p>
          </div>

          <button
            onClick={() => setIsLegalModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs sm:text-sm shrink-0 transition"
          >
            {language === 'hi' ? 'पूरी सत्यापन नीति पढ़ें' : 'Read Verification Policy'}
          </button>
        </div>
      </section>

      {/* Frequently Asked Questions (Local SEO Grounded) */}
      <section className="bg-white border-t border-stone-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">
              Common Questions
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
              Frequently Asked Questions (FAQ)
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <h4 className="font-bold text-stone-900">
                1. Is it free to post land or submit a buyer requirement?
              </h4>
              <p className="text-stone-600 leading-relaxed">
                Yes, 100% free. {settings.platformName} does not charge owners to list their property or charge buyers to submit purchase requirements. Our mission is to keep local land discovery transparent and direct.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <h4 className="font-bold text-stone-900">
                2. Does listing verification guarantee that the land is legally safe?
              </h4>
              <p className="text-stone-600 leading-relaxed">
                No. Verification on our platform only confirms that the phone number was checked and the seller verbally/physically presented ownership details. Buyers <strong>must independently execute their own title search</strong>, UP Bhulekh Khasra-Khatauni verification, and encumbrance checks at the Chakia sub-registrar office before paying any token advance.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <h4 className="font-bold text-stone-900">
                3. How do I contact the property owner directly?
              </h4>
              <p className="text-stone-600 leading-relaxed">
                Every listing features a dedicated "WhatsApp" and "Call Contact" button that connects directly to the authorized contact with a pre-filled property reference message.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <h4 className="font-bold text-stone-900">
                4. What units of measurement are supported?
              </h4>
              <p className="text-stone-600 leading-relaxed">
                We support Bigha, Gaj (Sq.Yards), Acre, Guntha, and Sq.Feet, tailored to state and local revenue conventions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        settings={settings}
        language={language}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenRequirementModal={() => setIsRequirementModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenLegalModal={() => setIsLegalModalOpen(true)}
        onSelectCategory={(cat) => setFilters({ ...filters, category: cat })}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <WhatsAppFloatingButton settings={settings} language={language} />

      {/* MODALS */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          settings={settings}
          language={language}
          onClose={() => setSelectedProperty(null)}
          onOpenSiteVisit={(p) => {
            setSelectedProperty(null);
            setSiteVisitProperty(p);
          }}
          onOpenReport={(p) => {
            setSelectedProperty(null);
            setReportProperty(p);
          }}
          onTrackMetric={handleTrackMetric}
        />
      )}

      {isPostModalOpen && (
        <PostPropertyModal
          language={language}
          onClose={() => setIsPostModalOpen(false)}
          onSubmit={handlePropertySubmission}
        />
      )}

      {isRequirementModalOpen && (
        <BuyerRequirementModal
          language={language}
          localities={localities}
          onClose={() => setIsRequirementModalOpen(false)}
          onSubmit={handleRequirementSubmission}
        />
      )}

      {siteVisitProperty && (
        <SiteVisitModal
          property={siteVisitProperty}
          settings={settings}
          language={language}
          onClose={() => setSiteVisitProperty(null)}
          onSubmit={handleSiteVisitSubmission}
        />
      )}

      {reportProperty && (
        <ReportListingModal
          property={reportProperty}
          language={language}
          onClose={() => setReportProperty(null)}
          onSubmit={handleReportSubmission}
        />
      )}

      {isAdminModalOpen && (
        <AdminDashboard
          settings={settings}
          properties={properties}
          onClose={() => setIsAdminModalOpen(false)}
          onRefreshData={reloadData}
        />
      )}

      {isGuideModalOpen && (
        <ArchitectureAnalysisModal
          language={language}
          onClose={() => setIsGuideModalOpen(false)}
        />
      )}

      {isLegalModalOpen && (
        <LegalTrustModal
          settings={settings}
          language={language}
          onClose={() => setIsLegalModalOpen(false)}
        />
      )}
    </div>
  );
}
