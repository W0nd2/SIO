const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const roleMiddleware = require('../middlewares/role-middleware');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:3, max:32}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', /*authMiddleware,*/ roleMiddleware(['Admin']),  userController.getUsers);
router.post('/auditorii/add', roleMiddleware(['Admin']), userController.auditoriiAdd);
//добавить получение компов по аудитории
router.post('/auditorii/computer/add', roleMiddleware(['Admin']), userController.computerAdd);
router.patch('/auditorii/computer/state', roleMiddleware(['Admin']), userController.computerStateChange);
router.delete('/auditorii/computer/remove', roleMiddleware(['Admin']), userController.computerRemove);
/* polychenie auditorii */
router.get('/auditorii', authMiddleware, userController.getAuditorii);
router.get('/auditorii/computer', authMiddleware, userController.getComputers);
module.exports = router