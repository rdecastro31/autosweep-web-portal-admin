import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Table,
  Alert,
  Spinner,
  InputGroup,
  Form,
  Badge,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import axios from "axios";
import { FaSearch, FaKey, FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import "../../assets/styles/mainaccount.css";
import { USERS_URL } from "../../constants/urls";
import AddUserModal from "../../components/modals/AddUserModal";
import ResetUserPasswordModal from "../../components/modals/ResetUserPasswordModal";
import UpdateUserModal from "../../components/modals/UpdateUserModal";
export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [userLevelFilter, setUserLevelFilter] = useState("All");
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //Add User Modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [submittingAddUser, setSubmittingAddUser] = useState(false);
  const [addUserFormData, setAddUserFormData] = useState({
            email: "",
            name: "",
            userlevel: "",
        });

  //Reset User Modal
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [submittingResetPassword, setSubmittingResetPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [resetEmail, setResetEmail] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");


  //Update User Modal
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [submittingUpdateUser, setSubmittingUpdateUser] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  

  useEffect(() => {
    fetchUsers();
  }, []);


const handleOpenUpdateUserModal = (user) => {
  setUserToUpdate(user);
  setShowUpdateUserModal(true);
};

const handleCloseUpdateUserModal = () => {
  if (submittingUpdateUser) return;

  setShowUpdateUserModal(false);
  setUserToUpdate(null);
};


const generatePassword = (length = 10) => {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};


  const fetchUsers = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("tag", "getall");

      const response = await axios.post(USERS_URL, formData);
      const data = response.data;

      if (data.success === 1) {
        setUsers(data.users || []);
        setMessage("");
      } else {
        setMessage(data.msg || "No users found.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error loading users.");
    } finally {
      setLoading(false);
    }
  };

  const userLevelOptions = useMemo(() => {
    const levels = [...new Set(users.map((u) => u.userlevel).filter(Boolean))];
    return ["All", ...levels];
  }, [users]);

  const filteredUsers = useMemo(() => {
    const keyword = filter.toLowerCase().trim();

    return users.filter((u) => {
      const matchesKeyword =
        !keyword ||
        u.name?.toLowerCase().includes(keyword) ||
        u.email?.toLowerCase().includes(keyword) ||
        u.userlevel?.toLowerCase().includes(keyword) ||
        u.status?.toLowerCase().includes(keyword);

      const matchesUserLevel =
        userLevelFilter === "All" || u.userlevel === userLevelFilter;

      return matchesKeyword && matchesUserLevel;
    });
  }, [filter, users, userLevelFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, userLevelFilter, rowsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const getStatusBadge = (status) => {
    return String(status).toLowerCase() === "active" ? (
      <Badge bg="success" pill>
        Active
      </Badge>
    ) : (
      <Badge bg="danger" pill>
        {status}
      </Badge>
    );
  };

  const handleSubmitAddUser = async () => {
  try {
    setSubmittingAddUser(true);

    const formData = new FormData();
    formData.append("tag", "add_user");
    formData.append("email", addUserFormData.email);
    formData.append("name", addUserFormData.name);
    formData.append("userlevel", addUserFormData.userlevel);

    const response = await axios.post(API_URL, formData);
    const data = response.data;

    if (data.success === 1) {
      Swal.fire({
        icon: "success",
        title: "User Added",
        text: data.msg || "User successfully added.",
      });

      setShowAddUserModal(false);
      fetchUsers();
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: data.msg || "Unable to add user.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while adding the user.",
    });
  } finally {
    setSubmittingAddUser(false);
  }
};

  const handleAddUser = () => {
        setAddUserFormData({
            email: "",
            name: "",
            userlevel: "",
        });
        setShowAddUserModal(true);
};

 const handleResetPassword = (user) => {
  setSelectedUser(user);
  setResetEmail(user.email || "");
  setGeneratedPassword(generatePassword());
  setShowResetPasswordModal(true);
};

const handleCloseResetPasswordModal = () => {
  if (submittingResetPassword) return;

  setShowResetPasswordModal(false);
  setSelectedUser(null);
  setResetEmail("");
  setGeneratedPassword("");
};

const handleSubmitResetPassword = async () => {
  try {
    if (!selectedUser) return;

    if (!generatedPassword || generatedPassword.trim().length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Password",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }

    setSubmittingResetPassword(true);

    const formData = new FormData();
    formData.append("tag", "resetpassword");
    formData.append("email", resetEmail);
    formData.append("password", generatedPassword);

    const response = await axios.post(USERS_URL, formData);
    const data = response.data;

    if (data.success === 1) {
      await Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: data.message || "Password successfully updated.",
      });

      handleCloseResetPasswordModal();
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: data.msg || data.message || "Unable to update password.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while updating the password.",
    });
  } finally {
    setSubmittingResetPassword(false);
  }
};

const handleUpdate = (user) => {
  handleOpenUpdateUserModal(user);
}

