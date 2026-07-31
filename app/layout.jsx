import './globals.css';
import MainLayoutWrapper from '@/components/MainLayoutWrapper';

export const metadata = {
  title: 'icpnAI - Tu NotebookLM Personal & Tutor ICPNA',
  description: 'Plataforma personal de IA para estudiantes del ICPNA con integración a Google Classroom y Gemini API.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, background: '#f5f5f7' }}>
        <MainLayoutWrapper>
          {children}
        </MainLayoutWrapper>
      </body>
    </html>
  );
}
