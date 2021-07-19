import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { StartPage } from "./StartPage";
import ResultPage from "./ResultPage";
import { Imprint } from "./Imprint";
import { SignInPage } from "./SignInPage";
import { SignUpPage } from "./SignUpPage";
import { useDispatch, useSelector } from "react-redux";
import { AccountPage } from "./AccountPage";
import ProtectedRoute from "./ProtectedRoute";
import { requestSignOut } from "../redux/authSlice";
import { useEffect } from "react";
import { requestGetAllRegions } from "../redux/dataSlice";
import { Header } from "./Header";
import { Toast } from "react-bootstrap";
import { WidgetEmbeddingPage } from "./WidgetEmbeddingPage";

export const getCityPath = (city) => `/result/${city}`;

const MainRouting = ({ location = {}, history = {} }) => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.authState);
  const toasts = useSelector((state) => state.notifications);
  const loggedIn = authStatus === "loggedIn";

  useEffect(() => {
    dispatch(requestGetAllRegions());
  }, [dispatch]);
  const pages = [
    {
      id: "3",
      label: "Anmelden",
      to: "/signIn",
      unsecure: true,
      button: true,
    },
    {
      id: "5",
      label: "Mein Konto",
      to: "/account",
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
          <Route path="/imprint">
            <Imprint />
          </Route>

          <Route path="/embeddedWidget/:regionId/:widgetId/:colorPalette/:fontStyle">
            <WidgetEmbeddingPage />
          </Route>

          <Route path={"/result/:regionId"}>
            <ResultPage />
          </Route>

          <Route path={"/signIn"}>
            <SignInPage />
          </Route>

          <Route path={"/signUp"}>
            <SignUpPage />
          </Route>

          <ProtectedRoute
            loggedIn={loggedIn}
            path={"/account"}
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
        style={{ position: "absolute", bottom: 10, right: 10 }}
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
    </div>
  );
};

export default withRouter(MainRouting);
