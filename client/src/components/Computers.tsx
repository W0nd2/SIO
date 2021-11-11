import React, { FC, useContext, useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import { IComputer } from '../models/IComputer';
import UserService from "../services/UserService";
import { Context } from "../index";
import { buildQueries, render } from '@testing-library/react';
import './Computers.css';

interface AuditoriaID {
    auditoriaId: string;
}

type Computer = {
    computer: IComputer[];
}

const Computers = ({ auditoriaId }: AuditoriaID) => {
    const [computer, setComputer] = useState<IComputer[]>([]);
    const [newState, setNewState] = useState<string>('');
    const { store } = useContext(Context);
    const [id, setId] = useState<string>('')
    const [state, setState] = useState<string>('')

    async function computerAdd(auditoriaId: string, computerId: string, computerState: string) {
        try {
            console.log(auditoriaId, computerId, computerState);
            const response = await UserService.fetchComputersAdd(computerId, computerState, auditoriaId);
        } catch (e) {
            console.log(e);
        }
    }

    async function getComputors(_id: string) {
        try {
            console.log(_id);
            const response = await UserService.fetchComputers(_id);
            console.log(response.data);
            setComputer(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    async function deleteComputor(computerId: string, auditoriaId: string) {
        try {

            console.log(computerId, auditoriaId);
            const response = await UserService.fetchComputerRemove(computerId, auditoriaId)
            console.log(response.data);
            let computers = [];
            computers = computer.filter(computer => computerId != computer._id)
            setComputer(computers);
        } catch (e) {
            console.log(e);
        }
    }

    async function stateChangeComputor(computerId: string, computerState: string,computerName: string) {
        try {
            console.log(computerId, computerState);
            const response = await UserService.fetchComputerState(computerId, computerState);
            console.log(response.data);
        } catch (e) {
            console.log(e);
        }
    }


    return (
        <div className="Computer__container">
            <div>
                <button className="Computer__container-btn" onClick={() => getComputors(auditoriaId)}>Получить РС</button>
            </div>
            {
                computer.length != 0 &&
                computer?.map(pc =>
                    <div className={`Computer ${pc.computerState === 'good' ? 'good' : 'medium'}`}>
                        <div>
                            <div>
                                <h1 className="Computer__name">{pc.computerId}</h1>
                                <h1 className="Computer__state">{pc.computerState}</h1>
                            </div>
                            <div className="Admin__button">
                                {

                                    store.user.roles = 'Admin' ?
                                        <button className="Computer__add" onClick={() => deleteComputor(pc._id, auditoriaId)}>Удаление</button>
                                        : <div></div>
                                }
                                {
                                    store.user.roles = 'Admin' ?
                                        <button className="Computer__add" onClick={() => stateChangeComputor(pc._id, newState,pc.computerId)}>Смена состояния</button>
                                        : <div></div>
                                }
                            </div>
                        </div>
                        <span className="Computer__state-txt">
                            {pc.computerState === 'good' ? 'Состояноие PC отвечает всем установленым стандартам, проблем в работе не обнаружено'
                                : 'Есть небольшие сбои в работе PC, возможно нужно вмешательство человека'}
                        </span>
                    </div>
                )
            }
            {store.user.roles = 'Admin' ?
                <input
                    className="Computer__input-state"
                    type="text"
                    placeholder="Enter new state"
                    value={newState}
                    onChange={e => setNewState(e.target.value)}
                />
                : <div></div>
            }
            <div className="Computer__inputs">
                <input
                    className="Computer__input"
                    type="number"
                    placeholder="Enter computerId"
                    value={id}
                    onChange={e => setId(e.target.value)}
                />
                <input
                    className="Computer__input"
                    type="text"
                    placeholder="Enter computerState"
                    value={state}
                    onChange={e => setState(e.target.value)}
                />
                <button className="Computer__state-changer" onClick={() => computerAdd(auditoriaId, id, state)}>Добавить новый ПК</button>
            </div>

        </div>
    );
};

export default observer(Computers);