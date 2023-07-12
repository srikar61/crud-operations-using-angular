import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private baseUrl = 'http://localhost:3000/data';

  constructor(private http: HttpClient) { }

  getRecords() {
    return this.http.get<any[]>(this.baseUrl);
  }

  createRecord(name: string, email: string) {
    const record = { name, email };
    return this.http.post(this.baseUrl, record);
  }

  updateRecord(id: number, name: string, email: string) {
    const record = { id, name, email };
    return this.http.put(`${this.baseUrl}/${id}`, record);
  }

  deleteRecord(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
