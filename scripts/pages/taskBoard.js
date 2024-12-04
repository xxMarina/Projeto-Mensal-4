import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";

const boardsList = document.getElementById("boardsList");
const userNameSpan = document.getElementById("userName");
const logoutButton = document.getElementById("logoutButton");
const boardTitle = document.getElementById("boardTitle");
const boardLayout = document.getElementById("board");

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

function populateColumns(columns) {
	boardLayout.innerHTML = "";

	columns.forEach((column) => {
		const columnItem = document.createElement("article");
		columnItem.className = "column-item";

		const columnHeader = document.createElement("header");
		columnHeader.className = "column-header";
		columnHeader.innerHTML = `<h5>${column.Name}</h5>`;

		// Contêiner para as tarefas
		const tasksContainer = document.createElement("div");
		tasksContainer.className = "tasks-container";
		tasksContainer.id = `tasks-${column.Id}`;

		// Contêiner principal da coluna
		const columnBody = document.createElement("div");
		columnBody.className = "column-body";

		// Botão "Novo Card"
		const newCardButton = document.createElement("div");
		newCardButton.className = "task-item new-card";
		newCardButton.innerHTML = `
            <button class="btn btn-light btn-block w-100 d-block"> + Nova Tarefa </button>
        `;
		newCardButton.addEventListener("click", () => {
			createNewCard(column.Id);
		});

		// Adiciona os elementos à coluna
		columnBody.appendChild(tasksContainer); // Contêiner de tarefas
		columnBody.appendChild(newCardButton); // Botão "Novo Card"
		columnItem.appendChild(columnHeader);
		columnItem.appendChild(columnBody);
		boardLayout.appendChild(columnItem);

		// Adiciona tasks à coluna
		fetchTasksByColumn(column.Id).then((res) => {
			addTasksToColumn(column.Id, res);
		});
	});
}

function createNewCard(columnId) {
	const tasksContainer = document.getElementById(`tasks-${columnId}`);

	// Verifica se o container de tarefas foi encontrado
	if (!tasksContainer) {
		console.error(`Container de tarefas para a coluna ${columnId} não encontrado.`);
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
	saveButton.className = "btn btn-success  btn-sm btn-save";
	saveButton.innerText = "Salvar";

	// Botão para cancelar a criação do card
	const cancelButton = document.createElement("button");
	cancelButton.className = "btn btn-danger  btn-sm  btn-cancel m-1";
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

		// Aqui você pode incluir uma lógica para salvar a tarefa no backend
		saveTask(columnId, title, description);
	});

	// Event listener para cancelar
	cancelButton.addEventListener("click", () => {
		tasksContainer.removeChild(cardEditor);
	});
}

function saveTask(columnId, title, description) {
	// Lógica para salvar a tarefa no backend (exemplo)
	fetch(`${API_BASE_URL}/Task`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ columnId, title, description }),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Tarefa salva com sucesso:", data);
		})
		.catch((error) => {
			console.error("Erro ao salvar tarefa:", error);
		});
}

