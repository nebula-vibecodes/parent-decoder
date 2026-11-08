import { useState } from 'react'
import { ArrowRight, Check, Clock3, Eye, LockKeyhole, RotateCcw } from 'lucide-react'
import { PageIntro } from '../components/AppShell'

const samples = [
  { id: 1, term: 'brainrot', source: 'Social media', hypothesis: 'Content so repetitive or absurd that it feels mentally consuming.', status: 'Needs review' },
  { id: 2, term: 'locked in', source: 'Gaming', hypothesis: 'Fully focused on a task or performance.', status: 'Researching' },
  { id: 3, term: 'aura', source: 'Group chat', hypothesis: 'An impression of confidence, style, or social credibility.', status: 'Needs review' },
]

export default function EditorialPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [items, setItems] = useState(samples)
  const advance = (id: number) => setItems((all) => all.map((item) => item.id === id ? { ...item, status: item.status === 'Needs review' ? 'Researching' : item.status === 'Researching' ? 'Approved sample' : 'Needs review' } : item))
  return <div className="page-shell editorial-page"><PageIntro eyebrow="Editorial portal" title="A careful path from suggestion to guide."><p>This is an interactive workflow demo with sample data. It has no real authentication, persistent queue, or publishing capability.</p></PageIntro>
    {!unlocked ? <div className="editorial-gate"><LockKeyhole size={28} /><h2>Explore the sample workflow</h2><p>Use the visible demo key below. This is not a security control.</p><form onSubmit={(e) => { e.preventDefault(); if (key === 'demo') { setUnlocked(true); setError('') } else setError('That key did not match. Use “demo”.') }}><label htmlFor="demo-key">Demo key</label><div><input id="demo-key" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Type demo" /><button className="button">Open demo <ArrowRight size={16} /></button></div>{error && <p className="form-error" role="alert">{error}</p>}</form><button className="demo-key" onClick={() => setKey('demo')}>Use demo key: <strong>demo</strong></button></div> : <section className="editorial-workspace"><div className="demo-toolbar"><span><Eye size={16} /> Sample queue · changes reset on reload</span><button onClick={() => { setItems(samples); setUnlocked(false); setKey('') }}><RotateCcw size={15} /> Exit & reset</button></div><div className="queue-grid">{items.map((item) => <article key={item.id}><div className="queue-status"><span>{item.status}</span><Clock3 size={16} /></div><h2>{item.term}</h2><p>{item.hypothesis}</p><dl><div><dt>Source</dt><dd>{item.source}</dd></div><div><dt>Record</dt><dd>Sample only</dd></div></dl><button className="button button-outline" onClick={() => advance(item.id)}>{item.status === 'Approved sample' ? 'Restart sample' : 'Advance status'} {item.status !== 'Approved sample' && <ArrowRight size={15} />}</button></article>)}</div><div className="local-notice"><Check size={18} /><p>Status changes demonstrate the intended editorial sequence only. They are neither stored nor published.</p></div></section>}
  </div>
}
