import { Printer } from 'lucide-react'
import { PageIntro } from '../components/AppShell'
import { concernLabel, terms } from '../data'

export default function PrintPage() {
  const attention = terms.filter((item) => item.concern === 'attention')
  return <div className="page-shell print-page">
    <div className="print-toolbar no-print"><PageIntro eyebrow="Fridge sheet" title="The attention list, on one page."><p>A compact reference of every “may need attention” term — plain meaning and first response, formatted to print.</p></PageIntro><button className="button" onClick={() => window.print()}><Printer size={17} /> Print or save as PDF</button></div>
    <div className="print-sheet">
      <header className="print-sheet-head"><h1>Parent Decoder — {concernLabel.attention}</h1><p>{attention.length} terms · Verify date matters more than any single word. When in doubt, ask calmly.</p></header>
      <div className="print-grid">{attention.map((item) => <div key={item.slug} className="print-item"><strong>{item.term}</strong><span>{item.category}</span><p>{item.plainMeaning}</p><em>Try: {item.opener}</em></div>)}</div>
      <footer className="print-sheet-foot"><p>If someone may be in immediate danger, contact local emergency services. US: call or text 988. International: findahelpline.com</p><p>© 2026 Parent Decoder · parentdecoder.app</p></footer>
    </div>
  </div>
}
