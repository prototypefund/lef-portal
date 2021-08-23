import { Heading } from "../shared/Heading";
import { Button, Container, Form } from "react-bootstrap";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/lefReduxApi";
import { SpinnerWrapper } from "../shared/SpinnerWrapper";

export const SetNewPassword = () => {
  const { email: emailParam, code: codeParam } = useParams();
  const [email, setEmail] = useState(emailParam !== ":email" ? emailParam : "");
  const [newPassword, setNewPasswordString] = useState("");
  const [code, setCode] = useState(codeParam !== ":code" ? codeParam : "");
  const [setNewPassword, { isLoading, isSuccess }] = useResetPasswordMutation();

  const onFinish = () => {
    setNewPassword({ email, code, password: newPassword });
  };

  return (
    <>
      <Container>
        <Heading text={"Passwort ändern"} />
        {isSuccess ? (
          <p>{"Passwort wurde erfolgreich geändert."}</p>
        ) : (
          <>
            <Form>
              <Form.Group controlId={"emailForm"}>
                <Form.Label>E-Mail</Form.Label>
                <Form.Control
                  autoFocus={!Boolean(email)}
                  onChange={(e) => setEmail(e.target.value)}
                  type={"email"}
                  placeholder={"Ihre E-Mail"}
                  value={email}
                  autoComplete={"email"}
                />
              </Form.Group>
              <Form.Group controlId={"codeForm"}>
                <Form.Label>Sicherheitscode</Form.Label>
                {codeParam === ":code" && (
                  <p className={"small"} style={{ marginBottom: 15 }}>
                    {`Geben Sie hier den Sicherheitscode ein, der Ihnen per
              E-Mail zugeschickt wurde.`}
                  </p>
                )}
                <Form.Control
                  autoFocus={Boolean(emailParam)}
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
                  autoComplete={"new-password"}
                />
              </Form.Group>
            </Form>
            <div className={"d-flex justify-content-end"}>
              <SpinnerWrapper
                loading={isLoading}
                spinnerProps={{ hideBackground: true, horizontal: true }}
              >
                <Button
                  variant="primary"
                  onClick={onFinish}
                  className={"mt-3 mr-2"}
                  disabled={!(email && code && newPassword)}
                >
                  Passwort ändern
                </Button>
              </SpinnerWrapper>
            </div>
          </>
        )}
        <hr />
      </Container>
    </>
  );
};
