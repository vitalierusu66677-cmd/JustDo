/*========================================================
//!                     DOM ELEMENTS
========================================================*/

/*========================================================
//!                       APP DATA
========================================================*/

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let displayMonth;
let displayYear;
let selectedDay;
let tasks = [];
let selectedTask = null;
let editingTask = null;

/*========================================================
//!                      FUNCTIONS
========================================================*/

function selectDay(event) {
  let sele = document.querySelector(".selected-day");

  if (sele) {
    sele.classList.remove("selected-day");
  }
  event.target.classList.add("selected-day");
  selectedDay = Number(event.target.textContent);
  renderTasks();
}

function GetCurrentDate() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  return {
    year: currentYear,
    month: currentMonth,
    day: currentDay,
  };
}

function GetDaysInMonth(year, month) {
  const date = new Date(year, month, 0);
  return date.getDate();
}

function renderCalendar(year, month) {
  let cgrid = document.querySelector(".calendar-grid");
  cgrid.innerHTML = "";
  const daysnum = GetDaysInMonth(year, month);

  const firstDay = new Date(year, month - 1, 1); // Первое число каждого месяца
  const dayOfWeek = firstDay.getDay(); // В какой день недели выпадает
  let emptyCells = dayOfWeek - 1;
  if (emptyCells === -1) {
    emptyCells = 6;
  }

  for (let i = 0; i < emptyCells; i++) {
    let emptyCell = document.createElement("div");
    emptyCell.classList.add("empty-cell");
    cgrid.appendChild(emptyCell);
  }

  for (let i = 1; i <= daysnum; i++) {
    let dayCell = document.createElement("div");
    dayCell.classList.add("day-cell");
    dayCell.textContent = i;
    cgrid.appendChild(dayCell);
    dayCell.addEventListener("click", selectDay);
    if (
      i === currentDate.day &&
      month === currentDate.month &&
      year === currentDate.year
    ) {
      dayCell.classList.add("current-day");
    }
    if (
      i === selectedDay &&
      month === currentDate.month &&
      year === currentDate.year
    ) {
      dayCell.classList.add("selected-day");
    }
  }
  let monthname = document.querySelector(".month");
  monthname.textContent = months[month - 1] + ` ${year}`;
}
function renderTasks() {
  let taskList = document.querySelector(".task-list");
  taskList.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    if (
      tasks[i].day === selectedDay &&
      tasks[i].month === displayMonth &&
      tasks[i].year === displayYear &&
      !tasks[i].completed
    ) {
      let taskList = document.querySelector(".task-list");
      let task = document.createElement("div");
      task.classList.add("task");
      task.addEventListener("click", () => {
        event.stopPropagation();
        if (tasks[i].completed) {
          return;
        }
        if (i === selectedTask) {
          selectedTask = null;
        } else {
          selectedTask = i;
        }
        renderTasks();
      });
      taskList.appendChild(task);
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("task-status");
      checkbox.checked = tasks[i].completed;
      checkbox.addEventListener("click", () => {
        event.stopPropagation();
        tasks[i].completed = !tasks[i].completed;
        selectedTask = null;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderStatistics();
        renderTasks();
      });
      task.appendChild(checkbox);
      if (tasks[i].completed === true) {
        task.classList.add("completed-task");
      }

      let taskNum = document.createElement("div");
      taskNum.classList.add("task-num");
      taskNum.textContent = "1.";
      task.appendChild(taskNum);
      if (i === editingTask) {
        let taskInput = document.createElement("input");
        task.appendChild(taskInput);
        taskInput.value = tasks[i].text;
        taskInput.focus();
        taskInput.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            tasks[i].text = taskInput.value;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            editingTask = null;
            renderTasks();
          }
          if (event.key === "Escape") {
            editingTask = null;
            renderTasks();
          }
        });
      } else {
        let taskText = document.createElement("div");
        taskText.classList.add("task-text");
        task.appendChild(taskText);
        taskText.textContent = tasks[i].text;
      }
      if (i === selectedTask) {
        task.classList.add("selected-task");
        const editBtn = document.createElement("button");
        editBtn.textContent = "🖍";
        editBtn.classList.add("edit-btn");
        task.appendChild(editBtn);
        editBtn.addEventListener("click", () => {
          editingTask = i;
          renderTasks();
        });
        const xbtn = document.createElement("button");
        xbtn.textContent = "X";
        xbtn.classList.add("delete-btn");
        task.appendChild(xbtn);
        xbtn.addEventListener("click", () => {
          event.stopPropagation();
          tasks.splice(selectedTask, 1);
          selectedTask = null;
          localStorage.setItem("tasks", JSON.stringify(tasks));
          renderStatistics();
          renderTasks();
        });
      }
      taskNum.textContent = taskList.childElementCount + ".";
    }
  }
  for (let i = 0; i < tasks.length; i++) {
    if (
      tasks[i].day === selectedDay &&
      tasks[i].month === displayMonth &&
      tasks[i].year === displayYear &&
      tasks[i].completed
    ) {
      let taskList = document.querySelector(".task-list");
      let task = document.createElement("div");
      task.classList.add("task");
      task.addEventListener("click", () => {
        if (tasks[i].completed) {
          return;
        }
        if (i === selectedTask) {
          selectedTask = null;
        } else {
          selectedTask = i;
        }
        renderTasks();
      });
      taskList.appendChild(task);
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("task-status");
      checkbox.checked = tasks[i].completed;
      checkbox.addEventListener("click", () => {
        event.stopPropagation();
        tasks[i].completed = !tasks[i].completed;
        selectedTask = null;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
        renderStatistics();
      });
      task.appendChild(checkbox);
      if (tasks[i].completed === true) {
        task.classList.add("completed-task");
      }

      let taskNum = document.createElement("div");
      taskNum.classList.add("task-num");
      taskNum.textContent = "1.";
      task.appendChild(taskNum);
      if (i === editingTask) {
        let taskInput = document.createElement("input");
        task.appendChild(taskInput);
        taskInput.value = tasks[i].text;
        taskInput.focus();
        taskInput.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            tasks[i].text = taskInput.value;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            editingTask = null;
            renderTasks();
          }
          if (event.key === "Escape") {
            editingTask = null;
            renderTasks();
          }
        });
      } else {
        let taskText = document.createElement("div");
        taskText.classList.add("task-text");
        task.appendChild(taskText);
        taskText.textContent = tasks[i].text;
      }
      if (i === selectedTask) {
        task.classList.add("selected-task");
        const editBtn = document.createElement("button");
        editBtn.textContent = "🖍";
        editBtn.classList.add("edit-btn");
        task.appendChild(editBtn);
        editBtn.addEventListener("click", () => {
          editingTask = i;
          renderTasks();
        });
        const xbtn = document.createElement("button");
        xbtn.textContent = "X";
        xbtn.classList.add("delete-btn");
        task.appendChild(xbtn);
        xbtn.addEventListener("click", () => {
          tasks.splice(selectedTask, 1);
          selectedTask = null;
          localStorage.setItem("tasks", JSON.stringify(tasks));
          renderTasks();
        });
      }
      taskNum.textContent = taskList.childElementCount + ".";
    }
  }
}
function renderStatistics() {
  const today = GetCurrentDate();
  const tasksParagraph = document.querySelector(".total-tasks");
  const completedParagraph = document.querySelector(".completed-tasks");
  const remainingParagraph = document.querySelector(".remaining-tasks");
  const remainingToday = document.querySelector(".remaining-today");
  let completedTasks = 0;
  let remainingTasksToday = 0;
  tasksParagraph.textContent = `Total tasks: ${tasks.length}`;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].completed) {
      completedTasks++;
    }
    if (
      tasks[i].day === today.day &&
      tasks[i].month === today.month &&
      tasks[i].year === today.year &&
      !tasks[i].completed
    ) {
      remainingTasksToday++;
    }
  }
  completedParagraph.textContent = `Completed tasks: ${completedTasks}`;
  let remainingTasks = tasks.length - completedTasks;
  remainingParagraph.textContent = `Remaining tasks: ${remainingTasks}`;
  remainingToday.textContent = `Remaining today: ${remainingTasksToday}`;
}

