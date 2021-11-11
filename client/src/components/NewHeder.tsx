import React, { FC, useContext, useEffect, useState } from 'react';
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import './Header.css'
import logo from '../pic/monitor.png'

const NewHeader = () => {
    const { store } = useContext(Context);



    return (<div>
        <div >
            <a>
                <div className={`Header ${store.user.isActivated ? `activated` : `not-activated`}`}>
                    <img className="Header_logo" src={logo}></img>
                    <span className="Header_name">SIO</span>
                    <button className="Header_round" onClick={() => store.logout()}>
                         <h1 className="Header_user"></h1>{/*{store.user.email.length != 0 ? store?.user?.email[0] : null} */}
                    </button>
                </div>
            </a>
        </div>
    </div>
    );
}

export default observer(NewHeader);