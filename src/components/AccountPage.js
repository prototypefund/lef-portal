import { Heading } from "./shared/Heading";
import {
  Button,
  ButtonGroup,
  Card,
  CardGroup,
  Col,
  Form,
  Row,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EmbeddingWizard from "./embedding/EmbeddingWizard";
import { useEffect, useState } from "react";
import { LefModal } from "./shared/LefModal";
import * as PropTypes from "prop-types";

function PasswordChangeDialog(props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setOldPassword("");
    setNewPassword("");
  }, [props.show]);
  return (
    <LefModal
      show={props.show}
      buttons={[
        { label: "Abbrechen", onClick: props.onCancel, variant: "secondary" },
        {
          label: "Ok",
          onClick: () => props.onSubmit(oldPassword, newPassword),
        },
      ]}
      title={"Passwort ändern"}
      content={
        <>
          <Form.Group controlId={"currentPassword"} as={Col}>
            <Form.Label>Aktuelles Passwort</Form.Label>
            <Form.Control
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              type={"password"}
              placeholder={"Aktuelles Passwort"}
            />
          </Form.Group>
          <Form.Group controlId={"newPassword"} as={Col}>
            <Form.Label>Neues Passwort</Form.Label>
            <Form.Control
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              type={"password"}
              placeholder={"Neues Passwort"}
            />
          </Form.Group>
        </>
      }
    />
  );
}

PasswordChangeDialog.propTypes = {
  show: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

function AddRegionDialog({ show, onCancel, onSubmit }) {
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [message, setMessage] = useState("");
  const allRegions = useSelector((state) => state.data.regionData);

  useEffect(() => {
    setSelectedRegionId("");
    setMessage("");
  }, [show]);
  return (
    <LefModal
      show={show}
      buttons={[
        { label: "Abbrechen", onClick: onCancel, variant: "secondary" },
        {
          label: "Ok",
          onClick: () => onSubmit(selectedRegionId, message),
        },
      ]}
      title={"Passwort ändern"}
      content={
        <>
          <Form.Group controlId={"selectRegion"} as={Col}>
            <Form.Label>Region auswählen</Form.Label>
            <Form.Control
              as="select"
              // defaultValue={pleaseChoose}
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
            >
              {allRegions.map((region) => (
                <option key={region._id} value={region._id}>
                  {region.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId={"message"} as={Col}>
            <Form.Label>Nachricht</Form.Label>
            <Form.Control
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              as={"textarea"}
              style={{ height: 150 }}
              placeholder={"Nachricht"}
            />
          </Form.Group>
        </>
      }
    />
  );
}

AddRegionDialog.propTypes = {
  show: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export const AccountPage = ({}) => {
  const regions = useSelector((state) => state.data.regionData);
  const userData = useSelector((state) => state.auth.user) || {};
  const { username: userName, email, regionIds = [] } = userData;
  const [showEmbeddingDialog, setShowEmbeddingDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showAddRegionDialog, setShowAddRegionDialog] = useState(false);
  const myRegions = regionIds
    .map((id) => regions.find((r) => r._id === id))
    .filter((r) => r);
  return (
    <Col>
      <Heading size={"h1"} text={"Accountverwaltung"} />
      <div className={"mt-3 mb-1"}>
        <Heading size={"h4"} text={"Mein Account"} />
      </div>
      <Form.Group controlId={"userEmail"}>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type={"name"}
          placeholder={"(kein Name vergeben)"}
          value={userName}
          disabled
        />
      </Form.Group>
      <Row>
        <Form.Group controlId={"userEmail"} as={Col}>
          <Form.Label>E-Mail</Form.Label>
          <Form.Control
            type={"email"}
            placeholder={"Ihre E-Mail"}
            value={email}
            disabled
          />
        </Form.Group>

        <Form.Group controlId={"userPassword"} as={Col}>
          <Form.Label>Passwort</Form.Label>
          <Form.Control disabled type={"password"} value={"PASSWORD"} />
        </Form.Group>
      </Row>
      <Form.Group>
        <Button onClick={() => setShowPasswordDialog(true)}>
          Passwort ändern
        </Button>
      </Form.Group>
      <Row className={"mt-5"}>
        <Col>
          <div className={"mb-2"}>
            <Heading size={"h4"} text={"Verknüpfte Regionen"} />
          </div>
          <CardGroup>
            {myRegions.length > 0 ? (
              myRegions.map((r) => {
                const maxPostalcodes = 15;
                return (
                  <Card key={r._id} className={"m-1"} style={{ maxWidth: 400 }}>
                    {/*<Card.Header>{r.name}</Card.Header>*/}
                    <Card.Body>
                      <Card.Title>{r.name}</Card.Title>
                      {/*<Card.Subtitle>{r._id}</Card.Subtitle>*/}
                      <Card.Text>
                        <p className={"mb-0 mt-3"}>Postleitzahlbereiche:</p>
                        <div className={"mb-3"}>
                          {r.postalcodes
                            .slice(0, maxPostalcodes)
                            .map((code) => (
                              <small key={code}>{code + ", "}</small>
                            ))}
                          {r.postalcodes.length > maxPostalcodes && "..."}
                        </div>
                      </Card.Text>
                      <Row className={"ml-0 mt-4"}>
                        <Button
                          size={"sm"}
                          variant={"secondary"}
                          className={"mr-2"}
                        >
                          Entfernen
                        </Button>
                        <Button size={"sm"}>
                          <Link
                            className={"navbar text-decoration-none"}
                            to={{
                              pathname: `/result/${r._id}`,
                              state: { startInEditMode: true },
                            }}
                          >
                            Bearbeiten
                          </Link>
                        </Button>
                      </Row>
                    </Card.Body>
                    {/* <Card.Footer> <small className="text-muted"> </small> </Card.Footer>*/}
                  </Card>
                );
              })
            ) : (
              <p className={"mt-1"}>
                Bislang sind keine Regionen mit Ihrem Account verknüpft.
              </p>
            )}
          </CardGroup>
          <div>
            <Button
              className={"mt-2"}
              onClick={() => setShowAddRegionDialog(true)}
            >
              Region hinzufügen
            </Button>
          </div>
        </Col>
      </Row>

      <Row className={"mt-5"}>
        <Col>
          <Heading size={"h4"} text={"Einbettung"} />
          <p className={"mt-2"}>
            Sie können einzelne Elemente oder Diagramme aus dem Klimacheck in
            Ihre eigene Website einbinden.
          </p>
          <Button className={""} onClick={() => setShowEmbeddingDialog(true)}>
            {"Einbettung konfigurieren"}
          </Button>
        </Col>
      </Row>

      <EmbeddingWizard
        regions={regions}
        open={showEmbeddingDialog}
        onClose={() => {
          setShowEmbeddingDialog(false);
        }}
      />

      <PasswordChangeDialog
        show={showPasswordDialog}
        onSubmit={(oldPassword, newPassword) => {
          setShowPasswordDialog(false);
          // TODO dispatch(requestReplacePassword(oldPassword, newPassword));
        }}
        onCancel={() => setShowPasswordDialog(false)}
      />

      <AddRegionDialog
        show={showAddRegionDialog}
        onSubmit={(regionId, message) => {
          setShowAddRegionDialog(false);
          // TODO requestAddRegion
        }}
        onCancel={() => setShowAddRegionDialog(false)}
      />
    </Col>
  );
};
