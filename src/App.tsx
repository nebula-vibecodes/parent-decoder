import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useParams, useSearchParams } from 'react-router'
import { AppShell } from './components/AppShell'
import { categories } from './data'
import HomePage from './pages/HomePage'
import { Link } from 'react-router'

const DecoderPage = lazy(() => import('./pages/DecoderPage'))
const BrowsePage = lazy(() => import('./pages/BrowsePage'))
const TermPage = lazy(() => import('./pages/TermPage'))
const StartersPage = lazy(() => import('./pages/StartersPage'))
const SavedPage = lazy(() => import('./pages/SavedPage'))
const SuggestPage = lazy(() => import('./pages/SuggestPage'))
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'))
const EditorialPage = lazy(() => import('./pages/EditorialPage'))
const PreferencesPage = lazy(() => import('./pages/PreferencesPage'))
const PrintPage = lazy(() => import('./pages/PrintPage'))
const AboutPage = lazy(() => import('./pages/InfoPages').then((m) => ({ default: m.AboutPage })))
const PolicyPage = lazy(() => import('./pages/InfoPages').then((m) => ({ default: m.PolicyPage })))
const PrivacyPage = lazy(() => import('./pages/InfoPages').then((m) => ({ default: m.PrivacyPage })))
const ReviewStatusPage = lazy(() => import('./pages/InfoPages').then((m) => ({ default: m.ReviewStatusPage })))

function PageFallback() {
  return <div className="page-shell"><div className="page-intro"><p className="eyebrow">Loading</p><h1>One moment…</h1></div></div>
}

const CATEGORY_BY_SLUG = new Map(
  categories.slice(1).map((category) => [
    category.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    category,
  ]),
)

function LibraryRedirect() {
  const { category } = useParams()
  const [params] = useSearchParams()
  const next = new URLSearchParams(params)
  const resolved = category ? CATEGORY_BY_SLUG.get(category.toLowerCase()) : undefined
  if (resolved) next.set('category', resolved)
  else next.delete('category')
  const query = next.toString()
  return <Navigate to={`/browse${query ? `?${query}` : ''}`} replace />
}

function TermsRedirect() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  if (!slug) return <Navigate to="/browse" replace />
  const query = params.toString()
  return <Navigate to={`/term/${slug}${query ? `?${query}` : ''}`} replace />
}

function ApproachRedirect() {
  const [params] = useSearchParams()
  const query = params.toString()
  return <Navigate to={`/privacy${query ? `?${query}` : ''}`} replace />
}

function NotFound() {
  return <div className="not-found"><p className="eyebrow">404 · Nothing here</p><h1>This page seems to have moved on.</h1><p>No harm done. The word you were looking up is probably a search or two away.</p><div><Link className="button" to="/">Back to search</Link><Link className="button button-outline" to="/browse">Browse all terms</Link></div></div>
}

export default function App() {
  return <Routes><Route element={<AppShell />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/decoder" element={<Suspense fallback={<PageFallback />}><DecoderPage /></Suspense>} />
    <Route path="/browse" element={<Suspense fallback={<PageFallback />}><BrowsePage /></Suspense>} />
    <Route path="/library" element={<LibraryRedirect />} />
    <Route path="/library/:category" element={<LibraryRedirect />} />
    <Route path="/term/:slug" element={<Suspense fallback={<PageFallback />}><TermPage /></Suspense>} />
    <Route path="/terms/:slug" element={<TermsRedirect />} />
    <Route path="/conversation-starters" element={<Suspense fallback={<PageFallback />}><StartersPage /></Suspense>} />
    <Route path="/saved" element={<Suspense fallback={<PageFallback />}><SavedPage /></Suspense>} />
    <Route path="/suggest" element={<Suspense fallback={<PageFallback />}><SuggestPage /></Suspense>} />
    <Route path="/feedback" element={<Suspense fallback={<PageFallback />}><FeedbackPage /></Suspense>} />
    <Route path="/preferences" element={<Suspense fallback={<PageFallback />}><PreferencesPage /></Suspense>} />
    <Route path="/print" element={<Suspense fallback={<PageFallback />}><PrintPage /></Suspense>} />
    <Route path="/about" element={<Suspense fallback={<PageFallback />}><AboutPage /></Suspense>} />
    <Route path="/approach" element={<ApproachRedirect />} />
    <Route path="/privacy" element={<Suspense fallback={<PageFallback />}><PrivacyPage /></Suspense>} />
    <Route path="/editorial-policy" element={<Suspense fallback={<PageFallback />}><PolicyPage /></Suspense>} />
    <Route path="/editorial-review" element={<Suspense fallback={<PageFallback />}><ReviewStatusPage /></Suspense>} />
    <Route path="/editorial" element={<Suspense fallback={<PageFallback />}><EditorialPage /></Suspense>} />
    <Route path="*" element={<NotFound />} />
  </Route></Routes>
}
