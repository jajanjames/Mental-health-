import mudhouseSanctuaryImg from '../assets/images/golden_mudhouse_sanctuary_1794512926864.jpg';
import onlineCoffeeNookImg from '../assets/images/golden_online_coffee_nook_1794512927546.jpg';
import portraitFemale1Img from '../assets/images/therapist_portrait_female_1_1794512932316.jpg';
import portraitMale1Img from '../assets/images/therapist_portrait_male_1_1794512931165.jpg';
import portraitFemale2Img from '../assets/images/therapist_portrait_female_2_1794512934941.jpg';
import portraitMale2Img from '../assets/images/therapist_portrait_male_2_1794512933249.jpg';

export type Locale = 'en' | 'ml';

export type SessionMode = 'online' | 'in_cafe';
export type ListenerRole = 'tara_apper' | 'psychologist';

export type TherapyCategoryId =
  | 'all'
  | 'relationship'
  | 'depression'
  | 'anxiety'
  | 'burnout'
  | 'family'
  | 'trauma'
  | 'sleep'
  | 'lgbtq'
  | 'tara_chat';

export interface BilingualText {
  en: string;
  ml: string;
}

export interface TherapyCategoryOption {
  id: TherapyCategoryId;
  label: BilingualText;
  description: BilingualText;
}

export interface MoodBrewOption {
  id: string;
  moodTitle: BilingualText;
  moodSubtitle: BilingualText;
  coffeeName: BilingualText;
  brewNotes: BilingualText;
  cupLiquidColor: string;
  cupCremaColor: string;
  botanicalAccent: 'cardamom' | 'cinnamon' | 'hibiscus' | 'tulsi' | 'roast';
  conversationStarter: BilingualText;
  matchedListenerIds: string[];
  recommendedFormat: SessionMode;
  durationMinutes: number;
}

export interface ListenerProfile {
  id: string;
  name: string;
  malayalamName: string;
  role: ListenerRole;
  roleTitle: BilingualText;
  credentials: string;
  experienceYears: number;
  languages: string[];
  modes: SessionMode[];
  categories: TherapyCategoryId[];
  signatureKappi: BilingualText;
  warmIntro: BilingualText;
  focusAreas: BilingualText[];
  nextAvailableSlot: string;
  availableSlots: string[];
  sessionFeeInr: number;
  photoUrl: string;
  photoPosition?: string;
  avatarTheme: {
    bg: string;
    hair: string;
    shirt: string;
    accent: string;
    glasses?: boolean;
    beard?: boolean;
    flower?: boolean;
  };
}

export interface VisitorReview {
  id: string;
  rating: number;
  quote: BilingualText;
  visitorName: string;
  visitorCity: string;
  therapistId: string;
  therapistName: string;
  therapistExp: string;
  categoryTag: string;
}

export interface CommunityGathering {
  id: string;
  category: 'screening' | 'circle' | 'workshop';
  categoryLabel: BilingualText;
  title: BilingualText;
  description: BilingualText;
  dateDisplay: string;
  timeDisplay: string;
  venue: BilingualText;
  isOnlineAvailable: boolean;
  facilitator: string;
  totalCushions: number;
  remainingCushions: number;
  brewIncluded: string;
}

export interface BookingRecord {
  id: string;
  referenceCode: string;
  createdAt: string;
  mode: SessionMode;
  listenerId: string;
  listenerName: string;
  listenerRoleLabel: string;
  date: string;
  timeSlot: string;
  language: string;
  userName: string;
  userPhone: string;
  coffeePreference: string;
  userNote: string;
}

export interface RsvpRecord {
  id: string;
  referenceCode: string;
  gatheringId: string;
  gatheringTitle: string;
  dateDisplay: string;
  timeDisplay: string;
  venue: string;
  attendeeName: string;
  attendeePhone: string;
  seatsReserved: number;
}

export const GENERATED_ILLUSTRATIONS = {
  heroCafe: '/assets/aistudio/image_0bb89a02.png',
  mudhouseGarden: mudhouseSanctuaryImg,
  onlineSession: onlineCoffeeNookImg,
  communityCircle: mudhouseSanctuaryImg,
  scenicFooter: '/assets/aistudio/image_623c1e70.png',
};

