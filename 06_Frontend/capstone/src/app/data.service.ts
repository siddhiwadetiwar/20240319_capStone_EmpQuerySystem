import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://only-credit-backend.vercel.app/post/filter?postType=educational'; // Replace 'your-api-url' with your actual API URL

  constructor(private http: HttpClient) { }

  fetchData(): Observable<any> {
    // Make HTTP GET request to fetch data from the API
    const url = `${this.apiUrl}/post/filter`; // Replace 'endpoint' with the actual endpoint on your API
    return this.http.get(url);
  }
  getFilteredData(filterType: string): Observable<any> {
    const url = `${this.apiUrl}/filtered-endpoint?filterType=${filterType}`;
    return this.http.get(url);
  }
}
