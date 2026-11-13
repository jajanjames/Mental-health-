import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Coffee,
  Clock,
  Phone,
  RefreshCw,
  AlertCircle,
  Video,
  MapPin,
  ShieldCheck,
  Star,
  HeartHandshake,
  Brain,
  Briefcase,
  Users,
  Sparkles,
  Moon,
  Smile,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Locale,
  GENERATED_ILLUSTRATIONS,
  LISTENERS_DATA,
  COMMUNITY_GATHERINGS,
  THERAPY_CATEGORIES,
  VISITOR_REVIEWS,
  TherapyCategoryId,
  ListenerProfile,
  SessionMode,
  BookingRecord,
  RsvpRecord,
  CommunityGathering,
} from './data/kappinessData';
import {
  ListenerPortraitSvg,
  ResilientIllustration,
} from './components/Illustrations';
import { MoodCoffeeMatcher } from './components/MoodCoffeeMatcher';
import { BookingModal, RsvpModal, MyPassesDrawer } from './components/BookingModal';

const BOOKINGS_STORAGE_KEY = 'kappiness_bookings_v1';
const RSVPS_STORAGE_KEY = 'kappiness_rsvps_v1';

const CATEGORY_ICON_MAP: Record<TherapyCategoryId, React.ReactNode> = {
  all: <Sparkles className="w-4 h-4" />,
  relationship: <HeartHandshake className="w-4 h-4" />,
  depression: <Brain className="w-4 h-4" />,
  anxiety: <Smile className="w-4 h-4" />,
  burnout: <Briefcase className="w-4 h-4" />,
  family: <Users className="w-4 h-4" />,
  trauma: <ShieldCheck className="w-4 h-4" />,
  sleep: <Moon className="w-4 h-4" />,
  lgbtq: <HeartHandshake className="w-4 h-4" />,
  tara_chat: <Coffee className="w-4 h-4" />,
};

