const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } = require('firebase/firestore');
const firebaseApp = require('../middleware/firebaseConfig');
const db = getFirestore(firebaseApp);

const { TodoItem } = require('../models');
const logger = require('../middleware/logger');

const firebaseCollection = process.env.FIREBASE_COLLECTION || 'todolist';

exports.create = async (req, res, next) => {
    try {
        const newTodo = new TodoItem(req.body);
        newTodo.validate();
        const firestoreData = newTodo.toFirestore();

        const result = await addDoc(collection(db, firebaseCollection), firestoreData);
        logger.info(`Todo item created with ID: ${result.id}`);
        res.status(201).send(`Todo item created with ID: ${result.id}`);
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedData = new TodoItem(req.body);
        updatedData.validate();
        const firestoreData = updatedData.toFirestore();

        const docRef = doc(db, firebaseCollection, id);
        await updateDoc(docRef, firestoreData);

        logger.info(`Todo item with ID ${id} updated`);
        res.status(200).send(`Todo item with ID ${id} updated`);
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const todoListSnapshot = await getDocs(collection(db, firebaseCollection));
        const todoList = [];
        todoListSnapshot.forEach(docSnapshot => {
            todoList.push({ id: docSnapshot.id, ...docSnapshot.data() });
        });
        logger.info('Fetched todo list items');
        res.status(200).json(todoList);
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteDoc(doc(db, firebaseCollection, id));
        logger.info(`Todo item with ID ${id} deleted`);
        res.status(200).send(`Todo item with ID ${id} deleted`);
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};
