import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Heading } from "../shared/Heading";
import { WIDGETS } from "../widgets/getWidget";
import { LefModal } from "../shared/LefModal";
import { addNotificationMessage } from "../../redux/notificationSlice";
import { useDispatch } from "react-redux";
import { pleaseChoose } from "../../assets/consts";
import { LefSelect } from "../shared/LefSelect";
import { Menu, MenuItem } from "react-bootstrap-typeahead";
import { MenuGroupLabel } from "../shared/MenuGroupLabel";

const ROOT_URL = `https://portal.emission-framework.org`;
// const ROOT_URL = `http://localhost:3000`;

const EmbeddingWizard = ({ ownRegionIds, regions, open, onClose }) => {
  const dispatch = useDispatch();
  const [previewColorPalette, setPreviewColorPalette] = useState("default");
  const [previewFontStyle, setPreviewFontStyle] = useState("sansSerif");
  const [widgetId, setWidgetId] = useState(1);
  const [regionId, setRegionId] = useState(undefined);

  const convertedRegions = regions.map((r) => ({
    ...r,
    own: ownRegionIds.includes(r._id),
  }));

  useEffect(() => {
    if (regions.length > 0) setRegionId(regions[0]._id);
  }, [regions]);
  let embeddingUrl = `${ROOT_URL}/embeddedWidget/${regionId}/${widgetId}/${previewColorPalette}/${previewFontStyle}`;
  let iFrameCode = `<iframe src="${embeddingUrl}" style="width: 100%; min-height: 500px; border: 1px solid grey">`;
  let copyEmbeddingCodeToClipboard = () => {
    navigator.clipboard.writeText(iFrameCode);
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
                  <LefSelect
                    id={"formRegionSelect"}
                    onChange={(values) => values && setRegionId(values[0])}
                    placeholder={pleaseChoose}
                    options={convertedRegions.map((region) => ({
                      label: region.name,
                      value: region._id,
                      own: region.own,
                    }))}
                    renderMenu={(results, menuProps) => {
                      const ownRegionsResults = results.filter((r) => r.own);
                      const noResultsLine = (
                        <>
                          <p className={"font-italic ml-4"}>
                            Keine Ergebnisse.
                          </p>
                        </>
                      );
                      return (
                        <Menu {...menuProps}>
                          <MenuGroupLabel label={"Meine Regionen"} />
                          {ownRegionsResults.length === 0 && noResultsLine}
                          {ownRegionsResults.map((result, index) => (
                            <MenuItem option={result} position={index}>
                              {result.label}
                            </MenuItem>
                          ))}

                          <MenuGroupLabel label={"Alle Regionen"} />
                          {results.length === 0 && noResultsLine}
                          {results
                            .sort((a, b) => (a.label < b.label ? -1 : 1))
                            .map((result, index) => (
                              <MenuItem
                                option={result}
                                position={index + ownRegionsResults.length}
                              >
                                {result.label}
                              </MenuItem>
                            ))}
                        </Menu>
                      );
                    }}
                  />
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
                <Form.Group as={Row} className={"mt-5"}>
                  <Col>
                    <Form.Label>Einbettungscode</Form.Label>
                  </Col>
                  <Col xs={12}>
                    <Form.Control
                      type={"text"}
                      onSelect={(e) => e.target.select()}
                      value={iFrameCode}
                      readOnly
                    />
                  </Col>
                  <Col className={"mt-2 d-flex justify-content-end"}>
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
                  src={embeddingUrl}
                  frameBorder="0"
                  style={{
                    padding: 10,
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
