// Character Dossier Data with high-detail stylized SVG portraits and tactical specs

export const characters = [
  {
    id: "kai",
    name: "KAI",
    alias: "AGENT 'LOSER'",
    role: "THE APEX ROGUE / MAIN AGENT",
    quote: "\"They called me a loser because I don't play their game. I burn the board.\"",
    bio: "The syndicate's most lethal ghost. Erased from every classified intelligence archive after Operation Blackout. Kai does not accept missions for glory or wealth—he hunts down apex criminal syndicates across neon metropolises, high-speed freeways, and sub-orbital skies. Chained at 35,000 feet? That wasn't a capture. That was his infiltration plan.",
    stats: {
      threatLevel: "S-CLASS (EXTINCTION)",
      combatStyle: "Gun-Kata & Krav Maga",
      lethality: "99.8%",
      signatureWeapon: "Suppressed HK MK23 .45 & Detonator Switch",
      signatureRide: "Spectre V8 All-Black Retromod (950 HP)",
      heartRateAtEdge: "48 BPM (Dead Calm)"
    },
    accentColor: "#ff1e42",
    svgPortrait: `
      <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kai-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#120c18"/>
            <stop offset="50%" stop-color="#0a050d"/>
            <stop offset="100%" stop-color="#000000"/>
          </linearGradient>
          <linearGradient id="kai-glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ff1e42" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#ff5e00" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="kai-suit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1e2029"/>
            <stop offset="100%" stop-color="#0d0e14"/>
          </linearGradient>
          <linearGradient id="skin-shade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f0c2a5"/>
            <stop offset="100%" stop-color="#c48a6e"/>
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#kai-bg)"/>
        <!-- Background Neon Grid & Smoke -->
        <circle cx="200" cy="190" r="140" fill="url(#kai-glow)" opacity="0.3"/>
        <path d="M0,320 L400,380 L400,500 L0,500 Z" fill="#0c0712" opacity="0.8"/>
        <!-- Tactical Suit / Shoulders -->
        <path d="M70,500 L120,310 L160,280 L240,280 L280,310 L330,500 Z" fill="url(#kai-suit)"/>
        <!-- Crisp White Shirt Collar & Charcoal Silk Tie -->
        <polygon points="170,280 200,350 230,280 215,280 200,320 185,280" fill="#f0f3fa"/>
        <polygon points="194,320 206,320 210,430 200,450 190,430" fill="#ff1e42"/>
        <polygon points="120,310 160,280 185,360 140,420" fill="#151720"/>
        <polygon points="280,310 240,280 215,360 260,420" fill="#151720"/>
        <!-- Tactical Shoulder Holster Straps -->
        <line x1="125" y1="330" x2="185" y2="390" stroke="#ff1e42" stroke-width="4" opacity="0.85"/>
        <line x1="275" y1="330" x2="215" y2="390" stroke="#ff1e42" stroke-width="4" opacity="0.85"/>
        <!-- Neck & Chin -->
        <polygon points="182,250 218,250 215,290 185,290" fill="#b97c60"/>
        <!-- Head Structure / Sharp Jawline -->
        <path d="M150,170 Q145,230 190,265 Q200,270 210,265 Q255,230 250,170 Q250,110 200,105 Q150,110 150,170 Z" fill="url(#skin-shade)"/>
        <!-- Shadow on face -->
        <path d="M200,110 Q245,130 245,180 Q240,240 205,268 L200,268 Z" fill="#995e45" opacity="0.4"/>
        <!-- Messy Agent Hair with Highlights -->
        <path d="M140,160 Q135,90 200,75 Q265,90 260,160 Q245,120 220,115 Q210,95 190,110 Q170,100 155,130 Q145,145 140,160 Z" fill="#0d0f17"/>
        <path d="M160,115 Q190,85 230,100 Q215,115 190,120 Z" fill="#ff1e42" opacity="0.6"/>
        <!-- Eyebrows with intense focus -->
        <polygon points="160,165 190,168 185,162 165,160" fill="#0a0b10"/>
        <polygon points="210,168 240,165 235,160 215,162" fill="#0a0b10"/>
        <!-- Eyes & Piercing Amber Pupil -->
        <ellipse cx="175" cy="178" rx="10" ry="5" fill="#ffffff"/>
        <circle cx="176" cy="178" r="3.5" fill="#ff9900"/>
        <circle cx="176" cy="178" r="1.5" fill="#000000"/>
        <ellipse cx="225" cy="178" rx="10" ry="5" fill="#ffffff"/>
        <circle cx="224" cy="178" r="3.5" fill="#ff9900"/>
        <circle cx="224" cy="178" r="1.5" fill="#000000"/>
        <!-- Scar across cheek -->
        <line x1="162" y1="185" x2="175" y2="215" stroke="#ff385c" stroke-width="2" opacity="0.8"/>
        <!-- Nose bridge & Shadow -->
        <polygon points="200,172 195,212 205,212" fill="#995e45"/>
        <!-- Iconic subtle smirk -->
        <path d="M185,236 Q200,238 218,232" stroke="#4a1818" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- Detonator Switch in hand silhouette (bottom right foreground) -->
        <rect x="290" y="410" width="35" height="60" rx="6" fill="#151720" stroke="#ff1e42" stroke-width="2"/>
        <circle cx="307" cy="428" r="8" fill="#ff1e42"/>
        <!-- Glowing sparks floating -->
        <circle cx="90" cy="140" r="2" fill="#ff9100"/>
        <circle cx="310" cy="220" r="3" fill="#ff1e42"/>
        <circle cx="130" cy="380" r="2" fill="#ffc400"/>
        <circle cx="280" cy="120" r="1.5" fill="#ff385c"/>
      </svg>
    `
  },
  {
    id: "valentina",
    name: "VALENTINA",
    alias: "VAL VEX // THE WHEELWOMAN",
    role: "HIGH-SPEED ESCAPE PILOT & UNDERWORLD QUEEN",
    quote: "\"Keep your seatbelt loose, Kai. When I hit 220 in the rain, we don't need safety—we need velocity.\"",
    bio: "Ex-Formula 1 prodigy banned for running illicit midnight touge runs across Tokyo and Monaco. Val is the undisputed queen of high-speed urban extractions. She can drift a 900hp customized hypercar through gridlocked neon expressways with millimeters to spare while shredding syndicate pursuit cruisers.",
    stats: {
      threatLevel: "A+ (VELOCITY SUPREMACY)",
      combatStyle: "Vehicle Takedown & Precision Ballistics",
      lethality: "94.5%",
      signatureWeapon: "Dual Submachine Guns 'Viper-9' & Micro-EMP",
      signatureRide: "Chiron Nocturne Quad-Turbo (1200 HP)",
      topSpeedRecord: "264 MPH (Pursuit Escape, Neo-Chicago)"
    },
    accentColor: "#00f0ff",
    svgPortrait: `
      <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="val-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0c1626"/>
            <stop offset="50%" stop-color="#050a14"/>
            <stop offset="100%" stop-color="#000000"/>
          </linearGradient>
          <linearGradient id="val-glow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#9d4edd" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="hair-val" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fdfbfa"/>
            <stop offset="60%" stop-color="#d4d8e8"/>
            <stop offset="100%" stop-color="#00f0ff"/>
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#val-bg)"/>
        <!-- Neon Cyber Rays -->
        <circle cx="210" cy="180" r="150" fill="url(#val-glow)" opacity="0.35"/>
        <line x1="0" y1="120" x2="400" y2="280" stroke="#00f0ff" stroke-width="1.5" opacity="0.3"/>
        <line x1="0" y1="180" x2="400" y2="340" stroke="#9d4edd" stroke-width="1.5" opacity="0.3"/>
        <!-- Leather Biker/Racing Jacket -->
        <path d="M80,500 L125,320 L165,290 L235,290 L275,320 L320,500 Z" fill="#141724"/>
        <path d="M125,320 L165,290 L185,410 L135,460 Z" fill="#00f0ff" opacity="0.2"/>
        <path d="M275,320 L235,290 L215,410 L265,460 Z" fill="#9d4edd" opacity="0.2"/>
        <!-- Deep V-Neck Black Top & Gold Choker -->
        <polygon points="175,290 200,380 225,290" fill="#fce5d8"/>
        <rect x="180" y="278" width="40" height="7" fill="#ffd700" rx="2"/>
        <!-- Neck & Face -->
        <polygon points="186,245 214,245 210,285 190,285" fill="#f0c2a5"/>
        <path d="M155,175 Q150,230 190,260 Q200,265 210,260 Q250,230 245,175 Q245,115 200,110 Q155,115 155,175 Z" fill="#fce5d8"/>
        <!-- Glamorous Platinum Hair Flowing with Neon Highlights -->
        <path d="M140,180 Q130,95 200,75 Q270,95 260,180 Q285,250 270,360 Q245,290 240,240 Q215,190 200,200 Q185,190 160,240 Q155,290 130,360 Q115,250 140,180 Z" fill="url(#hair-val)"/>
        <!-- Cyber Aviator Sunglasses / HUD Glasses -->
        <path d="M160,165 L240,165 L235,195 Q200,200 165,195 Z" fill="#0d111a" stroke="#00f0ff" stroke-width="2"/>
        <line x1="165" y1="180" x2="235" y2="180" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="4,2"/>
        <!-- Full Lips with Red Gloss -->
        <path d="M188,230 Q200,225 212,230 Q200,242 188,230 Z" fill="#ff1e42"/>
        <!-- Racing Earring / Tech Comm -->
        <circle cx="150" cy="195" r="4" fill="#00f0ff"/>
        <!-- Glowing neon speed lines -->
        <circle cx="320" cy="140" r="2.5" fill="#00f0ff"/>
        <circle cx="80" cy="240" r="2" fill="#9d4edd"/>
        <circle cx="340" cy="380" r="3" fill="#00f0ff"/>
      </svg>
    `
  },
  {
    id: "maya",
    name: "MAYA",
    alias: "GHOST // THE SILENT BLADE",
    role: "SHADOW INFILTRATOR & GUN-KATA ASSASSIN",
    quote: "\"Guards look at doorways. Syndicates look at cameras. I fall from the glass ceiling with drawn steel.\"",
    bio: "Raised in an elite covert black-budget black-ops unit that officially never existed. Maya operates in the vertical realm of skyscrapers, penthouses, and high-altitude cargo aircraft. Armed with high-frequency monomolecular blades and dual suppressed ballistics, she clears an entire squad of syndicate bodyguards before the first spent cartridge hits the floor.",
    stats: {
      threatLevel: "S-CLASS (LETHAL GHOST)",
      combatStyle: "Iaidō Swordplay & Suppressed Gun-Kata",
      lethality: "99.1%",
      signatureWeapon: "High-Frequency Katana & Twin Suppressed 9mm",
      signatureRide: "Ninja H2 Carbon Stealth Interceptor (Supercharged)",
      takedownSpeed: "4 Enemies in 1.4 Seconds"
    },
    accentColor: "#9d4edd",
    svgPortrait: `
      <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="maya-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#180a22"/>
            <stop offset="60%" stop-color="#0b0410"/>
            <stop offset="100%" stop-color="#000000"/>
          </linearGradient>
          <linearGradient id="blade-glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ff007f"/>
            <stop offset="100%" stop-color="#9d4edd"/>
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#maya-bg)"/>
        <!-- Blade Slash FX across background -->
        <path d="M-20,400 L380,60 L420,70 L20,410 Z" fill="url(#blade-glow)" opacity="0.45"/>
        <!-- Tactical Stealth Bodysuit -->
        <path d="M90,500 L135,315 L170,285 L230,285 L265,315 L310,500 Z" fill="#0f0b17"/>
        <line x1="170" y1="285" x2="190" y2="440" stroke="#9d4edd" stroke-width="2" opacity="0.6"/>
        <line x1="230" y1="285" x2="210" y2="440" stroke="#ff007f" stroke-width="2" opacity="0.6"/>
        <!-- Sleek High-Collar Assassin Neck -->
        <polygon points="185,250 215,250 212,288 188,288" fill="#1b1228" stroke="#ff007f" stroke-width="1.5"/>
        <!-- Face & Porcelain Skin Tone -->
        <path d="M160,175 Q155,230 192,260 Q200,264 208,260 Q245,230 240,175 Q240,115 200,110 Q160,115 160,175 Z" fill="#f5e6e8"/>
        <!-- Jet-black sleek ponytail with high bun & cyber pins -->
        <circle cx="260" cy="100" r="30" fill="#08060d"/>
        <path d="M260,100 Q330,140 310,340 Q280,260 270,160 Z" fill="#08060d"/>
        <line x1="240" y1="80" x2="280" y2="120" stroke="#ff007f" stroke-width="3"/>
        <path d="M150,165 Q145,95 200,80 Q255,95 250,165 Q235,130 200,130 Q165,130 150,165 Z" fill="#08060d"/>
        <!-- Sharp Cat Eyes with Glowing Violet Iris -->
        <ellipse cx="178" cy="175" rx="9" ry="4.5" fill="#ffffff"/>
        <circle cx="179" cy="175" r="3" fill="#9d4edd"/>
        <circle cx="179" cy="175" r="1.2" fill="#000000"/>
        <ellipse cx="222" cy="175" rx="9" ry="4.5" fill="#ffffff"/>
        <circle cx="221" cy="175" r="3" fill="#9d4edd"/>
        <circle cx="221" cy="175" r="1.2" fill="#000000"/>
        <path d="M165,170 Q178,166 188,172" stroke="#000" stroke-width="2" fill="none"/>
        <path d="M212,172 Q222,166 235,170" stroke="#000" stroke-width="2" fill="none"/>
        <!-- Crimson/Berry Lip tint -->
        <path d="M192,228 Q200,224 208,228 Q200,237 192,228 Z" fill="#c2185b"/>
        <!-- High-Frequency Katana Hilt over Shoulder -->
        <rect x="290" y="240" width="16" height="85" rx="3" fill="#1b1228" stroke="#ff007f" stroke-width="2" transform="rotate(-30 290 240)"/>
        <circle cx="305" cy="275" r="4" fill="#9d4edd"/>
        <!-- Glowing cherry blossom embers -->
        <circle cx="90" cy="180" r="2.5" fill="#ff007f"/>
        <circle cx="140" cy="340" r="2" fill="#9d4edd"/>
        <circle cx="320" cy="410" r="3" fill="#ff007f"/>
      </svg>
    `
  },
  {
    id: "chloe",
    name: "CHLOE",
    alias: "VIXEN // THE ARCHITECT",
    role: "NEURAL HACKER & DRONE SWARM COMMANDER",
    quote: "\"I just shut down the entire military radar grid over the Atlantic. You have 90 seconds to jump, Loser. Don't be late.\"",
    bio: "The tech savant who orchestrates the impossible from the shadows. With an overclocked cybernetic neural rig and an autonomous combat drone swarm, Chloe controls city grids, traffic lights, and military airspace. When Kai jumps from the cargo ramp, Chloe is the voice whispering the exact detonator timing in his earpiece.",
    stats: {
      threatLevel: "A+ (NETWORK COLLAPSE)",
      combatStyle: "Autonomous Drone Swarm & Cyber-Warfare",
      lethality: "92.0%",
      signatureWeapon: "Drone Swarm 'Hornet-8' & Cyber-Spike Deck",
      signatureRide: "Mobile Command RV with Dual EMP Cannon",
      hackLatency: "0.12 Milliseconds"
    },
    accentColor: "#ff9100",
    svgPortrait: `
      <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="chloe-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#191104"/>
            <stop offset="60%" stop-color="#0a0702"/>
            <stop offset="100%" stop-color="#000000"/>
          </linearGradient>
          <linearGradient id="gold-cyber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ff9100"/>
            <stop offset="100%" stop-color="#ffc400"/>
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#chloe-bg)"/>
        <!-- Holographic HUD Data Hexagons -->
        <polygon points="70,100 95,85 120,100 120,130 95,145 70,130" stroke="#ff9100" stroke-width="1.5" fill="none" opacity="0.4"/>
        <polygon points="310,180 335,165 360,180 360,210 335,225 310,210" stroke="#ffc400" stroke-width="1.5" fill="none" opacity="0.4"/>
        <!-- Oversized Cyber Bomber Jacket -->
        <path d="M70,500 L115,310 L160,280 L240,280 L285,310 L330,500 Z" fill="#201a12" stroke="#ff9100" stroke-width="1.5"/>
        <polygon points="175,280 200,360 225,280" fill="#fdf0e0"/>
        <!-- Lilac/Amber Dyed Modern Bob Cut -->
        <path d="M140,160 Q130,90 200,75 Q270,90 260,160 Q260,240 240,240 Q240,180 200,180 Q160,180 160,240 Q140,240 140,160 Z" fill="#c084fc"/>
        <!-- Face Structure -->
        <path d="M158,170 Q155,225 190,255 Q200,260 210,255 Q245,225 242,170 Q240,115 200,110 Q160,115 158,170 Z" fill="#fae8d8"/>
        <!-- Glowing Holographic Visor across forehead/eyes -->
        <rect x="150" y="160" width="100" height="26" rx="4" fill="#ff9100" opacity="0.85"/>
        <text x="162" y="178" font-family="monospace" font-size="11" fill="#000" font-weight="bold">BYPASS: OK</text>
        <!-- Pierced Lip & Confident Smile -->
        <path d="M190,228 Q200,235 210,228" stroke="#7a3418" stroke-width="2.5" fill="none"/>
        <circle cx="198" cy="236" r="2" fill="#ffd700"/>
        <!-- Floating Combat Drone companion -->
        <circle cx="320" cy="110" r="14" fill="#141724" stroke="#ff9100" stroke-width="2"/>
        <circle cx="320" cy="110" r="5" fill="#ff1e42"/>
        <line x1="298" y1="100" x2="342" y2="120" stroke="#ff9100" stroke-width="2"/>
        <line x1="298" y1="120" x2="342" y2="100" stroke="#ff9100" stroke-width="2"/>
      </svg>
    `
  },
  {
    id: "zane",
    name: "VIKTOR ZANE",
    alias: "THE OVERLORD // SYNDICATE HIGH COMMAND",
    role: "APEX GLOBAL SYNDICATE WARLORD",
    quote: "\"You are 35,000 feet in the air, chained to my cargo ramp, without a parachute. What do you have left?\"",
    bio: "The ruthless commander of the Apex Syndicate. Viktor Zane rules from an airborne military stronghold that cruises high above sovereign airspace. He thought he had trapped Kai in titanium chains at the razor's edge of the drop. He realized his fatal mistake the moment Kai smiled.",
    stats: {
      threatLevel: "OMEGA (HIGH SYNDICATE COMMAND)",
      combatStyle: "Titanium Cybernetic Augmentations & Heavy Firepower",
      lethality: "97.5%",
      signatureWeapon: "Armored Rail-Rifle & Cargo Jet Self-Defense Grid",
      signatureRide: "C-17 Globemaster 'Leviathan' Heavy Transport",
      fatalMistake: "Underestimating the 'Loser'"
    },
    accentColor: "#ffffff",
    svgPortrait: `
      <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="zane-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#14161f"/>
            <stop offset="60%" stop-color="#0a0c12"/>
            <stop offset="100%" stop-color="#000000"/>
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#zane-bg)"/>
        <!-- Military Storm Clouds & Red Warning Lights -->
        <circle cx="320" cy="100" r="15" fill="#ff1e42" opacity="0.6"/>
        <line x1="0" y1="360" x2="400" y2="360" stroke="#ff1e42" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.5"/>
        <!-- Heavy Armored Trench Coat with Fur Collar -->
        <path d="M60,500 L110,290 L160,260 L240,260 L290,290 L340,500 Z" fill="#1b202c"/>
        <path d="M110,290 Q150,320 160,260 L240,260 Q250,320 290,290 Z" fill="#2d3345"/>
        <!-- Cold Ruthless Face with Cybernetic Titanium Jaw -->
        <path d="M150,165 Q145,225 190,255 Q200,260 210,255 Q255,225 250,165 Q250,110 200,105 Q150,110 150,165 Z" fill="#e8d0be"/>
        <!-- Cyber Jaw -->
        <path d="M160,215 Q155,255 190,260 Q200,264 210,260 Q245,255 240,215 Z" fill="#68728a" stroke="#00f0ff" stroke-width="1"/>
        <line x1="180" y1="235" x2="220" y2="235" stroke="#00f0ff" stroke-width="1.5"/>
        <!-- Slick Gray Hair -->
        <path d="M142,150 Q140,85 200,75 Q260,85 258,150 Q240,110 200,110 Q160,110 142,150 Z" fill="#8f9bb0"/>
        <!-- Piercing Cold Steel Eyes -->
        <ellipse cx="176" cy="168" rx="8" ry="4" fill="#ffffff"/>
        <circle cx="176" cy="168" r="2.5" fill="#00f0ff"/>
        <ellipse cx="224" cy="168" rx="8" ry="4" fill="#ffffff"/>
        <circle cx="224" cy="168" r="2.5" fill="#00f0ff"/>
        <!-- Arrogant Grimace -->
        <line x1="185" y1="230" x2="215" y2="230" stroke="#000" stroke-width="2"/>
      </svg>
    `
  }
];
