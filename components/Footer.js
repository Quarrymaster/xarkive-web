import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__logo">
          <img src="/logo.png" alt="Arkiveit" />
        </div>
        <div className="site-footer__links">
          <Link href="/methodology">Methodology</Link>
          <a href="https://twitter.com/arkiveit" target="_blank" rel="noopener noreferrer">@arkiveit on X</a>
          <Link href="/privacy">Privacy</Link>
        </div>
        <div className="site-footer__copy">
          © {new Date().getFullYear()} Arkiveit — Keeping track of predictions on X
        </div>
      </div>
    </footer>
  )
}
