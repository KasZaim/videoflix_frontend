// src/app/services/video.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Video } from '../interfaces/video.interface';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  // Passe die Basis-URL entsprechend Deiner Backend-Konfiguration an
  private apiBaseUrl = 'http://localhost:8000'; 

  constructor(private http: HttpClient) {}

  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiBaseUrl}/api/videos/`);
  }
}
