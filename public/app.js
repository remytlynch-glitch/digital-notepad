const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const ELEMENT_ROWS = [
  [1,'H','Hydrogen','1.008',1,1,'nonmetal'],[2,'He','Helium','4.0026',1,18,'noble'],
  [3,'Li','Lithium','6.94',2,1,'alkali'],[4,'Be','Beryllium','9.0122',2,2,'alkaline'],[5,'B','Boron','10.81',2,13,'metalloid'],[6,'C','Carbon','12.011',2,14,'nonmetal'],[7,'N','Nitrogen','14.007',2,15,'nonmetal'],[8,'O','Oxygen','15.999',2,16,'nonmetal'],[9,'F','Fluorine','18.998',2,17,'halogen'],[10,'Ne','Neon','20.180',2,18,'noble'],
  [11,'Na','Sodium','22.990',3,1,'alkali'],[12,'Mg','Magnesium','24.305',3,2,'alkaline'],[13,'Al','Aluminum','26.982',3,13,'post-transition'],[14,'Si','Silicon','28.085',3,14,'metalloid'],[15,'P','Phosphorus','30.974',3,15,'nonmetal'],[16,'S','Sulfur','32.06',3,16,'nonmetal'],[17,'Cl','Chlorine','35.45',3,17,'halogen'],[18,'Ar','Argon','39.948',3,18,'noble'],
  [19,'K','Potassium','39.098',4,1,'alkali'],[20,'Ca','Calcium','40.078',4,2,'alkaline'],[21,'Sc','Scandium','44.956',4,3,'transition'],[22,'Ti','Titanium','47.867',4,4,'transition'],[23,'V','Vanadium','50.942',4,5,'transition'],[24,'Cr','Chromium','51.996',4,6,'transition'],[25,'Mn','Manganese','54.938',4,7,'transition'],[26,'Fe','Iron','55.845',4,8,'transition'],[27,'Co','Cobalt','58.933',4,9,'transition'],[28,'Ni','Nickel','58.693',4,10,'transition'],[29,'Cu','Copper','63.546',4,11,'transition'],[30,'Zn','Zinc','65.38',4,12,'transition'],[31,'Ga','Gallium','69.723',4,13,'post-transition'],[32,'Ge','Germanium','72.630',4,14,'metalloid'],[33,'As','Arsenic','74.922',4,15,'metalloid'],[34,'Se','Selenium','78.971',4,16,'nonmetal'],[35,'Br','Bromine','79.904',4,17,'halogen'],[36,'Kr','Krypton','83.798',4,18,'noble'],
  [37,'Rb','Rubidium','85.468',5,1,'alkali'],[38,'Sr','Strontium','87.62',5,2,'alkaline'],[39,'Y','Yttrium','88.906',5,3,'transition'],[40,'Zr','Zirconium','91.224',5,4,'transition'],[41,'Nb','Niobium','92.906',5,5,'transition'],[42,'Mo','Molybdenum','95.95',5,6,'transition'],[43,'Tc','Technetium','(98)',5,7,'transition'],[44,'Ru','Ruthenium','101.07',5,8,'transition'],[45,'Rh','Rhodium','102.91',5,9,'transition'],[46,'Pd','Palladium','106.42',5,10,'transition'],[47,'Ag','Silver','107.87',5,11,'transition'],[48,'Cd','Cadmium','112.41',5,12,'transition'],[49,'In','Indium','114.82',5,13,'post-transition'],[50,'Sn','Tin','118.71',5,14,'post-transition'],[51,'Sb','Antimony','121.76',5,15,'metalloid'],[52,'Te','Tellurium','127.60',5,16,'metalloid'],[53,'I','Iodine','126.90',5,17,'halogen'],[54,'Xe','Xenon','131.29',5,18,'noble'],
  [55,'Cs','Cesium','132.91',6,1,'alkali'],[56,'Ba','Barium','137.33',6,2,'alkaline'],[57,'La','Lanthanum','138.91',6,3,'lanthanide'],[72,'Hf','Hafnium','178.49',6,4,'transition'],[73,'Ta','Tantalum','180.95',6,5,'transition'],[74,'W','Tungsten','183.84',6,6,'transition'],[75,'Re','Rhenium','186.21',6,7,'transition'],[76,'Os','Osmium','190.23',6,8,'transition'],[77,'Ir','Iridium','192.22',6,9,'transition'],[78,'Pt','Platinum','195.08',6,10,'transition'],[79,'Au','Gold','196.97',6,11,'transition'],[80,'Hg','Mercury','200.59',6,12,'transition'],[81,'Tl','Thallium','204.38',6,13,'post-transition'],[82,'Pb','Lead','207.2',6,14,'post-transition'],[83,'Bi','Bismuth','208.98',6,15,'post-transition'],[84,'Po','Polonium','(209)',6,16,'post-transition'],[85,'At','Astatine','(210)',6,17,'halogen'],[86,'Rn','Radon','(222)',6,18,'noble'],
  [87,'Fr','Francium','(223)',7,1,'alkali'],[88,'Ra','Radium','(226)',7,2,'alkaline'],[89,'Ac','Actinium','(227)',7,3,'actinide'],[104,'Rf','Rutherfordium','(267)',7,4,'transition'],[105,'Db','Dubnium','(268)',7,5,'transition'],[106,'Sg','Seaborgium','(269)',7,6,'transition'],[107,'Bh','Bohrium','(270)',7,7,'transition'],[108,'Hs','Hassium','(269)',7,8,'transition'],[109,'Mt','Meitnerium','(277)',7,9,'transition'],[110,'Ds','Darmstadtium','(281)',7,10,'transition'],[111,'Rg','Roentgenium','(282)',7,11,'transition'],[112,'Cn','Copernicium','(285)',7,12,'transition'],[113,'Nh','Nihonium','(286)',7,13,'post-transition'],[114,'Fl','Flerovium','(290)',7,14,'post-transition'],[115,'Mc','Moscovium','(290)',7,15,'post-transition'],[116,'Lv','Livermorium','(293)',7,16,'post-transition'],[117,'Ts','Tennessine','(294)',7,17,'halogen'],[118,'Og','Oganesson','(294)',7,18,'noble'],
  [58,'Ce','Cerium','140.12',8,4,'lanthanide'],[59,'Pr','Praseodymium','140.91',8,5,'lanthanide'],[60,'Nd','Neodymium','144.24',8,6,'lanthanide'],[61,'Pm','Promethium','(145)',8,7,'lanthanide'],[62,'Sm','Samarium','150.36',8,8,'lanthanide'],[63,'Eu','Europium','151.96',8,9,'lanthanide'],[64,'Gd','Gadolinium','157.25',8,10,'lanthanide'],[65,'Tb','Terbium','158.93',8,11,'lanthanide'],[66,'Dy','Dysprosium','162.50',8,12,'lanthanide'],[67,'Ho','Holmium','164.93',8,13,'lanthanide'],[68,'Er','Erbium','167.26',8,14,'lanthanide'],[69,'Tm','Thulium','168.93',8,15,'lanthanide'],[70,'Yb','Ytterbium','173.05',8,16,'lanthanide'],[71,'Lu','Lutetium','174.97',8,17,'lanthanide'],
  [90,'Th','Thorium','232.04',9,4,'actinide'],[91,'Pa','Protactinium','231.04',9,5,'actinide'],[92,'U','Uranium','238.03',9,6,'actinide'],[93,'Np','Neptunium','(237)',9,7,'actinide'],[94,'Pu','Plutonium','(244)',9,8,'actinide'],[95,'Am','Americium','(243)',9,9,'actinide'],[96,'Cm','Curium','(247)',9,10,'actinide'],[97,'Bk','Berkelium','(247)',9,11,'actinide'],[98,'Cf','Californium','(251)',9,12,'actinide'],[99,'Es','Einsteinium','(252)',9,13,'actinide'],[100,'Fm','Fermium','(257)',9,14,'actinide'],[101,'Md','Mendelevium','(258)',9,15,'actinide'],[102,'No','Nobelium','(259)',9,16,'actinide'],[103,'Lr','Lawrencium','(266)',9,17,'actinide']
];

const ELEMENTS = ELEMENT_ROWS.map(([number, symbol, name, mass, period, group, category]) => ({ number, symbol, name, mass, period, group, category }));

// Common ion charges, most common first, as printed on a high-school periodic table.
// Noble gases, carbon, silicon and the superheavy elements have none listed.
const ELEMENT_CHARGES = Object.fromEntries(`H:1+ 1− Li:1+ Be:2+ B:3+ N:3− O:2− F:1− Na:1+ Mg:2+ Al:3+ P:3− S:2− Cl:1− K:1+ Ca:2+
Sc:3+ Ti:4+ 3+ V:5+ 4+ Cr:3+ 2+ Mn:2+ 4+ Fe:3+ 2+ Co:2+ 3+ Ni:2+ 3+ Cu:2+ 1+ Zn:2+ Ga:3+ Ge:4+ As:3− Se:2− Br:1−
Rb:1+ Sr:2+ Y:3+ Zr:4+ Nb:5+ 3+ Mo:6+ Tc:7+ Ru:3+ 4+ Rh:3+ Pd:2+ 4+ Ag:1+ Cd:2+ In:3+ Sn:4+ 2+ Sb:3+ 5+ Te:2− I:1−
Cs:1+ Ba:2+ La:3+ Hf:4+ Ta:5+ W:6+ Re:7+ Os:4+ Ir:4+ Pt:4+ 2+ Au:3+ 1+ Hg:2+ 1+ Tl:1+ 3+ Pb:2+ 4+ Bi:3+ 5+ Po:2+ 4+ At:1−
Fr:1+ Ra:2+ Ac:3+ Ce:3+ 4+ Pr:3+ Nd:3+ Pm:3+ Sm:3+ 2+ Eu:3+ 2+ Gd:3+ Tb:3+ Dy:3+ Ho:3+ Er:3+ Tm:3+ Yb:3+ 2+ Lu:3+
Th:4+ Pa:5+ U:6+ 4+ Np:5+ Pu:4+ 6+ Am:3+ Cm:3+ Bk:3+ Cf:3+ Es:3+ Fm:3+ Md:3+ No:2+ Lr:3+`
  .split(/\s+(?=[A-Z][a-z]?:)/).map(pair => pair.trim().split(':')).map(([symbol, charges]) => [symbol, charges.split(' ')]));

const IONS = [
  ['Al','3+','Aluminum'],['NH4','1+','Ammonium'],['Ba','2+','Barium'],['Ca','2+','Calcium'],['Cr','2+','Chromium(II)'],['Cr','3+','Chromium(III)'],['Cu','1+','Copper(I)'],['Cu','2+','Copper(II)'],['H','1+','Hydrogen'],['H3O','1+','Hydronium'],['Fe','2+','Iron(II)'],['Fe','3+','Iron(III)'],['Li','1+','Lithium'],['Mg','2+','Magnesium'],['Mn','2+','Manganese(II)'],['Mn','4+','Manganese(IV)'],['Hg2','2+','Mercury(I)'],['Hg','2+','Mercury(II)'],['K','1+','Potassium'],['Ag','1+','Silver'],['Na','1+','Sodium'],['Sn','2+','Tin(II)'],['Sn','4+','Tin(IV)'],['Zn','2+','Zinc'],
  ['Br','1−','Bromide'],['Cl','1−','Chloride'],['F','1−','Fluoride'],['I','1−','Iodide'],['O','2−','Oxide'],['S','2−','Sulfide'],
  ['OH','1−','Hydroxide'],['CN','1−','Cyanide'],['NO3','1−','Nitrate'],['NO2','1−','Nitrite'],['ClO','1−','Hypochlorite'],['ClO2','1−','Chlorite'],['ClO3','1−','Chlorate'],['ClO4','1−','Perchlorate'],['C2H3O2','1−','Acetate'],['HCO3','1−','Hydrogen carbonate / bicarbonate'],['HSO4','1−','Hydrogen sulfate / bisulfate'],['HSO3','1−','Hydrogen sulfite / bisulfite'],['MnO4','1−','Permanganate'],['SCN','1−','Thiocyanate'],['OCN','1−','Cyanate'],
  ['CO3','2−','Carbonate'],['SO4','2−','Sulfate'],['SO3','2−','Sulfite'],['CrO4','2−','Chromate'],['Cr2O7','2−','Dichromate'],['C2O4','2−','Oxalate'],['O2','2−','Peroxide'],['S2O3','2−','Thiosulfate'],['HPO4','2−','Hydrogen phosphate'],
  ['PO4','3−','Phosphate'],['PO3','3−','Phosphite'],['BO3','3−','Borate'],['AsO4','3−','Arsenate']
].map(([formula, charge, name]) => ({ formula, charge, name }));

const UNITS = {
  kg: ['mass', 1, 'kg'], g: ['mass', 1e-3, 'g'], mg: ['mass', 1e-6, 'mg'], ug: ['mass', 1e-9, 'µg'], 'µg': ['mass', 1e-9, 'µg'], lb: ['mass', .45359237, 'lb'], lbs: ['mass', .45359237, 'lb'], oz: ['mass', .028349523125, 'oz'],
  m: ['length', 1, 'm'], cm: ['length', .01, 'cm'], mm: ['length', .001, 'mm'], km: ['length', 1000, 'km'], nm: ['length', 1e-9, 'nm'], in: ['length', .0254, 'in'], ft: ['length', .3048, 'ft'],
  l: ['volume', 1, 'L'], ml: ['volume', .001, 'mL'], ul: ['volume', 1e-6, 'µL'], 'µl': ['volume', 1e-6, 'µL'], 'cm3': ['volume', .001, 'cm³'], gal: ['volume', 3.785411784, 'gal'], qt: ['volume', .946352946, 'qt'], cup: ['volume', .2365882365, 'cup'], tbsp: ['volume', .0147867648, 'tbsp'], tsp: ['volume', .00492892159, 'tsp'],
  s: ['time', 1, 's'], sec: ['time', 1, 's'], min: ['time', 60, 'min'], h: ['time', 3600, 'h'], hr: ['time', 3600, 'h'], day: ['time', 86400, 'day'],
  mol: ['amount', 1, 'mol'], mmol: ['amount', .001, 'mmol'], umol: ['amount', 1e-6, 'µmol'], 'µmol': ['amount', 1e-6, 'µmol'],
  pa: ['pressure', 1, 'Pa'], kpa: ['pressure', 1000, 'kPa'], atm: ['pressure', 101325, 'atm'], bar: ['pressure', 100000, 'bar'], torr: ['pressure', 133.322368, 'torr'], mmhg: ['pressure', 133.322368, 'mmHg'], psi: ['pressure', 6894.757293, 'psi'],
  j: ['energy', 1, 'J'], kj: ['energy', 1000, 'kJ'], cal: ['energy', 4.184, 'cal'], kcal: ['energy', 4184, 'kcal'],
  m: ['length', 1, 'm'], M: ['concentration', 1, 'M'], mmolar: ['concentration', .001, 'mM'], umolar: ['concentration', 1e-6, 'µM']
};

const STORAGE_KEY = 'bench-chemistry-v1';
const REFERENCE_STORAGE_KEY = 'bench-reference-collapsed-v1';
const DRAFT_STORAGE_KEY = 'bench-notebook-draft-v1';
const WORK_STEPS_STORAGE_KEY = 'bench-work-steps-v1';
const CALCULATOR_STORAGE_KEY = 'bench-calculator-v1';
const CALCULATOR_POSITION_KEY = 'bench-calculator-position-v1';
const HIGHLIGHT_STORAGE_KEY = 'bench-highlight-color-v1';
const CLOUD_SESSION_STORAGE_KEY = 'bench-cloud-session-v1';
const CLOUD_API_URL = 'https://bvtthncjnycyvdkjvcxa.supabase.co/rest/v1/chemistry_cloud_pages';
const CLOUD_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2dHRobmNqbnljeXZka2p2Y3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MjE0OTksImV4cCI6MjA5ODA5NzQ5OX0.iWkaiGvJoYAteCGlT-Us3CegShfdWBAnw-DkpxKuHdM';
const START_PARAMS = new URLSearchParams(location.search);
const state = {
  entries: loadEntries(),
  workSteps: loadWorkSteps(),
  // null = the editor holds the latest step; a number = it holds that earlier step.
  activeStep: null,
  editingEntryId: null,
  activeReference: 'elements',
  highlightColor: loadHighlightColor(),
  selectedElement: ELEMENTS.find(e => e.symbol === 'C'),
  referenceCollapsed: START_PARAMS.get('panel') === 'closed' || loadReferenceCollapsed()
};
const input = $('#command-input');
// While an earlier step is open in the editor, the latest step waits here.
let parkedDraftHTML = '';
const results = $('#results');
let toastTimer;
let draftTimer;
let cloudTimer;
let cloudSession = loadCloudSession();
let cloudSyncing = false;
let savedEditorRange;
let confirmationResolve = null;

function finishConfirmation(confirmed) {
  if (!confirmationResolve) return;
  const resolve = confirmationResolve;
  confirmationResolve = null;
  $('#confirm-dialog').close();
  resolve(confirmed);
}

function confirmAction({ eyebrow = 'Notebook action', title, body, confirmLabel = 'Confirm', cancelLabel = 'Keep it' }) {
  if (confirmationResolve) finishConfirmation(false);
  $('#confirm-dialog-eyebrow').textContent = eyebrow;
  $('#confirm-dialog-title').textContent = title;
  $('#confirm-dialog-copy').textContent = body;
  $('#confirm-dialog-action').textContent = confirmLabel;
  $('#confirm-dialog-cancel').textContent = cancelLabel;
  $('#confirm-dialog').showModal();
  $('#confirm-dialog-cancel').focus();
  return new Promise(resolve => { confirmationResolve = resolve; });
}

