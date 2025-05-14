const chatToggle = document.getElementById("chatToggle");
const chatWindow = document.getElementById("chatWindow");
const chatBody = document.getElementById("chatBody");
const sendBtn = document.getElementById("sendBtn");
const chatInput = document.getElementById("chatInput");


const imageInput = document.getElementById("imageInput");
// const API_URL = "https://fa51-34-10-70-112.ngrok-free.app/test";
const API_URL = "https://fea0-34-10-70-112.ngrok-free.app/conversar";


chatToggle.addEventListener("click", () => {
  chatWindow.style.display =
    chatWindow.style.display === "flex" ? "none" : "flex";
});


sendBtn.addEventListener("click", async () => {
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

  if (imagen) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;  // esta es la URL temporal de la imagen
      img.style.maxWidth = "100px";
      img.style.marginTop = "5px";
      chatBody.appendChild(img);

      chatBody.scrollTop = chatBody.scrollHeight;
    };
    reader.readAsDataURL(imagen);  // convierte el archivo a una URL base64
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData
    })
    const data = await res.json();
    console.log("hola2", data);

    // Mostrar respuesta del bot
    const botMsg = document.createElement("div");
    botMsg.className = "bot-message";
    botMsg.textContent = data.respuesta || "El asistente no respondió.";
    chatBody.appendChild(botMsg);
  // Mostrar respuesta del bot
    const predbotMsg = document.createElement("div");
    predbotMsg.className = "bot-message";
    predbotMsg.textContent = data.prediccion || "no prediccion disponible.";
    chatBody.appendChild(predbotMsg);


  } catch (error) {
    console.error("Error:", error);
  }

  chatInput.value = "";
  imageInput.value = null;
});