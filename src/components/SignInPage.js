import { useDispatch, useSelector } from "react-redux";
import { requestSignIn } from "../redux/authSlice";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Heading } from "./shared/Heading";

export function SignInPage() {
  const dispatch = useDispatch();
  const authMessage = useSelector((state) => state.auth.message);
  const authState = useSelector((state) => state.auth.authState);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = () => {
    dispatch(requestSignIn(email, password));
  };

  return (
    <div>
      {authState === "loggedIn" ? (
        <p>Erfolgreich eingeloggt.</p>
      ) : (
        <div>
          <Heading text={"Anmelden"} />
          <p style={{ whiteSpace: "pre-wrap", marginBottom: 15 }}>
            {"Loggen Sie sich mit Ihrem Nutzernamen und Passwort ein."}
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
                Anmelden
              </Button>
            </Form.Group>
          </Form>
          <hr />
          <p>{authMessage}</p>
        </div>
      )}
    </div>
  );
}
