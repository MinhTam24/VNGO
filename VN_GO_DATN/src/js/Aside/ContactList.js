import React, { useState } from 'react';

const ContactList = () => {
  // Dùng useState để quản lý danh sách người dùng
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Nguyễn Đức Tân', isFollowed: false },
    { id: 2, name: 'Trần Minh Tâm', isFollowed: false },
    { id: 3, name: 'Hoàng Ngọc Phúc', isFollowed: false },
    { id: 4, name: 'Bùi Đức Chính', isFollowed: false },
    { id: 5, name: 'Nguyễn Hữu Hậu', isFollowed: false },
  ]);

  // Hàm xử lý khi click vào button "Theo dõi"
  const handleFollowClick = (id) => {
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === id
          ? { ...contact, isFollowed: !contact.isFollowed }
          : contact
      )
    );
  };

  return (
    <div className="contact-list">
      <h4>Gợi ý theo dõi</h4>
      {contacts.map(contact => (
        <div key={contact.id} className="contact-item">
          <div>
            <img src="/img/avt.jpg" alt={contact.name} />
            <span>{contact.name}</span>
          </div>
          <a
            href="#"
            className={`fw-bold ${contact.isFollowed ? 'text-muted' : 'text-primary'}`}
            onClick={(e) => {
              e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
              handleFollowClick(contact.id);
            }}
            style={{ textDecoration: 'none' }}
          >
            {contact.isFollowed ? 'Đã theo dõi' : 'Theo dõi'}
          </a>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
