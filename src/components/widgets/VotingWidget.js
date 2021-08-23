import { Col, Row } from "react-bootstrap";
import React, { useEffect, useMemo } from "react";
import { LefBarChart } from "../shared/charts/LefBarChart";
import { SelectVotingDistrictArea } from "./votingWidgetComponents/SelectVotingDistrictArea";
import { lefReduxApi } from "../../redux/lefReduxApi";
import { parties } from "../../assets/germanParties";
import { isArrayWithOneElement, roundToN } from "../../utils/utils";

let partyNameDictionary = {};
Object.keys(parties).forEach((key) => {
  const party = parties[key];
  partyNameDictionary[party.short] = key;
  party.names.forEach((name) => {
    partyNameDictionary[name] = key;
  });
});

const getPartyColor = (party) => {
  const partyObject = partyNameDictionary[party]
    ? parties[partyNameDictionary[party]]
    : {} || {};
  return partyObject.primaryColor || "#DDD";
};

export const VotingWidget = ({ regionData = {}, editMode, isMobile }) => {
  const { votings = [] } = regionData;
  const [
    getVotingDataForDistrict,
    result = {},
  ] = lefReduxApi.endpoints.getVotingDataForDistrict.useLazyQuery();
  const { data: electionData = {} } = result;

  const votingDataId = isArrayWithOneElement(votings) ? votings[0] : null;

  useEffect(() => {
    if (votingDataId) {
      getVotingDataForDistrict(votingDataId);
    }
  }, [votingDataId]);

  const { votingData = [], districtName: electionDistrictName } = electionData;
  let partyData = {};
  let labels = [];

  votingData.forEach((voting) => {
    const { validVotes, year, partyResults = [] } = voting;
    labels.push(year);
    partyResults.forEach((partyResult) => {
      const { party, result } = partyResult;
      partyData[party] = [
        ...(partyData[party] || []),
        { year, result: roundToN((result / validVotes) * 100, 1) },
      ];
    });
  });

  const startYear = Math.min(...votingData.map((d) => d.year));
  const endYear = Math.max(...votingData.map((d) => d.year));

  const data = {
    labels: labels,
    datasets: Object.keys(partyData).map((key) => ({
      color: getPartyColor(key),
      label: key,
      data: labels.map((year) => {
        const partyEntry = partyData[key] || {};
        const partyEntryForYear = partyEntry.find((d) => d.year === year);
        return partyEntryForYear ? partyEntryForYear.result : 0;
      }),
    })),
  };

  const title = `Wahlergebnisse der Region ${electionDistrictName}`;
  const description = `Die Grafik zeigt die Wahlergebnisse der Region ${electionDistrictName} im Zeitraum von ${startYear} bis ${endYear}.`;
  const lefBarChart = useMemo(
    () => (
      <LefBarChart isMobile={isMobile} data={data} isPercent xTitle={title} />
    ),
    [electionDistrictName]
  );
  return (
    <>
      {editMode && <SelectVotingDistrictArea regionData={regionData} />}
      {votingData.length > 0 ? (
        isMobile ? (
          lefBarChart
        ) : (
          <Col>
            <Row>
              <div style={{ width: "100%" }}>{lefBarChart}</div>
            </Row>
            <Row>
              <p>{description}</p>
            </Row>{" "}
          </Col>
        )
      ) : (
        <p className={"text-center mt-2 alert alert-secondary"}>
          Keine Daten vorhanden.
        </p>
      )}
    </>
  );
};