$('#confirm-dialog-cancel').addEventListener('click', () => finishConfirmation(false));
$('#confirm-dialog-action').addEventListener('click', () => finishConfirmation(true));
$('#confirm-dialog').addEventListener('cancel', event => { event.preventDefault(); finishConfirmation(false); });
$('#confirm-dialog').addEventListener('click', event => { if (event.target === event.currentTarget) finishConfirmation(false); });

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[char]);
}

function formatFormulaHTML(formula) {
  let clean = escapeHTML(formula.trim()).replace(/\((aq|s|l|g)\)$/i, '<small>($1)</small>');
  clean = clean.replace(/\^?(\d*)([+−-])$/g, (_, n, sign) => `<sup>${n || ''}${sign === '-' ? '−' : sign}</sup>`);
  return clean.replace(/([A-Za-z)\]])(\d+)/g, '$1<sub>$2</sub>');
}

function loadEntries() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function loadCloudSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(CLOUD_SESSION_STORAGE_KEY));
    return saved?.id && saved?.key ? saved : null;
  } catch { return null; }
}

function saveCloudSession(session) {
  cloudSession = session;
  try { localStorage.setItem(CLOUD_SESSION_STORAGE_KEY, JSON.stringify(session)); } catch {}
}

function randomCloudKey() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

async function sha256Hex(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function cloudHeaders(includeJson = false) {
  if (!cloudSession?.key) return {};
  return {
    apikey: CLOUD_ANON_KEY,
    Authorization: `Bearer ${CLOUD_ANON_KEY}`,
    'X-Bench-Key': cloudSession.key,
    ...(includeJson ? { 'Content-Type': 'application/json' } : {})
  };
}

function cloudPayload() {
  return {
    notebook_html: draftHTML(),
    work_steps: state.workSteps.slice(-30),
    entries: state.entries.slice(0, 50),
    updated_at: new Date().toISOString()
  };
}

function hasCloudContent() {
  return Boolean(getEditorText() || state.workSteps.length || state.entries.length);
}

function cloudSyncCode() {
  return cloudSession?.id && cloudSession?.key ? `${cloudSession.id}.${cloudSession.key}` : '';
}

function setCloudStatus(message) {
  const status = $('#draft-status');
  if (!status) return;
  if (!closestAtCaret('.live-denominator')) status.textContent = message;
}

function queueCloudSave() {
  if (cloudSyncing) return;
  clearTimeout(cloudTimer);
  cloudTimer = setTimeout(() => syncCloudSave(), 500);
}

async function syncCloudSave() {
  if (cloudSyncing) return;
  cloudSyncing = true;
  try {
    if (!cloudSession) saveCloudSession({ key: randomCloudKey() });
    const payload = cloudPayload();
    let response;
    if (cloudSession.id) {
      response = await fetch(`${CLOUD_API_URL}?id=eq.${encodeURIComponent(cloudSession.id)}`, {
        method: 'PATCH', headers: { ...cloudHeaders(true), Prefer: 'return=minimal' }, body: JSON.stringify(payload)
      });
    } else {
      payload.key_hash = await sha256Hex(cloudSession.key);
      response = await fetch(CLOUD_API_URL, {
        method: 'POST', headers: { ...cloudHeaders(true), Prefer: 'return=representation' }, body: JSON.stringify(payload)
      });
      if (response.ok) {
        const [page] = await response.json();
        if (page?.id) saveCloudSession({ ...cloudSession, id: page.id });
      }
    }
    if (!response.ok) throw new Error('cloud save failed');
    setCloudStatus('Saved online');
    updateCloudDialog();
  } catch {
    setCloudStatus('Offline - saved on this device');
  } finally {
    cloudSyncing = false;
  }
}

function applyCloudPage(page) {
  state.activeStep = null;
  parkedDraftHTML = '';
  input.innerHTML = sanitizeNotebookHTML(page.notebook_html || '');
  state.workSteps = Array.isArray(page.work_steps) ? page.work_steps.filter(step => step && typeof step.html === 'string').slice(-30) : [];
  state.entries = Array.isArray(page.entries) ? page.entries.slice(0, 50) : [];
  saveWorkSteps();
  saveEntries();
  saveDraftNow();
  renderWorkSteps();
  renderResults();
  renderSavedWork();
  inferMode(getEditorText());
}

async function loadCloudPage(showError = false) {
  if (!cloudSession?.id) return false;
  try {
    const response = await fetch(`${CLOUD_API_URL}?id=eq.${encodeURIComponent(cloudSession.id)}&select=notebook_html,work_steps,entries,updated_at`, { headers: cloudHeaders() });
    if (!response.ok) throw new Error('cloud load failed');
    const [page] = await response.json();
    if (!page) throw new Error('cloud notebook not found');
    applyCloudPage(page);
    setCloudStatus('Saved online');
    updateCloudDialog();
    return true;
  } catch {
    if (showError) showToast('That sync code could not open a notepad');
    setCloudStatus('Offline - saved on this device');
    return false;
  }
}

function updateCloudDialog() {
  const code = cloudSyncCode();
  const field = $('#cloud-sync-code');
  const status = $('#cloud-sync-status');
  if (!field || !status) return;
  field.value = code;
  status.textContent = code ? 'This notebook saves online. Use this one private code to open it on your phone or another computer.' : 'Preparing your private cloud notebook…';
}

async function restoreCloudFromCode() {
  const raw = $('#cloud-restore-code').value.trim();
  const match = raw.match(/^([0-9a-f-]{36})\.([A-Za-z0-9_-]{32,})$/i);
  if (!match) return showToast('Paste the complete sync code');
  const previous = cloudSession;
  saveCloudSession({ id: match[1], key: match[2] });
  const loaded = await loadCloudPage(true);
  if (!loaded) {
    if (previous) saveCloudSession(previous);
    else { cloudSession = null; localStorage.removeItem(CLOUD_SESSION_STORAGE_KEY); }
    return;
  }
  $('#cloud-restore-code').value = '';
  $('#cloud-sync-dialog').close();
  showToast('Your notepad is open');
}

function loadWorkSteps() {
  try {
    const steps = JSON.parse(localStorage.getItem(WORK_STEPS_STORAGE_KEY));
    return Array.isArray(steps) ? steps.filter(step => step && typeof step.html === 'string').slice(-30) : [];
  } catch { return []; }
}

function loadHighlightColor() {
  try { return localStorage.getItem(HIGHLIGHT_STORAGE_KEY) || 'yellow'; }
  catch { return 'yellow'; }
}

function restoreCalculator() {
  try {
    const saved = JSON.parse(localStorage.getItem(CALCULATOR_STORAGE_KEY));
    if (!saved?.expression) return;
    $('#calculator-input').value = saved.expression;
    setCalculatorResult(saved.result ? `= ${saved.result}` : 'Ready', false, saved.result?.replaceAll(',', '') || '');
  } catch {}
}

function setCalculatorResult(message, isError = false, value = '') {
  const output = $('#calculator-result');
  output.textContent = message;
  output.classList.toggle('is-error', isError);
  output.dataset.value = value;
  output.title = value ? 'Copy this answer' : '';
}

async function copyValue(value, message) {
  try { await navigator.clipboard.writeText(value); showToast(message); }
  catch { showToast('Copy was blocked by the browser'); }
}

// The page is served under a strict Content-Security-Policy with no 'unsafe-eval',
// so Function() and eval() are blocked. Arithmetic is parsed here instead.
function evaluateArithmetic(text) {
  let index = 0;
  const peek = () => { while (text[index] === ' ') index += 1; return text[index]; };

  const parsePrimary = () => {
    if (peek() === '(') {
      index += 1;
      const value = parseSum();
      if (peek() !== ')') throw new Error('missing closing bracket');
      index += 1;
      return value;
    }
    const number = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/.exec(text.slice(index));
    if (!number) throw new Error('number expected');
    index += number[0].length;
    return Number(number[0]);
  };

  const parseSigned = () => {
    const character = peek();
    if (character === '-') { index += 1; return -parseSigned(); }
    if (character === '+') { index += 1; return parseSigned(); }
    return parsePrimary();
  };

  const parsePower = () => {
    const base = parseSigned();
    if (peek() === '^') { index += 1; return base ** parsePower(); }
    return base;
  };

  const parseProduct = () => {
    let value = parsePower();
    for (;;) {
      const character = peek();
      if (character === '*') { index += 1; value *= parsePower(); }
      else if (character === '/') { index += 1; value /= parsePower(); }
      else return value;
    }
  };

  function parseSum() {
    let value = parseProduct();
    for (;;) {
      const character = peek();
      if (character === '+') { index += 1; value += parseProduct(); }
      else if (character === '-') { index += 1; value -= parseProduct(); }
      else return value;
    }
  }

  const result = parseSum();
  if (peek() !== undefined) throw new Error('unexpected input');
  return result;
}

function calculateExpression() {
  const raw = $('#calculator-input').value.trim();
  if (!raw) return setCalculatorResult('Enter an expression');
  const normalized = raw.replaceAll(',', '').replaceAll('\\*', '*').replace(/[×]/g, '*').replace(/[÷]/g, '/');
  if (!/^[0-9eE+\-*/().\s^]+$/.test(normalized)) return setCalculatorResult('Numbers and + − * / ( ) only', true);
  try {
    const result = evaluateArithmetic(normalized);
    if (!Number.isFinite(result)) throw new Error('not finite');
    const formatted = formatNumber(result);
    setCalculatorResult(`= ${formatted}`, false, formatted.replaceAll(',', ''));
    localStorage.setItem(CALCULATOR_STORAGE_KEY, JSON.stringify({ expression: raw, result: formatted }));
  } catch {
    setCalculatorResult('Check that expression', true);
  }
}

function clearCalculator() {
  $('#calculator-input').value = '';
  setCalculatorResult('Ready');
  try { localStorage.removeItem(CALCULATOR_STORAGE_KEY); } catch {}
  $('#calculator-input').focus();
}

// The calculator stays open while you work, so it can be dragged out of the way by its heading.
function placeCalculator(left, top) {
  const popover = $('#calculator-popover');
  const { width } = popover.getBoundingClientRect();
  popover.classList.add('is-floating');
  popover.style.left = `${Math.round(Math.min(Math.max(left, 0), innerWidth - width))}px`;
  popover.style.top = `${Math.round(Math.min(Math.max(top, 0), innerHeight - 48))}px`;
}

function restoreCalculatorPosition() {
  try {
    const saved = JSON.parse(localStorage.getItem(CALCULATOR_POSITION_KEY));
    if (Number.isFinite(saved?.left) && Number.isFinite(saved?.top)) return placeCalculator(saved.left, saved.top);
  } catch {}
  // First open on desktop: sit bottom-right of the notepad, clear of the element tile in the reference shelf.
  if (!matchMedia('(min-width: 821px)').matches) return;
  const { width, height } = $('#calculator-popover').getBoundingClientRect();
  placeCalculator($('.reference-panel').getBoundingClientRect().left - width - 16, innerHeight - height - 16);
}

function startCalculatorDrag(event) {
  if (event.button !== 0 || event.target.closest('button')) return;
  const heading = event.currentTarget;
  const rect = $('#calculator-popover').getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  event.preventDefault();
  heading.setPointerCapture(event.pointerId);
  const move = moveEvent => placeCalculator(moveEvent.clientX - offsetX, moveEvent.clientY - offsetY);
  const end = () => {
    heading.removeEventListener('pointermove', move);
    heading.removeEventListener('pointerup', end);
    heading.removeEventListener('pointercancel', end);
    const placed = $('#calculator-popover').getBoundingClientRect();
    try { localStorage.setItem(CALCULATOR_POSITION_KEY, JSON.stringify({ left: placed.left, top: placed.top })); } catch {}
  };
  heading.addEventListener('pointermove', move);
  heading.addEventListener('pointerup', end);
  heading.addEventListener('pointercancel', end);
}

function setCalculatorOpen(open) {
  const popover = $('#calculator-popover');
  popover.hidden = !open;
  if (open) restoreCalculatorPosition();
  $('#calculator-toggle').setAttribute('aria-expanded', String(open));
  if (open) requestAnimationFrame(() => $('#calculator-input').focus());
}

function toggleCalculator() {
  setCalculatorOpen($('#calculator-popover').hidden);
}

function insertCalculatorValue(value) {
  const field = $('#calculator-input');
  const start = field.selectionStart ?? field.value.length;
  const end = field.selectionEnd ?? field.value.length;
  field.value = `${field.value.slice(0, start)}${value}${field.value.slice(end)}`;
  field.setSelectionRange(start + value.length, start + value.length);
  field.focus();
}

function backspaceCalculator() {
  const field = $('#calculator-input');
  const start = field.selectionStart ?? field.value.length;
  const end = field.selectionEnd ?? field.value.length;
  if (start !== end) field.value = `${field.value.slice(0, start)}${field.value.slice(end)}`;
  else if (start) {
    field.value = `${field.value.slice(0, start - 1)}${field.value.slice(end)}`;
    field.setSelectionRange(start - 1, start - 1);
  }
  field.focus();
}

function loadReferenceCollapsed() {
  try { return localStorage.getItem(REFERENCE_STORAGE_KEY) === 'true'; }
  catch { return false; }
}

const HIGHLIGHT_COLORS = [
  { name: 'yellow', hex: '#fff27a', label: 'Yellow' },
  { name: 'green', hex: '#9df5c0', label: 'Green' },
  { name: 'pink', hex: '#ffb3d4', label: 'Pink' },
  { name: 'blue', hex: '#a7dcff', label: 'Blue' }
];
const HIGHLIGHT_CLASSES = HIGHLIGHT_COLORS.map(color => `mark-${color.name}`);

function highlightHex(name) {
  return (HIGHLIGHT_COLORS.find(color => color.name === name) || HIGHLIGHT_COLORS[0]).hex;
}

function markColorName(node) {
  const found = HIGHLIGHT_CLASSES.find(name => node.classList.contains(name));
  return found ? found.slice(5) : 'yellow';
}

function withoutStyleAttributes(html) {
  return String(html || '').replace(/\sstyle\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
}

// Older contenteditable edits could leave the visible numerator as loose text
// inside a fraction. Browsers still paint that text above the bar, but the text
// and PNG readers look for .live-numerator and previously replaced it with 1.
function repairMalformedFractions(root) {
  root.querySelectorAll('.live-fraction').forEach(fraction => {
    const directChild = className => [...fraction.children].find(child => child.classList.contains(className)) || null;
    if (directChild('live-numerator')) return;

    const line = directChild('live-fraction-line');
    const denominator = directChild('live-denominator');
    const structuralNodes = new Set([line, denominator].filter(Boolean));
    const looseNumeratorNodes = [...fraction.childNodes].filter(node => !structuralNodes.has(node));
    const numerator = document.createElement('span');
    numerator.className = 'live-numerator';
    fraction.insertBefore(numerator, line || denominator || fraction.firstChild);
    looseNumeratorNodes.forEach(node => numerator.append(node));
  });
}

function sanitizeNotebookHTML(html) {
  const template = document.createElement('template');
  template.innerHTML = withoutStyleAttributes(html);
  const allowedTags = new Set(['BR', 'DIV', 'P', 'SUB', 'SUP', 'SPAN', 'MARK', 'S']);
  const allowedClasses = new Set(['live-fraction', 'live-numerator', 'live-fraction-line', 'live-denominator', ...HIGHLIGHT_CLASSES]);
  const clean = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) return;
      if (child.nodeType !== Node.ELEMENT_NODE || !allowedTags.has(child.tagName)) {
        child.replaceWith(document.createTextNode(child.textContent || ''));
        return;
      }
      // A Lewis diagram is rebuilt from its data; whatever image it carried is discarded.
      if (child.tagName === 'SPAN' && child.classList.contains('lewis-diagram')) {
        const model = lewisParse(child.getAttribute('data-lewis'));
        if (model) child.replaceWith(lewisNode(model));
        else child.remove();
        return;
      }
      const keptClasses = [...child.classList].filter(name => allowedClasses.has(name));
      [...child.attributes].forEach(attribute => child.removeAttribute(attribute.name));
      if (keptClasses.length) child.className = keptClasses.join(' ');
      if (child.classList.contains('live-fraction-line')) child.setAttribute('contenteditable', 'false');
      clean(child);
    });
  };
  clean(template.content);
  repairMalformedFractions(template.content);
  return template.innerHTML.replaceAll('\u200B', '');
}

function editorNodeText(node) {
  if (!node) return '';
  if (node.nodeType === Node.TEXT_NODE) return node.nodeValue.replaceAll('\u200B', '');
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  if (node.classList.contains('lewis-diagram')) return lewisNodeText(node);
  if (node.classList.contains('live-fraction')) {
    const numerator = editorNodeText(node.querySelector('.live-numerator')).trim();
    const denominator = editorNodeText(node.querySelector('.live-denominator')).trim();
    return `${numerator || '1'} / ${denominator || '1'}`;
  }
  if (node.tagName === 'BR') return '\n';
  const text = [...node.childNodes].map(editorNodeText).join('');
  return ['DIV', 'P'].includes(node.tagName) ? `${text}\n` : text;
}

function getEditorText() {
  let text = '';
  [...input.childNodes].forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE && ['DIV', 'P'].includes(node.tagName) && text && !text.endsWith('\n')) text += '\n';
    text += editorNodeText(node);
  });
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

