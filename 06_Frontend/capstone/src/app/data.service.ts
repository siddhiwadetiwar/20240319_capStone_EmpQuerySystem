import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://only-credit-backend.vercel.app/post/filter?postType=educational'; // Replace 'your-api-url' with your actual API URL

  constructor(private http: HttpClient) { }

  
  fetchData(){
    // Make HTTP GET request to fetch data from the API
    const url = `${this.apiUrl}/post/filter`; 
    return this.http.get(url);
  }
  /**
   * Fetches filtered data from the API based on the filter type.
   * @param filterType The type of filter to apply.
   */
  getFilteredData(filterType: string){
    const url = `${this.apiUrl}/filtered-endpoint?filterType=${filterType}`;
    return this.http.get(url);
  }
}
