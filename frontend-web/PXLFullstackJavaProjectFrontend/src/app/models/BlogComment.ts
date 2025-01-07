export class BlogComment {
  constructor(
    public id: number,
    public postId: number,
    public userName: string,
    public content: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static fromData(data: any): BlogComment {
    return new BlogComment(
      data.id,
      data.postId,
      data.userName,
      data.content,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }
}
