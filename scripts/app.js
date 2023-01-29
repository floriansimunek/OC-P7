class App {
	constructor() {
		this._data = recipes;
		this._Recipes = [];
		this._searchBar = document.querySelector("#searchBar");
	}

	async init() {
		this._data.forEach((recipe, i) => {
			this._Recipes.push(new Recipe(recipe));
			this._Recipes[i].createCardDOM();
		});

		this._searchBar.addEventListener("input", (e) => {
			const MIN_INPUT_LENGTH = 3;
			let inputValue = e.target.value.toLowerCase().trim();

			if (inputValue.length >= MIN_INPUT_LENGTH) {
				this._Recipes.forEach((recipe) => {
					const FILTER_NAME = recipe.name.toLowerCase().trim().includes(inputValue);
					const FILTER_DESCRIPTION = recipe.description.toLowerCase().trim().includes(inputValue);

					if (FILTER_NAME || FILTER_DESCRIPTION) {
						let r = document.querySelector("#recipe_" + recipe.id);
						r.classList.add("show");
						r.classList.remove("hidden");
					} else {
						let r = document.querySelector("#recipe_" + recipe.id);
						r.classList.remove("show");
						r.classList.add("hidden");
					}
				});
			} else if (inputValue.length < MIN_INPUT_LENGTH) {
				this._Recipes.forEach((recipe) => {
					let r = document.querySelector("#recipe_" + recipe.id);
					r.classList.add("show");
					r.classList.remove("hidden");
				});
			} else {
				console.error("Input value error");
			}
		});
	}
}

const app = new App();
app.init();
