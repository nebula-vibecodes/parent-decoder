import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, BookOpen, Check, EyeOff, HeartHandshake, LockKeyhole, ShieldCheck } from 'lucide-react'
import { PageIntro, SupportResources } from '../components/AppShell'
import { categories, concernLabel, terms } from '../data'

function useStoredChecks(): [string[], (updater: (items: string[]) => string[]) => void] {
  const [items, setItems] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('parent-decoder-trend-checks') ?? '[]') } catch { return [] }
  })
  const update = (updater: (items: string[]) => string[]) => setItems((prev) => {
    const next = updater(prev)
    try { localStorage.setItem('parent-decoder-trend-checks', JSON.stringify(next)) } catch { /* unavailable */ }
    return next
  })
  return [items, update]
}

function InfoLayout({ eyebrow, title, lede, children }: { eyebrow: string; title: string; lede: string; children: ReactNode }) {
  return <article className="page-shell info-page"><PageIntro eyebrow={eyebrow} title={title}><p>{lede}</p></PageIntro>{children}</article>
}

export function AboutPage() {
  return <InfoLayout eyebrow="About Parent Decoder" title="Understanding the words. Protecting the relationship." lede="A calm reference for grown-ups who hear a phrase, see an emoji, or catch a joke they don’t recognise—and want to understand before they respond.">
    <section className="info-section"><h2>Our mission</h2><p>We help caregivers stay close to the people they love by making youth language legible. Not so it can be policed—so conversations can start from curiosity instead of confusion. Every guide answers three questions: what might this mean, what context should I consider, and how could I bring it up kindly?</p></section>
    <section className="info-section"><h2>What we believe</h2><div className="value-grid"><div><HeartHandshake /><h3>No panic</h3><p>A word is a starting point for conversation, never proof of anything.</p></div><div><EyeOff /><h3>No surveillance</h3><p>We do not build monitoring tools or help anyone secretly read private messages.</p></div><div><BookOpen /><h3>No judgment</h3><p>Slang is creativity. We describe language rather than assigning blame.</p></div></div></section>
    <section className="info-section"><h2>Our educational scope</h2><p>Parent Decoder covers {terms.length} terms across nine categories, from everyday slang and gaming to relationships, well-being, and safety. We explain plausible meanings and say when a term is ambiguous. This is an educational reference—not a diagnostic tool, monitoring service, or substitute for professional advice.</p></section>
    <SupportResources />
  </InfoLayout>
}

export function ApproachPage() {
  return <InfoLayout eyebrow="Our approach" title="Connection is the point. Not catching someone out." lede="The goal of understanding a word is to be able to talk. We favour open questions over accusations and listening over lectures.">
    <section className="info-section"><h2>A relationship-first read</h2><div className="principle-list">{[['01', 'Start with the moment', 'Who said it, where, and in what tone? A word cannot answer those questions alone.'], ['02', 'Hold more than one meaning', 'Humor, irony, community, and age can all change how a phrase lands.'], ['03', 'Ask instead of accuse', 'A genuine question keeps you in the conversation. Surveillance often removes you from it.'], ['04', 'Respond to real risk', 'When words come with fear, coercion, a plan, or immediate danger, act calmly and seek qualified help.']].map(([n, title, body]) => <div key={n}><span>{n}</span><section><h3>{title}</h3><p>{body}</p></section></div>)}</div></section>
    <section className="dark-quote"><blockquote>“I’m not in trouble-mode. I’m just curious about your world.”</blockquote><p>A simple opener is often more useful than a perfect definition.</p><Link to="/conversation-starters" className="button button-light">Find more starters <ArrowRight size={16} /></Link></section>
    <SupportResources />
  </InfoLayout>
}

export function PrivacyPage() {
  return <InfoLayout eyebrow="Privacy promise" title="Your curiosity is private." lede="No account is required. No monitoring. No automatic message history. The application is designed around local, intentional choices.">
    <div className="privacy-grid">{[[LockKeyhole, 'Local decoding', 'Term and whole-message matching run in your browser. Search text is not transmitted to a server by this app.'], [ShieldCheck, 'Intentional saving', 'Only messages and terms you explicitly save are kept. They remain in this browser and can be deleted at any time.'], [EyeOff, 'No surveillance', 'There are no tracking profiles, child-monitoring features, or hidden message histories.']].map(([Icon, title, body]) => { const I = Icon as typeof LockKeyhole; return <div key={title as string}><I /><h2>{title as string}</h2><p>{body as string}</p></div> })}</div>
    <section className="info-section"><h2>What browser-local saving means</h2><p>Saved items use your browser’s local storage. They stay on this browser and device, do not sync across devices, and disappear if you clear site data. Anyone with access to the same browser profile may be able to see them. You can clear saved terms and messages separately on the Saved page.</p></section>
    <section className="info-section"><h2>Links, forms, and external content</h2><p>Text included in a shared URL may appear in browser history. Suggestion and feedback forms in this version create copy-only drafts and do not transmit submissions. Fonts are loaded from Google Fonts, which receives a standard web request when the page loads. No optional AI submission feature is included in this version.</p></section>
    <div className="info-actions"><Link to="/saved" className="button">Manage saved items</Link><Link to="/decoder" className="button button-outline">Open local decoder</Link></div>
  </InfoLayout>
}

