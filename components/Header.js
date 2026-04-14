import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__logo">
          <img src="/logo.png" alt="Arkiveit" />
        </Link>
        <nav className="site-header__nav">
          <Link href="/#predictions">Predictions</Link>
          <Link href="/#leaderboard">Leaderboard</Link>
          <Link href="/methodology">Methodology</Link>
          <a
            href="https://twitter.com/arkiveit"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--outline"
            style={{ padding: '7px 16px', fontSize: '0.8rem' }}
          >
            @arkiveit
          </a>
        </nav>
      </div>
    </header>
  )
}
