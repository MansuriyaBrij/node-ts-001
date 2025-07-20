export const PostResource = (post: any) => {
  if (!post) return null;

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    published: post.published,
    authorId: post.authorId,
    tags: post.tags,
    createdAt: post.createdAt,
    // Add more fields as needed
  };
};

export const PostResourceList = (posts: any[]) => {
  return posts.map(post => PostResource(post));
};