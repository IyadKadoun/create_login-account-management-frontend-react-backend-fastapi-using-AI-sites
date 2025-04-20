// frontend/src/components/LoginForm.js
import React from 'react';
import './styles.css';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onLogin(this.state.username, this.state.password);
    //console.log(this.state.username+","+this.state.password);
  };

  render() {
    return (
      <div className="login-container">
        <h2>تسجيل الدخول</h2>
        {this.props.error && <p className="error-message">{this.props.error}</p>}
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">اسم المستخدم:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={this.state.username}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">كلمة السر:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <button type="submit" className="login-button">تسجيل الدخول</button>
        </form>
      </div>
    );
  }
}

export default LoginForm;