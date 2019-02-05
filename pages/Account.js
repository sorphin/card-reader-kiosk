import React from "react";
import Moment from "react-moment";

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";

class Account extends React.Component {
  render() {
    const { name, nNumber, id, created, events } = this.props.account;
    return (
      <Card>
        <Card.Header>{name}</Card.Header>
        <Card.Body>
          <ListGroup>
            <ListGroup.Item>
              <b>ID:</b> {id}
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Created:</b> <Moment fromNow>{created}</Moment>
            </ListGroup.Item>
            <ListGroup.Item>
              <b>N-Number:</b> {nNumber}
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Events:</b>
              {events}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
        <Card.Footer>
          <ButtonToolbar>
            <Button
              variant="liberty-primary"
              onClick={e => this.props.onDone && this.props.onDone(e)}
            >
              Done
            </Button>
          </ButtonToolbar>
        </Card.Footer>
      </Card>
    );
  }
}

export default Account;
