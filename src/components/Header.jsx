import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  // ✅ Get full user object
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const username = user.name || "Admin User";
  const userlevel = user.userlevel || "";

  const handleLogout = () => {
    // ✅ Clear ALL auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Optional: clear everything
    // localStorage.clear();

    navigate("/");
  };

  return (
    <div className="dashboard-header d-flex justify-content-between align-items-center">
      <div>
        <h4 className="mb-0">Dashboard</h4>
        <small className="text-muted">
          Welcome, {username}
          {userlevel && ` (${userlevel})`}
        </small>
      </div>

      <Button variant="success" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}

export default Header;