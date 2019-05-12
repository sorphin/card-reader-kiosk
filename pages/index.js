import _ from "lodash";
import React from "react";
import Head from "next/head";
import io from "socket.io-client";
import { connect } from "react-redux";
import { formSerialize } from "react-form-utils";

import { setCard, setAccount, setCheckin, reset } from "../store";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import QRCode from "qrcode.react";

import "bootstrap/dist/css/bootstrap-reboot.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import "bootstrap/dist/css/bootstrap.css";
import "../static/style.css";

import Account from "../lib/Account";
import RegisterForm from "../lib/RegisterForm";
import InvalidCard from "../lib/InvalidCard";
import Links from "../lib/Links";

const mapStateToProps = (state = {}) => ({ ...state });
const mapDispatchToProps = dispatch => ({
  setCard: card => dispatch(setCard(card)),
  setAccount: account => dispatch(setAccount(account)),
  setCheckin: checkin => dispatch(setCheckin(checkin)),
  reset: () => dispatch(reset())
});

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dbConnected: false,
      ioConnected: false,
      mqttConnected: false
    };

    this.io = {
      socket: io(),
      reader: io("/reader"),
      db: io("/db")
    };

    this.io.socket.on("connect", () => {
      this.setState({ ioConnected: true });
    });

    this.io.socket.on("disconnect", () => {
      this.setState({
        dbConnected: false,
        ioConnected: false,
        mqttConnected: false
      });
    });

    this.io.reader.on("mqttConnected", () => {
      this.setState({ mqttConnected: true });
    });

    this.io.db.on("mongoConnected", () => {
      this.setState({ dbConnected: true });
    });

    this.io.reader.on("reader/card", card => {
      this.props.setCard(card);
    });
  }

  componentWillUnmount() {
    this.io.socket.disconnect();
  }

  componentDidUpdate() {
    if (this.props.card != null && this.props.account == null) {
      this.io.db.emit("getAccount", this.props.card, account => {
        this.props.setAccount(account);
      });
    }

    if (this.props.account != null && this.props.checkin == null) {
      this.io.db.emit("checkin", this.props.account, checkin => {
        this.props.setCheckin(checkin);
      });
    }
  }

  handleSubmit(event) {
    const { name, number, email } = formSerialize(event.target);
    const { card } = this.props;

    if (card && name && number) {
      this.io.db.emit("createAccount", name, number, email, card, account => {
        this.props.setAccount(account);
      });
    } else {
      this.setState({ alert: "Need both Name and N-number to register." });
    }
  }

  loadOptions(input) {
    return new Promise(resolve => {
      this.io.db.emit("getUsers", input, users => {
        (users &&
          resolve(
            users.map(u => ({
              value: { number: u.number, name: u.name, email: u.email },
              label: `${u.number} (${u.name})`
            }))
          )) ||
          resolve([]);
      });
    });
  }

  handleCancel(event) {
    this.props.reset();
  }

  dataUrl(data) {
    return `data:application/json;base64,${Buffer.from(
      JSON.stringify(data, null, 2)
    ).toString("base64")}`;
  }

  emailUrl(subject, data) {
    return `mailto:?subject=${subject}&body=${encodeURI(JSON.stringify(data))}`;
  }

  render() {
    var raw_data = JSON.stringify(
      { card: this.props.card, account: this.props.account },
      null,
      2
    );
    return (
      <div>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>

        {this.state.alert && (
          <Alert
            variant="danger"
            className="fixed-top w-100"
            onClose={() => this.setState({ alert: null })}
          >
            <Alert.Heading>{this.state.alert}</Alert.Heading>
            <div className="d-flex justify-content-end">
              <Button
                onClick={() => this.setState({ alert: null })}
                variant="outline-danger"
              >
                Close
              </Button>
            </div>
          </Alert>
        )}

        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <Image src="static/Dover-Maker-Space2.png" />
            </Col>
          </Row>
          <Row className="yellow-title-background blue-text">
            <Col lg={12}>
              <h1>Check-In Kiosk</h1>
              <div className="m-2">
                {this.state.ioConnected ? (
                  <Badge variant="success">Socket.io: Connected</Badge>
                ) : (
                  <Badge variant="danger">Socket.io: Disconnected</Badge>
                )}{" "}
                {this.state.mqttConnected ? (
                  <Badge variant="success">MQTT: Connected</Badge>
                ) : (
                  <Badge variant="danger">MQTT: Disconnected</Badge>
                )}{" "}
                {this.state.dbConnected ? (
                  <Badge variant="success">MongoDB: Connected</Badge>
                ) : (
                  <Badge variant="danger">MongoDB: Disconnected</Badge>
                )}{" "}
              </div>
            </Col>
          </Row>
          <Row className="yellow-background">
            <Col md={7} lg={8}>
              {!this.props.card && (
                <Card>
                  <Card.Header>Please scan your badge to begin</Card.Header>
                  <Card.Body />
                </Card>
              )}
              {this.props.card &&
                (this.props.account ? (
                  <Account
                    account={this.props.account}
                    checkin={this.props.checkin}
                    onDone={e => {
                      this.handleCancel(e);
                    }}
                  />
                ) : this.props.card.FacilityCode > 0 &&
                  this.props.card.CardCode > 0 ? (
                  <RegisterForm
                    onSubmit={e => this.handleSubmit(e)}
                    onCancel={e => this.handleCancel(e)}
                    loadOptions={input => this.loadOptions(input)}
                  />
                ) : (
                  <InvalidCard onOk={e => this.handleCancel(e)} />
                ))}
            </Col>
            <Col md={5} lg={4}>
              <Card>
                <Card.Header>Raw Data</Card.Header>
                <Card.Body>
                  <div className="text-center">
                    <QRCode value={raw_data} size={200} />
                  </div>
                  <hr />
                  <Card.Text
                    style={{
                      fontSize: "small",
                      display: "block",
                      unicodeBidi: "embed",
                      fontFamily: "monospace",
                      whiteSpace: "pre",
                      overflow: "auto"
                    }}
                  >
                    {raw_data}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="yellow-background">
            <Col lg={12}>
              <Links />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
