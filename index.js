const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const portInt = parseInt(process.env.DB_PORT, 10);
if (isNaN(portInt) || portInt < 0 || portInt > 65535) {
  throw new Error(`Invalid DB_PORT: ${process.env.DB_PORT}`);
}

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_ENDPOINT,
  port: portInt,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

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
