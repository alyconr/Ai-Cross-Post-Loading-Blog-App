import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.css";


function Hero() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img
          style={{ height: "600px", width: "100%" }}
          src="https://images.pexels.com/photos/1181325/pexels-photo-1181325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="First slide"
        />
        <Carousel.Caption >
          <h3 className="fw-bolder fs-1 text-white  ">Loading, The Technology Blog</h3>
          <p>Where you can express your ideas </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          style={{ height: "600px", width: "100%" }}
          src="https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3 className="fw-bolder fs-1 text-white  ">Technology Stacks</h3>
          <p>Web development, Cloud, Devops, Networking, Security and more</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          style={{ height: "600px", width: "100%" }}
          src="https://images.pexels.com/photos/16018144/pexels-photo-16018144/free-photo-of-pessoa-programando-hacker.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2g"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3 className="fw-bolder fs-1 text-white  ">Social Networking</h3>
          <p>
           Share your Knowledge and learn on a daily basis.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Hero;

