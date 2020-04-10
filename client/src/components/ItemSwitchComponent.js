import React from 'react';
import SidebarIcon from '../assests/sidebaricon.svg';

export default function ItemSwitchComponent() {
    const [activeitem, setActiveItem] = React.useState(1); // useState hook to open Hamburger Menu

    const handleTabChange = (val) => {
        setActiveItem(val);
    };

    return (
        // Point no 2 and 3 covered
        <div className="nav-header-style" >
            <div>
                <img src={SidebarIcon}  aria-label="open drawer" />
            </div>
            <div className="dis-flex " >
                <div className={["item-text-style",(activeitem == 1) ? 'active-menu' : ''].join(' ')} onClick={() => handleTabChange(1)}>ALL</div>
                <div className={["item-text-style",(activeitem == 2) ? 'active-menu' : ''].join(' ')} onClick={() =>handleTabChange(2)}>Board</div>
                <div className={["item-text-style",(activeitem == 3) ? 'active-menu' : ''].join(' ')} onClick={() =>handleTabChange(3)}>Graph</div>
                <div className={["item-text-style",(activeitem == 4) ? 'active-menu' : ''].join(' ')} onClick={() =>handleTabChange(4)}>Recent</div>
            </div>
        </div>
    );
}
