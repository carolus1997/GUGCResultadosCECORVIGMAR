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




function showAllAnswers() {
    // Mostrar las respuestas seleccionadas y correctas
    const selectedAnswersContainer = document.getElementById('selectedAnswersContainerDisplay');
    const correctAnswersContainer = document.getElementById('correctAnswersContainer');

    if (selectedAnswersContainer.style.display === 'none' || selectedAnswersContainer.style.display === '') {
        displaySelectedAndCorrectAnswers();
    }
}

function displaySelectedAndCorrectAnswers() {
    const selectedAnswersContent = document.getElementById('selectedAnswersContent');
    const correctAnswersContent = document.getElementById('correctAnswersContent');

    const sections = ['Mando y Control', 'Situación', 'Decisión', 'Comunicación'];
    selectedAnswersContent.innerHTML = ''; // Limpiar contenido previo
    correctAnswersContent.innerHTML = ''; // Limpiar contenido previo

    sections.forEach((section, index) => {
        const form = document.querySelector(`#examForm${index + 1}`);
        const selectedInputs = form.querySelectorAll('input:checked');
        const correctAnswers = getCorrectAnswers(index + 1);

        // Añadir las respuestas seleccionadas
        if (selectedInputs.length > 0) {
            const sectionTitle = document.createElement('h4');
            sectionTitle.textContent = section;
            selectedAnswersContent.appendChild(sectionTitle);

            selectedInputs.forEach(input => {
                const answer = document.createElement('p');
                answer.textContent = input.value;
                selectedAnswersContent.appendChild(answer);
            });
        }

        // Añadir las respuestas correctas
        if (correctAnswers.length > 0) {
            const correctSectionTitle = document.createElement('h4');
            correctSectionTitle.textContent = section;
            correctAnswersContent.appendChild(correctSectionTitle);

            correctAnswers.forEach(answer => {
                const correctAnswer = document.createElement('p');
                correctAnswer.textContent = answer;
                correctAnswersContent.appendChild(correctAnswer);
            });
        }
    });

    // Mostrar los contenedores
    selectedAnswersContainer.style.display = 'block';
    correctAnswersContainer.style.display = 'block';
}

function getCorrectAnswers(formIndex) {
    const correctAnswersMap = {
        1: ['Centro de Coordinación para la Vigilancia Marítima de Costas y Fronteras'],
        2: ['Redes Sociales y Televisión', 'Aeropuerto de Ibiza', 'Base de datos sobre matrícula del Barco y Bandera'],
        3: ['Activación de medios de rescate SASEMAR', 'Alerta Policía Nacional, Cruz Roja, CNI', 'Envío de medios aéreos GC y alertar unidades de intervención GC-UEI'],
        4: ['Detectado barco Nodriza con inmigrantes se activa salvamento y rescate SASEMAR', 'Se informa de activación medios aéreos GC para verificar peligrosidad traficantes', 'Se informa de intervención de unidades GC para detener traficantes de personas']
    };

    return correctAnswersMap[formIndex] || [];
}

function showPrintSelectedAnswers() {
    const printContainer = document.createElement('div');
    const sections = ['Mando y Control', 'Situación', 'Decisión', 'Comunicación'];

    sections.forEach(section => {
        if (section === 'Comunicación') {
            const pageBreak = document.createElement('div');
            pageBreak.style.pageBreakBefore = 'always';
            printContainer.appendChild(pageBreak);
        }

        const form = document.querySelector(`#examForm${sections.indexOf(section) + 1}`);
        const selectedInputs = form.querySelectorAll('input:checked');

        if (selectedInputs.length > 0) {
            const sectionTitle = document.createElement('h4');
            sectionTitle.textContent = section;
            sectionTitle.style.marginTop = '20px';
            sectionTitle.style.borderBottom = '1px solid #000';
            sectionTitle.style.paddingBottom = '5px';
            printContainer.appendChild(sectionTitle);

            selectedInputs.forEach(input => {
                const answer = document.createElement('p');
                answer.textContent = input.value;
                answer.style.marginLeft = '20px';
                printContainer.appendChild(answer);

                const annotationBox = document.createElement('div');
                annotationBox.classList.add('annotationBox');
                printContainer.appendChild(annotationBox);
            });
        }
    });

    return printContainer.innerHTML;
}


function printAnswers() {
    // Primero, captura el gráfico como una imagen
    const radarChartCanvas = document.getElementById('radarChart');
    const chartImage = radarChartCanvas.toDataURL('image/png'); // Convierte el canvas en una imagen

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Respuestas Seleccionadas</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
    printWindow.document.write('h4 { margin-top: 20px; border-bottom: 1px solid #000; padding-bottom: 5px; }');
    printWindow.document.write('p { margin-left: 20px; }');
    printWindow.document.write('.annotationBox { width: 95%; height: 50px; border: 1px solid #ccc; background-color: #f0f0f0; margin: 10px auto 20px; padding: 10px; }');
    printWindow.document.write('div { page-break-inside: avoid; }');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');

    // Agregar el contenido de las respuestas seleccionadas
    const printContent = showPrintSelectedAnswers();
    printWindow.document.write(printContent);

    // Agregar la imagen del gráfico al documento de impresión
    printWindow.document.write('<h4>Gráfico de Resultados</h4>');
    printWindow.document.write('<img src="' + chartImage + '" style="max-width: 100%; height: auto;">');

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

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