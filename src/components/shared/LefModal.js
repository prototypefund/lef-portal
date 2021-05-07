import { Button, Modal } from "react-bootstrap";

export const LefModal = ({ show, title, buttons = [], content, ...rest }) => {
  return (
    <Modal show={show} {...rest}>
      {title && (
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      {content && <Modal.Body>{content}</Modal.Body>}
      <Modal.Footer>
        {buttons.map((button, i) => {
          const { label, variant, ...rest } = button;
          return (
            <Button {...rest} variant={button.variant || "primary"}>
              {button.label || ""}
            </Button>
          );
        })}
      </Modal.Footer>
    </Modal>
  );
};
