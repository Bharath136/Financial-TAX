import React from 'react'

const AuthContext = React.createContext({
    activeRole: '',
    hideSidebar: false,
    changeRole: () => { },
    changeLogin: () => { },
    changeSidebar: () => { }
})

export default AuthContext