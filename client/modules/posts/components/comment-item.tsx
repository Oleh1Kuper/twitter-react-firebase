import { useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, MessageCircle, Trash2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import getInitials from '@/utils/get-initials';

import useCommentForm from '../hooks/use-comment-form';
import useReplies from '../hooks/use-replies';
import { Comment } from '../types';
import EditComment from './edit-comment';
import ReplyItem from './reply-item';

type CommentItemProps = {
  comment: Comment;
  postId: string;
};

const CommentItem = ({ comment, postId }: CommentItemProps) => {
  const [showSubcomments, setShowSubcomments] = useState(false);

  const { FormContent, showReplyInput, setShowReplyInput } = useCommentForm(
    comment.id,
    postId,
  );

  const { replies } = useReplies({
    commentId: comment.id,
    postId,
    enabled: showSubcomments,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage
            src={comment.userPhotoUrl ?? ''}
            alt={comment.userDisplayName}
          />
          <AvatarFallback className="text-xs">
            {getInitials(comment.userDisplayName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-sm font-medium">
              {comment.userDisplayName}
            </span>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </span>
          </div>

          <p className="text-muted-foreground text-xs">{comment.content}</p>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="h-7 gap-1 px-2"
            >
              <MessageCircle className="h-3 w-3" />
              <span className="text-xs">Reply</span>
            </Button>
            {comment.repliesCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSubcomments(!showSubcomments)}
                className="h-7 gap-1 px-2"
              >
                {showSubcomments ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
                <span className="text-xs">
                  {comment.repliesCount} {'replies'}
                </span>
              </Button>
            )}
          </div>
        </div>

        <EditComment comment={comment.content} />
        <Button variant="ghost" className="h-fit w-fit p-1">
          <Trash2 />
        </Button>
      </div>

      {showReplyInput && FormContent}

      {showSubcomments && (
        <div className="border-border mt-2 ml-8 flex flex-col gap-3 border-l pl-4">
          {replies.map((reply) => (
            <ReplyItem
              commentId={comment.id}
              postId={postId}
              key={reply.id}
              reply={reply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
