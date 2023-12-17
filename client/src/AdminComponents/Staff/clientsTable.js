const { Table, ViewButton } = require("../../staffComponents/AssignedClients/styledComponents")
const { Th, Td } = require("./styledComponents")

const ClientTable = ({ assignedClients, viewAssignedClients }) => {
    return (
        <>{viewAssignedClients && assignedClients.length > 0 && <Table>
            <thead>
                <tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    {/* <Th>Remove Client</Th> */}
                </tr>
            </thead>
            <tbody>
                {assignedClients.map((client) => (
                    <tr key={client.user_id} >
                        <Td>{client.user_id}</Td>
                        <Td>{client.first_name}</Td>
                        <Td>{client.email_address}</Td>
                        <Td>{client.contact_number}</Td>
                        {/* <Td>
                            <ViewButton className="text-warning">Remove</ViewButton>
                        </Td> */}
                    </tr>
                ))}
            </tbody>
        </Table>}</>
    )
}

export default ClientTable