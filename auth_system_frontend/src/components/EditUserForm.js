// frontend/src/components/EditUserForm.js
import React from 'react';
import './styles.css';

class EditUserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.user.id,
      username: props.user.username,
      email: props.user.email || '',
      is_admin: props.user.is_admin || false,
    };
  }

  handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    this.setState({ [name]: type === 'checkbox' ? checked : value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSave(this.state);
  };

  render() {
    return (
      <div className="edit-user-container">
        <h3>تعديل المستخدم</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-username">اسم المستخدم:</label>
            <input
              type="text"
              id="edit-username"
              name="username"
              value={this.state.username}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-email">البريد الإلكتروني:</label>
            <input
              type="email"
              id="edit-email"
              name="email"
              value={this.state.email}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-is-admin">مدير:</label>
            <input
              type="checkbox"
              id="edit-is-admin"
              name="is_admin"
              checked={this.state.is_admin}
              onChange={this.handleInputChange}
            />
          </div>
          <button type="submit" className="save-button">حفظ</button>
          <button type="button" className="cancel-button" onClick={this.props.onCancel}>إلغاء</button>
        </form>
      </div>
    );
  }
}

export default EditUserForm;