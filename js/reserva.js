var PRECIO_COMPLETO = 39900;

var URL_COTIZACIONES = 'https://dolarapi.com/v1/cotizaciones';

var cotizacion = {
  fecha: '02/11/2026',
  enVivo: false
};

var formulario = document.getElementById('form-reserva');
var modoCompleto = document.getElementById('modo-completo');
var modoSueltas = document.getElementById('modo-sueltas');
var listaParadas = document.getElementById('lista-paradas');
var paradas = document.querySelectorAll('.parada-check');

var fecha = document.getElementById('fecha');
var horario = document.getElementById('horario');
var personas = document.getElementById('personas');
var botonMenos = document.getElementById('menos');
var botonMas = document.getElementById('mas');

var monedas = document.querySelectorAll('input[name="moneda"]');

var resumenParadas = document.getElementById('resumen-paradas');
var resumenFecha = document.getElementById('resumen-fecha');
var resumenHorario = document.getElementById('resumen-horario');
var resumenPersonas = document.getElementById('resumen-personas');
var totalVisible = document.getElementById('total-visible');
var notaCotizacion = document.getElementById('nota-cotizacion');

var detalleOculto = document.getElementById('detalle');
var totalOculto = document.getElementById('total-oculto');
var mensajeError = document.getElementById('error-reserva');
var estadoCotizacion = document.getElementById('estado-cotizacion');


function fechaISO(dias) {
  var d = new Date();
  d.setDate(d.getDate() + dias);
  var mes = String(d.getMonth() + 1).padStart(2, '0');
  var dia = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + mes + '-' + dia;
}

fecha.min = fechaISO(1);
fecha.max = fechaISO(365);


function monedaElegida() {
  for (var i = 0; i < monedas.length; i++) {
    if (monedas[i].checked) {
      return monedas[i];
    }
  }
  return monedas[0];
}


function formatearPesos(monto) {
  return '$ ' + Math.round(monto).toLocaleString('es-AR');
}


