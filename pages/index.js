import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

// Category colour helper
function categoryClass(cat) {
  if (!cat) return ''
  const c = cat.toLowerCase()
  if (c === 'finance') return 'tag--finance'
  if (c === 'politics') return 'tag--politics'
  if (c === 'geopolitics') return 'tag--geopolitics'
  return ''
}

// Accuracy badge helper
function AccuracyBadge({ pct, verified }) {
  if (!verified || verified === 0) {
    return <span className="accuracy-badge accuracy-badge--pending">Pending</span>
  }
  const cls = pct >= 60 ? 'accuracy-badge--high' : pct >= 40 ? 'accuracy-badge--mid' : 'accuracy-badge--low'
  return <span className={`accuracy-badge ${cls}`}>{pct}%</span>
}

// Format date
function fmtDate(ts) {
  if (!ts) return '—'
  try {
    return new Date(ts).toLocaleDateString('en-AU', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  } catch {
    return ts.slice(0, 10)
  }
}

export default function Home({ predictions, leaderboard, stats }) {
  const tickerItems = [
    '📌 Predictions tracked in real time',
    '⚡ Powered by Grok AI',
    '🏆 Expert accuracy scored',
    '📊 Finance · Politics · Geopolitics',
    '🤖 Tag @arkiveit to track any prediction',
    '📌 Predictions tracked in real time',
    '⚡ Powered by Grok AI',
    '🏆 Expert accuracy scored',
    '📊 Finance · Politics · Geopolitics',
    '🤖 Tag @arkiveit to track any prediction',
  ]

  return (
    <>
      <Head>
        <title>Arkiveit — Keeping track of predictions on X</title>
        <meta name="description" content="AI-powered prediction tracker for X. We track what experts predict in finance, politics and geopolitics — and score whether they were right." />
        <meta property="og:title" content="Arkiveit — Keeping track of predictions on X" />
        <meta property="og:description" content="Hold experts accountable. We track predictions made on X and score accuracy over time." />
        <meta property="og:url" content="https://xarkive.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@arkiveit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {/* Ticker */}
      <div className="ticker">
        <div className="ticker__inner">
          {tickerItems.map((item, i) => (
            <span key={i} className="ticker__item">{item}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="hero__inner">
          <span className="hero__eyebrow">AI Prediction Tracker</span>
          <h1 className="hero__title">
            Keeping track of<br />
            predictions on <em>X</em>
          </h1>
          <p className="hero__subtitle">
            Experts make bold predictions every day. We archive them, track the outcomes,
            and score who is actually right — in finance, politics, and geopolitics.
          </p>
          <div className="hero__cta">
            <a
              href="https://twitter.com/intent/tweet?text=@arkiveit+track+this"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
            >
              Tag @arkiveit to Track a Prediction
            </a>
            <Link href="#leaderboard" className="btn btn--outline">
              View Leaderboard
            </Link>
          </div>
          <div className="hero__stats">
            <div>
              <div className="hero__stat-number">{stats.total}</div>
              <div className="hero__stat-label">Predictions Tracked</div>
            </div>
            <div>
              <div className="hero__stat-number">{stats.experts}</div>
              <div className="hero__stat-label">Experts Monitored</div>
            </div>
            <div>
              <div className="hero__stat-number">{stats.verified}</div>
              <div className="hero__stat-label">Verified Outcomes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="section section--bordered" id="leaderboard">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Expert Leaderboard</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600 }}>
              Ranked by verified accuracy
            </span>
          </div>

          <div className="leaderboard">
            <div className="leaderboard__header">
              <span>#</span>
              <span>Expert</span>
              <span>Predictions</span>
              <span>Verified</span>
              <span>Correct</span>
              <span>Accuracy</span>
            </div>
            {leaderboard.length === 0 && (
              <div style={{ padding: '40px 20px', color: 'var(--gray-400)', textAlign: 'center' }}>
                No experts with verified predictions yet. Check back soon.
              </div>
            )}
            {leaderboard.map((row, i) => (
              <div key={row.username} className="leaderboard__row">
                <span className="leaderboard__rank">{i + 1}</span>
                <div className="leaderboard__expert">
                  <a
                    href={`https://x.com/${row.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="leaderboard__handle"
                  >
                    @{row.username}
                  </a>
                  {row.category && (
                    <span className="leaderboard__category">{row.category}</span>
                  )}
                </div>
                <span className="mono">{row.total}</span>
                <span className="mono">{row.verified}</span>
                <span className="mono">{row.correct}</span>
                <AccuracyBadge pct={row.accuracy} verified={row.verified} />
              </div>
            ))}
          </div>

          <p style={{ marginTop: 16, fontSize: '0.75rem', color: 'var(--gray-400)' }}>
            Accuracy = correct ÷ verified predictions only. Pending predictions are excluded.{' '}
            <Link href="/methodology" style={{ color: 'var(--red)' }}>Read our methodology →</Link>
          </p>
        </div>
      </section>

      {/* Recent Predictions */}
      <section className="section section--bordered" id="predictions">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Recent Predictions</h2>
            <a
              href="https://twitter.com/intent/tweet?text=@arkiveit+track+this"
              target="_blank"
              rel="noopener noreferrer"
              className="section__link"
            >
              Submit a prediction →
            </a>
          </div>

          <div className="predictions-grid">
            {predictions.length === 0 && (
              <div style={{ padding: '60px', color: 'var(--gray-400)', gridColumn: '1/-1', textAlign: 'center' }}>
                No predictions yet. Tag @arkiveit in a reply to any prediction tweet to get started.
              </div>
            )}
            {predictions.map((p) => {
              const norm = typeof p.normalized === 'string' ? JSON.parse(p.normalized) : (p.normalized || {})
              const category = norm.category || null
              const deadline = norm.deadline || null

              return (
                <div key={p.post_id} className="prediction-card">
                  <div className="prediction-card__meta">
                    <a
                      href={`https://x.com/${p.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="prediction-card__author"
                    >
                      @{p.username}
                    </a>
                    <span className="prediction-card__date">{fmtDate(p.timestamp)}</span>
                  </div>

                  <p className="prediction-card__claim">
                    &ldquo;{p.claim_text}&rdquo;
                  </p>

                  <div className="prediction-card__footer">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {category && (
                        <span className={`tag ${categoryClass(category)}`}>{category}</span>
                      )}
                      {deadline && (
                        <span className="tag mono">By {deadline}</span>
                      )}
                    </div>
                    <span className={`status-dot status-dot--${p.status || 'pending'}`}>
                      {p.status || 'pending'}
                    </span>
                  </div>

                  {p.source_url && (
                    <a
                      href={p.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        marginTop: 16,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'var(--gray-400)',
                        textDecoration: 'none'
                      }}
                    >
                      View original tweet →
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section__header" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
            <h2 className="section__title" style={{ color: 'var(--white)' }}>How It Works</h2>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step__number">01</div>
              <div className="step__title">Expert makes a prediction</div>
              <p className="step__desc">
                A high-follower expert on X posts a bold claim about markets, elections,
                or geopolitics.
              </p>
            </div>
            <div className="step">
              <div className="step__number">02</div>
              <div className="step__title">You tag @arkiveit</div>
              <p className="step__desc">
                Reply to the prediction tweet and tag @arkiveit. Our bot detects it
                within 60 seconds.
              </p>
            </div>
            <div className="step">
              <div className="step__number">03</div>
              <div className="step__title">AI extracts and archives</div>
              <p className="step__desc">
                Grok AI reads the tweet and extracts the specific claim, timeframe,
                and measurable outcome.
              </p>
            </div>
            <div className="step">
              <div className="step__number">04</div>
              <div className="step__title">We score the outcome</div>
              <p className="step__desc">
                When the deadline passes, we verify the outcome and update the
                expert&apos;s accuracy score.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <a
              href="https://twitter.com/intent/tweet?text=@arkiveit+track+this"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
            >
              Start Tracking a Prediction
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export async function getServerSideProps() {
  try {
    // Fetch predictions
    const { data: predictions, error } = await supabase
      .from('predictions')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20)

    if (error) throw error

    // Build leaderboard
    const expertMap = {}
    for (const p of predictions || []) {
      const u = p.username
      if (!u || u === 'None') continue
      if (!expertMap[u]) {
        expertMap[u] = { username: u, total: 0, verified: 0, correct: 0, category: null }
      }
      expertMap[u].total++
      if (p.status === 'correct' || p.status === 'wrong') expertMap[u].verified++
      if (p.status === 'correct') expertMap[u].correct++
      if (!expertMap[u].category && p.normalized) {
        const norm = typeof p.normalized === 'string' ? JSON.parse(p.normalized) : p.normalized
        expertMap[u].category = norm?.category || null
      }
    }

    const leaderboard = Object.values(expertMap)
      .map(e => ({
        ...e,
        accuracy: e.verified > 0 ? Math.round((e.correct / e.verified) * 100) : null
      }))
      .sort((a, b) => {
        if (a.verified > 0 && b.verified === 0) return -1
        if (b.verified > 0 && a.verified === 0) return 1
        if (a.accuracy !== b.accuracy) return (b.accuracy || 0) - (a.accuracy || 0)
        return b.total - a.total
      })

    const stats = {
      total: predictions?.length || 0,
      experts: Object.keys(expertMap).length,
      verified: Object.values(expertMap).reduce((s, e) => s + e.verified, 0)
    }

    return {
      props: {
        predictions: predictions || [],
        leaderboard,
        stats
      }
    }
  } catch (err) {
    console.error('Data fetch error:', err)
    return {
      props: { predictions: [], leaderboard: [], stats: { total: 0, experts: 0, verified: 0 } },
      revalidate: 60
    }
  }
}
