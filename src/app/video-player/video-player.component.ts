import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';

interface VideoQuality {
  label: string;
  url: string;
  resolution: string;
}

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MatIconModule, MatMenuModule, MatButtonModule],
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
  
  // Videoqualitäten
  videoQualities: VideoQuality[] = [];
  currentQuality: VideoQuality | null = null;
  showQualityMenu: boolean = false;
  
  private isMobile: boolean = false;
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private location: Location,
    private toastr: ToastrService
  ) {
    // Check if screen width is less than 768px
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.videoUrl = params['url'] || '';
      this.videoTitle = params['title'] || '';
      
      // Videoqualitäten aus den Parametern extrahieren
      if (params['qualities']) {
        try {
          const qualities = JSON.parse(params['qualities']);
          this.videoQualities = [
            { label: 'Auto', url: this.videoUrl, resolution: 'Auto' },
            { label: '1080p', url: qualities.video_1080p || '', resolution: '1080p' },
            { label: '720p', url: qualities.video_720p || '', resolution: '720p' },
            { label: '480p', url: qualities.video_480p || '', resolution: '480p' }
          ].filter(quality => quality.url); // Nur Qualitäten mit URL behalten
          
          // Standardqualität setzen
          this.currentQuality = this.videoQualities[0];
        } catch (e) {
          console.error('Fehler beim Parsen der Videoqualitäten:', e);
        }
      } else {
        // Fallback, wenn keine Qualitäten übergeben wurden
        this.videoQualities = [{ label: 'Standard', url: this.videoUrl, resolution: 'Standard' }];
        this.currentQuality = this.videoQualities[0];
      }
      
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
        this.toastr.error('Fehler beim Abspielen des Videos. Bitte überprüfen Sie die URL oder das Videoformat.', 'Fehler');
      });
      this.isPlaying = true;
      
      // Automatically switch to fullscreen in landscape mode on mobile
      if (this.isMobile) {
        this.requestFullscreenLandscape();
      }
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
    const video = this.videoPlayerRef?.nativeElement;
    if (!video) return;
    
    const seekTime = Number(input.value);
    video.currentTime = seekTime;
    this.currentTime = seekTime;
    
    // Aktualisiere die CSS-Variable für den Fortschrittsbalken
    const progressPercent = (this.currentTime / this.duration) * 100;
    input.style.setProperty('--progress-percent', `${progressPercent}%`);
  }

  onTimeUpdate(): void {
    const video = this.videoPlayerRef?.nativeElement;
    if (!video) return;
    
    this.currentTime = video.currentTime;
    this.duration = video.duration;
    
    // Aktualisiere die CSS-Variable für den Fortschrittsbalken
    const progressPercent = (this.currentTime / this.duration) * 100;
    const progressBar = document.querySelector('.progress-bar') as HTMLInputElement;
    if (progressBar) {
      progressBar.style.setProperty('--progress-percent', `${progressPercent}%`);
    }
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
    this.toastr.error('Fehler beim Laden des Videos. Bitte überprüfen Sie Ihre Internetverbindung.', 'Fehler');
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
    this.toastr.info('Menü-Funktionalität wird in einer zukünftigen Version implementiert', 'Info');
  }

  toggleQualityMenu(): void {
    this.showQualityMenu = !this.showQualityMenu;
  }

  changeQuality(quality: VideoQuality): void {
    if (!quality || !quality.url) return;
    
    const video = this.videoPlayerRef?.nativeElement;
    if (!video) return;
    
    // Aktuelle Zeit speichern
    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;
    
    // Neue Qualität setzen
    this.currentQuality = quality;
    this.videoUrl = quality.url;
    
    // Video neu laden
    video.load();
    
    // Zur gespeicherten Zeit springen und ggf. wieder abspielen
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = currentTime;
      if (wasPlaying) {
        video.play().catch(err => {
          console.error('Fehler beim Abspielen des Videos nach Qualitätsänderung:', err);
        });
      }
    }, { once: true });
    
    this.toastr.success(`Videoqualität auf ${quality.label} geändert`, 'Qualität geändert');
    this.showQualityMenu = false;
  }

  goBack(): void {
    this.location.back();
  }

  requestFullscreenLandscape(): void {
    const video = this.videoPlayerRef?.nativeElement;
    if (!video) return;
    
    if (!document.fullscreenElement) {
      // Request fullscreen first
      video.requestFullscreen().then(() => {
        // Then try to switch to landscape orientation if possible
        try {
          // Verwende any, da TypeScript die experimentelle Screen Orientation API möglicherweise nicht vollständig kennt
          const screenOrientation = screen.orientation as any;
          if (screenOrientation && typeof screenOrientation.lock === 'function') {
            screenOrientation.lock('landscape').catch((err: Error) => {
              console.warn('Landscape orientation lock failed:', err);
            });
          }
        } catch (err) {
          console.warn('Screen Orientation API nicht unterstützt:', err);
        }
      }).catch(err => {
        console.error(`Fehler beim Umschalten in den Vollbildmodus: ${err.message}`);
      });
    }
  }
}
