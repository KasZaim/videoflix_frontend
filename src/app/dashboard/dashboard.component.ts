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

  constructor(private videoService: VideoService) {}

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
}
