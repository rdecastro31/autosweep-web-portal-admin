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
  OverlayTrigger,
  Tooltip,
  Badge,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import {
  FaKey,
  FaWallet,
  FaFileDownload,
  FaTag,
  FaSearch,
  FaUndo,
  FaTrash,
  FaUnlock,
} from "react-icons/fa";
import Swal from "sweetalert2";
import "../../assets/styles/mainaccount.css";

import ResetPasswordModal from "../../components/modals/ResetPasswordModal";
import UpdateAliasModal from "../../components/modals/UpdateAliasModal";
import UpdateLockoutModal from "../../components/modals/UpdateLockoutModal";
import AddAccountModal from "../../components/modals/AddAccountModal";
import DownloadSOAModal from "../../components/modals/SOAModal";
import AddSubAccountModal from "../../components/modals/AddSubAccountModal";

import { API_URL } from "../../constants/urls";

export default function MainAccounts() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const username = user.name || "Admin User";

  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchCriteria, setSearchCriteria] = useState("account_number");
  const [searchValue, setSearchValue] = useState("");

  const [mainAccount, setMainAccount] = useState(null);
  const [subaccounts, setSubaccounts] = useState([]);
  const [message, setMessage] = useState("");

  // Reset Password States
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [resetSubmitting, setResetSubmitting] = useState(false);

  // Update Alias States
  const [alias, setAlias] = useState("");
  const [showAliasModal, setShowAliasModal] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [resetSubmittingAlias, setResetSubmittingAlias] = useState(false);

  // Update Lockout States
  const [lockout, setLockout] = useState("");
  const [showLockoutModal, setShowLockoutModal] = useState(false);
  const [resetSubmittingLockout, setResetSubmittingLockout] = useState(false);

  // Add Account Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingAdd, setSubmittingAdd] = useState(false);
  const [addFormData, setAddFormData] = useState({
    account_number: "",
    plate_number: "",
    email: "",
    name: "",
  });

  // SOA Modal
  const [submittingSOA, setSubmittingSOA] = useState(false);
  const [showSOAModal, setShowSOAModal] = useState(false);
  const [soaFormData, setSoaFormData] = useState({
    account_number: "",
    plate_number: "",
    from_date: "",
    to_date: "",
  });

  // Add Sub Account Modal
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [submittingAddSub, setSubmittingAddSub] = useState(false);
  const [addSubFormData, setAddSubFormData] = useState({
    main_account_id: "",
    email: "",
    account_number: "",
    plate_number: "",
    gname: "",
  });

  const handleOpenAddSubModal = () => {
    if (!mainAccount) return;

    setAddSubFormData({
      main_account_id: mainAccount.id || "",
      email: mainAccount.email || "",
      account_number: "",
      plate_number: "",
      gname: "",
    });

    setShowAddSubModal(true);
  };

  const handleCloseAddSubModal = () => {
    if (submittingAddSub) return;

    setShowAddSubModal(false);
    setAddSubFormData({
      main_account_id: "",
      email: "",
      account_number: "",
      plate_number: "",
      gname: "",
    });
  };

  const handleSubmitAddSubAccount = async () => {
    try {
      setSubmittingAddSub(true);

      if (!addSubFormData.account_number || !addSubFormData.plate_number) {
        Swal.fire({
          icon: "warning",
          title: "Missing Fields",
          text: "Account Number and Plate Number are required.",
        });
        return;
      }

      const formData = new FormData();
      formData.append("tag", "add_subaccount");
      formData.append("main_account_id", addSubFormData.main_account_id);
      formData.append("email", addSubFormData.email);
      formData.append("account", addSubFormData.account_number);
      formData.append("plate", addSubFormData.plate_number);
      formData.append("gname", addSubFormData.gname);
      formData.append("username", username);

      const response = await axios.post(API_URL, formData);
      const data = response.data;

      if (data.success === 1) {
        Swal.fire({
          icon: "success",
          title: "Sub-Account Added",
          text: data.msg || "Sub-account successfully added.",
        });

        setShowAddSubModal(false);
        await handleSearch();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.msg || "Unable to add sub-account.",
        });
      }
    } catch (error) {
      console.error("Add sub-account error:", error.response?.data || error.message);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while adding the sub-account.",
      });
    } finally {
      setSubmittingAddSub(false);
    }
  };

  const handleOpenSOA = (account) => {
    setSoaFormData({
      account_number: account.account_number,
      plate_number: account.plate_number,
      from_date: "",
      to_date: "",
    });
    setShowSOAModal(true);
  };

  const handleDownloadSOA = async () => {
    try {
      setSubmittingSOA(true);

      const formData = new FormData();
      formData.append("tag", "requestsoa");
      formData.append("username", username);
      formData.append("account", soaFormData.account_number);
      formData.append("plate", soaFormData.plate_number);
      formData.append("fromDate", soaFormData.from_date);
      formData.append("toDate", soaFormData.to_date);

      const response = await axios.post(API_URL, formData, {
        responseType: "blob",
      });

      const contentType = response.headers["content-type"] || "";

      if (!contentType.includes("application/pdf")) {
        const text = await response.data.text();

        console.log("Server response:", text);

        Swal.fire({
          icon: "error",
          title: "Download Failed",
          text: "The server did not return a PDF file.",
        });
        return;
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `SOA-${soaFormData.account_number}-${soaFormData.plate_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: "SOA Downloaded",
        text: "Your SOA has now been downloaded",
      });
    } catch (error) {
      console.error("SOA download error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while downloading the SOA.",
      });
    } finally {
      setSubmittingSOA(false);
      setShowSOAModal(false);
    }
  };

  const handleSubmitAddAccount = async () => {
    try {
      setSubmittingAdd(true);

      if (!/^\d{1,9}$/.test(addFormData.account_number)) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Account Number",
          text: "Account Number must be numeric and up to 9 digits only.",
        });
        return;
      }

      const formData = new FormData();
      formData.append("tag", "add_account");
      formData.append("username", username);
      formData.append("account", addFormData.account_number);
      formData.append("plate", addFormData.plate_number);
      formData.append("email", addFormData.email);
      formData.append("accountName", addFormData.name);

      const response = await axios.post(API_URL, formData);
      const data = response.data;

      if (data.success === 1) {
        Swal.fire({
          icon: "success",
          title: "Account Added",
          text: data.message || "New account successfully created",
        });

        setShowAddModal(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.message || "Unable to add account",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
      });
    } finally {
      setSubmittingAdd(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setMessage("");
      setMainAccount(null);
      setSubaccounts([]);

      const formData = new FormData();
      formData.append("tag", "search");
      formData.append("username", username);
      formData.append("search", searchCriteria);
      formData.append("value", searchValue);

      const response = await axios.post(API_URL, formData);
      const data = response.data;

      setSearched(true);

      if (data.success === 1) {
        setMainAccount({
          id: data.id,
          name: data.name,
          account_number: data.account_number,
          plate_number: data.plate_number,
          email: data.email,
          created_at: data.created_at,
          active: data.active,
          gname: data.gname,
        });

        setSubaccounts(data.subaccounts || []);
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
    setSubaccounts([]);
    setMessage("");
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

  const handleCloseResetModal = () => {
    if (resetSubmitting) return;

    setShowResetModal(false);
    setResetEmail("");
    setGeneratedPassword("");
    setSelectedAccount(null);
    setAccountType("");
  };

  const handleResetPassword = (account, type) => {
    setSelectedAccount(account);
    setResetEmail(account.email || "");
    setGeneratedPassword(generatePassword());
    setAccountType(type);
    setShowResetModal(true);
  };

  const handleGeneratePassword = () => {
    setGeneratedPassword(generatePassword());
  };

  const handleSubmitResetPassword = async () => {
    try {
      if (!generatedPassword || generatedPassword.trim().length < 6) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Password",
          text: "Password must be at least 6 characters long.",
        });
        return;
      }

      setResetSubmitting(true);

      Swal.fire({
        title: "Resetting password...",
        html: "Please wait while we update the password and send the email.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
      formData.append("tag", "resetpassword");
      formData.append("username", username);
      formData.append("email", resetEmail);
      formData.append("password", generatedPassword);

      const response = await axios.post(API_URL, formData);
      const data = response.data;

      if (data.success === 1) {
        await Swal.fire({
          icon: "success",
          title: "Password Updated",
          text: "Password successfully sent to customer's email.",
          confirmButtonColor: "#009245",
        });

        handleCloseResetModal();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Password Update Error",
          text: data.msg || "Something went wrong while resetting the password.",
          confirmButtonColor: "red",
        });
      }
    } catch (error) {
      console.error("Reset password error:", error.response?.data || error.message);

      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: "Something went wrong while resetting the password.",
      });
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleCloseAliasModal = () => {
    setShowAliasModal(false);
    setAlias("");
    setSelectedAccount(null);
    setAccountType("");
  };

  const handleAlias = (account, type) => {
    setSelectedAccount(account);
    setAccountType(type);
    setAlias(account.gname || "");
    setShowAliasModal(true);
  };

  const handleSubmitUpdateAlias = async () => {
    try {
      if (!selectedAccount) return;

      setResetSubmittingAlias(true);

      Swal.fire({
        title: "Updating Alias...",
        html: "Please wait while we update the alias of this account.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
      formData.append("tag", "update_alias");
      formData.append("username", username);
      formData.append("id", selectedAccount.id);
      formData.append("alias", alias);
      formData.append("account_type", accountType);

      const response = await axios.post(API_URL, formData);
      const data = response.data;

      if (data.success === 1) {
        if (accountType === "main") {
          setMainAccount((prev) => ({
            ...prev,
            gname: alias,
          }));
        }

        if (accountType === "sub") {
          setSubaccounts((prev) =>
            prev.map((item) =>
              item.id === selectedAccount.id ? { ...item, gname: alias } : item
            )
          );
        }

        await Swal.fire({
          icon: "success",
          title: "Alias Updated",
          text: data.msg || "Alias successfully updated.",
          confirmButtonColor: "#009245",
        });

        handleCloseAliasModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Alias Update Error",
          text: data.msg || "Something went wrong while updating the alias.",
          confirmButtonColor: "red",
        });
      }
    } catch (error) {
      console.error("Alias update error:", error.response?.data || error.message);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong while updating the alias.",
      });
    } finally {
      setResetSubmittingAlias(false);
    }
  };

  const handleLockout = (account, type) => {
    setSelectedAccount(account);
    setAccountType(type);
    setLockout(String(account.active || "0"));
    setShowLockoutModal(true);
  };

  const handleCloseLockoutModal = () => {
    setShowLockoutModal(false);
    setLockout("");
    setSelectedAccount(null);
    setAccountType("");
  };

  const handleSubmitUpdateLockout = async () => {
    try {
      if (!selectedAccount) return;

      setResetSubmittingLockout(true);

      Swal.fire({
        title: "Updating Status...",
        html: "Please wait while we update the account status.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
      formData.append("tag", "update_lockout");
      formData.append("username", username);
      formData.append("email", selectedAccount.email);
      formData.append("active_status", lockout);

      const response = await axios.post(API_URL, formData);
      const data = response.data;

      if (data.success === 1) {
        if (accountType === "main") {
          setMainAccount((prev) => ({
            ...prev,
            active: lockout,
          }));
        }

        if (accountType === "sub") {
          setSubaccounts((prev) =>
            prev.map((item) =>
              item.id === selectedAccount.id ? { ...item, active: lockout } : item
            )
          );
        }

        await Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: data.message || "Account status successfully updated.",
          confirmButtonColor: "#009245",
        });

        handleCloseLockoutModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Status Update Error",
          text: data.msg || "Something went wrong while updating the status.",
          confirmButtonColor: "red",
        });
      }
    } catch (error) {
      console.error("Lockout update error:", error.response?.data || error.message);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong while updating the account status.",
      });
    } finally {
      setResetSubmittingLockout(false);
    }
  };

  const handleCheckBalance = async (account, type) => {
    try {
      Swal.fire({
        title: "Checking balance...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
      formData.append("tag", "checkbalance");
      formData.append("username", username);
      formData.append("account", account.account_number);
      formData.append("plate", account.plate_number);

      const response = await axios.post(API_URL, formData);
      const data = response.data;

      if (data.success === 1) {
        Swal.fire({
          icon: "success",
          title: type === "main" ? "Main Account Balance" : "Sub Account Balance",
          html: `
            <div style="text-align:center;">
              <p style="margin:0;font-size:14px;color:#6c757d;">
                ${data.message || "Account found and validated"}
              </p>
              <div style="margin-top:12px;font-size:32px;font-weight:700;color:#009245;">
                ₱ ${Number(data.account_balance || 0).toLocaleString()}
              </div>
            </div>
          `,
          confirmButtonText: "OK",
          confirmButtonColor: "gray",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Unable to Check Balance",
          text: data.message || data.msg || "Account not found.",
          confirmButtonColor: "#0d6efd",
        });
      }
    } catch (error) {
      console.error("Check balance error:", error.response?.data || error.message);

      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text:
          error.response?.data?.message ||
          error.response?.data?.msg ||
          "Something went wrong while checking balance.",
        confirmButtonColor: "#0d6efd",
      });
    }
  };

  const handleDelete = async (account, type) => {
    const result = await Swal.fire({
      icon: "warning",
      title: type === "main" ? "Delete Main Account?" : "Delete Sub Account?",
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
        title: "Deleting account...",
        html: "Please wait while we delete the account.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
      formData.append("tag", "delete_account");
      formData.append("username", username);
      formData.append("id", account.id);
      formData.append("accountType", type);

      const response = await axios.post(API_URL, formData);
      const data = response.data;

      if (data.success === 1) {
        if (type === "main") {
          setMainAccount(null);
          setSubaccounts([]);
          setSearched(true);
          setMessage(data.msg || "Main account deleted successfully.");
        } else {
          setSubaccounts((prev) => prev.filter((item) => item.id !== account.id));
          setMessage(data.msg || "Sub account deleted successfully.");
        }

        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: data.msg || "Account deleted successfully.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: data.msg || "Something went wrong while deleting the account.",
        });
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Something went wrong while deleting the account.",
      });
    }
  };

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

  const renderActionButtons = (account, type = "sub") => {
    return (
      <div className="action-buttons">
        {type === "main" && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-reset-${account.id}`}>Reset Password</Tooltip>}
          >
            <Button
              variant="outline-warning"
              className="action-btn"
              onClick={() => handleResetPassword(account, type)}
            >
              <FaKey size={14} />
            </Button>
          </OverlayTrigger>
        )}

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-balance-${account.id}`}>Check Balance</Tooltip>}
        >
          <Button
            variant="outline-success"
            className="action-btn"
            onClick={() => handleCheckBalance(account, type)}
          >
            <FaWallet size={14} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-soa-${account.id}`}>Download SOA</Tooltip>}
        >
          <Button
            variant="outline-primary"
            className="action-btn"
            onClick={() => handleOpenSOA(account)}
          >
            <FaFileDownload size={14} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-alias-${account.id}`}>Alias</Tooltip>}
        >
          <Button
            variant="outline-dark"
            className="action-btn"
            onClick={() => handleAlias(account, type)}
          >
            <FaTag size={14} />
          </Button>
        </OverlayTrigger>

        {type === "main" && String(account.active) !== "1" && (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-lockout-${account.id}`}>
                {String(account.active) === "2" ? "Unlock Account" : "Activate Account"}
              </Tooltip>
            }
          >
            <Button
              variant="outline-secondary"
              className="action-btn"
              onClick={() => handleLockout(account, type)}
            >
              <FaUnlock size={14} />
            </Button>
          </OverlayTrigger>
        )}

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-delete-${account.id}`}>Delete</Tooltip>}
        >
          <Button
            variant="outline-danger"
            className="action-btn"
            onClick={() => handleDelete(account, type)}
          >
            <FaTrash size={14} />
          </Button>
        </OverlayTrigger>
      </div>
    );
  };

  return (
    <div className="main-accounts-page">
      <div className="page-header">
        <div>
          <h3 className="page-title">Main Accounts</h3>
          <p className="page-subtitle">Search and manage RFID main customer accounts</p>
        </div>

        <Button
          variant="success"
          className="px-4 rounded-pill"
          onClick={() => setShowAddModal(true)}
        >
          Enroll to Main Account
        </Button>
      </div>

      <Card className="top-card mb-4">
        <Card.Body className="p-4">
          <div className="search-panel">
            <div className="section-title">Search Account</div>

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
                    <option value="name">Customer Name</option>
                    <option value="email">Email</option>
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
          variant={mainAccount ? "success" : "warning"}
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
              <div>Use the search filters above to find records.</div>
            </div>
          </Card.Body>
        </Card>
      )}

      {searched && mainAccount && (
        <>
          <Card className="result-card mb-4">
            <Card.Body className="p-4">
              <div className="table-title">Main Account Overview</div>

              <div className="account-summary">
                <div className="summary-box">
                  <div className="summary-label">Account Number</div>
                  <div className="summary-value">{mainAccount.account_number}</div>
                </div>
                <div className="summary-box">
                  <div className="summary-label">Customer Name</div>
                  <div className="summary-value">{mainAccount.name}</div>
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
                  <div className="summary-value">{getStatusBadge(mainAccount.active)}</div>
                </div>
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
                      <th>Status</th>
                      <th>Date Created</th>
                      <th className="action-cell">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{mainAccount.id}</td>
                      <td>{mainAccount.account_number}</td>
                      <td>{mainAccount.plate_number}</td>
                      <td>{mainAccount.email}</td>
                      <td>{mainAccount.gname || "-"}</td>
                      <td>{getStatusBadge(mainAccount.active)}</td>
                      <td>{mainAccount.created_at}</td>
                      <td className="action-cell">
                        {renderActionButtons(mainAccount, "main")}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          <Card className="result-card">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div className="table-title mb-0">Subaccounts</div>

                <div className="d-flex align-items-center gap-2">
                  <Badge bg="light" text="dark" pill>
                    {subaccounts.length} Record{subaccounts.length !== 1 ? "s" : ""}
                  </Badge>

                  <Button
                    variant="success"
                    className="rounded-pill px-3"
                    onClick={handleOpenAddSubModal}
                  >
                    Add Sub-Account
                  </Button>
                </div>
              </div>

              <div className="table-responsive">
                <Table className="custom-table align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>ID</th>
                      <th>Account Number</th>
                      <th>Plate Number</th>
                      <th>Email</th>
                      <th>Alias</th>
                      <th>Status</th>
                      <th>Date Created</th>
                      <th className="action-cell">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subaccounts.length > 0 ? (
                      subaccounts.map((sub, index) => (
                        <tr key={sub.id}>
                          <td>{index + 1}</td>
                          <td>{sub.id}</td>
                          <td>{sub.account_number}</td>
                          <td>{sub.plate_number}</td>
                          <td>{sub.email}</td>
                          <td>{sub.gname || "-"}</td>
                          <td>{getStatusBadge(sub.active)}</td>
                          <td>{sub.created_at}</td>
                          <td className="action-cell">
                            {renderActionButtons(sub, "sub")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center text-muted py-4">
                          No subaccounts found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </>
      )}

      <ResetPasswordModal
        show={showResetModal}
        onHide={handleCloseResetModal}
        resetEmail={resetEmail}
        generatedPassword={generatedPassword}
        setGeneratedPassword={setGeneratedPassword}
        onGeneratePassword={handleGeneratePassword}
        onSubmitResetPassword={handleSubmitResetPassword}
        resetSubmitting={resetSubmitting}
      />

      <UpdateAliasModal
        show={showAliasModal}
        onHide={handleCloseAliasModal}
        onSubmitUpdateAlias={handleSubmitUpdateAlias}
        resetSubmitting={resetSubmittingAlias}
        alias={alias}
        setAlias={setAlias}
      />

      <UpdateLockoutModal
        show={showLockoutModal}
        onHide={handleCloseLockoutModal}
        lockout={lockout}
        setLockout={setLockout}
        resetSubmittingLockout={resetSubmittingLockout}
        onSubmitUpdateLockout={handleSubmitUpdateLockout}
      />

      <AddAccountModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        formData={addFormData}
        setFormData={setAddFormData}
        onSubmitAddAccount={handleSubmitAddAccount}
        submitting={submittingAdd}
      />

      <DownloadSOAModal
        show={showSOAModal}
        onHide={() => setShowSOAModal(false)}
        formData={soaFormData}
        setFormData={setSoaFormData}
        onSubmitDownloadSOA={handleDownloadSOA}
        submitting={submittingSOA}
      />

      <AddSubAccountModal
        show={showAddSubModal}
        onHide={handleCloseAddSubModal}
        formData={addSubFormData}
        setFormData={setAddSubFormData}
        onSubmitAddSubAccount={handleSubmitAddSubAccount}
        submitting={submittingAddSub}
      />
    </div>
  );
}