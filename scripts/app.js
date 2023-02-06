class App {
	constructor() {
		this._data = recipes;
		this._Recipes = [];
		// this._options = { ingredients: [], appliance: [], ustensils: [] };
		// this._optionsSelected = {
		// 	ingredients: [],
		// 	appliance: [],
		// 	ustensils: [],
		// };
		// this._selectedFiltersLists = {
		// 	ingredients: document.querySelector(".selected-filters__list__ingredients"),
		// 	appliance: document.querySelector(".selected-filters__list__appliance"),
		// 	ustensils: document.querySelector(".selected-filters__list__utensils"),
		// };
	}

	init() {
		this._data.forEach((recipe, i) => {
			this._Recipes.push(new Recipe(recipe));
			this._Recipes[i].createCardDOM();
		});

		this.initSearchBar();
	}

	initSearchBar() {
		const searchBar = document.querySelector("#searchBar");
		const MIN_INPUT_LENGTH = 3;

		searchBar.addEventListener("input", (e) => {
			let inputValue = e.target.value;

			this._Recipes.forEach((recipe) => {
				const card = document.querySelector("#recipe_" + recipe.id);

				if (inputValue.length >= MIN_INPUT_LENGTH && recipeFilter(recipe, inputValue)) {
					this.showElement(card);
				} else if (inputValue.length < MIN_INPUT_LENGTH) {
					this.showElement(card);
				} else {
					this.hideElement(card);
				}
			});
		});

		function recipeFilter(recipe, inputValue) {
			return recipe.nameContains(inputValue) || recipe.descriptionContains(inputValue) || recipe.hasIngredient(inputValue);
		}
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
