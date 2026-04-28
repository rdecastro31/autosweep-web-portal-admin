import { Button, Modal, Form, Spinner } from "react-bootstrap";

export default function UpdateEmailModal({
  show,
  onHide,
  formData,
  setFormData,
  onSubmitUpdateEmail,
  submitting = false,
}) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = String(formData?.new_email || "").trim();

  const isValid =
    trimmedEmail.length > 0 && emailRegex.test(trimmedEmail);

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton={!submitting}>
        <Modal.Title>Update Email</Modal.Title>
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
            <Form.Label>Current Email</Form.Label>
            <Form.Control
              type="email"
              value={formData?.current_email || ""}
              readOnly
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>New Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter new email address"
              value={formData?.new_email || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  new_email: e.target.value,
                }))
              }
              disabled={submitting}
              isInvalid={trimmedEmail.length > 0 && !emailRegex.test(trimmedEmail)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={submitting}>
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={onSubmitUpdateEmail}
          disabled={submitting || !isValid}
        >
          {submitting ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Updating...
            </>
          ) : (
            "Update Email"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}