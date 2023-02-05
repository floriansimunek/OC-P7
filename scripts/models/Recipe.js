class Recipe {
	constructor(data) {
		this._id = data.id;
		this._appliance = data.appliance;
		this._description = data.description;
		this._ingredients = data.ingredients;
		this._name = data.name;
		this._servings = data.servings;
		this._time = data.time;
		this._ustensils = data.ustensils;
		this.recipesWrapper = document.querySelector(".recipes");
	}

	get id() {
		return this._id;
	}

	get appliance() {
		return this._appliance;
	}

	get description() {
		return this._description;
	}

	get ingredients() {
		return this._ingredients;
	}

	get name() {
		return this._name;
	}

	get servings() {
		return this._servings;
	}

	get time() {
		return this._time;
	}

	get ustensils() {
		return this._ustensils;
	}

	nameContains(str) {
		return this.clear(this.name).includes(this.clear(str));
	}

	descriptionContains(str) {
		return this.clear(this.description).includes(this.clear(str));
	}

	hasIngredient(str) {
		return this.ingredients.some((item) => this.clear(item.ingredient).includes(this.clear(str)));
	}

	hasIngredients(arr) {
		const ingr = [];

		if (arr.length > 0) {
			this._ingredients.forEach((item) => {
				ingr.push(this.clear(item.ingredient));
			});
			return arr.every((value) => ingr.includes(this.clear(value)));
		} else {
			return true;
		}
	}

	hasAppliance(arr) {
		if (arr.length > 0) {
			return this.clear(this.appliance) === this.clear(arr[0]);
		} else {
			return true;
		}
	}

	hasUstensils(arr) {
		const ust = [];

		if (arr.length > 0) {
			this._ustensils.forEach((item) => {
				ust.push(this.clear(item));
			});
			return arr.every((value) => ust.includes(this.clear(value)));
		} else {
			return true;
		}
	}

	createCardDOM() {
		if (this.recipesWrapper) {
			const article = createBlock("article", [
				{ name: "class", value: "recipe-card" },
				{ name: "id", value: "recipe_" + this.id },
			]);
			const header = createBlock("header", [{ name: "class", value: "recipe-card__image" }]);
			const footer = createBlock("footer", [{ name: "class", value: "recipe-card__description" }]);

			const leftBlock = createBlock("footer", [{ name: "class", value: "recipe-card__description--left" }]);
			const leftBlockTitle = createHeading(2, this.name, [
				{
					name: "class",
					value: "recipe-card__description--left__title",
				},
			]);
			const leftBlockList = createList(this.ingredients, [
				{
					name: "class",
					value: "recipe-card__description--left__list",
				},
			]);

			const rightBlock = createBlock("footer", [{ name: "class", value: "recipe-card__description--right" }]);
			const rightBlockTitle = createHeading(2, this.time + " min", [
				{
					name: "class",
					value: "recipe-card__description--right__title",
				},
			]);
			const rightBlockIconTitle = createImage("./assets/icons/clock.svg", [{ name: "alt", value: "Clock Icon" }]);
			const rightBlockParagraph = createParagraph(this.description, [
				{
					name: "class",
					value: "recipe-card__description--right__text",
				},
			]);

			leftBlock.append(leftBlockTitle, leftBlockList);
			rightBlockTitle.append(rightBlockIconTitle);
			rightBlock.append(rightBlockTitle, rightBlockParagraph);
			footer.append(leftBlock, rightBlock);
			article.append(header, footer);
			this.recipesWrapper.append(article);
		}
	}

	clear(str) {
		return this.removeAccents(str).toLowerCase().trim();
	}

	removeAccents(str) {
		return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	}
}
