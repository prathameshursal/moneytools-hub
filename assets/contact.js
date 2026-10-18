// Contact form: mailto handoff (no backend required)
(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var to = document.getElementById("cf-email-to").value;
    var name = document.getElementById("cf-name").value.trim();
    var from = document.getElementById("cf-email").value.trim();
    var subject = document.getElementById("cf-subject").value.trim() || "Website contact";
    var msg = document.getElementById("cf-message").value.trim();
    var status = document.getElementById("cf-status");
    if (!name || !from || !msg) {
      status.textContent = "Please fill in your name, email, and message.";
      status.style.color = "#b91c1c";
      return;
    }
    var body = "Name: " + name + "\nEmail: " + from + "\n\n" + msg;
    var href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    status.textContent = "Opening your email app. If nothing happens, email us directly at " + to + ".";
    status.style.color = "#047857";
    window.location.href = href;
  });
})();
