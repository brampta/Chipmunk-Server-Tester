# Chipmunk Server Tester

A lightweight server monitoring tool that continuously tests your web server and database, alerting you with audio cues in real time. A gentle chipmunk chirp means everything is healthy; a loud alarm means something is down.

**Current version:** 1.1

## Features

- **Real-time monitoring** - polls your server every 5 seconds via AJAX
- **Audio alerts** - chirp when up, alarm when down (loud enough to wake you up)
- **Database monitoring** - optionally tests MySQL connectivity and watches the process list
- **Congestion tracking** - captures process list snapshots at scheduled intervals when queries pile up, with a visual dashboard
- **Multi-server support** - monitor up to 10 servers with unique IDs (0-9)
- **CSV export** - download congestion event data for analysis
- **Persistent events** - congestion data stored in localStorage and survives page refreshes

## Requirements

- PHP 5.7+ with the MySQLi extension
- Apache with `.htaccess` support
- MySQL/MariaDB (optional, for database monitoring)
- A modern browser (Chrome, Firefox, Safari, Edge)

## Installation

1. Drop the `chipmunk` folder into any directory served by your web server.
2. Copy `settings.sample.php` to `settings.php`.
3. Open `settings.php` and configure your settings (see below).
4. Navigate to the folder in a browser (e.g. `https://yoursite.com/chipmunk/`).

No build step or package manager required - files are served directly.

## Configuration

Edit `settings.php` to customise behaviour:

| Setting | Description |
|---------|-------------|
| `$serverID` | Unique identifier for this server (0-9) |
| `$test_DB` | Enable database testing (`1`) or web-only mode (`0`) |
| `$db_host` | MySQL host |
| `$db_username` | MySQL username |
| `$db_password` | MySQL password |
| `$max_items_in_processlist` | Alert when the process list exceeds this count |
| `$alarm_after_how_many_bad_connections` | Consecutive failures before sounding the alarm |
| `URL_BASE` | URL path to the tester |
| `MAIL_SENDING_METHOD` | `'custom'`, `'php'`, or `'sendgrid'` |
| `CUSTOM_MAILER_PATH` | Path to a custom mailer script |

By default (without editing `settings.php`) the tester will only monitor your web server, which requires no configuration.

## Project Structure

```
chipmunk-dev/
├── index.php              # Main entry point
├── scripts.js             # Core monitoring logic
├── css.css                # Dark-themed styles
├── settings.php           # Your local config (git-ignored)
├── settings.sample.php    # Config template
├── xmltest.php            # DB test endpoint
├── xmltest.xml            # Static XML for web-only testing
├── include/
│   ├── init.php           # Loads settings
│   └── .htaccess
└── sounds/                # MP3 audio files for alerts
```

## Tech Stack

- **Backend:** PHP, MySQL (MySQLi)
- **Frontend:** Vanilla JavaScript, jQuery 3.6, jQuery UI 1.13
- **No build tools** - pure HTML/CSS/JS served by Apache

## Changelog

### 1.1
- Congestion event tracking dashboard - captures process list snapshots at scheduled intervals when queries pile up
- Congestion events persist in localStorage across page refreshes
- CSV export for congestion event data
- Auto-trims stored events when storage quota is exceeded

### 1.02
- Reuse audio elements instead of creating new ones each beep (memory optimisation)
- Darker colour scheme

### 1.01
- Added database monitoring and process list alerts
- Switched audio prompts from French to English

## License

Developed by [intercode.ca](https://intercode.ca)
