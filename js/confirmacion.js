var datos = new URLSearchParams(window.location.search);


function mostrar(id, valor) {
  if (valor) {
    document.getElementById(id).textContent = valor;
  }
}


var fecha = datos.get('fecha');
if (fecha) {
  var partes = fecha.split('-');
  mostrar('d-fecha', partes[2] + '/' + partes[1] + '/' + partes[0]);
}

var horario = datos.get('horario');
if (horario) {
  mostrar('d-horario', horario + ' h');
}

var personas = datos.get('personas');
if (personas) {
  mostrar('d-personas', personas === '1' ? '1 persona' : personas + ' personas');
}

mostrar('d-detalle', datos.get('detalle'));
mostrar('d-total', datos.get('total'));


var numero = String(Date.now()).slice(-6);
document.getElementById('codigo').textContent = 'TB-' + numero;
