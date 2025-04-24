import React, { useState } from 'react';
import axios from 'axios';

const SendOtpForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/send-otp', email, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage('OTP sent successfully! Please check your email.');
    } catch (error) {
      setMessage('Failed to send OTP. Please try again.');
    }
  };

  return (
    <div>
      <h2>Enter Your Email to Receive OTP</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <button type="submit">Send OTP</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default SendOtpForm;
