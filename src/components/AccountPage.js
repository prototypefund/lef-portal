import { Heading } from "./shared/Heading";
import { Button, Card, CardGroup, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EmbeddingWizard from "./embedding/EmbeddingWizard";
import { useEffect, useState } from "react";
import { PasswordChangeDialog } from "./accountPageComponents/PasswordChangeDialog";
import { AddRegionDialog } from "./accountPageComponents/AddRegionDialog";
import {
  getCurrentUserId,
  requestAddRegionToAccount,
} from "../redux/authSlice";
import { usePrevious } from "../hooks/usePrevious";
import {
  useChangePasswordMutation,
  useGetAllRegionsQuery,
  useGetUserQuery,
} from "../redux/lefReduxApi";
import { SpinnerWrapper } from "./shared/SpinnerWrapper";
import { LefButton } from "./shared/LefButton";

export const AccountPage = () => {
  const auth = useSelector((state) => state.auth) || {};
  const { changePasswordState } = auth;
  const dispatch = useDispatch();

  const {
    data: regions = [],
    isFetching: isFetchingRegions,
  } = useGetAllRegionsQuery();
  const {
    data: userData = {},
    isFetching: isFetchingUserData,
  } = useGetUserQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const [
    changePassword,
    { isLoading: isUpdatingPassword, isSuccess: isSuccessPasswordChanged },
  ] = useChangePasswordMutation();

  const { username: userName, email, regionIds = [] } = userData;
  const [showEmbeddingDialog, setShowEmbeddingDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showAddRegionDialog, setShowAddRegionDialog] = useState(false);
  const myRegions = regionIds
    .map((id) => regions.find((r) => r._id === id))
    .filter((r) => r);
  const previousPasswordState = usePrevious(changePasswordState);

  useEffect(() => {
    if (showPasswordDialog && isSuccessPasswordChanged) {
      setShowPasswordDialog(false);
    }
  }, [
    changePasswordState,
    dispatch,
    setShowPasswordDialog,
    showPasswordDialog,
    previousPasswordState,
  ]);
  const spinnerProps = { hideBackground: true, horizontal: true };
  return (
    <Col>
      <Heading size={"h1"} text={"Accountverwaltung"} />
      <div className={"mt-3 mb-1"}>
        <Heading size={"h4"} text={"Mein Account"} />
      </div>

      <SpinnerWrapper loading={isFetchingUserData} spinnerProps={spinnerProps}>
        <Form>
          <Row className={"mt-2"}>
            <Form.Group controlId={"userEmail"}>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type={"name"}
                placeholder={"(kein Name vergeben)"}
                value={userName}
                disabled
              />
            </Form.Group>
          </Row>
          <Row className={"mt-2"}>
            <Form.Group controlId={"userEmail"} as={Col}>
              <Form.Label>E-Mail</Form.Label>
              <Form.Control
                type={"email"}
                placeholder={"Ihre E-Mail"}
                value={email}
                disabled
              />
            </Form.Group>

            <Form.Group controlId={"userPassword"} as={Col}>
              <Form.Label>Passwort</Form.Label>
              <Form.Control
                disabled
                type={"password"}
                autoComplete={"current-password"}
                value={"PASSWORD"}
              />
            </Form.Group>
          </Row>
          <Form.Group className={"mt-2"}>
            <LefButton
              title={"Passwort ändern"}
              onClick={() => setShowPasswordDialog(true)}
            />
          </Form.Group>
        </Form>
      </SpinnerWrapper>

      <Row className={"mt-5"}>
        <Col>
          <div className={"mb-2"}>
            <Heading size={"h4"} text={"Verknüpfte Regionen"} />
          </div>
          <SpinnerWrapper
            loading={isFetchingUserData || isFetchingRegions}
            spinnerProps={spinnerProps}
          >
            <Row className={"g-4 mt-3 ml-1"} xs={1} md={2}>
              {myRegions.length > 0 ? (
                myRegions
                  .sort((a, b) => (a.name < b.name ? -1 : 1))
                  .map((r) => {
                    const maxPostalcodes = 15;
                    return (
                      <Card
                        key={r._id}
                        className={"m-1"}
                        style={{ maxWidth: 400 }}
                      >
                        {/*<Card.Header>{r.name}</Card.Header>*/}
                        <Card.Body>
                          <Card.Title>{r.name}</Card.Title>
                          {/*<Card.Subtitle>{r._id}</Card.Subtitle>*/}
                          <Card.Text>
                            <p className={"mb-0 mt-3"}>Postleitzahlbereiche:</p>
                            <div className={"mb-3"}>
                              {r.postalcodes
                                .slice(0, maxPostalcodes)
                                .map((code) => (
                                  <small key={code}>{code + ", "}</small>
                                ))}
                              {r.postalcodes.length > maxPostalcodes && "..."}
                            </div>
                          </Card.Text>
                          <Row className={"ml-0 mt-4"}>
                            <Button size={"sm"}>
                              <Link
                                className={"navbar text-decoration-none"}
                                to={{
                                  pathname: `/result/${r._id}`,
                                  state: { startInEditMode: true },
                                }}
                              >
                                Bearbeiten
                              </Link>
                            </Button>
                          </Row>
                        </Card.Body>
                      </Card>
                    );
                  })
              ) : (
                <p className={"mt-1"}>
                  Bislang sind keine Regionen mit Ihrem Account verknüpft.
                </p>
              )}
            </Row>
          </SpinnerWrapper>

          {/*<div>
            <Button
              className={"mt-2"}
              onClick={() => setShowAddRegionDialog(true)}
            >
              Region hinzufügen
            </Button>
          </div>*/}
        </Col>
      </Row>

      <Row className={"mt-5"}>
        <Col>
          <Heading size={"h4"} text={"Einbettung"} />
          <p className={"mt-2"}>
            Sie können einzelne Elemente oder Diagramme aus dem Klimacheck in
            Ihre eigene Website einbinden.
          </p>
          <Button className={""} onClick={() => setShowEmbeddingDialog(true)}>
            {"Einbettung konfigurieren"}
          </Button>
        </Col>
      </Row>

      <EmbeddingWizard
        ownRegionIds={regionIds}
        regions={regions}
        open={showEmbeddingDialog}
        onClose={() => {
          setShowEmbeddingDialog(false);
        }}
      />

      <PasswordChangeDialog
        show={showPasswordDialog}
        onSubmit={(oldPassword, newPassword) => {
          changePassword({ email, oldPassword, newPassword });
        }}
        onCancel={() => setShowPasswordDialog(false)}
      />

      <AddRegionDialog
        show={showAddRegionDialog}
        onSubmit={(regionId, message) => {
          setShowAddRegionDialog(false);
          dispatch(requestAddRegionToAccount(regionId, message));
        }}
        onCancel={() => setShowAddRegionDialog(false)}
      />
    </Col>
  );
};
