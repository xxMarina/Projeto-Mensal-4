// import { API_BASE_URL } from "../../config/apiConfig.js";
// import { getFromLocalStorage } from "../utils/storage.js";

// const boardsList = document.getElementById("boardsList");
// const userNameSpan = document.getElementById("userName");
// const logoutButton = document.getElementById("logoutButton");
// const boardTitle = document.getElementById("boardTitle");
// const boardLayout = document.getElementById("board");
// const themeToggle = document.getElementById("themeToggle");
// const addColumnButton = document.getElementById("addColumnButton");

// //carrega o nome do usuario cadastrado no login, pegando do local storage
// function loadUserName() {
// 	const userName = getFromLocalStorage("user");
// 	console.log(userName);
// 	if (userName.name) {
// 		userNameSpan.textContent = `Olá, ${userName.name.split(" ")[0]}`;
// 	} else {
// 		userNameSpan.textContent = "Usuário não identificado";
// 	}
// }

// // Função para alternar o tema
// function toggleTheme() {
// 	const body = document.body;
// 	if (body.classList.contains("dark-theme")) {
// 		body.classList.replace("dark-theme", "light-theme");
// 		localStorage.setItem("theme", "light");
// 		themeToggle.checked = false;
// 	} else {
// 		body.classList.replace("light-theme", "dark-theme");
// 		localStorage.setItem("theme", "dark");
// 		themeToggle.checked = true;
// 	}
// }

// // Recupera o tema salvo no localStorage
// function loadTheme() {
// 	const savedTheme = localStorage.getItem("theme") || "light";
// 	document.body.classList.add(savedTheme === "dark" ? "dark-theme" : "light-theme");
// 	themeToggle.checked = savedTheme === "dark";
// }
// // Event listener para alternar o tema
// themeToggle.addEventListener("change", toggleTheme);
// // Inicializa o tema ao carregar a página
// loadTheme();

// async function loadBoards() {
// 	try {
// 		const response = await fetch(`${API_BASE_URL}/Boards`);
// 		if (!response.ok) {
// 			throw new Error("Erro ao carregar boards");
// 		}
// 		const boards = await response.json();
// 		populateBoardsDropdown(boards);
// 	} catch (error) {
// 		console.error("Erro ao carregar boards:", error);
// 	}
// }

// let selectedBoardId = null; // Variável global para armazenar o ID do quadro selecionado
// function populateBoardsDropdown(boards) {
// 	boards.forEach((board) => {
// 		const listItem = document.createElement("li");
// 		listItem.innerHTML = `<a class="dropdown-item" id="dropdown-item" value="${board.Id}">${board.Name}</a>`;
// 		listItem.addEventListener("click", (event) => {
// 			boardTitle.innerHTML = event.target.innerHTML;
// 			selectedBoardId = board.Id; // Armazena o ID do quadro selecionado
// 			loadBoard(board.Id);
// 		});
// 		boardsList.appendChild(listItem);
// 	});
// }
// //função para ler os boards por ID
// async function loadBoard(id) {
// 	try {
// 		const response = await fetch(`${API_BASE_URL}/ColumnByBoardId?BoardId=${id}`);
// 		if (!response.ok) {
// 			throw new Error("Erro ao carregar colunas");
// 		}
// 		const columns = await response.json();
// 		populateColumns(columns);
// 	} catch (error) {
// 		console.error("Erro ao carregar colunas:", error);
// 	}
// }

// // function populateColumns(columns) {
// // 	boardLayout.innerHTML = "";

// // 	columns.forEach((column) => {
// // 		const columnItem = document.createElement("article");
// // 		columnItem.className = "column-item";

// // 		const columnHeader = document.createElement("header");
// // 		columnHeader.className = "column-header";
// // 		columnHeader.innerHTML = `<h5>${column.Name}</h5>`;

// // 		// Contêiner para as tarefas
// // 		const tasksContainer = document.createElement("div");
// // 		tasksContainer.className = "tasks-container";
// // 		tasksContainer.id = `tasks-${column.Id}`;

