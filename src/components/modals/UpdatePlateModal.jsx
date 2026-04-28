import { Button, Modal, Form, Spinner } from "react-bootstrap";

export default function UpdatePlateModal({
  show,
  onHide,
  formData,
  setFormData,
  onSubmitUpdatePlate,
  submitting = false,
}) {
  const newPlate = String(formData?.new_plate || "").toUpperCase();
  const accountNumber = String(formData?.account_number || "");
  const isValid =
    newPlate.trim().length > 0 &&
    newPlate.trim().length <= 9 &&
    accountNumber.trim().length > 0;

  const handlePlateChange = (value) => {
    const cleaned = value.toUpperCase().slice(0, 9);

    setFormData((prev) => ({
      ...prev,
      new_plate: cleaned,
    }));
  };

const handleAccountChange = (value) => {
  const cleaned = value.replace(/\D/g, ""); // remove all non-digits

  setFormData((prev) => ({
    ...prev,
    account_number: cleaned,
  }));
};

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton={!submitting}>
        <Modal.Title>Update Account or Plate</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              type="text"
              value={formData?.account_number || ""}
              onChange={(e) => handleAccountChange(e.target.value)}
              disabled={submitting}
              placeholder="Enter account number"
              inputMode="numeric"   // mobile numeric keypad
              pattern="[0-9]*"      // hint for numeric only
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Current Plate Number</Form.Label>
            <Form.Control
              type="text"
              value={formData?.current_plate || ""}
              readOnly
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>New Plate Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new plate number"
              value={formData?.new_plate || ""}
              onChange={(e) => handlePlateChange(e.target.value)}
              disabled={submitting}
              maxLength={10}
            />
            <Form.Text className="text-muted">
              Maximum of 10 characters.
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
          onClick={onSubmitUpdatePlate}
          disabled={submitting || !isValid}
        >
          {submitting ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Updating...
            </>
          ) : (
            "Update Plate"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}