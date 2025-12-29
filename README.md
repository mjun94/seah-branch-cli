# @seahworks/branch-cli

세아웍스 Git 브랜치 네이밍 규칙을 준수하는 브랜치를 쉽게 생성하는 CLI 도구입니다.

## 주요 기능

- ✅ 브랜치 네이밍 규칙 자동 적용
- ✅ dev_06M/dev_06MON 브랜치에서만 생성 가능
- ✅ 자동 git fetch 및 동기화 상태 확인
- ✅ Pull/Push 필요 시 안내 메시지
- ✅ 대화형 인터페이스로 쉬운 사용

## 설치

### Yarn (권장)

```bash
yarn global add @seahworks/branch-cli
```

### npm

```bash
npm install -g @seahworks/branch-cli
```

## 환경별 추가 설정

### Windows - Git Bash 사용자

Git Bash에서는 PATH 설정이 추가로 필요합니다:

```bash
# 자동 설정 (권장)
YARN_BIN=$(yarn global bin | sed 's/\\/\//g' | sed 's/C:/\/c/')
echo "export PATH=\"$YARN_BIN:\$PATH\"" >> ~/.bashrc
source ~/.bashrc
```

**수동 설정:**

```bash
# 1. .bashrc 편집
nano ~/.bashrc

# 2. 파일 맨 아래에 추가 (YourName을 실제 사용자명으로 변경)
export PATH="/c/Users/YourName/AppData/Local/Yarn/bin:$PATH"

# 3. 저장 후 적용
source ~/.bashrc
```

### Windows - PowerShell/CMD 사용자

1. `Win + R` → `sysdm.cpl` 입력 → Enter
2. **고급** 탭 → **환경 변수** 클릭
3. **사용자 변수**에서 **Path** 선택 → **편집**
4. **새로 만들기** 클릭
5. `yarn global bin` 명령어 결과 경로 입력

```
   C:\Users\YourName\AppData\Local\Yarn\bin
```

6. **확인** 후 **PowerShell/CMD 재시작**

### macOS / Linux

```bash
# Zsh (macOS 기본)
echo 'export PATH="$(yarn global bin):$PATH"' >> ~/.zshrc
source ~/.zshrc

# Bash
echo 'export PATH="$(yarn global bin):$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## 사용법

### 1. dev 브랜치로 이동

**중요:** 브랜치 생성은 `dev_06M` 또는 `dev_06MON` 브랜치에서만 가능합니다.

```bash
git checkout dev_06M
# 또는
git checkout dev_06MON
```

### 2. CLI 도구 실행

```bash
seah-branch
```

도구가 자동으로 다음을 확인합니다:

- ✅ 현재 브랜치가 dev_06M 또는 dev_06MON인지 검증
- ✅ 원격 저장소에서 최신 정보 가져오기 (`git fetch`)
- ✅ Pull/Push가 필요한지 확인

### 3. 브랜치 정보 입력

대화형 프롬프트에 따라 선택/입력:

1. **브랜치 타입**

   - feature (새 기능)
   - hotfix (긴급 수정)
   - bugfix (버그 수정)

2. **모듈**

   - 공통, 전자결재, 조직도, 근태, 게시판, 관리자, SELIS, SETIS

3. **회사**

   - 세아홀딩스, 세아베스틸지주, 세아베스틸, 세아창원특수강, 세아제강지주, 세아제강, 기타

4. **SR/ITS 또는 티켓 번호** (선택사항)
   - 예: `SR2601-01234`
   - 없으면 Enter

### 4. 브랜치 생성 완료

확인 후 새 브랜치가 자동으로 생성되고 체크아웃됩니다.

## 브랜치 네이밍 규칙

생성되는 브랜치는 다음 형식을 따릅니다:

```
{type}/{year}/{module}/{company}/{mmdd}-{sr-number}
```

### 예시

**티켓 번호가 있는 경우:**

```
feature/2025/appr/AAAA/1229-sr2612-01234
```

**티켓 번호가 없는 경우:**

```
feature/2025/board/etc/1229
```

### 구성 요소

- `type`: feature, hotfix, bugfix
- `year`: 자동으로 현재 연도 (예: 2024)
- `module`: cmn, appr, org, emp, board, admin, selis, setis
- `company`: AAAA, AAMW, AAAW, AABW, AAEB, AAAB, etc
- `mmdd`: 자동으로 오늘 날짜 (예: 1229)
- `sr-number`: SR2601-01234 또는 ITS2601-01234 (선택사항)

## 실행 시나리오

### ✅ 정상 진행

```bash
$ -branch

🌿 세아웍스 브랜치 생성 도구

현재 브랜치: dev_06M

✅ dev_06M 브랜치에서 실행 중

