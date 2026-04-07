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
  InputGroup,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import { FaSearch, FaUndo } from "react-icons/fa";
import "../../assets/styles/mainaccount.css";
import { API_URL } from "../../constants/urls";

export default function AMS() {

   const user = JSON.parse(localStorage.getItem("user")) || {};
  const username = user.name || "Admin User";

  const [loadingAccount, setLoadingAccount] = useState(false);
  const [loadingPlate, setLoadingPlate] = useState(false);

  const [accountValue, setAccountValue] = useState("");
  const [plateValue, setPlateValue] = useState("");

  const [searchedAccount, setSearchedAccount] = useState(false);
  const [searchedPlate, setSearchedPlate] = useState(false);

  const [accountResult, setAccountResult] = useState(null);
  const [plateResult, setPlateResult] = useState(null);

  const [accountMessage, setAccountMessage] = useState("");
  const [plateMessage, setPlateMessage] = useState("");

  const isSuccess = (data) => {
    return data?.success === 1 || data?.succcess === 1;
  };

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    return date.toLocaleString();
  };

  const getFullName = (result) => {
    const fname = result?.fname || "";
    const lname = result?.lname || "";
    const fullname = `${fname} ${lname}`.trim();
    return fullname || "-";
  };

  const getStatusBadge = (status) => {
    const value = String(status || "").trim().toLowerCase();

    if (value === "active") {
      return (
        <Badge bg="success" pill>
          {status || "Active"}
        </Badge>
      );
    }

    return (
      <Badge bg="danger" pill>
        {status || "Unknown"}
      </Badge>
    );
  };

  const handleSearchByAccount = async () => {
    try {
      setLoadingAccount(true);
      setSearchedAccount(false);
      setAccountResult(null);
      setAccountMessage("");

      const formData = new FormData();
      formData.append("tag", "checkams");
      formData.append("username", user.name)
      formData.append("search", "ACT");
      formData.append("value", accountValue);

      const response = await axios.post(API_URL, formData);
      const data = response.data;

      setSearchedAccount(true);

      if (isSuccess(data)) {
        setAccountResult(data);
        setAccountMessage(data.msg || "Record found.");
      } else {
        setAccountMessage(data.msg || "No account record found.");
      }
    } catch (error) {
      console.error("Search by account error:", error.response?.data || error.message);
      setSearchedAccount(true);
      setAccountMessage("Something went wrong while searching by account.");
    } finally {
      setLoadingAccount(false);
    }
  };

  const handleSearchByPlate = async () => {
    try {
      setLoadingPlate(true);
      setSearchedPlate(false);
      setPlateResult(null);
      setPlateMessage("");

      const formData = new FormData();
      formData.append("tag", "checkams");
      formData.append("username", user.name)
      formData.append("search", "PLT");
      formData.append("value", plateValue);

      const response = await axios.post(API_URL, formData);
      const data = response.data;

      setSearchedPlate(true);

      if (isSuccess(data)) {
        setPlateResult(data);
        setPlateMessage(data.msg || "Record found.");
      } else {
        setPlateMessage(data.msg || "No plate record found.");
      }
    } catch (error) {
      console.error("Search by plate error:", error.response?.data || error.message);
      setSearchedPlate(true);
      setPlateMessage("Something went wrong while searching by plate.");
    } finally {
      setLoadingPlate(false);
    }
  };

  const handleResetAccount = () => {
    setAccountValue("");
    setSearchedAccount(false);
    setAccountResult(null);
    setAccountMessage("");
    setLoadingAccount(false);
  };

  const handleResetPlate = () => {
    setPlateValue("");
    setSearchedPlate(false);
    setPlateResult(null);
    setPlateMessage("");
    setLoadingPlate(false);
  };

  const renderResultTable = (result, type) => {
    if (!result) return null;

    return (
      <Card className="result-card mt-3">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div className="table-title">
              {type === "account" ? "Search by Account Result" : "Search by Plate Result"}
            </div>

            <Badge bg="light" text="dark" pill>
              AMS Record
            </Badge>
          </div>

          <div className="account-summary mb-4">
            <div className="summary-box">
              <div className="summary-label">Full Name</div>
              <div className="summary-value">{getFullName(result)}</div>
            </div>

            <div className="summary-box">
              <div className="summary-label">Account ID</div>
              <div className="summary-value">{result.accountid || "-"}</div>
            </div>

            <div className="summary-box">
              <div className="summary-label">Plate Number</div>
              <div className="summary-value">{result.platenumber || "-"}</div>
            </div>

            <div className="summary-box">
              <div className="summary-label">Balance</div>
              <div className="summary-value">
                ₱ {Number(result.balance || 0).toLocaleString()}
              </div>
            </div>

            <div className="summary-box">
              <div className="summary-label">Account Status</div>
              <div className="summary-value">
                {getStatusBadge(result.account_status)}
              </div>
            </div>

            <div className="summary-box">
              <div className="summary-label">Tag Status</div>
              <div className="summary-value">
                {getStatusBadge(result.tag_status)}
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <Table className="custom-table align-middle">
              <tbody>
                <tr>
                  <th style={{ width: "35%" }}>First Name</th>
                  <td>{result.fname || "-"}</td>
                </tr>
                <tr>
                  <th>Last Name</th>
                  <td>{result.lname || "-"}</td>
                </tr>
                <tr>
                  <th>Business Name</th>
                  <td>{result.businessname?.trim() || "-"}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{result.email || "-"}</td>
                </tr>
                <tr>
                  <th>Account ID</th>
                  <td>{result.accountid || "-"}</td>
                </tr>
                <tr>
                  <th>Plate Number</th>
                  <td>{result.platenumber || "-"}</td>
                </tr>
                <tr>
                  <th>ATG Plate Number</th>
                  <td>{result.atgplatenumber || "-"}</td>
                </tr>
                <tr>
                  <th>Balance</th>
                  <td>₱ {Number(result.balance || 0).toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Account Status</th>
                  <td>{getStatusBadge(result.account_status)}</td>
                </tr>
                <tr>
                  <th>Account Type</th>
                  <td>{result.account_type || "-"}</td>
                </tr>
                <tr>
                  <th>Tag Status</th>
                  <td>{getStatusBadge(result.tag_status)}</td>
                </tr>
                <tr>
                  <th>Vehicle Make</th>
                  <td>{result.vmake || "-"}</td>
                </tr>
                <tr>
                  <th>Vehicle Model</th>
                  <td>{result.vmodel || "-"}</td>
                </tr>
                <tr>
                  <th>Vehicle Year</th>
                  <td>{result.vyear || "-"}</td>
                </tr>
                <tr>
                  <th>Vehicle Color</th>
                  <td>{result.vcolor || "-"}</td>
                </tr>
                <tr>
                  <th>Date Enrolled</th>
                  <td>{formatDate(result.date_enrolled)}</td>
                </tr>
                <tr>
                  <th>Last Transaction</th>
                  <td>{formatDate(result.last_transaction)}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="main-accounts-page">
      <div className="page-header">
        <div>
          <h3 className="page-title">AMS Comparison</h3>
          <p className="page-subtitle">
            Compare AMS records side by side by account number and plate number
          </p>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="top-card h-100">
            <Card.Body className="p-4">
              <div className="search-panel">
                <div className="section-title">Search by Account</div>

                <Row className="g-3 align-items-end">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Account Number</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-white border-end-0">
                          <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Enter account number"
                          value={accountValue}
                          onChange={(e) => setAccountValue(e.target.value)}
                          className="border-start-0 rounded-end-3"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        className="w-100 rounded-3"
                        onClick={handleSearchByAccount}
                        disabled={loadingAccount || !accountValue.trim()}
                      >
                        {loadingAccount ? (
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
                        onClick={handleResetAccount}
                      >
                        <FaUndo />
                      </Button>
                    </div>
                  </Col>
                </Row>

                {accountMessage && (
                  <Alert
                    variant={accountResult ? "success" : "warning"}
                    className="rounded-4 border-0 shadow-sm mt-3 mb-0"
                  >
                    {accountMessage}
                  </Alert>
                )}

                {!searchedAccount && !loadingAccount && (
                  <Card className="result-card mt-3">
                    <Card.Body className="p-4">
                      <div className="empty-state">
                        <h6 className="mb-2">No account search yet</h6>
                        <div>Search an account number to display AMS result.</div>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {searchedAccount && renderResultTable(accountResult, "account")}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="top-card h-100">
            <Card.Body className="p-4">
              <div className="search-panel">
                <div className="section-title">Search by Plate</div>

                <Row className="g-3 align-items-end">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Plate Number</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-white border-end-0">
                          <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Enter plate number"
                          value={plateValue}
                          onChange={(e) => setPlateValue(e.target.value)}
                          className="border-start-0 rounded-end-3"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        className="w-100 rounded-3"
                        onClick={handleSearchByPlate}
                        disabled={loadingPlate || !plateValue.trim()}
                      >
                        {loadingPlate ? (
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
                        onClick={handleResetPlate}
                      >
                        <FaUndo />
                      </Button>
                    </div>
                  </Col>
                </Row>

                {plateMessage && (
                  <Alert
                    variant={plateResult ? "success" : "warning"}
                    className="rounded-4 border-0 shadow-sm mt-3 mb-0"
                  >
                    {plateMessage}
                  </Alert>
                )}

                {!searchedPlate && !loadingPlate && (
                  <Card className="result-card mt-3">
                    <Card.Body className="p-4">
                      <div className="empty-state">
                        <h6 className="mb-2">No plate search yet</h6>
                        <div>Search a plate number to display AMS result.</div>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {searchedPlate && renderResultTable(plateResult, "plate")}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}