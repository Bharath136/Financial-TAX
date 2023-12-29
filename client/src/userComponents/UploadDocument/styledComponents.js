import styled from 'styled-components';

export const TaxInterviewContainer = styled.div`
    margin-top: 10vh;
    height: 90vh;
    padding: 1rem;
    width: 100%;
    text-align: start;
    overflow: auto;
    background-color: var(--main-background);
`;

export const H1 = styled.h1`
    color: var(--headings);
    font-weight: bolder;
    font-size: 26px;
    margin: 10px 0;
    margin-bottom: 20px;
    font-family:Arial, Helvetica, sans-serif;
    @media screen and (max-width:768px){
        font-size:20px;
    }
`;

export const TaxDescription = styled.p`
    font-size: 16px;
    margin-bottom: 20px;
`;

export const CtaSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    padding: 20px;
    border-radius: 4px;
    min-height:50vh;
`;

export const Form = styled.form`
    width:70%;
    display:flex;
    flex-direction:column;
    padding:40px;
    box-shadow: 0 4px 8px var(--border);
    @media screen and (max-width:1020px){
        padding:20px;
        width:100%;
    }
`

export const InputFieldsContainer = styled.div`
    display:flex;
    width:100%;
    align-items:center;
    @media screen and (max-width:912px){
        width:100%;
        flex-direction:column;
    }
`


export const InputFieldsSubContainer = styled.div`
    gap:10px;
    margin-bottom:6px;
    @media screen and (max-width:912px){
        margin:0px;
        width:100%;
    }
`

export const Select = styled.select`
    padding:10px;
`

export const Label = styled.label`
    margin-bottom:4px;
`

export const InputField = styled.input`
    padding:8px;
    color:var(--main-text);
`

export const ButtonContainer = styled.div`
    width:100%;
    display:flex;
    justify-content:center;
`

export const Button = styled.button`
    color: var(--button-text);
    height: 56px;
    font-size: 20px;
    border: none;
    padding: 0 20px;
    cursor: pointer;
`

export const UploadButton = styled(Button)`
    background-color: var(--accent-background);
    transition: background-color 0.3s;
    border-radius: 30px;

    &:hover {
        background-color: var(--button-hover);
        color: var(--button-text);
    }
`;

export const DeleteButton = styled(Button)`
    color:red;
    background-color:transparent;
    &:hover{
        background-color:var(--main-background);
        border-radius:10px;
    }
`

export const DocumentName = styled.span`
    font-size:16px;
    @media screen and (max-width:912px){
        font-size:14px;
    }
    @media screen and (max-width:768px){
        font-size:12px;
    }
`

export const DragDropArea = styled.div`
    border: 4px dashed var(--border);
    padding: 30px;
    width: 100%;
    margin: 30px 0;
    border-radius: 10px;
    font-size: 22px;
    cursor: pointer;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media screen and (max-width: 768px) {
        width: 100%;
        font-size: 14px;
    }
`;


export const DocumentImage = styled.img`
    height: 120px;

    @media screen and (max-width: 768px) {
        height: 80px;
    }
`;

export const DocumentTableContainer = styled.div`
    margin-top: 20px;
    width: 100%;
    overflow: auto;
`;

export const DocumentTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
`;


export const Th = styled.th`
    border: 1px solid var(--border);
    padding: 10px;
    text-align: center;
    background-color: var(--main-background);
`

export const Td = styled.td`
    border: 1px solid var(--border);
    padding: 10px;
    text-align: center;
`