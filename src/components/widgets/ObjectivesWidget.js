import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap";
import * as PropTypes from "prop-types";
import { AddObjectivesAndActionsDialog } from "../resultPageComponents/AddObjectivesAndActionsDialog";
import {
  COLOR_TEXT_BRIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
} from "../../assets/colors";
import { Carousel } from "react-responsive-carousel";
import {
  requestGetAllActionsForRegion,
  requestGetAllObjectivesForRegion,
} from "../../redux/authSlice";
import { EditButton } from "../shared/EditButton";
import { ActionDisplay } from "./ActionDisplay";

export const ObjectivesWidget = (props) => {
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
      .map((objective) => {
        const endDate = new Date(objective.endDate);
        const filteredActions = regionsActions
          .filter((action) => action.objectiveIds.includes(objective._id))
          .map((action) => (
            <ActionDisplay
              key={action._id}
              action={action}
              editMode={editMode}
              onEditAction={(actionId) => {
                setIsActionMode(true);
                setShowAddDialog(true);
                setEditedAction(regionsActions.find((a) => a._id === actionId));
              }}
            />
          ));
        return (
          <div
            key={objective._id}
            className={"p-0 text-justify"}
            {...(huge && { style: { minWidth: 600 } })}
          >
            <div
              style={{
                borderBottom: `2px dashed ${PRIMARY_COLOR}`,
                width: "100%",
                marginTop: 15,
                marginBottom: 15,
              }}
            />
            <Row style={{ height: 20 }}>
              <Col
                xs={12}
                style={{
                  top: -30,
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
                  {editMode && (
                    <EditButton
                      onClick={() => {
                        setIsActionMode(false);
                        setEditedObjective(
                          regionsObjectives.find((o) => o._id === objective._id)
                        );
                        setShowAddDialog(true);
                      }}
                    />
                  )}
                </Col>
              </Row>
              <Row>
                <Col className={"pl-0"}>
                  <p>{`${objective.description}`}</p>
                </Col>
              </Row>
              <Row>
                <Col className={"pl-0"}>
                  <div className={"d-flex"}>
                    {objective.tags &&
                      objective.tags.map((tag, i) => (
                        <Row className={"badge badge-info m-1 p-2"} key={i}>
                          {tag}
                        </Row>
                      ))}
                  </div>
                </Col>
              </Row>
              {filteredActions.length > 0 && (
                <Col className={"mt-4 mb-4 pl-0"}>
                  <Row>
                    <span className={"h5"}>Maßnahmen</span>
                  </Row>
                  <Row>{filteredActions}</Row>
                </Col>
              )}
            </Container>
          </div>
        );
      });

  return (
    <Row style={{ maxWidth: "99vw" }}>
      <div
        className={"d-flex"}
        style={{
          width: "100%",
          overflow: "auto",
        }}
      >
        <div className={"w-100 d-sm-block d-md-none"}>
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
    </Row>
  );
};

ObjectivesWidget.propTypes = {
  regionData: PropTypes.object,
};
