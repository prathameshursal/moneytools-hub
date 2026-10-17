// Income tax calculator: FY 2025-26 new regime slabs (standard deduction ₹75,000)
(function () {
  var SLABS = [
    [400000, 0],
    [800000, 0.05],
    [1200000, 0.10],
    [1600000, 0.15],
    [2000000, 0.20],
    [2400000, 0.25],
    [Infinity, 0.30],
  ];

  function taxNewRegime(taxable) {
    var tax = 0, lower = 0;
    for (var i = 0; i < SLABS.length; i++) {
      var cap = SLABS[i][0], rate = SLABS[i][1];
      if (taxable > lower) {
        var chunk = Math.min(taxable, cap) - lower;
        tax += chunk * rate;
        lower = cap;
      } else break;
    }
    // Section 87A rebate: zero tax up to ₹12 lakh taxable income
    if (taxable <= 1200000) tax = 0;
    // 4% health and education cess
    return tax * 1.04;
  }

  function calc() {
    var gross = MTH.val("it-gross");
    var deductions = MTH.val("it-deductions") || 0;
    if (!(gross >= 0)) {
      MTH.show("it-result", false);
      return;
    }
    var taxable = Math.max(0, gross - 75000 - deductions); // standard deduction + user deductions
    var tax = taxNewRegime(taxable);
    var takeaway = gross - tax;

    document.getElementById("it-taxable").textContent = MTH.inr(taxable);
    document.getElementById("it-tax").textContent = MTH.inr(tax);
    document.getElementById("it-monthly").textContent = MTH.inr(tax / 12);
    document.getElementById("it-takehome").textContent = MTH.inr(takeaway);
    MTH.show("it-result", true);
  }
  var btn = document.getElementById("it-btn");
  if (btn) btn.addEventListener("click", calc);
  ["it-gross", "it-deductions"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("keydown", function (e) { if (e.key === "Enter") calc(); });
  });
})();
