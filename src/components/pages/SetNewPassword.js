import { Heading } from "../shared/Heading";
import { Button, Container, Form } from "react-bootstrap";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setNewPassword } from "../../redux/authSlice";

export const SetNewPassword = () => {
  const { email: emailParam, code: codeParam } = useParams();
  const [email, setEmail] = useState(emailParam !== ":email" ? emailParam : "");
  const [newPassword, setNewPasswordString] = useState("");
  const [code, setCode] = useState(codeParam !== ":code" ? codeParam : "");
  const dispatch = useDispatch();
  const onFinish = () => {
    dispatch(setNewPassword(email, code, newPassword));
  };

  return (
    <>
      <Container>
        <Heading text={"Passwort ändern"} />
        {!emailParam && (
          <p style={{ marginBottom: 15 }}>
            {`Geben Sie den Sicherheitscode an, der Ihnen per
              E-Mail zugeschickt wurde.`}
          </p>
        )}
        <Form>
          <Form.Group controlId={"emailForm"}>
            <Form.Label>E-Mail</Form.Label>
            <Form.Control
              onChange={(e) => setEmail(e.target.value)}
              type={"email"}
              placeholder={"Ihre E-Mail"}
              value={email}
            />
          </Form.Group>
          <Form.Group controlId={"codeForm"}>
            <Form.Label>Sicherheitscode</Form.Label>
            <Form.Control
              onChange={(e) => setCode(e.target.value)}
              type={"code"}
              placeholder={"Sicherheitscode"}
              value={code}
            />
          </Form.Group>
          <Form.Group controlId={"passwordForm"}>
            <Form.Label>Neues Passwort</Form.Label>
            <Form.Control
              onChange={(e) => setNewPasswordString(e.target.value)}
              type={"password"}
              placeholder={"Neues Passwort"}
              value={newPassword}
            />
          </Form.Group>
        </Form>
        <div className={"d-flex justify-content-end"}>
          <Button
            variant="primary"
            onClick={onFinish}
            className={"mt-3 mr-2"}
            disabled={!(email && code && newPassword)}
          >
            Passwort ändern
          </Button>
        </div>
        <hr />
        {/*<p>{passwordResetMessage}</p>*/}
      </Container>
    </>
  );
};
