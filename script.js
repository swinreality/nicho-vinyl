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
const searchType = document.getElementById('search-type'); 
const surpriseType = document.getElementById('surprise-type'); 
const fechaHoy = document.getElementById('fecha-hoy');
const artistImage = document.getElementById('artist-image'); 
const favBtn = document.getElementById('fav-btn');
const shareBtn = document.getElementById('share-btn');
const radioBtn = document.getElementById('radio-btn');
const nicheBar = document.getElementById('niche-bar');
const nicheText = document.getElementById('niche-text');
const tooltipBio = document.getElementById('tooltip-bio');

// Vistas y Favoritos
const viewExplore = document.getElementById('view-explore');
const viewFavs = document.getElementById('view-favs');
const favsList = document.getElementById('favs-list');
const toggleFavsBtn = document.getElementById('toggle-favs-btn');
const backToExploreBtn = document.getElementById('back-to-explore');
const favCount = document.getElementById('fav-count');

// Menú desplegable
const dropdownMenu = document.getElementById('dropdown-menu');
const dropbtn = document.querySelector('.dropbtn');

// Historial y Favoritos
let historial = [];
let cancionActual = null;
let favoritos = JSON.parse(localStorage.getItem('nichoFavoritos')) || [];
let radioInterval = null; 
let generoRadioActual = null;

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

  if (tooltipBio) tooltipBio.classList.remove('active');

  // Llamamos a las funciones de imagen, nicho y biografía
  buscarImagenArtista(cancion.artista);
  actualizarBotonFavorito();
  calcularNicho(cancion.artista);
  cargarTooltip(cancion.artista);
}

// --- 3. COMPARTIR ---
if (shareBtn) {
  shareBtn.addEventListener('click', () => {
    if (!cancionActual) return;
    const texto = `¡Échale un ojo a esta joya oculta que encontré en Nicho Vinyl! 🎵 ${cancionActual.titulo} - ${cancionActual.artista} \n https://swinreality.github.io/nicho-vinyl/`;
    
    navigator.clipboard.writeText(texto).then(() => {
      shareBtn.textContent = '✅';
      setTimeout(() => { shareBtn.textContent = '📋'; }, 2000);
    }).catch(err => {
      alert("No se pudo copiar. Aquí tienes el texto: " + texto);
    });
  });
}

// --- 4. MAPA DE NICHO ---
async function calcularNicho(artista) {
  if (!nicheBar || !nicheText) return;
  nicheBar.style.width = '50%';
  nicheBar.style.backgroundColor = '#8d6e63';
  nicheText.textContent = "Calculando...";

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artista)}&api_key=${LASTFM_API_KEY}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.artist && data.artist.stats && data.artist.stats.listeners) {
      const listeners = parseInt(data.artist.stats.listeners);
      let percentage = 100;
      let label = "";
      
      if (listeners > 1000000) { percentage = 10; label = "Mainstream (Muy popular)"; }
      else if (listeners > 100000) { percentage = 40; label = "Conocido"; }
      else if (listeners > 10000) { percentage = 70; label = "Nicho (Poco conocido)"; }
      else { percentage = 95; label = "Underground (Joya oculta)"; }

      nicheBar.style.width = `${percentage}%`;
      nicheText.textContent = label;
      
      if (percentage > 80) nicheBar.style.backgroundColor = '#3e2723';
      else if (percentage > 50) nicheBar.style.backgroundColor = '#8d6e63';
      else nicheBar.style.backgroundColor = '#d7ccc8';
    }
  } catch (error) {
    console.error("Error calculando nicho:", error);
  }
}

// --- 5. TOOLTIP BIOGRAFÍA ---
async function cargarTooltip(artista) {
  if (!tooltipBio) return;
  tooltipBio.textContent = "Cargando...";

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artista)}&api_key=${LASTFM_API_KEY}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.artist && data.artist.bio && data.artist.bio.summary) {
      let bio = data.artist.bio.summary;
      bio = bio.replace(/<a href=".*?">.*?<\/a>/g, ''); 
      bio = bio.replace(/\s+/g, ' '); 
      tooltipBio.textContent = bio;
    } else {
      tooltipBio.textContent = "Sin biografía disponible.";
    }
  } catch (error) {
    tooltipBio.textContent = "Error cargando biografía.";
  }
}

// LÓGICA DEL RATÓN
const imageContainer = document.getElementById('image-container');
let timeoutHover;

if (imageContainer && tooltipBio) {
  imageContainer.addEventListener('mouseenter', () => {
    clearTimeout(timeoutHover);
    tooltipBio.classList.add('active');
  });

  imageContainer.addEventListener('mouseleave', () => {
    timeoutHover = setTimeout(() => {
      if (!tooltipBio.matches(':hover')) {
        tooltipBio.classList.remove('active');
      }
    }, 200);
  });

  tooltipBio.addEventListener('mouseenter', () => {
    clearTimeout(timeoutHover);
  });

  tooltipBio.addEventListener('mouseleave', () => {
    tooltipBio.classList.remove('active');
  });
}