export const THERAPY_CATEGORIES: TherapyCategoryOption[] = [
  {
    id: 'all',
    label: { en: 'All (7+ Yrs Exp)', ml: 'എല്ലാവരും (7+ വർഷം)' },
    description: {
      en: 'Strictly vetted psychologists & senior listeners with 7+ years of experience.',
      ml: '7 വർഷത്തിലധികം പരിചയസമ്പത്തുള്ള സൈക്കോളജിസ്റ്റുകൾ.',
    },
  },
  {
    id: 'relationship',
    label: { en: 'Relationship', ml: 'ബന്ധങ്ങൾ' },
    description: {
      en: 'Couples counseling, heartbreak recovery & family boundaries.',
      ml: 'ദാമ്പത്യ-പ്രണയ ബന്ധങ്ങളിലെ കൗൺസിലിംഗ്.',
    },
  },
  {
    id: 'depression',
    label: { en: 'Depression', ml: 'വിഷാദം' },
    description: {
      en: 'Persistent sadness, emotional heaviness & low motivation.',
      ml: 'വിഷാദവും ഒറ്റപ്പെടലും മറികടക്കാൻ.',
    },
  },
  {
    id: 'anxiety',
    label: { en: 'Anxiety & Stress', ml: 'ഉത്കണ്ഠ' },
    description: {
      en: 'Overthinking, panic recovery & social anxiety.',
      ml: 'അമിത ചിന്തകളും മാനസിക സമ്മർദ്ദവും.',
    },
  },
  {
    id: 'burnout',
    label: { en: 'Career Burnout', ml: 'ജോലി സമ്മർദ്ദം' },
    description: {
      en: 'Work exhaustion, life crossroads & imposter syndrome.',
      ml: 'ജോലിയിലെ മടുപ്പും കരിയർ തീരുമാനങ്ങളും.',
    },
  },
  {
    id: 'family',
    label: { en: 'Family & Child', ml: 'കുടുംബം' },
    description: {
      en: 'Parenting support, adolescent care & ADHD strategies.',
      ml: 'കുട്ടികളുടെ മാനസികാരോഗ്യവും കുടുംബവും.',
    },
  },
  {
    id: 'trauma',
    label: { en: 'Trauma & Grief', ml: 'മാനസികാഘാതം' },
    description: {
      en: 'Trauma-informed healing for loss & past wounds.',
      ml: 'നഷ്ടബോധവും മനസ്സിന്റെ മുറിവുകളും ഉണക്കാൻ.',
    },
  },
  {
    id: 'sleep',
    label: { en: 'Sleep & Night', ml: 'ഉറക്കക്കുറവ്' },
    description: {
      en: 'Insomnia, midnight overthinking & NRI loneliness.',
      ml: 'രാത്രിയിലെ അസ്വസ്ഥതകളും ഉറക്കക്കുറവും.',
    },
  },
  {
    id: 'lgbtq',
    label: { en: 'LGBTQ+ Care', ml: 'ക്വിയർ സൗഹൃദം' },
    description: {
      en: '100% identity-affirming, safe space.',
      ml: 'സുരക്ഷിതമായ ക്വിയർ സൗഹൃദ കൗൺസിലിംഗ്.',
    },
  },
  {
    id: 'tara_chat',
    label: { en: 'Tara Coffee Chat', ml: 'താര കാപ്പി ചാറ്റ്' },
    description: {
      en: 'Unhurried peer conversation over warm kappi.',
      ml: 'ഒരു സുഹൃത്തിനോട് എന്നപോലെ കാപ്പി കുടിച്ച് സംസാരിക്കാം.',
    },
  },
];

