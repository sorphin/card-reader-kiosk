import React from "react";
import Head from "next/head";
import { connect } from "react-redux";
import { loadInitialDataSocket } from "../store";
import io from "socket.io-client";

const mapStateToProps = (state = {}) => ({ ...state });

class Index extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;

    this.socket = io();

    dispatch(loadInitialDataSocket(this.socket));
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {
    const { card } = this.props;

    return (
      <div>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <h1>Dover MakerSpce Checkin Kiosk</h1>
        <h2>Please scan your badge begin</h2>
        <pre>{JSON.stringify(card, null, 2)}</pre>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Index);
