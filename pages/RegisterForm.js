import React from "react";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";

class RegisterForm extends React.Component {
  render() {
    return (
      <Card style={{ width: "100%", height: "100%" }}>
        <Card.Header>New Maker</Card.Header>
        <Card.Body>
          <Card.Title>
            This appeares to be your first time here.
            <br />
            Please fill out the form to register.
          </Card.Title>
          <Form
            onSubmit={e => {
              e.preventDefault();
              this.props.onSubmit(e);
            }}
          >
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                type="text"
                placeholder="<<< enter your name >>>"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>N-Number</Form.Label>
              <Form.Control
                name="n_number"
                type="text"
                placeholder="<<< enter your N number >>>"
              />
            </Form.Group>

            <ButtonToolbar>
              <Button variant="liberty-primary" type="submit">
                Register
              </Button>
              <Button
                variant="liberty-secondary"
                onClick={e => this.props.onCancel(e)}
              >
                Cancel
              </Button>
            </ButtonToolbar>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

export default RegisterForm;
