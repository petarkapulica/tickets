import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { validateRequest, BadRequestError } from "@sudo-invoker/common";

const router = express.Router();

router.post(
    '/api/users/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Email invalid'),
        body('password')
            .trim()
            .isLength({ min:4, max: 20 })
            .withMessage('Pass must be between 4 and 20 chars')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const {email, password} = req.body;
        const existingUser = await User.findOne({email});

        if (existingUser) {
            throw new BadRequestError('Email exists');
        }

        const user = User.build({email, password})
        await user.save();

        const userJWT = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_KEY!
        );
        req.session = {
            jwt: userJWT
        };

        res.status(201).send(user);
    }
);

export { router as signupRouter };
