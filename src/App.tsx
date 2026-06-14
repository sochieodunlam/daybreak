import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ---- Palette: white / ink / honey, honeycomb editorial ----
const palette = {
  paper: "#FFFFFF",
  ink: "#1A1714",
  muted: "#7C746B",
  line: "#1A1714",
  hair: "#E7E1D8",
  honey: "#C8902B",
  honeyLt: "#F4E0B0",
  honeyFill: "#FBEFD6",
  land: "#FCF4E4",
  wash: "#FAF7F1",
};

// lon/lat used to place each origin on the equirectangular hex map
const coffees = [
  { origin: "Ethiopia", country: "Ethiopia", name: "Yirgacheffe", notes: "Floral · citrus · tea-like", roast: "Light roast", slug: "ethiopia", photo: "/daybreak-assets/coffee-ethiopia-yirgacheffe.png", lon: 40, lat: 6.8 },
  { origin: "Colombia", country: "Colombia", name: "Huila", notes: "Caramel · red apple · balanced", roast: "Medium roast", slug: "colombia", photo: "/daybreak-assets/coffee-colombia-huila.png", lon: -75.5, lat: 2.5 },
  { origin: "Sumatra", country: "Indonesia", name: "Mandheling", notes: "Cocoa · cedar · full body", roast: "Dark roast", slug: "sumatra", photo: "/daybreak-assets/coffee-sumatra-mandheling.png", lon: 99, lat: 2.6 },
  { origin: "Guatemala", country: "Guatemala", name: "Antigua", notes: "Chocolate · orange · spice", roast: "Medium roast", slug: "guatemala", photo: "/daybreak-assets/coffee-guatemala-antigua.png", lon: -90.7, lat: 14.5 },
];

const plans = [
  { name: "Solo", detail: "One 12oz bag per week", price: 18, popular: false },
  { name: "Duo", detail: "Two 12oz bags per week", price: 32, popular: true },
  { name: "Office", detail: "Five 12oz bags per week", price: 75, popular: false },
];

const steps = [
  { n: "01", title: "Tell us how you brew", body: "Espresso, pour over, drip, or French press — we tune the grind to match." },
  { n: "02", title: "We roast fresh, weekly", body: "Each week we pick a single-origin coffee and roast it the day before it ships." },
  { n: "03", title: "It lands at your door", body: "Arrives within two days of roasting. You brew it. You're happy." },
  { n: "04", title: "Pause anytime", body: "Skip, pause, or cancel whenever. No commitment, ever." },
];

const testimonials = [
  { quote: "Best coffee I've ever had.", who: "Sarah M." },
  { quote: "I look forward to it every Monday.", who: "James T." },
  { quote: "The Ethiopia one changed my life, honestly.", who: "Priya K." },
];

const faqs = [
  { q: "Can I pause?", a: "Yes — pause anytime from your account page. No phone calls, no hassle." },
  { q: "Do you ship internationally?", a: "Currently the US and Canada only. More countries are on the roadmap." },
  { q: "Is it organic?", a: "Most of our roasts are organic; a few are not. It's always marked on the bag." },
  { q: "What if I don't like it?", a: "Email us and we'll make it right. We want every cup to land." },
  { q: "Where are you located?", a: "Oakland, California — roasted in small batches just down the street." },
];

export default function App() {
  return (
    <div style={{ background: palette.paper, color: palette.ink, minHeight: "100vh", fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <GlobalStyle />
      <Nav />
      <Hero />
      <HowItWorks />
      <ThisWeek />
      <Plans />
      <Testimonials />
      <Story />
      <FAQ />
      <Footer />
    </div>
  );
}

// ---- Honeycomb line-art ----
function Hexagon({ size = 28, stroke = palette.ink, sw = 1.5, children }: { size?: number; stroke?: string; sw?: number; children?: React.ReactNode }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }} aria-hidden>
        <polygon points="50,3 93,27 93,73 50,97 7,73 7,27" fill="none" stroke={stroke} strokeWidth={sw} />
      </svg>
      {children}
    </span>
  );
}

function HoneycombCluster({ width = 260, color = palette.hair }: { width?: number; color?: string }) {
  const hex = (cx: number, cy: number, r = 26) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 180) * (60 * i - 90);
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
    return <polygon key={`${cx}-${cy}`} points={pts} fill="none" stroke={color} strokeWidth={1.4} />;
  };
  const dx = 45, dy = 39;
  return (
    <svg width={width} height={width * 0.42} viewBox="0 0 260 110" aria-hidden style={{ display: "block" }}>
      {hex(60, 39)}
      {hex(60 + dx, 39 + dy)}
      {hex(60 + dx * 2, 39)}
      {hex(60 + dx * 3, 39 + dy)}
    </svg>
  );
}

