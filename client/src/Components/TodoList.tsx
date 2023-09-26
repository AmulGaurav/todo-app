import { useState, useEffect } from "react";
import { authState } from "../store/authState.ts";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Todo {
  _id: string;
  title: string;
  description: string;
  done: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const authStateValue = useRecoilValue(authState);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingTodo, setUpdatingTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const navigate = useNavigate();

  const getTodos = async () => {
    const response = await axios.get("http://localhost:3000/todo/todos", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const data: Todo[] = response.data;
    setTodos(data);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = async () => {
    const response = await axios.post(
      "http://localhost:3000/todo/todos",
      {
        title,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = response.data;
    setTodos([...todos, data]);
    setTitle("");
    setDescription("");
  };

  const markDone = async (id: string) => {
    const response = await axios.patch(
      `http://localhost:3000/todo/todos/${id}/done`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const updatedTodo = response.data;
    setTodos(
      todos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
    );
  };

  const handleUpdateClick = (todo: Todo) => {
    setIsUpdating(true);
    setUpdatingTodo(todo);
    setNewTitle(todo.title);
    setNewDescription(todo.description);
  };

  const handleUpdateSave = async () => {
    // Send a request to update the todo on the server with newTitle and newDescription
    await axios.put(
      `http://localhost:3000/todo/todos/${updatingTodo?._id}`,
      {
        title: newTitle,
        description: newDescription,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setIsUpdating(false);
    setUpdatingTodo(null);
    getTodos();
  };

  const deleteTodo = async (id: string) => {
    if (confirm("Deleting? Are you sure? 🎩")) {
      const response = await axios.delete(
        `http://localhost:3000/todo/todos/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const data = response.data;
      alert(data.message);

      getTodos();
    }
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>Welcome {authStateValue.username}</h2>
        <div style={{ marginTop: 25, marginLeft: 20 }}>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <div>
        <h2>Todo List</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <div>
        {todos.map((todo) => (
          <div
            style={{
              border: "1px solid white",
              margin: "20px 0px",
            }}
            key={todo._id}
          >
            {isUpdating && updatingTodo?._id === todo._id ? (
              <div>
                <div>
                  <label htmlFor="title">
                    <strong>Title: </strong>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="description">
                    <strong>Description: </strong>
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    style={{
                      backgroundColor: "red",
                    }}
                    onClick={() => {
                      setIsUpdating(false);
                      setUpdatingTodo(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button onClick={handleUpdateSave}>Save</button>
                </div>
              </div>
            ) : (
              <div>
                <h3
                  style={{
                    marginBottom: "-10px",
                  }}
                >
                  {todo.title}
                </h3>
                <p
                  style={{
                    marginBottom: "-0.5px",
                  }}
                >
                  {todo.description}
                </p>
                <button disabled={todo.done} onClick={() => markDone(todo._id)}>
                  {todo.done ? "Done" : "Mark as Done"}
                </button>
                <br />
                <button
                  onClick={() => {
                    handleUpdateClick(todo);
                  }}
                >
                  Update
                </button>
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
