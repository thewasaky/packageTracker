function mensajeErrorIniciarSesion() {
  $.alert({
    icon: "fa fa-exclamation-triangle",
    title: "¡Usuario o contraseña incorrecto!",
    content:
      "No se ha podido iniciar sesión, revisa tu usuario o contraseña",
    type: "red",
    typeAnimated: true,
    buttons: {
      aceptar: function () {},
    },
  });
}
