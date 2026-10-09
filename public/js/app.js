document.querySelectorAll(".toggle-password").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.getAttribute("aria-controls"));
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    btn.classList.toggle("is-showing", !showing);
    btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
  });
});
