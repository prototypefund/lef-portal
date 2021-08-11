const fakeWeatherData = {
  climateData: [
    {
      year: 2010,
      monthlyData: [
        {
          month: 10,
          temperatureMean: 13.4,
          rainfall: 220,
        },
        {
          month: 11,
          temperatureMean: 12.8,
          rainfall: 230,
        },
      ],
    },
    {
      year: 2011,
      monthlyData: [
        {
          month: 1,
          temperatureMean: 13.2,
          rainfall: 225,
        },
        {
          month: 2,
          temperatureMean: 13.8,
          rainfall: 210,
        },
      ],
    },
  ],
};

export const fakeElectionData = {
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
