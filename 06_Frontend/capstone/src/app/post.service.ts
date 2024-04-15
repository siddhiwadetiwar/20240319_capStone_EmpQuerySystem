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

  constructor(private http: HttpClient) { }

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();
  sendData(data: any) {
    this.dataSubject.next(data);
  }

  getFilteredPosts(postType: string): Observable<any> {
    const url = `${this.baseUrl}post/filter?postType=${postType}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        this.displaySnackBar(error.error.message);
        console.error('Error fetching filtered posts:', error);
        throw new Error('Error fetching filtered posts');
      })
    );
  }


  getAllPosts(): Observable<any> {
    const url = `${this.baseUrl}post/getallpost`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        this.displaySnackBar(error.error.message);
        console.error('Error getAllPosts:', error);
        throw new Error('Error getAllPosts');
      })
    );
  }

  getAllComments(): Observable<any> {
    const url = `${this.baseUrl}comment/getallcomment`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        this.displaySnackBar(error.error.message);
        console.error('Error getAllComments:', error);
        throw new Error('Error getAllComments');
      })
    );
  }

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

  addComment(comment: any, postId: any): Observable<any> {
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

  pinComment(commentId: any): Observable<any> {
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

  upVote(postId: any, upVote: Upvote): Observable<any> {
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


  downVote(postId: any, downVote: Upvote): Observable<any> {
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