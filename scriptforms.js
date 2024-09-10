document.addEventListener("DOMContentLoaded", function () {
    const formSections = document.querySelectorAll('.form-section');
    const cards = document.querySelectorAll('.card');
    const formIndicators = document.querySelectorAll('.form-indicator');
    const progressBar = document.getElementById('progressBar');
    //const printAnswersButton = document.getElementById('printAnswersButton');
    const consolidateButton = document.getElementById('consolidateButton');
    let progressValue = 0; // Valor inicial de la barra de progreso

    let selectedAnswersByForm = {}; // Objeto para almacenar las respuestas seleccionadas por cada formulario

    // Mapa de respuestas correctas (puede ser dinámico o estático, dependiendo del caso)
    const correctAnswersMap = {
        'examForm1': ['Centro de Coordinación para la Vigilancia Marítima de Costas y Fronteras'],
        'examForm2': ['Redes Sociales y Televisión', 'Aeropuerto de Ibiza', 'Base de datos sobre matrícula del Barco y Bandera'],
        'examForm3': ['Activación de medios de rescate SASEMAR', 'Alerta Policía Nacional, Cruz Roja, CNI', 'Envío de medios aéreos GC y alertar unidades de intervención GC-UEI'],
        'examForm4': ['Detectado barco Nodriza con inmigrantes se activa salvamento y rescate SASEMAR', 'Se informa de activación medios aéreos GC para verificar peligrosidad traficantes', 'Se informa de intervención de unidades GC para detener traficantes de personas']
    };

    // Función para mostrar el formulario correspondiente
    function showFormSection(targetId) {
        formSections.forEach(section => {
            section.style.display = 'none'; // Ocultar todos los formularios
        });
        document.getElementById(targetId).style.display = 'block'; // Mostrar el formulario correspondiente

        // Actualizar indicadores
        formIndicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        document.querySelector(`.form-indicator[data-target="${targetId}"]`).classList.add('active');
    }

    // Manejar clics en las tarjetas para cambiar de formulario
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            showFormSection(target);
        });
    });

    // Manejar clics en los indicadores para cambiar de formulario
    formIndicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const target = indicator.getAttribute('data-target');
            showFormSection(target);
        });
    });

    // Mostrar el primer formulario al cargar la página
    showFormSection('mando-control');

    // Manejar el envío de formularios y pasar al siguiente formulario
    document.querySelectorAll("form[id^='examForm']").forEach((form, index) => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const formId = event.target.id;
            const selectedAnswers = Array.from(event.target.querySelectorAll('input:checked')).map(input => input.value);

            // Guardar las respuestas seleccionadas
            selectedAnswersByForm[formId] = selectedAnswers;

            // Bloquear el botón de envío para que no se pueda pulsar de nuevo
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;

            // Avanzar la barra de progreso un 25%
            progressValue = Math.min(progressValue + 25, 100);
            progressBar.style.width = progressValue + '%';
            progressBar.setAttribute('aria-valuenow', progressValue);
            progressBar.textContent = progressValue + '%';

            // Mostrar el siguiente formulario automáticamente después del envío, si hay otro formulario disponible
            if (index < formSections.length - 1) {
                const nextFormId = formSections[index + 1].id;
                showFormSection(nextFormId);
            }

            // Si la barra de progreso alcanza el 100%, mostrar los botones
            if (progressValue === 100) {
                //printAnswersButton.style.display = 'inline-block';
                consolidateButton.style.display = 'inline-block';
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
    const formSections = document.querySelectorAll(".form-section");

    const options = [
        ["Aeropuerto de Argel", "Redes Sociales y Televisión", "Aeropuerto de Ibiza", "Aeropuerto de Alicante", "Policía Municipal de Ibiza", "Puerto de Valencia", "Cuartel OTAN de Bétera (Valencia)", "Base de datos sobre matrícula del Barco y Bandera", "Puerto de Ibiza"],
        ["Activación de la Unidad Militar de Emergencias", "Activación de medios de rescate SASEMAR", "Alertar a la Casa África", "Informar al Departamento de Seguridad Nacional", "Alerta Policía Nacional, Cruz Roja, CNI", "Activar aviones de combate del ejercito del Aire y del Espacio", "Envío de medios aéreos GC y alertar unidades de intervención GC-UEI", "Activar los medios de la Armada Española", "Alertar Guardacostas de Argelia"],
        ["No se debe realizar ninguna declaración institucional", "Detectado barco Nodriza con inmigrantes se activa salvamento y rescate SASEMAR", "Solo realizar declaración institucional al finalizar la intervención", "Se informa de activación medios aéreos GC para verificar peligrosidad traficantes", "Se informa de coordinación con autoridades de Argelia", "Se informa de intervención de unidades GC para detener traficantes de personas", "Se informa del origen de las fuentes", "Se informa de posibles victimas", "Se informa en redes sociales de actuaciones en cada instante"]
    ];

    // Inicialmente oculta todas las secciones del formulario
    formSections.forEach(section => section.classList.add('hidden'));

    // Maneja el clic en las tarjetas para mostrar el formulario correspondiente
    cards.forEach(card => {
        card.addEventListener("click", function (event) {
            event.preventDefault();
            const targetForm = document.getElementById(card.dataset.target);

            formSections.forEach(section => {
                section.classList.add('hidden');
                section.classList.remove("active");
            });

            targetForm.classList.remove('hidden');
            setTimeout(() => {
                targetForm.classList.add("active");
                targetForm.scrollIntoView({ behavior: 'smooth' });
            }, 10);
        });
    });

    // Genera las opciones para las preguntas
    function generateOptions(questionIndex, optionsList) {
        const questionDiv = document.getElementById(`options${questionIndex + 2}`);
        optionsList.forEach(option => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "form-check-input";
            checkbox.name = `question${questionIndex + 2}`;
            checkbox.value = option;

            const label = document.createElement("label");
            label.className = "form-check-label";
            label.textContent = option;

            const div = document.createElement("div");
            div.className = "form-check";
            div.appendChild(checkbox);
            div.appendChild(label);
            questionDiv.appendChild(div);

            // Limita la selección a 3 opciones
            checkbox.addEventListener("change", function () {
                const checkedCheckboxes = questionDiv.querySelectorAll('input[type="checkbox"]:checked');
                questionDiv.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    cb.disabled = checkedCheckboxes.length >= 3 && !cb.checked;
                    cb.parentNode.classList.toggle("disabled-checkbox", cb.disabled);
                });
            });
        });
    }

    // Genera opciones para cada pregunta basada en el índice
    options.forEach((optionsList, index) => generateOptions(index, optionsList));

    // Maneja el envío del formulario
    document.querySelectorAll("form[id^='examForm']").forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const currentFormSection = form.parentElement;
            const formData = new FormData(form);
            const selectedAnswers = [];

            formData.forEach((value) => {
                selectedAnswers.push(value);
            });

            updateChart(form.id, selectedAnswers);

            currentFormSection.classList.add('fade-out');
            setTimeout(() => {
                currentFormSection.classList.remove('active');
                currentFormSection.classList.add('hidden');
                currentFormSection.classList.remove('fade-out');
            }, 500);

            // Muestra el modal de confirmación
            $('#confirmationModal').modal('show');

            let countdown = 5;
            const countdownElement = document.getElementById('countdown');

            const timer = setInterval(() => {
                countdownElement.textContent = countdown--;
                if (countdown < 0) {
                    clearInterval(timer);
                    $('#confirmationModal').modal('hide');
                }
            }, 1000);
        });
    });
});


