// ====================== DATA ======================
const FETISHES = [
  { id: 1, name: "Bare dirty soles and feet", short: "dirty feet", ironic: "Keep your own bare feet on the cold floor the entire time." },
  { id: 2, name: "Soft, heavy belly rolls", short: "belly rolls", ironic: "Poke and squeeze your own stomach while you stare." },
  { id: 3, name: "Thick, hairy armpits", short: "hairy armpits", ironic: "Keep one of your own armpits exposed and unwashed for the session." },
  { id: 4, name: "Long spit and drool trails", short: "spit & drool", ironic: "Let real spit run down your chin whenever instructed." },
  { id: 5, name: "Underwear waistbands stretched tight into fat", short: "stretched waistbands", ironic: "Wear underwear one size too small for the rest of the day." },
  { id: 6, name: "Double chin and soft folded neck", short: "double chin", ironic: "Keep your chin pressed down against your neck while staring." },
  { id: 7, name: "Veiny hands and thick forearms", short: "veiny hands", ironic: "Flex your own hands and forearms until the veins pop." },
  { id: 8, name: "Fresh sweaty socks", short: "sweaty socks", ironic: "Wear the same socks all day after the session." },
  { id: 9, name: "Large soft ass with deep panty lines", short: "soft ass & panty lines", ironic: "Sit on your hands so you feel your own ass the whole time." },
  { id: 10, name: "Dense body hair (chest + stomach)", short: "body hair", ironic: "Run your fingers through your own body hair while looking." },
  { id: 11, name: "Messy cum-covered face", short: "cum face", ironic: "Rub any precum or spit on your own face at the end." },
  { id: 12, name: "Clothes cutting tightly into soft flesh", short: "tight cutting clothes", ironic: "Put on something deliberately too tight before starting." },
  { id: 13, name: "Heavy armpit sweat stains", short: "sweat stains", ironic: "Don’t use deodorant today." },
  { id: 14, name: "Chubby fingers and soft palms", short: "chubby fingers", ironic: "Suck on your own fingers during the pure stares." },
  { id: 15, name: "Thick thighs rubbing together", short: "thick thighs", ironic: "Keep your thighs pressed tightly together the entire session." },
  { id: 16, name: "Open-mouth dumb panting face", short: "dumb panting face", ironic: "Keep your own mouth open and breathing heavily while you stare." },
  { id: 17, name: "Used, stained, smelly panties", short: "stained panties", ironic: "Sniff your own underwear before and after." },
  { id: 18, name: "Fat folds spread and inspected", short: "spread fat folds", ironic: "Spread and inspect one of your own soft folds while looking." },
  { id: 19, name: "Soft male chest / moobs", short: "soft moobs", ironic: "Squeeze your own chest whenever the timer hits zero." },
  { id: 20, name: "Blank drooling vacant expression", short: "vacant drooling face", ironic: "Let your face go completely slack and drool for real." },
  { id: 21, name: "Soft belly hanging out of clothes", short: "hanging belly", ironic: "Pull your shirt up and leave your own belly exposed." },
  { id: 22, name: "Hairy legs in short shorts", short: "hairy legs", ironic: "Wear the shortest shorts you own for the contamination period." },
  { id: 23, name: "Wet spit-slick skin", short: "spit-slick skin", ironic: "Spit on your own chest or thighs and leave it." },
  { id: 24, name: "Hands sinking deep into fat", short: "hands in fat", ironic: "Dig your own hands into any soft part of your body." },
  { id: 25, name: "Full sensory focus (look + smell + imagined taste)", short: "full sensory", ironic: "Inhale deeply through your nose every time you look." }
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
  activeFetish: null,      // full fetish object
  currentStage: 1,
  fails: 0,                // brutal adaptive
  lastRating: 0,
  sessionLog: []
};

function load() {
  const saved = localStorage.getItem("corruptionProtocol");
  if (saved) state = JSON.parse(saved);
  updateMeter();
}

function save() {
  localStorage.setItem("corruptionProtocol", JSON.stringify(state));
  updateMeter();
}

function updateMeter() {
  const fill = document.getElementById("meterFill");
  const percent = document.getElementById("meterPercent");
  const label = document.getElementById("meterLabel");
  const status = document.getElementById("statusLine");

  fill.style.width = state.corruption + "%";
  percent.textContent = state.corruption + "%";

  const lab = METER_LABELS.find(l => state.corruption <= l.max) || METER_LABELS[METER_LABELS.length - 1];
  label.textContent = lab.text;

  if (state.activeFetish) {
    status.textContent = `Active: ${state.activeFetish.short} — Stage ${state.currentStage}/6`;
  } else {
    status.textContent = "No active corruption track";
  }
}

// ====================== UI HELPERS ======================
const screen = document.getElementById("screen");

