import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loadingspinner">
        <div id="square1" />
        <div id="square2" />
        <div id="square3" />
        <div id="square4" />
        <div id="square5" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
  background-color: #f9f9f9; /* Optional: to differentiate the loader background */

  .loadingspinner {
    --square: 26px;
    --offset: 30px;
    --duration: 2.4s;
    --delay: 0.2s;
    --timing-function: ease-in-out;
    --in-duration: 0.4s;
    --in-delay: 0.1s;
    --in-timing-function: ease-out;
    width: calc( 3 * var(--offset) + var(--square));
    height: calc( 2 * var(--offset) + var(--square));
    position: relative;
  }

  .loadingspinner div {
    display: inline-block;
    background: rgb(168, 85, 247);
    border: none;
    border-radius: 2px;
    width: var(--square);
    height: var(--square);
    position: absolute;
  }

  .loadingspinner #square1 {
    left: calc( 0 * var(--offset) );
    top: calc( 0 * var(--offset) );
    animation: square1 var(--duration) var(--delay) var(--timing-function) infinite,
               squarefadein var(--in-duration) calc(1 * var(--in-delay)) var(--in-timing-function) both;
  }

  .loadingspinner #square2 {
    left: calc( 0 * var(--offset) );
    top: calc( 1 * var(--offset) );
    animation: square2 var(--duration) var(--delay) var(--timing-function) infinite,
               squarefadein var(--in-duration) calc(1 * var(--in-delay)) var(--in-timing-function) both;
  }

  .loadingspinner #square3 {
    left: calc( 1 * var(--offset) );
    top: calc( 1 * var(--offset) );
    animation: square3 var(--duration) var(--delay) var(--timing-function) infinite,
               squarefadein var(--in-duration) calc(2 * var(--in-delay)) var(--in-timing-function) both;
  }

  .loadingspinner #square4 {
    left: calc( 2 * var(--offset) );
    top: calc( 1 * var(--offset) );
    animation: square4 var(--duration) var(--delay) var(--timing-function) infinite,
               squarefadein var(--in-duration) calc(3 * var(--in-delay)) var(--in-timing-function) both;
  }

  .loadingspinner #square5 {
    left: calc( 3 * var(--offset) );
    top: calc( 1 * var(--offset) );
    animation: square5 var(--duration) var(--delay) var(--timing-function) infinite,
               squarefadein var(--in-duration) calc(4 * var(--in-delay)) var(--in-timing-function) both;
  }

  @keyframes square1 { /* Add square1 animation */ }
  @keyframes square2 { /* Add square2 animation */ }
  @keyframes square3 { /* Add square3 animation */ }
  @keyframes square4 { /* Add square4 animation */ }
  @keyframes square5 { /* Add square5 animation */ }
  @keyframes squarefadein { /* Add squarefadein animation */ }
`;

export default Loader;
