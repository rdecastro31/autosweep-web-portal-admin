import { Modal, Button, Form } from "react-bootstrap";

export default function AddAccountModal({
  show,
  onHide,
  formData,
  setFormData,
  onSubmitAddAccount,
  submitting
}) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add New Account</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              placeholder="Enter account number"
              maxLength={9}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </Form.Group>

          <Form.Group className="mb-3">
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

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              inputMode="email"
              maxLength={150}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              maxLength={80}
              
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="success" onClick={onSubmitAddAccount} disabled={submitting}>
          {submitting ? "Adding..." : "Add Account"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}