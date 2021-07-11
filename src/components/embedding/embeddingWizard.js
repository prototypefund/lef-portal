import { ThemeContext } from "../theme/ThemeContext";
import { useContext, useState } from "react";
import { Col, Container, Form, Row, ThemeProvider } from "react-bootstrap";
import { Heading } from "../shared/Heading";

const EmbeddingWizard = () => {
  const [previewColorPalette, setPreviewColorPalette] = useState("default");
  const [previewFontStyle, setPreviewFontStyle] = useState("sansSerif");
  let widgetId = 2;
  let regionId = `60e8c26d32e57e89a4f33945`;
  let pleaseChoose = "Bitte auswählen..";
  return (
    <Container fluid={"sm"}>
      <Row>
        <Col xs={12} md={6} className={""}>
          <Heading size={"h5"} text={"Einstellungen"} />
          <Form className={"pr-3"}>
            <Form.Group as={"div"} controlId="formColorTheme">
              <Form.Label>Farbpalette</Form.Label>
              <Form.Control
                as="select"
                defaultValue={pleaseChoose}
                onChange={(event) => setPreviewColorPalette(event.target.value)}
              >
                <option value={"default"}>Standard</option>
                <option value={"monochrome"}>Monochrome</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={"div"} controlId="formFontStyle">
              <Form.Label>Schriftart</Form.Label>
              <Form.Control
                as="select"
                defaultValue={pleaseChoose}
                onChange={(event) => setPreviewFontStyle(event.target.value)}
              >
                <option value={"sansSerif"}>serifenlose Schrift</option>
                <option value={"serif"}>Serifen-Schrift</option>
                <option value={"monospace"}>Festbreitenschrift</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Col>
        <Col xs={12} md={6}>
          <Heading size={"h5"} text={"Vorschau"} />
          <iframe
            title={"preview"}
            src={`http://localhost:3000/embeddedWidget/${regionId}/${widgetId}/${previewColorPalette}/${previewFontStyle}`}
            frameBorder="0"
            style={{
              width: "100%",
              minHeight: 500,
              border: "1px solid grey",
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default EmbeddingWizard;
