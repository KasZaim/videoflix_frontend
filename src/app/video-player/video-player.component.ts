import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MatIconModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>;
  
  videoUrl: string = '';
  videoTitle: string = '';
  isPlaying: boolean = false;
  isMuted: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 1;
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.videoUrl = params['url'] || '';
      this.videoTitle = params['title'] || '';
      console.log('Video URL:', this.videoUrl);
      
      if (!this.videoUrl) {
        console.error('Keine Video-URL in den Query-Parametern gefunden');
      }
    });

    // Initial die Lautstärke setzen
    setTimeout(() => {
      const volumeSlider = document.querySelector('.volume-slider') as HTMLInputElement;
      if (volumeSlider) {
        volumeSlider.style.setProperty('--volume-percent', `${this.volume * 100}%`);
      }
    }, 100);
  }

  togglePlay(): void {
    const video = this.videoPlayerRef?.nativeElement;
    if (!video) return;
    
    if (video.paused) {
      video.play().catch(err => {
        console.error('Fehler beim Abspielen des Videos:', err);
        alert('Fehler beim Abspielen des Videos. Bitte überprüfen Sie die URL oder das Videoformat.');
      });
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  toggleMute(): void {
    const video = this.videoPlayerRef.nativeElement;
    video.muted = !video.muted;
    this.isMuted = video.muted;
    
    // Aktualisiere den Slider
    const volumeSlider = document.querySelector('.volume-slider') as HTMLInputElement;
    if (volumeSlider) {
      const volumePercent = this.isMuted ? 0 : this.volume * 100;
      volumeSlider.style.setProperty('--volume-percent', `${volumePercent}%`);
    }
  }

  setVolume(event: Event): void {
    const input = event.target as HTMLInputElement;
    const video = this.videoPlayerRef.nativeElement;
    this.volume = Number(input.value);
    video.volume = this.volume;
    
    // Aktualisiere die CSS-Variable für die Lautstärkefarbe
    const volumePercent = this.volume * 100;
    input.style.setProperty('--volume-percent', `${volumePercent}%`);
  }

  seekVideo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const video = this.videoPlayerRef.nativeElement;
    const seekTime = Number(input.value);
    video.currentTime = seekTime;
  }

  onTimeUpdate(): void {
    const video = this.videoPlayerRef.nativeElement;
    this.currentTime = video.currentTime;
    this.duration = video.duration;
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  toggleFullScreen(): void {
    const video = this.videoPlayerRef.nativeElement;
    
    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(err => {
        console.error(`Fehler beim Umschalten in den Vollbildmodus: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  onVideoError(event: Event): void {
    console.error('Video-Ladefehler', event);
  }

  skipBackward(): void {
    const video = this.videoPlayerRef?.nativeElement;
    if (!video) return;
    
    // 10 Sekunden zurückspringen
    video.currentTime = Math.max(0, video.currentTime - 10);
  }

  skipForward(): void {
    const video = this.videoPlayerRef?.nativeElement;
    if (!video) return;
    
    // 10 Sekunden vorspringen
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  }

  toggleMenu(): void {
    // Hier kann später Funktionalität für das Menü hinzugefügt werden
    console.log('Menü wurde geklickt');
    alert('Menü-Funktionalität wird in einer zukünftigen Version implementiert');
  }

  goBack(): void {
    this.location.back();
  }
}
