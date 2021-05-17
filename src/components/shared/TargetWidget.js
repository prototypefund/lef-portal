import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  requestGetAllActionsForRegion,
  requestGetObjective,
} from "../../redux/authSlice";
import { Badge, Button, Carousel, Col, Container, Row } from "react-bootstrap";
import { PencilFill } from "react-bootstrap-icons";
import * as PropTypes from "prop-types";
import { getYYYYMMDD } from "../resultPageComponents/AddObjectivesAndActionsDialog";
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
export const TargetWidget = (props) => {
  const { onEdit, onActionAdd, regionData } = props;
  const dispatch = useDispatch();
  const { objectives: objectiveIds = [] } = props.regionData;
  const objectiveData = useSelector((state) => state.data.objectiveData);
  const regionsActions = useSelector((state) =>
    state.data.actionsForRegion[regionData._id]
      ? state.data.actionsForRegion[regionData._id]
      : []
  );

  useEffect(() => {
    // TODO remove due to new function getAllObjectivesForRegion
    objectiveIds.forEach((objectiveId) => {
      dispatch(requestGetObjective(objectiveId));
    });
    dispatch(requestGetAllActionsForRegion(regionData._id));
  }, [objectiveIds]);

  const isSmallScreen = false;
  return (
    <div style={{ maxWidth: "90vw" }}>
      {/*<h1>{`Ziele der Stadt ${props.city}`}</h1>*/}
      <div
        className={"alert alert-info d-flex"}
        style={{
          //width: "100vw",
          overflow: "auto",
          minHeight: 300,
        }}
      >
        {isSmallScreen && (
          <Carousel activeIndex={0}>
            {objectiveIds
              .map((id) => objectiveData[id])
              .map((objective) => (
                <Carousel.Item styles={{ height: 300 }}>
                  <Carousel.Caption>
                    <h3>{objective.title}</h3>
                    <p>{objective.description}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
          </Carousel>
        )}

        {objectiveIds
          .map((id) => objectiveData[id])
          .filter((o) => o)
          .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
          .map((objective) => {
            const endDate = new Date(objective.endDate);
            return (
              <Container
                key={objective._id}
                className={"p-0"}
                style={{
                  maxWidth: 500,
                  flexShrink: 0,
                  // borderRight: "2px solid #CCC",
                }}
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
                <Row>
                  <Col xs={12} className={"d-flex align-items-center"}>
                    <span
                      className={"h3"}
                      style={{ width: "fit-content" }}
                    >{`${objective.title}`}</span>
                    <Button
                      variant={"link"}
                      className={"ml-2 mb-2"}
                      size={"sm"}
                      onClick={() => onEdit(objective._id)}
                    >
                      <PencilFill />
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p>{`${objective.description}`}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
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
                <Col className={"mt-3"}>
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
                <Row>
                  <Col>
                    <Button
                      size={"sm"}
                      onClick={() => onActionAdd(objective._id)}
                    >
                      + Maßnahme hinzufügen
                    </Button>
                  </Col>
                </Row>
              </Container>
            );
          })}
      </div>
    </div>
  );
};