function getEditorHTML() {
  return sanitizeNotebookHTML(input.innerHTML);
}

function notebookHTMLText(html) {
  const holder = document.createElement('div');
  holder.innerHTML = sanitizeNotebookHTML(html);
  let text = '';
  [...holder.childNodes].forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE && ['DIV', 'P'].includes(node.tagName) && text && !text.endsWith('\n')) text += '\n';
    text += editorNodeText(node);
  });
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

function normalizeNotebookStep(step) {
  const html = sanitizeNotebookHTML(step?.html || '');
  return { ...step, html, text: notebookHTMLText(html) };
}

function normalizeSavedEntry(entry) {
  if (entry?.kind === 'work' && Array.isArray(entry.steps)) {
    return { ...entry, steps: entry.steps.map(normalizeNotebookStep) };
  }
  if (entry?.kind === 'note' && entry.html) {
    const html = sanitizeNotebookHTML(entry.html);
    return { ...entry, html, text: notebookHTMLText(html) };
  }
  return entry;
}

function clearEditor() {
  input.innerHTML = '';
  savedEditorRange = null;
  // A fresh step starts a fresh undo stack; old text must not come back into it.
  if (typeof editorHistory !== 'undefined') { editorHistory.length = 0; updateUndoButton(); }
  saveDraftNow();
}

function saveDraftNow() {
  clearTimeout(draftTimer);
  try {
    if (!onLatestStep()) { commitActiveStep(); saveWorkSteps(); }
    localStorage.setItem(DRAFT_STORAGE_KEY, draftHTML());
    updateEditorStatus();
    queueCloudSave();
  } catch {
    $('#draft-status').textContent = 'Save unavailable';
  }
}

function queueDraftSave() {
  const status = $('#draft-status');
  status.textContent = 'Saving…';
  status.classList.add('is-saving');
  clearTimeout(draftTimer);
  draftTimer = setTimeout(saveDraftNow, 220);
}

function elementFromNode(node) {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
}

function closestAtCaret(selector) {
  const selection = getSelection();
  if (!selection?.rangeCount) return null;
  const range = selection.getRangeAt(0);
  return elementFromNode(selection.anchorNode)?.closest(selector)
    || elementFromNode(selection.focusNode)?.closest(selector)
    || elementFromNode(range.commonAncestorContainer)?.closest(selector)
    || null;
}

function updateEditorStatus() {
  const status = $('#draft-status');
  const inDenominator = closestAtCaret('.live-denominator');
  status.textContent = inDenominator ? 'Fraction: Tab or → exits' : 'Saved locally';
  status.classList.toggle('is-fraction-help', Boolean(inDenominator));
  status.classList.remove('is-saving');
}

function restoreDraft() {
  try {
    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (draft) input.innerHTML = sanitizeNotebookHTML(draft);
  } catch {}
}

function saveWorkSteps() {
  state.workSteps = state.workSteps.slice(-30).map(normalizeNotebookStep);
  try { localStorage.setItem(WORK_STEPS_STORAGE_KEY, JSON.stringify(state.workSteps)); queueCloudSave(); }
  catch { showToast('Could not save your steps in this browser'); }
}

// Every step is edited in the one main editor, because that is where the writing
// tools (subscript, fractions, highlight, cross out, undo) live. Opening an earlier
// step moves its content into the editor; the latest step waits in parkedDraftHTML.
function onLatestStep() {
  return state.activeStep === null;
}

function currentStepIndex() {
  return state.activeStep ?? state.workSteps.length;
}

function draftHTML() {
  return onLatestStep() ? getEditorHTML() : parkedDraftHTML;
}

function commitActiveStep() {
  const step = state.workSteps[state.activeStep];
  if (onLatestStep() || !step) return;
  const html = getEditorHTML();
  if (html !== step.html) state.workSteps[state.activeStep] = { ...step, html, text: notebookHTMLText(html), updatedAt: new Date().toISOString() };
}

function returnToLatestStep() {
  if (!onLatestStep()) openStep(state.workSteps.length, { focus: false });
}

function pageSnapshot() {
  commitActiveStep();
  return { page: true, steps: structuredClone(state.workSteps), active: state.activeStep, editor: getEditorHTML(), parked: parkedDraftHTML };
}

function restorePageSnapshot(snapshot) {
  state.workSteps = snapshot.steps;
  state.activeStep = snapshot.active;
  parkedDraftHTML = snapshot.parked;
  input.innerHTML = sanitizeNotebookHTML(snapshot.editor);
  savedEditorRange = null;
  saveWorkSteps();
  saveDraftNow();
  renderWorkSteps();
}

function focusEditorAt(textOffset = null) {
  input.focus();
  const range = document.createRange();
  range.selectNodeContents(input);
  range.collapse(false);
  if (textOffset !== null) {
    const walker = document.createTreeWalker(input, NodeFilter.SHOW_TEXT);
    let seen = 0;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (seen + node.length >= textOffset) { range.setStart(node, textOffset - seen); range.collapse(true); break; }
      seen += node.length;
    }
  }
  const selection = getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  savedEditorRange = range.cloneRange();
  updateNotationButtons();
  updateEditorStatus();
}

// Where a click landed inside a step card, as a text offset; the card and the
// editor hold the same HTML, so the same offset finds the same spot in the editor.
function textOffsetFromPoint(container, x, y) {
  let node = null;
  let offset = 0;
  if (document.caretPositionFromPoint) {
    const position = document.caretPositionFromPoint(x, y);
    node = position?.offsetNode; offset = position?.offset ?? 0;
  } else if (document.caretRangeFromPoint) {
    const range = document.caretRangeFromPoint(x, y);
    node = range?.startContainer; offset = range?.startOffset ?? 0;
  }
  if (!node || node.nodeType !== Node.TEXT_NODE || !container.contains(node)) return null;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let seen = 0;
  while (walker.nextNode()) {
    if (walker.currentNode === node) return seen + offset;
    seen += walker.currentNode.length;
  }
  return null;
}

function resetEditorHistory(entry = null) {
  clearTimeout(typingBurstTimer);
  typingBurstTimer = null;
  editorHistory.length = 0;
  if (entry) editorHistory.push(entry);
  updateUndoButton();
}

function openStep(index, { textOffset = null, focus = true } = {}) {
  const latest = state.workSteps.length;
  if (index < 0 || index > latest) return;
  const target = index === latest ? null : index;
  if (target !== state.activeStep) {
    commitActiveStep();
    if (onLatestStep()) parkedDraftHTML = getEditorHTML();
    state.activeStep = target;
    input.innerHTML = sanitizeNotebookHTML(target === null ? parkedDraftHTML : state.workSteps[target].html);
    if (target === null) parkedDraftHTML = '';
    savedEditorRange = null;
    resetEditorHistory();
    saveWorkSteps();
    saveDraftNow();
    renderWorkSteps();
    inferMode(getEditorText());
  }
  if (!focus) return;
  focusEditorAt(textOffset);
  $('.active-work-step').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function stepCard(html, index, isLatest = false) {
  const number = String(index + 1).padStart(2, '0');
  return `
    <section class="work-step${isLatest ? ' is-latest' : ''}" aria-label="Step ${index + 1}">
      <span class="work-step-number">Step ${number}${isLatest ? '<small>Latest</small>' : ''}</span>
      <div class="work-step-main">
        <div class="work-step-actions">
          <button class="work-step-edit" type="button" data-step-open="${index}" aria-label="Edit step ${index + 1}">Edit</button>
          ${isLatest ? '' : `<button class="work-step-delete" type="button" data-step-delete="${index}" aria-label="Delete step ${index + 1}">Delete</button>`}
        </div>
        <div class="work-step-content saved-note" data-step-content="${index}" title="Click to edit this step">${sanitizeNotebookHTML(html) || '<span class="work-step-empty">Empty step</span>'}</div>
      </div>
    </section>
  `;
}

function renderWorkSteps() {
  const current = currentStepIndex();
  const before = state.workSteps.slice(0, current).map((step, index) => stepCard(step.html, index));
  const after = state.workSteps.slice(current + 1).map((step, offset) => stepCard(step.html, current + 1 + offset));
  if (!onLatestStep()) after.push(stepCard(parkedDraftHTML, state.workSteps.length, true));
  $('#work-steps').innerHTML = before.join('');
  $('#work-steps-after').innerHTML = after.join('');
  $$('[data-step-open]').forEach(button => button.addEventListener('click', () => openStep(Number(button.dataset.stepOpen))));
  $$('[data-step-delete]').forEach(button => button.addEventListener('click', () => deleteWorkStep(Number(button.dataset.stepDelete))));
  $$('[data-step-content]').forEach(card => card.addEventListener('click', event => {
    // Clicking a diagram in an old step opens that step and the diagram's editor.
    const diagram = event.target.closest('.lewis-diagram');
    if (diagram) {
      const position = [...card.querySelectorAll('.lewis-diagram')].indexOf(diagram);
      openStep(Number(card.dataset.stepContent));
      const target = input.querySelectorAll('.lewis-diagram')[position];
      if (target) openLewisEditor(target);
      return;
    }
    // Leave a drag-selection alone so text in an old step can still be copied.
    if (!getSelection().isCollapsed) return;
    openStep(Number(card.dataset.stepContent), { textOffset: textOffsetFromPoint(card, event.clientX, event.clientY) });
  }));
  const total = state.workSteps.length + 1;
  $('#active-step-number').textContent = `Step ${String(current + 1).padStart(2, '0')}${total > 1 ? ` of ${String(total).padStart(2, '0')}` : ''}`;
  $('#active-step-state').textContent = onLatestStep() ? 'Editing' : 'Editing an earlier step';
  $('.active-work-step').classList.toggle('is-earlier', !onLatestStep());
  $('#latest-step-button').hidden = onLatestStep();
  const next = $('#next-step-button');
  next.textContent = onLatestStep() ? 'Next step' : 'Insert step';
  next.title = onLatestStep()
    ? 'Duplicate this as the next editable step (Alt + Enter)'
    : `Insert a new step after Step ${current + 1} (Alt + Enter)`;
}

async function deleteWorkStep(index) {
  if (!state.workSteps[index]) return;
  if (index === state.activeStep) return deleteCurrentStep();
  if (!(await confirmAction({
    eyebrow: 'Notepad step',
    title: `Delete Step ${index + 1}?`,
    body: 'This step will be permanently removed from this note.',
    confirmLabel: 'Delete step',
    cancelLabel: 'Keep step'
  }))) return;
  commitActiveStep();
  state.workSteps.splice(index, 1);
  if (!onLatestStep() && index < state.activeStep) state.activeStep -= 1;
  saveWorkSteps();
  renderWorkSteps();
  showToast(`Step ${index + 1} deleted`);
}

// Delete the step being edited and land on the one before it (or the one after,
// when it was the first). Undo straight afterwards brings the whole page back.
function deleteCurrentStep() {
  const number = currentStepIndex() + 1;
  if (onLatestStep() && !state.workSteps.length) {
    if (!getEditorText()) return showToast('Nothing to delete');
    const snapshot = pageSnapshot();
    input.innerHTML = '';
    resetEditorHistory(snapshot);
  } else {
    const snapshot = pageSnapshot();
    if (onLatestStep()) {
      input.innerHTML = sanitizeNotebookHTML(state.workSteps.pop().html);
    } else {
      const index = state.activeStep;
      state.workSteps.splice(index, 1);
      const landing = index > 0 ? index - 1 : (state.workSteps.length ? 0 : null);
      state.activeStep = landing;
      input.innerHTML = sanitizeNotebookHTML(landing === null ? parkedDraftHTML : state.workSteps[landing].html);
      if (landing === null) parkedDraftHTML = '';
    }
    resetEditorHistory(snapshot);
  }
  savedEditorRange = null;
  saveWorkSteps();
  saveDraftNow();
  renderWorkSteps();
  inferMode(getEditorText());
  focusEditorAt();
  showToast(`Step ${number} deleted - Undo brings it back`);
}

// On an earlier step, "next step" inserts a copy right after it instead of
// jumping to the end; crossed-out writing is dropped from the copy as usual.
function insertStepAfterCurrent() {
  if (state.workSteps.length >= 30) return showToast('A note holds 30 steps - delete one first');
  const snapshot = pageSnapshot();
  const index = state.activeStep + 1;
  const carried = sanitizeNotebookHTML(stripStruckContent(input.innerHTML));
  state.workSteps.splice(index, 0, { html: carried, text: notebookHTMLText(carried), createdAt: new Date().toISOString() });
  state.activeStep = index;
  input.innerHTML = carried;
  savedEditorRange = null;
  resetEditorHistory(snapshot);
  saveWorkSteps();
  saveDraftNow();
  renderWorkSteps();
  focusEditorAt();
  $('.active-work-step').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast(`Step ${index + 1} inserted`);
}

function nextWorkStep() {
  if (!onLatestStep()) return insertStepAfterCurrent();
  const text = getEditorText();
  if (!text) return showToast('Write the first step before continuing');
  state.workSteps.push({ html: getEditorHTML(), text, createdAt: new Date().toISOString() });
  state.workSteps = state.workSteps.slice(-30);
  // Anything crossed out was cancelled in this step, so it does not carry forward.
  const carried = sanitizeNotebookHTML(stripStruckContent(input.innerHTML));
  if (carried !== input.innerHTML) {
    input.innerHTML = carried;
    savedEditorRange = null;
  }
  saveWorkSteps();
  saveDraftNow();
  renderWorkSteps();
  input.focus();
  input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showToast(`Step ${state.workSteps.length + 1} is ready to edit`);
}

function clearWorkSteps() {
  state.workSteps = [];
  saveWorkSteps();
  renderWorkSteps();
}

function saveEntries() {
  state.entries = state.entries.slice(0, 50).map(normalizeSavedEntry);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries.slice(0, 50))); queueCloudSave(); }
  catch { showToast('Could not save in this browser'); }
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function inferMode(value) {
  const first = value.trim().split(/\s+/)[0]?.toLowerCase();
  const labels = { balance: 'BALANCE', b: 'BALANCE', convert: 'CONVERT', c: 'CONVERT', fraction: 'FRACTIONS', f: 'FRACTIONS', ion: 'ION LOOKUP', element: 'ELEMENT LOOKUP', help: 'HELP' };
  $('#mode-badge').textContent = labels[first] || (value.includes('->') || value.includes('→') ? 'EQUATION' : 'READY');
}

