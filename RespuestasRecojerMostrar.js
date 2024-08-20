document.addEventListener("DOMContentLoaded", function () {
    let selectedAnswersByForm = {};

    // Mapa de respuestas correctas para cada formulario
    const correctAnswersMap = {
        'examForm1': ['Centro de Coordinación para la Vigilancia Marítima de Costas y Fronteras'],
        'examForm2': ['Redes Sociales y Televisión', 'Aeropuerto de Ibiza', 'Base de datos sobre matrícula del Barco y Bandera'],
        'examForm3': ['Activación de medios de rescate SASEMAR', 'Alerta Policía Nacional, Cruz Roja, CNI', 'Envío de medios aéreos GC y alertar unidades de intervención GC-UEI'],
        'examForm4': ['Detectado barco Nodriza con inmigrantes se activa salvamento y rescate SASEMAR', 'Se informa de activación medios aéreos GC para verificar peligrosidad traficantes', 'Se informa de intervención de unidades GC para detener traficantes de personas']
    };

    // Función que guarda las respuestas seleccionadas
    function saveSelectedAnswers(formId, selectedAnswers) {
        selectedAnswersByForm[formId] = selectedAnswers;
    }

    // Función principal para mostrar los resultados
    function showResults() {
        const selectedAnswersContainer = document.getElementById('selectedAnswersContentDisplay');
        const correctAnswersContainers = {
            'examForm1': document.getElementById('answerMando'),
            'examForm2': document.getElementById('answerSituacion'),
            'examForm3': document.getElementById('answerDecision'),
            'examForm4': document.getElementById('answerComunicacion')
        };

        // Asegúrate de que los contenedores están vacíos antes de agregar nuevos elementos
        selectedAnswersContainer.innerHTML = '';
        Object.values(correctAnswersContainers).forEach(container => {
            container.innerHTML = '';
        });

        // Itera a través de las formas y agrega las respuestas correspondientes
        Object.keys(selectedAnswersByForm).forEach(formId => {
            const selectedAnswers = selectedAnswersByForm[formId];
            const correctAnswers = correctAnswersMap[formId];

            // Mostrar las respuestas seleccionadas
            selectedAnswers.forEach(answer => {
                const answerItem = document.createElement('p');
                answerItem.textContent = answer;
                answerItem.className = correctAnswers.includes(answer) ? 'text-success' : 'text-danger';
                selectedAnswersContainer.appendChild(answerItem);
            });

            // Mostrar las respuestas correctas
            correctAnswers.forEach(answer => {
                const correctItem = document.createElement('li');
                correctItem.textContent = answer;
                correctItem.className = 'text-success';
                correctAnswersContainers[formId].appendChild(correctItem);
            });
        });

        // Mostrar la sección de resultados
        document.getElementById('resultsSection').style.display = 'block';
    }

    // Manejar el envío de los formularios y guardar las respuestas seleccionadas
    document.querySelectorAll("form[id^='examForm']").forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const formId = event.target.id;
            const selectedAnswers = Array.from(event.target.querySelectorAll('input:checked')).map(input => input.value);

            saveSelectedAnswers(formId, selectedAnswers);

            // Mover al siguiente ítem del carrusel o mostrar los resultados
            const carousel = bootstrap.Carousel.getInstance(document.querySelector('#formCarousel'));
            carousel.next();
        });
    });

    // Función para validar la contraseña y mostrar los resultados
    function validatePassword() {
        const password = document.getElementById('passwordInput').value;
        if (password === "cugc") {
            alert("Contraseña correcta. Procediendo a corregir la evaluación...");
            showResults();  // Mostrar respuestas seleccionadas y correctas
            document.getElementById('printReportButton').disabled = false; // Habilitar el botón de imprimir informe
            const passwordModal = bootstrap.Modal.getInstance(document.getElementById('passwordModal'));
            passwordModal.hide();
        } else {
            alert("Contraseña incorrecta. Inténtalo de nuevo.");
            document.getElementById('passwordInput').value = ''; // Limpiar el campo de entrada
        }
    }

    // Asignar la función validatePassword al botón de corrección
    document.getElementById('consolidateButton').addEventListener('click', validatePassword);
});
