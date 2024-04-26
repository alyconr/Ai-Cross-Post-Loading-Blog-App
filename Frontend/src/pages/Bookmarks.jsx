import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import useFetch from "../utils/useFetch";
import React, { useState, useEffect } from "react";

const Bookmarks = () => {

    const category = useLocation().search;  




  return (
    <Container>
      <h1>Reading List</h1>
      <BookmarksContainer>
              <MenuSide>
                  <Link className="link">
                      #Web Development
                  </Link>
                  <Link className="link">
                      #Cloud Computing
                  </Link>
                  <Link className="link">
                      #DevOps
                  </Link>
                  <Link className="link">#Security</Link>
                  <Link className="link">#Linux</Link>
        </MenuSide>
              <Posts>
                  <div>Hola</div>
        </Posts>
      </BookmarksContainer>
    </Container>
  );
};

export default Bookmarks;

const Container = styled.div`  

  h1 {
    width: 15%;
    font-size: 1.5rem;
    font-weight: 500;
    padding: 1rem 1.5rem;
    margin: 1rem 1.5rem;
    color: #fff;
    text-align: center;
    background: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(29,168,204,1) 100%);
    border-radius:  5px;

  }
`;
const BookmarksContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: #f8f8f8;
  border-radius: 5px;
  border: 3px solid #ccc;
  padding: 15px;
  gap: 20px;
`;
const MenuSide = styled.div`
  display: flex;
  flex-direction: column;
   width: 25%;
  border: 3px solid #ccc;
  border-radius: 5px;
  padding: 20px;

  .link {
    font-size: 1.2rem;
    font-weight: 500;
    width: 70%;
    margin: 5px 0;
    color: #fff;
    text-align: justify;
    text-decoration: none;
    background: linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(80,103,115,1) 98%);
    border-radius:  5px;
   
  }
`;
const Posts = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 75%;
  height: 100vh;
  background-color: #f8f8f8;
  border: 3px solid #ccc;
  border-radius: 5px;
  padding: 20px;

`;
