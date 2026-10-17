// Percentage calculator: three modes
(function () {
  function calc() {
    var mode = document.getElementById("pct-mode").value;
    var a = MTH.val("pct-a");
    var b = MTH.val("pct-b");
    var outEl = document.getElementById("pct-out");
    var noteEl = document.getElementById("pct-note");
    var text = "";

    if (mode === "of") {
      // What is A% of B
      if (!(a >= 0 && b >= 0)) { MTH.show("pct-result", false); return; }
      text = MTH.num((a / 100) * b, 4);
      noteEl.textContent = a + "% of " + b + " = " + text;
    } else if (mode === "isWhat") {
      // A is what percent of B
      if (!(b !== 0)) { MTH.show("pct-result", false); return; }
      text = MTH.pct((a / b) * 100, 2);
      noteEl.textContent = a + " is " + text + " of " + b;
    } else {
      // Percentage change from A to B
      if (!(a !== 0)) { MTH.show("pct-result", false); return; }
      var change = ((b - a) / Math.abs(a)) * 100;
      text = (change >= 0 ? "+" : "") + change.toFixed(2) + "%";
      noteEl.textContent = "From " + a + " to " + b + " is a " + (change >= 0 ? "increase" : "decrease") + " of " + Math.abs(change).toFixed(2) + "%";
    }
    outEl.textContent = text;
    MTH.show("pct-result", true);
  }

  function syncLabels() {
    var mode = document.getElementById("pct-mode").value;
    var la = document.getElementById("pct-a-label");
    var lb = document.getElementById("pct-b-label");
    if (mode === "of") {
      la.textContent = "Percentage (%)";
      lb.textContent = "Of number";
    } else if (mode === "isWhat") {
      la.textContent = "Value A";
      lb.textContent = "Value B (A is what % of B)";
    } else {
      la.textContent = "Old value";
      lb.textContent = "New value";
    }
  }

  var btn = document.getElementById("pct-btn");
  if (btn) {
    btn.addEventListener("click", calc);
    document.getElementById("pct-mode").addEventListener("change", function () {
      syncLabels();
      MTH.show("pct-result", false);
    });
  }
  ["pct-a", "pct-b"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("keydown", function (e) { if (e.key === "Enter") calc(); });
  });
})();
