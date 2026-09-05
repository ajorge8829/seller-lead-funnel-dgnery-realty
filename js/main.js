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
      // URLSearchParams sends application/x-www-form-urlencoded, which is a
      // CORS-safelisted content type — so no OPTIONS preflight, which Apps
      // Script cannot answer. The redirect it returns carries
      // Access-Control-Allow-Origin: *, so we CAN read the reply and know
      // whether the lead actually saved. (The old code used no-cors, which
      // made a 403 look identical to success.)
      const body = new URLSearchParams(new FormData(form));

      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 25000);

      let res;
      try {
        res = await fetch(endpoint, {
          method: "POST",
          body: body,
          redirect: "follow",
          signal: ctrl.signal,
        });
      } finally {
        clearTimeout(timer);
      }

      if (!res.ok) throw new Error("HTTP " + res.status);

      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch (e) { /* not JSON */ }

      if (data && data.result === "success") {
        window.location.href = "thankyou.html";
        return;
      }

      if (data && data.result === "error") {
        console.error("Apps Script error:", data.message);
        setStatus(
          "We couldn't save your request. Please call or text (347) 707-9937.",
          "error"
        );
        return;
      }

      // Reached the server but the reply wasn't what we expected.
      throw new Error("Unexpected response: " + text.slice(0, 120));

    } catch (err) {
      console.error(err);
      const msg = (err && err.name === "AbortError")
        ? "That took too long. Please check your connection and try again, or call/text (347) 707-9937."
        : "We couldn't submit your request. Please try again, or call/text (347) 707-9937.";
      setStatus(msg, "error");
    } finally {
      submitBtn && (submitBtn.disabled = false);
    }
  });
});
