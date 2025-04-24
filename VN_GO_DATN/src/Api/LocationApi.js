import axiosClient from './axiosClient';  // Giả sử axiosClient đã được định nghĩa như trong câu hỏi trước

const locationApi = {
    //Tạo địa điểm
    createLocation: (locationDto) => {
        return axiosClient.post('/api/location', locationDto);  // Gửi locationDto làm dữ liệu trong body
    },
    

    //Xóa địa điểm
    setTour: (id) => {
        return axiosClient.delete(`/api/location/${id}`);
    },
};

export default locationApi;
