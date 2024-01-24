const express = require('express');
const cors = require('cors');
require('dotenv').config();
const controller = require('./controllers/');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors({
    origin: 'http://localhost:5173' 
  }));
app.use(express.json());
app.post('/api/create', controller.create);
app.put('/api/update/:id', controller.update);
app.get('/api/getall', controller.getAll);
app.delete('/api/delete/:id', controller.delete);

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
