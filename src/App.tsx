// The existing site. It works, but it is bad: everything is hardcoded inline,
// the section order is wrong, there is no hierarchy or identity, there is filler
// worth cutting, and it is not responsive. The real content you need is all in
// here. Your job is to redesign it. Replace this however you like.

export default function App() {
  return (
    <div style={{ fontFamily: "Times New Roman, serif", color: "#222", maxWidth: 980, margin: "0 auto", padding: 10 }}>
      <div style={{ fontSize: 13, color: "#999", borderBottom: "1px solid #ccc", paddingBottom: 6 }}>
        Daybreak Coffee Co. LLC. All rights reserved. Prices in USD. By using this site you agree to our Terms of
        Service and Privacy Policy. Daybreak Coffee Co. is not responsible for typos. Established 2019. Coffee is hot.
      </div>

      <h3 style={{ marginTop: 8 }}>FAQ</h3>
      <p style={{ fontSize: 14 }}><b>Can I pause?</b> Yes you can pause anytime from your account page.</p>
      <p style={{ fontSize: 14 }}><b>Do you ship internationally?</b> Currently US and Canada only.</p>
      <p style={{ fontSize: 14 }}><b>Is it organic?</b> Most of our roasts are organic, some are not, check the bag.</p>
      <p style={{ fontSize: 14 }}><b>What if I don't like it?</b> Email us, we'll make it right, probably.</p>
      <p style={{ fontSize: 14 }}><b>Where are you located?</b> Oakland, California.</p>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <span style={{ fontSize: 28, fontWeight: "bold" }}>Daybreak Coffee Co.</span>
        <div style={{ fontSize: 16 }}>A new single-origin coffee, freshly roasted, delivered to your door every week.</div>
        <div style={{ fontSize: 16 }}>Fresh coffee every week. Delivered. From around the world.</div>
        <div onClick={() => alert("signup")} style={{ background: "brown", color: "white", display: "inline-block", padding: "6px 10px", marginTop: 8, cursor: "pointer" }}>
          Sign up
        </div>
      </div>

      <h3>Testimonials</h3>
      <p style={{ fontSize: 14, fontStyle: "italic" }}>"Best coffee I've ever had." - Sarah M.</p>
      <p style={{ fontSize: 14, fontStyle: "italic" }}>"I look forward to it every Monday." - James T.</p>
      <p style={{ fontSize: 14, fontStyle: "italic" }}>"Best coffee I've ever had." - Sarah M.</p>
      <p style={{ fontSize: 14, fontStyle: "italic" }}>"The Ethiopia one changed my life honestly." - Priya K.</p>

      <h3>How it works</h3>
      <ol style={{ fontSize: 14 }}>
        <li>You tell us how you brew (espresso, pour over, drip, French press).</li>
        <li>Every week we pick a single-origin coffee and roast it the day before it ships.</li>
        <li>It arrives at your door within 2 days of roasting. You brew it. You're happy.</li>
        <li>You can pause, skip, or cancel anytime. No commitment.</li>
      </ol>

      <h3>This week's coffees</h3>
      <p style={{ fontSize: 14 }}>Ethiopia Yirgacheffe - floral, citrus, tea-like. Light roast.</p>
      <p style={{ fontSize: 14 }}>Colombia Huila - caramel, red apple, balanced. Medium roast.</p>
      <p style={{ fontSize: 14 }}>Sumatra Mandheling - cocoa, cedar, full body. Dark roast.</p>
      <p style={{ fontSize: 14 }}>Guatemala Antigua - chocolate, orange, spice. Medium roast.</p>

      <h3>Plans</h3>
      <p style={{ fontSize: 14 }}>Solo - one 12oz bag per week - $18/week.</p>
      <p style={{ fontSize: 14 }}>Duo - two 12oz bags per week - $32/week.</p>
      <p style={{ fontSize: 14 }}>Office - five 12oz bags per week - $75/week.</p>
      <p style={{ fontSize: 13, color: "#777" }}>Shipping included. Cancel anytime. First bag ships within 3 days of signup.</p>

      <h3>Our mission and story and values (long version)</h3>
      <p style={{ fontSize: 13, color: "#555" }}>
        Daybreak Coffee Co. was founded in 2019 by two friends who met in line at a cafe. We believe coffee should be
        fresh, traceable, and fun. We work directly with farmers. We roast in small batches. We care about the planet,
        so our bags are compostable. We also have a dog named Marlowe who comes to the roastery on Tuesdays. Anyway,
        we think you'll love the coffee. This paragraph is probably too long and nobody reads it but here it is.
      </p>

      <div style={{ textAlign: "center", marginTop: 14 }}>
        <div onClick={() => alert("signup")} style={{ background: "brown", color: "white", display: "inline-block", padding: "6px 10px", cursor: "pointer" }}>
          Sign up now
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#aaa", marginTop: 24 }}>
        Contact: hello@daybreak.example | Instagram: @daybreakcoffee | Oakland, CA
      </div>
    </div>
  );
}