// // 		// Contêiner principal da coluna
// // 		const columnBody = document.createElement("div");
// // 		columnBody.className = "column-body";

// // 		// Botão "Novo Card"
// // 		const newCardButton = document.createElement("div");
// // 		newCardButton.className = "task-item new-card";
// // 		newCardButton.innerHTML = `
// //             <button class="btn btn-light btn-block w-100 d-block"> + Nova Tarefa </button>
// //         `;
// // 		newCardButton.addEventListener("click", () => {
// // 			createNewCard(column.Id);
// // 		});

// // 		// Adiciona os elementos à coluna
// // 		columnBody.appendChild(tasksContainer); // Contêiner de tarefas
// // 		columnBody.appendChild(newCardButton); // Botão "Novo Card"
// // 		columnItem.appendChild(columnHeader);
// // 		columnItem.appendChild(columnBody);
// // 		boardLayout.appendChild(columnItem);

// // 		// Adiciona tasks à coluna
// // 		fetchTasksByColumn(column.Id).then((res) => {
// // 			addTasksToColumn(column.Id, res);
// // 		});
// // 	});
// // }

// //add funcao para colunas

// addColumnButton.addEventListener("click", () => {
// 	createNewColumn();
// });

// //função para add o titulo e descrição das tarefas quando clicado em add tarefas
// //com o addEventListener
// function createNewCard(ColumnId) {
// 	const tasksContainer = document.getElementById(`tasks-${ColumnId}`);

// 	// Verifica se o container de tarefas foi encontrado
// 	if (!tasksContainer) {
// 		console.error(`Container de tarefas para a coluna ${ColumnId} não encontrado.`);
// 		return;
// 	}

// 	// Cria os campos de input para o título e descrição
// 	const titleInput = document.createElement("input");
// 	titleInput.type = "text";
// 	titleInput.placeholder = "Título";
// 	titleInput.className = "task-input form-control mb-1";

// 	const descriptionInput = document.createElement("input");
// 	descriptionInput.type = "text";
// 	descriptionInput.placeholder = "Descrição";
// 	descriptionInput.className = "task-input form-control mb-1";

// 	// Botão para salvar o card
// 	const saveButton = document.createElement("button");
// 	saveButton.className = "btn btn-success  btn-sm btn-save";
// 	saveButton.innerText = "Salvar";

// 	// Botão para cancelar a criação do card
// 	const cancelButton = document.createElement("button");
// 	cancelButton.className = "btn btn-danger  btn-sm  btn-cancel m-1";
// 	cancelButton.innerText = "Cancelar";

// 	// Container para os inputs e botões
// 	const cardEditor = document.createElement("div");
// 	cardEditor.className = "card-editor";
// 	cardEditor.appendChild(titleInput);
// 	cardEditor.appendChild(descriptionInput);
// 	cardEditor.appendChild(saveButton);
// 	cardEditor.appendChild(cancelButton);

// 	// Adiciona o editor ao container de tarefas
// 	tasksContainer.appendChild(cardEditor);

// 	// Event listener para salvar o card
// 	saveButton.addEventListener("click", () => {
// 		const title = titleInput.value.trim();
// 		const description = descriptionInput.value.trim();

// 		if (title === "") {
// 			alert("O título da tarefa não pode estar vazio.");
// 			return;
// 		}

// 		// Cria o card
// 		const taskItem = document.createElement("div");
// 		taskItem.className = "task-item";
// 		taskItem.innerHTML = `
//             <h6>${title}</h6>
//             <p>${description}</p>
//         `;

// 		// Adiciona o novo card ao container de tarefas
// 		tasksContainer.appendChild(taskItem);

// 		// Remove o editor de tarefas
// 		tasksContainer.removeChild(cardEditor);

// 		saveTask(ColumnId, title, description);
// 	});

