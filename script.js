const themeToggle = document.getElementById("theme-toggle");
const dialogTask = document.querySelector("#task_dialog");
let tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const category = document.querySelector("#category");
const status = document.querySelector("#status");
const formTask = document.querySelector(".form_task");
const todoTask = document.querySelector("#todo_task");
const inprogressTask = document.querySelector("#in_progress_task");
const doneTask = document.querySelector("#done_task");
let taskActive = null;
let errors = [];
const searchTask = document.querySelector("#search_task");
const searchCategory = document.querySelector("#search_category");
let draggedTaskId = null;
function renderactive(value) {
    if (value === "work") {
        return "Công việc";
    } else if (value === "personal") {
        return "Cá nhân";
    } else if (value === "urgent") {
        return "Khân cấp";
    } else if (value === "other") {
        return "Khác";
    }
}
function validateTask() {
    errors = [];
    document.querySelector("#title_error").innerHTML = "";
    document.querySelector("#category_error").innerHTML = "";
    if (!title.value) {
        document.querySelector("#title_error").innerHTML = "Vui lòng nhập tiêu đề task";
        errors.push("title");
    }
    if (!category.value) {
        document.querySelector("#category_error").innerHTML = "Vui lòng chọn danh mục";
        errors.push("category");
    }
}
function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}
function dragstart(event) {
    // Lấy id của task đang được kéo từ thuộc tính data-task-id
    draggedTaskId = event.target.id;

    // Thêm class "dragging" để có thể thay đổi style (ví dụ: mờ, đổi màu khi kéo)
    event.target.classList.add("dragging");
    
}
function dragend(event) {
    // Xóa class để task trở lại trạng thái bình thường
    event.target.classList.remove("dragging");
}

function dropTask(event) {

    // Ngăn hành vi mặc định của browser
    event.preventDefault();

    // Lấy trạng thái mới từ cột mà task vừa được thả vào (ví dụ: "todo", "in-progress", "done")

    const newStatus = event.currentTarget.dataset.status;
    event.target.classList.remove("dragover");
    // Nếu đang có task được kéo (draggedTaskId != null)
    if (draggedTaskId !== null) {
        // Cập nhật trạng thái của task trong dữ liệu
        indexTask = tasks.findIndex((task) => task.id == draggedTaskId);
        console.log(draggedTaskId);

        tasks[indexTask].status = newStatus;

        // Lưu dữ liệu mới vào localStorage để không bị mất khi reload
        localStorage.setItem("tasks", JSON.stringify(tasks));
        // Render lại danh sách task theo trạng thái mới
        renderTasks();
    }

    // Reset draggedTaskId để kết thúc thao tác kéo-thả
    draggedTaskId = null;
}
function renderTasks() {
    todoTask.innerHTML = "";
    inprogressTask.innerHTML = "";
    doneTask.innerHTML = "";
    let count_todo = 0;
    let count_inprogress = 0;
    let count_done = 0;
    const newTasks = tasks.filter(
        (task) =>
            task.title.toLowerCase().includes(searchTask.value.toLowerCase()) &&
            (searchCategory.value === "none" ? true : task.category === searchCategory.value)
    );
    newTasks.forEach((element) => {
        const htmlTask = `<div id="${element.id}" class="card__content_item">
                                <h4 class="card__content_item_title">${element.title}</h4>
                                <p class="card__content_item_description">${element.description}</p>
                                <div class="card__content_item_action">
                                    <div class="active catagory-${element.category}">${renderactive(
            element.category
        )}</div>
                                    <div>
                                        <button class="edit" onclick="openDialogTask(${element.id})">Edit</button>
                                        <button class="delete" onclick="deleteTask(${element.id})">Delete</button>
                                    </div>
                                </div>
                            </div>`;
        if (element.status === "todo") {
            todoTask.innerHTML += htmlTask;
            count_todo += 1;
        } else if (element.status === "inprogress") {
            inprogressTask.innerHTML += htmlTask;
            count_inprogress += 1;
        } else if (element.status === "done") {
            doneTask.innerHTML += htmlTask;
            count_done += 1;
        }
        const taskDiv = document.querySelectorAll(".card__content_item");
        taskDiv.forEach((task) => {
            task.draggable = true;
            task.addEventListener("dragstart", dragstart);
            task.addEventListener("dragend", dragend);
        });
    });
    document.querySelector("#todo_count").innerHTML = count_todo;
    document.querySelector("#in_progress_count").innerHTML = count_inprogress;
    document.querySelector("#done_count").innerHTML = count_done;
    const emtyHtml = `<div class="emty">Không có task nào</div>`;
    if (document.querySelector("#todo_task").innerHTML === "") {
        document.querySelector("#todo_task").innerHTML = emtyHtml;
    }
    if (document.querySelector("#in_progress_task").innerHTML === "") {
        document.querySelector("#in_progress_task").innerHTML = emtyHtml;
    }
    if (document.querySelector("#done_task").innerHTML === "") {
        document.querySelector("#done_task").innerHTML = emtyHtml;
    }
}
renderTasks();
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light_mode");
    if (document.body.classList.contains("light_mode")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
});

if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light_mode");
}

function openDialogTask(id) {
    const task = tasks.find((task) => task.id === id);
    if (id) {
        taskActive = id;
        document.querySelector("#form_task_title_title").innerHTML = "Chỉnh sửa task";
        title.value = task.title;
        description.value = task.description;
        category.value = task.category;
        status.value = task.status;
        document.querySelector("#form_task_submit").innerHTML = "Chỉnh Sửa Task";
    } else {
        document.querySelector("#form_task_title_title").innerHTML = "Thêm mới task";
        document.querySelector("#form_task_submit").innerHTML = "Thêm Task";
    }
    dialogTask.show();
}

function closeDialogTask() {
    dialogTask.close();
    formTask.reset();
    document.querySelector("#title_error").innerHTML = "";
    document.querySelector("#category_error").innerHTML = "";
    taskActive = null;
}

dialogTask.addEventListener("click", (e) => {
    if (e.target.id === "task_dialog") {
        closeDialogTask();
    }
});

formTask.addEventListener("submit", (e) => {
    e.preventDefault();
    validateTask();
    if (errors.length > 0) {
        return;
    }
    if (taskActive) {
        indexTask = tasks.findIndex((task) => task.id === taskActive);
        tasks[indexTask].title = title.value;
        tasks[indexTask].description = description.value;
        tasks[indexTask].category = category.value;
        tasks[indexTask].status = status.value;
    } else {
        const task = {
            id: Date.now(),
            title: title.value,
            description: description.value,
            category: category.value,
            status: status.value,
        };
        tasks.unshift(task);
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    formTask.reset();
    closeDialogTask();
    renderTasks();
});

window.addEventListener("storage", (e) => {
    if (e.key === "tasks") {
        renderTasks();
    }
});

searchTask.addEventListener("input", (e) => {
    renderTasks();
});

searchCategory.addEventListener("input", (e) => {
    renderTasks();
});

const columns = document.querySelectorAll(".card");
columns.forEach((item) => {
    item.classList.remove("dragover");

    // Khi một phần tử đang được kéo đi qua cột này
    item.addEventListener("dragover", (e) => {
        e.preventDefault();
        item.classList.add("dragover");
    });
    item.addEventListener("dragleave", (e) => {
        e.preventDefault();
        item.classList.remove("dragover");
    })
    // Khi người dùng thả (drop) task vào cột này
    item.addEventListener("drop", dropTask);
    
});
