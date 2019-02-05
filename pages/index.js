import React from "react";
import Head from "next/head";
import { connect } from "react-redux";
import io from "socket.io-client";

import { loadInitialDataSocket, reset } from "../store";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

import "bootstrap/dist/css/bootstrap-reboot.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import "bootstrap/dist/css/bootstrap.css";
import "../static/style.css";

const mapStateToProps = (state = {}) => ({ ...state });

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.socket = io();
    this.props.dispatch(loadInitialDataSocket(this.socket));
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  handleSubmit(event) {
    const form = event.currentTarget;

    console.log({ form });

    event.preventDefault();
    event.stopPropagation();
  }

  handleCancel(event) {
    this.props.dispatch(reset());
  }

  render() {
    return (
      <div>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
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
            <Col sm="9" md="9">
              {!this.props.card && (
                <Card style={{ width: "100%", height: "100%" }}>
                  <Card.Body>
                    <Card.Title>Please scan your badge to begin</Card.Title>
                  </Card.Body>
                </Card>
              )}

              {this.props.card && !this.props.account && (
                <Card style={{ width: "100%", height: "100%" }}>
                  <Card.Body>
                    <p>
                      This appeares to be your first time here. Please fill out
                      the form to register.
                    </p>
                    <Form onSubmit={e => this.handleSubmit(e)}>
                      <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="<<< enter your name >>>"
                        />
                      </Form.Group>

                      <Form.Group controlId="n_number">
                        <Form.Label>N-Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="<<< enter your N number >>>"
                        />
                      </Form.Group>

                      <ButtonToolbar>
                        <Button variant="liberty-primary" type="submit">
                          Register
                        </Button>
                        <Button
                          variant="liberty-secondary"
                          onClick={e => this.handleCancel(e)}
                        >
                          Cancel
                        </Button>
                      </ButtonToolbar>
                    </Form>
                  </Card.Body>
                </Card>
              )}
            </Col>
            <Col sm="3" md="3">
              <Card style={{ width: "100%", height: "100%" }}>
                <Card.Body>
                  <Card.Title>Raw Data</Card.Title>
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
                    {JSON.stringify(this.props, null, 2)}
                  </Card.Text>
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

export default connect(mapStateToProps)(Index);
