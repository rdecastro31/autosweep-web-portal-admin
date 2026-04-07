import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function AddSubAccountModal({
  show,
  onHide,
  formData,
  setFormData,
  onSubmitAddSubAccount,
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
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton={!submitting}>
        <Modal.Title>Add Sub-Account</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Main Account ID</Form.Label>
                <Form.Control
                  type="text"
                  name="main_account_id"
                  value={formData.main_account_id}
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Account Number</Form.Label>
                <Form.Control
                  type="number"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                  placeholder="Enter account number"
                  maxLength={10}
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
                  maxLength={10}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Vehicle Alias</Form.Label>
                <Form.Control
                  type="text"
                  name="gname"
                  value={formData.gname}
                  onChange={handleChange}
                  placeholder="Enter alias"
                  maxLength={20}
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
          onClick={onSubmitAddSubAccount}
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save Sub-Account"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}