import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestGetObjective } from "../../redux/authSlice";
import { Button, Col, Container, Row } from "react-bootstrap";
import { PencilFill } from "react-bootstrap-icons";

const objectives = [
  {
    objectiveId: "objective1",
    startDate: "1620040876881",
    endDate: "1620040876881",
    title: "Autofreie Stadt",
    description: "Ganz Münster soll autofrei sein.",
    tags: ["tag1"],
    actions: ["action1", "action2"],
  },
  {
    objectiveId: "objective2",
    startDate: "1620040886881",
    endDate: "1620040867881",
    title: "Mehr erneuerbare Energien",
    description:
      "Wir wollen richtig viele neue gute erneuerbare Energien in Münster haben.",
    tags: ["tag1"],
    actions: ["action2"],
  },
  {
    objectiveId: "objective2",
    startDate: "1620040886881",
    endDate: "1620040867881",
    title: "Mehr erneuerbare Energien",
    description:
      "Wir wollen richtig viele neue gute erneuerbare Energien in Münster haben.",
    tags: ["tag1"],
    actions: ["action2"],
  },
  {
    objectiveId: "objective2",
    startDate: "1620040886881",
    endDate: "1620040867881",
    title: "Mehr erneuerbare Energien",
    description:
      "Wir wollen richtig viele neue gute erneuerbare Energien in Münster haben.",
    tags: ["tag1"],
    actions: ["action2"],
  },
];

const actions = [
  {
    actionId: "action1",
    startDate: "1620040876881",
    endDate: "1620040876881",
    title: "Flyover Radstrecke",
    description: "Test-Description",
    tags: ["tag1"],
    data: ["objective1"],
  },
  {
    actionId: "action2",
    startDate: "1620040872003",
    endDate: "1620040879999",
    title: "Bäume-Gießen-Projekt",
    description: "Test-Description",
    tags: ["tag1"],
    data: ["objective2"],
  },
];

export const TargetWidget = (props) => {
  const { onEdit, onActionAdd } = props;
  const dispatch = useDispatch();
  const {
    objectives: objectiveIds = [],
    actions: actionIds = [],
  } = props.regionData;
  const objectiveData = useSelector((state) => state.data.objectiveData);

  useEffect(() => {
    objectiveIds.forEach((objectiveId) => {
      dispatch(requestGetObjective(objectiveId));
    });
  }, [objectiveIds]);
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
        {objectiveIds
          .map((id) => objectiveData[id])
          .filter((o) => o)
          .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
          .map((objective) => {
            const endDate = new Date(objective.endDate);
            return (
              <Container
                key={objective._id}
                className={"p-3, m-3"}
                style={{
                  maxWidth: 500,
                  flexShrink: 0,
                  borderRight: "2px solid #CCC",
                }}
              >
                <div></div>
                <Row>
                  <Col>
                    <h6>{endDate.toLocaleDateString()}</h6>
                  </Col>
                </Row>
                <Row>
                  <Col xs={10}>
                    <h3>{`${objective.title}`}</h3>
                  </Col>
                  <Col>
                    <Button
                      variant={"link"}
                      className={"ml-2"}
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
                  {actionIds.map((id) => (
                    <Row>{id}</Row>
                  ))}
                </Col>
                <Row>
                  <Col>
                    <Button onClick={onActionAdd}>Maßnahme hinzufügen</Button>
                  </Col>
                </Row>
              </Container>
            );
          })}
      </div>
    </div>
  );
};
