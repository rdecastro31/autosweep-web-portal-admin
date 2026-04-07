import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function UpdateSubAccountModal({
  show,
  onHide,
  formData,
  setFormData,
  onSubmitUpdateSubAccount,
  submitting,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal show={show} onHide={submitting ? undefined : onHide} centered backdrop="static">
      <Modal.Header closeButton={!submitting}>
        <Modal.Title>Update Sub-Account</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Sub Account ID</Form.Label>
                <Form.Control
                  type="text"
                  name="id"
                  value={formData.id}
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Account Number</Form.Label>
                <Form.Control
                  type="text"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                  placeholder="Enter account number"
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Plate Number</Form.Label>
                <Form.Control
                  type="text"
                  name="plate_number"
                  value={formData.plate_number}
                  onChange={handleChange}
                  placeholder="Enter plate number"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={onSubmitUpdateSubAccount}
          disabled={submitting}
        >
          {submitting ? "Updating..." : "Update Sub-Account"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}