export const MOOD_BREW_OPTIONS: MoodBrewOption[] = [
  {
    id: 'overthinking',
    moodTitle: {
      en: 'Overthinking & Restless',
      ml: 'അമിത ചിന്തകളും അസ്വസ്ഥതയും',
    },
    moodSubtitle: {
      en: 'My mind has 20 tabs open and I cannot slow down.',
      ml: 'മനസ്സിൽ ഒരുപാട് ചിന്തകൾ കുമിഞ്ഞുകൂടിയിരിക്കുന്നു.',
    },
    coffeeName: {
      en: 'Cardamom Chukku Kappi',
      ml: 'ഏലയ്ക്ക ചേർത്ത ചുക്കുകാപ്പി',
    },
    brewNotes: {
      en: 'Warm dry ginger, crushed Wayanad green cardamom, and palm jaggery.',
      ml: 'വയനാടൻ ഏലയ്ക്കയും ചുക്കും കരിപ്പെട്ടിയും ചേർത്ത കാപ്പി.',
    },
    cupLiquidColor: '#6F3826',
    cupCremaColor: '#D89B6C',
    botanicalAccent: 'cardamom',
    conversationStarter: {
      en: '“Let’s unpack the loudest thought first over a warm cup.”',
      ml: '“ഏറ്റവും അലട്ടുന്ന കാര്യം ആദ്യം സംസാരിക്കാം.”',
    },
    matchedListenerIds: ['tara-ananya', 'psy-neha'],
    recommendedFormat: 'online',
    durationMinutes: 60,
  },
  {
    id: 'heavy',
    moodTitle: {
      en: 'Heavy & Drained',
      ml: 'മടുപ്പും ഒറ്റപ്പെടലും',
    },
    moodSubtitle: {
      en: 'Carrying quiet exhaustion that is hard to explain.',
      ml: 'ആരോടും തുറന്നുപറയാൻ പറ്റാത്ത ഒരു ഭാരം മനസ്സിലുണ്ട്.',
    },
    coffeeName: {
      en: 'Brass Davara Filter Kappi',
      ml: 'നാടൻ ഫിൽറ്റർ കാപ്പി',
    },
    brewNotes: {
      en: 'Velvety Coorg arabica decoction frothed with warm milk.',
      ml: 'മനസ്സിന് ആശ്വാസം നൽകുന്ന നാടൻ ഫിൽറ്റർ കാപ്പി.',
    },
    cupLiquidColor: '#8B4A2B',
    cupCremaColor: '#EBD3B7',
    botanicalAccent: 'roast',
    conversationStarter: {
      en: '“You don’t have to rush. We can sit with a warm cup until the words come.”',
      ml: '“കാപ്പി കുടിച്ച് സമാധാനമായി സംസാരിച്ചു തുടങ്ങാം.”',
    },
    matchedListenerIds: ['psy-prabin', 'tara-rishi'],
    recommendedFormat: 'in_cafe',
    durationMinutes: 60,
  },
  {
    id: 'relationships',
    moodTitle: {
      en: 'Relationship Knots',
      ml: 'ബന്ധങ്ങളിലെ ആശയക്കുഴപ്പങ്ങൾ',
    },
    moodSubtitle: {
      en: 'Navigating partner expectations or family boundaries.',
      ml: 'കുടുംബത്തിലെയോ പ്രണയത്തിലെയോ തീരുമാനങ്ങളിൽ വ്യക്തത തേടുന്നു.',
    },
    coffeeName: {
      en: 'Cinnamon Mud-House Brew',
      ml: 'കറുകപ്പട്ട ചേർത്ത മൺവീട് കാപ്പി',
    },
    brewNotes: {
      en: 'Earthy dark roast balanced with sweet Malabar cinnamon.',
      ml: 'മലബാർ കറുകപ്പട്ട ചേർത്ത പ്രത്യേക കാപ്പി.',
    },
    cupLiquidColor: '#5C2C1E',
    cupCremaColor: '#C98A5B',
    botanicalAccent: 'cinnamon',
    conversationStarter: {
      en: '“Let’s look at where your boundaries end and expectations begin.”',
      ml: '“കുറ്റബോധമില്ലാതെ മനസ്സിന്റെ അതിരുകളെക്കുറിച്ച് സംസാരിക്കാം.”',
    },
    matchedListenerIds: ['psy-neha', 'psy-jixon'],
    recommendedFormat: 'online',
    durationMinutes: 60,
  },
  {
    id: 'work-crossroads',
    moodTitle: {
      en: 'Career Burnout',
      ml: 'ജോലിയിലെ സമ്മർദ്ദം',
    },
    moodSubtitle: {
      en: 'Feeling stuck, burned out, or unsure of the next step.',
      ml: 'ജോലിയിലെ മടുപ്പും ഭാവിയെക്കുറിച്ചുള്ള ആശങ്കകളും.',
    },
    coffeeName: {
      en: 'Iced Cold Brew Tonic',
      ml: 'തണുത്ത കോൾഡ് ബ്രൂ കാപ്പി',
    },
    brewNotes: {
      en: '18-hour cold-steeped estate coffee with a bright citrus lift.',
      ml: 'മനസ്സിന് പുതിയ ഉണർവ് നൽകുന്ന കോൾഡ് ബ്രൂ.',
    },
    cupLiquidColor: '#4A2518',
    cupCremaColor: '#DFB68C',
    botanicalAccent: 'tulsi',
    conversationStarter: {
      en: '“When every path feels noisy, let’s map out what gives you energy.”',
      ml: '“നിങ്ങൾക്ക് സന്തോഷം നൽകുന്ന വഴികൾ ഒരുമിച്ച് കണ്ടെത്താം.”',
    },
    matchedListenerIds: ['psy-prabin', 'tara-meera'],
    recommendedFormat: 'online',
    durationMinutes: 60,
  },
  {
    id: 'just-talk',
    moodTitle: {
      en: 'Friendly Tara Chat',
      ml: 'സൗഹൃദ സംഭാഷണം',
    },
    moodSubtitle: {
      en: 'Just want a warm human conversation over coffee.',
      ml: 'മനസ്സുതുറന്ന് സംസാരിക്കാൻ ഒരു സുഹൃത്തിനെ വേണം.',
    },
    coffeeName: {
      en: 'Hibiscus & Hazelnut Kappi',
      ml: 'ഹേസൽനട്ട് ഗാർഡൻ കാപ്പി',
    },
    brewNotes: {
      en: 'Light, aromatic café blend best enjoyed under the banyan tree.',
      ml: 'മരത്തണലിലിരുന്ന് ആസ്വദിക്കാൻ പറ്റിയ കാപ്പി.',
    },
    cupLiquidColor: '#7A3E2E',
    cupCremaColor: '#E5C3A6',
    botanicalAccent: 'hibiscus',
    conversationStarter: {
      en: '“Grab your mug! Tell me about your week or whatever is on your mind.”',
      ml: '“നിങ്ങളുടെ കാപ്പി എടുക്കൂ, വിശേഷങ്ങൾ പങ്കുവെക്കാം.”',
    },
    matchedListenerIds: ['tara-ananya', 'tara-rishi'],
    recommendedFormat: 'in_cafe',
    durationMinutes: 50,
  },
];

