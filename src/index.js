const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');


const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers

const user = users.find(user => user.username === username)

if (!user) {
  return response.status(404).json({Error: 'User not found'})
}

  request.user = user;

  next()
}

app.post('/users', (request, response) => {
  const {name,username} = request.body

const userExists = users.find(user => user.username === username)

  if (userExists) {
    return response.status(400).json({Error: 'User already exists!'})
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  users.push(user)
  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request
  return response.json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body
  const {user} = request

  const newTask = {
    id: uuidv4(),
    title,
    done: false,
    deadline: Date(deadline),
    created_at: Date()
  }

  user.todos.push(newTask)

  return response.status(201).json(newTask)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {title,deadline} = request.body
  const {id} = request.params
  const {user} = request

const task = user.todos.find(tasks => tasks.id === id)

if(!task) {
  return response.status(404).json({Error: 'Task not found!'})
}

  task.title = title
  task.deadeline = deadline

  return response.json(taks)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {id} = request.params
  const {done} = request.body
  const {user} = request

const todo = user.todos.find(todos => todos.id === id)

if(!todo) {
  return response.status(404).json({Error: 'todo not found!'})
}

  todo.done = done
  return response.json(todo)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {id} = request.params
const {user} = request

const todo = user.todos.findIndex(todos => todos.id === id)

if(todo === -1) {
  return response.status(404).json({Error: 'todo not found!'})
}

user.todos.splice(todo,1)

return response.status(204).json()


});

module.exports = app;