import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ArrowRight, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react'
import { categories, concernLabel, searchTerms, terms } from '../data'
import { PageIntro, TermCard } from '../components/AppShell'

const reviewRank = (item: (typeof terms)[number]) => item.reviewed === 'November 2026' ? 0 : item.reviewed === 'September 2026' ? 1 : item.reviewed === 'August 2026' ? 2 : 3
const normalizeLookup = (value: string) => value.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function BrowsePage() {
  const [params, setParams] = useSearchParams()
  const [visible, setVisible] = useState(12)
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? 'All terms'
  const concern = params.get('concern') ?? 'all'
  const letter = params.get('letter') ?? 'all'
  const sort = params.get('sort') ?? 'recent'
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'all' || value === 'All terms' || !value) next.delete(key); else next.set(key, value)
    setParams(next); setVisible(12)
  }
  const letterOf = (item: (typeof terms)[number]) => {
    const first = item.slug.charAt(0).toUpperCase()
    return /^[A-Z]$/.test(first) ? first : '#'
  }
  const letters = useMemo(() => {
    const set = new Set(terms.map(letterOf))
    return [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].filter((l) => set.has(l))
  }, [])
  const hasEmoji = useMemo(() => terms.some((item) => letterOf(item) === '#'), [])
  const filtered = useMemo(() => {
    const result = searchTerms(q).filter((item) => (category === 'All terms' || item.category === category) && (concern === 'all' || item.concern === concern) && (letter === 'all' || letterOf(item) === letter))
    return [...result].sort((a, b) => sort === 'az'
      ? a.term.localeCompare(b.term) || a.slug.localeCompare(b.slug)
      : sort === 'category'
        ? a.category.localeCompare(b.category) || a.term.localeCompare(b.term)
        : sort === 'concern'
          ? b.concern.localeCompare(a.concern) || a.term.localeCompare(b.term)
          : reviewRank(a) - reviewRank(b) || a.slug.localeCompare(b.slug))
  }, [q, category, concern, letter, sort])
  const closeMatches = useMemo(() => {
    const needle = normalizeLookup(q).slice(0, 3)
    if (!q.trim() || needle.length < 2 || filtered.length) return []
    return terms.filter((item) => item.slug.startsWith(needle) || item.aliases.some((alias) => normalizeLookup(alias).startsWith(needle))).slice(0, 6)
  }, [filtered.length, q])
  const active = category !== 'All terms' || concern !== 'all' || letter !== 'all' || q
  const reset = () => { setParams({}); setVisible(12) }
  return <div className="browse-page">
    <div className="browse-heading"><PageIntro eyebrow="The living library" title="Every word has a little more to it."><p>Browse plain-English guides with possible meanings, real-world context, and a constructive way to respond.</p></PageIntro><div className="library-stat"><strong>{terms.length}</strong><span>carefully written<br />term guides</span></div></div>
    <section className="browse-controls" aria-label="Filter the term library">
      <div className="browse-search"><Search size={19} /><input value={q} onChange={(e) => update('q', e.target.value)} placeholder="Search terms, aliases, or meanings" aria-label="Search terms" />{q && <button onClick={() => update('q', '')} aria-label="Clear search"><X size={17} /></button>}</div>
      <div className="select-row"><label><span className="sr-only">Category</span><select value={category} onChange={(e) => update('category', e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label><span className="sr-only">Concern level</span><select value={concern} onChange={(e) => update('concern', e.target.value)}><option value="all">All context levels</option>{Object.entries(concernLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label><span className="sr-only">Sort terms</span><select value={sort} onChange={(e) => update('sort', e.target.value)}><option value="recent">Recently reviewed</option><option value="az">A–Z</option><option value="category">By category</option><option value="concern">By context level</option></select></label></div>
      <div className="letter-filter"><span>A–Z</span>{['all', ...letters, ...(hasEmoji ? ['#'] : [])].map((item) => <button key={item} onClick={() => update('letter', item)} aria-pressed={letter === item}>{item === 'all' ? 'Any' : item === '#' ? 'Emoji' : item}</button>)}</div>
    </section>
    <div className="results-bar"><p><strong>{filtered.length}</strong> {filtered.length === 1 ? 'guide' : 'guides'}{active && ' matching your filters'}</p>{active && <button onClick={reset}><RotateCcw size={14} /> Reset filters</button>}</div>
    {filtered.length ? <><div className="term-grid browse-grid">{filtered.slice(0, visible).map((item) => <TermCard key={item.slug} item={item} />)}</div>{visible < filtered.length && <div className="load-more"><button className="button button-outline" onClick={() => setVisible((n) => n + 12)}>Show 12 more <ArrowRight size={16} /></button></div>}</> : closeMatches.length ? <div className="empty-state"><SlidersHorizontal size={28} /><h2>No exact match in the current filters.</h2><p>These entries start similarly across the full library:</p><div className="term-grid browse-grid">{closeMatches.map((item) => <TermCard key={item.slug} item={item} compact />)}</div><button className="button" onClick={reset}>Clear all filters</button></div> : <div className="empty-state"><SlidersHorizontal size={28} /><h2>No terms match that combination.</h2><p>Try fewer filters, a shorter search, or suggest a term we should add.</p><button className="button" onClick={reset}>Clear all filters</button></div>}
  </div>
}
