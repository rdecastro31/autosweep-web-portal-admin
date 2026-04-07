import { Modal, Button, Form, InputGroup } from "react-bootstrap";

export default function ResetPasswordModal({
  show,
  onHide,
  resetEmail,
  generatedPassword,
  setGeneratedPassword, // ✅ ADD THIS
  onGeneratePassword,
  onSubmitResetPassword,
  resetSubmitting
}) {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Reset Password</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={resetEmail} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                value={generatedPassword}
                onChange={(e) => setGeneratedPassword(e.target.value)} // ✅ FIX
                placeholder="Enter or generate password"
              />

              <Button variant="outline-success" onClick={onGeneratePassword}>
                Generate
              </Button>
            </InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={onSubmitResetPassword}
          disabled={!generatedPassword || generatedPassword.length < 6}
        >
          Confirm Reset
        </Button>
      </Modal.Footer>
    </Modal>
  );
}