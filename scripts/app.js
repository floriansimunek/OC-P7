class App {
	constructor() {
		this._data = recipes;
		this._Recipes = [];
		this._optionsLists = { ingredients: [], appliance: [], ustensils: [] };
		this._selectedOptions = { ingredients: [], appliance: [], ustensils: [] };
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

		this.initOptions();
		this.initSearchBar();
	}

	initOptions() {
		this._Recipes.forEach((recipe) => {
			recipe.ingredients.forEach((item) => {
				this._optionsLists.ingredients.push({ name: clear(item.ingredient), selected: false, disabled: false });
			});

			this._optionsLists.appliance.push({ name: clear(recipe.appliance), selected: false, disabled: false });

			recipe.ustensils.forEach((ustensil) => {
				this._optionsLists.ustensils.push({ name: clear(ustensil), selected: false, disabled: false });
			});
		});

		//TODO: Sort by name
		// Remove duplicates in optionsLists Arrays
		for (let type in this._optionsLists) {
			this._optionsLists[type] = [...new Map(this._optionsLists[type].map((item) => [item.name, item])).values()];
		}

		this.initFiltersInputs();
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

		this.appendOptionsToLists();
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

		this.initEventsToOptions();
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
			this._optionsLists[type].forEach((option) => {
				if (option.disabled) {
					const optionDOM = document.querySelector(`li[data-value="${option.name}"]`);
					optionDOM.classList.add("disabled");
				}

				if (option.selected) {
					this._selectedOptions[type].push(option);
					this._selectedOptions[type] = [...new Map(this._selectedOptions[type].map((item) => [item.name, item])).values()];
				}
			});
		}

		this.refreshSelectedOptions();
	}

	refreshSelectedOptions() {
		for (let type in this._selectedOptionsListsElements) {
			this._selectedOptionsListsElements[type].innerHTML = "";
		}

		for (let type in this._selectedOptions) {
			if (this._selectedOptions[type].length > 0) {
				this._selectedOptions[type].forEach((selectedOption) => {
					let li = createBlock("li", [
						{ name: "class", value: "selected-filters__list__item" },
						{ name: "data-value", value: selectedOption.name },
						{ name: "data-type", value: type },
					]);
					let img = createImage("./assets/icons/close.svg", [{ name: "class", value: "selected-filters__list__close" }]);
					let span = createBlock("span");

					span.textContent = selectedOption.name;
					li.append(span, img);

					this._selectedOptionsListsElements[type].classList.add("show");
					this._selectedOptionsListsElements[type].append(li);
				});
			}
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
