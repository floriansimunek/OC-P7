class App {
	constructor() {
		this._data = recipes;
		this._Recipes = [];
		this._optionsLists = { ingredients: [], appliance: [], ustensils: [] };
		this._selectedOptionsLists = { ingredients: [], appliance: [], ustensils: [] };
		this._optionsListsElements = {
			ingredients: document.querySelector(".filters__option__ingredients__list"),
			appliance: document.querySelector(".filters__option__devices__list"),
			ustensils: document.querySelector(".filters__option__utensils__list"),
		};
		this._selectedOptionsListsElements = {
			ingredients: document.querySelector(".selected-filters__list__ingredients"),
			appliance: document.querySelector(".selected-filters__list__appliance"),
			ustensils: document.querySelector(".selected-filters__list__utensils"),
		};
		this._optionsElements = [];
	}

	init() {
		this._data.forEach((recipe, i) => {
			this._Recipes.push(new Recipe(recipe));
			this._Recipes[i].createCardDOM();
		});

		this.initOptionsLists();
		this.appendOptionsToLists();
		this.initEventsToOptions();
		this.initSearchBar();
		this.initFiltersInputs();
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

		// Remove duplicates in optionsLists Arrays & sort by names
		for (let type in this._optionsLists) {
			this._optionsLists[type] = [...new Map(this._optionsLists[type].map((item) => [item.name, item])).values()];
			this._optionsLists[type] = this._optionsLists[type].sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
		}
	}

	appendOptionsToLists() {
		for (let type in this._optionsListsElements) {
			this._optionsLists[type].forEach((option) => {
				let li = createBlock("li", [
					{ name: "class", value: "filters__option__list__item" },
					{ name: "data-value", value: option.name },
					{ name: "data-type", value: type },
				]);
				li.textContent = option.name;

				this._optionsListsElements[type].append(li);
			});
		}
	}

	initEventsToOptions() {
		this._optionsElements = document.querySelectorAll(".filters__option__list__item");

		this._optionsElements.forEach((option) => {
			option.addEventListener("click", () => {
				let clickedItem = this._optionsLists[option.dataset.type].filter((item) => clear(item.name) === clear(option.dataset.value));
				this._optionsLists[option.dataset.type].map(() => {
					clickedItem[0].selected = true;
					clickedItem[0].disabled = true;
				});

				this.refreshOptionsDisplay();
			});
		});
	}

	refreshOptionsDisplay() {
		for (let type in this._optionsLists) {
			this._selectedOptionsLists[type] = [];

			this._optionsLists[type].forEach((option) => {
				if (option.disabled) {
					const optionDOM = document.querySelector(`.filters__option__list__item[data-value="${option.name}"]`);
					optionDOM.classList.add("disabled");
				} else {
					const optionDOM = document.querySelector(`.filters__option__list__item[data-value="${option.name}"]`);
					optionDOM.classList.remove("disabled");
				}

				if (option.selected) {
					this._selectedOptionsLists[type].push(option.name);
					this._selectedOptionsLists[type] = [...new Set(this._selectedOptionsLists[type])];
				}
			});

			if (this._selectedOptionsLists[type].length == 0) {
				this._selectedOptionsListsElements[type].classList.remove("show");
			}
		}

		this.refreshSelectedOptions();
		this.filterByOptions();
	}

	refreshSelectedOptions() {
		for (let type in this._selectedOptionsListsElements) {
			this._selectedOptionsListsElements[type].innerHTML = "";
		}

		for (let type in this._selectedOptionsLists) {
			if (this._selectedOptionsLists[type].length > 0) {
				this._selectedOptionsLists[type].forEach((selectedOption) => {
					let li = createBlock("li", [
						{ name: "class", value: "selected-filters__list__item" },
						{ name: "data-value", value: selectedOption },
						{ name: "data-type", value: type },
					]);
					let img = createImage("./assets/icons/close.svg", [{ name: "class", value: "selected-filters__list__close" }]);
					let span = createBlock("span");

					span.textContent = selectedOption;
					li.append(span, img);

					this._selectedOptionsListsElements[type].classList.add("show");
					this._selectedOptionsListsElements[type].append(li);
				});
			}
		}

		this.initCloseOption();
	}

	initCloseOption() {
		const items = document.querySelectorAll(".selected-filters__list__item");

		items.forEach((item) => {
			const close = item.querySelector(".selected-filters__list__close");

			close.addEventListener("click", () => {
				let clickedItem = this._optionsLists[item.dataset.type].filter((option) => clear(item.dataset.value) === clear(option.name));
				this._optionsLists[item.dataset.type].map(() => {
					clickedItem[0].selected = false;
					clickedItem[0].disabled = false;
				});

				this.refreshOptionsDisplay();
			});
		});
	}

	filterByOptions() {
		this._Recipes.forEach((recipe) => {
			const card = document.querySelector("#recipe_" + recipe.id);

			recipe.hasAppliance(this._selectedOptionsLists["ustensils"]);
			if (
				recipe.hasIngredients(this._selectedOptionsLists["ingredients"]) &&
				recipe.hasAppliance(this._selectedOptionsLists["appliance"]) &&
				recipe.hasUstensils(this._selectedOptionsLists["ustensils"])
			) {
				this.showElement(card);
			} else {
				this.hideElement(card);
			}

			if (
				this._selectedOptionsLists.ingredients.length == 0 &&
				this._selectedOptionsLists.appliance.length == 0 &&
				this._selectedOptionsLists.ustensils.length == 0
			) {
				this.showElement(card);
			}
		});
	}

	initSearchBar() {
		const searchBar = document.querySelector("#searchBar");
		const MIN_INPUT_LENGTH = 3;

		searchBar.addEventListener("input", (e) => {
			let inputValue = clear(e.target.value);

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
					input.classList.remove("open");
					arrowInput.classList.remove("open");
					filtersList.classList.remove("open");
				});
			});

			input.addEventListener("input", (e) => {
				let inputValue = clear(e.target.value);

				input.classList.add("open");
				arrowInput.classList.add("open");
				filtersList.classList.add("open");

				const options = document.querySelectorAll(".filters__option__list__item");
				options.forEach((option) => {
					if (option.dataset.value.includes(inputValue)) {
						option.classList.remove("disabled");
					} else {
						option.classList.add("disabled");
					}
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
