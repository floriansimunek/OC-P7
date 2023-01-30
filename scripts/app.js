class App {
	constructor() {
		this._data = recipes;
		this._Recipes = [];
		this._searchBar = document.querySelector("#searchBar");
		this._filtersBlock = document.querySelector(".filters__block");
		this._filtersInputs = document.querySelectorAll(".filters__block input");
	}

	async init() {
		this._data.forEach((recipe, i) => {
			this._Recipes.push(new Recipe(recipe));
			this._Recipes[i].createCardDOM();
		});

		this.initSearchBar();
		// this.initFiltersInputs();
		console.log(this.getList("ingredients"));
	}

	initSearchBar() {
		this._searchBar.addEventListener("input", (e) => {
			let inputValue = e.target.value.toLowerCase().trim();
			const MIN_INPUT_LENGTH = 3;

			this._Recipes.forEach((recipe) => {
				const FILTER_NAME = recipe.name.toLowerCase().trim().includes(inputValue);
				const FILTER_DESCRIPTION = recipe.description.toLowerCase().trim().includes(inputValue);
				const FILTER_INGREDIENTS = recipe.ingredients.some((item) => item.ingredient.toLowerCase().trim().includes(inputValue));

				if (inputValue.length >= MIN_INPUT_LENGTH) {
					if (FILTER_NAME || FILTER_DESCRIPTION || FILTER_INGREDIENTS) {
						this.showElement(document.querySelector("#recipe_" + recipe.id));
					} else {
						this.hideElement(document.querySelector("#recipe_" + recipe.id));
					}
				} else {
					this.showElement(document.querySelector("#recipe_" + recipe.id));
				}
			});
		});
	}

	// initFiltersInputs() {}

	getList(type) {
		let list = [];

		this._Recipes.forEach((recipe) => {
			if (type === "appliance") {
				list.push(recipe[type]);
			} else {
				recipe[type].forEach((item) => {
					list.push(type === "ustensils" ? item : item["ingredient"]);
				});
			}
		});

		return [...new Set(list)].sort();
	}

	showElement(element) {
		element.classList.add("show");
		element.classList.remove("hidden");
	}

	hideElement(element) {
		element.classList.remove("show");
		element.classList.add("hidden");
	}
}

const app = new App();
app.init();