function formatearCotizacion(tasa) {
  return '$ ' + tasa.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatearMoneda(montoEnPesos, moneda) {
  var tasa = Number(moneda.getAttribute('data-tasa'));
  var simbolo = moneda.getAttribute('data-simbolo');

  if (moneda.value === 'ARS') {
    return formatearPesos(montoEnPesos);
  }

  var convertido = montoEnPesos / tasa;
  return simbolo + ' ' + convertido.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}


function fechaEnCastellano(valor) {
  if (!valor) {
    return 'Todavía sin elegir';
  }
  var partes = valor.split('-');
  return partes[2] + '/' + partes[1] + '/' + partes[0];
}


function nombresElegidos() {
  var nombres = [];
  for (var i = 0; i < paradas.length; i++) {
    if (paradas[i].checked) {
      nombres.push(paradas[i].value);
    }
  }
  return nombres;
}

function precioDeLasParadas() {
  var suma = 0;
  for (var i = 0; i < paradas.length; i++) {
    if (paradas[i].checked) {
      suma = suma + Number(paradas[i].getAttribute('data-precio'));
    }
  }
  return suma;
}

function actualizar() {
  var cantidad = Number(personas.value);
  if (!cantidad || cantidad < 1) {
    cantidad = 1;
  }

  var elegidas = nombresElegidos();
  var precioBase;

  if (modoCompleto.checked) {
    for (var i = 0; i < paradas.length; i++) {
      paradas[i].checked = true;
    }
    elegidas = nombresElegidos();
    precioBase = PRECIO_COMPLETO;
    listaParadas.setAttribute('data-bloqueada', 'si');
    resumenParadas.textContent = 'Recorrido completo (5 paradas)';
  } else {
    precioBase = precioDeLasParadas();
    listaParadas.setAttribute('data-bloqueada', 'no');
    if (elegidas.length === 0) {
      resumenParadas.textContent = 'Todavía sin elegir';
    } else {
      resumenParadas.textContent = elegidas.join(' · ');
    }
  }

  var totalEnPesos = precioBase * cantidad;
  var moneda = monedaElegida();


  resumenFecha.textContent = fechaEnCastellano(fecha.value);
  resumenHorario.textContent = horario.value ? horario.value + ' h' : 'Todavía sin elegir';
  resumenPersonas.textContent = cantidad === 1 ? '1 persona' : cantidad + ' personas';
  totalVisible.textContent = formatearMoneda(totalEnPesos, moneda);


  if (moneda.value === 'ARS') {
    notaCotizacion.textContent = 'Precio final por ' + cantidad +
      (cantidad === 1 ? ' persona' : ' personas') + '. Pagás el día de la visita.';
  } else {
    notaCotizacion.textContent = 'Equivale a ' + formatearPesos(totalEnPesos) +
      '. Cotización del ' + cotizacion.fecha + ': 1 ' + moneda.value + ' = ' +
      formatearCotizacion(Number(moneda.getAttribute('data-tasa'))) + '. El pago se hace en pesos.';
  }

  detalleOculto.value = modoCompleto.checked ? 'Recorrido completo (5 paradas)' : elegidas.join(' · ');
  totalOculto.value = formatearMoneda(totalEnPesos, moneda) + (moneda.value === 'ARS' ? '' : ' (' + formatearPesos(totalEnPesos) + ')');

  botonMenos.disabled = cantidad <= 1;
  botonMas.disabled = cantidad >= 20;

  if (!mensajeError.hidden && faltaAlgo() === '') {
    mensajeError.hidden = true;
  }
}

function faltaAlgo() {
  if (!modoCompleto.checked && nombresElegidos().length === 0) {
    return 'Elegí al menos una parada para continuar, o volvé a la opción "Recorrido completo".';
  }
  if (!fecha.value) {
    return 'Falta elegir la fecha de la visita.';
  }
  if (fecha.value < fecha.min) {
    return 'La fecha ya pasó. Las reservas se toman con un día de anticipación como mínimo.';
  }
  if (!horario.value) {
    return 'Falta elegir el horario de salida.';
  }
  var cantidad = Number(personas.value);
  if (!cantidad || cantidad < 1 || cantidad > 20) {
    return 'La cantidad de personas tiene que ser un número entre 1 y 20.';
  }
  return '';
}

modoCompleto.addEventListener('change', actualizar);
modoSueltas.addEventListener('change', actualizar);

for (var i = 0; i < paradas.length; i++) {
  paradas[i].addEventListener('change', function () {
    if (modoCompleto.checked) {
      modoSueltas.checked = true;
    }
    actualizar();
  });
}

fecha.addEventListener('change', actualizar);
horario.addEventListener('change', actualizar);
personas.addEventListener('input', actualizar);

botonMenos.addEventListener('click', function () {
  personas.value = Math.max(1, Number(personas.value) - 1);
  actualizar();
});

botonMas.addEventListener('click', function () {
  personas.value = Math.min(20, Number(personas.value) + 1);
  actualizar();
});

for (var j = 0; j < monedas.length; j++) {
  monedas[j].addEventListener('change', actualizar);
}


formulario.addEventListener('reset', function () {
  mensajeError.hidden = true;
  setTimeout(actualizar, 0);
});

formulario.addEventListener('submit', function (evento) {
  var problema = faltaAlgo();
  if (problema !== '') {
    evento.preventDefault();
    mensajeError.textContent = problema;
    mensajeError.hidden = false;
    mensajeError.scrollIntoView({ block: 'center' });

    if (problema.indexOf('fecha') !== -1) {
      fecha.focus();
    } else if (problema.indexOf('horario') !== -1) {
      horario.focus();
    } else if (problema.indexOf('personas') !== -1) {
      personas.focus();
    } else {
      listaParadas.querySelector('input').focus();
    }
  }
});


actualizar();


function fechaYHora(textoISO) {
  var f = new Date(textoISO);
  var dia = String(f.getDate()).padStart(2, '0');
  var mes = String(f.getMonth() + 1).padStart(2, '0');
  var hora = String(f.getHours()).padStart(2, '0');
  var min = String(f.getMinutes()).padStart(2, '0');
  return dia + '/' + mes + '/' + f.getFullYear() + ' a las ' + hora + ':' + min;
}

async function traerCotizaciones() {
  try {
    var respuesta = await fetch(URL_COTIZACIONES);

    if (!respuesta.ok) {
      throw new Error('La API respondió ' + respuesta.status);
    }

    var datos = await respuesta.json();
    var encontradas = 0;
    var fechaApi = '';

    for (var i = 0; i < monedas.length; i++) {
      var codigo = monedas[i].value;
      if (codigo === 'ARS') {
        continue;
      }
      for (var j = 0; j < datos.length; j++) {
        if (datos[j].moneda === codigo) {
          monedas[i].setAttribute('data-tasa', datos[j].venta);
          fechaApi = datos[j].fechaActualizacion;
          encontradas = encontradas + 1;
        }
      }
    }

    if (encontradas === 0) {
      throw new Error('La API no trajo ni el dólar ni el real');
    }

    cotizacion.fecha = fechaYHora(fechaApi);
    cotizacion.enVivo = true;
    estadoCotizacion.textContent = '✓ Cotización actualizada el ' + cotizacion.fecha + ' (dolarapi.com)';
    estadoCotizacion.setAttribute('data-estado', 'ok');

  } catch (error) {
    console.log('No se pudo traer la cotización:', error.message);
    estadoCotizacion.textContent = 'Sin conexión con la API: se usa la cotización de referencia del ' + cotizacion.fecha + '.';
    estadoCotizacion.setAttribute('data-estado', 'error');
  }

  actualizar();
}

traerCotizaciones();
