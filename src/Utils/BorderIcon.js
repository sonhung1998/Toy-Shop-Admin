import React from 'react'
import { Icon } from 'antd'
const BorderIcon = ({ type, color, style, circle, spin }) => {

    return (
        <Icon
            style={
                {
                    border: '2px solid ' + color,
                    padding: 5,
                    color: color,
                    borderRadius: circle ? '100px' : 'unset',
                    ...style
                }
            }
            type={type}
            spin={spin}
        />
    )
}
export default BorderIcon