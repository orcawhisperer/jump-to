# JumpTo - Universal Shortlink Navigator

JumpTo is a browser extension that enables quick navigation through custom shortlinks, working seamlessly across different browsers.

![JumpTo Demo](demo.mp4)

## Features

### Two Ways to Use

#### 1. Chrome/Brave Browsers
```
1. Type 'go' in address bar
2. Press Tab or Space
3. Enter your shortcut (e.g., 'gh')
```

#### 2. Arc and Other Browsers
```
Simply type: go/shortcut
Example: go/gh
```

### Core Features
- Custom shortlinks for any URL
- Smart URL suggestions
- Dark mode support
- Usage statistics
- Import/export shortcuts
- Recent shortcuts history
- Keyboard shortcuts support

## Installation

### From Chrome Web Store
1. Visit [JumpTo on Chrome Web Store](#)
2. Click "Add to Chrome"
3. Confirm the installation

### Local Development
```bash
# Clone the repository
git clone https://github.com/orcawhisperer/jump-to.git

# Navigate to project directory
cd jumpto

# Install dependencies
npm install

# Build for development
npm run dev

# Build for production
npm run build
```

### Loading in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder from the project

## Usage

### Creating Shortcuts
1. Click the JumpTo icon in your browser
2. Enter a shortcut name (e.g., 'gh')
3. Enter the URL (e.g., 'github.com')
4. Click "Add Shortcut"

### Example Shortcuts
```
go/gh → github.com
go/gm → gmail.com
go/cal → calendar.google.com
go/docs → docs.google.com
```

### Keyboard Shortcuts
- `Ctrl/Cmd + Shift + K`: Open JumpTo popup
- `Ctrl/Cmd + K`: Focus search in popup
- `Ctrl/Cmd + N`: Add new shortcut

## Development

### Project Structure
```
jumpto/
├── src/
│   ├── assets/
│   │   └── icons/
│   ├── components/
│   │   ├── layout/
│   │   ├── tabs/
│   │   └── ui/
│   ├── hooks/
│   ├── services/
│   ├── pages/
│   │   ├── popup/
│   │   └── options/
│   ├── background/
│   └── content/
├── webpack/
├── dist/
└── package.json
```

### Built With
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Chrome Extensions API

### Available Scripts
```bash
# Development build with watch mode
npm run dev

# Production build
npm run build

# Lint code
npm run lint

# Type check
npm run typecheck
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [lucide-react](https://lucide.dev/) for the icons

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.