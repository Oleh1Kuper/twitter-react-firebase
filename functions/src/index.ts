import * as userTriggers from './triggers/users';
import * as userControllers from './controllers/users';
import * as postsControllers from './controllers/posts';

export const onUserCreate = userTriggers.onUserCreate;
export const onUserDelete = userTriggers.onUserDelete;

export const updateUser = userControllers.updateUser;

export const createPost = postsControllers.createPost;
