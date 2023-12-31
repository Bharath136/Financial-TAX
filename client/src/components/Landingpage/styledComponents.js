import styled from "styled-components";
// Styled components
export const HomeContainer = styled.div`
  position: relative;
  background-color:var(--main-background);
`;

export const ImageSlide = styled.img`
  width: 100%;
  height: auto;
`;

export const CarouselCaption = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
`;

export const Section = styled.section`
   background-color:var(--main-background);
  padding: 60px 20px;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

export const SectionTitle = styled.h2`
  font-family: 'Bree Serif', serif;
  color: #333;
  font-size: 2.5em;
  margin-bottom: 30px;
  @media screen and (max-width:768px){
    font-size:24px;
  }
`;

export const FeaturesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

export const FeatureItem = styled.div`
  width: 100%;
  max-width: 550px;
  padding: 20px;
  margin-bottom: 40px;
  background-color: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  @media screen and (min-width: 768px) {
    width: 45%;
  }

  &:nth-child(even) {
    flex-direction: row-reverse;
  }
`;

export const FeatureIcon = styled.div`
  font-size: 3em;
  color: var(--accent-background);
  margin-bottom: 20px;
   @media screen and (max-width:768px){
    font-size: 1em;
  }
`;

export const FeatureTitle = styled.h3`
  font-size: 1.8em;
  margin-bottom: 10px;
  color: #333;
  @media screen and (max-width:768px){
    font-size:20px;
  }
`;

export const FeatureDescription = styled.p`
  font-size: 1.2em;
  color: #555;
   @media screen and (max-width:768px){
    font-size:0.8rem;
  }
`;

export const MainSection = styled.section`
  padding: 20px;
  width: 100%;
  min-height: 100vh;
  color: var(--background-with);
  background-color: var(--accent-background);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    padding:50px;
  }
`;

export const H1 = styled.h1`
  color: white;
  font-size: 5.5vw;
  margin-bottom: 30px;
  position: relative;
  text-decoration: none;

  &::after {
    content: '';
    position: absolute;
    bottom: -20px; /* Adjust the distance from the text */
    left: 32%;
    transform: translateX(-50%);
    width: 200px;
    height: 10px; /* Adjust the height of the underline */
    background-color: #ffa500; /* Adjust the color of the underline */
    border-radius: 50%;
    box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.3); /* Add shadow to the underline */
  }

  @media (min-width: 768px) {
    font-size: 60px;

    &::after {
      width: 500px;
      height: 20px;
      left: 50%;
      border-radius: 50%;
    }
  }
`;



export const Description2 = styled.p`
  color: white;
  font-size: 3vw;

  @media (min-width: 768px) {
    font-size: 30px;
  }
`;

export const BannerSectionTextContainer = styled.div`
  padding: 10px;
  width: 100%;
  order:2;

  @media (min-width: 768px) {
    width: 50vw;
    order:1;
  }
`;

export const BannerSectionImageContainer = styled.div`
  width: 100%;
  text-align: center;
  order:1;
  padding:20px;

  @media (min-width: 768px) {
    width: 50vw;
    order:2;
  }
`;

export const CTAButton = styled.a`
  display: inline-block;
  background-color: #ffa500;
  color: #ffffff;
  padding: 15px 30px;
  font-size: 3vw;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff7f00;
  }

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;