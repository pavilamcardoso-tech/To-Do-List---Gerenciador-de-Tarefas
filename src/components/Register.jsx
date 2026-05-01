import { useState } from "react";
import api from "../services/api";

export default function Register({ onLogin, onGoToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 style={styles.title}>Gerenciador de Tarefas</h1>
        <p style={styles.subtitle}>Crie sua conta</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p style={styles.link}>
          Já tem conta?{" "}
          <span style={styles.linkBtn} onClick={onGoToLogin}>
            Entrar
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "2rem",
    width: "100%",
    maxWidth: 380,
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    margin: "0 0 4px",
    fontFamily: "Nunito, sans-serif",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    margin: "0 0 1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    padding: "10px 14px",
    borderRadius: 24,
    border: "2px solid #ddd",
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
  },
  btn: {
    padding: "10px",
    borderRadius: 24,
    border: "none",
    background: "#7F77DD",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    marginTop: 4,
  },
  error: {
    color: "#D85A30",
    fontSize: 13,
    marginBottom: 8,
    background: "#FAECE7",
    padding: "8px 12px",
    borderRadius: 8,
  },
  link: {
    textAlign: "center",
    fontSize: 13,
    color: "#888",
    marginTop: "1rem",
  },
  linkBtn: {
    color: "#7F77DD",
    fontWeight: 700,
    cursor: "pointer",
  },
};