// 	// Event listener para cancelar
// 	cancelButton.addEventListener("click", () => {
// 		tasksContainer.removeChild(cardEditor);
// 	});
// }
// //salvando as tarefas
// function saveTask(ColumnId, title, description) {
// 	// Lógica para salvar a tarefa no backend (exemplo)
// 	fetch(`${API_BASE_URL}/Task`, {
// 		method: "POST",
// 		headers: { "Content-Type": "application/json" },
// 		body: JSON.stringify({ ColumnId, title, description }),
// 	})
// 		.then((response) => response.json())
// 		.then((data) => {
// 			console.log("Tarefa salva com sucesso:", data);
// 		})
// 		.catch((error) => {
// 			console.error("Erro ao salvar tarefa:", error);
// 		});
// }

// function fetchTasksByColumn(ColumnId) {
// 	const endpoint = `${API_BASE_URL}/TasksByColumnId?ColumnId=${ColumnId}`;
// 	return fetch(endpoint)
// 		.then((response) => {
// 			if (!response.ok) {
// 				throw new Error(`Erro ao buscar tasks para ColumnId ${ColumnId}: ${response.status}`);
// 			}
// 			return response.json();
// 		})
// 		.catch((error) => {
// 			console.error(error);
// 			return [];
// 		});
// }

// //adicionando as tasks/tarefas dentro das colunas e validando
// function addTasksToColumn(ColumnId, tasks) {
// 	const columnBody = document.getElementById(`tasks-${ColumnId}`);

// 	tasks.forEach((task) => {
// 		const taskItem = document.createElement("div");
// 		taskItem.className = "task-item";
// 		taskItem.innerHTML = `
//             <h6>${task.Title || "Sem título"}</h6>
//             <p>${task.Description || "Sem descrição"}</p>
//         `;
// 		columnBody.appendChild(taskItem);
// 	});
// }

// //botão para logout de usuario, que ao clicar ele remove o usuario do localStorage e retorna a pagina de login
// logoutButton.addEventListener("click", () => {
// 	localStorage.removeItem("user");
// 	window.location.href = "index.html";
// });

// //Função para salvar as colunas cadastradas
// function saveColumn(name, boardId) {
// 	const payload = {
// 		BoardId: boardId,
// 		Name: name,
// 		Position: 1,
// 		IsActive: true,
// 	};

// 	console.log("Payload enviado:", JSON.stringify(payload, null, 2)); // Log do payload

// 	return fetch(`${API_BASE_URL}/Column`, {
// 		method: "POST",
// 		headers: { "Content-Type": "application/json" },
// 		body: JSON.stringify(payload),
// 	})
// 		.then((response) => {
// 			if (!response.ok) {
// 				return response.json().then((err) => {
// 					console.error("Erro ao salvar coluna:", err);
// 					throw new Error("Erro ao salvar coluna: " + (err.Errors ? err.Errors.join(", ") : "Erro desconhecido"));
// 				});
// 			}
// 			return response.json();
// 		})
// 		.then((data) => {
// 			console.log("Coluna salva com sucesso:", data);
// 			return data;
// 		})
// 		.catch((error) => {
// 			console.error("Erro ao salvar coluna:", error);
// 		});
// }

// //Função para a criação de novas colunas
// function createNewColumn() {
// 	const columnNameInput = document.createElement("input");
// 	columnNameInput.type = "text";
// 	columnNameInput.placeholder = "Nome da nova coluna";
// 	columnNameInput.className = "form-control mb-1";

// 	const saveButton = document.createElement("button");
// 	saveButton.className = "btn btn-success btn-sm btn-save";
// 	saveButton.innerText = "Salvar";

// 	const cancelButton = document.createElement("button");
// 	cancelButton.className = "btn btn-danger btn-sm btn-cancel m-1";
// 	cancelButton.innerText = "Cancelar";

// 	const columnEditor = document.createElement("div");
// 	columnEditor.className = "column-editor";
// 	columnEditor.appendChild(columnNameInput);
// 	columnEditor.appendChild(saveButton);
// 	columnEditor.appendChild(cancelButton);

