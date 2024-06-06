document.addEventListener("DOMContentLoaded", function () {
    let progress = 0;

    // Encuentra todos los formularios en la página
    const forms = document.querySelectorAll("form[id^='examForm']");
    const consolidateButton = document.getElementById('consolidateButton');
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

            // Mostrar el botón de corregir respuestas cuando el progreso llegue al 100%
            if (progress === 100) {
                consolidateButton.style.display = 'block';
            }
        });
    });

    consolidateButton.addEventListener("click", function () {
        consolidateButton.style.display = 'none';
        spinner.style.display = 'block';

        // Mostrar el contenedor del gráfico de radar después de 3.5 segundos
        setTimeout(() => {
            spinner.style.display = 'none';
            resultsSection.style.display = 'block';
        }, 3500);
    });

    showChartButton.addEventListener("click", function () {
        const radarChartDiv = document.getElementById('div1_2');
        radarChartDiv.style.display = 'block';
        showChartButton.style.display = 'none';
    });


});