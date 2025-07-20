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
const heroHeader = document.querySelector(".hero-header")

const taskButton = document.createElement("button");
taskButton.classList.add("taskbutton");
taskButton.textContent = "Add task";
heroHeader.append(taskButton);

let currentListId = "1";

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

            taskElement.classList.add("task");
            taskHeader.classList.add("taskTitle");

            taskHeader.innerHTML = `<h3>${task.name}</h3>`           
            
            taskElement.innerHTML = `
            <p><b>Due:</b> ${task.dueDate || "No due date"}</p>
            <p><b>Priority:</b> ${task.priority}</p>
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
                const newName = prompt("Edit task name:");
                if (newName && newName.trim() !== ""){
                    task.name = newName.trim();
                    showHeroScreen(list.id);
                }
            })

            deleteBtn.addEventListener("click", () => {
                if (confirm("Delete this task?")) {
                    list.tasks.splice(index, 1); // remove task
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
    const priorityValue = document.getElementById("priority").value;
    const dueDate = document.getElementById("due-date").value;
    const notes = document.getElementById("noteInput").value.trim();

    const task = {
        id: Date.now().toString(),
        name: taskText,
        dueDate: dueDate || null,
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
    if (convertedDueDate < new Date()){
        const dateList = findListsById("3");
        dateList.tasks.push(task);
    }

    document.getElementById("taskmodalInput").value = "";
    document.getElementById("priority").value = "low-priority";
    document.getElementById("due-date").value = "";
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
        const newText = window.prompt("Edit list name:")
        if(newText && newText.trim() && newText.trim().length < 14){
            li.firstChild.textContent = newText.trim();
        }
    })

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
});

cardsmode.addEventListener("click", () => {
    toggleExclusives(cardsmode, listsmode);
});

darkbtn.addEventListener("click", () => {
    toggleExclusives(darkbtn, lightbtn);
    document.documentElement.setAttribute("data-theme", "dark");
});

lightbtn.addEventListener("click", () => {
    toggleExclusives(lightbtn, darkbtn);
    document.documentElement.setAttribute("data-theme", "light");
});

document.addEventListener("click", (e) => {
    if (e.target.tagName === "LI" && e.target.hasAttribute("data-list-id")) {
        document.querySelectorAll("li[data-list-id]").forEach(li => li.classList.remove("activatedList"));
        e.target.classList.add("activatedList");
        const listId = e.target.getAttribute("data-list-id");
        currentListId = listId;
        showHeroScreen(listId);   
    }
});

showHeroScreen("1");
