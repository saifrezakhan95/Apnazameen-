import { MeasurementUnit, PropertyCategory, VerificationStatus } from '../types';

/**
 * Format an Indian Rupee amount into standard Indian denomination (Lakhs and Crores)
 * e.g., 2500000 -> ₹25 Lakh, 14500000 -> ₹1.45 Cr
 */
export function formatINR(amount: number): string {
  if (amount === 0) return '₹0';
  if (!amount || isNaN(amount)) return 'Price on Request';

  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} Lakh`;
  }
  if (amount >= 1000) {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `₹${amount}`;
}

export function formatUnitName(unit: MeasurementUnit, isHindi: boolean = false): string {
  switch (unit) {
    case 'sq_ft':
      return isHindi ? 'वर्ग फीट (Sq.Ft)' : 'Sq.Ft';
    case 'sq_yards':
      return isHindi ? 'गज (Sq.Yards)' : 'Gaj (Sq.Yds)';
    case 'bigha':
      return isHindi ? 'बीघा (Bigha)' : 'Bigha';
    case 'acre':
      return isHindi ? 'एकड़ (Acre)' : 'Acre';
    case 'guntha':
      return isHindi ? 'गुंठा (Guntha)' : 'Guntha';
    default:
      return unit;
  }
}

export function formatCategoryName(category: PropertyCategory, isHindi: boolean = false): string {
  switch (category) {
    case 'residential_plot':
      return isHindi ? 'आवासीय प्लॉट (Residential Plot)' : 'Residential Plot';
    case 'agricultural_land':
      return isHindi ? 'कृषि भूमि (Farm Land)' : 'Agricultural Land';
    case 'commercial_land':
      return isHindi ? 'कमर्शियल प्लॉट (Commercial Land)' : 'Commercial Land';
    case 'commercial_shop':
      return isHindi ? 'दुकान / शोरूम (Shop)' : 'Commercial Shop';
    case 'house_villa':
      return isHindi ? 'मकान / विला (House/Villa)' : 'House / Villa';
    default:
      return category;
  }
}

export function formatVerificationStatus(status: VerificationStatus, isHindi: boolean = false): {
  label: string;
  badgeClass: string;
  description: string;
} {
  switch (status) {
    case 'documents_reviewed':
      return {
        label: isHindi ? 'दस्तावेज़ सत्यापित' : 'Title Docs Reviewed',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        description: isHindi
          ? 'राजस्व अभिलेख / रजिस्ट्री दस्तावेज ऑपरेटर द्वारा सत्यापित किए गए हैं।'
          : 'Land registry / Khasra-Khatauni records cross-checked with submitter.',
      };
    case 'availability_confirmed':
      return {
        label: isHindi ? 'उपलब्धता पुष्ट' : 'Availability Confirmed',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        description: isHindi
          ? 'मालिक से फोन पर जमीन की वर्तमान उपलब्धता की पुष्टि की गई है।'
          : 'Direct contact with owner confirmed property is currently on sale.',
      };
    case 'contact_verified':
      return {
        label: isHindi ? 'सम्पर्क सत्यापित' : 'Contact Verified',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        description: isHindi
          ? 'लिस्टिंग प्रदाता का मोबाइल नंबर व ओटीपी/कॉल सत्यापित है।'
          : 'Submitter phone number and identity verified via direct call.',
      };
    case 'pending_review':
    default:
      return {
        label: isHindi ? 'समीक्षाधीन' : 'Pending Verification',
        badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
        description: isHindi
          ? 'नई सबमिशन - एडमिन द्वारा फील्ड सत्यापन अभी लंबित है।'
          : 'Fresh listing submitted. Verification in progress.',
      };
  }
}

/**
 * Builds a clean WhatsApp Click-to-Chat URL
 * Clean international format (e.g. 919876543210)
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  // Strip out any non-digit chars
  let cleaned = phone.replace(/\D/g, '');
  // If Indian 10 digits without country code, add 91
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encodedText}`;
}

export function generatePropertyWhatsAppMessage(property: {
  id: string;
  title: string;
  locality: string;
  price: number;
}, platformName: string): string {
  return `Namaste, I saw your property listing on ${platformName}.\n\n` +
    `📌 Property ID: ${property.id}\n` +
    `🏡 Property: ${property.title}\n` +
    `📍 Location: ${property.locality}\n` +
    `💰 Price: ${formatINR(property.price)}\n\n` +
    `Please share more details, accurate location pin, and confirm if it is currently available for a site visit.`;
}