// 	boardLayout.appendChild(columnEditor);

// 	saveButton.addEventListener("click", () => {
// 		const columnName = columnNameInput.value.trim();

// 		if (columnName === "") {
// 			alert("O nome da coluna não pode estar vazio.");
// 			return;
// 		}

// 		if (!selectedBoardId) {
// 			alert("Nenhum quadro selecionado. Por favor, selecione um quadro antes de adicionar uma coluna.");
// 			return;
// 		}

// 		console.log("Nome da coluna:", columnName);

// 		saveColumn(columnName, selectedBoardId).then((newColumn) => {
// 			if (newColumn) {
// 				addColumnToLayout(newColumn);
// 				boardLayout.removeChild(columnEditor);
// 			} else {
// 				alert("Erro ao adicionar a coluna. Tente novamente.");
// 			}
// 		});
// 	});

// 	cancelButton.addEventListener("click", () => {
// 		boardLayout.removeChild(columnEditor);
// 	});
// }

// function addColumnToLayout(column) {
// 	if (!column || !column.Name || !column.Id) {
// 		console.error("Coluna inválida:", column);
// 		return;
// 	}

// 	const columnItem = document.createElement("article");
// 	columnItem.className = "column-item";

// 	const columnHeader = document.createElement("header");
// 	columnHeader.className = "column-header";

// 	const titleElement = document.createElement("h5");
// 	titleElement.innerHTML = column.Name;

// 	// Criar o ícone de lixeira
// 	const deleteIcon = document.createElement("i");
// 	deleteIcon.className = "fas fa-trash-alt";
// 	deleteIcon.style.cursor = "pointer";

// 	// Adiciona o evento de clique com confirmação
// 	deleteIcon.addEventListener("click", async () => {
// 		const userConfirmed = confirm("Você tem certeza que deseja remover esta coluna?");
// 		if (userConfirmed) {
// 			await deleteColumn(column.Id);
// 		}
// 	});

// 	columnHeader.appendChild(titleElement);
// 	columnHeader.appendChild(deleteIcon);
// 	columnItem.appendChild(columnHeader);
// 	boardLayout.appendChild(columnItem);
// }

// // Função para obter as colunas do board atual
// async function getColumnsFromCurrentBoard() {
// 	if (!selectedBoardId) return [];
// 	try {
// 		const response = await fetch(`${API_BASE_URL}/ColumnByBoardId?BoardId=${selectedBoardId}`);
// 		if (!response.ok) {
// 			throw new Error("Erro ao carregar colunas");
// 		}
// 		return await response.json();
// 	} catch (error) {
// 		console.error("Erro ao obter colunas:", error);
// 		return [];
// 	}
// }

// function populateColumns(columns) {
// 	boardLayout.innerHTML = ""; // Limpa as colunas anteriores

// 	columns.forEach((column) => {
// 		const columnItem = document.createElement("article");
// 		columnItem.className = "column-item";

// 		const columnHeader = document.createElement("header");
// 		columnHeader.className = "column-header";

// 		// Título da coluna
// 		const titleElement = document.createElement("h5");
// 		titleElement.innerHTML = column.Name;

// 		// Criar o ícone de lixeira
// 		const deleteIcon = document.createElement("i");
// 		deleteIcon.className = "fas fa-trash-alt"; // Ícone de lixeira
// 		deleteIcon.style.cursor = "pointer";

// 		// Adiciona o evento de clique com confirmação
// 		deleteIcon.addEventListener("click", async () => {
// 			const userConfirmed = confirm("Você tem certeza que deseja remover esta coluna?");
// 			if (userConfirmed) {
// 				await deleteColumn(column.Id);
// 			}
// 		});

// 		// Adiciona título e ícone de exclusão ao header da coluna
// 		columnHeader.appendChild(titleElement);
// 		columnHeader.appendChild(deleteIcon);

