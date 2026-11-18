#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const assets = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../assets');
const names = ['00_PROJECT.md','01_RULES.md','02_DECISIONS.md','03_SYMBOLS.md','04_WORKLOG.md','05_SNAPSHOT.md','06_SOURCES.md','PROJECT_INSTRUCTIONS.md','README_初始化说明.md'];
const args = process.argv.slice(2);
const command = args.shift();
const root = path.resolve(args.shift() || '.');
const base = path.join(root, '.chatgpt-context');
const now = () => new Date().toISOString().replace(/[:.]/g, '-');
const fail = message => { console.error(message); process.exitCode = 1; };
const safe = file => {
  const rel = path.relative(root, file);
  if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('目标必须位于项目根目录内');
  for (let part = root; part !== path.dirname(part); part = path.dirname(part)) {
    if (fs.existsSync(part) && fs.lstatSync(part).isSymbolicLink()) throw new Error('项目路径包含符号链接');
  }
  let part = root;
  for (const segment of rel.split(path.sep)) {
    part = path.join(part, segment);
    if (fs.existsSync(part) && fs.lstatSync(part).isSymbolicLink()) throw new Error('目标路径包含符号链接');
  }
};
const writeNew = (file, content) => { safe(file); fs.writeFileSync(file, content, { flag: 'wx' }); };
const archive = (file, folder) => {
  fs.mkdirSync(folder, { recursive: true });
  const stem = path.basename(file, '.md');
  let target, n = 0;
  do { target = path.join(folder, `${stem}_${now()}_${n++}.md`); } while (fs.existsSync(target));
  safe(target);
  fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
  return target;
};
const replaceVersioned = (file, content, folder) => {
  safe(file);
  if (fs.existsSync(file)) {
    if (fs.readFileSync(file, 'utf8') === content) return '未变化';
    const old = archive(file, folder);
    const temp = `${file}.new-${process.pid}`;
    try { writeNew(temp, content); fs.renameSync(temp, file); }
    catch (error) { if (fs.existsSync(temp)) fs.unlinkSync(temp); throw error; }
    return `已更新；旧版：${old}`;
  }
  writeNew(file, content);
  return '已创建';
};
const read = name => fs.readFileSync(path.join(base, name), 'utf8');
const required = () => { if (!fs.existsSync(base)) throw new Error('尚未初始化项目'); };
try {
  if (!['init','align','snapshot','handoff','instructions','validate'].includes(command)) throw new Error('用法：node scripts/context.mjs <init|align|snapshot|handoff|instructions|validate> [项目根目录] [内容文件]');
  if (command === 'init') {
    safe(base); fs.mkdirSync(base, { recursive: true });
    for (const dir of ['snapshots','references']) fs.mkdirSync(path.join(base, dir), { recursive: true });
    for (const name of names) {
      const dest = path.join(base, name);
      if (fs.existsSync(dest)) { console.log(`保留已有：${dest}`); continue; }
      writeNew(dest, fs.readFileSync(path.join(assets, name), 'utf8'));
      console.log(`已创建：${dest}`);
    }
  } else if (command === 'validate') {
    required(); const missing = names.filter(n => !fs.existsSync(path.join(base, n)));
    for (const n of missing) console.log(`缺失：${n}`);
    if (missing.length) process.exitCode = 1; else console.log('完整：9 份文档均存在');
  } else if (command === 'align') {
    required();
    for (const n of ['00_PROJECT.md','02_DECISIONS.md','05_SNAPSHOT.md']) console.log(`\n--- ${n} ---\n${read(n)}`);
    console.log('\n请据此核对目标、约束、结论、冲突和下一步；此命令只读。');
  } else if (command === 'instructions') {
    required(); console.log(read('PROJECT_INSTRUCTIONS.md'));
  } else if (command === 'snapshot' || command === 'handoff') {
    required(); const source = args.shift();
    if (!source) throw new Error('请提供已审阅的 UTF-8 Markdown 内容文件，避免脚本捏造项目事实');
    const content = fs.readFileSync(path.resolve(source), 'utf8');
    if (!content.trim()) throw new Error('内容文件为空');
    const target = command === 'snapshot' ? path.join(base,'05_SNAPSHOT.md') : path.join(base,'handoffs',`交接_${now()}.md`);
    if (command === 'snapshot') console.log(replaceVersioned(target, content, path.join(base,'snapshots')));
    else { fs.mkdirSync(path.dirname(target), { recursive: true }); writeNew(target, content); console.log(`已创建：${target}`); }
  }
} catch (error) { fail(error.message); }

