import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../../post.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PostsResponse } from '../../models/posts-response';
import { CommentsResponse } from '../../models/comments-response';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-homepage-maincontent',
  standalone: true,
  imports: [FormsModule, HttpClientModule, ReactiveFormsModule, CommonModule, RouterModule, CKEditorModule],
  providers: [PostService],
  templateUrl: './homepage-maincontent.component.html',
  styleUrl: './homepage-maincontent.component.css'
})
export class HomepageMaincontentComponent implements OnInit {
  // Using CKEditor Classic build
  public Editor = ClassicEditor;
  // Object to hold posts response
  postResponse: PostsResponse = new PostsResponse();
  // Object to hold comments response
  commentResponse: CommentsResponse = new CommentsResponse();
  receivedData: any;

  // Default selected option for post type
  selectedOption: string = "educational"; 

  // Reference to signInBtn element
  @ViewChild('signInBtn') myButton!: ElementRef;
  constructor(httpclient: HttpClient, private postService: PostService, private route: Router) {

  }

  ngOnInit(): void {
    // Fetch all posts and format their postDateTime
    this.postService.getAllPosts().subscribe(res => {
      this.postResponse = res
      console.log(this.postResponse);

      this.postResponse.posts.forEach(data => {
        const date = new Date(data.postDateTime);
        // Get the month, day, and year
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();
        // Format the date as "Month Day, Year"
        data.postDateTime = `${month} ${day} ${year}`;
      })
    })

    // Fetch all comments and format their commentDateTime
    this.postService.getAllComments().subscribe(res => {
      this.commentResponse = res;
      console.log(this.commentResponse.comments);

      this.commentResponse.comments.forEach(data => {
        data.isPinned = false;
        const date = new Date(data.commentDateTime);
        // Get the month, day, and year
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();
        // Format the date as "Month Day, Year"
        data.commentDateTime = `${month} ${day} ${year}`;
      })
    })    

    if (this.route.url == 'homePage') {
      console.log("****")
    }
  }

  // FormControl for comment input
  comment = new FormControl();

  // FormControl for post input
  postControl = new FormControl();

  postMessage: string = '';
  commentMessage: string = '';

  // Method to handle radio button click event
  checkboxClicked(option: string) {
    this.selectedOption = option;
  }

  // Method to add a new post
  addPost() {
    console.log(this.postMessage)
    let isAnyRadioSelected = this.selectedOption !== '';
    let isPostTyped = this.postMessage !== '';
    // Validate post message and selected option
    if (isAnyRadioSelected) {
      if (isPostTyped) {
        let postObj = {
          "postContent": this.postMessage,
          "postType": this.selectedOption,
          "images": []
        }
        // Call addPost method from PostService and reload the page
        this.postService.addPost(postObj).subscribe(data => {
          console.log(data)
          location.reload();
        })
      } else {
        this.displaySnackBar("Post message is required")
      }
    } else {
      this.displaySnackBar("Please Select Post Type")
    }
  }


  /**
 * Fetches posts based on the specified post type.
 * @param {string} postType - The type of posts to fetch 
 * (e.g., "educational", "entertainment", "personal").
 * Should match the postType field in the database.
 * If not provided or invalid, defaults to fetching all posts.
 */
  getPostbyType(postType: any) {
    console.log(postType);
    // Call getFilteredPosts method from PostService
    this.postService.getFilteredPosts(postType).subscribe(data => {
      console.log(data)
      this.postResponse = data
      this.postResponse.posts.forEach(data => {
        const date = new Date(data.postDateTime);
        // Get the month, day, and year
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();
        // Format the date as "Month Day, Year"
        data.postDateTime = `${month} ${day} ${year}`;
      })
    })
  }

  /** Method to add a comment to a post
  * @param postId - The ID of the post to which the comment is being added
  */
  addComment(postId: any) {
    // Check if the comment form is valid
    if (this.comment.valid) {
      // Call the addComment method from the PostService
      this.postService.addComment(this.comment.value, postId).subscribe(res => {
        // Display a success message and reload the page after adding the comment
        this.displaySnackBar("Comment added successfully");
        location.reload();
        console.log("comment is created!!!")
      })
    } else {
      this.displaySnackBar("Comment is required");
    }
  }

  // Array to store dynamically created elements (e.g., pinned comments)
  dynamicElements: string[] = [];

  /** Method to handle pinning a comment
  * @param commentId - The ID of the comment to be pinned
  */
  pressPin(commentId:any): void {
      // Call the pinComment method from the PostService
      this.postService.pinComment(commentId).subscribe(res => {
      // Display a success message after pinning the comment
      this.displaySnackBar("Comment pinned successfully");
      // Update the pinned status of the comment in the UI
      const commentIndex = this.commentResponse.comments.findIndex(c => c._id === commentId);
      if (commentIndex !== -1) {
        this.commentResponse.comments[commentIndex].isPinned = !this.commentResponse.comments[commentIndex].isPinned;
      }
      
      // Manage the dynamicElements array based on pinning/unpinning
      const exist = this.dynamicElements.findIndex(el => {return commentId===el} )
      
      if (exist === -1) {
      this.dynamicElements.push(commentId);
      
      }
      else{
        this.dynamicElements.splice(exist,1);
      }
      
    })

  }
  
  /** Method to handle upvoting a post
  * @param userId - The ID of the user performing the upvote
  * @param postId - The ID of the post to be upvoted
  */
  upVote(userid: any, postId: any) {
    // Create the request object with the user ID
    let req = {
      "userId": userid
    }
    // Call the upVote method from the PostService
    this.postService.upVote(postId, req).subscribe(data => {
      // Reload the page after upvoting
      location.reload();
    })
  }

  /** Method to handle downvoting a post
  * @param userId - The ID of the user performing the downvote
  * @param postId - The ID of the post to be downvoted
  */
  downVote(userid: any, postId: any) {
    // Create the request object with the user ID
    let req = {
      "userId": userid
    }
    // Call the downVote method from the PostService
    this.postService.downVote(postId, req).subscribe(data => {
      console.log(data)
      // Reload the page after downvoting
      location.reload();
    })
  }

  username = new FormControl();

  
  /** Method to fetch posts by username
  * @param username - The username of the user whose posts are being fetched
  */
  getPostsByUsername(username: any) {
    // Call the filterPostByUser method from the PostService
    this.postService.filterPostByUser(username).subscribe(data => {
      // Update postResponse with filtered posts
      this.postResponse=data;
      // Format postDateTime for each post in the response
      this.postResponse.posts.forEach(data => {
        const date = new Date(data.postDateTime);
        // Get the month, day, and year
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();
        // Format the date as "Month Day, Year"
        data.postDateTime = `${month} ${day} ${year}`;
      })
      console.log(data);
    })

  }


  /** Method to display a snackbar message
  * @param msg - The message to be displayed in the snackbar
  */
  displaySnackBar(msg: any) {
    const snackBar = document.getElementById("snackBar");
    if (snackBar != null) {
      snackBar.innerHTML = msg
      snackBar.style.display = "block";
    }
    setTimeout(function () {
      if (snackBar != null) {
        snackBar.style.display = "none";
      }
    }, 3000);
  }

}