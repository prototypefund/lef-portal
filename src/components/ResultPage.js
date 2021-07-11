import { ResultEntry } from "./resultPageComponents/ResultEntry";
import { Heading } from "./shared/Heading";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditButton } from "./shared/EditButton";
import { useParams } from "react-router-dom";
import { getRegionDataFromState, requestGetRegion } from "../redux/dataSlice";
import { WidgetContainer } from "./WidgetContainer";
import { WIDGETS } from "./widgets/getWidget";
import { Typeahead } from "react-bootstrap-typeahead";
import { getTypeAheadOptions } from "./StartPage";
import { getCityPath } from "./MainRouting";

import { withRouter } from "react-router";

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

const ResultPage = ({ onBack = () => {}, history }) => {
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
  const regions = useSelector((state) => state.data.regionData);
  const { name = "Musterstadt", _id } = regionData;

  const widgets = [
    WIDGETS[1],
    // WIDGETS[2],
    // WIDGETS[3],
    WIDGETS[4],
    WIDGETS[5],
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

  let typeAheadOptions = getTypeAheadOptions(regions);
  let selectedRegion = typeAheadOptions.find((option) => option.value === _id);
  let header = _id && (
    <Row>
      <Col className={"d-flex align-items-center mb-1"}>
        {/*<div className={"flex-grow-0"}>
          <Button variant={"link"} className={"mr-1"} onClick={onBack}>
            <ArrowLeftCircleFill size={25} color={PRIMARY_COLOR_DARK} />
          </Button>
        </div>*/}
        <Row
          className={"flex-grow-1 col d-flex"}
          style={{ whiteSpace: "pre-wrap" }}
        >
          <Heading
            size={"h5"}
            text={`Dein Klimacheck für: `}
            style={{ margin: 0 }}
          />
          <Row className={"w-100 mb-2"}>
            <span
              style={{
                display: "inline-block",
                // borderBottom: "1px solid #DDD",
              }}
            >
              <Typeahead
                onFocus={(event) => event.target.select()}
                onChange={(selectedValues) =>
                  selectedValues.length > 0 &&
                  history.push(getCityPath(selectedValues[0].value))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.target.blur();
                  }
                }}
                selectHintOnEnter
                defaultSelected={selectedRegion ? [selectedRegion] : []}
                id={"citySelection"}
                placeholder={"Stadt / Unternehmen"}
                highlightOnlyResult
                options={typeAheadOptions}
                emptyLabel={"Keine Ergebnisse."}
                inputProps={{
                  style: {
                    textAlign: "left",
                    backgroundColor: "transparent",
                    border: "none",
                    fontSize: "3.4rem",
                    textDecoration: "underline",
                  },
                }}
              />
            </span>
          </Row>
        </Row>
      </Col>
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

export default withRouter(ResultPage);