function runCommand(raw) {
  // Thousands separators are added as you type; the parsers below read plain digits.
  const text = raw.trim().replace(/(?<=[0-9]),(?=[0-9])/g, '');
  if (!text) return;
  const lower = text.toLowerCase();

  if (lower === 'clear') {
    clearPage();
    return;
  }
  if (lower === 'help' || lower === '?') {
    addEntry({ kind: 'help', input: text, title: 'Commands that work', text: 'balance, convert, fraction, ion, element, clear' });
    return finishCommand();
  }

  const firstSpace = text.indexOf(' ');
  const command = (firstSpace === -1 ? text : text.slice(0, firstSpace)).toLowerCase();
  const body = firstSpace === -1 ? '' : text.slice(firstSpace + 1).trim();

  try {
    if (command === 'balance' || command === 'b' || text.includes('->') || text.includes('→')) {
      const equation = (command === 'balance' || command === 'b') ? body : text;
      const balanced = balanceEquation(equation);
      addEntry({ kind: 'balance', input: equation, title: 'Balanced equation', ...balanced });
    } else if (command === 'convert' || command === 'c' || /^[-+]?\d/.test(text) && /\s+to\s+/i.test(text)) {
      const conversion = convertUnits(command === 'convert' || command === 'c' ? body : text);
      addEntry({ kind: 'convert', input: body || text, title: 'Unit conversion', ...conversion });
    } else if (command === 'fraction' || command === 'f') {
      const fraction = parseFractionChain(body);
      addEntry({ kind: 'fraction', input: body, title: 'Dimensional analysis', ...fraction });
    } else if (command === 'ion') {
      activateReference('ions');
      $('#reference-search').value = body;
      filterReference(body);
      $('#ions-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast(`Showing ions for “${body || 'all'}”`);
    } else if (command === 'element') {
      activateReference('elements');
      $('#reference-search').value = body;
      filterReference(body);
      const found = findElement(body);
      if (found) selectElement(found);
      $('#elements-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast(`Showing elements for “${body || 'all'}”`);
    } else {
      throw new Error('Start with balance, convert, fraction, ion, or element — or just write and press Save note.');
    }
    finishCommand();
  } catch (error) {
    addEntry({ kind: 'error', input: text, title: 'Check the format', text: error.message });
    finishCommand();
  }
}

function finishCommand() {
  clearEditor();
  inferMode('');
  input.focus();
}

function saveNotebookNote() {
  returnToLatestStep();
  const text = getEditorText();
  if (!text) return showToast('Write something before saving');
  const currentStep = { html: getEditorHTML(), text };
  let savedEntry;
  if (state.workSteps.length) {
    const steps = [...state.workSteps, currentStep];
    savedEntry = {
      kind: 'work',
      input: text,
      title: 'Saved note',
      steps,
      text: steps.map((step, index) => `Step ${index + 1}: ${step.text || notebookHTMLText(step.html)}`).join('\n')
    };
    clearWorkSteps();
  } else {
    savedEntry = { kind: 'note', input: text, title: 'Saved note', text, html: currentStep.html };
  }
  if (state.editingEntryId) {
    state.entries = state.entries.map(entry => entry.id === state.editingEntryId ? { ...entry, ...savedEntry, updatedAt: new Date().toISOString() } : entry);
    saveEntries();
    renderResults();
    renderSavedWork();
    state.editingEntryId = null;
    showToast('Note updated');
  } else {
    addEntry(savedEntry);
    showToast('Note saved');
  }
  clearEditor();
  inferMode('');
  input.focus();
}

function runNotebookCommand() {
  // A command result replaces the editor, which would wipe an earlier step.
  if (!onLatestStep()) return showToast('Commands run on the latest step');
  const text = getEditorText();
  if (!text) return showToast('Write something first');
  runCommand(text);
}

function addEntry(entry) {
  if (state.editingEntryId) {
    const editingId = state.editingEntryId;
    state.entries = state.entries.map(existing => existing.id === editingId
      ? { ...existing, ...entry, id: editingId, updatedAt: new Date().toISOString() }
      : existing);
    state.editingEntryId = null;
    showToast('Result updated');
  } else {
    state.entries.unshift({ ...entry, id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, createdAt: new Date().toISOString() });
  }
  state.entries = state.entries.slice(0, 50);
  saveEntries();
  renderResults();
  renderSavedWork();
}

function savedWorkEntries() {
  return state.entries.filter(entry => entry.kind === 'work' || entry.kind === 'note');
}

function visibleSavedHTMLText(html) {
  const holder = document.createElement('div');
  holder.innerHTML = sanitizeNotebookHTML(html || '');
  holder.querySelectorAll('.live-fraction').forEach(fraction => {
    if (fraction.querySelector(':scope > .live-numerator')) return;
    fraction.querySelectorAll(':scope > .live-fraction-line, :scope > .live-denominator').forEach(node => node.remove());
  });
  return holder.textContent.replace(/\s+/g, ' ').trim();
}

function savedStepPreview(step) {
  const stored = String(step?.text || '').replace(/\s+/g, ' ').trim();
  const visible = visibleSavedHTMLText(step?.html || '');
  return /^1\s*\/\s*1$/.test(stored) && visible ? visible : stored || visible;
}

function savedEntrySearchText(entry) {
  const stepText = Array.isArray(entry.steps)
    ? entry.steps.flatMap(step => [step.text, visibleSavedHTMLText(step.html || '')])
    : [visibleSavedHTMLText(entry.html || '')];
  return [entry.title, entry.input, entry.text, ...stepText].filter(Boolean).join(' ').toLocaleLowerCase();
}

function savedEntryCardCopy(entry) {
  if (entry.kind === 'work' && Array.isArray(entry.steps) && entry.steps.length) {
    return {
      firstLine: savedStepPreview(entry.steps[0]) || 'Untitled note',
      lastLine: savedStepPreview(entry.steps.at(-1))
    };
  }
  const firstLine = (entry.text || entry.input || visibleSavedHTMLText(entry.html || '') || 'Untitled note').split('\n').find(Boolean) || 'Untitled note';
  return { firstLine, lastLine: '' };
}

function renderSavedWork() {
  const list = $('#saved-work-list');
  const allSaved = savedWorkEntries();
  const query = ($('#saved-work-search')?.value || '').trim().toLocaleLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  const saved = terms.length
    ? allSaved.filter(entry => terms.every(term => savedEntrySearchText(entry).includes(term)))
    : allSaved;
  const count = $('#saved-work-count');
  count.textContent = terms.length
    ? `${saved.length} of ${allSaved.length} notes found`
    : `${allSaved.length} saved note${allSaved.length === 1 ? '' : 's'}`;
  if (!allSaved.length) {
    list.innerHTML = '<p class="saved-work-empty">No saved notes yet.</p>';
    return;
  }
  if (!saved.length) {
    list.innerHTML = `<p class="saved-work-empty">No notes match “${escapeHTML(query)}”. Try a number, unit, or word from the question.</p>`;
    return;
  }
  list.innerHTML = saved.map(entry => {
    const { firstLine, lastLine } = savedEntryCardCopy(entry);
    const date = new Date(entry.updatedAt || entry.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    const label = entry.kind === 'work' ? `${entry.steps?.length || 1} step${entry.steps?.length === 1 ? '' : 's'}` : 'note';
    const preview = lastLine && lastLine !== firstLine ? `<span class="saved-work-preview">${escapeHTML(lastLine)}</span>` : '';
    return `<button class="saved-work-item" type="button" data-saved-id="${escapeHTML(entry.id)}"><strong>${escapeHTML(firstLine)}</strong>${preview}<small>${label} · ${date} · edit</small></button>`;
  }).join('');
}

function setSavedWorkOpen(open) {
  $('#saved-work-drawer').hidden = !open;
  $('#saved-work-toggle').setAttribute('aria-expanded', String(open));
  if (open) {
    renderSavedWork();
    if (matchMedia('(min-width: 821px)').matches) requestAnimationFrame(() => $('#saved-work-search').focus());
  }
}

async function loadSavedWork(id) {
  const entry = state.entries.find(item => item.id === id && (item.kind === 'work' || item.kind === 'note'));
  if (!entry) return;
  if ((getEditorText() || state.workSteps.length) && !(await confirmAction({
    eyebrow: 'Saved notes',
    title: 'Replace what is on this page?',
    body: 'Anything you have not saved on this page will be replaced by this note.',
    confirmLabel: 'Open the note',
    cancelLabel: 'Keep editing'
  }))) return;
  state.activeStep = null;
  parkedDraftHTML = '';
  if (entry.kind === 'work' && Array.isArray(entry.steps) && entry.steps.length) {
    const steps = entry.steps.map(normalizeNotebookStep);
    state.workSteps = steps.slice(0, -1);
    input.innerHTML = steps.at(-1).html;
  } else {
    state.workSteps = [];
    input.innerHTML = sanitizeNotebookHTML(entry.html || entry.text || '');
  }
  state.editingEntryId = entry.id;
  saveWorkSteps();
  saveDraftNow();
  renderWorkSteps();
  inferMode(getEditorText());
  setSavedWorkOpen(false);
  input.focus();
  const caret = document.createRange();
  caret.selectNodeContents(input);
  caret.collapse(false);
  const selection = getSelection();
  selection.removeAllRanges();
  selection.addRange(caret);
  savedEditorRange = caret.cloneRange();
  showToast('Note opened for editing');
}

function commandForEntry(entry) {
  if (entry.kind === 'fraction') return `fraction ${entry.input || ''}`.trim();
  return entry.input || entry.text || '';
}

async function editEntry(entry) {
  if (entry.kind === 'work' || entry.kind === 'note') return loadSavedWork(entry.id);
  if ((getEditorText() || state.workSteps.length) && !(await confirmAction({
    eyebrow: 'Edit result',
    title: 'Replace what is on this page?',
    body: 'Anything you have not saved on this page will be replaced by this earlier result.',
    confirmLabel: 'Edit result',
    cancelLabel: 'Keep editing'
  }))) return;

  state.activeStep = null;
  parkedDraftHTML = '';
  clearWorkSteps();
  input.textContent = commandForEntry(entry);
  state.editingEntryId = entry.id;
  saveDraftNow();
  inferMode(getEditorText());
  input.focus();
  const range = document.createRange();
  range.selectNodeContents(input); range.collapse(false);
  const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
  savedEditorRange = range.cloneRange();
  showToast('Edit the command, then Ctrl + Enter to update it');
}

function renderResults() {
  results.textContent = '';
  state.entries.forEach((entry, index) => {
    const node = $('#result-template').content.cloneNode(true);
    const card = $('.result-card', node);
    card.dataset.id = entry.id;
    $('.result-number', node).textContent = String(state.entries.length - index).padStart(2, '0');
    $('.result-kind', node).textContent = entry.kind;
    $('time', node).textContent = new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    $('.result-content', node).innerHTML = entryHTML(entry);
    results.append(node);
  });
}

function entryHTML(entry) {
  if (entry.kind === 'balance') {
    const parts = entry.compounds.map((compound, i) => {
      const coefficient = entry.coefficients[i];
      const coefficientHTML = coefficient === 1 ? '' : `<span class="coefficient">${coefficient}</span>`;
      return `${coefficientHTML}${formatFormulaHTML(compound)}`;
    });
    const left = parts.slice(0, entry.leftCount).join(' <span>+</span> ');
    const right = parts.slice(entry.leftCount).join(' <span>+</span> ');
    return `<h3>${escapeHTML(entry.title)}</h3><div class="chemical-equation">${left}<span class="arrow">→</span>${right}</div><p class="equation-input">From: ${escapeHTML(entry.input)}</p>`;
  }
  if (entry.kind === 'convert') {
    const factor = entry.factorTop ? `<span class="factor-operator">×</span><span class="factor"><span>${escapeHTML(entry.factorTop)}</span><i class="factor-line"></i><span>${escapeHTML(entry.factorBottom)}</span></span>` : '';
    return `<h3>${escapeHTML(entry.title)}</h3><div class="factor-chain"><span class="conversion-answer"><span>${escapeHTML(entry.sourceText)}</span></span>${factor}<span class="factor-operator">=</span><span class="factor-result">${escapeHTML(entry.resultText)}</span></div><p class="conversion-note">${escapeHTML(entry.factorText)}</p>`;
  }
  if (entry.kind === 'fraction') {
    const factors = entry.factors.map((factor, index) => {
      const numClass = factor.numCancelled ? 'cancelled' : '';
      const denClass = factor.denCancelled ? 'cancelled' : '';
      const op = index < entry.factors.length - 1 ? '<span class="factor-operator">×</span>' : '';
      return `<span class="factor"><span>${escapeHTML(factor.numValue)} <span class="${numClass}">${escapeHTML(factor.numUnit)}</span></span><i class="factor-line"></i><span>${escapeHTML(factor.denValue)} <span class="${denClass}">${escapeHTML(factor.denUnit)}</span></span></span>${op}`;
    }).join('');
    const answer = entry.numericResult == null ? '' : `<span class="factor-operator">=</span><span class="factor-result">${escapeHTML(formatNumber(entry.numericResult))}${entry.outputUnit ? ` ${escapeHTML(entry.outputUnit)}` : ''}</span>`;
    return `<h3>${escapeHTML(entry.title)}</h3><div class="factor-chain">${factors}${answer}</div>`;
  }
  if (entry.kind === 'help') {
    return `<h3>${escapeHTML(entry.title)}</h3><div class="command-list"><div><code>balance</code><span>balance a chemical equation</span></div><div><code>convert</code><span>convert common chemistry units</span></div><div><code>fraction</code><span>build stacked factor-label fractions</span></div><div><code>ion / element</code><span>search the reference shelf</span></div></div>`;
  }
  if (entry.kind === 'error') return `<div class="error-box"><h3>${escapeHTML(entry.title)}</h3><p>${escapeHTML(entry.text)}</p></div>`;
  if (entry.kind === 'work' && Array.isArray(entry.steps)) {
    const steps = entry.steps.map((step, index) => `<div class="saved-work-step"><span>Step ${String(index + 1).padStart(2, '0')}</span><div class="saved-note">${sanitizeNotebookHTML(step.html)}</div></div>`).join('');
    return `<h3>${escapeHTML(entry.title)}</h3><div class="saved-work">${steps}</div>`;
  }
  if (entry.kind === 'note' && entry.html) return `<h3>${escapeHTML(entry.title)}</h3><div class="saved-note">${sanitizeNotebookHTML(entry.html)}</div>`;
  return `<h3>${escapeHTML(entry.title)}</h3><p>${escapeHTML(entry.text)}</p>`;
}

function splitEquation(equation) {
  const sides = equation.replace(/⇌/g, '->').split(/\s*(?:->|→|=)\s*/);
  if (sides.length !== 2 || !sides[0] || !sides[1]) throw new Error('Use an arrow between reactants and products, like H2 + O2 -> H2O.');
  const splitSide = side => side.split(/\s*\+\s*/).map(x => x.trim().replace(/^\d+\s*/, '')).filter(Boolean);
  const left = splitSide(sides[0]);
  const right = splitSide(sides[1]);
  if (!left.length || !right.length) throw new Error('Put at least one formula on each side of the arrow.');
  return { left, right };
}

function stripFormula(formula) {
  return formula.replace(/^\d+\s*/, '').replace(/\((aq|s|l|g)\)$/i, '').replace(/\^?\d*[+−-]$/, '').trim();
}

function parseFormula(formula) {
  const source = stripFormula(formula).replace(/[·.]/g, '');
  const tokens = source.match(/[A-Z][a-z]?|\d+|[()[\]]/g);
  if (!tokens || tokens.join('') !== source.replace(/\s/g, '')) throw new Error(`I could not read “${formula}”. Check capitalization and parentheses.`);
  const stack = [{}];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '(' || token === '[') stack.push({});
    else if (token === ')' || token === ']') {
      if (stack.length === 1) throw new Error(`The parentheses in “${formula}” do not match.`);
      const group = stack.pop();
      const multiplier = /^\d+$/.test(tokens[i + 1] || '') ? Number(tokens[++i]) : 1;
      for (const [symbol, count] of Object.entries(group)) stack[stack.length - 1][symbol] = (stack[stack.length - 1][symbol] || 0) + count * multiplier;
    } else if (/^[A-Z]/.test(token)) {
      if (!ELEMENTS.some(element => element.symbol === token)) throw new Error(`“${token}” is not an element symbol.`);
      const count = /^\d+$/.test(tokens[i + 1] || '') ? Number(tokens[++i]) : 1;
      stack[stack.length - 1][token] = (stack[stack.length - 1][token] || 0) + count;
    } else {
      throw new Error(`There is a number in an unexpected place in “${formula}”.`);
    }
  }
  if (stack.length !== 1) throw new Error(`The parentheses in “${formula}” do not match.`);
  return stack[0];
}

const absBig = n => n < 0n ? -n : n;
function gcd(a, b) { a = absBig(a); b = absBig(b); while (b) [a, b] = [b, a % b]; return a || 1n; }
function lcm(a, b) { return absBig(a * b) / gcd(a, b); }
function frac(n = 0n, d = 1n) {
  if (d === 0n) throw new Error('Division by zero while balancing.');
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}
const fAdd = (a,b) => frac(a.n*b.d + b.n*a.d, a.d*b.d);
const fSub = (a,b) => frac(a.n*b.d - b.n*a.d, a.d*b.d);
const fMul = (a,b) => frac(a.n*b.n, a.d*b.d);
const fDiv = (a,b) => frac(a.n*b.d, a.d*b.n);

function balanceEquation(equation) {
  const { left, right } = splitEquation(equation);
  const compounds = [...left, ...right];
  if (compounds.length > 14) throw new Error('This equation is too large for the quick balancer. Try fewer compounds.');
  const counts = compounds.map(parseFormula);
  const elements = [...new Set(counts.flatMap(obj => Object.keys(obj)))];
  const matrix = elements.map(element => counts.map((obj, i) => frac(BigInt((obj[element] || 0) * (i < left.length ? 1 : -1)))));
  let row = 0;
  const pivots = [];
  for (let col = 0; col < compounds.length && row < matrix.length; col++) {
    let pivot = row;
    while (pivot < matrix.length && matrix[pivot][col].n === 0n) pivot++;
    if (pivot === matrix.length) continue;
    [matrix[row], matrix[pivot]] = [matrix[pivot], matrix[row]];
    const divisor = matrix[row][col];
    matrix[row] = matrix[row].map(value => fDiv(value, divisor));
    for (let r = 0; r < matrix.length; r++) {
      if (r === row || matrix[r][col].n === 0n) continue;
      const factor = matrix[r][col];
      matrix[r] = matrix[r].map((value, c) => fSub(value, fMul(factor, matrix[row][c])));
    }
    pivots.push(col);
    row++;
  }
  const free = [...Array(compounds.length).keys()].filter(col => !pivots.includes(col));
  if (!free.length) throw new Error('No non-zero balance was found. Check the formulas on both sides.');
  const solution = Array.from({ length: compounds.length }, () => frac());
  solution[free[free.length - 1]] = frac(1n);
  for (let r = pivots.length - 1; r >= 0; r--) {
    const col = pivots[r];
    let sum = frac();
    for (let c = col + 1; c < compounds.length; c++) sum = fAdd(sum, fMul(matrix[r][c], solution[c]));
    solution[col] = frac(-sum.n, sum.d);
  }
  let denominatorLCM = 1n;
  solution.forEach(value => denominatorLCM = lcm(denominatorLCM, value.d));
  let integers = solution.map(value => value.n * (denominatorLCM / value.d));
  if (integers[0] < 0n) integers = integers.map(value => -value);
  const common = integers.reduce((acc, value) => gcd(acc, value), 0n);
  integers = integers.map(value => value / common);
  if (integers.some(value => value <= 0n)) throw new Error('This equation has more than one independent balance. Add or check compounds.');
  return { compounds, coefficients: integers.map(Number), leftCount: left.length, plain: `${left.map((x,i) => `${integers[i] === 1n ? '' : integers[i]}${x}`).join(' + ')} -> ${right.map((x,i) => `${integers[i+left.length] === 1n ? '' : integers[i+left.length]}${x}`).join(' + ')}` };
}

function normalizeUnit(unit) {
  const cleaned = unit.trim().replace(/°/g, '').replace(/liters?|litres?/i, 'L').replace(/grams?/i, 'g').replace(/seconds?/i, 's').replace(/minutes?/i, 'min').replace(/hours?/i, 'h').replace(/moles?/i, 'mol');
  if (cleaned === 'M') return 'M';
  return cleaned.toLowerCase();
}

function convertTemperature(value, from, to) {
  const f = from.toLowerCase(), t = to.toLowerCase();
  const tempUnits = ['c','celsius','f','fahrenheit','k','kelvin'];
  if (!tempUnits.includes(f) || !tempUnits.includes(t)) return null;
  const kelvin = f === 'k' || f === 'kelvin' ? value : f === 'c' || f === 'celsius' ? value + 273.15 : (value - 32) * 5/9 + 273.15;
  return t === 'k' || t === 'kelvin' ? kelvin : t === 'c' || t === 'celsius' ? kelvin - 273.15 : (kelvin - 273.15) * 9/5 + 32;
}

function convertUnits(text) {
  const match = text.match(/^\s*([-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)\s*([^\s]+)\s+(?:to|in)\s+([^\s]+)\s*$/i);
  if (!match) throw new Error('Type a number, its unit, then the target unit. Example: convert 2500 mg to g.');
  const value = Number(match[1]);
  const fromRaw = match[2], toRaw = match[3];
  const temperature = convertTemperature(value, fromRaw.replace('°',''), toRaw.replace('°',''));
  if (temperature != null) return { value: temperature, from: fromRaw, to: toRaw, sourceText: `${formatNumber(value)} °${fromRaw.replace('°','').toUpperCase()}`, resultText: `${formatNumber(temperature)} °${toRaw.replace('°','').toUpperCase()}`, factorText: 'Temperature scales use an offset, not only a multiplication factor.' };
  const from = UNITS[normalizeUnit(fromRaw)], to = UNITS[normalizeUnit(toRaw)];
  if (!from || !to) throw new Error(`I do not know one of those units yet. Try mass, volume, length, time, amount, pressure, or energy units.`);
  if (from[0] !== to[0]) throw new Error(`${fromRaw} and ${toRaw} measure different things, so they cannot be directly converted.`);
  const converted = value * from[1] / to[1];
  const factor = from[1] / to[1];
  return { value: converted, from: from[2], to: to[2], sourceText: `${formatNumber(value)} ${from[2]}`, resultText: `${formatNumber(converted)} ${to[2]}`, factorTop: `${formatNumber(factor)} ${to[2]}`, factorBottom: `1 ${from[2]}`, factorText: `The ${from[2]} units cancel, leaving ${to[2]}.` };
}

function parseFactorSide(side) {
  const match = side.trim().match(/^([-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)?\s*(.+)$/i);
  if (!match || !match[2]) throw new Error('Each fraction needs a value and unit above and below the line.');
  return { value: match[1] || '1', unit: match[2].trim() };
}

function parseFractionChain(text) {
  if (!text) throw new Error('After “fraction”, type factors like 1 mol / 6.022e23 particles * 18.015 g / 1 mol.');
  const segments = text.split(/\s*(?:\*|×)\s*/).filter(Boolean);
  const factors = segments.map(segment => {
    const halves = segment.split(/\s*\/\s*/);
    if (halves.length !== 2) throw new Error(`“${segment}” needs one / to separate the top and bottom.`);
    const num = parseFactorSide(halves[0]);
    const den = parseFactorSide(halves[1]);
    return { numValue: num.value, numUnit: num.unit, denValue: den.value, denUnit: den.unit };
  });
  const numeratorCounts = {}, denominatorCounts = {};
  factors.forEach(factor => {
    const n = factor.numUnit.toLowerCase(), d = factor.denUnit.toLowerCase();
    numeratorCounts[n] = (numeratorCounts[n] || 0) + 1;
    denominatorCounts[d] = (denominatorCounts[d] || 0) + 1;
  });
  const cancellations = {};
  Object.keys(numeratorCounts).forEach(unit => cancellations[unit] = Math.min(numeratorCounts[unit], denominatorCounts[unit] || 0));
  const usedNumerator = {}, usedDenominator = {};
  factors.forEach(factor => {
    const n = factor.numUnit.toLowerCase(), d = factor.denUnit.toLowerCase();
    usedNumerator[n] = (usedNumerator[n] || 0) + 1;
    usedDenominator[d] = (usedDenominator[d] || 0) + 1;
    factor.numCancelled = usedNumerator[n] <= (cancellations[n] || 0);
    factor.denCancelled = usedDenominator[d] <= (cancellations[d] || 0);
  });
  const remainingNumerator = factors.filter(f => !f.numCancelled).map(f => f.numUnit);
  const remainingDenominator = factors.filter(f => !f.denCancelled).map(f => f.denUnit);
  const outputUnit = remainingNumerator.length || remainingDenominator.length ? `${remainingNumerator.join('·') || '1'}${remainingDenominator.length ? ` / ${remainingDenominator.join('·')}` : ''}` : '';
  const cancelledUnits = Object.keys(cancellations).filter(unit => cancellations[unit] > 0);
  const numericResult = factors.reduce((total, factor) => total * Number(factor.numValue) / Number(factor.denValue), 1);
  return { factors, cancelledUnits, outputUnit, numericResult: Number.isFinite(numericResult) ? numericResult : null, plain: text };
}

function formatNumber(value) {
  if (!Number.isFinite(Number(value))) return String(value);
  const n = Number(value);
  if (n !== 0 && (Math.abs(n) >= 1e7 || Math.abs(n) < 1e-4)) return n.toExponential(5).replace(/\.0+(?=e)/, '');
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 10 }).format(n);
}

function renderPeriodicTable() {
  const table = $('#periodic-table');
  table.textContent = '';
  for (let group = 1; group <= 18; group++) {
    const label = document.createElement('span');
    label.className = 'group-label';
    label.style.gridColumn = group;
    label.style.gridRow = 1;
    label.textContent = group;
    label.setAttribute('aria-hidden', 'true');
    table.append(label);
  }
  ELEMENTS.forEach(element => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `element-cell cat-${displayCategory(element.category)}`;
    button.style.gridColumn = element.group;
    button.style.gridRow = element.period <= 7 ? element.period + 1 : element.period + 2;
    button.dataset.number = element.number;
    button.dataset.symbol = element.symbol;
    button.title = `${element.number}. ${element.name} (${element.symbol})`;
    button.setAttribute('aria-label', `${element.name}, ${element.symbol}, atomic number ${element.number}`);
    button.textContent = element.symbol;
    button.addEventListener('click', () => selectElement(element));
    table.append(button);
  });
  const staircase = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  staircase.setAttribute('class', 'metalloid-staircase');
  staircase.setAttribute('viewBox', '0 0 18 7');
  staircase.setAttribute('preserveAspectRatio', 'none');
  staircase.setAttribute('aria-hidden', 'true');
  const stairPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  stairPath.setAttribute('d', 'M 13 1 V 2 H 14 V 3 H 15 V 4 H 16 V 5 H 17 V 6');
  staircase.append(stairPath);
  table.append(staircase);
}

