import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

type SigninResponse = {
  message: string;
  token: string;
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      const data: SigninResponse = response.data;
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/todos";
      }
    } catch (e) {
      alert("invalid credentials");
    }
  };

  return (
    <div style={{ justifyContent: "center", display: "flex", width: "100%" }}>
      <div>
        <h2>Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        New here? <Link to="/signup">Signup</Link>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
