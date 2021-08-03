import { withRouter } from "react-router";
import { Heading } from "../shared/Heading";
import { Button, Container, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  requestResetPassword,
  setPasswordResetMessage,
} from "../../redux/authSlice";
import { PATHS } from "../MainRouting";

const ResetPasswordPage = ({ history }) => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const onFinish = () => {
    dispatch(requestResetPassword(email));
  };
  const passwordResetMessage = useSelector(
    (state) => state.auth.passwordResetMessage
  );

  useEffect(() => {
    dispatch(setPasswordResetMessage(""));
  }, []);

  useEffect(() => {
    if (passwordResetMessage) {
      history.push(PATHS.SET_NEW_PASSWORD(email));
    }
  }, [passwordResetMessage]);

  return (
    <>
      <Container>
        <Heading text={"Passwort zurücksetzen"} />
        <p style={{ whiteSpace: "pre-wrap", marginBottom: 15 }}>
          {
            "Geben Sie die E-Mail-Adresse des Accounts an, dessen Passwort Sie zurücksetzen möchten."
          }
        </p>
        <Form>
          <Form.Group controlId={"signUpForm"}>
            <Form.Label>E-Mail</Form.Label>
            <Form.Control
              onChange={(e) => setEmail(e.target.value)}
              type={"email"}
              placeholder={"Ihre E-Mail"}
            />
            <div className={"d-flex justify-content-end"}>
              <Button
                variant="primary"
                onClick={onFinish}
                className={"mt-3 mr-2"}
              >
                Passwort zurücksetzen
              </Button>
            </div>{" "}
          </Form.Group>
        </Form>
        <hr />
        <p>{passwordResetMessage}</p>
      </Container>
    </>
  );
};

export default withRouter(ResetPasswordPage);
