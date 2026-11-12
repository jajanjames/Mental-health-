import React, { useState } from 'react';
import { Phone, Clock } from 'lucide-react';
import {
  Locale,
  MOOD_BREW_OPTIONS,
  LISTENERS_DATA,
  ListenerProfile,
  MoodBrewOption,
} from '../data/kappinessData';
import { AnimatedCoffeeCup, ListenerPortraitSvg } from './Illustrations';

interface MoodCoffeeMatcherProps {
  locale: Locale;
  onSelectListenerForBooking: (
    listener: ListenerProfile,
    preferredMode: 'online' | 'in_cafe',
    suggestedBrew: string
  ) => void;
}

const SHORT_MOOD_LABELS: Record<string, { en: string; ml: string }> = {
  overthinking: { en: 'Overthinking', ml: 'അമിത ചിന്തകൾ' },
  heavy: { en: 'Drained', ml: 'മടുപ്പ്' },
  relationships: { en: 'Relationships', ml: 'ബന്ധങ്ങൾ' },
  'work-crossroads': { en: 'Burnout', ml: 'കരിയർ' },
  'just-talk': { en: 'Tara Chat', ml: 'സൗഹൃദ സംഭാഷണം' },
};

export const MoodCoffeeMatcher: React.FC<MoodCoffeeMatcherProps> = ({
  locale,
  onSelectListenerForBooking,
}) => {
  const [selectedMoodId, setSelectedMoodId] = useState<string>(MOOD_BREW_OPTIONS[0].id);
  const [isPouring, setIsPouring] = useState<boolean>(false);

  const activeMood: MoodBrewOption =
    MOOD_BREW_OPTIONS.find((m) => m.id === selectedMoodId) || MOOD_BREW_OPTIONS[0];

  const matchedListeners = LISTENERS_DATA.filter((l) =>
    activeMood.matchedListenerIds.includes(l.id)
  );

  const handleMoodSelect = (id: string) => {
    if (id === selectedMoodId) return;
    setIsPouring(true);
    setSelectedMoodId(id);
    window.setTimeout(() => {
      setIsPouring(false);
    }, 200);
  };

  return (
    <section id="mood-checkin" className="py-14 bg-[#F7F4EC]/70">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium text-[#E96326] mb-1">
              {locale === 'en' ? 'Mood-to-Kappi Matcher' : 'മനസ്സറിയുന്ന കാപ്പി'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#181916]">
              {locale === 'en' ? 'Pick Your Mood , Pour a Cup' : 'നിങ്ങളുടെ മനസ്സ് , അനുയോജ്യമായ കാപ്പി'}
            </h2>
          </div>

          {/* 5 Compact Mood Pills */}
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-[#EFECE2] border border-[#E2DDD0]">
            {MOOD_BREW_OPTIONS.map((option) => {
              const isSelected = option.id === selectedMoodId;
              const shortLabel = SHORT_MOOD_LABELS[option.id]?.[locale] || option.moodTitle[locale];
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleMoodSelect(option.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#E96326] text-white shadow-xs'
                      : 'text-[#5E6057] hover:bg-[#E96326] hover:text-white'
                  }`}
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ultra-Clean Stage */}
        <div className="rounded-3xl bg-white border border-[#EAE5D7] p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Animated Cup */}
          <div className="lg:col-span-4 flex flex-col items-center text-center p-4 rounded-2xl bg-[#FDFBF7]">
            <AnimatedCoffeeCup
              liquidColor={activeMood.cupLiquidColor}
              cremaColor={activeMood.cupCremaColor}
              botanicalAccent={activeMood.botanicalAccent}
              coffeeName={activeMood.coffeeName.en}
              isPouring={isPouring}
            />
            <h3 className="text-base font-semibold text-[#181916] mt-1">
              {activeMood.coffeeName[locale]}
            </h3>
            <p className="text-xs text-[#5E6057] mt-1 max-w-[240px]">
              {activeMood.conversationStarter[locale]}
            </p>
          </div>

          {/* 2 Matched 7+ Yr Specialists */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matchedListeners.map((listener) => (
              <div
                key={listener.id}
                className="group p-5 rounded-2xl bg-[#FDFBF7] border border-[#EAE5D7] flex flex-col justify-between gap-4 hover:border-[#E96326]/50 transition-all duration-150"
              >
                <div className="flex items-center gap-3.5">
                  <ListenerPortraitSvg
                    name={listener.name}
                    photoUrl={listener.photoUrl}
                    photoPosition={listener.photoPosition}
                    sizeClass="w-16 h-16"
                    theme={listener.avatarTheme}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#446E35] truncate">
                      {listener.roleTitle[locale]}
                    </p>
                    <h4 className="text-base font-semibold text-[#181916] truncate">
                      {locale === 'en' ? listener.name : listener.malayalamName}
                    </h4>
                    <p className="text-xs text-[#5E6057] mt-0.5">
                      <strong className="font-semibold text-[#181916]">
                        {listener.experienceYears}+ Yrs Exp
                      </strong>
                      <span aria-hidden="true"> · </span>
                      <span>{listener.languages.join(', ')}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE5D7] flex items-center justify-between gap-2">
                  <span className="text-xs font-mono-tabular text-[#5E6057] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#5E6057]" />
                    {listener.nextAvailableSlot}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onSelectListenerForBooking(
                        listener,
                        activeMood.recommendedFormat,
                        activeMood.coffeeName[locale]
                      )
                    }
                    className="bg-[#F3EFE6] text-[#181916] border border-[#E2DDD0] group-hover:bg-[#E96326] group-hover:text-white group-hover:border-[#E96326] hover:bg-[#E96326] hover:text-white hover:border-[#E96326] rounded-full pl-3.5 pr-1.5 py-1.5 inline-flex items-center gap-2 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150"
                  >
                    <span>{locale === 'en' ? 'Talk to an Expert' : 'സംസാരിക്കാം'}</span>
                    <span className="w-5 h-5 rounded-full bg-white text-[#181916] group-hover:text-[#E96326] flex items-center justify-center transition-colors">
                      <Phone className="w-3 h-3" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
