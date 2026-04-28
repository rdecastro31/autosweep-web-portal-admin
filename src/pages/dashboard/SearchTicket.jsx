import { useState } from "react";
import { Card, Row, Col, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { FiSearch, FiFileText, FiUser, FiTruck, FiMessageSquare } from "react-icons/fi";

import "../../assets/styles/search-ticket.css";
import { TICKET_URL } from "../../constants/urls";

export default function SearchTicket() {
  const [keyword, setKeyword] = useState("");
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);

  const searchTicket = async () => {
    if (!keyword.trim()) return;

    try {
      setLoading(true);
      setSelectedTicket(null);
      setNotes([]);

      const formData = new FormData();
      formData.append("tag", "searchticket");
      formData.append("keyword", keyword.trim());

      const res = await axios.post(TICKET_URL, formData);

      if (res.data.success === 1) {
        setTickets(res.data.data || []);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error("Search ticket error:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const getNotes = async (ticketId) => {
    try {
      setNotesLoading(true);

      const formData = new FormData();
      formData.append("tag", "getnotes");
      formData.append("ticket_id", ticketId);

      const res = await axios.post(TICKET_URL, formData);

      if (res.data.success === 1) {
        setNotes(res.data.data || []);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Get notes error:", error);
      setNotes([]);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    getNotes(ticket.id);
  };

  const getStatusClass = (status) => {
    if (status === "Open") return "badge-open";
    if (status === "In Progress") return "badge-progress";
    if (status === "Closed") return "badge-closed";
    return "";
  };

  const getPriorityClass = (priority) => {
    if (priority === "High") return "badge-high";
    if (priority === "Medium") return "badge-medium";
    if (priority === "Low") return "badge-low";
    return "";
  };

  return (
    <div className="search-ticket-page">
      <div className="search-ticket-header">
        <div>
          <h1>Search Ticket</h1>
          <p>Search tickets by ticket number, account number, plate number, or customer name.</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-4 search-ticket-card">
        <Card.Body className="p-4">
          <div className="search-ticket-bar">
            <Form.Control
              type="text"
              placeholder="Search ticket no, plate, account, customer..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchTicket();
              }}
            />

            <button type="button" onClick={searchTicket} disabled={loading}>
              <FiSearch size={16} />
              Search
            </button>
          </div>
        </Card.Body>
      </Card>

      <Row className="g-4 mt-1">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 result-panel">
            <Card.Body className="p-4">
              <div className="panel-title">
                <h5>Search Results</h5>
                <p>{tickets.length} ticket(s) found</p>
              </div>

              {loading ? (
                <div className="empty-state">
                  <Spinner animation="border" size="sm" /> Searching tickets...
                </div>
              ) : tickets.length > 0 ? (
                <div className="ticket-result-list">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`ticket-result-card ${
                        selectedTicket?.id === ticket.id ? "active" : ""
                      }`}
                      onClick={() => handleSelectTicket(ticket)}
                    >
                      <div className="ticket-result-top">
                        <div>
                          <h5>{ticket.ticket_no}</h5>
                          <p>{ticket.subject}</p>
                        </div>

                        <div className="ticket-badge-group">
                          <span className={`badge ${getStatusClass(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <span className={`badge ${getPriorityClass(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>

                      <div className="ticket-result-info">
                        <span>
                          <FiUser size={14} /> {ticket.customer_name}
                        </span>
                        <span>
                          <FiFileText size={14} /> {ticket.account_number}
                        </span>
                        <span>
                          <FiTruck size={14} /> {ticket.plate_number}
                        </span>
                      </div>

                      <div className="ticket-result-footer">
                        <span>{ticket.category}</span>
                        <span>{ticket.date_created}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  No ticket selected or no search result found.
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 notes-panel">
            <Card.Body className="p-4">
              <div className="panel-title">
                <h5>Ticket Notes</h5>
                <p>
                  {selectedTicket
                    ? selectedTicket.ticket_no
                    : "Select a ticket to view notes"}
                </p>
              </div>

              {notesLoading ? (
                <div className="empty-state">
                  <Spinner animation="border" size="sm" /> Loading notes...
                </div>
              ) : selectedTicket ? (
                notes.length > 0 ? (
                  <div className="notes-timeline">
                    {notes.map((note) => (
                      <div className="note-item" key={note.id}>
                        <div className="note-icon">
                          <FiMessageSquare size={14} />
                        </div>

                        <div className="note-content">
                          <div className="note-meta">
                            <strong>{note.created_by_name || "User"}</strong>
                            <span>{note.date_created}</span>
                          </div>
                          <p>{note.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">No notes found for this ticket.</div>
                )
              ) : (
                <div className="empty-state">Notes will appear here.</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}