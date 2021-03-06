var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks =[];
var updatedTaskArr = [];

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
  var isEdit = formEl.hasAttribute("data-task-id");

  // package up data as an object
  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
    status: "to do"
    
  };

  

  // check if input values are empty strings
if (!taskNameInput || !taskTypeInput) {
  alert("You need to fill out the task form!");
  return false;
}

formEl.reset();

  // has data attribute, so get task id and call function to complete edit process
if (isEdit) {
  var taskId = formEl.getAttribute("data-task-id");
  completeEditTask(taskNameInput, taskTypeInput, taskId);
} 
// no data attribute, so create object as normal and pass to createTaskEl function
else {
  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput
  };

  createTaskEl(taskDataObj);
}

  
}

var createTaskEl = function(taskDataObj) {
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  listItemEl.setAttribute("data-task-id", taskIdCounter)

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";

  // add HTML content to div
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

  listItemEl.appendChild(taskInfoEl);

  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj)

  var taskActionEl = createTaskAction(taskIdCounter);
  listItemEl.appendChild(taskActionEl);


  // add entire list item to list
  tasksToDoEl.appendChild(listItemEl);

  taskIdCounter++;
  saveTasks();
}

var createTaskAction = function(taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn"
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  var statusChoice = ["To Do", "In Progress", "Completed"]

  for (var i = 0; i < statusChoice.length; i++) {
    //create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoice[i];
    statusOptionEl.setAttribute("value", statusChoice[i]);

     statusSelectEl.appendChild(statusOptionEl);
  }

 

  actionContainerEl.appendChild(statusSelectEl);

  return actionContainerEl;


}

var taskButtonHandler = function(event) {
  // get target element from event
  var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } 
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

pageContentEl.addEventListener("click", taskButtonHandler);

var deleteTask = function(taskId) {
  
  var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId + "']")
  taskSelected.remove();
  saveTasks();
}

var editTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);

  for (var i = 0; i < tasks.lenght; i++) {
    if (tasks[i].id !== parsetInt(taskId)) {
      updatedTaskArr.push(tasks[id]);
    }
  }

  tasks = updatedTaskArr;

}





formEl.addEventListener("submit", taskFormHandler);

var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task list item
var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

// set new values
taskSelected.querySelector("h3.task-name").textContent = taskName;
taskSelected.querySelector("span.task-type").textContent = taskType;

for(var i=0; i < tasks.lenght; i++) {
  if (tasks[i].id === parseInt(taskId)) {
    tasks[i].name = taskName;
    tasks[i].type = taskType;
  }
};

alert("Task Updated!");

formEl.removeAttribute("data-task-id");
document.querySelector("#save-task").textContent = "Add Task";
saveTasks();
};

var taskStatusChangeHandler = function(event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } 
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } 
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  for (var i=0; i < tasks.lenght; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }
  saveTasks();
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


var loadTasks = function() {
  savedTasks = localStorage.getItem("tasks");
  
  if (savedTasks === null) {
    savedTasks = [];
    return false
  }
  savedTasks = JSON.parse(savedTasks);

for (var i = 0; i < savedTasks.length; i++) {
  createTaskEl(savedTasks[i]);
  
 }  
 console.log(savedTasks[i]);
  
}

loadTasks();



pageContentEl.addEventListener("change", taskStatusChangeHandler);