// --- 6. FAVORITOS ---
function actualizarBotonFavorito() {
  if (!favBtn || !cancionActual) return;
  const esFavorito = favoritos.some(fav => fav.artista === cancionActual.artista && fav.titulo === cancionActual.titulo);
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
        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(fav.busquedaYT || (fav.artista + ' ' + fav.titulo))}" target="_blank" class="yt-btn">▶ YouTube</a>
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
    const index = favoritos.findIndex(fav => fav.artista === cancionActual.artista && fav.titulo === cancionActual.titulo);
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

// --- 7. IMAGEN ---
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

// --- 8. OBTENER CANCIÓN TOP ---
async function obtenerTopCancionArtista(artista) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodeURIComponent(artista)}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.toptracks && data.toptracks.track && data.toptracks.track.length > 0) {
      return data.toptracks.track[0].name;
    }
  } catch (error) { console.error("Error obteniendo top track:", error); }
  return "Una canción"; 
}

// --- 9. LAST.FM SIMILARES ---
async function buscarSimilarLastFM(artista) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&artist=${encodeURIComponent(artista)}&api_key=${LASTFM_API_KEY}&format=json&limit=20`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.similarartists && data.similarartists.artist.length > 0) {
      const artistasFiltrados = data.similarartists.artist.filter(a => a.name.toLowerCase() !== artista.toLowerCase());
      if (artistasFiltrados.length > 0) {
        const elegido = artistasFiltrados[Math.floor(Math.random() * artistasFiltrados.length)];
        return await procesarArtistaSugerido(elegido.name, `Conexión encontrada: Porque te gustó ${artista}.`);
      }
    }
  } catch (error) { console.error(error); }
  return null;
}

// --- 10. BUSCAR POR GÉNERO ---
async function buscarPorGenero(genero) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${encodeURIComponent(genero)}&api_key=${LASTFM_API_KEY}&format=json&limit=30`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.topartists && data.topartists.artist.length > 0) {
      let artistasFiltrados = data.topartists.artist;
      if (cancionActual && cancionActual.artista) {
        artistasFiltrados = artistasFiltrados.filter(a => a.name.toLowerCase() !== cancionActual.artista.toLowerCase());
      }
      if (artistasFiltrados.length > 0) {
        const elegido = artistasFiltrados[Math.floor(Math.random() * artistasFiltrados.length)];
        return await procesarArtistaSugerido(elegido.name, `Una joya del género ${genero}.`);
      }
    }
  } catch (error) { console.error(error); }
  return null;
}

// --- 11. PROCESAR ARTISTA SUGERIDO ---
async function procesarArtistaSugerido(nombreArtista, contextoDescripcion) {
  const tipoSorpresa = surpriseType ? surpriseType.value : 'artist';
  
  if (tipoSorpresa === 'track') {
    const topCancion = await obtenerTopCancionArtista(nombreArtista);
    return {
      titulo: topCancion,
      artista: nombreArtista,
      descripcion: `${contextoDescripcion} Escucha esta canción.`,
      busquedaYT: `${nombreArtista} ${topCancion}`
    };
  } else {
    return {
      titulo: "Artista Recomendado",
      artista: nombreArtista,
      descripcion: `${contextoDescripcion} Explora su discografía.`,
      busquedaYT: nombreArtista
    };
  }
}