export const LISTENERS_DATA: ListenerProfile[] = [
  {
    id: 'psy-prabin',
    name: 'Prabin P.B.',
    malayalamName: 'പ്രബിൻ പി.ബി.',
    role: 'psychologist',
    roleTitle: {
      en: 'Depression, Anxiety & Burnout',
      ml: 'വിഷാദം, ഉത്കണ്ഠ, കരിയർ',
    },
    credentials: 'M.Sc. Clinical Psychology',
    experienceYears: 9,
    languages: ['Malayalam', 'English'],
    modes: ['online', 'in_cafe'],
    categories: ['depression', 'anxiety', 'burnout', 'trauma'],
    signatureKappi: {
      en: 'Brass Davara Filter Kappi',
      ml: 'നാടൻ ഫിൽറ്റർ കാപ്പി',
    },
    warmIntro: {
      en: 'Co-Founder & Lead Counseling Psychologist.',
      ml: 'കോ-ഫൗണ്ടർ & ലീഡ് സൈക്കോളജിസ്റ്റ്.',
    },
    focusAreas: [
      { en: 'Depression', ml: 'വിഷാദം' },
      { en: 'Anxiety', ml: 'ഉത്കണ്ഠ' },
      { en: 'Burnout', ml: 'ജോലി സമ്മർദ്ദം' },
    ],
    nextAvailableSlot: 'Today · 6:30 PM',
    availableSlots: ['Today · 6:30 PM', 'Tomorrow · 10:30 AM', 'Tomorrow · 3:00 PM', 'Sat · 11:30 AM'],
    sessionFeeInr: 999,
    photoUrl: portraitMale1Img,
    photoPosition: 'center 18%',
    avatarTheme: {
      bg: '#E6EFEA',
      hair: '#231F1D',
      shirt: '#2D4A3E',
      accent: '#C85A32',
      beard: true,
    },
  },
  {
    id: 'psy-neha',
    name: 'Neha Padayan',
    malayalamName: 'നേഹ പടയൻ',
    role: 'psychologist',
    roleTitle: {
      en: 'Relationship, Trauma & LGBTQ+',
      ml: 'ബന്ധങ്ങൾ, ട്രോമ കൗൺസിലിംഗ്',
    },
    credentials: 'M.Sc. Psychology',
    experienceYears: 8,
    languages: ['Malayalam', 'English', 'Tamil'],
    modes: ['online', 'in_cafe'],
    categories: ['relationship', 'trauma', 'lgbtq', 'depression'],
    signatureKappi: {
      en: 'Oat Milk Cinnamon Cortado',
      ml: 'കറുകപ്പട്ട മിൽക്ക് കാപ്പി',
    },
    warmIntro: {
      en: 'Co-Founder & Relationship & Trauma Specialist.',
      ml: 'കോ-ഫൗണ്ടർ & റിലേഷൻഷിപ്പ് തെറാപ്പിസ്റ്റ്.',
    },
    focusAreas: [
      { en: 'Relationships', ml: 'ബന്ധങ്ങൾ' },
      { en: 'Trauma', ml: 'മാനസികാഘാതം' },
      { en: 'LGBTQ+ Care', ml: 'ക്വിയർ സൗഹൃദം' },
    ],
    nextAvailableSlot: 'Tomorrow · 11:00 AM',
    availableSlots: ['Tomorrow · 11:00 AM', 'Tomorrow · 5:00 PM', 'Fri · 2:30 PM', 'Sat · 4:00 PM'],
    sessionFeeInr: 999,
    photoUrl: portraitFemale2Img,
    photoPosition: 'center 20%',
    avatarTheme: {
      bg: '#F7E8DF',
      hair: '#2C221E',
      shirt: '#9E3E22',
      accent: '#D99B52',
      glasses: true,
    },
  },
  {
    id: 'psy-jixon',
    name: 'Jixon Punnoose',
    malayalamName: 'ജിക്സൺ പുന്നൂസ്',
    role: 'psychologist',
    roleTitle: {
      en: 'Family, Child & Couple Care',
      ml: 'കുടുംബം, ചൈൽഡ് കൗൺസിലിംഗ്',
    },
    credentials: 'M.Phil. Clinical Psychology',
    experienceYears: 9,
    languages: ['Malayalam', 'English'],
    modes: ['online', 'in_cafe'],
    categories: ['family', 'relationship', 'depression', 'anxiety'],
    signatureKappi: {
      en: 'Slow-Brewed Wayanad Robusta',
      ml: 'വയനാടൻ റോബസ്റ്റ കാപ്പി',
    },
    warmIntro: {
      en: 'Co-Founder & Family Systems Psychologist.',
      ml: 'കോ-ഫൗണ്ടർ & ഫാമിലി സൈക്കോളജിസ്റ്റ്.',
    },
    focusAreas: [
      { en: 'Family & Child', ml: 'കുടുംബം' },
      { en: 'Couples', ml: 'ദമ്പതികൾ' },
      { en: 'Depression', ml: 'വിഷാദം' },
    ],
    nextAvailableSlot: 'Tomorrow · 4:00 PM',
    availableSlots: ['Tomorrow · 4:00 PM', 'Fri · 11:30 AM', 'Fri · 5:30 PM', 'Sat · 10:00 AM'],
    sessionFeeInr: 999,
    photoUrl: portraitMale2Img,
    photoPosition: 'center 15%',
    avatarTheme: {
      bg: '#E8ECEF',
      hair: '#231F1D',
      shirt: '#3A4F59',
      accent: '#C85A32',
      glasses: true,
      beard: true,
    },
  },
  {
    id: 'tara-ananya',
    name: 'Ananya Menon',
    malayalamName: 'അനന്യ മേനോൻ',
    role: 'tara_apper',
    roleTitle: {
      en: 'Tara Apper · Anxiety & Breakups',
      ml: 'താര ആപ്പർ · സൗഹൃദ കേൾവിക്കാരി',
    },
    credentials: 'Senior Peer Listener',
    experienceYears: 7,
    languages: ['Malayalam', 'English'],
    modes: ['online', 'in_cafe'],
    categories: ['tara_chat', 'anxiety', 'relationship', 'burnout'],
    signatureKappi: {
      en: 'Cardamom Chukku Kappi',
      ml: 'ഏലയ്ക്ക ചുക്കുകാപ്പി',
    },
    warmIntro: {
      en: 'Empathetic Peer Listener & Expressive Arts Guide.',
      ml: 'താര ആപ്പർ & ആർട്ട് തെറാപ്പി ഗൈഡ്.',
    },
    focusAreas: [
      { en: 'Tara Chat', ml: 'സൗഹൃദ ചാറ്റ്' },
      { en: 'Overthinking', ml: 'അമിത ചിന്തകൾ' },
      { en: 'Breakups', ml: 'പ്രണയ നഷ്ടം' },
    ],
    nextAvailableSlot: 'Today · 5:30 PM',
    availableSlots: ['Today · 5:30 PM', 'Today · 7:00 PM', 'Tomorrow · 11:00 AM', 'Tomorrow · 4:30 PM'],
    sessionFeeInr: 599,
    photoUrl: portraitFemale1Img,
    photoPosition: 'center 18%',
    avatarTheme: {
      bg: '#F3E5D8',
      hair: '#231F1D',
      shirt: '#C85A32',
      accent: '#2D4A3E',
      flower: true,
    },
  },
  {
    id: 'tara-rishi',
    name: 'Rishi Nair',
    malayalamName: 'ഋഷി നായർ',
    role: 'tara_apper',
    roleTitle: {
      en: 'Counselor · Grief & Depression',
      ml: 'കൗൺസിലർ · വിഷാദം, നഷ്ടബോധം',
    },
    credentials: 'Senior Grief & Peer Counselor',
    experienceYears: 7,
    languages: ['Malayalam', 'English', 'Tamil'],
    modes: ['online', 'in_cafe'],
    categories: ['tara_chat', 'depression', 'trauma', 'sleep'],
    signatureKappi: {
      en: 'Spiced Monsoon Black Kappi',
      ml: 'മൺസൂൺ കട്ടൻ കാപ്പി',
    },
    warmIntro: {
      en: 'Grief Companion & Mud-House Circle Host.',
      ml: 'മൺവീട് കൂട്ടായ്മ ഹോസ്റ്റ്.',
    },
    focusAreas: [
      { en: 'Low Mood', ml: 'മടുപ്പ്' },
      { en: 'Grief', ml: 'നഷ്ടബോധം' },
      { en: 'NRI Support', ml: 'പ്രവാസ ജീവിതം' },
    ],
    nextAvailableSlot: 'Today · 8:00 PM',
    availableSlots: ['Today · 8:00 PM', 'Tomorrow · 6:00 PM', 'Tomorrow · 8:30 PM', 'Sun · 5:00 PM'],
    sessionFeeInr: 699,
    photoUrl: portraitMale1Img,
    photoPosition: 'center 25%',
    avatarTheme: {
      bg: '#EFEAD8',
      hair: '#1F1B18',
      shirt: '#4A5D4E',
      accent: '#C85A32',
      beard: true,
    },
  },
  {
    id: 'tara-meera',
    name: 'Meera Krishnan',
    malayalamName: 'മീര കൃഷ്ണൻ',
    role: 'psychologist',
    roleTitle: {
      en: 'Sleep, Night Anxiety & Burnout',
      ml: 'ഉറക്കക്കുറവ്, രാത്രി ചിന്തകൾ',
    },
    credentials: 'M.Sc. Counseling Psychology',
    experienceYears: 8,
    languages: ['Malayalam', 'English'],
    modes: ['online'],
    categories: ['sleep', 'burnout', 'lgbtq', 'tara_chat'],
    signatureKappi: {
      en: 'Decaf Vanilla Nutmeg Brew',
      ml: 'ജാതിക്ക ചേർത്ത കാപ്പി',
    },
    warmIntro: {
      en: 'Late-Evening Online Psychologist for Global Malayalis.',
      ml: 'രാത്രികാല ഓൺലൈൻ കൗൺസിലിംഗ് വിദഗ്ദ്ധ.',
    },
    focusAreas: [
      { en: 'Sleep & Insomnia', ml: 'ഉറക്കക്കുറവ്' },
      { en: 'Burnout', ml: 'ജോലി സമ്മർദ്ദം' },
      { en: 'LGBTQ+ Care', ml: 'ക്വിയർ സൗഹൃദം' },
    ],
    nextAvailableSlot: 'Today · 9:15 PM',
    availableSlots: ['Today · 9:15 PM', 'Today · 10:30 PM', 'Tomorrow · 8:00 PM', 'Tomorrow · 9:30 PM'],
    sessionFeeInr: 899,
    photoUrl: portraitFemale1Img,
    photoPosition: 'center 12%',
    avatarTheme: {
      bg: '#F4EAE6',
      hair: '#231F1D',
      shirt: '#7A493A',
      accent: '#2D4A3E',
      flower: true,
    },
  },
];

