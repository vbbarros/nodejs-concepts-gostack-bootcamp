const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const newRepo = {
    id: uuid(),
    title,
    url, 
    techs,
    likes: 0
  }
  
  repositories.push(newRepo)

  return response.json(newRepo)
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params

  delete request.body.likes

  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  repositories[repoIndex] = { ...repositories[repoIndex], ...request.body }

  return response.json(repositories[repoIndex])
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).json({})
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  repositories[repoIndex].likes++

  return response.json({ likes: repositories[repoIndex].likes })
});

module.exports = app;
