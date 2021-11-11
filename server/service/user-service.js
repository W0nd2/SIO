const UserModel = require('../models/user-model');
const AuditoriaModel = require('../models/auditoria-model');
const ComputerModel = require('../models/computer-model');
const Role = require('../models/role-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error');

class UserService{
    async registration(email,password){
        const candidate = await UserModel.findOne({email})
        if(candidate)
        {
            throw ApiError.BadRequest(`Пользователь с таким почтовым адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const role = await Role.findOne({value: 'Admin'}); 
        const user = await UserModel.create({email, password:hashPassword, activationLink, roles: role.value})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return{
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink){
        const user = await UserModel.findOne({activationLink});
        if(!user){
            throw ApiError.BadRequest('Некоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password){
        const user = await UserModel.findOne({email})
        if(!user){
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals){
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return{
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnathorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb){
            throw ApiError.UnathorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return{
            ...tokens,
            user: userDto
        }
    }

    async getAllUser(){
        /*const userRole = new Role();
        const adminRole = new Role({value: 'Admin'});
        await userRole.save();
        await adminRole.save(); */ //костыль для ролей
        const users = await UserModel.find();
        return users;
    }

    async auditoriaCreate(name)
    {
        const auditoria = await AuditoriaModel.findOne({auditoriaName: name})
        if(auditoria)
        {
            throw ApiError.BadRequest(`Аудитория с таки названием ${name} уже существует`)
        }
        const newAuditoria = await AuditoriaModel.create({auditoriaName: name});
        return newAuditoria;
    }

    async getAllAuditorii()
    {
        const auditorii = await AuditoriaModel.find();
        return auditorii;
    }

    async computerAdd(computerId,computerState){
        const computer = await ComputerModel.findOne({computerId});
        if(computer)
        {
            throw ApiError.BadRequest(`ПК с таки id ${computerId} уже существует`)
        }
        const newComputer = await ComputerModel.create({computerId,computerState});
        return newComputer;
    }

    async computerRemove(computerId){
        /*const computer = await ComputerModel.findById(computerId);
        if(!computer)
        {
            throw ApiError.BadRequest(`ПК с таки id ${computerId} не существует`)
        }*/
        await ComputerModel.findByIdAndDelete(computerId);
    }

    async computerStateChange(computerId,computerState){
        const computer = await ComputerModel.findById(computerId);
        if(!computer){
            throw ApiError.BadRequest(`ПК с таки id ${computerId} не существует`)
        }
        computer.computerState = computerState;
        await computer.save();
        return computer;
    }
}

module.exports = new UserService();