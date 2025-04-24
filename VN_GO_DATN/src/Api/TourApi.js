import axiosClient from './axiosClient';  // Giả sử axiosClient đã được định nghĩa như trong câu hỏi trước

const tourApi = {
    //Tạo chuyến đi
    createTour: () => {
        return axiosClient.post('/api/tour-create');
    },

    //Set thông tin chuyến đi khi tạo
    setTour: (tourDto) => {
        return axiosClient.put('/api/tour-data');
    },

    //Xóa tour
    deleteTour: (id) => {
        return axiosClient.delete(`/api/tour/${id}`);
    },
};

export default tourApi;
