const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./models/Todo');

const app = express();

app.use(express.json());

// Enable CORS
app.use(cors());

// Connect to MongoDB 
mongoose.connect('mongodb+srv://ansari:ansari@cluster0.s50xwut.mongodb.net/todo-mern?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


// API endpoint to get all To-Do tasks
app.get('/api/todos', async (req, res) => {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // API endpoint to create a new To-Do task
  app.post('/api/todos', async (req, res) => {
    const { task } = req.body;
    try {
      const newTodo = new Todo({ task });
      await newTodo.save();
      res.json(newTodo);
    } catch (error) {
      res.status(400).json({ error: 'Bad request' });
    }
  });
  
  // API endpoint to update a To-Do task
  app.put('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(id, { task }, { new: true });
      res.json(updatedTodo);
    } catch (error) {
      res.status(400).json({ error: 'Bad request' });
    }
  });
  
  // API endpoint to delete a To-Do task
  app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await Todo.findByIdAndDelete(id);
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(400).json({ error: 'Bad request' });
    }
  });

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
