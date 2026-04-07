import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function DownloadSOAModal({
  show,
  onHide,
  formData,
  setFormData,
  onSubmitDownloadSOA,
  submitting,
}) {
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];

  const minDateObj = new Date();
  minDateObj.setFullYear(today.getFullYear() - 3);
  const minDate = minDateObj.toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "from_date" && updated.to_date && updated.to_date < value) {
        updated.to_date = "";
      }

      return updated;
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Download SOA</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              type="text"
              value={formData.account_number || ""}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Plate Number</Form.Label>
            <Form.Control
              type="text"
              value={formData.plate_number || ""}
              readOnly
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="date"
                  name="from_date"
                  value={formData.from_date || ""}
                  onChange={handleChange}
                  min={minDate}
                  max={maxDate}
                />
                <Form.Text muted>
                  Only dates within the last 3 years are allowed.
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="date"
                  name="to_date"
                  value={formData.to_date || ""}
                  onChange={handleChange}
                  min={formData.from_date || minDate}
                  max={maxDate}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onHide}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSubmitDownloadSOA}
          disabled={submitting || !formData.from_date || !formData.to_date}
        >
          {submitting ? "Downloading..." : "Download SOA"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}