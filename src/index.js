import { select, input, confirm } from "@inquirer/prompts";
import { execSync } from "child_process";
import chalk from "chalk";
import { config } from "./config.js";

// 오늘 날짜를 MMDD 형식으로 반환
function getTodayMMDD() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${month}${day}`;
}

// SR/ITS 번호 검증
function validateSRNumber(value) {
  return true;
}

// 현재 브랜치 가져오기
function getCurrentBranch() {
  try {
    const branch = execSync("git branch --show-current", {
      encoding: "utf-8",
    }).trim();
    return branch;
  } catch (error) {
    console.error(
      chalk.red("❌ Git 저장소가 아니거나 브랜치를 확인할 수 없습니다.")
    );
    process.exit(1);
  }
}

// dev_06M 또는 dev_06MON 브랜치인지 확인
function isDevBranch(branchName) {
  return branchName === "dev_06M" || branchName === "dev_06MON";
}

// Git fetch 실행
function gitFetch() {
  try {
    console.log(chalk.blue("🔄 원격 저장소에서 최신 정보를 가져오는 중..."));
    execSync("git fetch", { stdio: "inherit" });
    return true;
  } catch (error) {
    console.error(chalk.red("❌ git fetch 실패"));
    return false;
  }
}

// 로컬과 원격 브랜치 비교
function checkBranchStatus(branchName) {
  try {
    // 원격 브랜치가 존재하는지 확인
    const remoteBranch = `origin/${branchName}`;
    try {
      execSync(`git rev-parse --verify ${remoteBranch}`, { stdio: "pipe" });
    } catch {
      // 원격 브랜치가 없으면 로컬 전용 브랜치
      return { canProceed: true, needsPull: false, needsPush: false };
    }

    // 로컬과 원격 커밋 비교
    const localCommit = execSync(`git rev-parse ${branchName}`, {
      encoding: "utf-8",
    }).trim();
    const remoteCommit = execSync(`git rev-parse ${remoteBranch}`, {
      encoding: "utf-8",
    }).trim();

    if (localCommit === remoteCommit) {
      // 동기화 상태
      return { canProceed: true, needsPull: false, needsPush: false };
    }

    // ahead/behind 확인
    const ahead = execSync(
      `git rev-list --count ${remoteBranch}..${branchName}`,
      { encoding: "utf-8" }
    ).trim();
    const behind = execSync(
      `git rev-list --count ${branchName}..${remoteBranch}`,
      { encoding: "utf-8" }
    ).trim();

    return {
      canProceed: false,
      needsPull: parseInt(behind) > 0,
      needsPush: parseInt(ahead) > 0,
      aheadCount: parseInt(ahead),
      behindCount: parseInt(behind),
    };
  } catch (error) {
    console.error(chalk.yellow("⚠️  브랜치 상태 확인 중 오류 발생"));
    return { canProceed: true, needsPull: false, needsPush: false };
  }
}

// 브랜치 검증 및 준비
async function validateAndPrepareBranch() {
  const currentBranch = getCurrentBranch();

  console.log(chalk.blue(`현재 브랜치: ${currentBranch}\n`));

  // 1. dev_06M 또는 dev_06MON이 아닌 경우
  if (!isDevBranch(currentBranch)) {
    console.log(
      chalk.red(
        "❌ 브랜치 생성은 dev_06M 또는 dev_06MON 브랜치에서만 가능합니다.\n"
      )
    );
    console.log(
      chalk.yellow("다음 명령어로 브랜치를 변경한 후 다시 실행하세요:")
    );
    console.log(chalk.cyan("  git checkout dev_06M"));
    console.log(chalk.cyan("  또는"));
    console.log(chalk.cyan("  git checkout dev_06MON\n"));
    process.exit(1);
  }

  // 2. dev_06M 또는 dev_06MON인 경우 - fetch 실행
  console.log(chalk.green(`✅ ${currentBranch} 브랜치에서 실행 중\n`));

  if (!gitFetch()) {
    process.exit(1);
  }

  // 3. pull/push 필요 여부 확인
  const status = checkBranchStatus(currentBranch);

  if (!status.canProceed) {
    console.log(chalk.yellow("\n⚠️  브랜치 동기화 필요\n"));

    if (status.needsPull) {
      console.log(
        chalk.red(
          `❌ 원격 저장소에 ${status.behindCount}개의 새로운 커밋이 있습니다.`
        )
      );
      console.log(chalk.yellow("다음 명령어로 최신 변경사항을 받아오세요:"));
      console.log(chalk.cyan(`  git pull origin ${currentBranch}\n`));
    }

    if (status.needsPush) {
      console.log(
        chalk.red(
          `❌ 로컬에 ${status.aheadCount}개의 푸시되지 않은 커밋이 있습니다.`
        )
      );
      console.log(chalk.yellow("다음 명령어로 변경사항을 푸시하세요:"));
      console.log(chalk.cyan(`  git push origin ${currentBranch}\n`));
    }

    console.log(chalk.yellow("동기화 후 다시 실행해주세요.\n"));
    process.exit(1);
  }

  console.log(chalk.green("✅ 브랜치가 최신 상태입니다.\n"));
}

async function createBranch() {
  console.log(chalk.blue.bold("\n🌿 세아웍스 브랜치 생성 도구\n"));

  // 브랜치 검증 및 준비
  await validateAndPrepareBranch();

  try {
    // 브랜치 타입 선택
    const type = await select({
      message: "브랜치 타입을 선택하세요:",
      choices: config.branchTypes,
    });

    // 모듈 선택
    const module = await select({
      message: "모듈을 선택하세요:",
      choices: config.modules,
    });

    // 회사 선택
    const company = await select({
      message: "회사를 선택하세요:",
      choices: config.companies,
    });

    // SR/ITS 번호 입력
    const srNumberInput = await input({
      message: "SR/ITS 또는 티켓 번호를 입력하세요 (없으면 Enter):",
      validate: validateSRNumber,
      transformer: (value) => {
        if (!value || value.trim() === "") {
          return "없음";
        }
        return value.toUpperCase();
      },
    });

    // 브랜치명 생성
    const year = new Date().getFullYear();
    const date = getTodayMMDD();

    // SR 번호가 없으면 브랜치명에서 제외
    let branchName;
    if (!srNumberInput || srNumberInput.trim() === "") {
      branchName = `${type}/${year}/${module}/${company}/${date}`;
    } else {
      branchName = `${type}/${year}/${module}/${company}/${date}-${srNumberInput.toLowerCase()}`;
    }

    console.log(chalk.yellow(`\n생성할 브랜치: ${branchName}\n`));

    // 확인
    const shouldCreate = await confirm({
      message: "이 브랜치를 생성하시겠습니까?",
      default: true,
    });

    if (shouldCreate) {
      try {
        execSync(`git checkout -b ${branchName}`, { stdio: "inherit" });
        console.log(chalk.green.bold(`\n✅ 브랜치 생성 완료: ${branchName}\n`));
      } catch (error) {
        console.error(chalk.red("\n❌ 브랜치 생성 실패"));
        console.error(chalk.red("이미 존재하는 브랜치명인지 확인하세요.\n"));
        process.exit(1);
      }
    } else {
      console.log(chalk.gray("\n취소되었습니다.\n"));
    }
  } catch (error) {
    if (error.name === "ExitPromptError") {
      console.log(chalk.gray("\n\n취소되었습니다.\n"));
      process.exit(0);
    }
    throw error;
  }
}

createBranch().catch((error) => {
  console.error(chalk.red("오류 발생:"), error);
  process.exit(1);
});