export function PolicyPage() {
  return <InfoLayout eyebrow="Editorial policy" title="How we write about language." lede="Slang is alive. Our job is to describe how a word is actually used—honestly, without exaggeration—and to be clear about what we don’t know.">
    <div className="local-notice"><BookOpen size={19} /><p><strong>Educational disclaimer:</strong> every interpretation is context-dependent. Nothing here is a diagnosis, verdict, or substitute for a direct, empathetic conversation.</p></div>
    <section className="info-section"><h2>Our standards</h2><ul className="check-list"><li><Check /> Plain language first, followed by nuance.</li><li><Check /> Multiple readings where they exist—literal, playful, ironic, or pointed.</li><li><Check /> Calm context levels instead of fear-based warning labels.</li><li><Check /> Non-graphic examples that sound like real messages.</li><li><Check /> Conversation guidance without monitoring or surveillance tips.</li></ul></section>
    <section className="info-section"><h2>How a guide is built</h2><ol className="numbered-list"><li><span>1</span><p>Gather real usage across platforms, age groups, and sentence contexts.</p></li><li><span>2</span><p>Trace origins and credit communities where a term came from.</p></li><li><span>3</span><p>Draft meanings, context clues, and a gentle conversation opener.</p></li><li><span>4</span><p>Review for accuracy, nuance, fairness, and non-alarmist language.</p></li></ol></section>
    <section className="info-section"><h2>Community feedback</h2><p>Readers can suggest terms and flag entries that feel out of date. This frontend version creates copy-only drafts; nothing is published automatically, and no submission is claimed to have been received.</p><div className="info-actions"><Link to="/suggest" className="button">Suggest a term</Link><Link to="/feedback" className="button button-outline">Share feedback</Link></div></section>
    <SupportResources />
  </InfoLayout>
}

const FAST_MOVING = ['Emojis & Symbols', 'Abbreviations', 'Substances & Party Culture', 'Sensitive Safety Topics', 'Social Media Culture']

export function ReviewStatusPage() {
  const counts = categories.slice(1).map((category) => ({ category, count: terms.filter((item) => item.category === category).length }))
  const latest = terms.reduce((acc, item) => (item.lastVerified ?? item.reviewed) > acc ? (item.lastVerified ?? item.reviewed) : acc, '')
  const stale = terms.filter((item) => (item.lastVerified ?? item.reviewed) < latest).sort((a, b) => (a.lastVerified ?? a.reviewed).localeCompare(b.lastVerified ?? b.reviewed))
  const [checks, setChecks] = useStoredChecks()
  return <InfoLayout eyebrow="Review status" title="A transparent look at the library." lede="These counts describe the current bundled guide set. They are mechanical coverage statistics, not claims of independent expert verification.">
    <div className="review-stats"><div><strong>{terms.length}</strong><span>Published guides</span></div><div><strong>{categories.length - 1}</strong><span>Categories</span></div><div><strong>100%</strong><span>With context guidance</span></div></div>
    <section className="info-section"><h2>Coverage by category</h2><div className="coverage-list">{counts.map(({ category, count }) => <div key={category}><span>{category}</span><div><i style={{ width: `${count / Math.max(...counts.map((c) => c.count)) * 100}%` }} /></div><strong>{count}</strong></div>)}</div></section>
    <section className="info-section"><h2>Context-level mix</h2><div className="context-mix">{Object.entries(concernLabel).map(([key, label]) => <div key={key}><span>{label}</span><strong>{terms.filter((item) => item.concern === key).length}</strong></div>)}</div></section>
    <section className="info-section"><h2>Needs re-verification ({stale.length})</h2><p>Entries last verified before the current review round ({latest}). Editors re-check these first, starting with fast-moving categories.</p><div className="stale-list">{stale.slice(0, 24).map((item) => <Link key={item.slug} to={`/term/${item.slug}`}><span>{item.term}</span><span>{item.category}</span><span>{item.lastVerified ?? item.reviewed}</span></Link>)}{stale.length > 24 && <span className="stale-more">+ {stale.length - 24} more</span>}</div></section>
    <section className="info-section"><h2>Trend-watch checklist</h2><p>Fast-moving categories re-audited every quarter. Check items off as the next review progresses — progress is stored in this browser only.</p><div className="trend-checks">{FAST_MOVING.map((category) => <label key={category} className={checks.includes(category) ? 'trend-check done' : 'trend-check'}><input type="checkbox" checked={checks.includes(category)} onChange={() => setChecks((items) => items.includes(category) ? items.filter((item) => item !== category) : [...items, category])} /><span>{category}</span><span className="trend-count">{counts.find((c) => c.category === category)?.count ?? 0} guides</span></label>)}</div></section>
    <div className="local-notice"><ShieldCheck size={19} /><p>Review labels describe editorial scope and context—not a safety diagnosis. Community corrections remain copy-only until a real submission service is connected.</p></div>
  </InfoLayout>
}
