import React from "react";
import Head from "next/head";
import { connect } from "react-redux";

class Index extends React.Component {
  render() {
    return (
      <div>
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <p>Hello world!</p>
      </div>
    );
  }
}

export default connect()(Index);
