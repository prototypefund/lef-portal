import { withRouter } from "react-router";
import { Heading } from "../shared/Heading";
import { Button, Container, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { PATHS } from "../MainRouting";
import { useRequestPasswordResetMutation } from "../../redux/lefReduxApi";
import { LefSpinner } from "../shared/LefSpinner";

const ResetPasswordPage = ({ history }) => {
  const [email, setEmail] = useState("");
  const [
    requestPasswordReset,
    {
      isLoading: isRequestingPasswordReset,
      isSuccess: isSuccessPasswordResetRequest,
    },
  ] = useRequestPasswordResetMutation();

  const onFinish = () => {
    requestPasswordReset(email);
  };

  useEffect(() => {
    if (isSuccessPasswordResetRequest) {
      history.push(PATHS.SET_NEW_PASSWORD(email));
    }
  }, [isSuccessPasswordResetRequest]);

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
        {isRequestingPasswordReset && <LefSpinner />}
      </Container>
    </>
  );
};

export default withRouter(ResetPasswordPage);
