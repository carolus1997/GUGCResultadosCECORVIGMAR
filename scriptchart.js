document.addEventListener('DOMContentLoaded', function () {
    const initialData = [0, 0, 0, 0];
    const labels = ["Comunicación", "Situación", "Decisión", "Mando y Control"];
    drawRadarChart(initialData, labels);
});

function drawRadarChart(data, labels) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    window.myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: '% de idoneidad',
                data: data,
                fill: true,
                backgroundColor: "rgba(151,187,205,0.2)",
                borderColor: "rgba(151,187,205,1)",
                pointBackgroundColor: "rgba(151,187,205,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(151,187,205,1)"
            }]
        },
        options: {
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    angleLines: { display: false },
                    ticks: { beginAtZero: true, maxTicksLimit: 5 }
                }
            },
            elements: { line: { borderWidth: 3 } }
        }
    });
}


function showChart() {
    document.getElementById('resultsSection');
    const data = [65, 59, 80, 81]; // Datos de ejemplo
    const labels = ['Mando y Control', 'Situación', 'Decisión', 'Comunicación'];
    drawRadarChart(data, labels);
}

function printReport() {
    // Actualiza el gráfico con los datos reales antes de generar el informe
    updateChartWithRealData();

    const printWindow = window.open('', '', 'height=800,width=1000');
    printWindow.document.write('<html><head><title>Informe de Evaluación</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
    printWindow.document.write('h4 { margin-top: 20px; border-bottom: 1px solid #000; padding-bottom: 5px; }');
    printWindow.document.write('p { margin-left: 20px; }');
    printWindow.document.write('.annotationBox { width: 95%; height: 50px; border: 1px solid #ccc; background-color: #f0f0f0; margin: 10px auto 20px; padding: 10px; }');
    printWindow.document.write('.selectedAnswer { color: blue; }');
    printWindow.document.write('.correctAnswer { color: green; }');
    printWindow.document.write('.incorrectAnswer { color: red; }');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');

    printWindow.document.write('<h1>Informe de Evaluación Equipo 1</h1>');
    printWindow.document.write('<h2>Resultados de la práctica</h2>');

    // Obtener la imagen del gráfico de radar
    const canvas = document.getElementById("radarChart");
    const imgData = canvas.toDataURL("image/png");
    printWindow.document.write('<div><img src="' + imgData + '" width="400" height="400"/></div>');

    // Añadir preguntas, respuestas seleccionadas y correctas
    const correctAnswers = {
        "Mando": ["Centro de Coordinación para la Vigilancia Marítima de Costas y Fronteras"],
        "Situacion": ["Redes Sociales y Televisión", "Aeropuerto de Ibiza", "Base de datos sobre matrícula del Barco y Bandera"],
        "Decision": ["Activación de medios de rescate SASEMAR", "Alerta Policía Nacional, Cruz Roja, CNI", "Envío de medios aéreos GC y alertar unidades de intervención GC-UEI"],
        "Comunicacion": ["Detectado barco Nodriza con inmigrantes se activa salvamento y rescate SASEMAR", "Se informa de activación medios aéreos GC para verificar peligrosidad traficantes", "Se informa de intervención de unidades GC para detener traficantes de personas"]
    };

    const selectedAnswers = {
        "Mando": selectedAnswersByCategory["Mando"] || [],
        "Situacion": selectedAnswersByCategory["Situacion"] || [],
        "Decision": selectedAnswersByCategory["Decision"] || [],
        "Comunicacion": selectedAnswersByCategory["Comunicacion"] || []
    };

    const sections = ['Mando', 'Situacion', 'Decision', 'Comunicacion'];
    sections.forEach(section => {
        printWindow.document.write('<h4>' + section + '</h4>');

        printWindow.document.write('<h5>Respuestas Seleccionadas</h5>');
        selectedAnswers[section].forEach(answer => {
            const isCorrect = correctAnswers[section].includes(answer);
            const answerClass = isCorrect ? 'correctAnswer' : 'incorrectAnswer';
            printWindow.document.write('<p class="' + answerClass + '">- ' + answer + '</p>');
        });

        printWindow.document.write('<h5>Respuestas Correctas</h5>');
        correctAnswers[section].forEach(answer => {
            printWindow.document.write('<p class="correctAnswer">- ' + answer + '</p>');
        });

        const correctCount = selectedAnswers[section].filter(answer => correctAnswers[section].includes(answer)).length;
        const score = (correctCount / correctAnswers[section].length) * 100;
        printWindow.document.write('<p><b>Porcentaje de Idoneidad: ' + score.toFixed(2) + '%</b></p>');
    });

    const totalSuitability = calculateTotalSuitability();
    printWindow.document.write('<h3><b>Idoneidad Total: ' + totalSuitability.toFixed(2) + '%</b></h3>');

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function updateChartWithRealData() {
    // Datos reales para el gráfico de radar
    const realData = [
        calculateScore("Comunicacion"),
        calculateScore("Situacion"),
        calculateScore("Decision"),
        calculateScore("Mando")
    ];
    window.myRadarChart.data.datasets[0].data = realData;
    window.myRadarChart.update();
}

function calculateScore(category) {
    const correctAnswers = {
        "Mando": ["Centro de Coordinación para la Vigilancia Marítima de Costas y Fronteras"],
        "Situacion": ["Redes Sociales y Televisión", "Aeropuerto de Ibiza", "Base de datos sobre matrícula del Barco y Bandera"],
        "Decision": ["Activación de medios de rescate SASEMAR", "Alerta Policía Nacional, Cruz Roja, CNI", "Envío de medios aéreos GC y alertar unidades de intervención GC-UEI"],
        "Comunicacion": ["Detectado barco Nodriza con inmigrantes se activa salvamento y rescate SASEMAR", "Se informa de activación medios aéreos GC para verificar peligrosidad traficantes", "Se informa de intervención de unidades GC para detener traficantes de personas"]
    };

    const selectedAnswers = selectedAnswersByCategory[category] || [];
    const correctCount = selectedAnswers.filter(answer => correctAnswers[category].includes(answer)).length;
    return (correctCount / correctAnswers[category].length) * 100;
}

function calculateTotalSuitability() {
    const categories = ["Mando", "Situacion", "Decision", "Comunicacion"];
    let totalScore = 0;

    categories.forEach(category => {
        totalScore += calculateScore(category);
    });

    return totalScore / categories.length;
}

let selectedAnswersByCategory = {};

function updateChart(formId, selectedAnswers) {
    const correctAnswers = {
        "examForm1": ["Centro de Coordinación para la Vigilancia Marítima de Costas y Fronteras"],
        "examForm2": ["Redes Sociales y Televisión", "Aeropuerto de Ibiza", "Base de datos sobre matrícula del Barco y Bandera"],
        "examForm3": ["Activación de medios de rescate SASEMAR", "Alerta Policía Nacional, Cruz Roja, CNI", "Envío de medios aéreos GC y alertar unidades de intervención GC-UEI"],
        "examForm4": ["Detectado barco Nodriza con inmigrantes se activa salvamento y rescate SASEMAR", "Se informa de activación medios aéreos GC para verificar peligrosidad traficantes", "Se informa de intervención de unidades GC para detener traficantes de personas"]
    };

    const categoryMap = {
        "examForm1": "Mando",
        "examForm2": "Situacion",
        "examForm3": "Decision",
        "examForm4": "Comunicacion"
    };
    const categoryIndex = {
        "examForm1": 3,
        "examForm2": 1,
        "examForm3": 2,
        "examForm4": 0
    };

    const correctCount = selectedAnswers.filter(answer => correctAnswers[formId].includes(answer)).length;
    const score = (correctCount / correctAnswers[formId].length) * 100;

    const index = categoryIndex[formId];
    window.myRadarChart.data.datasets[0].data[index] = score;
    window.myRadarChart.update();

    const category = categoryMap[formId];
    selectedAnswersByCategory[category] = selectedAnswers;

    document.getElementById(`score${category}`).textContent = `${score.toFixed(2)}%`;

    const totalScore = window.myRadarChart.data.datasets[0].data.reduce((a, b) => a + b);
    const percentageSuitability = (totalScore / 4).toFixed(2);  // Ajustado para 4 categorías
    document.getElementById('averagePercentage').textContent = `${percentageSuitability}%`;
}

function handleFormSubmit(event) {
    event.preventDefault();
    const formId = event.target.id;
    const selectedAnswers = Array.from(event.target.querySelectorAll('input:checked')).map(input => input.value);
    
    // Guardar las respuestas seleccionadas
    saveSelectedAnswers(formId, selectedAnswers);
    
    // Mover al siguiente ítem del carrusel
    const carousel = bootstrap.Carousel.getInstance(document.querySelector('#formCarousel'));
    carousel.next();
}


document.getElementById('examForm1').addEventListener('submit', handleFormSubmit);
document.getElementById('examForm2').addEventListener('submit', handleFormSubmit);
document.getElementById('examForm3').addEventListener('submit', handleFormSubmit);
document.getElementById('examForm4').addEventListener('submit', handleFormSubmit);

let selectedAnswersByForm = {};

function saveSelectedAnswers(formId, selectedAnswers) {
    selectedAnswersByForm[formId] = selectedAnswers;
}



document.addEventListener("DOMContentLoaded", function () {
    // Mapeo de las respuestas correctas para cada formulario
    const correctAnswersMap = {
        'examForm1': ['Centro de Coordinación para la Vigilancia Marítima de Costas y Fronteras'],
        'examForm2': ['Redes Sociales y Televisión', 'Aeropuerto de Ibiza', 'Base de datos sobre matrícula del Barco y Bandera'],
        'examForm3': ['Activación de medios de rescate SASEMAR', 'Alerta Policía Nacional, Cruz Roja, CNI', 'Envío de medios aéreos GC y alertar unidades de intervención GC-UEI'],
        'examForm4': ['Detectado barco Nodriza con inmigrantes se activa salvamento y rescate SASEMAR', 'Se informa de activación medios aéreos GC para verificar peligrosidad traficantes', 'Se informa de intervención de unidades GC para detener traficantes de personas']
    };

    function updateSelectedAnswers(selectedAnswers) {
        const selectedAnswersList = document.getElementById('selectedAnswersContent');
        selectedAnswersList.innerHTML = ''; // Limpiar respuestas anteriores

        selectedAnswers.forEach(answer => {
            const listItem = document.createElement('li');
            listItem.textContent = answer;
            selectedAnswersList.appendChild(listItem);
        });
    }

    function updateCorrectAnswers(correctAnswers) {
        const correctAnswersList = document.getElementById('correctAnswersContent');
        correctAnswersList.innerHTML = ''; // Limpiar respuestas anteriores

        correctAnswers.forEach(answer => {
            const listItem = document.createElement('li');
            listItem.textContent = answer;
            correctAnswersList.appendChild(listItem);
        });
    }


    // Añadir manejadores de envío de formulario para cada formulario
    document.querySelectorAll("form[id^='examForm']").forEach(form => {
        form.addEventListener("submit", handleFormSubmit);
    });
});


document.addEventListener("DOMContentLoaded", function () {
    let progress = 0;

    // Encuentra todos los formularios en la página
    const forms = document.querySelectorAll("form[id^='examForm']");
    const consolidateButton = document.getElementById('consolidateButton');
    const showAnswersButton = document.getElementById('showAnswersButton');
    const printAnswersButton = document.getElementById('printAnswersButton');
    const printReportButton = document.getElementById('printReportButton');
    const progressBar = document.getElementById('progressBar');
    const resultsSection = document.getElementById('resultsSection');
    const spinner = document.getElementById('spinner');

    // Manejar clics en las tarjetas
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function () {
            const target = card.getAttribute('data-target');
            const formSection = document.getElementById(target);
            if (formSection) {
                formSection.classList.toggle('d-none');
            }
        });
    });

    forms.forEach(form => {
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true; // Deshabilitar el botón de envío inicialmente

        form.addEventListener("change", function () {
            const isValid = validateFormSelection(form);
            submitButton.disabled = !isValid; // Habilitar el botón de envío solo si el formulario es válido
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            // Incrementa el progreso en un 25%
            progress = Math.min(progress + 25, 100);

            // Lógica para manejar el envío de respuestas
            const formData = new FormData(form);
            const isValid = validateFormData(formData);

            // Actualiza la barra de progreso
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
            progressBar.textContent = `${progress}%`;

            // Mostrar los botones cuando el progreso llegue al 100%
            if (progress === 100) {
                setTimeout(() => {
                    progressBar.parentElement.style.display = 'none'; // Ocultar la barra de progreso
                    consolidateButton.style.display = 'block';
                    showAnswersButton.style.display = 'block';
                    printAnswersButton.style.display = 'block';
                    printReportButton.style.display = 'block'; // Mostrar el botón de imprimir informe
                }, 1000);
            }
        });
    });

    consolidateButton.addEventListener("click", function () {
        consolidateButton.style.display = 'none'; showAnswersButton.style.display = 'none'; printAnswersButton.style.display = 'none';
        spinner.style.display = 'block';

        // Bloquear todos los formularios
        forms.forEach(form => {
            const elements = form.elements;
            for (let i = 0; i < elements.length; i++) {
                elements[i].disabled = true;
            }
        });

        // Mostrar el contenedor del gráfico de radar después de 2.5 segundos
        setTimeout(() => {
            spinner.style.display = 'none';
            resultsSection.style.display = 'block';
        }, 1500);
    });
});

function validateFormSelection(form) {
    const formId = form.getAttribute('id');
    let requiredSelections = 1; // Número predeterminado de selecciones necesarias

    if (formId === 'examForm2' || formId === 'examForm3' || formId === 'examForm4') {
        requiredSelections = 3; // Número de selecciones necesarias para preguntas de selección múltiple
    }

    const selectedOptions = form.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
    return selectedOptions.length === requiredSelections;
}

function validateFormData(formData) {
    // Lógica para validar los datos del formulario
    for (const entry of formData.entries()) {
        if (!entry[1]) {
            return false;
        }
    }
    return true;
}

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


function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    if (password === "cugc") {
        alert("Contraseña correcta. Procediendo a corregir la evaluación...");
        correctEvaluation();
        document.getElementById('printReportButton').disabled = false; // Habilitar el botón de imprimir informe

        const passwordModal = bootstrap.Modal.getInstance(document.getElementById('passwordModal'));
        passwordModal.hide();
        
    } else {
        alert("Contraseña incorrecta. Inténtalo de nuevo.");
        document.getElementById('passwordInput').value = ''; // Limpiar el campo de entrada
    }
}




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
