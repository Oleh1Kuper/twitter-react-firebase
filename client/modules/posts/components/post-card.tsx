'use client';

import { useState } from 'react';
import Image from 'next/image';

import { formatDistanceToNow } from 'date-fns';
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Pencil,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

import PostDialog from '@/components/shared/post-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import useMyInfo from '@/hooks/use-my-info';
import { cn } from '@/lib/utils';
import getInitials from '@/utils/get-initials';

import useComments from '../hooks/use-comments';
import type { Post } from '../types';
import CommentSection from './comment-section';

type PostCardProps = {
  post: Post;
};

const PostCard = ({ post }: PostCardProps) => {
  const { myInfo } = useMyInfo();
  const [showComments, setShowComments] = useState(false);
  const { comments } = useComments(post.id, showComments);

  return (
    <Card className={cn('w-full', post.photoUrl && 'pt-0')}>
      {post.photoUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <Image
            src={post.photoUrl || ''}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={post.userPhotoUrl || undefined}
            alt={post.userDisplayName}
          />
          <AvatarFallback>{getInitials(post.userDisplayName)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col">
          <h3 className="text-foreground text-base font-semibold">
            {post.title}
          </h3>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>{post.userDisplayName}</span>
            <span>-</span>
            <span>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        {myInfo?.id === post.userId && (
          <PostDialog post={post}>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit post</span>
            </Button>
          </PostDialog>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{0}</span>
            </Button>

            <Button size="sm" className="gap-1">
              <ThumbsDown className="h-4 w-4" />
              <span>{0}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="gap-1"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentsCount}</span>
            {showComments ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {showComments && (
          <div className="border-border w-full border-t pt-4">
            <CommentSection postId={post.id} comments={comments} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
