import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
    background: ${({ isLoginPage }) =>
      isLoginPage
        ? 'linear-gradient(90deg, rgba(63,94,251,1) 0%, rgba(70,251,252,1) 100%)'
        : '#fff'};
    color: #333;

}

`;

export default GlobalStyles;
