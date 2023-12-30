import styled from "styled-components";

export const MainContainer = styled.div`
    height:90vh;
    overflow:auto;
    background-color: var(--main-background);
    width:100%;
    margin-top:10vh;
`
export const CommentDocumentContainer = styled.div`
    margin-top:10vh;
    height: 90vh;
    padding: 1rem;
    width: 100%;
    text-align: start;
    overflow: auto;
    background-color: var(--main-background);
`

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

export const CommentDescription = styled.p`
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
`;

export const DocumentsTableContainer = styled.div`
    width:100%;
`

export const DocumentTableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
`;

export const DocumentTable = styled.table`
    width: 100%;
    margin-top: 10px;
    border:1px solid var(--border)
`;

export const DocumentName = styled.span`
    font-size:16px;
    @media screen and (max-width:912px){
        font-size:14px;
    }
    @media screen and (max-width:768px){
        font-size:12px;
    }
`


export const Button = styled.button`
    border-radius: 30px;
    padding: 8px 16px;
    background-color: transparent;
    color: var(--main-background);
    cursor: pointer;
    font-weight: bold;
    border: none;
`

export const CommentButton = styled(Button)`
    background-color: transparent;
    color: var(--button-text);
    background-color: var(--accent-background);
    &:hover{
        color: var(--accent-background);
        background-color: transparent;
        border: 1.4px solid var(--accent-background);
    }
`

export const ViewButton = styled(Button)`
    background-color: transparent;
    border: 1.4px solid var(--accent-background);
    color: var(--accent-background);
    &:hover{
        color: var(--button-text);
        background-color: var(--accent-background);
    }
`

export const CommentSectionContainer = styled.div`
    margin-top:20px;
`

export const CommentSection = styled.div`
    display:flex;
    justify-content:flex-start;
    gap:10px;
    
    @media screen and (max-width:768px){
        flex-direction:column;
        margin-top:20px;
    }
`

export const CommentInputFieldsContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
`

export const Lable = styled.label`
    margin-top:10px;
`

export const InputField = styled.input`
    padding:8px;
    color:var(--main-text);
`
export const TextArea = styled.textarea`
    rows:8;
    width:100%;
`

export const ButtonContainer = styled.div`
    width:100%;
    display:flex;
    justify-content:flex-end;
`

export const SendButton = styled(Button)`
    background-color: transparent;
    background-color: var(--accent-background);
    color: var(--button-text);
    &:hover{
        color: var(--accent-background);
    border: 1px solid var(--accent-background);
    background-color: transparent;
    }
`


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

export const EmptyDocumentContainer = styled.div`
    width:100%;
    min-height:60vh;
    text-align:center;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
`