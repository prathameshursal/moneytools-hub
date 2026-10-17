// Headless verification of calculators: load each page, simulate input, run script.
// Uses a tiny DOM shim sufficient for our scripts (getElementById value/textContent/style, addEventListener, form events).
const fs = require("fs");
const path = require("path");
const DIST = path.join(__dirname, "dist");

function makeEl(id) {
  return {
    id,
    value: "",
    textContent: "",
    style: {},
    listeners: {},
    addEventListener(ev, fn) { this.listeners[ev] = fn; },
    click(ev) { if (this.listeners.click) this.listeners.click(ev || { key: "" }); },
  };
}

function loadPage(slug, setup) {
  const html = fs.readFileSync(path.join(DIST, slug, "index.html"), "utf8");
  const els = new Map();
  const byId = (id) => {
    if (!els.has(id)) els.set(id, makeEl(id));
    return els.get(id);
  };
  // which page script does this page reference?
  const m = html.match(/<script src="(\/assets\/[a-z-]+\.js)" defer><\/script>/g) || [];
  const scripts = m.map((s) => s.match(/src="([^"]+)"/)[1]);
  global.document = { getElementById: byId };
  global.window = { MTH: undefined, location: { href: "" } };
  // preload the real MTH helpers from app.js, same as a browser would
  const appCode = fs.readFileSync(path.join(DIST, "assets/app.js"), "utf8");
  const pageScripts = scripts.map((s) => fs.readFileSync(path.join(DIST, s), "utf8"));
  // Wrap in a function so bare `window.MTH = ...` assignments share our shim scope
  const run = new Function("document", "window", appCode + "\nvar MTH = window.MTH;\n" + pageScripts.join("\n"));
  run(global.document, global.window);
  return { byId, html };
}

let failures = 0;
function expect(name, actual, predicate, hint) {
  const ok = predicate(actual);
  console.log((ok ? "PASS " : "FAIL ") + name + " -> " + actual + (ok ? "" : "  (expected " + hint + ")"));
  if (!ok) failures++;
}

// MTH helpers come from app.js; emulate its behavior
function inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }

// 1) EMI: 25,00,000 @ 8.5% 20y -> EMI 21,696; total interest 27,07,026; total 52,07,026
{
  const { byId } = loadPage("emi-calculator");
  byId("emi-amount").value = "2500000";
  byId("emi-rate").value = "8.5";
  byId("emi-years").value = "20";
  byId("emi-btn").click();
  expect("EMI monthly", byId("emi-monthly").textContent, (v) => v === inr(21695.58), "₹21,696");
  expect("EMI total interest", byId("emi-total-interest").textContent, (v) => v === inr(2706939), "≈ ₹27,06,939");
  expect("EMI result visible", String(byId("emi-result").style.display), (v) => v !== "none", "shown");
}
// 2) SIP: 5000/mo @12% 20y -> 49,95,740
{
  const { byId } = loadPage("sip-calculator");
  byId("sip-monthly").value = "5000";
  byId("sip-rate").value = "12";
  byId("sip-years").value = "20";
  byId("sip-btn").click();
  expect("SIP corpus", byId("sip-future").textContent, (v) => v === inr(4995740), "₹49,95,740");
}
// 3) GST add: 10000 @18% -> GST 1800, total 11800; remove: 1180 @18% -> base 1000
{
  const { byId } = loadPage("gst-calculator");
  byId("gst-amount").value = "10000";
  byId("gst-rate").value = "18";
  byId("gst-type").value = "add";
  byId("gst-btn").click();
  expect("GST add amount", byId("gst-gst").textContent, (v) => v === inr(1800), "₹1,800");
  expect("GST add total", byId("gst-total").textContent, (v) => v === inr(11800), "₹11,800");
  byId("gst-amount").value = "1180";
  byId("gst-rate").value = "18";
  byId("gst-type").value = "remove";
  byId("gst-btn").click();
  expect("GST remove base", byId("gst-base").textContent, (v) => v === inr(1000), "₹1,000");
}
// 4) FD: 2,00,000 @7.1% 5y quarterly -> 2,83,621 (approx)
{
  const { byId } = loadPage("fd-calculator");
  byId("fd-principal").value = "200000";
  byId("fd-rate").value = "7.1";
  byId("fd-years").value = "5";
  byId("fd-comp").value = "4";
  byId("fd-btn").click();
  const got = byId("fd-maturity").textContent;
  expect("FD maturity", got, (v) => v === inr(284349), "₹2,84,349");
}
// 5) Compound interest: 1,00,000 @8% 10y monthly -> 2,21,964
{
  const { byId } = loadPage("compound-interest-calculator");
  byId("ci-principal").value = "100000";
  byId("ci-rate").value = "8";
  byId("ci-years").value = "10";
  byId("ci-freq").value = "12";
  byId("ci-btn").click();
  expect("CI amount", byId("ci-amount").textContent, (v) => v === inr(221964), "₹2,21,964");
}
// 6) Income tax: gross 15,00,000 -> taxable 14,25,000; slab tax 1,37,500; with cess 1,43,000
{
  const { byId } = loadPage("income-tax-calculator");
  byId("it-gross").value = "1500000";
  byId("it-deductions").value = "0";
  byId("it-btn").click();
  expect("IT tax", byId("it-tax").textContent, (v) => v === inr(97500), "₹97,500");
  expect("IT taxable", byId("it-taxable").textContent, (v) => v === inr(1425000), "₹14,25,000");
}
// 7) BMI metric: 170cm 65kg -> 22.5 Normal
{
  const { byId } = loadPage("bmi-calculator");
  byId("bmi-unit").value = "metric";
  byId("bmi-height-cm").value = "170";
  byId("bmi-weight-kg").value = "65";
  byId("bmi-btn").click();
  expect("BMI value", byId("bmi-value").textContent, (v) => v === "22.5", "22.5");
  expect("BMI category", byId("bmi-cat").textContent, (v) => v === "Normal weight", "Normal weight");
}
// 8) Age: DOB 2000-01-15 as of 2026-10-17 -> 26y 9m 2d
{
  const { byId } = loadPage("age-calculator");
  byId("age-dob").value = "2000-01-15";
  byId("age-asof").value = "2026-10-17";
  byId("age-btn").click();
  expect("Age main", byId("age-main").textContent, (v) => v === "26 years, 9 months, 2 days", "26 years, 9 months, 2 days");
}
// 9) Percentage: 18% of 2500 = 450; 450 is what % of 2500 = 18%
{
  const { byId } = loadPage("percentage-calculator");
  byId("pct-mode").value = "of";
  byId("pct-a").value = "18";
  byId("pct-b").value = "2500";
  byId("pct-btn").click();
  expect("Pct of", byId("pct-out").textContent, (v) => v === "450", "450");
  byId("pct-mode").value = "isWhat";
  byId("pct-a").value = "450";
  byId("pct-b").value = "2500";
  byId("pct-btn").click();
  expect("Pct isWhat", byId("pct-out").textContent, (v) => v === "18.00%", "18.00%");
}

console.log(failures === 0 ? "ALL CALCULATOR TESTS PASSED" : failures + " TEST(S) FAILED");
process.exit(failures === 0 ? 0 : 1);
