export const siteConfig = {
  name: 'killlax',
  author: 'killlax',
  description: '这里是killlax。记录摄影、滑板、AI、二次元与 RoboMaster 机械。',
  url: import.meta.env.PUBLIC_SITE_URL?.trim() || 'https://killlax.example',
  language: 'zh-CN',
};

export const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string) {
  if (/^[a-z][a-z\d+.-]*:/i.test(path) || path.startsWith('//') || path.startsWith('#')) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (basePath && (normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`))) return normalizedPath;
  return `${basePath}${normalizedPath}` || '/';
}
