class Api {
	constructor(url) {
		this.url = url;
		this.data = [];
	}

	async getData() {
		await fetch(this.url)
			.then((response) => response.json())
			.then((json) => {
				this.data = json;
			});
		return this.data;
	}
}
