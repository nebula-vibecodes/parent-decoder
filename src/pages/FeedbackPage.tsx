import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Check, Clipboard, RotateCcw } from 'lucide-react'
import { PageIntro } from '../components/AppShell'
import { copyText, useApp } from '../store'

export default function FeedbackPage() {
  const [params] = useSearchParams()
  const [report, setReport] = useState('')
  const { notify } = useApp()
  const [flags] = useState<Array<{ slug: string; term: string; at: number }>>(() => {
    try { return JSON.parse(localStorage.getItem('parent-decoder-reports') ?? '[]') } catch { return [] }
  })
  const copyFlags = async () => {
    const text = flags.map((flag) => `• ${flag.term} (/term/${flag.slug}) — flagged ${new Date(flag.at).toLocaleDateString()}`).join('\n')
    await copyText(`MEANING-SHIFT FLAGS (${flags.length})\n\n${text}`)
    notify('Flagged terms copied')
  }
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const data = new FormData(e.currentTarget)
    setReport(`GUIDE FEEDBACK\n\nTerm: ${data.get('term') || 'General feedback'}\nIssue: ${data.get('issue')}\nDetails: ${data.get('details')}`)
  }
  if (report) return <div className="page-shell narrow-page"><div className="success-state"><span><Check size={28} /></span><p className="eyebrow">Report drafted</p><h1>Your feedback is ready to share.</h1><p>No message was sent. This frontend demo has no configured inbox; copy the report for an editorial channel you trust.</p><pre>{report}</pre><div><button className="button" onClick={async () => { await copyText(report); notify('Feedback copied') }}><Clipboard size={17} /> Copy report</button><button className="button button-outline" onClick={() => setReport('')}><RotateCcw size={16} /> Edit feedback</button></div></div></div>
  return <div className="page-shell narrow-page"><PageIntro eyebrow="Keep the guide honest" title="What should we revisit?"><p>Slang moves quickly. Tell us what feels outdated, incomplete, or inaccurate—without including private messages or identifying details.</p></PageIntro>{flags.length > 0 && <section className="flagged-panel"><p className="mono-label">You’ve flagged {flags.length} {flags.length === 1 ? 'term' : 'terms'} as shifting</p>{flags.map((flag) => <Link key={flag.slug} to={`/term/${flag.slug}`}>{flag.term}<span>{new Date(flag.at).toLocaleDateString()}</span></Link>)}<button className="button button-outline" onClick={copyFlags}><Clipboard size={15} /> Copy flag list</button></section>}<form className="stack-form" onSubmit={submit}><label>Term or guide <span>(optional)</span><input name="term" defaultValue={params.get('term') ?? ''} placeholder="e.g. no cap" /></label><label>What kind of issue?<select name="issue" required defaultValue=""><option value="" disabled>Select one</option><option>Meaning seems inaccurate</option><option>Context is missing</option><option>Usage seems outdated</option><option>Tone could be improved</option><option>Something else</option></select></label><label>What should we know?<textarea name="details" required minLength={10} maxLength={800} rows={6} placeholder="Share the meaning, platform, age group, or context we may be missing." /></label><button className="button">Create feedback report</button><p className="field-help">This creates a copy-only report. Nothing is transmitted.</p></form></div>
}
