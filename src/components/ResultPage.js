import { ResultEntry } from "./resultPageComponents/ResultEntry";
import { Heading } from "./shared/Heading";
import { Button, Col, Container, Row } from "react-bootstrap";
import { ObjectivesWidget } from "./widgets/ObjectivesWidget";
import React, { useEffect } from "react";
import {
  requestGetAllObjectivesForRegion,
  requestGetRegion,
} from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeftCircleFill } from "react-bootstrap-icons";
import { PRIMARY_COLOR } from "../assets/colors";
import { WeatherWidget } from "./widgets/WeatherWidget";

export const ResultPage = ({ regionId, onBack = () => {} }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestGetRegion(regionId));
    dispatch(requestGetAllObjectivesForRegion(regionId));
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
        "Wie hat sich das Wetter in %s in den letzten Jahrzehnten verändert?",
      component: <WeatherWidget regionData={regionData} />,
    },
  ];
  return (
    <Container fluid>
      <Row>
        <Col>
          <div className={"d-flex align-items-center mb-1"}>
            <div className={"flex-grow-0"}>
              <Button variant={"link"} className={"mr-1"} onClick={onBack}>
                <ArrowLeftCircleFill size={25} color={PRIMARY_COLOR} />
              </Button>
            </div>
            <div className={"flex-grow-1"}>
              <Heading size={"h4"} text={`Dein Klimacheck für: ${name}`} />
            </div>
          </div>
        </Col>
      </Row>

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
