


function getLoggedInUserEmail() {
    return localStorage.getItem('loggedInUser');
}

function addEventListenersForButtons() {
    document.querySelectorAll('.delete-playlist-button').forEach(button => {
        button.addEventListener('click', event => {
            const playlistName = event.target.getAttribute('data-playlist');
            deletePlaylist(playlistName);
        });
    });

    document.querySelectorAll('.remove-movie-button').forEach(button => {
        button.addEventListener('click', event => {
            const playlistName = event.target.getAttribute('data-playlist');
            const imdbID = event.target.getAttribute('data-imdbid');
            removeMovieFromPlaylist(playlistName, imdbID);
        });
    });


    document.querySelectorAll('.share-button').forEach(button => {
        button.addEventListener('click', event => {
            const shareLinkId = event.target.getAttribute('data-shareLinkId');
            navigator.clipboard.writeText(shareLinkId);
            alert('Playlist link copied to clipboard');
        });
    });

    document.getElementById('search-button').addEventListener('click', function () {
        const searchTerm = document.getElementById('search-input').value.trim();
        if (searchTerm) {
            fetchMovies(searchTerm);
        } else {
            alert('Please enter a movie name');
        }
    });
}

function loadPlaylists() {
    const currentLocation = window.location.pathname;

    if (currentLocation.includes("playlist-details.html")) {
        return;
    }
    const playlistsContainer = document.getElementById('playlists-container');
    playlistsContainer.innerHTML = '';

    const userEmail = getLoggedInUserEmail();
    let playlists = JSON.parse(localStorage.getItem(`${userEmail}_playlists`)) || {};

    playlists = assignIdsToPlaylists(playlists, userEmail);
    let outer = '';
    Object.keys(playlists).forEach(playlistName => {
        let moviesHTML = '';
        const playlistMovies = playlists[playlistName].movies || [];
        const visibility = playlists[playlistName].visibility || 'private';

        playlistMovies.forEach(movie => {
            moviesHTML += `
                <div class="playlist-movie-box"> 
                    <a href="movie-details.html?imdbID=${movie.imdbID}">
                        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" id="playlist-movie-image">
                        <h2 id="playlist-movie-title">${movie.Title}</h2>
                        <p id="playlist-movie-year">${movie.Year}</p>
                    </a>
                    <button id="playlist-add-to-playlist-button" class="remove-movie-button" data-imdbid="${movie.imdbID}" data-playlist="${playlistName}">Remove</button>
                </div>`
        });
        moviesHTML = `<div id="playlist-movie-container">${moviesHTML}</div>`

        const shareLinkId = `${window.location.origin}/playlist-details/playlist-details.html?email=${userEmail}&name=${playlistName}`

        outer += `<div style="display:flex;width:85%;margin:auto;margin-top:16px"><h3>${playlistName} (${visibility})</h3>
        ${visibility === 'public' ? `<button class="share-button" data-shareLinkId="${shareLinkId}" id="playlist-add-to-playlist-button" data-playlist="${playlistName}">Share</button>` : ''}
        <button class="delete-playlist-button" id="playlist-add-to-playlist-button" data-playlist="${playlistName}">Delete</button></div>
        ${moviesHTML} `;
    });
    playlistsContainer.innerHTML = outer

    addEventListenersForButtons();
}

function deletePlaylist(playlistName) {
    const userEmail = getLoggedInUserEmail();
    let playlists = JSON.parse(localStorage.getItem(`${userEmail}_playlists`)) || {};

    if (playlists[playlistName]) {
        delete playlists[playlistName];
        localStorage.setItem(`${userEmail}_playlists`, JSON.stringify(playlists));
        alert(`Playlist "${playlistName}" deleted successfully`);
        loadPlaylists(); // Reload playlists after deletion
    }
}

function removeMovieFromPlaylist(playlistName, imdbID) {
    const userEmail = getLoggedInUserEmail();
    let playlists = JSON.parse(localStorage.getItem(`${userEmail}_playlists`)) || {};

    if (playlists[playlistName]) {
        playlists[playlistName].movies = playlists[playlistName].movies.filter(movie => movie.imdbID !== imdbID);
        localStorage.setItem(`${userEmail}_playlists`, JSON.stringify(playlists));
        alert(`Movie removed from playlist "${playlistName}" successfully`);
        loadPlaylists(); // Reload playlists after movie removal
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const playlistName = params.get('name');
    const playlistEmail = params.get('email');

    const playlists = JSON.parse(localStorage.getItem(`${playlistEmail}_playlists`)) || {};
    const playlistEntry = playlists[playlistName];
    if (playlistEntry && playlistEntry.visibility === "public") {
        let moviesHTML = '';
        playlistEntry.movies.forEach(movie => {
            moviesHTML += `
                <div class="playlist-movie-box"> 
                    <a href="movie-details.html?imdbID=${movie.imdbID}">
                        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" id="playlist-movie-image">
                        <h2 id="playlist-movie-title">${movie.Title}</h2>
                        <p id="playlist-movie-year">${movie.Year}</p>
                    </a>
                </div>`
        })
        moviesHTML = `<div style="display:flex;width:80%;margin:auto;margin-top:16px"><h3>${playlistName}</h3></div><div id="playlist-movie-container">${moviesHTML}</div>`;
        document.getElementById('playlist-details').innerHTML = moviesHTML;
    } else {
        document.getElementById('playlist-details').innerHTML = '';
    }
});

loadPlaylists();

