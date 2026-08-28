// ====================== DATA ======================
const DEFAULT_FETISHES = [
  { id: 1, name: "Bare dirty soles and feet", short: "dirty feet", ironic: "Keep your own bare feet on the cold floor the entire time.", search: "dirty bare feet soles" },
  { id: 2, name: "Soft, heavy belly rolls", short: "belly rolls", ironic: "Poke and squeeze your own stomach while you stare.", search: "soft belly rolls bbw" },
  { id: 3, name: "Thick, hairy armpits", short: "hairy armpits", ironic: "Keep one of your own armpits exposed and unwashed for the session.", search: "hairy armpits" },
  { id: 4, name: "Long spit and drool trails", short: "spit & drool", ironic: "Let real spit run down your chin whenever instructed.", search: "spit drool fetish" },
  { id: 5, name: "Underwear waistbands stretched tight into fat", short: "stretched waistbands", ironic: "Wear underwear one size too small for the rest of the day.", search: "tight underwear waistband fat" },
  { id: 6, name: "Double chin and soft folded neck", short: "double chin", ironic: "Keep your chin pressed down against your neck while staring.", search: "double chin soft neck" },
  { id: 7, name: "Veiny hands and thick forearms", short: "veiny hands", ironic: "Flex your own hands and forearms until the veins pop.", search: "veiny hands forearms" },
  { id: 8, name: "Fresh sweaty socks", short: "sweaty socks", ironic: "Wear the same socks all day after the session.", search: "sweaty dirty socks" },
  { id: 9, name: "Large soft ass with deep panty lines", short: "soft ass & panty lines", ironic: "Sit on your hands so you feel your own ass the whole time.", search: "panty lines soft ass" },
  { id: 10, name: "Dense body hair (chest + stomach)", short: "body hair", ironic: "Run your fingers through your own body hair while looking.", search: "dense body hair chest stomach" },
  { id: 11, name: "Messy cum-covered face", short: "cum face", ironic: "Rub any precum or spit on your own face at the end.", search: "cum covered face" },
  { id: 12, name: "Clothes cutting tightly into soft flesh", short: "tight cutting clothes", ironic: "Put on something deliberately too tight before starting.", search: "tight clothes cutting into fat" },
  { id: 13, name: "Heavy armpit sweat stains", short: "sweat stains", ironic: "Don’t use deodorant today.", search: "armpit sweat stains" },
  { id: 14, name: "Chubby fingers and soft palms", short: "chubby fingers", ironic: "Suck on your own fingers during the pure stares.", search: "chubby fingers soft hands" },
  { id: 15, name: "Thick thighs rubbing together", short: "thick thighs", ironic: "Keep your thighs pressed tightly together the entire session.", search: "thick thighs rubbing" },
  { id: 16, name: "Open-mouth dumb panting face", short: "dumb panting face", ironic: "Keep your own mouth open and breathing heavily while you stare.", search: "open mouth dumb face ahegao" },
  { id: 17, name: "Used, stained, smelly panties", short: "stained panties", ironic: "Sniff your own underwear before and after.", search: "used stained panties" },
  { id: 18, name: "Fat folds spread and inspected", short: "spread fat folds", ironic: "Spread and inspect one of your own soft folds while looking.", search: "spread fat folds belly" },
  { id: 19, name: "Soft male chest / moobs", short: "soft moobs", ironic: "Squeeze your own chest whenever the timer hits zero.", search: "soft male chest moobs" },
  { id: 20, name: "Blank drooling vacant expression", short: "vacant drooling face", ironic: "Let your face go completely slack and drool for real.", search: "drooling vacant face" },
  { id: 21, name: "Soft belly hanging out of clothes", short: "hanging belly", ironic: "Pull your shirt up and leave your own belly exposed.", search: "hanging soft belly" },
  { id: 22, name: "Hairy legs in short shorts", short: "hairy legs", ironic: "Wear the shortest shorts you own for the contamination period.", search: "hairy legs short shorts" },
  { id: 23, name: "Wet spit-slick skin", short: "spit-slick skin", ironic: "Spit on your own chest or thighs and leave it.", search: "spit on skin" },
  { id: 24, name: "Hands sinking deep into fat", short: "hands in fat", ironic: "Dig your own hands into any soft part of your body.", search: "hands sinking into fat" },
  { id: 25, name: "Full sensory focus (look + smell + imagined taste)", short: "full sensory", ironic: "Inhale deeply through your nose every time you look.", search: "fetish sensory closeup" }
];