// --- 12. BÚSQUEDA ESPECÍFICA ---
async function buscarCancionEspecifica(query) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${LASTFM_API_KEY}&format=json&limit=5`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.trackmatches && data.results.trackmatches.track.length > 0) {
      const track = data.results.trackmatches.track[0];
      return {
        titulo: track.name,
        artista: track.artist,
        descripcion: `Resultado de búsqueda para la canción: "${query}".`,
        busquedaYT: `${track.artist} ${track.name}`
      };
    }
  } catch (error) { console.error(error); }
  return null;
}

// --- 13. FUNCIÓN PRINCIPAL DE SORPRESA ---
async function generarSorpresa() {
  if (radioInterval) {
    clearInterval(radioInterval);
    radioInterval = null;
    radioBtn.textContent = '📻 Activar Modo Radio';
    radioBtn.classList.remove('activo');
  }

  if (songTitle) songTitle.textContent = "Buscando...";
  if (songDesc) songDesc.textContent = "Consultando el algoritmo...";
  
  let nuevaCancion = null;
  let intentos = 0;
  
  while (!nuevaCancion && intentos < 5) {
    intentos++;
    let posibleCancion = null;
    
    if (generoRadioActual) {
      posibleCancion = await buscarPorGenero(generoRadioActual);
    } else if (cancionActual && cancionActual.artista) {
      posibleCancion = await buscarSimilarLastFM(cancionActual.artista);
    }
    
    if (posibleCancion && (!cancionActual || posibleCancion.artista.toLowerCase() !== cancionActual.artista.toLowerCase())) {
      nuevaCancion = posibleCancion;
    }
  }
  
  if (!nuevaCancion) {
    nuevaCancion = listaCanciones[Math.floor(Math.random() * listaCanciones.length)];
  }
  
  mostrarCancion(nuevaCancion);
}

// --- 14. MODO RADIO (5 SEGUNDOS) ---
if (radioBtn) {
  radioBtn.addEventListener('click', () => {
    if (radioInterval) {
      clearInterval(radioInterval);
      radioInterval = null;
      generoRadioActual = null;
      radioBtn.textContent = '📻 Activar Modo Radio';
      radioBtn.classList.remove('activo');
    } else {
      radioBtn.textContent = '⏹ Detener Radio';
      radioBtn.classList.add('activo');
      
      if (cancionActual && cancionActual.descripcion) {
        const match = cancionActual.descripcion.match(/género (.*?)\./);
        generoRadioActual = match ? match[1] : null;
      }

      generarSorpresa();
      radioInterval = setInterval(generarSorpresa, 5000);
    }
  });
}

// --- 15. EVENTOS DE LOS BOTONES ---
if (nextBtn) {
  nextBtn.addEventListener('click', generarSorpresa);
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (radioInterval) {
      clearInterval(radioInterval);
      radioInterval = null;
      radioBtn.textContent = '📻 Activar Modo Radio';
      radioBtn.classList.remove('activo');
    }
    if (historial.length > 0) {
      const cancionAnterior = historial.pop();
      mostrarCancion(cancionAnterior, false);
    } else {
      alert("No hay canciones en el historial aún. ¡Sigue explorando!");
    }
  });
}

const tags = document.querySelectorAll('.tag:not(.dropdown-content .tag)');
if (tags.length > 0) {
  tags.forEach(tag => {
    tag.addEventListener('click', async () => {
      const genero = tag.getAttribute('data-tag');
      if (radioInterval) { 
        clearInterval(radioInterval);
        radioInterval = null;
        radioBtn.textContent = '📻 Activar Modo Radio';
        radioBtn.classList.remove('activo');
      }
      generoRadioActual = genero;
      if (songTitle) songTitle.textContent = "Buscando...";
      if (songArtist) songArtist.textContent = "...";
      if (songDesc) songDesc.textContent = "Consultando el algoritmo...";
      const resultado = await buscarPorGenero(genero);
      if (resultado) mostrarCancion(resultado);
    });
  });
}

if (searchBtn) {
  searchBtn.addEventListener('click', async () => {
    if (radioInterval) {
      clearInterval(radioInterval);
      radioInterval = null;
      radioBtn.textContent = '📻 Activar Modo Radio';
      radioBtn.classList.remove('activo');
    }
    const query = searchInput.value.trim();
    if (!query) return;
    
    generoRadioActual = null; 
    if (songTitle) songTitle.textContent = "Buscando...";
    if (songDesc) songDesc.textContent = `Buscando...`;

    let resultado = null;
    
    if (searchType.value === 'track') {
      if (songArtist) songArtist.textContent = "Buscando canción...";
      resultado = await buscarCancionEspecifica(query);
    } else {
      if (songArtist) songArtist.textContent = "Conectando con el nicho...";
      resultado = await buscarSimilarLastFM(query);
      if (!resultado) {
        resultado = await buscarPorGenero(query);
      }
    }

    if (resultado) {
      mostrarCancion(resultado);
    } else {
      mostrarCancion({
        titulo: "No encontrado",
        artista: query,
        descripcion: "No encontramos resultados. Prueba con otro nombre.",
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

// --- 16. MENÚ DESPLEGABLE ---
const listaGeneros = [
  "rock", "pop", "metal", "punk", "blues", "reggae", "salsa", "bachata", 
  "electronica", "techno", "house", "trap", "rap", "hip-hop", "clasica", 
  "folk", "country", "gospel", "soul", "funk", "disco", "ambient", "indie", 
  "alternativo", "ska", "merengue", "reggaeton", "flamenco", "tango", "jazz fusión"
];

if (dropdownMenu) {
  listaGeneros.forEach(genero => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = genero.charAt(0).toUpperCase() + genero.slice(1);
    span.setAttribute('data-tag', genero);
    span.addEventListener('click', async () => {
      dropdownMenu.classList.remove('show');
      if (radioInterval) {
        clearInterval(radioInterval);
        radioInterval = null;
        radioBtn.textContent = '📻 Activar Modo Radio';
        radioBtn.classList.remove('activo');
      }
      generoRadioActual = genero;
      const query = genero;
      if (songTitle) songTitle.textContent = "Buscando...";
      if (songDesc) songDesc.textContent = "Consultando...";
      const resultado = await buscarPorGenero(query);
      if (resultado) mostrarCancion(resultado);
    });
    dropdownMenu.appendChild(span);
  });
}

if (dropbtn) {
  dropbtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });
}

window.addEventListener('click', (e) => {
  if (!e.target.matches('.dropbtn')) {
    if (dropdownMenu.classList.contains('show')) {
      dropdownMenu.classList.remove('show');
    }
  }
});

// --- 17. INICIALIZACIÓN ---
mostrarFecha();
if (favCount) favCount.textContent = favoritos.length;
const inicioRandom = listaCanciones[Math.floor(Math.random() * listaCanciones.length)];
mostrarCancion(inicioRandom, false);
