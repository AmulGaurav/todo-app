import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";
import {
  Button,
  Card,
  FormControl,
  InputLabel,
  TextField,
  Typography,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { usernameState, passwordState } from "../store/user";
import { useRecoilValue, useSetRecoilState } from "recoil";

type SigninResponse = {
  message: string;
  token: string;
};

const Login = () => {
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
        <Typography variant="h6">Welcome to Todo, sign in below</Typography>
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
        <LoginButton />
        <br />
        <br />
        <Typography>
          New Here?{" "}
          <Link to="/signup">
            <strong>Sign Up</strong>
          </Link>
        </Typography>
      </Card>
    </div>
  );
};

export function Username() {
  const setUsername = useSetRecoilState(usernameState);

  return (
    <>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth={true}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
    </>
  );
}

export function Password() {
  const [showPassword, setShowPassword] = useState(false);
  const setPassword = useSetRecoilState(passwordState);

  return (
    <>
      <FormControl
        variant="outlined"
        fullWidth={true}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setPassword(e.target.value);
        }}
      >
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((show) => !show)}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
    </>
  );
}

function LoginButton() {
  const username = useRecoilValue(usernameState);
  const password = useRecoilValue(passwordState);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
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
    <>
      <Button variant="contained" size="large" onClick={handleLogin}>
        Login
      </Button>
    </>
  );
}

export default Login;
