import React from "react";
import Head from "next/head";
import { connect } from "react-redux";
import { loadInitialDataSocket, reset } from "../store";
import io from "socket.io-client";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";
import css from "./style.css";
import css1 from "bootstrap/dist/css/bootstrap-reboot.css";
import css2 from "bootstrap/dist/css/bootstrap-grid.css";
import css3 from "bootstrap/dist/css/bootstrap.css";

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
            <Col>
              <h1>Dover MakerSpce Check-In Kiosk</h1>

              {!this.props.card && (
                <Card>
                  <Card.Body>
                    <Card.Title>Please scan your badge to begin</Card.Title>
                  </Card.Body>
                </Card>
              )}

              {this.props.card && !this.props.account && (
                <div>
                  <p>
                    This appeares to be your first time here. Please fill out
                    the form to register.
                  </p>
                  <Card>
                    <Card.Body>
                      <Container>
                        <Row>
                          <Col>
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
                                <Button variant="primary" type="submit">
                                  Register
                                </Button>
                                <Button
                                  variant="secondary"
                                  onClick={e => this.handleCancel(e)}
                                >
                                  Cancel
                                </Button>
                              </ButtonToolbar>
                            </Form>
                          </Col>
                          <Col md="auto">
                            <Card style={{ width: "18rem" }}>
                              <Card.Body>
                                <Card.Title>Raw Data</Card.Title>
                                <Card.Text
                                  style={{
                                    display: "block",
                                    unicodeBidi: "embed",
                                    fontFamily: "monospace",
                                    whiteSpace: "pre"
                                  }}
                                >
                                  {JSON.stringify(this.props, null, 2)}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </Container>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Index);
