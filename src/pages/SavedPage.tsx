import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, Bookmark, LockKeyhole, MessageSquareText, Trash2 } from 'lucide-react'
import { findTerm } from '../data'
import { PageIntro, TermCard } from '../components/AppShell'
import { useApp } from '../store'

export default function SavedPage() {
  const { savedTerms, savedMessages, removeMessage, clearMessages, clearTerms } = useApp()
  const [tab, setTab] = useState<'terms' | 'messages'>('terms')
  const [confirm, setConfirm] = useState(false)
  const navigate = useNavigate()
  const count = tab === 'terms' ? savedTerms.length : savedMessages.length
  return <div className="page-shell saved-page"><PageIntro eyebrow="Your private collection" title="Kept only where you left them."><p>Saved terms and messages live in this browser on this device. They do not sync, and clearing browser data removes them.</p></PageIntro>
    <div className="saved-tabs" role="tablist"><button role="tab" aria-selected={tab === 'terms'} onClick={() => { setTab('terms'); setConfirm(false) }}><Bookmark size={17} /> Terms <span>{savedTerms.length}</span></button><button role="tab" aria-selected={tab === 'messages'} onClick={() => { setTab('messages'); setConfirm(false) }}><MessageSquareText size={17} /> Messages <span>{savedMessages.length}</span></button></div>
    {count > 0 ? <><div className="saved-list">{tab === 'terms' ? <div className="term-grid">{savedTerms.map((slug) => { const item = findTerm(slug); return item ? <TermCard key={slug} item={item} /> : null })}</div> : savedMessages.map((item) => <article className="saved-message" key={item.id}><button onClick={() => navigate(`/decoder?q=${encodeURIComponent(item.text)}`)}><span>{item.text}</span><small>Saved {new Date(item.savedAt).toLocaleDateString()}</small></button><button className="icon-button" aria-label={`Delete saved message: ${item.text}`} onClick={() => removeMessage(item.id)}><Trash2 size={18} /></button></article>)}</div><div className="clear-row">{confirm ? <><span>Clear all saved {tab}?</span><button className="button button-small" onClick={() => { if (tab === 'terms') clearTerms(); else clearMessages(); setConfirm(false) }}>Yes, clear</button><button className="button button-small button-outline" onClick={() => setConfirm(false)}>Keep them</button></> : <button className="button button-ghost" onClick={() => setConfirm(true)}><Trash2 size={16} /> Clear saved {tab}</button>}</div></> : <div className="empty-state"><Bookmark size={30} /><h2>Nothing saved here yet.</h2><p>{tab === 'terms' ? 'Use the bookmark on any term guide to keep it close.' : 'Choose “Save locally” after decoding a message. Nothing is saved automatically.'}</p><Link className="button" to={tab === 'terms' ? '/browse' : '/decoder'}>{tab === 'terms' ? 'Explore the library' : 'Open the decoder'} <ArrowRight size={16} /></Link></div>}
    <p className="privacy-line saved-privacy"><LockKeyhole size={14} /> Browser-local only. No account, cloud copy, or cross-device sync.</p>
  </div>
}
