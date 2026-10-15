import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Ruler, 
  Compass, 
  ShieldCheck, 
  PhoneCall, 
  MessageCircle, 
  Calendar, 
  Share2, 
  Flag, 
  CheckCircle2, 
  Info, 
  ExternalLink, 
  Layers, 
  Zap, 
  Droplets,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';
import { Property, PlatformSettings } from '../types';
import { 
  formatINR, 
  formatCategoryName, 
  formatUnitName, 
  formatVerificationStatus,
  buildWhatsAppLink, 
  generatePropertyWhatsAppMessage 
} from '../utils/formatters';
import { Language, translations } from '../utils/translations';

interface PropertyDetailsModalProps {
  property: Property;
  settings: PlatformSettings;
  language: Language;
  onClose: () => void;
  onOpenSiteVisit: (property: Property) => void;
  onOpenReport: (property: Property) => void;
  onTrackMetric: (propertyId: string, metric: 'whatsapp' | 'call') => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  settings,
  language,
  onClose,
  onOpenSiteVisit,
  onOpenReport,
  onTrackMetric,
}) => {
  const t = translations[language];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const verInfo = formatVerificationStatus(property.verificationStatus, language === 'hi');
  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'];

  const handleWhatsApp = () => {
    onTrackMetric(property.id, 'whatsapp');
    const msg = generatePropertyWhatsAppMessage(property, settings.platformName);
    const targetPhone = property.contactWhatsApp || property.contactPhone || settings.adminWhatsAppNumber;
    const url = buildWhatsAppLink(targetPhone, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    onTrackMetric(property.id, 'call');
    const phone = property.contactPhone || settings.adminPhoneNumber;
    window.location.href = `tel:${phone}`;
  };

  const handleShare = async () => {
    const baseOrigin = settings.websiteUrl ? settings.websiteUrl.replace(/\/$/, '') : window.location.origin;
    const shareUrl = `${baseOrigin}/#property-${property.id}`;
    const shareText = `Check out this verified property listing: ${property.title} (ID: ${property.id}) on ${settings.platformName}. Price: ${formatINR(property.price)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Sticky top bar with ID, Close, Share */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
              {property.id}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${verInfo.badgeClass}`}>
              {verInfo.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition flex items-center gap-1 text-xs font-semibold"
              title="Share Listing"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Main Photo Viewer */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] bg-stone-900 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={images[activeImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-stone-900/80 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur">
                {activeImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx ? 'border-emerald-600 scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Pricing & Primary Actions */}
          <div className="bg-stone-50 rounded-2xl p-4 sm:p-6 border border-stone-200/70">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {formatCategoryName(property.category, language === 'hi')}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                  {property.title}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-stone-600 text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {property.locality}, Tehsil {property.tehsil}, {property.district}, {property.state}
                  </span>
                </div>
              </div>

              {/* Price Block */}
              <div className="sm:text-right shrink-0">
                <div className="text-2xl sm:text-3xl font-black text-stone-900">
                  {formatINR(property.price)}
                </div>
                <div className="text-xs font-semibold text-stone-500 mt-0.5">
                  {property.isPriceNegotiable
                    ? (language === 'hi' ? 'कीमत में मोलभाव संभव' : 'Price is Negotiable')
                    : (language === 'hi' ? 'तयशुदा कीमत (Fixed)' : 'Fixed Asking Price')}
                </div>
                <div className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md inline-block mt-1">
                  {property.plotArea} {formatUnitName(property.plotAreaUnit, language === 'hi')}
                </div>
              </div>
            </div>

            {/* Direct Contact CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5 pt-5 border-t border-stone-200">
              <button
                onClick={handleWhatsApp}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>WhatsApp Owner / Broker</span>
              </button>

              <button
                onClick={handleCall}
                className="py-3 px-4 rounded-xl border border-stone-300 hover:border-emerald-600 hover:bg-emerald-50 text-stone-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-700" />
                <span>{language === 'hi' ? 'सीधा कॉल करें' : 'Call Contact'}</span>
              </button>

              <button
                onClick={() => onOpenSiteVisit(property)}
                className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{language === 'hi' ? 'साइट विजिट बुक करें' : 'Schedule Site Visit'}</span>
              </button>
            </div>
          </div>

          {/* Key Specifications Matrix */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3">
              {language === 'hi' ? 'जमीन व प्लॉट की प्रमुख विशेषताएं' : 'Property Specifications & Access'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-1">{language === 'hi' ? 'कुल रकबा / क्षेत्रफल' : 'Total Area'}</span>
                <span className="font-bold text-stone-900 text-sm">
                  {property.plotArea} {formatUnitName(property.plotAreaUnit, language === 'hi')}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-1">{language === 'hi' ? 'रास्ते की चौड़ाई' : 'Road Width'}</span>
                <span className="font-bold text-stone-900 text-sm">
                  {property.roadWidthFt} Feet ({property.roadType.replace('_', ' ')})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-1">{language === 'hi' ? 'दिशा (Facing)' : 'Facing Direction'}</span>
                <span className="font-bold text-stone-900 text-sm">
                  {property.facingDirection || 'Not specified'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-1">{language === 'hi' ? 'नाप (Dimensions)' : 'Dimensions'}</span>
                <span className="font-bold text-stone-900 text-sm">
                  {property.dimensions || 'Regular plot'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-1">{language === 'hi' ? 'राजस्व रिकॉर्ड' : 'Legal Record Type'}</span>
                <span className="font-bold text-stone-900 text-sm capitalize">
                  {property.legalRecordType.replace('_', ' ')}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-1">{language === 'hi' ? 'बाउंड्री वॉल' : 'Boundary Status'}</span>
                <span className="font-bold text-stone-900 text-sm capitalize">
                  {property.boundaryWall} boundary
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-1">{language === 'hi' ? 'बिजली कनेक्शन' : 'Electricity'}</span>
                <span className="font-bold text-stone-900 text-sm flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  {property.electricityAvailable ? 'Available on site' : 'Nearby transformer'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-1">{language === 'hi' ? 'पानी की सुविधा' : 'Water Source'}</span>
                <span className="font-bold text-stone-900 text-sm flex items-center gap-1 line-clamp-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  {property.waterSource || 'Tubewell/Pipeline'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-2">
              {language === 'hi' ? 'विस्तृत विवरण (Description)' : 'Detailed Description'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200/80 whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Landmarks & Location */}
          {property.landmarks && property.landmarks.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-2">
                {language === 'hi' ? 'आसपास के प्रमुख लैंडमार्क' : 'Nearby Landmarks & Connectivity'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {property.landmarks.map((lm, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {lm}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Trust, Audit Trail & Mandatory Legal Disclaimer */}
          <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                  {language === 'hi' ? 'सत्यापन स्थिति व सत्यापनकर्ता नोट' : 'Verification Status & Audit Trail'}
                </h4>
                <p className="text-xs text-amber-900 mt-0.5">
                  <strong>Status:</strong> {verInfo.label} • {verInfo.description}
                </p>
                {property.verificationNotes && (
                  <p className="text-xs text-amber-800 mt-1 italic">
                    "{property.verificationNotes}"
                  </p>
                )}
                <div className="text-[11px] text-amber-700 mt-1 flex flex-wrap gap-3">
                  {property.verifiedBy && <span>Verified by: <strong>{property.verifiedBy}</strong></span>}
                  {property.verificationDate && <span>Date: {property.verificationDate}</span>}
                </div>
              </div>
            </div>

            {/* Statutory Disclaimer - Prominently Disclosed as per Prompt Requirements */}
            <div className="pt-3 border-t border-amber-200/80 text-[11px] text-amber-950 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-red-900">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Statutory Buyer Advisory (कानूनी सूचना):</span>
              </div>
              <p>
                {settings.platformName} verification only checks submitter identity and physical property availability. It <strong>DOES NOT</strong> replace independent legal title due diligence, UP Bhulekh (Khasra-Khatauni) search in the local Chakia tehsil, Section 143/80 agricultural-to-non-agricultural conversion orders, or encumbrance certificates. Buyers must independently verify ownership records before paying any advance token or registering the property.
              </p>
            </div>
          </div>

          {/* Footer Metadata & Report */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
            <div>
              <span>Added: {property.dateAdded}</span>
              <span className="mx-2">•</span>
              <span>Updated: {property.lastUpdated}</span>
              <span className="mx-2">•</span>
              <span>Views: {property.viewsCount}</span>
            </div>

            <button
              onClick={() => onOpenReport(property)}
              className="text-stone-500 hover:text-red-700 font-semibold flex items-center gap-1 text-xs transition cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'गलत या बिका हुआ प्लॉट रिपोर्ट करें' : 'Report Listing'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
