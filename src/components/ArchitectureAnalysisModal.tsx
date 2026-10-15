import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Server, 
  Smartphone, 
  DollarSign, 
  Layers, 
  ShieldAlert, 
  ArrowRight,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { Language } from '../utils/translations';

interface ArchitectureAnalysisModalProps {
  language: Language;
  onClose: () => void;
}

export const ArchitectureAnalysisModal: React.FC<ArchitectureAnalysisModalProps> = ({
  language,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'recommendation' | 'limits' | 'checklist'>('comparison');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-stone-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900">
                {language === 'hi' 
                  ? 'शून्य-लागत स्थानीय रियल एस्टेट आर्किटेक्चर गाइड' 
                  : 'Zero-Cost Real Estate Platform Architecture & Launch Blueprint'}
              </h2>
              <p className="text-[11px] text-stone-500">
                Mandatory Initial Analysis: No-Code vs. Custom Free Stack Comparison
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-500 hover:text-stone-900 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 border-b border-stone-200 flex gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`pb-2.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            1. No-Code vs Custom Free Stack
          </button>
          <button
            onClick={() => setActiveTab('recommendation')}
            className={`pb-2.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'recommendation'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            2. Primary Recommendation & Limits
          </button>
          <button
            onClick={() => setActiveTab('limits')}
            className={`pb-2.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'limits'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            3. Free-Tier Quotas & Reality Check
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-2.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            4. Local Launch Checklist (Day 1 to 14)
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
          {/* TAB 1: COMPARISON */}
          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-stone-900">
                Evaluation of Practical Free-Tier Approaches
              </h3>
              <p>
                To launch a high-trust local land marketplace with zero capital outlay, we compare two realistic architectural paths:
              </p>

              {/* Matrix Table */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-800 font-bold uppercase text-[10px] tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="p-3">Evaluation Criteria</th>
                      <th className="p-3 bg-amber-50/60 text-amber-900">Approach A: No-Code (Google Stack)</th>
                      <th className="p-3 bg-emerald-50/60 text-emerald-900">Approach B: Custom Free Web App (This Stack)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-stone-700">
                    <tr>
                      <td className="p-3 font-bold text-stone-900">Tools Used</td>
                      <td className="p-3 bg-amber-50/30">Google Sites + Google Forms + Google Sheets + WhatsApp</td>
                      <td className="p-3 bg-emerald-50/30">Vite + React + Tailwind v4 + Cloud Run / Vercel Free Tier + LocalStorage / Supabase</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-stone-900">Setup & Recurring Cost</td>
                      <td className="p-3 bg-amber-50/30 font-semibold text-emerald-700">₹0 / month</td>
                      <td className="p-3 bg-emerald-50/30 font-semibold text-emerald-700">₹0 / month (with generous free bandwidth & hosting)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-stone-900">Launch Speed</td>
                      <td className="p-3 bg-amber-50/30">1 – 2 Days</td>
                      <td className="p-3 bg-emerald-50/30">Immediate (Pre-built production code ready)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-stone-900">Search & Filtering</td>
                      <td className="p-3 bg-amber-50/30 text-red-700 font-medium">Very poor. Google Sites has no faceted filtering by Bigha, Price range, or Road width.</td>
                      <td className="p-3 bg-emerald-50/30 text-emerald-700 font-medium">Excellent. Real-time multi-facet filtering (Category, Bigha, Lakhs, Facing, Road width).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-stone-900">Mobile UX (Tier 2/3)</td>
                      <td className="p-3 bg-amber-50/30 text-stone-600">Basic desktop-scaled views, slow iframe forms.</td>
                      <td className="p-3 bg-emerald-50/30 text-emerald-800 font-medium">Mobile-first, tap-to-WhatsApp with prefilled Property ID & Indian number format (+91).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-stone-900">Privacy & Security</td>
                      <td className="p-3 bg-amber-50/30 text-stone-600">Public sheets can accidentally leak phone numbers if shared improperly.</td>
                      <td className="p-3 bg-emerald-50/30 text-emerald-800 font-medium">Clear separation: Buyer budgets and reports are private; public only sees verified data.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-stone-900">Local SEO & Schema</td>
                      <td className="p-3 bg-amber-50/30 text-stone-600">Extremely limited meta tags, no custom JSON-LD.</td>
                      <td className="p-3 bg-emerald-50/30 text-emerald-800 font-medium">Full Schema.org RealEstateAgent markup, OpenGraph social sharing, village landing tags.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-stone-900">Upgrade Path</td>
                      <td className="p-3 bg-amber-50/30 text-stone-600">Must throw away and rebuild when you reach 50+ listings.</td>
                      <td className="p-3 bg-emerald-50/30 text-emerald-800 font-medium">Direct upgrade to PostgreSQL/Supabase or custom domain without redesigning.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: RECOMMENDATION */}
          {activeTab === 'recommendation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950">
                <span className="font-extrabold text-sm block mb-1">
                  🎯 Primary Recommendation: The Hybrid Custom React Web App (Implemented in this Codebase)
                </span>
                We recommend deploying this lightweight custom React application on a reliable free hosting platform (such as Google Cloud Run, Vercel, or Cloudflare Pages) coupled with local storage and CSV export capability.
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-sm">
                  Why this is superior for local Indian real estate:
                </h4>
                <ul className="space-y-2 list-disc list-inside text-stone-700">
                  <li>
                    <strong>Native WhatsApp Deep Linking:</strong> Generates formatted Indian WhatsApp links (<code className="bg-stone-100 px-1 py-0.5 rounded">https://wa.me/91XXXXXXXXXX?text=...</code>) containing property ID and asking price.
                  </li>
                  <li>
                    <strong>Local Unit System:</strong> Understands Bigha, Gaj (Sq.Yards), Acre, and Guntha alongside INR Lakhs and Crores.
                  </li>
                  <li>
                    <strong>Moderation Safety:</strong> User-submitted properties start in <span className="font-semibold text-amber-800">Pending Review</span> rather than instantly appearing as approved, stopping fake spam and duplicate postings.
                  </li>
                  <li>
                    <strong>Zero Fixed Monthly Burn:</strong> Does not require monthly WordPress hosting ($10–$25/mo), paid plugins ($99/yr), or proprietary SaaS fees.
                  </li>
                </ul>

                <h4 className="font-bold text-stone-900 text-sm pt-2">
                  What CANNOT be delivered for free at launch:
                </h4>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <p>• <strong>Custom Domain:</strong> You can connect your free DNS / domain like <code className="bg-amber-100 px-1 font-bold">apnazameen.page.gd</code> or commercial top-level domains (<code className="bg-amber-100 px-1">apnazameen.in</code>) with zero hosting costs.</p>
                  <p>• <strong>Automated SMS Gateways:</strong> DLT registration in India and commercial SMS routes require paid credits (~₹0.20 per SMS). Use WhatsApp Click-to-Chat instead for ₹0 cost!</p>
                  <p>• <strong>Automatic Title Deeds Verification:</strong> Online government portals require manual Khasra/Khatauni verification by a human; automated revenue API integration does not exist for free.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIMITS */}
          {activeTab === 'limits' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-stone-900">
                Understanding Free-Tier Quotas & Operational Realities
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <span className="font-bold text-stone-900 block text-xs">Vercel / Cloudflare Pages Free Tier</span>
                  <p className="text-[11px] text-stone-600">
                    • 100 GB monthly bandwidth (enough for ~50,000 monthly page views of optimized photos).
                  </p>
                  <p className="text-[11px] text-stone-600">
                    • Unlimited static deployments and free SSL certificate.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <span className="font-bold text-stone-900 block text-xs">Photo Storage Strategy</span>
                  <p className="text-[11px] text-stone-600">
                    • Avoid saving 10MB raw mobile photos directly in client memory.
                  </p>
                  <p className="text-[11px] text-stone-600">
                    • Use free image hosting tiers (Cloudinary 25GB free tier, Supabase Storage 1GB free tier, or Imgur/Google Drive embeds).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <span className="font-bold text-stone-900 block text-xs">Google Sheets as a Free Database</span>
                  <p className="text-[11px] text-stone-600">
                    • Google Sheets API allows up to 300 requests per minute for free.
                  </p>
                  <p className="text-[11px] text-stone-600">
                    • Our admin panel provides 1-click "Export to CSV" which opens natively in Google Sheets for backup.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <span className="font-bold text-stone-900 block text-xs">WhatsApp Business App (Android)</span>
                  <p className="text-[11px] text-stone-600">
                    • 100% Free on the Google Play Store.
                  </p>
                  <p className="text-[11px] text-stone-600">
                    • Set up quick replies, business hours, and automated greetings for instant lead capture.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LOCAL LAUNCH CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-stone-900">
                14-Day Zero-Cost Local Launch Action Plan
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="font-bold text-stone-900 text-xs">Days 1 – 3: Seed 15 Genuine Listings</span>
                  <p className="text-xs text-stone-600">
                    Visit 4–5 local village pradhans, local tea stalls, or known farm owners in Chakia and Chandauli. Take clear photos of genuine plots for sale with permission and note exact road width and asking prices.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="font-bold text-stone-900 text-xs">Days 4 – 5: Setup Dedicated WhatsApp Business SIM</span>
                  <p className="text-xs text-stone-600">
                    Acquire a dedicated Indian SIM card (Jio or Airtel) for the business. Configure WhatsApp Business profile with ApnaZameen branding and quick reply templates.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="font-bold text-stone-900 text-xs">Days 6 – 8: Create Google Business Profile</span>
                  <p className="text-xs text-stone-600">
                    List your local real estate consultation office or desk in Chakia on Google Maps. Add photos of your area and link to your ApnaZameen web application for local search discovery.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="font-bold text-stone-900 text-xs">Days 9 – 14: Local WhatsApp Community Distribution</span>
                  <p className="text-xs text-stone-600">
                    Share individual property links directly into local village and tehsil WhatsApp groups. Each listing card opens directly into a clear view with one-click enquiry.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
