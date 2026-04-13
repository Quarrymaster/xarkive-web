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
    '📌 Predictions tracked in real time',
    '⚡ Powered by Grok AI',
    '🏆 Expert accuracy scored',
    '📊 Finance · Politics · Geopolitics',
    '🤖 Tag @arkiveit to track any prediction',
    '📌 Predictions tracked in real time',
    '⚡ Powered by Grok AI',
    '🏆 Expert accuracy scored',
    '📊 Finance · Politics · Geopolitics · Tech',
    '🤖 Tag @arkiveit to track any prediction',
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
              "description": "AI-powered prediction tracker for X. We archive expert predictions and score accuracy.",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "Arkiveit",
                "url": "https://xarkive.com",
                "sameAs": "https://x.com/arkiveit"
              }
            })
          }}
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="ticker">
        <div className="ticker__inner">
          {tickerItems.map((item, i) => (
            <span key={i} className="ticker__item">{item}</span>
          ))}
        </div>
      </div>

      {/* Compact Hero */}
      <section className="hero hero--compact">
        <div className="hero__inner">
          <div className="hero__left">
            <span className="hero__eyebrow">AI Prediction Tracker</span>
            <h1 className="hero__title">
              Keeping track of<br />
              predictions on <em>X</em>
            </h1>
            <p className="hero__subtitle">
              Experts make bold predictions. We archive them, track outcomes, and score who is actually right.
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
            </div>
          </div>
          <div className="hero__right">
            <div className="hero__stats">
              <div className="hero__stat">
                <div className="hero__stat-number">{loading ? '—' : stats.total}</div>
                <div className="hero__stat-label">Predictions Tracked</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-number">{loading ? '—' : stats.experts}</div>
                <div className="hero__stat-label">Experts Monitored</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-number">{loading ? '—' : stats.verified}</div>
                <div className="hero__stat-label">Verified Outcomes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content — two column layout */}
      <div className="main-layout">
        <div className="container">
          <div className="main-layout__inner">

            {/* Left — Predictions feed */}
            <main className="main-layout__feed">
              <div className="feed-header">
                <h2 className="feed-header__title">Recent Predictions</h2>
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

              {loading && (
                <div className="feed-empty">Loading predictions...</div>
              )}
              {!loading && filtered.length === 0 && (
                <div className="feed-empty">
                  No predictions in this category yet.{' '}
                  <a href="https://twitter.com/intent/tweet?text=@arkiveit+track+this" target="_blank" rel="noopener noreferrer">
                    Submit one →
                  </a>
                </div>
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
  <div className="feed-card__outcome">
    <span className="feed-card__outcome-label">
      {p.status === 'correct' ? '✅ Correct —' : '❌ Wrong —'}
    </span>
    {p.outcome_notes}
  </div>
)}
                      <div className="feed-card__footer">
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                          {category && (
                            <span className={`tag ${categoryClass(category)}`}>{category}</span>
                          )}
                          {deadline && (
                            <span className="tag mono">By {deadline}</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <span className={`status-dot status-dot--${p.status || 'pending'}`}>
                            {p.status || 'pending'}
                          </span>
                          {p.source_url && (
                            <a
                              href={p.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="feed-card__link"
                            >
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

            {/* Right — Sidebar */}
            <aside className="main-layout__sidebar">

              {/* How to use */}
              <div className="sidebar-box">
                <div className="sidebar-box__title">How to use</div>
                <p className="sidebar-box__text">
                  Reply to any prediction tweet on X and tag <strong>@arkiveit</strong>. Our bot archives it within 60 seconds.
                </p>
                <a
                  href="https://twitter.com/intent/tweet?text=@arkiveit+track+this"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
                >
                  Tag @arkiveit
                </a>
              </div>

              {/* Leaderboard */}
              <div className="sidebar-box">
                <div className="sidebar-box__title">Leaderboard</div>
                <div className="sidebar-box__caption">Ranked by predictions tracked</div>
                {loading && <div className="feed-empty" style={{ padding: '20px 0' }}>Loading...</div>}
                {leaderboard.map((row, i) => (
                  <div key={row.username} className="sidebar-expert">
                    <span className="sidebar-expert__rank">{i + 1}</span>
                    <div className="sidebar-expert__info">
                      <a
                        href={`https://x.com/${row.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sidebar-expert__handle"
                      >
                        @{row.username}
                      </a>
                      <span className="sidebar-expert__count">{row.total} prediction{row.total !== 1 ? 's' : ''}</span>
                    </div>
                    <AccuracyBadge pct={row.accuracy} verified={row.verified} />
                  </div>
                ))}
                <p style={{ marginTop: 12, fontSize: '0.7rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>
                  Accuracy scores appear once predictions are verified.{' '}
                  <Link href="/methodology" style={{ color: 'var(--red)' }}>Methodology →</Link>
                </p>
              </div>

            </aside>
          </div>
        </div>
      </div>

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
              Start Tracking a Prediction
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .hero--compact {
          padding: 48px 24px;
        }
        .hero--compact .hero__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 48px;
          flex-wrap: wrap;
        }
        .hero--compact .hero__title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          margin-bottom: 16px;
        }
        .hero--compact .hero__subtitle {
          font-size: 1rem;
          margin-bottom: 24px;
        }
        .hero__left {
          flex: 1;
          min-width: 280px;
        }
        .hero__right {
          flex-shrink: 0;
        }
        .hero__stats {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
        }
        .hero__stat {
          text-align: center;
          padding: 20px 24px;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .main-layout {
          padding: 48px 24px;
          border-bottom: 2px solid var(--black);
        }
        .main-layout__inner {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 48px;
          align-items: start;
        }
        .feed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 2px solid var(--black);
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .feed-header__title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 900;
        }
        .feed-filters {
          display: flex;
          gap: 4px;
        }
        .feed-filter {
          padding: 6px 14px;
          font-family: 'Syne', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 2px solid var(--gray-200);
          background: transparent;
          cursor: pointer;
          transition: all 0.15s;
          color: var(--gray-600);
        }
        .feed-filter:hover {
          border-color: var(--black);
          color: var(--black);
        }
        .feed-filter--active {
          background: var(--black);
          border-color: var(--black);
          color: var(--white);
        }
        .feed-empty {
          padding: 40px;
          text-align: center;
          color: var(--gray-400);
          font-size: 0.9rem;
        }
        .feed {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 2px solid var(--black);
        }
        .feed-card {
          padding: 24px;
          border-bottom: 2px solid var(--black);
          transition: background 0.15s;
        }
        .feed-card:last-child {
          border-bottom: none;
        }
        .feed-card:hover {
          background: var(--gray-100);
        }
        .feed-card__meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .feed-card__author {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--black);
          text-decoration: none;
        }
        .feed-card__author:hover {
          color: var(--red);
        }
        .feed-card__date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          color: var(--gray-400);
        }
        .feed-card__claim {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.5;
          margin-bottom: 16px;
          color: var(--black);
        }
        .feed-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .feed-card__link {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--gray-400);
          text-decoration: none;
        }
        .feed-card__link:hover {
          color: var(--red);
        }
        .main-layout__sidebar {
          position: sticky;
          top: 80px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .sidebar-box {
          border: 2px solid var(--black);
          padding: 20px;
        }
        .sidebar-box__title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 900;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--black);
        }
        .sidebar-box__caption {
          font-size: 0.72rem;
          color: var(--gray-400);
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .sidebar-box__text {
          font-size: 0.875rem;
          line-height: 1.7;
          color: var(--gray-600);
        }
        .sidebar-expert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid var(--gray-200);
        }
        .sidebar-expert:last-of-type {
          border-bottom: none;
        }
        .sidebar-expert__rank {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--gray-400);
          width: 16px;
          flex-shrink: 0;
        }
        .sidebar-expert__info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .sidebar-expert__handle {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--black);
          text-decoration: none;
        }
        .sidebar-expert__handle:hover {
          color: var(--red);
        }
        .sidebar-expert__count {
          font-size: 0.72rem;
          color: var(--gray-400);
          margin-top: 2px;
        }
        @media (max-width: 900px) {
          .main-layout__inner {
            grid-template-columns: 1fr;
          }
          .main-layout__sidebar {
            position: static;
            order: 2;
          }
          .hero--compact .hero__inner {
            flex-direction: column;
            gap: 24px;
          }
          .hero__right {
            width: 100%;
          }
          .hero__stats {
            gap: 12px;
          }
          .hero__stat {
            flex: 1;
            min-width: 80px;
            padding: 12px;
          }
          .hero__stat .hero__stat-number {
            font-size: 1.8rem;
          }
          .feed-filters {
            flex-wrap: wrap;
          }
        }
          .main-layout__sidebar {
            position: static;
            order: -1;
          }
          .hero--compact .hero__inner {
            flex-direction: column;
          }
            .feed-card__outcome {
          background: var(--gray-100);
          border-left: 3px solid var(--gray-400);
          padding: 10px 14px;
          font-size: 0.85rem;
          line-height: 1.6;
          margin-bottom: 16px;
          color: var(--gray-600);
        }
        .feed-card--correct .feed-card__outcome { border-color: var(--correct); }
        .feed-card--wrong .feed-card__outcome { border-color: var(--wrong); }
        .feed-card__outcome-label {
          font-weight: 700;
          margin-right: 6px;
          color: var(--black);
          * {
          max-width: 100%;
          box-sizing: border-box;
        }
        html, body {
          overflow-x: hidden;
          width: 100%;
        }
      `}</style>
    </>
  )
}
