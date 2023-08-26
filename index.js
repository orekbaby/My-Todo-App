const newTodo = document.getElementById("new-todo");
const listContainer = document.getElementById("todoList");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompleted");
const itemsLeftElement = document.getElementById("itemsLeft");

function addTask() {
  if (newTodo.value === "") {
    alert("You must write something");
  } else {
    let li = document.createElement("li");
    li.innerHTML = newTodo.value;
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    span.classList.add("delete-btn"); // Add a class to identify delete buttons
    li.appendChild(span);
    li.draggable = true; // Make the todo item draggable
  }
  newTodo.value = "";
  saveData();
  updateItemsLeftCount(); // Update the number of items left when adding a new todo
}

listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveData();
      updateItemsLeftCount(); // Update the number of items left when toggling todo completeness
    } else if (e.target.classList.contains("delete-btn")) {
      e.target.parentElement.remove();
      saveData();
      updateItemsLeftCount(); // Update the number of items left after deleting a todo
    }
  },
  false
);
clearCompletedBtn.addEventListener("click", () => {
     saveData();
  clearCompletedTodos();
      updateItemsLeftCount(); // Update the number of items left after deleting a todo

});
function clearCompletedTodos() {
  const completedTodos = listContainer.getElementsByClassName("checked");
  while (completedTodos.length > 0) {
    completedTodos[0].remove();
  }
  saveData();
  updateItemsLeftCount(); // Update the number of items left after clearing completed todos
}

// Function to dynamically display the number of items left
function updateItemsLeftCount() {
  const totalTodos = listContainer.getElementsByTagName("li").length;
  const completedTodos = listContainer.getElementsByClassName("checked").length;
  const itemsLeft = totalTodos - completedTodos;
  itemsLeftElement.textContent = `${itemsLeft} item${
    itemsLeft !== 1 ? "s" : ""
  } left`;
    saveData();
}

// Function to set up drag and drop functionality
function setupDragAndDrop() {
  listContainer.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.target.classList.add("dragging");
  });

  listContainer.addEventListener("dragend", (event) => {
    event.target.classList.remove("dragging");
    saveData();
  });

  listContainer.addEventListener("dragover", (event) => {
    event.preventDefault();
    const draggedItem = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(listContainer, event.clientY);

    if (afterElement === null) {
      listContainer.appendChild(draggedItem);
    } else {
      listContainer.insertBefore(draggedItem, afterElement);
    }
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll("li:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function setFilterButtons() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterType = button.getAttribute("data-filter");
      filterTodos(filterType);
      updateItemsLeftCount(); // Update the number of items left when applying a filter

      // Apply active class to the selected filter button
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");
    });
  });
}

// Function to filter todos based on the selected filter
function filterTodos(filterType) {
  const todoItems = listContainer.getElementsByTagName("li");

  for (const todoItem of todoItems) {
    switch (filterType) {
      case "all":
        todoItem.style.display = "flex";
        break;
      case "completed":
        const isCompleted = todoItem.classList.contains("checked");
        todoItem.style.display = isCompleted ? "flex" : "none";
        break;
      case "active":
        const isActive = !todoItem.classList.contains("checked");
        todoItem.style.display = isActive ? "flex" : "none";
        break;
    }
  }
}

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
  listContainer.innerHTML = localStorage.getItem("data");
}

// Call the necessary functions after the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setupDragAndDrop();
  setFilterButtons();
  showTask();
  updateItemsLeftCount();
clearCompletedTodos();
});

// Event listener for the "Add" button
document.getElementById("addBtn").addEventListener("click", addTask);
