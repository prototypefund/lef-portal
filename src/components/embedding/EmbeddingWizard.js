import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Heading } from "../shared/Heading";
import { WIDGETS } from "../widgets/getWidget";
import { LefModal } from "../shared/LefModal";
import { addNotificationMessage } from "../../redux/notificationSlice";
import { useDispatch } from "react-redux";

//const ROOT_URL = `https://portal.emission-framework.org`;
const ROOT_URL = `http://localhost:3000`;

const EmbeddingWizard = ({ regions, open, onClose }) => {
  const dispatch = useDispatch();
  const [previewColorPalette, setPreviewColorPalette] = useState("default");
  const [previewFontStyle, setPreviewFontStyle] = useState("sansSerif");
  const [widgetId, setWidgetId] = useState(1);
  const [regionId, setRegionId] = useState(undefined);
  const pleaseChoose = "Bitte auswählen..";

  useEffect(() => {
    if (regions.length > 0) setRegionId(regions[0]._id);
  }, [regions]);
  let embeddingCode = `${ROOT_URL}/embeddedWidget/${regionId}/${widgetId}/${previewColorPalette}/${previewFontStyle}`;
  let copyEmbeddingCodeToClipboard = () => {
    navigator.clipboard.writeText(embeddingCode);
    dispatch(
      addNotificationMessage(
        "Einbettungscode kopiert",
        "Der Einbettungscode wurde in die Zwischenablage kopiert."
      )
    );
  };
  return (
    <LefModal
      size={"xl"}
      show={open}
      title={"Design festlegen"}
      content={
        <Container fluid={"sm"}>
          <Row>
            <Col xs={12} md={6} className={""}>
              <Heading size={"h5"} text={"Einstellungen"} />
              <Form className={"pr-3"}>
                <Form.Group as={"div"} controlId="formWidgetSelect">
                  <Form.Label>Widget</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue={pleaseChoose}
                    onChange={(event) => setWidgetId(event.target.value)}
                  >
                    {Object.keys(WIDGETS).map((widget) => (
                      <option value={widget}>{WIDGETS[widget].name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={"div"} controlId="formRegionSelect">
                  <Form.Label>Darzustellende Region</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue={pleaseChoose}
                    onChange={(event) => setRegionId(event.target.value)}
                  >
                    {regions.map((region) => (
                      <option value={region._id}>{region.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={"div"} controlId="formColorThemeSelect">
                  <Form.Label>Farbpalette</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue={pleaseChoose}
                    onChange={(event) =>
                      setPreviewColorPalette(event.target.value)
                    }
                  >
                    <option value={"default"}>Standard</option>
                    <option value={"monochrome"}>Monochrome</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={"div"} controlId="formFontStyleSelect">
                  <Form.Label>Schriftart</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue={pleaseChoose}
                    onChange={(event) =>
                      setPreviewFontStyle(event.target.value)
                    }
                  >
                    <option value={"sansSerif"}>serifenlose Schrift</option>
                    <option value={"serif"}>Serifen-Schrift</option>
                    <option value={"monospace"}>Festbreitenschrift</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className={"mt-5"}>
                  <Form.Label>Einbettungscode</Form.Label>
                </Form.Group>
                <Form.Group as={Row} controlId="formEmbeddingCode">
                  <Col>
                    <Form.Control
                      type={"text"}
                      onSelect={(e) => e.target.select()}
                      value={embeddingCode}
                      readOnly
                    />
                  </Col>
                  <Col>
                    <Button onClick={copyEmbeddingCodeToClipboard}>
                      In Zwischenablage kopieren
                    </Button>
                  </Col>
                </Form.Group>
              </Form>
            </Col>
            <Col xs={12} md={6}>
              <Heading size={"h5"} text={"Vorschau"} />
              {regionId && widgetId && (
                <iframe
                  title={"preview"}
                  src={embeddingCode}
                  frameBorder="0"
                  style={{
                    width: "100%",
                    minHeight: 500,
                    border: "1px solid grey",
                  }}
                />
              )}
            </Col>
          </Row>
        </Container>
      }
      buttons={[
        {
          label: "Schließen",
          onClick: () => {
            return onClose();
          },
        },
      ]}
    />
  );
};

export default EmbeddingWizard;
