import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import config from "../../config.json";




function UpdateLocation({ locationId }) {
  console.log("ID LOCATION" + locationId)
  const { SERVER_API } = config;
  const [location, setLocation] = useState({
    id: "",
    name: "",
    address: "",
    createDate: "",
    modifiedAt: "",
    province: "",
    createBy: "",
    coordinates: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token")

  useEffect(() => {
    axios
    .get(`${SERVER_API}/api/location/${locationId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gắn token vào header
      },
    })
      .then((response) => {
        setLocation(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  }, [locationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocation((prevLocation) => ({
      ...prevLocation,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Cảnh báo",
      text: "Nếu bạn thay đổi, địa điểm này trong các chuyến đi khác cũng sẽ thay đổi. Bạn có muốn tiếp tục?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      heightAuto: false,
      cancelButtonColor: "#d33",
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        // Người dùng xác nhận cập nhật
        const payload = {
          id: location.id,
          name: location.name,
          address: location.address,
          province: location.province,
          coordinates: location.coordinates,
        };

        axios
        .put(`${SERVER_API}/api/location`, payload, {
          headers: {
            Authorization: `Bearer ${token}`, // Gắn token vào header
          },
        })
          .then(() => {
            Swal.fire({
              title: "Thành công",
              heightAuto: false,
              confirmButtonText: "OK",
              text: "Địa điểm đã được cập nhật.",
              icon: "success"
            }).then(() => {
              // Tải lại trang khi người dùng nhấn "OK"
              window.location.reload();
            });
            setIsModalOpen(false);
          })
          .catch((error) => {
            console.error("Lỗi:", error);
            Swal.fire("Thất bại", "Có lỗi xảy ra trong quá trình cập nhật.", "error");
          });
      }
    });
  };

  return (
    <div>
      {/* Icon chỉnh sửa */}
      <FaEdit
        className="text-dark fs-4"
        onClick={() => setIsModalOpen(true)}
        style={{
          fontSize: "24px",
          cursor: "pointer",
          color: "#007bff",
        }}
        title="Chỉnh sửa địa điểm"
      />

      {/* Modal */}
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered style={{color: "#3a443b", fontWeight: "bold"}}>
<Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa địa điểm</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Tên:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={location.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Địa chỉ:</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={location.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProvince">
              <Form.Label>Tỉnh/Thành phố:</Form.Label>
              <Form.Control
                type="text"
                name="province"
                value={location.province}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCoordinates">
              <Form.Label>Tọa độ:</Form.Label>
              <Form.Control
                type="text"
                name="coordinates"
                value={location.coordinates}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Đóng
            </Button>
            <Button
              variant="primary"
              type="submit"
            >
              Cập nhật
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default UpdateLocation;