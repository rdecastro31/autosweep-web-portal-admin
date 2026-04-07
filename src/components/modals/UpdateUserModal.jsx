import { useEffect, useMemo, useState } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";

export default function UpdateUserModal({
  show,
  onHide,
  user, // selected user object
  userLevelOptions = [], // array of strings
  onSubmit, // function({ id, name, userlevel })
  submitting = false,
}) {
  const [form, setForm] = useState({ name: "", userlevel: "" });

  const levelOptions = useMemo(() => {
    // ensure "Select..." option even if empty list is passed
    return (userLevelOptions || []).filter(Boolean);
  }, [userLevelOptions]);

  useEffect(() => {
    if (!show) return;

    setForm({
      name: user?.name || "",
      userlevel: user?.userlevel || "",
    });
  }, [show, user]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!user?.id) return;

    onSubmit({
      id: user.id,
      name: form.name.trim(),
      userlevel: form.userlevel,
    });
  };

  const isValid =
    form.name.trim().length > 0 && String(form.userlevel || "").trim().length > 0;

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton={!submitting}>
        <Modal.Title>Update User</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter name"
              disabled={submitting}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>User Level</Form.Label>
            <Form.Select
              value={form.userlevel}
              onChange={(e) => handleChange("userlevel", e.target.value)}
              disabled={submitting}
            >
              <option value="">Select user level</option>
              {levelOptions.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={submitting}>
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={submitting || !isValid}
        >
          {submitting ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Updating...
            </>
          ) : (
            "Update"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}