const express = require('express');
require('dotenv').config();
const controller = require('./controllers/');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.post('/api/create', controller.create);
app.put('/api/update', controller.update);
app.get('/api/getAll', controller.getAll);
app.delete('/api/delete/:id', controller.delete);

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
