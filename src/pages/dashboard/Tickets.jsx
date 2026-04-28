import { useEffect, useState } from "react";
import { Card, Row, Col, Table, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import {
  FiFileText,
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
  FiFlag,
} from "react-icons/fi";

import "../../assets/styles/tickets.css";
import { TICKET_URL } from "../../constants/urls";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const totalPages = Math.ceil(total / limit);

  const fetchTickets = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("tag", "getall");
      formData.append("page", pageNumber);
      formData.append("limit", limit);
      formData.append("search", search.trim());
      formData.append("status", statusFilter);
      formData.append("priority", priorityFilter);
      formData.append("assigned_to", "");

      const res = await axios.post(TICKET_URL, formData);

      console.log("Tickets API Response:", res.data);

      if (res.data.success === 1) {
        setTickets(res.data.data || []);
        setTotal(Number(res.data.total || 0));
        setPage(Number(res.data.page || pageNumber));
      } else {
        setTickets([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Fetch tickets error:", error);
      setTickets([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTickets(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [search, statusFilter, priorityFilter]);

  const stats = [
    {
      title: "Total Tickets",
      value: total,
      subtitle: "Current filtered records",
      icon: <FiFileText size={22} />,
    },
    {
      title: "Open",
      value: "-",
      subtitle: "Needs action",
      icon: <FiAlertCircle size={22} />,
    },
    {
      title: "In Progress",
      value: "-",
      subtitle: "Currently handled",
      icon: <FiClock size={22} />,
    },
    {
      title: "Closed",
      value: "-",
      subtitle: "Completed tickets",
      icon: <FiCheckCircle size={22} />,
    },
    {
      title: "High Priority",
      value: "-",
      subtitle: "Urgent concerns",
      icon: <FiFlag size={22} />,
    },
  ];

  const getStatusBadge = (status) => {
    const cls =
      status === "Open"
        ? "badge-open"
        : status === "In Progress"
        ? "badge-progress"
        : status === "Closed"
        ? "badge-closed"
        : "";

    return <span className={`badge ${cls}`}>{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    const cls =
      priority === "High"
        ? "badge-high"
        : priority === "Medium"
        ? "badge-medium"
        : priority === "Low"
        ? "badge-low"
        : "";

    return <span className={`badge ${cls}`}>{priority}</span>;
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchTickets(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchTickets(page + 1);
    }
  };

  return (
    <div className="tickets-page">
      <div className="tickets-header">
        <div>
          <h1>Ticket Management</h1>
          <p>
            Manage customer complaints, portal issues, and uncredited load
            concerns.
          </p>
        </div>

        <button type="button" className="btn-create-ticket">
          + Create Ticket
        </button>
      </div>

      <Row className="g-4 mb-4 row-cols-1 row-cols-md-2 row-cols-xl-5">
        {stats.map((item, index) => (
          <Col key={index}>
            <Card className="border-0 shadow-sm rounded-4 h-100 ticket-stat-card">
              <Card.Body className="p-4">
                <div className="ticket-icon-box">{item.icon}</div>
                <div className="text-muted small mb-1">{item.title}</div>
                <h3 className="fw-bold mb-1">{item.value}</h3>
                <div className="text-muted small">{item.subtitle}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="border-0 shadow-sm rounded-4 tickets-panel-card">
        <Card.Body className="p-4">
          <div className="tickets-toolbar">
            <div className="tickets-toolbar-title">
              <h5>Ticket Records</h5>
              <p>Search, review, and monitor ticket status.</p>
            </div>

            <div className="ticket-filter-group">
              <Form.Control
                className="ticket-search-input"
                type="text"
                placeholder="Search ticket no, account, plate, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Form.Select
                className="ticket-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </Form.Select>

              <Form.Select
                className="ticket-filter-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </div>
          </div>

          <div className="table-responsive">
            <Table className="custom-table align-middle mb-0">
              <thead>
                <tr>
                  <th>Ticket No.</th>
                  <th>Customer</th>
                  <th>Account</th>
                  <th>Plate</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th>Date Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      <Spinner animation="border" size="sm" /> Loading tickets...
                    </td>
                  </tr>
                ) : tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="ticket-no">{ticket.ticket_no}</td>
                      <td>{ticket.customer_name}</td>
                      <td>{ticket.account_number}</td>
                      <td>{ticket.plate_number}</td>
                      <td>{ticket.category}</td>
                      <td>{ticket.subject}</td>
                      <td>{getStatusBadge(ticket.status)}</td>
                      <td>{getPriorityBadge(ticket.priority)}</td>
                      <td>
                        {ticket.assigned_to_name || ticket.assigned_to || "-"}
                      </td>
                      <td>{ticket.date_created}</td>
                      <td>
                        <div className="ticket-action-group">
                          <button type="button" className="ticket-action-btn view">
                            View
                          </button>
                          <button type="button" className="ticket-action-btn edit">
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center text-muted py-4">
                      No tickets found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="tickets-pagination">
            <span>
              Showing page {page} of {totalPages || 1} | Total: {total}
            </span>

            <div className="pagination-buttons">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={handlePrevPage}
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={handleNextPage}
              >
                Next
              </button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}