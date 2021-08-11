import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { StartPage } from "./StartPage";
import ResultPage from "./ResultPage";
import { Imprint } from "./Imprint";
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
import { lefReduxApi, useGetUserQuery } from "../redux/lefReduxApi";

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

  // const { data, isFetching } = useGetUserQuery();
  // console.debug({ data, isFetching });

  const [getUser] = lefReduxApi.endpoints.getUser.useLazyQuery();

  useEffect(() => {
    if (token && !loggedIn) {
      // dispatch(requestGetUser());
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
      id: "3",
      label: "Anmelden",
      to: PATHS.SIGN_IN,
      unsecure: true,
      button: true,
    },
    {
      id: "5",
      label: "Mein Konto",
      to: PATHS.ACCOUNT,
      secure: true,
    },
    {
      id: "4",
      label: "Abmelden",
      action: () => dispatch(requestSignOut()),
      secure: true,
      button: true,
    },
  ];
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {!embeddingMode && <Header pages={pages} loggedIn={loggedIn} />}
      <div className={"d-flex flex-grow-1 pt-3 p-sm-1 p-md-3"}>
        <Switch>
          <Route path={PATHS.IMPRINT}>
            <Imprint />
          </Route>

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
      <div className={"mt-3 text-center mb-1"} style={{ fontSize: 10 }}>
        Local Emission Framework 2021 (c) v0.1
      </div>
      <div
        className="p-3"
        style={{ position: "fixed", bottom: 10, right: 10, zIndex: 2000 }}
      >
        {toasts.map((toast) => (
          <Toast key={toast.id}>
            <Toast.Header closeButton={false}>
              <strong className="mr-2">{toast.title}</strong>
              <small>{new Date(toast.timestamp).toLocaleTimeString()}</small>
            </Toast.Header>
            <Toast.Body>{toast.message}</Toast.Body>
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
