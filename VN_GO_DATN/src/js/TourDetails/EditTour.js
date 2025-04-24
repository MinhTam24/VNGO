import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from "sweetalert2";
import config from "../../config";


const EditTour = ({ tourId }) => {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState([]); // URL của ảnh (bao gồm URL blob cho hiển thị trước)
  const [imagesToDelete, setImagesToDelete] = useState([]); // Các ảnh cũ cần xóa
  const [newImages, setNewImages] = useState([]); // File thực tế của ảnh mới
  const [isUpdating, setIsUpdating] = useState(false); // Trạng thái đang cập nhật
  const [showModal, setShowModal] = useState(false);
  const { SERVER_API } = config;

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  // Fetch dữ liệu tour ban đầu
  useEffect(() => {
    if (tourId) {
      const fetchTour = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token"); // Lấy token từ localStorage

          const response = await axios.get(`${SERVER_API}/api/tour/${tourId}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Gắn token vào header
            },
          }); setTour(response.data);
          setDescription(response.data.descriptionTour);
          setImageUrls(response.data.imageUrl || []);
        } catch (err) {
          setError(err.message || 'Lỗi khi fetch dữ liệu');
        } finally {
          setLoading(false);
        }
      };
      fetchTour();

    }
  }, [tourId]);

  // Cập nhật mô tả tour
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // Xóa ảnh cũ
  const handleRemoveImage = (index) => {
    const removedUrl = imageUrls[index];
    setImagesToDelete((prev) => [...prev, removedUrl]); // Thêm URL ảnh vào danh sách cần xóa
    setImageUrls((prev) => prev.filter((_, i) => i !== index)); // Loại bỏ ảnh khỏi danh sách hiển thị
  };

  // Thêm ảnh mới
  const handleNewImageChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files); // Lưu file thực tế
      setNewImages((prevNewImages) => [...prevNewImages, ...newFiles]);

      // Tạo URL blob để hiển thị trước
      const newImagePreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImageUrls((prevImageUrls) => [...prevImageUrls, ...newImagePreviews]);
    }
  };

  // Cập nhật tour
  const handleUpdate = async () => {
    try {
      setIsUpdating(true);

      const formData = new FormData();

      // Thêm các trường văn bản
      formData.append('id', tour.id);
      formData.append('title', tour.title);
      formData.append('descriptionTour', description);
      formData.append('startDate', tour.startDate);
      formData.append('endDate', tour.endDate);
      formData.append('expense', tour.expense);
      formData.append('addressTour', tour.addressTour);
      formData.append('quantityMember', tour.quantityMember);
      formData.append('allowedToApply', tour.allowedToApply);

      // Gửi URL của ảnh cũ (loại bỏ URL blob)
      imageUrls
        .filter((url) => !url.startsWith('blob:')) // Chỉ giữ URL thực tế
        .forEach((url) => formData.append('imageUrl', url));

      // Gửi các file ảnh mới
      newImages.forEach((file) => formData.append('files', file));
      const result = await Swal.fire({
        title: "Xác nhận",
        text: "Bạn có chắc chắn muốn cập nhật thông tin này?",
        icon: "warning",
        heightAuto: false,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Cập nhật",
        cancelButtonText: "Hủy",
      });
      if (result.isConfirmed) {
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        const token = localStorage.getItem("token"); // Lấy token từ localStorage

        const response = await axios.put(`${SERVER_API}/api/tour`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Đảm bảo header Content-Type đúng
            Authorization: `Bearer ${token}`,     // Gắn token vào header
          },
        });

        if (response.status === 200) {
          Swal.fire(
            {
              heightAuto: false,
              title: "Thành công",
              confirmButtonText: "OK",
              text: "Thông tin đã được cập nhật.",
              icon: "success"
            }).then(() => {
              // Tải lại trang khi người dùng nhấn "OK"
              window.location.reload();
            });

          setShowModal(false); // Đóng modal
        }
      }
    } catch (err) {
      Swal.fire("Thất bại", "Đã xảy ra lỗi khi cập nhật.", "error");
      console.error("Lỗi:", err.response ? err.response.data : err.message);
    } finally {
      setIsUpdating(false);
    }

  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div>
      <a href="#" onClick={handleModalShow} className="btn btn-outline-dark d-flex align-items-center">
        <FaEdit className="me-2" /> Chỉnh sửa chuyến đi
      </a>

      <Modal show={showModal} onHide={handleModalClose} size="lg" style={{ color: "#3a443b", fontWeight: "bold" }}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật tour</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <Form>
            <Form.Group controlId="tourTitle">
              <Form.Label>Tiêu đề tour</Form.Label>
              <Form.Control
                type="text"
                value={tour?.title || ''}
                onChange={(e) =>
                  setTour({ ...tour, title: e.target.value })
                }
                placeholder="Nhập tiêu đề tour"
                style={{ padding: '12px', fontSize: '16px' }} // Tăng kích thước padding và font-size
              />
            </Form.Group>

            <Form.Group controlId="tourDescription" className='pt-2'>
              <Form.Label>Mô tả tour</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Nhập mô tả tour"
                style={{ padding: '12px', fontSize: '16px' }} // Tăng kích thước padding và font-size
              />
            </Form.Group>

            <div className="row">
              <div className="col-sm-6 pt-2">
                <Form.Group controlId="tourStartDate">
                  <Form.Label>Ngày bắt đầu</Form.Label>
                  <Form.Control
                    type="date"
                    value={tour?.startDate || ''}
                    onChange={(e) =>
                      setTour({ ...tour, startDate: e.target.value })
                    }
                    style={{ padding: '12px', fontSize: '16px' }} // Tăng kích thước padding và font-size
                  />
                </Form.Group>
              </div>
              <div className="col-sm-6 pt-2">
                <Form.Group controlId="tourEndDate">
                  <Form.Label>Ngày kết thúc</Form.Label>
                  <Form.Control
                    type="date"
                    value={tour?.endDate || ''}
                    onChange={(e) =>
                      setTour({ ...tour, endDate: e.target.value })
                    }
                    style={{ padding: '12px', fontSize: '16px' }} // Tăng kích thước padding và font-size
                  />
                </Form.Group>
              </div>
              <div className="col-sm-6 pt-2">
                <Form.Group controlId="tourExpense">
                  <Form.Label>Chi phí</Form.Label>
                  <Form.Control
                    type="number"
                    value={tour?.expense || ''}
                    onChange={(e) =>
                      setTour({ ...tour, expense: e.target.value })
                    }
                    placeholder="Nhập chi phí"
                    min={0}
                    style={{ padding: '12px', fontSize: '16px' }} // Tăng kích thước padding và font-size
                  />
                </Form.Group>
              </div>
              <div className="col-sm-6 pt-2">
                <Form.Group controlId="tourQuantityMember">
                  <Form.Label>Số lượng thành viên</Form.Label>
                  <Form.Control
                    type="number"
                    value={tour?.quantityMember || ''}
                    onChange={(e) =>
                      setTour({ ...tour, quantityMember: e.target.value })
                    }
                    placeholder="Nhập số lượng thành viên"
                    style={{ padding: '12px', fontSize: '16px' }} // Tăng kích thước padding và font-size
                  />
                </Form.Group>
              </div>
            </div>



            <Form.Group controlId="tourAddress" className=' pt-2'>
              <Form.Label>Địa chỉ tour</Form.Label>
              <Form.Control
                type="text"
                value={tour?.addressTour || ''}
                onChange={(e) =>
                  setTour({ ...tour, addressTour: e.target.value })
                }
                placeholder="Nhập địa chỉ"
                style={{ padding: '12px', fontSize: '16px' }} // Tăng kích thước padding và font-size
              />
            </Form.Group>



            <Form.Group controlId="tourAllowedToApply" className=' pt-2'>
              <Form.Label>Có thể đăng ký</Form.Label>
              <Form.Control
                as="select"
                value={tour?.allowedToApply || ''}
                onChange={(e) =>
                  setTour({ ...tour, allowedToApply: e.target.value })
                }
                style={{ padding: '12px', fontSize: '16px' }} // Tăng kích thước padding và font-size
              >
                <option value="true">Có</option>
                <option value="false">Không</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="tourImages" className=' pt-2'>
              <Form.Label>Ảnh tour</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleNewImageChange}
                style={{ padding: '12px', fontSize: '16px' }} // Tăng kích thước padding và font-size
              />
              <div className="image-previews d-flex flex-wrap justify-content-start pt-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="image-preview me-3 mb-3 position-relative">
                    <img
                      src={url}
                      alt="preview"
                      style={{
                        width: '120px', // Tăng kích thước ảnh
                        height: '120px', // Tăng kích thước ảnh
                        objectFit: 'cover',
                        borderRadius: '5px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="btn btn-danger position-absolute top-0 end-0 p-1"
                      style={{
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '14px',
                        textAlign: 'center',
                        lineHeight: '1',
                        padding: 0,
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditTour;