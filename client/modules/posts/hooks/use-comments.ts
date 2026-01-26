import PostServices from '@/modules/posts/api';
import { QUERY_KEYS } from '@/utils/query-keys';
import { useQuery } from '@tanstack/react-query';

const useComments = (postId: string, enabled?: boolean) => {
  const { data, ...rest } = useQuery({
    queryKey: [QUERY_KEYS.COMMENTS_BY_POST_ID, postId],
    queryFn: () => PostServices.getComments(postId),
    enabled,
  });

  return { comments: data ?? [], ...rest };
};

export default useComments;
