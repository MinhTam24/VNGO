import axiosClient from './axiosClient'; 

const accountApi = {
  // Đăng nhập   
  login: (loginDto) => {
    try {
      return axiosClient.post('/api/login', loginDto);
    } catch (error) {
      throw error; // Throw error to be handled by the AuthContext
    }
  },

  // Đăng ký
  signUp: (registerDto) => {
    return axiosClient.post('/api/account', registerDto);
  },

  // Lấy thông tin tài khoản theo ID
  getUserById: (id) => {
    return axiosClient.get(`/api/account/${id}`);
  },

  // Lấy thông tin tài khoản theo email
  getAccountByEmail: (email) => {
    return axiosClient.get(`/api/account/email/${email}`);
  },

  // Lấy danh sách tài khoản
  getListAccount: () => {
    return axiosClient.get('/api/account');
  },

  getAccountContacts: (accountId) => {
    return axiosClient.get(`/api/account/contact`, {
      params: { accountId: accountId }
    });
  },

  getProfile: (id) => {
    return axiosClient.get(`/profile/${id}`)
     
  },

  updateHobbies: (accountId, hobbyIds, isAdd) => {
    return axiosClient.put(`/updatehobbies/${accountId}`, null, {
      params: { hobbyId: hobbyIds, isAdd: isAdd }
    });
  },


  updateAccount: (id, accountDto) => {
    return axiosClient.put(`/update/${id}`, accountDto);
  },

  // Cập nhật ảnh đại diện
  postAvatar: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append("images", file));
    return axiosClient.post('/api/post-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  Search: (keyWord) => {
    return axiosClient.get('/api/account/search', {
      params: { keyWord: keyWord }
    });
  },

  ResetPassWord: (requestReset) => {
    return axiosClient.put('/api/reset-password', requestReset)
  }


  }

export default accountApi;