function displayCategory(category) {
  if (category === 'nonmetal') return 'nonmetal';
  if (category === 'noble') return 'noble';
  if (category === 'alkali') return 'alkali';
  if (category === 'transition') return 'transition';
  if (category === 'metalloid') return 'metalloid';
  return 'other';
}

function categoryName(category) {
  return ({ noble: 'Noble gas', alkali: 'Alkali metal', alkaline: 'Alkaline earth metal', transition: 'Transition metal', 'post-transition': 'Post-transition metal', nonmetal: 'Nonmetal', halogen: 'Halogen', metalloid: 'Metalloid', lanthanide: 'Lanthanide', actinide: 'Actinide' })[category] || category;
}

function selectElement(element) {
  state.selectedElement = element;
  const charges = ELEMENT_CHARGES[element.symbol] || [];
  $('#element-detail').innerHTML = `<button type="button" class="element-tile-preview" title="Click to copy atomic mass ${element.mass}" aria-label="Copy ${element.name} atomic mass, ${element.mass}"><span>${element.number}</span><em class="tile-charge">${charges.join(' ')}</em><strong>${element.symbol}</strong><small>${element.mass}</small></button><div><p class="detail-kicker">Selected element</p><h3>${element.name}</h3><p>${categoryName(element.category)} · period ${Math.min(element.period, 7)} · group ${element.group}${charges.length ? ` · <span class="nowrap">ion ${charges.join(', ')}</span>` : ''}</p></div>`;
}

function copyElementMass(element = state.selectedElement) {
  if (element) {
    const mass = element.mass.replace(/[()]/g, '');
    copyValue(mass, `Copied ${mass} (${element.symbol} atomic mass)`);
  }
}

// Exact symbol wins, so typing O, Cl or Br lands on that element instead of the first name containing it.
function elementSearchRank(element, q) {
  const symbol = element.symbol.toLowerCase();
  const name = element.name.toLowerCase();
  if (symbol === q || String(element.number) === q) return 0;
  if (name === q) return 1;
  if (symbol.startsWith(q)) return 2;
  if (name.startsWith(q)) return 3;
  if (name.includes(q) || symbol.includes(q)) return 4;
  return -1;
}

function findElement(query) {
  const q = query.trim().toLowerCase();
  return ELEMENTS.find(element => element.symbol.toLowerCase() === q || element.name.toLowerCase() === q || String(element.number) === q);
}

const PREFIXES = [
  ['24', 'yotta', 'Y'], ['21', 'zetta', 'Z'], ['18', 'exa', 'E'], ['15', 'peta', 'P'],
  ['12', 'tera', 'T'], ['9', 'giga', 'G'], ['6', 'mega', 'M'], ['3', 'kilo', 'k'],
  ['2', 'hecto', 'h'], ['1', 'deca', 'da'], ['0', '', ''], ['-1', 'deci', 'd'],
  ['-2', 'centi', 'c'], ['-3', 'milli', 'm'], ['-6', 'micro', 'µ'], ['-9', 'nano', 'n'],
  ['-12', 'pico', 'p'], ['-15', 'femto', 'f'], ['-18', 'atto', 'a'], ['-21', 'zepto', 'z'],
  ['-24', 'yocto', 'y']
].map(([power, name, symbol]) => ({ power, name, symbol }));

function renderPrefixes(filter = '') {
  const q = filter.trim().toLowerCase();
  const matches = PREFIXES.filter(prefix => !q
    || prefix.name.toLowerCase().startsWith(q)
    || prefix.symbol.toLowerCase() === q
    || prefix.power === q.replace('^', '').replace('10', '')
    || `10^${prefix.power}`.includes(q));
  const list = $('#prefix-list');
  if (!matches.length) {
    list.innerHTML = '<p class="prefix-empty">No prefix matches that search.</p>';
    return;
  }
  list.innerHTML = matches.map(prefix => {
    const power = `10<sup>${escapeHTML(prefix.power)}</sup>`;
    if (!prefix.name) {
      return `<div class="prefix-row is-base"><span class="prefix-power">${power}</span><span class="prefix-name">(none)</span><span class="prefix-symbol">(none)</span></div>`;
    }
    return `<button type="button" class="prefix-row" data-prefix="${escapeHTML(prefix.symbol)}" title="Insert ${escapeHTML(prefix.symbol)} into your notepad"><span class="prefix-power">${power}</span><span class="prefix-name">${escapeHTML(prefix.name)}-</span><span class="prefix-symbol">${escapeHTML(prefix.symbol)}</span></button>`;
  }).join('');
  $$('[data-prefix]', list).forEach(button => button.addEventListener('click', () => {
    input.focus();
    insertTextAtCaret(button.dataset.prefix);
    queueDraftSave();
    showToast(`Inserted ${button.dataset.prefix}`);
  }));
}

function renderIons(filter = '') {
  const q = filter.trim().toLowerCase();
  const filtered = IONS.filter(ion => !q || ion.name.toLowerCase().includes(q) || ion.formula.toLowerCase().includes(q) || ion.charge.toLowerCase().includes(q));
  $('#ions-list').innerHTML = filtered.length ? filtered.map(ion => `<div class="ion-row"><span class="ion-formula">${formatFormulaHTML(ion.formula)}<sup>${escapeHTML(ion.charge)}</sup></span><span class="ion-name">${escapeHTML(ion.name)}</span><span class="ion-charge">${escapeHTML(ion.charge)}</span></div>`).join('') : '<p>No ions match that search.</p>';
}

function renderCourseGuide() {
  $('#course-guide').innerHTML = `
    <details open><summary>Moles & stoichiometry</summary><div class="guide-content">
      <p><strong>Map every question:</strong> given → moles → mole ratio → moles → wanted unit.</p>
      <div class="guide-formula"><div><span>particles</span><strong>N = n × 6.02 × 10<sup>23</sup></strong></div><div><span>molar mass</span><strong>n = m ÷ M</strong></div><div><span>molar volume at STP</span><strong>n = V ÷ 22.4 L</strong></div><div><span>concentration</span><strong>M = n ÷ V</strong></div></div>
      <p>Use the <strong>balanced equation coefficients</strong> as the mole ratio. Show every conversion factor so units cancel.</p>
    </div></details>
    <details><summary>Gas laws & pressure</summary><div class="guide-content">
      <div class="guide-formula"><div><span>Boyle</span><strong>P<sub>1</sub>V<sub>1</sub> = P<sub>2</sub>V<sub>2</sub></strong></div><div><span>Charles</span><strong>V<sub>1</sub>/T<sub>1</sub> = V<sub>2</sub>/T<sub>2</sub></strong></div><div><span>Combined</span><strong>P<sub>1</sub>V<sub>1</sub>/T<sub>1</sub> = P<sub>2</sub>V<sub>2</sub>/T<sub>2</sub></strong></div><div><span>ideal gas</span><strong>PV = nRT</strong></div></div>
      <p>Always change temperature to <strong>Kelvin: K = °C + 273</strong>. At STP: <strong>1 mol gas = 22.4 L</strong>. <code>1 atm = 101.3 kPa = 760 mmHg = 760 Torr</code>. For PV = nRT, <code>R = 0.0821 L·atm/(mol·K)</code>.</p>
    </div></details>
    <details><summary>Solubility rules</summary><div class="guide-content"><ul class="guide-list">
      <li><strong>Always soluble:</strong> Group 1 ions, H<sup>+</sup>, NH<sub>4</sub><sup>+</sup>, and NO<sub>3</sub><sup>−</sup>.</li>
      <li><strong>Cl<sup>−</sup>, Br<sup>−</sup>, I<sup>−</sup>:</strong> soluble except with Ag<sup>+</sup>, Pb<sup>2+</sup>, or Cu<sup>+</sup>.</li>
      <li><strong>SO<sub>4</sub><sup>2−</sup>:</strong> usually soluble; check Ag<sup>+</sup>, Ca<sup>2+</sup>, Sr<sup>2+</sup>, Ba<sup>2+</sup>, Pb<sup>2+</sup>.</li>
      <li><strong>CO<sub>3</sub><sup>2−</sup>, PO<sub>4</sub><sup>3−</sup>, SO<sub>3</sub><sup>2−</sup>:</strong> insoluble except Group 1, H<sup>+</sup>, NH<sub>4</sub><sup>+</sup>.</li>
      <li><strong>OH<sup>−</sup>, S<sup>2−</sup>:</strong> usually insoluble; use your course exceptions table for alkaline-earth cases.</li>
    </ul></div></details>
    <details><summary>Metric & unit conversion</summary><div class="guide-content">
      <p>Start with what you have, then multiply by fractions equal to 1 until only the target unit remains.</p>
      <div class="guide-prefixes"><span>T 10<sup>12</sup></span><span>G 10<sup>9</sup></span><span>M 10<sup>6</sup></span><span>k 10<sup>3</sup></span><span>h 10<sup>2</sup></span><span>da 10</span><span>base 10<sup>0</sup></span><span>d 10<sup>−1</sup></span><span>c 10<sup>−2</sup></span><span>m 10<sup>−3</sup></span><span>µ 10<sup>−6</sup></span><span>n 10<sup>−9</sup></span><span>p 10<sup>−12</sup></span></div>
      <div class="guide-formula"><div><span>temperature</span><strong>K = °C + 273</strong></div><div><span>temperature</span><strong>°F = 9/5(°C) + 32</strong></div><div><span>density</span><strong>D = m ÷ V</strong></div><div><span>percent error</span><strong>|exp − accepted| ÷ accepted × 100</strong></div></div>
    </div></details>
    <details><summary>Reactions, names & formulas</summary><div class="guide-content"><ul class="guide-list">
      <li><strong>Diatomic elements:</strong> H<sub>2</sub>, O<sub>2</sub>, F<sub>2</sub>, Br<sub>2</sub>, I<sub>2</sub>, N<sub>2</sub>, Cl<sub>2</sub> — remember <code>HOFBrINCl</code>.</li>
      <li><strong>Five common types:</strong> synthesis, decomposition, single replacement, double replacement, and combustion.</li>
      <li><strong>Neutralization:</strong> acid + base → salt + water. A precipitate needs an insoluble product.</li>
      <li><strong>Covalent prefixes:</strong> mono-, di-, tri-, tetra-, penta-, hexa-, hepta-, octa-, nona-, deca-.</li>
      <li><strong>Acids:</strong> binary acids use <em>hydro-…-ic acid</em>; oxyacids follow the ion ending: <em>-ate → -ic</em>, <em>-ite → -ous</em>.</li>
    </ul></div></details>
    <details><summary>Energy, pH & periodic trends</summary><div class="guide-content">
      <div class="guide-formula"><div><span>heat</span><strong>q = mcΔT</strong></div><div><span>molar heat</span><strong>q = nΔH</strong></div><div><span>pH</span><strong>pH = −log[H<sup>+</sup>]</strong></div><div><span>water</span><strong>pH + pOH = 14</strong></div></div>
      <p>Across a period: atomic radius decreases, ionization energy and electronegativity increase. Down a group: radius increases, ionization energy and electronegativity decrease. Metals lose electrons; nonmetals gain or share them.</p>
      <p><strong>Significant figures:</strong> multiply/divide to the fewest significant figures; add/subtract to the fewest decimal places.</p>
    </div></details>`;
}

