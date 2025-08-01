import '../styles/globals.css';
import '@livekit/components-styles';
import '@livekit/components-styles/prefabs';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'OVT Meet | Plataforma oficial de reuniões da Overtime Academy',
    template: '%s',
  },
  description:
    'OVT Meet é a plataforma oficial da Overtime Academy para reuniões e avaliações por vídeo, construída com tecnologia em tempo real, segura e escalável para conectar atletas, avaliadores e franqueados.',
  twitter: {
    creator: '@ovtacademy',
    site: '@ovtacademy',
    card: 'summary_large_image',
  },
  openGraph: {
    url: 'https://overtimeacademy.com.br',
    images: [
      {
        url: 'https://meet.livekit.io/images/livekit-meet-open-graph.png',
        width: 2000,
        height: 1000,
        type: 'image/png',
      },
    ],
    siteName: 'OVT Meet',
  },
  icons: {
    icon: {
      rel: 'icon',
      url: '/favicon.ico',
    },
    apple: [
      {
        rel: 'apple-touch-icon',
        url: '/images/livekit-apple-touch.png',
        sizes: '180x180',
      },
      { rel: 'mask-icon', url: '/images/livekit-safari-pinned-tab.svg', color: '#070707' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#070707',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body data-lk-theme="default">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
