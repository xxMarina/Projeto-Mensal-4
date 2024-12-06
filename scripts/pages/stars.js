// Função para criar estrelas
function createStars(quantity) {
	const body = document.body;
	for (let i = 0; i < quantity; i++) {
		const star = document.createElement("div");
		star.classList.add("star");

		// Coordenadas aleatórias
		const x = Math.random() * window.innerWidth;
		const y = Math.random() * window.innerHeight;

		// Posicionando a estrela
		star.style.left = `${x}px`;
		star.style.top = `${y}px`;

		// Tamanho aleatório
		const size = Math.random() * 3 + 1; // Entre 1px e 4px
		star.style.width = `${size}px`;
		star.style.height = `${size}px`;

		// Adiciona a estrela ao corpo
		body.appendChild(star);
	}
}

createStars(200);
