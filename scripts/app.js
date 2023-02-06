class App {
	constructor() {
		this._data = recipes;
		this._Recipes = [];
		this._options = { ingredients: [], appliance: [], ustensils: [] };
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

	initFiltersLists() {
		const that = this;
		let lists = {
			ingredients: document.querySelector(".filters__option__ingredients__list"),
			appliance: document.querySelector(".filters__option__devices__list"),
			ustensils: document.querySelector(".filters__option__utensils__list"),
		};
		let items = getList();

		for (let type in lists) {
			Object.values(items[type]).forEach((item) => {
				let li = createBlock("li", [
					{ name: "class", value: "filters__option__list__item" },
					{ name: "data-value", value: item.name },
					{ name: "data-type", value: type },
				]);
				li.textContent = item.name;

				lists[type].append(li);
			});
		}

		function getList() {
			that._Recipes.forEach((recipe) => {
				recipe["ingredients"].forEach((item) => {
					that._options.ingredients.push({ name: item["ingredient"].toLowerCase(), disabled: false });
				});

				that._options.appliance.push({ name: recipe["appliance"].toLowerCase(), disabled: false });

				recipe["ustensils"].forEach((item) => {
					that._options.ustensils.push({ name: item.toLowerCase(), disabled: false });
				});
			});

			["ingredients", "appliance", "ustensils"].forEach((type) => {
				const names = that._options[type].map((item) => item.name);
				that._options[type] = that._options[type].filter(({ name }, index) => !names.includes(name, index + 1));
			});

			return that._options;
		}
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

	initSelectedFilter() {
		const that = this;
		const options = document.querySelectorAll(".filters__option__list__item");

		options.forEach((option) => {
			option.addEventListener("click", () => {
				addOptionToSelected(option);
			});
		});

		function addOptionToSelected(option) {
			that._options[option.dataset.type].filter((item) => {
				if (that.clear(item.name) === that.clear(option.dataset.value)) {
					item.disabled = true;
				}
			});
			that._optionsSelected[option.dataset.type].push(option.dataset.value);
			that.refreshOptionsListsDisplay();
			that.filterByOptions();
		}
	}

	refreshOptionsListsDisplay() {
		const that = this;
		resetSelectedFiltersLists();

		for (let type in this._optionsSelected) {
			if (this._optionsSelected[type].length > 0) {
				this._optionsSelected[type].forEach((item) => {
					displayOptionsList(type, item);
				});
			}
		}

		function displayOptionsList(type, item) {
			let li = createBlock("li", [
				{ name: "class", value: "selected-filters__list__item" },
				{ name: "data-value", value: item },
				{ name: "data-type", value: type },
			]);
			let img = createImage("./assets/icons/close.svg", [{ name: "class", value: "selected-filters__list__close" }]);
			let span = createBlock("span");

			span.textContent = item;
			li.append(span, img);

			that._selectedFiltersLists[type].classList.add("show");
			that._selectedFiltersLists[type].append(li);
		}

		function resetSelectedFiltersLists() {
			for (let key in that._selectedFiltersLists) {
				that._selectedFiltersLists[key].innerHTML = "";
			}
		}

		this.initCloseFilterItems();
	}

	initCloseFilterItems() {
		const that = this;
		const items = document.querySelectorAll(".selected-filters__list__item");

		items.forEach((item) => {
			const close = item.querySelector(".selected-filters__list__close");

			close.addEventListener("click", () => {
				closeItem(item);
			});
		});

		function closeItem(item) {
			const options = document.querySelectorAll(".filters__option__list__item");

			that._optionsSelected[item.dataset.type] = that._optionsSelected[item.dataset.type].filter((option) => option !== item.dataset.value);

			if (that._optionsSelected[item.dataset.type].length == 0) that._selectedFiltersLists[item.dataset.type].classList.remove("show");

			options.forEach((option) => {
				if (option.dataset.value === item.dataset.value) option.classList.remove("disabled");
			});

			that.refreshOptionsListsDisplay();
			that.filterByOptions();
		}
	}

	filterByOptions() {
		this._Recipes.forEach((recipe) => {
			const card = document.querySelector("#recipe_" + recipe.id);

			if (
				recipe.hasIngredients(this._optionsSelected["ingredients"]) &&
				recipe.hasAppliance(this._optionsSelected["appliance"]) &&
				recipe.hasUstensils(this._optionsSelected["ustensils"])
			) {
				this.showElement(card);
			} else {
				this.hideElement(card);
			}
		});
	}

	showElement(element) {
		element.classList.add("show");
		element.classList.remove("hidden");
	}

	hideElement(element) {
		element.classList.remove("show");
		element.classList.add("hidden");
	}

	clear(str) {
		return this.removeAccents(str).toLowerCase().trim();
	}

	removeAccents(str) {
		return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	}
}

const app = new App();
app.init();
