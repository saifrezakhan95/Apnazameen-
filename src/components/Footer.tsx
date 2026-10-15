import React from 'react';
import { 
  LandPlot, 
  MapPin, 
  PhoneCall, 
  MessageCircle, 
  Mail, 
  ShieldCheck, 
  BookOpen, 
  Scale, 
  Lock,
  Globe 
} from 'lucide-react';
import { PlatformSettings } from '../types';
import { Language, translations } from '../utils/translations';
import { buildWhatsAppLink } from '../utils/formatters';

interface FooterProps {
  settings: PlatformSettings;
  language: Language;
  onOpenPostModal: () => void;
  onOpenRequirementModal: () => void;
  onOpenAdminModal: () => void;
  onOpenGuideModal: () => void;
  onOpenLegalModal: () => void;
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  language,
  onOpenPostModal,
  onOpenRequirementModal,
  onOpenAdminModal,
  onOpenGuideModal,
  onOpenLegalModal,
  onSelectCategory,
}) => {
  const t = translations[language];

  const handleGeneralWhatsApp = () => {
    const text = `Hello ${settings.platformName}, I would like to inquire about local land listings in Chakia & ${settings.localDistrict}.`;
    const url = buildWhatsAppLink(settings.adminWhatsAppNumber, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <LandPlot className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {settings.platformName}
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              {language === 'hi'
                ? `${settings.localDistrict} का विश्वसनीय स्थानीय रियल एस्टेट नेटवर्क। वास्तविक जमीन मालिकों और सत्यापित खरीदारों को सीधे जोड़ता है। शून्य छिपे ब्रोकरेज शुल्क।`
                : `A dedicated local land & property network serving ${settings.localDistrict} and surrounding tehsils. Focused on genuine agricultural land, commercial plots, and verified owner listings.`}
            </p>

            <div className="pt-2 text-xs space-y-1.5 text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{settings.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href={`tel:${settings.adminPhoneNumber}`} className="hover:text-white transition">
                  {settings.adminPhoneNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{settings.adminEmail}</span>
              </div>
              {settings.customDomain && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500 shrink-0" />
                  <a
                    href={settings.websiteUrl || `https://${settings.customDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 font-mono text-[11px] transition flex items-center gap-1"
                  >
                    <span>{settings.customDomain}</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {language === 'hi' ? 'प्रॉपर्टी श्रेणियां' : 'Property Types'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('agricultural_land')}
                  className="hover:text-emerald-400 transition"
                >
                  🌾 {language === 'hi' ? 'कृषि भूमि (खेत)' : 'Agricultural Farm Land'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('commercial_land')}
                  className="hover:text-emerald-400 transition"
                >
                  🏢 {language === 'hi' ? 'कमर्शियल जमीन व प्लॉट' : 'Commercial Land on Highway'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('residential_plot')}
                  className="hover:text-emerald-400 transition"
                >
                  🏡 {language === 'hi' ? 'आवासीय प्लॉट (कॉलोनी)' : 'Residential Township Plots'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('commercial_shop')}
                  className="hover:text-emerald-400 transition"
                >
                  🏪 {language === 'hi' ? 'दुकानें व शोरूम' : 'Commercial Shops & Space'}
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Actions & Leads */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {language === 'hi' ? 'त्वरित सेवाएं' : 'Quick Actions'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenPostModal}
                  className="text-emerald-400 font-bold hover:underline"
                >
                  + {language === 'hi' ? 'अपनी प्रॉपर्टी लिस्ट करें (Free)' : 'Post Property for Free'}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRequirementModal}
                  className="text-amber-400 font-bold hover:underline"
                >
                  📝 {language === 'hi' ? 'खरीद आवश्यकता दर्ज करें' : 'Submit Buyer Requirement'}
                </button>
              </li>
              <li>
                <button
                  onClick={handleGeneralWhatsApp}
                  className="hover:text-white flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Helpdesk</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdminModal}
                  className="hover:text-white flex items-center gap-1.5 text-stone-400"
                >
                  <Lock className="w-3 h-3 text-stone-500" />
                  <span>Admin Login</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Knowledge & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {language === 'hi' ? 'पारदर्शिता व गाइड' : 'Trust & Architecture'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenLegalModal}
                  className="hover:text-white flex items-center gap-1.5 text-amber-300 font-medium"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'सत्यापन नीति व कानूनी सलाह' : 'Verification & Title Rules'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenGuideModal}
                  className="hover:text-white flex items-center gap-1.5 text-stone-300"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Zero-Cost Tech Architecture</span>
                </button>
              </li>
              <li>
                <span className="text-[11px] text-stone-500 block pt-1">
                  Version 1.0 • Mobile-First Local Edition
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-6 border-t border-stone-800 text-[11px] text-stone-500 leading-relaxed space-y-2">
          <p>
            <strong className="text-stone-400">Statutory Notice:</strong> {settings.platformName} is an informational listing directory designed to bridge communication between local land owners, brokers, and genuine prospective buyers. We do not act as an escrow agent or legal title guarantor. Users are explicitly advised to conduct their own official land record verification (Jamabandi / 7-12 / Khasra-Khatauni) and legal title search at the local Sub-Registrar and Tehsil office prior to entering into any financial transaction.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-stone-500">
            <div>
              © {new Date().getFullYear()} {settings.platformName}. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onOpenLegalModal} className="hover:text-stone-300 underline">Privacy Policy</button>
              <button onClick={onOpenLegalModal} className="hover:text-stone-300 underline">Terms of Use</button>
              <button onClick={onOpenLegalModal} className="hover:text-stone-300 underline">RERA Advisory</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
