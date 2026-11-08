import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { ArrowRight, Bookmark, Check, ChevronRight, Heart, LockKeyhole, Menu, MessageCircle, Moon, Search, ShieldCheck, Sun, X } from 'lucide-react'
import { concernLabel, searchTerms, type Term } from '../data'
import { useApp } from '../store'

export function Logo() {
  return <Link to="/" className="brand" aria-label="Parent Decoder home">
    <span className="brand-mark" aria-hidden="true"><MessageCircle size={20} strokeWidth={2.4} /><span /></span>
    <span>Parent <em>Decoder</em></span>
  </Link>
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [dark, setDark] = useState(() => localStorage.getItem('parent-decoder-theme') === 'dark')
  const { openSearch, savedTerms, savedMessages } = useApp()
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButtonRef.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('parent-decoder-theme', dark ? 'dark' : 'light')
  }, [dark])
  const nav = [
    ['/browse', 'Browse'], ['/decoder', 'Decoder'], ['/conversation-starters', 'Starters'], ['/saved', 'Saved'],
  ]
  return <header className="site-header">
    <div className="header-inner">
      <Logo />
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          {label}{label === 'Saved' && savedTerms.length + savedMessages.length > 0 && <span className="nav-count">{savedTerms.length + savedMessages.length}</span>}
        </NavLink>)}
      </nav>
      <div className="header-actions">
        <button className="icon-button search-trigger" onClick={openSearch} aria-label="Search all terms"><Search size={19} /><kbd>⌘ K</kbd></button>
        <button className="icon-button" onClick={() => setDark(!dark)} aria-label={dark ? 'Use light theme' : 'Use dark theme'}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        <Link className="button button-small header-suggest" to="/suggest">Suggest a term <ArrowRight size={15} /></Link>
        <button ref={menuButtonRef} className="icon-button mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </div>
    {menuOpen && <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation">
      {nav.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}>{label}<ChevronRight size={18} /></NavLink>)}
      <NavLink to="/suggest" onClick={() => setMenuOpen(false)}>Suggest a term<ChevronRight size={18} /></NavLink>
      <NavLink to="/about" onClick={() => setMenuOpen(false)}>About<ChevronRight size={18} /></NavLink>
    </nav>}
  </header>
}

export function Footer() {
  const groups = [
    { title: 'Explore', links: [['Browse all terms', '/browse'], ['Decode a message', '/decoder'], ['Conversation starters', '/conversation-starters'], ['Your saved items', '/saved'], ['Printable safety sheet', '/print']] },
    { title: 'Contribute', links: [['Suggest a term', '/suggest'], ['Share feedback', '/feedback'], ['Editorial policy', '/editorial-policy'], ['Review status', '/editorial-review']] },
    { title: 'Principles', links: [['About us', '/about'], ['Our approach', '/approach'], ['Privacy promise', '/privacy'], ['Family preferences', '/preferences'], ['Editorial portal', '/editorial']] },
  ]
  return <footer className="site-footer">
    <div className="footer-top">
      <div className="footer-intro"><Logo /><p>Modern language, calmly explained.<br />Understanding without surveillance.</p><span className="footer-trust"><ShieldCheck size={16} /> Private by design</span></div>
      {groups.map((group) => <div className="footer-group" key={group.title}><h3>{group.title}</h3>{group.links.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}</div>)}
    </div>
    <div className="footer-bottom"><span>© 2026 Parent Decoder</span><span>Made for connection, not control.</span></div>
  </footer>
}

export function SearchPalette() {
  const { searchOpen, openSearch, closeSearch } = useApp()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const results = searchTerms(query).slice(0, 6)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if (searchOpen) closeSearch(); else openSearch() }
      if (event.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeSearch, openSearch, searchOpen])
  useEffect(() => { if (searchOpen) setTimeout(() => inputRef.current?.focus(), 30) }, [searchOpen])
  if (!searchOpen) return null
  const go = (slug: string) => { closeSearch(); navigate(`/term/${slug}`) }
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && closeSearch()}>
    <section className="search-modal" role="dialog" aria-modal="true" aria-label="Search Parent Decoder">
      <div className="search-modal-input"><Search size={21} /><input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a word, emoji, or meaning…" onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) go(results[0].slug) }} /><button className="icon-button" onClick={closeSearch} aria-label="Close search"><X size={19} /></button></div>
      <div className="search-modal-results">
        <p className="mono-label">{query ? `${results.length} quick matches` : 'Popular right now'}</p>
        {results.map((item) => <button key={item.slug} onClick={() => go(item.slug)}><span className={item.category === 'Emojis & Symbols' ? 'emoji-term' : ''}>{item.term}</span><span>{item.plainMeaning}</span><ArrowRight size={17} /></button>)}
        {!results.length && <div className="search-empty"><p>No exact match yet.</p><Link to="/suggest" onClick={closeSearch}>Suggest “{query}” <ArrowRight size={15} /></Link></div>}
      </div>
      <div className="search-modal-foot"><LockKeyhole size={13} /> Searches are not saved or sent anywhere.</div>
    </section>
  </div>
}

export function AppShell() {
  const location = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])
  return <><a className="skip-link" href="#main-content">Skip to main content</a><Header /><main id="main-content"><Outlet /></main><Footer /><SearchPalette /></>
}

export function ConcernChip({ concern }: { concern: Term['concern'] }) {
  return <span className={`concern concern-${concern}`}>{concern === 'harmless' && <Check size={12} />}{concernLabel[concern]}</span>
}

export function TermCard({ item, compact = false }: { item: Term; compact?: boolean }) {
  const { savedTerms, toggleTerm } = useApp()
  const saved = savedTerms.includes(item.slug)
  return <article className={compact ? 'term-card compact' : 'term-card'}>
    <Link to={`/term/${item.slug}`} className="term-card-main" aria-label={item.category === 'Emojis & Symbols' ? `${item.term} emoji guide: ${item.plainMeaning}` : `${item.term}: ${item.plainMeaning}`}>
      <div className="term-card-meta"><span>{item.category}</span><ConcernChip concern={item.concern} /></div>
      <h3 className={item.category === 'Emojis & Symbols' ? 'emoji-term' : ''}>{item.term}</h3>
      <p>{item.plainMeaning}</p>
      <span className="text-link">Read the guide <ArrowRight size={15} /></span>
    </Link>
    <button className={saved ? 'save-term saved' : 'save-term'} onClick={() => toggleTerm(item.slug)} aria-label={saved ? `Remove ${item.term} from saved terms` : `Save ${item.term}`}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /></button>
  </article>
}

export function SupportResources() {
  return <section className="support-band" aria-labelledby="support-heading">
    <Heart size={24} />
    <div><h2 id="support-heading">A word is never the whole story.</h2><p>If someone may be in immediate danger, contact local emergency services. For emotional distress, reach out to a trusted person or a qualified local crisis service. You do not need to decode a message perfectly before offering care.</p></div>
    <Link to="/approach" className="text-link">Our safety approach <ArrowRight size={16} /></Link>
  </section>
}

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <div className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><div className="page-lede">{children}</div></div>
}
