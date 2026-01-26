import PostServices from '@/modules/posts/api';
import { QUERY_KEYS } from '@/utils/query-keys';
import { useQuery } from '@tanstack/react-query';
import { GetRepliesProps } from '../types';

type Props = GetRepliesProps & {
  enabled?: boolean;
};

const useReplies = ({ commentId, postId, enabled }: Props) => {
  const { data, ...rest } = useQuery({
    queryKey: [QUERY_KEYS.REPLIES_BY_COMMENT_ID, postId, commentId],
    queryFn: () => PostServices.getReplies({ commentId, postId }),
    enabled,
  });

  return { replies: data ?? [], ...rest };
};

export default useReplies;
