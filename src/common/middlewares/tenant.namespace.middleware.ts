import { Namespace } from 'cls-hooked';
import { Request, Response, NextFunction } from 'express';

export const namespaceMiddleware = (ns: Namespace) => {
  return function classifyMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    ns.bindEmitter(req);
    ns.bindEmitter(res);

    ns.run(() => {
      next();
    });
  };
};
