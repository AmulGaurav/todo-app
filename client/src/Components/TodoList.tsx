import { useState, useEffect } from "react";
import { authState } from "../store/authState.ts";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config.ts";
import { Typography } from "@mui/material";

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
    const response = await axios.get(`${BASE_URL}/todo/todos`, {
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
      `${BASE_URL}/todo/todos`,
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
      `${BASE_URL}/todo/todos/${id}/done`,
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
      `${BASE_URL}/todo/todos/${updatingTodo?._id}`,
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
      const response = await axios.delete(`${BASE_URL}/todo/todos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

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
        <div
          style={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            style={{
              margin: "8px 0px 12px 0px",
            }}
          >
            Todo List
          </Typography>
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "15px",
          }}
        >
          {todos.map((todo) => (
            <div
              className="todo"
              style={{
                width: "380px",
                height: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid",
                margin: "20px 20px",
                textAlign: "center",
                backgroundColor: todo.done ? "teal" : "",
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
                  <div
                    style={{
                      marginTop: "15px",
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <button
                      style={{
                        padding: "4px 10px",
                        backgroundColor: "red",
                      }}
                      onClick={() => {
                        setIsUpdating(false);
                        setUpdatingTodo(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      style={{
                        padding: "4px 10px",
                        backgroundColor: "green",
                      }}
                      onClick={handleUpdateSave}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    width: "250px",
                  }}
                >
                  <h3
                    style={{
                      marginBottom: "-10px",
                    }}
                  >
                    {todo.title}
                  </h3>
                  <p
                    style={{
                      marginBottom: "8px",
                    }}
                  >
                    {todo.description}
                  </p>
                  <button
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: todo.done ? "#333" : "white",
                      backgroundColor: todo.done ? "lightgreen" : "",
                    }}
                    disabled={todo.done}
                    onClick={() => markDone(todo._id)}
                  >
                    {todo.done ? "Done" : "Mark as Done"}
                  </button>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      textAlign: "center",
                      marginTop: "15px",
                    }}
                  >
                    <button
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "green",
                      }}
                      onClick={() => {
                        handleUpdateClick(todo);
                      }}
                    >
                      Update
                    </button>
                    <button
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "red",
                      }}
                      onClick={() => deleteTodo(todo._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
