var intervalo;

function iniciarCuentaRegresiva() {
    ocultarBotonInicio();
    detenerCuentaRegresiva();  // Asegura que cualquier cuenta atrás anterior se detenga
    var tiempoRestante = 15 * 60;  // 15 minutos
    actualizarTiempo(tiempoRestante);
    intervalo = setInterval(function() {
        tiempoRestante -= 1;
        actualizarTiempo(tiempoRestante);
        if (tiempoRestante <= 0) {
            clearInterval(intervalo);
            document.getElementById('cuentaRegresiva').textContent = "¡Tiempo agotado!";
        }
    }, 1000);
}

function detenerCuentaRegresiva() {
    if (intervalo) {
        clearInterval(intervalo);
    }
}

function actualizarTiempo(tiempoRestante) {
    var minutos = parseInt(tiempoRestante / 60, 10);
    var segundos = parseInt(tiempoRestante % 60, 10);
    minutos = minutos < 10 ? "0" + minutos : minutos;
    segundos = segundos < 10 ? "0" + segundos : segundos;
    document.getElementById('cuentaRegresiva').textContent = minutos + ":" + segundos;
}

function ocultarBotonInicio() {
    var botonInicio = document.getElementById('iniciarCuentaRegresiva');
    botonInicio.style.display = 'none';  // Oculta el botón de iniciar
}

document.getElementById('iniciarCuentaRegresiva').addEventListener('click', iniciarCuentaRegresiva);