const METER_LABELS = [
  { max: 10, text: "Still clean…" },
  { max: 25, text: "Getting stained…" },
  { max: 45, text: "Properly marked…" },
  { max: 65, text: "Mind getting fucked…" },
  { max: 85, text: "Deeply corrupted…" },
  { max: 100, text: "Completely broken toy" }
];

// ====================== STATE ======================
let state = {
  corruption: 0,
  activeFetish: null,
  currentStage: 1,
  fails: 0,
  lastRating: 0,
  customFetishes: []
};

let settings = {
  showImages: true,
  timerScale: 1,
  brutalMult: 1,
  gainMult: 1
};

let currentTimer = null;

function load() {
  try {
    const saved = localStorage.getItem("corruptionProtocol");
    if (saved) state = { ...state, ...JSON.parse(saved) };
    const s = localStorage.getItem("corruptionSettings");
    if (s) settings = { ...settings, ...JSON.parse(s) };
  } catch (e) { console.warn(e); }
  updateMeter();
  applySettingsUI();
}

function save() {
  localStorage.setItem("corruptionProtocol", JSON.stringify(state));
  localStorage.setItem("corruptionSettings", JSON.stringify(settings));
  updateMeter();
}

function getAllFetishes() {
  return [...DEFAULT_FETISHES, ...(state.customFetishes || [])];
}

function updateMeter() {
  const fill = document.getElementById("meterFill");
  const percent = document.getElementById("meterPercent");
  const label = document.getElementById("meterLabel");
  const status = document.getElementById("statusLine");
  if (!fill) return;
  fill.style.width = (state.corruption || 0) + "%";
  percent.textContent = (state.corruption || 0) + "%";
  const lab = METER_LABELS.find(l => state.corruption <= l.max) || METER_LABELS[METER_LABELS.length - 1];
  label.textContent = lab.text;
  status.textContent = state.activeFetish
    ? `Active: ${state.activeFetish.short} — Stage ${state.currentStage}/6`
    : "No active corruption track";
}

// ====================== IMAGE HELPERS (working) ======================
function createImageArea(fetish) {
  if (!settings.showImages) return document.createElement("div");

  const wrap = document.createElement("div");
  wrap.className = "image-area";

  const img = document.createElement("img");
  img.style.display = "none";
  img.alt = fetish.short || "trigger";

  const controls = document.createElement("div");
  controls.className = "image-controls";

  // Open search button (most reliable method)
  const searchBtn = document.createElement("button");
  searchBtn.textContent = "Open trigger images";
  searchBtn.onclick = () => {
    const q = encodeURIComponent(fetish.search || fetish.short || fetish.name);
    window.open(`https://www.google.com/search?tbm=isch&q=${q}`, "_blank");
  };

  // Manual URL paste
  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.placeholder = "Paste image URL here";
  urlInput.onkeydown = (e) => {
    if (e.key === "Enter") {
      const url = urlInput.value.trim();
      if (url) {
        img.src = url;
        img.style.display = "block";
        img.onerror = () => { img.style.display = "none"; alert("Could not load that image"); };
      }
    }
  };

  const loadBtn = document.createElement("button");
  loadBtn.textContent = "Load";
  loadBtn.onclick = () => {
    const url = urlInput.value.trim();
    if (url) {
      img.src = url;
      img.style.display = "block";
      img.onerror = () => { img.style.display = "none"; alert("Could not load that image"); };
    }
  };

  controls.appendChild(searchBtn);
  controls.appendChild(urlInput);
  controls.appendChild(loadBtn);

  wrap.appendChild(img);
  wrap.appendChild(controls);
  return wrap;
}

// ====================== UI ======================
const screen = document.getElementById("screen");

function clearScreen() {
  if (currentTimer) {
    clearInterval(currentTimer);
    currentTimer = null;
  }
  screen.innerHTML = "";
}

function card(html) {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = html;
  screen.appendChild(div);
  return div;
}

function btn(text, onClick, secondary = false) {
  const b = document.createElement("button");
  b.textContent = text;
  if (secondary) b.classList.add("secondary");
  b.onclick = onClick;
  return b;
}

function scaleTime(base) {
  return Math.max(5, Math.round(base * (settings.timerScale || 1)));
}

// ====================== FLOW ======================
function start() {
  load();
  if (state.activeFetish) showContinueOrNew();
  else showWelcome();
}

