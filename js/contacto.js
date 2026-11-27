document.addEventListener("DOMContentLoaded", () => {

  /* 1. Validación del formulario con expresiones regulares. */
  
  const form = document.getElementById("formContacto");
  const mensajeEstado = document.getElementById("mensajeEstado");
  const CLAVE_STORAGE = "consultasGuadarramaCumbres";

  const campos = {
    nombre: {
      input: document.getElementById("nombre"),
      regex: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,40}$/
    },
    apellidos: {
      input: document.getElementById("apellidos"),
      regex: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{4,60}$/
    },
    telefono: {
      input: document.getElementById("telefono"),
      regex: /^[6789]\d{8}$/
    },
    email: {
      input: document.getElementById("email"),
      regex: /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    }
  };

  const DOMINIOS_PERMITIDOS = new Set([
    "gmail.com",
    "hotmail.com",
    "hotmail.es",
    "outlook.com",
    "outlook.es",
    "yahoo.com",
    "yahoo.es",
    "icloud.com",
    "live.com"
  ]);

  function esEmailPermitido(valor) {
    const limpio = valor.trim().toLowerCase();
    if (!campos.email.regex.test(limpio)) {
      return false;
    }

    const [, dominio] = limpio.split("@");
    return DOMINIOS_PERMITIDOS.has(dominio);
  }

  function validarCampo(clave) {
    const { input, regex } = campos[clave];
    let valor = input.value.trim();

    if (clave === "telefono") {
      valor = valor.replace(/\s+/g, "");
      input.value = valor;
    }

    const esValido = clave === "email" ? esEmailPermitido(valor) : regex.test(valor);

    input.classList.toggle("is-valid", esValido);
    input.classList.toggle("is-invalid", !esValido);
    return esValido;
  }

  function limpiarEstadosFormulario() {
    Object.keys(campos).forEach((clave) => {
      campos[clave].input.classList.remove("is-valid", "is-invalid");
    });
  }

  function guardarEnLocalStorage(datos) {
    const historial = JSON.parse(localStorage.getItem(CLAVE_STORAGE) || "[]");
    historial.push(datos);
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(historial));
  }

  Object.keys(campos).forEach((clave) => {
    campos[clave].input.addEventListener("input", () => validarCampo(clave));
    campos[clave].input.addEventListener("blur", () => validarCampo(clave));
  });

  if (form) {
    form.addEventListener("reset", () => {
      limpiarEstadosFormulario();
      if (mensajeEstado) {
        mensajeEstado.className = "alert d-none";
        mensajeEstado.textContent = "";
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const todoValido = Object.keys(campos).every((clave) => validarCampo(clave));

      if (!todoValido) {
        mensajeEstado.className = "alert alert-danger";
        mensajeEstado.textContent = "Revisa los campos marcados en rojo antes de enviar el formulario.";
        const primerInvalido = form.querySelector(".is-invalid");
        if (primerInvalido) {
          primerInvalido.focus();
        }
        return;
      }

      const datosConsulta = {
        fecha: new Date().toLocaleString("es-ES"),
        nombre: campos.nombre.input.value.trim(),
        apellidos: campos.apellidos.input.value.trim(),
        telefono: campos.telefono.input.value.trim(),
        email: campos.email.input.value.trim(),
        observaciones: document.getElementById("observaciones").value.trim()
      };

      guardarEnLocalStorage(datosConsulta);

      mensajeEstado.className = "alert alert-success";
      mensajeEstado.textContent = "Formulario validado y enviado correctamente.";
      form.reset();
      limpiarEstadosFormulario();
    });
  }

  /* 2. Mapa dinámico con geolocalización y fallback a MasterD. */

  const mapaContenedor = document.getElementById("mapa");
  const estadoMapa = document.getElementById("estadoMapa");
  const btnUsuario = document.getElementById("btnCentrarUsuario");
  const btnMasterD = document.getElementById("btnCentrarMasterD");

  const coordsMasterD = [40.4378, -3.7003];
  let coordsUsuario = null;

  if (mapaContenedor && typeof L !== "undefined") {
    const mapa = L.map("mapa").setView(coordsMasterD, 15);

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: "Tiles &copy; Esri"
    }).addTo(mapa);

    const marcador = L.marker(coordsMasterD)
      .addTo(mapa)
      .bindPopup("<strong>MasterD</strong><br>Ubicación de referencia")
      .openPopup();

    const circuloArea = L.circle(coordsMasterD, {
      radius: 150,
      color: "#2f5233",
      fillColor: "#2f5233",
      fillOpacity: 0.14,
      weight: 2
    }).addTo(mapa);

    function actualizarVistaMapa(coords, tituloPopup, textoEstado) {
      mapa.setView(coords, 15);
      marcador.setLatLng(coords).bindPopup(tituloPopup).openPopup();
      circuloArea.setLatLng(coords);
      if (estadoMapa && textoEstado) {
        estadoMapa.textContent = textoEstado;
      }
    }

    function solicitarGeolocalizacion() {
      if (!navigator.geolocation) {
        actualizarVistaMapa(
          coordsMasterD,
          "<strong>MasterD</strong><br>Ubicación de referencia",
          "Geolocalización no disponible en este navegador. Mostrando ubicación de MasterD."
        );
        return;
      }

      if (estadoMapa) {
        estadoMapa.textContent = "Solicitando tu ubicación actual...";
      }

      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          coordsUsuario = [posicion.coords.latitude, posicion.coords.longitude];
          actualizarVistaMapa(
            coordsUsuario,
            "<strong>Tu ubicación actual</strong>",
            "Mostrando tu ubicación actual en el mapa."
          );
        },
        () => {
          actualizarVistaMapa(
            coordsMasterD,
            "<strong>MasterD</strong><br>Ubicación de referencia",
            "No se pudo obtener tu ubicación. Mostrando ubicación de respaldo (MasterD)."
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 60000
        }
      );
    }

    if (btnUsuario) {
      btnUsuario.addEventListener("click", () => {
        if (coordsUsuario) {
          actualizarVistaMapa(
            coordsUsuario,
            "<strong>Tu ubicación actual</strong>",
            "Mostrando tu ubicación actual en el mapa."
          );
        } else {
          solicitarGeolocalizacion();
        }
      });
    }

    if (btnMasterD) {
      btnMasterD.addEventListener("click", () => {
        actualizarVistaMapa(
          coordsMasterD,
          "<strong>MasterD</strong><br>Ubicación de referencia",
          "Mostrando ubicación de MasterD."
        );
      });
    }

    solicitarGeolocalizacion();
  }
});