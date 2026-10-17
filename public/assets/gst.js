// GST calculator logic
(function () {
  function calc() {
    var amount = MTH.val("gst-amount");
    var rate = MTH.val("gst-rate");
    var type = document.getElementById("gst-type").value; // "add" or "remove"
    if (!(amount > 0) || !(rate >= 0)) {
      MTH.show("gst-result", false);
      return;
    }
    var base, gst, total;
    if (type === "add") {
      base = amount;
      gst = base * rate / 100;
      total = base + gst;
    } else {
      total = amount;
      base = total * 100 / (100 + rate);
      gst = total - base;
    }
    var half = gst / 2;
    document.getElementById("gst-base").textContent = MTH.inr(base);
    document.getElementById("gst-gst").textContent = MTH.inr(gst);
    document.getElementById("gst-total").textContent = MTH.inr(total);
    document.getElementById("gst-cgst").textContent = MTH.inr(half);
    document.getElementById("gst-sgst").textContent = MTH.inr(half);
    MTH.show("gst-result", true);
  }
  var btn = document.getElementById("gst-btn");
  if (btn) btn.addEventListener("click", calc);
  ["gst-amount", "gst-rate", "gst-type"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("keydown", function (e) { if (e.key === "Enter") calc(); });
  });
})();
