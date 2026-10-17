// Global UI behavior: mobile menu + dynamic year.
(function () {
  var btn = document.getElementById("menuBtn");
  var nav = document.getElementById("siteNav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }
})();

// Number helpers shared by calculator scripts.
window.MTH = {
  inr: function (n) {
    if (!isFinite(n)) return "-";
    n = Math.round(n);
    return "₹" + n.toLocaleString("en-IN");
  },
  num: function (n, d) {
    if (!isFinite(n)) return "-";
    return n.toLocaleString("en-IN", { maximumFractionDigits: d == null ? 2 : d });
  },
  pct: function (n, d) {
    if (!isFinite(n)) return "-";
    return n.toFixed(d == null ? 2 : d) + "%";
  },
  val: function (id) {
    var el = document.getElementById(id);
    if (!el) return NaN;
    var v = parseFloat(String(el.value).replace(/,/g, ""));
    return isFinite(v) ? v : NaN;
  },
  show: function (id, on) {
    var el = document.getElementById(id);
    if (el) el.style.display = on ? "" : "none";
  },
};