function filterReference(query) {
  const q = query.trim().toLowerCase();
  if (state.activeReference === 'ions') return renderIons(q);
  if (state.activeReference === 'prefixes') return renderPrefixes(q);
  if (state.activeReference === 'guide') return;
  const filtered = q
    ? ELEMENTS.filter(element => elementSearchRank(element, q) >= 0).sort((a, b) => elementSearchRank(a, q) - elementSearchRank(b, q) || a.number - b.number)
    : ELEMENTS;
  $$('.element-cell').forEach(cell => {
    const element = ELEMENTS.find(item => item.symbol === cell.dataset.symbol);
    const match = filtered.includes(element);
    cell.classList.toggle('is-dimmed', Boolean(q) && !match);
    cell.classList.toggle('is-match', Boolean(q) && match);
  });
  const searchResults = $('#element-search-results');
  searchResults.innerHTML = filtered.slice(0, q ? 12 : 18).map(element => `<button type="button" data-symbol="${element.symbol}"><strong>${element.symbol}</strong><span>${element.name}</span><small>${element.number}</small></button>`).join('');
  searchResults.classList.toggle('is-visible', Boolean(q));
  $$('button', searchResults).forEach(button => button.addEventListener('click', () => selectElement(findElement(button.dataset.symbol))));
  if (q && filtered.length) selectElement(filtered[0]);
}

function activateReference(tabName, reveal = true) {
  if (reveal && state.referenceCollapsed) setReferenceCollapsed(false);
  state.activeReference = tabName;
  const elementsActive = tabName === 'elements';
  const ionsActive = tabName === 'ions';
  const guideActive = tabName === 'guide';
  const prefixesActive = tabName === 'prefixes';
  $('#elements-tab').setAttribute('aria-selected', String(elementsActive));
  $('#ions-tab').setAttribute('aria-selected', String(ionsActive));
  $('#guide-tab').setAttribute('aria-selected', String(guideActive));
  $('#prefixes-tab').setAttribute('aria-selected', String(prefixesActive));
  $('#elements-panel').hidden = !elementsActive;
  $('#ions-panel').hidden = !ionsActive;
  $('#guide-panel').hidden = !guideActive;
  $('#prefixes-panel').hidden = !prefixesActive;
  $('.search-field').hidden = guideActive;
  $('#reference-search').value = '';
  filterReference('');
  const url = new URL(location.href);
  url.searchParams.set('ref', tabName);
  history.replaceState(null, '', url);
}

function setReferenceCollapsed(collapsed) {
  state.referenceCollapsed = collapsed;
  $('.app-shell').classList.toggle('reference-collapsed', collapsed);
  $('.reference-panel').classList.toggle('is-collapsed', collapsed);
  $('#reference-content').hidden = collapsed;
  const toggle = $('#reference-toggle');
  toggle.setAttribute('aria-expanded', String(!collapsed));
  toggle.setAttribute('aria-label', collapsed ? 'Show reference shelf' : 'Hide reference shelf');
  toggle.title = `${collapsed ? 'Show' : 'Hide'} reference shelf (Alt+R)`;
  try { localStorage.setItem(REFERENCE_STORAGE_KEY, String(collapsed)); } catch {}
  const url = new URL(location.href);
  if (collapsed) url.searchParams.set('panel', 'closed');
  else url.searchParams.delete('panel');
  history.replaceState(null, '', url);
}

function toggleReferenceShelf() {
  setReferenceCollapsed(!state.referenceCollapsed);
}

async function clearPage() {
  const hasContent = state.entries.length || state.workSteps.length || getEditorText();
  if (hasContent && !(await confirmAction({
    eyebrow: 'Clear the notepad',
    title: 'Clear this entire page?',
    body: 'Everything on this page — every step and every saved result — will be permanently removed.',
    confirmLabel: 'Clear page',
    cancelLabel: 'Keep my notes'
  }))) return;
  state.entries = [];
  state.workSteps = [];
  state.activeStep = null;
  parkedDraftHTML = '';
  state.editingEntryId = null;
  saveEntries();
  saveWorkSteps();
  clearEditor();
  renderWorkSteps();
  renderResults();
  showToast('Page cleared');
  input.focus();
}

function entryPlainText(entry) {
  if (entry.kind === 'balance') return entry.plain;
  if (entry.kind === 'convert') return `${entry.sourceText} = ${entry.resultText}`;
  if (entry.kind === 'fraction') return entry.plain;
  if (entry.kind === 'work' && Array.isArray(entry.steps)) {
    return entry.steps.map((step, index) => `Step ${index + 1}: ${notebookHTMLText(step.html || '')}`).join('\n');
  }
  if (entry.kind === 'note' && entry.html) return notebookHTMLText(entry.html);
  return entry.text || entry.input;
}

function downloadCanvas(canvas, filename) {
  canvas.toBlob(blob => {
    if (!blob) return showToast('Could not create that image');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }, 'image/png');
}

// Exports are rendered at a higher pixel density than their layout size, so they
// stay sharp when dropped into a document or slide. Keep a consistent sheet width
// and generous paper margins: tightly cropping around short work makes Word scale
// the writing up until it looks oversized and destroys the intended page rhythm.
const EXPORT_PAD = 96;
const EXPORT_CONTENT_WIDTH = 1210;
const EXPORT_MAX_PIXELS = 40e6;

// Widest x any draw call reached during the measure pass, and the width the final
// canvas was cut to (used for rules that should span the page).
let exportMaxX = 0;
let exportPageWidth = EXPORT_PAD * 2 + EXPORT_CONTENT_WIDTH;

function trackInk(x) {
  if (x > exportMaxX) exportMaxX = x;
}

function exportScale(width, height) {
  for (const scale of [4, 3, 2]) {
    if (width * height * scale * scale <= EXPORT_MAX_PIXELS) return scale;
  }
  return 1;
}

function setupCanvas(width, height) {
  const canvas = document.createElement('canvas');
  const scale = exportScale(width, height);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f4f0e5';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(16,39,43,.08)';
  ctx.lineWidth = 1;
  for (let y = 46; y < height; y += 42) {
    ctx.beginPath();
    ctx.moveTo(0, y + .5);
    ctx.lineTo(width, y + .5);
    ctx.stroke();
  }
  return { canvas, ctx };
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = Infinity) {
  const words = String(text).split(/\s+/);
  let line = '', lines = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      trackInk(x + ctx.measureText(line).width);
      line = word; y += lineHeight; lines++;
      if (lines >= maxLines) break;
    } else line = test;
  }
  if (lines < maxLines && line) {
    ctx.fillText(line, x, y);
    trackInk(x + ctx.measureText(line).width);
  }
  return y; // last baseline — callers add whatever descent they need
}

function notebookExportLines(html) {
  const holder = document.createElement('div');
  holder.innerHTML = sanitizeNotebookHTML(html || '');
  const lines = [[]];
  const newLine = () => { if (lines.at(-1).length) lines.push([]); };
  const addText = (text, script = '', highlight = false, strike = false) => {
    String(text).split(/\n/).forEach((part, index) => {
      if (index) newLine();
      if (part) lines.at(-1).push({ type: 'text', value: part, script, highlight, strike });
    });
  };
  const inlineItems = (root, inheritedScript = '', inheritedHighlight = false, inheritedStrike = false) => {
    const items = [];
    if (!root) return items;
    const walkInline = (node, script = inheritedScript, highlight = inheritedHighlight, strike = inheritedStrike) => {
      if (node.nodeType === Node.TEXT_NODE) { if (node.nodeValue) items.push({ type: 'text', value: node.nodeValue, script, highlight, strike }); return; }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const nextScript = node.tagName === 'SUP' ? 'sup' : node.tagName === 'SUB' ? 'sub' : script;
      const nextHighlight = node.tagName === 'MARK' ? markColorName(node) : highlight;
      const nextStrike = node.tagName === 'S' || strike;
      [...node.childNodes].forEach(child => walkInline(child, nextScript, nextHighlight, nextStrike));
    };
    [...root.childNodes].forEach(node => walkInline(node));
    return items;
  };
  const walk = (node, script = '', highlight = false, strike = false) => {
    if (node.nodeType === Node.TEXT_NODE) return addText(node.nodeValue, script, highlight, strike);
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.classList.contains('lewis-diagram')) {
      const model = lewisParse(node.getAttribute('data-lewis'));
      if (model) lines.at(-1).push({ type: 'lewis', model, ...lewisExportSize(model) });
      return;
    }
    if (node.classList.contains('live-fraction')) {
      lines.at(-1).push({
        type: 'fraction',
        numerator: inlineItems(node.querySelector('.live-numerator'), '', highlight, strike),
        denominator: inlineItems(node.querySelector('.live-denominator'), '', highlight, strike)
      });
      return;
    }
    if (node.tagName === 'BR') return newLine();
    const nextScript = node.tagName === 'SUP' ? 'sup' : node.tagName === 'SUB' ? 'sub' : script;
    const nextHighlight = node.tagName === 'MARK' ? markColorName(node) : highlight;
    const nextStrike = node.tagName === 'S' || strike;
    [...node.childNodes].forEach(child => walk(child, nextScript, nextHighlight, nextStrike));
    if (['DIV', 'P'].includes(node.tagName)) newLine();
  };
  [...holder.childNodes].forEach(node => walk(node));
  return lines.filter(line => line.length);
}

function exportRunFont(script = '', size = 30) {
  return `${script ? Math.round(size * .62) : size}px Consolas`;
}

function exportRunsWidth(ctx, runs, size = 30) {
  return runs.reduce((total, run) => {
    ctx.font = exportRunFont(run.script, size);
    return total + ctx.measureText(run.value).width;
  }, 0);
}

function drawExportRuns(ctx, runs, x, baseline, size = 30) {
  let cursor = x;
  runs.forEach(run => {
    ctx.font = exportRunFont(run.script, size);
    const offset = run.script === 'sup' ? -size * .43 : run.script === 'sub' ? size * .25 : 0;
    const width = ctx.measureText(run.value).width;
    if (run.highlight) {
      const color = ctx.fillStyle;
      ctx.fillStyle = highlightHex(run.highlight);
      ctx.fillRect(cursor - 2, baseline + offset - size * .84, width + 4, size * 1.1);
      ctx.fillStyle = color;
    }
    ctx.fillText(run.value, cursor, baseline + offset);
    if (run.strike) {
      const pen = ctx.strokeStyle;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = Math.max(1.5, size * .06);
      ctx.beginPath();
      ctx.moveTo(cursor, baseline + offset - size * .28);
      ctx.lineTo(cursor + width, baseline + offset - size * .28);
      ctx.stroke();
      ctx.strokeStyle = pen;
    }
    cursor += width;
  });
  trackInk(cursor);
  return cursor;
}

// Lines are spaced by what they actually need: a fraction reaches far above and
// below its baseline, a plain line of text barely does. Spacing every line as if it
// held a fraction is what used to leave half the page empty.
const LINE_GAP = 10;
function lineHasFraction(items) { return items.some(item => item.type === 'fraction'); }
// Lewis diagrams sit centred on the text's mid-height, 10px above the baseline.
function lineLewisHeight(items) { return items.reduce((tallest, item) => item.type === 'lewis' ? Math.max(tallest, item.height) : tallest, 0); }
function lineAscent(items) { return Math.max(lineHasFraction(items) ? 52 : 30, lineLewisHeight(items) / 2 + 10); }
function lineDescent(items) { return Math.max(lineHasFraction(items) ? 34 : 8, lineLewisHeight(items) / 2 - 10); }
function lineRowHeight(items) { return Math.max(lineHasFraction(items) ? 86 : 42, lineLewisHeight(items) + 14); }

function drawNotebookExportLine(ctx, items, x, y, maxWidth) {
  const rowHeight = lineRowHeight(items);
  let cursor = x;
  let baseline = y;
  const newRow = () => { cursor = x; baseline += rowHeight; };
  const writeText = item => {
    const words = String(item.value).split(/(\s+)/).filter(Boolean);
    words.forEach(word => {
      const run = { type: 'text', value: word, script: item.script, highlight: item.highlight, strike: item.strike };
      ctx.font = exportRunFont(run.script);
      const width = ctx.measureText(word).width;
      if (cursor > x && cursor + width > x + maxWidth) newRow();
      cursor = drawExportRuns(ctx, [run], cursor, baseline);
    });
  };
  items.forEach(item => {
    if (item.type === 'text') return writeText(item);
    if (item.type === 'lewis') {
      if (cursor > x && cursor + item.width + 12 > x + maxWidth) newRow();
      cursor += drawLewis(ctx, item.model, cursor + 6, baseline - 10) + 12;
      return;
    }
    const numerator = item.numerator.length ? item.numerator : [{ type: 'text', value: '1', script: '' }];
    const denominator = item.denominator.length ? item.denominator : [{ type: 'text', value: '1', script: '' }];
    const width = Math.max(138, exportRunsWidth(ctx, numerator, 27) + 30, exportRunsWidth(ctx, denominator, 27) + 30);
    if (cursor > x && cursor + width > x + maxWidth) newRow();
    ctx.textAlign = 'left';
    const numeratorX = cursor + width / 2 - exportRunsWidth(ctx, numerator, 27) / 2;
    const denominatorX = cursor + width / 2 - exportRunsWidth(ctx, denominator, 27) / 2;
    drawExportRuns(ctx, numerator, numeratorX, baseline - 28, 27);
    ctx.strokeStyle = '#10272b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cursor, baseline - 15); ctx.lineTo(cursor + width, baseline - 15); ctx.stroke();
    drawExportRuns(ctx, denominator, denominatorX, baseline + 22, 27);
    cursor += width + 26;
    trackInk(cursor - 26);
  });
  return baseline;
}

function measureNotebookExportLine(ctx, items, maxWidth) {
  const rowHeight = lineRowHeight(items);
  let cursor = 0;
  let baseline = 0;
  const newRow = () => { cursor = 0; baseline += rowHeight; };
  items.forEach(item => {
    if (item.type === 'text') {
      String(item.value).split(/(\s+)/).filter(Boolean).forEach(word => {
        ctx.font = exportRunFont(item.script);
        const width = ctx.measureText(word).width;
        if (cursor > 0 && cursor + width > maxWidth) newRow();
        cursor += width;
      });
      return;
    }
    if (item.type === 'lewis') {
      if (cursor > 0 && cursor + item.width + 12 > maxWidth) newRow();
      cursor += item.width + 18;
      return;
    }
    const numerator = item.numerator.length ? item.numerator : [{ type: 'text', value: '1', script: '' }];
    const denominator = item.denominator.length ? item.denominator : [{ type: 'text', value: '1', script: '' }];
    const width = Math.max(138, exportRunsWidth(ctx, numerator, 27) + 30, exportRunsWidth(ctx, denominator, 27) + 30);
    if (cursor > 0 && cursor + width > maxWidth) newRow();
    cursor += width + 26;
  });
  return baseline;
}

function stepExportLines(step) {
  const lines = notebookExportLines(step.html);
  if (!lines.length && step.text) lines.push([{ type: 'text', value: step.text }]);
  return lines;
}

function workStepContentHeight(ctx, step) {
  const lines = stepExportLines(step);
  let height = 0;
  lines.forEach((line, index) => {
    height += lineAscent(line) + measureNotebookExportLine(ctx, line, EXPORT_CONTENT_WIDTH) + lineDescent(line);
    if (index < lines.length - 1) height += LINE_GAP;
  });
  return height;
}

// Keep each frozen step in the same spacious vertical block used by the original
// worksheet renderer, but draw only on the clean ruled paper. Removing the old
// card chrome must not also collapse the step geometry.
const WORK_STEP_TOP_SPACE = 72;
const WORK_STEP_BOTTOM_SPACE = 34;
const WORK_STEP_GAP = 26;

function workStepBlockHeight(ctx, step) {
  return Math.max(202, WORK_STEP_TOP_SPACE + workStepContentHeight(ctx, step) + WORK_STEP_BOTTOM_SPACE);
}

function drawWorkEntry(ctx, entry, y) {
  const steps = entry.steps?.length ? entry.steps : [{ html: entry.html || '', text: entry.text || entry.input || '' }];
  steps.forEach((step, stepIndex) => {
    const lines = stepExportLines(step);
    ctx.fillStyle = '#10272b';
    let lineY = y + WORK_STEP_TOP_SPACE;
    lines.forEach((line, index) => {
      lineY += lineAscent(line);
      lineY = drawNotebookExportLine(ctx, line, EXPORT_PAD, lineY, EXPORT_CONTENT_WIDTH);
      lineY += lineDescent(line) + (index < lines.length - 1 ? LINE_GAP : 0);
    });
    y += workStepBlockHeight(ctx, step);
    if (stepIndex < steps.length - 1) y += WORK_STEP_GAP;
  });
  return y;
}

// Separator between entries on a full-page export; skipped after the last one so
// the crop does not keep a rule and a band of empty paper.
function finishEntry(ctx, y, rule) {
  if (!rule) return y;
  ctx.strokeStyle = 'rgba(16,39,43,.25)';
  ctx.lineWidth = 1.5; // fraction bars leave a 3px pen behind
  ctx.beginPath(); ctx.moveTo(EXPORT_PAD, y + 12); ctx.lineTo(exportPageWidth - EXPORT_PAD, y + 12); ctx.stroke();
  return y + 46;
}

