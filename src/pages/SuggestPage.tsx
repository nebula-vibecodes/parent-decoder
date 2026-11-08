import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, Clipboard, LockKeyhole, RotateCcw } from 'lucide-react'
import { PageIntro } from '../components/AppShell'
import { copyText, useApp } from '../store'

export default function SuggestPage() {
  const [draft, setDraft] = useState('')
  const { notify } = useApp()
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const text = `TERM SUGGESTION\n\nTerm: ${data.get('term')}\nWhere encountered: ${data.get('source')}\nPossible meaning: ${data.get('meaning')}\nContext: ${data.get('context') || 'Not provided'}`
    try {
      const stored = JSON.parse(localStorage.getItem('parent-decoder-suggestions') ?? '[]') as string[]
      localStorage.setItem('parent-decoder-suggestions', JSON.stringify([text, ...stored].slice(0, 30)))
    } catch { /* storage unavailable */ }
    setDraft(text)
  }
  if (draft) return <div className="page-shell narrow-page"><div className="success-state"><span><Check size={28} /></span><p className="eyebrow">Draft ready</p><h1>Thanks for adding the context.</h1><p>This demo has no submission server, so nothing was transmitted. Your suggestion is stored locally, formatted below, and ready to copy to an editorial channel.</p><pre>{draft}</pre><div><button className="button" onClick={async () => { await copyText(draft); notify('Suggestion copied') }}><Clipboard size={17} /> Copy suggestion</button><button className="button button-outline" onClick={() => setDraft('')}><RotateCcw size={16} /> Write another</button></div></div></div>
  return <div className="page-shell narrow-page"><PageIntro eyebrow="Community dictionary" title="Help us keep up with language."><p>Heard something new or seen a familiar word used differently? Share the context, not anyone’s private identity.</p></PageIntro>
    <div className="local-notice"><LockKeyhole size={18} /><p><strong>Demo note:</strong> this form creates a copy-ready draft and keeps a local copy in this browser. It does not transmit anything.</p></div>
    <form className="stack-form" onSubmit={submit}><label>Term, phrase, or emoji<input name="term" required maxLength={80} placeholder="What should we add?" /></label><label>Where did you encounter it?<select name="source" required defaultValue=""><option value="" disabled>Choose a source</option><option>Text or group chat</option><option>Social media</option><option>Gaming or streaming</option><option>In person</option><option>Somewhere else</option></select></label><label>What do you think it means?<textarea name="meaning" required minLength={10} maxLength={500} rows={4} placeholder="Your best understanding, even if you’re unsure" /></label><label>Anything that changes the meaning? <span>(optional)</span><textarea name="context" maxLength={600} rows={3} placeholder="Tone, platform, age group, or an anonymous example" /></label><label className="checkbox-label"><input type="checkbox" required /><span>I’ve left out names, handles, contact details, and other private information.</span></label><button className="button" type="submit">Create suggestion draft <ArrowRight size={17} /></button></form>
  </div>
}
