import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Accordion,
  Button,
  ButtonGroup,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import * as PropTypes from "prop-types";
import { AddObjectivesAndActionsDialog } from "../resultPageComponents/AddObjectivesAndActionsDialog";
import { Carousel } from "react-responsive-carousel";
import { EditButton } from "../shared/EditButton";
import { ActionDisplay } from "./objectivesWidgetComponents/ActionDisplay";
import { DeleteButton } from "../shared/DeleteButton";
import {
  requestDeleteAction,
  requestDeleteObjective,
  requestGetAllActionsForRegion,
  requestGetAllObjectivesForRegion,
} from "../../redux/dataSlice";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { ThemeContext } from "../theme/ThemeContext";
import { LefModal } from "../shared/LefModal";

const OBJECTIVE_DELETE = "OBJECTIVE_DELETE";
const ACTION_DELETE = "ACTION_DELETE";

ConfirmDialog.propTypes = {
  show: PropTypes.bool,
  onClick: PropTypes.func,
};
export const ObjectivesWidget = (props) => {
  const { theme } = useContext(ThemeContext);
  const { COLOR_TEXT_BRIGHT, PRIMARY_COLOR_DARK } = theme.colors;
  const dispatch = useDispatch();
  const { regionData, editMode } = props;
  const { _id } = regionData;
  const regionsObjectives = useSelector(
    (state) => state.data.objectivesForRegion[_id] || []
  );
  const regionsActions = useSelector(
    (state) => state.data.actionsForRegion[_id] || []
  );

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isActionMode, setIsActionMode] = useState(false);
  const [editedObjective, setEditedObjective] = useState({});
  const [editedAction, setEditedAction] = useState({});
  const [
    selectedObjectiveDescription,
    setSelectedObjectiveDescription,
  ] = useState(undefined);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmParameter, setConfirmParameter] = useState({});

  useEffect(() => {
    if (_id) {
      dispatch(requestGetAllObjectivesForRegion(_id));
      dispatch(requestGetAllActionsForRegion(_id));
    }
  }, [_id, dispatch]);

  let mappedObjectives = (huge) =>
    regionsObjectives
      .filter((o) => o)
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
      .map((objective, j) => {
        const { description } = objective;
        const isLast = j === regionsObjectives.length - 1;
        const endDate = new Date(objective.endDate);

        const filteredActions = regionsActions.filter((action) =>
          action.objectiveIds.includes(objective._id)
        );
        const filteredActionsAccordion = (
          <Accordion className={"w-100"}>
            {filteredActions.map((action) => (
              <ActionDisplay
                key={action._id}
                action={action}
                editMode={editMode}
                onEditAction={(actionId) => {
                  setIsActionMode(true);
                  setShowAddDialog(true);
                  setEditedAction(
                    regionsActions.find((a) => a._id === actionId)
                  );
                }}
                onDeleteAction={(action) => {
                  setConfirmParameter({
                    type: ACTION_DELETE,
                    action,
                    text:
                      "Sind Sie sicher, dass Sie diese Maßnahme löschen wollen?",
                  });
                  setConfirmDialogOpen(true);
                }}
              />
            ))}
          </Accordion>
        );

        let descriptionLength = huge ? 500 : 200;
        let truncated = description.length > descriptionLength;
        const objectiveDescription = (
          <>
            <span
              className={"overflow-auto pr-3"}
              style={{ height: huge ? 300 : 100 }}
            >
              {`${description.substr(0, descriptionLength)}${
                truncated ? "... " : ""
              }`}
              {truncated && (
                <Button
                  style={{ verticalAlign: "initial" }}
                  className={"d-inline m-0 p-0 align-self-auto border-0"}
                  variant={"link"}
                  onClick={() => setSelectedObjectiveDescription(description)}
                >
                  mehr
                </Button>
              )}
            </span>{" "}
          </>
        );
        return (
          <div
            key={objective._id}
            className={`text-left ${!huge ? "p-1" : ""}`}
            style={huge ? { minWidth: 600 } : { margin: 25 }}
          >
            <div
              style={{
                ...(huge && {
                  borderBottom: `2px dashed ${
                    isLast ? "transparent" : PRIMARY_COLOR_DARK
                  }`,
                }),
                width: "100%",
                marginTop: 15,
                marginBottom: 15,
              }}
            />
            <Row style={{ height: 20 }}>
              <Col
                xs={12}
                style={{
                  top: huge ? -30 : -25,
                  color: COLOR_TEXT_BRIGHT,
                }}
              >
                <h6
                  style={{
                    backgroundColor: PRIMARY_COLOR_DARK,
                    width: "fit-content",
                    padding: "5px 12px",
                    borderRadius: 5,
                    color: "white",
                  }}
                >
                  {endDate.getFullYear()}
                </h6>
              </Col>
            </Row>

            <Container style={huge ? { paddingRight: 80 } : {}}>
              <Row>
                <Col xs={12} className={"d-flex align-items-center mr-4 pl-0 "}>
                  <span
                    className={"h4"}
                    style={{ width: "fit-content" }}
                  >{`${objective.title}`}</span>
                  {editMode && huge && (
                    <>
                      <EditButton
                        onClick={() => {
                          setIsActionMode(false);
                          setEditedObjective(objective);
                          setShowAddDialog(true);
                        }}
                      />
                      <DeleteButton
                        onClick={() => {
                          setConfirmParameter({
                            type: OBJECTIVE_DELETE,
                            objective,
                            text:
                              "Sind Sie sicher, dass Sie diese Ziel löschen wollen?",
                          });
                          setConfirmDialogOpen(true);
                        }}
                      />
                    </>
                  )}
                </Col>
              </Row>

              <Row>
                <Col className={"d-flex pl-2"}>
                  <Row>
                    {objective.tags &&
                      objective.tags.map((tag, i) => (
                        <Row
                          className={"badge badge-info m-1"}
                          style={{
                            backgroundColor: "white",
                            paddingLeft: 15,
                            paddingRight: 15,
                            paddingTop: 5,
                            paddingBottom: 5,
                            border: "1px solid #EFEFEF",
                            fontSize: 14,
                          }}
                          key={i}
                        >
                          {tag}
                        </Row>
                      ))}
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col className={"pl-0"}>{objectiveDescription}</Col>
              </Row>

              {filteredActions.length > 0 && (
                <Col className={"mt-4 mb-4 pl-0"}>
                  <Row>
                    <span className={"h5"}>Maßnahmen</span>
                  </Row>
                  <Row>{filteredActionsAccordion}</Row>
                </Col>
              )}
            </Container>
          </div>
        );
      });

  return (
    <Row
      style={{ maxWidth: "100%", minHeight: 300 }}
      className={"p-sm-1 p-md-2"}
    >
      <div
        className={"d-flex"}
        style={{
          width: "100%",
          // overflow: "auto",
        }}
      >
        <div className={"w-100 d-sm-block d-md-none m-0 p-0"}>
          <Carousel
            showThumbs={false}
            autoPlay={false}
            showStatus={false}
            showIndicators={false}
          >
            {mappedObjectives(false)}
          </Carousel>
        </div>
        <div className={"d-none d-md-flex"}>{mappedObjectives(true)}</div>
      </div>

      {showAddDialog && (
        <AddObjectivesAndActionsDialog
          isAction={isActionMode}
          editedObjective={editedObjective}
          editedAction={editedAction}
          regionData={regionData}
          show={showAddDialog}
          onClose={() => {
            setShowAddDialog(false);
            setIsActionMode(false);
          }}
        />
      )}

      <LefModal
        centered
        show={selectedObjectiveDescription}
        content={<>{selectedObjectiveDescription}</>}
        buttons={[
          {
            label: "Schließen",
            onClick: () => setSelectedObjectiveDescription(undefined),
          },
        ]}
      />

      {editMode && (
        <ButtonGroup className={"mt-2"}>
          <Button
            className={"mr-1"}
            onClick={() => {
              setIsActionMode(false);
              setEditedObjective({});
              setShowAddDialog(true);
            }}
          >
            + Ziel hinzufügen
          </Button>
          <Button
            onClick={() => {
              setIsActionMode(true);
              setShowAddDialog(true);
            }}
          >
            + Maßnahme hinzufügen
          </Button>
        </ButtonGroup>
      )}
      <ConfirmDialog
        title={"Aktion bestätigen"}
        content={<p>{confirmParameter.text}</p>}
        show={confirmDialogOpen}
        onClose={(result) => {
          if (result) {
            switch (confirmParameter.type) {
              case OBJECTIVE_DELETE:
                dispatch(requestDeleteObjective(confirmParameter.objective));
                break;
              case ACTION_DELETE:
                dispatch(requestDeleteAction(confirmParameter.action));
                break;
              default:
                break;
            }
          }
          setConfirmDialogOpen(false);
          setConfirmParameter({});
        }}
      />
    </Row>
  );
};

ObjectivesWidget.propTypes = {
  regionData: PropTypes.object,
};
