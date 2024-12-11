// Loader.js
import React from "react";
import styled from "styled-components";
import { Atom } from "react-loading-indicators";

const LoaderContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
`;

const LoaderClass = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: row;

  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img, .AtomLoader {
    width: 300px;
    height: 300px;
    object-fit: contain;
    margin-top: 20px;
  }
`;

const GlobalStyle = styled.div`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
  }
`;

const Loader = () => {
  return (
    
      <LoaderClass>
        <div>
          <Atom color="#e6148e" size="large" text="" textColor="" />
        </div>

        <div>
          <img className="logo" src="SmartGuard.png" alt="Myntra Home" />
        </div>
      </LoaderClass>
    
  );
};

export default Loader;
