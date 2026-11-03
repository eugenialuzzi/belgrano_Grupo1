var formulario = document.getElementById('form-contacto');
var panelExito = document.getElementById('panel-exito');
var avisoGeneral = document.getElementById('aviso-general');

var nombre = document.getElementById('nombre');
var email = document.getElementById('email');
var telefono = document.getElementById('telefono');
var motivo = document.getElementById('motivo');
var mensaje = document.getElementById('mensaje');
var consentimiento = document.getElementById('consentimiento');

var contador = document.getElementById('contador-mensaje');
var botonOtra = document.getElementById('otra-consulta');

var FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
var FORMATO_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/;

function revisarNombre() {
  var valor = nombre.value.trim();
  if (valor === '') {
    return 'Escribí tu nombre y apellido.';
  }
  if (valor.length < 3) {
    return 'El nombre tiene que tener al menos 3 letras.';
  }
  if (!FORMATO_NOMBRE.test(valor)) {
    return 'El nombre solo puede tener letras y espacios.';
  }
  return '';
}

function revisarEmail() {
  var valor = email.value.trim();
  if (valor === '') {
    return 'Escribí tu correo electrónico.';
  }
  if (!FORMATO_EMAIL.test(valor)) {
    return 'Ese correo no tiene un formato válido. Un ejemplo: nombre@ejemplo.com';
  }
  return '';
}

function revisarTelefono() {
  var valor = telefono.value.trim();
  if (valor === '') {
    return '';
  }
  var soloNumeros = valor.replace(/[\s\-\(\)\+]/g, '');
  if (!/^[0-9]+$/.test(soloNumeros)) {
    return 'El teléfono solo puede tener números, espacios y los signos + - ( ).';
  }
  if (soloNumeros.length < 8 || soloNumeros.length > 15) {
    return 'El teléfono tiene que tener entre 8 y 15 números.';
  }
  return '';
}

function revisarMotivo() {
  if (motivo.value === '') {
    return 'Elegí el motivo de tu consulta.';
  }
  return '';
}

function revisarMensaje() {
  var valor = mensaje.value.trim();
  if (valor === '') {
    return 'Contanos tu consulta.';
  }
  if (valor.length < 15) {
    return 'La consulta es muy corta: escribí al menos 15 caracteres.';
  }
  return '';
}

function revisarConsentimiento() {
  if (!consentimiento.checked) {
    return 'Necesitamos tu permiso para poder responderte.';
  }
  return '';
}

var CAMPOS = [
  { elemento: nombre, error: 'error-nombre', revisar: revisarNombre },
  { elemento: email, error: 'error-email', revisar: revisarEmail },
  { elemento: telefono, error: 'error-telefono', revisar: revisarTelefono },
  { elemento: motivo, error: 'error-motivo', revisar: revisarMotivo },
  { elemento: mensaje, error: 'error-mensaje', revisar: revisarMensaje },
  { elemento: consentimiento, error: 'error-consentimiento', revisar: revisarConsentimiento }
];

function mostrarError(campo, texto) {
  var cartel = document.getElementById(campo.error);
  if (texto === '') {
    cartel.hidden = true;
    cartel.textContent = '';
    campo.elemento.removeAttribute('aria-invalid');
  } else {
    cartel.textContent = texto;
    cartel.hidden = false;
    campo.elemento.setAttribute('aria-invalid', 'true');
  }
}

for (var i = 0; i < CAMPOS.length; i++) {
  (function (campo) {
    campo.elemento.addEventListener('blur', function () {
      mostrarError(campo, campo.revisar());
    });
    campo.elemento.addEventListener('input', function () {
      if (campo.elemento.getAttribute('aria-invalid') === 'true') {
        mostrarError(campo, campo.revisar());
      }
    });
  })(CAMPOS[i]);
}

mensaje.addEventListener('input', function () {
  contador.textContent = mensaje.value.length + ' de 500 caracteres. Mínimo 15.';
});

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();

  var conError = [];

  for (var i = 0; i < CAMPOS.length; i++) {
    var texto = CAMPOS[i].revisar();
    mostrarError(CAMPOS[i], texto);
    if (texto !== '') {
      conError.push(CAMPOS[i]);
    }
  }

  if (conError.length > 0) {
    avisoGeneral.textContent = conError.length === 1
      ? 'Falta corregir un campo para poder enviar la consulta.'
      : 'Faltan corregir ' + conError.length + ' campos para poder enviar la consulta.';
    avisoGeneral.hidden = false;
    conError[0].elemento.focus();
    return;
  }

  avisoGeneral.hidden = true;
  enviar();
});

function enviar() {
  document.getElementById('exito-nombre').textContent = nombre.value.trim().split(' ')[0];
  document.getElementById('exito-email').textContent = email.value.trim();
  document.getElementById('exito-codigo').textContent = 'CO-' + String(Date.now()).slice(-6);

  formulario.hidden = true;
  panelExito.hidden = false;
  panelExito.scrollIntoView({ block: 'center' });
}

botonOtra.addEventListener('click', function () {
  formulario.reset();
  for (var i = 0; i < CAMPOS.length; i++) {
    mostrarError(CAMPOS[i], '');
  }
  contador.textContent = '0 de 500 caracteres. Mínimo 15.';
  avisoGeneral.hidden = true;
  panelExito.hidden = true;
  formulario.hidden = false;
  nombre.focus();
});

formulario.addEventListener('reset', function () {
  avisoGeneral.hidden = true;
  setTimeout(function () {
    for (var i = 0; i < CAMPOS.length; i++) {
      mostrarError(CAMPOS[i], '');
    }
    contador.textContent = '0 de 500 caracteres. Mínimo 15.';
  }, 0);
});
