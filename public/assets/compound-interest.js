// Compound interest calculator logic
(function () {
  function calc() {
    var P = MTH.val("ci-principal");
    var rate = MTH.val("ci-rate");
    var years = MTH.val("ci-years");
    var freq = parseInt(document.getElementById("ci-freq").value, 10); // times per year
    if (!(P > 0) || !(rate >= 0) || !(years > 0) || !freq) {
      MTH.show("ci-result", false);
      return;
    }
    var amount = P * Math.pow(1 + rate / 100 / freq, freq * years);
    var interest = amount - P;
    var si = (P * rate * years) / 100;

    document.getElementById("ci-amount").textContent = MTH.inr(amount);
    document.getElementById("ci-interest").textContent = MTH.inr(interest);
    document.getElementById("ci-si").textContent = MTH.inr(si);
    document.getElementById("ci-diff").textContent = MTH.inr(interest - si);
    MTH.show("ci-result", true);
  }
  var btn = document.getElementById("ci-btn");
  if (btn) btn.addEventListener("click", calc);
  ["ci-principal", "ci-rate", "ci-years", "ci-freq"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("keydown", function (e) { if (e.key === "Enter") calc(); });
  });
})();
