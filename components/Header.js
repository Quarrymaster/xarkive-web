import Link from 'next/link'

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__logo">
          Ark<span>ive</span>it
        </Link>
        <nav className="site-header__nav">
          <Link href="/#leaderboard">Leaderboard</Link>
          <Link href="/#predictions">Predictions</Link>
          <Link href="/methodology">Methodology</Link>
          <a
            href="https://twitter.com/arkiveit"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
          >
            @arkiveit
          </a>
        </nav>
      </div>
    </header>
  )
}
