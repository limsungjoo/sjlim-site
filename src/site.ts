// 사이트 한 곳에서만 고치는 값. 이름·소개·링크는 전부 여기서 나간다.
export const site = {
  name: 'Sungjoo Lim',
  handle: 'sjlim',
  title: 'Sungjoo Lim — MLOps & AX Engineer',
  role: 'MLOps & AX Engineer',
  location: 'Seoul, South Korea',
  description:
    'I build systems that make machine learning experiments reproducible, AI agents dependable, and compute infrastructure easier for researchers to use.',
  url: 'https://sjlim.dev',
  links: [
    { label: 'GitHub', href: 'https://github.com/limsungjoo' },
    // TODO: 실제 주소로 교체
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Email', href: 'mailto:hello@example.com' },
    { label: 'RSS', href: '/rss.xml' },
  ],
  nav: [
    { label: 'Portfolio', href: '/portfolio/' },
    { label: 'Writing', href: '/writing/' },
    { label: 'Series', href: '/series/' },
  ],
} as const;

export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  })
    .format(d)
    .replace(/\.$/, '')
    .replace(/\s/g, '');
}

export function readingMinutes(body: string): number {
  // 한글은 분당 500자 기준. 짧은 글이 0분으로 표시되지 않게 최소 1분.
  const chars = body.replace(/\s/g, '').length;
  return Math.max(1, Math.round(chars / 500));
}
