// --- CONFIGURACIÓN DE LAST.FM ---
const LASTFM_API_KEY = '5996e9a82e91c43fa85d5b359ef8aef9'; 

// Elementos del DOM
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const songDesc = document.getElementById('song-desc');
const ytLink = document.getElementById('yt-link');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const fechaHoy = document.getElementById('fecha-hoy');
const artistImage = document.getElementById('artist-image'); 
const favBtn = document.getElementById('fav-btn');

// Vistas y Favoritos
const viewExplore = document.getElementById('view-explore');
const viewFavs = document.getElementById('view-favs');
const favsList = document.getElementById('favs-list');
const toggleFavsBtn = document.getElementById('toggle-favs-btn');
const backToExploreBtn = document.getElementById('back-to-explore');
const favCount = document.getElementById('fav-count');

// Historial y Favoritos
let historial = [];
let cancionActual = null;
let favoritos = JSON.parse(localStorage.getItem('nichoFavoritos')) || [];

// --- 1. MOSTRAR LA FECHA ---
function mostrarFecha() {
  if (!fechaHoy) return;
  const hoy = new Date();
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  fechaHoy.textContent = "Edición del " + hoy.toLocaleDateString('es-ES', opciones);
}

// --- 2. MOSTRAR CANCIÓN ---
function mostrarCancion(cancion, guardarEnHistorial = true) {
  if (guardarEnHistorial && cancionActual !== null) {
    historial.push(cancionActual);
  }
  
  cancionActual = cancion;
  if (songTitle) songTitle.textContent = cancion.titulo;
  if (songArtist) songArtist.textContent = cancion.artista;
  if (songDesc) songDesc.textContent = cancion.descripcion || "Una joya oculta de la red.";
  
  const query = cancion.busquedaYT || `${cancion.artista} ${cancion.titulo}`;
  if (ytLink) {
    ytLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    ytLink.style.display = 'inline-block';
  }

  buscarImagenArtista(cancion.artista);
  actualizarBotonFavorito();
}

// --- 3. FAVORITOS ---
function actualizarBotonFavorito() {
  if (!favBtn || !cancionActual) return;
  const esFavorito = favoritos.some(fav => fav.artista === cancionActual.artista);
  if (esFavorito) {
    favBtn.textContent = '❤️';
    favBtn.title = "Quitar de favoritos";
  } else {
    favBtn.textContent = '🤍';
    favBtn.title = "Guardar en favoritos";
  }
}

function guardarFavoritos() {
  localStorage.setItem('nichoFavoritos', JSON.stringify(favoritos));
  favCount.textContent = favoritos.length;
  renderizarFavoritos();
}

function renderizarFavoritos() {
  if (favoritos.length === 0) {
    favsList.innerHTML = '<p style="text-align: center; font-style: italic; color: #8d6e63;">Aún no tienes joyas guardadas. Explora y dale al corazón.</p>';
    return;
  }

  favsList.innerHTML = '';
  favoritos.forEach((fav, index) => {
    const div = document.createElement('div');
    div.className = 'fav-item';
    div.innerHTML = `
      <div class="fav-item-info">
        <h4>${fav.artista}</h4>
        <p>${fav.titulo}</p>
      </div>
      <div class="fav-item-actions">
        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(fav.artista + ' ' + (fav.busquedaYT || ''))}" target="_blank" class="yt-btn">▶ YouTube</a>
        <button class="remove-fav-btn" data-index="${index}">🗑️</button>
      </div>
    `;
    favsList.appendChild(div);
  });

  document.querySelectorAll('.remove-fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      favoritos.splice(index, 1);
      guardarFavoritos();
      actualizarBotonFavorito();
    });
  });
}

if (favBtn) {
  favBtn.addEventListener('click', () => {
    if (!cancionActual) return;
    const index = favoritos.findIndex(fav => fav.artista === cancionActual.artista);
    if (index === -1) {
      favoritos.push(cancionActual);
    } else {
      favoritos.splice(index, 1);
    }
    guardarFavoritos();
    actualizarBotonFavorito();
  });
}

if (toggleFavsBtn) {
  toggleFavsBtn.addEventListener('click', () => {
    viewExplore.style.display = 'none';
    viewFavs.style.display = 'block';
    renderizarFavoritos();
  });
}

if (backToExploreBtn) {
  backToExploreBtn.addEventListener('click', () => {
    viewFavs.style.display = 'none';
    viewExplore.style.display = 'block';
  });
}

