import { ResultEntry } from "./resultPageComponents/ResultEntry";
import { Heading } from "./shared/Heading";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { requestGetRegion } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeftCircleFill } from "react-bootstrap-icons";
import { PRIMARY_COLOR_DARK } from "../assets/colors";
import { getWidget } from "./widgets/getWidget";
import { EditButton } from "./shared/EditButton";
import { useParams } from "react-router-dom";

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

  const regionData =
    useSelector((state) => {
      let regionDataArray = state.data.regionData;
      if (Array.isArray(regionDataArray)) {
        return regionDataArray.find((d) => d._id === regionId);
      }
    }) || {};
  const { name, _id } = regionData;

  const widgets = [
    getWidget(1, regionData, editMode),
    getWidget(2, regionData, editMode),
    getWidget(3, regionData, editMode),
  ];

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
