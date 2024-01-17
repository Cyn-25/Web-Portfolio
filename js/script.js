
// Función para establecer una cookie
function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expirationDate.toUTCString()};path=/`;
    document.cookie = cookieValue;
}

// Función para obtener el valor de una cookie
function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length + 1, cookie.length);
        }
    }

    return null;
}

// Función para cargar dinámicamente las traducciones
async function loadTranslations(language) {
    const requestJson = await fetch(`./languages/${language}.json`);
    return await requestJson.json();
}

// Función para cambiar el idioma
async function changeLanguage(language) {
    const textsToChange = document.querySelectorAll("[data-section]");
    const texts = await loadTranslations(language);

    textsToChange.forEach((textToChange) => {
        const section = textToChange.dataset.section;
        const value = textToChange.dataset.value;
        textToChange.innerHTML = texts[section][value];
    });

    // Actualiza el enlace del currículum al cambiar el idioma
    updateResumeLink(language);
}

// Evento al hacer clic en la bandera
document.getElementById("flags").addEventListener("click", async (e) => {
    const selectedLanguage = e.target.parentElement.dataset.language;
    changeLanguage(selectedLanguage);
    setCookie('language', selectedLanguage, 365);
    console.log(`Language set to ${selectedLanguage}`);
});

// Llama a changeLanguage con el idioma almacenado en la cookie al cargar la página
// Llama a changeLanguage con el idioma almacenado en la cookie al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    const initialLanguage = getCookie('language') || 'en';
    await changeLanguage(initialLanguage);
    console.log(`Language loaded: ${initialLanguage}`);

    // Actualiza el enlace del currículum después de que se carga el contenido del DOM
    updateResumeLink(initialLanguage);
});

// Función para actualizar el enlace del currículum según el idioma actual
function updateResumeLink(language) {
    const pdfUrl = (language === 'en') ?
        'assets/archivos/CV-Cynthia Hernandez (english).pdf' :
        'assets/archivos/CV-Cynthia Hernandez (español).pdf';

    // Actualiza el enlace del currículum
    const resumeLink = document.getElementById("resumeLink");
    if (resumeLink) {
        resumeLink.href = pdfUrl;
    }
}

// Evento al hacer clic en el botón del currículum
$("#resumeButton").on("click", (e) => {

    e.preventDefault();

    // Obtiene el idioma actual almacenado en la cookie o usa 'en' como predeterminado
    const currentLanguage = getCookie('language') || 'en';

    // Utiliza la variable currentLanguage para determinar el idioma
    const pdfUrl = (currentLanguage === 'en') ?
        'assets/archivos/CV-Cynthia Hernandez (english).pdf' :
        'assets/archivos/CV-Cynthia Hernandez (espanol).pdf';

    // Abre el enlace del currículum en una nueva pestaña
    window.open(pdfUrl, '_blank');
});
