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

		const ingredientsOptions = document.querySelector(".filters__ingredients__option");
		const ingredientsArrow = document.querySelector(".filters__ingredients .arrow__block");

		ingredientsArrow.addEventListener("click", () => {
			if (ingredientsOptions.style.display === "none") {
				ingredientsOptions.style.display = "flex";
				ingredientsArrow.classList.add("open");
			} else {
				ingredientsOptions.style.display = "none";
				ingredientsArrow.classList.remove("open");
			}
		});

		const devicesOptions = document.querySelector(".filters__devices__option");
		const devicesArrow = document.querySelector(".filters__devices .arrow__block");

		devicesArrow.addEventListener("click", () => {
			if (devicesOptions.style.display === "none") {
				devicesOptions.style.display = "flex";
				devicesArrow.classList.add("open");
			} else {
				devicesOptions.style.display = "none";
				devicesArrow.classList.remove("open");
			}
		});

		const utensilsOptions = document.querySelector(".filters__utensils__option");
		const utensilsArrow = document.querySelector(".filters__utensils .arrow__block");

		utensilsArrow.addEventListener("click", () => {
			if (utensilsOptions.style.display === "none") {
				utensilsOptions.style.display = "flex";
				utensilsArrow.classList.add("open");
			} else {
				utensilsOptions.style.display = "none";
				utensilsArrow.classList.remove("open");
			}
		});
	}

	initSearchBar() {
		this._searchBar.addEventListener("input", (e) => {
			let inputValue = e.target.value.toLowerCase().trim();
			const MIN_INPUT_LENGTH = 3;

			this._Recipes.forEach((recipe) => {
				//TODO: without "à é"
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

	initFiltersInputs() {
		const ingredientsOption = document.querySelector(".filters__ingredients__option");
		const devicesOption = document.querySelector(".filters__devices__option");
		const utensilsOption = document.querySelector(".filters__utensils__option");

		this._filtersInputs.forEach((input) => {
			let defaultInputValue = input.value;

			input.addEventListener("focus", () => {
				input.value = "";
				input.style.width = "65vw";
			});

			input.addEventListener("blur", () => {
				input.value = defaultInputValue;
				input.style.width = "170px";
			});
		});

		let ingredientsList = this.getIngredientsList();
		let devicesList = this.getDevicesList();
		let utensilsList = this.getUtensilsList();

		ingredientsList.forEach((ingredient) => {
			let li = document.createElement("li");
			li.textContent = ingredient;

			ingredientsOption.append(li);
		});

		devicesList.forEach((device) => {
			let li = document.createElement("li");
			li.textContent = device;

			devicesOption.append(li);
		});

		utensilsList.forEach((utensil) => {
			let li = document.createElement("li");
			li.textContent = utensil;

			utensilsOption.append(li);
		});
	}

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
