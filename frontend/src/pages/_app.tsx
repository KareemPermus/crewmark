import type { AppProps } from 'next/app';
import AppLayout from '@/components/layout/AppLayout';
import '@/styles/globals.css';

// Runtime error reporter
if (typeof window !== 'undefined') {
  const reportUrl = process.env.NEXT_PUBLIC_RUNTIME_ERROR_REPORT_URL;
  const getAppId = () => {
    if (process.env.NEXT_PUBLIC_APP_ID) return process.env.NEXT_PUBLIC_APP_ID;
    const match = window.location.hostname.match(/^preview-([^.]+)/);
    return match ? match[1] : window.location.hostname;
  };
  const send = (message: string, stack?: string) => {
    if (!reportUrl) return;
    try {
      fetch(reportUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: getAppId(), message, stack, url: window.location.href, user_agent: navigator.userAgent }),
      }).catch(() => {});
    } catch {}
  };
  window.onerror = (msg, _s, _l, _c, err) => { send(String(msg), err?.stack); };
  window.onunhandledrejection = (e) => { send(String(e.reason), e.reason?.stack); };
  const origError = console.error;
  console.error = (...args: any[]) => { send(args.map(String).join(' ')); origError.apply(console, args); };
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  );
}