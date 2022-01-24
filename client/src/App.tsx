import React, { FC, useContext, useEffect, useState } from 'react';
import LoginForm from "./components/LoginForm";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import { IUser } from "./models/IUser";
import { IAuditoria } from './models/IAuditorii';
import UserService from "./services/UserService";
import './App.css';
import { IComputer } from './models/IComputer';
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom';
//import ComputerAdd from './components/ComputerAdd';
import Computers from './components/Computers';
import NewHeder from './components/NewHeder';



const App: FC = () => {
    const { store } = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);
    const [auditorii, setAuditorii] = useState<IAuditoria[]>([]);


    useEffect(() => {
        getAuditorii();
    }, [store.isAuth])

    async function getAuditorii() {
        try {
            await store.checkAuth()
            if (auditorii.length === 0) {
                const response = await UserService.fetchAuditorii();
                console.log(response.data);
                setAuditorii(response.data);
            }
            else {
                setAuditorii([]);
            }
        } catch (e) {
            console.log(e);
        }
    }




    if (store.isLoading) {
        return <div>Загрузка...</div>
    }
    
    if (!store.isAuth) {
        return (
            <div>
                <LoginForm />
            </div>
        );
    }
    return (
        <BrowserRouter>
            <div>
                <NewHeder />
                {users.map(user =>
                    <div key={user.email}>{user.email}</div>
                )}
                {
                    
                }
                {/* <div className="Buttonget__Audit">
                    <button className="Buttonget__Audit-but" onClick={getAuditorii}>Получить аудитории</button>
                </div> */}
                
                {
                    auditorii.map(auditoria =>
                        <div className="Auditria">
                            <div>
                                <div className="Auditria__name" key={auditoria.auditoriaName}>{auditoria.auditoriaName}</div>
                                <div key={auditoria._id}>
                                    <Computers auditoriaId={auditoria._id} />
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </BrowserRouter>
    );
};

export default observer(App);
