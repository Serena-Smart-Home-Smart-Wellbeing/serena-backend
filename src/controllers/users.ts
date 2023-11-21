import { getJwtAccessSecret } from "@/config/secret-manager";
import { HttpError } from "@/utils/errors";
import prisma from "@/utils/prisma";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

enum PasswordError {
    TOO_SHORT = "Password must be at least 8 characters long"
}

const validatePassword = (password: string) => {
    if (password.length < 8) {
        return PasswordError.TOO_SHORT;
    }

    return true;
};

interface RegisterUserReqBod {
    username: string;
    email: string;
    password: string;
}

export const registerUser: RequestHandler<
    unknown,
    unknown,
    RegisterUserReqBod
> = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            let missingField = "";
            if (!username) missingField = "username";
            else if (!email) missingField = "email";
            else if (!password) missingField = "password";

            throw new HttpError(400, `Missing ${missingField}`);
        }

        const isPasswordValid = validatePassword(password);
        if (isPasswordValid !== true) {
            throw new HttpError(400, isPasswordValid);
        }

        const userExists = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });
        if (userExists) {
            throw new HttpError(409, "User already exists");
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                password: bcrypt.hashSync(password, 10),
                username
            }
        });

        const accessToken = jwt.sign(
            { userId: newUser.id },
            await getJwtAccessSecret(),
            { expiresIn: "30d" }
        );

        return res.status(201).json({
            accessToken,
            userId: newUser.id
        });
    } catch (err) {
        next(err);
    }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new HttpError(400, "Token not provided");
        }

        const isTokenValid = jwt.verify(token, await getJwtAccessSecret());
        if (!isTokenValid) {
            throw new HttpError(401, "Invalid token");
        }

        const userExists = await prisma.user.findFirst({
            where: {
                id: req.params.userId
            }
        });
        if (!userExists) {
            throw new HttpError(404, "User not found");
        }

        const deletedUser = await prisma.user.delete({
            where: {
                id: req.params.userId
            },
            select: {
                email: true,
                id: true,
                username: true
            }
        });

        return res.status(204).json(deletedUser);
    } catch (err) {
        next(err);
    }
};
