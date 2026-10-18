// Lewis dot diagrams. They are drawn on a grid in a dialog and stored in the notepad
// as <span class="lewis-diagram" data-lewis="{json}"> holding a rendered SVG image.
// The JSON is the source of truth: the sanitizer re-renders the image from it, and
// the PNG export draws the same geometry straight onto its canvas.
//
// Model: { f: formula typed by the student, q: whole-ion charge, atoms: [{ x, y, s, q, d, r, b, w }] }
//   x, y  grid cell          s  element symbol      q  atom charge
//   d     dots per side [top, right, bottom, left], 0-2 each
//   r, b  bond order to the atom on the right / below, 0-3
//   w     brackets around this atom
// Dots are only ever placed by hand: working them out is the homework.
//
// Loaded before app.js; everything here that touches ELEMENTS, $ or the editor runs
// only after app.js has defined them. Drawing happens in "Lewis mode", which swaps
// the writing area for the grid while the reference shelf stays open.

const LEWIS_SIDES = ['t', 'r', 'b', 'l'];
const LEWIS_SIDE_NAMES = { t: 'top', r: 'right', b: 'bottom', l: 'left' };
const LEWIS_STEP = { t: [0, -1], r: [1, 0], b: [0, 1], l: [-1, 0] };
const LEWIS_INK = '#10272b';
const LEWIS_DISPLAY_UNIT = 40;
const LEWIS_EXPORT_UNIT = 64;
const LEWIS_QUICK_ELEMENTS = ['H', 'C', 'N', 'O', 'F', 'Cl', 'Br', 'I', 'S', 'P', 'Na', 'K', 'Mg', 'Ca'];
// Pauling values; only the order matters (element order in the text formula).
const LEWIS_ELECTRONEGATIVITY = { F: 3.98, O: 3.44, Cl: 3.16, N: 3.04, Kr: 3, Br: 2.96, I: 2.66, Xe: 2.6, S: 2.58, C: 2.55, Se: 2.55, H: 2.2, P: 2.19, As: 2.18, Te: 2.1, B: 2.04, Si: 1.9 };

let lewisElementMap = null;
function lewisElementInfo(symbol) {
  lewisElementMap ||= new Map(ELEMENTS.map(element => [element.symbol, element]));
  return lewisElementMap.get(symbol) || null;
}

function lewisValence(symbol) {
  const element = lewisElementInfo(symbol);
  if (!element) return 0;
  if (symbol === 'He') return 2;
  const group = element.group;
  if (['lanthanide', 'actinide'].includes(element.category)) return 2;
  if (group === 1 || group === 2) return group;
  if (group >= 13 && group <= 18) return group - 10;
  return 2;
}

// How many bonds an atom usually makes; used only to auto-bond a newly placed atom.
function lewisBondCapacity(symbol) {
  const element = lewisElementInfo(symbol);
  if (!element || !['nonmetal', 'halogen', 'metalloid'].includes(element.category)) return 0;
  if (symbol === 'H') return 1;
  const valence = lewisValence(symbol);
  return valence <= 4 ? valence : 8 - valence;
}

function lewisIndex(atoms) {
  return new Map(atoms.map(atom => [`${atom.x},${atom.y}`, atom]));
}

function lewisAt(index, x, y) {
  return index.get(`${x},${y}`) || null;
}

function lewisNeighbour(index, atom, side) {
  const [dx, dy] = LEWIS_STEP[side];
  return lewisAt(index, atom.x + dx, atom.y + dy);
}

function lewisBond(index, atom, side) {
  const other = lewisNeighbour(index, atom, side);
  if (!other) return 0;
  if (side === 'r') return atom.r || 0;
  if (side === 'b') return atom.b || 0;
  return (side === 'l' ? other.r : other.b) || 0;
}

function lewisSetBond(index, atom, side, order) {
  const other = lewisNeighbour(index, atom, side);
  if (!other) return;
  if (side === 'r') atom.r = order;
  else if (side === 'b') atom.b = order;
  else if (side === 'l') other.r = order;
  else other.b = order;
}

function lewisBondSum(index, atom) {
  return LEWIS_SIDES.reduce((sum, side) => sum + lewisBond(index, atom, side), 0);
}

function lewisChargeText(charge) {
  if (!charge) return '';
  const sign = charge > 0 ? '+' : '−';
  return Math.abs(charge) === 1 ? sign : `${Math.abs(charge)}${sign}`;
}

function lewisNewAtom(x, y, s) {
  return { x, y, s, q: 0, d: [0, 0, 0, 0], r: 0, b: 0, w: 0 };
}

