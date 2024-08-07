document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card, .card-button");
    const carousel = new bootstrap.Carousel(document.querySelector('#formCarousel'), {
        interval: false
    });

    // Manejador de clic en las tarjetas y botones para abrir el formulario correspondiente
    cards.forEach(card => {
        card.addEventListener("click", function (event) {
            event.preventDefault();
            const targetFormId = card.closest('.card').dataset.target;
            const targetForm = document.getElementById(targetFormId);
            const targetIndex = Array.from(targetForm.parentElement.children).indexOf(targetForm);

            // Activar el carrusel en el índice correspondiente
            carousel.to(targetIndex);
        });
    });

    // Configuración del envío del formulario y actualización del gráfico
    document.querySelectorAll("form[id^='examForm']").forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const selectedAnswers = Array.from(form.querySelectorAll('input:checked')).map(input => input.value);
            updateChart(form.id, selectedAnswers);

            // Mover al siguiente ítem del carrusel
            carousel.next();
        });
    });
});
