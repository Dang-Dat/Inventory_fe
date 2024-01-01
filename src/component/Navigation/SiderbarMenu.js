import React, { useEffect, useState } from 'react';
// import './SiderbarMenu.scss'
import './siderbar.css'
import { NavLink, useLocation } from 'react-router-dom';


const SidederbarMenu = (props) => {
    const [isShow, setIsShow] = useState(true)
    let location = useLocation();
    useEffect(() => {
        if (location.pathname === '/login') {
            setIsShow(false)
        }
    })


    return (
        <></>

    )
}


export default SidederbarMenu;