🔄 원격 저장소에서 최신 정보를 가져오는 중...

✅ 브랜치가 최신 상태입니다.

? 브랜치 타입을 선택하세요: feature - 새 기능
? 모듈을 선택하세요: 전자결재
? 회사를 선택하세요: 세아홀딩스
? SR/ITS 또는 티켓 번호를 입력하세요: SR2601-01234

생성할 브랜치: feature/2025/appr/AAAA/1229-sr2601-01234

? 이 브랜치를 생성하시겠습니까? Yes

✅ 브랜치 생성 완료: feature/2025/appr/AAAA/1229-sr2601-01234
```

### ❌ dev 브랜치가 아닌 경우

```bash
$ -branch

🌿 세아웍스 브랜치 생성 도구

현재 브랜치: main

❌ 브랜치 생성은 dev_06M 또는 dev_06MON 브랜치에서만 가능합니다.

다음 명령어로 브랜치를 변경한 후 다시 실행하세요:
  git checkout dev_06M
  또는
  git checkout dev_06MON
```

### ⚠️ Pull이 필요한 경우

```bash
$ -branch

🌿 세아웍스 브랜치 생성 도구

현재 브랜치: dev_06M

✅ dev_06M 브랜치에서 실행 중

🔄 원격 저장소에서 최신 정보를 가져오는 중...

⚠️  브랜치 동기화 필요

❌ 원격 저장소에 3개의 새로운 커밋이 있습니다.
다음 명령어로 최신 변경사항을 받아오세요:
  git pull origin dev_06M

동기화 후 다시 실행해주세요.
```

### ⚠️ Push가 필요한 경우

```bash
$ -branch

🌿 세아웍스 브랜치 생성 도구

현재 브랜치: dev_06MON

✅ dev_06MON 브랜치에서 실행 중

🔄 원격 저장소에서 최신 정보를 가져오는 중...

⚠️  브랜치 동기화 필요

❌ 로컬에 2개의 푸시되지 않은 커밋이 있습니다.
다음 명령어로 변경사항을 푸시하세요:
  git push origin dev_06MON

동기화 후 다시 실행해주세요.
```

## 요구사항

- Node.js 18 이상
- Git
- Yarn 또는 npm
- dev_06M 또는 dev_06MON 브랜치

## 업데이트

```bash
# Yarn
yarn global upgrade @seahworks/branch-cli

# npm
npm update -g @seahworks/branch-cli
```

## 문제 해결

### command not found: -branch

#### Windows - Git Bash

```bash
# PATH 확인
echo $PATH | grep -i yarn

# PATH 추가
YARN_BIN=$(yarn global bin | sed 's/\\/\//g' | sed 's/C:/\/c/')
echo "export PATH=\"$YARN_BIN:\$PATH\"" >> ~/.bashrc
source ~/.bashrc

# 확인
-branch
```

#### Windows - PowerShell/CMD

1. PowerShell을 **완전히 종료** 후 **새로 열기**
2. 그래도 안 되면 **PC 재부팅**
3. 여전히 안 되면 환경 변수 설정 다시 확인

#### macOS / Linux

```bash
# PATH 추가 및 저장
echo 'export PATH="$(yarn global bin):$PATH"' >> ~/.zshrc  # Zsh
# 또는
echo 'export PATH="$(yarn global bin):$PATH"' >> ~/.bashrc  # Bash

# 적용
source ~/.zshrc  # 또는 source ~/.bashrc
```

### Node.js 버전 확인

```bash
node --version
# v18.0.0 이상이어야 합니다
```

**업데이트 방법:**

```bash
# nvm 사용 시
nvm install 18
nvm use 18

# 공식 사이트 다운로드
# https://nodejs.org
```

### Git 저장소가 아닙니다

```bash
❌ Git 저장소가 아니거나 브랜치를 확인할 수 없습니다.
```

**해결:**

- Git 저장소 디렉토리에서 실행하세요
- `git init` 또는 `git clone`으로 저장소 생성

### 임시 해결책

PATH 설정이 어려운 경우:

#### npx 사용 (npm 설치 시)

```bash
npx @seahworks/branch-cli
```

#### 전체 경로로 실행

**Windows - Git Bash:**

```bash
"/c/Users/YourName/AppData/Local/Yarn/bin/-branch"
```

**Windows - PowerShell/CMD:**

```bash
C:\Users\YourName\AppData\Local\Yarn\bin\-branch
```

**macOS / Linux:**

```bash
$(yarn global bin)/-branch
```

#### package.json 스크립트

프로젝트 `package.json`에 추가:

```json
{
  "scripts": {
    "branch": "-branch"
  }
}
```

실행:

```bash
yarn branch
# 또는
npm run branch
```

## 라이선스

MIT
