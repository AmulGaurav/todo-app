import { Link } from "react-router-dom";
import { BASE_URL } from "../config";
import axios from "axios";
import { Button, Card, Typography } from "@mui/material";
import { Username, Password } from "./Login";
import { usernameState, passwordState } from "../store/user";
import { useRecoilValue } from "recoil";

type SignupResponse = {
  message: string;
  token: string;
};

const Signup = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          marginTop: "100px",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h6">Welcome to Coursera, sign up below</Typography>
      </div>
      <Card
        variant="outlined"
        style={{
          padding: "20px",
          width: "400px",
          textAlign: "center",
        }}
      >
        <Username />
        <br />
        <br />
        <Password />
        <br />
        <br />
        <SignUpButton />
        <br />
        <br />
        <Typography>
          Already a user?{" "}
          <Link to="/login">
            <strong>Login</strong>
          </Link>
        </Typography>
      </Card>
    </div>
  );
};

function SignUpButton() {
  const username = useRecoilValue(usernameState);
  const password = useRecoilValue(passwordState);

  const handleSignup = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, {
        username,
        password,
      });

      const data: SignupResponse = response.data;
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/todos";
      }
    } catch (e) {
      alert("invalid credentials");
    }
  };

  return (
    <>
      <Button variant="contained" size="large" onClick={handleSignup}>
        Sign Up
      </Button>
    </>
  );
}

export default Signup;
