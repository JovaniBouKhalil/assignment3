// Get the elements from the page
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskFeedback = document.querySelector("#task-feedback");
const taskList = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");

const savedList = load();
let tasks = savedList.tasks;
let nextTaskId = savedList.nextTaskId;

// Save the counter too so new tasks keep getting different ids after a reload
function save() {
    const data = { tasks: tasks, nextTaskId: nextTaskId };
    const json = JSON.stringify(data);
    localStorage.setItem("todo-list", json);
}

// Read the saved list, or start empty on the first visit
function load() {
    const raw = localStorage.getItem("todo-list");
    return JSON.parse(raw) || { tasks: [], nextTaskId: 1 };
}

// Display the tasks from the array
function renderTasks() {
    // Clear the old list so tasks dont appear twice
    taskList.textContent = "";

    if (tasks.length > 0) {
        emptyMessage.classList.add("hidden");
    } else {
        emptyMessage.classList.remove("hidden");
    }

    // Build one row with its text and buttons for each task
    tasks.forEach(function (task) {
        const item = document.createElement("li");
        item.classList.add("task");
        item.dataset.id = task.id;

        if (task.done) {
            item.classList.add("done");
        }

        const text = document.createElement("span");
        text.classList.add("task-text");
        text.textContent = task.text;

        const completeButton = document.createElement("button");
        completeButton.classList.add("complete");
        if (task.done) {
            completeButton.textContent = "Undo";
        } else {
            completeButton.textContent = "Done";
        }

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.textContent = "Delete";

        item.append(text);
        item.append(completeButton);
        item.append(deleteButton);
        taskList.append(item);
    });
}

// Check the input and add a new task
function addTask(event) {
    event.preventDefault(); // Stop the page from reloading

    const text = taskInput.value.trim();

    // Reject empty input or just spaces
    if (text === "") {
        taskFeedback.textContent = "Please enter a task.";
        taskInput.setAttribute("aria-invalid", "true");
        return;
    }

    const task = {
        id: `${nextTaskId}`, // dataset stores strings, so use a string id too
        text: text,
        done: false
    };

    tasks[tasks.length] = task;
    nextTaskId = nextTaskId + 1;

    save();
    renderTasks();

    // Reset the input after adding a task
    taskInput.value = "";
    taskFeedback.textContent = "";
    taskInput.setAttribute("aria-invalid", "false");
}

// Switch a task between done and not done
function toggleTask(id) {
    // Find the matching task by id
    tasks.forEach(function (task) {
        if (task.id === id) {
            task.done = !task.done;
        }
    });
    save();
    renderTasks();
}

// Remove a task and update the saved list
function deleteTask(id) {
    // Keep every task except the one with this id
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });
    save();
    renderTasks();
}

// One listener on the list handles buttons in all the task rows
taskList.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) {
        return;
    }

    const item = button.closest("li");
    if (button.classList.contains("delete")) {
        deleteTask(item.dataset.id);
    } else if (button.classList.contains("complete")) {
        toggleTask(item.dataset.id);
    }
});

// Works with the button and the Enter key
taskForm.addEventListener("submit", addTask);

renderTasks();
