/** biome-ignore-all lint/suspicious/noConsole: <biome의 console 사용금지 규칙 예외파일> */
import { existsSync, mkdirSync } from "node:fs";
import { $ } from "bun";

const env = (k: string, fallback?: string) => {
	const v = process.env[k] ?? fallback;
	if (v == null) throw new Error(`Missing env: ${k}`);
	return v;
};

const LOCAL_DB_URL = env("LOCAL_DB_URL");
const DUMP_DIR = env("DUMP_DIR", "./db-dump");
const SUPABASE_PROJECT_ID = env("SUPABASE_PROJECT_ID");

const schemaTableFile = `${DUMP_DIR}/schema-table.sql`;
const schemaStorageFile = `${DUMP_DIR}/schema-storage.sql`;
const dataFile = `${DUMP_DIR}/data.sql`;

function logStep(title: string) {
	console.log(`\n=== ${title} ===`);
}

// 환경변수 세팅
async function ensureDumpDir() {
	if (!existsSync(DUMP_DIR)) mkdirSync(DUMP_DIR, { recursive: true });
}

// remote supabase 프로젝트와 로컬 supabase 프로젝트 연결
async function linkRemoteDb() {
	logStep("1) Remote DB와 연결");
	await $`supabase link --project-ref ${SUPABASE_PROJECT_ID} `;
}

// 연결된 remote supabase 프로젝트에서 local로 schema와 data를 가져옴(덤프 - 외부 파일로 추출)
async function dumpRemote() {
	logStep("2) Remote DB의 스키마를 덤프");
	await $`supabase db dump -f ${schemaTableFile}`;

	logStep("3) Remote Storage의 스키마를 덤프");
	await $`supabase db diff --linked --schema storage ${schemaStorageFile}`;

	logStep("4) Remote DB의 데이터도 덤프");
	await $`supabase db dump --data-only --use-copy -f ${dataFile}`;
}

// DB를 초기화(reset)해야 새로운 데이터를 넣을 수 있음(덮어쓰기는 불가해서 일부러 reset을 하는 것임)
// reset을 하려면 start가 필요한데 이미 실행중인 경우에 대비하여 stop 후 start 하여 동작 보장
async function cleanLocal() {
	logStep("5) Local DB 시작");
	await $`supabase stop --project-id archive`;
	await $`supabase start`;

	logStep("6) 기존 Local DB 초기화");
	await $`supabase db reset`;
}

// 덤프된 schema와 data를 로컬 DB에 복원(restore)
async function restoreLocal() {
	logStep("7) 초기화된 Local DB에 덤프된 스키마와 데이터 복원");
	await $`psql -d ${LOCAL_DB_URL} -f ${schemaTableFile} -f ${schemaStorageFile} -f ${dataFile}`;
}

async function main() {
	console.log("Remote → Local Supabase DB migration (schema + data)");

	await ensureDumpDir();
	await linkRemoteDb();
	await dumpRemote();
	await cleanLocal();
	await restoreLocal();

	console.log(
		"archive 프로젝트의 Remote Supabase DB의 schema와 data를 Local Supabase DB로 마이그레이션 완료!",
	);
}

main().catch((err) => {
	console.error("\n❌ Migration failed:");
	console.error(err?.stack ?? err);
	process.exit(1);
});