function showWelcome() {
  clearScreen();
  card(`
    <h1>Corruption Protocol</h1>
    <p class="big-text">You don’t choose what gets wired into you.<br>The system does.</p>
    <p>Random fetish • Placement test • Six stages • Brutal adaptation • Private contamination.</p>
    <p><strong>Images:</strong> Use the “Open trigger images” button during sessions (opens Google image search). You can also paste any direct image URL.</p>
  `);
  const row = document.createElement("div");
  row.className = "btn-row";
  row.appendChild(btn("Begin / Roll New Fetish", rollNewFetish));
  screen.appendChild(row);
}

function showContinueOrNew() {
  clearScreen();
  card(`
    <h2>Active Track</h2>
    <div class="fetish-name">${state.activeFetish.name}</div>
    <div class="stage-badge">Stage ${state.currentStage} / 6</div>
    <p>Fails so far: <strong>${state.fails}</strong></p>
  `);
  const row = document.createElement("div");
  row.className = "btn-row";
  row.appendChild(btn(`Continue Stage ${state.currentStage}`, () => startSession(state.currentStage)));
  row.appendChild(btn("Abandon & Roll New", () => {
    if (confirm("Abandon this fetish? Progress will be lost.")) {
      state.activeFetish = null;
      state.currentStage = 1;
      state.fails = 0;
      save();
      rollNewFetish();
    }
  }, true));
  screen.appendChild(row);
}

function rollNewFetish() {
  const available = getAllFetishes();
  const pick = available[Math.floor(Math.random() * available.length)];
  state.activeFetish = pick;
  state.currentStage = 1;
  state.fails = 0;
  save();
  runPlacementTest(pick);
}

function runPlacementTest(fetish) {
  clearScreen();
  const c = card(`
    <h2>Placement Test</h2>
    <div class="fetish-name">${fetish.name}</div>
    <p>We need to know how much this already owns you.</p>
  `);
  c.appendChild(createImageArea(fetish));

  let step = 0;
  const ratings = [];

  function next() {
    step++;
    if (step === 1) {
      clearScreen();
      const cardEl = card(`
        <h2>Test 1 / 3</h2>
        <p class="big-text">Look at the trigger for ${scaleTime(20)} seconds.<br>No touching.</p>
        <div class="timer" id="t">${scaleTime(20)}</div>
      `);
      cardEl.appendChild(createImageArea(fetish));
      countdown(scaleTime(20), () => askRating("How strong was the physical response? (0–10)"));
    } else if (step === 2) {
      clearScreen();
      const cardEl = card(`
        <h2>Test 2 / 3</h2>
        <p class="big-text">Look again for ${scaleTime(40)} seconds.<br>Still no touching.</p>
        <div class="timer" id="t">${scaleTime(40)}</div>
        <p class="instruction">${fetish.ironic}</p>
      `);
      cardEl.appendChild(createImageArea(fetish));
      countdown(scaleTime(40), () => askRating("Response strength this time?"));
    } else if (step === 3) {
      clearScreen();
      const cardEl = card(`
        <h2>Final Placement Stare</h2>
        <p class="big-text">${scaleTime(60)} seconds pure looking.</p>
        <div class="timer" id="t">${scaleTime(60)}</div>
      `);
      cardEl.appendChild(createImageArea(fetish));
      countdown(scaleTime(60), () => askRating("Final pure response?"));
    } else {
      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      let stage = 1;
      if (avg >= 8) stage = 4;
      else if (avg >= 6) stage = 3;
      else if (avg >= 4) stage = 2;
      state.currentStage = stage;
      save();
      clearScreen();
      card(`
        <h2>Placement Result</h2>
        <div class="fetish-name">${fetish.name}</div>
        <p>Average: <strong>${avg.toFixed(1)}/10</strong></p>
        <p class="big-text">Placed at <span style="color:var(--accent)">Stage ${stage}</span></p>
      `);
      const row = document.createElement("div");
      row.className = "btn-row";
      row.appendChild(btn(`Commit & Start Stage ${stage}`, () => startSession(stage)));
      row.appendChild(btn("Re-roll", () => {
        state.activeFetish = null;
        save();
        rollNewFetish();
      }, true));
      screen.appendChild(row);
    }
  }

  function askRating(q) {
    clearScreen();
    card(`<h2>${q}</h2>`);
    const row = document.createElement("div");
    row.className = "rating-row";
    for (let i = 0; i <= 10; i++) {
      const b = document.createElement("button");
      b.className = "rating-btn";
      b.textContent = i;
      b.onclick = () => { ratings.push(i); next(); };
      row.appendChild(b);
    }
    screen.appendChild(row);
  }

  next();
}

