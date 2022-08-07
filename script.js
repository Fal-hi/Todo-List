let todoItems = [];

function renderTodo(todo) {
  localStorage.setItem("todoItemsRef", JSON.stringify(todoItems));
  const list = document.querySelector(".js-todo-list");
  // ? Select the current todo item in the DOM
  const item = document.querySelector(`[data-key='${todo.id}']`);

  if (todo.deleted) {
    item.remove();
    // ? Add this line to clear whitespace from the list container when "todoItems" is empty
    if (todoItems.length === 0) {
      list.innerHTML = "";
    }
    return;
  }

  const isChecked = todo.checked ? "done" : "";
  const node = document.createElement("li");
  node.setAttribute("class", `todo-item ${isChecked}`);
  node.setAttribute("data-key", todo.id);

  node.innerHTML = `
    <input id="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
        <svg><use href="#delete-icon"></use></svg>
    </button>
  `;

  // ? If the item already exists in the DOM
  if (item) {
    // ? Replace the oldChild to the newChild
    // replaceChild(newChild, oldChild);
    list.replaceChild(node, item);
    // ? otherwise append it to the end of the list
  } else {
    list.append(node);
  }
}

function addTodo(text) {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };

  // ? Masukkan todo ke todoItems
  todoItems.push(todo);
  // ? Buat todo-list
  renderTodo(todo);
}

function toggleDone(key) {
  // ? findIndex() = temukan index di dalam array
  const index = todoItems.findIndex((item) => item.id === Number(key));

  todoItems[index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]);
}

function deleteTodo(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  const todo = {
    deleted: true,
    ...todoItems[index],
  };
  // ? Remove the todo item from the array by filtering it out
  todoItems = todoItems.filter((item) => item.id !== Number(key));
  renderTodo(todo);
}

const form = document.querySelector(".js-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector(".js-todo-input");

  // ? Get the value of the input and remove whitespace
  const text = input.value.trim();
  if (text !== "") {
    addTodo(text);
    input.value = "";
    input.focus();
  }
});

const list = document.querySelector(".js-todo-list");
list.addEventListener("click", (event) => {
  // ? contains artinya mengandung
  if (event.target.classList.contains("js-tick")) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  // ? Add this "if" block
  if (event.target.classList.contains("js-delete-todo")) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const ref = localStorage.getItem("todoItemsRef");
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach((t) => {
      renderTodo(t);
    });
  }
});
