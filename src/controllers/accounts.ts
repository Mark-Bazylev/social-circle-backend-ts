import { StatusCodes } from "http-status-codes";
import Account, { AccountDetails } from "../models/Account";
import { BadRequestError } from "../errors";
import { Response, NextFunction } from "express";
import { AuthenticatedAccountRequest } from "../middleware/image-handler";

export async function getAccounts(
  req: AuthenticatedAccountRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { user } = req;

    const accounts = await Account.find({ createdBy: { $ne: user?._id } }).sort(
      "createdAt",
    );
    res.status(StatusCodes.OK).json({ accounts, count: accounts.length });
  } catch (e) {
    next(e);
  }
}
export async function getAccount(
  req: AuthenticatedAccountRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      params: { id },
    } = req;
    const account = await Account.findOne({
      createdBy: id,
    }).sort("createdAt");
    res.status(StatusCodes.OK).json(account);
  } catch (e) {
    next(e);
  }
}

export async function editAccount(
  req: AuthenticatedAccountRequest,
  res: Response,
  next: NextFunction,
) {
  const {
    user,
    body: { firstName, lastName },
  } = req;
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new BadRequestError("No Image files were uploaded.");
  }

  const account = await Account.findOne({ createdBy: user?._id });
  if (account) {
    if (firstName) account.firstName = firstName;
    if (lastName) account.lastName = firstName;
    account.coverImageName = (req.files as any)["coverImage"].originalname;
    account.avatarImageName = (req.files as any)["avatarImage"].originalname;
    account.save();
  }
  res.status(StatusCodes.OK).json(account);
}
