import styled from 'styled-components';
import GlobalStyles from './../GlobalStyles';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ForgotPassword = () => {
  const [inputs, setInputs] = useState({
    email: '',
  });

  const [errors, setErrors] = useState({
    email: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validateInputs = () => {
    let isValid = true;
    

    if (!inputs.email.trim()) { // Check if email is empty
      setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URI}/auth/requestPasswordReset`,
          {
            email: inputs.email,
          }
        );
        navigate('/');

        toast.success('Password reset link sent to your email', {
          position: 'bottom-center',
          autoClose: 3500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } catch (err) {
        console.log(err);

        if (err.response && err.response.status === 404) {
          setErrors((prev) => ({ ...prev, email: "User's email not found" }));
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
            placeholder="email"
            name="email"
            onChange={handleChange}
            value={inputs.email}
            autoComplete="email"
          />
          <Button onClick={handleSubmit} type="submit">
            Send Password Reset Link
          </Button>
          <Span>
            Don&apos;t have an account?
            <Styledlink to="/register">Register</Styledlink>
          </Span>
          <Span>
            Do you already have an account?
            <Styledlink to="/login">Back to Login</Styledlink>
          </Span>
          <ErrorMessage>{errors.email}</ErrorMessage>
        </Form>
      </Container>
    </>
  );
};

export default ForgotPassword;

const ErrorMessage = styled.p`
  color: red;
  font-size: 20px;
  margin-top: 5px;
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
    height: 40vh;
    margin: 30px auto;
    font-size: 20px;
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
    font-size: 20px;
  }

  @media (max-width: 375px) {
    width: 90vw;
    height: 50vh;
    margin: 5px auto;
    font-size: 20px;
  }
`;

const Title = styled.h1`
  color: #415be3;
  font-weight: bold;
  margin-top: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Input = styled.input`
  width: 300px;
  height: 40px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
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

const Button = styled.button`
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
    margin: 10px;
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
