import styled from 'styled-components';

export const AddStaffContainer = styled.div` width: 100%;
display: flex;
align-items: center;
justify-content: center;
background-color: var(--main-background);
border-radius: 8px;
margin-top: 10vh;
height: 90vh;
`;

export const AddStaffCard = styled.div` padding: 30px;
width: 50%;
background-color: var(--background-white);

@media screen and (max-width: 768px) {
    flex: 1;
    margin: 20px;
}

`;

export const AddStaffHeader = styled.h2` font-size: 24px;
margin-bottom: 20px;
color: var(--heading);
`;

export const FormContainer = styled.div` width: 100%;
`;

export const MarginBottom2 = styled.div` 
    margin-bottom: 8px;
    display:flex;
    flex-direction:column;
`;

export const FormLabel = styled.label` font-size: 14px;
    color: #333;
    margin-bottom: 4px;
`;

export const TextDark = styled.div` color: #333;
`;

export const Padding2 = styled.div` padding: 8px;
`;

export const ButtonContainer = styled.div`
    width:100%;
    display:flex;
    align-items:center;
    justify-content:flex-end;
`

export const AddStaffButton = styled.button` 
    background-color: var(--accent-background);
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: var(--button-hover);
    }
`;