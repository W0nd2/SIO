const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');
const AuditoriaModel = require('../models/auditoria-model');
const ComputerModel = require('../models/computer-model');

class UserController{
    async registration(req,res,next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email,password} = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnle:true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req,res,next){
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnle:true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req,res,next){
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req,res,next){
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req,res,next){
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnle:true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req,res,next){
        try {
            const users = await userService.getAllUser();
            return res.json(users)
        } catch (e) {
            next(e);
        }
    }

    async auditoriiAdd(req,res,next){
        try {
            const {name} = req.body;
            const auditoriaData = await userService.auditoriaCreate(name);
            return res.json(auditoriaData);
        } catch (e) {
            next(e);
        }
    }

    async getAuditorii(req,res,next){
        try {
            const auditorii = await userService.getAllAuditorii();
            return res.json(auditorii)
        } catch (e) {
            next(e);
        }
    }

    async getComputers(req,res,next){
        /*брать из запроса айди аудитории, проверять на наличие аудитории
        найти все айди компов и записать в переменную их
        вернуть аудитории*/
        try {
            const {auditoriaId} = req.query;
            console.log(auditoriaId)
            const auditoria = await AuditoriaModel.findById(auditoriaId)
            if(!auditoria){
                throw ApiError.BadRequest(`Аудитории с таким id ${auditoriaId} не существует`)
            }
            let computers=[];
            for(let i = 0;  i < auditoria.computers.length;i++){
                console.log(auditoria.computers[i]);
                const computer = await ComputerModel.findById(auditoria.computers[i]);
                console.log(computer);
                computers.push(computer);
            }
            return res.json(computers)
        } catch (e) {
            next(e);
        }
    }

    async computerAdd(req,res,next){
        try {
            const {computerId,computerState,auditoriaId} = req.body;
            if(!auditoriaId){
                throw ApiError.BadRequest(`Аудитории с таким id ${auditoriaId} не существует`)
            }
            const auditoria = await AuditoriaModel.findById(auditoriaId)
            if(!auditoria){
                throw ApiError.BadRequest(`Аудитории с таким id ${auditoriaId} не существует`)
            }
            const computer = await userService.computerAdd(computerId,computerState);
            auditoria.computers.push(computer);
            await auditoria.save();
            return res.json(auditoria)
        } catch (e) {
            next(e);
        }
    }

    async computerRemove(req,res,next){
        try {
            const {computerId,auditoriaId} = req.body;
            console.log(computerId,auditoriaId);
            if(!auditoriaId){
                throw ApiError.BadRequest(`Аудитории с таким id ${auditoriaId} не существует`)
            }
            const auditoria = await AuditoriaModel.findById(auditoriaId)
            if(!auditoria){
                throw ApiError.BadRequest(`Аудитории с таким id ${auditoriaId} не существует`)
            }
            
            auditoria.computers = auditoria.computers.filter(computer => computerId != computer._id);
            await auditoria.save();
            await userService.computerRemove(computerId);
            return res.json(auditoria)
        } catch (e) {
            next(e);
        }
    }

    async computerStateChange(req,res,next){
        try {
            const {computerId,computerState} = req.body;
            console.log(computerId,computerState)
            const computer = await userService.computerStateChange(computerId,computerState);
            return res.json(computer)
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new UserController();