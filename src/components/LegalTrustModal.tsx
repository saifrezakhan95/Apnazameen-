import React from 'react';
import { X, ShieldCheck, AlertTriangle, FileCheck, CheckCircle2, Scale } from 'lucide-react';
import { Language } from '../utils/translations';
import { PlatformSettings } from '../types';

interface LegalTrustModalProps {
  settings: PlatformSettings;
  language: Language;
  onClose: () => void;
}

export const LegalTrustModal: React.FC<LegalTrustModalProps> = ({
  settings,
  language,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-stone-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900">
                {language === 'hi' ? 'सत्यापन नीति व कानूनी दिशा-निर्देश' : 'Verification Policy & Statutory Legal Advisory'}
              </h2>
              <p className="text-[11px] text-stone-500">
                Transparency Guidelines for Buyers, Sellers, and Brokers
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-500 hover:text-stone-900 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
          {/* Statutory Warning Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-black text-sm text-red-900">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <span>Mandatory Legal Disclaimer (अनिवार्य कानूनी अस्वीकरण)</span>
            </div>
            <p>
              {settings.disclaimerText}
            </p>
          </div>

          {/* 4-Level Verification Status Explanation */}
          <div className="space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>How Listing Verification Works on {settings.platformName}</span>
            </h3>
            <p className="text-stone-600 text-xs">
              Unlike nationwide advertising portals that display unverified sponsored ads, {settings.platformName} categorizes every property in Chakia and Chandauli with transparent verification tiers:
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-800 text-xs block">1. Pending Review (समीक्षाधीन)</span>
                <p className="text-xs text-stone-600 mt-0.5">
                  Newly submitted listing. An operator has not yet reached the submitter. Public details may be restricted until contact is confirmed.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="font-bold text-amber-900 text-xs block">2. Contact Verified (सम्पर्क सत्यापित)</span>
                <p className="text-xs text-amber-800 mt-0.5">
                  The submitter's phone number was called directly by our local coordinator. The person acknowledged being the seller or authorized agent.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
                <span className="font-bold text-blue-900 text-xs block">3. Availability Confirmed (उपलब्धता पुष्ट)</span>
                <p className="text-xs text-blue-800 mt-0.5">
                  Verified that the property has not been sold or mortgaged in an unrecorded manner, and the seller welcomes buyer site visits.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                <span className="font-bold text-emerald-950 text-xs block">4. Title Docs Reviewed (दस्तावेज़ सत्यापित)</span>
                <p className="text-xs text-emerald-900 mt-0.5">
                  The seller physically presented copy of UP Bhulekh Khasra-Khatauni / Registry Bynaama Deed or Khasra trace map to our coordinator. <em>Note: Even for this tier, buyers must independently verify revenue records and obtain an encumbrance search certificate at the Chakia Sub-Registrar office.</em>
                </p>
              </div>
            </div>
          </div>

          {/* 5-Step Buyer Checklist Before Paying Token Money */}
          <div className="space-y-3">
            <h3 className="font-bold text-stone-900 text-sm">
              5 Essential Due-Diligence Steps for Buyers in Uttar Pradesh
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-stone-700 text-xs">
              <li>
                <strong>UP Bhulekh Khasra-Khatauni:</strong> Verify that the seller's name is recorded in Khatauni Fasli Year on the official portal (<code className="bg-stone-100 px-1 font-mono">upbhulekh.gov.in</code>).
              </li>
              <li>
                <strong>Section 143 / 80 Land Use Conversion:</strong> For residential home construction on farmland, check whether an order under Section 143 / 80 of the UP Revenue Code has been formally passed by the Chakia SDM.
              </li>
              <li>
                <strong>Sajra / Aks Shajra Map Trace:</strong> Ensure the approach road or rasta is marked on the village revenue map (Nazul / Chakbandi map).
              </li>
              <li>
                <strong>Chakia Sub-Registrar 12-Year Search:</strong> Verify there are no prior agreements to sell, court stays, or mortgage liens with local banks.
              </li>
              <li>
                <strong>Always Use Bank Transfers:</strong> Never make cash token payments. Execute a registered Agreement to Sell on proper stamp duty with bank RTGS or Cheque.
              </li>
            </ol>
          </div>

          {/* Privacy & Anti-Spam Guarantee */}
          <div className="pt-2 border-t border-stone-200 space-y-2">
            <h4 className="font-bold text-stone-900 text-xs">Privacy & Data Handling Commitment</h4>
            <p className="text-xs text-stone-600">
              {settings.platformName} does not sell buyer telephone lists to third-party telemarketing call centers. Buyer requirements submitted on this platform remain confidential and are only utilized by our authorized local coordinators in Chakia & Chandauli to connect genuine buyers with matching land owners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
