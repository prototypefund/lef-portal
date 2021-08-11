import { Col, Row } from "react-bootstrap";
import React, { useEffect } from "react";
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

export const VotingWidget = ({ regionData = {}, editMode }) => {
  const { votings = [] } = regionData;
  // const { data: electionData = {} } = useGetVotingDataForDistrictQuery(isArrayWithOneElement(votings) ? votings[0] : null);
  const [
    getVotingDataForDistrict,
    result = {},
  ] = lefReduxApi.endpoints.getVotingDataForDistrict.useLazyQuery();
  const { data: electionData = {} } = result;

  useEffect(() => {
    if (isArrayWithOneElement(votings)) {
      getVotingDataForDistrict(votings[0]);
    }
  }, [votings]);

  const {
    // region,
    votingData = [],
    districtName: electionDistrictName,
  } = electionData;
  let partyData = {};
  let labels = [];

  votingData.forEach((voting) => {
    const {
      // eligibleVoters,
      // voters,
      validVotes,
      year,
      partyResults = [],
    } = voting;
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
  const description = `Wahlergebnisse der Region ${electionDistrictName} im Zeitraum von ${startYear} bis ${endYear}:`;
  return (
    <Col>
      {editMode && <SelectVotingDistrictArea regionData={regionData} />}
      {votingData.length > 0 ? (
        <Col>
          <Row>
            <p>{description}</p>
          </Row>{" "}
          <Row>
            <Col sm={12} lg={12}>
              <div style={{ width: "100%" }}>
                <LefBarChart data={data} isPercent xTitle={title} />
              </div>
            </Col>
            {/*<Col sm={12} lg={4} className={"mt-sm-2"}>
          <p
            style={{ whiteSpace: "pre-wrap" }}
          >{`Die stärkste Partei bei der letzten Wahl in ${electionDistrictName} war die Partei "${mostRecentWinner}" mit ${mostRecentWinnerResult} Prozent.`}</p>
        </Col>*/}
          </Row>
        </Col>
      ) : (
        <p className={"text-center mt-2 alert alert-secondary"}>
          Keine Daten vorhanden.
        </p>
      )}
    </Col>
  );
};
