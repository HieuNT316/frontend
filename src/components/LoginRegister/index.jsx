import React, { useState, useContext } from "react";
import UserContext from "../../UserContext.js";
import fetchModelModel from "../../lib/fetchModelData.js";
const LoginRegister = () => {
  const { setUser } = useContext(UserContext);
  const [loginName, setLoginName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",  // Gửi cookie cho session
      body: JSON.stringify({ login_name: loginName })
    });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        setError("Cannot connect to server. Please try again later.");
        } else {
        setError(err.message);
        }
    }
  };

  return (
    <div>
        <label>Login Name:</label>
        <input value={loginName} onChange={(e) => setLoginName(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        {error && <p>{error}</p>}
    </div>
  );
};
export default LoginRegister;