import React from "react";
import { connect } from "react-redux";
import { setData } from "../store";

import io from "socket.io-client";
import QRCode from "qrcode.react";
import DatePicker from "react-datepicker";
import moment from "moment";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

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

class DumpData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dbConnected: false,
      ioConnected: false,
      nameDrawn: null,
      startDate: moment().startOf("day"),
      endDate: moment()
        .add(1, "days")
        .startOf("day")
    };

    this.io = {
      db: io("/db")
    };

    this.io.db.on("mongoConnected", () => {
      this.setState({ dbConnected: true });
    });

    this.io.db.on("connect", () => {
      this.setState({ ioConnected: true });
    });
  }

  componentWillUnmount() {
    this.io.db.disconnect();
  }

  emailUrl(subject, data) {
    return `mailto:?subject=${subject}&body=${encodeURI(
      typeof data !== "string" ? JSON.stringify(data) : data
    )}`;
  }

  componentDidUpdate() {
    if (this.props.data == null) {
      this.io.db.emit(
        "dumpData",
        this.state.startDate,
        this.state.endDate,
        data => {
          this.props.setData(data);
        }
      );
    }
  }

  handleStartDateChange(e) {
    this.setState({ startDate: moment(e) });

    if (moment(e).isAfter(this.state.endDate)) {
      this.setState({
        endDate: moment(e)
          .add(1, "days")
          .startOf("day")
      });
    }

    this.props.setData(null);
  }

  handleEndDateChange(e) {
    this.setState({ endDate: moment(e) });

    if (moment(e).isBefore(this.state.startDate)) {
      this.setState({
        startDate: moment(e)
          .add(-1, "days")
          .startOf("day")
      });
    }

    this.props.setData(null);
  }

  render() {
    return (
      <Container>
        <Card>
          <Card.Header>
            <h2>Dump Data</h2>
          </Card.Header>
          <Card.Body>
            <Card.Title>
              {this.state.ioConnected ? (
                <Badge variant="success">Socket.io: Connected</Badge>
              ) : (
                <Badge variant="danger">Socket.io: Disconnected</Badge>
              )}{" "}
              {this.state.dbConnected ? (
                <Badge variant="success">MongoDB: Connected</Badge>
              ) : (
                <Badge variant="danger">MongoDB: Disconnected</Badge>
              )}{" "}
            </Card.Title>
            <Card.Title>
              <span>Checkins from </span>
              <DatePicker
                selected={this.state.startDate.toDate()}
                onChange={this.handleStartDateChange.bind(this)}
                locale="en"
                disabled={!this.state.dbConnected}
              />
              <span> to </span>
              <DatePicker
                selected={this.state.endDate.toDate()}
                onChange={this.handleEndDateChange.bind(this)}
                locale="en"
                disabled={!this.state.dbConnected}
              />
            </Card.Title>
            {this.props.data && (
              <Container className="p-2">
                <Row>
                  <Col>
                    {this.props.data.length < 50 && (
                      <QRCode
                        size={400}
                        value={this.emailUrl(
                          "Kiosk Data",
                          this.props.data.map(row => row.join(",")).join("\n")
                        )}
                      />
                    )}
                  </Col>
                  <Col>
                    <pre
                      style={{ width: 400, height: 400 }}
                      className="scrollable"
                    >
                      {this.props.data.map(row => JSON.stringify(row) + "\n")}
                    </pre>
                  </Col>
                </Row>
              </Container>
            )}
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
)(DumpData);
