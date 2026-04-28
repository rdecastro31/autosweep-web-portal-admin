import { Button, Modal, Form, Spinner } from "react-bootstrap";

export default function UpdateCustomerNameModal({
  show,
  onHide,
  formData,
  setFormData,
  onSubmitUpdateCustomerName,
  sanitizeCustomerName,
  submitting = false,
}) {
  const newName = String(formData?.new_name || "");
  const trimmedName = newName.trim();
  const isValid =
    trimmedName.length > 0 &&
    trimmedName.length <= 80 &&
    /^[A-Za-z0-9\s-]+$/.test(trimmedName);

  const handleChange = (value) => {
    const cleaned = sanitizeCustomerName(value);

    setFormData((prev) => ({
      ...prev,
      new_name: cleaned,
    }));
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton={!submitting}>
        <Modal.Title>Update Customer Name</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              type="text"
              value={formData?.account_number || ""}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Current Customer Name</Form.Label>
            <Form.Control
              type="text"
              value={formData?.current_name || ""}
              readOnly
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>New Customer Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new customer name"
              value={formData?.new_name || ""}
              onChange={(e) => handleChange(e.target.value)}
              disabled={submitting}
              maxLength={80}
              isInvalid={newName.length > 0 && !isValid}
            />
            <Form.Control.Feedback type="invalid">
              Only letters, numbers, spaces, and dash (-) are allowed. Maximum of 80 characters.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Maximum of 80 characters. Special characters are not allowed except dash (-).
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={submitting}>
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={onSubmitUpdateCustomerName}
          disabled={submitting || !isValid}
        >
          {submitting ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Updating...
            </>
          ) : (
            "Update Customer Name"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}