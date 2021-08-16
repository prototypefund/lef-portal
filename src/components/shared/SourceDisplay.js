export const SourceDisplay = ({ sources = [] }) =>
  sources.length === 0 ? (
    <></>
  ) : (
    <div
      className={"small text-muted d-flex justify-content-end mt-2 w-100"}
      style={{ fontSize: "0.7em" }}
    >
      <span style={{ whiteSpace: "pre-wrap" }}>
        {sources.length > 1 ? "Quellen: " : "Quelle: "}
      </span>
      {sources.join(", ")}
    </div>
  );
