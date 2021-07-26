import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LefModal } from "../shared/LefModal";
import { Col, Form } from "react-bootstrap";
import * as PropTypes from "prop-types";

export function AddRegionDialog({ show, onCancel, onSubmit }) {
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [message, setMessage] = useState("");
  const allRegions = useSelector((state) => state.data.regionData);
  const userData = useSelector((state) => state.auth.user) || {};

  const addableRegions = userData.regionIds
    ? allRegions
        .filter((r) => !userData.regionIds.includes(r._id))
        .sort((a, b) => (b.name > a.name ? -1 : 1))
    : [];

  useEffect(() => {
    setSelectedRegionId("");
    setMessage("");
  }, [show]);
  return (
    <LefModal
      size={"lg"}
      show={show}
      buttons={[
        { label: "Abbrechen", onClick: onCancel, variant: "secondary" },
        {
          label: "Beantragen",
          onClick: () => onSubmit(selectedRegionId, message),
        },
      ]}
      title={"Region hinzufügen"}
      content={
        <>
          <Form.Group controlId={"selectRegion"} as={Col}>
            <Form.Label>Region auswählen</Form.Label>
            <Form.Control
              as="select"
              // defaultValue={pleaseChoose}
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
            >
              {addableRegions.map((region) => (
                <option key={region._id} value={region._id}>
                  {region.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId={"message"} as={Col}>
            <p>
              {"Um eine Region (Kommune, Kreis) zu ihrem Account hinzuzufügen, müssen Sie eine berechtigte " +
                "Vertretungsperson dieser Region sein. Bitte geben Sie nachfolgend einen Link zu einer Website an, " +
                "aus der ersichtlich wird, dass Sie eine berechtigte Vertretungsperson Ihrer Kommune bzw. Ihres Kreises sind. Die E-Mailadresse auf der Website muss mit der E-Mailadresse Ihres Kontos hier übereinstimmen."}
            </p>
            <Form.Label>Nachricht</Form.Label>
            <Form.Control
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              as={"textarea"}
              style={{ height: 150 }}
              placeholder={"Bitte hier einen entsprechenden Link einfügen"}
            />
          </Form.Group>
        </>
      }
    />
  );
}

AddRegionDialog.propTypes = {
  show: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};
