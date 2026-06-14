import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ---- Palette: warm brown / cream, daybreak-y ----
const palette = {
  cream: "#F6EFE3",
  creamDeep: "#EFE4D2",
  ink: "#2C211A",
  brown: "#6B4527",
  brownDeep: "#4A2E1A",
  accent: "#C8743B",
  muted: "#8A7A6A",
  line: "#E2D4BE",
};

const coffees = [
  { origin: "Ethiopia", name: "Yirgacheffe", notes: "Floral · citrus · tea-like", roast: "Light roast", emoji: "🌸" },
  { origin: "Colombia", name: "Huila", notes: "Caramel · red apple · balanced", roast: "Medium roast", emoji: "🍎" },
  { origin: "Sumatra", name: "Mandheling", notes: "Cocoa · cedar · full body", roast: "Dark roast", emoji: "🌰" },
  { origin: "Guatemala", name: "Antigua", notes: "Chocolate · orange · spice", roast: "Medium roast", emoji: "🍫" },
];

const plans = [
  { name: "Solo", detail: "One 12oz bag per week", price: 18, popular: false },
  { name: "Duo", detail: "Two 12oz bags per week", price: 32, popular: true },
  { name: "Office", detail: "Five 12oz bags per week", price: 75, popular: false },
];

const steps = [
  { n: "01", title: "Tell us how you brew", body: "Espresso, pour over, drip, or French press — we tune the grind to match." },
  { n: "02", title: "We roast fresh, weekly", body: "Each week we pick a single-origin coffee and roast it the day before it ships." },
  { n: "03", title: "It lands at your door", body: "Arrives within 2 days of roasting. You brew it. You're happy." },
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
    <div style={{ background: palette.cream, color: palette.ink, minHeight: "100vh", fontFamily: "'Georgia', 'Times New Roman', serif" }}>
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

function Nav() {
  return (
    <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px clamp(20px, 5vw, 64px)", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 20, letterSpacing: -0.3 }}>
        <span aria-hidden style={{ fontSize: 24 }}>☕</span> Daybreak
      </div>
      <button className="db-btn db-btn--ghost" onClick={() => alert("signup")}>Sign up</button>
    </nav>
  );
}

function Hero() {
  return (
    <header style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(40px, 8vw, 96px) clamp(20px, 5vw, 64px)", textAlign: "center" }}>
      <div className="db-eyebrow">Fresh single-origin · delivered weekly</div>
      <h1 style={{ fontSize: "clamp(40px, 7vw, 76px)", lineHeight: 1.04, margin: "18px 0 0", letterSpacing: -1.5, fontWeight: 700 }}>
        A new coffee at<br />
        <span style={{ color: palette.accent, fontStyle: "italic" }}>first light</span>, every week.
      </h1>
      <p style={{ fontSize: "clamp(17px, 2.2vw, 21px)", color: palette.muted, maxWidth: 560, margin: "24px auto 0", lineHeight: 1.6 }}>
        Single-origin coffee, roasted the day before it ships and delivered straight to your door. From around the world, one week at a time.
      </p>
      <div style={{ marginTop: 36, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="db-btn db-btn--solid" onClick={() => alert("signup")}>Start your subscription</button>
        <a href="#how" className="db-btn db-btn--ghost">See how it works</a>
      </div>
    </header>
  );
}

function Section({ id, kicker, title, children }: { id?: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(40px, 7vw, 88px) clamp(20px, 5vw, 64px)" }}>
      <div className="db-eyebrow">{kicker}</div>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: "10px 0 36px", letterSpacing: -0.8, fontWeight: 700 }}>{title}</h2>
      {children}
    </section>
  );
}

function HowItWorks() {
  return (
    <Section id="how" kicker="How it works" title="From farm to your kitchen in four steps">
      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {steps.map((s) => (
          <div key={s.n} className="db-card">
            <div style={{ fontSize: 13, fontWeight: 700, color: palette.accent, letterSpacing: 1 }}>{s.n}</div>
            <h3 style={{ margin: "10px 0 8px", fontSize: 20 }}>{s.title}</h3>
            <p style={{ margin: 0, color: palette.muted, lineHeight: 1.55, fontSize: 15 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ThisWeek() {
  return (
    <Section kicker="This week's coffees" title="On the roaster right now">
      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {coffees.map((c) => (
          <motion.div
            key={c.name}
            className="db-card db-card--coffee"
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <div style={{ fontSize: 40 }} aria-hidden>{c.emoji}</div>
            <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: palette.accent, marginTop: 14 }}>{c.origin}</div>
            <h3 style={{ margin: "4px 0 10px", fontSize: 24 }}>{c.name}</h3>
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
    <Section kicker="Plans" title="Pick a pace that fits your week">
      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {plans.map((p) => (
          <div key={p.name} className="db-card" style={p.popular ? { borderColor: palette.accent, boxShadow: "0 16px 40px rgba(200,116,59,0.18)" } : undefined}>
            {p.popular && <span className="db-chip db-chip--accent">Most popular</span>}
            <h3 style={{ margin: p.popular ? "12px 0 6px" : "0 0 6px", fontSize: 24 }}>{p.name}</h3>
            <p style={{ margin: "0 0 16px", color: palette.muted, fontSize: 15 }}>{p.detail}</p>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>
              ${p.price}<span style={{ fontSize: 15, fontWeight: 400, color: palette.muted }}>/week</span>
            </div>
            <button className={`db-btn ${p.popular ? "db-btn--solid" : "db-btn--ghost"}`} style={{ width: "100%", marginTop: 20 }} onClick={() => alert("signup")}>
              Choose {p.name}
            </button>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", color: palette.muted, fontSize: 14, marginTop: 24 }}>
        Shipping included · Cancel anytime · First bag ships within 3 days of signup.
      </p>
    </Section>
  );
}

function Testimonials() {
  return (
    <Section kicker="Loved by early risers" title="What subscribers say">
      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {testimonials.map((t) => (
          <figure key={t.who} className="db-card" style={{ margin: 0 }}>
            <div aria-hidden style={{ fontSize: 36, lineHeight: 0.4, color: palette.line, fontFamily: "Georgia" }}>“</div>
            <blockquote style={{ margin: "8px 0 16px", fontSize: 19, lineHeight: 1.5, fontStyle: "italic" }}>{t.quote}</blockquote>
            <figcaption style={{ color: palette.muted, fontSize: 14, fontWeight: 600 }}>— {t.who}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

function Story() {
  return (
    <section style={{ background: palette.brownDeep, color: palette.cream, marginTop: 20 }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(56px, 9vw, 110px) clamp(20px, 5vw, 64px)", textAlign: "center" }}>
        <div className="db-eyebrow" style={{ color: palette.accent }}>Our story</div>
        <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", margin: "12px 0 20px", letterSpacing: -0.6, fontWeight: 700 }}>
          Two friends, one line at a café, a lot of good coffee.
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(246,239,227,0.82)", margin: 0 }}>
          Daybreak started in 2019. We believe coffee should be fresh, traceable, and a little bit fun. We work directly
          with farmers, roast in small batches, and ship in compostable bags. (There's also a roastery dog named Marlowe
          — he supervises on Tuesdays.)
        </p>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section kicker="FAQ" title="Questions, answered">
      <div style={{ maxWidth: 760 }}>
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="db-accordion-item">
              <button
                className="db-accordion-trigger"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <motion.span aria-hidden animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} style={{ fontSize: 26, lineHeight: 1, color: palette.accent }}>
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <p style={{ margin: 0, padding: "0 0 20px", color: palette.muted, fontSize: 16, lineHeight: 1.6 }}>{item.a}</p>
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
    <footer style={{ borderTop: `1px solid ${palette.line}`, background: palette.creamDeep }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(40px, 6vw, 64px) clamp(20px, 5vw, 64px) 28px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 20 }}>
            <span aria-hidden style={{ fontSize: 22 }}>☕</span> Daybreak Coffee Co.
          </div>
          <div style={{ display: "flex", gap: 20, color: palette.muted, fontSize: 14, flexWrap: "wrap" }}>
            <a className="db-link" href="mailto:hello@daybreak.example">hello@daybreak.example</a>
            <a className="db-link" href="#">Instagram @daybreakcoffee</a>
            <span>Oakland, CA</span>
          </div>
        </div>

        {/* Legal disclaimer — moved to the very bottom */}
        <p style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${palette.line}`, fontSize: 12, color: palette.muted, lineHeight: 1.6, maxWidth: 720 }}>
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
        display: inline-block; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
        font-weight: 700; color: ${palette.brown};
      }
      .db-grid { display: grid; gap: 20px; }
      .db-card {
        background: #fff; border: 1px solid ${palette.line}; border-radius: 18px; padding: 26px;
        transition: box-shadow .25s ease, transform .25s ease;
      }
      .db-card:hover { box-shadow: 0 14px 36px rgba(44,33,26,0.08); }
      .db-card--coffee { text-align: left; }
      .db-chip {
        display: inline-block; margin-top: 14px; font-size: 12px; font-weight: 600;
        padding: 5px 12px; border-radius: 999px; background: ${palette.creamDeep}; color: ${palette.brown};
      }
      .db-chip--accent { background: ${palette.accent}; color: #fff; }
      .db-btn {
        font: inherit; font-size: 15px; font-weight: 600; padding: 12px 24px; border-radius: 999px;
        cursor: pointer; border: 1.5px solid transparent; text-decoration: none; display: inline-block;
        transition: transform .15s ease, background .2s ease, color .2s ease, border-color .2s ease;
      }
      .db-btn:hover { transform: translateY(-2px); }
      .db-btn--solid { background: ${palette.accent}; color: #fff; }
      .db-btn--solid:hover { background: ${palette.brown}; }
      .db-btn--ghost { background: transparent; color: ${palette.brown}; border-color: ${palette.brown}; }
      .db-btn--ghost:hover { background: ${palette.brown}; color: ${palette.cream}; }
      .db-accordion-item { border-bottom: 1px solid ${palette.line}; }
      .db-accordion-trigger {
        width: 100%; background: none; border: none; cursor: pointer; font: inherit;
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
        padding: 22px 0; text-align: left; font-size: 19px; font-weight: 600; color: ${palette.ink};
      }
      .db-accordion-trigger:hover { color: ${palette.accent}; }
      .db-link { color: ${palette.muted}; text-decoration: none; }
      .db-link:hover { color: ${palette.accent}; }
    `}</style>
  );
}
