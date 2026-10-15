import React, { useState } from 'react';
import { X, Flag, CheckCircle, AlertTriangle } from 'lucide-react';
import { Property, ListingReport } from '../types';
import { Language } from '../utils/translations';

interface ReportListingModalProps {
  property: Property;
  language: Language;
  onClose: () => void;
  onSubmit: (report: ListingReport) => void;
}

export const ReportListingModal: React.FC<ReportListingModalProps> = ({
  property,
  language,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState<ListingReport['reason']>('already_sold');
  const [details, setDetails] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const report: ListingReport = {
      id: `REP-${Date.now().toString().slice(-5)}`,
      propertyId: property.id,
      propertyTitle: property.title,
      reporterPhone: reporterPhone.trim(),
      reason,
      details: details.trim(),
      dateReported: new Date().toISOString().split('T')[0],
      resolved: false,
    };
    onSubmit(report);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-stone-900 text-sm sm:text-base">
              {language === 'hi' ? 'लिस्टिंग रिपोर्ट करें' : 'Report Property Listing'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-stone-900">
                {language === 'hi' ? 'रिपोर्ट दर्ज की गई' : 'Report Submitted'}
              </h4>
              <p className="text-xs text-stone-600">
                Our moderation team will audit Property #{property.id} within 12 hours. Thank you for keeping our local marketplace genuine.
              </p>
              <button
                onClick={onClose}
                className="mt-2 py-2 px-5 bg-stone-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <p className="text-stone-600">
                Report inaccurate or suspicious information for <strong>{property.title}</strong> ({property.id}).
              </p>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Reason for Report *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-stone-300 font-medium"
                >
                  <option value="already_sold">Property Already Sold / Registry Done</option>
                  <option value="fake_price">Incorrect or Misleading Asking Price</option>
                  <option value="wrong_location">Wrong Village / Locality Specified</option>
                  <option value="unauthorized_listing">Poster is Not Authorized Owner/Broker</option>
                  <option value="broker_dispute">Legal Dispute / Multiple Claims</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Additional Clarification</label>
                <textarea
                  rows={2}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Explain what is incorrect or what the owner confirmed to you..."
                  className="w-full p-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Your Mobile Number (Optional)</label>
                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="In case our moderator needs to verify"
                  className="w-full p-2 rounded-xl border border-stone-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-xs cursor-pointer"
              >
                Submit Report to Admin
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
