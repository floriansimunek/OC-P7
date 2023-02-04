class App {
	constructor() {
		this._data = recipes;
		this._Recipes = [];
		this._optionsSelected = {
			ingredients: [],
			appliance: [],
			ustensils: [],
		};
		this._selectedFiltersLists = {
			ingredients: document.querySelector(".selected-filters__list__ingredients"),
			appliance: document.querySelector(".selected-filters__list__appliance"),
			ustensils: document.querySelector(".selected-filters__list__utensils"),
		};
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

		options.forEach((option) => {
			option.addEventListener("click", () => {
				addOptionToSelected(this, option);
			});
		});

		function addOptionToSelected(that, option) {
			option.classList.add("disabled");
			that._optionsSelected[option.dataset.type].push(option.dataset.value);
			that.refreshOptionsListsDisplay();
		}
	}

	refreshOptionsListsDisplay() {
		this.resetSelectedFilters();

		for (let type in this._optionsSelected) {
			if (this._optionsSelected[type].length > 0) {
				this._optionsSelected[type].forEach((item) => {
					let li = createBlock("li", [
						{ name: "class", value: "selected-filters__list__item" },
						{ name: "data-value", value: item },
						{ name: "data-type", value: type },
					]);
					let img = createImage("./assets/icons/close.svg", [{ name: "class", value: "selected-filters__list__close" }]);
					let span = createBlock("span");

					span.textContent = item;
					li.append(span, img);

					switch (type) {
						case "ingredients":
							this._selectedFiltersLists.ingredients.classList.add("show");
							this._selectedFiltersLists.ingredients.append(li);
							break;
						case "appliance":
							this._selectedFiltersLists.appliance.classList.add("show");
							this._selectedFiltersLists.appliance.append(li);
							break;
						case "ustensils":
							this._selectedFiltersLists.ustensils.classList.add("show");
							this._selectedFiltersLists.ustensils.append(li);
							break;
						default:
							throw new Error("Unknown filter option type");
					}
				});
			}
		}

		this.initCloseFilterItems();
	}

	resetSelectedFilters() {
		for (let key in this._selectedFiltersLists) {
			this._selectedFiltersLists[key].innerHTML = "";
		}
	}

	initCloseFilterItems() {
		const items = document.querySelectorAll(".selected-filters__list__item");

		items.forEach((item) => {
			const close = item.querySelector(".selected-filters__list__close");

			close.addEventListener("click", () => {
				const options = document.querySelectorAll(".filters__option__list__item");

				switch (item.dataset.type) {
					case "ingredients":
						this._optionsSelected.ingredients = this._optionsSelected.ingredients.filter((option) => option !== item.dataset.value);
						if (this._optionsSelected.ingredients.length == 0) this._selectedFiltersLists.ingredients.classList.remove("show");
						options.forEach((option) => {
							if (option.dataset.value === item.dataset.value) option.classList.remove("disabled");
						});
						this.refreshOptionsListsDisplay();
						break;
					case "appliance":
						this._optionsSelected.appliance = this._optionsSelected.appliance.filter((option) => option !== item.dataset.value);
						if (this._optionsSelected.appliance.length == 0) this._selectedFiltersLists.appliance.classList.remove("show");
						options.forEach((option) => {
							if (option.dataset.value === item.dataset.value) option.classList.remove("disabled");
						});
						this.refreshOptionsListsDisplay();
						break;
					case "ustensils":
						this._optionsSelected.ustensils = this._optionsSelected.ustensils.filter((option) => option !== item.dataset.value);
						if (this._optionsSelected.ustensils.length == 0) this._selectedFiltersLists.ustensils.classList.remove("show");
						options.forEach((option) => {
							if (option.dataset.value === item.dataset.value) option.classList.remove("disabled");
						});
						this.refreshOptionsListsDisplay();
						break;
					default:
						throw new Error("Unknown type");
				}
			});
		});
	}
}

const app = new App();
app.init();
