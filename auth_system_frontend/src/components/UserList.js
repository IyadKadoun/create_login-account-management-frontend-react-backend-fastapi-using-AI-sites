// frontend/src/components/UserList.js
import React from 'react';
import './styles.css';

class UserList extends React.Component {
  render() {
    const { users, onDelete, onEdit } = this.props;

    return (
      <div className="user-list-container">
        <h2>قائمة المستخدمين</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>اسم المستخدم</th>
              <th>البريد الإلكتروني</th>
              <th>مدير</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.is_admin ? 'نعم' : 'لا'}</td>
                <td>
                  <button className="edit-button" onClick={() => onEdit(user)}>تعديل</button>
                  <button className="delete-button" onClick={() => onDelete(user.id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default UserList;