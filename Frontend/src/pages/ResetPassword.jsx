import styled from 'styled-components';
import GlobalStyles from './../GlobalStyles';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { MdVisibilityOff } from 'react-icons/md';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.search.split('=')[1];

  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    token: token,
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    token: '',
  });

  const [showPasswordErrorModal, setShowPasswordErrorModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    setShowPasswordErrorModal(false);
  };

  const handleShow = () => setShowPasswordErrorModal(true);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const toggelShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', token: '' };

    if (!inputs.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    }

    if (!inputs.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    if (!inputs.token.trim()) {
      newErrors.token = 'Token is required';
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URI}/auth/resetPassword`,
          inputs,
          {
            withCredentials: true,
            credentials: 'include',
          }
        );
        toast.success('Password reset successfully', {
          position: 'bottom-center',
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });

        navigate('/login');
      } catch (err) {
        console.log(err);

        if (
          err.response &&
          err.response.status === 400 &&
          err.response.data.error === 'Invalid or expired reset token'
        ) {
          setErrors((prev) => ({
            ...prev,
            token: 'Invalid or expired reset token',
          }));
        }

        if (
          err.response &&
          err.response.status === 404 &&
          err.response.data.error === "User's email not found"
        ) {
          setErrors((prev) => ({ ...prev, email: "User's email not found" }));
        }

        if (
          err.response &&
          err.response.status === 401 &&
          err.response.data.error ===
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ) {
          setErrors((prev) => ({
            ...prev,
            password:
              'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
          }));
          handleShow();
        }
      }
    }
  };

  return (
    <>
      <GlobalStyles isLoginPage />
      <Container>
        <Title>Reset Password</Title>
        <Form>
          <Input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={inputs.email}
            autoComplete="email"
          />
          <Inputpassword>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={inputs.password}
              autoComplete="current-password"
            />
            <MdVisibilityOff
              size={40}
              color="gray"
              style={{ cursor: 'pointer', paddingRight: '10px' }}
              onClick={toggelShowPassword}
            />
          </Inputpassword>

          <ButtonSubmit onClick={handleSubmit} type="submit">
            Reset
          </ButtonSubmit>
          <Span>
            Don&apos;t have an account?
            <Styledlink to="/register">Register</Styledlink>
          </Span>
          <Span>
            Do you already have an account?
            <Styledlink to="/login">Back to Login</Styledlink>
          </Span>
          <ErrorMessage>{errors.email || errors.token} </ErrorMessage>
          <ErrorMessage>
            <Modal
              show={showPasswordErrorModal}
              onHide={handleClose}
              animation={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Password Error</Modal.Title>
              </Modal.Header>
              <Modal.Body>{errors.password}</Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                  close
                </Button>
              </Modal.Footer>
            </Modal>
          </ErrorMessage>
        </Form>
      </Container>
    </>
  );
};

export default ResetPassword;

const ErrorMessage = styled.p`
  color: red;
  font-size: 18px;
  margin-top: 10px;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  width: 35vw;
  margin: 50px auto;
  background-image: linear-gradient(
    to top,
    #a5acd1,
    #9fb8d9,
    #9dc3dd,
    #a0cede,
    #a8d7dd
  );
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 1024px) {
    width: 70vw;
    height: 50vh;
    margin: 30px auto;
  }

  @media (max-width: 768px) {
    width: 60vw;
    height: 40vh;
    margin: 20px auto;
  }

  @media (max-width: 480px) {
    width: 80vw;
    height: 40vh;
    margin: 10px auto;
  }

  @media (max-width: 375px) {
    width: 90vw;
    height: 50vh;
    margin: 5px auto;
  }
`;

const Title = styled.h1`
  font-size: 30px;
  color: #415be3;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Inputpassword = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  height: 40px;
  margin: 10px;
  background-color: white;
  border-radius: 10px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #ccc;
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 30px;
    font-size: 12px;
    margin: 5px;
    padding: 5px;
  }
`;

const Input = styled.input`
  width: 300px;
  height: 40px;
  margin: 10px;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &::placeholder {
    color: #ccc;
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 30px;
    font-size: 12px;
    margin: 5px;
    padding: 5px;
  }

  @media (max-width: 480px) {
    width: 150px;
    height: 20px;
    font-size: 10px;
    margin: 3px;
    padding: 3px;
  }
`;

const ButtonSubmit = styled.button`
  width: 300px;
  height: 40px;
  margin: 10px;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  background-image: radial-gradient(
    circle,
    #5d88a5,
    #5485a8,
    #4b82ab,
    #417fae,
    #387cb1
  );
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0069d9;
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 30px;
    font-size: 12px;
    margin: 5px;
    padding: 5px;
  }

  @media (max-width: 480px) {
    width: 150px;
    height: 20px;
    font-size: 10px;
    margin: 3px;
    padding: 3px;
  }
`;

const Span = styled.span`
  color: #0b1442;
  font-size: 16px;
  margin-top: 10px;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }

  &:hover {
    color: #007bff;
  }
`;

const Styledlink = styled(Link)`
  color: #f30522;
  text-decoration: none;
  margin-left: 5px;
  transition: text-decoration 0.3s;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
