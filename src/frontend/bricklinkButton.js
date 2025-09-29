import { verifyKeys } from "./bricklinkAPI.js";

export function createBricklinkButton(containerId, callback) {
  const container = document.getElementById(containerId);

  const button = document.createElement("button");
  button.textContent = "Vérifier mes clés BrickLink";
  button.className = "bl-verify-button";
  container.appendChild(button);

  const popup = document.createElement("div");
  popup.className = "bl-popup-backdrop";
  popup.style.display = "none";

  popup.innerHTML = `
    <div class="bl-popup">
      <h3>Entrer vos clés BrickLink</h3>
      <input type="text" placeholder="BRICKLINK_KEY" id="blKey" />
      <input type="text" placeholder="BRICKLINK_SECRET" id="blSecret" />
      <input type="text" placeholder="TOKEN_KEY" id="tokenKey" />
      <input type="text" placeholder="TOKEN_SECRET" id="tokenSecret" />
      <div class="bl-popup-buttons-wrapper">
        <div id="blResult"></div>
        <div class="bl-popup-buttons">
          <button id="blCancel">Annuler</button>
          <button id="blSubmit">Vérifier</button>
        </div>
      </div>
    </div>
  `;
  container.appendChild(popup);
  const resultDiv = popup.querySelector("#blResult");

  button.addEventListener("click", () => {
    popup.style.display = "flex";
    resultDiv.textContent = "";
  });

  popup.querySelector("#blCancel").addEventListener("click", () => {
    popup.style.display = "none";
  });

  popup.querySelector("#blSubmit").addEventListener("click", async () => {
    const payload = {
      consumerKey: popup.querySelector("#blKey").value.trim(),
      consumerSecret: popup.querySelector("#blSecret").value.trim(),
      tokenKey: popup.querySelector("#tokenKey").value.trim(),
      tokenSecret: popup.querySelector("#tokenSecret").value.trim(),
    };

    const { status, data, error } = await verifyKeys(payload);

    if (callback && typeof callback === "function") {
      callback(data || { success: false, error });
    }

    if (!data?.success) {
      resultDiv.style.color = "red";
      resultDiv.textContent = "❌ Invalid keys!";
      console.error("Keys are invalid ❌", data?.text ?? error);
    } else {
      resultDiv.textContent = "";
      console.log("Keys are valid ✅", data.text);
    }
  });
}
