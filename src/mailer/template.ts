// Escape the few characters that would break out of the HTML we build.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Minimal default HTML used when the caller does not provide its own `html`.
export function defaultTemplate(subject: string, text?: string): string {
  const body = escapeHtml(text || '').replace(/\n/g, '<br/>');
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;padding:32px;">
      <h1 style="margin:0 0 16px;font-size:20px;">${escapeHtml(subject)}</h1>
      <div style="font-size:14px;line-height:1.6;">${body}</div>
    </div>
  </body>
</html>`;
}
