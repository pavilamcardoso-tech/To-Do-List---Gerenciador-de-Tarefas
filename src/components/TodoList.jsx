import { useState, useEffect } from "react";
import api from "../services/api";

const PALETTES = [
  { bg: "#EEEDFE", border: "#AFA9EC", check: "#534AB7" },
  { bg: "#E1F5EE", border: "#5DCAA5", check: "#0F6E56" },
  { bg: "#FAECE7", border: "#F0997B", check: "#993C1D" },
  { bg: "#FAEEDA", border: "#EF9F27", check: "#854F0B" },
  { bg: "#EAF3DE", border: "#97C459", check: "#3B6D11" },
  { bg: "#FBEAF0", border: "#ED93B1", check: "#993556" },
  { bg: "#E6F1FB", border: "#85B7EB", check: "#185FA5" },
];

export default function TodoList({ user, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const res = await api.get("/todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Erro ao buscar tarefas", err);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo() {
    const text = input.trim();
    if (!text) return;
    try {
      const res = await api.post("/todos", { text });
      setTodos([res.data, ...todos]);
      setInput("");
    } catch (err) {
      console.error("Erro ao criar tarefa", err);
    }
  }

  async function toggleTodo(todo) {
    try {
      const res = await api.put(`/todos/${todo.id}`, {
        text: todo.text,
        done: !todo.done,
      });
      setTodos(todos.map((t) => (t.id === todo.id ? res.data : t)));
    } catch (err) {
      console.error("Erro ao atualizar tarefa", err);
    }
  }

  async function removeTodo(id) {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Erro ao deletar tarefa", err);
    }
  }

  async function clearDone() {
    const done = todos.filter((t) => t.done);
    await Promise.all(done.map((t) => api.delete(`/todos/${t.id}`)));
    setTodos(todos.filter((t) => !t.done));
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
  }

  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.done : t.done
  );
  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h1 style={styles.title}>Minhas Tarefas</h1>
        <div style={styles.userInfo}>
          <span style={styles.userName}>Olá, {user.name}!</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Sair</button>
        </div>
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          type="text"
          placeholder="Adicionar nova tarefa..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          maxLength={80}
        />
        <button style={styles.addBtn} onClick={addTodo}>+ Adicionar</button>
      </div>

      <div style={styles.filterRow}>
        {["all", "active", "done"].map((f) => {
          const labels = { all: "Todas", active: "Ativas", done: "Concluídas" };
          const activeColors = { all: "#7F77DD", active: "#1D9E75", done: "#D85A30" };
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                background: isActive ? activeColors[f] : "transparent",
                color: isActive ? "#fff" : "#888",
                borderColor: isActive ? "transparent" : "#ddd",
              }}
            >
              {labels[f]}
            </button>
          );
        })}
      </div>

      <div style={styles.countBar}>
        <span style={styles.countLabel}>
          {todos.length} tarefa{todos.length !== 1 ? "s" : ""} · {doneCount} concluída{doneCount !== 1 ? "s" : ""}
        </span>
        <button style={styles.clearBtn} onClick={clearDone}>Limpar concluídas</button>
      </div>

      {loading ? (
        <p style={styles.emptyMsg}>Carregando...</p>
      ) : (
        <ul style={styles.list}>
          {visible.length === 0 ? (
            <li style={styles.emptyMsg}>Nenhuma tarefa aqui! 🎉</li>
          ) : (
            visible.map((t, i) => {
              const pal = PALETTES[i % PALETTES.length];
              return (
                <li
                  key={t.id}
                  style={{
                    ...styles.item,
                    background: pal.bg,
                    borderColor: pal.border,
                    opacity: t.done ? 0.6 : 1,
                  }}
                >
                  <button
                    onClick={() => toggleTodo(t)}
                    style={{
                      ...styles.checkBtn,
                      borderColor: pal.check,
                      background: t.done ? pal.check : "transparent",
                      color: t.done ? "#fff" : "transparent",
                    }}
                  >
                    ✓
                  </button>
                  <span
                    style={{
                      ...styles.todoText,
                      textDecoration: t.done ? "line-through" : "none",
                      color: t.done ? "#aaa" : "#222",
                    }}
                  >
                    {t.text}
                  </span>
                  <button style={styles.delBtn} onClick={() => removeTodo(t.id)}>✕</button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 520, margin: "3rem auto", padding: "0 1rem", fontFamily: "'Nunito', 'Segoe UI', sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" },
  title: { fontSize: 28, fontWeight: 800, margin: 0 },
  userInfo: { display: "flex", alignItems: "center", gap: 10 },
  userName: { fontSize: 14, color: "#888" },
  logoutBtn: { padding: "5px 14px", borderRadius: 20, border: "1.5px solid #ddd", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#D85A30", fontFamily: "inherit" },
  inputRow: { display: "flex", gap: 8, marginBottom: "1rem" },
  input: { flex: 1, padding: "10px 14px", borderRadius: 24, border: "2px solid #ccc", fontSize: 15, fontFamily: "inherit", outline: "none" },
  addBtn: { padding: "10px 20px", borderRadius: 24, border: "none", background: "#7F77DD", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" },
  filterRow: { display: "flex", gap: 6, marginBottom: "1rem" },
  filterBtn: { padding: "5px 16px", borderRadius: 20, border: "1.5px solid", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  countBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" },
  countLabel: { fontSize: 13, color: "#888", fontWeight: 600 },
  clearBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: "#D85A30", fontWeight: 700, fontFamily: "inherit" },
  list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 },
  item: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 16, border: "1.5px solid" },
  checkBtn: { width: 26, height: 26, borderRadius: "50%", border: "2px solid", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  todoText: { flex: 1, fontSize: 15, fontWeight: 600 },
  delBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: 16, color: "#bbb", padding: "2px 4px", fontFamily: "inherit" },
  emptyMsg: { textAlign: "center", color: "#aaa", fontSize: 14, padding: "2rem 0", fontStyle: "italic" },
};
