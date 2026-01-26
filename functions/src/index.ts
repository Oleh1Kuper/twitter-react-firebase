import * as userTriggers from './triggers/users';
import * as userControllers from './controllers/users';
import * as postsControllers from './controllers/posts';
import * as commentsControllers from './controllers/comments';

// users
export const onUserCreate = userTriggers.onUserCreate;
export const onUserDelete = userTriggers.onUserDelete;
export const updateUser = userControllers.updateUser;

// posts
export const createPost = postsControllers.createPost;
export const updatePost = postsControllers.updatePost;

// comments
export const createComment = commentsControllers.createComment;
export const createReply = commentsControllers.createReply;