// Validates untrusted JSON (it comes back out of saved HTML) and shifts the drawing
// so its top-left atom sits at 0,0.
function lewisNormalize(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.atoms)) return null;
  const int = (value, min, max) => {
    const number = Math.round(Number(value));
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : 0;
  };
  const seen = new Set();
  const atoms = [];
  raw.atoms.slice(0, 80).forEach(atom => {
    const s = String(atom?.s || '');
    if (!lewisElementInfo(s)) return;
    const x = int(atom.x, 0, 60);
    const y = int(atom.y, 0, 60);
    if (seen.has(`${x},${y}`)) return;
    seen.add(`${x},${y}`);
    atoms.push({
      x, y, s,
      q: int(atom.q, -4, 4),
      d: LEWIS_SIDES.map((_, i) => int(atom.d?.[i], 0, 2)),
      r: int(atom.r, 0, 3),
      b: int(atom.b, 0, 3),
      w: atom.w ? 1 : 0
    });
  });
  if (!atoms.length) return null;
  const minX = Math.min(...atoms.map(atom => atom.x));
  const minY = Math.min(...atoms.map(atom => atom.y));
  atoms.forEach(atom => { atom.x -= minX; atom.y -= minY; });
  const index = lewisIndex(atoms);
  atoms.forEach(atom => {
    if (!lewisNeighbour(index, atom, 'r')) atom.r = 0;
    if (!lewisNeighbour(index, atom, 'b')) atom.b = 0;
  });
  return { f: lewisCleanFormula(raw.f), q: int(raw.q, -4, 4), atoms };
}

function lewisCleanFormula(value) {
  return String(value || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 40);
}

// "NH4+" -> NH, 4 as subscript, + as superscript. Digits after a letter or
// bracket are subscripts. The trailing sign is a charge; the digit before it
// joins the charge after a space ("SO4 2-"), after another digit ("SO42-") or on
// a lone element ("Fe3+", "O2-"). Anything after "^" is a superscript.
function lewisFormulaRuns(formula) {
  const text = lewisCleanFormula(formula).replaceAll('-', '−');
  const runs = [];
  const push = (value, script) => {
    const last = runs.at(-1);
    if (last && last.script === script) last.value += value;
    else runs.push({ type: 'text', value, script });
  };
  let body = text;
  let charge = '';
  const caret = text.indexOf('^');
  const sign = caret < 0 && text.match(/(\s?)(\d?)([+−])$/);
  if (caret >= 0) {
    body = text.slice(0, caret);
    charge = text.slice(caret + 1);
  } else if (sign) {
    const before = text.slice(0, sign.index);
    const digitJoins = sign[2] && (sign[1] || /\d$/.test(before) || /^[A-Z][a-z]?$/.test(before));
    const cut = digitJoins ? sign.index : text.length - 1;
    body = text.slice(0, cut).trimEnd();
    charge = text.slice(cut).trim();
  }
  let inSub = false;
  [...body].forEach((char, i) => {
    const previous = body[i - 1] || '';
    inSub = /\d/.test(char) && (/[A-Za-z)\]]/.test(previous) || (inSub && /\d/.test(previous)));
    push(char, inSub ? 'sub' : '');
  });
  if (charge) push(charge, 'sup');
  return runs;
}

function lewisFormulaHTMLNode(formula) {
  const caption = document.createElement('span');
  caption.className = 'lewis-caption';
  lewisFormulaRuns(formula).forEach(run => {
    if (!run.script) return caption.append(document.createTextNode(run.value));
    const element = document.createElement(run.script);
    element.textContent = run.value;
    caption.append(element);
  });
  return caption;
}

function lewisParse(text) {
  try { return lewisNormalize(JSON.parse(text || '')); }
  catch { return null; }
}

function lewisSerialize(model) {
  return JSON.stringify({
    f: model.f || undefined,
    q: model.q || undefined,
    atoms: model.atoms.map(({ x, y, s, q, d, r, b, w }) => {
      const atom = { x, y, s };
      if (q) atom.q = q;
      if (d.some(Boolean)) atom.d = d;
      if (r) atom.r = r;
      if (b) atom.b = b;
      if (w) atom.w = 1;
      return atom;
    })
  });
}

// A readable formula for copy, search and alt text: H first when it is bonded to
// O, S or a halogen (H2O, HCl), otherwise last (CH4, NH3); the rest by
// electronegativity, so NaCl and CO2 come out the way they are written.
function lewisFormula(model) {
  if (model.f) return model.f;
  const counts = new Map();
  model.atoms.forEach(atom => counts.set(atom.s, (counts.get(atom.s) || 0) + 1));
  const index = lewisIndex(model.atoms);
  const hydrogenFirst = model.atoms.some(atom => atom.s === 'H' && LEWIS_SIDES.some(side => {
    const other = lewisBond(index, atom, side) && lewisNeighbour(index, atom, side);
    return other && (['O', 'S'].includes(other.s) || lewisElementInfo(other.s)?.category === 'halogen');
  }));
  const rank = symbol => symbol === 'H' ? (hydrogenFirst ? -1 : 99) : (LEWIS_ELECTRONEGATIVITY[symbol] ?? 1);
  const formula = [...counts].sort(([a], [b]) => rank(a) - rank(b)).map(([symbol, count]) => `${symbol}${count > 1 ? count : ''}`).join('');
  const charge = model.q || model.atoms.reduce((sum, atom) => sum + atom.q, 0);
  return `${formula}${lewisChargeText(charge)}`;
}

function lewisHalfWidth(symbol) {
  return symbol.length > 1 ? 0.25 : 0.15;
}