/*========================================================
//!                   EVENT LISTENERS
========================================================*/

/*========================================================
//!                       APP INIT
========================================================*/
let currentDate = GetCurrentDate();
let savedTasks = localStorage.getItem("tasks");
if (savedTasks !== null) {
  tasks = JSON.parse(savedTasks);
} else {
  tasks = [];
}

selectedDay = currentDate.day;
displayMonth = currentDate.month;
displayYear = currentDate.year;
renderCalendar(currentDate.year, currentDate.month);
renderStatistics();
renderTasks();

let prevbtn = document.querySelector("#prev");
prevbtn.addEventListener("click", () => {
  displayMonth--;
  if (displayMonth < 1) {
    displayMonth = 12;
    displayYear--;
  }
  renderCalendar(displayYear, displayMonth);
});
let nextbtn = document.querySelector("#next");
nextbtn.addEventListener("click", () => {
  displayMonth++;
  if (displayMonth > 12) {
    displayMonth = 1;
    displayYear++;
  }
  renderCalendar(displayYear, displayMonth);
});

let addbtn = document.querySelector(".add-btn");
addbtn.addEventListener("click", () => {
  let taskInput = document.querySelector(".task-input");
  if (taskInput.value.trim() === "") {
    taskInput.classList.add("error-input");

    setTimeout(() => {
      taskInput.classList.remove("error-input");
    }, 1000);

    return;
  }
  tasks.push({
    text: taskInput.value,
    day: selectedDay,
    month: displayMonth,
    year: displayYear,
    completed: false,
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  renderStatistics();
  renderTasks();
});
let taskInput = document.querySelector(".task-input");
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addbtn.click();
  }
});
document.addEventListener("click", () => {
  selectedTask = null;
  editingTask = null;
  renderTasks();
});
