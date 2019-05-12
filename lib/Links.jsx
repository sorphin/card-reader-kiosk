import React from "react";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      links: [
        { label: "Kiosk", url: "/" },
        { label: "Dump Data", url: "/dump-data" },
        { label: "Draw Name", url: "/draw-name" }
      ]
    };
  }

  render() {
    return (
      <div>
        {this.state.links.map((link, i) => (
          <a key={i} href={link.url} className="btn btn-sm btn-outline-dark mb-2 mr-2">
            {link.label}
          </a>
        ))}
      </div>
    );
  }
}

export default RegisterForm;
