import { Request, Response, NextFunction } from 'express';


export const validate = (req: Request, res: Response, next: NextFunction) => {
  // If 'req.body.profile' is not null and is an object, or if 'req.file' exists,
  // then stringify 'req.body.profile' and call the next middleware.
  if (req.body.category !== null) {
    next();
  } else { 
    // Otherwise, throw an error.
    throw new Error('Missing required fields in profile.');
  }
};
