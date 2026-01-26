
import { formatDistanceToNow } from 'date-fns';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import getInitials from '@/utils/get-initials';

import useCommentForm from '../hooks/use-comment-form';
import { Reply } from '../types';

interface CommentItemProps {
  reply: Reply;
  commentId: string;
  postId: string;
}

const ReplyItem = ({ reply, commentId, postId }: CommentItemProps) => {
  const { FormContent, showReplyInput } = useCommentForm(commentId, postId);

  return (
    <div className={`flex flex-col gap-2`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage
            src={reply.userPhotoUrl ?? ''}
            alt={reply.userDisplayName}
          />
          <AvatarFallback className="text-xs">
            {getInitials(reply.userDisplayName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-sm font-medium">
              {reply.userDisplayName}
            </span>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="text-muted-foreground text-xs">{reply.content}</p>
        </div>
      </div>

      {showReplyInput && FormContent}
    </div>
  );
};

export default ReplyItem;
