import React, { useState, useEffect } from 'react';
import {
  X,
  Video,
  Coffee,
  Check,
  Calendar,
  MapPin,
  Sparkles,
  Trash2,
  Copy,
} from 'lucide-react';
import {
  Locale,
  ListenerProfile,
  LISTENERS_DATA,
  SessionMode,
  BookingRecord,
  RsvpRecord,
  CommunityGathering,
} from '../data/kappinessData';
import { ListenerPortraitSvg } from './Illustrations';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  initialListener: ListenerProfile | null;
  initialMode: SessionMode;
  initialBrew: string;
  onSaveBooking: (booking: BookingRecord) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  locale,
  initialListener,
  initialMode,
  initialBrew,
  onSaveBooking,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [mode, setMode] = useState<SessionMode>(initialMode);
  const [language, setLanguage] = useState<string>('Malayalam');
  const [selectedListenerId, setSelectedListenerId] = useState<string>(
    initialListener?.id || LISTENERS_DATA[0].id
  );
  const [selectedDate, setSelectedDate] = useState<string>('Today, Nov 12');
  const [selectedSlot, setSelectedSlot] = useState<string>('6:30 PM IST');
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [coffeePreference, setCoffeePreference] = useState<string>(
    initialBrew || 'Cardamom Chukku Kappi'
  );
  const [userNote, setUserNote] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedBooking, setCompletedBooking] = useState<BookingRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setMode(initialMode);
      const targetListener = initialListener || LISTENERS_DATA[0];
      setSelectedListenerId(targetListener.id);
      setSelectedSlot(targetListener.availableSlots[0] || '6:30 PM IST');
      setCoffeePreference(
        initialBrew || targetListener.signatureKappi[locale] || 'Cardamom Chukku Kappi'
      );
      setValidationError('');
      setCompletedBooking(null);
      setCopiedCode(false);
    }
  }, [isOpen, initialListener, initialMode, initialBrew, locale]);

  if (!isOpen) return null;

  const activeListener =
    LISTENERS_DATA.find((l) => l.id === selectedListenerId) || LISTENERS_DATA[0];

  const eligibleListeners = LISTENERS_DATA.filter((l) => l.modes.includes(mode));

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || userName.trim().length < 2) {
      setValidationError(
        locale === 'en'
          ? 'Please enter your name so your listener knows how to greet you.'
          : 'ദയവായി നിങ്ങളുടെ പേര് നൽകുക.'
      );
      return;
    }
    const phoneClean = userPhone.replace(/\s+/g, '');
    if (phoneClean.length < 8) {
      setValidationError(
        locale === 'en'
          ? 'Please enter a valid 10-digit WhatsApp or phone number for session link / cafe directions.'
          : 'ദയവായി ശരിയായ ഫോൺ / വാട്സ്ആപ്പ് നമ്പർ നൽകുക.'
      );
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    window.setTimeout(() => {
      const newRecord: BookingRecord = {
        id: `bk-${Date.now()}`,
        referenceCode: `KAP-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        mode,
        listenerId: activeListener.id,
        listenerName: activeListener.name,
        listenerRoleLabel: activeListener.roleTitle.en,
        date: selectedDate,
        timeSlot: selectedSlot,
        language,
        userName: userName.trim(),
        userPhone: userPhone.trim(),
        coffeePreference,
        userNote: userNote.trim(),
      };
      onSaveBooking(newRecord);
      setCompletedBooking(newRecord);
      setIsSubmitting(false);
      setStep(4);
    }, 300);
  };

  const handleCopyCode = () => {
    if (!completedBooking) return;
    navigator.clipboard?.writeText(completedBooking.referenceCode);
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#231F1D]/60 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="bg-[#FBF8F3] border border-[#E6DEC8] rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-xl my-8">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#E6DEC8]">
          <div>
            <p className="text-xs font-medium text-[#E96326]">
              {step === 4
                ? locale === 'en'
                  ? 'Table Reserved · Confirmation Pass'
                  : 'ബുക്കിംഗ് പൂർത്തിയായി'
                : locale === 'en'
                ? `Step 0${step} of 03 · Guided Coffee-Chat Matching`
                : `ഘട്ടം 0${step} / 03 · കാപ്പിനസ് ബുക്കിംഗ്`}
            </p>
            <h2
              id="booking-modal-title"
              className="font-display text-xl md:text-2xl font-semibold text-[#231F1D] mt-1"
            >
              {step === 1 &&
                (locale === 'en'
                  ? 'How would you like to meet and talk?'
                  : 'എങ്ങനെയാണ് സംസാരിക്കാൻ ആഗ്രഹിക്കുന്നത്?')}
              {step === 2 &&
                (locale === 'en'
                  ? 'Choose your listener & unhurried time slot'
                  : 'കേൾവിക്കാരെയും സമയവും തിരഞ്ഞെടുക്കാം')}
              {step === 3 &&
                (locale === 'en'
                  ? 'How do you take your kappi?'
                  : 'നിങ്ങളുടെ വിവരങ്ങളും കാപ്പി താല്പര്യവും')}
              {step === 4 &&
                (locale === 'en'
                  ? 'Your Kappi Table is Ready!'
                  : 'നിങ്ങളുടെ കാപ്പി ടേബിൾ തയ്യാറാണ്!')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#F4EFE6] text-[#231F1D] hover:bg-[#E6DEC8] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        {step < 4 && (
          <div className="grid grid-cols-3 gap-2 my-5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-colors ${
                  s <= step ? 'bg-[#E96326]' : 'bg-[#E6DEC8]'
                }`}
              />
            ))}
          </div>
        )}

        {/* STEP 1: Format (Online vs In-Cafe) & Language */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#231F1D] mb-3">
                {locale === 'en'
                  ? '1. Select Session Atmosphere'
                  : '1. സംസാരിക്കാനുള്ള രീതി തിരഞ്ഞെടുക്കൂ'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMode('online')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    mode === 'online'
                      ? 'bg-[#FFFDF9] border-[#E96326] shadow-xs'
                      : 'bg-[#F4EFE6]/60 border-[#E6DEC8] hover:bg-[#FFFDF9]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-[#E96326]/10 text-[#E96326]">
                      <Video className="w-5 h-5" />
                    </span>
                    {mode === 'online' && <Check className="w-4 h-4 text-[#E96326]" />}
                  </div>
                  <h3 className="font-display text-base font-semibold text-[#231F1D]">
                    {locale === 'en' ? 'Online Video / Audio Chat' : 'ഓൺലൈൻ കൗൺസിലിംഗ് / ചാറ്റ്'}
                  </h3>
                  <p className="text-xs text-[#655B54] mt-1 leading-relaxed">
                    {locale === 'en'
                      ? 'Connect privately from anywhere in India, GCC, Europe, or home with your own mug of coffee.'
                      : 'ലോകത്തെവിടെയിരുന്നും സ്വകാര്യമായി വീഡിയോ/ഓഡിയോ കോളിലൂടെ സംസാരിക്കാം.'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('in_cafe')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    mode === 'in_cafe'
                      ? 'bg-[#FFFDF9] border-[#E96326] shadow-xs'
                      : 'bg-[#F4EFE6]/60 border-[#E6DEC8] hover:bg-[#FFFDF9]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-[#2D4A3E]/10 text-[#2D4A3E]">
                      <Coffee className="w-5 h-5" />
                    </span>
                    {mode === 'in_cafe' && <Check className="w-4 h-4 text-[#E96326]" />}
                  </div>
                  <h3 className="font-display text-base font-semibold text-[#231F1D]">
                    {locale === 'en'
                      ? 'In-Café Mud-House Chat (Trivandrum)'
                      : 'തിരുവനന്തപുരത്തെ കഫേയിൽ നേരിട്ട്'}
                  </h3>
                  <p className="text-xs text-[#655B54] mt-1 leading-relaxed">
                    {locale === 'en'
                      ? 'Drop into our leafy garden & earthen mud-house on Eswaravilasam Rd, Jagathy over freshly brewed kappi.'
                      : 'ജഗതിയിലെ മൺവീട്ടിലിരുന്ന് ചൂട് കാപ്പി കുടിച്ച് നേരിട്ട് സംസാരിക്കാം.'}
                  </p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#231F1D] mb-3">
                {locale === 'en'
                  ? '2. Preferred Conversation Language'
                  : '2. സംസാരിക്കാൻ താല്പര്യമുള്ള ഭാഷ'}
              </label>
              <div className="flex flex-wrap gap-2.5">
                {['Malayalam', 'English', 'Malayalam + English', 'Tamil'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      language === lang
                        ? 'bg-[#231F1D] text-[#FFFDF9] border-[#231F1D]'
                        : 'bg-[#FFFDF9] text-[#655B54] border-[#E6DEC8] hover:text-[#231F1D]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E6DEC8] flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-[#E96326] hover:bg-[#B04923] text-[#FFFDF9] text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {locale === 'en' ? 'Continue to Listener & Slot' : 'അടുത്ത ഘട്ടത്തിലേക്ക്'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Listener & Time Slot */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#231F1D] mb-2.5">
                {locale === 'en'
                  ? 'Select Your Tara Apper (Peer Listener) or Psychologist'
                  : 'താര ആപ്പറെയോ സൈക്കോളജിസ്റ്റിനെയോ തിരഞ്ഞെടുക്കൂ'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-1">
                {eligibleListeners.map((listener) => {
                  const isSelected = listener.id === activeListener.id;
                  return (
                    <button
                      key={listener.id}
                      type="button"
                      onClick={() => {
                        setSelectedListenerId(listener.id);
                        setSelectedSlot(listener.availableSlots[0]);
                      }}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFFDF9] border-[#E96326] shadow-xs'
                          : 'bg-[#F4EFE6]/50 border-[#E6DEC8] hover:bg-[#FFFDF9]'
                      }`}
                    >
                      <ListenerPortraitSvg
                        name={listener.name}
                        photoUrl={listener.photoUrl}
                        photoPosition={listener.photoPosition}
                        sizeClass="w-16 h-16"
                        theme={listener.avatarTheme}
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] text-[#E96326] font-medium truncate">
                          {listener.role === 'tara_apper' ? 'Tara Apper' : 'Psychologist'} · ₹
                          {listener.sessionFeeInr}
                        </p>
                        <h4 className="font-display text-sm font-semibold text-[#231F1D] truncate">
                          {locale === 'en' ? listener.name : listener.malayalamName}
                        </h4>
                        <p className="text-[11px] text-[#655B54] truncate">
                          {listener.languages.join(' · ')}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#231F1D] mb-2">
                  {locale === 'en' ? 'Preferred Day' : 'ദിവസം'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Today, Nov 12', 'Tomorrow, Nov 13', 'Sat, Nov 14'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono-tabular border cursor-pointer whitespace-nowrap shrink-0 ${
                        selectedDate === d
                          ? 'bg-[#231F1D] text-[#FFFDF9] border-[#231F1D]'
                          : 'bg-[#FFFDF9] text-[#655B54] border-[#E6DEC8]'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#231F1D] mb-2">
                  {locale === 'en' ? 'Available Time Slots' : 'ലഭ്യമായ സമയം'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {activeListener.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono-tabular border cursor-pointer whitespace-nowrap shrink-0 ${
                        selectedSlot === slot
                          ? 'bg-[#E96326] text-[#FFFDF9] border-[#E96326]'
                          : 'bg-[#FFFDF9] text-[#655B54] border-[#E6DEC8]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E6DEC8] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl border border-[#E6DEC8] text-xs font-medium text-[#655B54] hover:text-[#231F1D] cursor-pointer"
              >
                {locale === 'en' ? 'Back' : 'പിന്നിലേക്ക്'}
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-[#E96326] hover:bg-[#B04923] text-[#FFFDF9] text-sm font-medium transition-colors cursor-pointer"
              >
                {locale === 'en' ? 'Next: Your Coffee & Contact' : 'അടുത്ത ഘട്ടം'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Contact Details & Coffee Preference */}
        {step === 3 && (
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E6DEC8] flex items-center justify-between text-xs text-[#231F1D]">
              <div>
                <span className="font-semibold">{activeListener.name}</span>
                <span className="mx-1.5">·</span>
                <span>{mode === 'online' ? 'Online Session' : 'Trivandrum Mud-House'}</span>
                <span className="mx-1.5">·</span>
                <span className="font-mono-tabular">{selectedSlot}</span>
              </div>
              <span className="font-mono-tabular font-semibold text-[#E96326]">
                ₹{activeListener.sessionFeeInr}
              </span>
            </div>

            {validationError && (
              <div className="p-3 rounded-xl bg-[#E96326]/10 border border-[#E96326] text-xs text-[#B04923] font-medium">
                {validationError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#231F1D] mb-1.5">
                  {locale === 'en' ? 'Your Name (or Nickname)' : 'നിങ്ങളുടെ പേര്'} *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={locale === 'en' ? 'e.g., Arjun or Meenakshi' : 'പേര് നൽകുക'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E6DEC8] text-sm text-[#231F1D] focus:outline-none focus:border-[#E96326]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#231F1D] mb-1.5">
                  {locale === 'en' ? 'WhatsApp / Phone Number' : 'വാട്സ്ആപ്പ് / ഫോൺ നമ്പർ'} *
                </label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="+91 98470 XXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E6DEC8] text-sm text-[#231F1D] font-mono-tabular focus:outline-none focus:border-[#E96326]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#231F1D] mb-1.5">
                {locale === 'en'
                  ? mode === 'in_cafe'
                    ? 'Which complimentary kappi should we brew for your arrival?'
                    : 'What virtual brew mood should we set for our call?'
                  : 'നിങ്ങൾക്കിഷ്ടമുള്ള കാപ്പി ഏതാണ്?'}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Cardamom Chukku Kappi',
                  'Brass Davara Filter Kappi',
                  'Cinnamon Mud-House Brew',
                  'Iced Cold Brew Tonic',
                  'Just Warm Herbal Tea',
                ].map((brew) => (
                  <button
                    key={brew}
                    type="button"
                    onClick={() => setCoffeePreference(brew)}
                    className={`px-3 py-1.5 rounded-xl text-xs border transition-colors cursor-pointer ${
                      coffeePreference === brew
                        ? 'bg-[#2D4A3E] text-[#FFFDF9] border-[#2D4A3E]'
                        : 'bg-[#FFFDF9] text-[#655B54] border-[#E6DEC8]'
                    }`}
                  >
                    {brew}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#231F1D] mb-1.5">
                {locale === 'en'
                  ? 'Anything on your mind before we sit down? (Optional)'
                  : 'എന്തെങ്കിലും പ്രത്യേകം സൂചിപ്പിക്കാനുണ്ടോ? (നിർബന്ധമില്ല)'}
              </label>
              <textarea
                rows={2}
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder={
                  locale === 'en'
                    ? 'No pressure to write a lot—even one sentence helps.'
                    : 'ഒറ്റ വാചകത്തിലായാലും എഴുതാം...'
                }
                className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#E6DEC8] text-sm text-[#231F1D] focus:outline-none focus:border-[#E96326]"
              />
            </div>

            <div className="pt-4 border-t border-[#E6DEC8] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl border border-[#E6DEC8] text-xs font-medium text-[#655B54] hover:text-[#231F1D] cursor-pointer"
              >
                {locale === 'en' ? 'Back' : 'പിന്നിലേക്ക്'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#E96326] hover:bg-[#B04923] text-[#FFFDF9] text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting
                  ? locale === 'en'
                    ? 'Reserving Table...'
                    : 'ബുക്ക് ചെയ്യുന്നു...'
                  : locale === 'en'
                  ? 'Confirm My Kappi Chat'
                  : 'കാപ്പി ചാറ്റ് ഉറപ്പാക്കാം'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Completed Kappi Table Pass */}
        {step === 4 && completedBooking && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-dashed border-[#E96326] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E6DEC8]">
                <div>
                  <span className="text-xs text-[#655B54]">Kappiness Session Pass</span>
                  <h3 className="font-display text-xl font-semibold text-[#231F1D]">
                    {completedBooking.userName} × {completedBooking.listenerName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl bg-[#F4EFE6] hover:bg-[#E6DEC8] text-xs font-mono-tabular font-semibold text-[#231F1D] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{completedBooking.referenceCode}</span>
                  <Copy className="w-3.5 h-3.5 text-[#E96326]" />
                  {copiedCode && <span className="text-[#2D4A3E] ml-1">Copied!</span>}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#231F1D]">
                  <Calendar className="w-4 h-4 text-[#E96326]" />
                  <span className="font-mono-tabular">
                    {completedBooking.date} · {completedBooking.timeSlot}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#231F1D]">
                  <MapPin className="w-4 h-4 text-[#2D4A3E]" />
                  <span>
                    {completedBooking.mode === 'online'
                      ? 'Private Online Video/Audio Room'
                      : 'Mud-House Café · Jagathy, Trivandrum'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#231F1D]">
                  <Coffee className="w-4 h-4 text-[#E96326]" />
                  <span>Brew: {completedBooking.coffeePreference}</span>
                </div>
                <div className="flex items-center gap-2 text-[#231F1D]">
                  <Sparkles className="w-4 h-4 text-[#2D4A3E]" />
                  <span>Language: {completedBooking.language}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#231F1D] hover:bg-[#E96326] text-[#FFFDF9] text-sm font-medium transition-colors cursor-pointer"
              >
                {locale === 'en' ? 'Done · View in My Passes' : 'പൂർത്തിയായി'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface RsvpModalProps {
  gathering: CommunityGathering | null;
  onClose: () => void;
  locale: Locale;
  onSaveRsvp: (rsvp: RsvpRecord) => void;
}

export const RsvpModal: React.FC<RsvpModalProps> = ({
  gathering,
  onClose,
  locale,
  onSaveRsvp,
}) => {
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [seatsReserved, setSeatsReserved] = useState(1);
  const [error, setError] = useState('');
  const [confirmedRsvp, setConfirmedRsvp] = useState<RsvpRecord | null>(null);

  useEffect(() => {
    if (gathering) {
      setAttendeeName('');
      setAttendeePhone('');
      setSeatsReserved(1);
      setError('');
      setConfirmedRsvp(null);
    }
  }, [gathering]);

  if (!gathering) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName.trim()) {
      setError(locale === 'en' ? 'Please enter your name.' : 'ദയവായി നിങ്ങളുടെ പേര് നൽകുക.');
      return;
    }
    if (attendeePhone.replace(/\s+/g, '').length < 8) {
      setError(
        locale === 'en'
          ? 'Please enter a valid phone/WhatsApp number.'
          : 'ശരിയായ ഫോൺ നമ്പർ നൽകുക.'
      );
      return;
    }
    const record: RsvpRecord = {
      id: `rsvp-${Date.now()}`,
      referenceCode: `CIR-${Math.floor(100 + Math.random() * 900)}`,
      gatheringId: gathering.id,
      gatheringTitle: gathering.title.en,
      dateDisplay: gathering.dateDisplay,
      timeDisplay: gathering.timeDisplay,
      venue: gathering.venue.en,
      attendeeName: attendeeName.trim(),
      attendeePhone: attendeePhone.trim(),
      seatsReserved,
    };
    onSaveRsvp(record);
    setConfirmedRsvp(record);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#231F1D]/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FBF8F3] border border-[#E6DEC8] rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-xl">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E6DEC8]">
          <div>
            <p className="text-xs font-medium text-[#2D4A3E]">
              {gathering.categoryLabel[locale]} · {gathering.dateDisplay}
            </p>
            <h3 className="font-display text-lg md:text-xl font-semibold text-[#231F1D] mt-1">
              {gathering.title[locale]}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#F4EFE6] text-[#231F1D] hover:bg-[#E6DEC8] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!confirmedRsvp ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-5">
            <p className="text-xs text-[#655B54]">
              {gathering.venue[locale]} · {gathering.brewIncluded}
            </p>

            {error && (
              <div className="p-2.5 rounded-xl bg-[#E96326]/10 border border-[#E96326] text-xs text-[#B04923]">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#231F1D] mb-1">
                {locale === 'en' ? 'Your Name' : 'നിങ്ങളുടെ പേര്'} *
              </label>
              <input
                type="text"
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                placeholder="e.g., Devika S."
                className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#E6DEC8] text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#231F1D] mb-1">
                  {locale === 'en' ? 'WhatsApp Number' : 'വാട്സ്ആപ്പ് നമ്പർ'} *
                </label>
                <input
                  type="tel"
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  placeholder="+91 96561 XXXXX"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#E6DEC8] text-sm font-mono-tabular"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#231F1D] mb-1">
                  {locale === 'en' ? 'Cushions / Spots' : 'സീറ്റുകൾ'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSeatsReserved(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono-tabular border cursor-pointer ${
                        seatsReserved === num
                          ? 'bg-[#231F1D] text-[#FFFDF9] border-[#231F1D]'
                          : 'bg-[#FFFDF9] text-[#655B54] border-[#E6DEC8]'
                      }`}
                    >
                      {num} {num === 1 ? 'Cushion' : 'Cushions'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#E6DEC8] text-xs font-medium text-[#655B54] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#E96326] hover:bg-[#B04923] text-[#FFFDF9] text-xs font-medium cursor-pointer"
              >
                {locale === 'en' ? 'Reserve My Cushion' : 'സീറ്റ് ഉറപ്പാക്കുക'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#2D4A3E] space-y-2">
              <p className="text-xs font-mono-tabular text-[#2D4A3E] font-semibold">
                Pass #{confirmedRsvp.referenceCode} · {confirmedRsvp.seatsReserved} Cushion(s)
              </p>
              <p className="font-display text-base font-semibold text-[#231F1D]">
                See you at the circle, {confirmedRsvp.attendeeName}!
              </p>
              <p className="text-xs text-[#655B54]">
                {confirmedRsvp.dateDisplay} · {confirmedRsvp.timeDisplay}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#231F1D] text-[#FFFDF9] text-xs font-medium cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface MyPassesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  rsvps: RsvpRecord[];
  onCancelBooking: (id: string) => void;
  onCancelRsvp: (id: string) => void;
  onOpenNewBooking: () => void;
}

export const MyPassesDrawer: React.FC<MyPassesDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  rsvps,
  onCancelBooking,
  onCancelRsvp,
  onOpenNewBooking,
}) => {
  if (!isOpen) return null;

  const totalCount = bookings.length + rsvps.length;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#231F1D]/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FBF8F3] border-l border-[#E6DEC8] w-full max-w-md h-full p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC8]">
            <div>
              <h3 className="font-display text-xl font-semibold text-[#231F1D]">
                My Kappi Passes
              </h3>
              <p className="text-xs text-[#655B54]">
                Saved coffee chats, online sessions & mud-house RSVPs
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#F4EFE6] text-[#231F1D] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {totalCount === 0 ? (
            <div className="py-16 text-center space-y-4">
              <Coffee className="w-10 h-10 text-[#E96326] mx-auto opacity-75" />
              <div className="space-y-1">
                <h4 className="font-display text-base font-semibold text-[#231F1D]">
                  Your kappi table is currently empty
                </h4>
                <p className="text-xs text-[#655B54] max-w-xs mx-auto">
                  Book an online consultation or a casual coffee chat with a Tara apper to see your pass here.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewBooking();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#E96326] text-[#FFFDF9] text-xs font-medium cursor-pointer"
              >
                Book a Coffee Chat
              </button>
            </div>
          ) : (
            <div className="space-y-4 mt-5">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E6DEC8] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono-tabular font-semibold text-[#E96326]">
                      {b.referenceCode} · {b.mode === 'online' ? 'Online' : 'In-Café'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCancelBooking(b.id)}
                      className="text-[#655B54] hover:text-[#B04923] flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                  <h4 className="font-display text-base font-semibold text-[#231F1D]">
                    Chat with {b.listenerName}
                  </h4>
                  <p className="text-xs text-[#655B54] font-mono-tabular">
                    {b.date} · {b.timeSlot} · {b.language}
                  </p>
                  <p className="text-xs text-[#2D4A3E]">Brew: {b.coffeePreference}</p>
                </div>
              ))}

              {rsvps.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E6DEC8] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono-tabular font-semibold text-[#2D4A3E]">
                      {r.referenceCode} · {r.seatsReserved} Cushion(s)
                    </span>
                    <button
                      type="button"
                      onClick={() => onCancelRsvp(r.id)}
                      className="text-[#655B54] hover:text-[#B04923] flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                  <h4 className="font-display text-sm font-semibold text-[#231F1D]">
                    {r.gatheringTitle}
                  </h4>
                  <p className="text-xs text-[#655B54] font-mono-tabular">
                    {r.dateDisplay} · {r.timeDisplay}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-[#E6DEC8] text-xs text-[#655B54]">
          Need to reschedule on WhatsApp? Message +91 96561 91761 with your pass code.
        </div>
      </div>
    </div>
  );
};
