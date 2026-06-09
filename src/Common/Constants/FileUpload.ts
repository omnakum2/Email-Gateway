// Allowed file extensions for email attachments.
export const ALLOWED_EXTENSIONS = ['pdf', 'csv', 'xlsx', 'docx', 'jpg', 'jpeg', 'png'];

// Blocked file extensions.
export const BLOCKED_EXTENSIONS = ['exe', 'apk', 'bat', 'sh'];

// Max file size per attachment in bytes (10MB).
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Max number of attachments per email.
export const MAX_ATTACHMENT_COUNT = 5;
