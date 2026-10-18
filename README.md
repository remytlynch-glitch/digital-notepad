# Digital Notepad

A keyboard-first notepad for chemistry homework. Live at **https://chemistry-keyboard.netlify.app**.

Plain HTML, CSS and JavaScript: no build step, no dependencies, no framework.

## What it does

- **Write your working like on paper.** `Enter` starts a new line; `/` turns the text before it into a stacked fraction; `Tab` or `→` leaves the denominator; `*` starts the next factor in a dimensional-analysis chain.
- **Steps.** `Next step` (`Alt+Enter`) freezes the current step and carries a copy down. Cross out cancelled units and they drop out of the next step. Edit, insert or delete any earlier step.
- **Lewis dot diagrams.** `Lewis dots` (`Alt+L`) switches the writing area into a drawing mode with the periodic table still open beside it (click an element there to place it): place atoms, click beside an atom for dots or between two atoms for a bond (single → double → triple). You place every dot yourself (no auto-fill: working them out is the homework). A Formula box keeps the formula in view while you draw and captions the diagram (`NH4+` shows as NH₄⁺). Select an atom and type each bond's direction in degrees (0° right, 90° up) to angle it; there are no shape presets. Brackets wrap the whole bonded structure (a charged polyatomic ion is bracketed automatically, net charge outside), so `[N≡C]⁻` and `Na⁺ [:Cl:]⁻` both work; and diagrams sit inline with your writing (`Na· + ·Cl: → Na⁺ [:Cl:]⁻`). Fully keyboard-driven: arrows move, type a symbol, `Shift`+arrow bonds, `Alt`+arrow dots.
- **Notation.** Subscript, superscript (space exits the exponent), four highlight colours, undo.
- **Commands** (`Ctrl+Enter`): `balance Fe + O2 -> Fe2O3`, `convert 2500 mg to g`, `fraction 1 mol / 6.022e23 particles * 18.015 g / 1 mol`.
- **Reference shelf.** Periodic table (click a tile to copy its mass), polyatomic ions, course guide, metric prefixes. Draggable calculator.
- **PNG export** of a note or the whole page, rendered at 3× for sharp printing.
- **Saved notes** with full-text search.

## Privacy and cloud sync

Everything saves in your browser first. Optional cross-device sync stores your notepad in Supabase, locked to a **256-bit random sync code** that never leaves your devices:

- The database stores only the SHA-256 hash of the code (`supabase/schema.sql`).
- Row-level security compares that hash against the `X-Bench-Key` header on every read, insert, update and delete, so a request without the right code sees nothing.
- The Supabase key in `app.js` is the public `anon` key. It is meant to be public; on its own it cannot open anyone's notepad.

Keep your sync code private: anyone who has it can open your notepad.

## Run locally

Serve `public/` with any static server, for example:

```sh
python -m http.server 4173 --directory public
```

Then open http://localhost:4173. `netlify.toml` holds the production security headers (a strict Content-Security-Policy: no inline styles, no `eval`), so test behind those headers before shipping anything that writes styles or evaluates code.

To self-host sync, run `supabase/schema.sql` in your own Supabase project and change `CLOUD_API_URL` and `CLOUD_ANON_KEY` in `public/app.js`.

## License

MIT
