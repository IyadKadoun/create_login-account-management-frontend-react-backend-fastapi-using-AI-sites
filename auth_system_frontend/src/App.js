// frontend/src/App.js
import React from 'react';
import LoginForm from './components/LoginForm';
import UserList from './components/UserList';
import AddUserForm from './components/AddUserForm';
import EditUserForm from './components/EditUserForm';
import './components/styles.css';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      isAdmin: false,
      users: [],
      error: null,
      isAddingNew: false,
      editingUser: null,
    };
  }

  handleLogin = async (username, password) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/token',
        new URLSearchParams({ username: username, password: password }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
    const token = response.data.access_token;

    // Decode the JWT token to extract the payload
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Extract the payload
    console.log('Decoded Token:', decodedToken);

    // Access the is_admin value from the decoded token
    this.setState({
        token: token,
        isAdmin: decodedToken.is_admin,
        error: null,
      }, this.fetchUsers);
    } catch (error) {
      console.error('Login error:', error.response?.data); // سجل الخطأ بالكامل
      this.setState({ 
        error: error.response?.data?.detail || 'اسم المستخدم أو كلمة المرور غير صحيحة.' 
      });
    }
  };

  fetchUsers = async () => {
    if (this.state.token && this.state.isAdmin) {
      try {
        const response = await axios.get('http://localhost:8000/users/', {
          headers: { Authorization: `Bearer ${this.state.token}` },
        });
        this.setState({ users: response.data, error: null });
      } catch (error) {
        this.setState({ error: 'فشل في جلب المستخدمين.' });
      }
    }
  };

  handleDeleteUser = async (id) => {
    if (this.state.token && this.state.isAdmin) {
      try {
        await axios.delete(`http://localhost:8000/users/${id}`, {
          headers: { Authorization: `Bearer ${this.state.token}` },
        });
        this.fetchUsers();
      } catch (error) {
        this.setState({ error: 'فشل في حذف المستخدم.' });
      }
    }
  };

  handleAddUser = async (newUser) => {
    if (this.state.token && this.state.isAdmin) {
      try {
        await axios.post('http://localhost:8000/users/', newUser, {
          headers: { Authorization: `Bearer ${this.state.token}` },
        });
        this.setState({ isAddingNew: false }, this.fetchUsers);
      } catch (error) {
        this.setState({ error: 'فشل في إضافة مستخدم جديد.' });
      }
    }
  };

  handleUpdateUser = async (updatedUser) => {
    if (this.state.token && this.state.isAdmin && updatedUser.id) {
      try {
        await axios.put(`http://localhost:8000/users/${updatedUser.id}`, updatedUser, {
          headers: { Authorization: `Bearer ${this.state.token}` },
        });
        this.setState({ editingUser: null }, this.fetchUsers);
      } catch (error) {
        this.setState({ error: 'فشل في تحديث المستخدم.' });
      }
    }
  };

  showAddForm = () => {
    this.setState({ isAddingNew: true });
  };

  hideAddForm = () => {
    this.setState({ isAddingNew: false });
  };

  showEditForm = (user) => {
    this.setState({ editingUser: user });
  };

  hideEditForm = () => {
    this.setState({ editingUser: null });
  };

  render() {
    if (!this.state.token) {
      return <LoginForm error={this.state.error} onLogin={this.handleLogin} />;
    }
    console.log(this.state.isAdmin)
    if (this.state.isAdmin) {
      return (
        <div className="admin-panel">
          <h2>لوحة إدارة المستخدمين</h2>
          {this.state.error && <p className="error-message">{this.state.error}</p>}

          {!this.state.isAddingNew && !this.state.editingUser && (
            <button className="add-button" onClick={this.showAddForm}>إضافة مستخدم جديد</button>
          )}

          {this.state.isAddingNew && (
            <AddUserForm onAdd={this.handleAddUser} onCancel={this.hideAddForm} />
          )}

          {this.state.editingUser && (
            <EditUserForm user={this.state.editingUser} onSave={this.handleUpdateUser} onCancel={this.hideEditForm} />
          )}

          {this.state.users.length > 0 && !this.state.isAddingNew && !this.state.editingUser && (
            <UserList users={this.state.users} onDelete={this.handleDeleteUser} onEdit={this.showEditForm} />
          )}

          {this.state.users.length === 0 && !this.state.isAddingNew && !this.state.editingUser && (
            <p>لا يوجد مستخدمون.</p>
          )}
        </div>
      );
    }

    return (
      <div className="unauthorized-message">
        <h2>ليس لديك صلاحيات المدير.</h2>
      </div>
    );
  }
}

export default App;