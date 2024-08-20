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



