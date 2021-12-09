const CustomCheckbox = () => (
  <div className={"checkmark"}>
    <div className="checkmark_stem"></div>
    <div className="checkmark_kick"></div>
  </div>
);

export const LayerEntry = ({
  color = "#FFF",
  label = "",
  onClick = () => {},
  active = true,
}) => (
  <div
    className={"w-100 pl-2 pb-2 p-1 d-flex align-items-center interactiveLink"}
    style={{
      minWidth: 150,
      cursor: "pointer",
      borderRadius: 5,
      ...(!active && { opacity: 0.5 }),
    }}
    onClick={onClick}
  >
    <div
      style={{
        backgroundColor: color,
        color: "#FFF",
        marginRight: 12,
        borderRadius: 5,
        width: 20,
        height: 20,
      }}
    >
      {active && <CustomCheckbox />}
    </div>
    <div>{label}</div>
  </div>
);
