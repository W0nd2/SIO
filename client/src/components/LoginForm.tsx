import React, { FC, useContext, useState } from 'react';
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import './LoginForm.css'

const LoginForm: FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { store } = useContext(Context);

    return (
        <div className="Body__LoginForm">
            <div className="LoginForm">
                <h1 className="LoginForm__title">Вхід/Регістрація</h1>
                <div className="LoginForm__input">
                    <input
                        className="LoginForm__input_user"
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        type="text"
                        placeholder=" "
                    />
                    <label className="LoginForm__input_label">Email</label>
                </div>
                <div className="LoginForm__input">
                    <input
                        className="LoginForm__input_user"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        placeholder=" "
                    />
                    <label className="LoginForm__input_label">Password</label>
                </div>
                <div className="Login__button_flex">
                    <button className="LoginForm__button" onClick={() => store.login(email, password)}>
                        Логин
                    </button>
                    <button className="LoginForm__button" onClick={() => store.registration(email, password)}>
                        Регистрация
                    </button>
                </div>
            </div>
        </div>
    );
};

export default observer(LoginForm);