function startSession(stage) {
  const fetish = state.activeFetish;
  const brutalMod = Math.min(state.fails * 8 * (settings.brutalMult || 1), 50);
  clearScreen();
  const c = card(`
    <div class="stage-badge">Stage ${stage} / 6 — Brutal +${Math.round(brutalMod)}s</div>
    <div class="fetish-name">${fetish.name}</div>
    <p class="instruction">${fetish.ironic}</p>
  `);
  c.appendChild(createImageArea(fetish));
  const row = document.createElement("div");
  row.className = "btn-row";
  row.appendChild(btn("I’m ready. Begin.", () => runStage(stage, brutalMod)));
  screen.appendChild(row);
}

function runStage(stage, brutalMod) {
  const fetish = state.activeFetish;
  const holdTime = scaleTime([25, 50, 90, 120, 180, 240][stage - 1] + brutalMod);
  const edgesNeeded = Math.min(2 + stage + Math.floor(state.fails / 2), 8);

  clearScreen();
  const c1 = card(`
    <h2>Phase 1 — Pairing</h2>
    <p class="big-text">Look at the trigger while you touch yourself slowly. No edge yet.</p>
    <div class="timer" id="t">${scaleTime(90)}</div>
    <p class="instruction">${getDegradingLine(stage, fetish)}</p>
  `);
  c1.appendChild(createImageArea(fetish));
  countdown(scaleTime(90), phase2);

  function phase2() {
    clearScreen();
    card(`<h2>Phase 2 — Forced Edges</h2>
      <p>Take <strong>${edgesNeeded}</strong> edges. On each edge freeze and stare 15 s.</p>`);
    let edgesDone = 0;
    function doEdge() {
      edgesDone++;
      if (edgesDone > edgesNeeded) { pureTest(); return; }
      clearScreen();
      const ce = card(`
        <h2>Edge ${edgesDone} / ${edgesNeeded}</h2>
        <p class="big-text">Stroke to the edge, then stop and stare.</p>
        <div class="timer" id="t">15</div>
        <p class="instruction">${getDegradingLine(stage, fetish)}</p>
      `);
      ce.appendChild(createImageArea(fetish));
      const row = document.createElement("div");
      row.className = "btn-row";
      row.appendChild(btn("I’m at the edge — start stare", () => countdown(15, doEdge)));
      screen.appendChild(row);
    }
    doEdge();
  }

  function pureTest() {
    clearScreen();
    const cp = card(`
      <h2>Pure Trigger Test</h2>
      <p class="big-text">Hands off. Only looking for <strong>${holdTime} s</strong>.</p>
      <div class="timer" id="t">${holdTime}</div>
      <p class="instruction">${fetish.ironic}</p>
      <p class="warning">If you touch, the test fails.</p>
    `);
    cp.appendChild(createImageArea(fetish));
    countdown(holdTime, () => {
      clearScreen();
      card(`<h2>Rate your pure response</h2>
        <p>0 = nothing • 10 = hard / leaking / drooling / mind blank</p>`);
      const row = document.createElement("div");
      row.className = "rating-row";
      for (let i = 0; i <= 10; i++) {
        const b = document.createElement("button");
        b.className = "rating-btn";
        b.textContent = i;
        b.onclick = () => finishStage(i, stage);
        row.appendChild(b);
      }
      screen.appendChild(row);
    });
  }
}

function finishStage(rating, stage) {
  state.lastRating = rating;
  const passed = rating >= 7;
  if (passed) {
    const gain = Math.round((3 + stage) * (settings.gainMult || 1));
    state.corruption = Math.min(100, state.corruption + gain);
    if (stage < 6) {
      state.currentStage = stage + 1;
      state.fails = Math.max(0, state.fails - 1);
    } else {
      state.activeFetish = null;
      state.currentStage = 1;
      state.fails = 0;
      state.corruption = Math.min(100, state.corruption + Math.round(8 * (settings.gainMult || 1)));
    }
    save();
    clearScreen();
    card(`
      <h2 style="color:var(--success)">Stage Passed</h2>
      <p class="big-text">Response ${rating}/10</p>
      <p>Corruption +${gain}</p>
      ${stage === 6 ? "<p>Full track completed.</p>" : `<p>Next: Stage ${stage + 1}</p>`}
    `);
    giveContamination(stage, true);
  } else {
    state.fails++;
    save();
    clearScreen();
    card(`
      <h2 style="color:var(--danger)">Failed</h2>
      <p class="big-text">Only ${rating}/10</p>
      <p>Next attempt will be harder.</p>
    `);
    giveContamination(stage, false);
  }
}

