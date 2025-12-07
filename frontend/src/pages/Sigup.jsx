import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: Backend call to create user
    console.log("Mobile:", mobile, "Email:", email, "Password:", password);
    alert("Signup clicked! (Backend integration pending)");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h2 style={{ textAlign: "center" }}>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Sign Up
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Signup;
