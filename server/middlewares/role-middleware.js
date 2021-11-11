const jwt = require('jsonwebtoken');

module.exports = (role) => {
    return (req, res, next) => {
        if (req.method == "OPTIONS") {
            next();
        }
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({ message: "Пользователь не авторизован" })
            }
            const { role: userRoles } = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            console.log(userRoles);
            let hasRole = false;
            userRoles.forEach(roleItem => {
                if (role.includes(roleItem)) {
                    hasRole = true;
                }
            });
            if (!hasRole) {
                return res.status(403).json({ message: "У вас нет доступа" })
            }
            next();
        } catch (e) {
            console.log(e)
            return res.status(403).json({ message: "Пользователь не авторизован" })
        }
    }
}