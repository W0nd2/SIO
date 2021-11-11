import $api from "../http";
import {AxiosResponse} from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import {IUser} from "../models/IUser";
import { IAuditoria } from "../models/IAuditorii";
import { IComputer } from "../models/IComputer";

export default class UserService {
    static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/users')
    }

    static fetchAuditorii(): Promise<AxiosResponse<IAuditoria[]>>{ 
        return $api.get<IAuditoria[]>('/auditorii') 
    }

    static fetchComputers(auditoriaId: string): Promise<AxiosResponse<IComputer[]>>{ 
        return $api.get<IComputer[]>(`/auditorii/computer?auditoriaId=${auditoriaId}`)
    }

    static fetchComputersAdd(computerId:string,computerState:string,auditoriaId: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auditorii/computer/add', {computerId, computerState, auditoriaId })
    }

    static fetchComputerRemove(computerId:string,auditoriaId: string): Promise<AxiosResponse<IComputer[]>>{
        const params = {computerId: computerId, auditoriaId: auditoriaId}
        return $api.delete<IComputer[]>(`/auditorii/computer/remove`,
        {
            data:params
        })
    }

    static fetchComputerState(computerId:string,computerState: string): Promise<AxiosResponse<IComputer[]>>{
        
        return $api.patch<IComputer[]>(`/auditorii/computer/state/`,{computerId,computerState}
        )
    }
}

