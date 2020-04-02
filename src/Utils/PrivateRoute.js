import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import _ from 'lodash'

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render= {
                (props) => (
                    !_.isNil(sessionStorage.getItem("jwt"))
                        ? <Component {...props} />
                        : <Redirect to={{
                            pathname: '/login',
                        }} />

                )
            }
        />
    )


}
export default PrivateRoute