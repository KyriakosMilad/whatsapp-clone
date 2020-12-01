import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../utils/HttpException';
 
export default (type: any): express.RequestHandler => {
  return (req, res, next) => {
    validate(plainToClass(type, req.body))
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map((error: ValidationError) => Object.values(error.constraints!)).join(', ');
          next(new HttpException(message, 422));
        } else {
          next();
        }
      });
  };
}