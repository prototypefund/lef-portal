import { useEffect, useState } from "react";
import { LefModal } from "../shared/LefModal";
import { Col, Form } from "react-bootstrap";
import * as PropTypes from "prop-types";

export function PasswordChangeDialog(props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setOldPassword("");
    setNewPassword("");
  }, [props.show]);
  return (
    <LefModal
      show={props.show}
      buttons={[
        { label: "Abbrechen", onClick: props.onCancel, variant: "secondary" },
        {
          label: "Ok",
          onClick: () => props.onSubmit(oldPassword, newPassword),
        },
      ]}
      title={"Passwort ändern"}
      content={
        <>
          <Form.Group controlId={"currentPassword"} as={Col}>
            <Form.Label>Aktuelles Passwort</Form.Label>
            <Form.Control
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              type={"password"}
              placeholder={"Aktuelles Passwort"}
            />
          </Form.Group>
          <Form.Group controlId={"newPassword"} as={Col}>
            <Form.Label>Neues Passwort</Form.Label>
            <Form.Control
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              type={"password"}
              placeholder={"Neues Passwort"}
            />
          </Form.Group>
        </>
      }
    />
  );
}

PasswordChangeDialog.propTypes = {
  show: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};
