# @seah/branch-cli

세아웍스 Git 브랜치 네이밍 규칙을 준수하는 브랜치를 쉽게 생성하는 CLI 도구입니다.

## 설치

### Yarn (권장)

\`\`\`bash
yarn global add @seah/branch-cli
\`\`\`

### npm

\`\`\`bash
npm install -g @seah/branch-cli
\`\`\`

## 사용법

Git 저장소 내에서 다음 명령어를 실행하세요:

\`\`\`bash
seah-branch
\`\`\`

대화형 프롬프트를 따라 다음을 선택/입력합니다:

1. 브랜치 타입 (feature/hotfix/bugfix)
2. 모듈 (공통/전자결재/조직도/근태/게시판/관리자/SELIS/SETIS)
3. 회사 (세아홀딩스/세아베스틸지주/세아베스틸/세아창원특수강/세아제강지주/세아제강)
4. SR/ITS 번호 (예: SR2601-01234)

## 브랜치 네이밍 규칙

생성되는 브랜치는 다음 형식을 따릅니다:

\`\`\`
{type}/{year}/{module}/{company}/{mmdd}-{sr-number}
\`\`\`

**예시:**
\`\`\`
feature/2024/appr/aaaa0000000/1229-sr2612-01234
\`\`\`

## 요구사항

- Node.js 22 이상
- Git
- Yarn 또는 npm

## 라이선스

MIT