// Shapes in grid units with each atom's centre at (x, y): text, dots, lines and
// bracket polylines. The SVG and canvas renderers below only translate these.
function lewisGeometry(model) {
  const shapes = [];
  if (!model.atoms.length) return { shapes, minX: 0, minY: 0, maxX: 0, maxY: 0 };
  const index = lewisIndex(model.atoms);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const grow = (x1, y1, x2, y2) => {
    minX = Math.min(minX, x1); minY = Math.min(minY, y1);
    maxX = Math.max(maxX, x2); maxY = Math.max(maxY, y2);
  };
  const bracket = (left, top, right, bottom) => {
    const tick = 0.08;
    shapes.push({ type: 'path', points: [[left + tick, top], [left, top], [left, bottom], [left + tick, bottom]] });
    shapes.push({ type: 'path', points: [[right - tick, top], [right, top], [right, bottom], [right - tick, bottom]] });
    grow(left - 0.04, top - 0.04, right + 0.04, bottom + 0.04);
  };

  model.atoms.forEach(atom => {
    const { x, y, s } = atom;
    const half = lewisHalfWidth(s);
    shapes.push({ type: 'text', x, y, size: 0.46, value: s, anchor: 'middle' });
    grow(x - half - 0.16, y - 0.36, x + half + 0.16, y + 0.36);

    LEWIS_SIDES.forEach((side, i) => {
      const count = atom.d[i];
      if (!count || lewisBond(index, atom, side)) return;
      (count === 2 ? [-0.075, 0.075] : [0]).forEach(offset => {
        const point = side === 't' ? [x + offset, y - 0.31]
          : side === 'b' ? [x + offset, y + 0.31]
          : side === 'r' ? [x + half + 0.1, y + offset]
          : [x - half - 0.1, y + offset];
        shapes.push({ type: 'dot', x: point[0], y: point[1], r: 0.042 });
      });
    });

    [['r', atom.r], ['b', atom.b]].forEach(([side, order]) => {
      const other = order && lewisNeighbour(index, atom, side);
      if (!other) return;
      const offsets = order === 1 ? [0] : order === 2 ? [-0.06, 0.06] : [-0.1, 0, 0.1];
      offsets.forEach(offset => {
        if (side === 'r') shapes.push({ type: 'line', x1: x + half + 0.07, y1: y + offset, x2: other.x - lewisHalfWidth(other.s) - 0.07, y2: y + offset });
        else shapes.push({ type: 'line', x1: x + offset, y1: y + 0.25, x2: x + offset, y2: other.y - 0.25 });
      });
    });

    if (atom.w) bracket(x - 0.44, y - 0.43, x + 0.44, y + 0.43);
    const charge = lewisChargeText(atom.q);
    if (charge) {
      const cx = atom.w ? x + 0.5 : x + half + 0.12;
      const cy = atom.w ? y - 0.37 : y - 0.3;
      shapes.push({ type: 'text', x: cx, y: cy, size: 0.27, value: charge, anchor: 'start' });
      grow(cx, cy - 0.16, cx + 0.17 * charge.length, cy + 0.16);
    }
  });

  const charge = lewisChargeText(model.q);
  if (charge) {
    const xs = model.atoms.map(atom => atom.x);
    const ys = model.atoms.map(atom => atom.y);
    const left = Math.min(...xs) - 0.5, right = Math.max(...xs) + 0.5;
    const top = Math.min(...ys) - 0.47, bottom = Math.max(...ys) + 0.47;
    bracket(left, top, right, bottom);
    shapes.push({ type: 'text', x: right + 0.07, y: top + 0.04, size: 0.3, value: charge, anchor: 'start' });
    grow(right, top - 0.14, right + 0.07 + 0.19 * charge.length, top + 0.2);
  }
  const pad = 0.06;
  return { shapes, minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad };
}

function lewisShapesSVG(shapes, unit, offsetX, offsetY, color = LEWIS_INK) {
  const n = value => Math.round(value * 100) / 100;
  const px = value => n((value + offsetX) * unit);
  const py = value => n((value + offsetY) * unit);
  const stroke = `stroke="${color}" stroke-width="${n(0.04 * unit)}" stroke-linecap="round" stroke-linejoin="round"`;
  return shapes.map(shape => {
    if (shape.type === 'dot') return `<circle cx="${px(shape.x)}" cy="${py(shape.y)}" r="${n(shape.r * unit)}" fill="${color}"/>`;
    if (shape.type === 'line') return `<line x1="${px(shape.x1)}" y1="${py(shape.y1)}" x2="${px(shape.x2)}" y2="${py(shape.y2)}" ${stroke}/>`;
    if (shape.type === 'path') return `<polyline points="${shape.points.map(([x, y]) => `${px(x)},${py(y)}`).join(' ')}" fill="none" ${stroke}/>`;
    return `<text x="${px(shape.x)}" y="${py(shape.y)}" font-family="Georgia,serif" font-size="${n(shape.size * unit)}" text-anchor="${shape.anchor}" dominant-baseline="central" fill="${color}">${shape.value}</text>`;
  }).join('');
}

