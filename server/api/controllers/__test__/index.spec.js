const { create, update, getAll, delete: deleteTodo } = require('../index');
const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } = require('firebase/firestore');
const logger = require('../../../logger');

jest.mock('firebase/firestore');
jest.mock('../../../logger');

describe('Todo Controller', () => {
    const mockRequest = (body = {}, params = {}) => ({ body, params });
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    const nextFunction = jest.fn();

    describe('create', () => {
        it('should create a new todo item', async () => {
            const req = mockRequest({ title: 'Test Todo' });
            const res = mockResponse();

            addDoc.mockResolvedValue({ id: '123' }); 

            await create(req, res, nextFunction);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith('Todo item created with ID: 123');
        });
        it('should handle errors during creation', async () => {
            const req = mockRequest({ title: 'Test Todo' });
            const res = mockResponse();
            const error = new Error('Creation failed');
    
            addDoc.mockRejectedValue(error); 
    
            await create(req, res, nextFunction);
    
            expect(logger.error).toHaveBeenCalledWith(error.message);
            expect(nextFunction).toHaveBeenCalledWith(error);
        });
    });

    describe('update', () => {
        it('should update an existing todo item', async () => {
            const req = mockRequest({ title: 'Updated Todo' }, { id: '123' });
            const res = mockResponse();

            getDoc.mockResolvedValue({ exists: () => true, data: () => ({ title: 'Original Todo' }) });
            updateDoc.mockResolvedValue({});

            await update(req, res, nextFunction);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith('Todo item with ID 123 updated');
        });

    });

    describe('getAll', () => {
        it('should retrieve all todo items', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const mockTodoList = [
                { id: '1', title: 'Todo 1', data: () => ({ title: 'Todo 1' }) },
                { id: '2', title: 'Todo 2', data: () => ({ title: 'Todo 2' }) }
            ];
    
            getDocs.mockResolvedValue({
                forEach: (callback) => mockTodoList.forEach(doc => callback(doc))
            });
    
            await getAll(req, res, nextFunction);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockTodoList.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        it('should handle errors when todo item is not found', async () => {
            const req = mockRequest({ title: 'Updated Todo' }, { id: '123' });
            const res = mockResponse();
    
            getDoc.mockResolvedValue({ exists: () => false });
    
            await update(req, res, nextFunction);
    
            expect(logger.error).toHaveBeenCalled();
            expect(nextFunction).toHaveBeenCalled();
        });
    
        it('should handle errors during update', async () => {
            const req = mockRequest({ title: 'Updated Todo' }, { id: '123' });
            const res = mockResponse();
            const error = new Error('Update failed');
    
            getDoc.mockResolvedValue({ exists: () => true, data: () => ({ title: 'Original Todo' }) });
            updateDoc.mockRejectedValue(error); 
    
            await update(req, res, nextFunction);
    
            expect(logger.error).toHaveBeenCalledWith(error.message);
            expect(nextFunction).toHaveBeenCalledWith(error);
        });
        it('should handle errors during fetching all items', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const error = new Error('Fetch failed');
    
            getDocs.mockRejectedValue(error);
    
            await getAll(req, res, nextFunction);
    
            expect(logger.error).toHaveBeenCalledWith(error.message);
            expect(nextFunction).toHaveBeenCalledWith(error);
        });
    });
    

    describe('delete', () => {
        it('should delete a todo item', async () => {
            const req = mockRequest({}, { id: '123' });
            const res = mockResponse();

            deleteDoc.mockResolvedValue({});

            await deleteTodo(req, res, nextFunction);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith('Todo item with ID 123 deleted');
        });

        it('should handle errors during deletion', async () => {
            const req = mockRequest({}, { id: '123' });
            const res = mockResponse();
            const error = new Error('Delete failed');
    
            deleteDoc.mockRejectedValue(error); 
            await deleteTodo(req, res, nextFunction);
    
            expect(logger.error).toHaveBeenCalledWith(error.message);
            expect(nextFunction).toHaveBeenCalledWith(error);
        });
    });
});
