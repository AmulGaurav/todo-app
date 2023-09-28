import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

type SignupResponse = {
  message: string;
  token: string;
};

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/signup", {
        username,
        password,
      });

      const data: SignupResponse = response.data;
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/todos";
      }
    } catch (e) {
      alert("user already exists");
    }
  };

  return (
    <div style={{ justifyContent: "center", display: "flex", width: "100%" }}>
      <div>
        <h2>Signup</h2>
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
        Already signed up? <Link to="/login">Login</Link>
        <button onClick={handleSignup}>Signup</button>
      </div>
    </div>
  );
};

export default Signup;