function clearScreen() {
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

// ====================== MAIN FLOW ======================
function start() {
  load();
  if (state.activeFetish) {
    showContinueOrNew();
  } else {
    showWelcome();
  }
}

function showWelcome() {
  clearScreen();
  card(`
    <h1>Corruption Protocol</h1>
    <p class="big-text">You don’t choose what gets wired into you.<br>The system does.</p>
    <p>Random fetish. Placement test. Six stages of escalating filth. Brutal adaptation. Private daily contamination.</p>
    <p>By the end of a track you will get hard or drool just from looking.</p>
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
    <p>Fails on this fetish so far: <strong>${state.fails}</strong> (brutal mode is watching)</p>
  `);
  const row = document.createElement("div");
  row.className = "btn-row";
  row.appendChild(btn(`Continue Stage ${state.currentStage}`, () => startSession(state.currentStage)));
  row.appendChild(btn("Abandon & Roll New", () => {
    if (confirm("Really abandon this fetish? Progress on it will be lost.")) {
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
  const available = FETISHES.filter(f => true); // could exclude completed later
  const pick = available[Math.floor(Math.random() * available.length)];
  state.activeFetish = pick;
  state.currentStage = 1;
  state.fails = 0;
  save();
  runPlacementTest(pick);
}

// ====================== PLACEMENT TEST ======================
function runPlacementTest(fetish) {
  clearScreen();
  card(`
    <h2>Placement Test</h2>
    <div class="fetish-name">${fetish.name}</div>
    <p>We need to know how much this already owns you.</p>
    <p class="instruction">Open a private search or image tab with this fetish right now. Keep it ready.</p>
  `);

  let step = 0;
  const ratings = [];

  function next() {
    step++;
    if (step === 1) {
      clearScreen();
      card(`
        <h2>Test 1 / 3</h2>
        <p class="big-text">Look at the trigger for 20 seconds.<br>No touching.</p>
        <div class="timer" id="t">20</div>
        <p>Just look. Notice what happens in your body.</p>
      `);
      countdown(20, () => {
        askRating("How strong was the physical response? (0 = nothing, 10 = throbbing / drooling)");
      });
    } else if (step === 2) {
      clearScreen();
      card(`
        <h2>Test 2 / 3</h2>
        <p class="big-text">Now look again for 40 seconds.<br>Still no touching.</p>
        <div class="timer" id="t">40</div>
        <p class="instruction">${fetish.ironic}</p>
      `);
      countdown(40, () => {
        askRating("Response strength this time?");
      });
    } else if (step === 3) {
      clearScreen();
      card(`
        <h2>Final Placement Stare</h2>
        <p class="big-text">One more. 60 seconds pure looking.<br>Let it try to work on you.</p>
        <div class="timer" id="t">60</div>
      `);
      countdown(60, () => {
        askRating("Final pure response?");
      });
    } else {
      // calculate placement
      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      let stage = 1;
      if (avg >= 8) stage = 4;
      else if (avg >= 6) stage = 3;
      else if (avg >= 4) stage = 2;
      else stage = 1;

      state.currentStage = stage;
      save();

      clearScreen();
      card(`
        <h2>Placement Result</h2>
        <div class="fetish-name">${fetish.name}</div>
        <p>Average response: <strong>${avg.toFixed(1)}/10</strong></p>
        <p class="big-text">You are placed at <span style="color:var(--accent)">Stage ${stage}</span></p>
        <p>Stage 6 is the most depraved version of this fetish.</p>
      `);
      const row = document.createElement("div");
      row.className = "btn-row";
      row.appendChild(btn(`Commit & Start Stage ${stage}`, () => startSession(stage)));
      row.appendChild(btn("Re-roll (coward)", () => {
        state.activeFetish = null;
        save();
        rollNewFetish();
      }, true));
      screen.appendChild(row);
    }
  }

  function askRating(question) {
    clearScreen();
    card(`<h2>${question}</h2>`);
    const row = document.createElement("div");
    row.className = "rating-row";
    for (let i = 0; i <= 10; i++) {
      const b = document.createElement("button");
      b.className = "rating-btn";
      b.textContent = i;
      b.onclick = () => {
        ratings.push(i);
        next();
      };
      row.appendChild(b);
    }
    screen.appendChild(row);
  }

  next();
}

// ====================== SESSION ENGINE ======================
function startSession(stage) {
  const fetish = state.activeFetish;
  const brutalMod = Math.min(state.fails * 8, 40); // extra seconds / edges

  clearScreen();
  card(`
    <div class="stage-badge">Stage ${stage} / 6 — Brutal modifier +${brutalMod}s</div>
    <div class="fetish-name">${fetish.name}</div>
    <p class="instruction">${fetish.ironic}</p>
    <p>Session length target: 20–45 min. Follow every instruction. No skipping.</p>
  `);

  const row = document.createElement("div");
  row.className = "btn-row";
  row.appendChild(btn("I’m ready. Begin.", () => runStage(stage, brutalMod)));
  screen.appendChild(row);
}

function runStage(stage, brutalMod) {
  const fetish = state.activeFetish;
  const holdTime = [25, 50, 90, 120, 180, 240][stage - 1] + brutalMod;
  const edgesNeeded = Math.min(2 + stage + Math.floor(state.fails / 2), 8);

  // Phase 1 – Warm pairing
  clearScreen();
  card(`
    <h2>Phase 1 — Pairing</h2>
    <p class="big-text">Look at the trigger while you touch yourself slowly.</p>
    <p>Do not edge yet. Just get warm while staring.</p>
    <div class="timer" id="t">90</div>
    <p class="instruction">Filthy reminder: ${getDegradingLine(stage, fetish)}</p>
  `);
  countdown(90, () => phase2());

  function phase2() {
    clearScreen();
    card(`
      <h2>Phase 2 — Forced Edges</h2>
      <p>You will take <strong>${edgesNeeded}</strong> edges while the trigger stays visible.</p>
      <p>On each edge, freeze and stare hard for 15 seconds before continuing.</p>
      <div class="timer" id="t">—</div>
    `);
    let edgesDone = 0;
    function doEdge() {
      edgesDone++;
      if (edgesDone > edgesNeeded) {
        pureTest();
        return;
      }
      clearScreen();
      card(`
        <h2>Edge ${edgesDone} / ${edgesNeeded}</h2>
        <p class="big-text">Stroke to the edge. When you reach it, stop completely and stare.</p>
        <div class="timer" id="t">15</div>
        <p class="instruction">${getDegradingLine(stage, fetish)}</p>
      `);
      // User controls the edge, then we force the stare
      const row = document.createElement("div");
      row.className = "btn-row";
      row.appendChild(btn("I’m at the edge — start stare", () => {
        countdown(15, doEdge);
      }));
      screen.appendChild(row);
    }
    doEdge();
  }

  function pureTest() {
    clearScreen();
    card(`
      <h2>Pure Trigger Test</h2>
      <p class="big-text">Hands off. Only looking.</p>
      <p>Hold for <strong>${holdTime} seconds</strong>. Let it work.</p>
      <div class="timer" id="t">${holdTime}</div>
      <p class="instruction">${fetish.ironic}</p>
      <p class="warning">If you touch, the test fails.</p>
    `);
    countdown(holdTime, () => {
      clearScreen();
      card(`<h2>Rate your pure response</h2>
        <p>0 = nothing happened<br>10 = hard, leaking, drooling, or mind blank</p>`);
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
    // success
    const gain = 3 + stage; // corruption points
    state.corruption = Math.min(100, state.corruption + gain);
    if (stage < 6) {
      state.currentStage = stage + 1;
      state.fails = Math.max(0, state.fails - 1);
    } else {
      // completed full track
      state.activeFetish = null;
      state.currentStage = 1;
      state.fails = 0;
      state.corruption = Math.min(100, state.corruption + 8);
    }
    save();

    clearScreen();
    card(`
      <h2 style="color:var(--success)">Stage Passed</h2>
      <p class="big-text">Response ${rating}/10 — accepted.</p>
      <p>Corruption increased.</p>
      ${stage === 6 ? "<p>Full fetish track completed. You are more broken now.</p>" : `<p>Next stage unlocked: ${stage + 1}</p>`}
    `);
    giveContamination(stage, true);
  } else {
    // fail — brutal
    state.fails++;
    save();
    clearScreen();
    card(`
      <h2 style="color:var(--danger)">Failed</h2>
      <p class="big-text">Only ${rating}/10. Not good enough.</p>
      <p>Brutal engine notes your resistance. Next attempt will be harder.</p>
    `);
    giveContamination(stage, false);
  }
}

function giveContamination(stage, success) {
  const fetish = state.activeFetish || { short: "the last thing", ironic: "Think about it." };
  const rules = [
    `Set your phone wallpaper to something that reminds you of ${fetish.short} (change it back only when alone).`,
    `Before sleep tonight, stare at the trigger for 60 seconds while repeating: "This is getting into me."`,
    `Every time you notice anything related to ${fetish.short} today, pause for 5 seconds and feel it.`,
    fetish.ironic,
    success
      ? `You earned a slightly softer contamination. Still private. Still mandatory.`
      : `Extra punishment for failure: leave a browser tab open with the trigger in a hidden window until tomorrow.`
  ];

  const chosen = rules.sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(stage / 2));

  const div = card(`
    <h2>Private Contamination Orders</h2>
    <p>These stay between you and the protocol. Do not get caught.</p>
    <ul style="padding-left:20px; margin:12px 0;">
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

// ====================== HELPERS ======================
function countdown(seconds, cb) {
  const el = document.getElementById("t");
  let left = seconds;
  el.textContent = left;
  const iv = setInterval(() => {
    left--;
    el.textContent = left;
    if (left <= 0) {
      clearInterval(iv);
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

// Reset
document.getElementById("resetBtn").onclick = () => {
  if (confirm("This will erase all corruption and progress. Sure?")) {
    localStorage.removeItem("corruptionProtocol");
    state = { corruption: 0, activeFetish: null, currentStage: 1, fails: 0, lastRating: 0, sessionLog: [] };
    save();
    showWelcome();
  }
};

// Boot
start();
