import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  Layers, 
  Lock 
} from 'lucide-react';
import { BuyerRequirement, PropertyCategory, MeasurementUnit } from '../types';
import { Language, translations } from '../utils/translations';

interface BuyerRequirementModalProps {
  language: Language;
  localities: string[];
  onClose: () => void;
  onSubmit: (requirement: BuyerRequirement) => void;
}

export const BuyerRequirementModal: React.FC<BuyerRequirementModalProps> = ({
  language,
  localities,
  onClose,
  onSubmit,
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [preferredLocality, setPreferredLocality] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('agricultural_land');
  const [minBudgetLakh, setMinBudgetLakh] = useState('');
  const [maxBudgetLakh, setMaxBudgetLakh] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [areaUnit, setAreaUnit] = useState<MeasurementUnit>('bigha');
  const [intendedUse, setIntendedUse] = useState<BuyerRequirement['intendedUse']>('farming_agriculture');
  const [roadAccessRequirement, setRoadAccessRequirement] = useState('Minimum 20 ft road access required');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number');
      return;
    }
    const minBud = parseFloat(minBudgetLakh) * 100000;
    const maxBud = parseFloat(maxBudgetLakh) * 100000;
    if (isNaN(minBud) || isNaN(maxBud) || maxBud <= 0) {
      setErrorMsg('Please provide valid budget ranges in Lakhs');
      return;
    }

    const requirement: BuyerRequirement = {
      id: `REQ-${Date.now().toString().slice(-5)}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      preferredLocalities: preferredLocality ? [preferredLocality.trim()] : ['Any nearby locality'],
      category,
      minBudget: minBud,
      maxBudget: maxBud,
      requiredAreaMin: parseFloat(minArea) || 1,
      requiredAreaMax: parseFloat(maxArea) || 5,
      areaUnit,
      intendedUse,
      roadAccessRequirement,
      notes: notes.trim(),
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'new',
    };

    onSubmit(requirement);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-stone-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900">
                {language === 'hi' ? 'अपनी जमीन / प्लॉट की आवश्यकता दर्ज करें' : 'Submit Property Purchase Requirement'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {language === 'hi' ? 'गोपनीय डेटा • केवल प्रामाणिक मैच के लिए' : 'Private & Confidential • Matched with Verified Land'}
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
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-stone-900">
                {language === 'hi' ? 'आपकी आवश्यकता दर्ज हो गई है!' : 'Buyer Requirement Submitted!'}
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                {language === 'hi'
                  ? 'आपकी मांग सुरक्षित रूप से दर्ज कर ली गई है। आपका फोन नंबर और बजट सार्वजनिक रूप से प्रदर्शित नहीं किया जाता। जैसे ही कोई उपयुक्त सत्यापित जमीन उपलब्ध होगी, आपको सूचित किया जाएगा।'
                  : 'Your request has been securely logged. Your phone number and private budget will NEVER be displayed publicly. When verified land matching your criteria is found, our coordinator will reach out directly on WhatsApp.'}
              </p>
              <button
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition"
              >
                {language === 'hi' ? 'धन्यवाद, बंद करें' : 'Close'}
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

              {/* Privacy Notice */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>100% Privacy Protection:</strong> We do not spam or sell your contact number to unsolicited telemarketers.
                </span>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'आपका नाम *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Anand Meena"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'मोबाइल नंबर (कॉल / व्हाट्सएप) *' : 'Phone / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9829012345"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Category & Preferred Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'किस प्रकार की जमीन चाहिए? *' : 'Property Category *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="agricultural_land">🌾 Agricultural Land (खेती की जमीन)</option>
                    <option value="commercial_land">🏢 Commercial Land (Highway / Main Road)</option>
                    <option value="residential_plot">🏡 Residential Plot (कॉलोनी प्लॉट)</option>
                    <option value="commercial_shop">🏪 Commercial Shop</option>
                    <option value="house_villa">🏠 Ready House / Villa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'पसंदीदा गांव / इलाका' : 'Preferred Village / Locality'}
                  </label>
                  <input
                    type="text"
                    value={preferredLocality}
                    onChange={(e) => setPreferredLocality(e.target.value)}
                    placeholder="e.g. Rampur, Highway bypass, or any"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Budget in Lakhs */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'hi' ? 'बजट दायरा (लाख ₹ में) *' : 'Budget Range (in ₹ Lakhs) *'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Min Budget (₹ Lakhs)</span>
                    <input
                      type="number"
                      required
                      value={minBudgetLakh}
                      onChange={(e) => setMinBudgetLakh(e.target.value)}
                      placeholder="e.g. 15 (for 15 Lakh)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Max Budget (₹ Lakhs)</span>
                    <input
                      type="number"
                      required
                      value={maxBudgetLakh}
                      onChange={(e) => setMaxBudgetLakh(e.target.value)}
                      placeholder="e.g. 35 (for 35 Lakh)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Required Land Size & Intended Use */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'आवश्यक रकबा (Area) व इकाई' : 'Required Area Size & Unit'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={minArea}
                      onChange={(e) => setMinArea(e.target.value)}
                      placeholder="Min"
                      className="w-1/3 px-2 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                    />
                    <input
                      type="number"
                      value={maxArea}
                      onChange={(e) => setMaxArea(e.target.value)}
                      placeholder="Max"
                      className="w-1/3 px-2 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                    />
                    <select
                      value={areaUnit}
                      onChange={(e) => setAreaUnit(e.target.value as MeasurementUnit)}
                      className="w-1/3 px-2 py-2 text-xs rounded-xl border border-stone-300 bg-white font-semibold"
                    >
                      <option value="bigha">बीघा</option>
                      <option value="sq_yards">गज</option>
                      <option value="acre">एकड़</option>
                      <option value="sq_ft">Sq.Ft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'जमीन का उपयोग (Intended Use)' : 'Intended Use'}
                  </label>
                  <select
                    value={intendedUse}
                    onChange={(e) => setIntendedUse(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="farming_agriculture">🌾 खेती / बागवानी (Farming)</option>
                    <option value="residential_home">🏡 मकान बनाना (Own Home)</option>
                    <option value="warehouse_godown">📦 गोदाम / वेयरहाउस (Warehouse)</option>
                    <option value="commercial_shop">🏪 दुकान / ढाबा / पेट्रोल पंप</option>
                    <option value="investment_appreciation">📈 दीर्घकालिक निवेश (Investment)</option>
                  </select>
                </div>
              </div>

              {/* Road Access & Specific requirements */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'hi' ? 'सड़क / रास्ते की आवश्यकता' : 'Road Access Requirement'}
                </label>
                <input
                  type="text"
                  value={roadAccessRequirement}
                  onChange={(e) => setRoadAccessRequirement(e.target.value)}
                  placeholder="e.g. Minimum 25 ft tar road, tractor access, or direct highway front"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'hi' ? 'अन्य कोई विशेष शर्त (Additional Notes)' : 'Additional Notes / Preferences'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Must have sweet drinking water borewell, immediate registry only..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Consent */}
              <label className="flex items-start gap-2 cursor-pointer text-xs text-stone-700 pt-2 border-t border-stone-200">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600"
                />
                <span>
                  I give consent to be contacted by ApnaZameen coordinators regarding matching verified properties in Chakia & Chandauli.
                </span>
              </label>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm shadow-md transition cursor-pointer mt-4"
              >
                {language === 'hi' ? 'अपनी आवश्यकता सबमिट करें' : 'Submit Requirement (Free)'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