// --- 4. IMAGEN ---
async function buscarImagenArtista(artista) {
  if (!artistImage) return;
  const fallbackImg = "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=200&auto=format&fit=crop";
  artistImage.src = "https://via.placeholder.com/150/8d6e63/fffaf0?text=Buscando...";

  try {
    const urlItunes = `https://itunes.apple.com/search?term=${encodeURIComponent(artista)}&entity=musicArtist&limit=1`;
    const resItunes = await fetch(urlItunes);
    const dataItunes = await resItunes.json();

    if (dataItunes.results && dataItunes.results.length > 0) {
      const artistaId = dataItunes.results[0].artistId;
      const urlAlbums = `https://itunes.apple.com/lookup?id=${artistaId}&entity=album&limit=1`;
      const resAlbums = await fetch(urlAlbums);
      const dataAlbums = await resAlbums.json();

      if (dataAlbums.results.length > 1 && dataAlbums.results[1].artworkUrl100) {
        let imgUrl = dataAlbums.results[1].artworkUrl100.replace('100x100bb', '200x200bb');
        artistImage.src = imgUrl;
        return; 
      }
    }
    const urlDeezer = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artista)}&limit=1`;
    const resDeezer = await fetch(urlDeezer);
    const dataDeezer = await resDeezer.json();

    if (dataDeezer.data && dataDeezer.data.length > 0 && dataDeezer.data[0].picture_medium) {
      artistImage.src = dataDeezer.data[0].picture_medium;
    } else {
      artistImage.src = fallbackImg; 
    }
  } catch (error) {
    if (artistImage) artistImage.src = fallbackImg; 
  }
}

// --- 5. LAST.FM SIMILARES ---
async function buscarSimilarLastFM(artista) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&artist=${encodeURIComponent(artista)}&api_key=${LASTFM_API_KEY}&format=json&limit=10`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.similarartists && data.similarartists.artist.length > 0) {
      const elegido = data.similarartists.artist[Math.floor(Math.random() * data.similarartists.artist.length)];
      return {
        titulo: "Recomendación de Nicho",
        artista: elegido.name,
        descripcion: `Conexión encontrada: Porque te gustó ${artista}, prueba con este artista.`,
        busquedaYT: elegido.name
      };
    }
  } catch (error) { console.error(error); }
  return null;
}

// --- 6. BUSCAR POR GÉNERO ---
async function buscarPorGenero(genero) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${encodeURIComponent(genero)}&api_key=${LASTFM_API_KEY}&format=json&limit=20`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.topartists && data.topartists.artist.length > 0) {
      const elegido = data.topartists.artist[Math.floor(Math.random() * data.topartists.artist.length)];
      return {
        titulo: `Joya Oculta de ${genero}`,
        artista: elegido.name,
        descripcion: `Un clásico o un artista emergente del género ${genero}. Dale play y descubre.`,
        busquedaYT: `${elegido.name} ${genero}`
      };
    }
  } catch (error) { console.error(error); }
  return null;
}

// --- 7. EVENTOS DE LOS BOTONES ---

// Botones de Género
const tags = document.querySelectorAll('.tag');
if (tags.length > 0) {
  tags.forEach(tag => {
    tag.addEventListener('click', async () => {
      const genero = tag.getAttribute('data-tag');
      if (songTitle) songTitle.textContent = "Buscando...";
      if (songArtist) songArtist.textContent = "...";
      if (songDesc) songDesc.textContent = "Consultando el algoritmo...";
      if (ytLink) ytLink.style.display = 'none';
      const resultado = await buscarPorGenero(genero);
      if (resultado) mostrarCancion(resultado);
    });
  });
}

// Botón Siguiente
if (nextBtn) {
  nextBtn.addEventListener('click', async () => {
    if (songTitle) songTitle.textContent = "Buscando...";
    if (songArtist) songArtist.textContent = "...";
    if (songDesc) songDesc.textContent = "Consultando el algoritmo...";
    if (ytLink) ytLink.style.display = 'none';
    let nuevaCancion = null;
    if (cancionActual && cancionActual.artista) {
      nuevaCancion = await buscarSimilarLastFM(cancionActual.artista);
    }
    if (!nuevaCancion) {
      nuevaCancion = listaCanciones[Math.floor(Math.random() * listaCanciones.length)];
    }
    mostrarCancion(nuevaCancion);
  });
}

// Botón Anterior
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (historial.length > 0) {
      const cancionAnterior = historial.pop();
      mostrarCancion(cancionAnterior, false);
    } else {
      alert("No hay canciones en el historial aún. ¡Sigue explorando!");
    }
  });
}

// Buscador Inteligente (Artista o Género)
if (searchBtn) {
  searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (!query) return;
    
    if (songTitle) songTitle.textContent = "Buscando...";
    if (songArtist) songArtist.textContent = "Conectando con el nicho...";
    if (songDesc) songDesc.textContent = `Buscando recomendaciones basadas en "${query}"...`;
    if (ytLink) ytLink.style.display = 'none';

    // 1. Intentamos buscar recomendaciones basadas en el artista
    let resultado = await buscarSimilarLastFM(query);
    
    // 2. Si no encuentra nada (o no es un artista conocido), intentamos como género
    if (!resultado) {
      resultado = await buscarPorGenero(query);
    }

    // 3. Si encontramos algo, lo mostramos
    if (resultado) {
      mostrarCancion(resultado);
    } else {
      mostrarCancion({
        titulo: "No encontrado",
        artista: query,
        descripcion: "No encontramos ese artista o género en el nicho. Prueba con otro nombre.",
        busquedaYT: query
      });
    }
  });
}

if (searchInput) {
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
  });
}

// --- 8. INICIALIZACIÓN ---
mostrarFecha();
favCount.textContent = favoritos.length;
const inicioRandom = listaCanciones[Math.floor(Math.random() * listaCanciones.length)];
mostrarCancion(inicioRandom, false);
