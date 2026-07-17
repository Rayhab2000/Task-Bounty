# HTTP Security Headers

TaskBounty’s Next.js frontend sets recommended HTTP security headers on every response to reduce exposure to common web attacks (clickjacking, MIME sniffing, XSS via CSP, downgrade attacks, and overly permissive browser features).

## Acceptance overview

| Criterion | How it is met |
|-----------|----------------|
| Headers configured | [`frontend/security-headers.mjs`](./frontend/security-headers.mjs) applied via [`frontend/next.config.ts`](./frontend/next.config.ts) `headers()` |
| Compatibility verified | CSP allows Google Fonts + Stellar Horizon; integration script builds and curls a live Next.js server |
| Documentation updated | This guide + links from [`FRONTEND_CI_GUIDE.md`](./FRONTEND_CI_GUIDE.md), [`CONTRIBUTING.md`](./CONTRIBUTING.md), and [`README.md`](./README.md) |

## Headers applied

| Header | Purpose |
|--------|---------|
| `Content-Security-Policy` | Restricts script/style/font/connect sources; blocks plugins (`object-src 'none'`) |
| `Strict-Transport-Security` | Enforces HTTPS for browsers that previously visited over TLS |
| `X-Content-Type-Options` | Disables MIME sniffing (`nosniff`) |
| `X-Frame-Options` | Mitigates clickjacking (`SAMEORIGIN`) |
| `Referrer-Policy` | Limits referrer leakage (`strict-origin-when-cross-origin`) |
| `Permissions-Policy` | Disables camera, microphone, geolocation, and payment APIs by default |
| `X-DNS-Prefetch-Control` | Enables DNS prefetch for performance without weakening other controls |

### CSP compatibility notes

The policy is intentionally compatible with the current frontend:

- **Google Fonts** — `globals.css` imports CSS from `fonts.googleapis.com` (font files from `fonts.gstatic.com`)
- **Stellar Horizon** — `src/lib/stellar.ts` fetches `https://horizon.stellar.org`
- **Next.js / Tailwind** — `'unsafe-inline'` (and `'unsafe-eval'` for scripts) remain allowed so App Router and tooling keep working without nonce wiring

Tighten further only after introducing nonces/hashes and verifying wallet-kit flows.

## Configuration

**Source of truth:** [`frontend/security-headers.mjs`](./frontend/security-headers.mjs)

**Wired in:** [`frontend/next.config.ts`](./frontend/next.config.ts)

```ts
async headers() {
  return getNextSecurityHeadersConfig();
}
```

All routes use `source: "/:path*"`.

## Local verification

```bash
# Unit tests (Node built-in test runner — no extra deps)
cd frontend
pnpm test:security-headers

# Full integration: unit tests + production build + live header check
chmod +x scripts/test-security-headers.sh
./scripts/test-security-headers.sh
```

Optional: override the ephemeral server port:

```bash
SECURITY_HEADERS_TEST_PORT=3020 ./scripts/test-security-headers.sh
```

### Manual check

```bash
cd frontend
pnpm build && pnpm start
# in another terminal:
curl -sI http://localhost:3000 | grep -iE 'content-security-policy|strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy'
```

## CI relationship

Frontend CI ([`.github/workflows/frontend-ci.yml`](./.github/workflows/frontend-ci.yml)) already runs `pnpm build`. Because headers live in `next.config.ts`, a successful build loads the same config production uses. Run `./scripts/test-security-headers.sh` locally before opening a PR that changes header policy.

## Related files

- Config module: [`frontend/security-headers.mjs`](./frontend/security-headers.mjs)
- Unit tests: [`frontend/security-headers.test.mjs`](./frontend/security-headers.test.mjs)
- Next config: [`frontend/next.config.ts`](./frontend/next.config.ts)
- Integration script: [`scripts/test-security-headers.sh`](./scripts/test-security-headers.sh)
- Frontend CI guide: [`FRONTEND_CI_GUIDE.md`](./FRONTEND_CI_GUIDE.md)

## References

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [Next.js `headers` configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)
- [MDN: Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
