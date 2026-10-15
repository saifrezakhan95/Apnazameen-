import React from 'react';
import { 
  Search, 
  MapPin, 
  Tag, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Trees, 
  Building, 
  Home, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PlatformSettings, PropertyCategory } from '../types';
import { Language, translations } from '../utils/translations';

interface HeroProps {
  settings: PlatformSettings;
  language: Language;
  localities: string[];
  selectedCategory: string;
  selectedLocality: string;
  searchQuery: string;
  onCategoryChange: (cat: string) => void;
  onLocalityChange: (loc: string) => void;
  onSearchQueryChange: (q: string) => void;
  onSearchSubmit: () => void;
  onOpenPostModal: () => void;
  onOpenRequirementModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  language,
  localities,
  selectedCategory,
  selectedLocality,
  searchQuery,
  onCategoryChange,
  onLocalityChange,
  onSearchQueryChange,
  onSearchSubmit,
  onOpenPostModal,
  onOpenRequirementModal,
}) => {
  const t = translations[language];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-900 text-white overflow-hidden py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto text-center space-y-6">
        {/* Micro badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Main headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          {language === 'hi' ? (
            <>
              {settings.localDistrict} में{' '}
              <span className="text-emerald-400 underline decoration-amber-400 decoration-wavy underline-offset-8">
                असली जमीन व प्लॉट
              </span>{' '}
              खोजें
            </>
          ) : (
            <>
              Find Genuine Land & Properties in{' '}
              <span className="text-emerald-400 underline decoration-amber-400 decoration-wavy underline-offset-8">
                {settings.localDistrict}
              </span>
            </>
          )}
        </h1>

        <p className="text-sm sm:text-lg text-emerald-100/90 max-w-2xl mx-auto font-normal">
          {t.heroSubtitle}
        </p>

        {/* Search Box Card */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-stone-200/40 text-stone-900 max-w-4xl mx-auto mt-6 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                {language === 'hi' ? 'खोजें (गांव, कॉलोनी या ID)' : 'Search Locality / Keyword'}
              </label>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                {language === 'hi' ? 'प्रॉपर्टी का प्रकार' : 'Category'}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 font-medium"
              >
                <option value="all">{t.allCategories}</option>
                <option value="agricultural_land">🌾 {t.agriculturalLand}</option>
                <option value="commercial_land">🏢 {t.commercialLand}</option>
                <option value="residential_plot">🏡 {t.residentialPlot}</option>
                <option value="commercial_shop">🏪 {t.commercialShop}</option>
                <option value="house_villa">🏠 {t.houseVilla}</option>
              </select>
            </div>

            {/* Locality Selector */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                {language === 'hi' ? 'क्षेत्र / गांव' : 'Area / Village'}
              </label>
              <select
                value={selectedLocality}
                onChange={(e) => onLocalityChange(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 font-medium"
              >
                <option value="all">{t.allLocalities}</option>
                {localities.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="sm:col-span-2 flex items-end">
              <button
                onClick={onSearchSubmit}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{language === 'hi' ? 'खोजें' : 'Search'}</span>
              </button>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-stone-500 font-medium mr-1 text-[11px]">
              {language === 'hi' ? 'त्वरित श्रेणी:' : 'Quick Filter:'}
            </span>
            <button
              onClick={() => onCategoryChange('agricultural_land')}
              className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1 text-[11px] font-semibold cursor-pointer ${
                selectedCategory === 'agricultural_land'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-emerald-50'
              }`}
            >
              <Trees className="w-3 h-3 text-emerald-600" />
              <span>{language === 'hi' ? 'कृषि भूमि (खेत)' : 'Farm Land'}</span>
            </button>
            <button
              onClick={() => onCategoryChange('commercial_land')}
              className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1 text-[11px] font-semibold cursor-pointer ${
                selectedCategory === 'commercial_land'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-emerald-50'
              }`}
            >
              <Building className="w-3 h-3 text-amber-600" />
              <span>{language === 'hi' ? 'कमर्शियल प्लॉट' : 'Commercial Plots'}</span>
            </button>
            <button
              onClick={() => onCategoryChange('residential_plot')}
              className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1 text-[11px] font-semibold cursor-pointer ${
                selectedCategory === 'residential_plot'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-emerald-50'
              }`}
            >
              <Home className="w-3 h-3 text-blue-600" />
              <span>{language === 'hi' ? 'आवासीय प्लॉट' : 'Residential'}</span>
            </button>
            <button
              onClick={() => {
                onCategoryChange('all');
                onLocalityChange('all');
                onSearchQueryChange('');
              }}
              className="text-[11px] text-stone-500 hover:text-emerald-700 font-semibold underline ml-auto"
            >
              {language === 'hi' ? 'रीसेट' : 'Clear all'}
            </button>
          </div>
        </div>

        {/* Dual CTA Banners: Post Property & Submit Requirement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto pt-4 text-left">
          {/* Post Property Banner */}
          <div 
            onClick={onOpenPostModal}
            className="group relative bg-emerald-800/40 hover:bg-emerald-800/60 border border-emerald-500/30 p-4 rounded-xl cursor-pointer transition shadow-lg backdrop-blur flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                {language === 'hi' ? 'मालिकों व ब्रोकर्स के लिए' : 'For Owners & Brokers'}
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition flex items-center gap-1.5">
                {t.postPropertyBtn}
                <ArrowRight className="w-4 h-4 transition transform group-hover:translate-x-1" />
              </h3>
              <p className="text-xs text-emerald-200 line-clamp-1">
                {t.postPropertySubtitle}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <Building className="w-5 h-5" />
            </div>
          </div>

          {/* Submit Buyer Requirement Banner */}
          <div 
            onClick={onOpenRequirementModal}
            className="group relative bg-amber-900/40 hover:bg-amber-900/60 border border-amber-500/30 p-4 rounded-xl cursor-pointer transition shadow-lg backdrop-blur flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                {language === 'hi' ? 'खरीदारों के लिए' : 'For Genuine Land Buyers'}
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition flex items-center gap-1.5">
                {t.submitRequirementBtn}
                <ArrowRight className="w-4 h-4 transition transform group-hover:translate-x-1" />
              </h3>
              <p className="text-xs text-amber-200 line-clamp-1">
                {t.submitRequirementSubtitle}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Micro Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-emerald-200/90 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? '100% निशुल्क लिस्टिंग' : '100% Free to List & Search'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'सीधे व्हाट्सएप संपर्क' : 'Instant WhatsApp Contact'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'रोड चौड़ाई व राजस्व विवरण' : 'Verified Road Width & Dimensions'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
