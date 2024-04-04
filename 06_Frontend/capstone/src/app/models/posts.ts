import { User } from "./user";

export class Posts {
    _id: any;
    // userId: any;
    postContent!: any[];
    postType: any;
    upvotesCount: any;
    downvotesCount: any;
    images!: any[];
    comments!: any[];
    upvotedUsers!: any[];
    downvotedUsers!: any[];
    postDateTime: any;
    userId!:User;
    username:any;
    __v: any;
}
