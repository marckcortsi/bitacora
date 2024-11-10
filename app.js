// Función para abrir un módulo y mostrar su contenido en el contenedor principal
function openModule(module) {
    const moduleContainer = document.getElementById('module-container');
    let html = '';
    document.querySelector('.menu').style.display = 'none'; // Oculta el menú principal
    
    switch (module) {
        case 'verificaciones':
            html = renderVerificaciones();
            break;
        case 'mantenimientos':
            html = renderMantenimientos();
            break;
        case 'combustibles':
            html = renderCombustibles();
            break;
        case 'reportes':
            html = renderReportes();
            break;
    }
    moduleContainer.innerHTML = html;
}

// Funciones de renderizado para cada módulo
function renderVerificaciones() {
    return `
        <h2>Verificaciones</h2>
        ${renderUnidadSelect()}
        <textarea id="observaciones" placeholder="Observaciones"></textarea>
        <button onclick="takePhoto()">Foto del Comprobante</button>
        <button onclick="saveRecord('verificacion')">Guardar</button>
        <button class="regresar" onclick="closeModule()">Regresar al menú principal</button>
    `;
}

function renderMantenimientos() {
    return `
        <h2>Servicios o Mantenimientos</h2>
        ${renderUnidadSelect()}
        <textarea id="observaciones" placeholder="Observaciones"></textarea>
        <button onclick="takePhoto()">Foto del Comprobante</button>
        <button onclick="saveRecord('mantenimiento')">Guardar</button>
        <button class="regresar" onclick="closeModule()">Regresar al menú principal</button>
    `;
}

function renderCombustibles() {
    return `
        <h2>Registros de Combustibles</h2>
        ${renderUnidadSelect()}
        <textarea id="observaciones" placeholder="Observaciones"></textarea>
        <input type="number" id="litros" placeholder="Litros">
        <input type="number" id="costo" placeholder="Costo en pesos">
        <button onclick="takePhoto()">Foto del Recibo</button>
        <button onclick="saveRecord('combustible')">Guardar</button>
        <button class="regresar" onclick="closeModule()">Regresar al menú principal</button>
    `;
}

function renderReportes() {
    return `
        <h2>Reportes de Unidades</h2>
        ${renderUnidadSelect()}
        <button onclick="generateReport()">Ver Reporte</button>
        <button class="regresar" onclick="closeModule()">Regresar al menú principal</button>
        <div id="report-table"></div>
    `;
}

function renderUnidadSelect() {
    return `
        <select id="unidad">
            <option value="Nissan JV18189">Nissan JV18189</option>
            <option value="Camión JY11730">Camión JY11730</option>
            <option value="Chevrolet 3/2 JN10523">Chevrolet 3/2 JN10523</option>
            <option value="Nissan Versa JVC5863">Nissan Versa JVC5863</option>
            <option value="Nissan Suru JGM7608">Nissan Suru JGM7608</option>
        </select>
    `;
}

// Función para tomar una foto y almacenar su base64
function takePhoto() {
    const takePicture = document.createElement("input");
    takePicture.type = "file";
    takePicture.accept = "image/*";
    takePicture.capture = "environment";
    takePicture.click();
    
    takePicture.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                localStorage.setItem("photo", reader.result); // Guarda la imagen en base64
                alert("Foto guardada");
            };
            reader.readAsDataURL(file);
        }
    };
}

// Función para guardar el registro en localStorage
function saveRecord(type) {
    const unidad = document.getElementById('unidad').value;
    const observaciones = document.getElementById('observaciones').value;
    const photo = localStorage.getItem("photo") || "Sin foto";

    const record = {
        type,
        unidad,
        observaciones,
        photo,
        date: new Date().toLocaleString()
    };

    const records = JSON.parse(localStorage.getItem("records") || "[]");
    records.push(record);
    localStorage.setItem("records", JSON.stringify(records));

    alert(`Registro de ${type} guardado exitosamente.`);
    
    closeModule(); // Cierra el módulo y regresa al menú principal
}

// Función para generar un reporte y mostrar los registros en una tabla
function generateReport() {
    const records = JSON.parse(localStorage.getItem("records") || "[]");
    const unidad = document.getElementById('unidad').value;
    const filteredRecords = records.filter(record => record.unidad === unidad);

    const reportTable = document.getElementById('report-table');
    if (filteredRecords.length) {
        let tableHTML = `
            <table>
                <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Observaciones</th>
                    <th>Comprobante</th>
                </tr>
        `;

        filteredRecords.forEach(record => {
            const photoHTML = record.photo !== "Sin foto" ? `<img src="${record.photo}" alt="Comprobante" class="comprobante-img">` : "Sin foto";
            tableHTML += `
                <tr>
                    <td>${record.date}</td>
                    <td>${record.type}</td>
                    <td>${record.observaciones}</td>
                    <td>${photoHTML}</td>
                </tr>
            `;
        });

        tableHTML += `</table>`;
        reportTable.innerHTML = tableHTML;
    } else {
        reportTable.innerHTML = "<p>No hay registros para esta unidad.</p>";
    }
}

// Función para cerrar el módulo y limpiar el contenedor
function closeModule() {
    document.getElementById('module-container').innerHTML = ''; // Limpia el contenedor
    document.querySelector('.menu').style.display = 'flex'; // Muestra el menú principal nuevamente
}
