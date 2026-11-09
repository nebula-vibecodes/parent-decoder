import { expansionTerms } from './termsExpansion'

export type Concern = 'harmless' | 'discuss' | 'attention'
export type Category =
  | 'General slang'
  | 'Abbreviations'
  | 'Emojis & Symbols'
  | 'Gaming & Streaming'
  | 'Social Media Culture'
  | 'Relationships & Dating'
  | 'Substances & Party Culture'
  | 'Mental Well-being'
  | 'Sensitive Safety Topics'

export type Term = {
  term: string
  slug: string
  aliases: string[]
  plainMeaning: string
  summary: string
  interpretations: string[]
  example: string
  contextClues: string
  opener: string
  category: Category
  concern: Concern
  reviewed: string
  origin?: string
  confidence?: 'documented' | 'emerging' | 'reported'
  lastVerified?: string
}

export const confidenceLabel: Record<NonNullable<Term['confidence']>, string> = {
  documented: 'Widely documented',
  emerging: 'Emerging usage',
  reported: 'Community-reported',
}

import { terms1 } from './data/terms1';
import { terms2 } from './data/terms2';
import { terms3 } from './data/terms3';
import { terms4 } from './data/terms4';
import { terms5 } from './data/terms5';
import { terms6 } from './data/terms6';
import { terms7 } from './data/terms7';

export const terms: Term[] = [
  ...terms1,
  ...terms2,
  ...terms3,
  ...terms4,
  ...terms5,
  ...terms6,
  ...terms7
];

terms.push(...expansionTerms)

export const categories: Array<'All terms' | Category> = [
  'All terms',
  'General slang',
  'Abbreviations',
  'Emojis & Symbols',
  'Gaming & Streaming',
  'Social Media Culture',
  'Relationships & Dating',
  'Substances & Party Culture',
  'Mental Well-being',
  'Sensitive Safety Topics',
]

export const concernLabel: Record<Concern, string> = {
  harmless: 'Usually harmless',
  discuss: 'Worth discussing',
  attention: 'May need attention',
}

export const findTerm = (slug?: string) => terms.find((item) => item.slug === slug)

export function searchTerms(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return terms
  return terms.filter((item) =>
    [item.term, ...item.aliases, item.plainMeaning, item.summary, item.category]
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
}

export function decodeMessage(message: string) {
  const text = message.toLowerCase()
  return terms
    .filter((item) => [item.term, ...item.aliases].some((alias) => {
      const a = alias.toLowerCase()
      if (!a) return false
      if (/[^a-z0-9\s]/i.test(a) && !/[a-z0-9]/i.test(a)) return text.includes(a)
      return new RegExp(`(^|[^a-z0-9])${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i').test(text)
    }))
    .sort((a, b) => text.indexOf(a.term.toLowerCase()) - text.indexOf(b.term.toLowerCase()))
}

/* Fuzzy matching: tolerates typos, leetspeak, repeated letters, and spaced-letter input. */
const fuzzyNormalize = (value: string) => value
  .toLowerCase()
  .replace(/@/g, 'a').replace(/4/g, 'a').replace(/8/g, 'b').replace(/6/g, 'g').replace(/9/g, 'g')
  .replace(/3/g, 'e').replace(/1/g, 'i').replace(/0/g, 'o').replace(/5/g, 's').replace(/7/g, 't')
  .replace(/(.)\1+/g, '$1')
  .replace(/[^a-z0-9]/g, '')

function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const row = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      rowMin = Math.min(rowMin, row[j])
    }
    if (rowMin > max) return max + 1
    prev = row
  }
  return prev[b.length]
}

function fuzzyScore(input: string, candidate: string): number {
  if (!input || !candidate) return 0
  if (input === candidate) return 1
  if (candidate.startsWith(input) && input.length >= 4 && input.length / candidate.length >= 0.5) return 0.9
  if (input.startsWith(candidate) && candidate.length >= 3 && candidate.length / input.length >= 0.6) return 0.85
  const maxDist = candidate.length <= 4 ? 1 : candidate.length <= 7 ? 2 : 3
  const d = editDistance(input, candidate, maxDist)
  if (d > maxDist) return 0
  return 1 - d / (candidate.length + 1)
}

export type FuzzyMatch = { term: Term; matched: string; score: number }

const fuzzyIndex: Array<{ term: Term; key: string; display: string }> = terms.flatMap((item) =>
  [item.term, ...item.aliases]
    .filter((alias) => /^[\p{Extended_Pictographic}\s]+$/u.test(alias) === false)
    .map((alias) => ({ term: item, key: fuzzyNormalize(alias), display: alias })),
)

export function fuzzyFindTerm(query: string): FuzzyMatch[] {
  const q = fuzzyNormalize(query)
  if (q.length < 2) return []
  const seen = new Set<string>()
  return fuzzyIndex
    .map((entry) => ({ term: entry.term, matched: entry.display, score: fuzzyScore(q, entry.key) }))
    .filter((match) => match.score >= 0.74)
    .sort((a, b) => b.score - a.score)
    .filter((match) => (seen.has(match.term.slug) ? false : (seen.add(match.term.slug), true)))
    .slice(0, 6)
}

/* Everyday English words that collide with short aliases — exact decoding still handles real usage. */
const FUZZY_STOPWORDS = new Set(['love', 'loved', 'loving', 'leaves', 'leaf', 'part', 'parts', 'deal', 'deals', 'dealt', 'main', 'train', 'trains', 'edit', 'edits', 'high', 'band', 'ship', 'ships', 'mate', 'mates', 'that', 'this', 'then', 'than', 'they', 'them', 'with', 'have', 'from', 'what', 'when', 'your', 'yours', 'check', 'checks', 'checked', 'stage', 'stages', 'played', 'player', 'song', 'songs', 'fire', 'lit'])

export function fuzzyDecodeMessage(message: string): FuzzyMatch[] {
  const tokens = message.toLowerCase().split(/[^a-z0-9@]+/).filter((token) => token.replace(/[^a-z0-9@]/g, '').length >= 4 && !FUZZY_STOPWORDS.has(token.toLowerCase()))
  if (!tokens.length) return []
  const exact = new Set(decodeMessage(message).map((item) => item.slug))
  const found = new Map<string, FuzzyMatch>()
  for (const token of tokens) {
    const q = fuzzyNormalize(token)
    let best: FuzzyMatch | null = null
    for (const entry of fuzzyIndex) {
      const score = fuzzyScore(q, entry.key)
      if (score >= 0.84 && (!best || score > best.score)) best = { term: entry.term, matched: token, score }
    }
    if (best && !exact.has(best.term.slug) && !found.has(best.term.slug)) found.set(best.term.slug, best)
  }
  return [...found.values()].sort((a, b) => b.score - a.score).slice(0, 5)
}
