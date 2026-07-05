import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendOtpApi, verifyOtpApi } from '../api/auth';

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { response, data } = await sendOtpApi(email);
      if (response.ok) {
        setStep(2);
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('An error occurred while sending OTP. Please try again.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      setError('Please enter a valid 4-digit OTP.');
      return;
    }

    try {
      const { response, data } = await verifyOtpApi(email, otpValue);
      if (response.ok) {
        // Save token to localStorage to ensure Authorization header can be used 
        // as a fallback if cookies are blocked by browser CORS/SameSite policies
        if (data && data.data && data.data.token) {
          localStorage.setItem('adminToken', data.data.token);
        }
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid OTP.');
      }
    } catch (err) {
      setError('An error occurred while verifying OTP. Please try again.');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden z-10 border border-white/20">
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h2 className="text-2xl font-bold tracking-widest uppercase text-gray-900">
              Drushya's Admin
            </h2>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Login</h1>
          <p className="text-gray-500 font-light">
            {step === 1 ? 'Enter your admin credentials.' : 'Enter the OTP sent to your email.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@drushya.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg bg-gray-900 hover:bg-black shadow-gray-900/30"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-8">
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-14 h-16 text-center text-2xl font-bold rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900"
                />
              ))}
            </div>
            
            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold transition-all duration-300 shadow-lg shadow-yellow-400/30"
            >
              Verify & Login
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              <button 
                type="button" 
                onClick={() => { setStep(1); setError(''); }}
                className="text-gray-900 font-semibold hover:underline"
              >
                Change Email
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
