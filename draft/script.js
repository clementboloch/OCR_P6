// window.onload = test;

class Movie {
    constructor(dic, categoryId) {
        this.props = dic
        this.id = dic.id;
        this.url = dic.url;
        this.imdb_url = dic.imdb_url;
        this.title = dic.title;
        this.year = dic.year;
        this.imdb_score = dic.imdb_score;
        this.votes = dic.votes;
        this.image_url = dic.image_url;
        this.directors = dic.directors;
        this.actors = dic.actors;
        this.writers = dic.writers;
        this.genres = dic.genres;

        this.categoryId = categoryId;
        
        this.generateElement();
    }
    generateElement() {
        const container = document.createElement("div");
        container.classList.add('movie');
        const content = document.createTextNode(this.title);
        container.appendChild(content);
        const category = document.getElementById(`movies-cat${this.categoryId}`);
        category.appendChild(container);
    }
    generateModal() {
        console.log("generateModal");
    }
  }

  class Category {
    constructor(dic, limit = 5) {
        this.id = dic.id;
        this.name = dic.name;
        this.limit = limit;
        this.nbMovies = 0;
        // this.firstMovie = 1;

        this.generateElement();
    }
    generateElement() {
        const categoryContainer = document.createElement("div");
        categoryContainer.classList.add('category');
        
        const nameContainer = document.createElement("h2");
        const name = document.createTextNode(this.name);
        nameContainer.appendChild(name);
        
        this.movieContainer = document.createElement("div");
        this.movieContainer.classList.add('movie-container');
        this.movieContainer.setAttribute("id", `movies-cat${this.id}`);
        
        const nextContainer = document.createElement("div");
        nextContainer.classList.add('next');
        const nextImage = document.createElement("img");
        nextImage.classList.add('next-icon');
        nextImage.setAttribute("src", "img/icon/arrow_right.svg");
        nextImage.setAttribute("alt", "next");
        nextContainer.addEventListener("click", () => this.slide(this, "rigth"));
        
        categoryContainer.appendChild(nameContainer);
        categoryContainer.appendChild(this.movieContainer);
        this.movieContainer.appendChild(nextContainer);
        nextContainer.appendChild(nextImage);

        document.body.appendChild(categoryContainer);
    }

    addMovie(film) {
        new Movie(film, this.id);
        this.nbMovies += 1;
    }

    async addMovies() {
        for (let page = 1; page <= this.limit; page++) {
            const response = await fetch(`http://localhost:8000/api/v1/titles/?genre=${this.name}&page=${page}`);
            const myJson = await response.json(); 
            
            const films = myJson.results
            for (const film of films) {
                this.addMovie(film);
            }
    
            if (myJson.next == null) break;
        }
        this.lastMovie = this.nbMovies >= 6 ? 6 : this.nbMovies;
        console.log("this.lastMovie", this.lastMovie)
    }

    slide(category, side) {
        const movie = document.getElementsByClassName("movie")[0];
        const movieStyle = window.getComputedStyle(movie);
        const movieWidth = parseFloat(movieStyle.width);
        const movieMarginRight = parseFloat(movieStyle.marginRight);
        
        const oldPosition = parseFloat(window.getComputedStyle(category.movieContainer).marginLeft);
        let newPosition;
        if (side == "rigth") {
            const slideSize = this.lastMovie + 6 <= this.nbMovies ? 6 : this.nbMovies - this.lastMovie;
            this.lastMovie += slideSize;
            newPosition = oldPosition - slideSize * (movieWidth + movieMarginRight);
        } else {
            const slideSize = this.firstMovie - 6 <= 0 ? 6 : this.firstMovie;
            this.firstMovie -= slideSize;
            newPosition = oldPosition + slideSize * (movieWidth + movieMarginRight);
        }
        category.movieContainer.style.marginLeft = `${newPosition}px`;
    }
  }

  const importMovies = async () => {
    
    const response = await fetch(`http://localhost:8000/api/v1/genres/?page=3`);
    const myJson = await response.json(); 
    const categories = myJson.results;
    
    for (const category of categories) {
        const newCategory = new Category(category);
        newCategory.addMovies();
    }
}

function go() {
    importMovies()
}