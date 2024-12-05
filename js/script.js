/* Base URL de la API
 Elementos del DOM
 Función para obtener Pokémon de la API
 Renderiza una lista de Pokémon // Limpia el contenido previo // Detalles del Pokémon
 Muestra Pokémon por página
 Busca Pokémon por nombre // Limpia el contenido previo // Crear una tarjeta para el Pokémon
 Eventos de los botones
 Carga inicial */

const API_URL = "https://pokeapi.co/api/v2/pokemon";
let currentPage = 0; //! Página inicial (0 para los primeros 10 Pokémon)
const limit = 10; //! Cantidad de Pokémon por página

const app = document.getElementById("app");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");

async function fetchPokemon(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

function renderPokemon(pokemonList) {
    app.innerHTML = ""; //! Limpia el contenido previo
    pokemonList.forEach(async (pokemon) => {
        const details = await fetchPokemon(pokemon.url); //! Detalles del Pokémon
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${details.sprites.front_default}" alt="${pokemon.name}">
            <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        `;
        app.appendChild(card);
    });
}

async function loadPokemon(page) {
    const offset = page * limit; //! Calcula el desplazamiento
    const url = `${API_URL}?limit=${limit}&offset=${offset}`;
    const data = await fetchPokemon(url);
    renderPokemon(data.results);
}

async function searchPokemon(name) {
    try {
        const url = `${API_URL}/${name.toLowerCase()}`;
        const details = await fetchPokemon(url);
        app.innerHTML = ""; //! Limpia el contenido previo

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${details.sprites.front_default}" alt="${details.name}">
            <h3>${details.name.charAt(0).toUpperCase() + details.name.slice(1)}</h3>
        `;
        app.appendChild(card);
    } catch {
        app.innerHTML = "<p class='error-message'>Pokemon no encontrado</p>";
    }
}

searchBtn.addEventListener("click", () => {
    const name = searchInput.value.trim();
    if (name) searchPokemon(name);
});

prevBtn.addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        loadPokemon(currentPage);
    }
});

nextBtn.addEventListener("click", () => {
    currentPage++;
    loadPokemon(currentPage);
});

resetBtn.addEventListener("click", () => {
    currentPage = 0;
    loadPokemon(currentPage);
    searchInput.value = ""; //! Limpia la búsqueda
});

loadPokemon(currentPage);