export const VISITOR_REVIEWS: VisitorReview[] = [
  {
    id: 'rev-1',
    rating: 5,
    quote: {
      en: '“I avoided clinics for years. Sitting in the mud-house over filter coffee with Prabin felt like talking to a wise friend—zero hospital fear.”',
      ml: '“ആശുപത്രി ഭീതി കാരണം വർഷങ്ങളായി മാറ്റിവെച്ച കാര്യമാണ്. എന്നാൽ മൺവീട്ടിലിരുന്ന് കാപ്പി കുടിച്ച് സംസാരിച്ചപ്പോൾ പകുതി ഭാരം ഒഴിഞ്ഞു.”',
    },
    visitorName: 'Goutham K.',
    visitorCity: 'Trivandrum',
    therapistId: 'psy-prabin',
    therapistName: 'Prabin P.B.',
    therapistExp: '9+ Yrs Exp',
    categoryTag: 'Anxiety & Career Burnout',
  },
  {
    id: 'rev-2',
    rating: 5,
    quote: {
      en: '“Finding a 7+ year experienced psychologist who truly understands Kerala family dynamics in Malayalam from Dubai changed our marriage.”',
      ml: '“പ്രവാസ ജീവിതത്തിനിടയിൽ നമ്മുടെ നാട്ടിലെ കുടുംബസാഹചര്യങ്ങൾ മനസ്സിലാക്കുന്ന വിദഗ്ദ്ധയായ സൈക്കോളജിസ്റ്റിനോട് സംസാരിക്കാൻ കഴിഞ്ഞത് വലിയ ആശ്വാസമായി.”',
    },
    visitorName: 'Lakshmi & Vivek R.',
    visitorCity: 'Dubai (Online)',
    therapistId: 'psy-neha',
    therapistName: 'Neha Padayan',
    therapistExp: '8+ Yrs Exp',
    categoryTag: 'Relationship & Couples',
  },
  {
    id: 'rev-3',
    rating: 5,
    quote: {
      en: '“Knowing every therapist here has 7+ years of experience gave me confidence, and the warm kappi chat format made opening up effortless.”',
      ml: '“7 വർഷത്തിലധികം പരിചയസമ്പത്തുള്ളവരാണ് എന്നത് വലിയ വിശ്വാസ്യത നൽകി. ഒരു കാപ്പി ചാറ്റ് പോലെ അത്രയും സൗഹൃദപരമായിരുന്നു.”',
    },
    visitorName: 'Devika S.',
    visitorCity: 'Kochi',
    therapistId: 'psy-jixon',
    therapistName: 'Jixon Punnoose',
    therapistExp: '9+ Yrs Exp',
    categoryTag: 'Depression & Family',
  },
];

