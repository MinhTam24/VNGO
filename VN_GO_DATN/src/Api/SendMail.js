import axiosClient from "./axiosClient";

const SendMail = {
  sentOtp: (email) => {
    return axiosClient.post(`/send-otp?email=${email}`);
  },

  verifyOtp: (email, otp) => {
    return axiosClient.post(`/verify?email=${email}&otp=${otp}`);
  }
  
};

export default SendMail;
