import React from "react";
import { connect } from "react-redux";
import { setData } from "../store";

import io from "socket.io-client";
import moment from "moment";

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
  setData: data => dispatch(setData(data)),
});

class DrawName extends React.Component {
  constructor(props) {
    super(props);

    this.io = {
      db: io("/db"),
    };

    this.io.db.on("mongoConnected", () => {
      this.setState({ dbConnected: true });
    });
  }

  componentWillUnmount() {
    this.io.db.disconnect();
  }

  componentDidUpdate() {
    if (this.props.data == null) {
      this.io.db.emit(
        "dumpData",
        moment().startOf("day"),
        moment()
          .add(1, "days")
          .startOf("day"),
        data => {
          this.props.setData(data);
        }
      );
    }
  }

  render() {
    return (
      <Container>
        <Card>
          <Card.Header>
            <h2>Draw Name</h2>
          </Card.Header>
          <Card.Body>
            <pre className="scrollable">
              {this.props.data &&
                this.props.data.map(row => JSON.stringify(row) + "\n")}
            </pre>
          </Card.Body>
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