export const COMMUNITY_GATHERINGS: CommunityGathering[] = [
  {
    id: 'event-cinema-circle',
    category: 'screening',
    categoryLabel: { en: 'Movie Screening', ml: 'സിനിമയും കാപ്പിയും' },
    title: {
      en: 'Banyan Tree Cinema: “Kumbalangi Nights” & Male Grief',
      ml: 'ആൽമരച്ചുവട്ടിലെ സിനിമ: കുമ്പളങ്ങി നൈറ്റ്സ് ചർച്ച',
    },
    description: {
      en: 'Open-air garden screening followed by a Chukku Kappi circle.',
      ml: 'കഫേ മുറ്റത്ത് സിനിമാ പ്രദർശനവും ചുക്കുകാപ്പി ചർച്ചയും.',
    },
    dateDisplay: 'Sat, Nov 14',
    timeDisplay: '6:30 PM IST',
    venue: {
      en: 'Garden Courtyard · Jagathy',
      ml: 'ഗ്രീൻ ഗാർഡൻ · ജഗതി',
    },
    isOnlineAvailable: false,
    facilitator: 'Prabin P.B. & Rishi Nair',
    totalCushions: 25,
    remainingCushions: 6,
    brewIncluded: 'Complimentary Cardamom Chukku Kappi',
  },
  {
    id: 'event-mudhouse-circle',
    category: 'circle',
    categoryLabel: { en: 'Mud-House Circle', ml: 'മൺവീട് കൂട്ടായ്മ' },
    title: {
      en: 'Letters We Never Sent: Shared Stories & Tara Listening',
      ml: 'അയയ്ക്കാത്ത കത്തുകൾ: കഥകളും ഓർമ്മകളും',
    },
    description: {
      en: 'Woven floor cushions inside our mud-house & live online room.',
      ml: 'മൺവീടിന്റെ തണുപ്പിലിരുന്ന് ഓർമ്മകൾ പങ്കുവെക്കാൻ ഒരു സായാഹ്നം.',
    },
    dateDisplay: 'Sun, Nov 15',
    timeDisplay: '5:00 PM IST',
    venue: {
      en: 'Mud-House & Online',
      ml: 'മൺവീട് & ഓൺലൈൻ',
    },
    isOnlineAvailable: true,
    facilitator: 'Ananya Menon & Neha Padayan',
    totalCushions: 18,
    remainingCushions: 4,
    brewIncluded: 'Degree Filter Kappi',
  },
  {
    id: 'event-clay-workshop',
    category: 'workshop',
    categoryLabel: { en: 'Clay Workshop', ml: 'കലാ ശില്പശാല' },
    title: {
      en: 'Clay, Coffee & Calm: Art Therapy for Overthinking',
      ml: 'കളിമണ്ണും കാപ്പിയും: ആർട്ട് തെറാപ്പി',
    },
    description: {
      en: 'Shape raw terracotta clay to quiet perfectionism and stress.',
      ml: 'കളിമണ്ണിൽ രൂപങ്ങൾ മെനഞ്ഞ് മനസ്സിനെ ശാന്തമാക്കാം.',
    },
    dateDisplay: 'Wed, Nov 18',
    timeDisplay: '4:30 PM IST',
    venue: {
      en: 'Garden Verandah · Jagathy',
      ml: 'ഗാർഡൻ വരാന്ത · ജഗതി',
    },
    isOnlineAvailable: false,
    facilitator: 'Jixon Punnoose',
    totalCushions: 15,
    remainingCushions: 5,
    brewIncluded: 'Iced Cold Brew',
  },
];
