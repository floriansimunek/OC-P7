class App {
	constructor() {
		this._data = recipes;
		this._Recipes = [];
	}

	init() {
		this._data.forEach((recipe, i) => {
			this._Recipes.push(new Recipe(recipe));
			this._Recipes[i].createCardDOM();
		});

		this.initSearchBar();
		this.initFiltersLists();
		this.initFiltersInputs();
		this.initSelectedFilter();
	}

	initSearchBar() {
		const searchBar = document.querySelector("#searchBar");
		const MIN_INPUT_LENGTH = 3;

		searchBar.addEventListener("input", (e) => {
			let inputValue = e.target.value;

			this._Recipes.forEach((recipe) => {
				const card = document.querySelector("#recipe_" + recipe.id);

				if (inputValue.length >= MIN_INPUT_LENGTH && this.recipeFilter(recipe, inputValue)) {
					showElement(card);
				} else if (inputValue.length < MIN_INPUT_LENGTH) {
					showElement(card);
				} else {
					hideElement(card);
				}
			});
		});

		function showElement(element) {
			element.classList.add("show");
			element.classList.remove("hidden");
		}

		function hideElement(element) {
			element.classList.remove("show");
			element.classList.add("hidden");
		}
	}

	recipeFilter(recipe, inputValue) {
		return recipe.nameContains(inputValue) || recipe.descriptionContains(inputValue) || recipe.hasIngredient(inputValue);
	}

	initFiltersInputs() {
		const filtersBlock = document.querySelectorAll(".filters__block");

		filtersBlock.forEach((block) => {
			const input = block.querySelector(".filters__input");
			const arrowInput = block.querySelector(".filters__block__arrow");
			const filtersList = block.querySelector(".filters__option");

			let defaultInputValue = input.value;

			["focus", "blur"].forEach((event) => {
				input.addEventListener(event, () => {
					input.classList.toggle("expanded");
					event === "focus" ? (input.value = "") : (input.value = defaultInputValue);
				});
			});

			["focus", "blur"].forEach((event) => {
				arrowInput.addEventListener(event, () => {
					setTimeout(
						() => {
							input.classList.toggle("open");
							arrowInput.classList.toggle("open");
							filtersList.classList.toggle("open");
						},
						event === "focus" ? 0 : 100,
					);
				});
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

	initSelectedFilter() {
		const options = document.querySelectorAll(".filters__option__list__item");

		let optionsSelected = {
			ingredients: [],
			appliance: [],
			ustensils: [],
		};

		options.forEach((option) => {
			option.addEventListener("click", () => {
				switch (option.dataset.type) {
					case "ingredients":
						option.classList.add("disabled");
						optionsSelected.ingredients.push(option.dataset.value);
						this.refreshOptionsListsDisplay(optionsSelected);
						break;
					case "appliance":
						option.classList.add("disabled");
						optionsSelected.appliance.push(option.dataset.value);
						this.refreshOptionsListsDisplay(optionsSelected);
						break;
					case "ustensils":
						option.classList.add("disabled");
						optionsSelected.ustensils.push(option.dataset.value);
						this.refreshOptionsListsDisplay(optionsSelected);
						break;
					default:
						throw new Error("Unknown option type");
				}
			});
		});
	}

	refreshOptionsListsDisplay(optionsSelected) {
		const selectedFiltersLists = {
			ingredients: document.querySelector(".selected-filters__list__ingredients"),
			appliance: document.querySelector(".selected-filters__list__appliance"),
			ustensils: document.querySelector(".selected-filters__list__utensils"),
		};

		this.resetSelectedFilters(selectedFiltersLists);

		for (let key in optionsSelected) {
			if (optionsSelected[key].length > 0) {
				optionsSelected[key].forEach((item) => {
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
							selectedFiltersLists.ingredients.classList.add("show");
							selectedFiltersLists.ingredients.append(li);
							break;
						case "appliance":
							selectedFiltersLists.appliance.classList.add("show");
							selectedFiltersLists.appliance.append(li);
							break;
						case "ustensils":
							selectedFiltersLists.ustensils.classList.add("show");
							selectedFiltersLists.ustensils.append(li);
							break;
						default:
							throw new Error("Unknown filter option type");
					}
				});
			}
		}
	}

	resetSelectedFilters(selectedFiltersLists) {
		for (let key in selectedFiltersLists) {
			selectedFiltersLists[key].innerHTML = "";
		}
	}
}

const app = new App();
app.init();
