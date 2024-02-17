import { NextFunction, Response } from "express";

import { StatusCodes } from "http-status-codes";
import FriendData from "../models/FriendData";
import Account, { AccountDetails } from "../models/Account";
import { AuthenticatedRequest } from "../middleware/authentication";
import { BadRequestError } from "../errors";
import { ObjectId } from "mongoose";

export async function getFriendsData(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { user } = req;
    if (!user) {
      throw new BadRequestError("user not found");
    }
    const friendsData = await FriendData.findOne({ createdBy: user._id });
    if (!friendsData) {
      throw new BadRequestError("friend Data doesnt exist");
    }
    const accountsIds = [
      ...friendsData.friendsList,
      ...friendsData.sentRequests,
      ...friendsData.receivedRequests,
    ];

    const accounts = await Account.find({ createdBy: { $ne: user._id } });
    const potentialFriends: ObjectId[] = [];
    const accountsMap: Record<string, AccountDetails> = {};
    accounts.forEach((account) => {
      accountsMap[account.createdBy.toString()] = account;
      //this should contain a list of people you may know according to matrix of similar interests and location.
      //this is out of scope for this project
      if (
        accountsIds.findIndex(
          (id) => id.toString() === account.createdBy.toString(),
        ) === -1
      ) {
        potentialFriends.push(account.createdBy);
      }
    });
    res
      .status(StatusCodes.OK)
      .json({ friendsData, accountsIds, potentialFriends, accountsMap });
  } catch (e) {
    next(e);
  }
}

export async function sendFriendRequest(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      body: { requestedUserId },
    } = req;
    if (!user || !user._id) {
      throw new BadRequestError("user not found");
    }
    const friendsData = await FriendData.findOne({ createdBy: user._id });
    if (!friendsData) {
      throw new BadRequestError("friend Data doesnt exist");
    }
    if (
      !friendsData.sentRequests.some((id) => id.toString() === requestedUserId)
    ) {
      friendsData.sentRequests.push(requestedUserId);
    }
    const receivingFriendRequest = await FriendData.findOne({
      createdBy: requestedUserId,
    });
    if (!receivingFriendRequest) {
      throw new BadRequestError("receiving friend data not found");
    }
    if (
      !receivingFriendRequest.receivedRequests.some(
        (id) => id.toString() === user._id?.toString(),
      )
    ) {
      receivingFriendRequest.receivedRequests.push(user._id);
    }
    await friendsData.save();
    await receivingFriendRequest.save();
    res.status(StatusCodes.OK).json({ friendsData, receivingFriendRequest });
  } catch (e) {
    next(e);
  }
}

export async function acceptFriendRequest(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      body: { acceptedUserId },
    } = req;
    if (!user) {
      throw new BadRequestError("user not found");
    }
    const friendsData = await FriendData.findOne({ createdBy: user._id });
    const otherFriendRequest = await FriendData.findOne({
      createdBy: acceptedUserId,
    });
    if (!friendsData || !otherFriendRequest) {
      throw new BadRequestError("friend data or friendRequest was not found");
    }
    const requestIndex = friendsData.receivedRequests.findIndex(
      (id) => id.toString() === acceptedUserId,
    );
    const otherRequestIndex = otherFriendRequest.sentRequests.findIndex(
      (id) => id.toString() === user._id?.toString(),
    );
    if (requestIndex != -1 && otherRequestIndex != -1) {
      const [receivedRequestId] = friendsData.receivedRequests.splice(
        requestIndex,
        1,
      );
      const [sentRequestId] = otherFriendRequest.sentRequests.splice(
        otherRequestIndex,
        1,
      );
      //putting in friends list array
      friendsData.friendsList.push(receivedRequestId);
      otherFriendRequest.friendsList.push(sentRequestId);
    }
    await friendsData.save();
    await otherFriendRequest.save();
    res.status(StatusCodes.OK).json({ friendsData, otherFriendRequest });
  } catch (e) {
    next(e);
  }
}
