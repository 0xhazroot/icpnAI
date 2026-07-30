import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export const metadata = {
  title: 'icpnAI - Tu NotebookLM Personal & Tutor ICPNA',
  description: 'Plataforma personal de IA para estudiantes del ICPNA con integración a Google Classroom, GitHub y Gemini API.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Sidebar />
        <div style={{ marginLeft: '250px', flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main style={{ padding: '0 32px 40px 32px', flexGrow: 1 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
