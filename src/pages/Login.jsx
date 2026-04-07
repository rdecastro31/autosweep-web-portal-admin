import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import "../assets/styles/global.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USERS_URL } from "../constants/urls";
import logo from "../assets/images/logo.png"
import { FiEye, FiEyeOff } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");

      const postData = new FormData();
      postData.append("tag", "login");
      postData.append("email", formData.email);
      postData.append("password", formData.password);

      const response = await axios.post(USERS_URL, postData);
      const data = response.data;

      if (data.success === 1) {
        localStorage.setItem("token", data.token || "sample_token");

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            name: data.name,
            email: data.email,
            userlevel: data.userlevel,
          })
        );

        navigate("/dashboard");
      } else {
        setMessage(data.msg || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setMessage("Something went wrong while logging in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <Container fluid className="p-0">
        <Row className="g-0 min-vh-100">
          {/* LEFT SIDE */}
          <Col md={7} className="d-none d-md-flex left-panel">
            <div className="left-content">
              <h1>Autosweep RFID Web Portal Management</h1>
              <p>
                Manage RFID customer accounts, monitor tag activity, and control
                access across your system in real time.
              </p>
            </div>
          </Col>

          {/* RIGHT SIDE */}
          <Col
            md={5}
            xs={12}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="login-form-wrapper">
              <center>
                <img src={logo}/>
                <p className="text-muted mb-4">Please sign in to continue</p>
              </center>

              {message && <Alert variant="danger">{message}</Alert>}

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="username"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />

                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 login-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <span className="text-muted forgot-link">Forgot password?</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;