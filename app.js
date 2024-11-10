// Variable global para almacenar la foto temporal
let tempPhoto = null;

// Función para abrir un módulo y ocultar el título
function openModule(module) {
    const moduleContainer = document.getElementById('module-container');
    document.querySelector('.menu').style.display = 'none'; // Oculta el menú principal
    document.getElementById('app-title').style.display = 'none'; // Oculta el título
    
    let html = '';
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

// Función para abrir la imagen en un modal
function openImageModal(imageSrc) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    modal.style.display = 'flex';
    modalImage.src = imageSrc;
}

// Función para cerrar el modal de imagen
function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
}

// Funciones de renderizado para cada módulo
function renderVerificaciones() {
    return `
        <h2>Verificaciones</h2>
        ${renderUnidadSelect()}
        <textarea id="observaciones" placeholder="Observaciones"></textarea>
        <div class="photo-preview">
            <img id="photo-preview-img" style="display: none;" />
            <button onclick="takePhoto()">Seleccionar Foto del Comprobante</button>
            <p id="photo-status">No se ha seleccionado ninguna foto</p>
        </div>
        <button onclick="saveRecord('verificacion')">Guardar</button>
        <button onclick="closeModule()">Regresar al menú principal</button>
    `;
}

function renderMantenimientos() {
    return `
        <h2>Servicios o Mantenimientos</h2>
        ${renderUnidadSelect()}
        <textarea id="observaciones" placeholder="Observaciones"></textarea>
        <div class="photo-preview">
            <img id="photo-preview-img" style="display: none;" />
            <button onclick="takePhoto()">Seleccionar Foto del Comprobante</button>
            <p id="photo-status">No se ha seleccionado ninguna foto</p>
        </div>
        <button onclick="saveRecord('mantenimiento')">Guardar</button>
        <button onclick="closeModule()">Regresar al menú principal</button>
    `;
}

function renderCombustibles() {
    return `
        <h2>Registros de Combustibles</h2>
        ${renderUnidadSelect()}
        <textarea id="observaciones" placeholder="Observaciones"></textarea>
        <input type="number" id="litros" placeholder="Litros">
        <input type="number" id="costo" placeholder="Costo en pesos">
        <div class="photo-preview">
            <img id="photo-preview-img" style="display: none;" />
            <button onclick="takePhoto()">Seleccionar Foto del Recibo</button>
            <p id="photo-status">No se ha seleccionado ninguna foto</p>
        </div>
        <button onclick="saveRecord('combustible')">Guardar</button>
        <button onclick="closeModule()">Regresar al menú principal</button>
    `;
}

function renderReportes() {
    return `
        <h2>Reportes de Unidades</h2>
        ${renderUnidadSelect()}
        <button onclick="generateReport()">Ver Reporte</button>
        <button class="regresar" onclick="closeModule()">Regresar al menú principal</button>
        <div id="report-table-verificaciones-mantenimientos"></div>
        <h3>Registros de Combustibles</h3>
        <div id="report-table-combustibles"></div>
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

// Función para seleccionar una foto y mostrar la vista previa
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
                tempPhoto = reader.result; // Almacena temporalmente la imagen en base64
                displayPhotoPreview(tempPhoto); // Muestra la vista previa
                document.getElementById("photo-status").textContent = "Foto seleccionada";
            };
            reader.readAsDataURL(file);
        }
    };
}

// Función para mostrar la vista previa de la foto seleccionada
function displayPhotoPreview(photo) {
    const photoPreviewImg = document.getElementById("photo-preview-img");
    photoPreviewImg.src = photo;
    photoPreviewImg.style.display = "block";
}

// Función para guardar el registro en localStorage
function saveRecord(type) {
    const unidad = document.getElementById('unidad').value;
    const observaciones = document.getElementById('observaciones').value;
    const photo = tempPhoto || "Sin foto";

    const record = {
        type,
        unidad,
        observaciones,
        photo,
        date: new Date().toLocaleString()
    };

    // Agregar campos adicionales para combustibles
    if (type === 'combustible') {
        record.litros = document.getElementById('litros').value;
        record.costo = document.getElementById('costo').value;
    }

    const records = JSON.parse(localStorage.getItem("records") || "[]");
    records.push(record);
    localStorage.setItem("records", JSON.stringify(records));

    alert(`Registro de ${type} guardado exitosamente.`);
    
    // Limpia la foto temporal después de guardar
    tempPhoto = null;
    document.getElementById("photo-preview-img").style.display = "none";
    document.getElementById("photo-status").textContent = "No se ha seleccionado ninguna foto";

    closeModule(); // Cierra el módulo y regresa al menú principal
}

// Función para generar un reporte y mostrar los registros en dos tablas separadas
function generateReport() {
    const records = JSON.parse(localStorage.getItem("records") || "[]");
    const unidad = document.getElementById('unidad').value;
    const filteredRecords = records.filter(record => record.unidad === unidad);

    // Tabla para verificaciones y mantenimientos
    const reportTableVM = document.getElementById('report-table-verificaciones-mantenimientos');
    let tableVMHTML = `
        <div class="table-container">
            <table>
                <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Observaciones</th>
                    <th>Comprobante</th>
                </tr>
    `;
    filteredRecords.forEach(record => {
        if (record.type !== 'combustible') {
            const photoHTML = record.photo !== "Sin foto" ? `<img src="${record.photo}" alt="Comprobante" class="comprobante-img" onclick="openImageModal('${record.photo}')">` : "Sin foto";
            tableVMHTML += `
                <tr>
                    <td>${record.date}</td>
                    <td>${record.type}</td>
                    <td>${record.observaciones}</td>
                    <td>${photoHTML}</td>
                </tr>
            `;
        }
    });
    tableVMHTML += `</table></div>`;
    reportTableVM.innerHTML = tableVMHTML;

    // Tabla para combustibles
    const reportTableCombustibles = document.getElementById('report-table-combustibles');
    let tableCombustiblesHTML = `
        <div class="table-container">
            <table>
                <tr>
                    <th>Fecha</th>
                    <th>Litros</th>
                    <th>Costo</th>
                    <th>Observaciones</th>
                    <th>Comprobante</th>
                </tr>
    `;
    filteredRecords.forEach(record => {
        if (record.type === 'combustible') {
            const photoHTML = record.photo !== "Sin foto" ? `<img src="${record.photo}" alt="Comprobante" class="comprobante-img" onclick="openImageModal('${record.photo}')">` : "Sin foto";
            tableCombustiblesHTML += `
                <tr>
                    <td>${record.date}</td>
                    <td>${record.litros || "N/A"}</td>
                    <td>${record.costo || "N/A"}</td>
                    <td>${record.observaciones}</td>
                    <td>${photoHTML}</td>
                </tr>
            `;
        }
    });
    tableCombustiblesHTML += `</table></div>`;
    reportTableCombustibles.innerHTML = tableCombustiblesHTML;
}

// Función para cerrar el módulo, limpiar el contenedor y mostrar el título
function closeModule() {
    document.getElementById('module-container').innerHTML = ''; // Limpia el contenedor
    document.querySelector('.menu').style.display = 'flex'; // Muestra el menú principal
    document.getElementById('app-title').style.display = 'block'; // Muestra el título
}
