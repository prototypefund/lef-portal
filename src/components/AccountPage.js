import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Heading } from "./shared/Heading";

export const AccountPage = () => {
  const data = useSelector((state) => state.data.data);
  useEffect(() => {}, []);
  return (
    <div>
      <Heading size={"h1"} text={"Mein Account"} />
      <p>{data}</p>
    </div>
  );
};
