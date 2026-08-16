// =====================================
// SOBRE DE BIENVENIDA
// =====================================

const openInvitation = document.getElementById("openInvitation");

const envelope = document.getElementById("envelope");

if (openInvitation && envelope) {
  openInvitation.addEventListener("click", () => {
    envelope.style.opacity = "0";

    setTimeout(() => {
      envelope.style.display = "none";
    }, 1000);

    const audioEl = document.getElementById("audio");

    if (audioEl) {
      audioEl.play().catch(() => {
        console.log("Autoplay bloqueado por el navegador");
      });
    }
  });
}

// =====================================
// CONTADOR REGRESIVO
// =====================================

const weddingDate = new Date("October 11, 2026 16:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();

  const distance = weddingDate - now;

  const daysEl = document.getElementById("days");

  const hoursEl = document.getElementById("hours");

  const minutesEl = document.getElementById("minutes");

  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  if (distance <= 0) {
    daysEl.textContent = 0;
    hoursEl.textContent = 0;
    minutesEl.textContent = 0;
    secondsEl.textContent = 0;

    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = days;
  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// =====================================
// INVITADO PERSONALIZADO (nombre desde el link)
// =====================================

// Lee ?nombre=Maria+Perez o ?invitado=Maria%20Perez del link personalizado
function obtenerNombreInvitado() {
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get("nombre") || params.get("invitado");

  if (!nombre) return null;

  return decodeURIComponent(nombre.replace(/\+/g, " ")).trim();
}

const nombreInvitado = obtenerNombreInvitado();

// Si el link trae el nombre, saludamos al invitado y ocultamos el campo de texto
document.addEventListener("DOMContentLoaded", () => {
  const campoNombreWrap = document.getElementById("confirm-nombre-wrap");

  if (!nombreInvitado) return;

  const letter = document.querySelector("#envelope .letter");

  if (letter) {
    const saludo = document.createElement("p");
    saludo.textContent = `¡Hola, ${nombreInvitado}!`;
    saludo.style.marginTop = "0.5rem";
    letter.insertBefore(saludo, letter.querySelector("#openInvitation"));
  }

  if (campoNombreWrap) {
    campoNombreWrap.style.display = "none";
  }
});

// =====================================
// CONFIRMACIÓN DE ASISTENCIA → WHATSAPP
// =====================================

const NUMEROS_WHATSAPP = {
  novio: "573124658012", // Daniel
  novia: "573143783740", // Erika
};

// asiste: true = "Sí asistiré", false = "No podré asistir"
function confirmarAsistencia(para, asiste) {
  let nombre = nombreInvitado;

  // Si el invitado no entró por un link personalizado, toma el nombre del campo de texto
  if (!nombre) {
    const campoNombre = document.getElementById("confirm-nombre");
    nombre = campoNombre ? campoNombre.value.trim() : "";

    if (!nombre) {
      alert("Por favor escribe tu nombre antes de confirmar.");
      if (campoNombre) campoNombre.focus();
      return;
    }
  }

  let mensaje;

  if (asiste) {
    mensaje =
      `💒 CONFIRMACIÓN DE ASISTENCIA\n` +
      `Nombre: ${nombre}\n` +
      `Asistencia: SÍ\n` +
      `Nos vemos en la boda ❤️`;
  } else {
    mensaje =
      `💒 CONFIRMACIÓN DE ASISTENCIA\n` +
      `Nombre: ${nombre}\n` +
      `Asistencia: NO\n` +
      `Lamentablemente no podré acompañarlos en este día tan especial.`;
  }

  const numero = NUMEROS_WHATSAPP[para];

  if (!numero) {
    alert("No se encontró el número de WhatsApp.");
    return;
  }

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  // Redirige de inmediato a WhatsApp con el mensaje ya armado
  window.open(url, "_blank");
}

// =====================================
// MURO DE MENSAJES
// =====================================

const scriptURLMuro =
  "https://script.google.com/macros/s/AKfycbyqYly84Ctp3hYjEf24T244ffp2d4J0f6-_9zzf1T4Ly7rUnU5C2ltZkHHPHcLjnctrHQ/exec";

document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("muro-mensaje");
  const contador = document.getElementById("muro-chars");

  if (textarea && contador) {
    textarea.addEventListener("input", () => {
      contador.textContent = textarea.value.length;
    });
  }
});

