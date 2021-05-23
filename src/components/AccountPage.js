import { Heading } from "./shared/Heading";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const AccountPage = ({ myRegionIds = ["60a578af68fbf1545cdd7b18"] }) => {
  const regions = useSelector((state) => state.data.regionData);
  const myRegions = myRegionIds
    .map((id) => regions.find((r) => r._id === id))
    .filter((r) => r);
  return (
    <Col>
      <Heading size={"h1"} text={"Accountverwaltung"} />
      <Row>
        <Col>
          <div className={"mb-2"}>
            <Heading size={"h4"} text={"Verknüpfte Regionen"} />
          </div>
          {myRegions.length > 0 ? (
            myRegions.map((r) => (
              <Card style={{ width: 250 }} key={r._id}>
                <Card.Body>
                  <Card.Title>{r.name}</Card.Title>
                  {/*<Card.Subtitle>{r._id}</Card.Subtitle>*/}
                  <Card.Text>
                    <Col>
                      {r.postalcodes.map((code) => (
                        <Row key={code}>{code}</Row>
                      ))}
                    </Col>
                  </Card.Text>
                  <Button>
                    <Link
                      className={"navbar"}
                      // to={page.to}
                      // style={page.style}
                    >
                      Bearbeiten
                    </Link>
                  </Button>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className={"mt-1"}>
              Bislang sind keine Regionen mit Ihrem Account verknüpft.
            </p>
          )}
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
