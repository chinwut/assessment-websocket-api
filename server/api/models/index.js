class TodoItem {
    constructor({ title, owner,  isCompleted = false }) {
        this.title = title;
        this.owner = owner;
        this.isCompleted = isCompleted;
    }

    toFirestore() {
        return {
            title: this.title,
            owner: this.owner,
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
