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
import {
  AUTH_STATES,
  requestGetUser,
  requestSignOut,
} from "../redux/authSlice";
import { useEffect } from "react";
import { requestGetAllRegions } from "../redux/dataSlice";
import { Header } from "./Header";
import { Row, Toast } from "react-bootstrap";
import { WidgetEmbeddingPage } from "./WidgetEmbeddingPage";
import { LefModal } from "./shared/LefModal";

export const getCityPath = (city) => `/result/${city}`;
export const PATHS = {
  ACCOUNT: "/account",
  RESULT: "/result/:regionId",
  SIGN_IN: "/signIn",
  SIGN_UP: "/signUp",
  IMPRINT: "/imprint",
  EMBEDDING: "/embeddedWidget/:regionId/:widgetId/:colorPalette/:fontStyle",
};

const MainRouting = ({ location = {}, history = {} }) => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.authState);
  const toasts = useSelector((state) => state.notifications);
  const loggedIn = authStatus === AUTH_STATES.loggedIn;
  const requestLogIn = authStatus === AUTH_STATES.logInRequest;

  useEffect(() => {
    dispatch(requestGetAllRegions());
  }, [dispatch]);

  useEffect(() => {
    if (loggedIn) {
      dispatch(requestGetUser());
    }
  }, [authStatus, dispatch]);

  const pages = [
    /*{
      id: "1",
      label: "Token löschen",
      action: () => localStorage.removeItem("token"),
      button: true,
    },*/
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
      {!location.pathname.startsWith("/embeddedWidget") && (
        <Header pages={pages} loggedIn={loggedIn} />
      )}
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

      {/*
      <LefModal
        show={requestLogIn}
        title={"Erneut Einloggen"}
        content={
          <Row>
            <p>
              Sie wurden aufgrund längerer Inaktivität ausgeloggt. Bitte loggen
              Sie sich erneut ein, um fortzufahren.
            </p>
            <SignInPage />
          </Row>
        }
      />
*/}
    </div>
  );
};

export default withRouter(MainRouting);
