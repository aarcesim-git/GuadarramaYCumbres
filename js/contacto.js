document.addEventListener("DOMContentLoaded", () => {
  /* 1. Validación del formulario con expresiones regulares. */
  const form = document.getElementById("formContacto");
  const mensajeEstado = document.getElementById("mensajeEstado");

  const campos = {
    nombre: {
      input: document.getElementById("nombre"),
      regex: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]{2,40}$/
    },
    apellidos: {
      input: document.getElementById("apellidos"),
      regex: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]{2,60}$/
    },
    telefono: {
      input: document.getElementById("telefono"),
      regex: /^[6789]\d{8}$/
    },
    email: {
      input: document.getElementById("email"),
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    }
  };

  function validarCampo(clave) {
    const { input, regex } = campos[clave];
    const valorLimpio = input.value.trim();

    if (clave === "telefono") {
      input.value = valorLimpio.replace(/\s+/g, "");
    }

    const esValido = regex.test(input.value.trim());
    input.classList.toggle("is-valid", esValido);
    input.classList.toggle("is-invalid", !esValido);
    return esValido;
  }

  Object.keys(campos).forEach((clave) => {
    campos[clave].input.addEventListener("input", () => validarCampo(clave));
    campos[clave].input.addEventListener("blur", () => validarCampo(clave));
  });

  if (form) {
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

      mensajeEstado.className = "alert alert-success";
      mensajeEstado.textContent = "Formulario validado correctamente. Tu consulta se ha registrado.";
      form.reset();

      Object.keys(campos).forEach((clave) => {
        campos[clave].input.classList.remove("is-valid", "is-invalid");
      });
    });
  }

  /* 2. Mapa dinámico con geolocalización y fallback a MasterD */
const mapaContenedor = document.getElementById("mapa");
  const estadoMapa = document.getElementById("estadoMapa");
  const btnUsuario = document.getElementById("btnCentrarUsuario");
  const btnMasterD = document.getElementById("btnCentrarMasterD");

  // Ubicación de respaldo (MasterD Madrid)
  const coordsMasterD = [40.4378, -3.7003];
  let coordsUsuario = null;

  if (mapaContenedor && typeof L !== "undefined") {
    const mapa = L.map("mapa").setView(coordsMasterD, 15);

    // Capa base limpia sin mosaicos externos bloqueados ni marcas de API key
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: "Tiles &copy; Esri"
    }).addTo(mapa);

    L.gridLayer({
      createTile: function (coords) {
        const tile = document.createElement("canvas");
        const size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;
        const ctx = tile.getContext("2d");
        ctx.fillStyle = "#eef4ee";
        ctx.fillRect(0, 0, size.x, size.y);
        ctx.strokeStyle = "#d4dfd4";
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, size.x - 1, size.y - 1);
        ctx.fillStyle = "#5c745e";
        ctx.font = "11px sans-serif";
        ctx.fillText(`Z${coords.z} (${coords.x}, ${coords.y})`, 8, 16);
        return tile;
      }
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