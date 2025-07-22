const listsWrapper = document.querySelector(".lists-wrapper");
const ulListsWrapper = document.querySelector(".ulListsWrapper");
const listsmode = document.querySelector(".listsmode");
const cardsmode = document.querySelector(".cardsmode");
const darkbtn = document.querySelector(".darkbtn");
const lightbtn = document.querySelector(".lightbtn");
const addList = document.getElementById("addList");
const listmodal = document.getElementById("listmodal");
const taskmodal = document.getElementById("taskmodal");
const closeListmodal = document.getElementById("closeListmodal");
const addListmodal = document.getElementById("addListmodal");       
const closeTaskmodal = document.getElementById("closeTaskmodal");
const addTaskmodal = document.getElementById("addTaskmodal");
const hero = document.querySelector(".hero");
const heroHeader = document.querySelector(".hero-header");

const taskButton = document.createElement("button");
taskButton.classList.add("taskbutton");
taskButton.style.display = "none";
taskButton.textContent = "Add task";
heroHeader.append(taskButton);

let currentListId = "1";
let currentTaskDisplay = "lists";
let currentTaskBeingEdited = null;

const lists = [
    {
        id: "1",
        name: "Total Tasks",
        tasks: []
    },
    {
        id: "2",
        name: "Completed",
        tasks: []
    },
    {
        id: "3",
        name: "Overdue",
        tasks: []
    },
    {
        id: "4",
        name: "📁 Work",
        tasks: []
    },
    {
        id: "5",
        name: "🏠 Personal",
        tasks: []
    },
    {
        id: "6",
        name: "🔥 High Priority",
        tasks: []
    },
    {
        id: "7",
        name: "🟡 Medium Priority",
        tasks: []
    },
    {
        id: "8",
        name: "🟢 Low Priority",
        tasks: []
    },
];

function saveLists() {
    
}

function loadLists() {
    
}

function getPriorityDisplay(priority) {
    const priorityMap = {
        "low-priority": "🟢 Low Priority",
        "medium-priority": "🟡 Medium Priority", 
        "high-priority": "🔥 High Priority"
    };
    return priorityMap[priority] || priority;
}

function findListsById(id){
    return lists.find(list => list.id === id);
}

function toggleExclusives(activeBtn, inactiveBtn, className = "activated-btn"){
    if(activeBtn.classList.contains(className)) return;
    activeBtn.classList.add(className);
    inactiveBtn.classList.remove(className);
}

function showHeroScreen(listId){
    const list = findListsById(listId);
    const title = document.getElementById("heroTitle");
    const description = document.getElementById("heroDescription");
    const taskContainer = document.querySelector(".taskContainer");
    taskContainer.innerHTML = "";

    if(list){
        title.textContent = list.name;
        description.textContent = `Tasks in ${list.name}: ${list.tasks.length}`;

        list.tasks.forEach((task, index) => {
            const miniTaskContainer = document.createElement("div");
            const taskHeader = document.createElement("div")
            const taskElement = document.createElement("div");

            if (task.completed) {
                taskHeader.classList.add("completedCrossedOut");
                taskElement.classList.add("completedCrossedOut");
            }

            if(currentTaskDisplay === "lists"){
                taskElement.classList.remove("taskForCards");
                taskHeader.classList.remove("taskTitleForCards");
                taskContainer.classList.remove("taskContainerForCards");
                taskElement.classList.add("taskForLists"); 
                taskHeader.classList.add("taskTitleForLists");
                taskContainer.classList.add("taskContainerForLists");
            }
            else if (currentTaskDisplay === "cards"){
                taskElement.classList.remove("taskForLists");
                taskHeader.classList.remove("taskTitleForLists");
                taskContainer.classList.remove("taskContainerForLists");
                taskElement.classList.add("taskForCards"); 
                taskHeader.classList.add("taskTitleForCards");
                taskContainer.classList.add("taskContainerForCards");
            }

            miniTaskContainer.classList.add("miniTaskContainer");

            taskHeader.innerHTML = `<h3>${task.name}</h3>`           
            
            taskElement.innerHTML = `
            <p><b>Due:</b> ${task.dueDate || "No due date"} | ${task.dueTime || "No due time"}</p>
            <p><b>Priority:</b> ${getPriorityDisplay(task.priority)}</p>
            <p><b>Notes:</b> ${task.note || "No notes"}</p>
            `;

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.classList.add("editTask");

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("deleteTask");

            const completeBtn = document.createElement("button");
            completeBtn.textContent = "Completed";
            completeBtn.classList.add("completeTask")

            editBtn.addEventListener("click", () => {
                currentTaskBeingEdited = task;

                document.getElementById("editTaskmodalInput").value = task.name;
                document.getElementById("edit-due-date").value = task.dueDate || "";
                document.getElementById("edit-due-time").value = task.dueTime || "";
                document.getElementById("edit-noteInput").value = task.note || "";
                document.getElementById("editPriority").value = task.priority || "low-priority";
                document.getElementById("editTaskmodal").classList.remove("hidden");
            })

            deleteBtn.addEventListener("click", () => {
                if (confirm("Delete this task?")) {
                    const taskId = task.id;
                    lists.forEach((l) => {
                        l.tasks = l.tasks.filter(t => t.id !== taskId);
                    })
                    showHeroScreen(list.id); // re-render
                }
            });

            completeBtn.addEventListener("click", () => {
                task.completed = !task.completed;
                
                taskHeader.classList.toggle("completedCrossedOut");
                taskElement.classList.toggle("completedCrossedOut");

                const completedList = findListsById("2");

                if(!completedList.tasks.find(t => t.id === task.id)){
                    completedList.tasks.push(task);
                } else{
                    const index = completedList.tasks.findIndex(t => t.id === task.id)
                    if(index !== -1){
                        completedList.tasks.splice(index, 1);
                    }
                }
            })

            taskElement.append(editBtn, deleteBtn, completeBtn);
            miniTaskContainer.append(taskHeader, taskElement);
            taskContainer.append(miniTaskContainer);
        })
    }
}

