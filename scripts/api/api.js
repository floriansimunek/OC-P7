class Api {
	constructor() {
		this._recipes = recipes;
	}

	async getData() {
		return this._recipes;
	}
}
