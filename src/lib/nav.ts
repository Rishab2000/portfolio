// Minimal history-based client routing — base-aware so it works both at the
// dev root ('/') and under the GitHub Pages project path ('/portfolio/').
const BASE = import.meta.env.BASE_URL // '/' in dev, '/portfolio/' in build

function withBase(to: string): string {
  const base = BASE.endsWith('/') ? BASE : BASE + '/'
  return base + to.replace(/^\//, '')
}

// The current route relative to BASE, always starting with '/'.
export function currentRoute(): string {
  const base = BASE.replace(/\/$/, '') // '' or '/portfolio'
  let p = window.location.pathname
  if (base && p.startsWith(base)) p = p.slice(base.length)
  return p.startsWith('/') ? p : '/' + p
}

export function navigate(to: string) {
  const target = withBase(to)
  if (window.location.pathname === target) return
  window.history.pushState({}, '', target)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// Resolve a /public asset path against BASE so it works under '/portfolio/'.
// (Vite does not rewrite string-literal src paths, only bundled imports.)
export function asset(path: string): string {
  return withBase(path)
}
