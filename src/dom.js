import { Todo } from './todo.js';
import { Project } from './project.js';
import { Storage } from './storage.js';


export class TodoApp {
    constructor() {
        this.projects = [];
        this.currentProject = null;
        this.currentEditingTodo = null;
        this.currentChecklist = [];
    }

    init() {
        this.loadFromStorage();
        if (this.projects.length === 0) {
            this.createDefaultProject();
        }
        this.setCurrentProject(this.projects[0].id);
        this.render();
    }

    createDefaultProject() {
        const defaultProject = new Project('My Tasks');
        this.projects.push(defaultProject);
        this.saveToStorage();
    }

    createProject(name) {
        const project = new Project(name);
        this.projects.push(project);
        this.saveToStorage();
        return project;
    }

    deleteProject(projectId) {
        if (this.projects.length <= 1) return false;
        this.projects = this.projects.filter(p => p.id !== projectId);
        if (this.currentProject && this.currentProject.id === projectId) {
            this.setCurrentProject(this.projects[0].id);
        }
        this.saveToStorage();
        return true;
    }

    setCurrentProject(projectId) {
        this.currentProject = this.projects.find(p => p.id === projectId);
    }

    createTodo(todoData) {
        const todo = new Todo(
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority,
            todoData.notes,
            todoData.checklist
        );
        this.currentProject.addTodo(todo);
        this.saveToStorage();
        return todo;
    }

    updateTodo(todoId, todoData) {
        const todo = this.currentProject.getTodo(todoId);
        if (todo) {
            todo.update(todoData);
            this.saveToStorage();
        }
    }

    deleteTodo(todoId) {
        this.currentProject.removeTodo(todoId);
        this.saveToStorage();
    }

    toggleTodoComplete(todoId) {
        const todo = this.currentProject.getTodo(todoId);
        if (todo) {
            todo.toggleComplete();
            this.saveToStorage();
        }
    }

    saveToStorage() {
        const data = {
            projects: this.projects.map(project => ({
                id: project.id,
                name: project.name,
                createdAt: project.createdAt,
                todos: project.todos.map(todo => ({
                    id: todo.id,
                    title: todo.title,
                    description: todo.description,
                    dueDate: todo.dueDate,
                    priority: todo.priority,
                    notes: todo.notes,
                    checklist: todo.checklist,
                    completed: todo.completed,
                    createdAt: todo.createdAt
                }))
            })),
            currentProjectId: this.currentProject ? this.currentProject.id : null
        };
        
        Storage.save(data);
    }

    loadFromStorage() {
        const data = Storage.load();
        
        if (!data) return;

        this.projects = data.projects.map(projectData => {
            const project = Object.assign(new Project(), projectData);
            project.todos = projectData.todos.map(todoData => {
                return Object.assign(new Todo(), todoData);
            });
            return project;
        });

        if (data.currentProjectId) {
            this.setCurrentProject(data.currentProjectId);
        }
    }

    render() {
        this.renderProjects();
        this.renderTodos();
    }

    renderProjects() {
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '';

        this.projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = `project-item ${this.currentProject && this.currentProject.id === project.id ? 'active' : ''}`;
            projectElement.innerHTML = `
                <div onclick="app.setCurrentProject(${project.id}); app.render();">
                    <div style="font-weight: 500;">${project.name}</div>
                    <div style="font-size: 12px; color: #6c757d;">${project.todos.length} todos</div>
                </div>
                ${this.projects.length > 1 ? `<button class="btn btn-sm btn-danger" onclick="app.deleteProject(${project.id}); app.render();">×</button>` : ''}
            `;
            projectsList.appendChild(projectElement);
        });
    }

    renderTodos() {
        const todosList = document.getElementById('todos-list');
        const emptyState = document.getElementById('empty-state');
        const currentProjectTitle = document.getElementById('current-project-title');
        const currentProjectCount = document.getElementById('current-project-count');

        if (!this.currentProject) return;

        currentProjectTitle.textContent = this.currentProject.name;
        currentProjectCount.textContent = `${this.currentProject.todos.length} todos`;

        if (this.currentProject.todos.length === 0) {
            todosList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        todosList.innerHTML = '';

       
        const sortedTodos = [...this.currentProject.todos].sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        sortedTodos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.className = `todo-item priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;
            
            const dueDateFormatted = todo.dueDate ? 
                new Date(todo.dueDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                }) : 'No due date';
            
            const completedTodos = todo.checklist.filter(item => item.completed).length;
            const totalTodos = todo.checklist.length;

            todoElement.innerHTML = `
                <div class="todo-header">
                    <div class="todo-title">${todo.title}</div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                               onclick="event.stopPropagation(); app.toggleTodoComplete(${todo.id}); app.render();">
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); app.deleteTodo(${todo.id}); app.render();">×</button>
                    </div>
                </div>
                <div class="todo-meta">
                    <span>📅 ${dueDateFormatted}</span>
                    <span>🏷️ ${todo.priority}</span>
                    ${totalTodos > 0 ? `<span>✅ ${completedTodos}/${totalTodos}</span>` : ''}
                </div>
                ${todo.description ? `<div style="margin-top: 8px; color: #6c757d; font-size: 14px;">${todo.description}</div>` : ''}
            `;
            
            todoElement.onclick = () => this.editTodo(todo);
            todosList.appendChild(todoElement);
        });
    }

    editTodo(todo) {
        this.currentEditingTodo = todo;
        this.currentChecklist = [...todo.checklist];
        
        document.getElementById('todo-modal-title').textContent = 'Edit Todo';
        document.getElementById('todo-title').value = todo.title;
        document.getElementById('todo-description').value = todo.description;
        document.getElementById('todo-due-date').value = todo.dueDate;
        document.getElementById('todo-priority').value = todo.priority;
        document.getElementById('todo-notes').value = todo.notes;
        document.getElementById('delete-todo-btn').style.display = 'block';
        
        this.renderChecklistItems(todo.checklist);
        document.getElementById('todo-modal').style.display = 'block';
    }

    renderChecklistItems(checklist = []) {
        const container = document.getElementById('checklist-items');
        container.innerHTML = '';
        
        checklist.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'checkbox-item';
            itemElement.innerHTML = `
                <input type="checkbox" ${item.completed ? 'checked' : ''} 
                       onchange="app.updateChecklistItem(${index}, 'completed', this.checked)">
                <input type="text" value="${item.text}" class="form-control" style="flex: 1;"
                       onchange="app.updateChecklistItem(${index}, 'text', this.value)">
                <button type="button" class="btn btn-sm btn-danger" onclick="app.removeChecklistItem(${index})">×</button>
            `;
            container.appendChild(itemElement);
        });
    }

    updateChecklistItem(index, property, value) {
        if (!this.currentChecklist) this.currentChecklist = [];
        if (!this.currentChecklist[index]) this.currentChecklist[index] = {};
        this.currentChecklist[index][property] = value;
    }

    removeChecklistItem(index) {
        if (!this.currentChecklist) this.currentChecklist = [];
        this.currentChecklist.splice(index, 1);
        this.renderChecklistItems(this.currentChecklist);
    }

    addChecklistItem() {
        if (!this.currentChecklist) this.currentChecklist = [];
        this.currentChecklist.push({ text: '', completed: false });
        this.renderChecklistItems(this.currentChecklist);
    }
}