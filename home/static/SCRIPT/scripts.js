//Animación cambio de columnas
let isExpanded = true;

function toggleResize() {
    const leftColumn = document.getElementById('left-column');
    const rightColumn = document.getElementById('right-column');
    var iconLeft = document.getElementById("icon-left");
    var iconRight = document.getElementById("icon-right");
    var supportButton = document.querySelector('.support-button');
    const isCollapsed = leftColumn.classList.toggle('collapsed');

    if (isExpanded) {
        leftColumn.style.width = '5%';
        rightColumn.style.width = '95%';
    } else {
        leftColumn.style.width = '15%';
        rightColumn.style.width = '85%';
    }

    if (iconLeft.style.display !== "none") {
        iconLeft.style.display = "none";
        iconRight.style.display = "inline"; // Mostrar el ícono derecho
    } else {
        // Si el ícono derecho es visible, lo ocultamos y mostramos el izquierdo
        iconLeft.style.display = "inline"; // Mostrar el ícono izquierdo
        iconRight.style.display = "none";
    }

    isExpanded = !isExpanded;
}


//Botones
function checkEnter(event) {
    if (event.key === 'Enter') {
        submitMessage(); // Primero se envía el mensaje
        startLoading();  // Luego se inicia la animación de carga
    }
}

function startLoading() {
    // Ocultar el ícono de búsqueda y mostrar la animación de carga
    document.getElementById('search-btn').style.display = 'none';
    document.getElementById('loading').style.display = 'inline-block';

    // Simular una búsqueda o acción con un timeout de ejemplo
    setTimeout(function () {
        stopLoading();
    }, 3000); // Simula 3 segundos de carga
}

function stopLoading() {
    // Mostrar el ícono de búsqueda y ocultar la animación de carga
    document.getElementById('search-btn').style.display = 'inline-block';
    document.getElementById('loading').style.display = 'none';
}

function submitMessage() {
    var input = document.getElementById("search");
    var message = input.value.trim();

    if (message !== "") {
        // Crear un contenedor para el mensaje
        var messageContainer = document.createElement("div");
        messageContainer.className = "chat-message right"; // 'right' para alinearlo a la derecha

        // Crear la burbuja del mensaje
        var bubble = document.createElement("div");
        bubble.className = "bubble";
        var messageText = document.createElement("p");
        messageText.textContent = message;

        // Añadir la hora del mensaje
        var time = document.createElement("span");
        time.className = "time";
        time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Añadir el texto del mensaje y la hora a la burbuja
        bubble.appendChild(messageText);
        bubble.appendChild(time);

        // Crear el avatar como SVG
        var avatarContainer = document.createElement("div");
        avatarContainer.className = "avatar";
        avatarContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
        </svg>
        `;

        // Añadir la burbuja y el avatar al contenedor del mensaje (orden inverso)
        messageContainer.appendChild(bubble);
        messageContainer.appendChild(avatarContainer);

        // Añadir el mensaje al contenedor de mensajes
        var messagesContainer = document.getElementById("messages");
        messagesContainer.appendChild(messageContainer);

        // Limpiar el input
        input.value = "";

        // Desplazar hacia abajo automáticamente al enviar un nuevo mensaje
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}
