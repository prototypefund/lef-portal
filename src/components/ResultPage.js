import { ResultEntry } from "./resultPageComponents/ResultEntry";
import { Heading } from "./shared/Heading";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeftCircleFill } from "react-bootstrap-icons";
import { PRIMARY_COLOR_DARK } from "../assets/colors";
import { EditButton } from "./shared/EditButton";
import { useParams } from "react-router-dom";
import { getRegionDataFromState, requestGetRegion } from "../redux/dataSlice";
import { WidgetContainer } from "./WidgetContainer";
import { WIDGETS } from "./widgets/getWidget";

const LefSpinner = () => (
  <Container
    fluid
    className={"align-items-center justify-content-center d-flex"}
  >
    <Spinner animation="border" role="status">
      <span className="sr-only">Lade Daten...</span>
    </Spinner>
  </Container>
);

export const ResultPage = ({ onBack = () => {} }) => {
  const dispatch = useDispatch();
  const userIsAdmin =
    useSelector((state) => state.auth.authState) === "loggedIn";
  const [editMode, setEditMode] = useState(false);
  const { regionId } = useParams();

  useEffect(() => {
    dispatch(requestGetRegion(regionId));
  }, [dispatch, regionId]);

  const regionData = useSelector((state) =>
    getRegionDataFromState(state, regionId)
  );
  const { name, _id } = regionData;

  const widgets = [
    WIDGETS[1],
    // WIDGETS[2],
    // WIDGETS[3],
    WIDGETS[4],
    // WIDGETS[5],
  ].map((widget) => ({
    component: (
      <WidgetContainer
        component={widget.component}
        editMode={editMode}
        regionData={regionData}
      />
    ),
    question: widget.question,
  }));

  let header = (
    <Row>
      <div className={"d-flex align-items-center mb-1"}>
        <div className={"flex-grow-0"}>
          <Button variant={"link"} className={"mr-1"} onClick={onBack}>
            <ArrowLeftCircleFill size={25} color={PRIMARY_COLOR_DARK} />
          </Button>
        </div>
        <div className={"flex-grow-1"}>
          <Heading size={"h3"} text={`Dein Klimacheck für: ${name}`} />
        </div>
      </div>
      {userIsAdmin && (
        <EditButton
          onClick={() => {
            setEditMode(!editMode);
          }}
        />
      )}
    </Row>
  );
  return (
    <Container fluid style={{ maxWidth: 800 }}>
      {header}

      <Row>
        <Col>
          {!_id ? (
            <LefSpinner />
          ) : (
            widgets.map((entry, k) => (
              <ResultEntry
                key={k}
                question={entry.question.replaceAll("%s", name)}
                component={entry.component}
              />
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};
