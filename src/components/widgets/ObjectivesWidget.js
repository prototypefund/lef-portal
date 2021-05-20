import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Button, Carousel, Col, Container, Row } from "react-bootstrap";
import { PencilFill } from "react-bootstrap-icons";
import * as PropTypes from "prop-types";
import {
  AddObjectivesAndActionsDialog,
  getYYYYMMDD,
} from "../resultPageComponents/AddObjectivesAndActionsDialog";
import { PRIMARY_COLOR, PRIMARY_COLOR_DARK } from "../../assets/colors";

const ActionDisplay = ({ action = {} }) => {
  const { description, startDate, endDate, budget } = action;
  return (
    <Row xs={12} className={"w-100 mb-1"}>
      <Col xs={6} sm={4}>
        <Row>
          <Col xs={6}>
            <Badge variant={"light"}>{getYYYYMMDD(startDate)}</Badge>
          </Col>
          <Col xs={6}>
            <Badge variant={"light"}>{getYYYYMMDD(endDate)}</Badge>
          </Col>
        </Row>
      </Col>
      <Col xs={12} sm={8}>
        {`${description} (${budget}€)`}
      </Col>
    </Row>
  );
};

ActionDisplay.propTypes = { action: PropTypes.any };
export const ObjectivesWidget = (props) => {
  const dispatch = useDispatch();
  const adminMode = false;
  const { regionData } = props;
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

  /* useEffect(() => {
          // TODO remove due to new function getAllObjectivesForRegion
          objectiveIds.forEach((objectiveId) => {
            dispatch(requestGetObjective(objectiveId));
          });
          dispatch(requestGetAllActionsForRegion(regionData._id));
        }, [objectiveIds]);*/

  const isSmallScreen = false;
  return (
    <Row style={{ maxWidth: "99vw" }}>
      {/*<h1>{`Ziele der Stadt ${props.city}`}</h1>*/}
      <div
        className={"alert alert-info d-flex"}
        style={{
          //width: "100vw",
          overflow: "auto",
        }}
      >
        {isSmallScreen && (
          <Carousel activeIndex={0}>
            {regionsObjectives.map((objective) => (
              <Carousel.Item styles={{ height: 300 }}>
                <Carousel.Caption>
                  <h3>{objective.title}</h3>
                  <p>{objective.description}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        )}

        {regionsObjectives
          .filter((o) => o)
          .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
          .map((objective) => {
            const endDate = new Date(objective.endDate);
            return (
              <Container
                key={objective._id}
                className={"p-0"}
                style={{ minWidth: 500 }}
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
                      color: "white",
                    }}
                  >
                    <h6
                      style={{
                        backgroundColor: PRIMARY_COLOR_DARK,
                        width: "fit-content",
                        padding: "5px 12px",
                        borderRadius: 5,
                      }}
                    >
                      {endDate.getFullYear()}
                    </h6>
                  </Col>
                </Row>

                <Container className={"pr-4"}>
                  <Row>
                    <Col
                      xs={12}
                      className={"d-flex align-items-center mr-4 pl-0"}
                    >
                      <span
                        className={"h3"}
                        style={{ width: "fit-content" }}
                      >{`${objective.title}`}</span>
                      {adminMode && (
                        <Button
                          variant={"link"}
                          className={"ml-2 mb-2"}
                          size={"sm"}
                          onClick={() => {
                            setIsActionMode(false);
                            setEditedObjective(objective._id);
                            setShowAddDialog(true);
                          }}
                        >
                          <PencilFill />
                        </Button>
                      )}
                    </Col>
                  </Row>
                  <Row style={{ height: 150 }}>
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
                  <Col className={"mt-3 pl-0"}>
                    <Row>
                      <h4>Maßnahmen</h4>
                    </Row>
                    <Row>
                      {regionsActions
                        .filter((action) =>
                          action.objectiveIds.includes(objective._id)
                        )
                        .map((action) => (
                          <ActionDisplay action={action} />
                        ))}
                    </Row>
                  </Col>
                  {adminMode && (
                    <Row>
                      <Col>
                        <Button
                          size={"sm"}
                          onClick={() => {
                            setIsActionMode(true);
                            setEditedObjective(objective._id);
                            setShowAddDialog(true);
                          }}
                        >
                          + Maßnahme hinzufügen
                        </Button>
                      </Col>
                    </Row>
                  )}
                </Container>
              </Container>
            );
          })}
      </div>

      {showAddDialog && (
        <AddObjectivesAndActionsDialog
          isAction={isActionMode}
          editedObjective={editedObjective}
          regionData={regionData}
          show={showAddDialog}
          onClose={() => {
            setShowAddDialog(false);
            setIsActionMode(false);
          }}
        />
      )}

      {adminMode && (
        <Button
          onClick={() => {
            setIsActionMode(false);
            setEditedObjective({});
            setShowAddDialog(true);
          }}
        >
          Ziel hinzufügen
        </Button>
      )}
    </Row>
  );
};
