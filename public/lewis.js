// Lewis dot diagrams. They are drawn on a grid in "Lewis mode" and stored in the
// notepad as <span class="lewis-diagram" data-lewis="{json}"> holding a rendered
// SVG image. The JSON is the source of truth: the sanitizer re-renders the image
// from it, and the PNG export draws the same geometry straight onto its canvas.
//
// Model: { f, q, atoms: [{ x, y, s, q, d, w }], bonds: [[a, b, order]] }
//   f     formula typed by the student      q (top level)  whole-ion charge
//   x, y  atom centre in grid units (whole numbers until a bond angle is typed)
//   s     element symbol      q  atom charge
//   w     brackets: around the whole bonded structure this atom belongs to
//         (a charged structure of two or more atoms is always bracketed, and
//         the structure's net charge is written outside the brackets)
//   d     dots per side [top, right, bottom, left], 0-2 each
//   bonds atom indexes and bond order 1-3
// Older diagrams stored bonds as r/b (to the atom on the right / below); they are
// converted on read.
//
// Nothing here solves the homework: dots are only placed by hand, and bond angles
// are whatever the student types (no presets). Placing an atom next to a nonmetal
// only adds a single bond line, which the student can change.
//
// Loaded before app.js; everything here that touches ELEMENTS, $ or the editor runs
// only after app.js has defined them. Lewis mode swaps the writing area for the
// grid while the reference shelf stays open.

const LEWIS_SIDES = ['t', 'r', 'b', 'l'];
const LEWIS_SIDE_NAMES = { t: 'top', r: 'right', b: 'bottom', l: 'left' };
const LEWIS_STEP = { t: [0, -1], r: [1, 0], b: [0, 1], l: [-1, 0] };
const LEWIS_INK = '#10272b';
const LEWIS_DISPLAY_UNIT = 40;
const LEWIS_EXPORT_UNIT = 64;
const LEWIS_QUICK_ELEMENTS = ['H', 'C', 'N', 'O', 'F', 'Cl', 'Br', 'I', 'S', 'P', 'Na', 'K', 'Mg', 'Ca'];
// Pauling values; only the order matters (element order in the text formula).
const LEWIS_ELECTRONEGATIVITY = { F: 3.98, O: 3.44, Cl: 3.16, N: 3.04, Kr: 3, Br: 2.96, I: 2.66, Xe: 2.6, S: 2.58, C: 2.55, Se: 2.55, H: 2.2, P: 2.19, As: 2.18, Te: 2.1, B: 2.04, Si: 1.9 };
// Two atoms this close (grid units) can be bonded by clicking between them.
const LEWIS_BOND_REACH = 1.6;

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

// ---------------------------------------------------------------------------
// Model helpers. Atoms are referred to by index; bonds are [a, b, order].
// ---------------------------------------------------------------------------

function lewisDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Direction from atom a to atom b in degrees: 0 = right, 90 = up, counter-clockwise.
function lewisDirection(a, b) {
  return (Math.atan2(-(b.y - a.y), b.x - a.x) * 180 / Math.PI + 360) % 360;
}

function lewisBondIndex(model, a, b) {
  return model.bonds.findIndex(([p, q]) => (p === a && q === b) || (p === b && q === a));
}

function lewisBondOrder(model, a, b) {
  const found = lewisBondIndex(model, a, b);
  return found < 0 ? 0 : model.bonds[found][2];
}

function lewisSetBondOrder(model, a, b, order) {
  const found = lewisBondIndex(model, a, b);
  if (found >= 0 && !order) model.bonds.splice(found, 1);
  else if (found >= 0) model.bonds[found][2] = order;
  else if (order) model.bonds.push([a, b, order]);
}

// [{ other, order }] for every bond on atom i.
function lewisBondsOf(model, i) {
  return model.bonds.filter(([a, b]) => a === i || b === i).map(([a, b, order]) => ({ other: a === i ? b : a, order }));
}

function lewisBondSum(model, i) {
  return lewisBondsOf(model, i).reduce((sum, bond) => sum + bond.order, 0);
}

// The side of atom i a direction points at: right, top, left or bottom quarter.
function lewisSideOfDirection(degrees) {
  return ['r', 't', 'l', 'b'][Math.round(degrees / 90) % 4];
}

// Sides of atom i that a bond leaves from; dots are not drawn there.
function lewisBondedSides(model, i) {
  const atom = model.atoms[i];
  return new Set(lewisBondsOf(model, i).map(({ other }) => lewisSideOfDirection(lewisDirection(atom, model.atoms[other]))));
}

