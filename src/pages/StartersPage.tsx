import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Clipboard, Ear, HeartHandshake, LockKeyhole, Search, Sparkles } from 'lucide-react'
import { decodeMessage, searchTerms, type Term } from '../data'
import { PageIntro } from '../components/AppShell'
import { copyText, useApp } from '../store'

const groups = [
  { title: 'Understand the words', icon: Sparkles, blurb: 'Curiosity first. Being taught something can be a good feeling.', items: ['I saw a word I didn’t know—can you teach me what it means?', 'Is that something everyone says right now, or just your friends?', 'Did you mean that as a joke, or were you being serious?'] },
  { title: 'Check the context', icon: Ear, blurb: 'The same phrase changes with who said it, to whom, and why.', items: ['Who were you talking to when that came up?', 'Was that about something that happened today?', 'Does that word mean something different depending on who says it?'] },
  { title: 'Open the conversation', icon: HeartHandshake, blurb: 'These work even when you never mention the message at all.', items: ['I’m not in trouble-mode—I’m just curious about your world.', 'How are you really doing lately?', 'If something ever felt too big to handle, who would you tell first?'] },
]

export default function StartersPage() {
  const [draft, setDraft] = useState('')
  const [matched, setMatched] = useState<Term[] | null>(null)
  const { notify } = useApp()
  const find = () => {
    const direct = searchTerms(draft)
    const sentence = decodeMessage(draft)
    const seen = new Set<string>()
    setMatched([...direct, ...sentence].filter((item) => { if (seen.has(item.slug)) return false; seen.add(item.slug); return true }).slice(0, 5))
  }
  return <div className="page-shell narrow-page"><PageIntro eyebrow="Conversation starters" title="Questions that open a door."><p>Not scripts. Not interrogations. Pick the one that sounds most like you, and let the conversation wander.</p></PageIntro>
    <form className="starter-form" onSubmit={(e) => { e.preventDefault(); find() }}><label htmlFor="starter-text">Want starters for a particular word or message? <span>(optional)</span></label><textarea id="starter-text" rows={3} maxLength={600} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="e.g. that party was mid fr" /><div><button className="button" disabled={!draft.trim()}><Search size={17} /> Show related starters</button>{matched !== null && <button type="button" className="button button-outline" onClick={() => { setDraft(''); setMatched(null) }}>Clear</button>}</div><p className="privacy-line"><LockKeyhole size={14} /> Matching stays in your browser. Nothing is saved automatically.</p></form>
    {matched !== null && <section className="matched-starters"><h2>Starters for what you typed</h2>{matched.length ? matched.map((item) => <article key={item.slug}><span>{item.term}</span><p>{item.opener}</p><Link to={`/term/${item.slug}`} className="text-link">Read the full guide <ArrowRight size={15} /></Link></article>) : <div className="empty-state"><p>No exact match, but the general starters below still work. Asking what a word means to your child is often better than knowing the definition first.</p></div>}</section>}
    <div className="starter-groups">{groups.map((group) => <section key={group.title}><group.icon size={22} /><h2>{group.title}</h2><p>{group.blurb}</p><ul>{group.items.map((item) => <li key={item}><blockquote>“{item}”</blockquote><button aria-label={`Copy: ${item}`} onClick={async () => { await copyText(item); notify('Conversation starter copied') }}><Clipboard size={16} /></button></li>)}</ul></section>)}</div>
    <div className="page-next-actions"><Link className="button button-outline" to="/decoder">Decode a message</Link><Link className="text-link" to="/browse">Browse all terms <ArrowRight size={15} /></Link></div>
  </div>
}
