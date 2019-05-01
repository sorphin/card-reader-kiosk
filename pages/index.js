import _ from "lodash";
import React from "react";
import Head from "next/head";
import io from "socket.io-client";
import { connect } from "react-redux";
import { formSerialize } from "react-form-utils";

import { setCard, setAccount, reset } from "../store";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

import QRCode from "qrcode.react";

import "bootstrap/dist/css/bootstrap-reboot.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import "bootstrap/dist/css/bootstrap.css";
import "../static/style.css";

import Account from "./Account";
import RegisterForm from "./RegisterForm";
import InvalidCard from "./InvalidCard";

const mapStateToProps = (state = {}) => ({ ...state });
const mapDispatchToProps = dispatch => ({
  setCard: card => dispatch(setCard(card)),
  setAccount: account => dispatch(setAccount(account)),
  reset: () => dispatch(reset())
});

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.io = {
      socket: io(),
      reader: io("/reader"),
      db: io("/db")
    };

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
        this.io.db.emit("checkin", account, checkin => {
          this.props.setAccount(account);
        });
      });
    }
  }

  handleSubmit(event) {
    const { name, n_number } = formSerialize(event.target);
    const { card } = this.props;

    if (card && name && n_number);

    this.io.db.emit("createAccount", name, n_number, card, account => {
      this.props.setAccount(account);
    });
  }

  handleCancel(event) {
    this.props.reset();
  }

  dataUrl(data) {
    return `data:application/json;base64,${Buffer.from(JSON.stringify(data, null, 2)).toString("base64")}`;
  }

  emailUrl(subject, data) {
    return `mailto:?subject=${subject}&body=${encodeURI(JSON.stringify(data))}`;
  }

  render() {
    return (
      <div>
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <Container>
          <Row>
            <Col className="text-center">
              <Image src="static/Dover-Maker-Space2.png" />
            </Col>
          </Row>
          <Row>
            <Col className="yellow-title-background blue-text">
              <h1>Check-In Kiosk</h1>
            </Col>
          </Row>
          <Row className="yellow-background">
            <Col lg="9" md="7">
              {!this.props.card && (
                <Card style={{ width: "100%", height: "100%" }}>
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
                ) : this.props.card.FacilityCode > 0 && this.props.card.CardCode > 0 ? (
                  <RegisterForm onSubmit={e => this.handleSubmit(e)} onCancel={e => this.handleCancel(e)} />
                ) : (
                  <InvalidCard
                    onOk={e => {
                      this.handleCancel(e);
                    }}
                  />
                ))}
            </Col>
            <Col lg="3" md="5">
              <Card style={{ width: 250, height: "100%" }}>
                <Card.Header>Raw Data</Card.Header>
                <Card.Body>
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
                    {JSON.stringify(_.omit(this.props, "data"), null, 2)}
                  </Card.Text>
                  <hr />
                  <div className="text-center">
                    <QRCode value={this.emailUrl("Check-In Kisok Data", _.omit(this.props, "data"))} size={200} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="yellow-background">
            <Col>&nbsp;</Col>
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
