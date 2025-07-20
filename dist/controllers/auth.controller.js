import { prisma } from '#lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import '#types/express';
export class AuthController {
    // 🔐 Register
    async register(req, res) {
        const { email, password, name } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return res.status(400).json({
                success: false,
                error: 'User already exists',
            });
        }
        // ✅ Hash password like Laravel mutator
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
            },
        });
        return res.json({
            success: true,
            user: {
                id: newUser.id,
                email: newUser.email,
            },
            token: jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' }),
        });
    }
    // 🔐 Login
    async login(req, res) {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        // ✅ Compare hashed password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
            },
            token: token,
        });
    }
    forgotPassword(req, res) {
        const { email } = req.body;
        res.json({ success: true, message: 'Reset link sent' });
    }
    //profile
    async profile(req, res) {
        const { email, name, age } = req.body;
        // Extract userId from JWT payload
        const userPayload = req.user;
        const userId = userPayload?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { email, name, age },
        });
        return res.json({
            success: true,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
            },
        });
    }
}
export default new AuthController();
