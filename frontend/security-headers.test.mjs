/**
 * Unit tests for HTTP security header configuration.
 * Run: node --test security-headers.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SECURITY_HEADERS,
  REQUIRED_SECURITY_HEADER_NAMES,
  buildContentSecurityPolicy,
  getSecurityHeaderValue,
  getNextSecurityHeadersConfig,
} from "./security-headers.mjs";

describe("SECURITY_HEADERS", () => {
  it("includes all required OWASP-recommended header names", () => {
    const keys = SECURITY_HEADERS.map((h) => h.key);
    for (const name of [
      "Content-Security-Policy",
      "Strict-Transport-Security",
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Referrer-Policy",
      "Permissions-Policy",
    ]) {
      assert.ok(keys.includes(name), `missing header: ${name}`);
    }
  });

  it("has non-empty string values for every header", () => {
    for (const header of SECURITY_HEADERS) {
      assert.equal(typeof header.key, "string");
      assert.ok(header.key.length > 0);
      assert.equal(typeof header.value, "string");
      assert.ok(header.value.length > 0, `${header.key} value is empty`);
    }
  });

  it("exports REQUIRED_SECURITY_HEADER_NAMES matching SECURITY_HEADERS", () => {
    assert.deepEqual(
      REQUIRED_SECURITY_HEADER_NAMES,
      SECURITY_HEADERS.map((h) => h.key),
    );
  });
});

describe("buildContentSecurityPolicy", () => {
  it("allows Google Fonts and Horizon by default", () => {
    const csp = buildContentSecurityPolicy();
    assert.match(csp, /fonts\.googleapis\.com/);
    assert.match(csp, /fonts\.gstatic\.com/);
    assert.match(csp, /horizon\.stellar\.org/);
    assert.match(csp, /object-src 'none'/);
    assert.match(csp, /frame-ancestors 'self'/);
  });

  it("handles null / undefined options without throwing", () => {
    assert.equal(
      buildContentSecurityPolicy(null),
      buildContentSecurityPolicy(undefined),
    );
    assert.equal(
      buildContentSecurityPolicy(undefined),
      buildContentSecurityPolicy(),
    );
  });

  it("ignores empty extraConnectSrc and nullish entries", () => {
    const base = buildContentSecurityPolicy();
    assert.equal(buildContentSecurityPolicy({ extraConnectSrc: [] }), base);
    assert.equal(
      buildContentSecurityPolicy({
        extraConnectSrc: ["", "  ", null, undefined],
      }),
      base,
    );
  });

  it("appends valid extra connect-src origins", () => {
    const csp = buildContentSecurityPolicy({
      extraConnectSrc: ["https://example.com"],
    });
    assert.match(csp, /https:\/\/example\.com/);
  });
});

describe("getSecurityHeaderValue", () => {
  it("returns value for case-insensitive match", () => {
    assert.equal(
      getSecurityHeaderValue(SECURITY_HEADERS, "x-content-type-options"),
      "nosniff",
    );
    assert.equal(
      getSecurityHeaderValue(SECURITY_HEADERS, "X-Frame-Options"),
      "SAMEORIGIN",
    );
  });

  it("returns null for missing, empty, or null names", () => {
    assert.equal(getSecurityHeaderValue(SECURITY_HEADERS, null), null);
    assert.equal(getSecurityHeaderValue(SECURITY_HEADERS, undefined), null);
    assert.equal(getSecurityHeaderValue(SECURITY_HEADERS, ""), null);
    assert.equal(getSecurityHeaderValue(SECURITY_HEADERS, "   "), null);
    assert.equal(getSecurityHeaderValue(SECURITY_HEADERS, "Not-A-Header"), null);
  });

  it("returns null for empty or non-array headers (edge cases)", () => {
    assert.equal(getSecurityHeaderValue([], "X-Frame-Options"), null);
    assert.equal(getSecurityHeaderValue(null, "X-Frame-Options"), null);
    assert.equal(getSecurityHeaderValue(undefined, "X-Frame-Options"), null);
  });
});

describe("getNextSecurityHeadersConfig", () => {
  it("covers all paths with the shared header list", () => {
    const config = getNextSecurityHeadersConfig();
    assert.equal(config.length, 1);
    assert.equal(config[0].source, "/:path*");
    assert.equal(config[0].headers, SECURITY_HEADERS);
  });
});
