import { ResultEntry } from "./resultPageComponents/ResultEntry";
import { Heading } from "./shared/Heading";
import { Button, Col, Container, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EditButton } from "./shared/EditButton";
import { useParams } from "react-router-dom";
import { WidgetContainer } from "./WidgetContainer";
import { WIDGETS } from "./widgets/getWidget";
import { GenericWidget } from "./widgets/GenericWidget";
import { getTypeAheadOptions } from "./StartPage";
import { getCityPath } from "./MainRouting";
import { withRouter } from "react-router";
import { LefSpinner } from "./shared/LefSpinner";
import { AUTH_STATES } from "../redux/authSlice";
import { isArray } from "chart.js/helpers";
import { LefSelect } from "./shared/LefSelect";
import {
  lefReduxApi,
  useCreateGenericChartMutation,
  useGetAllRegionsQuery,
  useGetRegionQuery,
  useUpdateRegionMutation,
} from "../redux/lefReduxApi";
import { isMobile } from "react-device-detect";
import { fakeGenericWidgetData } from "../assets/fakeData/fakeData";

const ResultPage = ({ history, location }) => {
  const [updateRegion] = useUpdateRegionMutation();
  const loggedIn =
    useSelector((state) => state.auth.authState) === AUTH_STATES.loggedIn;
  const [
    getUser,
    userResult = {},
  ] = lefReduxApi.endpoints.getUser.useLazyQuery();
  const {
    isSuccess: isLoadingUserSuccess,
  } = lefReduxApi.endpoints.getUser.useQueryState();
  const { data: userData = {} } = userResult;
  const { _id: userId } = userData;
  const { regionId } = useParams();
  const userIsAdmin =
    loggedIn &&
    userId &&
    isArray(userData.regionIds) &&
    userData.regionIds.includes(regionId);
  const { state = {} } = location;
  const [editMode, setEditMode] = useState(state.startInEditMode);
  const {
    data: regionData = {},
    isFetching: isFetchingRegion,
  } = useGetRegionQuery(regionId);
  const { data: regions = [] } = useGetAllRegionsQuery();
  const { name, _id, customWidgets = [] } = regionData;

  useEffect(() => {
    if (loggedIn) {
      getUser();
    }
  }, [loggedIn]);

  useEffect(() => {
    if (editMode && !userIsAdmin) {
      setEditMode(false);
    }
  }, [editMode, userIsAdmin]);

  const [
    createGenericChart,
    { isSuccess: isCreatingChartSuccess },
  ] = useCreateGenericChartMutation();

  const customWidgetsConverted = customWidgets.map((w, i) => ({
    component: GenericWidget,
    question: "Weitere Widgets " + i,
    flag: w.isActive ? "generic" : "",
    props: { widgetId: w.widgetId },
  }));

  const widgets = Object.keys(WIDGETS)
    .map((key) => WIDGETS[key])
    .filter((widget) => editMode || !widget.flag || regionData[widget.flag])
    .concat(customWidgetsConverted)
    .map((widget) => ({
      component: (
        <WidgetContainer
          component={widget.component}
          editMode={editMode}
          regionData={regionData}
          isMobile={isMobile}
          widgetProps={widget.props}
        />
      ),
      question: widget.question,
      flag: widget.flag,
      sources: widget.sources,
    }));

  let typeAheadOptions = getTypeAheadOptions(regions);
  let selectedRegion = typeAheadOptions.find((option) => option.value === _id);

  const ToggleButton = ({ isOpen, onClick }) => (
    <button
      className="toggle-button"
      onClick={onClick}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      {isOpen ? "▲" : "▼"}
    </button>
  );

  let header = !isFetchingRegion && (
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
          {selectedRegion ? (
            <LefSelect
              /*renderInput={({ inputRef, ...inputProps }) => (
                <Hint
                  shouldSelect={(shouldSelect, e) =>
                    e.keyCode === 13 || shouldSelect
                  }
                >
                  <Input {...inputProps} ref={inputRef} />
                </Hint>.select
              )}*/
              onMenu
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
              // selectHintOnEnter
              defaultSelected={[selectedRegion]}
              id={"citySelection"}
              placeholder={"Stadt / Unternehmen"}
              options={typeAheadOptions}
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
            >
              {({ isMenuShown, toggleMenu }) => (
                <ToggleButton
                  isOpen={isMenuShown}
                  onClick={(e) => toggleMenu()}
                />
              )}
            </LefSelect>
          ) : (
            <LefSpinner hideBackground height={100} horizontal />
          )}
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
    <Container fluid style={{ maxWidth: 800, padding: "0px 12px" }}>
      {header}
      <Button onClick={() => createGenericChart(fakeGenericWidgetData)}>
        Test
      </Button>

      <Button
        onClick={() =>
          updateRegion({
            ...regionData,
            customWidgets: [
              {
                widgetId: "61e1b45dc3808f1c55794c76",
                isActive: true,
              },
              {
                widgetId: "61e31747e93ca1b88dcab821",
                isActive: true,
              },
            ],
          })
        }
      >
        Test2
      </Button>
      {widgets.length > 0 ? (
        widgets.map((entry, k) => (
          <ResultEntry
            key={k}
            question={entry.question.replaceAll("%s", name)}
            component={entry.component}
            editMode={editMode}
            active={entry.flag === "generic" || regionData[entry.flag]}
            onToggleActive={(result) =>
              updateRegion({ ...regionData, [entry.flag]: result })
            }
            sources={entry.sources}
          />
        ))
      ) : (
        <p>
          {name &&
            `Es sind bislang keine Daten für ${name} vorhanden. Probier es zu einem späteren Zeitpunkt noch einmal.`}
        </p>
      )}
    </Container>
  );
};

export default withRouter(ResultPage);
