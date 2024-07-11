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
        consolidateButton.style.display = 'none';
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
        }, 2500);
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
    const password = prompt("Por favor, introduce la contraseña:");
    if (password === "CUGC") {
        alert("Contraseña correcta. Procediendo a corregir la evaluación...");
        correctEvaluation();
    } else {
        alert("Contraseña incorrecta. Inténtalo de nuevo.");
        validatePassword(); // Vuelve a pedir la contraseña
    }
}

function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    if (password === "CUGC") {
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

function toggleSelectedAnswersDisplay() {
    const selectedAnswersContainer = document.getElementById('selectedAnswersContainer');
    const showAnswersButton = document.getElementById('showAnswersButton');

    if (selectedAnswersContainer.style.display === 'none' || selectedAnswersContainer.style.display === '') {
        showSelectedAnswers();
        showAnswersButton.textContent = 'Ocultar respuestas';
    } else {
        selectedAnswersContainer.style.display = 'none';
        showAnswersButton.textContent = 'Mostrar respuestas';
    }
}

function showSelectedAnswers() {
    const selectedAnswersContainer = document.getElementById('selectedAnswersContainer');
    const selectedAnswersContent = document.getElementById('selectedAnswersContent');

    const sections = ['Mando y Control', 'Situación', 'Decisión', 'Comunicación'];
    selectedAnswersContent.innerHTML = ''; // Limpiar contenido previo

    sections.forEach(section => {
        const form = document.querySelector(`#examForm${sections.indexOf(section) + 1}`);
        const selectedInputs = form.querySelectorAll('input:checked');

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
    });

    selectedAnswersContainer.style.display = 'block'; // Mostrar el contenedor
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
    const printContent = showPrintSelectedAnswers();

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
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}
