import { Link, useParams } from 'react-router'
import { ArrowRight, Bookmark, Check, ChevronRight, Clipboard, Flag, HeartHandshake, Info, MessageCircleQuestion, PhoneCall, ShieldCheck } from 'lucide-react'
import { ConcernChip, SupportResources, TermCard } from '../components/AppShell'
import { copyText, useApp } from '../store'
import { confidenceLabel, findTerm, terms } from '../data'

function CrisisStrip() {
  const { notify } = useApp()
  return <aside className="crisis-strip" aria-label="Support resources">
    <div><PhoneCall size={20} /><div><h2>If this word has you worried right now</h2><p>Trust that instinct over any definition. If someone may be in immediate danger, contact local emergency services. In the US, call or text <strong>988</strong> for the Suicide &amp; Crisis Lifeline; elsewhere, <strong>findahelpline.com</strong> lists free, confidential local services.</p></div></div>
    <button className="button button-outline" onClick={async () => { await copyText('988 (US call/text) · findahelpline.com (international)'); notify('Support contacts copied') }}><Clipboard size={15} /> Copy support contacts</button>
  </aside>
}

function ReportShiftButton({ slug, term }: { slug: string; term: string }) {
  const { notify } = useApp()
  return <button className="text-link report-shift" onClick={() => {
    try {
      const stored = JSON.parse(localStorage.getItem('parent-decoder-reports') ?? '[]') as Array<{ slug: string; term: string; at: number }>
      if (!stored.some((entry) => entry.slug === slug)) {
        localStorage.setItem('parent-decoder-reports', JSON.stringify([...stored, { slug, term, at: Date.now() }]))
      }
    } catch { /* storage unavailable */ }
    notify('Flagged for the next editorial review')
  }}><Flag size={14} /> This meaning seems to have shifted</button>
}

export default function TermPage() {
  const { slug } = useParams()
  const item = findTerm(slug)
  const { savedTerms, toggleTerm, notify } = useApp()
  if (!item) return <div className="not-found"><MessageCircleQuestion size={36} /><p className="eyebrow">Term not found</p><h1>That one isn’t in our guide yet.</h1><p>Try another spelling, browse the library, or suggest the term for review.</p><div><Link className="button" to="/browse">Browse all terms</Link><Link className="button button-outline" to="/suggest">Suggest this term</Link></div></div>
  const saved = savedTerms.includes(item.slug)
  const related = terms.filter((term) => term.category === item.category && term.slug !== item.slug).slice(0, 3)
  return <article className="term-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight /><Link to="/browse">Library</Link><ChevronRight /><span>{item.term}</span></nav>
    <header className="term-hero"><div><div className="term-hero-tags"><span className="category-tag">{item.category}</span><ConcernChip concern={item.concern} /></div><h1 className={item.category === 'Emojis & Symbols' ? 'emoji-term' : ''}>{item.term}</h1><p>{item.plainMeaning}</p><span className="aliases">Also seen as: {item.aliases.length ? item.aliases.join(', ') : 'no common aliases listed'}</span></div><div className="term-actions"><button className={saved ? 'button saved-button' : 'button button-outline'} onClick={() => toggleTerm(item.slug)}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved' : 'Save guide'}</button><button className="icon-button" aria-label="Copy link to this guide" onClick={async () => { await copyText(window.location.href); notify('Guide link copied') }}><Clipboard size={18} /></button></div></header>
    <section className="quick-answers" aria-label="Quick answers"><div><span>01</span><h2>What it means</h2><p>{item.summary}</p></div><div><span>02</span><h2>What changes it</h2><p>{item.contextClues}</p></div><div><span>03</span><h2>How to respond</h2><p>{item.opener}</p></div></section>
    <p className="confidence-line"><ShieldCheck size={14} /> {confidenceLabel[item.confidence ?? 'documented']} · Verified {item.lastVerified ?? item.reviewed}</p>
    {item.concern === 'attention' && <CrisisStrip />}
    <div className="context-banner"><Info size={20} /><p><strong>A starting point, not a verdict.</strong> Tone, age, platform, community, and relationship all shape what a phrase means in the moment.</p></div>
    <div className="term-content-layout"><div className="term-content">
      <section className="content-section"><p className="eyebrow">Meaning & nuance</p><h2>Possible interpretations</h2><div className="meaning-list">{item.interpretations.map((meaning, index) => <div key={meaning}><span>{index + 1}</span><p>{meaning}</p></div>)}</div></section>
      <section className="content-section"><p className="eyebrow">In conversation</p><h2>How it might sound</h2><div className="example-message"><span className="mono-label">Example message</span><blockquote>“{item.example}”</blockquote><p>A realistic example for context—not a universal translation.</p></div></section>
      {item.origin ? <section className="content-section"><p className="eyebrow">Where it comes from</p><h2>A little language history</h2><p className="body-large">{item.origin}</p></section> : null}
      <section className="content-section"><p className="eyebrow">Read the room</p><h2>Context clues that matter</h2><p className="body-large">{item.contextClues}</p><div className="clue-grid"><div><h3>Tone & punctuation</h3><p>Playful exaggeration, emoji, and punctuation can turn the same word into a joke, a compliment, or a criticism.</p></div><div><h3>Place & relationship</h3><p>A private joke between friends can land very differently when posted publicly or aimed at a stranger.</p></div></div></section>
      <section className="content-section"><p className="eyebrow">Pause before reacting</p><h2>What not to assume</h2><p className="body-large">A single slang term is not proof of malice, secret behavior, or wrongdoing. Start with the surrounding conversation and the person’s tone. If something still concerns you, ask directly and calmly rather than building a conclusion from one phrase.</p></section>
      <section className="conversation-card"><HeartHandshake size={28} /><p className="eyebrow">Connection first</p><h2>A gentle way to bring it up</h2><blockquote>“{item.opener}”</blockquote><button className="button button-light" onClick={async () => { await copyText(item.opener); notify('Conversation starter copied') }}><Clipboard size={16} /> Copy this starter</button><ul><li><Check /> Ask with genuine curiosity, then leave room to listen.</li><li><Check /> Talk about impact and boundaries, not policing vocabulary.</li><li><Check /> Avoid accusations based on a single word or message.</li></ul></section>
    </div><aside className="term-aside"><div><ShieldCheck size={23} /><h2>A calm read</h2><p>{item.concern === 'harmless' ? 'This is generally everyday wordplay or emphasis.' : item.concern === 'discuss' ? 'Context can change how this lands, so a light conversation may help.' : 'A direct but calm check-in can clarify whether anyone feels unsafe or pressured.'}</p><ConcernChip concern={item.concern} /></div><div><h2>Keep exploring</h2>{related.map((term) => <Link to={`/term/${term.slug}`} key={term.slug}>{term.term}<ArrowRight size={15} /></Link>)}</div><Link className="text-link" to={`/feedback?term=${item.slug}`}>Suggest a correction <ArrowRight size={15} /></Link><ReportShiftButton slug={item.slug} term={item.term} /></aside></div>
    <section className="related-section"><div className="section-heading asymmetric"><div><p className="eyebrow">Related guides</p><h2>Keep the context going.</h2></div><Link to="/browse" className="text-link">Browse all terms <ArrowRight size={16} /></Link></div><div className="term-grid">{related.map((term) => <TermCard key={term.slug} item={term} compact />)}</div></section>
    <SupportResources />
  </article>
}
