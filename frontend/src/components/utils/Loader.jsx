// Loader.js
import React from "react";
import styled from "styled-components";

const LoaderContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
`;

const LoaderText = styled.div`
  font-size: 18px;
  color: #9f24c2;
  text-align: center;
`;

const Loader = () => {
  return (
    <LoaderContainer>
      <LoaderText>Loading...</LoaderText>
    </LoaderContainer>
  );
};

export default Loader;
