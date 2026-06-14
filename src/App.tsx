import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { HEXES, MAP_W, MAP_H, HEX_S, projectLonLat } from "./worldHexes";

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

// lon/lat used to place each origin on the equirectangular hex map.
// Ordered west -> east so the camera sweeps the globe in one direction.
const coffees = [
  { origin: "Guatemala", country: "Guatemala", name: "Antigua", notes: "Chocolate · orange · spice", roast: "Medium roast", slug: "guatemala", photo: "/daybreak-assets/coffee-guatemala-antigua.png", lon: -90.7, lat: 14.5 },
  { origin: "Colombia", country: "Colombia", name: "Huila", notes: "Caramel · red apple · balanced", roast: "Medium roast", slug: "colombia", photo: "/daybreak-assets/coffee-colombia-huila.png", lon: -75.5, lat: 2.5 },
  { origin: "Ethiopia", country: "Ethiopia", name: "Yirgacheffe", notes: "Floral · citrus · tea-like", roast: "Light roast", slug: "ethiopia", photo: "/daybreak-assets/coffee-ethiopia-yirgacheffe.png", lon: 40, lat: 6.8 },
  { origin: "Sumatra", country: "Indonesia", name: "Mandheling", notes: "Cocoa · cedar · full body", roast: "Dark roast", slug: "sumatra", photo: "/daybreak-assets/coffee-sumatra-mandheling.png", lon: 99, lat: 2.6 },
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
  { quote: "Best coffee I've ever had.", who: "Sarah M.", photo: "/daybreak-assets/review-sarah.jpg" },
  { quote: "I look forward to it every Monday.", who: "James T.", photo: "/daybreak-assets/review-james.jpg" },
  { quote: "The Ethiopia one changed my life, honestly.", who: "Priya K.", photo: "/daybreak-assets/review-priya.jpg" },
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
    <div style={{ background: palette.paper, color: palette.ink, minHeight: "100vh", fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", fontWeight: 400 }}>
      <GlobalStyle />
      <Nav />
      <Hero />
      <HowItWorks />
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

// ---- Background line-art accents (subtle, non-interactive) ----
function RectStack({ size = 92, color = palette.ink, sw = 1.3 }: { size?: number; color?: string; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden style={{ display: "block" }}>
      <rect x="3" y="3" width="60" height="60" fill="none" stroke={color} strokeWidth={sw} />
      <rect x="20" y="20" width="60" height="60" fill="none" stroke={color} strokeWidth={sw} />
      <rect x="37" y="37" width="60" height="60" fill="none" stroke={color} strokeWidth={sw} />
    </svg>
  );
}

function Decor({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <div className="db-decor" aria-hidden style={{ position: "absolute", ...style }}>
      {children}
    </div>
  );
}

function Nav() {
  return (
    <nav className="db-nav">
      <img className="db-logo" src="/daybreak-assets/daybreak-logo.png" alt="Daybreak Coffee Co." />
      <div className="db-nav-row">
        <div className="db-nav-links">
          <a href="#how" className="db-nav-link">How it works</a>
          <a href="#plans" className="db-nav-link">Plans</a>
          <a href="#faq" className="db-nav-link">FAQ</a>
        </div>
        <button className="db-btn db-btn--ghost" onClick={() => alert("signup")}>Sign up</button>
      </div>
    </nav>
  );
}

// ---- Honeycomb world map (land baked from Natural Earth — see scripts/genmap.mjs) ----
const hexPoints = (x: number, y: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i);
    return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

// Camera geometry for the zoomed-out world map (it pans gently to the active origin).
const MAP_ASPECT = MAP_H / MAP_W;        // map is ~2.6 : 1
const STAGE_ASPECT = 0.58;               // visible window height / width
const Z = 1.6;                           // zoom factor — low so most of the world stays in view
const V_CENTER = STAGE_ASPECT / (2 * MAP_ASPECT);   // vertical centering constant
const HALF_W = 0.5 / Z;                              // half visible width (map fraction)
const HALF_H = STAGE_ASPECT / (2 * Z * MAP_ASPECT);  // half visible height (map fraction)
const CAM_SPRING = { stiffness: 42, damping: 18, mass: 1.1 };
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// fractional (0..1) position of each origin within the map
const originFrac = coffees.map((c) => {
  const p = projectLonLat(c.lon, c.lat);
  return { fx: p.x / MAP_W, fy: p.y / MAP_H };
});

function HexWorldMap({ active }: { active: number }) {
  const c = coffees[active];
  const pt = projectLonLat(c.lon, c.lat);
  const R = 50; // honey tint radius around the active origin
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }} aria-hidden>
      {HEXES.map(([x, y], i) => {
        const near = Math.hypot(x - pt.x, y - pt.y) < R;
        return (
          <polygon
            key={i}
            points={hexPoints(x, y, HEX_S * 0.9)}
            fill={near ? palette.honey : palette.honeyFill}
            stroke={near ? palette.honey : palette.honeyLt}
            strokeWidth={1}
          />
        );
      })}
      {/* inactive origin markers */}
      {coffees.map((co, i) => {
        if (i === active) return null;
        const p = projectLonLat(co.lon, co.lat);
        return <circle key={co.slug} cx={p.x} cy={p.y} r={2.4} fill="#fff" stroke={palette.ink} strokeWidth={1} opacity={0.5} />;
      })}
      {/* active origin: pulsing honey marker */}
      <motion.circle
        cx={pt.x} cy={pt.y} r={5} fill="none" stroke={palette.honey} strokeWidth={1.6}
        initial={{ scale: 1, opacity: 0.6 }} animate={{ scale: [1, 3], opacity: [0.6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
      />
      <circle cx={pt.x} cy={pt.y} r={3.8} fill={palette.honey} stroke="#fff" strokeWidth={1.4} />
    </svg>
  );
}

// ---- Zoomed-out world map that pans to the active origin (moves on its own) ----
function MapStage({ active }: { active: number }) {
  const camX = useSpring(clamp(originFrac[active].fx, HALF_W, 1 - HALF_W), CAM_SPRING);
  const camY = useSpring(clamp(originFrac[active].fy, HALF_H, 1 - HALF_H), CAM_SPRING);

  useEffect(() => {
    camX.set(clamp(originFrac[active].fx, HALF_W, 1 - HALF_W));
    camY.set(clamp(originFrac[active].fy, HALF_H, 1 - HALF_H));
  }, [active, camX, camY]);

  const tx = useTransform(camX, (v) => (0.5 - v * Z) * 100);
  const ty = useTransform(camY, (v) => (V_CENTER - v * Z) * 100);
  const camTransform = useMotionTemplate`translate(${tx}%, ${ty}%) scale(${Z})`;

  return (
    <div className="db-stage" style={{ aspectRatio: String(1 / STAGE_ASPECT) }}>
      <motion.div className="db-cam" style={{ aspectRatio: `${MAP_W} / ${MAP_H}`, transform: camTransform, transformOrigin: "0 0" }}>
        <HexWorldMap active={active} />
      </motion.div>
    </div>
  );
}

// ---- Turntable: coffee bags rotating around a circle, independent of the map ----
const TT_STEP = (2 * Math.PI) / coffees.length;
const TT_RX = 150;                          // horizontal radius of the turntable (px)
const TT_SPRING = { stiffness: 40, damping: 14, mass: 1 };
const depth01 = (a: number) => (Math.cos(a) + 1) / 2; // 1 = front, 0 = back

function TurntableItem({ turn, index, coffee }: { turn: MotionValue<number>; index: number; coffee: (typeof coffees)[number] }) {
  const theta = useTransform(turn, (t) => index * TT_STEP - t);
  const x = useTransform(theta, (a) => Math.sin(a) * TT_RX);
  const scale = useTransform(theta, (a) => 0.4 + 0.6 * depth01(a));
  const opacity = useTransform(theta, (a) => 0.12 + 0.88 * depth01(a));
  const zIndex = useTransform(theta, (a) => Math.round(depth01(a) * 100));
  const [errored, setErrored] = useState(false);

  return (
    <div className="db-tt-slot">
      <motion.div className="db-tt-card" style={{ x, scale, opacity, zIndex }}>
        {!errored ? (
          <img src={coffee.photo} alt={`${coffee.origin} ${coffee.name}`} onError={() => setErrored(true)} />
        ) : (
          <div className="db-tt-fallback"><Hexagon size={40} stroke={palette.honey} sw={1.6} /><span>{coffee.origin}</span></div>
        )}
      </motion.div>
    </div>
  );
}

function Turntable({ step }: { step: number }) {
  const turn = useSpring(step * TT_STEP, TT_SPRING);
  useEffect(() => { turn.set(step * TT_STEP); }, [step, turn]);
  return (
    <div className="db-turntable" aria-label="This week's coffees">
      {coffees.map((co, i) => (
        <TurntableItem key={co.slug} turn={turn} index={i} coffee={co} />
      ))}
    </div>
  );
}

function Hero() {
  const n = coffees.length;
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const active = ((step % n) + n) % n;
  const c = coffees[active];
  const goTo = (i: number) => setStep((s) => s + ((i - (((s % n) + n) % n) + n) % n));

  return (
    <div className="db-hero-wrap">
      {/* line-art accents filling the side whitespace of the first section */}
      <Decor style={{ left: "clamp(12px, 4vw, 64px)", top: 70 }}><HoneycombCluster width={132} color={palette.ink} /></Decor>
      <Decor style={{ left: "clamp(20px, 5vw, 88px)", top: 300 }}><RectStack size={84} /></Decor>
      <Decor style={{ left: "clamp(12px, 3vw, 56px)", top: 470 }}><HoneycombCluster width={104} color={palette.ink} /></Decor>
      <Decor style={{ right: "clamp(12px, 4vw, 64px)", top: 120 }}><HoneycombCluster width={116} color={palette.ink} /></Decor>
      <Decor style={{ right: "clamp(20px, 5vw, 92px)", top: 330 }}><RectStack size={92} /></Decor>
      <Decor style={{ right: "clamp(12px, 3vw, 52px)", top: 500 }}><HoneycombCluster width={130} color={palette.ink} /></Decor>

      <header className="db-hero">
      <p className="db-hero-blurb">
        A new single-origin coffee, freshly roasted, delivered to your door every week.
      </p>

      <div className="db-hero-grid">
        <MapStage active={active} />
        <Turntable step={step} />
      </div>

      <div className="db-hero-cap">
        <AnimatePresence mode="wait">
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
          >
            <div style={{ fontSize: 19, fontWeight: 700 }}>{c.origin} {c.name}</div>
            <div style={{ fontSize: 13, color: palette.muted }}>{c.notes} · {c.roast}</div>
          </motion.div>
        </AnimatePresence>
        <div style={{ display: "flex", gap: 8 }}>
          {coffees.map((co, i) => (
            <button
              key={co.slug}
              aria-label={`Show ${co.origin}`}
              onClick={() => goTo(i)}
              style={{
                width: 11, height: 11, padding: 0, cursor: "pointer", background: i === active ? palette.honey : "transparent",
                border: `1.4px solid ${i === active ? palette.honey : palette.muted}`, transform: "rotate(45deg)",
              }}
            />
          ))}
        </div>
      </div>

      <p className="db-hero-tagline">
        Single-origin coffee, roasted the day before it ships and delivered straight to your door. From around the world, one week at a time.
      </p>
    </header>
  );
}

function Section({ id, kicker, title, children, wash }: { id?: string; kicker: string; title: string; children: React.ReactNode; wash?: boolean }) {
  return (
    <section id={id} style={{ background: wash ? palette.wash : "transparent" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(44px, 7vw, 88px) clamp(20px, 5vw, 56px)" }}>
        <div className="db-eyebrow">{kicker}</div>
        <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", margin: "10px 0 36px", letterSpacing: -0.8, fontWeight: 500 }}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <Section id="how" kicker="How it works" title="From farm to your kitchen in four steps" wash>
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
            <figcaption style={{ display: "flex", alignItems: "center", gap: 10, color: palette.muted, fontSize: 14, fontWeight: 600 }}>
              <img
                src={t.photo}
                alt={t.who}
                width={40}
                height={40}
                loading="lazy"
                style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: `2px solid ${palette.hair}`, flex: "0 0 auto" }}
              />
              — {t.who}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

function Story() {
  return (
    <section>
      <div className="db-story">
        <div className="db-story-text">
          <div className="db-eyebrow">Our story</div>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", margin: "12px 0 20px", letterSpacing: -0.6, fontWeight: 500 }}>
            Two friends, one line at a café, a lot of good coffee.
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.75, color: palette.muted, margin: 0 }}>
            Daybreak started in 2019. We believe coffee should be fresh, traceable, and a little bit fun. We work directly
            with farmers, roast in small batches, and ship in compostable bags. There's also a roastery dog named Marlowe —
            he supervises on Tuesdays.
          </p>
        </div>
        <div className="db-story-photo">
          <img src="/daybreak-assets/founders.jpg" alt="Daybreak's two founders and their roastery dog" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" style={{ background: palette.wash }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(44px, 7vw, 88px) clamp(20px, 5vw, 56px)" }}>
        <h2 style={{ fontSize: "clamp(36px, 6vw, 56px)", margin: "0 0 32px", letterSpacing: -1.2, fontWeight: 500, textAlign: "center" }}>FAQ</h2>
        <div style={{ border: `1px solid ${palette.line}`, background: palette.paper }}>
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
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${palette.line}` }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(40px, 6vw, 64px) clamp(20px, 5vw, 56px) 28px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 28, justifyContent: "space-between", alignItems: "center" }}>
          <img src="/daybreak-assets/daybreak-logo.png" alt="Daybreak Coffee Co." style={{ height: 76, width: "auto", display: "block" }} />
          <div style={{ display: "flex", gap: 20, color: palette.muted, fontSize: 14, flexWrap: "wrap", alignItems: "center" }}>
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
      .db-nav { max-width: 1180px; margin: 0 auto; padding: 18px clamp(20px, 5vw, 56px); font-family: 'Georgia', 'Times New Roman', serif; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
      .db-nav .db-btn { font-family: 'Georgia', 'Times New Roman', serif; }
      .db-logo { display: block; height: clamp(48px, 6vw, 76px); width: auto; }
      .db-nav-row { display: flex; align-items: center; gap: clamp(18px, 3vw, 30px); }
      .db-nav-links { display: flex; gap: 26px; }
      .db-nav-link {
        font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;
        color: ${palette.ink}; text-decoration: none; padding-bottom: 3px; border-bottom: 1.5px solid transparent;
        transition: border-color .2s ease, color .2s ease;
      }
      .db-nav-link:hover { border-color: ${palette.honey}; color: ${palette.honey}; }
      @media (max-width: 620px) { .db-nav-links { display: none; } }

      .db-hero {
        max-width: 1080px; margin: 0 auto; padding: clamp(16px, 3vw, 40px) clamp(20px, 5vw, 56px) clamp(40px, 6vw, 72px);
        display: flex; flex-direction: column; gap: 16px;
      }
      .db-hero-blurb {
        margin: 0 auto; max-width: 720px; text-align: center;
        font-size: clamp(20px, 2.6vw, 30px); line-height: 1.35; font-weight: 600; letter-spacing: -0.4px; color: ${palette.ink};
      }
      .db-hero-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: clamp(20px, 3vw, 44px); align-items: center; }
      @media (max-width: 820px) { .db-hero-grid { grid-template-columns: 1fr; gap: clamp(16px, 5vw, 30px); } }
      .db-hero-cap { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
      .db-hero-tagline {
        margin: 6px auto 0; max-width: 600px; text-align: center;
        font-size: clamp(16px, 1.8vw, 20px); line-height: 1.65; color: ${palette.muted};
      }

      /* our story — text left, founder photo right */
      .db-story {
        max-width: 1080px; margin: 0 auto; padding: clamp(48px, 8vw, 96px) clamp(20px, 5vw, 56px);
        display: flex; align-items: center; gap: clamp(28px, 5vw, 64px);
      }
      .db-story-text { flex: 1 1 50%; }
      .db-story-photo { flex: 1 1 50%; }
      .db-story-photo img {
        width: 100%; height: 100%; max-height: 420px; object-fit: cover; display: block;
      }
      @media (max-width: 720px) {
        .db-story { flex-direction: column; text-align: center; }
        .db-story-photo { width: 100%; }
      }

      /* zoomed-out world map stage (pans on its own); edges feather into the page */
      .db-stage {
        position: relative; width: 100%; overflow: hidden; background: ${palette.paper};
        -webkit-mask-image: radial-gradient(125% 135% at 50% 50%, #000 58%, transparent 100%);
        mask-image: radial-gradient(125% 135% at 50% 50%, #000 58%, transparent 100%);
      }
      .db-cam { position: absolute; top: 0; left: 0; width: 100%; will-change: transform; }

      /* turntable of coffee bags (rotates on its own, separate from the map) */
      .db-turntable { position: relative; width: 100%; height: clamp(240px, 34vw, 360px); }
      .db-tt-slot { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
      .db-tt-card { position: relative; will-change: transform, opacity; }
      .db-tt-card img {
        display: block; height: clamp(210px, 30vw, 320px); width: auto;
        filter: drop-shadow(0 10px 12px rgba(26,23,20,0.12));
      }
      .db-tt-fallback { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; height: clamp(210px, 30vw, 320px); }
      .db-tt-fallback span { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: ${palette.honey}; }

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
