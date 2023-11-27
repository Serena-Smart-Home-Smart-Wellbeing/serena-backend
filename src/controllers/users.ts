import { getJwtAccessSecret } from "@/config/secret-manager";
import { HttpError } from "@/utils/errors";
import prisma from "@/utils/prisma";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { isRequestedBySameUser } from "@/utils/auth";

enum PasswordError {
    TOO_SHORT = "Password must be at least 8 characters long"
}

const validatePassword = (password: string) => {
    if (password.length < 8) {
        return PasswordError.TOO_SHORT;
    }

    return true;
};

interface UserReqBod {
    username: string;
    email: string;
    password: string;
}

interface SafeUserResponse {
    accessToken: string;
    userId: string;
}

export const registerUser: RequestHandler<
    unknown,
    SafeUserResponse,
    UserReqBod
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

export const login: RequestHandler<
    unknown,
    SafeUserResponse,
    Omit<UserReqBod, "username">
> = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            let missingField = "";
            if (!email) missingField = "email";
            else if (!password) missingField = "password";

            throw new HttpError(400, `Missing ${missingField}`);
        }

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!user) {
            throw new HttpError(404, "User not found");
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            throw new HttpError(401, "Wrong email/password");
        }

        const accessToken = jwt.sign(
            { userId: user.id },
            await getJwtAccessSecret(),
            { expiresIn: "30d" }
        );
        return res.status(200).json({
            accessToken,
            userId: user.id
        });
    } catch (err) {
        next(err);
    }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: req.params.userId
            }
        });
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        isRequestedBySameUser(req, user.id);

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

        return res.status(200).json(deletedUser);
    } catch (err) {
        next(err);
    }
};

export const getUserData: RequestHandler<{ userId: string }> = async (
    req,
    res,
    next
) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: req.params.userId
            },
            select: {
                email: true,
                id: true,
                username: true
            }
        });
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        isRequestedBySameUser(req, user.id);

        return res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};
