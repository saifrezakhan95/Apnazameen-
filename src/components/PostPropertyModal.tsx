import React, { useState } from 'react';
import { 
  X, 
  Building, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Image as ImageIcon,
  Lock
} from 'lucide-react';
import { PropertySubmission, PropertyCategory, MeasurementUnit, SubmitterType } from '../types';
import { Language, translations } from '../utils/translations';

interface PostPropertyModalProps {
  language: Language;
  onClose: () => void;
  onSubmit: (submission: PropertySubmission) => void;
}

const PRESET_PHOTOS = [
  { label: 'Farm Land with Crops', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Open Residential Plot', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Highway Commercial Land', url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Rural Farm Boundary', url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80' },
];

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({
  language,
  onClose,
  onSubmit,
}) => {
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [submitterName, setSubmitterName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [submitterType, setSubmitterType] = useState<SubmitterType>('owner');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('agricultural_land');
  const [locality, setLocality] = useState('');
  const [tehsil, setTehsil] = useState('Chakia');
  const [price, setPrice] = useState('');
  const [isPriceNegotiable, setIsPriceNegotiable] = useState(true);
  const [plotArea, setPlotArea] = useState('');
  const [plotAreaUnit, setPlotAreaUnit] = useState<MeasurementUnit>('bigha');
  const [roadWidthFt, setRoadWidthFt] = useState('');
  const [facingDirection, setFacingDirection] = useState('East');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_PHOTOS[0].url);
  const [consentGiven, setConsentGiven] = useState(false);
  const [authorizationConfirmed, setAuthorizationConfirmed] = useState(false);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!submitterName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please provide a valid 10-digit Indian phone number');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Please provide a property title');
      return;
    }
    if (!locality.trim()) {
      setErrorMsg('Please enter locality or village name');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMsg('Please enter a valid asking price');
      return;
    }
    const numArea = parseFloat(plotArea);
    if (isNaN(numArea) || numArea <= 0) {
      setErrorMsg('Please enter a valid plot area');
      return;
    }
    if (!consentGiven || !authorizationConfirmed) {
      setErrorMsg('You must agree to the listing consent and confirm your authorization');
      return;
    }

    const submission: PropertySubmission = {
      id: `SUB-${Date.now().toString().slice(-6)}`,
      submittedAt: new Date().toISOString().split('T')[0],
      submitterName: submitterName.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      submitterType,
      title: title.trim(),
      category,
      locality: locality.trim(),
      tehsil: tehsil.trim() || 'Chakia',
      district: 'Chandauli',
      price: numPrice,
      isPriceNegotiable,
      plotArea: numArea,
      plotAreaUnit,
      roadWidthFt: parseFloat(roadWidthFt) || 20,
      facingDirection,
      description: description.trim() || 'Genuine property listing submitted for local verification in Chakia, Chandauli.',
      imageUrl,
      consentGiven,
      authorizationConfirmed,
      status: 'pending_review',
    };

    onSubmit(submission);
    setSubmittedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-stone-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900">
                {language === 'hi' ? 'अपनी प्रॉपर्टी / जमीन लिस्ट करें' : 'Post Your Property Listing'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {language === 'hi' ? '100% निशुल्क • 24 घंटे में वेरिफिकेशन' : '100% Free • Verified within 24 hours'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {submittedSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-stone-900">
                {language === 'hi' ? 'प्रॉपर्टी सबमिशन सफल रहा!' : 'Property Submitted for Review!'}
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                {language === 'hi'
                  ? 'आपकी लिस्टिंग सफलतापूर्वक दर्ज हो गई है। हमारी टीम 24 घंटे के भीतर आपसे फोन पर संपर्क कर विवरण सत्यापित करेगी। सत्यापन उपरांत इसे सार्वजनिक किया जाएगा।'
                  : 'Your property has been submitted to the moderation queue with status Pending Review. Our local coordinator will call your phone to verify the details before making it public.'}
              </p>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left max-w-md mx-auto">
                <span className="font-bold block mb-1">🛡️ Anti-Fraud & Quality Assurance:</span>
                We do not auto-publish unverified land listings to protect genuine buyers and ensure only real local land owners and authorized brokers connect on ApnaZameen.
              </div>
              <button
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition"
              >
                {language === 'hi' ? 'ठीक है, बंद करें' : 'Done & Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submitter Details */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? 'आपका विवरण (Submitter Details)' : 'Your Contact Details'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={submitterName}
                      onChange={(e) => setSubmitterName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'hi' ? 'आपका संबंध / रोल *' : 'Your Role *'}
                    </label>
                    <select
                      value={submitterType}
                      onChange={(e) => setSubmitterType(e.target.value as SubmitterType)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
                    >
                      <option value="owner">Direct Owner (मालिक)</option>
                      <option value="authorized_relative">Authorized Family Relative</option>
                      <option value="local_broker">Local Broker / Consultant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'hi' ? 'मोबाइल नंबर (कॉल) *' : 'Phone Number (Call) *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'hi' ? 'व्हाट्सएप नंबर (यदि अलग हो)' : 'WhatsApp Number (if different)'}
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  {language === 'hi' ? 'प्रॉपर्टी की जानकारी' : 'Property Specifications'}
                </h4>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'लिस्टिंग शीर्षक *' : 'Property Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 5 Bigha Roadside Farmland with Tubewell"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'hi' ? 'श्रेणी *' : 'Category *'}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="agricultural_land">🌾 Agricultural Land (खेती की जमीन)</option>
                      <option value="residential_plot">🏡 Residential Plot (कॉलोनी प्लॉट)</option>
                      <option value="commercial_land">🏢 Commercial Land (हाईवे/मार्केट)</option>
                      <option value="commercial_shop">🏪 Commercial Shop (दुकान)</option>
                      <option value="house_villa">🏠 House / Villa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'hi' ? 'गांव / इलाका (Locality) *' : 'Village / Locality *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="e.g. Rampur Village, Near Highway"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'hi' ? 'मांग कीमत (कुल रुपये में) *' : 'Asking Price (Total INR ₹) *'}
                    </label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 3500000 (for 35 Lakh)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        id="negCheck"
                        checked={isPriceNegotiable}
                        onChange={(e) => setIsPriceNegotiable(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <label htmlFor="negCheck" className="text-[11px] text-stone-600 font-medium">
                        {language === 'hi' ? 'कीमत में मोलभाव संभव है' : 'Price is negotiable'}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'hi' ? 'रकबा (Area) व इकाई *' : 'Plot Area & Unit *'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={plotArea}
                        onChange={(e) => setPlotArea(e.target.value)}
                        placeholder="e.g. 4.5"
                        className="w-1/2 px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                      />
                      <select
                        value={plotAreaUnit}
                        onChange={(e) => setPlotAreaUnit(e.target.value as MeasurementUnit)}
                        className="w-1/2 px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
                      >
                        <option value="bigha">बीघा (Bigha)</option>
                        <option value="sq_yards">गज (Sq.Yards)</option>
                        <option value="acre">एकड़ (Acre)</option>
                        <option value="sq_ft">Sq.Ft</option>
                        <option value="guntha">गुंठा (Guntha)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'hi' ? 'रास्ते की चौड़ाई (फीट में)' : 'Road Width (Feet)'}
                    </label>
                    <input
                      type="number"
                      value={roadWidthFt}
                      onChange={(e) => setRoadWidthFt(e.target.value)}
                      placeholder="e.g. 30"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'hi' ? 'दिशा (Facing)' : 'Facing Direction'}
                    </label>
                    <select
                      value={facingDirection}
                      onChange={(e) => setFacingDirection(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="East">East (पूर्व)</option>
                      <option value="North">North (उत्तर)</option>
                      <option value="West">West (पश्चिम)</option>
                      <option value="South">South (दक्षिण)</option>
                      <option value="North-East">North-East (ईशान)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'विवरण (Description)' : 'Property Description & Landmarks'}
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe water availability, boundary, nearby school/highway..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Photo Upload / Preset Selection */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'hi' ? 'प्रॉपर्टी की फोटो (Choose Sample or Upload)' : 'Property Photograph'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_PHOTOS.map((p, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setImageUrl(p.url)}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition ${
                        imageUrl === p.url ? 'border-emerald-600 scale-102 ring-2 ring-emerald-300' : 'border-stone-300 opacity-70'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
                  <span>Or upload actual mobile photo:</span>
                  <label className="cursor-pointer font-bold text-emerald-700 hover:underline flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Mandatory Legal Declarations */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    required
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600"
                  />
                  <span>
                    I give consent to publish this property information and contact details on ApnaZameen.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    required
                    checked={authorizationConfirmed}
                    onChange={(e) => setAuthorizationConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600"
                  />
                  <span>
                    I confirm that I am the legal owner or authorized representative for this property.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition cursor-pointer mt-4"
              >
                {language === 'hi' ? 'समीक्षा के लिए सबमिट करें (Submit Listing)' : 'Submit Property for Verification'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
