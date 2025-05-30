// Storage Module
export class Storage {
    static save(data) {
        try {
            
            window.todoAppData = data;
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    static load() {
        try {
            
            return window.todoAppData || null;
        } catch (error) {
            console.error('Error loading from storage:', error);
            return null;
        }
    }
}