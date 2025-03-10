import React from 'react';
import { Link } from 'react-router-dom';
import "./../../public/assets/styles/Header.css";
import fullLogo from "./../../public/assets/logos/GS Full Logo SVG.svg";

const Header = () => {
    return (
        <nav className="bg-white flex flex-row justify-start items-center box-border p-3 h-[10vh] ml-[6vw]">
            <img src={fullLogo} alt="logo" className="h-3/4 w-auto"/>
        </nav>
    );
};

export default Header;