document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
    const formSections = document.querySelectorAll(".form-section");

    const options = [
        // Opciones para la pregunta de Situación (2)
        ["Aeropuerto de Argel", "Redes Sociales y Televisión", "Aeropuerto de Ibiza", "Aeropuerto de Alicante", "Policía Municipal de Ibiza	", "Puerto de Valencia", "Cuartel OTAN de Bétera (Valencia)", "Base de datos sobre matrícula del Barco y Bandera", "Puerto de Ibiza"
        ],
        // Opciones para la pregunta de Decisión (3)
        ["Activación de la Unidad Militar de Emergencias", "Activación de medios de rescate SASEMAR", "Alertar a la Casa África", "Informar al Departamento de Seguridad Nacional", "Alerta Policía Nacional, Cruz Roja, CNI", "Activar aviones de combate del ejercito del Aire y del Espacio", "Envío de medios aéreos GC y alertar unidades de intervención GC-UEI", "Activar los medios de la Armada Española", "Alertar Guardacostas de Argelia"],
        // Opciones para la pregunta de Comunicación (4)
        ["No se debe realizar ninguna declaración institucional", "Detectado barco Nodriza con inmigrantes se activa salvamento y rescate SASEMAR", "Solo realizar declaración institucional al finalizar la intervención", "Se informa de activación medios aéreos GC para verificar peligrosidad traficantes", "Se informa de coordinación con autoridades de Argelia ", "Se informa de intervención de unidades GC para detener traficantes de personas", "Se informa del origen de las fuentes", "Se informa de posibles victimas", "Se informa en redes sociales de actuaciones en casa instante"]
    ];

    formSections.forEach(section => section.classList.add('hidden'));

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

            checkbox.addEventListener("change", function () {
                const checkedCheckboxes = questionDiv.querySelectorAll('input[type="checkbox"]:checked');
                questionDiv.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    cb.disabled = checkedCheckboxes.length >= 3 && !cb.checked;
                    cb.parentNode.classList.toggle("disabled-checkbox", cb.disabled);
                });
            });
        });
    }

    options.forEach((optionsList, index) => generateOptions(index, optionsList));

    document.querySelectorAll("form[id^='examForm']").forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const currentFormSection = form.parentElement;
            const formData = new FormData(form);
            const selectedAnswers = [];

            formData.forEach((value, key) => {
                selectedAnswers.push(value);
            });

            updateChart(form.id, selectedAnswers);

            currentFormSection.classList.add('fade-out');
            setTimeout(() => {
                currentFormSection.classList.remove('active');
                currentFormSection.classList.add('hidden');
                currentFormSection.classList.remove('fade-out');
            }, 500);

            $('#confirmationModal').modal('show');

            let countdown = 5;
            const countdownElement = document.getElementById('countdown');

            const timer = setInterval(() => {
                countdownElement.textContent = countdown--;
                if (countdown < 0) {
                    clearInterval(timer);
                    window.close();
                }
            }, 1000);
        });
    });


});