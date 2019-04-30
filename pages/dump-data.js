import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { setData } from "../store";

import io from "socket.io-client";
import QRCode from "qrcode.react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "bootstrap/dist/css/bootstrap-reboot.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import "bootstrap/dist/css/bootstrap.css";
import "../static/style.css";

const mapStateToProps = (state = {}) => ({ ...state });
const mapDispatchToProps = dispatch => ({
  dumpData: () => dispatch(dumpData()),
  setData: data => dispatch(setData(data))
});

class DumpData extends React.Component {
  constructor(props) {
    super(props);

    this.io = {
      db: io("/db")
    };

    this.io.db.on("mongoConnected", () => {
      this.io.db.emit("dumpData", data => {
        console.log(data);
        this.props.setData(data);
      });
    });

    this.io.db.on("connect", () => {
      console.log("Connected to socket.io ['/db']");
    });
  }

  componentWillUnmount() {
    this.io.db.disconnect();
  }

  componentDidUpdate() {
    if (this.props.data == null) {
      this.io.db.emit("dumpData", data => {
        this.props.setData(data);
      });
    }
  }

  emailUrl(subject, data) {
    return `mailto:?subject=${subject}&body=${encodeURI(JSON.stringify(data))}`;
  }

  render() {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row>
          <Col>
            <QRCode size={400} value={this.emailUrl("Kiosk Data", this.props.data)} />
          </Col>
          <Col>
            <pre>{JSON.stringify(this.props.data, null, 2)}</pre>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DumpData);
