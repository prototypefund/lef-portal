import { QuestionCircleFilled } from "@ant-design/icons";

export const ResultEntry = ({ question }) => (
  <>
    <div className={"d-flex"}>
      <div className={"d-flex alert alert-secondary align-items-center"}>
        <div className={"mr-3"}>
          <QuestionCircleFilled style={{ fontSize: 35 }} />
        </div>
        <div style={{ whiteSpace: "pre-wrap" }}>{question}</div>
      </div>
    </div>
  </>
);