// Atoms joined by bonds, as lists of indexes: each one is a molecule or ion.
function lewisGroups(model) {
  const seen = new Set();
  const groups = [];
  model.atoms.forEach((_, start) => {
    if (seen.has(start)) return;
    const group = [];
    const queue = [start];
    seen.add(start);
    while (queue.length) {
      const i = queue.pop();
      group.push(i);
      lewisBondsOf(model, i).forEach(({ other }) => {
        if (!seen.has(other)) { seen.add(other); queue.push(other); }
      });
    }
    groups.push(group);
  });
  return groups;
}

function lewisGroupOf(model, i) {
  return lewisGroups(model).find(group => group.includes(i)) || [i];
}

// A structure gets brackets around all of it when any of its atoms asks for them,
// and always when it is a charged polyatomic ion; its charge goes outside them.
function lewisGroupBracketed(model, group) {
  return group.some(i => model.atoms[i].w) || (group.length > 1 && group.some(i => model.atoms[i].q));
}

// Nearest atom to a point within reach, or -1.
function lewisAtomNear(model, x, y, reach = 0.45) {
  let best = -1;
  let bestDistance = reach;
  model.atoms.forEach((atom, i) => {
    const distance = Math.hypot(atom.x - x, atom.y - y);
    if (distance < bestDistance) { best = i; bestDistance = distance; }
  });
  return best;
}

function lewisChargeText(charge) {
  if (!charge) return '';
  const sign = charge > 0 ? '+' : '−';
  return Math.abs(charge) === 1 ? sign : `${Math.abs(charge)}${sign}`;
}

function lewisNewAtom(x, y, s) {
  return { x, y, s, q: 0, d: [0, 0, 0, 0], w: 0 };
}

// Validates untrusted JSON (it comes back out of saved HTML), converts the old
// r/b bond format, and shifts the drawing so its top-left atom sits at 0,0.
function lewisNormalize(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.atoms)) return null;
  const int = (value, min, max) => {
    const number = Math.round(Number(value));
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : 0;
  };
  const coordinate = value => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.round(Math.min(60, Math.max(-60, number)) * 1000) / 1000 : 0;
  };
  const atoms = [];
  const kept = new Map();
  raw.atoms.slice(0, 80).forEach((atom, rawIndex) => {
    const s = String(atom?.s || '');
    if (!lewisElementInfo(s)) return;
    const x = coordinate(atom.x);
    const y = coordinate(atom.y);
    if (atoms.some(other => Math.hypot(other.x - x, other.y - y) < 0.3)) return;
    kept.set(rawIndex, atoms.length);
    atoms.push({ x, y, s, q: int(atom.q, -4, 4), d: LEWIS_SIDES.map((_, i) => int(atom.d?.[i], 0, 2)), w: atom.w ? 1 : 0 });
  });
  if (!atoms.length) return null;

  const model = { f: lewisCleanFormula(raw.f), q: int(raw.q, -4, 4), atoms, bonds: [] };
  const addBond = (a, b, order) => {
    if (a === undefined || b === undefined || a === b || !order) return;
    if (lewisBondIndex(model, a, b) < 0) model.bonds.push([a, b, order]);
  };
  if (Array.isArray(raw.bonds)) {
    raw.bonds.slice(0, 200).forEach(bond => {
      if (Array.isArray(bond)) addBond(kept.get(int(bond[0], 0, 999)), kept.get(int(bond[1], 0, 999)), int(bond[2], 0, 3));
    });
  } else {
    // Old format: r / b = bond order to the atom one square right / below.
    const at = new Map();
    raw.atoms.forEach((atom, rawIndex) => { if (kept.has(rawIndex)) at.set(`${coordinate(atom.x)},${coordinate(atom.y)}`, rawIndex); });
    raw.atoms.forEach((atom, rawIndex) => {
      if (!kept.has(rawIndex)) return;
      const x = coordinate(atom.x);
      const y = coordinate(atom.y);
      addBond(kept.get(rawIndex), kept.get(at.get(`${x + 1},${y}`)), int(atom.r, 0, 3));
      addBond(kept.get(rawIndex), kept.get(at.get(`${x},${y + 1}`)), int(atom.b, 0, 3));
    });
  }
  const minX = Math.min(...atoms.map(atom => atom.x));
  const minY = Math.min(...atoms.map(atom => atom.y));
  atoms.forEach(atom => {
    atom.x = Math.round((atom.x - minX) * 1000) / 1000;
    atom.y = Math.round((atom.y - minY) * 1000) / 1000;
  });
  return model;
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
    atoms: model.atoms.map(({ x, y, s, q, d, w }) => {
      const atom = { x, y, s };
      if (q) atom.q = q;
      if (d.some(Boolean)) atom.d = d;
      if (w) atom.w = 1;
      return atom;
    }),
    bonds: model.bonds.length ? model.bonds : undefined
  });
}

