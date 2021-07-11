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
import { WidgetEmbedding } from "./WidgetEmbedding";
import { useEffect } from "react";
import { requestGetAllRegions } from "../redux/dataSlice";
import { Header } from "./Header";
import { themes } from "./theme/themes";
import { ThemeContext } from "./theme/ThemeContext";

export const getCityPath = (city) => `/result/${city}`;

const MainRouting = ({ location = {}, history = {} }) => {
  const dispatch = useDispatch();
  // const { state = {} } = location;
  const authStatus = useSelector((state) => state.auth.authState);
  const loggedIn = authStatus === "loggedIn";

  useEffect(() => {
    dispatch(requestGetAllRegions());
  }, [dispatch]);
  const pages = [
    /*  {
      id: "1",
      label: "Klimacheck",
      to: "/",
    },
  */
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
      <div className={"d-flex flex-grow-1 p-3"}>
        <Switch>
          <Route path="/imprint">
            <Imprint />
          </Route>

          <Route path="/embeddedWidget/:regionId/:widgetId/:colorPalette/:fontStyle">
            <WidgetEmbedding />
          </Route>

          <Route path={"/result/:regionId"}>
            <ResultPage onBack={() => history.goBack()} />
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
    </div>
  );
};

export default withRouter(MainRouting);