function drawEntry(ctx, entry, y, index, { rule = true } = {}) {
  if (entry.kind === 'work' && Array.isArray(entry.steps)) return finishEntry(ctx, drawWorkEntry(ctx, entry, y) + 8, rule);
  y += 30;
  ctx.fillStyle = '#10272b';
  if (entry.kind === 'fraction') {
    let x = EXPORT_PAD;
    entry.factors.forEach((factor, i) => {
      const width = Math.max(190, ctx.measureText(`${factor.numValue} ${factor.numUnit}`).width + 30, ctx.measureText(`${factor.denValue} ${factor.denUnit}`).width + 30);
      ctx.font = '26px Georgia'; ctx.textAlign = 'center';
      ctx.fillText(`${factor.numValue} ${factor.numUnit}`, x + width/2, y);
      ctx.lineWidth = 2; ctx.strokeStyle = '#10272b'; ctx.beginPath(); ctx.moveTo(x, y + 13); ctx.lineTo(x + width, y + 13); ctx.stroke();
      ctx.fillText(`${factor.denValue} ${factor.denUnit}`, x + width/2, y + 49);
      x += width + 30;
      trackInk(x - 30);
      if (i < entry.factors.length - 1) { ctx.fillStyle = '#ff8b4b'; ctx.fillText('×', x - 15, y + 22); ctx.fillStyle = '#10272b'; }
    });
    if (entry.numericResult != null) {
      ctx.textAlign = 'left'; ctx.fillStyle = '#087478'; ctx.font = '700 27px Georgia';
      const label = `= ${formatNumber(entry.numericResult)}`;
      const labelX = Math.min(x, EXPORT_PAD + EXPORT_CONTENT_WIDTH - 100);
      ctx.fillText(label, labelX, y + 22);
      trackInk(labelX + ctx.measureText(label).width);
    }
    ctx.textAlign = 'left'; y += 62;
  } else {
    ctx.font = entry.kind === 'balance' ? '44px Georgia' : '36px Georgia';
    y = drawWrappedText(ctx, entryPlainText(entry), EXPORT_PAD, y, EXPORT_CONTENT_WIDTH, 54) + 12;
  }
  return finishEntry(ctx, y, rule);
}

// Two passes: the first learns the required height, then the second draws on a
// consistent paper-width canvas. Width stays fixed so every exported worksheet has
// the same type scale when inserted into Word, regardless of how wide its math is.
function renderExport(draw) {
  exportMaxX = 0;
  exportPageWidth = EXPORT_PAD * 2 + EXPORT_CONTENT_WIDTH;
  const measureCtx = document.createElement('canvas').getContext('2d');
  measureCtx.textBaseline = 'alphabetic';
  const height = Math.ceil(draw(measureCtx) + 14);
  const width = EXPORT_PAD * 2 + EXPORT_CONTENT_WIDTH;
  exportPageWidth = width;
  const { canvas, ctx } = setupCanvas(width, height);
  draw(ctx);
  return canvas;
}

function exportEntry(entry) {
  const canvas = renderExport(ctx => drawEntry(ctx, entry, EXPORT_PAD - 22, 0, { rule: false }));
  downloadCanvas(canvas, `digital-notepad-${entry.kind}.png`);
  showToast('PNG created');
}

function exportAll() {
  if (!state.entries.length) return showToast('Write something before exporting');
  const entries = [...state.entries].reverse();
  const canvas = renderExport(ctx => {
    let y = EXPORT_PAD - 22;
    entries.forEach((entry, index) => { y = drawEntry(ctx, entry, y, index, { rule: index < entries.length - 1 }); });
    return y;
  });
  downloadCanvas(canvas, 'digital-notepad-page.png');
  showToast('Full page PNG created');
}

function editorContains(node) {
  return Boolean(node && (node === input || input.contains(node)));
}

function rememberEditorRange() {
  const selection = getSelection();
  if (!selection?.rangeCount || !editorContains(selection.anchorNode)) return;
  savedEditorRange = selection.getRangeAt(0).cloneRange();
}

function restoreEditorRange() {
  const selection = getSelection();
  selection.removeAllRanges();
  if (savedEditorRange && editorContains(savedEditorRange.commonAncestorContainer)) {
    selection.addRange(savedEditorRange);
    return savedEditorRange;
  }
  const range = document.createRange();
  range.selectNodeContents(input);
  range.collapse(false);
  selection.addRange(range);
  return range;
}

function updateNotationButtons() {
  $$('[data-format]').forEach(button => {
    let active = false;
    try { active = document.queryCommandState(button.dataset.format); } catch {}
    button.setAttribute('aria-pressed', String(active));
  });
}

function toggleNotation(format) {
  input.focus();
  restoreEditorRange();
  document.execCommand(format, false);
  rememberEditorRange();
  updateNotationButtons();
  const button = $(`[data-format="${format}"]`);
  if (button) {
    button.classList.remove('notation-feedback');
    void button.offsetWidth;
    button.classList.add('notation-feedback');
  }
  queueDraftSave();
}

// execCommand('hiliteColor') writes a style attribute, which the page's
// Content-Security-Policy blocks. The mark element is built directly instead.
// Wrap each intersecting text run in its own mark. Never extract across element
// boundaries: doing that tears stacked fractions (numerator/bar/denominator) apart.
// The editor is mutated directly (fractions, highlights, notation), which the
// browser's own undo stack does not track. Snapshots are kept here instead.
const HISTORY_LIMIT = 80;
const editorHistory = [];
let typingBurstTimer = null;

function pushHistory(html = input.innerHTML) {
  if (editorHistory.at(-1) === html) return;
  editorHistory.push(html);
  if (editorHistory.length > HISTORY_LIMIT) editorHistory.shift();
  updateUndoButton();
}

function updateUndoButton() {
  const button = $('#undo-button');
  if (button) button.disabled = !editorHistory.length;
}

function undoEditor() {
  if (!editorHistory.length) {
    showToast('Nothing to undo');
    return;
  }
  clearTimeout(typingBurstTimer);
  typingBurstTimer = null;
  const entry = editorHistory.pop();
  // Deleting or inserting a step snapshots the whole page, not just the editor.
  if (entry?.page) restorePageSnapshot(entry);
  else input.innerHTML = sanitizeNotebookHTML(entry);
  input.focus();
  const caret = document.createRange();
  caret.selectNodeContents(input);
  caret.collapse(false);
  const selection = getSelection();
  selection.removeAllRanges();
  selection.addRange(caret);
  savedEditorRange = caret.cloneRange();
  updateUndoButton();
  inferMode(getEditorText());
  updateEditorStatus();
  queueDraftSave();
}

// Crossing out is how cancelled units get shown. Struck text stays visible in the
// step you are on, and is dropped when that step is carried into the next one.
function struckAncestor(node) {
  return node.parentElement?.closest('s') || null;
}

function crossOutSelection() {
  const selection = getSelection();
  if (!selection?.rangeCount || selection.isCollapsed || !editorContains(selection.anchorNode)) {
    showToast('Select what you want to cross out first');
    return;
  }
  input.focus();
  const range = restoreEditorRange();
  if (range.collapsed) {
    showToast('Select what you want to cross out first');
    return;
  }
  const struck = [...input.querySelectorAll('s')].filter(node => range.intersectsNode(node));
  pushHistory();
  if (struck.length) {
    struck.forEach(node => {
      const parent = node.parentNode;
      while (node.firstChild) parent.insertBefore(node.firstChild, node);
      parent.removeChild(node);
    });
    input.normalize();
  } else if (!wrapRangeInElement(range, 's')) {
    showToast('Select some writing, not just a fraction bar');
    return;
  }
  input.innerHTML = sanitizeNotebookHTML(input.innerHTML);
  rememberEditorRange();
  queueDraftSave();
}

function stripStruckContent(html) {
  const template = document.createElement('template');
  template.innerHTML = withoutStyleAttributes(html);
  template.content.querySelectorAll('s').forEach(node => node.remove());
  // A fraction whose halves were both cancelled is no longer worth carrying forward.
  template.content.querySelectorAll('.live-fraction').forEach(fraction => {
    const numerator = fraction.querySelector('.live-numerator');
    const denominator = fraction.querySelector('.live-denominator');
    const empty = node => !node || !node.textContent.replaceAll('​', '').trim();
    if (empty(numerator) && empty(denominator)) fraction.remove();
  });
  return template.innerHTML;
}

// Wrap each intersecting text run in its own element. Never extract across element
// boundaries: doing that tears stacked fractions (numerator/bar/denominator) apart.
function wrapRangeInElement(range, tagName, className = '') {
  const targets = [];
  const walker = document.createTreeWalker(input, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (!range.intersectsNode(node)) continue;
    if (node.parentElement?.closest('.live-fraction-line')) continue;
    if (!node.nodeValue.replaceAll('​', '').trim()) continue;
    const start = node === range.startContainer ? range.startOffset : 0;
    const end = node === range.endContainer ? range.endOffset : node.nodeValue.length;
    if (end <= start) continue;
    targets.push({ node, start, end });
  }
  if (!targets.length) return null;

  let last = null;
  targets.forEach(({ node, start, end }) => {
    const existing = node.parentElement?.closest(tagName);
    if (existing && start === 0 && end === node.nodeValue.length) {
      if (className) existing.className = className;
      last = existing;
      return;
    }
    const piece = document.createRange();
    piece.setStart(node, start);
    piece.setEnd(node, end);
    const wrapper = document.createElement(tagName);
    if (className) wrapper.className = className;
    wrapper.append(piece.extractContents());
    piece.insertNode(wrapper);
    last = wrapper;
  });
  return last;
}

function wrapRangeInMark(range, colorName) {
  return wrapRangeInElement(range, 'mark', `mark-${colorName}`);
}

function highlightSelection(colorName = state.highlightColor) {
  const selection = getSelection();
  if (!selection?.rangeCount || selection.isCollapsed || !editorContains(selection.anchorNode)) {
    showToast('Select the writing you want to highlight first');
    return;
  }
  input.focus();
  const range = restoreEditorRange();
  if (range.collapsed) {
    showToast('Select the writing you want to highlight first');
    return;
  }
  pushHistory();
  const mark = wrapRangeInMark(range, HIGHLIGHT_COLORS.some(color => color.name === colorName) ? colorName : 'yellow');
  if (!mark) {
    showToast('Select some writing, not just a fraction bar');
    return;
  }
  input.normalize();
  const selected = document.createRange();
  selected.selectNodeContents(mark);
  selection.removeAllRanges();
  selection.addRange(selected);
  rememberEditorRange();
  queueDraftSave();
}

function clearHighlight() {
  const selection = getSelection();
  if (!selection?.rangeCount || selection.isCollapsed || !editorContains(selection.anchorNode)) {
    showToast('Select the highlighted writing first');
    return;
  }
  input.focus();
  const range = restoreEditorRange();
  const marks = [...input.querySelectorAll('mark')].filter(mark => range.intersectsNode(mark));
  if (!marks.length) {
    showToast('That writing is not highlighted');
    return;
  }
  pushHistory();
  marks.forEach(mark => {
    const parent = mark.parentNode;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
  });
  input.normalize();
  input.innerHTML = sanitizeNotebookHTML(input.innerHTML);
  rememberEditorRange();
  queueDraftSave();
}

function setHighlightColor(colorName) {
  state.highlightColor = HIGHLIGHT_COLORS.some(color => color.name === colorName) ? colorName : 'yellow';
  try { localStorage.setItem(HIGHLIGHT_STORAGE_KEY, state.highlightColor); } catch {}
  $('#highlight-button').dataset.color = state.highlightColor;
  $$('[data-highlight]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.highlight === state.highlightColor));
  });
}

function setHighlightMenuOpen(open) {
  $('#highlight-menu').hidden = !open;
  $('#highlight-more').setAttribute('aria-expanded', String(open));
}


// Text that a new fraction may pull up into its numerator: only what sits after the
// last stacked fraction that closed before the caret. Walking the whole editor let a
// second fraction reach back inside the first one and swallow it.
function numeratorSource(range) {
  const parts = [];
  let text = '';
  const walker = document.createTreeWalker(input, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'BR') { parts.push({ node: null, start: text.length, length: 1 }); text += '\n'; }
      // A diagram ends the numerator's reach too, or "/" would pull it into the fraction.
      if (node.classList.contains('lewis-diagram')) { parts.length = 0; text = ''; }
      continue;
    }
    if (node.parentElement?.closest('.live-fraction')) { parts.length = 0; text = ''; continue; }
    const atCaret = node === range.startContainer;
    const value = atCaret ? node.nodeValue.slice(0, range.startOffset) : node.nodeValue;
    parts.push({ node, start: text.length, length: value.length });
    text += value;
    if (atCaret) break;
  }
  return { parts, text };
}

function fractionBoundary(text) {
  const operators = ['\n', '*', '×', '=', '+'];
  let boundary = operators.reduce((latest, operator) => Math.max(latest, text.lastIndexOf(operator) + 1), 0);
  if (boundary === 0) {
    const commandPrefix = text.match(/^(?:fraction|f)\s+/i);
    if (commandPrefix) boundary = commandPrefix[0].length;
  }
  return boundary;
}

function insertStackedFraction(fromSlash = false) {
  input.focus();
  let range = restoreEditorRange();
  const selection = getSelection();
  if (range.startContainer.parentElement?.closest('.live-fraction')) return false;

  let numerator = selection.toString().trim();
  if (range.collapsed && fromSlash && range.startContainer.nodeType === Node.TEXT_NODE) {
    const { parts, text } = numeratorSource(range);
    const boundary = fractionBoundary(text);
    const candidate = text.slice(boundary);
    numerator = candidate.replace(/^[\s\u200B]+|[\s\u200B]+$/g, '');
    if (numerator) {
      const offset = boundary + candidate.indexOf(numerator);
      const part = parts.find(entry => entry.node && offset < entry.start + entry.length);
      if (part) range.setStart(part.node, offset - part.start);
      else numerator = '';
    }
  }
  const numeratorContents = !range.collapsed ? range.extractContents() : null;
  const fraction = createLiveFraction(numerator || '\u200B', '\u200B');
  if (numeratorContents) {
    const top = fraction.querySelector('.live-numerator');
    top.textContent = '';
    top.append(numeratorContents);
    // The caret sits on a spacer after the previous fraction; do not carry it up.
    top.normalize();
    const lead = top.firstChild;
    if (lead?.nodeType === Node.TEXT_NODE) lead.nodeValue = lead.nodeValue.replace(/^[\s\u200B]+/, '');
    if (!top.textContent) top.textContent = '\u200B';
  }
  range.insertNode(fraction);

  const bottomText = fraction.querySelector('.live-denominator').firstChild;
  const denominatorRange = document.createRange();
  denominatorRange.setStart(bottomText, bottomText.nodeValue.length);
  denominatorRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(denominatorRange);
  savedEditorRange = denominatorRange.cloneRange();
  queueDraftSave();
  return true;
}

function createLiveFraction(numerator, denominator) {
  const fraction = document.createElement('span');
  fraction.className = 'live-fraction';
  const top = document.createElement('span');
  top.className = 'live-numerator';
  top.textContent = numerator || '\u200B';
  const line = document.createElement('span');
  line.className = 'live-fraction-line';
  line.setAttribute('contenteditable', 'false');
  const bottom = document.createElement('span');
  bottom.className = 'live-denominator';
  const bottomText = document.createTextNode(denominator || '\u200B');
  bottom.append(bottomText);
  fraction.append(top, line, bottom);
  return fraction;
}