function enviarMensaje() {
  const nombre = document.getElementById("muro-nombre").value.trim();

  const mensaje = document.getElementById("muro-mensaje").value.trim();

  if (!nombre) {
    alert("Por favor escribe tu nombre.");
    return;
  }

  if (!mensaje) {
    alert("Por favor escribe un mensaje.");
    return;
  }

  fetch(
    `${scriptURLMuro}?accion=mensaje&nombre=${encodeURIComponent(nombre)}&mensaje=${encodeURIComponent(mensaje)}`,
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.ok) {
        document.getElementById("muro-nombre").value = "";
        document.getElementById("muro-mensaje").value = "";
        document.getElementById("muro-chars").textContent = "0";

        alert("¡Mensaje enviado! 💌");
      }
    })
    .catch(() => {
      alert("Error al enviar el mensaje. Intenta de nuevo.");
    });
}

// =====================================
// ANIMACIÓN SCROLL
// =====================================

const elements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  elements.forEach((el) => {
    const top = el.getBoundingClientRect().top;

    const visible = window.innerHeight - 100;

    if (top < visible) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();

// =====================================
// SCROLL SUAVE MENÚ
// =====================================

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
    });
  });
});

// =====================================
// REPRODUCTOR VINILO
// =====================================

const audioPlayer = document.getElementById("audio");
const btnPlay = document.getElementById("btnPlay");
const btnRewind = document.getElementById("btnRewind");
const btnForward = document.getElementById("btnForward");
const progressFill = document.getElementById("progressFill");
const progressBar = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const vinylDisc = document.getElementById("vinyl");

function fmt(s) {
  if (!s || isNaN(s)) return "0:00";

  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);

  return m + ":" + (sec < 10 ? "0" : "") + sec;
}

if (btnPlay && audioPlayer) {
  btnPlay.addEventListener("click", () => {
    if (audioPlayer.paused) {
      audioPlayer.play().catch(() => {
        console.log("Reproducción bloqueada por el navegador");
      });

      btnPlay.textContent = "❚❚";

      if (vinylDisc) {
        vinylDisc.classList.add("spinning");
      }
    } else {
      audioPlayer.pause();

      btnPlay.textContent = "▶";

      if (vinylDisc) {
        vinylDisc.classList.remove("spinning");
      }
    }
  });
}

if (btnRewind && audioPlayer) {
  btnRewind.addEventListener("click", () => {
    audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
  });
}

if (btnForward && audioPlayer) {
  btnForward.addEventListener("click", () => {
    audioPlayer.currentTime = Math.min(
      audioPlayer.duration || 0,
      audioPlayer.currentTime + 10,
    );
  });
}

if (audioPlayer) {
  audioPlayer.addEventListener("loadedmetadata", () => {
    if (totalTime) {
      totalTime.textContent = fmt(audioPlayer.duration);
    }
  });

  audioPlayer.addEventListener("timeupdate", () => {
    const pct = audioPlayer.duration
      ? (audioPlayer.currentTime / audioPlayer.duration) * 100
      : 0;

    if (progressFill) {
      progressFill.style.width = pct + "%";
    }

    if (currentTime) {
      currentTime.textContent = fmt(audioPlayer.currentTime);
    }
  });

  audioPlayer.addEventListener("ended", () => {
    if (btnPlay) btnPlay.textContent = "▶";
    if (vinylDisc) vinylDisc.classList.remove("spinning");
    if (progressFill) progressFill.style.width = "0%";
    if (currentTime) currentTime.textContent = "0:00";
  });
}

if (progressBar && audioPlayer) {
  progressBar.addEventListener("click", (e) => {
    const rect = progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;

    if (audioPlayer.duration) {
      audioPlayer.currentTime = pct * audioPlayer.duration;
    }
  });
}

// =====================================
// PÉTALOS ANIMADOS
// =====================================

const coloresPetalos = [
  "#f4a7b9",
  "#f9c8d5",
  "#d4af37",
  "#e8c87a",
  "#b5c98a",
  "#8ab890",
];

function crearPetalo() {
  const petalo = document.createElement("div");

  petalo.classList.add("petalo");

  const size = Math.random() * 12 + 8;

  const color =
    coloresPetalos[Math.floor(Math.random() * coloresPetalos.length)];

  const duracion = Math.random() * 6 + 6;

  const delay = Math.random() * 4;

  petalo.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 20 20">
            <ellipse
                cx="10" cy="10"
                rx="5" ry="9"
                fill="${color}"
                opacity=".8"
                transform="rotate(${Math.random() * 360} 10 10)"
            />
        </svg>
    `;

  petalo.style.left = Math.random() * 100 + "vw";

  petalo.style.animationDuration = duracion + "s";

  petalo.style.animationDelay = delay + "s";

  document.body.appendChild(petalo);

  setTimeout(
    () => {
      petalo.remove();
    },
    (duracion + delay) * 1000,
  );
}

setInterval(crearPetalo, 200);