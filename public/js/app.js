document.querySelectorAll(".toggle-password").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.getAttribute("aria-controls"));
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    btn.classList.toggle("is-showing", !showing);
    btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
  });
});

document.body.addEventListener("input", (e) => {
  if (document.querySelector("#username") == e.target) {
    e.target.setAttribute("aria-invalid", "");
    document.querySelector("#username-error")?.remove();
  }

  if (document.querySelector("#password") == e.target) {
    e.target.setAttribute("aria-invalid", "");
    document.querySelector("#password-error")?.remove();
  }
});
