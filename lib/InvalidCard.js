import React from "react";

import Card from "react-bootstrap/Card";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";

class InvalidCard extends React.Component {
  render() {
    return (
      <Card>
        <Card.Header>Sorry that is not a valid card.</Card.Header>
        <Card.Body />
        <Card.Footer>
          <ButtonToolbar>
            <Button
              variant="liberty-primary"
              onClick={e => this.props.onOk && this.props.onOk(e)}
            >
              Ok
            </Button>
          </ButtonToolbar>
        </Card.Footer>
      </Card>
    );
  }
}

export default InvalidCard;