function Nav() {
  return (
    <nav style={{ maxWidth: 1180, margin: "0 auto", padding: "20px clamp(20px, 5vw, 56px) 8px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <img src="/daybreak-assets/daybreak-logo.png" alt="Daybreak Coffee Co." style={{ height: 52, width: "auto", display: "block" }} />
        <div className="db-nav-links">
          <a href="#how" className="db-nav-link">How it works</a>
          <a href="#coffees" className="db-nav-link">Coffees</a>
          <a href="#plans" className="db-nav-link">Plans</a>
          <a href="#faq" className="db-nav-link">FAQ</a>
        </div>
        <button className="db-btn db-btn--ghost" onClick={() => alert("signup")}>Sign up</button>
      </div>
    </nav>
  );
}

// ---- Equirectangular projection into the map viewBox ----
const MAP_W = 720;
const MAP_H = 360;
const project = (lon: number, lat: number) => ({
  x: ((lon + 180) / 360) * MAP_W,
  y: ((90 - lat) / 180) * MAP_H,
});

// Rough continent blobs (cx,cy,rx,ry) in map space — landmass the honeycomb fills.
const LAND = [
  { cx: 160, cy: 95, rx: 82, ry: 70 },   // North America
  { cx: 190, cy: 150, rx: 30, ry: 36 },  // Central America
  { cx: 245, cy: 215, rx: 55, ry: 95 },  // South America
  { cx: 395, cy: 80, rx: 58, ry: 34 },   // Europe
  { cx: 405, cy: 185, rx: 70, ry: 85 },  // Africa
  { cx: 560, cy: 90, rx: 112, ry: 60 },  // Asia
  { cx: 560, cy: 175, rx: 48, ry: 30 },  // SE Asia / Indonesia
  { cx: 635, cy: 235, rx: 46, ry: 35 },  // Australia
];

// Build a flat-top hexagon grid (clipped to the landmass) for the honeycomb continents.
function buildHexGrid() {
  const s = 10.5;
  const dx = 1.5 * s;
  const dy = Math.sqrt(3) * s;
  const hexes: string[] = [];
  let col = 0;
  for (let x = s; x <= MAP_W - 2; x += dx, col++) {
    const yOff = col % 2 ? dy / 2 : 0;
    for (let y = s + yOff; y <= MAP_H - 2; y += dy) {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 180) * (60 * i);
        return `${(x + s * Math.cos(a)).toFixed(1)},${(y + s * Math.sin(a)).toFixed(1)}`;
      }).join(" ");
      hexes.push(pts);
    }
  }
  return hexes;
}
const HEX_GRID = buildHexGrid();

function HexWorldMap({ active }: { active: number }) {
  const pt = project(coffees[active].lon, coffees[active].lat);
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width="100%" style={{ display: "block" }} role="img" aria-label={`Origin map — ${coffees[active].country}`}>
      <defs>
        <clipPath id="land-clip">
          {LAND.map((e, i) => <ellipse key={i} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} />)}
        </clipPath>
      </defs>

      {/* soft landmass base so the honeycomb reads as continents */}
      <g clipPath="url(#land-clip)">
        <rect x={0} y={0} width={MAP_W} height={MAP_H} fill={palette.land} />
        {HEX_GRID.map((pts, i) => (
          <polygon key={i} points={pts} fill={palette.honeyFill} stroke={palette.honeyLt} strokeWidth={1} />
        ))}
      </g>

      {/* inactive origin markers */}
      {coffees.map((c, i) => {
        if (i === active) return null;
        const p = project(c.lon, c.lat);
        return <circle key={c.slug} cx={p.x} cy={p.y} r={4} fill="none" stroke={palette.ink} strokeWidth={1.4} opacity={0.5} />;
      })}

      {/* active origin marker with pulsing ring */}
      <motion.circle
        cx={pt.x} cy={pt.y} r={6} fill="none" stroke={palette.honey} strokeWidth={2}
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: [1, 3], opacity: [0.6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
      />
      <motion.circle
        cx={pt.x} cy={pt.y} r={6} fill={palette.honey} stroke="#fff" strokeWidth={2}
        key={`dot-${active}`}
        initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 18 }}
      />
    </svg>
  );
}