// 		// Contêiner de tarefas
// 		const tasksContainer = document.createElement("div");
// 		tasksContainer.className = "tasks-container";
// 		tasksContainer.id = `tasks-${column.Id}`;

// 		// Contêiner principal da coluna
// 		const columnBody = document.createElement("div");
// 		columnBody.className = "column-body";

// 		// Botão para "Nova Tarefa"
// 		const newCardButton = document.createElement("div");
// 		newCardButton.className = "task-item new-card";
// 		newCardButton.innerHTML = `
//             <button class="btn btn-light btn-block w-100 d-block"> + Nova Tarefa </button>
//         `;
// 		newCardButton.addEventListener("click", () => {
// 			createNewCard(column.Id);
// 		});

// 		// Adiciona os elementos à coluna
// 		columnBody.appendChild(tasksContainer); // Contêiner de tarefas
// 		columnBody.appendChild(newCardButton); // Botão "Nova Tarefa"
// 		columnItem.appendChild(columnHeader);
// 		columnItem.appendChild(columnBody);
// 		boardLayout.appendChild(columnItem);

// 		// Adiciona as tasks à coluna
// 		fetchTasksByColumn(column.Id).then((res) => {
// 			addTasksToColumn(column.Id, res);
// 		});
// 	});
// }

// // Função para excluir uma coluna
// async function deleteColumn(ColumnId) {
// 	try {
// 		const response = await fetch(`${API_BASE_URL}/Column?ColumnId=${ColumnId}`, {
// 			method: "DELETE",
// 		});

// 		if (!response.ok) {
// 			throw new Error("Erro ao excluir coluna");
// 		}

// 		// Remover a coluna da interface
// 		const columnItem = [...boardLayout.children].find((item) => {
// 			// Aqui, usamos o id da coluna (ColumnId) para encontrar a coluna correspondente
// 			return item.querySelector("h5") && item.querySelector("h5").innerText === ColumnId;
// 		});

// 		if (columnItem) {
// 			boardLayout.removeChild(columnItem);
// 		}

// 		console.log("Coluna excluída com sucesso");
// 	} catch (error) {
// 		console.error("Erro ao excluir coluna:", error);
// 	}
// }

// async function addColumn(ColumnName) {
// 	try {
// 		const response = await fetch(`${API_BASE_URL}/Column`, {
// 			method: "POST",
// 			body: JSON.stringify({ name: ColumnName }),
// 			headers: { "Content-Type": "application/json" },
// 		});

// 		if (!response.ok) {
// 			throw new Error("Erro ao adicionar coluna");
// 		}

// 		// Atualizar o DOM para refletir a nova coluna
// 		const newColumn = await response.json();
// 		const columnElement = document.createElement("div");
// 		columnElement.classList.add("task-column");
// 		columnElement.innerHTML = `
//             <h5>${newColumn.name}</h5>
//             <button onclick="deleteColumn(${newColumn.id})">Excluir</button>
//         `;
// 		boardLayout.appendChild(columnElement);
// 		console.log("Coluna adicionada com sucesso");
// 	} catch (error) {
// 		console.error("Erro ao adicionar coluna:", error);
// 	}
// }

// async function refreshColumns() {
// 	try {
// 		const response = await fetch(`${API_BASE_URL}/Columns`);
// 		if (!response.ok) {
// 			throw new Error("Erro ao carregar as colunas");
// 		}
// 		const columns = await response.json();
// 		boardLayout.innerHTML = ""; // Limpar as colunas atuais
// 		columns.forEach((column) => {
// 			const columnElement = document.createElement("div");
// 			columnElement.classList.add("task-column");
// 			columnElement.innerHTML = `
//                 <h5>${column.name}</h5>
//                 <button onclick="deleteColumn(${column.id})">Excluir</button>
//             `;
// 			boardLayout.appendChild(columnElement);
// 		});
// 	} catch (error) {
// 		console.error("Erro ao atualizar colunas:", error);
// 	}
// }

