import { Modal, Button, Form, InputGroup } from "react-bootstrap";


export default function UpdateAliasModal({
    show,
    onHide,
    onSubmitUpdateAlias,
    resetSubmittingAlias, 
    alias,
    setAlias

}){

    return(
  <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Update Vehicle Alias</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Alias</Form.Label>
            <Form.Control
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Enter alias"
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onHide}
          disabled={resetSubmittingAlias}
        >
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={onSubmitUpdateAlias}
          disabled={resetSubmittingAlias}
        >
          {resetSubmittingAlias ? "Updating..." : "Update Alias"}
        </Button>
      </Modal.Footer>
    </Modal>




    )





}