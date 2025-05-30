// Todo Class
export class Todo {
    constructor(title, description, dueDate, priority, notes = '', checklist = []) {
        this.id = Date.now() + Math.random();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
        this.completed = false;
        this.createdAt = new Date();
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    update(data) {
        Object.assign(this, data);
    }
}