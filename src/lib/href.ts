// 서브경로 배포(GitHub Pages 등)를 위해 내부 링크에 base 를 붙인다.
// astro.config 의 base 를 바꿔도 링크가 따라오게 하는 유일한 통로.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** 내부 경로에 base 를 붙인다. 항상 '/' 로 시작하는 경로를 넘길 것 */
export function href(path: string): string {
  return `${BASE}${path}`;
}

/** 현재 경로가 해당 섹션에 속하는지. base 가 붙은 pathname 과 비교한다 */
export function isActive(pathname: string, sectionPath: string): boolean {
  return pathname.startsWith(href(sectionPath));
}
