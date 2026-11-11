const listaCanciones = [
  // Vaporwave / Synthwave
  { titulo: "Resonancia", artista: "HOME", descripcion: "Synthwave relajante para programar o estudiar.", busquedaYT: "HOME - Resonance" },
  { titulo: "Nightcall", artista: "Kavinsky", descripcion: "El himno del synthwave. Perfecto para conducir de noche.", busquedaYT: "Kavinsky Nightcall" },
  { titulo: "Midnight City", artista: "M83", descripcion: "Shoegaze electrónico con un saxofón inolvidable.", busquedaYT: "M83 Midnight City" },
  { titulo: "Llorando en el Club", artista: "Vaporwave de los 80", descripcion: "Sintetizadores nostálgicos para cuando extrañas una época que no viviste.", busquedaYT: "vaporwave mix 80s" },
  
  // Shoegaze / Dream Pop
  { titulo: "Cherry-coloured Funk", artista: "Cocteau Twins", descripcion: "La voz de Elizabeth Fraser es de otro planeta.", busquedaYT: "Cocteau Twins Cherry-coloured Funk" },
  { titulo: "When You Sleep", artista: "My Bloody Valentine", descripcion: "Paredes de ruido hermoso. El pico del shoegaze.", busquedaYT: "My Bloody Valentine When You Sleep" },
  { titulo: "Space Song", artista: "Beach House", descripcion: "Dream pop etéreo para flotar en el espacio.", busquedaYT: "Beach House Space Song" },
  
  // Chicha / Cumbia Psicodélica
  { titulo: "Cumbia Espacial", artista: "Chicha Peruana", descripcion: "Guitarras psicodélicas con ritmo de cumbia. Una joya absoluta de Sudamérica.", busquedaYT: "chicha peruana clasicos" },
  { titulo: "La Danza de los Mirlos", artista: "Los Mirlos", descripcion: "Cumbia amazónica de los 70. Puro ritmo selvático.", busquedaYT: "Los Mirlos La Danza de los Mirlos" },
  { titulo: "El Cóndor Pasa", artista: "Los Destellos", descripcion: "Cumbia peruana con guitarra eléctrica. Un clásico.", busquedaYT: "Los Destellos El Condor Pasa" },
  
  // Jazz Noir
  { titulo: "Jazz en un Callejón", artista: "Jazz Noir", descripcion: "Para cuando te sientes como un detective en una película de los años 40.", busquedaYT: "jazz noir playlist" },
  { titulo: "So What", artista: "Miles Davis", descripcion: "El estándar del jazz modal. Un viaje de 9 minutos.", busquedaYT: "Miles Davis So What" },
  { titulo: "Take Five", artista: "Dave Brubeck", descripcion: "El jazz en compás de 5/4 que todos conocen sin saberlo.", busquedaYT: "Dave Brubeck Take Five" },
  
  // Punk / Post-Punk
  { titulo: "Punk en tu Idioma", artista: "Punk Español de los 80", descripcion: "Rápido, sucio y con mensaje. La rebeldía no entiende de fronteras.", busquedaYT: "punk español 80s" },
  { titulo: "Disorder", artista: "Joy Division", descripcion: "El post-punk más oscuro y melancólico de Manchester.", busquedaYT: "Joy Division Disorder" },
  { titulo: "London Calling", artista: "The Clash", descripcion: "Punk con reggae y rock. Un himno de los 70.", busquedaYT: "The Clash London Calling" },
  
  // Lo-Fi / Chill
  { titulo: "Café y Lluvia", artista: "Lo-Fi Hip Hop", descripcion: "Para esos días de lluvia en los que solo quieres una manta y un buen libro.", busquedaYT: "lofi hip hop radio" },
  { titulo: "Snowman", artista: "WYS", descripcion: "Beat de lo-fi perfecto para estudiar.", busquedaYT: "WYS Snowman" },
  { titulo: "Affection", artista: "Jinsang", descripcion: "Lo-fi con samples de jazz. Relajación pura.", busquedaYT: "Jinsang Affection" },
  
  // Metal / Doom
  { titulo: "Dunkelheit", artista: "Burzum", descripcion: "Black metal atmosférico. Oscuro y frío.", busquedaYT: "Burzum Dunkelheit" },
  { titulo: "Sabbath Bloody Sabbath", artista: "Black Sabbath", descripcion: "El padre de todos los riffs pesados.", busquedaYT: "Black Sabbath Sabbath Bloody Sabbath" },
  
  // Electrónica / IDM
  { titulo: "Xtal", artista: "Aphex Twin", descripcion: "Ambient techno de los 90. Flotando en el espacio.", busquedaYT: "Aphex Twin Xtal" },
  { titulo: "Windowlicker", artista: "Aphex Twin", descripcion: "IDM experimental. Un viaje alucinante.", busquedaYT: "Aphex Twin Windowlicker" },
  
  // Indie / Folk
  { titulo: "Holocene", artista: "Bon Iver", descripcion: "Folk indie con armonías vocales increíbles.", busquedaYT: "Bon Iver Holocene" },
  { titulo: "The Night We Met", artista: "Lord Huron", descripcion: "Folk melancólico para cuando extrañas a alguien.", busquedaYT: "Lord Huron The Night We Met" },
  
  // Rap / Hip Hop alternativo
  { titulo: "Alright", artista: "Kendrick Lamar", descripcion: "Himno del hip hop moderno. Un clásico instantáneo.", busquedaYT: "Kendrick Lamar Alright" },
  { titulo: "90210", artista: "Travis Scott", descripcion: "Trap psicodélico con cambios de ritmo brutales.", busquedaYT: "Travis Scott 90210" },
  
  // Música Clásica Moderna
  { titulo: "Clair de Lune", artista: "Claude Debussy", descripcion: "Piano impresionista. La banda sonora de la luna.", busquedaYT: "Debussy Clair de Lune" },
  { titulo: "Nuvole Bianche", artista: "Ludovico Einaudi", descripcion: "Piano minimalista con muchísima emoción.", busquedaYT: "Ludovico Einaudi Nuvole Bianche" },
  
  // Rock Alternativo / Grunge
  { titulo: "Teardrop", artista: "Massive Attack", descripcion: "Trip hop. El inicio de House (la serie).", busquedaYT: "Massive Attack Teardrop" },
  { titulo: "Everlong", artista: "Foo Fighters", descripcion: "Uno de los mejores riffs del rock alternativo.", busquedaYT: "Foo Fighters Everlong" },
  
  // Latino / Alternativo
  { titulo: "El Microbito", artista: "Fobia", descripcion: "Rock alternativo mexicano de los 90. Nostalgia pura.", busquedaYT: "Fobia El Microbito" },
  { titulo: "Lamento Boliviano", artista: "Los Enanitos Verdes", descripcion: "El rock latino que todos cantamos.", busquedaYT: "Los Enanitos Verdes Lamento Boliviano" },
  { titulo: "De Música Ligera", artista: "Soda Stereo", descripcion: "El himno del rock en español. Nada más que decir.", busquedaYT: "Soda Stereo De Musica Ligera" },
  
  // Ambient / Chillout
  { titulo: "An Ending (Ascent)", artista: "Brian Eno", descripcion: "Ambient espacial. Música para pensar.", busquedaYT: "Brian Eno An Ending Ascent" },
  { titulo: "Weightless", artista: "Marconi Union", descripcion: "Científicamente diseñada para ser la canción más relajante del mundo.", busquedaYT: "Marconi Union Weightless" },
  
  // Jazz Fusión
  { titulo: "Peaches en Regalia", artista: "Frank Zappa", descripcion: "Jazz fusión complejo y divertido.", busquedaYT: "Frank Zappa Peaches en Regalia" },
  { titulo: "Birdland", artista: "Weather Report", descripcion: "Fusión de jazz y rock con un bajo eléctrico brutal.", busquedaYT: "Weather Report Birdland" },
  
  // Clásicos Ocultos
  { titulo: "O Superman", artista: "Laurie Anderson", descripcion: "Arte sonoro vanguardista de los 80. Rarísimo y genial.", busquedaYT: "Laurie Anderson O Superman" },
  { titulo: "Tainted Love", artista: "Soft Cell", descripcion: "Synth-pop con un toque oscuro. Un clásico de los 80.", busquedaYT: "Soft Cell Tainted Love" },
  
  // Más de nicho
  { titulo: "Breathe", artista: "The Prodigy", descripcion: "Big beat electrónico para entrenar o despejar la mente.", busquedaYT: "The Prodigy Breathe" },
  { titulo: "Block Rockin' Beats", artista: "The Chemical Brothers", descripcion: "Electrónica con breakbeats. Pura energía.", busquedaYT: "The Chemical Brothers Block Rockin Beats" },
  { titulo: "Karmacoma", artista: "Massive Attack", descripcion: "Trip hop oscuro y sensual.", busquedaYT: "Massive Attack Karmacoma" },
  { titulo: "Teardrop", artista: "Massive Attack", descripcion: "Ya lo tenemos, pero es que es buenísimo.", busquedaYT: "Massive Attack Teardrop" },
  { titulo: "Sunset Lover", artista: "Petit Biscuit", descripcion: "Electrónica chill con un toque francés.", busquedaYT: "Petit Biscuit Sunset Lover" },
  { titulo: "Intro", artista: "The xx", descripcion: "Indie pop con un riff de guitarra icónico.", busquedaYT: "The xx Intro" },
  { titulo: "No Diggity", artista: "Blackstreet", descripcion: "R&B de los 90. Suena en todas las fiestas.", busquedaYT: "Blackstreet No Diggity" },
  { titulo: "C.R.E.A.M.", artista: "Wu-Tang Clan", descripcion: "Hip hop clásico de los 90. Puro estilo.", busquedaYT: "Wu-Tang Clan C.R.E.A.M." },
  { titulo: "Sing About Me", artista: "Kendrick Lamar", descripcion: "Hip hop narrativo. Una obra maestra.", busquedaYT: "Kendrick Lamar Sing About Me" },
  { titulo: "Strobe", artista: "deadmau5", descripcion: "Progressive house. La canción más épica de la electrónica.", busquedaYT: "deadmau5 Strobe" },
  { titulo: "Redbone", artista: "Childish Gambino", descripcion: "Funk/soul moderno con falsete. Pegadiza.", busquedaYT: "Childish Gambino Redbone" }
];
