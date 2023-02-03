class App {
	constructor() {
		this._data = recipes;
		this._Recipes = [];
		this._searchBar = document.querySelector("#searchBar");
		this._filtersBlock = document.querySelector(".filters__block");
		this._filtersInputs = document.querySelectorAll(".filters__block input");
		this._filterItemsSelected = {
			ingredients: [],
			appliance: [],
			ustensils: [],
		};
	}

	init() {
		this._data.forEach((recipe, i) => {
			this._Recipes.push(new Recipe(recipe));
			this._Recipes[i].createCardDOM();
		});

		this.initSearchBar();
		this.initFiltersInputs();
	}

	initSearchBar() {
		const MIN_INPUT_LENGTH = 3;

		this._searchBar.addEventListener("input", (e) => {
			let inputValue = e.target.value;

			this._Recipes.forEach((recipe) => {
				let card = document.querySelector("#recipe_" + recipe.id);

				if (inputValue.length >= MIN_INPUT_LENGTH && this.recipeFilter(recipe, inputValue)) {
					this.showElement(card);
				} else if (inputValue.length < MIN_INPUT_LENGTH) {
					this.showElement(card);
				} else {
					this.hideElement(card);
				}
			});
		});
	}

	recipeFilter(recipe, inputValue) {
		return recipe.nameContains(inputValue) || recipe.descriptionContains(inputValue) || recipe.hasIngredient(inputValue);
	}

	initFiltersInputs() {
		this.initFiltersLists();

		const INPUTS = document.querySelectorAll(".filters__input");

		INPUTS.forEach((input) => {
			let defaultValue = input.value;
			let inputArrow = input.nextElementSibling;
			const FILTER_LIST = input.parentNode.parentNode.querySelector(".filters__option");

			input.addEventListener("focus", () => {
				input.value = "";
				input.classList.toggle("expanded");
			});

			input.addEventListener("blur", () => {
				input.value = defaultValue;
				input.classList.toggle("expanded");
			});

			inputArrow.addEventListener("focus", () => {
				input.value = "";
				input.classList.toggle("open");
				FILTER_LIST.classList.toggle("open");
				inputArrow.classList.toggle("open");
			});

			inputArrow.addEventListener("blur", () => {
				input.value = defaultValue;
				setTimeout(() => {
					input.classList.toggle("open");
					FILTER_LIST.classList.toggle("open");
					inputArrow.classList.toggle("open");
				}, 100);
			});
		});

		const SELECTED_INGREDIENTS = document.querySelector(".selected-filters__list__ingredients");
		const SELECTED_APPLIANCE = document.querySelector(".selected-filters__list__appliance");
		const SELECTED_UTENSILS = document.querySelector(".selected-filters__list__utensils");

		document.querySelectorAll(".filters__option__list__item").forEach((item) => {
			item.addEventListener("click", () => {
				switch (item.dataset.type) {
					case "ingredients":
						item.classList.add("disabled");
						this._filterItemsSelected.ingredients.push(item.dataset.value);
						break;
					case "appliance":
						item.classList.add("disabled");
						this._filterItemsSelected.appliance.push(item.dataset.value);
						break;
					case "ustensils":
						item.classList.add("disabled");
						this._filterItemsSelected.ustensils.push(item.dataset.value);
						break;
					default:
						throw new Error("Unknown item type");
				}

				SELECTED_INGREDIENTS.innerHTML = "";
				SELECTED_APPLIANCE.innerHTML = "";
				SELECTED_UTENSILS.innerHTML = "";

				for (let key in this._filterItemsSelected) {
					this._filterItemsSelected[key].forEach((item) => {
						let li = createBlock("li", [
							{ name: "class", value: "selected-filters__list__item" },
							{ name: "data-value", value: item },
						]);
						let img = createImage("./assets/icons/close.svg", [{ name: "class", value: "selected-filters__list__close" }]);
						let span = createBlock("span");

						span.textContent = item;
						li.append(span, img);

						switch (key) {
							case "ingredients":
								SELECTED_INGREDIENTS.classList.add("show");
								SELECTED_INGREDIENTS.append(li);
								break;
							case "appliance":
								SELECTED_APPLIANCE.classList.add("show");
								SELECTED_APPLIANCE.append(li);
								break;
							case "ustensils":
								SELECTED_UTENSILS.classList.add("show");
								SELECTED_UTENSILS.append(li);
								break;
							default:
								throw new Error("Unknown filter option type");
						}
					});
				}
			});
		});
	}

	initFiltersLists() {
		let that = this;
		let lists = {
			ingredients: document.querySelector(".filters__option__ingredients__list"),
			appliance: document.querySelector(".filters__option__devices__list"),
			ustensils: document.querySelector(".filters__option__utensils__list"),
		};

		for (let type in lists) {
			let items = getList(type);

			items.forEach((item) => {
				let li = createBlock("li", [
					{ name: "class", value: "filters__option__list__item" },
					{ name: "data-value", value: item },
					{ name: "data-type", value: type },
				]);
				li.textContent = item;

				lists[type].append(li);
			});
		}

		function getList(type) {
			let list = [];

			that._Recipes.forEach((recipe) => {
				switch (type) {
					case "ingredients":
						recipe[type].forEach((item) => {
							list.push(item["ingredient"].toLowerCase());
						});
						break;
					case "appliance":
						list.push(recipe[type].toLowerCase());
						break;
					case "ustensils":
						recipe[type].forEach((item) => {
							list.push(item.toLowerCase());
						});
						break;
					default:
						throw new Error("Unknown filter option type");
				}
			});

			return [...new Set(list)].sort();
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
