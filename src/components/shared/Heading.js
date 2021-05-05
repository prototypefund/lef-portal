export const Heading = ({ text, size }) => {
  switch (size) {
    case "h3":
      return <h3>{text}</h3>;
    case "h2":
      return <h2>{text}</h2>;
    case "h4":
      return (
        <p className={"h4"} style={{ margin: 0 }}>
          {text}
        </p>
      );
    default:
      return <h1>{text}</h1>;
  }
};
