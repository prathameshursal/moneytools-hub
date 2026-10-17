// SIP calculator logic
(function () {
  function calc() {
    var m = MTH.val("sip-monthly");
    var rate = MTH.val("sip-rate");
    var years = MTH.val("sip-years");
    if (!(m > 0) || !(rate >= 0) || !(years > 0)) {
      MTH.show("sip-result", false);
      return;
    }
    var i = rate / 12 / 100;
    var n = Math.round(years * 12);
    var fv = i === 0 ? m * n : m * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    var invested = m * n;
    var gain = fv - invested;

    document.getElementById("sip-future").textContent = MTH.inr(fv);
    document.getElementById("sip-invested").textContent = MTH.inr(invested);
    document.getElementById("sip-gain").textContent = MTH.inr(gain);
    var pPct = fv > 0 ? (invested / fv) * 100 : 0;
    document.getElementById("sip-bar-invested").style.width = pPct.toFixed(1) + "%";
    MTH.show("sip-result", true);
  }
  var btn = document.getElementById("sip-btn");
  if (btn) btn.addEventListener("click", calc);
  ["sip-monthly", "sip-rate", "sip-years"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("keydown", function (e) { if (e.key === "Enter") calc(); });
  });
})();
