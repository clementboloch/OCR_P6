// window.onload = test;
const nbInRow = 8;

function isImg(url) {
    const img = new Image();
    img.src = url;
    return new Promise((resolve) => {
      img.onerror = () => resolve(false);
      img.onload = () => resolve(true);
    });
}

class Movie {
    constructor(dic, categoryId, best = false) {
        this.props = dic;
        this.modalInfo = {
            'title': {type: 'txt', above: "", before:'', after:''}, 
            'year': {type: 'txt', above: "", before:'', after:''}, 
            'duration': {type: 'txt', above: "", before:'', after:' min'},
            'long_description': {type: 'txt', above: "", before:'', after:''},
            'imdb_score': {type: 'txt', above: "", before:'Score: ', after:'/10'},
            'image_url': {type: 'img'},
            'actors': {type: 'txt', above:'Distribution: ', before:'', after:''},
            'directors': {type: 'txt', above:'Director: ', before:'', after:''},
            'genres': {type: 'txt', above:'Genres: ', before:'', after:''},
            'countries': {type: 'txt', above:'Country: ', before:'', after:''},
        };

        this.categoryId = categoryId;

        if (best) this.generateBestMovie();
        else this.generateMovieIcon();
    }
    generateBestMovie() {
        const bestContainer = document.createElement("div");
        bestContainer.classList.add('bestContainer');
        
        const bestMovie = document.createElement("div");
        bestMovie.classList.add('bestMovie');
        
        const bestButton = document.createElement("a");
        bestButton.classList.add('bestButton');
        bestButton.setAttribute("href", "#");
        bestButton.addEventListener("click", () => this.displayModal(this));
        const button = document.createTextNode("See details");
        bestButton.appendChild(button);
        
        const bestImg = document.createElement("img");
        bestImg.classList.add('bestImg');
        bestImg.setAttribute("src", this.props.image_url);
        bestImg.setAttribute("alt", "best movie image");
        
        const bestTitle = document.createElement("h1");
        bestTitle.classList.add('bestTitle');
        const title = document.createTextNode(this.props.title);
        bestTitle.appendChild(title);
        
        const bestDescription = document.createElement("p");
        bestDescription.classList.add('bestDescription');
        const description = document.createTextNode(this.props.description);
        bestDescription.appendChild(description);
        
        bestMovie.appendChild(bestTitle);
        bestMovie.appendChild(bestButton);
        bestMovie.appendChild(bestDescription);
        bestContainer.appendChild(bestImg);
        bestContainer.appendChild(bestMovie);
        document.body.appendChild(bestContainer);
    }
    generateMovieIcon() {
        const container = document.createElement("div");
        container.classList.add('movie', `movie-cat${this.categoryId}`);
        container.addEventListener("click", () => this.displayModal(this));
        
        isImg(this.props.image_url).then(res => {
            if (res) {
                container.style.backgroundImage = `url(${this.props.image_url})`;
                container.style.backgroundSize = '100%';
            } else {
                const content = document.createElement("span");
                content.classList.add('movie-title');
                const text = document.createTextNode(this.props.title);
                content.appendChild(text);
                container.appendChild(content);
            }
        });
        
        const category = document.getElementById(`movies-cat${this.categoryId}`);
        category.appendChild(container);
    }
    generateModal(movie) {
        const modalContainer = document.createElement("div");
        modalContainer.classList.add('modal-container');
        modalContainer.addEventListener("click", (e) => {
            if (e.target !== modalContainer) return;
            this.removeModal(this);
        });
        
        const modal = document.createElement("div");
        modal.classList.add('modal');
        modalContainer.appendChild(modal);
        
        const modalContent = document.createElement("div");
        modalContent.classList.add('modal-content');
        modal.appendChild(modalContent);
        

        const closeButton = document.createElement("img");
        closeButton.classList.add('close-button');
        closeButton.setAttribute("src", "img/icon/close.svg");
        closeButton.setAttribute("alt", "close button icon");
        closeButton.addEventListener("click", () => this.removeModal(this));
        modal.appendChild(closeButton);
        
        for (const [modalProp, caract] of Object.entries(this.modalInfo)) {
            let content;
            const mybr = document.createElement('br');
            if (caract.type == "img") {
                content = document.createElement("img");
                content.setAttribute("src", this.props[modalProp]);
                content.setAttribute("alt", modalProp);
            } else if (caract.type == "txt") {
                content = document.createElement("div");
                if (caract.above != "") {
                    const textAbove = document.createTextNode(caract.above);
                    content.appendChild(textAbove);
                    content.appendChild(mybr);
                }
                const text = document.createTextNode(caract.before + this.props[modalProp] + caract.after);
                content.appendChild(text);
                content.classList.add("text");
            }
            content.classList.add(modalProp);
            modalContent.appendChild(content);
        }
        
        this.modal = modalContainer;
    }
    displayModal(movie) {
        if (!this.modal) this.generateModal(movie);
        document.body.appendChild(this.modal);
        document.body.style.overflow = "hidden";
    }
    removeModal(movie) {
        document.body.removeChild(movie.modal);
        document.body.style.overflow = "scroll";
    }
  }

  class Category {
    constructor(dic, limit = 5) {
        this.id = dic.id;
        this.name = dic.name;
        this.limit = limit;
        this.nbMovies = 0;
        this.firstMovie = 1;
        this.listening = true;

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

        categoryContainer.appendChild(nameContainer);
        categoryContainer.appendChild(this.movieContainer);

        this.nextContainer = document.createElement("div");
        this.beforeContainer = document.createElement("div");

        [
            {html: this.nextContainer, class: 'next', src: "img/icon/arrow_right.svg", side: "rigth", display: true},
            {html: this.beforeContainer, class: 'before', src: "img/icon/arrow_left.svg", side: "left", display: false},
        ].forEach((element) => {
            if (element.display) element.html.classList.add('visible');
            element.html.classList.add('slide', element.class);
            const image = document.createElement("img");
            image.classList.add('slide-icon');
            image.setAttribute("src", element.src);
            image.setAttribute("alt", "slide");
            element.html.addEventListener("click", () => this.slide(this, element.side));
            element.html.appendChild(image);
            this.movieContainer.appendChild(element.html);
        })

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
                const response = await fetch(film.url);
                const myJson = await response.json();
                this.addMovie(myJson);
            }

            if (myJson.next == null) break;
        }
        this.lastMovie = this.nbMovies >= nbInRow - 1 ? nbInRow - 1 : this.nbMovies;
    }

    slide(category, side) {
        if (!this.listening) return;
        this.listening = false;
        const movie = document.getElementsByClassName("movie")[0];
        const movieStyle = window.getComputedStyle(movie);
        const movieWidth = parseFloat(movieStyle.width);
        const movieMarginRight = parseFloat(movieStyle.marginRight);

        const oldPosition = parseFloat(window.getComputedStyle(category.movieContainer).marginLeft);
        let newPosition;
        let slideSize = nbInRow - 1;
        if (side == "rigth") {
            if (this.lastMovie + nbInRow - 1 > this.nbMovies) slideSize = this.nbMovies - this.lastMovie;
            this.firstMovie += slideSize;
            this.lastMovie += slideSize;
            newPosition = oldPosition - slideSize * (movieWidth + movieMarginRight);

            // Pour mettre les derniers films en première position
            // const catMovies = document.getElementsByClassName(`movie-cat${this.id}`);
            // const movingMovies = Array.from(catMovies).slice(0, slideSize - 1);
            // for (const movie of movingMovies) this.movieContainer.appendChild(movie);
        } else {
            if (this.firstMovie - nbInRow - 1 < 0) slideSize = this.firstMovie - 1;
            this.firstMovie -= slideSize;
            this.lastMovie -= slideSize;
            newPosition = oldPosition + slideSize * (movieWidth + movieMarginRight);
        }
        if (this.firstMovie == 1) this.beforeContainer.classList.remove('visible');
        else this.beforeContainer.classList.add('visible');
        if (this.lastMovie == this.nbMovies) this.nextContainer.classList.remove('visible');
        else this.nextContainer.classList.add('visible');
        category.movieContainer.style.marginLeft = `${newPosition}px`;

        // Warning: the timeout value must be the same as the animation duration in the CSS file
        setTimeout(() => {
            this.listening = true;
          }, 1000)
    }
  }

  const importMovies = async () => {

    const responseBest = await fetch("http://localhost:8000/api/v1/titles/3772");
    const myJsonBest = await responseBest.json();
    new Movie(myJsonBest, 0, true);

    const responseCat = await fetch(`http://localhost:8000/api/v1/genres/?page=3`);
    const myJsonCat = await responseCat.json();
    const categories = myJsonCat.results;

    for (const category of categories) {
        const newCategory = new Category(category, 5);
        newCategory.addMovies();
    }
}

function go() {
    importMovies()
}