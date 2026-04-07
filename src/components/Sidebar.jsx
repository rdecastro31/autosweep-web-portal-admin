import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiUserPlus,
  FiFileText,
  FiCreditCard,
  FiSettings,
  FiDatabase,
} from "react-icons/fi";
import logo from "../assets/images/logo.png"

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userlevel = user.userlevel || "";

  const menuItems = [
    {
      to: "/dashboard",
      icon: <FiHome />,
      label: "Dashboard",
      roles: ["Administrator", "System User"],
    },
    {
      to: "/dashboard/main-accounts",
      icon: <FiUsers />,
      label: "Main Accounts",
      roles: ["Administrator", "System User"],
    },
    {
      to: "/dashboard/sub-accounts",
      icon: <FiUserPlus />,
      label: "Sub Accounts",
      roles: ["Administrator", "System User"],
    },
    {
      to: "/dashboard/ams",
      icon: <FiDatabase />,
      label: "Check AMS",
      roles: ["Administrator", "System User"],
    },
    {
      divider: true,
      roles: ["Administrator", "System User"],
    },
    {
      to: "/dashboard/tickets",
      icon: <FiFileText />,
      label: "Tickets",
      roles: ["Administrator"],
    },
    {
      to: "/dashboard/transactions",
      icon: <FiCreditCard />,
      label: "Transactions",
      roles: ["Administrator"],
    },
    {
      divider: true,
      roles: ["Administrator"],
    },
    {
      to: "/dashboard/users",
      icon: <FiUsers />,
      label: "Users",
      roles: ["Administrator"],
    },
    {
      to: "/dashboard/settings",
      icon: <FiSettings />,
      label: "Settings",
      roles: ["Administrator"],
    },
  ];

  const allowedMenuItems = menuItems.filter((item) =>
    item.roles.includes(userlevel)
  );

  return (
    <div className="sidebar">
    <img src={logo}></img>
      <div className="sidebar-brand">Web Portal Admin</div>
  
      <Nav className="flex-column sidebar-nav">
        {allowedMenuItems.map((item, index) =>
          item.divider ? (
            <div key={`divider-${index}`} className="sidebar-divider" />
          ) : (
            <Nav.Link
              key={item.to}
              as={NavLink}
              to={item.to}
              className="sidebar-link"
            >
              {item.icon}
              <span>{item.label}</span>
            </Nav.Link>
          )
        )}
      </Nav>
    </div>
  );
}

export default Sidebar;