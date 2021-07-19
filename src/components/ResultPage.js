import { ResultEntry } from "./resultPageComponents/ResultEntry";
import { Heading } from "./shared/Heading";
import { Col, Container, Row } from "react-bootstrap";
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
import { LefSpinner } from "./shared/LefSpinner";

const ResultPage = ({ history }) => {
  const dispatch = useDispatch();
  const userIsAdmin =
    useSelector((state) => state.auth.authState) === "loggedIn";
  const [editMode, setEditMode] = useState(false);
  const { regionId } = useParams();

  useEffect(() => {
    if (regionId) {
      dispatch(requestGetRegion(regionId));
    }
  }, [dispatch, regionId]);

  const regionData = useSelector((state) =>
    getRegionDataFromState(state, regionId)
  );
  const regions = useSelector((state) => state.data.regionData);
  const { name = "Musterstadt", _id } = regionData;

  const widgets = Object.keys(WIDGETS)
    .map((key) => WIDGETS[key])
    .filter((widget) => !widget.flag || regionData[widget.flag])
    .map((widget) => ({
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
    <>
      <Row>
        <Col>
          <Heading
            size={"h5"}
            text={`Dein Klimacheck für: `}
            style={{ margin: 0 }}
          />
        </Col>
      </Row>
      <Row>
        <Col className={"mb-1"} xs={9}>
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
                paddingLeft: 0,
                textAlign: "left",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "3.4rem",
                textDecoration: "underline",
              },
            }}
          />
        </Col>
        {userIsAdmin && (
          <Col className={"align-items-center d-none d-sm-block"} xs={3}>
            <div
              className={
                "d-flex w-100 h-100 align-items-center justify-content-end"
              }
            >
              <EditButton
                title={!editMode ? "Bearbeiten" : "Bearbeiten beenden"}
                variant={"dark"}
                onClick={() => {
                  setEditMode(!editMode);
                }}
              />
            </div>
          </Col>
        )}
      </Row>
    </>
  );
  return (
    <Container fluid style={{ maxWidth: 800 }}>
      {header}
      <Row>
        <Col>
          {!_id ? (
            <LefSpinner />
          ) : widgets.length > 0 ? (
            widgets.map((entry, k) => (
              <ResultEntry
                key={k}
                question={entry.question.replaceAll("%s", name)}
                component={entry.component}
              />
            ))
          ) : (
            <p>
              {`Es sind bislang keine Daten für ${name} vorhanden. Probier es zu einem späteren Zeitpunkt noch einmal.`}
            </p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(ResultPage);
