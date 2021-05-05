import { Link, Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { StartPage } from "./StartPage";
import { ResultPage } from "./ResultPage";
import { Imprint } from "./Imprint";
import { SignInPage } from "./SignInPage";
import { SignUpPage } from "./SignUpPage";
import { useDispatch, useSelector } from "react-redux";
import { AccountPage } from "./AccountPage";
import ProtectedRoute from "./ProtectedRoute";
import { Button, Nav, Navbar } from "react-bootstrap";
import { requestSignIn } from "../redux/authSlice";

const MainLayout = ({ location = {}, history = {} }) => {
  const dispatch = useDispatch();
  const { state = {} } = location;
  const authStatus = useSelector((state) => state.auth.authState);
  const loggedIn = authStatus === "loggedIn";

  const pages = [
    {
      id: "1",
      label: "Klimacheck",
      to: "/",
    },
    {
      id: "3",
      label: "Anmelden",
      to: "/signIn",
      unsecure: true,
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
      action: () => dispatch(requestSignIn()),
      secure: true,
    },
  ];
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>
          <Link to={"/"}>{"LEF"}</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {pages
              .filter(
                (page) =>
                  !(!loggedIn && page.secure) && !(loggedIn && page.unsecure)
              )
              .map((page) => {
                return page.to ? (
                  <Link
                    className={"navbar"}
                    key={page.id}
                    to={page.to}
                    style={page.style}
                  >
                    {page.label}
                  </Link>
                ) : (
                  <Button key={page.id} onClick={page.action}>
                    {page.label}
                  </Button>
                );
              })}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className={"d-flex flex-grow-1 p-3"}>
        <Switch>
          <Route path="/impressum">
            <Imprint />
          </Route>

          <Route path={"/result"}>
            <ResultPage city={state.city} onBack={() => history.goBack()} />
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
              onCitySelect={(city) => history.push("/result", { city })}
            />
          </Route>
        </Switch>
      </div>
      <div className={"mt-3 text-center mb-1"}>
        Local Emission Framework 2021 (c)
      </div>
    </div>
  );
};

export default withRouter(MainLayout);
