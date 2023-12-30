import styled from 'styled-components';

export const SiteFooter = styled.div`
  ${'' /* background-color: #2c3e50; */}

  color: #fff;
`;

export const FooterContainer = styled.div`
  width:100%;
  margin: 0 auto;
    background: linear-gradient(to bottom, var(--accent-background), #2c3e50);
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding:40px;
`;

export const Column = styled.div`
  flex: 0 0 100%;
  max-width: 100%;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
  }
`;

export const Heading = styled.h4`
  font-size: 1.8em;
`;

export const Paragraph = styled.p`
  font-size: 1.2em;
`;

export const UnorderedList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const ListItem = styled.li`
  a {
    color: #fff;
    text-decoration: none;

    &:hover {
      color: #ffcc00;
    }
  }
`;

export const Address = styled.address`
  font-style: normal;
`;

export const CopyRightSection = styled.div`
  ${'' /* background-color: #233445; */}
  width:100%;
  padding: 4rem;
  text-align: center;
  margin:0;
`;



export const MessageContainer = styled.div`
  margin-top: 5rem;
  padding: 3rem;
  text-align: center;
  background-color:#1f2340;
  ${'' /* background-color:#1f2336; */}
  border-radius:8px;
`;

export const Message = styled.div`
  font-size: 1.0rem;
  color: #fff;
  @media screen and (max-width:768px){
    font-size:.8rem;
  }
`;

export const ContactLink = styled.a`
  color: green;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;