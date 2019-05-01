import React from "react";
import Moment from "react-moment";

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";

class Account extends React.Component {
  render() {
    const { name, nNumber, id, created, checkins } = this.props.account;

    return (
      <Card>
        <Card.Header>{name}</Card.Header>
        <Card.Body>
          <Card.Text style={{ fontSize: "2em" }}>{name}</Card.Text>
          <ListGroup>
            <ListGroup.Item>
              <b>ID: </b> {id}
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Created: </b> <Moment fromNow>{created}</Moment>
            </ListGroup.Item>
            <ListGroup.Item>
              <b>N-Number: </b> {nNumber}
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Checkin: </b>
              <Moment fromNow>{checkins && checkins.slice(-1).created}</Moment>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
        <Card.Footer>
          <ButtonToolbar>
            <Button variant="liberty-primary" onClick={e => this.props.onDone && this.props.onDone(e)}>
              Done
            </Button>
          </ButtonToolbar>
        </Card.Footer>
      </Card>
    );
  }
}

export default Account;
