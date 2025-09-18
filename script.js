const themeToggle = document.getElementById("theme-toggle");
const dialogTask = document.querySelector("#task_dialog");
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

function openDialogTask() {
    dialogTask.show();
}

function closeDialogTask() {
    dialogTask.close();
}

dialogTask.addEventListener("click", (e) => {
    if (e.target.id === "task_dialog") {
        dialogTask.close();
    }
});
