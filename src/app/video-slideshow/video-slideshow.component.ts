import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '../service/video.service';
import { Video } from '../interfaces/video.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-slideshow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-slideshow.component.html',
  styleUrls: ['./video-slideshow.component.scss']
})
export class VideoSlideshowComponent implements OnInit {
  videos: Video[] = [];
  newVideos: Video[] = [];
  documentaryVideos: Video[] = [];
  dramaVideos: Video[] = [];
  private apiBaseUrl = 'http://localhost:8000';

  constructor(private videoService: VideoService, private router: Router) { }

  ngOnInit(): void {
    this.videoService.getVideos().subscribe({
      next: (videos) => {
        this.videos = videos;
        this.categorizeVideos();
      },
      error: (error) => {
        console.error('Error fetching videos:', error);
      }
    });
  }

  getFullThumbnailUrl(thumbnailPath: string): string {
    if (!thumbnailPath) {
      console.log('No thumbnail path provided');
      return 'assets/placeholder-image.jpg';
    }
    if (thumbnailPath.startsWith('http')) return thumbnailPath;
    return `${this.apiBaseUrl}${thumbnailPath}`;
  }

  categorizeVideos(): void {
    if (!this.videos || this.videos.length === 0) {
      console.log('No videos received from backend');
      return;
    }

    this.videos.forEach(video => {
      video.thumbnail = this.getFullThumbnailUrl(video.thumbnail);
      
      if (!video.category) {
        console.log(`No category for video ${video.id} - ${video.title}`);
        // Setze eine Standard-Kategorie basierend auf der ID oder anderen Kriterien
        video.category = 'drama'; // Temporäre Lösung
      }

      if (video.category.toLowerCase().includes('documentary')) {
        this.documentaryVideos.push(video);
      } else if (video.category.toLowerCase().includes('drama')) {
        this.dramaVideos.push(video);
      }
      
      if (this.newVideos.length < 2) {
        this.newVideos.push(video);
      }
    });

 
  }

  playVideo(video: Video): void {
    console.log('Play video:', video);
    
    // Überprüfen, welche Videoqualität verfügbar ist
    let videoUrl = '';
    
    if (video.video_path) {
      videoUrl = `${this.apiBaseUrl}${video.video_path}`;
    } else if (video.video_1080p) {
      videoUrl = video.video_1080p.startsWith('http') ? video.video_1080p : `${this.apiBaseUrl}${video.video_1080p}`;
    } else if (video.video_720p) {
      videoUrl = video.video_720p.startsWith('http') ? video.video_720p : `${this.apiBaseUrl}${video.video_720p}`;
    } else if (video.video_480p) {
      videoUrl = video.video_480p.startsWith('http') ? video.video_480p : `${this.apiBaseUrl}${video.video_480p}`;
    } else if (video.url) {
      videoUrl = video.url.startsWith('http') ? video.url : `${this.apiBaseUrl}${video.url}`;
    }
    
    if (!videoUrl) {
      console.error('Kein Video-URL für dieses Video gefunden:', video);
      alert('Dieses Video kann nicht abgespielt werden, da keine URL gefunden wurde.');
      return;
    }
    
    console.log('Navigiere zu Video URL:', videoUrl);
    
    this.router.navigate(['/video-player'], { 
      queryParams: { 
        url: videoUrl,
        title: video.title
      }
    });
  }
}
