import { Modal, Button, Form, InputGroup } from "react-bootstrap";


export default function UpdateLockoutModal({
    show,
    onHide,
    onSubmitUpdateLockout,
    resetSubmittingLockout, 
    lockout,
    setLockout

}){

    return(
  <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Update Account Lockout</Modal.Title>
      </Modal.Header>

      <Modal.Body>
       <Form>
            <Form.Group className="mb-3">
                <Form.Label>Lockout Status</Form.Label>
                <Form.Select
                value={lockout}
                onChange={(e) => setLockout(e.target.value)}
                >
                <option value="">Select status</option>
                <option value="1">Active</option>
                <option value="2">Locked</option>
                <option value="0">Inactive</option>
                </Form.Select>
            </Form.Group>
</Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onHide}
          disabled={resetSubmittingLockout}
        >
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={onSubmitUpdateLockout}
          disabled={resetSubmittingLockout}
        >
          {resetSubmittingLockout ? "Updating..." : "Update Account Status"}
        </Button>
      </Modal.Footer>
    </Modal>




    )





}