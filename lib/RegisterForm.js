import React from "react";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";
import AsyncSelect from "react-select/lib/Async";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      number: "",
      email: ""
    };
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(e);
  }

  render() {
    return (
      <Card style={{ width: "100%", height: "100%" }}>
        <Card.Header>New Maker</Card.Header>
        <Card.Body>
          <Card.Title>
            This must be your first time here.
            <br />
            Please fill out the form to register.
          </Card.Title>
          <Form onSubmit={e => this.onSubmit(e)}>
            <Form.Group>
              <AsyncSelect
                placeholder="<<< start typing your name or number here >>>"
                loadOptions={i => this.props.loadOptions(i)}
                defaultOptions={true}
                autoFocus={true}
                onChange={selected => this.setState(selected.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Number</Form.Label>
              <Form.Control
                name="number"
                type="text"
                value={this.state.number}
                onChange={e => this.onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                type="text"
                value={this.state.name}
                onChange={e => this.onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="text"
                value={this.state.email}
                onChange={e => this.onChange(e)}
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
