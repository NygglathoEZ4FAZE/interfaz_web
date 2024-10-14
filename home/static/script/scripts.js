// Botones
function checkEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Evitar comportamiento por defecto del Enter
        submitMessage(); // Enviar el mensaje
        startLoading();  // Iniciar la animación de carga
    }
}

function startLoading() {
    // Ocultar el ícono de búsqueda y mostrar la animación de carga
    document.getElementById('search-btn').style.display = 'none';
    document.getElementById('loading').style.display = 'inline-block';

    setTimeout(stopLoading, 3000); // Simula 3 segundos de carga
}

function stopLoading() {
    // Mostrar el ícono de búsqueda y ocultar la animación de carga
    document.getElementById('search-btn').style.display = 'inline-block';
    document.getElementById('loading').style.display = 'none';
}

function createMessage(side, text) {
    var messageContainer = document.createElement("div");
    messageContainer.className = `chat-message ${side}`;

    var bubble = document.createElement("div");
    bubble.className = "bubble";
    var messageText = document.createElement("p");
    messageText.textContent = text;

    var time = document.createElement("span");
    time.className = "time";
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    bubble.appendChild(messageText);
    bubble.appendChild(time);

    var avatarContainer = document.createElement("div");
    avatarContainer.className = "avatar";

    // Definir la imagen del avatar según el lado del mensaje
    var avatarImage = document.createElement("img");
    if (side === "right") {
        avatarImage.src = "https://lh3.googleusercontent.com/pw/AP1GczNM4xetf7zGAUv44g2eCoFYiQVempGqBKW0Eol7D6c85DcIzDlwxpySn1CQrImZAtemOdzivE6bzyo6o5K2EaAeKVPwv4OYQJ4RRPeanXFS4Gi6_VB0YbjjQNl4QJgy6HsN4Ei6T_aIriXaF5tJ44oSoA=w720-h382-s-no-gm?authuser=0"; // Reemplaza con la URL de la imagen para respuestas
    } else {
        avatarImage.src = "https://lh3.googleusercontent.com/pw/AP1GczNv4G7STMDF6HkUJpHZbgjdGfgoJkGqiXQpJHnMd5fvhk4lyzGXX4h9lkgfCwY_kYDAcXWekhQF3PyvoNXwdD6ES4WWW0GyZAOifknXiUodtQdd1FhM_tGoYpjlESQ2huZF54ItKS5uH7KBxU22OPIUPA=w647-h647-s-no-gm?authuser=0"; // Reemplaza con la URL de la imagen para preguntas
    }
    
    avatarImage.alt = "Avatar"; // Texto alternativo si la imagen no se carga
    avatarImage.width = 40; // Puedes ajustar el tamaño según lo que necesites
    avatarImage.height = 40;

    avatarContainer.appendChild(avatarImage);

    messageContainer.appendChild(avatarContainer);
    messageContainer.appendChild(bubble);

    var messagesContainer = document.getElementById("messages");
    messagesContainer.appendChild(messageContainer);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


async function submitMessage() {
    var input = document.getElementById("search");
    var message = input.value.trim();

    // Definir el valor del intent (puedes cambiarlo según lo necesites)
    var intent = "cancel_order"; // Valor de intent estático como en el ejemplo de Python

    if (message !== "") {
        console.log(message);
        createMessage("right", message); // Crear el mensaje enviado
        input.value = ""; // Limpiar el input

        // Llamar al endpoint de clasificación
        const response = await fetch('/handle_query/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            // Pasar tanto el mensaje como el intent en el cuerpo de la solicitud
            body: JSON.stringify({ query: message, intent: intent })
        });

        const data = await response.json();

        // Mostrar la categoría e intención clasificadas en una burbuja
        createMessage("left", `Consulta clasificada como: Categoría: , Intención: ${data.response.intent}`);

        // Mostrar la respuesta generada en una burbuja separada
        createMessage("left", data.response.best_response); // Mostrar el campo response

        // Mostrar cada respuesta similar en burbujas separadas
        data.responses.forEach(response => {
            createMessage("left", response);
            console.log(data.get.response);
        });

        // Agregar el mensaje de recomendación al final
        createMessage("left", "Si no encontraste la solución, por favor contacta con soporte técnico.");
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