const searchInput = document.querySelector("[data-search]");

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    document.querySelectorAll(".miniTaskContainer").forEach((container) => {
        const taskName = container.querySelector("h3")?.textContent.toLowerCase();
        const isVisible = taskName.includes(value);
        container.style.display = isVisible ? "flex" : "none";
    });
});

addList.addEventListener("click", ()=>{
    listmodal.classList.remove("hidden");
})

taskButton.addEventListener("click", () => {
    taskmodal.classList.remove("hidden");
})

closeListmodal.addEventListener("click", ()=>{
    listmodal.classList.add("hidden");
})

closeTaskmodal.addEventListener("click", ()=>{
    taskmodal.classList.add("hidden");
})

addTaskmodal.addEventListener("click", ()=>{
    const taskText = document.getElementById("taskmodalInput").value.trim();
    if(taskText.length > 14 || taskText.length <= 3){
        window.alert("Title has to be between 3 and 14 characters");
        return;
    }
    const priorityValue = document.getElementById("priority").value;
    const dueDate = document.getElementById("due-date").value;
    const dueTime = document.getElementById("due-time").value;
    const notes = document.getElementById("noteInput").value.trim();

    const task = {
        id: Date.now().toString(),
        name: taskText,
        dueDate: dueDate || null,
        dueTime: dueTime || null,
        priority: priorityValue,
        completed: false,
        note: notes
    }

    const currentList = findListsById(currentListId);
    if (currentList) currentList.tasks.push(task);

    if (currentList?.id !== "1") {
        const totalList = findListsById("1");
        if (totalList) totalList.tasks.push(task);
    }

    const priorityMap = {
        "low-priority": "8",
        "medium-priority": "7",
        "high-priority": "6"
    };

    const priorityListId = priorityMap[priorityValue];
    const priorityList = findListsById(priorityListId);
    if (priorityList) priorityList.tasks.push(task);

    const convertedDueDate = new Date(document.getElementById("due-date").value);
    const convertedDueTime = new Date(document.getElementById("due-time").value);

    const combinedString = `${convertedDueDate}${convertedDueTime}`;
    const dueDateTime = new Date(combinedString);
    const now = new Date();
    if (dueDateTime <= now){
        const dateList = findListsById("3");
        dateList.tasks.push(task);
    }

    document.getElementById("taskmodalInput").value = "";
    document.getElementById("priority").value = "low-priority";
    document.getElementById("due-date").value = "";
    document.getElementById("due-time").value = "";
    document.getElementById("noteInput").value = "";
    document.getElementById("taskmodal").classList.add("hidden");

    showHeroScreen(currentListId);
})

