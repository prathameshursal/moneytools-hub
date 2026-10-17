// Age calculator logic
(function () {
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function calc() {
    var dobStr = document.getElementById("age-dob").value;
    var asOfStr = document.getElementById("age-asof").value;
    if (!dobStr) {
      MTH.show("age-result", false);
      return;
    }
    var dob = new Date(dobStr + "T00:00:00");
    var asOf = asOfStr ? new Date(asOfStr + "T00:00:00") : new Date();
    if (isNaN(dob) || isNaN(asOf) || dob > asOf) {
      MTH.show("age-result", false);
      return;
    }

    var y = asOf.getFullYear() - dob.getFullYear();
    var m = asOf.getMonth() - dob.getMonth();
    var d = asOf.getDate() - dob.getDate();
    if (d < 0) {
      m--;
      var prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
      d += prevMonth.getDate();
    }
    if (m < 0) { y--; m += 12; }

    var totalDays = Math.floor((asOf - dob) / 86400000);
    var nextBday = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBday < asOf) nextBday = new Date(asOf.getFullYear() + 1, dob.getMonth(), dob.getDate());
    var daysToBday = Math.ceil((nextBday - asOf) / 86400000);
    var turning = nextBday.getFullYear() - dob.getFullYear();

    document.getElementById("age-main").textContent = y + " years, " + m + " months, " + d + " days";
    document.getElementById("age-months").textContent = (y * 12 + m).toLocaleString("en-IN");
    document.getElementById("age-weeks").textContent = Math.floor(totalDays / 7).toLocaleString("en-IN");
    document.getElementById("age-days").textContent = totalDays.toLocaleString("en-IN");
    document.getElementById("age-hours").textContent = (totalDays * 24).toLocaleString("en-IN");
    document.getElementById("age-next").textContent = "Next birthday in " + daysToBday + " days (turning " + turning + ")";
    MTH.show("age-result", true);
  }
  var btn = document.getElementById("age-btn");
  if (btn) {
    btn.addEventListener("click", calc);
    // default as-of = today
    var asOf = document.getElementById("age-asof");
    if (asOf && !asOf.value) {
      var t = new Date();
      asOf.value = t.getFullYear() + "-" + pad(t.getMonth() + 1) + "-" + pad(t.getDate());
    }
  }
  ["age-dob", "age-asof"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("keydown", function (e) { if (e.key === "Enter") calc(); });
  });
})();
