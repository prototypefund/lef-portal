import { withRouter } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AUTH_STATES, requestSignIn } from "../redux/authSlice";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Heading } from "./shared/Heading";
import { PATHS } from "./MainRouting";

const SignInPage = ({ history, disableRedirect = false }) => {
  const dispatch = useDispatch();
  const authMessage = useSelector((state) => state.auth.message);
  const authState = useSelector((state) => state.auth.authState);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loggedIn = authState === AUTH_STATES.loggedIn;

  const onFinish = () => {
    dispatch(requestSignIn(email, password));
  };

  useEffect(() => {
    if (loggedIn && !disableRedirect) {
      history.push(PATHS.ACCOUNT);
    }
  }, [authState, history, disableRedirect, loggedIn]);

  return (
    <div>
      {loggedIn ? (
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
                onKeyDown={(e) => e.key === "Enter" && onFinish()}
                type={"password"}
                placeholder={"Ihr Passwort"}
              />

              <Button
                variant="navigation"
                onClick={onFinish}
                className={"mt-3"}
              >
                Einloggen
              </Button>
            </Form.Group>
          </Form>
          <hr />
          <p>{authMessage}</p>
        </div>
      )}
    </div>
  );
};

export default withRouter(SignInPage);
