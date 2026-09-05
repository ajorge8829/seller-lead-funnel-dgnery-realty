document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("eevaluation-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (!form) return;

  // Clear a field's red highlight as soon as the person starts fixing it
  ["first_name", "last_name", "phone", "email", "property_address"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", () => {
      if (!el.value.trim()) return;
      el.classList.remove("is-invalid");
      el.removeAttribute("aria-invalid");
      const grp = el.closest(".form-group");
      grp && grp.classList.remove("has-error");
    });
  });

  const setStatus = (msg, kind = "info") => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = "form-status " + kind;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Basic required validation
    const requiredIds = ["first_name", "last_name", "phone", "email", "property_address"];

    const fieldName = (el) => {
      const lab = document.querySelector('label[for="' + el.id + '"]');
      return lab ? lab.textContent.replace("*", "").trim() : el.id;
    };

    const clearInvalid = (el) => {
      el.classList.remove("is-invalid");
      el.removeAttribute("aria-invalid");
      const grp = el.closest(".form-group");
      grp && grp.classList.remove("has-error");
    };

    const missing = [];
    for (const id of requiredIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      clearInvalid(el);
      if (!el.value.trim()) {
        el.classList.add("is-invalid");
        el.setAttribute("aria-invalid", "true");
        const grp = el.closest(".form-group");
        grp && grp.classList.add("has-error");
        missing.push(fieldName(el));
      }
    }

    if (missing.length) {
      setStatus(
        missing.length === 1
          ? "Please add your " + missing[0] + "."
          : "Please complete: " + missing.join(", ") + ".",
        "error"
      );
      const firstBad = document.querySelector(".is-invalid");
      if (firstBad) {
        firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
        firstBad.focus({ preventScroll: true });
      }
      return;
    }

    const endpoint = form.getAttribute("action");
    if (!endpoint || endpoint.includes("YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
      setStatus("Form endpoint not set yet. Paste your Google Apps Script Web App URL into the form action.", "error");
      return;
    }

    submitBtn && (submitBtn.disabled = true);
    setStatus("Submitting…", "info");

    try {
      const formData = new FormData(form);

      // Use no-cors to avoid Apps Script CORS/preflight issues (common when hosted on Netlify)
      // If the request is delivered successfully, fetch resolves (response will be "opaque").
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      // Success (treat resolved fetch as delivered)
      window.location.href = "thankyou.html";
    } catch (err) {
      setStatus("Something went wrong. Please try again or call/text directly.", "error");
      console.error(err);
    } finally {
      submitBtn && (submitBtn.disabled = false);
    }
  });
});
