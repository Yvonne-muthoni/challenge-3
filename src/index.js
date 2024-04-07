// Your code here
document.addEventListener('DOMContentLoaded', function initialize() {
  getMovies();
});

const baseUrl = 'http://localhost:3000/films'


function movieTitles(movies) {
  const filmList = document.querySelector('#films');
  filmList.innerHTML = ''
  movies.forEach(movie => {
      const movieTitle = document.createElement('li')
      movieTitle.className = 'film item';
      if (movie.tickets_sold >= movie.capacity) {
          movieTitle.classList.add('sold-out');
      }
      movieTitle.textContent = movie.title
      //a delete button to delete movies
      const deleteButton = document.createElement('button');
      deleteButton.textContent = movie.tickets_sold >= movie.capacity ? 'Sold Out' : 'Delete';
      deleteButton.addEventListener('click', () => {
      deleteFilm(movie.id);
      });
      movieTitle.appendChild(deleteButton);
      filmList.appendChild(movieTitle);
  });
}

function firstMovie(movie) {
  document.getElementById('title').textContent = movie.title
  document.getElementById('runtime').textContent = movie.runtime + ' minutes'
  document.getElementById('film-info').textContent = movie.description
  document.getElementById('showtime').textContent = movie.showtime
  document.getElementById('ticket-num').textContent = (movie.capacity - movie.tickets_sold)
  const posterImage = document.getElementById('poster')
  posterImage.src = movie.poster
  posterImage.alt = movie.title
  document.getElementById("buy-ticket").addEventListener('click', ()=>{
      ++ movie.tickets_sold 
      updateTicketsCount(movie)
      postTicketPurchase(movie.id, 1)
  })
  if (movie.tickets_sold >= movie.capacity) {
      document.getElementById("buy-ticket").disabled = true
      document.getElementById("buy-ticket").textContent = 'Sold Out';

  }
}

// display details of first movie after fetching
function getMovies() {
  fetch(baseUrl)
  .then(res => res.json())
  .then(movies => {
      if (movies.length > 0) {
          firstMovie(movies[0]);
          movieTitles(movies)
      }
  })
}

function updateTickets(films){
  fetch(`${baseUrl}/${films.id}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({purchased_tickets: films.purchased_tickets + 1})
  }).then(res=>res.json())
  .then(movieUpdate=>{

      const remainingTickets = movieUpdate.capacity - movieUpdate.tickets_sold;
      document.getElementById('ticket-num').textContent = remainingTickets
      if (remainingTickets === 0) {
          document.getElementById("buy-ticket").disabled = true;
          document.getElementById("buy-ticket").textContent = 'Sold Out';
      }
  });
}

function ticketPurchased(filmId, numberOfTickets) {
  //create a ticketData object
  const ticketData = {
      film_id: filmId,
      number_of_tickets: numberOfTickets
  };
  fetch(ticketsUrl, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketData)
  })
  .then(response => response.json())

}


//delete a film 
function deleteFilm(filmID) {
  fetch(`${baseUrl}/${filmID}`, {
      method: 'DELETE',
      headers: {
          "Content-type": "application/json"
      }
  })
  .then(res=>res.json())
  
  window.location.reload()
}