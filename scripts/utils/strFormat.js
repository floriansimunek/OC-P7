function clear(str) {
	return this.removeAccents(str).toLowerCase().trim();
}

function removeAccents(str) {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
