import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, BookOpen, Check, HeartHandshake, LockKeyhole, MessageCircleHeart, Search, ShieldCheck, Sparkles, X } from 'lucide-react'
import { categories, decodeMessage, findTerm, searchTerms, terms, type Term } from '../data'
import { ConcernChip, SupportResources, TermCard } from '../components/AppShell'
import { useApp } from '../store'

export function DecodeResults({ text }: { text: string }) {
  const matches = useMemo(() => decodeMessage(text), [text])
  if (!matches.length) return <div className="decode-empty"><p>No exact terms recognised—yet.</p><span>Try a single word or a different spelling. Slang changes quickly, and context still matters more than a definition.</span><div><Link className="button button-small" to="/suggest">Suggest this term</Link><Link className="button button-small button-outline" to="/browse">Browse the library</Link></div></div>
  return <div className="decode-results">
    <div className="decode-results-heading"><span className="mono-label">Found in your message</span><span>{matches.length} {matches.length === 1 ? 'term' : 'terms'}</span></div>
    <p className="decoded-message">“{text}”</p>
    {matches.map((item) => <Link to={`/term/${item.slug}`} key={item.slug} className="decode-match">
      <div><span className={item.category === 'Emojis & Symbols' ? 'decode-term emoji-term' : 'decode-term'}>{item.term}</span><ConcernChip concern={item.concern} /></div>
      <p>{item.plainMeaning}</p><ArrowRight size={18} />
    </Link>)}
    <p className="decode-note"><Sparkles size={14} /> These are possible readings, not verdicts. Tone and relationship still shape the meaning.</p>
  </div>
}