function giveContamination(stage, success) {
  const fetish = state.activeFetish || { short: "the last thing", ironic: "Think about it." };
  const rules = [
    `Set your phone wallpaper to something related to ${fetish.short} (change only when alone).`,
    `Before sleep, stare at the trigger 60 s while repeating “This is getting into me.”`,
    `Every time you notice anything related to ${fetish.short} today, pause 5 seconds.`,
    fetish.ironic,
    success ? `Softer contamination this time. Still mandatory.` : `Extra for failure: leave a tab open with the trigger until tomorrow.`
  ];
  const chosen = rules.sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(stage / 2));
  card(`
    <h2>Private Contamination Orders</h2>
    <ul style="padding-left:20px;margin:12px 0">
      ${chosen.map(r => `<li style="margin-bottom:8px">${r}</li>`).join("")}
    </ul>
  `);
  const row = document.createElement("div");
  row.className = "btn-row";
  row.appendChild(btn("I accept the orders", () => {
    if (state.activeFetish) showContinueOrNew();
    else showWelcome();
  }));
  screen.appendChild(row);
}

function countdown(seconds, cb) {
  const el = document.getElementById("t");
  if (!el) { cb(); return; }
  let left = seconds;
  el.textContent = left;
  if (currentTimer) clearInterval(currentTimer);
  currentTimer = setInterval(() => {
    left--;
    el.textContent = left;
    if (left <= 0) {
      clearInterval(currentTimer);
      currentTimer = null;
      cb();
    }
  }, 1000);
}

function getDegradingLine(stage, fetish) {
  const lines = [
    `Look at that ${fetish.short}. This is what gets you now.`,
    `Your cock is learning. Don’t fight it.`,
    `Weak little mind. So easy to stain with ${fetish.short}.`,
    `Imagine how pathetic you’ll look when this is permanent.`,
    `Stage ${stage} is already changing how you see it.`,
    `Drool for it. That’s an order.`,
    `You’re going to get hard from this in public one day and you’ll deserve it.`,
    `The protocol is patient. You will break.`
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

// Settings
function applySettingsUI() {
  const el = (id) => document.getElementById(id);
  if (el("setImages")) el("setImages").checked = settings.showImages;
  if (el("setTimerScale")) el("setTimerScale").value = settings.timerScale;
  if (el("setBrutal")) el("setBrutal").value = settings.brutalMult;
  if (el("setGain")) el("setGain").value = settings.gainMult;
}

document.getElementById("settingsBtn").onclick = () => {
  document.getElementById("settingsOverlay").classList.remove("hidden");
  applySettingsUI();
};

document.getElementById("closeSettings").onclick = () => {
  settings.showImages = document.getElementById("setImages").checked;
  settings.timerScale = parseFloat(document.getElementById("setTimerScale").value);
  settings.brutalMult = parseFloat(document.getElementById("setBrutal").value);
  settings.gainMult = parseFloat(document.getElementById("setGain").value);
  save();
  document.getElementById("settingsOverlay").classList.add("hidden");
};

document.getElementById("addCustomBtn").onclick = () => {
  const name = document.getElementById("customName").value.trim();
  const short = document.getElementById("customShort").value.trim();
  const ironic = document.getElementById("customIronic").value.trim() || "Focus on it.";
  const search = document.getElementById("customSearch").value.trim() || short;
  if (!name || !short) return alert("Name and short name required");
  state.customFetishes = state.customFetishes || [];
  state.customFetishes.push({ id: Date.now(), name, short, ironic, search });
  save();
  ["customName","customShort","customIronic","customSearch"].forEach(id => document.getElementById(id).value = "");
  alert("Custom fetish added.");
};

document.getElementById("resetBtn").onclick = () => {
  if (confirm("Erase all progress?")) {
    localStorage.removeItem("corruptionProtocol");
    state = { corruption: 0, activeFetish: null, currentStage: 1, fails: 0, lastRating: 0, customFetishes: [] };
    save();
    showWelcome();
  }
};

start();
