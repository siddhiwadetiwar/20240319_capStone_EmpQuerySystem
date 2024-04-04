import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../../post.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PostsResponse } from '../../models/posts-response';
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
  public Editor = ClassicEditor;
  postResponse: PostsResponse = new PostsResponse();
  receivedData: any;

  // @Output() childFunctionTriggered: EventEmitter<any> = new EventEmitter();

  // triggerChildFunction() {
  //   this.childFunctionTriggered.emit();
  // }
  @ViewChild('signInBtn') myButton!: ElementRef;
  constructor(httpclient: HttpClient, private postService: PostService, private route: Router) {

  }
  ngOnInit(): void {
    this.postService.getAllPosts().subscribe(res => {
      this.postResponse = res
      console.log(res)
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

    if (this.route.url == 'homePage') {
      console.log("****")
    }
  }

  comment = new FormControl();

  postControl = new FormControl();
  selectedOption: string = '';

  postMessage: string = '';

  checkboxClicked(option: string) {
    this.selectedOption = option;
  }

  addPost() {
    console.log(this.postMessage)
    let isAnyRadioSelected = this.selectedOption !== '';
    let isPostTyped = this.postMessage !== '';
    if (isAnyRadioSelected) {
      if (isPostTyped) {
        let postObj = {
          "postContent": this.postMessage,
          "postType": this.selectedOption,
          "images": []
        }
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

  getPostbyType(postType: any) {
    console.log(postType);
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


  addcomment(postId: any) {
    if (this.comment.valid) {
      this.postService.addComment(this.comment.value, postId).subscribe(res => {
        this.displaySnackBar("Comment added successfully");
        location.reload();
      })
    } else {
      this.displaySnackBar("Comment is required");
    }
  }
  upVote(userid: any, postId: any) {
    let req = {
      "userId": userid
    }
    this.postService.upVote(postId, req).subscribe(data => {
      location.reload();
    })
  }
  downVote(userid: any, postId: any) {
    let req = {
      "userId": userid
    }
    this.postService.downVote(postId, req).subscribe(data => {
      console.log(data)
      location.reload();
    })
  }
  username = new FormControl();
  getPostsByUsername(username: any) {
    this.postService.filterPostByUser(username).subscribe(data => {
      this.postResponse=data;
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