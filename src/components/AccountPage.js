import Title from "antd/es/typography/Title";
import { useEffect } from "react";
import { requestGetData } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

export const AccountPage = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.data);
  useEffect(() => {
    dispatch(requestGetData());
  }, []);
  return (
    <div>
      <Title level={1}>Mein Account</Title>
      <p>{data}</p>
    </div>
  );
};
