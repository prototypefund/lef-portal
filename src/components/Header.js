import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import LefLogo from "../assets/lef_logo_white.png";

export function Header({ pages, loggedIn }) {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand>
        <Link to={"/"} className={"navbar-brand"} style={{ fontSize: 25 }}>
          <img
            src={LefLogo}
            alt={"LEF Logo"}
            style={{ height: 40, marginBottom: 7, marginRight: 10 }}
          />{" "}
          <span className={"d-none d-sm-inline"}>
            {"Local Emission Framework"}
          </span>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto" />
        <Nav>
          {pages
            .filter(
              (page) =>
                !(!loggedIn && page.secure) && !(loggedIn && page.unsecure)
            )
            .map((page) => {
              return page.to ? (
                <Link
                  className={`nav-link ${
                    page.button ? "btn btn-navigation ml-2" : ""
                  }`}
                  key={page.id}
                  to={page.to}
                >
                  {page.label}
                </Link>
              ) : (
                <Nav.Link
                  key={page.id}
                  onClick={page.action}
                  className={"btn btn-navigation ml-2"}
                >
                  {page.label}
                </Nav.Link>
              );
            })}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
