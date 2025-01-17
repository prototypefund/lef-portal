import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { StartPage } from "./StartPage";
import ResultPage from "./ResultPage";
import SignInPage from "./SignInPage";
import { SignUpPage } from "./SignUpPage";
import { useDispatch, useSelector } from "react-redux";
import { AccountPage } from "./AccountPage";
import ProtectedRoute from "./ProtectedRoute";
import { AUTH_STATES, requestSignOut } from "../redux/authSlice";
import { useEffect } from "react";
import { Header } from "./Header";
import { Col, Row, Toast } from "react-bootstrap";
import { WidgetEmbeddingPage } from "./WidgetEmbeddingPage";
import { LefModal } from "./shared/LefModal";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { SetNewPassword } from "./pages/SetNewPassword";
import { lefReduxApi, useCreateUserMutation } from "../redux/lefReduxApi";
import { LefFooter } from "./LefFooter";

export const getCityPath = (city) => `/result/${city}`;
export const PATHS = {
  ACCOUNT: "/account",
  RESULT: "/result/:regionId",
  SIGN_IN: "/signIn",
  SIGN_UP: "/signUp",
  RESET_PASSWORD: "/resetPassword",
  SET_NEW_PASSWORD: (email, code) =>
    `/setPassword/${email ? email : ":email"}/${code ? code : ":code"}`,
  SET_NEW_PASSWORD_BLANK: "/setPassword",
  IMPRINT: "/imprint",
  DATA_PRIVACY: "/dataPrivacy",
  EMBEDDING: "/embeddedWidget/:regionId/:widgetId/:colorPalette/:fontStyle",
};

const MainRouting = ({ location = {}, history = {} }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { authState: authStatus, token } = auth;
  const toasts = useSelector((state) => state.notifications);
  const loggedIn = authStatus === AUTH_STATES.loggedIn;
  const embeddingMode = location.pathname.startsWith("/embeddedWidget");
  const showRequestLoginModal =
    authStatus === AUTH_STATES.logInRequest && !embeddingMode;

  const [getUser] = lefReduxApi.endpoints.getUser.useLazyQuery();
  const [createUser] = useCreateUserMutation();

  useEffect(() => {
    if (token && !loggedIn) {
      getUser();
    }
  }, [token, loggedIn]);

  const pages = [
    /*  {
      id: "1",
      label: "Token löschen",
      action: () => localStorage.removeItem("token"),
      button: true,
    },
  */
    {
      id: "0",
      label: "User erstellen",
      action: () =>
        createUser({
          username: "Local Emission Framework",
          email: "info@emission-framework.org",
          password: "LEF2021",
          regionIds: ["610bc2cbc72d6f2984f80712", "610bc2d0c72d6f2984f80b22"],
        }),
      button: true,
      hidden: true,
    },
    {
      id: "3",
      label: "Anmelden",
      to: PATHS.SIGN_IN,
      unsecure: true,
      button: true,
    },
    {
      id: "4",
      label: "Mein Konto",
      to: PATHS.ACCOUNT,
      secure: true,
    },
    {
      id: "5",
      label: "Abmelden",
      action: () => dispatch(requestSignOut()),
      secure: true,
      button: true,
    },
  ];

  return (
    <div
      style={{
        height: embeddingMode ? "96vh" : "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!embeddingMode && (
        <Header pages={pages.filter((p) => !p.hidden)} loggedIn={loggedIn} />
      )}
      <div className={"d-flex flex-grow-1 pt-3 p-sm-1 p-md-3"}>
        <Switch>
          <Route path={PATHS.EMBEDDING}>
            <WidgetEmbeddingPage />
          </Route>

          <Route path={PATHS.RESULT}>
            <ResultPage />
          </Route>

          <Route path={PATHS.SIGN_IN}>
            <SignInPage />
          </Route>

          <Route path={PATHS.SIGN_UP}>
            <SignUpPage />
          </Route>

          <ProtectedRoute
            loggedIn={loggedIn}
            path={PATHS.ACCOUNT}
            component={AccountPage}
          />

          <Route path={PATHS.RESET_PASSWORD}>
            <ResetPasswordPage />
          </Route>

          <Route path={PATHS.SET_NEW_PASSWORD()}>
            <SetNewPassword />
          </Route>

          <Route path={PATHS.SET_NEW_PASSWORD_BLANK}>
            <SetNewPassword />
          </Route>

          <Route path="/">
            <StartPage
              onCitySelect={(city) => history.push(getCityPath(city))}
            />
          </Route>
        </Switch>
      </div>
      <LefFooter showLogos={!embeddingMode} showLinks={!embeddingMode} />
      <div
        className="p-3"
        style={{ position: "fixed", bottom: 10, right: 10, zIndex: 2000 }}
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} show={true}>
            <Toast.Header closeButton={false}>
              <strong className="mr-2 ">{toast.title}</strong>
              <small>{new Date(toast.timestamp).toLocaleTimeString()}</small>
            </Toast.Header>
            <Toast.Body
              {...(toast.type === "warning" && {
                className: "alert alert-danger",
              })}
              {...(toast.type === "success" && {
                className: "alert alert-success",
              })}
            >
              {toast.message}
            </Toast.Body>
          </Toast>
        ))}
      </div>

      <LefModal
        buttons={[
          {
            label: "Ausloggen",
            onClick: () => dispatch(requestSignOut()),
          },
        ]}
        show={showRequestLoginModal}
        title={"Erneut Einloggen"}
        content={
          <Col className={"m-2 pr-4"}>
            <Row>
              Sie wurden aufgrund längerer Inaktivität ausgeloggt. Bitte loggen
              Sie sich erneut ein, um fortzufahren.
            </Row>
            <Row className={"mt-4"}>
              <SignInPage disableRedirect />
            </Row>
          </Col>
        }
      />
    </div>
  );
};

export default withRouter(MainRouting);
