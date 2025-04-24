import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const postList = [
  {
    id: 1,
    user: {
      id: 1,
      avatar: "/img/avt.jpg",
      username: "Nguyễn Đức Tân",
      time: "1 giờ trước",
    },
    content: `Phố đèn lồng Hội An về đêm rực rỡ với hàng ngàn chiếc đèn lồng thủ công...`,
    images: ["/img/LOGO.PNG", "/img/post1.jpg", "/img/AVT.jpg"],
    interactions: {
      likes: 238,
      comments: 186,
      shares: 143,
    },
    comments: [
      {
        id: 1,
        userComment: {
          name: "Tâm",
          avatar: "/img/avt.jpg",
        },
        time: "54 phút trước",
        content: "Nó thật là đẹp và lãng mạn, bạn có thể chia sẻ kinh nghiệm cho tôi khi tới đó được không?",
      },
      // Thêm các comment khác
    ],
  },
  {
    id: 2,
    user: {
      id: 2,
      avatar: "/img/avt.jpg",
      username: "Trần Minh Tâm",
      time: "1 giờ trước",
    },
    content: `Phố đèn lồng Hội An về đêm rực rỡ với hàng ngàn chiếc đèn lồng thủ công...`,
    images: ["/img/post1.jpg", "/img/AVT.jpg", "/img/LOGO.PNG"],
    interactions: {
      likes: 116,
      comments: 186,
      shares: 143,
    },
    comments: [],
  },
  // Thêm bài viết khác nếu cần...
];

const ShareModal = () => {
  const [link, setLink] = useState(window.location.href);
  const [message, setMessage] = useState('');

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    alert('Link đã được sao chép: ' + link);
  };

  const scrollFriends = (direction) => {
    const friendsList = document.getElementById('friendsList');
    const scrollAmount = 150;
    if (direction === 'next') {
      friendsList.scrollLeft += scrollAmount;
    } else if (direction === 'prev') {
      friendsList.scrollLeft -= scrollAmount;
    }
  };

  return (
    <div>
      {/* Nút để mở modal */}
      <div className="container text-center py-5">
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#shareModal">Chia sẻ</button>
      </div>

      {/* Modal */}
      <div className="modal fade" id="shareModal" tabIndex="-1" aria-labelledby="shareModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content modal-content-custom">
            <div className="modal-header">
              <h3 className="modal-title" id="shareModalLabel">Chia sẻ</h3>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <textarea 
                placeholder="Hãy nói gì đó về nội dung này (không bắt buộc)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <button className="btn share-btn">Chia sẻ ngay</button>

              {/* Danh sách bạn bè lấy từ postList */}
              <div className="friends-list-container pt-3">
                <div className="friends-nav">
                  <button id="prevBtn" onClick={() => scrollFriends('prev')}>
                    <FaChevronLeft />
                  </button>
                  <button id="nextBtn" onClick={() => scrollFriends('next')}>
                    <FaChevronRight />
                  </button>
                </div>
                <div className="friends-list" id="friendsList">
                  {postList.map((post) => (
                    <div className="friend" key={post.id}>
                      <img src={post.user.avatar} alt={post.user.username} />
                      <span>{post.user.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sao chép link */}
            <div className="copy-link-container">
              <input type="text" id="linkToCopy" value={link} readOnly />
              <button onClick={copyLink}>Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