// // // Função para excluir uma coluna
// // async function deleteColumn(ColumnId) {
// // 	try {
// // 		const response = await fetch(`${API_BASE_URL}/Column?ColumnId=${ColumnId}`, {
// // 			method: "DELETE",
// // 		});

// // 		if (!response.ok) {
// // 			throw new Error("Erro ao excluir coluna");
// // 		}

// // 		// Remover a coluna da interface
// // 		const columnItem = [...boardLayout.children].find((item) => item.querySelector("h5").innerText === column.Id);

// // 		if (columnItem) {
// // 			boardLayout.removeChild(columnItem);
// // 		}

// // 		console.log("Coluna excluída com sucesso");
// // 	} catch (error) {
// // 		console.error("Erro ao excluir coluna:", error);
// // 	}
// // }

// function init() {
// 	loadUserName();
// 	loadBoards();
// }

// init();

import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";

const boardsList = document.getElementById("boardsList");
const userNameSpan = document.getElementById("userName");
const logoutButton = document.getElementById("logoutButton");
const boardTitle = document.getElementById("boardTitle");
const boardLayout = document.getElementById("board");
const themeToggle = document.getElementById("themeToggle");
const addColumnButton = document.getElementById("addColumnButton");

// Carrega o nome do usuário cadastrado no login, pegando do localStorage
function loadUserName() {
	const userName = getFromLocalStorage("user");
	console.log(userName);
	if (userName.name) {
		userNameSpan.textContent = `Olá, ${userName.name.split(" ")[0]}`;
	} else {
		userNameSpan.textContent = "Usuário não identificado";
	}
}

// Função para logout do usuário
logoutButton.addEventListener("click", () => {
	localStorage.removeItem("user");
	window.location.href = "index.html";
});

// Função para alternar o tema
function toggleTheme() {
	const body = document.body;
	if (body.classList.contains("dark-theme")) {
		body.classList.replace("dark-theme", "light-theme");
		localStorage.setItem("theme", "light");
		themeToggle.checked = false;
	} else {
		body.classList.replace("light-theme", "dark-theme");
		localStorage.setItem("theme", "dark");
		themeToggle.checked = true;
	}
}

// Recupera o tema salvo no localStorage
function loadTheme() {
	const savedTheme = localStorage.getItem("theme") || "light";
	document.body.classList.add(savedTheme === "dark" ? "dark-theme" : "light-theme");
	themeToggle.checked = savedTheme === "dark";
}

// Event listener para alternar o tema
themeToggle.addEventListener("change", toggleTheme);

// Inicializa o tema ao carregar a página
loadTheme();

async function loadBoards() {
	try {
		const response = await fetch(`${API_BASE_URL}/Boards`);
		if (!response.ok) {
			throw new Error("Erro ao carregar boards");
		}
		const boards = await response.json();
		populateBoardsDropdown(boards);
	} catch (error) {
		console.error("Erro ao carregar boards:", error);
	}
}

let selectedBoardId = null; // Variável global para armazenar o ID do quadro selecionado
function populateBoardsDropdown(boards) {
	boards.forEach((board) => {
		const listItem = document.createElement("li");
		listItem.innerHTML = `<a class="dropdown-item" id="dropdown-item" value="${board.Id}">${board.Name}</a>`;
		listItem.addEventListener("click", (event) => {
			boardTitle.innerHTML = event.target.innerHTML;
			selectedBoardId = board.Id; // Armazena o ID do quadro selecionado
			loadBoard(board.Id);
		});
		boardsList.appendChild(listItem);
	});
}

// Função para ler os boards por ID
async function loadBoard(id) {
	try {
		const response = await fetch(`${API_BASE_URL}/ColumnByBoardId?BoardId=${id}`);
		if (!response.ok) {
			throw new Error("Erro ao carregar colunas");
		}
		const columns = await response.json();
		populateColumns(columns);
	} catch (error) {
		console.error("Erro ao carregar colunas:", error);
	}
}

