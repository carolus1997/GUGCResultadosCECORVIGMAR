document.addEventListener("DOMContentLoaded", function () {
    let progress = 0;

    // Encuentra todos los formularios en la página
    // Encuentra todos los formularios en la página
    const forms = document.querySelectorAll("form[id^='examForm']");
    const consolidateButton = document.getElementById('consolidateButton');
    const showAnswersButton = document.getElementById('showAnswersButton');
    const printAnswersButton = document.getElementById('printAnswersButton');
    const progressBar = document.getElementById('progressBar');
    const resultsSection = document.getElementById('resultsSection');
    const spinner = document.getElementById('spinner');

    forms.forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            // Incrementa el progreso en un 25%
            progress = Math.min(progress + 25, 100);

            // Actualiza la barra de progreso
            const progressBar = document.getElementById('progressBar');
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

    showChartButton.addEventListener("click", function () {
        const radarChartDiv = document.getElementById('div1_2');
        radarChartDiv.style.display = 'block';
        showChartButton.style.display = 'none';
    });

});

function validatePassword() {
    const password = prompt("Por favor, introduce la contraseña:");
    if (password === "CUGC") {
        alert("Contraseña correcta. Procediendo a corregir la evaluación...");
        correctEvaluation();
    
    } else {
        alert("Contraseña incorrecta. Inténtalo de nuevo.");
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