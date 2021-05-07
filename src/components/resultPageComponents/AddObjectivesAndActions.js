import { Button, Form } from "react-bootstrap";
import { useState } from "react";

export const AddObjectivesAndActions = () => {
  const [title, setTitle] = useState("");
  return (
    <div>
      <h4>Ziel hinzufügen</h4>
      <Form>
        <Form.Group controlId={"addObjectiveForm"}>
          <Form.Label>Name</Form.Label>
          <Form.Control
            onChange={(e) => setTitle(e.target.value)}
            type={"title"}
            placeholder={"Name des Ziels"}
            value={title}
          />
          <Button variant="primary" className={"mt-3"}></Button>
        </Form.Group>
      </Form>
    </div>
  );
};
