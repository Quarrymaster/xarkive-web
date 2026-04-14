import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

function categoryClass(cat) {
  if (!cat) return ''
  const c = cat.toLowerCase()
  if (c === 'finance') return 'tag--finance'
  if (c === 'politics') return 'tag--politics'
  if (c === 'geopolitics') return 'tag--geopolitics'
  if (c === 'tech') return 'tag--tech'
  return ''
}

function AccuracyBadge({ pct, verified }) {
  if (!verified || verified === 0) {
    return <span className="accuracy-badge accuracy-badge--pending">Pending</span>
  }
  const cls = pct >= 60 ? 'accuracy-badge--high' : pct >= 40 ? 'accuracy-badge--mid' : 'accuracy-badge--low'
  return <span className={`accuracy-badge ${cls}`}>{pct}%</span>
}

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

function buildLeaderboard(predictions) {
  const expertMap = {}
  for (const p of predictions) {
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
  return Object.values(expertMap)
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
}

export default function Home() {
  const [predictions, setPredictions] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [stats, setStats] = useState({ total: 0, experts: 0, verified: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('predictions')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50)
        if (error) throw error
        const preds = data || []
        const lb = buildLeaderboard(preds)
        const verified = lb.reduce((s, e) => s + e.verified, 0)
        setPredictions(preds)
        setLeaderboard(lb)
        setStats({ total: preds.length, experts: lb.length, verified })
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = filter === 'all'
    ? predictions
    : predictions.filter(p => {
        const norm = typeof p.normalized === 'string' ? JSON.parse(p.normalized) : (p.normalized || {})
        return norm.category === filter
      })

  const tickerItems = [
    '📌 Predictions archived in real time',
    '⚡ Powered by Grok AI',
    '🏆 Expert accuracy scored',
    '📊 Finance · Politics · Geopolitics · Tech',
    '🤖 Tag @arkiveit to archive any prediction',
    '📌 Predictions archived in real time',
    '⚡ Powered by Grok AI',
    '🏆 Expert accuracy scored',
    '📊 Finance · Politics · Geopolitics · Tech',
    '🤖 Tag @arkiveit to archive any prediction',
  ]

  return (
    <>
      <Head>
        <title>Arkiveit — Keeping Track of Predictions on X</title>
        <meta name="description" content="AI-powered prediction tracker for X. We archive expert predictions in finance, politics and geopolitics — and score whether they were right. Hold experts accountable." />
        <meta name="keywords" content="prediction tracker, expert predictions, X twitter predictions, accountability, finance predictions, political predictions, AI tracker" />
        <meta name="author" content="Arkiveit" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://xarkive.com" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://xarkive.com" />
        <meta property="og:title" content="Arkiveit — Keeping Track of Predictions on X" />
        <meta property="og:description" content="We archive expert predictions in finance, politics and geopolitics — and score whether they were right. Hold experts accountable." />
        <meta property="og:image" content="https://xarkive.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Arkiveit" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@arkiveit" />
        <meta name="twitter:creator" content="@arkiveit" />
        <meta name="twitter:url" content="https://xarkive.com" />
        <meta name="twitter:title" content="Arkiveit — Keeping Track of Predictions on X" />
        <meta name="twitter:description" content="We archive expert predictions in finance, politics and geopolitics — and score whether they were right." />
        <meta name="twitter:image" content="https://xarkive.com/og-image.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Arkiveit",
              "url": "https://xarkive.com",
              "description": "AI-powered prediction tracker for X.",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web",
              "creator": { "@type": "Organization", "name": "Arkiveit", "url": "https://xarkive.com", "sameAs": "https://x.com/arkiveit" }
            })
          }}
        />
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
      <section className="hero-section">
        <div className="hero-glow" />
        <div className="container">
          <div className="hero-inner">
            <div className="hero-left">
              <div className="hero-eyebrow">AI Prediction Tracker</div>
              <h1 className="hero-title">
                Keeping track of<br />
                predictions on <span className="hero-title__x">X</span>
              </h1>
              <p className="hero-subtitle">
                Experts make bold predictions every day. We archive them,
                track the outcomes, and score who is actually right.
              </p>
              <div className="hero-actions">
                <a
                  href="https://twitter.com/intent/tweet?text=@arkiveit+track+this"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                >
                  Tag @arkiveit to Archive a Prediction
                </a>
                <Link href="#predictions" className="btn btn--outline">
                  Browse Predictions
                </Link>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-stat-grid">
                <div className="hero-stat">
                  <div className="hero-stat__number">{loading ? '—' : stats.total}</div>
                  <div className="hero-stat__label">Predictions Tracked</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat__number">{loading ? '—' : stats.experts}</div>
                  <div className="hero-stat__label">Accounts Tracked</div>
                </div>
                <div className="hero-stat hero-stat--full">
                  <div className="hero-stat__number">{loading ? '—' : stats.verified}</div>
                  <div className="hero-stat__label">Verified Outcomes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main two-col layout */}
      <div className="main-layout" id="predictions">
        <div className="container">
          <div className="main-layout__inner">

            {/* Feed */}
            <main className="feed-col">
              <div className="feed-header">
                <h2 className="feed-title">Recent Predictions</h2>
                <div className="feed-filters">
                  {['all', 'finance', 'politics', 'geopolitics', 'tech'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`feed-filter ${filter === f ? 'feed-filter--active' : ''}`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {loading && <div className="feed-empty">Loading predictions...</div>}
              {!loading && filtered.length === 0 && (
                <div className="feed-empty">No predictions in this category yet.</div>
              )}

              <div className="feed">
                {filtered.map((p) => {
                  const norm = typeof p.normalized === 'string' ? JSON.parse(p.normalized) : (p.normalized || {})
                  const category = norm.category || null
                  const deadline = norm.deadline || null
                  return (
                    <div key={p.post_id} className={`feed-card feed-card--${p.status || 'pending'}`}>
                      <div className="feed-card__meta">
                        <a
                          href={`https://x.com/${p.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="feed-card__author"
                        >
                          @{p.username}
                        </a>
                        <span className="feed-card__date">{fmtDate(p.timestamp)}</span>
                      </div>
                      <p className="feed-card__claim">
                        &ldquo;{p.claim_text}&rdquo;
                      </p>
                      {(p.status === 'correct' || p.status === 'wrong') && p.outcome_notes && (
                        <div className={`feed-card__outcome feed-card__outcome--${p.status}`}>
                          <span className="feed-card__outcome-label">
                            {p.status === 'correct' ? '✅ Correct —' : '❌ Wrong —'}
                          </span>
                          {p.outcome_notes}
                        </div>
                      )}
                      <div className="feed-card__footer">
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                          {category && <span className={`tag ${categoryClass(category)}`}>{category}</span>}
                          {deadline && <span className="tag mono">By {deadline}</span>}
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <span className={`status-dot status-dot--${p.status || 'pending'}`}>
                            {p.status || 'pending'}
                          </span>
                          {p.source_url && (
                            <a href={p.source_url} target="_blank" rel="noopener noreferrer" className="feed-card__link">
                              View tweet →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </main>

            {/* Sidebar */}
            <aside className="sidebar-col" id="leaderboard">
              <div className="sidebar-box">
                <div className="sidebar-box__title">Archive a prediction</div>
                <p className="sidebar-box__text">
                  Reply to any prediction tweet on X and tag <strong style={{ color: 'var(--cyan)' }}>@arkiveit</strong>. Our bot archives it within 60 seconds.
                </p>
                <a
                  href="https://twitter.com/intent/tweet?text=@arkiveit+track+this"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
                >
                  Tag @arkiveit
                </a>
              </div>

              <div className="sidebar-box">
                <div className="sidebar-box__title">Leaderboard</div>
                <div className="sidebar-box__caption">Ranked by predictions tracked</div>
                {loading && <div style={{ color: 'var(--white-dim)', fontSize: '0.85rem', padding: '12px 0' }}>Loading...</div>}
                {leaderboard.map((row, i) => (
                  <div key={row.username} className="sidebar-expert">
                    <span className="sidebar-expert__rank">{i + 1}</span>
                    <div className="sidebar-expert__info">
                      <a href={`https://x.com/${row.username}`} target="_blank" rel="noopener noreferrer" className="sidebar-expert__handle">
                        @{row.username}
                      </a>
                      <span className="sidebar-expert__count">{row.total} prediction{row.total !== 1 ? 's' : ''}</span>
                    </div>
                    <AccuracyBadge pct={row.accuracy} verified={row.verified} />
                  </div>
                ))}
                <p style={{ marginTop: 16, fontSize: '0.7rem', color: 'var(--white-dim)', lineHeight: 1.6 }}>
                  Accuracy scores appear once predictions are verified.{' '}
                  <Link href="/methodology" style={{ color: 'var(--cyan)' }}>Methodology →</Link>
                </p>
              </div>
            </aside>

          </div>
        </div>
      </div>

      {/* How it works */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">How It Works</h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step__number">01</div>
              <div className="step__title">Expert makes a prediction</div>
              <p className="step__desc">A high-follower expert on X posts a bold claim about markets, elections, or geopolitics.</p>
            </div>
            <div className="step">
              <div className="step__number">02</div>
              <div className="step__title">You tag @arkiveit</div>
              <p className="step__desc">Reply to the prediction tweet and tag @arkiveit. Our bot detects it within 60 seconds.</p>
            </div>
            <div className="step">
              <div className="step__number">03</div>
              <div className="step__title">AI extracts and archives</div>
              <p className="step__desc">Grok AI reads the tweet and extracts the specific claim, timeframe, and measurable outcome.</p>
            </div>
            <div className="step">
              <div className="step__number">04</div>
              <div className="step__title">We score the outcome</div>
              <p className="step__desc">When the deadline passes, we verify the outcome and update the expert's accuracy score.</p>
            </div>
          </div>
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <a
              href="https://twitter.com/intent/tweet?text=@arkiveit+track+this"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
            >
              Start Archiving Predictions
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        /* Hero */
        .hero-section {
          position: relative;
          padding: 80px 0 60px;
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }
        .hero-glow {
          position: absolute;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(0,229,204,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
          flex-wrap: wrap;
        }
        .hero-left {
          flex: 1;
          min-width: 280px;
        }
        .hero-eyebrow {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--cyan);
          margin-bottom: 20px;
          border: 1px solid rgba(0,229,204,0.3);
          padding: 4px 10px;
          border-radius: 2px;
        }
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1.05;
          margin-bottom: 20px;
          color: var(--white);
        }
        .hero-title__x {
          color: var(--cyan);
          font-style: italic;
        }
        .hero-subtitle {
          font-size: 1.05rem;
          color: var(--white-dim);
          max-width: 480px;
          margin-bottom: 36px;
          line-height: 1.7;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .hero-right {
          flex-shrink: 0;
        }
        .hero-stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 4px;
          overflow: hidden;
        }
        .hero-stat {
          background: var(--black-2);
          padding: 24px 28px;
          text-align: center;
        }
        .hero-stat--full {
          grid-column: 1 / -1;
          border-top: 1px solid var(--border);
        }
        .hero-stat__number {
          font-family: 'Fraunces', serif;
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--cyan);
          line-height: 1;
          margin-bottom: 6px;
        }
        .hero-stat__label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--white-dim);
        }

        /* Main layout */
        .main-layout {
          padding: 60px 0;
          border-bottom: 1px solid var(--border);
        }
        .main-layout__inner {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 48px;
          align-items: start;
        }

        /* Feed */
        .feed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .feed-title {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--white);
        }
        .feed-filters {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .feed-filter {
          padding: 5px 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border: 1px solid var(--border);
          background: transparent;
          cursor: pointer;
          transition: all 0.15s;
          color: var(--white-dim);
          border-radius: 2px;
        }
        .feed-filter:hover {
          border-color: var(--cyan);
          color: var(--cyan);
        }
        .feed-filter--active {
          background: var(--cyan);
          border-color: var(--cyan);
          color: var(--black);
        }
        .feed-empty {
          padding: 48px;
          text-align: center;
          color: var(--white-dim);
          font-size: 0.9rem;
        }
        .feed {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          border-radius: 4px;
          overflow: hidden;
        }
        .feed-card {
          padding: 22px 24px;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .feed-card:last-child { border-bottom: none; }
        .feed-card:hover { background: var(--black-2); }
        .feed-card--correct { border-left: 2px solid var(--correct); }
        .feed-card--wrong   { border-left: 2px solid var(--wrong); }
        .feed-card__meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .feed-card__author {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--white);
          text-decoration: none;
        }
        .feed-card__author:hover { color: var(--cyan); }
        .feed-card__date {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: var(--white-dim);
        }
        .feed-card__claim {
          font-family: 'Fraunces', serif;
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.5;
          margin-bottom: 14px;
          color: var(--white);
        }
        .feed-card__outcome {
          padding: 10px 14px;
          font-size: 0.82rem;
          line-height: 1.6;
          margin-bottom: 14px;
          color: var(--white-dim);
          border-left: 2px solid;
          border-radius: 0 2px 2px 0;
        }
        .feed-card__outcome--correct {
          border-color: var(--correct);
          background: rgba(0,196,140,0.06);
        }
        .feed-card__outcome--wrong {
          border-color: var(--wrong);
          background: rgba(224,53,53,0.06);
        }
        .feed-card__outcome-label {
          font-weight: 700;
          margin-right: 6px;
          color: var(--white);
        }
        .feed-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .feed-card__link {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--white-dim);
          text-decoration: none;
        }
        .feed-card__link:hover { color: var(--cyan); }

        /* Sidebar */
        .sidebar-col {
          position: sticky;
          top: 80px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .sidebar-box {
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 20px;
          background: var(--black-2);
        }
        .sidebar-box__title {
          font-family: 'Fraunces', serif;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
          color: var(--white);
        }
        .sidebar-box__caption {
          font-size: 0.68rem;
          color: var(--white-dim);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .sidebar-box__text {
          font-size: 0.85rem;
          line-height: 1.7;
          color: var(--white-dim);
        }
        .sidebar-expert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 0;
          border-bottom: 1px solid var(--border);
        }
        .sidebar-expert:last-of-type { border-bottom: none; }
        .sidebar-expert__rank {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: var(--white-dim);
          width: 16px;
          flex-shrink: 0;
        }
        .sidebar-expert__info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .sidebar-expert__handle {
          font-weight: 600;
          font-size: 0.82rem;
          color: var(--white);
          text-decoration: none;
        }
        .sidebar-expert__handle:hover { color: var(--cyan); }
        .sidebar-expert__count {
          font-size: 0.68rem;
          color: var(--white-dim);
          margin-top: 1px;
        }

        /* Mobile */
        @media (max-width: 900px) {
          .main-layout__inner {
            grid-template-columns: 1fr;
          }
          .sidebar-col {
            position: static;
            order: 2;
          }
          .hero-inner {
            flex-direction: column;
            gap: 40px;
          }
          .hero-right {
            width: 100%;
          }
          .hero-stat-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .hero-stat--full {
            grid-column: auto;
            border-top: none;
          }
        }

        @media (max-width: 480px) {
          .hero-stat-grid {
            grid-template-columns: 1fr 1fr;
          }
          .hero-stat--full {
            grid-column: 1 / -1;
            border-top: 1px solid var(--border);
          }
          .feed-filters {
            gap: 4px;
          }
          .feed-filter {
            padding: 4px 8px;
            font-size: 0.65rem;
          }
        }
      `}</style>
    </>
  )
}
