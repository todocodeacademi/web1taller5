document.addEventListener('DOMContentLoaded', function() {
    const vistaBotones = document.getElementById('vista-botones');
    const calendarioAnual = document.getElementById('calendario-anual');
    const calendarioMensual = document.getElementById('calendario-mensual');
    const calendarioDiario = document.getElementById('calendario-diario');
    const contenedorFormularioEvento = document.getElementById('contenedor-formulario-evento');
    const formularioEvento = document.getElementById('formulario-evento');
    const botonCancelar = document.getElementById('boton-cancelar');
    const tituloFormulario = document.getElementById('titulo-formulario');
    const entradaTituloEvento = document.getElementById('titulo-evento');
    const entradaFechaEvento = document.getElementById('fecha-evento');
    const entradaHoraEvento = document.getElementById('hora-evento');
    const entradaDescripcionEvento = document.getElementById('descripcion-evento');
    const entradaParticipantesEvento = document.getElementById('participantes-evento');

    let elementoEventoActual = null;
    let eventos = {};

    // Función para cambiar entre vistas
    function cambiarVista(vista) {
        const vistas = document.querySelectorAll('.calendario-vista');
        vistas.forEach(v => v.style.display = 'none');
        document.getElementById(vista).style.display = 'grid';
    }

    document.getElementById('vista-anual').addEventListener('click', () => cambiarVista('calendario-anual'));
    document.getElementById('vista-mensual').addEventListener('click', () => cambiarVista('calendario-mensual'));
    document.getElementById('vista-diaria').addEventListener('click', () => mostrarCalendarioDiario(new Date().toISOString().split('T')[0]));

    // Función para generar el calendario anual
    function generarCalendarioAnual() {
        for (let mes = 0; mes < 12; mes++) {
            const mesElemento = document.createElement('div');
            mesElemento.classList.add('mes');
            mesElemento.dataset.mes = mes;
            mesElemento.textContent = new Date(2024, mes).toLocaleString('es-ES', { month: 'long' });
            mesElemento.addEventListener('click', () => mostrarCalendarioMensual(mes));
            calendarioAnual.appendChild(mesElemento);
        }
    }

    // Función para mostrar el calendario mensual
    function mostrarCalendarioMensual(mes) {
        calendarioMensual.innerHTML = '';
        const diasEnMes = new Date(2024, mes + 1, 0).getDate();
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const diaElemento = document.createElement('div');
            const fecha = `2024-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            diaElemento.textContent = dia;
            diaElemento.dataset.fecha = fecha;
            if (eventos[fecha]) {
                diaElemento.classList.add('con-evento');
                diaElemento.style.backgroundColor = eventos[fecha][Object.keys(eventos[fecha])[0]].color;
            }
            diaElemento.addEventListener('click', () => abrirFormularioEvento(diaElemento));
            calendarioMensual.appendChild(diaElemento);
        }
        cambiarVista('calendario-mensual');
    }
    
    // Función para mostrar el calendario diario
    function mostrarCalendarioDiario(fecha) {
        calendarioDiario.innerHTML = '';
        const horasDia = [
            "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", 
            "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
            "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"
        ];

        for (const hora of horasDia) {
            const horaElemento = document.createElement('div');
            horaElemento.textContent = hora;
            horaElemento.dataset.hora = hora;
            horaElemento.dataset.fecha = fecha;
            const evento = eventos[fecha]?.[hora];
            if (evento) {
                horaElemento.classList.add('con-evento');
                horaElemento.textContent += ` - ${evento.titulo}`;
                horaElemento.style.backgroundColor = evento.color;
            }
            horaElemento.addEventListener('click', () => abrirFormularioEvento(horaElemento, 'diario'));
            calendarioDiario.appendChild(horaElemento);
        }
        cambiarVista('calendario-diario');
    }

    // Función para generar un color aleatorio
    function generarColorAleatorio() {
        const letras = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letras[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Función para abrir el formulario de evento
    function abrirFormularioEvento(elemento, vista = 'mensual') {
        elementoEventoActual = elemento;
        entradaFechaEvento.value = vista === 'diario' ? elemento.dataset.fecha : '';
        entradaHoraEvento.value = vista === 'diario' ? elemento.dataset.hora : '';
        const eventoData = eventos[elemento.dataset.fecha]?.[elemento.dataset.hora];
        if (eventoData) {
            tituloFormulario.textContent = 'Modificar Evento';
            entradaTituloEvento.value = eventoData.titulo;
            entradaHoraEvento.value = eventoData.hora;
            entradaDescripcionEvento.value = eventoData.descripcion;
            entradaParticipantesEvento.value = eventoData.participantes;
        } else {
            tituloFormulario.textContent = 'Añadir Evento';
            formularioEvento.reset();
        }
        contenedorFormularioEvento.style.display = 'block';
    }

    // Función para cerrar el formulario de evento
    function cerrarFormularioEvento() {
        contenedorFormularioEvento.style.display = 'none';
        formularioEvento.reset();
        elementoEventoActual = null;
    }

    // Función para guardar el evento
    function guardarEvento(event) {
        event.preventDefault();
        const titulo = entradaTituloEvento.value;
        const fecha = entradaFechaEvento.value;
        const hora = entradaHoraEvento.value;
        const descripcion = entradaDescripcionEvento.value;
        const participantes = entradaParticipantesEvento.value;
        const color = generarColorAleatorio();
        const eventoData = { titulo, fecha, hora, descripcion, participantes, color };

        if (!eventos[fecha]) {
            eventos[fecha] = {};
        }
        eventos[fecha][hora] = eventoData;

        if (elementoEventoActual) {
            if (!elementoEventoActual.classList.contains('con-evento')) {
                elementoEventoActual.classList.add('con-evento');
            }
            elementoEventoActual.style.backgroundColor = color;
            elementoEventoActual.textContent = hora + ' - ' + titulo;
        }

        cerrarFormularioEvento();
    }

    formularioEvento.addEventListener('submit', guardarEvento);
    botonCancelar.addEventListener('click', cerrarFormularioEvento);

    generarCalendarioAnual();
    cambiarVista('calendario-anual');
});
