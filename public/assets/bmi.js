// BMI calculator logic (metric and imperial)
(function () {
  function calc() {
    var unit = document.getElementById("bmi-unit").value;
    var h, w;
    if (unit === "metric") {
      h = MTH.val("bmi-height-cm") / 100;
      w = MTH.val("bmi-weight-kg");
    } else {
      var ft = MTH.val("bmi-height-ft") || 0;
      var inch = MTH.val("bmi-height-in") || 0;
      h = (ft * 12 + inch) * 0.0254;
      w = MTH.val("bmi-weight-lb") * 0.45359237;
    }
    if (!(h > 0) || !(w > 0)) {
      MTH.show("bmi-result", false);
      return;
    }
    var bmi = w / (h * h);
    var cat, cls;
    if (bmi < 18.5) { cat = "Underweight"; cls = "#b45309"; }
    else if (bmi < 25) { cat = "Normal weight"; cls = "#047857"; }
    else if (bmi < 30) { cat = "Overweight"; cls = "#b45309"; }
    else { cat = "Obese"; cls = "#b91c1c"; }

    var healthyMin = 18.5 * h * h;
    var healthyMax = 24.9 * h * h;
    var healthyRange =
      unit === "metric"
        ? MTH.num(healthyMin, 1) + " - " + MTH.num(healthyMax, 1) + " kg"
        : MTH.num(healthyMin / 0.45359237, 1) + " - " + MTH.num(healthyMax / 0.45359237, 1) + " lb";

    var el = document.getElementById("bmi-value");
    el.textContent = bmi.toFixed(1);
    el.style.color = cls;
    document.getElementById("bmi-cat").textContent = cat;
    document.getElementById("bmi-cat").style.color = cls;
    document.getElementById("bmi-range").textContent = healthyRange;
    MTH.show("bmi-result", true);
  }
  var btn = document.getElementById("bmi-btn");
  if (btn) {
    btn.addEventListener("click", calc);
    document.getElementById("bmi-unit").addEventListener("change", function () {
      var metric = this.value === "metric";
      MTH.show("bmi-metric", metric);
      MTH.show("bmi-imperial", !metric);
    });
  }
  ["bmi-height-cm", "bmi-weight-kg", "bmi-height-ft", "bmi-height-in", "bmi-weight-lb"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("keydown", function (e) { if (e.key === "Enter") calc(); });
  });
})();
