import { useState } from "react";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[message,setMessage]=useState("");
  const handleSignup = async (e) => {
  e.preventDefault();

  const userData = {
    name,
    email,
    password,
  };

  try {
    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    setMessage(data.message);

  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="page">
      <h1>SignUp</h1>
      <p>{message}</p>
      <form className="form" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}

export default Signup;