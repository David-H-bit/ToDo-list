import { TodoApp } from './dom.js';


const app = new TodoApp();
app.init();


window.app = app;


window.showNewProjectModal = () => {
    document.getElementById('project-name').value = '';
    document.getElementById('project-modal').style.display = 'block';
};

window.showNewTodoModal = () => {
    app.currentEditingTodo = null;
    app.currentChecklist = [];
    
    document.getElementById('todo-modal-title').textContent = 'New Todo';
    document.getElementById('todo-title').value = '';
    document.getElementById('todo-description').value = '';
    document.getElementById('todo-due-date').value = '';
    document.getElementById('todo-priority').value = 'medium';
    document.getElementById('todo-notes').value = '';
    document.getElementById('delete-todo-btn').style.display = 'none';
    
    app.renderChecklistItems([]);
    document.getElementById('todo-modal').style.display = 'block';
};

window.closeModal = (modalId) => {
    document.getElementById(modalId).style.display = 'none';
};

window.createProject = () => {
    const name = document.getElementById('project-name').value.trim();
    if (!name) return;
    
    app.createProject(name);
    app.render();
    closeModal('project-modal');
};

window.saveTodo = () => {
    const todoData = {
        title: document.getElementById('todo-title').value.trim(),
        description: document.getElementById('todo-description').value.trim(),
        dueDate: document.getElementById('todo-due-date').value,
        priority: document.getElementById('todo-priority').value,
        notes: document.getElementById('todo-notes').value.trim(),
        checklist: app.currentChecklist || []
    };

    if (!todoData.title) return;

    if (app.currentEditingTodo) {
        app.updateTodo(app.currentEditingTodo.id, todoData);
    } else {
        app.createTodo(todoData);
    }

    app.render();
    closeModal('todo-modal');
};

window.deleteTodo = () => {
    if (app.currentEditingTodo) {
        app.deleteTodo(app.currentEditingTodo.id);
        app.render();
        closeModal('todo-modal');
    }
};

window.addChecklistItem = () => {
    app.addChecklistItem();
};


window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};