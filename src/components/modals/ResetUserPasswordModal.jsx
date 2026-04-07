import { Modal, Button, Form, InputGroup } from "react-bootstrap";

export default function ResetUserPasswordModal({
  show,
  onHide,
  email,
  password,
  setPassword,
  onGeneratePassword,
  onSubmitResetPassword,
  submitting,
}) {
  const isPasswordValid = password && password.trim().length >= 6;

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Reset / Update Password</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email || ""} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 6 characters)"
                maxLength={100}
                isInvalid={password && password.trim().length < 6}
              />
              <Button
                variant="outline-secondary"
                onClick={onGeneratePassword}
                disabled={submitting}
              >
                Generate
              </Button>
            </InputGroup>

            {password && password.trim().length < 6 && (
              <Form.Text className="text-danger">
                Password must be at least 6 characters.
              </Form.Text>
            )}

            <Form.Text muted>
              You may type a custom password or generate a random one.
            </Form.Text>
          </Form.Group>
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
          variant="warning"
          onClick={onSubmitResetPassword}
          disabled={submitting || !isPasswordValid}
        >
          {submitting ? "Updating..." : "Update Password"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}