export default function App() {
  const [locale, setLocale] = useState<Locale>('en');

  // Interactive Parallax State (Smooth Cursor Depth + Scroll Parallax)
  const heroRef = useRef<HTMLDivElement | null>(null);
  const categorySliderRef = useRef<HTMLDivElement | null>(null);
  const categoryPillRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [scrollY, setScrollY] = useState<number>(0);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(Math.min(window.scrollY, 800));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x: normX, y: normY });
  };

  const handleHeroMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Multi-Category Therapist Directory State & 4-State UI
  const [selectedCategory, setSelectedCategory] = useState<TherapyCategoryId>('all');
  const [directoryStatus, setDirectoryStatus] = useState<'loading' | 'error' | 'ready'>('ready');

  // Persistent Bookings & RSVPs
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [rsvps, setRsvps] = useState<RsvpRecord[]>(() => {
    try {
      const saved = localStorage.getItem(RSVPS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // ignore storage errors
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(RSVPS_STORAGE_KEY, JSON.stringify(rsvps));
    } catch {
      // ignore storage errors
    }
  }, [rsvps]);

  // Modals & Drawers State
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [modalListener, setModalListener] = useState<ListenerProfile | null>(null);
  const [modalMode, setModalMode] = useState<SessionMode>('online');
  const [modalBrew, setModalBrew] = useState<string>('Cardamom Chukku Kappi');
  const [activeRsvpGathering, setActiveRsvpGathering] = useState<CommunityGathering | null>(null);
  const [passesDrawerOpen, setPassesDrawerOpen] = useState<boolean>(false);

  const openBookingWith = (
    listener: ListenerProfile | null = null,
    preferredMode: SessionMode = 'online',
    brew: string = 'Cardamom Chukku Kappi'
  ) => {
    setModalListener(listener);
    setModalMode(preferredMode);
    setModalBrew(brew);
    setBookingModalOpen(true);
  };

  const handleCategoryChange = (catId: TherapyCategoryId) => {
    if (catId === selectedCategory) return;
    setDirectoryStatus('loading');
    setSelectedCategory(catId);
    const btnEl = categoryPillRefs.current[catId];
    if (btnEl) {
      btnEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    window.setTimeout(() => {
      setDirectoryStatus('ready');
    }, 120);
  };

  const scrollCategorySlider = (direction: 'left' | 'right') => {
    if (!categorySliderRef.current) return;
    const offset = direction === 'left' ? -280 : 280;
    categorySliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const jumpToCategoryFromFooter = (catId: TherapyCategoryId) => {
    setSelectedCategory(catId);
    const el = document.getElementById('listeners');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredListeners = useMemo(() => {
    return LISTENERS_DATA.filter((item) => {
      if (selectedCategory !== 'all' && !item.categories.includes(selectedCategory)) {
        return false;
      }
      return true;
    });
  }, [selectedCategory]);

  const totalSavedPasses = bookings.length + rsvps.length;

  // Bounded Compositor-Only 3D Parallax Transforms (Overscanned Layer Prevents Any Edge Seam)
  const artworkParallaxTransform = `translate3d(${mouseOffset.x * -8}px, ${
    mouseOffset.y * -5
  }px, 0)`;

  const textSkyParallaxTransform = `translate3d(${mouseOffset.x * 8}px, ${
    scrollY * -0.05 + mouseOffset.y * 4
  }px, 0)`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#181916]">
      {/* UNIFIED SINGLE-STAGE PARALLAX HERO (ZERO HORIZONTAL SPLIT ACROSS ALL VIEWPORTS) */}
      <div
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative w-full h-screen h-[100dvh] min-h-[580px] flex flex-col justify-between overflow-hidden bg-[#FAF2E5]"
      >
        {/* OVERSCANNED PARALLAX ARTWORK LAYER FROM TOP:0 (NEVER SPLITS BELOW HEADLINE) */}
        <div
          className="absolute -inset-3 pointer-events-none select-none transition-transform duration-200 ease-out will-change-transform"
          style={{ transform: artworkParallaxTransform }}
        >
          <img
            src={GENERATED_ILLUSTRATIONS.heroCafe}
            alt="Kappiness hillside mud-house café and giant steaming coffee mug pavilion where a therapist and visitor share a warm conversation over coffee"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right-bottom"
          />

          {/* Seamless Cream Sky Feathering on Left so Text Remains Crisp on Any Width */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 20% 34%, rgba(250, 242, 229, 0.85) 0%, rgba(250, 242, 229, 0.42) 38%, rgba(250, 242, 229, 0) 66%)',
            }}
          />
        </div>

        {/* STRICT 3-ZONE TOP BAR CONTRACT (OVERLAID DIRECTLY INSIDE HERO SKY) */}
        <header className="relative z-30 w-full">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between gap-8">
            <a
              href="#"
              className="text-xl font-semibold tracking-tight text-[#3A612B] whitespace-nowrap shrink-0"
            >
              Kappiness
            </a>

            <nav className="hidden md:flex items-center gap-9 text-[13px] font-medium text-[#181916]">
              <a
                href="#listeners"
                className="hover:text-[#E96326] transition-colors whitespace-nowrap shrink-0"
              >
                {locale === 'en' ? '7+ Yr Therapists' : 'സൈക്കോളജിസ്റ്റുകൾ'}
              </a>
              <a
                href="#mood-checkin"
                className="hover:text-[#E96326] transition-colors whitespace-nowrap shrink-0"
              >
                {locale === 'en' ? 'Mood Cup' : 'മനസ്സറിയാം'}
              </a>
              <a
                href="#the-space"
                className="hover:text-[#E96326] transition-colors whitespace-nowrap shrink-0"
              >
                {locale === 'en' ? 'Spaces' : 'കാപ്പിനസ് ഇടം'}
              </a>
              <a
                href="#reviews"
                className="hover:text-[#E96326] transition-colors whitespace-nowrap shrink-0"
              >
                {locale === 'en' ? 'Reviews' : 'അഭിപ്രായങ്ങൾ'}
              </a>
              <a
                href="#gatherings"
                className="hover:text-[#E96326] transition-colors whitespace-nowrap shrink-0"
              >
                {locale === 'en' ? 'Circles' : 'കൂട്ടായ്മകൾ'}
              </a>
            </nav>

            <div className="flex items-center shrink-0">
              <button
                type="button"
                onClick={() => openBookingWith(null, 'online', 'Cardamom Chukku Kappi')}
                className="px-5 py-2.5 text-xs font-medium text-white bg-[#E96326] hover:bg-[#D1531B] rounded-full inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{locale === 'en' ? 'Book a Coffee Chat' : 'സംസാരിക്കാം'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* LEFT-ALIGNED MINIMALIST CREAM SKY TYPOGRAPHY (OVERLAID DIRECTLY INSIDE HERO SKY) */}
        <section className="relative z-20 flex-1 flex items-center pointer-events-none">
          <div className="max-w-[1280px] w-full mx-auto px-6 md:px-12 pt-2 pb-28 sm:pb-36 lg:pb-44">
            <div
              className="max-w-[490px] xl:max-w-[530px] text-left transition-transform duration-150 ease-out will-change-transform pointer-events-auto"
              style={{ transform: textSkyParallaxTransform }}
            >
              {/* Clean Bilingual & Saved Passes Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E2D6C1] text-[11px] font-medium text-[#2C2E28] mb-4 backdrop-blur-xs">
                <button
                  type="button"
                  onClick={() => setLocale(locale === 'en' ? 'ml' : 'en')}
                  className="hover:text-[#E96326] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {locale === 'en'
                    ? 'Only 7+ Yrs Exp Therapists · മലയാളം'
                    : '7+ വർഷം പരിചയസമ്പന്നർ · English'}
                </button>
                {totalSavedPasses > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={() => setPassesDrawerOpen(true)}
                      className="text-[#E96326] font-semibold cursor-pointer whitespace-nowrap"
                    >
                      {totalSavedPasses} Pass{totalSavedPasses > 1 ? 'es' : ''}
                    </button>
                  </>
                )}
              </div>

              <h1
                className="font-semibold tracking-tight leading-[1.12] text-[#181916]"
                style={{ fontSize: 'clamp(2.15rem, 3.9vw, 3.5rem)' }}
              >
                <span className="block">
                  {locale === 'en'
                    ? 'Your Mind , Our Kappi'
                    : 'നിങ്ങളുടെ മനസ്സ് , ഞങ്ങളുടെ കാപ്പി'}
                </span>
                <span className="block text-[#446E35] mt-1">
                  {locale === 'en' ? 'Your Happy Space' : 'നിങ്ങളുടെ സന്തോഷ ഇടം'}
                </span>
              </h1>

              <p className="mt-3.5 text-xs sm:text-[13.5px] text-[#3F413B] max-w-[390px] leading-relaxed font-normal">
                {locale === 'en'
                  ? 'Step into our hillside mud-house or connect online. Share an unhurried cup of kappi with handpicked 7+ year experienced psychologists and Tara appers.'
                  : 'ഇതൊരു ആശുപത്രിയല്ല; 7 വർഷത്തിലധികം പരിചയസമ്പത്തുള്ള സൈക്കോളജിസ്റ്റുകളോടും താര ആപ്പർമാരോടും കാപ്പിക്കൊപ്പം മനസ്സ് തുറക്കാം.'}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openBookingWith(null, 'online', 'Cardamom Chukku Kappi')}
                  className="bg-[#E96326] hover:bg-[#D1531B] text-white rounded-full pl-5 pr-2 py-2 inline-flex items-center gap-3 text-xs font-medium shadow-md transition-transform duration-150 hover:scale-[1.03] cursor-pointer whitespace-nowrap"
                >
                  <span>
                    {locale === 'en' ? 'Book a Coffee Chat' : 'കാപ്പി ചാറ്റ് ബുക്ക് ചെയ്യാം'}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-white text-[#E96326] flex items-center justify-center">
                    <Phone className="w-3 h-3" />
                  </span>
                </button>

                <a
                  href="#listeners"
                  className="px-4 py-2 rounded-full bg-white/90 hover:bg-[#E96326] text-[#181916] hover:text-white border border-[#E2D6C1] hover:border-[#E96326] text-xs font-medium inline-flex items-center gap-2 transition-colors duration-150 whitespace-nowrap group"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E96326] group-hover:text-white transition-colors" />
                  <span>{locale === 'en' ? 'Talk to an Expert' : 'വിദഗ്ദ്ധരെ കാണാം'}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Subtle Bottom Hillside Blend */}
        <div
          className="relative z-20 h-10 w-full pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(253, 251, 247, 0) 0%, rgba(235, 242, 218, 0.65) 100%)',
          }}
        />
      </div>

      {/* SEAMLESS ULTRA-MINIMAL 3-PILLAR BAR (BLENDED DIRECTLY BENEATH THE HILLSIDE) */}
      <div
        className="pt-4 pb-6"
        style={{
          background: 'linear-gradient(180deg, #EBF2DA 0%, #F7F6EE 55%, #FDFBF7 100%)',
        }}
      >
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="py-3.5 px-6 rounded-full bg-white/85 border border-[#E2E6D5] backdrop-blur-xs flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 text-xs text-[#2C2E28] shadow-2xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#446E35] shrink-0" />
              <span>
                <strong className="font-semibold text-[#181916]">
                  {locale === 'en' ? '7+ Years Experience' : '7+ വർഷം പരിചയസമ്പന്നർ'}
                </strong>
                <span className="text-[#5E6057]">
                  {locale === 'en'
                    ? ' · Handpicked senior psychologists'
                    : ' · തിരഞ്ഞെടുത്ത സൈക്കോളജിസ്റ്റുകൾ'}
                </span>
              </span>
            </div>

            <span className="hidden md:inline text-[#D5CFC0]" aria-hidden="true">
              |
            </span>

            <div className="flex items-center gap-2.5">
              <Coffee className="w-4 h-4 text-[#E96326] shrink-0" />
              <span>
                <strong className="font-semibold text-[#181916]">
                  {locale === 'en' ? '60-Minute Coffee Format' : '60 മിനിറ്റ് കാപ്പി ചാറ്റ്'}
                </strong>
                <span className="text-[#5E6057]">
                  {locale === 'en'
                    ? ' · Online or Trivandrum mud-house'
                    : ' · ഓൺലൈനായും മൺവീട്ടിലും'}
                </span>
              </span>
            </div>

            <span className="hidden md:inline text-[#D5CFC0]" aria-hidden="true">
              |
            </span>

            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 fill-[#E96326] text-[#E96326] shrink-0" />
              <span>
                <strong className="font-semibold text-[#181916] font-mono-tabular">
                  {locale === 'en' ? '4.9 ★ Rating' : '4.9 ★ റേറ്റിംഗ്'}
                </strong>
                <span className="text-[#5E6057]">
                  {locale === 'en'
                    ? ' · Trusted by 4,200+ visitors'
                    : ' · 4,200+ പേരുടെ വിശ്വാസം'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* SECTION 01: ULTRA-CLEAN HORIZONTAL CATEGORY SLIDER & COMPACT SPECIALIST DIRECTORY */}
        <section id="listeners" className="pt-8 pb-16 bg-[#FDFBF7]">
          <div className="max-w-[1140px] mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-medium text-[#E96326] mb-1">
                  {locale === 'en'
                    ? 'Strict 7+ Years Experience Standard'
                    : '7+ വർഷം പരിചയസമ്പത്തുള്ള സൈക്കോളജിസ്റ്റുകൾ'}
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#181916]">
                  {locale === 'en'
                    ? 'Choose a Category , Talk to an Expert'
                    : 'വിഭാഗം തിരഞ്ഞെടുക്കൂ , വിദഗ്ദ്ധരോട് സംസാരിക്കാം'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[#5E6057] font-mono-tabular">
                  {filteredListeners.length} Specialists
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => scrollCategorySlider('left')}
                    aria-label="Scroll categories left"
                    className="w-8 h-8 rounded-full bg-[#F3EFE6] hover:bg-[#E96326] text-[#181916] hover:text-white border border-[#E2DDD0] hover:border-[#E96326] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCategorySlider('right')}
                    aria-label="Scroll categories right"
                    className="w-8 h-8 rounded-full bg-[#F3EFE6] hover:bg-[#E96326] text-[#181916] hover:text-white border border-[#E2DDD0] hover:border-[#E96326] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Smooth Single-Row Horizontal Category Slider (Secondary by default, #E96326 on hover/active) */}
            <div className="relative mb-8">
              <div
                ref={categorySliderRef}
                className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1.5 px-0.5"
              >
                {THERAPY_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      ref={(el) => {
                        categoryPillRefs.current[cat.id] = el;
                      }}
                      type="button"
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`group px-4 py-2.5 rounded-full border inline-flex items-center gap-2 text-xs font-medium transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-[#E96326] text-white border-[#E96326] shadow-xs'
                          : 'bg-[#F3EFE6] text-[#2C2E28] border-[#E2DDD0] hover:bg-[#E96326] hover:text-white hover:border-[#E96326]'
                      }`}
                    >
                      <span
                        className={
                          isSelected
                            ? 'text-white'
                            : 'text-[#5E6057] group-hover:text-white transition-colors'
                        }
                      >
                        {CATEGORY_ICON_MAP[cat.id]}
                      </span>
                      <span>{cat.label[locale]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4-State UI Coverage */}
            {directoryStatus === 'loading' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="p-5 rounded-3xl bg-white border border-[#EAE5D7] animate-pulse h-36"
                  />
                ))}
              </div>
            )}

            {directoryStatus === 'error' && (
              <div className="p-8 rounded-3xl bg-white border border-[#EAE5D7] text-center max-w-md mx-auto space-y-3">
                <AlertCircle className="w-7 h-7 text-[#E96326] mx-auto" />
                <p className="text-sm font-medium text-[#181916]">Unable to load schedule</p>
                <button
                  type="button"
                  onClick={() => setDirectoryStatus('ready')}
                  className="px-4 py-2 rounded-full bg-[#E96326] text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {directoryStatus === 'ready' && filteredListeners.length === 0 && (
              <div className="p-8 rounded-3xl bg-white border border-[#EAE5D7] text-center max-w-md mx-auto space-y-3">
                <Coffee className="w-7 h-7 text-[#E96326] mx-auto" />
                <p className="text-sm font-semibold text-[#181916]">
                  No specialists in this filter
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="px-4 py-2 rounded-full bg-[#E96326] text-white text-xs font-medium cursor-pointer"
                >
                  Show All 7+ Yr Experts
                </button>
              </div>
            )}

            {/* Ultra-Compact Specialist Cards (Secondary Sand CTA by Default -> #E96326 on Hover with Call Icon) */}
            {directoryStatus === 'ready' && filteredListeners.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredListeners.map((person) => (
                  <article
                    key={person.id}
                    className="p-5 rounded-3xl bg-white border border-[#EAE5D7] flex flex-col justify-between gap-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#E96326]/50 group"
                  >
                    <div className="flex items-center gap-4">
                      <ListenerPortraitSvg
                        name={person.name}
                        photoUrl={person.photoUrl}
                        photoPosition={person.photoPosition}
                        sizeClass="w-16 h-16"
                        theme={person.avatarTheme}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#446E35] truncate">
                          {person.roleTitle[locale]}
                        </p>
                        <h3 className="text-base font-semibold text-[#181916] truncate mt-0.5">
                          {locale === 'en' ? person.name : person.malayalamName}
                        </h3>
                        <p className="text-xs text-[#5E6057] mt-1 truncate">
                          <strong className="font-semibold text-[#181916]">
                            {person.experienceYears}+ Yrs Exp
                          </strong>
                          <span aria-hidden="true"> · </span>
                          <span>{person.languages.join(', ')}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between gap-2">
                      <span className="text-xs font-mono-tabular text-[#5E6057] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#5E6057]" />
                        {person.nextAvailableSlot}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          openBookingWith(person, 'online', person.signatureKappi[locale])
                        }
                        className="bg-[#F3EFE6] text-[#181916] border border-[#E2DDD0] group-hover:bg-[#E96326] group-hover:text-white group-hover:border-[#E96326] hover:bg-[#E96326] hover:text-white hover:border-[#E96326] rounded-full pl-3.5 pr-1.5 py-1.5 inline-flex items-center gap-2 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>{locale === 'en' ? 'Talk to an Expert' : 'സംസാരിക്കാം'}</span>
                        <span className="w-5 h-5 rounded-full bg-white text-[#181916] group-hover:text-[#E96326] flex items-center justify-center transition-colors">
                          <Phone className="w-3 h-3" />
                        </span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 02: MOOD-TO-KAPPI INTERACTIVE MATCHER */}
        <MoodCoffeeMatcher
          locale={locale}
          onSelectListenerForBooking={(listener, preferredMode, suggestedBrew) =>
            openBookingWith(listener, preferredMode, suggestedBrew)
          }
        />

        {/* SECTION 03: MINIMAL GOLDEN-HOUR SPACES (ONLINE ANYWHERE VS MUD-HOUSE) */}
        <section id="the-space" className="py-16 bg-[#FDFBF7]">
          <div className="max-w-[1140px] mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-medium text-[#E96326] mb-1">
                  {locale === 'en' ? 'Two Ways to Connect' : 'സംസാരിക്കാനുള്ള ഇടം'}
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#181916]">
                  {locale === 'en'
                    ? 'Online Anywhere , Or In Our Mud-House'
                    : 'ഓൺലൈനായും , തിരുവനന്തപുരത്തെ മൺവീട്ടിലും'}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Online */}
              <div className="rounded-3xl bg-white border border-[#EAE5D7] hover:border-[#E96326]/50 transition-colors overflow-hidden flex flex-col justify-between group">
                <div className="relative h-64 w-full overflow-hidden">
                  <ResilientIllustration
                    src={GENERATED_ILLUSTRATIONS.onlineSession}
                    alt="Sunlit golden-hour window nook overlooking misty Kerala hills with a steaming coffee mug and laptop"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181916]/70 via-transparent to-transparent flex items-end p-5 text-white">
                    <span className="text-xs font-medium flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-[#F5D08A]" />
                      {locale === 'en'
                        ? 'Private Video / Audio · Global Time Zones'
                        : 'ഓൺലൈൻ വീഡിയോ / ഓഡിയോ'}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#181916]">
                      {locale === 'en' ? 'Online Consultations' : 'ഓൺലൈൻ സെഷനുകൾ'}
                    </h3>
                    <p className="text-xs text-[#5E6057] mt-0.5">
                      {locale === 'en'
                        ? 'Malayalam, English & Tamil · 7+ Yr Experts'
                        : 'മലയാളം, ഇംഗ്ലീഷ്, തമിഴ് · വീട്ടിലിരുന്ന് സംസാരിക്കാം'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openBookingWith(null, 'online', 'Cardamom Chukku Kappi')}
                    className="bg-[#F3EFE6] text-[#181916] border border-[#E2DDD0] group-hover:bg-[#E96326] group-hover:text-white group-hover:border-[#E96326] hover:bg-[#E96326] hover:text-white hover:border-[#E96326] rounded-full pl-4 pr-1.5 py-1.5 inline-flex items-center gap-2 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150"
                  >
                    <span>{locale === 'en' ? 'Talk to an Expert' : 'ഓൺലൈൻ'}</span>
                    <span className="w-5 h-5 rounded-full bg-white text-[#181916] group-hover:text-[#E96326] flex items-center justify-center transition-colors">
                      <Phone className="w-3 h-3" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Card 2: Mud-House */}
              <div className="rounded-3xl bg-white border border-[#EAE5D7] hover:border-[#E96326]/50 transition-colors overflow-hidden flex flex-col justify-between group">
                <div className="relative h-64 w-full overflow-hidden">
                  <ResilientIllustration
                    src={GENERATED_ILLUSTRATIONS.mudhouseGarden}
                    alt="Golden-hour verandah of the earthen mud-house café in Trivandrum with teakwood armchairs and brass filter coffee"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181916]/70 via-transparent to-transparent flex items-end p-5 text-white">
                    <span className="text-xs font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#F5D08A]" />
                      {locale === 'en'
                        ? 'Jagathy, Thiruvananthapuram · 10 AM – 8:30 PM'
                        : 'ജഗതി, തിരുവനന്തപുരം'}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#181916]">
                      {locale === 'en' ? 'Trivandrum Mud-House Café' : 'മൺവീടും ഗാർഡൻ കഫേയും'}
                    </h3>
                    <p className="text-xs text-[#5E6057] mt-0.5">
                      {locale === 'en'
                        ? 'Complimentary Filter Kappi · Garden Nooks'
                        : 'മരത്തണലിലിരുന്ന് നാടൻ കാപ്പി കുടിച്ച് സംസാരിക്കാം'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openBookingWith(null, 'in_cafe', 'Brass Davara Filter Kappi')}
                    className="bg-[#F3EFE6] text-[#181916] border border-[#E2DDD0] group-hover:bg-[#E96326] group-hover:text-white group-hover:border-[#E96326] hover:bg-[#E96326] hover:text-white hover:border-[#E96326] rounded-full pl-4 pr-1.5 py-1.5 inline-flex items-center gap-2 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150"
                  >
                    <span>{locale === 'en' ? 'Book a Coffee Chat' : 'കഫേ ടേബിൾ'}</span>
                    <span className="w-5 h-5 rounded-full bg-white text-[#181916] group-hover:text-[#E96326] flex items-center justify-center transition-colors">
                      <Phone className="w-3 h-3" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 04: VERIFIED VISITOR REVIEWS */}
        <section id="reviews" className="py-14 bg-[#F7F4EC]/70">
          <div className="max-w-[1140px] mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-medium text-[#E96326] mb-1">
                  {locale === 'en' ? 'Verified Visitor Stories' : 'അനുഭവങ്ങൾ'}
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#181916]">
                  {locale === 'en'
                    ? 'What People Say Over Kappi'
                    : 'കാപ്പിനസ്സിലെ സംഭാഷണങ്ങളെക്കുറിച്ച്'}
                </h2>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-[#181916]">
                <span className="text-[#E96326] font-semibold">★★★★★ 4.9 / 5</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#5E6057]">4,200+ Verified Sessions</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {VISITOR_REVIEWS.map((rev) => {
                const matchedSpecialist = LISTENERS_DATA.find((l) => l.id === rev.therapistId);
                return (
                  <article
                    key={rev.id}
                    className="group p-6 rounded-3xl bg-white border border-[#EAE5D7] hover:border-[#E96326]/50 transition-colors flex flex-col justify-between gap-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#E96326] tracking-widest">★★★★★</span>
                        <span className="text-[#5E6057]">{rev.categoryTag}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#181916] leading-relaxed">
                        {rev.quote[locale]}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between gap-2 text-xs">
                      <div>
                        <p className="font-semibold text-[#181916]">
                          {rev.visitorName} ·{' '}
                          <span className="font-normal text-[#5E6057]">{rev.visitorCity}</span>
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            openBookingWith(
                              matchedSpecialist || null,
                              'online',
                              'Cardamom Chukku Kappi'
                            )
                          }
                          className="text-[#5E6057] group-hover:text-[#E96326] hover:text-[#E96326] font-medium mt-1 inline-flex items-center gap-1.5 cursor-pointer text-left transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>
                            Spoke with {rev.therapistName} ({rev.therapistExp})
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 05: COMPACT WEEKEND CIRCLES */}
        <section id="gatherings" className="pt-14 pb-8 bg-[#FDFBF7]">
          <div className="max-w-[1140px] mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#181916]">
                {locale === 'en' ? 'Weekend Mud-House Circles' : 'വാരാന്ത്യ കൂട്ടായ്മകൾ'}
              </h2>
              <span className="text-xs text-[#5E6057]">Jagathy Garden & Live Online</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {COMMUNITY_GATHERINGS.map((event) => {
                const alreadyRsvped = rsvps.some((r) => r.gatheringId === event.id);
                return (
                  <div
                    key={event.id}
                    className="group p-5 rounded-3xl bg-white border border-[#EAE5D7] hover:border-[#E96326]/50 transition-colors flex flex-col justify-between gap-4"
                  >
                    <div>
                      <p className="text-xs text-[#5E6057]">
                        <span className="font-medium text-[#446E35]">
                          {event.categoryLabel[locale]}
                        </span>
                        <span aria-hidden="true"> · </span>
                        <span className="font-mono-tabular text-[#181916]">
                          {event.dateDisplay}
                        </span>
                      </p>
                      <h3 className="text-sm font-semibold text-[#181916] mt-1">
                        {event.title[locale]}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                      <span className="text-xs font-mono-tabular text-[#5E6057]">
                        {event.remainingCushions} spots left
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveRsvpGathering(event)}
                        className={`rounded-full pl-3.5 pr-1.5 py-1.5 inline-flex items-center gap-2 text-xs font-medium cursor-pointer transition-colors duration-150 ${
                          alreadyRsvped
                            ? 'bg-[#446E35] text-white pr-3.5'
                            : 'bg-[#F3EFE6] text-[#181916] border border-[#E2DDD0] group-hover:bg-[#E96326] group-hover:text-white group-hover:border-[#E96326] hover:bg-[#E96326] hover:text-white hover:border-[#E96326]'
                        }`}
                      >
                        <span>
                          {alreadyRsvped
                            ? 'Reserved ✓'
                            : locale === 'en'
                            ? 'Join Circle'
                            : 'പങ്കെടുക്കാം'}
                        </span>
                        {!alreadyRsvped && (
                          <span className="w-5 h-5 rounded-full bg-white text-[#181916] group-hover:text-[#E96326] flex items-center justify-center transition-colors">
                            <Phone className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* BORDERLESS UNIFIED VECTOR MUD-HOUSE FOOTER (/assets/aistudio/image_623c1e70.png) */}
      <footer className="relative w-full min-h-[560px] sm:min-h-[650px] lg:min-h-[760px] flex flex-col justify-between overflow-hidden bg-[#FDFBF7] text-[#181916] select-none">
        {/* Full Background Vector Illustration Flush to Bottom (Zero Green Border Bar) */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={GENERATED_ILLUSTRATIONS.scenicFooter}
            alt="Kappiness earthen mud-house café where a therapist and visitor sit on a green hillside lawn sharing a warm cup of coffee"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-bottom"
          />

          {/* Seamless Top Cream Blend from Preceding Section */}
          <div
            className="absolute inset-x-0 top-0 h-28"
            style={{
              background:
                'linear-gradient(180deg, #FDFBF7 0%, rgba(253, 251, 247, 0.85) 45%, rgba(253, 251, 247, 0) 100%)',
            }}
          />
        </div>

        {/* Upper Open Cream Sky Navigation & Brand Content (Overlaid Above the Mud-House) */}
        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 md:px-10 pt-10 pb-64 sm:pb-80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 4 Columns in the Open Cream Sky: Brand Emblem + Tagline + CTA */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <svg
                  viewBox="0 0 36 36"
                  className="w-7 h-7 text-[#E96326] shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                >
                  <circle cx="13" cy="13" r="6" />
                  <circle cx="23" cy="13" r="6" />
                  <circle cx="13" cy="23" r="6" />
                  <circle cx="23" cy="23" r="6" />
                </svg>
                <span className="text-2xl font-semibold tracking-tight text-[#3A612B]">
                  Kappiness
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#4E5147] max-w-[290px] leading-relaxed">
                {locale === 'en'
                  ? 'Where a warm cup of kappi replaces the clinic waiting room. Handpicked 7+ years experienced therapists.'
                  : 'ആശുപത്രി ഭീതിയില്ലാതെ 7+ വർഷം പരിചയസമ്പത്തുള്ള സൈക്കോളജിസ്റ്റുകളോട് കാപ്പിക്കൊപ്പം സംസാരിക്കാം.'}
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => openBookingWith(null, 'online', 'Cardamom Chukku Kappi')}
                  className="group bg-[#F3EFE6] hover:bg-[#E96326] text-[#181916] hover:text-white border border-[#E2DDD0] hover:border-[#E96326] rounded-full pl-4 pr-1.5 py-1.5 inline-flex items-center gap-2 text-xs font-medium shadow-2xs cursor-pointer transition-colors duration-150"
                >
                  <span>
                    {locale === 'en' ? 'Book a Coffee Chat' : 'കാപ്പി ചാറ്റ് ബുക്ക് ചെയ്യാം'}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-white text-[#181916] group-hover:text-[#E96326] flex items-center justify-center transition-colors">
                    <Phone className="w-3 h-3" />
                  </span>
                </button>
              </div>
            </div>

            {/* Center 3 Columns Kept Open Above the Mud-House Roof */}
            <div className="hidden lg:block lg:col-span-3" />

            {/* Right 5 Columns in the Open Cream Sky: Clean Minimalist Links */}
            <div className="lg:col-span-5 grid grid-cols-3 gap-6 text-xs">
              <div className="space-y-2">
                <h3 className="font-semibold text-[#181916] text-[13px]">Specialties</h3>
                <ul className="space-y-1.5 text-[#4E5147]">
                  <li>
                    <button
                      type="button"
                      onClick={() => jumpToCategoryFromFooter('relationship')}
                      className="hover:text-[#E96326] transition-colors cursor-pointer text-left"
                    >
                      Relationships
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => jumpToCategoryFromFooter('depression')}
                      className="hover:text-[#E96326] transition-colors cursor-pointer text-left"
                    >
                      Depression
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => jumpToCategoryFromFooter('anxiety')}
                      className="hover:text-[#E96326] transition-colors cursor-pointer text-left"
                    >
                      Anxiety
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => jumpToCategoryFromFooter('burnout')}
                      className="hover:text-[#E96326] transition-colors cursor-pointer text-left"
                    >
                      Career Burnout
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-[#181916] text-[13px]">Spaces</h3>
                <ul className="space-y-1.5 text-[#4E5147]">
                  <li>
                    <a href="#the-space" className="hover:text-[#E96326] transition-colors">
                      Mud-House Café
                    </a>
                  </li>
                  <li>
                    <a href="#the-space" className="hover:text-[#E96326] transition-colors">
                      Online Sessions
                    </a>
                  </li>
                  <li>
                    <a href="#reviews" className="hover:text-[#E96326] transition-colors">
                      Visitor Reviews
                    </a>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setPassesDrawerOpen(true)}
                      className="hover:text-[#E96326] transition-colors cursor-pointer text-left"
                    >
                      Passes ({totalSavedPasses})
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-[#181916] text-[13px]">Trivandrum</h3>
                <ul className="space-y-1.5 text-[#4E5147]">
                  <li>Jagathy, TVM</li>
                  <li className="font-mono-tabular text-[#181916] font-medium">+91 96561 91761</li>
                  <li>
                    <button
                      type="button"
                      onClick={() => openBookingWith(null, 'in_cafe', 'Brass Davara Filter Kappi')}
                      className="text-[#4E5147] hover:text-[#E96326] font-semibold inline-flex items-center gap-1.5 cursor-pointer text-left transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Talk to an Expert</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Overlaid Copyright at Very Bottom Edge (No Green Border Box) */}
        <div className="relative z-10 pb-3 text-center px-6">
          <p className="text-[11px] font-medium text-[#181916]/75">
            © {new Date().getFullYear()} Kappiness Mental Health Café · Jagathy, Thiruvananthapuram.
          </p>
        </div>
      </footer>

      {/* GUIDED 3-STEP BOOKING MODAL */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        locale={locale}
        initialListener={modalListener}
        initialMode={modalMode}
        initialBrew={modalBrew}
        onSaveBooking={(newBooking) => setBookings((prev) => [newBooking, ...prev])}
      />

      {/* COMMUNITY GATHERING RSVP MODAL */}
      <RsvpModal
        gathering={activeRsvpGathering}
        onClose={() => setActiveRsvpGathering(null)}
        locale={locale}
        onSaveRsvp={(newRsvp) => setRsvps((prev) => [newRsvp, ...prev])}
      />

      {/* SAVED KAPPI PASSES DRAWER */}
      <MyPassesDrawer
        isOpen={passesDrawerOpen}
        onClose={() => setPassesDrawerOpen(false)}
        bookings={bookings}
        rsvps={rsvps}
        onCancelBooking={(id) => setBookings((prev) => prev.filter((b) => b.id !== id))}
        onCancelRsvp={(id) => setRsvps((prev) => prev.filter((r) => r.id !== id))}
        onOpenNewBooking={() => openBookingWith(null, 'online', 'Cardamom Chukku Kappi')}
      />
    </div>
  );
}
