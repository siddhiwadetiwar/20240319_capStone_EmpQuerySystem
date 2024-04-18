import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Upvote } from './models/upvote';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseUrl = 'https://only-credit-backend.vercel.app/';  // Replace with your actual API URL

  // Subject and Observable for sharing data across components
  constructor(private http: HttpClient) { }

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  /**
   * Method to send data to subscribers
   * @param data The data to be sent to subscribers
   */
  sendData(data: any) {
    this.dataSubject.next(data);
  }

  /**
   * Method to fetch filtered posts based on postType
   * @param postType The type of posts to filter
   */
  getFilteredPosts(postType: string){
    const url = `${this.baseUrl}post/filter?postType=${postType}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        this.displaySnackBar(error.error.message);
        console.error('Error fetching filtered posts:', error);
        throw new Error('Error fetching filtered posts');
      })
    );
  }

  /**
   * Method to fetch all posts
   * @returns An Observable with all posts
   */
  getAllPosts(){
    const url = `${this.baseUrl}post/getallpost`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        this.displaySnackBar(error.error.message);
        console.error('Error getAllPosts:', error);
        throw new Error('Error getAllPosts');
      })
    );
  }

  /**
   * Method to fetch all comments
   * @returns An Observable with all comments
   */
  getAllComments(){
    const url = `${this.baseUrl}comment/getallcomment`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        this.displaySnackBar(error.error.message);
        console.error('Error getAllComments:', error);
        throw new Error('Error getAllComments');
      })
    );
  }

  /**
   * Method to add a new post
   * @param postObj The object containing post data
   */
  addPost(postObj: any) {
    const url = `${this.baseUrl}post/addpost`
    let authToken = sessionStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + authToken
    });
    return this.http.post(url, postObj, { headers: headers }).pipe(
      catchError(error => {
        this.displaySnackBar(error.error.message);
        console.error('Error addPost', error);
        throw new Error('Error addPost');
      })
    );;
  }

  /**
   * Method to add a new comment to a post
   * @param comment The comment content
   * @param postId The ID of the post to add the comment to
   */
  addComment(comment: any, postId: any){
    const url = `${this.baseUrl}comment/addcomment/${postId}`
    let authToken = sessionStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + authToken
    });
    let commentObj = {
      "commentContent": comment
    }
    // Make HTTP request with headers
    return this.http.post(url, commentObj, { headers: headers }).pipe(
      catchError(error => {
        this.displaySnackBar(error.error.message);
        console.error('Error addComment', error);
        throw new Error('Error addComment');
      })
    );;
  }

  /**
   * Method to pin/unpin a comment
   * @param commentId The ID of the comment to pin/unpin
   * @returns An Observable after pinning/unpinning the comment
   */
  pinComment(commentId: any){
    const url = `${this.baseUrl}comment/pincomment/${commentId}`
    let authToken = sessionStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + authToken
    });
    console.log(commentId);
    console.log(url);
    let commentObj = {
      "commentId": commentId,
      // "isPinned": isPinned
    }
    // Make HTTP request with headers
    return this.http.post(url, commentObj, { headers: headers }).pipe(
      catchError(error => {
        this.displaySnackBar(error.error.message);
        console.error('Error pinComment', error);
        throw new Error('Error pinComment');
      })
    );;
  }

  /**
   * Method to upvote a post
   * @param postId The ID of the post to upvote
   * @param upVote An object containing upvote data
   */
  upVote(postId: any, upVote: Upvote){
    let authToken = sessionStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + authToken
    });
    return this.http.post<any>(`${this.baseUrl}post/upvote/${postId}`, upVote, { headers: headers }).pipe(
      catchError(error => {
        this.displaySnackBar(error.error.message);
        console.error('Error upVote', error);
        throw new Error('Error upVote');
      })
    );;
  }


  /**
   * Method to downvote a post
   * @param postId The ID of the post to downvote
   * @param downVote An object containing downvote data
   */
  downVote(postId: any, downVote: Upvote){
    let authToken = sessionStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + authToken
    });
    return this.http.post<any>(`${this.baseUrl}post/downvote/${postId}`, downVote, { headers: headers }).pipe(
      catchError(error => {
        this.displaySnackBar(error.error.message);
        console.error('Error downVote', error);
        throw new Error('Error downVote');
      })
    );;
  }

  /**
   * Method to filter posts by user
   * @param userName The username to filter posts by
   */
  filterPostByUser(userName:any){
    const url = `${this.baseUrl}post/searchuser/${userName}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        this.displaySnackBar(error.error.message);
        console.error('Error filterPostByUser', error);
        throw new Error('Error filterPostByUser');
      })
    );
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