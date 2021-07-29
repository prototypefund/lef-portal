import { Button, Modal, Spinner } from "react-bootstrap";

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
          const { label, variant, loading, disabled, ...rest } = button;
          return (
            <Button
              disabled={loading || disabled}
              key={i}
              {...rest}
              variant={variant || "primary"}
            >
              {loading && (
                <Spinner
                  className={"mr-2 "}
                  animation="border"
                  role="status"
                  size={"sm"}
                />
              )}
              {label || ""}
            </Button>
          );
        })}
      </Modal.Footer>
    </Modal>
  );
};
