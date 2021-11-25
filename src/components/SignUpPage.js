import { Alert, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { Heading } from "./shared/Heading";
import { lefReduxApi } from "../redux/lefReduxApi";

export function SignUpPage() {
  const splitPath = window.location.pathname.split("/");
  const lastPath = splitPath[splitPath.length - 1];
  const pairs = lastPath.split("&");
  const splitPairs = pairs.map((pair) => pair.split("="));
  const keyValues = splitPairs.reduce((acc, curr) => {
    acc[curr[0]] = curr[1];
    return acc;
  }, {});

  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState(keyValues.email);
  const [code, setCode] = useState(keyValues.code);
  const [username, setUsername] = useState(keyValues.username);
  const [password, setPassword] = useState("");

  const [
    requestSignUpOfUser,
    signUpResult = {},
  ] = lefReduxApi.endpoints.requestSignUpUser.useLazyQuery();

  const {
    data,
    error,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  } = signUpResult;

  const onFinish = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    const validity = form.checkValidity();
    if (validity) {
      requestSignUpOfUser({ email, username, code, password });
    }
    setValidated(true);
  };

  return (
    <div>
      <div>
        <Heading text={"Registrieren"} />

        {isSuccess ? (
          <Alert variant={"success"}>
            Ihr Benutzer wurde erfolgreich registriert!
          </Alert>
        ) : (
          <>
            <p style={{ whiteSpace: "pre-wrap", marginBottom: 15 }}>
              {
                "Geben Sie hier Ihre Daten ein und klicken Sie auf 'Registrieren'."
              }
            </p>
            <Form noValidate validated={validated} onSubmit={onFinish}>
              <Form.Group controlId={"email"}>
                <Form.Label>E-Mail-Adresse</Form.Label>
                <Form.Control
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  type={"email"}
                  placeholder={"Ihre E-Mail"}
                  value={email}
                />
                <Form.Control.Feedback type="invalid">
                  Bitte geben Sie eine gültige E-Mail-Adresse ein.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId={"username"}>
                <Form.Label>Benutzername</Form.Label>
                <Form.Control
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  type={"name"}
                  placeholder={"Ihr Benutzername"}
                  value={username}
                />
                <Form.Control.Feedback type="invalid">
                  Bitte geben Sie einen Benutzernamen ein.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId={"password"}>
                <Form.Label>Persönliches Passwort</Form.Label>
                <Form.Control
                  autoComplete="new-password"
                  type={"password"}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={"Ihr Passwort"}
                  value={password}
                />

                <Form.Control.Feedback type="invalid">
                  Bitte geben Sie ein Passwort ein.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId={"code"}>
                <Form.Label>Aktivierungs-Code</Form.Label>
                <Form.Control
                  required
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={"Aktivierungs-Code"}
                  value={code}
                />
                <Form.Control.Feedback type="invalid">
                  Bitte geben Sie den Aktivierungs-Code ein, der Ihnen
                  mitgeteilt wurde.
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type={"submit"}
                variant="primary"
                //onClick={onFinish}
                className={"mt-3"}
              >
                Registrieren
              </Button>
            </Form>
          </>
        )}
        <hr />
      </div>
    </div>
  );
}
