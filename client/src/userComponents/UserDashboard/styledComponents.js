import styled from 'styled-components';

const DashboardContainer = styled.div`
    padding: 20px;
    margin-top: 10vh;
    height: 90vh;
    overflow-y: auto;
    background-color: var(--main-background);
    width: 100%;
`
const CardsContainer = styled.div`
    display:flex;
    align-items:flex-start;
    flex-wrap:wrap;
`
const StepCard = styled.div`
    display: flex;
    align-items: space-between;
    justify-content:space-between;
    border: 1px solid var(--border);
    background-color: var(--background-white);
    border-radius: 8px;
    margin: 10px;
    overflow: hidden;
    transition: box-shadow 0.3s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    padding: 20px;
    min-height:180px;
    flex:1;

    &:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
`;

const CardBody = styled.div`
    padding: 5px;
    flex:1;
`;

const CardTitle = styled.h2`
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: var(--accent-background);
    flex:1;
`;

const CardText = styled.p`
    color: grey;
    flex:1;
`;

const ArrowIcon = styled.div`
    color: var(--accent-background);
`;

const StepDetails = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: black;
`;

const H1 = styled.h1`
    font-size: 26px;
    margin-bottom: 20px;
`

const CurrentUser = styled.span`
    color: var(--accent-background);
`

const Shadow = styled.div`
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

const IntroText = styled.p`
    font-size:18px;
    color:grey;
    @media screen and (max-width:768px){
        font-size:14px;
    }
`

export { CardsContainer, StepCard, CardBody, CardTitle, CardText, ArrowIcon, StepDetails, DashboardContainer, H1, CurrentUser, Shadow, IntroText };
