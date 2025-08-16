import * as React from 'react';

type UseResumeDownloaderOptions = {
  /** Actual file name inside /public (relative to the web root) */
  fileName?: string;
  /** Suggested file name for the user's computer */
  downloadName?: string;
  /** Base path if you keep it in a subfolder under /public (default: "/") */
  basePath?: string;
  /** aria-label for the anchor/button */
  ariaLabel?: string;
};

export function useResumeDownloader(options: UseResumeDownloaderOptions = {}) {
  const {
    fileName = 'Sahrul Ramdan - Full-Stack Developer - CV Latest.pdf',
    downloadName = 'Sahrul Ramdan - Full-Stack Developer - CV.pdf',
    basePath = '/',
    ariaLabel = 'Download Sahrul Ramdan Resume',
  } = options;

  // Build a safe href for files in /public
  const href = React.useMemo(() => {
    const base = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    return `${base}/${encodeURIComponent(fileName)}`;
  }, [fileName, basePath]);

  // Programmatic fallback (or for places where <a download> isn't convenient)
  const download = React.useCallback(async () => {
    try {
      const res = await fetch(href, { cache: 'force-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Resume download failed, falling back to navigation:', err);
      window.location.assign(href);
    }
  }, [href, downloadName]);

  // Convenience props for using <a> inside a Button (preferred)
  const anchorProps = React.useMemo(
    () =>
      ({
        href,
        download: downloadName,
        'aria-label': ariaLabel,
      }) as const,
    [href, downloadName, ariaLabel],
  );

  return { href, downloadName, download, anchorProps };
}
