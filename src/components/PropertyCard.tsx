import React from 'react';
import { 
  MapPin, 
  Ruler, 
  ShieldCheck, 
  Compass, 
  MessageCircle, 
  PhoneCall, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Sparkles
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

interface PropertyCardProps {
  property: Property;
  settings: PlatformSettings;
  language: Language;
  onSelectProperty: (property: Property) => void;
  onTrackMetric: (propertyId: string, metric: 'whatsapp' | 'call') => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  settings,
  language,
  onSelectProperty,
  onTrackMetric,
}) => {
  const t = translations[language];
  const verInfo = formatVerificationStatus(property.verificationStatus, language === 'hi');
  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTrackMetric(property.id, 'whatsapp');
    const msg = generatePropertyWhatsAppMessage(property, settings.platformName);
    const targetPhone = property.contactWhatsApp || property.contactPhone || settings.adminWhatsAppNumber;
    const url = buildWhatsAppLink(targetPhone, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTrackMetric(property.id, 'call');
    const phone = property.contactPhone || settings.adminPhoneNumber;
    window.location.href = `tel:${phone}`;
  };

  // Availability Badge
  const isAvailable = property.availability === 'available';
  const isSold = property.availability === 'sold';
  const isUnderDiscussion = property.availability === 'under_discussion';

  return (
    <div 
      onClick={() => onSelectProperty(property)}
      className="group bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Thumbnail & Badges */}
      <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
        <img
          src={mainImage}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-stone-900 shadow-xs backdrop-blur">
            {formatCategoryName(property.category, language === 'hi')}
          </span>

          <div className="flex flex-col items-end gap-1">
            {/* Verification Badge */}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 shadow-xs ${verInfo.badgeClass}`}>
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>{verInfo.label}</span>
            </span>

            {/* Availability Badge if not regular available */}
            {isSold && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-600 text-white shadow-xs uppercase">
                {language === 'hi' ? 'बिक चुका है (SOLD)' : 'SOLD'}
              </span>
            )}
            {isUnderDiscussion && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-white shadow-xs">
                {language === 'hi' ? 'टोकन/बातचीत जारी' : 'Under Token'}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Property ID & Locality Tag on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs pointer-events-none">
          <div className="flex items-center gap-1 font-medium drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="line-clamp-1">{property.locality}, {property.tehsil}</span>
          </div>
          <span className="text-[10px] font-mono font-semibold bg-stone-900/80 px-1.5 py-0.5 rounded text-stone-300">
            {property.id}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Price & Negotiable */}
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {formatINR(property.price)}
              </span>
              <span className="text-[11px] font-semibold text-stone-500 ml-1.5">
                {property.isPriceNegotiable 
                  ? (language === 'hi' ? '• मोलभाव संभव' : '• Negotiable') 
                  : (language === 'hi' ? '• तय कीमत' : '• Fixed Price')}
              </span>
            </div>
            
            {/* Rate indicator (approx price per unit) */}
            <div className="text-right">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {property.plotArea} {formatUnitName(property.plotAreaUnit, language === 'hi')}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-stone-900 line-clamp-2 mt-2 leading-snug group-hover:text-emerald-700 transition">
            {property.title}
          </h3>

          {/* Key Specs Pill Matrix */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="line-clamp-1">
                {language === 'hi' ? 'रास्ता:' : 'Road:'} <strong className="text-stone-800">{property.roadWidthFt} ft</strong>
              </span>
            </div>
            {property.facingDirection ? (
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="line-clamp-1">
                  {language === 'hi' ? 'दिशा:' : 'Facing:'} <strong className="text-stone-800">{property.facingDirection}</strong>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="line-clamp-1 text-emerald-700 font-medium">
                  {property.legalRecordType.replace('_', ' ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-stone-100 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {/* WhatsApp Direct */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
              title="Enquire on WhatsApp with Property ID"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>WhatsApp</span>
            </button>

            {/* Direct Call */}
            <button
              onClick={handleCallClick}
              className="w-full py-2 px-2.5 rounded-xl border border-stone-300 hover:border-emerald-500 hover:bg-emerald-50 text-stone-800 hover:text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'hi' ? 'कॉल करें' : 'Call'}</span>
            </button>
          </div>

          <button
            onClick={() => onSelectProperty(property)}
            className="w-full py-1.5 text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center justify-center gap-1"
          >
            <span>{t.viewDetails}</span>
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