function lewisImage(model, unit = LEWIS_DISPLAY_UNIT) {
  const geometry = lewisGeometry(model);
  const width = Math.ceil((geometry.maxX - geometry.minX) * unit);
  const height = Math.ceil((geometry.maxY - geometry.minY) * unit);
  const body = lewisShapesSVG(geometry.shapes, unit, -geometry.minX, -geometry.minY);
  return { width, height, markup: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>` };
}

// The element the notepad stores. contenteditable=false makes it one unit for the
// caret, Backspace and selection; the image carries no text nodes for the
// highlight/cross-out walkers to wander into.
function lewisNode(model) {
  const span = document.createElement('span');
  span.className = 'lewis-diagram';
  span.setAttribute('contenteditable', 'false');
  span.setAttribute('data-lewis', lewisSerialize(model));
  const image = lewisImage(model);
  const img = document.createElement('img');
  img.src = `data:image/svg+xml,${encodeURIComponent(image.markup)}`;
  img.width = image.width;
  img.height = image.height;
  img.alt = `Lewis diagram of ${lewisFormula(model)}`;
  img.draggable = false;
  span.append(img);
  if (model.f) span.append(lewisFormulaHTMLNode(model.f));
  return span;
}

function lewisNodeText(node) {
  const model = lewisParse(node.getAttribute('data-lewis'));
  return model ? `[Lewis: ${lewisFormula(model)}]` : '';
}

// The caption under an exported diagram: formula runs, size and line height.
const LEWIS_CAPTION_SIZE = 24;
const LEWIS_CAPTION_HEIGHT = 34;

// Size of the diagram alone, and of the block (diagram + caption) it fills.
function lewisExportSize(model) {
  const geometry = lewisGeometry(model);
  const diagramHeight = (geometry.maxY - geometry.minY) * LEWIS_EXPORT_UNIT;
  return {
    diagramWidth: (geometry.maxX - geometry.minX) * LEWIS_EXPORT_UNIT,
    diagramHeight,
    height: diagramHeight + (model.f ? LEWIS_CAPTION_HEIGHT : 0),
    captionRuns: model.f ? lewisFormulaRuns(model.f) : []
  };
}

// Draws with its left edge at x and its vertical middle on centerY; returns the width.
function drawLewis(ctx, model, x, centerY, unit = LEWIS_EXPORT_UNIT) {
  const geometry = lewisGeometry(model);
  const ox = x - geometry.minX * unit;
  const oy = centerY - ((geometry.minY + geometry.maxY) / 2) * unit;
  ctx.save();
  ctx.fillStyle = LEWIS_INK;
  ctx.strokeStyle = LEWIS_INK;
  ctx.lineWidth = 0.04 * unit;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.textBaseline = 'middle';
  geometry.shapes.forEach(shape => {
    if (shape.type === 'dot') {
      ctx.beginPath();
      ctx.arc(ox + shape.x * unit, oy + shape.y * unit, shape.r * unit, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape.type === 'line' || shape.type === 'path') {
      const points = shape.type === 'line' ? [[shape.x1, shape.y1], [shape.x2, shape.y2]] : shape.points;
      ctx.beginPath();
      points.forEach(([px, py], i) => ctx[i ? 'lineTo' : 'moveTo'](ox + px * unit, oy + py * unit));
      ctx.stroke();
    } else {
      ctx.font = `${shape.size * unit}px Georgia`;
      ctx.textAlign = shape.anchor === 'middle' ? 'center' : 'left';
      ctx.fillText(shape.value, ox + shape.x * unit, oy + shape.y * unit);
    }
  });
  ctx.restore();
  const width = (geometry.maxX - geometry.minX) * unit;
  trackInk(x + width);
  return width;
}

// ---------------------------------------------------------------------------
// The drawing dialog
// ---------------------------------------------------------------------------

const lewis = {
  model: { q: 0, atoms: [] },
  cols: 9,
  rows: 6,
  cursor: { x: 4, y: 2 },
  element: 'C',
  target: null,
  // A new drawing left without adding it waits here for the next visit.
  draft: null,
  history: [],
  hover: null,
  typed: '',
  typedAt: 0,
  typedCell: ''
};

function lewisCursorAtom() {
  return lewisAt(lewisIndex(lewis.model.atoms), lewis.cursor.x, lewis.cursor.y);
}

function lewisMutate(change) {
  lewis.history.push(JSON.stringify(lewis.model));
  if (lewis.history.length > 80) lewis.history.shift();
  change();
  renderLewisEditor();
}

function lewisUndo() {
  const previous = lewis.history.pop();
  if (!previous) return lewisSay('Nothing to undo');
  // Undo is for the drawing; the formula box keeps what is typed in it now.
  const formula = lewis.model.f;
  lewis.model = JSON.parse(previous);
  lewis.model.f = formula;
  renderLewisEditor();
}

function lewisSay(message) {
  $('#lewis-status').textContent = message;
}

const LEWIS_DEFAULT_HINT = 'Click a square to place an atom. Click beside an atom to add dots, or between two atoms for a bond.';

function lewisPlace(x, y, symbol) {
  lewis.cursor = { x, y };
  lewisMutate(() => {
    const index = lewisIndex(lewis.model.atoms);
    const existing = lewisAt(index, x, y);
    if (existing) { existing.s = symbol; return; }
    const atom = lewisNewAtom(x, y, symbol);
    lewis.model.atoms.push(atom);
    index.set(`${x},${y}`, atom);
    // Leftover bond flags from an atom that used to be here must not come back.
    const left = lewisAt(index, x - 1, y); if (left) left.r = 0;
    const above = lewisAt(index, x, y - 1); if (above) above.b = 0;
    LEWIS_SIDES.forEach(side => {
      const other = lewisNeighbour(index, atom, side);
      if (!other) return;
      if (lewisBondSum(index, atom) >= lewisBondCapacity(symbol)) return;
      // The atom already there may go past its usual count (the fourth H on NH4+),
      // up to a full octet of bonds; H never takes a second bond.
      if (!lewisBondCapacity(other.s) || lewisBondSum(index, other) >= (other.s === 'H' ? 1 : 4)) return;
      lewisSetBond(index, atom, side, 1);
    });
  });
  lewisSay(`${lewisElementInfo(symbol).name} placed`);
}

function lewisRemoveAtCursor() {
  const atom = lewisCursorAtom();
  if (!atom) return lewisSay('That square is empty');
  lewisMutate(() => {
    const index = lewisIndex(lewis.model.atoms);
    const left = lewisAt(index, atom.x - 1, atom.y); if (left) left.r = 0;
    const above = lewisAt(index, atom.x, atom.y - 1); if (above) above.b = 0;
    lewis.model.atoms = lewis.model.atoms.filter(item => item !== atom);
  });
  lewisSay(`${lewisElementInfo(atom.s).name} removed`);
}

const LEWIS_BOND_NAMES = ['No bond', 'Single bond', 'Double bond', 'Triple bond'];

function lewisCycleBond(atom, side) {
  const index = lewisIndex(lewis.model.atoms);
  if (!atom || !lewisNeighbour(index, atom, side)) return lewisSay(`No atom to the ${LEWIS_SIDE_NAMES[side]} to bond to`);
  const next = (lewisBond(index, atom, side) + 1) % 4;
  lewisMutate(() => lewisSetBond(lewisIndex(lewis.model.atoms), atom, side, next));
  lewisSay(LEWIS_BOND_NAMES[next]);
}

function lewisCycleDots(atom, side) {
  if (!atom) return lewisSay('Place an atom first');
  const index = lewisIndex(lewis.model.atoms);
  if (lewisBond(index, atom, side)) return lewisSay(`That side is bonded; remove the bond to put dots there`);
  const slot = LEWIS_SIDES.indexOf(side);
  const next = (atom.d[slot] + 1) % 3;
  lewisMutate(() => { atom.d[slot] = next; });
  lewisSay(`${['No dots', 'One dot', 'A pair'][next]} on the ${LEWIS_SIDE_NAMES[side]}`);
}

function lewisChangeAtomCharge(delta) {
  const atom = lewisCursorAtom();
  if (!atom) return lewisSay('Select an atom to give it a charge');
  lewisMutate(() => { atom.q = Math.max(-4, Math.min(4, atom.q + delta)); });
  lewisSay(atom.q ? `${atom.s} charge ${lewisChargeText(atom.q)}` : `${atom.s} is neutral`);
}

function lewisChangeIonCharge(delta) {
  lewisMutate(() => { lewis.model.q = Math.max(-4, Math.min(4, lewis.model.q + delta)); });
  lewisSay(lewis.model.q ? `Whole ion ${lewisChargeText(lewis.model.q)}, bracketed` : 'Whole structure is neutral');
}

function lewisSetElement(symbol) {
  if (!lewisElementInfo(symbol)) return false;
  lewis.element = symbol;
  renderLewisPanel();
  return true;
}

// Where a pointer sits on the grid, and what clicking there would do.
function lewisHit(event) {
  const svg = $('#lewis-grid');
  const box = svg.getBoundingClientRect();
  const gx = (event.clientX - box.left) / box.width * lewis.cols;
  const gy = (event.clientY - box.top) / box.height * lewis.rows;
  const x = Math.floor(gx);
  const y = Math.floor(gy);
  if (x < 0 || y < 0 || x >= lewis.cols || y >= lewis.rows) return null;
  const index = lewisIndex(lewis.model.atoms);
  const atom = lewisAt(index, x, y);
  if (!atom) return { kind: 'place', x, y };
  const dx = gx - x - 0.5;
  const dy = gy - y - 0.5;
  if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) return { kind: 'atom', x, y, atom };
  const side = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'b' : 't');
  const reach = Math.max(Math.abs(dx), Math.abs(dy));
  if (lewisNeighbour(index, atom, side) && (reach > 0.33 || lewisBond(index, atom, side))) return { kind: 'bond', x, y, atom, side };
  return { kind: 'dots', x, y, atom, side };
}

function lewisHitHint(hit) {
  if (!hit) return '';
  const index = lewisIndex(lewis.model.atoms);
  if (hit.kind === 'place') return `Click to place ${lewisElementInfo(lewis.element).name}`;
  if (hit.kind === 'atom') return `${lewisElementInfo(hit.atom.s).name}: click to select, then set its charge or brackets`;
  if (hit.kind === 'bond') {
    const next = (lewisBond(index, hit.atom, hit.side) + 1) % 4;
    return next ? `Click for a ${LEWIS_BOND_NAMES[next].toLowerCase()}` : 'Click to remove the bond';
  }
  const next = (hit.atom.d[LEWIS_SIDES.indexOf(hit.side)] + 1) % 3;
  return `Click for ${['no dots', 'one dot', 'a pair'][next]} on the ${LEWIS_SIDE_NAMES[hit.side]}`;
}

// The grid's viewBox is 100 user units per cell: sub-pixel font sizes in a scaled-up
// SVG render badly in some browsers.
const LEWIS_GRID_UNIT = 100;

function lewisHitZone(hit) {
  if (!hit) return '';
  const { x, y } = hit;
  const g = value => Math.round(value * LEWIS_GRID_UNIT);
  const rect = (left, top, width, height, extra = '') => `<rect class="lewis-zone${extra}" x="${g(left)}" y="${g(top)}" width="${g(width)}" height="${g(height)}"/>`;
  if (hit.kind === 'place') {
    return `${rect(x + 0.08, y + 0.08, 0.84, 0.84, ' is-place')}<text class="lewis-ghost" x="${g(x + 0.5)}" y="${g(y + 0.5)}" font-family="Georgia,serif" font-size="${g(0.46)}" text-anchor="middle" dominant-baseline="central">${lewis.element}</text>`;
  }
  if (hit.kind === 'atom') return rect(x + 0.24, y + 0.24, 0.52, 0.52);
  if (hit.kind === 'bond') {
    const [dx, dy] = LEWIS_STEP[hit.side];
    const midX = x + 0.5 + dx * 0.5;
    const midY = y + 0.5 + dy * 0.5;
    return dx ? rect(midX - 0.34, midY - 0.13, 0.68, 0.26) : rect(midX - 0.13, midY - 0.34, 0.26, 0.68);
  }
  const zones = { t: [x + 0.3, y + 0.06, 0.4, 0.22], b: [x + 0.3, y + 0.72, 0.4, 0.22], l: [x + 0.06, y + 0.3, 0.22, 0.4], r: [x + 0.72, y + 0.3, 0.22, 0.4] };
  return rect(...zones[hit.side]);
}

function renderLewisGrid() {
  const { cols, rows, cursor } = lewis;
  const g = LEWIS_GRID_UNIT;
  const svg = $('#lewis-grid');
  svg.setAttribute('viewBox', `0 0 ${cols * g} ${rows * g}`);
  let markup = '';
  for (let c = 1; c < cols; c += 1) markup += `<line class="lewis-cell-line" x1="${c * g}" y1="0" x2="${c * g}" y2="${rows * g}" vector-effect="non-scaling-stroke"/>`;
  for (let r = 1; r < rows; r += 1) markup += `<line class="lewis-cell-line" x1="0" y1="${r * g}" x2="${cols * g}" y2="${r * g}" vector-effect="non-scaling-stroke"/>`;
  markup += lewisHitZone(lewis.hover);
  markup += `<rect class="lewis-cursor" x="${(cursor.x + 0.04) * g}" y="${(cursor.y + 0.04) * g}" width="${0.92 * g}" height="${0.92 * g}" vector-effect="non-scaling-stroke"/>`;
  markup += lewisShapesSVG(lewisGeometry(lewis.model).shapes, g, 0.5, 0.5);
  svg.innerHTML = markup;
}

function renderLewisPanel() {
  $$('[data-lewis-element]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lewisElement === lewis.element)));
  $('#lewis-element-name').textContent = lewisElementInfo(lewis.element)?.name || '';
  $('#lewis-formula-preview').replaceChildren(...(lewis.model.f ? [lewisFormulaHTMLNode(lewis.model.f)] : []));
  const other = $('#lewis-element-input');
  if (document.activeElement !== other) other.value = LEWIS_QUICK_ELEMENTS.includes(lewis.element) ? '' : lewis.element;
  const atom = lewisCursorAtom();
  $('#lewis-atom-name').textContent = atom ? lewisElementInfo(atom.s).name : 'None';
  $('#lewis-atom-charge').textContent = atom ? (lewisChargeText(atom.q) || '0') : '0';
  $$('[data-lewis-charge], #lewis-brackets, #lewis-remove').forEach(button => { button.disabled = !atom; });
  $('#lewis-brackets').setAttribute('aria-pressed', String(Boolean(atom?.w)));
  $('#lewis-ion-charge').textContent = lewisChargeText(lewis.model.q) || '0';
  $('#lewis-undo').disabled = !lewis.history.length;
  $('#lewis-insert').textContent = lewis.target ? 'Update diagram' : 'Add to notepad';
  $('#lewis-insert').disabled = !lewis.model.atoms.length;
}

function renderLewisEditor() {
  renderLewisGrid();
  renderLewisPanel();
}

// Lewis mode takes the writing area's place inside the notepad card, so the
// reference shelf (periodic table, ions) stays in view while drawing.
function lewisModeActive() {
  return !$('#lewis-mode').hidden;
}

function exitLewisMode({ keepDraft = true } = {}) {
  if (!lewisModeActive()) return;
  if (keepDraft && !lewis.target && (lewis.model.atoms.length || lewis.model.f)) {
    lewis.draft = lewisNormalize(lewis.model) || { f: lewisCleanFormula(lewis.model.f), q: 0, atoms: [] };
  }
  $('#lewis-mode').hidden = true;
  $('.composer-wrap').classList.remove('is-lewis-mode');
  lewis.target = null;
  lewis.hover = null;
  input.focus();
  restoreEditorRange();
  $('.active-work-step').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function openLewisEditor(target = null) {
  if (!lewisModeActive()) rememberEditorRange();
  const existing = target ? lewisParse(target.getAttribute('data-lewis')) : (lewis.draft ? structuredClone(lewis.draft) : null);
  const narrow = matchMedia('(max-width: 560px)').matches;
  const atoms = existing?.atoms || [];
  const width = atoms.length ? Math.max(...atoms.map(atom => atom.x)) + 1 : 0;
  const height = atoms.length ? Math.max(...atoms.map(atom => atom.y)) + 1 : 0;
  lewis.cols = Math.max(narrow ? 6 : 9, width + 2);
  lewis.rows = Math.max(narrow ? 5 : 6, height + 2);
  const offsetX = Math.floor((lewis.cols - width) / 2);
  const offsetY = Math.floor((lewis.rows - height) / 2);
  atoms.forEach(atom => { atom.x += offsetX; atom.y += offsetY; });
  lewis.model = { f: existing?.f || '', q: existing?.q || 0, atoms };
  $('#lewis-formula').value = lewis.model.f;
  lewis.cursor = atoms[0] ? { x: atoms[0].x, y: atoms[0].y } : { x: Math.floor(lewis.cols / 2), y: Math.floor((lewis.rows - 1) / 2) };
  lewis.target = target;
  lewis.history = [];
  lewis.hover = null;
  lewis.typed = '';
  $('#lewis-title').textContent = target ? 'Edit the Lewis structure' : 'Draw a Lewis structure';
  lewisSay(!target && existing ? 'Your last drawing is back. Clear starts fresh.' : LEWIS_DEFAULT_HINT);
  $('.composer-wrap').classList.add('is-lewis-mode');
  $('#lewis-mode').hidden = false;
  renderLewisEditor();
  $('#lewis-grid').focus({ preventScroll: true });
  $('#lewis-mode').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Clicking an element in the periodic table (or finding it with the search)
// makes it the element to place.
function lewisPickFromTable(element) {
  if (!lewisModeActive() || !element) return;
  lewisSetElement(element.symbol);
  lewisSay(`Click a square to place ${element.name}`);
}

function insertLewisDiagram() {
  const model = lewisNormalize(lewis.model);
  if (!model) return lewisSay('Place at least one atom first');
  const node = lewisNode(model);
  const target = lewis.target;
  if (!target) lewis.draft = null;
  exitLewisMode({ keepDraft: false });
  pushHistory();
  if (target && editorContains(target)) {
    target.replaceWith(node);
  } else {
    const range = restoreEditorRange();
    range.deleteContents();
    // Never inside a fraction half or an exponent: drop it just after that instead.
    const wrapper = elementFromNode(range.startContainer)?.closest('.live-fraction, sup, sub, .lewis-diagram');
    if (wrapper && editorContains(wrapper)) { range.setStartAfter(wrapper); range.collapse(true); }
    range.insertNode(node);
    node.after(document.createTextNode(' '));
  }
  const caret = document.createRange();
  if (node.nextSibling?.nodeType === Node.TEXT_NODE) caret.setStart(node.nextSibling, Math.min(1, node.nextSibling.length));
  else caret.setStartAfter(node);
  caret.collapse(true);
  const selection = getSelection();
  selection.removeAllRanges();
  selection.addRange(caret);
  savedEditorRange = caret.cloneRange();
  inferMode(getEditorText());
  queueDraftSave();
  showToast(target ? 'Lewis diagram updated' : 'Lewis diagram added');
}

function lewisTypeLetter(letter) {
  const now = Date.now();
  const cell = `${lewis.cursor.x},${lewis.cursor.y}`;
  const previous = lewis.typed && now - lewis.typedAt < 900 && lewis.typedCell === cell ? lewis.typed : '';
  const pair = previous ? `${previous}${letter.toLowerCase()}` : '';
  lewis.typedAt = now;
  lewis.typedCell = cell;
  if (pair && lewisElementInfo(pair)) {
    lewis.typed = '';
    lewisSetElement(pair);
    return lewisPlace(lewis.cursor.x, lewis.cursor.y, pair);
  }
  const single = letter.toUpperCase();
  lewis.typed = single;
  if (lewisElementInfo(single)) {
    lewisSetElement(single);
    return lewisPlace(lewis.cursor.x, lewis.cursor.y, single);
  }
  lewisSay(`${single}… type the second letter`);
}

function lewisGridKeydown(event) {
  const arrows = { ArrowUp: 't', ArrowRight: 'r', ArrowDown: 'b', ArrowLeft: 'l' };
  const side = arrows[event.key];
  const atom = lewisCursorAtom();
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
    event.preventDefault();
    return lewisUndo();
  }
  if (event.ctrlKey || event.metaKey) return;
  if (side && event.shiftKey) { event.preventDefault(); return lewisCycleBond(atom, side); }
  if (side && event.altKey) { event.preventDefault(); return lewisCycleDots(atom, side); }
  if (side) {
    event.preventDefault();
    const [dx, dy] = LEWIS_STEP[side];
    lewis.cursor = {
      x: Math.max(0, Math.min(lewis.cols - 1, lewis.cursor.x + dx)),
      y: Math.max(0, Math.min(lewis.rows - 1, lewis.cursor.y + dy))
    };
    lewis.typed = '';
    renderLewisEditor();
    const here = lewisCursorAtom();
    return lewisSay(here ? `${lewisElementInfo(here.s).name} selected` : 'Empty square: type a symbol to place an atom');
  }
  if (event.altKey) return;
  if (/^[a-z]$/i.test(event.key)) { event.preventDefault(); return lewisTypeLetter(event.key); }
  if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); return lewisRemoveAtCursor(); }
  if (['+', '='].includes(event.key)) { event.preventDefault(); return lewisChangeAtomCharge(1); }
  if (['-', '_', '−'].includes(event.key)) { event.preventDefault(); return lewisChangeAtomCharge(-1); }
  if (event.key === 'Enter') { event.preventDefault(); return insertLewisDiagram(); }
}

function initLewisEditor() {
  $('#lewis-elements').innerHTML = LEWIS_QUICK_ELEMENTS
    .map(symbol => `<button type="button" data-lewis-element="${symbol}" aria-pressed="false" title="${lewisElementInfo(symbol).name}">${symbol}</button>`)
    .join('');
  const grid = $('#lewis-grid');
  grid.addEventListener('pointermove', event => {
    const hit = lewisHit(event);
    const same = hit && lewis.hover && ['kind', 'x', 'y', 'side'].every(key => hit[key] === lewis.hover[key]);
    if (same) return;
    lewis.hover = hit;
    renderLewisGrid();
    if (hit) lewisSay(lewisHitHint(hit));
  });
  grid.addEventListener('pointerleave', () => { lewis.hover = null; renderLewisGrid(); });
  grid.addEventListener('click', event => {
    const hit = lewisHit(event);
    if (!hit) return;
    grid.focus();
    lewis.typed = '';
    if (hit.kind === 'place') lewisPlace(hit.x, hit.y, lewis.element);
    else if (hit.kind === 'atom') { lewis.cursor = { x: hit.x, y: hit.y }; renderLewisEditor(); lewisSay(`${lewisElementInfo(hit.atom.s).name} selected`); }
    else { lewis.cursor = { x: hit.x, y: hit.y }; (hit.kind === 'bond' ? lewisCycleBond : lewisCycleDots)(hit.atom, hit.side); }
    lewis.hover = lewisHit(event);
    renderLewisGrid();
  });
  grid.addEventListener('keydown', lewisGridKeydown);

  $('#lewis-elements').addEventListener('click', event => {
    const button = event.target.closest('[data-lewis-element]');
    if (!button) return;
    lewisSetElement(button.dataset.lewisElement);
    lewisSay(`Click a square to place ${lewisElementInfo(lewis.element).name}`);
  });
  const other = $('#lewis-element-input');
  other.addEventListener('input', () => {
    const raw = other.value.trim();
    const symbol = raw ? raw[0].toUpperCase() + raw.slice(1).toLowerCase() : '';
    if (lewisSetElement(symbol)) lewisSay(`Click a square to place ${lewisElementInfo(symbol).name}`);
  });
  other.addEventListener('keydown', event => {
    // Enter would submit the dialog's form and close it.
    if (event.key === 'Enter') { event.preventDefault(); grid.focus(); }
  });
  $$('[data-lewis-charge]').forEach(button => button.addEventListener('click', () => lewisChangeAtomCharge(Number(button.dataset.lewisCharge))));
  $$('[data-lewis-ion]').forEach(button => button.addEventListener('click', () => lewisChangeIonCharge(Number(button.dataset.lewisIon))));
  $('#lewis-brackets').addEventListener('click', () => {
    const atom = lewisCursorAtom();
    if (!atom) return;
    lewisMutate(() => { atom.w = atom.w ? 0 : 1; });
    lewisSay(atom.w ? `Brackets around ${atom.s}` : 'Brackets removed');
  });
  $('#lewis-remove').addEventListener('click', lewisRemoveAtCursor);
  $('#lewis-undo').addEventListener('click', lewisUndo);
  $('#lewis-clear').addEventListener('click', () => {
    if (!lewis.model.atoms.length) return;
    lewisMutate(() => { lewis.model = { f: lewis.model.f, q: 0, atoms: [] }; });
    lewisSay('Cleared. Undo brings it back.');
  });
  const formula = $('#lewis-formula');
  formula.addEventListener('input', () => {
    lewis.model.f = formula.value;
    renderLewisPanel();
  });
  formula.addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); grid.focus(); }
  });
  $('#lewis-insert').addEventListener('click', insertLewisDiagram);
  $('#lewis-back').addEventListener('click', () => exitLewisMode());
}
