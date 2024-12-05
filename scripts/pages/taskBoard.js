import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";

const boardsList = document.getElementById("boardsList");
const userNameSpan = document.getElementById("userName");
const logoutButton = document.getElementById("logoutButton");
const boardTitle = document.getElementById("boardTitle");
const boardLayout = document.getElementById("board");
const themeToggle = document.getElementById("themeToggle");
const addColumnButton = document.getElementById("addColumnButton");
const addBoardButton = document.getElementById("addBoardButton");

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

function populateColumns(columns) {
	boardLayout.innerHTML = ""; // Limpa o layout do quadro

	columns.forEach((column) => {
		// Cria a estrutura da coluna
		const columnItem = document.createElement("article");
		columnItem.className = "column-item";
		columnItem.id = `column-${column.Id}`; // ID único para remoção

		// Cabeçalho da coluna
		const columnHeader = document.createElement("header");
		columnHeader.className = "column-header";

		// Título da coluna
		const columnTitle = document.createElement("h5");
		columnTitle.textContent = column.Name;

		// Ícone de exclusão da coluna
		const deleteIcon = document.createElement("i");
		deleteIcon.className = "fa fa-trash-alt delete-column";
		deleteIcon.addEventListener("click", () => {
			removerColuna(column.Id);
		});

		// Adiciona título e ícone ao cabeçalho
		columnTitle.appendChild(deleteIcon);
		columnHeader.appendChild(columnTitle);

		// Container das tarefas
		const tasksContainer = document.createElement("div");
		tasksContainer.className = "tasks-container";
		tasksContainer.id = `tasks-${column.Id}`;

		// Botão "Adicionar Tarefa"
		const newCardButton = document.createElement("div");
		newCardButton.className = "task-item new-card";
		newCardButton.innerHTML = `
            <button class="btn btn-light btn-block w-100 d-block"> + Adicionar Tarefa </button>
        `;
		newCardButton.addEventListener("click", () => {
			createNewCard(column.Id);
		});

		// Corpo da coluna
		const columnBody = document.createElement("div");
		columnBody.className = "column-body";
		columnBody.appendChild(tasksContainer);

		// Adiciona o botão de tarefas ao corpo da coluna
		columnBody.appendChild(newCardButton);

		// Junta cabeçalho e corpo na coluna principal
		columnItem.appendChild(columnHeader);
		columnItem.appendChild(columnBody);

		// Adiciona a coluna ao layout
		boardLayout.appendChild(columnItem);

		// Busca e adiciona tarefas existentes
		fetchTasksByColumn(column.Id)
			.then((tasks) => {
				if (tasks && tasks.length > 0) {
					addTasksToColumn(column.Id, tasks);
				} else {
					// Se não houver tarefas, move o botão para cima
					tasksContainer.appendChild(newCardButton);
				}
			})
			.catch((error) => {
				console.error(`Erro ao carregar tarefas da coluna ${column.Id}:`, error);
			});
	});
}

