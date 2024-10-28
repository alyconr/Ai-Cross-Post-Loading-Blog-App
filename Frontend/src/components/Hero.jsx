import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.css';
import { styled } from 'styled-components';

function Hero() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Wrapper>
      <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item>
          <img
            src="https://images.pexels.com/photos/1181325/pexels-photo-1181325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="First slide"
          />
          <Carousel.Caption className="top-50 ">
            <h3 className="fw-bolder mt-5 pt-5 fs-1 text-white  ">
              Loading, The Technology Blog
            </h3>
            <p>Where you can express your ideas </p>
            <div className="arrow bounce">
              <a className="fa fa-arrow-down fa-2x" href="#Home"></a>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            src="https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="First slide"
          />
          <Carousel.Caption className="top-50 ">
            <h3 className="fw-bolder mt-5  fs-1 text-white  ">
              Post your thoughts on Devto, Medium and Hashnode Social Media
              Platforms
            </h3>

            <div className="arrow bounce">
              <a className="fa fa-arrow-down fa-2x" href="#Home"></a>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            src="https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="First slide"
          />
          <Carousel.Caption className="top-50">
            <h3 className="fw-bolder mt-5 fs-1 text-white  ">
              Technology Stacks
            </h3>
            <p>Web development, Cloud, Devops, Networking, Security and more</p>
            <div className="arrow bounce">
              <a className="fa fa-arrow-down fa-2x" href="#Home"></a>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            src="https://images.pexels.com/photos/16018144/pexels-photo-16018144/free-photo-of-pessoa-programando-hacker.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2g"
            alt="First slide"
          />
          <Carousel.Caption className="top-50">
            <h3 className="fw-bolder mt-5 fs-1 text-white  ">
              Social Networking
            </h3>
            <p>Share your Knowledge and learn on a daily basis.</p>
            <div className="arrow bounce">
              <a className="fa fa-arrow-down fa-2x" href="#Home"></a>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </Wrapper>
  );
}

export default Hero;

const Wrapper = styled.div`
  .top-50 {
    top: 50%;
  }

  img {
    width: 100%;
    height: 91vh;
    object-fit: cover;
  }
  .arrow {
    text-align: center;
    margin: 8% 0;
  }
  .bounce {
    -moz-animation: bounce 2s infinite;
    -webkit-animation: bounce 2s infinite;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-30px);
    }
    60% {
      transform: translateY(-15px);
    }
  }
`;
