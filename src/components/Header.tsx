import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  PhoneCall, 
  Menu, 
  X, 
  Languages, 
  Compass, 
  LandPlot,
  BookOpen
} from 'lucide-react';
import { PlatformSettings } from '../types';
import { Language, translations } from '../utils/translations';

interface HeaderProps {
  settings: PlatformSettings;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenPostModal: () => void;
  onOpenRequirementModal: () => void;
  onOpenAdminModal: () => void;
  onOpenGuideModal: () => void;
  onOpenLegalModal: () => void;
  onSelectCategory: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  language,
  onLanguageChange,
  onOpenPostModal,
  onOpenRequirementModal,
  onOpenAdminModal,
  onOpenGuideModal,
  onOpenLegalModal,
  onSelectCategory,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200 shadow-xs">
      {/* Top micro banner for trust and direct helpline */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-emerald-50">
              {language === 'hi' 
                ? `${settings.localDistrict} की सत्यापित प्रॉपर्टीज • कोई बिचौलिया नहीं` 
                : `${settings.localDistrict} Local Real Estate • Direct Owner Contacts • Zero Middlemen`}
            </span>
          </div>
          <div className="flex items-center gap-4 text-emerald-200">
            <button
              onClick={onOpenLegalModal}
              className="hover:text-white underline text-xs transition"
            >
              {language === 'hi' ? 'सत्यापन नीति (Verification Policy)' : 'Verification & RERA Guidelines'}
            </button>
            <span className="hidden sm:inline text-emerald-600">|</span>
            <a 
              href={`tel:${settings.adminPhoneNumber}`}
              className="hidden sm:inline-flex items-center gap-1 text-emerald-100 font-semibold hover:text-white"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{settings.adminPhoneNumber}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
              <LandPlot className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  {settings.platformName}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Local
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium line-clamp-1">
                {settings.localDistrict} • {settings.primaryTehsil}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-stone-700">
            <button
              onClick={() => onSelectCategory('all')}
              className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition"
            >
              {t.allCategories}
            </button>
            <button
              onClick={() => onSelectCategory('agricultural_land')}
              className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-emerald-700 transition"
            >
              {language === 'hi' ? 'खेत / कृषि भूमि' : 'Agricultural Land'}
            </button>
            <button
              onClick={() => onSelectCategory('commercial_land')}
              className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-emerald-700 transition"
            >
              {language === 'hi' ? 'कमर्शियल जमीन' : 'Commercial Plots'}
            </button>
            <button
              onClick={() => onSelectCategory('residential_plot')}
              className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-emerald-700 transition"
            >
              {language === 'hi' ? 'आवासीय प्लॉट' : 'Residential Plots'}
            </button>
            <button
              onClick={onOpenGuideModal}
              className="px-3 py-2 rounded-lg text-amber-800 bg-amber-50 hover:bg-amber-100 transition flex items-center gap-1.5 border border-amber-200"
              title="Architecture Analysis & Free Launch Blueprint"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'hi' ? 'फ्री लॉन्च गाइड' : 'Free Launch Guide'}</span>
            </button>
          </nav>

          {/* Action CTAs & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language toggle */}
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
              title="Switch Language / भाषा बदलें"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Post Property Button */}
            <button
              onClick={onOpenPostModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'hi' ? 'प्लॉट लिस्ट करें' : 'Post Property'}</span>
            </button>

            {/* Submit Requirement */}
            <button
              onClick={onOpenRequirementModal}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{language === 'hi' ? 'ज़रूरत बताएं' : 'Need Land?'}</span>
            </button>

            {/* Admin Portal */}
            <button
              onClick={onOpenAdminModal}
              className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition"
              title="Admin Portal (Password Protected)"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => {
                onOpenPostModal();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-600 text-white font-bold text-xs text-center"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'hi' ? 'प्रॉपर्टी पोस्ट करें' : 'Post Property'}</span>
            </button>
            <button
              onClick={() => {
                onOpenRequirementModal();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-emerald-600 text-emerald-700 font-bold text-xs text-center"
            >
              <FileText className="w-4 h-4" />
              <span>{language === 'hi' ? 'ज़रूरत दर्ज करें' : 'Buyer Request'}</span>
            </button>
          </div>

          <div className="space-y-1 font-semibold text-sm text-stone-800">
            <button
              onClick={() => {
                onSelectCategory('all');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              {t.allCategories}
            </button>
            <button
              onClick={() => {
                onSelectCategory('agricultural_land');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-emerald-800"
            >
              🌾 {language === 'hi' ? 'कृषि भूमि (खेत)' : 'Agricultural Farm Land'}
            </button>
            <button
              onClick={() => {
                onSelectCategory('commercial_land');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-emerald-800"
            >
              🏢 {language === 'hi' ? 'कमर्शियल जमीन व प्लॉट' : 'Commercial Land & Highway Plots'}
            </button>
            <button
              onClick={() => {
                onSelectCategory('residential_plot');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-emerald-800"
            >
              🏡 {language === 'hi' ? 'आवासीय प्लॉट (कॉलोनी)' : 'Residential Plots'}
            </button>
            <button
              onClick={() => {
                onOpenGuideModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg bg-amber-50 text-amber-900 border border-amber-200"
            >
              📘 {language === 'hi' ? 'फ्री आर्किटेक्चर व लॉन्च एनालिसिस' : 'Zero-Cost Architecture & Launch Plan'}
            </button>
            <button
              onClick={() => {
                onOpenLegalModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-600"
            >
              ⚖️ {language === 'hi' ? 'सत्यापन नीति व कानूनी सलाह' : 'Legal Due Diligence & Disclaimers'}
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Admin Helpline:</span>
            <a href={`tel:${settings.adminPhoneNumber}`} className="font-bold text-emerald-700">
              {settings.adminPhoneNumber}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
