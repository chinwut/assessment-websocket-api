const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } = require('firebase/firestore');
const firebaseApp = require('../middleware/firebaseConfig');
const db = getFirestore(firebaseApp);

const { TodoItem } = require('../models');
const logger = require('../../logger');

const firebaseCollection = process.env.FIREBASE_COLLECTION || 'todolist';

function getDocumentRef(id) {
    return doc(db, firebaseCollection, id);
}


exports.create = async (req, res, next) => {
    logger.info(`call create ${JSON.stringify(req.body)}`);
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
    logger.info(`call update ${JSON.stringify(req.body)}`);
    try {
        const { id } = req.params;
        const docRef = getDocumentRef(id);
        const docSnapshot = await getDoc(docRef);
        if (!docSnapshot.exists()) {
            throw new Error(`Todo item with ID ${id} not found`);
        }

        const updatedData = { ...docSnapshot.data(), ...req.body };
        await updateDoc(docRef, updatedData);

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
        await deleteDoc(getDocumentRef(id));
        logger.info(`Todo item with ID ${id} deleted`);
        res.status(200).send(`Todo item with ID ${id} deleted`);
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};