function FamilyFeed() {
  const { prefs } = useApp()
  if (!prefs.topics.length && !prefs.ageBand) return null
  const ageLabel = prefs.ageBand ? { 'under-13': 'Under 13', '13-15': '13–15', '16-18': '16–18', adult: 'Adult' }[prefs.ageBand] : 'Your family'
  const picks = prefs.topics.length
    ? terms.filter((item) => prefs.topics.includes(item.category)).slice(0, 6)
    : terms.slice(0, 6)
  const fresh = [...picks].sort((a, b) => (b.lastVerified ?? b.reviewed).localeCompare(a.lastVerified ?? a.reviewed)).slice(0, 6)
  return <section className="section family-feed"><div className="section-heading asymmetric"><div><p className="eyebrow">For {ageLabel}</p><h2>Fresh in your<br /><em>watched topics.</em></h2></div><Link to="/preferences" className="text-link">Adjust preferences <ArrowRight size={16} /></Link></div><div className="term-grid">{fresh.map((item) => <TermCard key={item.slug} item={item} compact />)}</div></section>
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'auto' | 'term' | 'message'>('auto')
  const [category, setCategory] = useState('All terms')
  const navigate = useNavigate()
  const isMessage = mode === 'message' || (mode === 'auto' && query.trim().split(/\s+/).length > 1)
  const results = useMemo(() => searchTerms(query).slice(0, 4), [query])
  const browse = category === 'All terms' ? terms.slice(0, 6) : terms.filter((item) => item.category === category).slice(0, 6)
  const submit = () => {
    if (!query.trim()) return
    if (!isMessage && results[0]) navigate(`/term/${results[0].slug}`)
  }
  return <>
    <section className="home-hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow"><span className="live-dot" /> A calmer way to understand</p>
        <h1>Understand the words.<br />Keep the <em>connection.</em></h1>
        <p className="hero-lede">Modern slang, emojis, and online phrases—explained with context, nuance, and a way to start the conversation.</p>
        <div className="hero-proof"><span><Check size={15} /> No account</span><span><Check size={15} /> No monitoring</span><span><Check size={15} /> No panic</span></div>
      </div>
      <div className="hero-decoder-wrap">
        <div className="hero-note" aria-hidden="true">Curiosity looks good on you <span>↘</span></div>
        <div className="hero-decoder">
          <div className="decoder-label"><span>THE DECODER</span><span><LockKeyhole size={12} /> On your device</span></div>
          <label htmlFor="home-search">What did you see or hear?</label>
          <div className="hero-search"><Search size={20} /><input id="home-search" value={query} maxLength={200} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit() }} placeholder="A word, emoji, or whole message" autoComplete="off" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={17} /></button>}</div>
          <div className="decode-modes" role="group" aria-label="Decoding mode">{(['auto', 'term', 'message'] as const).map((item) => <button key={item} aria-pressed={mode === item} onClick={() => setMode(item)}>{item === 'auto' ? 'Auto detect' : item === 'term' ? 'Single term' : 'Whole message'}</button>)}</div>
          {query.trim() && <div className="home-results" aria-live="polite">{isMessage ? <DecodeResults text={query} /> : results.length ? results.map((item) => <Link to={`/term/${item.slug}`} key={item.slug}><strong>{item.term}</strong><span>{item.plainMeaning}</span><ArrowRight size={16} /></Link>) : <DecodeResults text={query} />}</div>}
          {!query && <div className="example-searches"><span>Try one</span>{['no cap', '💀', 'iykyk'].map((term) => <button key={term} onClick={() => { setQuery(term); setMode('term') }}>{term}</button>)}</div>}
          <p className="decoder-privacy"><LockKeyhole size={13} /> Nothing is saved automatically. Your search stays here.</p>
        </div>
      </div>
    </section>

    <section className="ticker" aria-label="Topics covered"><div>{['Slang', 'Emojis', 'Group chats', 'Gaming', 'Social media', 'Real-life context'].map((item) => <span key={item}>{item}<i>✳</i></span>)}</div></section>

    <section className="section popular-section">
      <div className="section-heading asymmetric"><div><p className="eyebrow">A good place to start</p><h2>What parents are<br /><em>decoding now.</em></h2></div><p>Plain-English meanings first. Then the nuance that a one-line definition usually misses.</p></div>
      <div className="term-grid">{['skull-emoji', 'mid', 'no-cap', 'delulu', 'npc', 'lowkey'].map((slug) => findTerm(slug)).filter((item): item is Term => Boolean(item)).map((item) => <TermCard key={item.slug} item={item} />)}</div>
      <div className="section-end-link"><Link to="/browse" className="button button-outline">Explore all {terms.length} guides <ArrowRight size={17} /></Link></div>
    </section>

    <FamilyFeed />

    <section className="featured-guide">
      <div className="featured-inner">
        <div className="featured-term"><p className="eyebrow">One term. More than one reading.</p><span className="featured-category">General slang</span><h2>“mid”</h2><p>Average, unimpressive, or just not worth the hype.</p><div className="featured-tags"><ConcernChip concern="harmless" /><span>Often playful</span></div><Link to="/term/mid" className="button button-light">Read the full guide <ArrowRight size={17} /></Link></div>
        <div className="featured-context">
          <div><span className="step-number">01</span><section><h3>What it means</h3><p>A casual critique for something that did not live up to expectations. Between friends, it can be a joke about taste.</p></section></div>
          <div><span className="step-number">02</span><section><h3>Read the moment</h3><p>“The movie was mid” is an opinion. “Your art is mid” lands differently. Target and tone matter.</p></section></div>
          <div><span className="step-number">03</span><section><h3>Keep talking</h3><blockquote>“Not for you, or genuinely disappointing? I’m curious what you think.”</blockquote></section></div>
        </div>
      </div>
    </section>

    <section className="section how-section">
      <div className="section-heading"><p className="eyebrow">Context over conclusions</p><h2>Less “gotcha.”<br /><em>More “tell me.”</em></h2></div>
      <div className="how-grid">
        <article><MessageCircleHeart /><span>01</span><h3>Start with curiosity</h3><p>A word is an invitation to understand—not evidence for an accusation.</p></article>
        <article><BookOpen /><span>02</span><h3>Get the real meaning</h3><p>See multiple readings, a natural example, and the clues that change the tone.</p></article>
        <article><HeartHandshake /><span>03</span><h3>Open the conversation</h3><p>Use a gentle prompt that sounds like you. Then leave room for the answer.</p></article>
      </div>
    </section>

    <section className="section browse-home" id="browse">
      <div className="section-heading asymmetric"><div><p className="eyebrow">The living library</p><h2>Browse by<br /><em>what you found.</em></h2></div><Link to="/browse" className="text-link">Full directory <ArrowRight size={16} /></Link></div>
      <div className="category-pills" role="group" aria-label="Filter by category">{categories.slice(0, 7).map((item) => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div>
      <div className="term-grid">{browse.map((item) => <TermCard item={item} key={item.slug} compact />)}</div>
    </section>

    <div className="section support-wrap"><SupportResources /></div>

    <section className="privacy-callout"><div><ShieldCheck size={30} /><p className="eyebrow">Private by design</p><h2>Your curiosity is<br /><em>your business.</em></h2><p>Local decoding has no automatic history. Save something only when you choose, and delete it whenever you like. No monitoring features. Ever.</p><Link to="/privacy" className="button button-light">Read our privacy promise <ArrowRight size={17} /></Link></div><ul><li><LockKeyhole /> Searches stay in your browser</li><li><ShieldCheck /> No tracking profiles</li><li><HeartHandshake /> No surveillance tools</li></ul></section>
  </>
}
