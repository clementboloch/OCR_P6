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
    constructor(dic) {
        this.id = dic.id;
        this.name = dic.name;
    }
    generateElement() {
        const categoryContainer = document.createElement("div");
        categoryContainer.classList.add('category');
        
        const nameContainer = document.createElement("h2");
        const name = document.createTextNode(this.name);
        nameContainer.appendChild(name);
        
        const movieContainer = document.createElement("div");
        movieContainer.classList.add('movie-container');
        movieContainer.setAttribute("id", `movies-cat${this.id}`);
        
        const nextContainer = document.createElement("div");
        nextContainer.classList.add('next');
        const nextImage = document.createElement("img");
        nextImage.classList.add('next-icon');
        nextImage.setAttribute("src", "img/icon/arrow_right.svg");
        nextImage.setAttribute("alt", "next");
        nextContainer.addEventListener("click", this.rightSlide);
        
        categoryContainer.appendChild(nameContainer);
        categoryContainer.appendChild(movieContainer);
        movieContainer.appendChild(nextContainer);
        nextContainer.appendChild(nextImage);

        document.body.appendChild(categoryContainer);
    }

    rightSlide() {
        console.log("rightSlide");
    }
  }

  const importMovies = async () => {
    
    const response = await fetch(`http://localhost:8000/api/v1/genres/?page=3`);
    const myJson = await response.json(); 
    const categories = myJson.results;
    
    
    const limit = 20;
    
    for (const category of categories) {
        const Categorie = new Category(category);
        Categorie.generateElement();
        
        for (let page = 1; page <= limit; page++) {
            const response = await fetch(`http://localhost:8000/api/v1/titles/?genre=${category.name}&page=${page}`);
            const myJson = await response.json(); 
            
            const films = myJson.results
            for (const film of films) {
                const Film = new Movie(film, category.id);
                Film.generateElement();
            }
    
            const next = myJson.next;
            if (next == null) break;
        }
    }
}

function go() {
    importMovies()
}