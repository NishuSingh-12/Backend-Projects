import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Register() {
  const BASE_URL = "http://localhost:4000";
  const [formData, setFormData] = useState({
    name: "Nishu singh",
    email: "Nishu@gmail.com",
    password: "abcdefg",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch(`${BASE_URL}/user`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    if (data.error) {
      setError(data.error);
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }

    setFormData({
      name: "",
      email: "",
      password: "",
    });
  }

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <br />
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <br />
        <p style={{ color: "red" }}>{error}</p>
        <button
          type="submit"
          style={{
            backgroundColor: isSuccess ? "green" : "#007BFF",
          }}
        >
          {isSuccess ? "Registration Successfull" : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;
