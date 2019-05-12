import React from "react";
import { connect } from "react-redux";
import { setData } from "../store";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

import "bootstrap/dist/css/bootstrap-reboot.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-datepicker/dist/react-datepicker.css";
import "../static/style.css";

import Links from "../lib/Links";

const mapStateToProps = (state = {}) => ({ ...state });
const mapDispatchToProps = dispatch => ({
  setData: data => dispatch(setData(data))
});

class DrawName extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Card>
          <Card.Header>
            <h2>Draw Name</h2>
          </Card.Header>
          <Card.Body>body</Card.Body>
          <Card.Footer>
            <Links />
          </Card.Footer>
        </Card>
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawName);
