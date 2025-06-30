import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FocusUp - Gestor de Tareas con IA y Pomodoro',
  description: 'Organiza tu trabajo con inteligencia artificial y la técnica Pomodoro. Divide tareas complejas en pasos manejables y maximiza tu productividad.',
  keywords: 'productividad, pomodoro, tareas, IA, gestión, enfoque',
  authors: [{ name: 'FocusUp Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
} 