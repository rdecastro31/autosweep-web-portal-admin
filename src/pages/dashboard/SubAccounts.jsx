import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Table,
  Alert,
  Spinner,
  Badge,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import { FaSearch, FaUndo, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import "../../assets/styles/mainaccount.css";
import UpdateSubAccountModal from "../../components/modals/UpdateSubAccountModal";

// API URL
import { API_URL } from "../../constants/urls";

export default function SubAccounts() {

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const username = user.name || "Admin User";


  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchCriteria, setSearchCriteria] = useState("account_number");
  const [searchValue, setSearchValue] = useState("");

  const [mainAccount, setMainAccount] = useState(null);
  const [subAccount, setSubAccount] = useState(null);
  const [message, setMessage] = useState("");

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [submittingUpdate, setSubmittingUpdate] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    id: "",
    account_number: "",
    plate_number: "",
  });

  const getStatusBadge = (active) => {
    const status = String(active);

    if (status === "1") {
      return (
        <Badge bg="success" pill>
          Active
        </Badge>
      );
    }

    if (status === "2") {
      return (
        <Badge bg="danger" pill>
          Locked
        </Badge>
      );
    }

    return (
      <Badge bg="secondary" pill>
        Inactive
      </Badge>
    );
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setMessage("");
      setMainAccount(null);
      setSubAccount(null);

      const formData = new FormData();
      formData.append("tag", "search_subaccount");
    
      formData.append("search", searchCriteria);
      formData.append("value", searchValue);

      const response = await axios.post(API_URL, formData);
      const data = response.data;

      setSearched(true);

      if (data.success === 1) {
        setSubAccount({
          id: data.id,
          account_number: data.account_number,
          plate_number: data.plate_number,
          gname: data.gname,
          email: data.email,
          created_at: data.created_at,
        });

        if (data.mainaccount && data.mainaccount.length > 0) {
          setMainAccount(data.mainaccount[0]);
        }

        setMessage(data.msg || "Record found");
      } else {
        setMessage(data.msg || "No record found");
      }
    } catch (error) {
      console.error("Search error:", error.response?.data || error.message);
      setSearched(true);
      setMessage("Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearched(false);
    setLoading(false);
    setSearchCriteria("account_number");
    setSearchValue("");
    setMainAccount(null);
    setSubAccount(null);
    setMessage("");
  };

  const handleOpenUpdateModal = (account) => {
    setUpdateFormData({
      id: account.id || "",
      account_number: account.account_number || "",
      plate_number: account.plate_number || "",
    });
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    if (submittingUpdate) return;

    setShowUpdateModal(false);
    setUpdateFormData({
      id: "",
      account_number: "",
      plate_number: "",
    });
  };

  const handleSubmitUpdateSubAccount = async () => {
    try {
      setSubmittingUpdate(true);

      if (!updateFormData.account_number.trim() || !updateFormData.plate_number.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Missing Fields",
          text: "Account Number and Plate Number are required.",
        });
        return;
      }

      Swal.fire({
        title: "Updating sub account...",
        html: "Please wait while we update the sub account details.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
      formData.append("tag", "update_subaccount");
        formData.append("username", user.name)
      formData.append("id", updateFormData.id);
      formData.append("account", updateFormData.account_number);
      formData.append("plate", updateFormData.plate_number);

      const response = await axios.post(API_URL, formData);
      const data = response.data;

      if (data.success === 1) {
        setSubAccount((prev) => ({
          ...prev,
          id: updateFormData.id,
          account_number: updateFormData.account_number,
          plate_number: updateFormData.plate_number,
        }));

        await Swal.fire({
          icon: "success",
          title: "Updated",
          text: data.msg || "Sub account updated successfully.",
          confirmButtonColor: "#009245",
        });

        handleCloseUpdateModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: data.msg || "Something went wrong while updating the sub account.",
        });
      }
    } catch (error) {
      console.error("Update sub account error:", error.response?.data || error.message);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong while updating the sub account.",
      });
    } finally {
      setSubmittingUpdate(false);
    }
  };

  const handleDelete = async (account) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Sub Account?",
      text: `Account Number: ${account.account_number}`,
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
        title: "Deleting sub account...",
        html: "Please wait while we delete the sub account.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
      formData.append("tag", "delete_subaccount");
        formData.append("username", user.name)
      formData.append("id", account.id);

      const response = await axios.post(API_URL, formData);
      const data = response.data;

      if (data.success === 1) {
        setSubAccount(null);
        setMainAccount(null);
        setSearched(true);
        setMessage(data.msg || "Sub account deleted successfully.");

        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: data.msg || "Sub account deleted successfully.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: data.msg || "Something went wrong while deleting the sub account.",
        });
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Something went wrong while deleting the sub account.",
      });
    }
  };

  const renderActionButtons = (account) => {
    return (
      <div className="action-buttons">
        <Button
          variant="outline-dark"
          className="action-btn"
          onClick={() => handleOpenUpdateModal(account)}
        >
          <FaEdit size={14} />
        </Button>

        <Button
          variant="outline-danger"
          className="action-btn"
          onClick={() => handleDelete(account)}
        >
          <FaTrash size={14} />
        </Button>
      </div>
    );
  };

  return (
    <div className="main-accounts-page">
      <div className="page-header">
        <div>
          <h3 className="page-title">Sub Accounts</h3>
          <p className="page-subtitle">
            Search and view RFID sub account details with its linked main account
          </p>
        </div>
      </div>

      <Card className="top-card mb-4">
        <Card.Body className="p-4">
          <div className="search-panel">
            <div className="section-title">Search Sub Account</div>

            <Row className="g-3 align-items-end">
              <Col lg={3} md={4}>
                <Form.Group>
                  <Form.Label>Search By</Form.Label>
                  <Form.Select
                    value={searchCriteria}
                    onChange={(e) => setSearchCriteria(e.target.value)}
                    className="rounded-3"
                  >
                    <option value="account_number">Account Number</option>
                    <option value="plate_number">Plate Number</option>
                    <option value="email">Email</option>
                    <option value="gname">Alias</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col lg={6} md={5}>
                <Form.Group>
                  <Form.Label>Keyword</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0">
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter search value"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="border-start-0 rounded-end-3"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col lg={3} md={3}>
                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    className="w-100 rounded-3"
                    onClick={handleSearch}
                    disabled={loading || !searchValue.trim()}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        Searching...
                      </>
                    ) : (
                      "Search"
                    )}
                  </Button>

                  <Button
                    variant="outline-secondary"
                    className="rounded-3 px-3"
                    onClick={handleReset}
                    title="Reset"
                  >
                    <FaUndo />
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>

      {message && (
        <Alert
          variant={subAccount ? "success" : "warning"}
          className="rounded-4 border-0 shadow-sm"
        >
          {message}
        </Alert>
      )}

      {!searched && !loading && (
        <Card className="result-card">
          <Card.Body className="p-4">
            <div className="empty-state">
              <h6 className="mb-2">No data to display</h6>
              <div>Use the search filters above to find sub account records.</div>
            </div>
          </Card.Body>
        </Card>
      )}

      {searched && mainAccount && (
        <Card className="result-card mb-4">
          <Card.Body className="p-4">
            <div className="table-title">Main Account Overview</div>

            <div className="account-summary">
              <div className="summary-box">
                <div className="summary-label">Account Number</div>
                <div className="summary-value">{mainAccount.account_number}</div>
              </div>
              <div className="summary-box">
                <div className="summary-label">Plate Number</div>
                <div className="summary-value">{mainAccount.plate_number}</div>
              </div>
              <div className="summary-box">
                <div className="summary-label">Alias</div>
                <div className="summary-value">{mainAccount.gname || "-"}</div>
              </div>
              <div className="summary-box">
                <div className="summary-label">Email</div>
                <div className="summary-value">{mainAccount.email}</div>
              </div>
              <div className="summary-box">
                <div className="summary-label">Status</div>
                <div className="summary-value">
                  {getStatusBadge(mainAccount.active)}
                </div>
              </div>
              <div className="summary-box">
                <div className="summary-label">Date Created</div>
                <div className="summary-value">{mainAccount.created_at}</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {searched && subAccount && (
        <Card className="result-card">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="table-title mb-0">Sub Account Details</div>
              <Badge bg="light" text="dark" pill>
                1 Record
              </Badge>
            </div>

            <div className="table-responsive">
              <Table className="custom-table align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Account Number</th>
                    <th>Plate Number</th>
                    <th>Email</th>
                    <th>Alias</th>
                    <th>Date Created</th>
                    <th className="action-cell">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{subAccount.id}</td>
                    <td>{subAccount.account_number}</td>
                    <td>{subAccount.plate_number}</td>
                    <td>{subAccount.email}</td>
                    <td>{subAccount.gname || "-"}</td>
                    <td>{subAccount.created_at}</td>
                    <td className="action-cell">{renderActionButtons(subAccount)}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      <UpdateSubAccountModal
        show={showUpdateModal}
        onHide={handleCloseUpdateModal}
        formData={updateFormData}
        setFormData={setUpdateFormData}
        onSubmitUpdateSubAccount={handleSubmitUpdateSubAccount}
        submitting={submittingUpdate}
      />
    </div>
  );
}