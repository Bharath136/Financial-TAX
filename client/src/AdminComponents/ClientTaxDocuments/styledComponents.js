import styled from "styled-components";

export const ClientDocumentContainer = styled.div`
    margin-top: 10vh;
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
    font-family:Arial, Helvetica, sans-serif
`;

export const ClientTaxDocumentsHeaderContainer = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;
    width:100%;
    @media screen and (max-width:768px){
        flex-direction:column;
        align-items:flex-start;
    }
`

export const ClientsHeaderContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:flex-start;
    @media screen and (max-width:512px){
        flex-direction:column;
        align-items:flex-start;
    }
`

export const Select = styled.select`
    padding:10px;
    width:200px;
    @media screen and (max-width:768px){
        width:80vw;
    }
`

export const Description = styled.p`
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
    border-collapse: collapse;
    margin-top: 10px;
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
    ${'' /* color: ${(props) => (props.reviewed ? 'green' : (props.rejected ? 'red' : (props.pending ? 'orange' : (props.assigned ? 'green' : 'grey'))))}; */}

`

export const NoDocuments = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    min-height:60vh;
`