addListmodal.addEventListener("click", () => {
    const text = document.getElementById("listmodalInput").value.trim();    
    if(text === "") return;
    if(text.length > 14) {
        window.alert("cannot be equal or longer than 14 characters");
        return;
    }

    const li = document.createElement("li");
    const edit = document.createElement("button");
    const remove = document.createElement("button");
    li.setAttribute("data-list-id", Date.now());
    lists.push({id: li.getAttribute("data-list-id"), name: text, tasks: []});

    edit.textContent = "Edit";
    remove.textContent = "Delete";
    edit.classList.add("edit");
    remove.classList.add("remove");

edit.addEventListener("click", (e) => {
    e.stopPropagation();
    const newText = window.prompt("Edit list name:");
    if (newText && newText.trim() && newText.trim().length < 14) {
        const trimmed = newText.trim();
        li.firstChild.textContent = trimmed;

        const listId = li.getAttribute("data-list-id"); 
        const list = findListsById(listId);
        if (list) {
            list.name = trimmed;
            showHeroScreen(list.id);
        }
        console.log(listId, list);
    }
});

    remove.addEventListener("click", (r) => {
        r.stopPropagation();
        if(confirm("delete this list?")){
            li.remove();
        }
    })

    li.textContent = text;
    ulListsWrapper.append(li);
    li.append(edit, remove);

    listmodal.classList.add("hidden");
    document.getElementById("listmodalInput").value = "";
})

listsmode.addEventListener("click", () => {
    toggleExclusives(listsmode, cardsmode);
    currentTaskDisplay = "lists";
    showHeroScreen(currentListId);
});

cardsmode.addEventListener("click", () => {
    toggleExclusives(cardsmode, listsmode);
    currentTaskDisplay = "cards";
    showHeroScreen(currentListId);      
});

darkbtn.addEventListener("click", () => {
    toggleExclusives(darkbtn, lightbtn);
    document.documentElement.setAttribute("data-theme", "dark");
});

lightbtn.addEventListener("click", () => {
    toggleExclusives(lightbtn, darkbtn);
    document.documentElement.setAttribute("data-theme", "light");
});

document.getElementById("editTaskSaveBtn").addEventListener("click", () => {
    if (!currentTaskBeingEdited) return;

    const oldPriority = currentTaskBeingEdited.priority;
    const newPriority = document.getElementById("editPriority").value;

    currentTaskBeingEdited.name = document.getElementById("editTaskmodalInput").value.trim();
    currentTaskBeingEdited.dueDate = document.getElementById("edit-due-date").value;
    currentTaskBeingEdited.dueTime = document.getElementById("edit-due-time").value;
    currentTaskBeingEdited.note = document.getElementById("edit-noteInput").value.trim();
    currentTaskBeingEdited.priority = newPriority;

        // If priority changed, update priority lists
    if (oldPriority !== newPriority) {
        // Remove from old priority list
        const oldPriorityMap = {
            "low-priority": "8",
            "medium-priority": "7", 
            "high-priority": "6"
        };
        const oldPriorityListId = oldPriorityMap[oldPriority];
        const oldPriorityList = findListsById(oldPriorityListId);
        if (oldPriorityList) {
            const taskIndex = oldPriorityList.tasks.findIndex(t => t.id === currentTaskBeingEdited.id);
            if (taskIndex !== -1) {
                oldPriorityList.tasks.splice(taskIndex, 1);
            }
        }

        // Add to new priority list
        const newPriorityMap = {
            "low-priority": "8",
            "medium-priority": "7",
            "high-priority": "6"
        };
        const newPriorityListId = newPriorityMap[newPriority];
        const newPriorityList = findListsById(newPriorityListId);
        if (newPriorityList) {
            // Only add if not already there
            if (!newPriorityList.tasks.find(t => t.id === currentTaskBeingEdited.id)) {
                newPriorityList.tasks.push(currentTaskBeingEdited);
            }
        }
    }

    document.getElementById("editTaskmodal").classList.add("hidden");
    currentTaskBeingEdited = null;
    showHeroScreen(currentListId);
});

document.getElementById("closeEditTaskmodal").addEventListener("click", () => {
    document.getElementById("editTaskmodal").classList.add("hidden");
    currentTaskBeingEdited = null;
});

document.addEventListener("click", (e) => {
    if (e.target.tagName === "LI" && e.target.hasAttribute("data-list-id")) {
        document.querySelectorAll("li[data-list-id]").forEach(li => li.classList.remove("activatedList"));
        e.target.classList.add("activatedList");
        const listId = e.target.getAttribute("data-list-id");
        currentListId = listId;

        const isInCustomListArea = e.target.closest(".customListArea") !== null;
        taskButton.style.display = isInCustomListArea ? "inline-block" : "none";

        showHeroScreen(listId);   
    }
});

showHeroScreen(currentListId);
