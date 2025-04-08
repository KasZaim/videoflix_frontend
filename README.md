# Videoflix - Video Streaming Platform

Videoflix ist eine moderne Video-Streaming-Plattform, die mit Angular entwickelt wurde. Die Anwendung bietet eine benutzerfreundliche Oberfläche zum Ansehen von Videos mit verschiedenen Qualitätsstufen und einer responsiven Benutzeroberfläche.

## Features

- 🎥 Video-Streaming mit verschiedenen Qualitätsstufen (1080p, 720p, 480p)
- 🔐 Benutzerauthentifizierung mit Login/Logout-Funktionalität
- 📱 Responsive Design für optimale Nutzung auf allen Geräten
- 🎨 Moderne UI mit Material Design
- 🔒 Geschützte Routen mit Auth Guard
- 📝 Benutzerfreundliche Fehlermeldungen und Benachrichtigungen

## Technologien

- Angular 17
- TypeScript
- Angular Material
- RxJS
- ngx-toastr für Benachrichtigungen
- SCSS für Styling

## Installation

1. Stelle sicher, dass Node.js und npm installiert sind
2. Klone das Repository:
   ```bash
   git clone https://github.com/KasZaim/videoflix_frontend.git
   ```
3. Navigiere in das Projektverzeichnis:
   ```bash
   cd videoflix
   ```
4. Installiere die Abhängigkeiten:
   ```bash
   npm install
   ```
5. Starte die Entwicklungsumgebung:
   ```bash
   ng serve
   ```
6. Öffne deinen Browser und navigiere zu `http://localhost:4200`

## Projektstruktur

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── header/
│   │   ├── footer/
│   │   ├── video-player/
│   │   └── video-slideshow/
│   ├── services/
│   │   └── video.service.ts
│   ├── interfaces/
│   │   └── video.interface.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   └── environments/
├── assets/
│   └── img/
└── styles/
```

## API-Integration

Die Anwendung kommuniziert mit einem Backend-Server über HTTP-Anfragen. Die API-Basis-URL wird in der Umgebungskonfiguration definiert.

### Endpunkte

- `/api/login/` - Benutzerauthentifizierung
- `/api/videos/` - Video-Liste abrufen
- Weitere API-Endpunkte für Video-Streaming

## Umgebungsvariablen

Erstelle eine `.env`-Datei im Root-Verzeichnis mit folgenden Variablen:

```env
API_BASE_URL=deine_api_url
```

## Entwicklung

## Deployment

1. Build der Anwendung:
   ```bash
   ng build --prod
   ```
2. Die generierten Dateien befinden sich im `dist/`-Verzeichnis
3. Deploye den Inhalt des `dist/`-Verzeichnisses auf deinem Webserver

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

## Autor

Kaser Mahmood
