import { Heading } from "./shared/Heading";
import { Button, Card, CardGroup, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const AccountPage = ({
  myRegionIds = [
    "60a578af68fbf1545cdd7b18",
    "60c7f17bad79fd36606229ea",
    "60c7f08bad79fd36606229e8",
  ],
}) => {
  const regions = useSelector((state) => state.data.regionData);
  const myRegions = myRegionIds
    .map((id) => regions.find((r) => r._id === id))
    .filter((r) => r);
  return (
    <Col>
      <Heading size={"h1"} text={"Accountverwaltung"} />
      <Heading size={"h4"} text={"Mein Account"} />
      <Row>
        <Form.Group controlId={"userEmail"} as={Col}>
          <Form.Label>E-Mail</Form.Label>
          <Form.Control type={"email"} placeholder={"Ihre E-Mail"} disabled />
        </Form.Group>

        <Form.Group controlId={"userEmail"} as={Col}>
          <Form.Label>Passwort</Form.Label>
          <Form.Control
            disabled
            type={"password"}
            placeholder={"Ihr Passwort"}
          />
        </Form.Group>
      </Row>
      <Form.Group>
        <Button>Daten ändern</Button>
      </Form.Group>
      <Row>
        <Col>
          <div className={"mb-2"}>
            <Heading size={"h4"} text={"Verknüpfte Regionen"} />
          </div>
          <CardGroup>
            {myRegions.length > 0 ? (
              myRegions.map((r) => {
                const maxPostalcodes = 3;
                return (
                  <Card key={r._id} className={"m-1"}>
                    <Card.Header>NRW</Card.Header>
                    <Card.Body>
                      <Card.Title>{r.name}</Card.Title>
                      {/*<Card.Subtitle>{r._id}</Card.Subtitle>*/}
                      <Card.Text>
                        Postleitzahlbereiche:
                        <div>
                          {r.postalcodes
                            .slice(0, maxPostalcodes)
                            .map((code) => (
                              <small key={code}>{code + ", "}</small>
                            ))}
                          {r.postalcodes.length > maxPostalcodes && "..."}
                        </div>
                      </Card.Text>
                      <Button size={"sm"}>
                        <Link
                          className={"navbar"}
                          to={`/result/${r._id}`}
                          // style={page.style}
                        >
                          Bearbeiten
                        </Link>
                      </Button>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">
                        Zuletzt aktualisiert: 01.06.2021
                      </small>
                    </Card.Footer>
                  </Card>
                );
              })
            ) : (
              <p className={"mt-1"}>
                Bislang sind keine Regionen mit Ihrem Account verknüpft.
              </p>
            )}
          </CardGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          {/*<Heading size={"h4"} text={"Persönliche Einstellungen"} />*/}
        </Col>
      </Row>
    </Col>
  );
};
