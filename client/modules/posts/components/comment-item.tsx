import { useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Comment } from '@/types';

interface CommentItemProps {
  comment: Comment;
  depth?: number;
}

const CommentItem = ({ comment, depth = 0 }: CommentItemProps) => {
  const [likes, setLikes] = useState(comment.likes);
  const [dislikes, setDislikes] = useState(comment.dislikes);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(
    null,
  );
  const [showSubcomments, setShowSubcomments] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleLike = () => {
    if (userReaction === 'like') {
      setLikes(likes - 1);
      setUserReaction(null);
    } else {
      if (userReaction === 'dislike') {
        setDislikes(dislikes - 1);
      }
      setLikes(likes + 1);
      setUserReaction('like');
    }
  };

  const handleDislike = () => {
    if (userReaction === 'dislike') {
      setDislikes(dislikes - 1);
      setUserReaction(null);
    } else {
      if (userReaction === 'like') {
        setLikes(likes - 1);
      }
      setDislikes(dislikes + 1);
      setUserReaction('dislike');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleReply = () => {
    if (replyText.trim()) {
      console.log('Reply submitted:', replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const hasSubcomments = comment.subcomments && comment.subcomments.length > 0;
  const maxDepth = 3;

  return (
    <div
      className={`flex flex-col gap-2 ${depth > 0 ? 'border-border ml-8 border-l pl-4' : ''}`}
    >
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage
            src={comment.author.avatar || '/placeholder.svg'}
            alt={comment.author.name}
          />
          <AvatarFallback className="text-xs">
            {getInitials(comment.author.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-sm font-medium">
              {comment.author.name}
            </span>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="text-foreground text-sm">{comment.text}</p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-7 gap-1 px-2 ${userReaction === 'like' ? 'text-primary' : ''}`}
            >
              <ThumbsUp className="h-3 w-3" />
              <span className="text-xs">{likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDislike}
              className={`h-7 gap-1 px-2 ${userReaction === 'dislike' ? 'text-destructive' : ''}`}
            >
              <ThumbsDown className="h-3 w-3" />
              <span className="text-xs">{dislikes}</span>
            </Button>
            {depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="h-7 gap-1 px-2"
              >
                <MessageCircle className="h-3 w-3" />
                <span className="text-xs">Reply</span>
              </Button>
            )}
            {hasSubcomments && (
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
                  {comment.subcomments?.length}{' '}
                  {comment.subcomments?.length === 1 ? 'reply' : 'replies'}
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {showReplyInput && (
        <div className="ml-11 flex flex-col gap-2">
          <Textarea
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[60px] text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowReplyInput(false);
                setReplyText('');
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleReply}
              disabled={!replyText.trim()}
            >
              Reply
            </Button>
          </div>
        </div>
      )}

      {showSubcomments && hasSubcomments && (
        <div className="mt-2 flex flex-col gap-3">
          {comment.subcomments?.map((subcomment) => (
            <CommentItem
              key={subcomment.id}
              comment={subcomment}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
