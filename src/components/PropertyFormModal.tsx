import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  LandPlot,
  Building2,
  DollarSign,
  Phone,
  FileCheck
} from 'lucide-react';
import { 
  Property, 
  PropertyCategory, 
  MeasurementUnit, 
  SubmitterType, 
  AvailabilityStatus, 
  VerificationStatus,
  PlatformSettings
} from '../types';
import { formatINR } from '../utils/formatters';

interface PropertyFormModalProps {
  propertyToEdit?: Property | null;
  settings: PlatformSettings;
  onClose: () => void;
  onSave: (property: Property) => void;
}

const PRESET_PHOTOS = [
  { label: 'Agricultural Farmland (Canal/Tubewell)', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Open Residential Colony Plot', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Highway Commercial Land', url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Boundary Wall Farm & Trees', url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Rural Road Land & Greenery', url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80' },
];

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  propertyToEdit,
  settings,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(propertyToEdit);

  // Form State
  const [title, setTitle] = useState(propertyToEdit?.title || '');
  const [category, setCategory] = useState<PropertyCategory>(propertyToEdit?.category || 'agricultural_land');
  const [price, setPrice] = useState<string>(propertyToEdit ? String(propertyToEdit.price) : '');
  const [isPriceNegotiable, setIsPriceNegotiable] = useState(propertyToEdit?.isPriceNegotiable ?? true);
  const [plotArea, setPlotArea] = useState<string>(propertyToEdit ? String(propertyToEdit.plotArea) : '');
  const [plotAreaUnit, setPlotAreaUnit] = useState<MeasurementUnit>(propertyToEdit?.plotAreaUnit || 'bigha');
  const [locality, setLocality] = useState(propertyToEdit?.locality || '');
  const [tehsil, setTehsil] = useState(propertyToEdit?.tehsil || settings.primaryTehsil || 'Chakia');
  const [district, setDistrict] = useState(propertyToEdit?.district || settings.localDistrict || 'Chandauli');
  const [state, setState] = useState(propertyToEdit?.state || 'Uttar Pradesh');
  const [dimensions, setDimensions] = useState(propertyToEdit?.dimensions || '');
  const [roadWidthFt, setRoadWidthFt] = useState<string>(propertyToEdit ? String(propertyToEdit.roadWidthFt) : '20');
  const [roadType, setRoadType] = useState<Property['roadType']>(propertyToEdit?.roadType || 'pucca_tar');
  const [facingDirection, setFacingDirection] = useState<Property['facingDirection']>(propertyToEdit?.facingDirection || 'East');
  const [boundaryWall, setBoundaryWall] = useState<Property['boundaryWall']>(propertyToEdit?.boundaryWall || 'open');
  const [waterSource, setWaterSource] = useState(propertyToEdit?.waterSource || '');
  const [electricityAvailable, setElectricityAvailable] = useState(propertyToEdit?.electricityAvailable ?? true);
  const [legalRecordType, setLegalRecordType] = useState<Property['legalRecordType']>(propertyToEdit?.legalRecordType || 'freehold_registry');
  const [description, setDescription] = useState(propertyToEdit?.description || '');
  const [landmarksText, setLandmarksText] = useState(propertyToEdit?.landmarks?.join(', ') || '');
  
  // Photos
  const [images, setImages] = useState<string[]>(
    propertyToEdit?.images && propertyToEdit.images.length > 0 
      ? propertyToEdit.images 
      : [PRESET_PHOTOS[0].url]
  );
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Contact
  const [contactName, setContactName] = useState(propertyToEdit?.contactName || '');
  const [contactRole, setContactRole] = useState<SubmitterType>(propertyToEdit?.contactRole || 'owner');
  const [contactPhone, setContactPhone] = useState(propertyToEdit?.contactPhone || settings.adminPhoneNumber || '');
  const [contactWhatsApp, setContactWhatsApp] = useState(propertyToEdit?.contactWhatsApp || settings.adminWhatsAppNumber || '');
  const [showPhonePublicly, setShowPhonePublicly] = useState(propertyToEdit?.showPhonePublicly ?? true);

  // Status & Verification
  const [availability, setAvailability] = useState<AvailabilityStatus>(propertyToEdit?.availability || 'available');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(propertyToEdit?.verificationStatus || 'contact_verified');
  const [verificationNotes, setVerificationNotes] = useState(propertyToEdit?.verificationNotes || 'Verified by Admin');
  const [isFeatured, setIsFeatured] = useState(propertyToEdit?.isFeatured ?? false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle local file upload (converts to base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg('Each image file should be under 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!customImageUrl.trim()) return;
    try {
      new URL(customImageUrl.trim());
      setImages((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
    } catch {
      setErrorMsg('Please enter a valid image URL starting with http:// or https://');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setImages((prev) => {
      const selected = prev[indexToPrimary];
      const rest = prev.filter((_, idx) => idx !== indexToPrimary);
      return [selected, ...rest];
    });
  };

  const handleAddPresetPhoto = (url: string) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!title.trim()) {
      setErrorMsg('Please enter a clear property title');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMsg('Please enter a valid asking price in ₹');
      return;
    }
    const numArea = parseFloat(plotArea);
    if (isNaN(numArea) || numArea <= 0) {
      setErrorMsg('Please enter a valid plot/land area');
      return;
    }
    if (!locality.trim()) {
      setErrorMsg('Please enter the locality or village name');
      return;
    }
    if (!contactName.trim()) {
      setErrorMsg('Please enter contact person name');
      return;
    }
    if (!contactPhone.trim() || contactPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit contact phone number');
      return;
    }
    if (images.length === 0) {
      setErrorMsg('Please add at least one property photo');
      return;
    }

    setIsSubmitting(true);

    const landmarks = landmarksText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const cleanId = propertyToEdit?.id || `APZ-${Math.floor(100 + Math.random() * 900)}`;

    const savedProperty: Property = {
      id: cleanId,
      title: title.trim(),
      category,
      price: numPrice,
      isPriceNegotiable,
      locality: locality.trim(),
      tehsil: tehsil.trim() || 'Chakia',
      district: district.trim() || 'Chandauli',
      state: state.trim() || 'Uttar Pradesh',
      plotArea: numArea,
      plotAreaUnit,
      dimensions: dimensions.trim() || undefined,
      roadWidthFt: parseFloat(roadWidthFt) || 20,
      roadType,
      facingDirection,
      boundaryWall,
      waterSource: waterSource.trim() || undefined,
      electricityAvailable,
      legalRecordType,
      description: description.trim() || `${title.trim()} located in ${locality.trim()}, ${tehsil.trim()}, ${district.trim()}. Direct road access, verified local title.`,
      images,
      landmarks: landmarks.length > 0 ? landmarks : [`Near ${locality.trim()}`],
      verificationStatus,
      verificationNotes: verificationNotes.trim() || 'Verified by Admin',
      verifiedBy: propertyToEdit?.verifiedBy || 'Admin Moderator',
      verificationDate: propertyToEdit?.verificationDate || new Date().toISOString().split('T')[0],
      contactName: contactName.trim(),
      contactRole,
      contactPhone: contactPhone.trim(),
      contactWhatsApp: contactWhatsApp.trim() || contactPhone.trim(),
      showPhonePublicly,
      isFeatured,
      availability,
      dateAdded: propertyToEdit?.dateAdded || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      viewsCount: propertyToEdit?.viewsCount || 0,
      enquiriesCount: propertyToEdit?.enquiriesCount || 0,
      whatsappClicksCount: propertyToEdit?.whatsappClicksCount || 0,
      callClicksCount: propertyToEdit?.callClicksCount || 0,
    };

    onSave(savedProperty);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-stone-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-bold">
              <LandPlot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight">
                {isEditing ? `Edit Property: ${propertyToEdit?.id}` : 'List New Property (नया प्लॉट जोड़ें)'}
              </h2>
              <p className="text-[11px] text-stone-400">
                {isEditing ? 'Update price, location, photos, contact, and legal status' : 'Add a verified property directly to the active catalog'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 text-xs text-stone-700">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Property Info */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4">
            <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>1. Basic Property Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-800 mb-1">
                  Property Title * (शीर्षक)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 2 Bigha Fertile Farmland near Chakia Canal with Tubewell"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Category * (प्रॉपर्टी प्रकार)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  <option value="agricultural_land">🌾 Agricultural Land (खेत / कृषि भूमि)</option>
                  <option value="residential_plot">🏡 Residential Plot (आवासीय प्लॉट)</option>
                  <option value="commercial_land">🏢 Commercial Land / Highway (कमर्शियल जमीन)</option>
                  <option value="commercial_shop">🏬 Commercial Shop / Office (दुकान / शोरूम)</option>
                  <option value="house_villa">🏠 House / Rural Villa (मकान / कोठी)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Asking Price in ₹ * (मांगी गई कीमत)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-stone-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min="10000"
                    step="5000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 2500000"
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
                {price && !isNaN(Number(price)) && (
                  <p className="text-[11px] text-emerald-700 font-bold mt-1">
                    Formatted: {formatINR(Number(price))}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPriceNegotiable"
                  checked={isPriceNegotiable}
                  onChange={(e) => setIsPriceNegotiable(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                />
                <label htmlFor="isPriceNegotiable" className="font-semibold text-stone-700 cursor-pointer">
                  Price is Negotiable (मोल-भाव संभव है)
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Area, Dimensions & Road */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4">
            <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <LandPlot className="w-4 h-4 text-emerald-600" />
              <span>2. Land Area, Road & Orientation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Plot Area * (क्षेत्रफल)
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0.1"
                  value={plotArea}
                  onChange={(e) => setPlotArea(e.target.value)}
                  placeholder="e.g. 2.5 or 1200"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Area Unit * (इकाई)
                </label>
                <select
                  value={plotAreaUnit}
                  onChange={(e) => setPlotAreaUnit(e.target.value as MeasurementUnit)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  <option value="bigha">Bigha (बीघा - UP Standard)</option>
                  <option value="biswa">Biswa (बिस्वा)</option>
                  <option value="sq_ft">Sq. Ft (वर्ग फुट)</option>
                  <option value="sq_yards">Sq. Yards / Gaj (गज)</option>
                  <option value="acre">Acre (एकड़)</option>
                  <option value="guntha">Guntha / Decimal (डिसमिल)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Dimensions (आयाम / फ्रंट x गहराई)
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 40 ft front x 60 ft depth"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Road Width in Feet (रास्ते की चौड़ाई)
                </label>
                <input
                  type="number"
                  min="5"
                  max="150"
                  value={roadWidthFt}
                  onChange={(e) => setRoadWidthFt(e.target.value)}
                  placeholder="e.g. 20"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Road Type (सड़क का प्रकार)
                </label>
                <select
                  value={roadType}
                  onChange={(e) => setRoadType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium"
                >
                  <option value="pucca_tar">Pucca Tar Road (डामर पक्की सड़क)</option>
                  <option value="concrete">Concrete CC Road (सीमेंट रोड)</option>
                  <option value="kharanja_brick">Kharanja Brick (ईंट खड़ंजा)</option>
                  <option value="kaccha_road">Kaccha Road (कच्चा रास्ता)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Facing Direction (दिशा)
                </label>
                <select
                  value={facingDirection}
                  onChange={(e) => setFacingDirection(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium"
                >
                  <option value="East">East (पूर्व - Shubh)</option>
                  <option value="North">North (उत्तर)</option>
                  <option value="North-East">North-East (ईशान कोण)</option>
                  <option value="West">West (पश्चिम)</option>
                  <option value="South">South (दक्षिण)</option>
                  <option value="North-West">North-West (वायव्य)</option>
                  <option value="South-East">South-East (आग्नेय)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Boundary Wall (चारदीवारी)
                </label>
                <select
                  value={boundaryWall}
                  onChange={(e) => setBoundaryWall(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium"
                >
                  <option value="open">Open Land (खुला प्लॉट / खेत)</option>
                  <option value="partial">Partial Fencing / तारबंदी</option>
                  <option value="full">Full Brick Boundary (पक्की बाउंड्री)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Water Source (पानी की सुविधा)
                </label>
                <input
                  type="text"
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value)}
                  placeholder="e.g. Tubewell + Canal / Jal Nigam"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="electricityAvailable"
                  checked={electricityAvailable}
                  onChange={(e) => setElectricityAvailable(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                />
                <label htmlFor="electricityAvailable" className="font-semibold text-stone-700 cursor-pointer">
                  Electricity Available (बिजली लाइन उपलब्ध)
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Location Details */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4">
            <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>3. Location & Legal Record Type</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Locality / Village * (गांव / मोहल्ला)
                </label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Latifshah Road, Chakia"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Tehsil (तहसील)
                </label>
                <input
                  type="text"
                  value={tehsil}
                  onChange={(e) => setTehsil(e.target.value)}
                  placeholder="e.g. Chakia"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  District & State (जिला व राज्य)
                </label>
                <input
                  type="text"
                  value={`${district}, ${state}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(',');
                    if (parts[0]) setDistrict(parts[0].trim());
                    if (parts[1]) setState(parts[1].trim());
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-800 mb-1">
                  Legal Title / Registry Type * (कागजात / खतौनी प्रकार)
                </label>
                <select
                  value={legalRecordType}
                  onChange={(e) => setLegalRecordType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold"
                >
                  <option value="freehold_registry">Freehold Registry (पक्का बैनामा / दाखिल-खारिज सुलभ)</option>
                  <option value="agricultural_khasra">Agricultural Khasra Khatauni (कृषि खसरा खतौनी)</option>
                  <option value="143_residential_converted">Section 143 Residential Converted (धारा 143 गैर-कृषि)</option>
                  <option value="commercial_sanctioned">Commercial Sanctioned (व्यावसायिक स्वीकृत)</option>
                  <option value="gram_panchayat_patta">Gram Panchayat Patta / Abadi</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Nearby Landmarks (प्रमुख लैंडमार्क)
                </label>
                <input
                  type="text"
                  value={landmarksText}
                  onChange={(e) => setLandmarksText(e.target.value)}
                  placeholder="e.g. Near Canal, 500m from Highway"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Photographs Management */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>4. Property Photographs ({images.length})</span>
              </h3>
              <span className="text-[11px] text-stone-500">First photo is used as main listing cover</span>
            </div>

            {/* Upload or Add URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Device File Upload */}
              <label className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white transition text-center group">
                <Upload className="w-6 h-6 text-stone-400 group-hover:text-emerald-600 transition mb-1" />
                <span className="font-bold text-stone-800 text-xs">Upload from Phone / Computer</span>
                <span className="text-[10px] text-stone-400 mt-0.5">Select real photos from camera or gallery</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Paste URL */}
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex flex-col justify-between">
                <div>
                  <label className="block font-bold text-stone-700 text-[11px] mb-1">Or Add Image by URL</label>
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://example.com/property.jpg"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="mt-2 py-1.5 px-3 rounded-lg bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition"
                >
                  Add Photo URL
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-bold text-stone-600 block mb-1.5">
                Quick Preset Sample Photos (Tap to add):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_PHOTOS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPresetPhoto(preset.url)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-emerald-500 text-[10px] font-medium text-stone-700 hover:text-emerald-800 transition flex items-center gap-1"
                  >
                    <span>+</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Images Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((imgUrl, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-stone-300 aspect-video bg-stone-100">
                    <img
                      src={imgUrl}
                      alt={`Property Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-1">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(index)}
                          className="px-1.5 py-1 rounded bg-white text-stone-900 text-[9px] font-bold"
                          title="Set as Main Cover"
                        >
                          Make Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {index === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[9px]">
                        Cover Photo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Owner & Contact */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4">
            <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>5. Owner / Broker Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Contact Person Name * (मालिक / प्रतिनिधि)
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra Yadav"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Contact Role (भूमिका)
                </label>
                <select
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value as SubmitterType)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium"
                >
                  <option value="owner">Direct Land Owner (मालिक)</option>
                  <option value="authorized_relative">Family Representative</option>
                  <option value="local_broker">Local Chakia Broker</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Calling Phone Number * (10 Digits)
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  WhatsApp Number (if different)
                </label>
                <input
                  type="tel"
                  value={contactWhatsApp}
                  onChange={(e) => setContactWhatsApp(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="showPhonePublicly"
                  checked={showPhonePublicly}
                  onChange={(e) => setShowPhonePublicly(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                />
                <label htmlFor="showPhonePublicly" className="font-semibold text-stone-700 cursor-pointer">
                  Display contact buttons publicly (Direct Call & WhatsApp inquiry)
                </label>
              </div>
            </div>
          </div>

          {/* Section 6: Description */}
          <div>
            <label className="block font-bold text-stone-800 mb-1">
              Detailed Property Description (विस्तृत विवरण)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the soil quality, boundary, road connectivity, surrounding area, distance to tehsil/hospital, and payment terms..."
              className="w-full p-3 rounded-xl border border-stone-300 bg-white text-xs leading-relaxed"
            />
          </div>

          {/* Section 7: Moderation, Availability & Verification Status */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
            <h3 className="font-bold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>6. Admin Moderation, Verification & Availability</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Availability Status
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as AvailabilityStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-emerald-900"
                >
                  <option value="available">🟢 Active & Available for Sale</option>
                  <option value="under_discussion">🟡 Under Token / Discussion</option>
                  <option value="sold">🔴 Sold Out</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Verification Badge
                </label>
                <select
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value as VerificationStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold"
                >
                  <option value="contact_verified">Contact Verified (फोन सत्यापित)</option>
                  <option value="availability_confirmed">Availability Confirmed</option>
                  <option value="documents_reviewed">Title Docs Reviewed (दस्तावेज जांचे गए)</option>
                  <option value="pending_review">Pending Review</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Verification Note / Officer
                </label>
                <input
                  type="text"
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="e.g. Khatauni 318 checked on Bhulekh"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div className="sm:col-span-3 flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded border-stone-300"
                />
                <label htmlFor="isFeatured" className="font-bold text-amber-900 cursor-pointer flex items-center gap-1">
                  <span>★</span>
                  <span>Feature on Homepage (प्रमुख लिस्टिंग के रूप में दिखाएं)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur pt-3 pb-1 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes & Update' : 'Publish Property to Website'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