// A readable formula for copy, search and alt text when none was typed: H first
// when it is bonded to O, S or a halogen (H2O, HCl), otherwise last (CH4, NH3);
// the rest by electronegativity, so NaCl and CO2 come out the way they are written.
function lewisFormula(model) {
  if (model.f) return model.f;
  const counts = new Map();
  model.atoms.forEach(atom => counts.set(atom.s, (counts.get(atom.s) || 0) + 1));
  const hydrogenFirst = model.bonds.some(([a, b]) => [[a, b], [b, a]].some(([h, other]) => {
    const partner = model.atoms[other].s;
    return model.atoms[h].s === 'H' && (['O', 'S'].includes(partner) || lewisElementInfo(partner)?.category === 'halogen');
  }));
  const rank = symbol => symbol === 'H' ? (hydrogenFirst ? -1 : 99) : (LEWIS_ELECTRONEGATIVITY[symbol] ?? 1);
  const formula = [...counts].sort(([a], [b]) => rank(a) - rank(b)).map(([symbol, count]) => `${symbol}${count > 1 ? count : ''}`).join('');
  const charge = model.q || model.atoms.reduce((sum, atom) => sum + atom.q, 0);
  return `${formula}${lewisChargeText(charge)}`;
}

function lewisHalfWidth(symbol) {
  return symbol.length > 1 ? 0.25 : 0.15;
}

// How far from an atom's centre a bond line starts when it leaves in direction
// (ux, uy): an ellipse around the symbol, wider for two-letter symbols.
function lewisBondGap(symbol, ux, uy) {
  const rx = lewisHalfWidth(symbol) + 0.08;
  const ry = 0.25;
  return (rx * ry) / Math.hypot(ry * ux, rx * uy);
}