function fetchTasksByColumn(columnId) {
	const endpoint = `${API_BASE_URL}/TasksByColumnId?ColumnId=${columnId}`;
	return fetch(endpoint)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Erro ao buscar tasks para ColumnId ${columnId}: ${response.status}`);
			}
			return response.json();
		})
		.catch((error) => {
			console.error(error);
			return [];
		});
}

function addTasksToColumn(columnId, tasks) {
	const columnBody = document.getElementById(`tasks-${columnId}`);

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

function loadUserName() {
	const userName = getFromLocalStorage("user");
	console.log(userName);
	if (userName.name) {
		userNameSpan.textContent = `Olá, ${userName.name.split(" ")[0]}`;
	} else {
		userNameSpan.textContent = "Usuário não identificado";
	}
}

logoutButton.addEventListener("click", () => {
	localStorage.removeItem("user");
	window.location.href = "index.html";
});

//add funcao para colunas
const addColumnButton = document.getElementById("addColumnButton");

addColumnButton.addEventListener("click", () => {
	createNewColumn();
});

// function saveColumn(name, boardId) {
// 	const payload = {
// 		BoardId: boardId, // O ID do quadro
// 		Name: name, // O nome da coluna
// 		Position: 0, // A posição da coluna (ajuste conforme necessário)
// 		IsActive: true, // Defina como true ou false conforme necessário
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
// 					throw new Error("Erro ao salvar coluna: " + JSON.stringify(err));
// 				});
// 			}
// 			return response.json();
// 		})
// 		.catch((error) => {
// 			console.error("Erro ao salvar coluna:", error);
// 		});
// }
function saveColumn(name, boardId) {
	const payload = {
		BoardId: boardId, // O ID do quadro
		Name: name, // O nome da coluna
		Position: 1, // A posição da coluna (ajuste conforme necessário)
		IsActive: true, // Defina como true ou false conforme necessário
	};

	console.log("Payload enviado:", JSON.stringify(payload, null, 2)); // Log do payload

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
			return data; // Retorna os dados da nova coluna
		})
		.catch((error) => {
			console.error("Erro ao salvar coluna:", error);
		});
}

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

		if (!selectedBoardId) {
			alert("Nenhum quadro selecionado. Por favor, selecione um quadro antes de adicionar uma coluna.");
			return;
		}

		console.log("Nome da coluna:", columnName); // Log do nome da coluna

		saveColumn(columnName, selectedBoardId).then((newColumn) => {
			if (newColumn) {
				addColumnToLayout(newColumn);
				boardLayout.removeChild(columnEditor);
			} else {
				alert("Erro ao adicionar a coluna. Tente novamente.");
			}
		});
	});

	cancelButton.addEventListener("click", () => {
		boardLayout.removeChild(columnEditor);
	});
}

function addColumnToLayout(column) {
	if (!column || !column.Name || !column.Id) {
		console.error("Coluna inválida:", column);
		return; // Não prosseguir se a coluna não for válida
	}

	const columnItem = document.createElement("article");
	columnItem.className = "column-item";

	const columnHeader = document.createElement("header");
	columnHeader.className = "column-header";
	columnHeader.innerHTML = `<h5>${column.Name}</h5>`;

	// Contêiner para as tarefas
	const tasksContainer = document.createElement("div");
	tasksContainer.className = "tasks-container";
	tasksContainer.id = `tasks-${column.Id}`;

	// Contêiner principal da coluna
	const columnBody = document.createElement("div");
	columnBody.className = "column-body";
	columnBody.appendChild(columnHeader);
	columnBody.appendChild(tasksContainer);

	columnItem.appendChild(columnBody);
	boardLayout.appendChild(columnItem);
}

// function createNewColumn() {
// 	// Cria um campo de input para o nome da nova coluna
// 	const columnNameInput = document.createElement("input");
// 	columnNameInput.type = "text";
// 	columnNameInput.placeholder = "Nome da nova coluna";
// 	columnNameInput.className = "form-control mb-1";

// 	// Botão para salvar a nova coluna
// 	const saveButton = document.createElement("button");
// 	saveButton.className = "btn btn-success btn-sm btn-save";
// 	saveButton.innerText = "Salvar";

// 	// Botão para cancelar a criação da coluna
// 	const cancelButton = document.createElement("button");
// 	cancelButton.className = "btn btn-danger btn-sm btn-cancel m-1";
// 	cancelButton.innerText = "Cancelar";

// 	// Container para os inputs e botões
// 	const columnEditor = document.createElement("div");
// 	columnEditor.className = "column-editor";
// 	columnEditor.appendChild(columnNameInput);
// 	columnEditor.appendChild(saveButton);
// 	columnEditor.appendChild(cancelButton);

// 	// Ad iciona o editor ao layout do quadro
// 	boardLayout.appendChild(columnEditor);

// 	// Event listener para salvar a nova coluna
// 	saveButton.addEventListener("click", () => {
// 		const columnName = columnNameInput.value.trim();

// 		if (columnName === "") {
// 			alert("O nome da coluna não pode estar vazio.");
// 			return;
// 		}

// 		// Salva a nova coluna no backend
// 		saveColumn(columnName).then((newColumn) => {
// 			if (newColumn) {
// 				// Adiciona a nova coluna ao layout
// 				addColumnToLayout(newColumn);
// 				// Remove o editor de coluna
// 				boardLayout.removeChild(columnEditor);
// 			} else {
// 				alert("Erro ao adicionar a coluna. Tente novamente.");
// 			}
// 		});
// 	});

// 	// Event listener para cancelar
// 	cancelButton.addEventListener("click", () => {
// 		boardLayout.removeChild(columnEditor);
// 	});
// }

// function addColumnToLayout(column) {
// 	if (!column || !column.Name || !column.Id) {
// 		console.error("Coluna inválida:", column);
// 		return; // Não prosseguir se a coluna não for válida
// 	}

// 	const columnItem = document.createElement("article");
// 	columnItem.className = "column-item";

// 	const columnHeader = document.createElement("header");
// 	columnHeader.className = "column-header";
// 	columnHeader.innerHTML = `<h5>${column.Name}</h5>`;

// 	// Contêiner para as tarefas
// 	const tasksContainer = document.createElement("div");
// 	tasksContainer.className = "tasks-container";
// 	tasksContainer.id = `tasks-${column.Id}`;

// 	// Contêiner principal da coluna
// 	const columnBody = document.createElement("div");
// 	columnBody.className = "column-body";

// 	// Botão "Novo Card"
// 	const newCardButton = document.createElement("div");
// 	newCardButton.className = "task-item new-card";
// 	newCardButton.innerHTML = `
//         <button class="btn btn-light btn-block w-100 d-block"> + Nova Tarefa </button>
//     `;
// 	newCardButton.addEventListener("click", () => {
// 		createNewCard(column.Id);
// 	});

// 	// Adiciona os elementos à coluna
// 	columnBody.appendChild(tasksContainer); // Contêiner de tarefas
// 	columnBody.appendChild(newCardButton); // Botão "Novo Card"
// 	columnItem.appendChild(columnHeader);
// 	columnItem.appendChild(columnBody);
// 	boardLayout.appendChild(columnItem);
// }

function init() {
	loadUserName();
	loadBoards();
}

init();
