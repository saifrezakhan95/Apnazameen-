import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Car, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  MessageCircle 
} from 'lucide-react';
import { Property, SiteVisitRequest, PlatformSettings } from '../types';
import { Language, translations } from '../utils/translations';
import { buildWhatsAppLink } from '../utils/formatters';

interface SiteVisitModalProps {
  property: Property;
  settings: PlatformSettings;
  language: Language;
  onClose: () => void;
  onSubmit: (request: SiteVisitRequest) => void;
}

export const SiteVisitModal: React.FC<SiteVisitModalProps> = ({
  property,
  settings,
  language,
  onClose,
  onSubmit,
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState<SiteVisitRequest['preferredTimeSlot']>('morning_9_12');
  const [transportAssistance, setTransportAssistance] = useState(false);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please provide a valid 10-digit mobile number');
      return;
    }
    if (!preferredDate) {
      setErrorMsg('Please select a preferred date for the site visit');
      return;
    }

    const req: SiteVisitRequest = {
      id: `VISIT-${Date.now().toString().slice(-5)}`,
      propertyId: property.id,
      propertyTitle: property.title,
      visitorName: name.trim(),
      phone: phone.trim(),
      whatsapp: phone.trim(),
      preferredDate,
      preferredTimeSlot: timeSlot,
      transportAssistanceRequired: transportAssistance,
      notes: notes.trim(),
      status: 'pending_confirmation',
      dateRequested: new Date().toISOString().split('T')[0],
    };

    onSubmit(req);
    setIsSuccess(true);
  };

  const handleOpenDirectWhatsAppConfirmation = () => {
    const text = `Hello ${settings.platformName} Team, I just requested a site visit for Property ID: ${property.id} (${property.title}).\nName: ${name}\nDate: ${preferredDate}\nSlot: ${timeSlot.replace(/_/g, ' ')}\nPlease confirm appointment.`;
    const url = buildWhatsAppLink(settings.adminWhatsAppNumber, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-stone-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                {language === 'hi' ? 'साइट विजिट बुक करें' : 'Schedule Free Site Visit'}
              </h2>
              <p className="text-[11px] text-stone-500 font-mono">
                Property ID: {property.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-500 hover:text-stone-900 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                {language === 'hi' ? 'साइट विजिट अनुरोध दर्ज किया गया' : 'Site Visit Request Logged'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                {language === 'hi'
                  ? 'आपका अनुरोध प्राप्त हो गया है। हमारी टीम स्थानीय प्रतिनिधि या मालिक से समय समन्वय कर आपको कॉल करके विजिट की पुष्टि (Confirmation) करेगी। बिना पुष्टि के सीधे मौके पर न जाएं।'
                  : 'Your request has been received. Note: Visits are not confirmed until our local coordinator or the property owner confirms availability by phone.'}
              </p>

              {/* Direct WhatsApp fast-track */}
              <div className="pt-2">
                <button
                  onClick={handleOpenDirectWhatsAppConfirmation}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>Notify Admin via WhatsApp for Fast Confirmation</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="text-xs text-stone-500 hover:text-stone-800 underline font-semibold block mx-auto"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-800 text-xs flex items-center gap-1.5 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Property summary */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Selected Property:</span>
                <span className="font-bold text-stone-900 line-clamp-1">{property.title}</span>
                <span className="text-stone-600 text-[11px] block mt-0.5">Location: {property.locality}, Tehsil {property.tehsil}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'hi' ? 'आपका नाम *' : 'Your Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Surendra Sharma"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'hi' ? 'मोबाइल नंबर (कॉल व पुष्टि हेतु) *' : 'Mobile Number (for Call Confirmation) *'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9829012345"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'विजिट की तारीख *' : 'Preferred Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'समय स्लॉट *' : 'Preferred Slot *'}
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="morning_9_12">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon_12_4">Afternoon (12 PM - 4 PM)</option>
                    <option value="evening_4_7">Evening (4 PM - 7 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'hi' ? 'नोट / सवाल' : 'Specific Instructions or Meeting Point'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Will come by bus, please meet at bus stand"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 border-t border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={transportAssistance}
                    onChange={(e) => setTransportAssistance(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Need local coordinator to guide from the main road junction</span>
                </label>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 text-[11px] text-amber-900 border border-amber-200">
                ⚠️ <strong>Important Notice:</strong> Submitting this form requests a visit. Our team will contact you to confirm the owner's availability before the visit is finalized.
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                {language === 'hi' ? 'विजिट का समय बुक करें' : 'Request Site Visit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
