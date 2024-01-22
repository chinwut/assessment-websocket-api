class TodoItem {
    constructor({ title, description, dueDate, isCompleted = false }) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.isCompleted = isCompleted;
    }

    toFirestore() {
        return {
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            isCompleted: this.isCompleted
        };
    }

    validate() {
        if (!this.title || typeof this.title !== 'string') {
            throw new Error('Invalid title');
        }
    }
}

module.exports = {
    TodoItem
};
