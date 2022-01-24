import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";
import { IAuditoria } from "../models/IAuditorii";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;
    //auditoria ={} as IAuditoria;


    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    // setAuditoria(auditoria: IAuditoria){
    //     this.auditoria = auditoria;
    // }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string) {
        try {
            //console.log(email,password);
            const response = await AuthService.login(email, password);
            
            //console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            //alert(response.data);
        } catch (e) {
            //console.log(e.response.data.message);
            alert(e);
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            //console.log(e/*.response?.data?.message*/);
            alert(e)
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            //console.log(e/*.response?.data?.message*/);
            alert(e)
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            //console.log(e/*.response?.data?.message*/);
        } finally {
            this.setLoading(false);
        }
    }
}
