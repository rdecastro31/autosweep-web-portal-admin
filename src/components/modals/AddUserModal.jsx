import { Modal, Button, Form } from "react-bootstrap";

export default function AddUserModal({
  show,
  onHide,
  formData,
  setFormData,
  onSubmitAddUser,
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
      <Modal.Header closeButton>
        <Modal.Title>Add New User</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>User Level</Form.Label>
            <Form.Select
              name="userlevel"
              value={formData.userlevel || ""}
              onChange={handleChange}
            >
              <option value="">Select user level</option>
              <option value="Administrator">Administrator</option>
              <option value="System User">System User</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={onSubmitAddUser}
          disabled={
            submitting ||
            !formData.email?.trim() ||
            !formData.name?.trim() ||
            !formData.userlevel?.trim()
          }
        >
          {submitting ? "Adding..." : "Add User"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}