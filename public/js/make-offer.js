document.addEventListener("DOMContentLoaded", function () {
  const selected = [];

  const errorMessage = document.querySelector(".error-message");

  const images = document.querySelectorAll(".pokemon-img");

  images.forEach((img) => {
    img.addEventListener("click", () => {
      const id = img.getAttribute("data-id");

      // Check current border style
      const hasBorder = img.style.border !== "none";

      if (hasBorder) {
        // Remove border
        img.style.border = "none";

        // Remove from selected array
        const index = selected.indexOf(id);
        if (index > -1) {
          selected.splice(index, 1);
        }
      } else {
        // Add border back
        img.style.border = "2px solid black";

        // Add to selected array
        selected.push(id);
      }
    });
  });

  const submitButton = document.getElementById("submitOfferBtn");
  submitButton.addEventListener("click", function () {
    if (selected.length === 0) {
      errorMessage.style.display = "";
      errorMessage.textContent = "Select at least one pokemon.";
      return;
    }

    const url = new URL(window.location.href);
    fetch(url.pathname, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(selected),
    }).then(async (res) => {
      if (!res.ok) {
        errorMessage.style.display = "";
        errorMessage.textContent = "Oops. Something went wrong.";
        return;
      }

      const json = await res.json();
      window.location.href = `/trades/${json.tradeId}`;
    });
  });
});
