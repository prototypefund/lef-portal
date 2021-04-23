import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Typography,
} from "antd";
import Title from "antd/es/typography/Title";
import { useDispatch, useSelector } from "react-redux";
import { requestSignIn } from "../redux/authSlice";

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 5,
    span: 19,
  },
};

export function SignInPage() {
  const dispatch = useDispatch();
  const authMessage = useSelector((state) => state.auth.message);
  const authState = useSelector((state) => state.auth.authState);
  const onFinish = (values) => {
    // console.log("Success:", values);
    dispatch(requestSignIn(values.username, values.password));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Row style={{ margin: 10 }}>
      {authState === "loggedIn" ? (
        <Col>Erfolgreich eingeloggt.</Col>
      ) : (
        <Col span={24}>
          <Title level={1}>Einloggen</Title>
          <Typography style={{ whiteSpace: "pre-wrap", marginBottom: 15 }}>
            {"Loggen Sie sich mit Ihrem Nutzernamen und Passwort ein."}
          </Typography>
          <Form
            {...layout}
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Benutzername"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Bitte Ihren Benutzernamen nicht vergessen.",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Passwort"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Bitte Ihr Passwort eingeben.",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Eingeloggt bleiben</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Einloggen
              </Button>
            </Form.Item>
          </Form>

          <Form.Item {...tailLayout}>
            {authMessage && (
              <Typography style={{ color: "red" }}>{authMessage}</Typography>
            )}
          </Form.Item>
          <Divider />

          <Row align={"middle"}>
            <Typography>Noch keinen Account?</Typography>
            <Button type={"link"} href={"/signUp"}>
              Jetzt registrieren
            </Button>
          </Row>
        </Col>
      )}
    </Row>
  );
}
