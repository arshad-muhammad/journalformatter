# Publication Formatter

A modern, dark-themed web application that formats manuscripts according to target journal requirements. Built with React Router, TypeScript, and Tailwind CSS.

## ✨ Features

- **Dark Theme UI** - Beautiful dark interface with glass morphism effects
- **Real-time Formatting** - Instant manuscript formatting with live preview
- **Custom Journal Formats** - Create and save your own journal requirements
- **Multiple Reference Styles** - Support for Vancouver, APA, Chicago, Harvard, MLA, IEEE, AMA, CSE, ACS, Nature, Science
- **Rich Font Options** - 20+ font families to choose from
- **Word/Character Count** - Real-time manuscript statistics
- **Instant Download** - Download formatted documents immediately

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd journalformatter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will automatically detect the React Router configuration

3. **Deploy**
   - Vercel will automatically build and deploy your app
   - Your app will be available at `https://your-project-name.vercel.app`

### Manual Vercel Deployment

If you prefer to deploy manually:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Link to existing project or create new
   - Confirm deployment settings
   - Wait for build and deployment

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router 7
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📁 Project Structure

```
journalformatter/
├── app/
│   ├── components/
│   │   └── PublicationFormatter.tsx    # Main component
│   ├── routes/
│   │   └── home.tsx                    # Home route
│   ├── utils/
│   │   └── docxParser.ts               # Document parsing utilities
│   ├── app.css                         # Global styles
│   └── root.tsx                        # App root
├── public/                             # Static assets
├── package.json                        # Dependencies
├── tsconfig.json                       # TypeScript config
├── vite.config.ts                      # Vite config
└── vercel.json                         # Vercel deployment config
```

## 🎨 Customization

### Adding New Journal Formats

Edit the `DEFAULT_JOURNAL_FORMATS` array in `PublicationFormatter.tsx`:

```typescript
{
  id: "custom-journal",
  name: "My Custom Journal",
  description: "Description of the journal",
  lineSpacing: 1.5,
  wordLimit: 5000,
  referenceStyle: "Vancouver",
  fontFamily: "Times New Roman",
  fontSize: 12,
  margins: { top: 1, bottom: 1, left: 1, right: 1 }
}
```

### Styling Customization

- **Colors**: Modify Tailwind classes in components
- **Animations**: Update CSS keyframes in `app.css`
- **Layout**: Adjust grid and flex layouts in components

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ using React Router and Tailwind CSS**
