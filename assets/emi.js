// EMI calculator logic
(function () {
  function calc() {
    var P = MTH.val("emi-amount");
    var rate = MTH.val("emi-rate");
    var years = MTH.val("emi-years");
    if (!(P > 0) || !(rate >= 0) || !(years > 0)) {
      MTH.show("emi-result", false);
      return;
    }
    var r = rate / 12 / 100;
    var n = Math.round(years * 12);
    var emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    var total = emi * n;
    var interest = total - P;

    document.getElementById("emi-monthly").textContent = MTH.inr(emi);
    document.getElementById("emi-total-interest").textContent = MTH.inr(interest);
    document.getElementById("emi-total").textContent = MTH.inr(total);
    var pPct = total > 0 ? (P / total) * 100 : 0;
    document.getElementById("emi-bar-principal").style.width = pPct.toFixed(1) + "%";
    MTH.show("emi-result", true);
  }
  var btn = document.getElementById("emi-btn");
  if (btn) btn.addEventListener("click", calc);
  ["emi-amount", "emi-rate", "emi-years"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("keydown", function (e) { if (e.key === "Enter") calc(); });
  });
})();
