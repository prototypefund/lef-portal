import React, { useContext, useRef, useState } from "react";
import { InfoCircle, PlusCircle } from "react-bootstrap-icons";
import {
  Accordion,
  Button,
  ButtonGroup,
  Col,
  Collapse,
  Container,
  Overlay,
  Row,
} from "react-bootstrap";
import * as PropTypes from "prop-types";
import { AddObjectivesAndActionsDialog } from "../resultPageComponents/AddObjectivesAndActionsDialog";
import { Carousel } from "react-responsive-carousel";
import { EditButton } from "../shared/EditButton";
import { ActionDisplay } from "./objectivesWidgetComponents/ActionDisplay";
import { DeleteButton } from "../shared/DeleteButton";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { ThemeContext } from "../theme/ThemeContext";
import { LefModal } from "../shared/LefModal";
import { LefSpinner } from "../shared/LefSpinner";
import { GermanDateString } from "../shared/GermanDateString";
import {
  useDeleteActionMutation,
  useDeleteObjectiveMutation,
  useGetActionsForRegionQuery,
  useGetObjectivesForRegionQuery,
} from "../../redux/lefReduxApi";
import { isFirefox } from "react-device-detect";
import { LefButton } from "../shared/LefButton";
import { Arrow } from "./objectivesWidgetComponents/Arrow";
import ReactMarkdown from "react-markdown";

const OBJECTIVE_DELETE = "OBJECTIVE_DELETE";
const ACTION_DELETE = "ACTION_DELETE";

const InfoIconWithTooltip = ({ tooltipText }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  return (
    <>
      <InfoCircle
        ref={target}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      />
      <Overlay target={target.current} show={show} placement="right">
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <div
            {...props}
            style={{
              backgroundColor: "rgba(100, 100, 100, 0.85)",
              padding: "2px 10px",
              color: "white",
              borderRadius: 3,
              ...props.style,
            }}
          >
            {tooltipText}
          </div>
        )}
      </Overlay>
    </>
  );
};

ConfirmDialog.propTypes = {
  show: PropTypes.bool,
  onClick: PropTypes.func,
};

