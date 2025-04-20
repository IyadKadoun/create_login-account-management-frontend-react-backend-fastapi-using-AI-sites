// frontend/src/components/AddUserForm.js
import React from 'react';
import './styles.css';

class AddUserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      is_admin: false,
    };
  }

  handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    this.setState({ [name]: type === 'checkbox' ? checked : value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onAdd(this.state);
    this.setState({ username: '', password: '', email: '', is_admin: false }); // إعادة تعيين النموذج
  };

  render() {
    return (
      <div className="add-user-container">
        <h3>إضافة مستخدم جديد</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="new-username">اسم المستخدم:</label>
            <input
              type="text"
              id="new-username"
              name="username"
              value={this.state.username}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">كلمة السر:</label>
            <input
              type="password"
              id="new-password"
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-email">البريد الإلكتروني:</label>
            <input
              type="email"
              id="new-email"
              name="email"
              value={this.state.email}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-is-admin">مدير:</label>
            <input
              type="checkbox"
              id="new-is-admin"
              name="is_admin"
              checked={this.state.is_admin}
              onChange={this.handleInputChange}
            />
          </div>
          <button type="submit" className="add-button">إنشاء</button>
          <button type="button" className="cancel-button" onClick={this.props.onCancel}>إلغاء</button>
        </form>
      </div>
    );
  }
}

export default AddUserForm;