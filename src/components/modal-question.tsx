import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function ModalQuestion({...props}) {
  const answerHandle = (answer: string) => {
    props.actions.answerHandle(answer);
  }

  return (
    <Modal show={props.show} onHide={() => answerHandle('Cancel')}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => answerHandle('Cancel')}>
          Cancel
        </Button>
        <Button variant="outline-danger" onClick={() => answerHandle('OK')}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
