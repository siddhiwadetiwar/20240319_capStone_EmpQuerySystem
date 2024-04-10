import { User } from "./user";

export class Comments {
    postId:any;
    _id: any;
    // userId: any;
    commentContent!: any[];
    upvotesCount: any;
    downvotesCount: any;
    images!: any[];
    upvotedUsers!: any[];
    downvotedUsers!: any[];
    commentDateTime: any;
    userId!:User;
    username:any;
    userName:any;
    __v: any;
}
