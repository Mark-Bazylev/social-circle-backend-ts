import { StatusCodes } from "http-status-codes";
import Account, { AccountDetails } from "../models/Account";
import Comment from "../models/Comment";
import Post from "../models/Post";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authentication";
import { BadRequestError, NotFoundError } from "../errors";
import { ObjectId } from "mongoose";
export async function createComment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      body: { commentedIn },
    } = req;
    if (!user) {
      throw new BadRequestError("user not found");
    }
    req.body.createdBy = user._id;
    const post = await Post.findById(commentedIn);
    if (!post) {
      throw new BadRequestError(
        `commentedIn not found. commentedIn:${commentedIn}`,
      );
    }
    const comment = await Comment.create(req.body);
    post.commentsLength++;
    post.save();
    res.status(StatusCodes.CREATED).json(comment);
  } catch (e) {
    next(e);
  }
}
export async function getMyComments(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const { user } = req;
  const comments = await Comment.find({ createdBy: user?._id });
  res.status(StatusCodes.OK).json(comments);
}

export async function getPostComments(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      params: { id: postId },
    } = req;

    const comments = await Comment.find({ commentedIn: postId });
    const createdByIdArray: ObjectId[] = [];
    comments.forEach((comment) => createdByIdArray.push(comment.createdBy));
    const accounts = await Account.find({
      createdBy: { $in: createdByIdArray },
    });
    const accountsMap: Record<string, AccountDetails> = {};
    accounts.forEach(
      (account) => (accountsMap[account.createdBy.toString()] = account),
    );
    res.status(StatusCodes.OK).json({ comments, accountsMap });
  } catch (e) {
    next(e);
  }
}

export async function getComment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      params: { id: commentId },
    } = req;

    const comment = await Comment.findById(commentId);

    res.status(StatusCodes.OK).json(comment);
  } catch (e) {
    next(e);
  }
}
export async function getCommentLikes(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      params: { id: commentId },
    } = req;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new BadRequestError(
        `comment not found with comment Id: ${commentId}`,
      );
    }
    const accounts = await Account.find({ createdBy: { $in: comment.likes } });
    const accountsMap: Record<string, AccountDetails> = {};
    accounts.forEach((account) => {
      accountsMap[account.createdBy.toString()] = account;
    });

    res.status(StatusCodes.OK).json({ comment, accountsMap });
  } catch (e) {
    next(e);
  }
}

export async function toggleLikeComment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      params: { id: commentId },
    } = req;
    if (!user || !user._id) {
      throw new BadRequestError("user not found");
    }
    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }
    const isAlreadyLiked = !!comment.likes.find(
      (id) => id.toString() === user._id?.toString(),
    );
    if (isAlreadyLiked) {
      const index = comment.likes.findIndex(
        (id) => id.toString() === user._id?.toString(),
      );
      comment.likes.splice(index, 1);
      await comment.save();
    } else {
      comment.likes.push(user._id);
      await comment.save();
    }
    res.status(StatusCodes.CREATED).json(comment);
  } catch (e) {
    next(e);
  }
}
