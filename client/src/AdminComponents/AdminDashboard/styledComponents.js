import styled from "styled-components";

export const MainContainer = styled.div`
     padding: 20px;
    margin-top: 10vh;
    height: 90vh;
    overflow-y: auto;
    background-color: var(--main-background);
    width: 100%;
`

export const CurrentUser = styled.span`
    color: #007bff;
`

export const DashboardContainer = styled.ul`
  list-style-type:none;
  padding:0px;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  margin-top:30px;
`;

export const SectionCard = styled.div`
  flex: 0 0 calc(100% - 20px);
  border:1px solid var(--border);
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0px 20px var(--shadow);
  overflow: hidden;
  cursor: pointer;
  width:100%;
  
  &:hover{
    transform: scale(1.06);
    transition: .2s ease-in;
    box-shadow: 0 0px 20px var(--main-background-shade);
  }

  @media (min-width: 768px) {
    flex: 0 0 calc(50% - 20px);
    margin-right: 20px;
  }

  @media (min-width: 1024px) {
    flex: 0 0 calc(33.333% - 20px);
  }
`;

export const DashboardItem = styled.div`
  display: flex;
  align-items: center;
  justify-content:center;
  gap:20px;
  padding: 16px;

  .dashboard-icon {
    margin-bottom: 10px;
    color: ${(props) => props.iconColor || '#333'};
  }
  @media screen and (max-width:768px){
    width:100%;
  }
`;

export const DetailsContainer = styled.div`
  margin-top: 20px;
`;