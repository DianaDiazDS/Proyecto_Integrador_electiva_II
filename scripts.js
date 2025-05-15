const chatToggle = document.getElementById("chatToggle");
const chatWindow = document.getElementById("chatWindow");
const chatBody = document.getElementById("chatBody");
const sendBtn = document.getElementById("sendBtn");
const chatInput = document.getElementById("chatInput");
const imageInput = document.getElementById("imageInput");
const previewContainer = document.getElementById("previewContainer");
const previewImage = document.getElementById("previewImage");
const removeImage = document.getElementById("removeImage");


const API_URL = "https://3cdc-34-59-62-126.ngrok-free.app/conversar";

chatToggle.addEventListener("click", () => {
  chatWindow.style.display =
    chatWindow.style.display === "flex" ? "none" : "flex";
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewContainer.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

function cleanInputs() {
  imageInput.value = null;
  previewImage.src = "";
  previewContainer.classList.add("hidden");
}

removeImage.addEventListener("click", () => {
  cleanInputs();
});

const requestBotAnswer = async () => {
  const mensaje = chatInput.value.trim();
  const imagen = imageInput.files[0];

  if (!mensaje && !imagen) {
    // alert("Debes escribir un mensaje o seleccionar una imagen.");
    return;
  }

  const formData = new FormData();
  formData.append("mensaje", mensaje);
  if (imagen) formData.append("imagen", imagen);

  // Mostrar mensaje del usuario
  const userMsg = document.createElement("div");
  userMsg.className = "user-message";
  userMsg.textContent = mensaje;
  chatBody.appendChild(userMsg);
  chatBody.scrollTop = chatBody.scrollHeight;

  if (imagen) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.className = "user-message";
      img.src = e.target.result;
      img.style.maxWidth = "200px";
      img.style.marginTop = "5px";
      chatBody.appendChild(img);
      chatBody.scrollTop = chatBody.scrollHeight;
    };
    reader.readAsDataURL(imagen);
    cleanInputs();
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    // Mostrar respuesta del bot
    const botMsg = document.createElement("div");
    botMsg.className = "bot-message";
    botMsg.textContent = data.respuesta || "El asistente no respondió.";
    chatBody.appendChild(botMsg);
    chatBody.scrollTop = chatBody.scrollHeight;

    if (data.prediccion !== undefined && data.prediccion !== null && data.prediccion !== "") {
      const predbotMsg = document.createElement("div");
      predbotMsg.className = "bot-message";
      predbotMsg.textContent = data.prediccion || "No hay predicción.";
      chatBody.appendChild(predbotMsg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  } catch (error) {
    console.error("Error:", error);
  }

  chatInput.value = "";
  imageInput.value = null;
};

sendBtn.addEventListener("click", requestBotAnswer);

chatInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    requestBotAnswer();
  }
});
