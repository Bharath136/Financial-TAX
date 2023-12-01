import styled from "styled-components";

export const ClientListContainer = styled.div`
    width: 100%;
    margin: auto;
    margin-top: 10vh;
    overflow-y: auto;
    padding: 1rem;
    background-color: var(--main-background);
    height: 90vh;
`

export const H1 = styled.h1`
    color: #3271f8;
    font-weight: bolder;
    font-size: 26px;
    margin: 10px 0;
    margin-bottom: 20px;
    font-family:Arial, Helvetica, sans-serif
`;

export const TableContainer = styled.div`
    background-color: var(--background-white);
    padding: 20px;
    overflow: auto;
`

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    text-align: center;
`


export const Th = styled.th`
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
    background-color: #f2f2f2;
`

export const Td = styled.td`
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
`

export const Button = styled.button`
    border-radius: 30px;
    padding: 8px 16px;
    background-color: transparent;
    color: #fff;
    cursor: pointer;
    font-weight: bold;
    border: none;
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

export const NoClientContainer = styled.div`
    height:80vh;
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
`