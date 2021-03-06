let map;

let aviones = [];
let coordenadas = {
    lat: 23.289674,
    lng: -101.793495
};

let limites = {
    north: 50,
    south: -5,
    west: -159,
    east: -54,
};

let propiedades = {
    center: coordenadas,
    zoom: 5,
    restriction: {
        latLngBounds: limites,
        strictBounds: false,
    },
};

let selectedAvion = {
    color: 'rgba(0,0,0,0)',
    nombre: '',
    coordenadas: null
};

let fecha = null;

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = async function () {
    modal.style.display = "block";
    await delay(1);
    modal.style.opacity = 1;
}

// When the user clicks on <span> (x), close the modal
span.onclick = async function () {
    modal.style.opacity = 0;
    await delay(500);
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = async function (event) {
    if (event.target == modal) {
        modal.style.opacity = 0;
        await delay(500);
        modal.style.display = "none";
    }
}

llenarUsuario = () => {
    let usuario = JSON.parse(sessionStorage.getItem('usuario'));
    console.log(JSON.stringify(usuario));

    document.getElementById('txtUserName').innerHTML = `Nombre: ${usuario.nombre}`;
    document.getElementById('txtUserEdad').innerHTML = `Edad: ${usuario.edad}`;
    document.getElementById('txtUserCurp').innerHTML = `CURP: ${usuario.curp}`;
    document.getElementById('txtUserTel').innerHTML = `Teléfono: ${usuario.telefono}`;
    document.getElementById('txtUserEmail').innerHTML = `Email: ${usuario.email}`;
}

salir = () => {
    sessionStorage.clear();
    window.location = '../pages/login.html';
}

iniciaMapa = async () => {
    const uri =
        "https://opensky-network.org/api/states/all?lamin=12.754424&lomin=-127.415227&lamax=32.720980&lomax=-86.76";


    fecha = Math.round(new Date().getTime() / 1000);

    const res = await fetch(uri);
    const data = await res.json();

    aviones = filtrarAviones(data.states);
    console.log(aviones);
    hideLoading();
    showDate();

    map = new google.maps.Map(document.getElementById('map'), propiedades);
    map.setOptions({
        minZoom: 5
    });

    const centerControlDiv = document.createElement("div");
    centerControl(centerControlDiv, map);

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

    addMarkers();
}

showDate = async () => {
    let date = new Date();

    let dformat = `${
        (date.getMonth() + 1).toString().padStart(2, '0')}/${
        date.getDate().toString().padStart(2, '0')}/${
        date.getFullYear().toString().padStart(4, '0')} ${
        date.getHours().toString().padStart(2, '0')}:${
        date.getMinutes().toString().padStart(2, '0')}:${
        date.getSeconds().toString().padStart(2, '0')}`;
    await delay(1000);
    document.getElementById('txtFecha').innerHTML = `Actualizado: ${dformat}`;
    document.getElementById('txtFecha').style.opacity = 1;
    document.getElementById('divFecha').appendChild(document.createElement('hr'));
}

filtrarAviones = (avionesFetch) => {
    let aviones = [];
    for (let element of avionesFetch) {

        let m1, m2;

        if (element[5] <= -114.719231) {
            aviones.push(element);
        } else if (element[5] > -114.719231 && element[5] <= -111.077301) {
            let lat1 = 32.720980,
                lat2 = 31.337595,
                lon1 = -114.719231,
                lon2 = -111.077301;
            m1 = (lat2 - lat1) / (lon2 - lon1);
            m2 = (lat2 - element[6]) / (lon2 - element[5]);

            if (m2 >= m1) {
                aviones.push(element);
            }
        } else if (element[5] > -111.077301 && element[5] <= -108.216421) {
            let lat = 31.337595

            if (element[6] <= lat) {
                aviones.push(element);
            }
        } else if (element[5] > -108.216421 && element[5] <= -106.186345) {
            let lat = 31.816997;

            if (element[6] <= lat) {
                aviones.push(element);
            }
        } else if (element[5] > -106.186345 && element[5] <= -103.653327) {
            let lat1 = 31.816997,
                lat2 = 29.884509,
                lon1 = -106.186345,
                lon2 = -103.653327;
            m1 = (lat2 - lat1) / (lon2 - lon1);
            m2 = (lat2 - element[6]) / (lon2 - element[5]);

            if (m2 >= m1) {
                aviones.push(element);
            }
        } else if (element[5] > -103.653327 && element[5] <= -101.079160) {
            let lat = 29.884509;

            if (element[6] <= lat) {
                aviones.push(element);
            }
        } else if (element[5] > -101.079160 && element[5] <= -97.785928) {
            let lat1 = 29.884509,
                lat2 = 26.513094,
                lon1 = -101.079160,
                lon2 = -97.785928;
            m1 = (lat2 - lat1) / (lon2 - lon1);
            m2 = (lat2 - element[6]) / (lon2 - element[5]);

            if (m2 >= m1) {
                aviones.push(element);
            }
        } else if (element[5] > -97.785928 && element[5] <= -95.065192) {
            let lat1 = 26.513094,
                lat2 = 29.659108,
                lon1 = -97.785928,
                lon2 = -95.065192;
            m1 = (lat2 - lat1) / (lon2 - lon1);
            m2 = (lat2 - element[6]) / (lon2 - element[5]);

            if (m2 >= m1) {
                aviones.push(element);
            }
        } else {
            let lat = 29.463625;

            if (element[6] <= lat) {
                aviones.push(element);
            }
        }
    }
    return aviones;
}

addMarkers = () => {
    aviones.forEach((element, index) => {
        let latLng = new google.maps.LatLng(element[6], element[5]); //Makes a latlng
        let color = randomColor();

        let marker = new google.maps.Marker({
            map: map,
            position: latLng,
            title: `${index + 1} ${element[2]}`,
            icon: {
                url: `http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`
            }
        });

        marker.addListener('click', () => {
            drawDetalles(element, index, `#${color}`, latLng);
        });

        marker.addListener('mouseover', () => {
            drawTitle(`#${color}`, `${index + 1} ${element[2]}`);
        });

        marker.addListener('mouseout', () => {
            drawTitle(selectedAvion.color, selectedAvion.nombre);
        });
    });
}

randomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

drawTitle = (color, nombre) => {
    let divCuadrado = document.getElementById('divCuadrado');
    let txtTitulo = document.getElementById('txtTitulo');

    divCuadrado.style.backgroundColor = color;
    txtTitulo.innerHTML = nombre;

    if (nombre != '') {
        divCuadrado.style.cursor = 'pointer';
        divCuadrado.addEventListener('click', () => {
            map.panTo(selectedAvion.coordenadas); //Make map global
            map.setZoom(8);
        });
    }
}

drawDetalles = async (avion, index, color, latLng) => {
    map.panTo(latLng); //Make map global
    map.setZoom(8);
    selectedAvion.color = color;
    selectedAvion.nombre = `${index + 1} ${avion[2]}`;
    selectedAvion.coordenadas = latLng;

    document.getElementById('divDetalles').style.opacity = 0;
    await delay(500);
    document.getElementById('divDetalles').style.opacity = 1;

    document.getElementById('txtIcao').innerHTML = `D. ICAO24: ${avion[0].toUpperCase()}`;
    document.getElementById('txtPais').innerHTML = `País: ${avion[2]}`;
    avion[3] != null ? document.getElementById('txtLastContact').innerHTML = `Último contacto: ${fecha - avion[3]}s` : document.getElementById('txtLastContact').innerHTML = 'Último contacto: No disp';
    document.getElementById('txtLongitud').innerHTML = `Longitud: ${avion[5]}`;
    document.getElementById('txtLatitud').innerHTML = `Latitud: ${avion[6]}`;
    avion[7] != null ? document.getElementById('txtAltitud').innerHTML = `Altitud bar: ${avion[7]}m` : document.getElementById('txtAltitud').innerHTML = 'Altitud bar: No disp';
    avion[9] != null ? document.getElementById('txtVelocidad').innerHTML = `Velocidad: ${avion[9]}m/s` : document.getElementById('txtVelocidad').innerHTML = 'Velocidad: No disp';
    avion[10] != null ? document.getElementById('txtCurso').innerHTML = `Curso: ${avion[10]}°` : document.getElementById('txtCurso').innerHTML = 'Curso: No disp';
    avion[11] != null ? document.getElementById('txtTasaAscenso').innerHTML = `Tasa Ascenso: ${avion[11]}m/s` : document.getElementById('txtTasaAscenso').innerHTML = 'Tasa Ascenso: No disp';
    avion[14] != null ? document.getElementById('txtCode').innerHTML = `Cod Squawk: ${avion[14]}` : document.getElementById('txtCode').innerHTML = 'Cod Squawk: No disp';
}

centerControl = (controlDiv) => {
    // Set CSS for the control border.
    const controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginTop = "8px";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click para reestablecer el mapa";
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(102, 102, 102)";
    controlText.style.fontWeight = 'bold';
    controlText.style.fontFamily = "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "CENTRAR MAPA";
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
        map.panTo(coordenadas); //Make map global
        map.setZoom(5);
    });
}

hideLoading = async () => {
    const loading = document.getElementById('loading');
    loading.style.opacity = 0;
    await delay(1000);
    loading.remove();
    document.getElementById('map').style.opacity = 1;
}

const delay = (ms) => new Promise(res => setTimeout(res, ms));