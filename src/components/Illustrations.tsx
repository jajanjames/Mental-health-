import React, { useState } from 'react';

interface AnimatedCoffeeCupProps {
  liquidColor: string;
  cremaColor: string;
  botanicalAccent: 'cardamom' | 'cinnamon' | 'hibiscus' | 'tulsi' | 'roast';
  coffeeName: string;
  isPouring?: boolean;
}

export const AnimatedCoffeeCup: React.FC<AnimatedCoffeeCupProps> = ({
  liquidColor,
  cremaColor,
  botanicalAccent,
  coffeeName,
  isPouring = false,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center p-4 select-none">
      <svg
        viewBox="0 0 260 220"
        className="w-full max-w-[220px] h-auto overflow-visible"
        role="img"
        aria-label={`Illustrated cup of ${coffeeName}`}
      >
        {/* Warm soft shadow saucer base */}
        <ellipse cx="120" cy="192" rx="84" ry="14" fill="#E6DEC8" opacity="0.65" />
        <ellipse
          cx="120"
          cy="187"
          rx="76"
          ry="11"
          fill="#F4EFE6"
          stroke="#231F1D"
          strokeWidth="2.2"
        />

        {/* Animated Rising Steam Lines */}
        <g className="animate-steam-1">
          <path
            d="M92 68 C84 52, 102 38, 92 20"
            fill="none"
            stroke="#C87D28"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
        <g className="animate-steam-2">
          <path
            d="M120 62 C112 44, 132 30, 120 12"
            fill="none"
            stroke="#446E35"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.55"
          />
        </g>
        <g className="animate-steam-3">
          <path
            d="M148 70 C140 54, 158 40, 148 24"
            fill="none"
            stroke="#C87D28"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>

        {/* Cup Handle */}
        <path
          d="M178 102 C210 102, 212 154, 174 156"
          fill="none"
          stroke="#231F1D"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M178 102 C210 102, 212 154, 174 156"
          fill="none"
          stroke="#FBF8F3"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Brass Davara Tumbler Base Rim */}
        <path
          d="M54 166 C56 184, 184 184, 186 166"
          fill="#D99B52"
          stroke="#231F1D"
          strokeWidth="2.2"
        />

        {/* Main Ceramic/Brass Cup Body */}
        <path
          d="M56 88 L184 88 C184 146, 166 182, 120 182 C74 182, 56 146, 56 88 Z"
          fill="#FFFDF9"
          stroke="#231F1D"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Subtle olive & amber stripe on the cup */}
        <path
          d="M62 128 Q120 138 178 128"
          fill="none"
          stroke="#C87D28"
          strokeWidth="3"
          strokeDasharray="6 4"
          opacity="0.75"
        />
        <path
          d="M68 148 Q120 158 172 148"
          fill="none"
          stroke="#446E35"
          strokeWidth="2"
          opacity="0.65"
        />

        {/* Coffee Rim & Liquid Fill */}
        <ellipse
          cx="120"
          cy="88"
          rx="64"
          ry="16"
          fill={liquidColor}
          stroke="#231F1D"
          strokeWidth="2.4"
          className="transition-colors duration-300"
        />

        {/* Crema Swirl Art inside the cup */}
        <ellipse
          cx="120"
          cy="89"
          rx="46"
          ry="9"
          fill={cremaColor}
          opacity="0.55"
          className="transition-all duration-300"
          style={{
            transform: isPouring ? 'scale(0.92)' : 'scale(1)',
            transformOrigin: '120px 89px',
          }}
        />
        <path
          d="M95 88 Q120 96 145 87"
          fill="none"
          stroke="#FFFDF9"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Botanical Garnish Icon on the Saucer */}
        {botanicalAccent === 'cardamom' && (
          <g transform="translate(46, 168)">
            <ellipse
              cx="14"
              cy="10"
              rx="11"
              ry="6"
              transform="rotate(-18 14 10)"
              fill="#7A9A65"
              stroke="#231F1D"
              strokeWidth="1.8"
            />
            <path d="M6 12 L22 8" stroke="#231F1D" strokeWidth="1.2" />
          </g>
        )}
        {botanicalAccent === 'cinnamon' && (
          <g transform="translate(42, 165)">
            <rect
              x="4"
              y="6"
              width="28"
              height="7"
              rx="3.5"
              transform="rotate(-15 18 9)"
              fill="#9E472A"
              stroke="#231F1D"
              strokeWidth="1.8"
            />
          </g>
        )}
        {botanicalAccent === 'hibiscus' && (
          <g transform="translate(46, 164)">
            <circle cx="14" cy="12" r="8" fill="#D45B4B" stroke="#231F1D" strokeWidth="1.8" />
            <circle cx="14" cy="12" r="2.5" fill="#FBF8F3" />
          </g>
        )}
        {botanicalAccent === 'tulsi' && (
          <g transform="translate(45, 164)">
            <path
              d="M6 16 C6 6, 22 6, 22 16 C22 20, 6 20, 6 16 Z"
              fill="#446E35"
              stroke="#231F1D"
              strokeWidth="1.8"
            />
          </g>
        )}
        {botanicalAccent === 'roast' && (
          <g transform="translate(46, 166)">
            <ellipse
              cx="14"
              cy="11"
              rx="9"
              ry="6"
              fill="#4A2518"
              stroke="#231F1D"
              strokeWidth="1.8"
            />
            <path d="M7 11 Q14 14 21 11" fill="none" stroke="#FBF8F3" strokeWidth="1.3" />
          </g>
        )}
      </svg>
    </div>
  );
};

interface ListenerPortraitProps {
  name: string;
  photoUrl?: string;
  photoPosition?: string;
  sizeClass?: string;
  theme: {
    bg: string;
    hair: string;
    shirt: string;
    accent: string;
    glasses?: boolean;
    beard?: boolean;
    flower?: boolean;
  };
}

export const ListenerPortraitSvg: React.FC<ListenerPortraitProps> = ({
  name,
  photoUrl,
  photoPosition = 'center 20%',
  sizeClass = 'w-20 h-20',
  theme,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (photoUrl && !imgFailed) {
    return (
      <div
        className={`${sizeClass} rounded-2xl border border-[#181916]/10 shrink-0 overflow-hidden bg-[#ECE8DC] relative`}
      >
        <img
          src={photoUrl}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          style={{ objectPosition: photoPosition }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-2xl border border-[#181916]/15 shrink-0 flex items-center justify-center font-semibold text-lg text-[#181916]`}
      style={{ backgroundColor: theme.bg }}
      aria-label={name}
    >
      {name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)}
    </div>
  );
};

interface ResilientIllustrationProps {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
}

export const ResilientIllustration: React.FC<ResilientIllustrationProps> = ({
  src,
  alt,
  className = '',
  caption,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F4EFE6] border border-[#E6DEC8] p-8 text-center ${className}`}
      >
        <p className="font-display text-sm font-medium text-[#181916]">{alt}</p>
      </div>
    );
  }

  return (
    <figure className="relative w-full h-full overflow-hidden group">
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${className}`}
      />
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
};