// Função para adicionar uma nova coluna
addColumnButton.addEventListener("click", () => {
	createNewColumn();
});

// Função para criar um novo card (tarefa)
function createNewCard(ColumnId) {
	const tasksContainer = document.getElementById(`tasks-${ColumnId}`);

	// Verifica se o container de tarefas foi encontrado
	if (!tasksContainer) {
		console.error(`Container de tarefas para a coluna ${ColumnId} não encontrado.`);
		return;
	}

	// Cria os campos de input para o título e descrição
	const titleInput = document.createElement("input");
	titleInput.type = "text";
	titleInput.placeholder = "Título";
	titleInput.className = "task-input form-control mb-1";

	const descriptionInput = document.createElement("input");
	descriptionInput.type = "text";
	descriptionInput.placeholder = "Descrição";
	descriptionInput.className = "task-input form-control mb-1";

	// Botão para salvar o card
	const saveButton = document.createElement("button");
	saveButton.className = "btn btn-success btn-sm btn-save";
	saveButton.innerText = "Salvar";

	// Botão para cancelar a criação do card
	const cancelButton = document.createElement("button");
	cancelButton.className = "btn btn-danger btn-sm btn-cancel m-1";
	cancelButton.innerText = "Cancelar";

	// Container para os inputs e botões
	const cardEditor = document.createElement("div");
	cardEditor.className = "card-editor";
	cardEditor.appendChild(titleInput);
	cardEditor.appendChild(descriptionInput);
	cardEditor.appendChild(saveButton);
	cardEditor.appendChild(cancelButton);

	// Adiciona o editor ao container de tarefas
	tasksContainer.appendChild(cardEditor);

	// Event listener para salvar o card
	saveButton.addEventListener("click", () => {
		const title = titleInput.value.trim();
		const description = descriptionInput.value.trim();

		if (title === "") {
			alert("O título da tarefa não pode estar vazio.");
			return;
		}

		// Cria o card
		const taskItem = document.createElement("div");
		taskItem.className = "task-item";
		taskItem.innerHTML = `
            <h6>${title}</h6>
            <p>${description}</p>
        `;

		// Adiciona o novo card ao container de tarefas
		tasksContainer.appendChild(taskItem);

		// Remove o editor de tarefas
		tasksContainer.removeChild(cardEditor);

		saveTask(ColumnId, title, description);
	});

	// Event listener para cancelar
	cancelButton.addEventListener("click", () => {
		tasksContainer.removeChild(cardEditor);
	});
}

// Função para salvar a tarefa no backend
function saveTask(ColumnId, title, description) {
	// Lógica para salvar a tarefa no backend
	fetch(`${API_BASE_URL}/Task`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ColumnId, title, description }),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Tarefa salva com sucesso:", data);
		})
		.catch((error) => {
			console.error("Erro ao salvar tarefa:", error);
		});
}

