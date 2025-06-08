const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/todo_db');

const Todo = sequelize.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

sequelize.sync({ alter: true });

app.get('/api/todos', async (req, res) => {
  const todos = await Todo.findAll();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const { title, description } = req.body;
  const todo = await Todo.create({ title, description });
  res.json(todo);
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  await Todo.destroy({ where: { id } });
  res.json({ message: 'Todo deleted' });
});

app.listen(5000, () => console.log('Server running on port 5000'));