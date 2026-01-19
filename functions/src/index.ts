import * as userTriggers from './triggers/users';
import * as userControllers from './controllers/users';

export const onUserCreate = userTriggers.onUserCreate;
export const onUserDelete = userTriggers.onUserDelete;

export const updateUser = userControllers.updateUser;