const handleSubmitUpdateUser = async ({ id, name, userlevel }) => {
  try {
    setSubmittingUpdateUser(true);

    const formData = new FormData();
    formData.append("tag", "update");
    formData.append("userid", id);
    formData.append("name", name);
    formData.append("userlevel", userlevel);

    const response = await axios.post(USERS_URL, formData);
    const data = response.data;

    if (data.success === 1) {
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: data.msg || "User successfully updated.",
      });

      // update local state (so no need to refetch, optional)
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, name, userlevel } : u))
      );

      handleCloseUpdateUserModal();
      // or if you prefer always fresh data:
      // fetchUsers();
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: data.msg || "Unable to update user.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while updating the user.",
    });
  } finally {
    setSubmittingUpdateUser(false);
  }


}

  const handleDelete = async (user) => {
      const result = await Swal.fire({
    icon: "warning",
    title: "Are you sure you want to delete this user?",
    html: `
      <div style="text-align:left;">
        <div><strong>Name:</strong> ${user?.name || "-"}</div>
        <div><strong>User Level:</strong> ${user?.userlevel || "-"}</div>
        <div style="margin-top:10px;"><strong>Email:</strong> ${user?.email || "-"}</div>
      </div>
      <div style="margin-top:12px;color:#dc3545;">
        This action cannot be undone.
      </div>
    `,
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Delete",
  });

  if (!result.isConfirmed) {
    if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        icon: "info",
        title: "Cancelled",
        text: "Delete action was cancelled.",
      });
    }
    return;
  }

  try {
    Swal.fire({
      title: "Deleting user...",
      html: "Please wait while we delete the user.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    const formData = new FormData();
    formData.append("tag", "delete");
    formData.append("userid", user.id);

    const response = await axios.post(USERS_URL, formData);
    const data = response.data;

    if (data.success === 1) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: data.msg || "User has been removed.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: data.msg || "Delete failed",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong",
    });
  }
  };

  const renderActions = (user) => (
    <div className="action-buttons">
      <OverlayTrigger placement="top" overlay={<Tooltip>Update</Tooltip>}>
        <Button
          variant="outline-primary"
          className="action-btn"
          onClick={() => handleUpdate(user)}
        >
          <FaEdit size={14} />
        </Button>
      </OverlayTrigger>

      <OverlayTrigger placement="top" overlay={<Tooltip>Reset Password</Tooltip>}>
        <Button
          variant="outline-warning"
          className="action-btn"
          onClick={() => handleResetPassword(user)}
        >
          <FaKey size={14} />
        </Button>
      </OverlayTrigger>

      <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
        <Button
          variant="outline-danger"
          className="action-btn"
          onClick={() => handleDelete(user)}
        >
          <FaTrash size={14} />
        </Button>
      </OverlayTrigger>
    </div>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="mb-0">
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        />
        {items}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        />
      </Pagination>
    );
  };

  return (


    <div className="main-accounts-page">
      <div className="page-header">
        <div>
          <h3 className="page-title">Users</h3>
          <p className="page-subtitle">Manage system users and permissions</p>
        </div>

        <Button
          variant="success"
          className="px-4 rounded-pill"
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </div>

      <Card className="top-card mb-4">
        <Card.Body className="p-4">
          <div className="search-panel">
            <div className="section-title">Filter Users</div>

            <Row className="g-3">
              <Col lg={6} md={12}>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-end-0">
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search name, email, role, status..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border-start-0"
                  />
                </InputGroup>
              </Col>

              <Col lg={3} md={6}>
                <Form.Select
                  value={userLevelFilter}
                  onChange={(e) => setUserLevelFilter(e.target.value)}
                >
                  {userLevelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col lg={3} md={6}>
                <Form.Select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                >
                  <option value={10}>10 rows</option>
                  <option value={25}>25 rows</option>
                  <option value={50}>50 rows</option>
                  <option value={100}>100 rows</option>
                </Form.Select>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>

      {message && <Alert variant="warning">{message}</Alert>}

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Card className="result-card">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div className="table-title">User List</div>
              <Badge bg="light" text="dark" pill>
                {filteredUsers.length} User{filteredUsers.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="table-responsive">
              <Table className="custom-table align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>User Level</th>
                    <th>Status</th>
                    <th>Date Updated</th>
                    <th className="action-cell">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td>{startIndex + index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.userlevel}</td>
                        <td>{getStatusBadge(user.status)}</td>
                        <td>{user.date_updated}</td>
                        <td className="action-cell">{renderActions(user)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
              <div className="text-muted small">
                Showing {filteredUsers.length === 0 ? 0 : startIndex + 1} to{" "}
                {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} entries
              </div>
              {renderPagination()}
            </div>
          </Card.Body>
        </Card>
      )}

<AddUserModal
  show={showAddUserModal}
  onHide={() => setShowAddUserModal(false)}
  formData={addUserFormData}
  setFormData={setAddUserFormData}
  onSubmitAddUser={handleSubmitAddUser}
  submitting={submittingAddUser}
/>

<ResetUserPasswordModal
  show={showResetPasswordModal}
  onHide={handleCloseResetPasswordModal}
  email={resetEmail}
  password={generatedPassword}
  setPassword={setGeneratedPassword}
  onGeneratePassword={() => setGeneratedPassword(generatePassword())}
  onSubmitResetPassword={handleSubmitResetPassword}
  submitting={submittingResetPassword}
/>

<UpdateUserModal
  show={showUpdateUserModal}
  onHide={handleCloseUpdateUserModal}
  user={userToUpdate}
  userLevelOptions={userLevelOptions.filter((x) => x !== "All")}
  onSubmit={handleSubmitUpdateUser}
  submitting={submittingUpdateUser}
/>
      
    </div>

    
  );
}