import { useEffect, useState } from "react";
import { Card, Row, Col, Table, Badge, ProgressBar, Spinner, Alert } from "react-bootstrap";
import {
  FiUsers,
  FiFileText,
  FiLock,
  FiLayers,
  FiActivity,
  FiCheckCircle,
  FiBarChart2,
} from "react-icons/fi";
import axios from "axios";
import { DASHBOARD_URL } from "../../constants/urls";

export default function Home() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("tag", "dashboard_summary");

      const response = await axios.post(DASHBOARD_URL, formData);
      const data = response.data;

      if (data.success === 1) {
        setDashboardData(data.data || null);
      } else {
        setMessage(data.msg || "Unable to load dashboard data.");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error.response?.data || error.message);
      setMessage("Something went wrong while loading dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString();
  };

  const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    return date.toLocaleString();
  };

  const getStatusBadge = (status) => {
    if (status === "Completed") {
      return (
        <Badge bg="success" pill>
          {status}
        </Badge>
      );
    }

    if (status === "Pending Review") {
      return (
        <Badge bg="warning" text="dark" pill>
          {status}
        </Badge>
      );
    }

    return (
      <Badge bg="secondary" pill>
        {status || "Completed"}
      </Badge>
    );
  };

  const stats = [
    {
      title: "Main Accounts Added",
      value: formatNumber(dashboardData?.stats?.main_accounts_month),
      subtitle: "Added this month",
      icon: <FiUsers size={22} />,
    },
    {
      title: "Sub Accounts Added",
      value: formatNumber(dashboardData?.stats?.sub_accounts_month),
      subtitle: "Added this month",
      icon: <FiLayers size={22} />,
    },
    {
      title: "SOA Requests",
      value: formatNumber(dashboardData?.stats?.soa_requests_month),
      subtitle: "Downloaded this month",
      icon: <FiFileText size={22} />,
    },
    {
      title: "Locked Accounts",
      value: formatNumber(dashboardData?.stats?.locked_accounts),
      subtitle: "Accounts needing review",
      icon: <FiLock size={22} />,
    },
  ];

  const recentActivities = dashboardData?.recent_activities || [];
  const activityOverview = dashboardData?.activity_overview || {};
  const accountHealth = dashboardData?.account_health || {};
  const supportSummary = dashboardData?.support_summary || {};

  return (
    <div className="dashboard-home-page">
      {message && (
        <Alert variant="warning" className="rounded-4 border-0 shadow-sm">
          {message}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {/* Top Statistics */}
          <Row className="g-4 mb-4">
            {stats.map((item, index) => (
              <Col xl={3} md={6} key={index}>
                <Card className="border-0 shadow-sm rounded-4 h-100 stat-card">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="stat-icon-box">{item.icon}</div>
                    </div>
                    <div className="text-muted small mb-1">{item.title}</div>
                    <h3 className="fw-bold mb-1">{item.value}</h3>
                    <div className="text-muted small">{item.subtitle}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Middle Content */}
          <Row className="g-4 mb-4">
            {/* RFID Activity Overview */}
            <Col lg={8}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-bold">RFID Activity Overview</h5>
                    <Badge bg="light" text="dark" pill>
                      Today
                    </Badge>
                  </div>

                  <div className="activity-metrics">
                    <div className="activity-item">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="activity-title">Balance Inquiries</div>
                        <FiBarChart2 className="text-success" />
                      </div>
                      <div className="activity-value">
                        {formatNumber(activityOverview.balance_inquiries_today)}
                      </div>
                      <div className="activity-sub text-muted small">
                        Customer balance checks today
                      </div>
                    </div>

                    <div className="activity-item">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="activity-title">SOA Requests</div>
                        <FiFileText className="text-success" />
                      </div>
                      <div className="activity-value">
                        {formatNumber(activityOverview.soa_requests_today)}
                      </div>
                      <div className="activity-sub text-muted small">
                        SOA downloads processed today
                      </div>
                    </div>

                    <div className="activity-item">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="activity-title">Password Resets</div>
                        <FiLock className="text-success" />
                      </div>
                      <div className="activity-value">
                        {formatNumber(activityOverview.password_resets_today)}
                      </div>
                      <div className="activity-sub text-muted small">
                        Customer portal resets today
                      </div>
                    </div>

                    <div className="activity-item">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="activity-title">Account Updates</div>
                        <FiUsers className="text-success" />
                      </div>
                      <div className="activity-value">
                        {formatNumber(activityOverview.account_updates_today)}
                      </div>
                      <div className="activity-sub text-muted small">
                        Includes status and detail changes
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Account Health */}
            <Col lg={4}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-bold">Account Health</h5>
                    <FiActivity size={18} />
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Active Accounts</span>
                      <span className="fw-semibold">
                        {accountHealth.active_percent || 0}%
                      </span>
                    </div>
                    <ProgressBar
                      now={accountHealth.active_percent || 0}
                      variant="success"
                      className="rounded-pill"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Locked Accounts</span>
                      <span className="fw-semibold">
                        {accountHealth.locked_percent || 0}%
                      </span>
                    </div>
                    <ProgressBar
                      now={accountHealth.locked_percent || 0}
                      variant="danger"
                      className="rounded-pill"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Inactive Accounts</span>
                      <span className="fw-semibold">
                        {accountHealth.inactive_percent || 0}%
                      </span>
                    </div>
                    <ProgressBar
                      now={accountHealth.inactive_percent || 0}
                      variant="secondary"
                      className="rounded-pill"
                    />
                  </div>

                  <div className="dashboard-note-box">
                    <div className="d-flex align-items-start gap-2">
                      <FiCheckCircle className="mt-1 text-success" />
                      <div className="small text-muted">
                        Locked accounts should be prioritized for support review,
                        especially when related to login, access, or portal password concerns.
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Bottom Content */}
          <Row className="g-4">
            {/* Recent Activities */}
            <Col lg={8}>
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h5 className="mb-0 fw-bold">Recent Support Activities</h5>
                    <Badge bg="light" text="dark" pill>
                      Latest
                    </Badge>
                  </div>

                  <div className="table-responsive">
                    <Table className="custom-table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Agent</th>
                          <th>Action</th>
                          <th>Account</th>
                          <th>Status</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentActivities.length > 0 ? (
                          recentActivities.map((item, index) => (
                            <tr key={index}>
                              <td>{item.agent}</td>
                              <td>{item.action}</td>
                              <td>{item.account}</td>
                              <td>{getStatusBadge(item.status)}</td>
                              <td>{formatDateTime(item.time)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center text-muted py-4">
                              No recent activities found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Portal Support Summary */}
            <Col lg={4}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4">
                  <h5 className="mb-3 fw-bold">Portal Support Summary</h5>

                  <div className="support-summary-item">
                    <div className="summary-title">Password Resets</div>
                    <div className="summary-value">
                      {formatNumber(supportSummary.password_resets)} today
                    </div>
                  </div>

                  <div className="support-summary-item">
                    <div className="summary-title">Balance Inquiries</div>
                    <div className="summary-value">
                      {formatNumber(supportSummary.balance_inquiries)} today
                    </div>
                  </div>

                  <div className="support-summary-item">
                    <div className="summary-title">SOA Downloads</div>
                    <div className="summary-value">
                      {formatNumber(supportSummary.soa_downloads)} today
                    </div>
                  </div>

                  <div className="support-summary-item mb-0">
                    <div className="summary-title">Sub Account Updates</div>
                    <div className="summary-value">
                      {formatNumber(supportSummary.subaccount_updates)} today
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}