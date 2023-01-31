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

	async init() {
		this._data.forEach((recipe, i) => {
			this._Recipes.push(new Recipe(recipe));
			this._Recipes[i].createCardDOM();
		});

		this.initSearchBar();
		this.initFiltersInputs();
	}

	initSearchBar() {
		this._searchBar.addEventListener("input", (e) => {
			let inputValue = this._searchBar.value.toLowerCase().trim();
			const MIN_INPUT_LENGTH = 3;

			this._Recipes.forEach((recipe) => {
				const FILTER_NAME = this.removeAccents(recipe.name).toLowerCase().trim().includes(this.removeAccents(inputValue));
				const FILTER_DESCRIPTION = this.removeAccents(recipe.description).toLowerCase().trim().includes(inputValue);
				const FILTER_INGREDIENTS = recipe.ingredients.some((item) => this.removeAccents(item.ingredient).toLowerCase().trim().includes(inputValue));
				let card = document.querySelector("#recipe_" + recipe.id);

				if (inputValue.length >= MIN_INPUT_LENGTH) {
					if (FILTER_NAME || FILTER_DESCRIPTION || FILTER_INGREDIENTS) {
						this.showElement(card);
					} else {
						this.hideElement(card);
					}
				} else {
					this.showElement(card);
				}
			});
		});
	}

	initFiltersInputs() {
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
			});

			inputArrow.addEventListener("blur", () => {
				setTimeout(() => {
					input.value = defaultValue;
					input.classList.toggle("open");
					FILTER_LIST.classList.toggle("open");
				}, 200);
			});
		});

		this.initFiltersLists();

		const SELECTED_INGREDIENTS = document.querySelector(".selected-filters__list__ingredients");
		const SELECTED_APPLIANCE = document.querySelector(".selected-filters__list__appliance");
		const SELECTED_UTENSILS = document.querySelector(".selected-filters__list__utensils");

		document.querySelectorAll(".filters__option__list__item").forEach((item) => {
			item.addEventListener("click", () => {
				switch (item.dataset.type) {
					case "ingredients":
						this._filterItemsSelected.ingredients.push(item.dataset.value);
						break;
					case "appliance":
						this._filterItemsSelected.appliance.push(item.dataset.value);
						break;
					case "ustensils":
						this._filterItemsSelected.ustensils.push(item.dataset.value);
						break;
					default:
						throw new Error("Unknown item type");
				}

				SELECTED_INGREDIENTS.innerHTML = "";
				SELECTED_APPLIANCE.innerHTML = "";
				SELECTED_UTENSILS.innerHTML = "";
				Object.keys(this._filterItemsSelected).forEach((key) => {
					this._filterItemsSelected[key].forEach((item) => {
						let li = createBlock("li", [
							{ name: "class", value: "test" },
							{ name: "data-value", value: item },
						]);
						let img = createImage("./assets/icons/close.svg", [{ name: "class", value: "test-close" }]);
						let span = createBlock("span");

						span.textContent = item;
						li.append(span, img);

						console.log(this._filterItemsSelected[key]);

						switch (key) {
							case "ingredients":
								SELECTED_INGREDIENTS.append(li);
								break;
							case "appliance":
								SELECTED_APPLIANCE.append(li);
								break;
							case "ustensils":
								SELECTED_UTENSILS.append(li);
								break;
							default:
								throw new Error("Unknown filter option type");
								break;
						}
					});
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

		Object.keys(lists).forEach((type) => {
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
		});

		function getList(type) {
			let list = [];

			that._Recipes.forEach((recipe) => {
				if (type === "appliance") {
					list.push(recipe[type].toLowerCase());
				} else {
					recipe[type].forEach((item) => {
						list.push(type === "ustensils" ? item.toLowerCase() : item["ingredient"].toLowerCase());
					});
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

	removeAccents(str) {
		return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	}
}

const app = new App();
app.init();
