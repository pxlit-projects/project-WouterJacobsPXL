export class BlogComment {
  constructor(
    public id: number,
    public postId: number,
    public userName: string,
    public content: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {
  }
}
