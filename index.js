const searchBar = document.querySelector('form');
const inputBox = document.querySelector('.input-box');
const searchBtn = document.querySelector('.search-btn');
const moviesContainer = document.querySelector('.movies-container');
const popupOverlay = document.getElementById('popupOverlay');
const closeBtn = document.getElementById('closeBtn');

let moviesData = [];

searchBar.addEventListener('submit', (e) => {
    e.preventDefault();
    let movieName = inputBox.value;
    console.log(movieName);
    tvMazeAPI(movieName);
})

async function tvMazeAPI(movieName){
    const req = await fetch(`https://api.tvmaze.com/search/shows?q=${movieName}`);
    const movies = await req.json();
    console.log(movies);
    moviesData = movies;
    showImages(movies);
}

function showImages(movies){
    moviesContainer.innerHTML = '';
    movies.forEach((movie, index) => {
        // Create movie card container
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.setAttribute('data-index', index);
        
        // Create image element
        const img = document.createElement('img');
        let src = movie.show.image ? movie.show.image.medium : 'https://via.placeholder.com/145x218?text=No+Image';
        img.src = src;
        
        // Create movie info container
        const movieInfo = document.createElement('div');
        movieInfo.className = 'movie-info';
        
        // Create movie name
        const name = document.createElement('h3');
        name.innerText = movie.show.name;
        
        // Create language info
        const language = document.createElement('p');
        language.innerText = `Language: ${movie.show.language || 'Unknown'}`;
        
        // Create genres info
        const genres = document.createElement('p');
        genres.className = 'genres';
        genres.innerText = `Genres: ${movie.show.genres.length > 0 ? movie.show.genres.join(', ') : 'Unknown'}`;
        
        // Append elements to movie info
        movieInfo.appendChild(name);
        movieInfo.appendChild(language);
        movieInfo.appendChild(genres);
        
        // Append elements to movie card
        movieCard.appendChild(img);
        movieCard.appendChild(movieInfo);
        
        // Add click event listener
        movieCard.addEventListener('click', () => openPopup(index));
        
        // Append movie card to container
        moviesContainer.appendChild(movieCard);
    });
}

function openPopup(index) {
    const movie = moviesData[index].show;
    
    // Populate popup content
    document.getElementById('popupTitle').innerText = movie.name;
    document.getElementById('popupImage').src = movie.image ? movie.image.original || movie.image.medium : 'https://via.placeholder.com/300x450?text=No+Image';
    document.getElementById('popupSummary').innerHTML = movie.summary || 'No summary available.';
    document.getElementById('popupLanguage').innerText = movie.language || 'Unknown';
    document.getElementById('popupGenres').innerText = movie.genres.length > 0 ? movie.genres.join(', ') : 'Unknown';
    document.getElementById('popupStatus').innerText = movie.status || 'Unknown';
    document.getElementById('popupRuntime').innerText = movie.runtime ? movie.runtime + ' minutes' : 'Unknown';
    document.getElementById('popupRating').innerText = movie.rating.average || 'Not rated';
    document.getElementById('popupPremiered').innerText = movie.premiered || 'Unknown';
    document.getElementById('popupNetwork').innerText = movie.network ? movie.network.name : 'Unknown';
    
    // Show popup
    popupOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    popupOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close popup event listeners
closeBtn.addEventListener('click', closePopup);
popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
        closePopup();
    }
});

// Close popup with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
        closePopup();
    }
});