// Função para buscar as tarefas de uma coluna
function fetchTasksByColumn(ColumnId) {
	const endpoint = `${API_BASE_URL}/TasksByColumnId?ColumnId=${ColumnId}`;
	return fetch(endpoint)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Erro ao buscar tasks para ColumnId ${ColumnId}: ${response.status}`);
			}
			return response.json();
		})
		.catch((error) => {
			console.error(error);
			return [];
		});
}

// Função para adicionar as tarefas dentro das colunas e validando
function addTasksToColumn(ColumnId, tasks) {
	const columnBody = document.getElementById(`tasks-${ColumnId}`);

	tasks.forEach((task) => {
		const taskItem = document.createElement("div");
		taskItem.className = "task-item";
		taskItem.innerHTML = `
            <h6>${task.Title || "Sem título"}</h6>
            <p>${task.Description || "Sem descrição"}</p>
        `;
		columnBody.appendChild(taskItem);
	});
}

// Função para salvar as colunas cadastradas
function saveColumn(name, boardId) {
	const payload = {
		BoardId: boardId,
		Name: name,
		Position: 1,
		IsActive: true,
	};

	console.log("Payload enviado:", JSON.stringify(payload, null, 2));

	return fetch(`${API_BASE_URL}/Column`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	})
		.then((response) => {
			if (!response.ok) {
				return response.json().then((err) => {
					console.error("Erro ao salvar coluna:", err);
					throw new Error("Erro ao salvar coluna: " + (err.Errors ? err.Errors.join(", ") : "Erro desconhecido"));
				});
			}
			return response.json();
		})
		.then((data) => {
			console.log("Coluna salva com sucesso:", data);
			return data;
		})
		.catch((error) => {
			console.error("Erro ao salvar coluna:", error);
		});
}

// Função para criar novas colunas
function createNewColumn() {
	const columnNameInput = document.createElement("input");
	columnNameInput.type = "text";
	columnNameInput.placeholder = "Nome da nova coluna";
	columnNameInput.className = "form-control mb-1";

	const saveButton = document.createElement("button");
	saveButton.className = "btn btn-success btn-sm btn-save";
	saveButton.innerText = "Salvar";

	const cancelButton = document.createElement("button");
	cancelButton.className = "btn btn-danger btn-sm btn-cancel m-1";
	cancelButton.innerText = "Cancelar";

	const columnEditor = document.createElement("div");
	columnEditor.className = "column-editor";
	columnEditor.appendChild(columnNameInput);
	columnEditor.appendChild(saveButton);
	columnEditor.appendChild(cancelButton);

	boardLayout.appendChild(columnEditor);

	saveButton.addEventListener("click", () => {
		const columnName = columnNameInput.value.trim();

		if (columnName === "") {
			alert("O nome da coluna não pode estar vazio.");
			return;
		}

		saveColumn(columnName, selectedBoardId).then((data) => {
			console.log("Coluna salva:", data);
			loadBoard(selectedBoardId); // Recarrega as colunas do board
		});

		boardLayout.removeChild(columnEditor);
	});

	cancelButton.addEventListener("click", () => {
		boardLayout.removeChild(columnEditor);
	});
}

// Função para deletar uma coluna
function removerColuna(ColumnId) {
	if (confirm("Você tem certeza que deseja excluir esta coluna?")) {
		// Substitua {ColumnId} pelo valor real do ColumnId
		const url = `${API_BASE_URL}/Column?ColumnId=${ColumnId}`;

		fetch(url, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Erro ao excluir a coluna");
				}
				const columnItem = document.getElementById(`column-${ColumnId}`);
				if (columnItem) {
					columnItem.remove();
				}
				alert("Coluna excluída com sucesso!");
			})
			.catch((error) => {
				console.error("Erro ao excluir a coluna:", error);
				alert("Ocorreu um erro ao tentar excluir a coluna.");
			});
	}
}

// Modificando a função populateColumns para garantir que o evento de remoção funcione
function populateColumns(columns) {
	boardLayout.innerHTML = "";
	columns.forEach((column) => {
		const columnItem = document.createElement("div");
		columnItem.className = "column-item";
		columnItem.id = `column-${column.Id}`; // Atribuindo um id único à coluna para remoção
		columnItem.innerHTML = `
            <h5 class="column-title">${column.Name}</h5>
            <div class="tasks" id="tasks-${column.Id}"></div>
        `;

		const deleteIcon = document.createElement("i");
		deleteIcon.className = "fa fa-trash-alt delete-column";
		deleteIcon.addEventListener("click", () => {
			removerColuna(column.Id); // Chama a função para remover a coluna
		});

		columnItem.querySelector(".column-title").appendChild(deleteIcon);

		boardLayout.appendChild(columnItem);

		// Carregar tarefas da coluna
		fetchTasksByColumn(column.Id)
			.then((tasks) => {
				addTasksToColumn(column.Id, tasks);
			})
			.catch((error) => {
				console.error(`Erro ao carregar tarefas da coluna ${column.Id}:`, error);
			});
	});
}

loadUserName();
loadBoards();
