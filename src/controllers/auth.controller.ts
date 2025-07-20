import { Request, Response } from 'express';
import { prisma } from '#lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserResource } from '#resources/UserResource';
import { blacklistToken } from '#lib/tokenBlacklist';

export class AuthController {
  // Register
  public async register(req: Request, res: Response) {
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
      token: jwt.sign(
        { userId: newUser.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      ),
    });
  }

  // Login
  public async login(req: Request, res: Response) {
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

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    return res.json({
      success: true,
      user: UserResource(user),
      token: token,
    });
  }

  public forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    // Here you would typically send a reset password email
    // For simplicity, we will just return a success message
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    // Simulate sending a reset link
    console.log(`Reset link sent to ${email}`);
    // In a real application, you would send an email with a reset link
    // that includes a token or unique identifier for the user
    // You would also need to create a route to handle the reset link
    // and handle the reset logic separately.
    // This is just a placeholder to demonstrate the flow.
    // For now, we just return a success message
    return res.json({ success: true, message: 'Reset link sent' });
  }

  //profile
  public async profile(req: Request, res: Response) {
    const user = UserResource(req.user);
    return res.json({
      success: true,
      user: user,
      message: 'Profile retrieved successfully',
    });
  }

  // logout
 public async logout(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(400).json({ success: false, message: 'No token provided' });

  const decoded = jwt.decode(token) as { exp?: number };
  if (!decoded?.exp) return res.status(400).json({ success: false, message: 'Invalid token' });

  const expiresAt = new Date(decoded.exp * 1000);
  await blacklistToken(token, expiresAt);

  return res.status(200).json({ success: true, message: 'Logged out and token blacklisted' });
}
}

export default new AuthController();
