const searchInput = document.getElementById("searchInput");
const dropdown = document.getElementById("searchDropdown");
const searchableItems = document.querySelectorAll(".searchable");
const sidebarLinks = document.querySelectorAll("#sidebarMenu a");
const tocLinks = document.querySelectorAll(".toc a");
const highlightables = document.querySelectorAll(".highlightable");

const data = [
    {
    title: "Последние записи",
    meta: "Карточка на главной",
    target: "#",
    text: "последние записи новые конспекты темы анонсы",
    },
    {
    title: "Быстрый доступ",
    meta: "Карточка на главной",
    target: "#",
    text: "быстрый доступ важные разделы избранное частые темы",
    },
    {
    title: "О сайте",
    meta: "Блок о проекте",
    target: "#about",
    text: "о сайте библиотека конспектов боковое меню карточки чистая область",
    },
    {
    title: "Математика",
    meta: "Раздел в боковом меню",
    target: "#",
    text: "математика алгебра формулы уравнения неравенства",
    },
    {
    title: "Программирование",
    meta: "Раздел в боковом меню",
    target: "#",
    text: "программирование html css javascript git",
    },
    {
    title: "Формулы",
    meta: "Подраздел",
    target: "#",
    text: "формулы алгебра",
    },
    {
    title: "HTML и CSS",
    meta: "Подраздел",
    target: "#",
    text: "html css frontend",
    },
    {
    title: "Основные понятия",
    meta: "Блок теории",
    target: "#",
    text: "основные понятия коэффициенты дискриминант корни уравнение",
    },
    {
    title: "Формула дискриминанта",
    meta: "Блок теории",
    target: "#",
    text: "формула дискриминанта d b квадрат минус 4 ac",
    },
    {
    title: "Решение",
    meta: "Блок теории",
    target: "#",
    text: "решение примеры нахождение корней формула виета",
    },
    {
    title: "Примеры",
    meta: "Карточка",
    target: "#",
    text: "примеры задачи уравнения решение",
    },
    {
    title: "Краткая теория",
    meta: "Раздел страницы",
    target: "#about",
    text: "краткая теория квадратные уравнения формулы корни дискриминант",
    },
    {
    title: "CSS",
    meta: "Раздел страницы",
    target: "#about",
    text: "CSS (Cascading Style Sheets — «каскадные таблицы стилей») — это формальный язык, предназначенный для описания внешнего вида веб-страниц, созданных с использованием языков разметки, таких как HTML или XML. Он определяет цвета, шрифты, расположение элементов, отступы, границы, анимации и другие визуальные характеристики. ",
    }
];

const originalHTML = new WeakMap();





function normalizeText(text) {
    return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text, query) {
    if (!query) 
    return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, "ig");
    return text.replace(regex, "<mark>$1</mark>");
}

function saveOriginalHTML() {
    highlightables.forEach((el) => {
    originalHTML.set(el, el.innerHTML);
    });
}

function restoreHighlights() {
    highlightables.forEach((el) => {
    if (originalHTML.has(el)) {
        el.innerHTML = originalHTML.get(el);
    }
    });
}

function applyHighlights(query) {
    restoreHighlights();
    const q = query.trim();
    if (!q) return;

    highlightables.forEach((el) => {
    const text = el.textContent;
    if (normalizeText(text).includes(normalizeText(q)) && originalHTML.has(el)) {
        el.innerHTML = highlightText(originalHTML.get(el), q);
    }
    });

    sidebarLinks.forEach((link) => {
    const t = link.textContent;
    if (normalizeText(t).includes(normalizeText(q))) {
        link.innerHTML = highlightText(link.textContent, q);
    }
    });

    tocLinks.forEach((link) => {
    const t = link.textContent;
    if (normalizeText(t).includes(normalizeText(q))) {
        link.innerHTML = highlightText(link.textContent, q);
    }
    });
}

function filterPage(query) {
    const q = normalizeText(query);
    let visibleCount = 0;

    searchableItems.forEach((item) => {
    const text = normalizeText(item.textContent + " " + (item.dataset.search || "") + " " + (item.dataset.title || ""));
    const match = q === "" || text.includes(q);
    item.classList.toggle("hidden", !match);
    if (match) visibleCount++;
    });

    sidebarLinks.forEach((link) => {
    const text = normalizeText(link.textContent);
    const match = q === "" || text.includes(q);
    link.parentElement.classList.toggle("hidden", !match);
    });

    return visibleCount;
}

function renderDropdown(query) {
    const q = normalizeText(query);

    if (!q) {
    dropdown.classList.remove("show");
    dropdown.innerHTML = "";
    return;
    }

    const matches = data.filter(item =>
    normalizeText(item.text + " " + item.title + " " + item.meta).includes(q)
    );

    dropdown.innerHTML = `
    <div class="head">Найдено: ${matches.length}</div>
    ${
        matches.length
        ? matches.map(item => `
            <a class="result-item" href="${item.target}">
                <div class="result-title">${highlightText(item.title, query)}</div>
                <div class="result-meta">${highlightText(item.meta, query)}</div>
            </a>
            `).join("")
        : `<div class="result-empty">Ничего не найдено.</div>`
    }
    `;

    dropdown.classList.add("show");
}

function updateSearch(query) {
    renderDropdown(query);
    filterPage(query);
    applyHighlights(query);
}

saveOriginalHTML();

searchInput.addEventListener("input", (e) => {
    updateSearch(e.target.value);
});

searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim()) {
    renderDropdown(searchInput.value);
    }
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) {
    dropdown.classList.remove("show");
    }
});

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
    dropdown.classList.remove("show");
    searchInput.blur();
    searchInput.value = "";
    updateSearch("");
    }
});

document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    searchInput.focus();
    }
});