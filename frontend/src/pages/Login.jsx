import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Backend call to verify login
    console.log("Mobile:", mobile, "Password:", password);
    alert("Login clicked! (Backend integration pending)");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h2 style={{ textAlign: "center" }}>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Login
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
}

export default Login;
