class App {
	constructor() {
		this._Api = new Api("./data/recipes.json");
		this._data = [];
		this._Recipes = [];
	}

	async init() {
		await this.getDatas();

		this._data.recipes.forEach((recipe, i) => {
			this._Recipes.push(new Recipe(recipe));
			this._Recipes[i].createCardDOM();
		});
	}

	async getDatas() {
		try {
			this._data = await this._Api.getData();
		} catch (error) {
			console.error(error);
		}
	}
}

const app = new App();
app.init();
