INSTRUCCIONES PARA ABRIR EL PROYECTO

Este proyecto utiliza la API de Geolocalización del navegador y un mapa dinámico interactivo en la sección de contacto, además de carga de recursos locales.

Para que la geolocalización y todas las funcionalidades se ejecuten correctamente, se recomienda abrir el proyecto con un servidor local, como Live Server en VS Code o a través de GitHub Pages (entorno seguro HTTPS/localhost).

Si abre los archivos directamente haciendo doble clic (ruta file://), algunos navegadores pueden bloquear el permiso de ubicación del dispositivo o restringir rutas relativas entre vistas.

Gracias por la comprensión.


# Proyecto Web GUADARRAMA & CUMBRES - Diseño Web Responsive y Bootstrap

**[Ver el proyecto en vivo aquí](https://aarcesim-git.github.io/GuadarramaYCumbres/ )**

---

## ¿De qué se trata este proyecto?

**Guadarrama & Cumbres** es un portal informativo y visual dedicado al senderismo y las rutas de montaña en la Sierra de Guadarrama. Su propósito es acercar distintos niveles de itinerarios (iniciación, media montaña y alta montaña) junto con recomendaciones de equipamiento y seguridad, permitiendo a los usuarios explorar paisajes a través de una galería fotográfica y enviar consultas personalizadas.

El diseño se ha creado bajo una estética limpia, natural y equilibrada, cediendo el protagonismo a la fotografía de montaña y facilitando una navegación clara desde cualquier dispositivo.

## Contexto y Objetivo

Este desarrollo forma parte de las prácticas evaluables de desarrollo web front-end (**HTML5, CSS3, Bootstrap 5 y JavaScript**) dentro del **Máster en Programación, Diseño Web y Experiencia del Usuario (UX/UI)**.

El objetivo principal fue estructurar un sitio multipágina completo y *responsive* combinando el sistema de rejilla y componentes de **Bootstrap 5** con estilos propios, validación estricta de formularios en cliente, integración de mapas dinámicos con geolocalización y cumplimiento de estándares de validación **W3C**.

## Características Destacadas (La Experiencia del Usuario)

- **Navegación Intuitiva y Jerarquía Clara:** Menú superior adaptable (*navbar* con estado activo visible en cada página) que guía de forma directa entre **Inicio**, **Galería** y **Contacto**, apoyado por un pie de página estructurado en tres bloques.
- **Identidad Visual Natural:** Paleta cromática en tonos verdes de montaña y fondos suaves que refuerzan la temática de naturaleza y aportan legibilidad.
- **Diseño 100% Adaptable (Mobile-First):** Uso de contenedores, filas y columnas *responsive* de Bootstrap 5 para que el carrusel, las tarjetas, la galería de 9 imágenes con efecto *hover* y el formulario se adapten con fluidez a móviles, tabletas y escritorio.
- **Interactividad y Validación en Cliente:** Formulario de contacto con validación mediante expresiones regulares y mapa dinámico con detección de ubicación del usuario y punto de referencia alternativo (*fallback*).

---

## Tecnologías y Herramientas (Resumen Técnico)

Para el equipo técnico o docente que revisa el código, el proyecto está desarrollado aplicando buenas prácticas de semántica, accesibilidad y organización de archivos, utilizando:

- **HTML5:** Estructura semántica multipágina (`index.html`, `views/galeria.html`, `views/contacto.html`).
- **CSS3 y Bootstrap 5:** Maquetación *responsive*, componentes (carrusel, *cards*, *accordion*, *navbar*) y hoja de estilos personalizada (`css/styles.css`).
- **JavaScript:** Validación de campos del formulario y lógica de geolocalización y renderizado del mapa interactivo (`js/`).