function createNewCard(columnId) {
	const tasksContainer = document.getElementById(`tasks-${columnId}`);
	console.log(columnId);

	if (!tasksContainer) {
		console.error(`Container de tarefas para a coluna ${columnId} não encontrado.`);
		return;
	}

	// Inputs de título e descrição
	const titleInput = document.createElement("input");
	titleInput.type = "text";
	titleInput.placeholder = "Título";
	titleInput.className = "task-input form-control mb-1";

	const descriptionInput = document.createElement("input");
	descriptionInput.type = "text";
	descriptionInput.placeholder = "Descrição";
	descriptionInput.className = "task-input form-control mb-1";

	// Botões
	const saveButton = document.createElement("button");
	saveButton.className = "btn btn-success btn-sm btn-save";
	saveButton.innerText = "Salvar";

	const cancelButton = document.createElement("button");
	cancelButton.className = "btn btn-danger btn-sm btn-cancel m-1";
	cancelButton.innerText = "Cancelar";

	// Editor de tarefa
	const cardEditor = document.createElement("div");
	cardEditor.className = "card-editor";
	cardEditor.appendChild(titleInput);
	cardEditor.appendChild(descriptionInput);
	cardEditor.appendChild(saveButton);
	cardEditor.appendChild(cancelButton);

	tasksContainer.appendChild(cardEditor);

	// Salvar a nova tarefa
	saveButton.addEventListener("click", () => {
		const title = titleInput.value.trim();
		const description = descriptionInput.value.trim();

		if (title === "") {
			alert("O título da tarefa não pode estar vazio.");
			return;
		}

		const taskItem = document.createElement("div");
		taskItem.className = "task-item";
		taskItem.innerHTML = `
            <h6>${title}</h6>
            <p>${description}</p>
        `;
		tasksContainer.insertBefore(taskItem, tasksContainer.querySelector(".new-card"));

		// Remove o editor
		tasksContainer.removeChild(cardEditor);

		// Salvar no backend
		saveTask(columnId, title, description);
	});

	// Cancelar
	cancelButton.addEventListener("click", () => {
		tasksContainer.removeChild(cardEditor);
	});
}

function saveTask(columnId, title, description) {
	// Salva a tarefa no backend
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

// Adiciona o evento de clique no botão de adicionar quadro
document.getElementById("addBoardButton").addEventListener("click", () => {
	console.log("Botão de adicionar quadro clicado");
	createNewBoard();
});

// Função para criar um novo quadro
function createNewBoard() {
	const boardContainer = document.getElementById("boardContainer");

	if (!boardContainer) {
		console.error("Elemento 'boardContainer' não encontrado!");
		return;
	}

	const boardNameInput = document.createElement("input");
	boardNameInput.type = "text";
	boardNameInput.placeholder = "Nome do novo quadro";
	boardNameInput.className = "form-control mb-1";

	const saveButton = document.createElement("button");
	saveButton.className = "btn btn-success btn-sm btn-save";
	saveButton.innerText = "Salvar";

	const cancelButton = document.createElement("button");
	cancelButton.className = "btn btn-danger btn-sm btn-cancel m-1";
	cancelButton.innerText = "Cancelar";

	const boardEditor = document.createElement("div");
	boardEditor.className = "board-editor";
	boardEditor.appendChild(boardNameInput);
	boardEditor.appendChild(saveButton);
	boardEditor.appendChild(cancelButton);

	// Adiciona o editor no boardContainer
	boardContainer.appendChild(boardEditor);

	// Salva o novo quadro
	saveButton.addEventListener("click", () => {
		const boardName = boardNameInput.value.trim();

		if (boardName === "") {
			alert("O nome do quadro não pode estar vazio.");
			return;
		}

		saveBoard(boardName).then(() => {
			loadBoards(); // Atualiza a lista de quadros após adicionar o novo quadro
			boardContainer.removeChild(boardEditor); // Remove o editor após salvar
		});
	});

	// Cancela a criação do quadro
	cancelButton.addEventListener("click", () => {
		boardContainer.removeChild(boardEditor);
	});
}

// Função para salvar o novo quadro no backend
function saveBoard(boardName) {
	const payload = {
		Name: boardName,
		IsActive: true,
		CreatedBy: 5,
	};

	console.log("Payload sendo enviado:", payload); // Para verificar antes de enviar

	return fetch(`${API_BASE_URL}/Board`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	})
		.then((response) => {
			if (!response.ok) {
				return response.json().then((errorData) => {
					console.error("Erro ao salvar o quadro:", errorData);
					throw new Error("Erro ao salvar o quadro.");
				});
			}
			return response.json();
		})
		.then((data) => {
			console.log("Quadro salvo com sucesso:", data);
			return data;
		})
		.catch((error) => {
			console.error("Erro ao salvar o quadro:", error);
		});
}

function init() {
	loadUserName();
	loadBoards();

	loadTheme();
}

init();
