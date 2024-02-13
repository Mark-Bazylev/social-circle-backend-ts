import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { capitalizeFirstLetter } from "../utils";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = StatusCodes.BAD_REQUEST;
    message = err.message;
  }
  if (err.name === "CastError") {
    message = `No item found with id : ${err.value}`;
    statusCode = StatusCodes.NOT_FOUND;
  }
  if (err.code && err.code === 11000) {
    const duplicateErrorKeyString = capitalizeFirstLetter(
      Object.keys(err.keyValue)[0],
    );
    message = `${duplicateErrorKeyString} is already taken`;
    statusCode = StatusCodes.BAD_REQUEST;
  }

  res.status(statusCode).json({
    message,
  });
};
export default errorHandler;
