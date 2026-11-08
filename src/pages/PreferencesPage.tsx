import { useState, type FormEvent } from 'react'
import { ArrowRight, RotateCcw, Users } from 'lucide-react'
import { PageIntro } from '../components/AppShell'
import { categories } from '../data'
import { useApp, type AgeBand } from '../store'

const ageBands: Array<{ value: AgeBand; label: string; hint: string }> = [
  { value: 'under-13', label: 'Under 13', hint: 'Early slang, games, and YouTube-era brainrot' },
  { value: '13-15', label: '13–15', hint: 'Group chats, TikTok, first social circles' },
  { value: '16-18', label: '16–18', hint: 'Dating slang, party culture, independence' },
  { value: 'adult', label: 'Adult / other', hint: 'Workplace, gaming, or general curiosity' },
]

export default function PreferencesPage() {
  const { prefs, setPrefs } = useApp()
  const [ageBand, setAgeBand] = useState<AgeBand>(prefs.ageBand)
  const [topics, setTopics] = useState<string[]>(prefs.topics)
  const toggle = (topic: string) => setTopics((items) => items.includes(topic) ? items.filter((item) => item !== topic) : [...items, topic])
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPrefs({ ageBand, topics })
  }
  return <div className="page-shell narrow-page">
    <PageIntro eyebrow="Make it yours" title="Tune the guide to your family."><p>Optional and stored only in this browser. Your answers surface new terms and guides in the topics you care about most.</p></PageIntro>
    <form className="stack-form" onSubmit={submit}>
      <fieldset><legend><Users size={16} /> Whose language are you decoding?</legend>
        <div className="radio-cards">{ageBands.map((band) => <label key={band.value} className={ageBand === band.value ? 'radio-card selected' : 'radio-card'}><input type="radio" name="age" value={band.value} checked={ageBand === band.value} onChange={() => setAgeBand(band.value)} /><strong>{band.label}</strong><span>{band.hint}</span></label>)}</div>
      </fieldset>
      <fieldset><legend>Which topics deserve extra attention?</legend>
        <div className="topic-checks">{categories.slice(1).map((topic) => <label key={topic} className={topics.includes(topic) ? 'topic-check selected' : 'topic-check'}><input type="checkbox" checked={topics.includes(topic)} onChange={() => toggle(topic)} />{topic}</label>)}</div>
      </fieldset>
      <div className="form-actions-row"><button className="button" type="submit">Save preferences <ArrowRight size={16} /></button>{(prefs.ageBand || prefs.topics.length) ? <button className="button button-ghost" type="button" onClick={() => { setAgeBand(''); setTopics([]); setPrefs({ ageBand: '', topics: [] }) }}><RotateCcw size={15} /> Reset</button> : null}</div>
      <p className="field-help">Saved locally. Nothing about your family leaves this device.</p>
    </form>
  </div>
}
