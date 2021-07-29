import { Col, Row } from "react-bootstrap";
import React, { useEffect } from "react";
import { requestGetVotingForDistrict } from "../../redux/votingSlice";
import { useDispatch, useSelector } from "react-redux";
import { LefBarChart } from "../shared/charts/LefBarChart";

const fakeElectionData = {
  region: "Münster",
  districtName: "Münster Innenstadt",
  districtId: 123,
  votingData: [
    {
      year: 2018,
      eligibleVoters: 1900,
      voters: 2000,
      validVotes: 1650,
      partyResults: [
        {
          party: "SPD",
          result: 90,
        },
        {
          party: "CDU",
          result: 10,
        },
      ],
    },
    {
      year: 2020,
      eligibleVoters: 2900,
      voters: 3000,
      validVotes: 2650,
      partyResults: [
        {
          party: "SPD",
          result: 80,
        },
        {
          party: "CDU",
          result: 20,
        },
        {
          party: "Grüne",
          result: 50,
        },
      ],
    },
    {
      year: 2022,
      eligibleVoters: 2900,
      voters: 3000,
      validVotes: 2650,
      partyResults: [
        {
          party: "SPD",
          result: 70,
        },
        {
          party: "Grüne",
          result: 60,
        },
      ],
    },
  ],
};

const partyColors = {
  SPD: `rgb(220,50,50)`,
  Grüne: `rgb(50,160,50)`,
  CDU: `rgb(50,50,50)`,
};

const getPartyColor = (party) => partyColors[party];

export const VotingWidget = ({ regionData = {} }) => {
  const dispatch = useDispatch();
  const { votingId, districtId, districtName } = regionData;
  useEffect(() => {
    if (votingId || districtId || districtName)
      dispatch(requestGetVotingForDistrict(votingId, districtId, districtName));
  });

  const electionData =
    useSelector((state) => state.voting[votingId]) || fakeElectionData;
  const {
    // region,
    votingData = [],
    // districtName: electionDistrictName,
  } = electionData;
  let partyData = {};
  let labels = [];
  votingData.forEach((voting) => {
    const {
      // eligibleVoters,
      // voters,
      // validVotes,
      year,
      partyResults = [],
    } = voting;
    labels.push(year);
    partyResults.forEach((partyResult) => {
      const { party, result } = partyResult;
      partyData[party] = [...(partyData[party] || []), { year, result }];
    });
  });

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

  return (
    <Col>
      {votingData.length > 0 ? (
        <Row>
          <Col sm={12} lg={12}>
            <div style={{ width: "100%" }}>
              <LefBarChart data={data} />
            </div>
          </Col>
          {/*<Col sm={12} lg={4} className={"mt-sm-2"}>
          <p
            style={{ whiteSpace: "pre-wrap" }}
          >{`Die stärkste Partei bei der letzten Wahl in ${electionDistrictName} war die Partei "${mostRecentWinner}" mit ${mostRecentWinnerResult} Prozent.`}</p>
        </Col>*/}
        </Row>
      ) : (
        <p className={"text-center mt-2 alert alert-secondary"}>
          Keine Daten vorhanden.
        </p>
      )}
    </Col>
  );
};
