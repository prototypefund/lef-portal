import { ResultEntry } from "./resultPageComponents/ResultEntry";
import { Heading } from "./shared/Heading";
import { Button, Col, Container, Row } from "react-bootstrap";
import { ObjectivesWidget } from "./widgets/ObjectivesWidget";
import React, { useEffect } from "react";
import {
  requestGetAllActionsForRegion,
  requestGetAllObjectivesForRegion,
  requestGetRegion,
} from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeftCircleFill } from "react-bootstrap-icons";
import { PRIMARY_COLOR, PRIMARY_COLOR_DARK } from "../assets/colors";
import { WeatherWidget } from "./widgets/WeatherWidget";
import { AttitudeWidget } from "./widgets/AttitudeWidget";

export const ResultPage = ({ regionId, onBack = () => {} }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestGetRegion(regionId));
    dispatch(requestGetAllObjectivesForRegion(regionId));
    dispatch(requestGetAllActionsForRegion(regionId));
  }, []);

  const regionData =
    useSelector((state) => state.data.regionData[regionId]) || {};
  const { name } = regionData;

  const widgets = [
    {
      id: 1,
      question:
        "Welche Meilensteine hat %s schon erreicht?\nWelche Ziele hat sich %s für die Zukunft gesetzt?",
      component: <ObjectivesWidget regionData={regionData} />,
    },
    {
      id: 2,
      question:
        "Hat sich das Wetter in %s in den letzten Jahrzehnten verändert?",
      component: <WeatherWidget regionData={regionData} />,
    },
    {
      id: 3,
      question:
        "Hat sich das Verhalten und die Einstellung der Bürger:innen in Münster mit Hinblick auf den Klimaschutz in den letzten Jahren verändert?",
      component: <AttitudeWidget regionData={regionData} />,
    },
  ];
  let header = (
    <Row>
      <Col>
        <div className={"d-flex align-items-center mb-1"}>
          <div className={"flex-grow-0"}>
            <Button variant={"link"} className={"mr-1"} onClick={onBack}>
              <ArrowLeftCircleFill size={25} color={PRIMARY_COLOR_DARK} />
            </Button>
          </div>
          <div className={"flex-grow-1"}>
            <Heading size={"h4"} text={`Dein Klimacheck für: ${name}`} />
          </div>
        </div>
      </Col>
    </Row>
  );
  return (
    <Container fluid>
      {header}

      <Row>
        <Col>
          {widgets.map((entry) => (
            <ResultEntry
              key={entry.id}
              question={entry.question.replaceAll("%s", name)}
              component={entry.component}
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
};
