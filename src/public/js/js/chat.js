let box = document.getElementById("messagesLogs");
const chat = document.getElementById("chatBox");
const nombreUsuario = document.getElementById("nombreusuario");
const formulario = document.getElementById("formulario");
const socket = io();

let client;

Swal.fire({
    title: "Mi tienda otaku online",
    input: "text",
    text: "Cual es tu nombre?",
    inputValidator: (value) => {
        return !value && "Ingresa tu apodo"
    },
}).then((username) => {
    client = username.value;
    nombreUsuario.innerHTML = client;
    socket.emit("nuevousuario", client);
});

chat.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        if (chat.value.trim().length > 0) {
            socket.emit("message", { user: client, message: chat.value });
            chat.value = "";
        }
    }
});

socket.on("message", data => {
    let messages = "";
    data.forEach(message => {
        messages = messages + `<span> ${message.user} </span> dice: <span>${message.message}</span> <br>`
    })
    box.innerHTML = messages;
});

document.getElementById("clearChat").addEventListener("click", () => {
    try {
        document.getElementById("chatBox").textContent = "";
        socket.emit("clearchat");
    } catch (error) {
        console.error(error);
    }
});