// Shapes in grid units with each atom's centre at (x, y): text, dots, lines and
// bracket polylines. The SVG and canvas renderers below only translate these.
function lewisGeometry(model) {
  const shapes = [];
  if (!model.atoms.length) return { shapes, minX: 0, minY: 0, maxX: 0, maxY: 0 };
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
  const bracketedGroups = lewisGroups(model).filter(group => lewisGroupBracketed(model, group));
  const bracketedAtoms = new Set(bracketedGroups.flat());

  model.atoms.forEach((atom, i) => {
    const { x, y, s } = atom;
    const half = lewisHalfWidth(s);
    shapes.push({ type: 'text', x, y, size: 0.46, value: s, anchor: 'middle' });
    grow(x - half - 0.16, y - 0.36, x + half + 0.16, y + 0.36);

    const bonded = lewisBondedSides(model, i);
    LEWIS_SIDES.forEach((side, slot) => {
      const count = atom.d[slot];
      if (!count || bonded.has(side)) return;
      (count === 2 ? [-0.075, 0.075] : [0]).forEach(offset => {
        const point = side === 't' ? [x + offset, y - 0.31]
          : side === 'b' ? [x + offset, y + 0.31]
          : side === 'r' ? [x + half + 0.1, y + offset]
          : [x - half - 0.1, y + offset];
        shapes.push({ type: 'dot', x: point[0], y: point[1], r: 0.042 });
      });
    });

    // An unbracketed atom (Na+ beside [Cl]-) carries its own charge.
    const charge = lewisChargeText(atom.q);
    if (charge && !bracketedAtoms.has(i)) {
      const cx = x + half + 0.12;
      const cy = y - 0.3;
      shapes.push({ type: 'text', x: cx, y: cy, size: 0.27, value: charge, anchor: 'start' });
      grow(cx, cy - 0.16, cx + 0.17 * charge.length, cy + 0.16);
    }
  });

  // Brackets around each bracketed structure as a whole, its net charge outside.
  bracketedGroups.forEach(group => {
    const atoms = group.map(i => model.atoms[i]);
    const left = Math.min(...atoms.map(atom => atom.x)) - 0.46;
    const right = Math.max(...atoms.map(atom => atom.x)) + 0.46;
    const top = Math.min(...atoms.map(atom => atom.y)) - 0.45;
    const bottom = Math.max(...atoms.map(atom => atom.y)) + 0.45;
    bracket(left, top, right, bottom);
    const net = lewisChargeText(atoms.reduce((sum, atom) => sum + atom.q, 0));
    if (net) {
      shapes.push({ type: 'text', x: right + 0.07, y: top + 0.04, size: 0.3, value: net, anchor: 'start' });
      grow(right, top - 0.14, right + 0.07 + 0.19 * net.length, top + 0.2);
    }
  });

  model.bonds.forEach(([a, b, order]) => {
    const from = model.atoms[a];
    const to = model.atoms[b];
    const length = lewisDistance(from, to);
    if (length < 0.01) return;
    const ux = (to.x - from.x) / length;
    const uy = (to.y - from.y) / length;
    const startGap = lewisBondGap(from.s, ux, uy);
    const endGap = lewisBondGap(to.s, ux, uy);
    if (startGap + endGap >= length) return;
    const offsets = order === 1 ? [0] : order === 2 ? [-0.06, 0.06] : [-0.1, 0, 0.1];
    offsets.forEach(offset => {
      const nx = -uy * offset;
      const ny = ux * offset;
      shapes.push({
        type: 'line',
        x1: from.x + ux * startGap + nx, y1: from.y + uy * startGap + ny,
        x2: to.x - ux * endGap + nx, y2: to.y - uy * endGap + ny
      });
    });
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
// Lewis mode (the drawing editor)
// ---------------------------------------------------------------------------

const lewis = {
  model: { f: '', q: 0, atoms: [], bonds: [] },
  cols: 9,
  rows: 6,
  // The keyboard cursor is a grid square; the selected atom is the one in it.
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

// The atom in the cursor's square: anywhere inside it, since a swung atom
// rarely sits on a square's centre.
function lewisCursorAtom() {
  return lewisAtomNear(lewis.model, lewis.cursor.x, lewis.cursor.y, 0.71);
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

function lewisName(i) {
  return lewisElementInfo(lewis.model.atoms[i]?.s)?.name || '';
}

const LEWIS_DEFAULT_HINT = 'Click a square to place an atom. Click beside an atom to add dots, or between two atoms for a bond.';

function lewisPlace(x, y, symbol) {
  lewis.cursor = { x: Math.round(x), y: Math.round(y) };
  const model = lewis.model;
  const existing = lewisAtomNear(model, x, y, 0.5);
  if (existing < 0 && lewisAtomNear(model, x, y, 0.75) >= 0) return lewisSay('Too close to another atom');
  lewisMutate(() => {
    if (existing >= 0) { model.atoms[existing].s = symbol; return; }
    model.atoms.push(lewisNewAtom(x, y, symbol));
    const added = model.atoms.length - 1;
    // A single bond line to touching nonmetals; the student changes it if needed.
    model.atoms.forEach((other, i) => {
      if (i === added || lewisDistance(other, model.atoms[added]) > 1.05) return;
      if (lewisBondSum(model, added) >= lewisBondCapacity(symbol)) return;
      // The atom already there may go past its usual count (the fourth H on NH4+),
      // up to four bonds; H never takes a second bond.
      if (!lewisBondCapacity(other.s) || lewisBondSum(model, i) >= (other.s === 'H' ? 1 : 4)) return;
      lewisSetBondOrder(model, added, i, 1);
    });
  });
  lewisSay(`${lewisElementInfo(symbol).name} placed`);
}

function lewisRemoveAtCursor() {
  const index = lewisCursorAtom();
  if (index < 0) return lewisSay('That square is empty');
  const name = lewisName(index);
  lewisMutate(() => {
    const model = lewis.model;
    model.atoms.splice(index, 1);
    model.bonds = model.bonds
      .filter(([a, b]) => a !== index && b !== index)
      .map(([a, b, order]) => [a > index ? a - 1 : a, b > index ? b - 1 : b, order]);
  });
  lewisSay(`${name} removed`);
}

const LEWIS_BOND_NAMES = ['No bond', 'Single bond', 'Double bond', 'Triple bond'];

function lewisCycleBond(a, b) {
  if (a < 0 || b < 0) return lewisSay('Point at the space between two atoms to bond them');
  const next = (lewisBondOrder(lewis.model, a, b) + 1) % 4;
  lewisMutate(() => lewisSetBondOrder(lewis.model, a, b, next));
  lewisSay(`${LEWIS_BOND_NAMES[next]} between ${lewis.model.atoms[a].s} and ${lewis.model.atoms[b].s}`);
}

// The atom (within bonding reach) that an arrow key points at from atom i.
function lewisNeighbourToward(i, side) {
  const from = lewis.model.atoms[i];
  const [dx, dy] = LEWIS_STEP[side];
  const wanted = (Math.atan2(-dy, dx) * 180 / Math.PI + 360) % 360;
  let best = -1;
  let bestDistance = LEWIS_BOND_REACH;
  lewis.model.atoms.forEach((atom, j) => {
    if (j === i) return;
    const distance = lewisDistance(from, atom);
    const off = Math.abs(((lewisDirection(from, atom) - wanted) + 540) % 360 - 180);
    if (off <= 50 && distance <= bestDistance) { best = j; bestDistance = distance; }
  });
  return best;
}

function lewisCycleDots(i, side) {
  if (i < 0) return lewisSay('Place an atom first');
  if (lewisBondedSides(lewis.model, i).has(side)) return lewisSay('A bond leaves from that side; remove it to put dots there');
  const atom = lewis.model.atoms[i];
  const slot = LEWIS_SIDES.indexOf(side);
  const next = (atom.d[slot] + 1) % 3;
  lewisMutate(() => { atom.d[slot] = next; });
  lewisSay(`${['No dots', 'One dot', 'A pair'][next]} on the ${LEWIS_SIDE_NAMES[side]}`);
}

function lewisChangeAtomCharge(delta) {
  const i = lewisCursorAtom();
  if (i < 0) return lewisSay('Select an atom to give it a charge');
  const atom = lewis.model.atoms[i];
  lewisMutate(() => { atom.q = Math.max(-4, Math.min(4, atom.q + delta)); });
  lewisSay(atom.q ? `${atom.s} charge ${lewisChargeText(atom.q)}` : `${atom.s} is neutral`);
}


function lewisFormatAngle(degrees) {
  return String(Math.round(degrees * 10) / 10);
}

// Point the bond from atom pivot to atom other in the typed direction. The other
// atom swings round the pivot at the same bond length, carrying everything bonded
// beyond it (unless that loops back to the pivot, as in a ring).
function lewisSetBondAngle(pivot, other, degrees) {
  const model = lewis.model;
  const centre = model.atoms[pivot];
  const turn = (degrees - lewisDirection(centre, model.atoms[other])) * Math.PI / 180;
  const moving = new Set([other]);
  const queue = [other];
  while (queue.length) {
    const current = queue.pop();
    lewisBondsOf(model, current).forEach(({ other: next }) => {
      if (next !== pivot && !moving.has(next)) { moving.add(next); queue.push(next); }
    });
  }
  const loopsBack = [...moving].some(i => i !== other && lewisBondOrder(model, i, pivot));
  const swung = loopsBack ? [other] : [...moving];
  lewisMutate(() => {
    swung.forEach(i => {
      const atom = model.atoms[i];
      const dx = atom.x - centre.x;
      const dy = -(atom.y - centre.y);
      const rx = dx * Math.cos(turn) - dy * Math.sin(turn);
      const ry = dx * Math.sin(turn) + dy * Math.cos(turn);
      atom.x = Math.round((centre.x + rx) * 1000) / 1000;
      atom.y = Math.round((centre.y - ry) * 1000) / 1000;
    });
    lewisFitGrid();
  });
  lewisSay(`Bond from ${centre.s} to ${model.atoms[other].s} now points at ${lewisFormatAngle(degrees)}°`);
}

// Grow the grid when a swung atom lands outside it; shift everything if it went
// off the top or left.
function lewisFitGrid() {
  const atoms = lewis.model.atoms;
  if (!atoms.length) return;
  const shiftX = Math.max(0, Math.ceil(-Math.min(...atoms.map(atom => atom.x))));
  const shiftY = Math.max(0, Math.ceil(-Math.min(...atoms.map(atom => atom.y))));
  if (shiftX || shiftY) {
    atoms.forEach(atom => { atom.x += shiftX; atom.y += shiftY; });
    lewis.cursor = { x: lewis.cursor.x + shiftX, y: lewis.cursor.y + shiftY };
  }
  lewis.cols = Math.max(lewis.cols, Math.ceil(Math.max(...atoms.map(atom => atom.x)) + 1));
  lewis.rows = Math.max(lewis.rows, Math.ceil(Math.max(...atoms.map(atom => atom.y)) + 1));
}

function lewisSetElement(symbol) {
  if (!lewisElementInfo(symbol)) return false;
  lewis.element = symbol;
  renderLewisPanel();
  return true;
}

// Where a pointer sits on the grid, and what clicking there would do. Atom
// coordinates put a square's centre at (column, row); the SVG draws them +0.5.
function lewisHit(event) {
  const svg = $('#lewis-grid');
  const box = svg.getBoundingClientRect();
  const gx = (event.clientX - box.left) / box.width * lewis.cols;
  const gy = (event.clientY - box.top) / box.height * lewis.rows;
  if (gx < 0 || gy < 0 || gx >= lewis.cols || gy >= lewis.rows) return null;
  const px = gx - 0.5;
  const py = gy - 0.5;
  const model = lewis.model;

  // Between two atoms in bonding reach: the bond.
  let bond = null;
  let bondDistance = 0.16;
  model.atoms.forEach((a, i) => model.atoms.forEach((b, j) => {
    if (j <= i) return;
    const length = lewisDistance(a, b);
    if (length > LEWIS_BOND_REACH || length < 0.01) return;
    const t = ((px - a.x) * (b.x - a.x) + (py - a.y) * (b.y - a.y)) / (length * length);
    if (t < 0.28 || t > 0.72) return;
    const off = Math.abs((px - a.x) * (b.y - a.y) - (py - a.y) * (b.x - a.x)) / length;
    if (off < bondDistance) { bond = { kind: 'bond', i, j }; bondDistance = off; }
  }));
  if (bond) return bond;

  const i = lewisAtomNear(model, px, py, 0.5);
  if (i >= 0) {
    const atom = model.atoms[i];
    const dx = px - atom.x;
    const dy = py - atom.y;
    if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) return { kind: 'atom', i };
    const side = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'b' : 't');
    return { kind: 'dots', i, side };
  }
  const x = Math.floor(gx);
  const y = Math.floor(gy);
  if (lewisAtomNear(model, x, y, 0.75) >= 0) return null;
  return { kind: 'place', x, y };
}

function lewisSameHit(a, b) {
  return Boolean(a && b) && ['kind', 'i', 'j', 'side', 'x', 'y'].every(key => a[key] === b[key]);
}

function lewisHitHint(hit) {
  if (!hit) return '';
  const model = lewis.model;
  if (hit.kind === 'place') return `Click to place ${lewisElementInfo(lewis.element).name}`;
  if (hit.kind === 'atom') return `${lewisName(hit.i)}: click to select, then set its charge, brackets or bond angles`;
  if (hit.kind === 'bond') {
    const next = (lewisBondOrder(model, hit.i, hit.j) + 1) % 4;
    return next ? `Click for a ${LEWIS_BOND_NAMES[next].toLowerCase()}` : 'Click to remove the bond';
  }
  const next = (model.atoms[hit.i].d[LEWIS_SIDES.indexOf(hit.side)] + 1) % 3;
  return `Click for ${['no dots', 'one dot', 'a pair'][next]} on the ${LEWIS_SIDE_NAMES[hit.side]}`;
}

// The grid's viewBox is 100 user units per cell: sub-pixel font sizes in a scaled-up
// SVG render badly in some browsers.
const LEWIS_GRID_UNIT = 100;

function lewisHitZone(hit) {
  if (!hit) return '';
  const g = value => Math.round(value * LEWIS_GRID_UNIT);
  const rect = (left, top, width, height, extra = '') => `<rect class="lewis-zone${extra}" x="${g(left)}" y="${g(top)}" width="${g(width)}" height="${g(height)}"/>`;
  if (hit.kind === 'place') {
    const { x, y } = hit;
    return `${rect(x + 0.08, y + 0.08, 0.84, 0.84, ' is-place')}<text class="lewis-ghost" x="${g(x + 0.5)}" y="${g(y + 0.5)}" font-family="Georgia,serif" font-size="${g(0.46)}" text-anchor="middle" dominant-baseline="central">${lewis.element}</text>`;
  }
  const atoms = lewis.model.atoms;
  if (hit.kind === 'bond') {
    const a = atoms[hit.i];
    const b = atoms[hit.j];
    const length = lewisDistance(a, b);
    const ux = (b.x - a.x) / length;
    const uy = (b.y - a.y) / length;
    const mx = (a.x + b.x) / 2 + 0.5;
    const my = (a.y + b.y) / 2 + 0.5;
    const corners = [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([along, across]) =>
      `${g(mx + ux * 0.24 * along - uy * 0.13 * across)},${g(my + uy * 0.24 * along + ux * 0.13 * across)}`);
    return `<polygon class="lewis-zone" points="${corners.join(' ')}"/>`;
  }
  const { x, y } = atoms[hit.i];
  if (hit.kind === 'atom') return rect(x + 0.24, y + 0.24, 0.52, 0.52);
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
  // The cursor sits on the selected atom (which may be off the squares once a bond
  // angle is typed), or on the empty square.
  const selected = lewis.model.atoms[lewisCursorAtom()] || cursor;
  markup += `<rect class="lewis-cursor" x="${Math.round((selected.x + 0.04) * g)}" y="${Math.round((selected.y + 0.04) * g)}" width="${0.92 * g}" height="${0.92 * g}" vector-effect="non-scaling-stroke"/>`;
  markup += lewisShapesSVG(lewisGeometry(lewis.model).shapes, g, 0.5, 0.5);
  svg.innerHTML = markup;
}

function renderLewisPanel() {
  $$('[data-lewis-element]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lewisElement === lewis.element)));
  $('#lewis-element-name').textContent = lewisElementInfo(lewis.element)?.name || '';
  $('#lewis-formula-preview').replaceChildren(...(lewis.model.f ? [lewisFormulaHTMLNode(lewis.model.f)] : []));
  const other = $('#lewis-element-input');
  if (document.activeElement !== other) other.value = LEWIS_QUICK_ELEMENTS.includes(lewis.element) ? '' : lewis.element;
  const i = lewisCursorAtom();
  const atom = lewis.model.atoms[i];
  $('#lewis-atom-name').textContent = atom ? lewisName(i) : 'None';
  $('#lewis-atom-charge').textContent = atom ? (lewisChargeText(atom.q) || '0') : '0';
  $$('[data-lewis-charge], #lewis-brackets, #lewis-remove').forEach(button => { button.disabled = !atom; });
  const group = atom ? lewisGroupOf(lewis.model, i) : [];
  const forced = group.length > 1 && group.some(j => lewis.model.atoms[j].q);
  const brackets = $('#lewis-brackets');
  brackets.setAttribute('aria-pressed', String(Boolean(atom) && lewisGroupBracketed(lewis.model, group)));
  if (forced) brackets.disabled = true;
  brackets.title = forced ? 'A charged structure is always bracketed' : 'Brackets around the whole structure this atom is part of';
  $('#lewis-undo').disabled = !lewis.history.length;
  $('#lewis-insert').textContent = lewis.target ? 'Update diagram' : 'Add to notepad';
  $('#lewis-insert').disabled = !lewis.model.atoms.length;
}

const LEWIS_BOND_GLYPHS = ['', '—', '=', '≡'];

// One box per bond on the selected atom: the direction it leaves in, typed by hand.
function renderLewisAngles() {
  const list = $('#lewis-bond-angles');
  const focused = document.activeElement?.dataset?.bondAngle;
  const i = lewisCursorAtom();
  const bonds = i < 0 ? [] : lewisBondsOf(lewis.model, i);
  list.hidden = !bonds.length;
  list.innerHTML = bonds.length ? `<p class="lewis-angle-key">Bond directions: 0° points right, 90° up</p>${bonds.map(({ other, order }) => {
    const label = `${lewis.model.atoms[i].s}${LEWIS_BOND_GLYPHS[order]}${lewis.model.atoms[other].s}`;
    return `<label class="lewis-angle-row"><span>${label}</span><input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-bond-angle="${other}" value="${lewisFormatAngle(lewisDirection(lewis.model.atoms[i], lewis.model.atoms[other]))}" aria-label="Direction of the bond from ${lewisName(i)} to ${lewisName(other)}, in degrees" /><b>°</b></label>`;
  }).join('')}` : '';
  if (focused !== undefined) {
    const again = list.querySelector(`[data-bond-angle="${focused}"]`);
    if (again) { again.focus(); again.select(); }
  }
}

function commitLewisAngle(field) {
  const pivot = lewisCursorAtom();
  const other = Number(field.dataset.bondAngle);
  if (pivot < 0 || !lewis.model.atoms[other]) return;
  const typed = Number(field.value.replace(/[°\s]/g, ''));
  if (!field.value.trim() || !Number.isFinite(typed)) {
    lewisSay('Type the direction as a number of degrees, like 30');
    return renderLewisAngles();
  }
  const degrees = ((typed % 360) + 360) % 360;
  const current = lewisDirection(lewis.model.atoms[pivot], lewis.model.atoms[other]);
  if (Math.abs(degrees - current) < 0.05) return;
  lewisSetBondAngle(pivot, other, degrees);
}

function renderLewisEditor() {
  renderLewisGrid();
  renderLewisPanel();
  renderLewisAngles();
}

// Lewis mode takes the writing area's place inside the notepad card, so the
// reference shelf (periodic table, ions) stays in view while drawing.
function lewisModeActive() {
  return !$('#lewis-mode').hidden;
}

function exitLewisMode({ keepDraft = true } = {}) {
  if (!lewisModeActive()) return;
  if (keepDraft && !lewis.target && (lewis.model.atoms.length || lewis.model.f)) {
    lewis.draft = lewisNormalize(lewis.model) || { f: lewisCleanFormula(lewis.model.f), q: 0, atoms: [], bonds: [] };
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
  const width = atoms.length ? Math.ceil(Math.max(...atoms.map(atom => atom.x))) + 1 : 0;
  const height = atoms.length ? Math.ceil(Math.max(...atoms.map(atom => atom.y))) + 1 : 0;
  lewis.cols = Math.max(narrow ? 6 : 9, width + 2);
  lewis.rows = Math.max(narrow ? 5 : 6, height + 2);
  const offsetX = Math.floor((lewis.cols - width) / 2);
  const offsetY = Math.floor((lewis.rows - height) / 2);
  atoms.forEach(atom => { atom.x += offsetX; atom.y += offsetY; });
  lewis.model = { f: existing?.f || '', q: 0, atoms, bonds: existing?.bonds || [] };
  // Older diagrams kept an ion's charge on the whole drawing; it now lives on an
  // atom of the bracketed structure (drawn the same way: outside the brackets).
  if (existing?.q && atoms.length) {
    const group = lewisGroupOf(lewis.model, 0);
    atoms[0].q = Math.max(-4, Math.min(4, atoms[0].q + existing.q));
    group.forEach(j => { atoms[j].w = 1; });
  }
  $('#lewis-formula').value = lewis.model.f;
  lewis.cursor = atoms[0] ? { x: Math.round(atoms[0].x), y: Math.round(atoms[0].y) } : { x: Math.floor(lewis.cols / 2), y: Math.floor((lewis.rows - 1) / 2) };
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

// Chrome keeps an invisible placeholder <br> at the end of the writing (after
// "[ " for example), and the caret can end up just past it. Inserting there put
// the diagram on a new line below what was typed, so step back in front of any
// trailing <br> that has nothing visible after it. (A deliberate Enter leaves the
// caret in a text node after its <br>, so it is not touched.)
function lewisStayOnVisibleLine(range) {
  if (!range.collapsed || range.startContainer !== input) return;
  const offset = range.startOffset;
  const before = input.childNodes[offset - 1];
  if (before?.nodeName !== 'BR' || !before.previousSibling || before.previousSibling.nodeName === 'BR') return;
  const after = [...input.childNodes].slice(offset);
  if (after.some(node => node.textContent.replace(/[\s​]/g, '') || node.nodeName === 'SPAN')) return;
  range.setStartBefore(before);
  range.collapse(true);
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
    lewisStayOnVisibleLine(range);
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
  // On a swung atom, type over that atom rather than the square under it.
  const here = lewis.model.atoms[lewisCursorAtom()];
  const [x, y] = here ? [here.x, here.y] : [lewis.cursor.x, lewis.cursor.y];
  if (pair && lewisElementInfo(pair)) {
    lewis.typed = '';
    lewisSetElement(pair);
    return lewisPlace(x, y, pair);
  }
  const single = letter.toUpperCase();
  lewis.typed = single;
  if (lewisElementInfo(single)) {
    lewisSetElement(single);
    return lewisPlace(x, y, single);
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
  if (side && event.shiftKey) {
    event.preventDefault();
    const other = atom < 0 ? -1 : lewisNeighbourToward(atom, side);
    if (other < 0) return lewisSay(`No atom to the ${LEWIS_SIDE_NAMES[side]} to bond to`);
    return lewisCycleBond(atom, other);
  }
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
    return lewisSay(here >= 0 ? `${lewisName(here)} selected` : 'Empty square: type a symbol to place an atom');
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
    if (lewisSameHit(hit, lewis.hover)) return;
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
    const select = i => { lewis.cursor = { x: Math.round(lewis.model.atoms[i].x), y: Math.round(lewis.model.atoms[i].y) }; };
    if (hit.kind === 'place') lewisPlace(hit.x, hit.y, lewis.element);
    else if (hit.kind === 'atom') { select(hit.i); renderLewisEditor(); lewisSay(`${lewisName(hit.i)} selected`); }
    else if (hit.kind === 'bond') lewisCycleBond(hit.i, hit.j);
    else { select(hit.i); lewisCycleDots(hit.i, hit.side); }
    lewis.hover = lewisHit(event);
    renderLewisGrid();
  });
  grid.addEventListener('keydown', lewisGridKeydown);

  const angles = $('#lewis-bond-angles');
  angles.addEventListener('keydown', event => {
    const field = event.target.closest('[data-bond-angle]');
    if (!field || event.key !== 'Enter') return;
    event.preventDefault();
    commitLewisAngle(field);
  });
  angles.addEventListener('change', event => {
    const field = event.target.closest('[data-bond-angle]');
    if (field) commitLewisAngle(field);
  });

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
    if (event.key === 'Enter') { event.preventDefault(); grid.focus(); }
  });
  $$('[data-lewis-charge]').forEach(button => button.addEventListener('click', () => lewisChangeAtomCharge(Number(button.dataset.lewisCharge))));
  $('#lewis-brackets').addEventListener('click', () => {
    const i = lewisCursorAtom();
    if (i < 0) return;
    const group = lewisGroupOf(lewis.model, i);
    const on = !lewisGroupBracketed(lewis.model, group);
    lewisMutate(() => group.forEach(j => { lewis.model.atoms[j].w = on ? 1 : 0; }));
    lewisSay(on ? `Brackets around the whole ${group.length > 1 ? 'structure' : lewis.model.atoms[i].s}` : 'Brackets removed');
  });
  $('#lewis-remove').addEventListener('click', lewisRemoveAtCursor);
  $('#lewis-undo').addEventListener('click', lewisUndo);
  $('#lewis-clear').addEventListener('click', () => {
    if (!lewis.model.atoms.length) return;
    lewisMutate(() => { lewis.model = { f: lewis.model.f, q: 0, atoms: [], bonds: [] }; });
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
