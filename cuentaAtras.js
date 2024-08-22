var intervalo; // Variable global para manejar el intervalo de la cuenta regresiva
var evaluacionCorregida = false; // Variable para rastrear si se ha presionado "Corregir Evaluación"

// Función para iniciar la cuenta regresiva
function iniciarCuentaRegresiva() {
    ocultarBotonInicio(); // Oculta el botón de inicio
    detenerCuentaRegresiva(); // Detiene cualquier cuenta regresiva en curso

    var tiempoRestante = 15 * 60; // Tiempo inicial de 15 minutos (en segundos)
    actualizarTiempo(tiempoRestante); // Actualiza el tiempo mostrado inicialmente

    // Establece un intervalo para actualizar el tiempo cada segundo
    intervalo = setInterval(function() {
        tiempoRestante -= 1; // Decrementa el tiempo restante en 1 segundo
        actualizarTiempo(tiempoRestante); // Actualiza la visualización del tiempo

        // Verifica si el tiempo ha llegado a 0
        if (tiempoRestante <= 0) {
            clearInterval(intervalo); // Detiene el intervalo
            if (!evaluacionCorregida) {
                bloquearPagina(); // Bloquea la página si no se ha corregido la evaluación
            }
            document.getElementById('cuentaRegresiva').textContent = "¡Tiempo agotado!";
        }
    }, 1000);
}

// Función para detener la cuenta regresiva
function detenerCuentaRegresiva() {
    if (intervalo) {
        clearInterval(intervalo); // Si hay un intervalo en ejecución, lo detiene
    }
}

// Función para actualizar la visualización del tiempo restante
function actualizarTiempo(tiempoRestante) {
    var minutos = parseInt(tiempoRestante / 60, 10); // Calcula los minutos restantes
    var segundos = parseInt(tiempoRestante % 60, 10); // Calcula los segundos restantes

    // Formatea los minutos y segundos para que siempre tengan dos dígitos
    minutos = minutos < 10 ? "0" + minutos : minutos;
    segundos = segundos < 10 ? "0" + segundos : segundos;

    // Actualiza el contenido del elemento que muestra la cuenta regresiva
    document.getElementById('cuentaRegresiva').textContent = minutos + ":" + segundos;
}

// Función para ocultar el botón de inicio
function ocultarBotonInicio() {
    var botonInicio = document.getElementById('iniciarCuentaRegresiva');
    botonInicio.style.display = 'none'; // Oculta el botón de iniciar
}

// Función para bloquear la página
function bloquearPagina() {
    var bloqueoDiv = document.createElement('div');
    bloqueoDiv.style.position = 'fixed';
    bloqueoDiv.style.top = 0;
    bloqueoDiv.style.left = 0;
    bloqueoDiv.style.width = '100%';
    bloqueoDiv.style.height = '100%';
    bloqueoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    bloqueoDiv.style.color = 'white';
    bloqueoDiv.style.display = 'flex';
    bloqueoDiv.style.justifyContent = 'center';
    bloqueoDiv.style.alignItems = 'center';
    bloqueoDiv.style.fontSize = '2rem';
    bloqueoDiv.textContent = '¡Tiempo agotado! Página bloqueada.';
    document.body.appendChild(bloqueoDiv);
}

// Evento para cuando se hace clic en "Corregir Evaluación"
document.getElementById('consolidateButton').addEventListener('click', function() {
    evaluacionCorregida = true; // Cambia el estado a verdadero indicando que la evaluación ha sido corregida
});

// Agrega un listener al botón de iniciar para que ejecute la función cuando se haga clic
document.getElementById('iniciarCuentaRegresiva').addEventListener('click', iniciarCuentaRegresiva);
