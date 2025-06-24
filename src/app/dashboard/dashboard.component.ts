import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { VideoService } from './../service/video.service';
import { Video } from './../interfaces/video.interface';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VideoSlideshowComponent } from "../video-slideshow/video-slideshow.component";
import { FooterComponent } from "../footer/footer.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    HttpClientModule,
    VideoSlideshowComponent,
    FooterComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  videos: Video[] = [];
  currentVideoIndex: number = 0;
  private videoEndSubscription: any;

  constructor(
    private videoService: VideoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.videoService.getVideos().subscribe((data) => {
      this.videos = data;
      if (this.videos.length > 0) {
        this.setupVideoEndListener();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.videoEndSubscription) {
      this.videoEndSubscription.unsubscribe();
    }
  }

  private setupVideoEndListener(): void {
    const videoElement = document.querySelector('.video-preview') as HTMLVideoElement;
    if (videoElement) {
      videoElement.addEventListener('ended', () => {
        this.playNextVideo();
      });
    }
  }

  playNextVideo(): void {
    if (this.videos.length > 0) {
      this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length;
      setTimeout(() => {
        const videoElement = document.querySelector('.video-preview') as HTMLVideoElement;
        if (videoElement) {
          videoElement.play().catch(error => {
            console.error('Error playing next video:', error);
          });
        }
      }, 0);
    }
  }

  get currentVideo(): Video | null {
    return this.videos.length > 0 ? this.videos[this.currentVideoIndex] : null;
  }

  onVideoError(event: any): void {
    console.error('Video loading error:', event);
  }

  onVideoLoaded(event: any): void {
    console.log('Video loaded successfully:', event);
    const videoElement = event.target as HTMLVideoElement;
    videoElement.play().catch(error => {
      console.error('Error playing video:', error);
    });
  }

  playVideo(): void {
    if (!this.currentVideo) {
      console.error('Kein Video zum Abspielen verfügbar');
      return;
    }
    
    const videoUrl = this.getVideoUrl(this.currentVideo);
    
    if (!videoUrl) {
      console.error('Kein Video-URL für dieses Video gefunden:', this.currentVideo);
      alert('Dieses Video kann nicht abgespielt werden, da keine URL gefunden wurde.');
      return;
    }
    
    console.log('Navigiere zu Video URL:', videoUrl);
    
    // Videoqualitäten für den Player vorbereiten
    const videoQualities = {
      video_1080p: this.currentVideo.video_1080p,
      video_720p: this.currentVideo.video_720p,
      video_480p: this.currentVideo.video_480p,
      video_path: this.currentVideo.video_path
    };
    
    this.router.navigate(['/video-player'], { 
      queryParams: { 
        url: videoUrl,
        title: this.currentVideo.title,
        qualities: JSON.stringify(videoQualities)
      }
    });
  }

  private getVideoUrl(video: Video): string {
    const urlProperties = ['video_path', 'video_1080p', 'video_720p', 'video_480p', 'url'];
    
    for (const prop of urlProperties) {
      const value = video[prop as keyof Video];
      if (value) {
        return typeof value === 'string' && value.startsWith('http') 
          ? value 
          : `${this.videoService.apiBaseUrl}${value}`;
      }
    }
    
    return '';
  }
}
