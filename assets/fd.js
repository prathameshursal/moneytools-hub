// FD calculator logic
(function () {
  function calc() {
    var P = MTH.val("fd-principal");
    var rate = MTH.val("fd-rate");
    var years = MTH.val("fd-years");
    var comp = parseInt(document.getElementById("fd-comp").value, 10);
    if (!(P > 0) || !(rate >= 0) || !(years > 0) || !comp) {
      MTH.show("fd-result", false);
      return;
    }
    var maturity = P * Math.pow(1 + rate / 100 / comp, comp * years);
    var interest = maturity - P;

    document.getElementById("fd-maturity").textContent = MTH.inr(maturity);
    document.getElementById("fd-interest").textContent = MTH.inr(interest);
    var pPct = maturity > 0 ? (P / maturity) * 100 : 0;
    document.getElementById("fd-bar-principal").style.width = pPct.toFixed(1) + "%";
    MTH.show("fd-result", true);
  }
  var btn = document.getElementById("fd-btn");
  if (btn) btn.addEventListener("click", calc);
  ["fd-principal", "fd-rate", "fd-years", "fd-comp"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("keydown", function (e) { if (e.key === "Enter") calc(); });
  });
})();
