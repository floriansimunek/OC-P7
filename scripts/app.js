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
		for (let i = 0; this._data.length > i; i++) {
			this._Recipes.push(new Recipe(this._data[i]));
			this._Recipes[i].createCardDOM();
		}

		this.initOptionsLists();
		this.appendOptionsToLists();
		this.initEventsToOptions();
		this.initSearchBar();
		this.initFiltersInputs();
	}

	initOptionsLists() {
		for (let i = 0; this._Recipes.length > i; i++) {
			for (let y = 0; this._Recipes[i].ingredients.length > y; y++) {
				this._optionsLists.ingredients.push({ name: clear(this._Recipes[i].ingredients[y].ingredient), selected: false, disabled: false });
			}

			this._optionsLists.appliance.push({ name: clear(this._Recipes[i].appliance), selected: false, disabled: false });

			for (let y = 0; this._Recipes[i].ustensils.length > y; y++) {
				this._optionsLists.ustensils.push({ name: clear(this._Recipes[i].ustensils[y]), selected: false, disabled: false });
			}
		}

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

		for (let i = 0; this._optionsElements.length > i; i++) {
			this._optionsElements[i].addEventListener("click", () => {
				let clickedItem = this._optionsLists[this._optionsElements[i].dataset.type].filter((item) => clear(item.name) === clear(this._optionsElements[i].dataset.value));
				this._optionsLists[this._optionsElements[i].dataset.type].map(() => {
					clickedItem[0].selected = true;
					clickedItem[0].disabled = true;
				});

				this.refreshOptionsDisplay();
			});
		}
	}

	refreshOptionsDisplay() {
		const ingredientsOptions = document.querySelectorAll(".filters__option__list__item[data-type='ingredients']");
		for (let i = 0; ingredientsOptions.length > i; i++) {
			this._optionsLists[ingredientsOptions[i].dataset.type].map((item) => {
				item.disabled = true;
			});
		}

		const appliancesOptions = document.querySelectorAll(".filters__option__list__item[data-type='appliance']");
		for (let i = 0; appliancesOptions.length > i; i++) {
			this._optionsLists[appliancesOptions[i].dataset.type].map((item) => {
				item.disabled = true;
			});
		}

		const ustensilsOptions = document.querySelectorAll(".filters__option__list__item[data-type='ustensils']");
		for (let i = 0; ustensilsOptions.length > i; i++) {
			this._optionsLists[ustensilsOptions[i].dataset.type].map((item) => {
				item.disabled = true;
			});
		}

		for (let type in this._optionsLists) {
			this._selectedOptionsLists[type] = [];

			for (let i = 0; this._optionsLists[type].length > i; i++) {
				if (this._optionsLists[type][i].disabled) {
					const optionDOM = document.querySelector(`.filters__option__list__item[data-value="${this._optionsLists[type][i].name}"]`);
					optionDOM.style.display = "none";
				} else {
					const optionDOM = document.querySelector(`.filters__option__list__item[data-value="${this._optionsLists[type][i].name}"]`);
					document.querySelector(".filters__option__ingredients").style.height = "auto";
					optionDOM.style.display = "block";
				}

				if (this._optionsLists[type][i].selected) {
					this._selectedOptionsLists[type].push(this._optionsLists[type][i].name);
					this._selectedOptionsLists[type] = [...new Set(this._selectedOptionsLists[type])];
				}
			}

			if (this._selectedOptionsLists[type].length == 0) {
				this._selectedOptionsListsElements[type].classList.remove("show");
			}
		}

		let ingredients = [];
		for (let i = 0; this._Recipes.length > i; i++) {
			if (this._Recipes[i].hasIngredients(this._selectedOptionsLists["ingredients"])) {
				this._Recipes[i].ingredients.forEach((ingredient) => {
					ingredients.push(ingredient);
				});
			}
		}
		ingredients = [...new Map(ingredients.map((item) => [item.ingredient, item])).values()];

		for (let i = 0; ingredients.length > i; i++) {
			for (let y = 0; ingredientsOptions.length > y; y++) {
				for (let x = 0; this._selectedOptionsLists.ingredients.length > x; x++) {
					if (clear(ingredientsOptions[y].dataset.value) === clear(ingredients[i].ingredient)) {
						ingredientsOptions[y].style.display = "block";
						document.querySelector(".filters__option__ingredients").style.height = "auto";
					}

					if (clear(ingredientsOptions[y].dataset.value) === clear(this._selectedOptionsLists.ingredients[x])) {
						ingredientsOptions[y].style.display = "none";
					}
				}
			}
		}

		if (this._selectedOptionsLists.ingredients.length === 0) {
			for (let i = 0; ingredientsOptions.length > i; i++) {
				ingredientsOptions[i].style.display = "block";
				document.querySelector(".filters__option__ingredients").style.height = "600px";
			}
		}

		if (this._selectedOptionsLists.appliance.length === 0) {
			for (let i = 0; appliancesOptions.length > i; i++) {
				appliancesOptions[i].style.display = "block";
			}
		}

		let ustensils = [];
		for (let i = 0; this._Recipes.length > i; i++) {
			if (this._Recipes[i].hasUstensils(this._selectedOptionsLists["ustensils"])) {
				for (let y = 0; this._Recipes[i].ustensils.length > y; y++) {
					ustensils.push(this._Recipes[i].ustensils[y]);
				}
			}
		}
		ustensils = [...new Map(ustensils.map((item) => [item, item])).values()];

		for (let i = 0; ustensils.length > i; i++) {
			for (let y = 0; ustensilsOptions.length > y; y++) {
				for (let x = 0; this._selectedOptionsLists.ustensils.length > x; x++) {
					if (clear(ustensilsOptions[y].dataset.value) === clear(ustensils[i])) {
						ustensilsOptions[y].style.display = "block";
					}

					if (clear(ustensilsOptions[y].dataset.value) === clear(this._selectedOptionsLists.ustensils[x])) {
						ustensilsOptions[y].style.display = "none";
					}
				}
			}
		}

		if (this._selectedOptionsLists.ustensils.length === 0) {
			for (let i = 0; ustensilsOptions.length > i; i++) {
				ustensilsOptions[i].style.display = "block";
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
				for (let i = 0; this._selectedOptionsLists[type].length > i; i++) {
					let li = createBlock("li", [
						{ name: "class", value: "selected-filters__list__item" },
						{ name: "data-value", value: this._selectedOptionsLists[type][i] },
						{ name: "data-type", value: type },
					]);
					let img = createImage("./assets/icons/close.svg", [{ name: "class", value: "selected-filters__list__close" }]);
					let span = createBlock("span");

					span.textContent = this._selectedOptionsLists[type][i];
					li.append(span, img);

					this._selectedOptionsListsElements[type].classList.add("show");
					this._selectedOptionsListsElements[type].append(li);
				}
			}
		}

		this.initCloseOption();
	}

	initCloseOption() {
		const items = document.querySelectorAll(".selected-filters__list__item");

		for (let i = 0; items.length > i; i++) {
			const close = items[i].querySelector(".selected-filters__list__close");

			close.addEventListener("click", () => {
				let clickedItem = this._optionsLists[items[i].dataset.type].filter((option) => clear(items[i].dataset.value) === clear(option.name));
				this._optionsLists[items[i].dataset.type].map(() => {
					clickedItem[0].selected = false;
					clickedItem[0].disabled = false;
				});

				this.refreshOptionsDisplay();
			});
		}
	}

	filterByOptions() {
		for (let i = 0; this._Recipes.length > i; i++) {
			const card = document.querySelector("#recipe_" + this._Recipes[i].id);

			if (this._Recipes[i].hasIngredients(this._selectedOptionsLists["ingredients"]) && this._Recipes[i].hasAppliance(this._selectedOptionsLists["appliance"]) && this._Recipes[i].hasUstensils(this._selectedOptionsLists["ustensils"])) {
				this.showElement(card);
			} else {
				this.hideElement(card);
			}

			if (this._selectedOptionsLists.ingredients.length == 0 && this._selectedOptionsLists.appliance.length == 0 && this._selectedOptionsLists.ustensils.length == 0) {
				this.showElement(card);
			}
		}
	}

	initSearchBar() {
		const searchBar = document.querySelector("#searchBar");
		const MIN_INPUT_LENGTH = 3;

		searchBar.addEventListener("input", (e) => {
			let inputValue = clear(e.target.value);

			for (let i = 0; this._Recipes.length > i; i++) {
				const card = document.querySelector("#recipe_" + this._Recipes[i].id);

				if (inputValue.length >= MIN_INPUT_LENGTH && recipeFilter(this._Recipes[i], inputValue)) {
					this.showElement(card);
				} else if (inputValue.length < MIN_INPUT_LENGTH) {
					this.showElement(card);
				} else {
					this.hideElement(card);
				}
			}
		});

		function recipeFilter(recipe, inputValue) {
			return recipe.nameContains(inputValue) || recipe.descriptionContains(inputValue) || recipe.hasIngredient(inputValue);
		}
	}

	initFiltersInputs() {
		const filtersBlock = document.querySelectorAll(".filters__block");

		for (let i = 0; filtersBlock.length > i; i++) {
			const input = filtersBlock[i].querySelector(".filters__input");
			const arrowInput = filtersBlock[i].querySelector(".filters__block__arrow");
			const filtersList = filtersBlock[i].querySelector(".filters__option");

			let defaultInputValue = input.value;

			["focus", "blur"].forEach((event) => {
				input.addEventListener(event, () => {
					input.classList.toggle("expanded");
					event === "focus" ? (input.value = "") : (input.value = defaultInputValue);
					event === "focus" ? (document.querySelector(".filters__option__ingredients").style.height = "auto") : (document.querySelector(".filters__option__ingredients").style.height = "600px");
					setTimeout(() => {
						input.classList.remove("open");
						arrowInput.classList.remove("open");
						filtersList.classList.remove("open");
					}, 100);
				});
			});

			input.addEventListener("input", (e) => {
				let inputValue = clear(e.target.value);

				input.classList.add("open");
				arrowInput.classList.add("open");
				filtersList.classList.add("open");

				const options = document.querySelectorAll(".filters__option__list__item");
				for (let i = 0; options.length > i; i++) {
					if (options[i].dataset.value.includes(inputValue)) {
						options[i].classList.remove("hidden");
					} else {
						options[i].classList.add("hidden");
					}
				}
			});

			input.addEventListener("blur", () => {
				const options = document.querySelectorAll(".filters__option__list__item");
				for (let i = 0; options.length > i; i++) {
					options[i].classList.remove("hidden");
				}
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