function buildPastedConversionQuestion() {
  const raw = $('#paste-question-input').value.trim();
  const match = raw.match(/^\s*([+-]?(?:\d[\d,]*(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)\s*([a-zA-Zµμ°]+)\s*(?:=|→|to)\s*\??\s*([a-zA-Zµμ°]+)\s*\??\s*$/i);
  if (!match) return showToast('Use a question like: 1.7 pm = ? Tm');
  const [, amount, sourceUnit, targetUnit] = match;
  const fraction = createLiveFraction(`${amount.replaceAll(',', '')} ${sourceUnit}`, '1');
  const spacer = getEditorText() ? document.createElement('div') : null;
  if (spacer) input.append(spacer);
  input.append(fraction);
  const tail = document.createTextNode(`  →  ? ${targetUnit}`);
  input.append(tail);
  const range = document.createRange();
  range.setStart(tail, tail.nodeValue.length); range.collapse(true);
  const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
  savedEditorRange = range.cloneRange();
  $('#paste-question-dialog').close();
  $('#paste-question-input').value = '';
  input.focus();
  queueDraftSave();
  inferMode(getEditorText());
  showToast('Question added to the notepad');
}

function leaveFraction(denominator) {
  const fraction = denominator.closest('.live-fraction');
  const spacer = document.createTextNode('\u00A0');
  fraction.after(spacer);
  const range = document.createRange();
  range.setStart(spacer, 1);
  range.collapse(true);
  const selection = getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  savedEditorRange = range.cloneRange();
  updateEditorStatus();
  queueDraftSave();
}

// Space inside an exponent drops back to normal text. Anything after the caret
// stays an exponent, moved to its own <sup> past the space.
function leaveSuperscript(sup) {
  const selection = getSelection();
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const tail = document.createRange();
  tail.selectNodeContents(sup);
  tail.setStart(range.startContainer, range.startOffset);
  const rest = tail.extractContents();
  const spacer = document.createTextNode(' ');
  sup.after(spacer);
  if (rest.textContent.replaceAll('​', '')) {
    const restSup = document.createElement('sup');
    restSup.append(rest);
    spacer.after(restSup);
  }
  if (!sup.textContent.replaceAll('​', '')) sup.remove();
  const caret = document.createRange();
  caret.setStart(spacer, 1);
  caret.collapse(true);
  selection.removeAllRanges();
  selection.addRange(caret);
  savedEditorRange = caret.cloneRange();
  afterSuperscriptExit();
}

function afterSuperscriptExit() {
  inferMode(getEditorText());
  updateNotationButtons();
  updateEditorStatus();
  queueDraftSave();
}

function insertTextAtCaret(text) {
  const range = restoreEditorRange();
  range.deleteContents();
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  const nextRange = document.createRange();
  nextRange.setStart(textNode, textNode.nodeValue.length);
  nextRange.collapse(true);
  const selection = getSelection();
  selection.removeAllRanges();
  selection.addRange(nextRange);
  savedEditorRange = nextRange.cloneRange();
}

function caretIsAtEndOf(element) {
  const selection = getSelection();
  if (!selection?.rangeCount || !selection.isCollapsed) return false;
  const tail = document.createRange();
  tail.selectNodeContents(element);
  try { tail.setStart(selection.anchorNode, selection.anchorOffset); }
  catch { return false; }
  return !tail.toString().replaceAll('\u200B', '');
}

function caretTextPoint() {
  const selection = getSelection();
  if (!selection?.rangeCount || !selection.isCollapsed) return null;
  let node = selection.anchorNode;
  let offset = selection.anchorOffset;
  if (node?.nodeType === Node.TEXT_NODE) return { node, offset };
  if (node?.nodeType !== Node.ELEMENT_NODE) return null;
  if (offset < 1) return null;
  node = node.childNodes[offset - 1] || null;
  while (node?.lastChild) node = node.lastChild;
  return node?.nodeType === Node.TEXT_NODE ? { node, offset: node.nodeValue.length } : null;
}

function plainSlashPoint() {
  const atCaret = caretTextPoint();
  if (atCaret?.offset > 0 && atCaret.node.nodeValue[atCaret.offset - 1] === '/' && !elementFromNode(atCaret.node)?.closest('.live-fraction')) return atCaret;

  // Some contenteditable implementations leave the selection on the editor
  // rather than in the text node after inserting a character. Find the newly
  // inserted trailing slash directly so the shortcut still works.
  const walker = document.createTreeWalker(input, NodeFilter.SHOW_TEXT);
  let node;
  let fallback = null;
  while ((node = walker.nextNode())) {
    if (node.nodeValue.endsWith('/') && !elementFromNode(node)?.closest('.live-fraction')) fallback = { node, offset: node.nodeValue.length };
  }
  return fallback;
}

function convertTrailingSlash() {
  if (closestAtCaret('.live-fraction')) return false;
  const selection = getSelection();
  if (!selection?.rangeCount || !selection.isCollapsed) return false;
  const point = plainSlashPoint();
  if (!point) return false;
  const textNode = point.node;
  const offset = point.offset;
  const slashRange = document.createRange();
  slashRange.setStart(textNode, offset - 1);
  slashRange.setEnd(textNode, offset);
  slashRange.deleteContents();
  slashRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(slashRange);
  savedEditorRange = slashRange.cloneRange();
  return insertStackedFraction(true);
}

function continueFactorChain(denominator) {
  leaveFraction(denominator);
  insertTextAtCaret(' × ');
  inferMode(getEditorText());
  queueDraftSave();
}

function insertNotebookLine() {
  const denominator = getSelection().anchorNode?.parentElement?.closest('.live-denominator');
  if (denominator) leaveFraction(denominator);
  const range = restoreEditorRange();
  range.deleteContents();
  const lineBreak = document.createElement('br');
  const caretAnchor = document.createTextNode('\u200B');
  range.insertNode(lineBreak);
  lineBreak.after(caretAnchor);
  const nextRange = document.createRange();
  nextRange.setStart(caretAnchor, 1);
  nextRange.collapse(true);
  const selection = getSelection();
  selection.removeAllRanges();
  selection.addRange(nextRange);
  savedEditorRange = nextRange.cloneRange();
  queueDraftSave();
}

function autoFormatNumberAtCaret() {
  const selection = getSelection();
  if (!selection?.rangeCount || !selection.isCollapsed || selection.anchorNode?.nodeType !== Node.TEXT_NODE) return false;
  const node = selection.anchorNode;
  const text = node.nodeValue || '';
  const caret = selection.anchorOffset;
  const before = text.slice(0, caret);
  const match = before.match(/(^|[^0-9,])(-?)(\d[\d,]*)(\.\d*)?$/);
  if (!match) return false;
  const [, boundary, sign, integer, decimal = ''] = match;
  const digits = integer.replaceAll(',', '');
  if (digits.length < 4) return false;
  const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (formatted === integer) return false;
  const start = caret - (sign.length + integer.length + decimal.length);
  node.nodeValue = `${text.slice(0, start)}${sign}${formatted}${decimal}${text.slice(caret)}`;
  const range = document.createRange();
  range.setStart(node, caret + formatted.length - integer.length);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  savedEditorRange = range.cloneRange();
  return true;
}

input.addEventListener('input', event => {
  autoFormatNumberAtCaret();
  if (convertTrailingSlash()) {
    inferMode(getEditorText());
    updateEditorStatus();
    return;
  }
  inferMode(getEditorText());
  rememberEditorRange();
  updateNotationButtons();
  queueDraftSave();
  if (event.inputType?.startsWith('insert')) {
    requestAnimationFrame(() => {
      if (convertTrailingSlash()) {
        inferMode(getEditorText());
        updateEditorStatus();
      }
    });
  }
});
input.addEventListener('beforeinput', event => {
  if (!typingBurstTimer) pushHistory();
  clearTimeout(typingBurstTimer);
  typingBurstTimer = setTimeout(() => { typingBurstTimer = null; }, 600);
  if (event.inputType !== 'insertText' || event.isComposing) return;
  if (event.data === '/' && !closestAtCaret('.live-fraction')) {
    event.preventDefault();
    rememberEditorRange();
    insertStackedFraction(true);
  } else if ((event.data === '*' || event.data === '×') && closestAtCaret('.live-denominator')) {
    event.preventDefault();
    continueFactorChain(closestAtCaret('.live-denominator'));
  } else if (event.data === ' ') {
    const sup = closestAtCaret('sup');
    if (sup && editorContains(sup)) {
      event.preventDefault();
      leaveSuperscript(sup);
    } else if (document.queryCommandState('superscript')) {
      // Exponent toggled on but nothing typed yet: no <sup> exists, only the pending style.
      event.preventDefault();
      insertTextAtCaret(' ');
      afterSuperscriptExit();
    }
  }
});
input.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'z') {
    event.preventDefault();
    undoEditor();
    return;
  }
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.isComposing) {
    const selection = getSelection();
    if (!closestAtCaret('.live-fraction')) {
      event.preventDefault();
      rememberEditorRange();
      insertStackedFraction(true);
    }
  }
  const denominator = closestAtCaret('.live-denominator');
  if (event.key === 'Tab' && (denominator || (event.target === input && document.activeElement === input))) {
    event.preventDefault();
    if (denominator) leaveFraction(denominator);
  }
  if (event.key === 'ArrowRight' && denominator && caretIsAtEndOf(denominator)) {
    event.preventDefault();
    leaveFraction(denominator);
  }
  if ((event.key === '*' || event.key === '×') && denominator) {
    event.preventDefault();
    continueFactorChain(denominator);
  }
  if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
    event.preventDefault();
    openStep(currentStepIndex() + (event.key === 'ArrowUp' ? -1 : 1));
    return;
  }
  if (event.key === 'Enter' && !event.isComposing) {
    event.preventDefault();
    if (event.altKey) nextWorkStep();
    else if (event.ctrlKey || event.metaKey) runNotebookCommand();
    else insertNotebookLine();
  }
});
input.addEventListener('keyup', event => {
  if ((event.key === '/' || event.code === 'Slash' || event.code === 'NumpadDivide') && convertTrailingSlash()) {
    inferMode(getEditorText());
    updateEditorStatus();
  }
});

document.addEventListener('selectionchange', () => {
  rememberEditorRange();
  if (editorContains(getSelection()?.anchorNode)) {
    updateNotationButtons();
    updateEditorStatus();
  }
});

$$('[data-format]').forEach(button => {
  button.addEventListener('mousedown', event => event.preventDefault());
  button.addEventListener('click', () => toggleNotation(button.dataset.format));
});
$('#strike-button').addEventListener('mousedown', event => event.preventDefault());
$('#strike-button').addEventListener('click', crossOutSelection);
$('#undo-button').addEventListener('mousedown', event => event.preventDefault());
$('#undo-button').addEventListener('click', undoEditor);
$('#highlight-button').addEventListener('mousedown', event => event.preventDefault());
$('#highlight-button').addEventListener('click', () => highlightSelection());
$('#highlight-more').addEventListener('mousedown', event => event.preventDefault());
$('#highlight-more').addEventListener('click', () => setHighlightMenuOpen($('#highlight-menu').hidden));
$('#highlight-menu').addEventListener('mousedown', event => event.preventDefault());
$$('[data-highlight]').forEach(button => button.addEventListener('click', () => {
  setHighlightColor(button.dataset.highlight);
  setHighlightMenuOpen(false);
  highlightSelection(button.dataset.highlight);
}));
$('#highlight-clear').addEventListener('mousedown', event => event.preventDefault());
$('#highlight-clear').addEventListener('click', () => { setHighlightMenuOpen(false); clearHighlight(); });
$('#lewis-button').addEventListener('mousedown', event => event.preventDefault());
$('#lewis-button').addEventListener('click', () => openLewisEditor());
input.addEventListener('click', event => {
  const diagram = event.target.closest('.lewis-diagram');
  if (diagram && editorContains(diagram)) openLewisEditor(diagram);
});
$('#paste-question-button').addEventListener('click', () => {
  $('#paste-question-dialog').showModal();
  $('#paste-question-input').focus();
});
$('#build-question-button').addEventListener('click', buildPastedConversionQuestion);
$('#paste-question-input').addEventListener('keydown', event => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    buildPastedConversionQuestion();
  }
});
$('#next-step-button').addEventListener('click', nextWorkStep);
$('#delete-step-button').addEventListener('mousedown', event => event.preventDefault());
$('#delete-step-button').addEventListener('click', deleteCurrentStep);
$('#latest-step-button').addEventListener('click', () => openStep(state.workSteps.length));
$('#save-note-button').addEventListener('click', saveNotebookNote);
$('#calculator-toggle').addEventListener('click', toggleCalculator);
$('#calculator-close').addEventListener('click', () => setCalculatorOpen(false));
$('.calculator-popover-heading').addEventListener('pointerdown', startCalculatorDrag);
addEventListener('resize', () => {
  const popover = $('#calculator-popover');
  if (!popover.hidden && popover.classList.contains('is-floating')) placeCalculator(parseFloat(popover.style.left), parseFloat(popover.style.top));
});
$$('.calculator-pad button').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.calcAction === 'evaluate') return calculateExpression();
  if (button.dataset.calcAction === 'clear') return clearCalculator();
  if (button.dataset.calcAction === 'backspace') return backspaceCalculator();
  insertCalculatorValue(button.dataset.calcValue || '');
}));
$('#calculator-result').addEventListener('click', event => {
  const value = event.currentTarget.dataset.value;
  if (value) copyValue(value, `Copied ${value}`);
});
$('#element-detail').addEventListener('click', event => {
  if (event.target.closest('.element-tile-preview')) copyElementMass();
});
$('#calculator-input').addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    calculateExpression();
  }
});

results.addEventListener('click', async event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const card = button.closest('.result-card');
  const entry = state.entries.find(item => item.id === card.dataset.id);
  if (!entry) return;
  if (button.dataset.action === 'remove') {
    if (!(await confirmAction({
      eyebrow: 'Saved result',
      title: 'Remove this result?',
      body: 'This result will be permanently removed from the notebook page.',
      confirmLabel: 'Remove result',
      cancelLabel: 'Keep result'
    }))) return;
    state.entries = state.entries.filter(item => item.id !== entry.id);
    saveEntries(); renderResults(); renderSavedWork();
  } else if (button.dataset.action === 'copy') {
    try { await navigator.clipboard.writeText(entryPlainText(entry)); showToast('Copied'); }
    catch { showToast('Copy was blocked by the browser'); }
  } else if (button.dataset.action === 'edit') {
    editEntry(entry);
  } else if (button.dataset.action === 'export') exportEntry(entry);
});

$('#elements-tab').addEventListener('click', () => activateReference('elements'));
$('#ions-tab').addEventListener('click', () => activateReference('ions'));
$('#guide-tab').addEventListener('click', () => activateReference('guide'));
$('#prefixes-tab').addEventListener('click', () => activateReference('prefixes'));
$('#reference-search').addEventListener('input', event => filterReference(event.target.value));
$('#reference-search').addEventListener('keydown', event => {
  if (event.key === 'Enter' && state.activeReference === 'elements') { event.preventDefault(); copyElementMass(); }
});
$('#reference-toggle').addEventListener('click', toggleReferenceShelf);
$('#clear-button').addEventListener('click', clearPage);
$('#export-all-button').addEventListener('click', exportAll);
$('#shortcuts-button').addEventListener('click', () => $('#shortcuts-dialog').showModal());
$('#saved-work-toggle').addEventListener('click', () => setSavedWorkOpen($('#saved-work-drawer').hidden));
$('#saved-work-close').addEventListener('click', () => setSavedWorkOpen(false));
$('#saved-work-search').addEventListener('input', renderSavedWork);
$('#saved-work-search').addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !event.currentTarget.value) return;
  event.stopPropagation();
  event.currentTarget.value = '';
  renderSavedWork();
});
$('#cloud-sync-button').addEventListener('click', () => {
  updateCloudDialog();
  $('#cloud-sync-dialog').showModal();
});
$('#cloud-copy-code').addEventListener('click', async () => {
  const code = cloudSyncCode();
  if (!code) return showToast('Your sync code is still being prepared');
  try { await navigator.clipboard.writeText(code); showToast('Sync code copied'); }
  catch { $('#cloud-sync-code').focus(); $('#cloud-sync-code').select(); showToast('Select and copy your sync code'); }
});
$('#cloud-restore-button').addEventListener('click', restoreCloudFromCode);
$('#saved-work-list').addEventListener('click', event => {
  const button = event.target.closest('[data-saved-id]');
  if (button) loadSavedWork(button.dataset.savedId);
});

document.addEventListener('keydown', event => {
  if (event.altKey && event.key.toLowerCase() === 'p') { event.preventDefault(); activateReference('elements'); $('#reference-search').focus(); }
  if (event.altKey && event.key.toLowerCase() === 'i') { event.preventDefault(); activateReference('ions'); $('#reference-search').focus(); }
  if (event.altKey && event.key.toLowerCase() === 'g') { event.preventDefault(); activateReference('guide'); }
  if (event.altKey && event.key.toLowerCase() === 'm') { event.preventDefault(); activateReference('prefixes'); $('#reference-search').focus(); }
  if (event.altKey && event.key.toLowerCase() === 'r') { event.preventDefault(); toggleReferenceShelf(); }
  if (event.altKey && event.key.toLowerCase() === 'e') { event.preventDefault(); exportAll(); }
  if (event.altKey && event.key.toLowerCase() === 'c') { event.preventDefault(); setCalculatorOpen(true); }
  if (event.altKey && event.key.toLowerCase() === 'l') { event.preventDefault(); openLewisEditor(); }
  if (event.altKey && event.key.toLowerCase() === 'v') { event.preventDefault(); $('#paste-question-dialog').showModal(); $('#paste-question-input').focus(); }
  if (event.key === '/' && document.activeElement !== input && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) { event.preventDefault(); $('#reference-search').focus(); }
  if (event.key === 'Escape' && !$('#shortcuts-dialog').open) {
    if (event.target.closest?.('#calculator-popover')) { setCalculatorOpen(false); input.focus(); }
    else if (!$('#highlight-menu').hidden) setHighlightMenuOpen(false);
    else if (!$('#saved-work-drawer').hidden) setSavedWorkOpen(false);
    else input.focus();
  }
  if (event.key === '?' && document.activeElement !== input && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) $('#shortcuts-dialog').showModal();
});

document.addEventListener('pointerdown', event => {
  if (!$('#highlight-menu').hidden && !event.target.closest('.highlight-group')) setHighlightMenuOpen(false);
});

initLewisEditor();
renderPeriodicTable();
renderIons();
renderCourseGuide();
renderResults();
renderSavedWork();
if (START_PARAMS.get('find')) {
  $('#saved-work-search').value = START_PARAMS.get('find');
  setSavedWorkOpen(true);
}
selectElement(state.selectedElement);
restoreDraft();
renderWorkSteps();
setHighlightColor(state.highlightColor);
updateUndoButton();
restoreCalculator();
inferMode(getEditorText());
renderPrefixes();
if (START_PARAMS.get('ref') === 'ions') activateReference('ions', false);
else if (START_PARAMS.get('ref') === 'prefixes') activateReference('prefixes', false);
else if (START_PARAMS.get('ref') === 'guide') activateReference('guide', false);
else filterReference('');
setReferenceCollapsed(state.referenceCollapsed);
if (START_PARAMS.get('q')) {
  runCommand(START_PARAMS.get('q'));
  const cleanUrl = new URL(location.href);
  cleanUrl.searchParams.delete('q');
  history.replaceState(null, '', cleanUrl);
}
if (cloudSession?.id) loadCloudPage();
else if (hasCloudContent()) queueCloudSave();
if (matchMedia('(min-width: 821px)').matches) input.focus();