function fetchMovies(query) {
    const playlistsContainer = document.getElementById('playlists-container');
    playlistsContainer.innerHTML = '';

    const apiKey = '85838622';
    const url = `http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.Response === 'True') {
                displayMovies(data.Search);
            } else {
                alert(data.Error);
            }
        })
        .catch(error => {
            console.error('Error fetching the movies:', error);
        });
}

function displayMovies(movies) {
    const movieContainer = document.getElementById('movie-container');
    movieContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-box');

        movieElement.innerHTML = `
            <a href="movie-details.html?imdbID=${movie.imdbID}">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" id="movie-image">
                <h2 id="movie-title">${movie.Title}</h2>
                <p id="movie-year">${movie.Year}</p>
            </a>
            <button id="add-to-playlist-button" data-imdbid="${movie.imdbID}">Add to Playlist</button>
        `;

        movieContainer.appendChild(movieElement);
    });

    document.querySelectorAll('#add-to-playlist-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const imdbID = event.target.getAttribute('data-imdbid');
            const movieData = movies.find(movie => movie.imdbID === imdbID);
            if (movieData) {
                openCreatePlaylistPopup(movieData);
            } else {
                console.error('Movie data not found for IMDb ID:', imdbID);
            }
        });
    });
}

function openCreatePlaylistPopup(movieData) {
    const createPlaylistPopup = document.createElement('div');
    createPlaylistPopup.classList.add('popup-notification');
    createPlaylistPopup.innerHTML = `
        <div class="popup-content">
            <span class="close-popup">&times;</span>
            <h2>Create New Playlist</h2>
            <input type="text" id="new-playlist-name" autocomplete="off" required placeholder="Name">
            <div id="visibility-container" style="display:flex">
            <h3 style="margin-right: 16px">Visibility</h3>
            <label for="playlist-visibility">Public</label>
            <input type="range" id="playlist-visibility" class="playlist-visibility-toggle" name="visibility" min="0" max="1" step="1" value="0">
            <label for="playlist-visibility">Private</label>
            </div>
            <h3>Existing Playlists</h3>
            <form id="existing-playlists">
                <!-- Existing playlists will be dynamically added here -->
            </form>
            <button id="create-playlist-button">Add</button>
        </div>
    `;

    document.body.appendChild(createPlaylistPopup);

    const playlistNameInput = createPlaylistPopup.querySelector('#new-playlist-name');
    const visibilityInput = createPlaylistPopup.querySelector('#playlist-visibility');
    const existingPlaylistsSelect = createPlaylistPopup.querySelector('#existing-playlists');

    displayExistingPlaylists(existingPlaylistsSelect);

    document.getElementById('create-playlist-button').addEventListener('click', () => {
        const playlistName = playlistNameInput.value.trim();
        const element = document.getElementById('existing-playlists-select');

        if (playlistName) {
            const visibility = visibilityInput.value === '0' ? 'public' : 'private';
            createPlaylist(playlistName, movieData, visibility);
            document.body.removeChild(createPlaylistPopup);
        } else if (element) {
            addMovieToPlaylist(element.value, movieData);
            document.body.removeChild(createPlaylistPopup)
        } else {
            alert('Please enter a playlist name');
        }
    });

    document.querySelector('.close-popup').addEventListener('click', () => {
        document.body.removeChild(createPlaylistPopup);
    });
}

function createPlaylist(playlistName, movieData, visibility) {
    const userEmail = getLoggedInUserEmail();
    let playlists = JSON.parse(localStorage.getItem(`${userEmail}_playlists`)) || {};
    const playlistId = getNextPlaylistId(userEmail);
    if (!playlists[playlistName]) {
        playlists[playlistName] = { id: playlistId, visibility: visibility, movies: [] };
    }
    playlists[playlistName].movies.push(movieData);
    localStorage.setItem(`${userEmail}_playlists`, JSON.stringify(playlists));
    alert('Playlist created successfully!');
}

function addMovieToPlaylist(playlistName, movieData) {
    const userEmail = getLoggedInUserEmail();
    let playlists = JSON.parse(localStorage.getItem(`${userEmail}_playlists`)) || {};
    if (playlists[playlistName]) {
        playlists[playlistName].movies.push(movieData);
        localStorage.setItem(`${userEmail}_playlists`, JSON.stringify(playlists));
        alert(`Movie added to ${playlistName}`);
    }
}

function displayExistingPlaylists(selectElement) {
    selectElement.innerHTML = '';

    const userEmail = getLoggedInUserEmail();
    const playlists = JSON.parse(localStorage.getItem(`${userEmail}_playlists`)) || {};

    Object.keys(playlists).forEach(playlistName => {
        selectElement.innerHTML += `
        <div class="existing-playlist-box">
        <input type="radio" id="existing-playlists-select" name="${playlistName}" value="${playlistName}">
        <label for="html">${playlistName}</label>
        </div>
        `;
    });
}

function getNextPlaylistId(userEmail) {
    const lastId = parseInt(localStorage.getItem(`${userEmail}_lastPlaylistId`), 10) || 0;
    const nextId = lastId + 1;
    localStorage.setItem(`${userEmail}_lastPlaylistId`, nextId);
    return nextId;
}

function assignIdsToPlaylists(playlists, userEmail) {
    let lastId = parseInt(localStorage.getItem(`${userEmail}_lastPlaylistId`), 10) || 0;

    Object.keys(playlists).forEach(playlistName => {
        if (!playlists[playlistName].id) {
            lastId += 1;
            playlists[playlistName].id = lastId;
        }
    });

    localStorage.setItem(`${userEmail}_lastPlaylistId`, lastId);
    localStorage.setItem(`${userEmail}_playlists`, JSON.stringify(playlists));
    return playlists;
}
