import React from 'react'

const AuthContext = React.createContext({
    activeRole: '',
    hideSidebar: false,
    showNav:true,
    changeRole: () => { },
    changeLogin: () => { },
    changeSidebar: () => { }
})

export default AuthContext