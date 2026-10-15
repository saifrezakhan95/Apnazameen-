export type PropertyCategory = 'residential_plot' | 'agricultural_land' | 'commercial_land' | 'commercial_shop' | 'house_villa';

export type MeasurementUnit = 'sq_ft' | 'sq_yards' | 'bigha' | 'acre' | 'guntha';

export type AvailabilityStatus = 'available' | 'under_discussion' | 'sold';

export type VerificationStatus = 
  | 'pending_review' 
  | 'contact_verified' 
  | 'availability_confirmed' 
  | 'documents_reviewed' 
  | 'rejected';

export type SubmitterType = 'owner' | 'authorized_relative' | 'local_broker';

export interface Property {
  id: string; // e.g. "BHM-101"
  title: string;
  category: PropertyCategory;
  price: number; // in INR (total amount)
  isPriceNegotiable: boolean;
  locality: string; // Village or Neighborhood name
  tehsil: string;
  district: string;
  state: string;
  plotArea: number;
  plotAreaUnit: MeasurementUnit;
  dimensions?: string; // e.g. "40 x 60 ft"
  roadWidthFt: number; // in feet
  roadType: 'pucca_tar' | 'concrete' | 'kharanja_brick' | 'kaccha_road';
  facingDirection?: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
  boundaryWall: 'full' | 'partial' | 'open';
  waterSource?: string; // e.g. "Govt pipeline + Tubewell", "Canal water"
  electricityAvailable: boolean;
  legalRecordType: 'freehold_registry' | '143_residential_converted' | 'gram_panchayat_patta' | 'agricultural_khasra' | 'commercial_sanctioned';
  description: string;
  images: string[];
  videoLink?: string;
  mapLink?: string; // Google Maps / landmark link
  landmarks: string[];
  
  // Verification details
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  verifiedBy?: string;
  verificationDate?: string;

  // Contact details (Owner/Broker)
  contactName: string;
  contactRole: SubmitterType;
  contactPhone: string;
  contactWhatsApp: string;
  showPhonePublicly: boolean;

  // Metadata
  isFeatured: boolean;
  availability: AvailabilityStatus;
  dateAdded: string;
  lastUpdated: string;
  viewsCount: number;
  enquiriesCount: number;
  whatsappClicksCount: number;
  callClicksCount: number;
}

export interface BuyerRequirement {
  id: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  preferredLocalities: string[];
  category: PropertyCategory;
  minBudget: number; // in INR
  maxBudget: number; // in INR
  requiredAreaMin: number;
  requiredAreaMax: number;
  areaUnit: MeasurementUnit;
  intendedUse: 'residential_home' | 'farming_agriculture' | 'warehouse_godown' | 'commercial_shop' | 'investment_appreciation';
  roadAccessRequirement: string;
  notes?: string;
  dateSubmitted: string;
  status: 'new' | 'contacted' | 'matching_properties_sent' | 'closed';
}

export interface SiteVisitRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  visitorName: string;
  phone: string;
  whatsapp: string;
  preferredDate: string;
  preferredTimeSlot: 'morning_9_12' | 'afternoon_12_4' | 'evening_4_7';
  transportAssistanceRequired: boolean;
  notes?: string;
  status: 'pending_confirmation' | 'confirmed' | 'completed' | 'cancelled';
  dateRequested: string;
}

export interface PropertySubmission {
  id: string;
  submittedAt: string;
  submitterName: string;
  phone: string;
  whatsapp: string;
  submitterType: SubmitterType;
  title: string;
  category: PropertyCategory;
  locality: string;
  tehsil: string;
  district: string;
  price: number;
  isPriceNegotiable: boolean;
  plotArea: number;
  plotAreaUnit: MeasurementUnit;
  roadWidthFt: number;
  facingDirection?: string;
  description: string;
  imageUrl?: string;
  consentGiven: boolean;
  authorizationConfirmed: boolean;
  status: 'pending_review' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface ListingReport {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reporterPhone: string;
  reason: 'already_sold' | 'fake_price' | 'wrong_location' | 'broker_dispute' | 'unauthorized_listing';
  details: string;
  dateReported: string;
  resolved: boolean;
}

export interface PlatformSettings {
  platformName: string;
  tagline: string;
  customDomain: string; // e.g. "apnazameen.in"
  websiteUrl: string; // e.g. "https://apnazameen.in"
  localDistrict: string;
  primaryTehsil: string;
  adminWhatsAppNumber: string; // e.g. "919876543210" without +
  adminPhoneNumber: string;
  adminEmail: string;
  officeAddress: string;
  disclaimerText: string;
}

export interface FilterState {
  category: string;
  locality: string;
  minPrice: number | '';
  maxPrice: number | '';
  minArea: number | '';
  maxArea: number | '';
  areaUnit: MeasurementUnit;
  verificationStatus: string;
  availability: string;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc';
  searchQuery: string;
}
