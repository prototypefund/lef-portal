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

export const TargetWidget = (props) => (
  <div>
    <h1>{`Ziele der Stadt ${props.city}`}</h1>
    <div
      className={"alert alert-info d-flex"}
      style={{ width: "100vw", overflow: "auto" }}
    >
      {objectives.map((objective) => (
        <div
          style={{
            width: 500,
            flexShrink: 0,
          }}
        >
          <div></div>
          <h3>{`${objective.title}`}</h3>
          <p>{`${objective.description}`}</p>
        </div>
      ))}
    </div>
  </div>
);
