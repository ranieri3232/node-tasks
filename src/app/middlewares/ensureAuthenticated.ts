import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload{
  id: string;
  iat: number;
  exp: number;
}
export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.sendStatus(401);
  }
  const token = authorization.split(' ')[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = data as TokenPayload;
    req.user_id = id;

    return next();
  } catch {
    return res.status(401).send({ message: 'oh, it looks to me like you are not authenticated.' });
  }
}