export const ObjectivesWidget = (props) => {
  const { theme } = useContext(ThemeContext);
  const { COLOR_TEXT_BRIGHT, PRIMARY_COLOR_DARK } = theme.colors;
  const { regionData, editMode, isMobile } = props;
  const { _id } = regionData;
  const {
    data: regionsActions = [],
    isFetching: isFetchingActionsForRegion,
  } = useGetActionsForRegionQuery(_id);
  const {
    data: regionsObjectives = [],
    isFetching: isFetchingObjectivesForRegion,
  } = useGetObjectivesForRegionQuery(_id);
  const [deleteAction] = useDeleteActionMutation();
  const [deleteObjective] = useDeleteObjectiveMutation();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentObjectiveForAction, setCurrentObjectiveForAction] = useState(
    null
  );
  const [isActionMode, setIsActionMode] = useState(false);
  const [editedObjective, setEditedObjective] = useState({});
  const [editedAction, setEditedAction] = useState({});
  const [
    selectedObjectiveDescription,
    setSelectedObjectiveDescription,
  ] = useState(undefined);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmParameter, setConfirmParameter] = useState({});

  let mappedObjectives = (huge) =>
    regionsObjectives
      .filter((o) => o)
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
      .map((objective, j) => {
        const {
          description,
          startDate: startDateString,
          endDate: endDateString,
        } = objective;
        const isLast = j === regionsObjectives.length - 1;
        const endDate = new Date(endDateString);

        const filteredActions = regionsActions.filter((action) =>
          action.objectiveIds.includes(objective._id)
        );
        const filteredActionsAccordion = (
          <div
            style={{ maxHeight: 300, overflowY: "auto" }}
            className={"w-100"}
          >
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
          </div>
        );

        let descriptionLength = huge ? 500 : 200;
        let truncated = description.length > descriptionLength;
        const setDescription = () =>
          setSelectedObjectiveDescription(description);
        let shortenedDescription = description.substr(0, descriptionLength);
        const objectiveDescription = (
          <>
            <span
              className={"overflow-auto pr-3"}
              style={{ height: huge ? 300 : 100 }}
              {...(truncated && {
                onClick: setDescription,
              })}
            >
              <ReactMarkdown skipHtml>{`${shortenedDescription}${
                truncated ? "... " : ""
              }`}</ReactMarkdown>
              {truncated && (
                <Button
                  style={{ verticalAlign: "initial" }}
                  className={"d-inline m-0 p-0 align-self-auto border-0"}
                  variant={"link"}
                  onClick={setDescription}
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
                    width: isFirefox ? "-moz-fit-content" : "fit-content",
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
                    className={"h4 mr-2"}
                    style={{ width: "fit-content" }}
                  >{`${objective.title}`}</span>
                  <InfoIconWithTooltip
                    tooltipText={
                      <Col>
                        <span style={{ whiteSpace: "pre-wrap" }}>
                          {`Ziel beschlossen am: `}
                        </span>
                        <GermanDateString date={startDateString} />
                        <span
                          style={{ whiteSpace: "pre-wrap" }}
                        >{`\nGeplante Umsetzung des Ziels am: `}</span>
                        <GermanDateString date={endDateString} />
                      </Col>
                    }
                  />

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
                  <Collapse in={editMode}>
                    <Row className={"mb-2"}>
                      <LefButton
                        style={{ width: "100%" }}
                        title={"Maßnahme hinzufügen"}
                        icon={PlusCircle}
                        onClick={() => {
                          setCurrentObjectiveForAction(objective);
                          setEditedAction({});
                          setIsActionMode(true);
                          setShowAddDialog(true);
                        }}
                      />
                    </Row>
                  </Collapse>
                  <Row>{filteredActionsAccordion}</Row>
                </Col>
              )}
            </Container>
          </div>
        );
      });

  let carousel = (
    <Carousel
      renderArrowNext={(onClickHandler, hasNext) => (
        <Arrow onClick={onClickHandler} show={hasNext} />
      )}
      renderArrowPrev={(onClickHandler, hasPrevious) => (
        <Arrow onClick={onClickHandler} show={hasPrevious} left />
      )}
      showArrows={true}
      showThumbs={false}
      autoPlay={false}
      interval={0}
      showStatus={false}
      renderIndicator={(onClick, isSelected, index, label) => (
        <span style={{ fontSize: "0.8em", padding: 5 }} onClick={onClick}>
          {isSelected ? "⚫" : "⚪"}
        </span>
      )}
      showIndicators={true}
    >
      {mappedObjectives(false)}
    </Carousel>
  );
  let isFetching = isFetchingObjectivesForRegion || isFetchingActionsForRegion;
  let descriptionModal = (
    <LefModal
      centered
      show={selectedObjectiveDescription}
      content={
        <ReactMarkdown skipHtml>{selectedObjectiveDescription}</ReactMarkdown>
      }
      buttons={[
        {
          label: "Schließen",
          onClick: () => setSelectedObjectiveDescription(undefined),
        },
      ]}
    />
  );
  return isFetching ? (
    <LefSpinner hideBackground />
  ) : isMobile ? (
    <>
      {carousel}
      {descriptionModal}
    </>
  ) : (
    <Row
      style={{ maxWidth: "100%", minHeight: 300 }}
      className={"p-sm-1 p-md-2"}
    >
      <Collapse in={editMode}>
        <ButtonGroup className={"mb-3"}>
          <LefButton
            style={{ minWidth: 200 }}
            onClick={() => {
              setIsActionMode(false);
              setEditedObjective({});
              setShowAddDialog(true);
            }}
            icon={PlusCircle}
            title={"Ziel hinzufügen"}
          />
        </ButtonGroup>
      </Collapse>

      <div
        className={"d-flex"}
        style={{
          width: "100%",
          // overflow: "auto",
        }}
      >
        <div className={"w-100 d-sm-block d-md-none m-0 p-0"}>{carousel}</div>
        <div className={"d-none d-md-flex"}>{mappedObjectives(true)}</div>
      </div>

      {showAddDialog && (
        <AddObjectivesAndActionsDialog
          initiallyAssignedObjectives={
            currentObjectiveForAction ? [currentObjectiveForAction] : []
          }
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

      {descriptionModal}

      <ConfirmDialog
        title={"Aktion bestätigen"}
        content={<p>{confirmParameter.text}</p>}
        show={confirmDialogOpen}
        onClose={(result) => {
          if (result) {
            switch (confirmParameter.type) {
              case OBJECTIVE_DELETE:
                deleteObjective(confirmParameter.objective._id);
                break;
              case ACTION_DELETE:
                deleteAction(confirmParameter.action._id);
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
