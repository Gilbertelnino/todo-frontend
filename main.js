const API_BASE = "https://todo-backend-6inq.onrender.com";
const todoList = document.getElementById("todo-list");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoDesc = document.getElementById("todo-desc");

// Fetch and render todos
async function fetchTodos() {
  try {
    const res = await fetch(`${API_BASE}/todos`);
    const todos = await res.json();
    renderTodos(todos);
  } catch (err) {
    console.error("Error fetching todos", err);
  }
}

function renderTodos(todos) {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    const titleEl = document.createElement("div");
    titleEl.textContent = todo.title;
    titleEl.className = "todo-title";

    const descEl = document.createElement("div");
    descEl.textContent = todo.description || "";
    descEl.className = "todo-desc";

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.type = "button";
    editBtn.addEventListener("click", () => openEditForm(li, todo));

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.type = "button";
    delBtn.addEventListener("click", () => deleteTodo(todo.id));

    actions.append(editBtn, delBtn);
    li.append(titleEl, descEl, actions);
    todoList.append(li);
  });
}

async function addTodo(title, description) {
  try {
    const res = await fetch(`${API_BASE}/todo/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    if (res.ok) await fetchTodos();
  } catch (err) {
    console.error("Error adding todo", err);
  }
}

async function updateTodo(id, data) {
  try {
    const res = await fetch(`${API_BASE}/todo/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchTodos();
      return true;
    }
  } catch (err) {
    console.error("Error updating todo", err);
  }
  return false;
}

async function deleteTodo(id) {
  try {
    await fetch(`${API_BASE}/todo/delete/${id}`, { method: "DELETE" });
    await fetchTodos();
  } catch (err) {
    console.error("Error deleting todo", err);
  }
}

function openEditForm(li, todo) {
  li.innerHTML = "";
  const form = document.createElement("div");
  form.className = "edit-form";

  const titleInput = document.createElement("input");
  titleInput.value = todo.title;
  titleInput.placeholder = "Todo title";

  const descInput = document.createElement("textarea");
  descInput.rows = 2;
  descInput.value = todo.description || "";
  descInput.placeholder = "Description";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.type = "button";
  saveBtn.addEventListener("click", async () => {
    const updatedTitle = titleInput.value.trim();
    const updatedDesc = descInput.value.trim();
    if (updatedTitle) {
      await updateTodo(todo.id, {
        title: updatedTitle,
        description: updatedDesc,
      });
      // form closes and UI updates via fetchTodos()
    }
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.type = "button";
  cancelBtn.addEventListener("click", fetchTodos);

  form.append(titleInput, descInput, saveBtn, cancelBtn);
  li.append(form);
}

todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = todoInput.value.trim();
  const description = todoDesc.value.trim();
  if (title) {
    await addTodo(title, description);
    todoInput.value = "";
    todoDesc.value = "";
  }
});

// Initial load
fetchTodos();