// ---- Rotary (wheel) photo carousel ----
const photoVariants = {
  enter: (dir: number) => ({ rotate: dir > 0 ? 26 : -26, y: 30, opacity: 0 }),
  center: { rotate: 0, y: 0, opacity: 1 },
  exit: (dir: number) => ({ rotate: dir > 0 ? -26 : 26, y: 30, opacity: 0 }),
};

function RotaryPhoto({ active, dir }: { active: number; dir: number }) {
  const c = coffees[active];
  const [errored, setErrored] = useState(false);
  useEffect(() => setErrored(false), [active]);
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", perspective: 1200 }}>
      <AnimatePresence custom={dir} initial={false} mode="popLayout">
        <motion.div
          key={c.slug}
          custom={dir}
          variants={photoVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
          style={{
            position: "absolute", inset: 0, transformOrigin: "50% 180%",
            border: `1px solid ${palette.ink}`, background: palette.wash, overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "8px 8px 0 rgba(26,23,20,0.12)",
          }}
        >
          {!errored ? (
            <img
              src={c.photo}
              alt={`${c.origin} ${c.name}`}
              onError={() => setErrored(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ textAlign: "center", padding: 24 }}>
              <Hexagon size={56} stroke={palette.honey} sw={1.6} />
              <div style={{ marginTop: 14, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: palette.honey }}>{c.origin}</div>
              <div style={{ fontSize: 22, marginTop: 4 }}>{c.name}</div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Hero() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setDir(1);
      setActive((a) => (a + 1) % coffees.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const go = (i: number) => {
    setDir(i > active || (active === coffees.length - 1 && i === 0) ? 1 : -1);
    setActive(i);
  };

  const c = coffees[active];

  return (
    <header className="db-hero">
      {/* LEFT — hexagon world map + rotating photo wheel */}
      <div className="db-hero-visual">
        <div style={{ border: `1px solid ${palette.line}`, background: palette.paper, padding: "18px 18px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <span className="db-eyebrow">This week, sourced from</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={c.country}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
                style={{ fontSize: 15, fontWeight: 700, color: palette.honey }}
              >
                {c.country}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="db-hero-stage">
            <div className="db-hero-map"><HexWorldMap active={active} /></div>
            <div className="db-hero-photo"><RotaryPhoto active={active} dir={dir} /></div>
          </div>

          {/* caption + selector dots */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, gap: 12, flexWrap: "wrap" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
              >
                <div style={{ fontSize: 18, fontWeight: 700 }}>{c.origin} {c.name}</div>
                <div style={{ fontSize: 13, color: palette.muted }}>{c.notes} · {c.roast}</div>
              </motion.div>
            </AnimatePresence>
            <div style={{ display: "flex", gap: 8 }}>
              {coffees.map((co, i) => (
                <button
                  key={co.slug}
                  aria-label={`Show ${co.origin}`}
                  onClick={() => go(i)}
                  style={{
                    width: 11, height: 11, padding: 0, cursor: "pointer", background: i === active ? palette.honey : "transparent",
                    border: `1.4px solid ${i === active ? palette.honey : palette.muted}`, transform: "rotate(45deg)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — headline + copy */}
      <div className="db-hero-copy">
        <div className="db-eyebrow">Fresh single-origin · delivered weekly</div>
        <h1 style={{ fontSize: "clamp(36px, 4.6vw, 60px)", lineHeight: 1.06, margin: "18px 0 0", letterSpacing: -1.4, fontWeight: 700 }}>
          A new coffee at <span style={{ fontStyle: "italic", color: palette.honey }}>first light</span>, every week.
        </h1>
        <p style={{ fontSize: "clamp(16px, 1.6vw, 19px)", color: palette.muted, maxWidth: 460, margin: "22px 0 0", lineHeight: 1.65 }}>
          Single-origin coffee, roasted the day before it ships and delivered straight to your door. From around the world, one week at a time.
        </p>
        <div style={{ marginTop: 30, display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button className="db-btn db-btn--solid" onClick={() => alert("signup")}>Start your subscription</button>
          <a href="#how" className="db-btn db-btn--ghost">See how it works</a>
        </div>
      </div>
    </header>
  );
}

function Section({ id, kicker, title, children, wash }: { id?: string; kicker: string; title: string; children: React.ReactNode; wash?: boolean }) {
  return (
    <section id={id} style={{ background: wash ? palette.wash : "transparent" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(44px, 7vw, 88px) clamp(20px, 5vw, 56px)" }}>
        <div className="db-eyebrow">{kicker}</div>
        <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", margin: "10px 0 36px", letterSpacing: -0.8, fontWeight: 700 }}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <Section id="how" kicker="How it works" title="From farm to your kitchen in four steps">
      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {steps.map((s) => (
          <div key={s.n} className="db-box">
            <Hexagon size={40} sw={1.4}>
              <span style={{ fontSize: 13, fontWeight: 700, color: palette.honey }}>{s.n}</span>
            </Hexagon>
            <h3 style={{ margin: "16px 0 8px", fontSize: 20 }}>{s.title}</h3>
            <p style={{ margin: 0, color: palette.muted, lineHeight: 1.6, fontSize: 15 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ThisWeek() {
  return (
    <Section id="coffees" kicker="This week's coffees" title="On the roaster right now" wash>
      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
        {coffees.map((c) => (
          <motion.div key={c.name} className="db-box db-box--paper" whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
            <div style={{ marginBottom: 16 }}><Hexagon size={34} stroke={palette.honey} sw={1.6} /></div>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: palette.honey }}>{c.origin}</div>
            <h3 style={{ margin: "6px 0 10px", fontSize: 23 }}>{c.name}</h3>
            <p style={{ margin: 0, color: palette.muted, fontSize: 15 }}>{c.notes}</p>
            <span className="db-chip">{c.roast}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Plans() {
  return (
    <Section id="plans" kicker="Plans" title="Pick a pace that fits your week">
      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {plans.map((p) => (
          <div key={p.name} className="db-box" style={p.popular ? { borderWidth: 2 } : undefined}>
            {p.popular && <span className="db-chip db-chip--accent">Most popular</span>}
            <h3 style={{ margin: p.popular ? "14px 0 6px" : "0 0 6px", fontSize: 24 }}>{p.name}</h3>
            <p style={{ margin: "0 0 18px", color: palette.muted, fontSize: 15 }}>{p.detail}</p>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>
              ${p.price}<span style={{ fontSize: 15, fontWeight: 400, color: palette.muted }}>/week</span>
            </div>
            <button className={`db-btn ${p.popular ? "db-btn--solid" : "db-btn--ghost"}`} style={{ width: "100%", marginTop: 22 }} onClick={() => alert("signup")}>
              Choose {p.name}
            </button>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", color: palette.muted, fontSize: 14, marginTop: 26 }}>
        Shipping included · Cancel anytime · First bag ships within 3 days of signup.
      </p>
    </Section>
  );
}

function Testimonials() {
  return (
    <Section kicker="Loved by early risers" title="What subscribers say" wash>
      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {testimonials.map((t) => (
          <figure key={t.who} className="db-box db-box--paper" style={{ margin: 0 }}>
            <div aria-hidden style={{ fontSize: 40, lineHeight: 0.5, color: palette.hair, fontFamily: "Georgia" }}>“</div>
            <blockquote style={{ margin: "10px 0 16px", fontSize: 19, lineHeight: 1.55, fontStyle: "italic" }}>{t.quote}</blockquote>
            <figcaption style={{ color: palette.muted, fontSize: 14, fontWeight: 600 }}>— {t.who}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

function Story() {
  return (
    <section>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(48px, 8vw, 96px) clamp(20px, 5vw, 56px)", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <HoneycombCluster width={180} color={palette.hair} />
        </div>
        <div className="db-eyebrow">Our story</div>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", margin: "12px 0 20px", letterSpacing: -0.6, fontWeight: 700 }}>
          Two friends, one line at a café, a lot of good coffee.
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.75, color: palette.muted, margin: 0 }}>
          Daybreak started in 2019. We believe coffee should be fresh, traceable, and a little bit fun. We work directly
          with farmers, roast in small batches, and ship in compostable bags. There's also a roastery dog named Marlowe —
          he supervises on Tuesdays.
        </p>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" kicker="FAQ" title="Questions, answered" wash>
      <div style={{ maxWidth: 760, border: `1px solid ${palette.line}`, background: palette.paper }}>
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="db-accordion-item" style={{ borderBottom: i === faqs.length - 1 ? "none" : `1px solid ${palette.hair}` }}>
              <button className="db-accordion-trigger" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                <span>{item.q}</span>
                <motion.span aria-hidden animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} style={{ fontSize: 26, lineHeight: 1, color: palette.honey }}>+</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: "hidden" }}>
                    <p style={{ margin: 0, padding: "0 24px 22px", color: palette.muted, fontSize: 16, lineHeight: 1.6 }}>{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${palette.line}` }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(40px, 6vw, 64px) clamp(20px, 5vw, 56px) 28px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <HoneycombCluster width={140} color={palette.hair} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 20 }}>Daybreak Coffee Co.</div>
          <div style={{ display: "flex", gap: 20, color: palette.muted, fontSize: 14, flexWrap: "wrap" }}>
            <a className="db-link" href="mailto:hello@daybreak.example">hello@daybreak.example</a>
            <a className="db-link" href="#">Instagram @daybreakcoffee</a>
            <span>Oakland, CA</span>
          </div>
        </div>

        {/* Legal disclaimer — kept at the very bottom */}
        <p style={{ marginTop: 30, paddingTop: 20, borderTop: `1px solid ${palette.hair}`, fontSize: 12, color: palette.muted, lineHeight: 1.6, maxWidth: 720 }}>
          © Daybreak Coffee Co. LLC. All rights reserved. Prices in USD. By using this site you agree to our Terms of
          Service and Privacy Policy. Daybreak Coffee Co. is not responsible for typos. Established 2019. Coffee is hot.
        </p>
      </div>
    </footer>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; }
      .db-eyebrow {
        display: inline-block; font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase;
        font-weight: 700; color: ${palette.ink};
      }
      .db-nav-links { display: flex; gap: 26px; }
      .db-nav-link {
        font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;
        color: ${palette.ink}; text-decoration: none; padding-bottom: 3px; border-bottom: 1.5px solid transparent;
        transition: border-color .2s ease, color .2s ease;
      }
      .db-nav-link:hover { border-color: ${palette.honey}; color: ${palette.honey}; }
      @media (max-width: 760px) { .db-nav-links { display: none; } }

      .db-hero {
        max-width: 1180px; margin: 0 auto; padding: clamp(28px, 5vw, 64px) clamp(20px, 5vw, 56px) clamp(40px, 6vw, 72px);
        display: grid; grid-template-columns: 1.45fr 1fr; gap: clamp(28px, 4vw, 56px); align-items: center;
      }
      .db-hero-copy { align-self: center; }
      .db-hero-stage { position: relative; }
      .db-hero-map { width: 100%; }
      .db-hero-photo {
        position: absolute; right: 4%; bottom: -6%; width: 38%; min-width: 130px; max-width: 220px;
      }
      @media (max-width: 880px) {
        .db-hero { grid-template-columns: 1fr; }
        .db-hero-copy { order: -1; }
        .db-hero-photo { width: 34%; bottom: -4%; }
      }

      .db-grid { display: grid; gap: 18px; }
      .db-box {
        background: ${palette.paper}; border: 1px solid ${palette.line}; padding: 26px;
        transition: transform .25s ease, box-shadow .25s ease;
      }
      .db-box--paper:hover { box-shadow: 6px 6px 0 ${palette.ink}; }
      .db-chip {
        display: inline-block; margin-top: 16px; font-size: 11px; font-weight: 600; letter-spacing: .5px;
        padding: 5px 12px; border: 1px solid ${palette.hair}; color: ${palette.muted}; text-transform: uppercase;
      }
      .db-chip--accent { background: ${palette.honey}; border-color: ${palette.honey}; color: #fff; }
      .db-btn {
        font: inherit; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
        padding: 13px 26px; cursor: pointer; border: 1.5px solid ${palette.ink}; text-decoration: none;
        display: inline-block; transition: background .2s ease, color .2s ease;
      }
      .db-btn--solid { background: ${palette.ink}; color: ${palette.paper}; }
      .db-btn--solid:hover { background: ${palette.honey}; border-color: ${palette.honey}; }
      .db-btn--ghost { background: transparent; color: ${palette.ink}; }
      .db-btn--ghost:hover { background: ${palette.ink}; color: ${palette.paper}; }
      .db-accordion-trigger {
        width: 100%; background: none; border: none; cursor: pointer; font: inherit;
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
        padding: 22px 24px; text-align: left; font-size: 18px; font-weight: 600; color: ${palette.ink};
      }
      .db-accordion-trigger:hover { color: ${palette.honey}; }
      .db-link { color: ${palette.muted}; text-decoration: none; }
      .db-link:hover { color: ${palette.honey}; }
    `}</style>
  );
}
