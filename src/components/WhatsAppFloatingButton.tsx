import React from 'react';
import { MessageCircle } from 'lucide-react';
import { PlatformSettings } from '../types';
import { buildWhatsAppLink } from '../utils/formatters';
import { Language } from '../utils/translations';

interface WhatsAppFloatingButtonProps {
  settings: PlatformSettings;
  language: Language;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  settings,
  language,
}) => {
  const handleClick = () => {
    const text = `Hello ${settings.platformName}, I am looking for property details in ${settings.primaryTehsil}, ${settings.localDistrict}. Please assist me.`;
    const url = buildWhatsAppLink(settings.adminWhatsAppNumber, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-5 right-5 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white/80 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
      title="Chat on WhatsApp"
      aria-label="Direct WhatsApp Support"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
      </div>
      <span className="hidden sm:inline font-bold text-xs tracking-wide">
        {language === 'hi' ? 'व्हाट्सएप सहायता' : 'WhatsApp Support'}
      </span>
    </button>
  );
};
