document.addEventListener('DOMContentLoaded', function () {
    const initialData = [0, 0, 0, 0];
    const labels = ["Comunicación", "Situación", "Decisión", "Mando y Control"];
    drawRadarChart(initialData, labels);
});

function drawRadarChart(data, labels) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const chart = new Chart(ctx, {
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
    window.myRadarChart = chart;
}

function showChart() {
    document.getElementById('resultsSection').style.display = 'block';
    const data = [65, 59, 80, 81]; // Datos de ejemplo
    const labels = ['Mando y Control', 'Situación', 'Decisión', 'Comunicación'];
    drawRadarChart(data, labels);
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Informe de Evaluación", 10, 10);
    doc.text("Resultados de la práctica", 10, 20);

    // Obtener la imagen del gráfico de radar
    const canvas = document.getElementById("radarChart");
    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, 'PNG', 10, 30, 180, 160);

    doc.save("informe_evaluacion.pdf");
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
    const percentageSuitability = (totalScore / 40 * 10).toFixed(2);
    document.getElementById('averagePercentage').textContent = `${percentageSuitability}%`;
}

function toggleAnswers() {
    const answersDiv = document.getElementById('correctAnswers');
    const button = document.getElementById('correctButton');
    const show = answersDiv.style.display === "none";

    answersDiv.style.display = show ? "block" : "none";
    button.textContent = show ? "Ocultar Respuestas" : "Mostrar Respuestas";

    if (show) {
        fillAnswers(true);
    } else {
        clearAnswers();
    }
}

function fillAnswers(animate) {
    const correctAnswers = {
        "Mando": ["Centro de Coordinación para la Vigilancia Marítima de Costas y Fronteras"],
        "Situacion": ["Redes Sociales y Televisión", "Aeropuerto de Ibiza", "Base de datos sobre matrícula del Barco y Bandera"],
        "Decision": ["Activación de medios de rescate SASEMAR", "Alerta Policía Nacional, Cruz Roja, CNI", "Envío de medios aéreos GC y alertar unidades de intervención GC-UEI"],
        "Comunicacion": ["Detectado barco Nodriza con inmigrantes se activa salvamento y rescate SASEMAR", "Se informa de activación medios aéreos GC para verificar peligrosidad traficantes", "Se informa de intervención de unidades GC para detener traficantes de personas"]
    };

    const sections = ['Mando', 'Situacion', 'Decision', 'Comunicacion'];
    let delay = 0;

    sections.forEach(section => {
        const list = document.getElementById(`answer${section}`);
        list.innerHTML = '';

        correctAnswers[section].forEach(answer => {
            const listItem = document.createElement('li');
            listItem.textContent = answer;
            listItem.className = 'answerReveal';
            list.appendChild(listItem);

            if (animate) {
                listItem.style.opacity = 0;
                listItem.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    listItem.style.opacity = 1;
                    listItem.style.transform = 'translateX(0)';
                }, delay);
                delay += 1000;
            }
        });
    });
}

function clearAnswers() {
    const lists = document.querySelectorAll('#correctAnswers ul li');
    let delay = 0;

    lists.forEach(listItem => {
        listItem.classList.add('hiddenAnswer');
        setTimeout(() => {
            listItem.style.display = 'none';
        }, delay);
        delay += 100;
    });

    setTimeout(() => {
        lists.forEach(list => list.parentElement.innerHTML = '');
        document.getElementById('correctAnswers').style.display = 'none';
    }, delay);
}

function toggleSelectedAnswers(category) {
    const list = document.getElementById(`selected${category}`);
    const button = event.currentTarget;
    const show = !list.classList.contains("show");

    list.classList.toggle("show", show);
    button.textContent = show ? "−" : "+";

    if (show) {
        fillSelectedAnswers(category);
    }
}

function fillSelectedAnswers(category) {
    const answers = selectedAnswersByCategory[category];
    const list = document.getElementById(`selected${category}`);
    list.innerHTML = '';

    answers.forEach((answer, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = answer;
        setTimeout(() => {
            list.appendChild(listItem);
        }, index * 100);
    });
}