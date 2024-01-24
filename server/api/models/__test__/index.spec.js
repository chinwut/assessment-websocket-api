const { TodoItem } = require('../index');

describe('TodoItem Model', () => {
    describe('constructor', () => {
        it('should create a TodoItem with default values', () => {
            const item = new TodoItem({ title: 'Test Todo', owner: 'User1' });

            expect(item.title).toBe('Test Todo');
            expect(item.owner).toBe('User1');
            expect(item.isCompleted).toBe(false);
        });

        it('should create a TodoItem with specified values', () => {
            const item = new TodoItem({ title: 'Test Todo', owner: 'User1', isCompleted: true });

            expect(item.title).toBe('Test Todo');
            expect(item.owner).toBe('User1');
            expect(item.isCompleted).toBe(true);
        });
    });

    describe('toFirestore', () => {
        it('should return an object suitable for Firestore', () => {
            const item = new TodoItem({ title: 'Test Todo', owner: 'User1', isCompleted: true });
            const firestoreObject = item.toFirestore();

            expect(firestoreObject).toEqual({
                title: 'Test Todo',
                owner: 'User1',
                isCompleted: true
            });
        });
    });

    describe('validate', () => {
        it('should not throw an error for a valid title', () => {
            const item = new TodoItem({ title: 'Test Todo', owner: 'User1' });

            expect(() => item.validate()).not.toThrow();
        });

        it('should throw an error for an invalid title', () => {
            const item = new TodoItem({ title: '', owner: 'User1' });

            expect(() => item.validate()).toThrow('Invalid title');
        });

        it('should throw an error for a non-string title', () => {
            const item = new TodoItem({ title: null, owner: 'User1' });

            expect(() => item.validate()).toThrow('Invalid title');
        });
    });
});
