const pool = require("../db");

async function getTodos(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
}

async function createTodo(req, res) {
  const { text } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO todos (text, done, user_id) VALUES ($1, false, $2) RETURNING *",
      [text, req.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
}

async function updateTodo(req, res) {
  const { id } = req.params;
  const { text, done } = req.body;
  try {
    const result = await pool.query(
      "UPDATE todos SET text = $1, done = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [text, done, id, req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
}

async function deleteTodo(req, res) {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM todos WHERE id = $1 AND user_id = $2", [id, req.userId]);
    res.json({ message: "Tarefa deletada" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar tarefa" });
  }
}

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
