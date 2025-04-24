import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import '../../css/Chatpage.css';
import Header from "../Header/Header";
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import accountApi from "../../Api/AccountApi";
import MessageApi from "../../Api/MessageApi";
import { useAuth } from "../../js/contexts/AuthContext"; // Import AuthContext
import { NotificationContext } from "../contexts/NotificationContext";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Swal from 'sweetalert2';



const ChatPage = () => {
    const [contacts, setContacts] = useState([]);
    // Danh bạ liên hệ
    const [selectedContact, setSelectedContact] = useState(""); // Liên hệ đã chọn
    const selectedContactRef = useRef(selectedContact);
    const [chatMessages, setChatMessages] = useState([]);  // Danh sách tin nhắn
    const [newMessage, setNewMessage] = useState("");  // Tin nhắn mới
    const { authId, authFullName, logout, isLoggedIn } = useAuth();  // AuthContext
    const { messages, sendMessage, sendNotification, isConnected, onlineAccount } = useContext(NotificationContext);
    const messagesEndRef = useRef(null);  // Tham chiếu khu vực tin nhắn
    const [lastMessage, setLastMessage] = useState({});  // Để lưu tin nhắn cuối cùng cho từng liên hệ
    const [searchKeyword, setSearchKeyword] = useState("")

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatMessages]);


    const countUnreadMessage = async (senderId, recipientId) => {
        try {
            const unreadCount = await MessageApi.getCountUnread(senderId, recipientId);
            return unreadCount || 0;
        } catch (error) {
            console.error("Lỗi khi đếm tin nhắn chưa đọc:", error);
            return 0;
        }
    };


    const readMessage = async (senderId, recipientId) => {
        try {
            const response = await MessageApi.updateSentToRead(senderId, recipientId);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        selectedContactRef.current = selectedContact;
    }, [selectedContact]);


    const searchAccount = async (keyWord) => {
        try {
            const response = await accountApi.Search(keyWord);
            if (response && response != null) {
                if (response) {
                    const filteredAccounts = response.filter(account => account.id !== authId)
                    setContacts(filteredAccounts);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log("searchKeyword:", searchKeyword);
        if (typeof searchKeyword === "string" && searchKeyword.trim() === "") {
            if (authId) {
                fetchAccountContacts(authId);
            }
        } else {
            searchAccount(searchKeyword);
        }
    }, [searchKeyword, authId])

    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
    };

    useEffect(() => {
        if (onlineAccount && onlineAccount.accountId && onlineAccount.status) {
            console.log("account Id là: " + onlineAccount.accountId + onlineAccount.status);
            setContacts(prevContacts =>
                prevContacts.map(contact =>
                    contact.id === onlineAccount.accountId
                        ? { ...contact, status: onlineAccount.status }
                        : contact
                )
            );
        } else {
            console.warn("onlineAccount is not valid:", onlineAccount);
        }
    }, [onlineAccount]);



    const fectLastMessage = async (senderid, recipientId) => {
        try {
            const lastMess = await MessageApi.getLastedMessage(senderid, recipientId);
            setLastMessage(prev => ({
                ...prev,
                [recipientId]: lastMess ? lastMess.content : "Chưa có tin nhắn"
            }));
        } catch (error) {
        }
    }


    const showTimeForMessage = (message, index) => {
        const previousMessage = chatMessages[index - 1];
        const currentTime = new Date(message.sentAt);
        const previousTime = previousMessage ? new Date(previousMessage.sentAt) : null;

        if (index === 0 || !previousTime || (currentTime - previousTime >= 24 * 60 * 60 * 1000)) {
            const dateStr = currentTime.toLocaleDateString();  // Lấy ngày
            const timeStr = currentTime.toLocaleTimeString();  // Lấy giờ
            return `${dateStr} ${timeStr}`; // Hiển thị cả ngày và giờ
        }

        // Kiểm tra nếu tin nhắn trước đó cách tin nhắn này ít nhất 2 tiếng
        if (!previousTime || (currentTime - previousTime >= 30 * 60 * 1000)) {
            return currentTime.toLocaleTimeString(); // Hiển thị thời gian nếu chênh lệch >= 2 giờ
        }

        // Kiểm tra nếu tin nhắn trước đó cách tin nhắn này 24 tiếng
        if (!previousTime || (currentTime - previousTime >= 2 * 60 * 60 * 1000)) {
            const dateStr = currentTime.toLocaleDateString(); // Lấy ngày
            const timeStr = currentTime.toLocaleTimeString(); // Lấy thời gian
            return `${dateStr} ${timeStr}`; // Hiển thị cả ngày và giờ
        }

        return null; // Không hiển thị nếu cách nhau dưới 2 giờ
    };

    useEffect(() => {
        if (!isLoggedIn) {
            logout()
        }
    }, [isLoggedIn]);

    // Lấy danh bạ liên hệ khi có authId
    useEffect(() => {
        if (authId) {
            fetchAccountContacts(authId);
        }
    }, [authId]);

    const fetchAccountContacts = async (accountId) => {
        try {
            const response = await accountApi.getAccountContacts(accountId);
            setContacts(response);
            if (response.length > 0) {
                response.forEach(contact => {
                    fectLastMessage(authId, contact.id)
                });
                const updatedContacts = await Promise.all(response.map(async (contact) => {
                    const unreadCount = await countUnreadMessage(contact.id, accountId);
                    console.log(`Unread messages for contact ${contact.id}: ${unreadCount}`);
                    return {
                        ...contact,  // Cập nhật thông tin liên hệ
                        newMessagesCount: unreadCount,  // Thêm số tin nhắn chưa đọc vào liên hệ
                    };
                }));

                // Cập nhật danh bạ
                setContacts(updatedContacts);
            }
        } catch (error) {
            alert("Không thể lấy danh bạ.");
        }
    };

    // Gửi tin nhắn
    const send = (message) => {
        if (message.trim() !== "" && selectedContact.id) {
            sendMessage(selectedContact.id, message)
            sendNotification({
                recipient: selectedContact.id,
                tagetId: selectedContact.id,
                NotificationType: "MESSAGE",
                content: "Đã gửi tin nhắn cho bạn: " + message
            });
            console.log("Đang gửi tin nhắn:", message);
            setChatMessages((prevMessages) => [
                ...prevMessages,
                { senderId: authId, content: message },
            ]);
            setLastMessage(prev => ({
                ...prev,
                [selectedContact.id]: message
            }));
            updateContactOrder(selectedContact.id)

            // Xóa input sau khi gửi tin nhắn
            setNewMessage("");
        } else {
            console.error("WebSocket chưa kết nối hoặc tin nhắn không hợp lệ.");
        }
    };

    // Xử lý tin nhắn nhận được

    useEffect(() => {
        if (messages) {
            console.log("tin nhaan nhan duoc: " + messages)
            handleReceivedMessage(messages)
        }
    }, [messages]);

    const handleReceivedMessage = (message) => {
        if (authId) {
            if (selectedContactRef.current && selectedContactRef.current?.id === message.senderId) {
                setChatMessages((prev) => [...prev, message]);
                setLastMessage((prev) => ({
                    ...prev,
                    [message.senderId]: message.content,
                }));
            } else {
                setLastMessage((prev) => ({
                    ...prev,
                    [message.senderId]: message.content,
                }));
                fetchAccountContacts(authId);
                setContacts((prevContacts) =>
                    prevContacts.map((contact) => {
                        if (contact.id === message.senderId) {
                            return {
                                ...contact,
                                newMessagesCount: contact.newMessagesCount
                                    ? contact.newMessagesCount + 1
                                    : 1,
                            };
                        }
                        return contact;
                    })
                );
            }
        }
    }

    // Cập nhật lại thứ tự liên hệ khi có tin nhắn mới
    const updateContactOrder = (contactId) => {
        if (!Array.isArray(contacts) || contacts.length === 0) {
            console.error("Contacts is not valid or empty.");
            return;
        }

        const updatedContacts = [...contacts];
        const contactIndex = updatedContacts.findIndex(contact => contact.id === contactId);

        // Kiểm tra nếu tìm thấy contactId trong mảng
        if (contactIndex > -1) {
            const [contact] = updatedContacts.splice(contactIndex, 1);  // Lấy contact ra khỏi vị trí cũ
            updatedContacts.unshift(contact);  // Thêm contact vào đầu mảng
            setContacts(updatedContacts);  // Cập nhật lại danh sách contacts
        } else {
            console.error("Contact not found for ID:", contactId);
        }
    };

    // Xử lý khi người dùng chọn liên hệ
    const handleContactClick = (contact) => {
        console.log("Trước khi cập nhật selectedContact:", selectedContact);
        setSelectedContact(contact);
        fetchMessagesForContact(contact.id);
        readMessage(contact.id, authId);
        setContacts((prevContacts) =>
            prevContacts.map((c) =>
                c.id === contact.id ? { ...c, newMessagesCount: 0 } : c
            )
        );
        console.log("Sau khi cập nhật selectedContact:", contact);
    };

    useEffect(() => {
        console.log("selectteccontat" + selectedContact.id)

    }, [selectedContact]);

    // Lấy tin nhắn giữa người dùng và liên hệ đã chọn
    const fetchMessagesForContact = async (contactId) => {
        try {
            const response = await MessageApi.getListMessageBySenderIdAndRecipientId(authId, contactId);
            setChatMessages(response);
        } catch (error) {
            alert("Không thể lấy tin nhắn.");
        }
    };

    const deleteContact = async (recipientId) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Bạn có chắc muốn xóa tin nhắn này không?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            allowOutsideClick: false,
            heightAuto: false,
            showCancelButton: true,  // Hiển thị nút hủy
            confirmButtonColor: '#3085d6',  // Màu nút xác nhận
            cancelButtonColor: '#d33',  // Màu nút hủy
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });
        try {
            if (authId, selectedContact) {
                if (isConfirmed) {
                    const response = await MessageApi.deleteContact(authId, recipientId);
                    if (response) {
                        fetchAccountContacts(authId);
                        setSelectedContact("");
                        Swal.fire({
                            title: 'Đã xóa!',
                            text: 'Tin nhắn đã bị xóa thành công.',
                            icon: 'success',
                            heightAuto: false,
                        });
                    }
                }
            }
            else {
                alert("Chưa chọn contact");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const truncateMessage = (message) => {
        // Kiểm tra nếu message không phải chuỗi, hoặc không tồn tại
        if (!message || typeof message !== 'string') {
            return 'Không có tin nhắn';
        }

        return message.length > 6 ? message.slice(0, 6) + "..." : message;
    };

    return (

            <div className="d-flex g-0 w-100 h-100" style={{ height: "100%" }}>
                {/* Left Menu */}

                <nav className="nav-mesage bg-white text-dark d-flex flex-column justify-content-start align-items-center pt-4 " style={{ width: "5%" }}>
                    <ul className="w-100">
                        <Link to="/" className="text-dark">
                            <li className="menu-item text-center py-3">
                                <HomeIcon style={{ marginLeft: "5px", marginRight: "5px", fontSize: "35px" }} />
                            </li>
                        </Link>
                        <Link to="/follows" className="text-dark">
                            <li className="menu-item text-center py-3">
                                <PeopleAltOutlinedIcon style={{ marginLeft: "5px", marginRight: "5px", fontSize: "35px" }} />
                            </li>
                        </Link>
                        <Link to="/explore" className="text-dark">
                            <li className="menu-item text-center py-3">
                                <ExploreOutlinedIcon style={{ marginLeft: "5px", marginRight: "5px", fontSize: "35px" }} />
                            </li>
                        </Link>
                        <Link to="/tours" className="text-dark">
                            <li className="menu-item text-center py-3">
                                <MapOutlinedIcon style={{ marginLeft: "5px", marginRight: "5px", fontSize: "35px" }} />
                            </li>
                        </Link>
                        <Link to="/messages" className="text-dark">
                            <li className="menu-item text-center py-3" style={{ backgroundColor: "#e9e9e9" }}>
                                <MailOutlinedIcon style={{ marginLeft: "5px", marginRight: "5px", fontSize: "35px" }} />
                            </li>
                        </Link>
                        <Link to="/explore" className="text-dark">
                            <li className="menu-item text-center py-3">
                                <ExitToAppOutlinedIcon style={{ marginLeft: "5px", marginRight: "5px", fontSize: "35px" }} />
                            </li>
                        </Link>
                    </ul>
                </nav>
                {/* Chat Area */}

                <div className="listChatUser d-flex flex-wrap " style={{ width: "22%" }}>
                    {/* Contact List */}
                    <div className="bg-light p-0 w-100">
                        <p className="px-4 pt-4 this-account ">{authFullName}</p>
                        <div className="ms-3 me-3">
                            <input className="find-contact form-control"
                                placeholder="Tìm kiếm..."
                                value={searchKeyword} // Giá trị nhập vào
                                onChange={(e) => handleSearch(e.target.value)} />
                        </div>
                        <hr />
                        <p className="fw-bold px-4">Danh sách liên hệ</p>
                        <ul className="contact-list p-0 list-group">
                            {contacts.map((contact) => (
                                <li
                                    key={contact.id}
                                    className={`user-contact text-center mb-0 d-flex list-group-item list-group-item-action ${selectedContact?.id === contact.id ? "active" : ""}`}
                                    onClick={() => handleContactClick(contact)}
                                >
                                    <img src={contact.avatarUrl} alt="Avatar" />
                                    <div>
                                        <p className="contact-name ps-0">
                                            {contact.fullName}
                                            <span
                                                className={`status-indicator ms-2 ${contact.status === "ONLINE" ? "online" : "offline"}`}
                                                title={contact.status === "ONLINE" ? "ONLINE" : "OFFLINE"}
                                            ></span>
                                        </p>
                                        <p className="mt-1 last-message gap">
                                            <span>{truncateMessage(lastMessage[contact.id] || "Chưa có tin nhắn")}</span>
                                            {selectedContact?.id !== contact.id && contact.newMessagesCount > 0 && (
                                                <span className="tnmoi badge bg-danger rounded-pill ms-2">
                                                    {contact.newMessagesCount}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {selectedContact ? (
                    <>
                        <div className="d-flex flex-column" style={{ width: "50%" }}>
                            <div className="chat-room-user d-flex">
                                {selectedContact && <img className="user-message-image" src={selectedContact.avatarUrl} alt="" />}
                                <p className="user-name">{selectedContact?.fullName}
                                </p>
                            </div>

                            {/* Message Area */}
                            <div className="message-area flex-grow-1 overflow-auto">
                                {chatMessages.map((message, index) => (
                                    <React.Fragment key={index}>
                                        <div className="sentAt">
                                            {showTimeForMessage(message, index) && (
                                                <small>{showTimeForMessage(message, index)}</small>
                                            )}
                                        </div>
                                        <div
                                            className={`message d-flex align-items-start ${message.senderId === authId ? "message my-message" : "message other-message"
                                                }`}
                                        >
                                            {message.senderId === authId ? null : (
                                                <img
                                                    className="user-message-image"
                                                    src={selectedContact.avatarUrl}
                                                    alt="Avatar"
                                                />
                                            )}
                                            <p>{message.content}</p>
                                        </div>
                                    </React.Fragment>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <hr className="m-0"></hr>
                            {/* Message Input */}
                            <div className="message-input-area d-flex">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="form-control"
                                    rows="3"
                                    placeholder="Nhập tin nhắn..."
                                ></textarea>
                                <button onClick={() => send(newMessage)} className="btn-send-message">
                                    Gửi
                                </button>
                            </div>
                        </div>

                        <div className="d-flex flex-column contact-information" style={{ width: "23%" }}>
                            <img src={selectedContact.avatarUrl} alt="Avatar" />
                            <p className="contact-name"> {selectedContact.fullName}</p>
                            <div>
                                <Link to={`/profile/${selectedContact.id}`} className="text-dark">
                                    <AccountCircleRoundedIcon style={{ marginLeft: "10px", marginRight: "5px", fontSize: "35px", cursor: "pointer" }}></AccountCircleRoundedIcon>
                                </Link>
                                <DeleteRoundedIcon
                                    onClick={() => deleteContact(selectedContactRef.current.id)}
                                    style={{
                                        marginLeft: "5px", marginRight: "10px", fontSize: "35px", cursor: "pointer"
                                    }}
                                />
                            </div>
                            <hr className="w-75" />
                            <div className="w-100 information">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex align-items-center">
                                        <i className="bi bi-gender-ambiguous text-info me-2"></i>
                                        <strong>
                                            {selectedContact.gender === "MALE"
                                                ? "Nam"
                                                : selectedContact.gender === "FEMALE"
                                                    ? "Nữ"
                                                    : "Không xác định"}
                                        </strong>
                                    </li>
                                    <li className="list-group-item d-flex align-items-center">
                                        <i className="bi bi-calendar-fill text-success me-2"></i>
                                        <strong>
                                            {(() => {
                                                const dateParts = selectedContact.birthday.split("-");
                                                return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                                            })()}
                                        </strong>
                                    </li>
                                    <li className="list-group-item d-flex align-items-center">
                                        <i className="bi bi-telephone-fill text-warning me-2"></i>
                                        <strong>{selectedContact.phone}</strong>
                                    </li>
                                    <li className="list-group-item d-flex align-items-center">
                                        <i className="bi bi-envelope-fill text-primary me-2"></i>
                                        <strong>{selectedContact.email}</strong>
                                    </li>
                                    <li className="list-group-item d-flex align-items-center">
                                        <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                                        <strong>{selectedContact.address}</strong>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>) : (
                    <div style={{ width: "73%" }} className=" d-flex flex-column justify-content-center align-items-center text-center" >
                        <img src="https://res.cloudinary.com/dopwq7ciu/image/upload/v1734163981/nhantin_fz0erp.jpg" alt="Logo" className="logo" style={{ width: "600px", height: "300px", margin: "0", borderRadius: "10%" }} />
                    </div>
                )}

            </div >
        
    );
};

export default ChatPage;
