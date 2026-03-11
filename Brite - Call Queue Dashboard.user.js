// ==UserScript==
// @name         Brite - Call Queue Dashboard
// @author       Griffin D. Hamell
// @namespace    http://brite.com/
// @version      6.9
// @description  Full-screen Call Queue TV overlay with live agent data, Nord icons, seasonal SVGs
// @match        https://na1.nice-incontact.com/mydashboard/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/hamellco/brite-gdh-code/raw/refs/heads/main/Brite%20-%20Call%20Queue%20Dashboard.user.js
// @downloadURL  https://github.com/hamellco/brite-gdh-code/raw/refs/heads/main/Brite%20-%20Call%20Queue%20Dashboard.user.js
// ==/UserScript==

(() => {
  "use strict";
  if (document.getElementById("rc-overlay-root")) return;

  const LOGO_SRC = "https://i.imgur.com/9u777jj.png";

  /* ===============================
     SEASONAL HOLIDAY DETECTION
  =============================== */

  // Calculates Easter Sunday using Anonymous Gregorian algorithm
  function getEasterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31); // 1-based
    const day   = ((h + l - 7 * m + 114) % 31) + 1;
    return { month, day };
  }

  function getEasterMonday(year) {
    const easter = getEasterSunday(year);
    const d = new Date(year, easter.month - 1, easter.day);
    d.setDate(d.getDate() + 1);
    return { month: d.getMonth() + 1, day: d.getDate() };
  }

  function detectHoliday() {
    const now   = new Date();
    const month = now.getMonth() + 1; // 1-based
    const day   = now.getDate();
    const year  = now.getFullYear();

    if (month === 3 && day === 17) return "stpatricks";

    const em = getEasterMonday(year);
    if (month === em.month && day === em.day) return "eastermonday";

    if (month === 4 && day === 7) return "beerday";
    if (month === 4 && day === 1) return "aprilfools";

    return null;
  }

  const HOLIDAY = detectHoliday();

  /* ===============================
     SEASONAL SVGs  (Nord palette)
     Positioned: top:18px left:28px
     Size: ~90px tall, free width
  =============================== */

  // Four-leaf clover — Nord greens (#a3be8c, #8fbcbb)
  const SVG_STPATRICKS = `
    <svg xmlns="http://www.w3.org/2000/svg" width="90" height="110" viewBox="0 0 90 110" fill="none">
      <!-- Leaf top -->
      <ellipse cx="45" cy="24" rx="16" ry="22" fill="#a3be8c" opacity="0.92"/>
      <!-- Leaf bottom -->
      <ellipse cx="45" cy="66" rx="16" ry="22" fill="#a3be8c" opacity="0.92"/>
      <!-- Leaf left -->
      <ellipse cx="24" cy="45" rx="22" ry="16" fill="#8fbcbb" opacity="0.88"/>
      <!-- Leaf right -->
      <ellipse cx="66" cy="45" rx="22" ry="16" fill="#8fbcbb" opacity="0.88"/>
      <!-- Center -->
      <circle cx="45" cy="45" r="8" fill="#a3be8c"/>
      <!-- Stem -->
      <path d="M45 75 Q42 90 38 100" stroke="#a3be8c" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <!-- Vein highlights -->
      <line x1="45" y1="28" x2="45" y2="44" stroke="#d8eec8" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
      <line x1="28" y1="45" x2="44" y2="45" stroke="#d8eec8" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
      <line x1="46" y1="45" x2="62" y2="45" stroke="#d8eec8" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
      <line x1="45" y1="46" x2="45" y2="62" stroke="#d8eec8" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
    </svg>`;

  // Easter bunny — Nord snow/frost tones
  const SVG_EASTER = `
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="110" viewBox="0 0 80 110" fill="none">
      <!-- Left ear -->
      <ellipse cx="27" cy="18" rx="8" ry="18" fill="#d8dee9"/>
      <ellipse cx="27" cy="18" rx="4.5" ry="13" fill="#bf616a" opacity="0.7"/>
      <!-- Right ear -->
      <ellipse cx="53" cy="18" rx="8" ry="18" fill="#d8dee9"/>
      <ellipse cx="53" cy="18" rx="4.5" ry="13" fill="#bf616a" opacity="0.7"/>
      <!-- Head -->
      <circle cx="40" cy="44" r="22" fill="#eceff4"/>
      <!-- Body -->
      <ellipse cx="40" cy="82" rx="20" ry="24" fill="#e5e9f0"/>
      <!-- Eyes -->
      <circle cx="32" cy="40" r="3.5" fill="#4c566a"/>
      <circle cx="48" cy="40" r="3.5" fill="#4c566a"/>
      <circle cx="33" cy="39" r="1.2" fill="#eceff4"/>
      <circle cx="49" cy="39" r="1.2" fill="#eceff4"/>
      <!-- Nose -->
      <ellipse cx="40" cy="48" rx="3" ry="2" fill="#bf616a" opacity="0.85"/>
      <!-- Mouth -->
      <path d="M37 51 Q40 54 43 51" stroke="#4c566a" stroke-width="1.4" stroke-linecap="round" fill="none"/>
      <!-- Whiskers left -->
      <line x1="22" y1="47" x2="36" y2="49" stroke="#4c566a" stroke-width="1" opacity="0.5"/>
      <line x1="22" y1="51" x2="36" y2="51" stroke="#4c566a" stroke-width="1" opacity="0.5"/>
      <!-- Whiskers right -->
      <line x1="44" y1="49" x2="58" y2="47" stroke="#4c566a" stroke-width="1" opacity="0.5"/>
      <line x1="44" y1="51" x2="58" y2="51" stroke="#4c566a" stroke-width="1" opacity="0.5"/>
      <!-- Tail -->
      <circle cx="58" cy="88" r="7" fill="#eceff4"/>
      <!-- Paws -->
      <ellipse cx="28" cy="103" rx="9" ry="5" fill="#e5e9f0"/>
      <ellipse cx="52" cy="103" rx="9" ry="5" fill="#e5e9f0"/>
    </svg>`;

  // Beer stein — Nord amber/yellow tones
  const SVG_BEER = `
    <svg xmlns="http://www.w3.org/2000/svg" width="90" height="110" viewBox="0 0 90 110" fill="none">
      <!-- Foam overflow -->
      <ellipse cx="38" cy="14" rx="28" ry="10" fill="#eceff4" opacity="0.95"/>
      <circle cx="20" cy="10" r="7" fill="#eceff4" opacity="0.9"/>
      <circle cx="35" cy="7"  r="9" fill="#eceff4" opacity="0.95"/>
      <circle cx="52" cy="9"  r="7" fill="#eceff4" opacity="0.9"/>
      <circle cx="63" cy="13" r="5" fill="#eceff4" opacity="0.85"/>
      <!-- Stein body -->
      <rect x="10" y="18" width="56" height="76" rx="6" fill="#ebcb8b"/>
      <!-- Beer color layer -->
      <rect x="10" y="28" width="56" height="66" rx="0 0 6 6" fill="#d08770" opacity="0.55"/>
      <!-- Handle outer -->
      <path d="M66 32 Q88 32 88 55 Q88 78 66 78" stroke="#d08770" stroke-width="10" stroke-linecap="round" fill="none"/>
      <!-- Handle inner cutout -->
      <path d="M66 38 Q80 38 80 55 Q80 72 66 72" stroke="#ebcb8b" stroke-width="4" stroke-linecap="round" fill="none"/>
      <!-- Stein bands -->
      <rect x="10" y="52" width="56" height="5" rx="2" fill="#d08770" opacity="0.4"/>
      <rect x="10" y="68" width="56" height="5" rx="2" fill="#d08770" opacity="0.4"/>
      <!-- Bubble highlights -->
      <circle cx="28" cy="60" r="3" fill="#eceff4" opacity="0.3"/>
      <circle cx="42" cy="75" r="2" fill="#eceff4" opacity="0.3"/>
      <circle cx="52" cy="58" r="2.5" fill="#eceff4" opacity="0.3"/>
      <!-- Foam top detail -->
      <ellipse cx="38" cy="20" rx="24" ry="6" fill="#eceff4" opacity="0.7"/>
      <!-- Base -->
      <rect x="8" y="91" width="60" height="8" rx="4" fill="#d08770" opacity="0.6"/>
    </svg>`;

  const HOLIDAY_SVGS = {
    stpatricks:  SVG_STPATRICKS,
    eastermonday: SVG_EASTER,
    beerday:     SVG_BEER,
  };

  /* ===============================
     STATE MAP
  =============================== */

  // Lucide monochrome white SVGs
  const S = 'class="rcStateIcon" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';
  const ICONS = {
    available:   `<svg ${S}><circle cx="12" cy="12" r="10"/><path d="M8 12l2.5 2.5L16 9"/></svg>`,
    unavailable: `<svg ${S}><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`,
    inbound:     `<svg ${S}><polyline points="16 2 16 8 22 8"/><line x1="23" y1="1" x2="16" y2="8"/><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
    outbound:    `<svg ${S}><polyline points="23 7 23 1 17 1"/><line x1="16" y1="8" x2="23" y2="1"/><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
    acw:         `<svg ${S}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    loggedoff:   `<svg ${S}><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>`,
  };

  const STATE_META = {
    0: { icon: ICONS.loggedoff,   label: "Logged Off"  },
    1: { icon: ICONS.available,   label: "Available"   },
    2: { icon: ICONS.unavailable, label: "Unavailable" },
    3: { icon: ICONS.inbound,     label: "Inbound"     },
    4: { icon: ICONS.outbound,    label: "Outbound"    },
    5: { icon: ICONS.acw,         label: "ACW"         },
  };

  const agentMap = new Map();
  const contactMap = new Map();

  // Level 2 agents — hidden from the dashboard permanently
  const HIDDEN_AGENTS = new Set([
    "Kamal Bal",
    "John Stone",
    "Kody Hogg",
    "Diego Simbron",
  ]);

  /* ===============================
     LOAD FONTS
  =============================== */

  const f1 = document.createElement("link");
  f1.rel = "preconnect"; f1.href = "https://fonts.googleapis.com";
  document.head.appendChild(f1);

  const f2 = document.createElement("link");
  f2.rel = "preconnect"; f2.href = "https://fonts.gstatic.com";
  f2.crossOrigin = "anonymous";
  document.head.appendChild(f2);

  const snPro = document.createElement("link");
  snPro.rel = "stylesheet";
  snPro.href = "https://fonts.googleapis.com/css2?family=SN+Pro:wght@200;300;400;500;600;700;800;900&display=swap";
  document.head.appendChild(snPro);

  const indie = document.createElement("link");
  indie.rel = "stylesheet";
  indie.href = "https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap";
  document.head.appendChild(indie);

  /* ===============================
     HIDE NICE UI
  =============================== */

  const hideStyle = document.createElement("style");
  hideStyle.textContent = `
    html, body { height:100% !important; }
    body > * { visibility:hidden !important; }
    #rc-overlay-root, #rc-overlay-root * { visibility:visible !important; }
  `;
  document.head.appendChild(hideStyle);

  /* ===============================
     STYLES
  =============================== */

  const style = document.createElement("style");
  style.textContent = `
    #rc-overlay-root, #rc-overlay-root * { box-sizing:border-box; }

    #rc-overlay-root{
      position:fixed; inset:0; z-index:2147483647;
      background: radial-gradient(1200px 800px at 50% -10%, #3b4252 0%, #2e3440 55%, #262c36 100%);
      color:#e5e9f0;
      font-family:"SN Pro", system-ui, sans-serif;
      overflow:hidden;
      --rc-header-h: 180px;
      --rc-bottom-pad: 24px;
    }

    /* BELIEVE */
    #rc-overlay-root .rcBelieve{
      position:fixed; top:28px; right:48px;
      background:#facc15; color:#111;
      padding:30px 60px;
      font-family:"Indie Flower", cursive;
      font-size:78px; font-weight:700; letter-spacing:.06em;
      border-radius:4px;
      box-shadow: 0 6px 14px rgba(0,0,0,.35), 0 2px 0 rgba(0,0,0,.25);
      transform:rotate(-2deg);
      z-index:2147483647; user-select:none;
    }
    #rc-overlay-root .rcBelieve::before,
    #rc-overlay-root .rcBelieve::after{
      content:""; position:absolute;
      width:22px; height:8px;
      background:rgba(255,255,255,0.35);
      top:-4px; border-radius:2px;
    }
    #rc-overlay-root .rcBelieve::before{ left:12px; transform:rotate(-18deg); }
    #rc-overlay-root .rcBelieve::after{ right:12px; transform:rotate(18deg); }

    /* SEASONAL ICON */
    #rc-overlay-root .rcSeasonal{
      position:fixed;
      top:14px; left:28px;
      z-index:2147483647;
      user-select:none;
      pointer-events:none;
      filter: drop-shadow(0 6px 16px rgba(0,0,0,0.40));
      animation: rc-seasonal-float 4s ease-in-out infinite;
    }

    @keyframes rc-seasonal-float {
      0%,100% { transform: translateY(0px) rotate(-3deg); }
      50%      { transform: translateY(-6px) rotate(2deg); }
    }

    /* HEADER */
    #rc-overlay-root .rcHeader{ padding:24px 20px 12px; text-align:center; }
    #rc-overlay-root .rcLogoImg.rcFlipped{
      transform: rotate(180deg);
    }

    #rc-overlay-root .rcLogoImg{
      transition: transform 0s;
      height:86px; display:block; margin:0 auto;
      filter:drop-shadow(0 10px 25px rgba(0,0,0,.35));
    }
    #rc-overlay-root .rcHeaderTitle{
      margin-top:10px; font-size:34px; font-weight:900; letter-spacing:.08em;
    }
    #rc-overlay-root .rcHeaderSynced{
      margin-top:8px; font-size:15px; color:#a7b0c0; font-weight:700;
    }

    /* LAYOUT */
    #rc-overlay-root .rcWrap{
      max-width:1800px; margin:0 auto;
      height:calc(100vh - var(--rc-header-h));
      padding:0 30px var(--rc-bottom-pad);
      display:grid;
      grid-template-columns:1fr 1.2fr;
      gap:22px; align-items:stretch;
    }
    #rc-overlay-root .rcLeftCol{
      display:grid; gap:16px;
      grid-template-rows:1fr 1fr 1fr;
      align-content:stretch; overflow:hidden;
    }
    @media (max-width:1200px){
      #rc-overlay-root{ overflow:auto; }
      #rc-overlay-root .rcWrap{ grid-template-columns:1fr; height:auto; }
    }

    /* CARDS */
    #rc-overlay-root .rcCard{
      background:rgba(59,66,82,.95);
      border:1px solid rgba(148,163,184,.18);
      border-radius:20px;
      box-shadow:0 10px 30px rgba(0,0,0,.35);
      overflow:hidden;
      display:flex;
      flex-direction:column;
    }
    #rc-overlay-root .rcCardHd{
      padding:12px 16px;
      border-bottom:1px solid rgba(148,163,184,.12);
      font-weight:900; letter-spacing:.1em;
      text-transform:uppercase; font-size:13px;
      text-align:center;
    }
    #rc-overlay-root .rcCardBd{ padding:14px; flex:1 1 auto; display:flex; flex-direction:column; }

    /* TILES */
    #rc-overlay-root .rcTiles4{
      display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px;
      flex:1 1 auto;
    }
    #rc-overlay-root .rcTile{
      background:rgba(67,76,94,.95); border-radius:18px;
      padding:18px 20px;
      display:flex; flex-direction:column; justify-content:center;
    }
    #rc-overlay-root .rcTileLabel{
      font-size:13px; font-weight:900; letter-spacing:.14em;
      color:#a7b0c0; text-transform:uppercase;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      text-align:center;
    }
    #rc-overlay-root .rcTileValue{
      margin-top:8px; font-size:64px; font-weight:950;
      letter-spacing:-.02em; line-height:1;
      text-align:center;
    }
    #rc-overlay-root .rcTileSub{
      margin-top:8px; font-size:14px; font-weight:700; color:#a7b0c0;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      text-align:center;
    }
    @media (max-width:1400px){
      #rc-overlay-root .rcTiles4{ grid-template-columns:repeat(2,minmax(0,1fr)); }
      #rc-overlay-root .rcTileValue{ font-size:52px; }
    }

    /* QUEUE */
    #rc-overlay-root .rcQueueBox{
      flex:1 1 auto; display:grid; place-items:center;
      font-size:22px; font-weight:800; color:#a7b0c0; letter-spacing:.05em;
      border-radius:18px; background:rgba(67,76,94,.55);
    }

    /* TEAM */
    #rc-overlay-root .rcTeamCard{
      height:100%; display:flex; flex-direction:column; min-height:0;
    }
    #rc-overlay-root .rcTeamBody{
      padding:14px; flex:1 1 auto; min-height:0; overflow:hidden;
    }

    @keyframes rc-team-scroll {
      0%   { transform: translateY(0); }
      80%  { transform: translateY(var(--rc-scroll-dist)); }
      100% { transform: translateY(var(--rc-scroll-dist)); }
    }
    #rc-overlay-root .rcTeamBody::-webkit-scrollbar{ display:none; }
    #rc-overlay-root .rcTeamBody{ -ms-overflow-style:none; scrollbar-width:none; }

    #rc-overlay-root .rcRows{ display:grid; gap:14px; }
    #rc-overlay-root .rcRow{
      display:grid; grid-template-columns:minmax(0,1fr) 180px; gap:16px;
    }
    #rc-overlay-root .rcRowMain{
      background:rgba(67,76,94,.95); border-radius:20px;
      padding:20px 22px; display:flex; align-items:center; gap:18px; min-width:0;
    }
    #rc-overlay-root .rcStateIcon{
      width:33px; height:33px; flex:0 0 auto; display:block;
    }
    #rc-overlay-root .rcName{
      font-size:32px; font-weight:900;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0;
    }
    #rc-overlay-root .rcState{
      margin-left:auto; font-size:18px; font-weight:800;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:55%;
    }
    #rc-overlay-root .rcRowTime{
      background:rgba(67,76,94,.95); border-radius:20px;
      display:flex; align-items:center; justify-content:center;
      font-size:42px; font-weight:950;
    }

    /* Live pulse dot */
    @keyframes rc-pulse {
      0%,100% { opacity:1; } 50% { opacity:.4; }
    }
    #rc-overlay-root .rcLiveDot{
      display:inline-block; width:8px; height:8px; border-radius:50%;
      background:#a3be8c; margin-right:6px;
      animation: rc-pulse 2s ease-in-out infinite;
      vertical-align:middle;
    }
  `;
  document.head.appendChild(style);

  /* ===============================
     DOM
  =============================== */

  const root = document.createElement("div");
  root.id = "rc-overlay-root";

  // Inject seasonal icon if today is a holiday
  const seasonalHTML = HOLIDAY && HOLIDAY_SVGS[HOLIDAY]
    ? `<div class="rcSeasonal">${HOLIDAY_SVGS[HOLIDAY]}</div>`
    : "";

  root.innerHTML = `
    <div class="rcHeader" id="rc-header">
      <img class="rcLogoImg" src="${LOGO_SRC}" alt="Brite" />
      <div class="rcHeaderTitle">Network Operations Call Queue Dashboard</div>
      <div class="rcHeaderSynced" id="rc-synced"><span class="rcLiveDot"></span>Waiting for data…</div>
    </div>

    <div class="rcBelieve">BELIEVE</div>
    ${seasonalHTML}

    <div class="rcWrap">
      <div class="rcLeftCol">

        <section class="rcCard">
          <div class="rcCardHd">Agent State Counter</div>
          <div class="rcCardBd">
            <div class="rcTiles4">
              ${tile("Available",   "—", "Ready",          "rc-tile-available")}
              ${tile("Unavailable", "—", "Support / Break", "rc-tile-unavailable")}
              ${tile("Inbound",     "—", "In call",         "rc-tile-inbound")}
              ${tile("Outbound",    "—", "Calling out",     "rc-tile-outbound")}
            </div>
          </div>
        </section>

        <section class="rcCard">
          <div class="rcCardHd">Calls Waiting in Queue</div>
          <div class="rcCardBd">
            <div class="rcQueueBox" id="rc-queue-box">Live data coming soon</div>
          </div>
        </section>

        <section class="rcCard">
          <div class="rcCardHd">Callback Requests</div>
          <div class="rcCardBd">
            <div class="rcTiles4">
              ${tile("Total",      "—", "Today")}
              ${tile("In Queue",   "—", "Waiting")}
              ${tile("Successful", "—", "Completed")}
              ${tile("Failed",     "—", "Errors")}
            </div>
          </div>
        </section>

      </div>

      <section class="rcCard rcTeamCard">
        <div class="rcCardHd">Team Members</div>
        <div class="rcTeamBody">
          <div class="rcRows" id="rc-team-rows">
            <div style="color:#a7b0c0;text-align:center;padding:40px 0;font-weight:700;">
              Waiting for agent data…
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  document.body.appendChild(root);

  // April Fools: flip the logo upside down
  if (HOLIDAY === "aprilfools") {
    const logo = root.querySelector(".rcLogoImg");
    if (logo) logo.classList.add("rcFlipped");
  }

  /* ===============================
     HELPERS
  =============================== */

  function tile(label, value, sub, id) {
    const idAttr = id ? ` id="${id}"` : "";
    return `
      <div class="rcTile"${idAttr}>
        <div class="rcTileLabel">${esc(label)}</div>
        <div class="rcTileValue">${esc(value)}</div>
        <div class="rcTileSub">${esc(sub)}</div>
      </div>`;
  }

  function esc(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function fmtDuration(seconds) {
    const s = Math.max(0, Math.round(seconds));
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }

  function getStateMeta(entry) {
    const meta = STATE_META[entry.CurrentState] ?? STATE_META[0];
    let label = meta.label;
    if (entry.CurrentState === 2 && entry.OutstateDescription) {
      label = `Unavailable: ${entry.OutstateDescription}`;
    }
    return { icon: meta.icon, label, color: meta.color };
  }

  /* ===============================
     RENDER TEAM
  =============================== */

  function renderTeam() {
    const container = document.getElementById("rc-team-rows");
    if (!container) return;

    const agents = [...agentMap.values()]
      .filter(a => !a.LoggedOff && a.CurrentState !== 0 && !HIDDEN_AGENTS.has(a.AgentName))
      .sort((a, b) => a.AgentName.localeCompare(b.AgentName));

    if (agents.length === 0) {
      container.innerHTML = `
        <div style="color:#a7b0c0;text-align:center;padding:40px 0;font-weight:700;">
          No active agents
        </div>`;
      return;
    }

    container.innerHTML = agents.map(agent => {
      const { icon, label, color } = getStateMeta(agent);
      const time = fmtDuration(agent.Duration);
      return `
        <div class="rcRow">
          <div class="rcRowMain">
            ${icon}
            <div class="rcName">${esc(agent.AgentName)}</div>
            <div class="rcState" style="color:${color}">${esc(label)}</div>
          </div>
          <div class="rcRowTime">${esc(time)}</div>
        </div>`;
    }).join("");

    renderStateTiles(agents);
    setTimeout(updateScrollAnimation, 100);
  }

  /* ===============================
     RENDER STATE COUNTER TILES
  =============================== */

  function renderStateTiles(agents) {
    const counts = { available: 0, unavailable: 0, inbound: 0, outbound: 0 };
    for (const a of agents) {
      if      (a.CurrentState === 1) counts.available++;
      else if (a.CurrentState === 2) counts.unavailable++;
      else if (a.CurrentState === 3) counts.inbound++;
      else if (a.CurrentState === 4) counts.outbound++;
    }
    setTileValue("rc-tile-available",   counts.available);
    setTileValue("rc-tile-unavailable", counts.unavailable);
    setTileValue("rc-tile-inbound",     counts.inbound);
    setTileValue("rc-tile-outbound",    counts.outbound);
  }

  function setTileValue(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    el.querySelector(".rcTileValue").textContent = String(val);
  }

  /* ===============================
     PROCESS AGENT DATA
  =============================== */


  function processCallbackPayload(data) {
    const entries = data.CallBackEntries || data.callBackEntries;
    if (!data || !Array.isArray(entries)) return;
    renderCallbacks(entries);
  }

  function renderCallbacks(entries) {
    // State descriptions from NICE callback data
    const active   = entries.filter(e => e.StateDescription !== "EndContact");
    const ended    = entries.filter(e => e.StateDescription === "EndContact");
    // We'll just show counts for now — expand later
    // (placeholder until we have more state data)
  }
  function processContactPayload(data) {
    // NICE uses lowercase contactEntries
    const entries = data.contactEntries || data.ContactEntries;
    if (!data || !Array.isArray(entries)) return;
    for (const entry of entries) {
      const id = entry.ContactID ?? entry.ContactId;
      if (id == null) continue;
      const existing = contactMap.get(id) || {};
      const merged = { ...existing, ...entry };
      // Remove contacts that are no longer in queue (state not 10)
      if (merged.CurrentContactState !== 10) {
        contactMap.delete(id);
      } else {
        contactMap.set(id, merged);
      }
    }
    renderQueue();
  }

  function renderQueue() {
    const el = document.getElementById("rc-queue-box");
    if (!el) return;

    // Waiting = no agent assigned and state 10
    const waiting = [...contactMap.values()].filter(
      c => c.AgentNo === 0 && c.CurrentContactState === 10
    );

    if (waiting.length === 0) {
      el.innerHTML = `<span style="color:#a3be8c;font-size:64px;font-weight:950;line-height:1">0</span>`;
      return;
    }

    // Longest wait from StartDate
    const now = Date.now();
    const longestMs = Math.max(...waiting.map(c => {
      const ms = parseNiceDate(c.StartDate);
      return ms ? now - ms : 0;
    }));
    const longestSec = Math.round(longestMs / 1000);
    const m = Math.floor(longestSec / 60);
    const s = String(longestSec % 60).padStart(2, "0");

    el.innerHTML = `
      <div style="text-align:center;line-height:1.2">
        <div style="font-size:80px;font-weight:950;color:#bf616a;line-height:1">${waiting.length}</div>
        <div style="font-size:16px;font-weight:700;color:#a7b0c0;margin-top:6px;letter-spacing:.08em;text-transform:uppercase">Waiting</div>
        <div style="font-size:22px;font-weight:800;color:#ebcb8b;margin-top:8px">Longest: ${m}:${s}</div>
      </div>`;
  }

  // Parse NICE's /Date(ms-offset)/ format to a JS timestamp
  function parseNiceDate(val) {
    if (!val) return null;
    const m = String(val).match(/Date\(([-\d]+)/);
    return m ? parseInt(m[1], 10) : null;
  }

  function processAgentPayload(data) {
    if (!data || !Array.isArray(data.agentEntries)) return;

    for (const entry of data.agentEntries) {
      if (entry.AgentNo == null) continue;
      const existing = agentMap.get(entry.AgentNo) || {};
      const merged = { ...existing, ...entry };

      // Always prefer StartDate for duration accuracy — covers both
      // auto-refresh (where Duration resets to 0) and normal delta updates
      if (entry.StartDate) {
        const startMs = parseNiceDate(entry.StartDate);
        if (startMs && startMs > 0) {
          const calculated = Math.round((Date.now() - startMs) / 1000);
          // Only use calculated if it's greater than what NICE reports,
          // to avoid negative/wrong values from clock skew
          if (calculated > 0) {
            merged.Duration = calculated;
          }
        }
      }

      agentMap.set(entry.AgentNo, merged);
    }
    renderTeam();
    updateSynced();
  }

  /* ===============================
     XHR INTERCEPTOR
  =============================== */

  const AGENT_ENDPOINT = "GetAllAgentEntryList";
  const CONTACT_ENDPOINT = "GetContactQueueEntryList";
  const CALLBACK_ENDPOINT = "GetCallBackEntryList";
  const OrigXHR = window.XMLHttpRequest;

  function PatchedXHR() {
    const xhr = new OrigXHR();
    let _url = "";

    const origOpen = xhr.open.bind(xhr);
    xhr.open = function(method, url, ...rest) {
      _url = url || "";
      return origOpen(method, url, ...rest);
    };

    xhr.addEventListener("load", function() {
      try {
        const data = JSON.parse(xhr.responseText);
        if (_url.includes(AGENT_ENDPOINT)) processAgentPayload(data);
        if (_url.includes(CONTACT_ENDPOINT)) processContactPayload(data);
        if (_url.includes(CALLBACK_ENDPOINT)) processCallbackPayload(data);
      } catch (e) { /* ignore */ }
    });

    return xhr;
  }

  Object.setPrototypeOf(PatchedXHR, OrigXHR);
  PatchedXHR.prototype = OrigXHR.prototype;
  window.XMLHttpRequest = PatchedXHR;

  const origFetch = window.fetch.bind(window);
  window.fetch = async function(input, init) {
    const url = typeof input === "string" ? input : input?.url || "";
    const res = await origFetch(input, init);
    if (url.includes(AGENT_ENDPOINT)) res.clone().json().then(processAgentPayload).catch(() => {});
    if (url.includes(CONTACT_ENDPOINT)) res.clone().json().then(processContactPayload).catch(() => {});
    if (url.includes(CALLBACK_ENDPOINT)) res.clone().json().then(processCallbackPayload).catch(() => {});
    return res;
  };

  /* ===============================
     SYNCED TIMESTAMP
  =============================== */

  function updateSynced() {
    const t = new Date().toLocaleTimeString([], {
      hour: "numeric", minute: "2-digit", second: "2-digit",
    });
    const el = document.getElementById("rc-synced");
    if (el) el.innerHTML = `<span class="rcLiveDot"></span>Synced: ${t}`;
  }

  /* ===============================
     HEADER HEIGHT VAR
  =============================== */

  function setHeaderHeightVar() {
    const header = document.getElementById("rc-header");
    if (!header) return;
    const h = Math.ceil(header.getBoundingClientRect().height);
    root.style.setProperty("--rc-header-h", `${h}px`);
  }

  setHeaderHeightVar();
  window.addEventListener("resize", setHeaderHeightVar);

  // Render queue immediately and keep refreshing every 5s
  // so it shows 0 when NICE sends no contact deltas
  setTimeout(renderQueue, 500);
  setInterval(renderQueue, 5000);

  /* ===============================
     AUTO-SCROLL TEAM LIST
     CSS animation on the row container — only applied when content overflows
  =============================== */

  function updateScrollAnimation() {
    const body = document.querySelector("#rc-overlay-root .rcTeamBody");
    const rows = document.getElementById("rc-team-rows");
    if (!body || !rows) return;

    const overflow = rows.scrollHeight - body.clientHeight;
    if (overflow <= 0) {
      rows.style.animation = "none";
      rows.style.removeProperty("--rc-scroll-dist");
      return;
    }

    // Set exact pixel distance to scroll — no blank space overshoot
    rows.style.setProperty("--rc-scroll-dist", `-${overflow}px`);

    // Duration: slow crawl, ~2px/sec
    const duration = Math.round(overflow / 2);
    rows.style.animation = `rc-team-scroll ${duration}s linear infinite`;
  }

})();
