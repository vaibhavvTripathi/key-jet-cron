import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Function to authenticate user
export async function authenticateUser(hashedPassword: string, password: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

// Function to generate JWT token
export function generateToken(username: string): string {
    return jwt.sign({ username }, process.env.JWT_KEY as string, { expiresIn: '1h' });
}