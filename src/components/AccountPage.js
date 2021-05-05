import { useEffect } from "react";
import { requestGetData } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Heading } from "./shared/Heading";

export const AccountPage = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.data);
  useEffect(() => {
    dispatch(requestGetData());
  }, []);
  return (
    <div>
      <Heading size={"h1"} text={"Mein Account"} />
      <p>{data}</p>
    </div>
  );
};
