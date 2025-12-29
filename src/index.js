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
  const pattern = /^(SR|ITS)\d{4}-\d{5}$/i;
  if (pattern.test(value)) {
    return true;
  }
  return "SR2601-01234 또는 ITS2601-01234 형식으로 입력하세요";
}

async function createBranch() {
  console.log(chalk.blue.bold("\n🌿 세아웍스 브랜치 생성 도구\n"));

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
    const srNumber = await input({
      message: "SR/ITS 번호를 입력하세요 (예: SR2601-01234):",
      validate: validateSRNumber,
      transformer: (value) => value.toUpperCase(),
    });

    // 브랜치명 생성
    const year = new Date().getFullYear();
    const date = getTodayMMDD();
    const branchName = `${type}/${year}/${module}/${company}/${date}-${srNumber.toLowerCase()}`;

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
        console.error(
          chalk.red(
            "Git 저장소인지 확인하거나 이미 존재하는 브랜치명인지 확인하세요.\n"
          )
        );
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
