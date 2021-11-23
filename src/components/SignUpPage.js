import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { Heading } from "./shared/Heading";
import { lefReduxApi } from "../redux/lefReduxApi";

export function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [
    requestSignUpOfUser,
    signUpResult = {},
  ] = lefReduxApi.endpoints.requestSignUpUser.useLazyQuery(
    email,
    username,
    password
  );

  const onFinish = (values) => {
    requestSignUpOfUser(email, username, password);
  };

  return (
    <div>
      <div>
        <Heading text={"Registrieren"} />
        <p style={{ whiteSpace: "pre-wrap", marginBottom: 15 }}>
          {"Wählen Sie einen Benutzernamen und ein Passwort."}
        </p>
        <Form>
          <Form.Group controlId={"signUpForm"}>
            <Form.Label>Benutzername</Form.Label>
            <Form.Control
              onChange={(e) => setEmail(e.target.value)}
              type={"email"}
              placeholder={"Ihre E-Mail"}
            />

            <Form.Label>Passwort</Form.Label>
            <Form.Control
              onChange={(e) => setPassword(e.target.value)}
              type={"password"}
              placeholder={"Ihr Passwort"}
            />

            <Button variant="primary" onClick={onFinish} className={"mt-3"}>
              Registrieren
            </Button>
          </Form.Group>
        </Form>
        <hr />
      </div>
    </div>
  );
}
