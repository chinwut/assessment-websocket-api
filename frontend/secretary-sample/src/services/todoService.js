import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; 
export const fetchTodos = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getAll`);
        return response.data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};

export const addTodo = async (title) => {
    try {
        await axios.post(`${API_BASE_URL}/create`, title );
    } catch (error) {
        console.error('Error adding todo:', error);
        throw error;
    }
};

export const toggleComplete = async (id, isCompleted) => {
    try {
        await axios.put(`${API_BASE_URL}/update/${id}`, { isCompleted: !isCompleted });
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
};

export const deleteTodo = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/delete/${id}`);
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};
