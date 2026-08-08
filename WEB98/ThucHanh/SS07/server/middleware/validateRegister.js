export default function validateRegister(req, res, next) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'username, email and password are required' });
    }

    // if(typeof age !== 'number') {
    //     return res.status(400).json({ message: 'age must be a number' });
    // }

    // if(typeof email !== 'string') {
    //     return res.status(400).json({ message: 'email must be a string' });
    // }
    
    // if(typeof password !== 'string') {
    //     return res.status(400).json({ message: 'password must be a string' });
    // }

    // if(password.length < 8) {
    //     return res.status(400).json({ message: 'password must be at least 8 characters long' });
    // }
    
    
    next();
}