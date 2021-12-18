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
    req.userId = id;

    return next();
  } catch {
    return res.sendStatus(401);
  }
}
