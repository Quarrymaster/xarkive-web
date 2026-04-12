import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Methodology() {
  return (
    <>
      <Head>
        <title>Methodology — Arkiveit</title>
        <meta name="description" content="How Arkiveit tracks, extracts, and scores expert predictions on X." />
      </Head>

      <Header />

      <section style={{ background: 'var(--black)', color: 'var(--white)', padding: '60px 24px', borderBottom: '2px solid var(--black)' }}>
        <div className="container--narrow">
          <span style={{
            display: 'inline-block',
            background: 'var(--red)',
            color: 'var(--white)',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            marginBottom: 24
          }}>
            Transparency
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1 }}>
            Our Methodology
          </h1>
          <p style={{ marginTop: 20, color: 'var(--gray-400)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            Arkiveit&apos;s credibility depends on transparency. Here is exactly how we
            identify, extract, and score predictions.
          </p>
        </div>
      </section>

      <article style={{ padding: '60px 24px' }}>
        <div className="container--narrow" style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 900, marginBottom: 16, paddingBottom: 16, borderBottom: '2px solid var(--black)' }}>
              What qualifies as a prediction?
            </h2>
            <p style={{ marginBottom: 16, lineHeight: 1.8 }}>
              Not everything an expert says is a prediction. We apply a strict three-part test.
              A statement must have <strong>all three</strong> of the following to be tracked:
            </p>
            <ol style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li style={{ lineHeight: 1.8 }}>
                <strong>A specific, falsifiable claim</strong> — the outcome must be clearly true or false, not a matter of interpretation.
              </li>
              <li style={{ lineHeight: 1.8 }}>
                <strong>A measurable outcome</strong> — a price level, election result, event happening or not happening.
              </li>
              <li style={{ lineHeight: 1.8 }}>
                <strong>An implied or explicit timeframe</strong> — we must know when to check the outcome.
              </li>
            </ol>
            <div style={{ marginTop: 24, padding: 20, background: 'var(--gray-100)', borderLeft: '4px solid var(--red)' }}>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.8 }}>
                <strong>We do NOT track:</strong> general opinions (&ldquo;markets are overvalued&rdquo;),
                vague directional statements (&ldquo;stocks will go up eventually&rdquo;),
                risk warnings without a predicted outcome (&ldquo;recession risk is rising&rdquo;),
                or historical commentary.
              </p>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 900, marginBottom: 16, paddingBottom: 16, borderBottom: '2px solid var(--black)' }}>
              Prediction tiers
            </h2>
            <p style={{ marginBottom: 24, lineHeight: 1.8 }}>
              We classify predictions into three tiers based on specificity and verifiability:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { tier: 'Tier 1', label: 'Highly Verifiable', desc: 'Specific number + date. e.g. "SPX hits 6,000 by December 2025"', score: '0.8–1.0' },
                { tier: 'Tier 2', label: 'Moderately Verifiable', desc: 'Clear direction + timeframe. e.g. "Fed will cut rates before June"', score: '0.5–0.8' },
                { tier: 'Tier 3', label: 'Qualitative', desc: 'Time-bound but qualitative. e.g. "China will escalate on Taiwan in 2025"', score: '0.3–0.5' },
              ].map(t => (
                <div key={t.tier} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 80px', gap: 20, padding: 20, border: '2px solid var(--black)', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', fontWeight: 500, color: 'var(--red)' }}>{t.tier}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: 4 }}>{t.label}</div>
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--gray-600)' }}>{t.desc}</p>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', textAlign: 'right', color: 'var(--gray-400)' }}>{t.score}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 900, marginBottom: 16, paddingBottom: 16, borderBottom: '2px solid var(--black)' }}>
              How accuracy is scored
            </h2>
            <div style={{ padding: 24, background: 'var(--black)', color: 'var(--white)', marginBottom: 24 }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', textAlign: 'center' }}>
                Accuracy = Correct Predictions ÷ Verified Predictions × 100
              </p>
            </div>
            <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
              <strong>Only verified predictions count.</strong> A prediction is verified when its deadline has passed
              and we have confirmed the outcome. Pending predictions do not affect accuracy scores.
            </p>
            <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
              This means an expert with 50 predictions but 0 verified outcomes shows no accuracy score yet —
              not zero percent, but genuinely unknown. We display this as &ldquo;Pending&rdquo; to avoid misleading users.
            </p>
            <p style={{ lineHeight: 1.8 }}>
              <strong>Financial predictions</strong> are verified automatically where possible using public market data.
              <strong> Political and geopolitical predictions</strong> require manual verification.
              We flag the verification method on each prediction.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 900, marginBottom: 16, paddingBottom: 16, borderBottom: '2px solid var(--black)' }}>
              How predictions are sourced
            </h2>
            <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
              Predictions enter Arkiveit through two channels:
            </p>
            <ol style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li style={{ lineHeight: 1.8 }}>
                <strong>Community tagging:</strong> Anyone can reply to a prediction tweet on X and tag @arkiveit.
                Our bot detects this within 60 seconds and attempts to extract the prediction.
              </li>
              <li style={{ lineHeight: 1.8 }}>
                <strong>Automated watchlist:</strong> We monitor a curated list of high-follower experts in finance,
                politics, and geopolitics, ingesting their recent tweets automatically.
              </li>
            </ol>
            <p style={{ marginTop: 16, lineHeight: 1.8, color: 'var(--gray-600)', fontSize: '0.9rem' }}>
              In both cases, predictions are only saved if our AI determines they meet the three-part test above.
              We do not manually add or remove predictions from the database.
            </p>
          </section>

          <div style={{ padding: '32px', background: 'var(--cream)', border: '2px solid var(--black)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 16 }}>
              Have a question about our methodology or found an error?
            </p>
            <a
              href="https://twitter.com/arkiveit"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
            >
              Contact @arkiveit on X
            </a>
          </div>

        </div>
      </article>

      <Footer />
    </>
  )
}
