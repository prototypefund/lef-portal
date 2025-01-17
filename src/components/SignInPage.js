import { withRouter } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AUTH_STATES } from "../redux/authSlice";
import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Heading } from "./shared/Heading";
import { PATHS } from "./MainRouting";
import { lefReduxApi } from "../redux/lefReduxApi";

const SignInPage = ({ history, disableRedirect = false }) => {
  const dispatch = useDispatch();
  const authMessage = useSelector((state) => state.auth.message);
  const authState = useSelector((state) => state.auth.authState);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loggedIn = authState === AUTH_STATES.loggedIn;

  const [getToken] = lefReduxApi.endpoints.getToken.useLazyQuery();

  const onFinish = () => {
    getToken({ email, password });
    // dispatch(requestSignIn(email, password));
  };

  useEffect(() => {
    if (loggedIn && !disableRedirect) {
      history.push(PATHS.ACCOUNT);
    }
  }, [authState, history, disableRedirect, loggedIn]);

  return (
    <Container>
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
              <Form.Label>E-Mail</Form.Label>
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

              <div className={"d-flex justify-content-between"}>
                <Button
                  variant="link"
                  onClick={() => history.push(PATHS.RESET_PASSWORD)}
                  className={"mt-3"}
                >
                  Passwort vergessen?
                </Button>
                <Button
                  variant="primary"
                  onClick={onFinish}
                  className={"mt-3 mr-2"}
                >
                  Einloggen
                </Button>
              </div>
            </Form.Group>
          </Form>
          <hr />
          <p>{authMessage}</p>
        </div>
      )}
    </Container>
  );
};

export default withRouter(SignInPage);
