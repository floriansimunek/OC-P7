function createElement(tag, attributes, properties) {
	const element = document.createElement(tag);

	if (attributes) {
		attributes.forEach((attribute) => {
			element.setAttribute(attribute.name, attribute.value);
		});
	}

	if (properties) {
		properties.forEach((property) => {
			element[property.name] = property.value;
		});
	}

	return element;
}

function createAnchor(href, attributes) {
	return createElement("a", attributes, [{ name: "href", value: href }]);
}

function createImage(src, attributes) {
	return createElement("img", attributes, [{ name: "src", value: src }]);
}

function createHeading(level, text, attributes) {
	return createElement("h" + level, attributes, [{ name: "textContent", value: text }]);
}

function createParagraph(text, attributes) {
	return createElement("p", attributes, [{ name: "textContent", value: text }]);
}

function createBlock(tag, attributes) {
	return createElement(tag, attributes);
}

function createList(items, attributes) {
	const element = createElement("ul", attributes);

	items.forEach((item) => {
		const li = createElement("li");

		const ingredient = createElement(
			"span",
			[{ name: "class", value: "ingredient" }],
			[
				{
					name: "textContent",
					value: item.quantity ? item.ingredient + " : " : item.ingredient,
				},
			],
		);

		const quantity = createElement(
			"span",
			[],
			[
				{
					name: "textContent",
					value: item.unit ? item.quantity + " " + item.unit : item.quantity,
				},
			],
		);

		li.append(ingredient, quantity);
		element.appendChild(li);
	});

	return element;
}
