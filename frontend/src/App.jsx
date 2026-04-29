import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import TodoList from "./components/TodoList";

export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  function handleLogin(userData) {
    setUser(userData);
    setPage("todos");
  }

  function handleLogout() {
    setUser(null);
    setPage("login");
  }

  if (user) {
    return <TodoList user={user} onLogout={handleLogout} />;
  }

  if (page === "register") {
    return <Register onLogin={handleLogin} onGoToLogin={() => setPage("login")} />;
  }

  return <Login onLogin={handleLogin} onGoToRegister={() => setPage("register")} />;
}
