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
		this.initFiltersInputs();
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

	initFiltersInputs() {}

	getIngredientsList() {
		let list = [];

		this._Recipes.forEach((recipe) => {
			recipe.ingredients.forEach((item) => {
				list.push(item.ingredient);
			});
		});
		return (list = [...new Set(list)].sort());
	}

	getDevicesList() {
		let list = [];

		this._Recipes.forEach((recipe) => {
			list.push(recipe.appliance);
		});
		return (list = [...new Set(list)].sort());
	}

	getUtensilsList() {
		let list = [];

		this._Recipes.forEach((recipe) => {
			recipe.ustensils.forEach((item) => {
				list.push(item);
			});
		});
		return (list = [...new Set(list)].sort());
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
