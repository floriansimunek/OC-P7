class App {
	constructor() {
		this._data = recipes;
		this._Recipes = [];
		this._optionsLists = { ingredients: [], appliance: [], ustensils: [] };
	}

	init() {
		this._data.forEach((recipe, i) => {
			this._Recipes.push(new Recipe(recipe));
			this._Recipes[i].createCardDOM();
		});

		this.initOptionsLists();
		this.initSearchBar();
	}

	initOptionsLists() {
		this._Recipes.forEach((recipe) => {
			recipe.ingredients.forEach((item) => {
				this._optionsLists.ingredients.push({ name: clear(item.ingredient), selected: false, disabled: false });
			});

			this._optionsLists.appliance.push({ name: clear(recipe.appliance), selected: false, disabled: false });

			recipe.ustensils.forEach((ustensil) => {
				this._optionsLists.ustensils.push({ name: clear(ustensil), selected: false, disabled: false });
			});
		});

		// Remove duplicates in optionsLists Arrays
		for (let type in this._optionsLists) {
			this._optionsLists[type] = [...new Map(this._optionsLists[type].map((item) => [item.name, item])).values()];
		}
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
