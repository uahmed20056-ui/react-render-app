import { useEffect, useState } from "react";

// Same service par deploy ho to khali string (relative URL) kaafi hai
const API = import.meta.env.VITE_API_URL || "";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch(`${API}/api/todos`);
      if (!res.ok) throw new Error("Server error");
      setTodos(await res.json());
      setError("");
    } catch {
      setError("Backend se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(`${API}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    load();
  };

  const toggle = async (todo) => {
    await fetch(`${API}/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });
    load();
  };

  const remove = async (id) => {
    await fetch(`${API}/api/todos/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="container">
      <h1>Todo App</h1>

      <form onSubmit={addTodo} className="row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Naya task likhein..."
        />
        <button type="submit">Add</button>
      </form>

      {loading && <p>Loading... (free plan par pehli request slow ho sakti hai)</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <label className={t.done ? "done" : ""}>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t)} />
              {t.title}
            </label>
            <button className="del" onClick={() => remove(t.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
