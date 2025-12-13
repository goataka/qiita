#!/usr/bin/env node

/**
 * Qiita記事のファイル名をIDからタイトルベースに変更するスクリプト
 * 
 * このスクリプトは以下を行います：
 * 1. public/ディレクトリ内の全MDファイルを走査
 * 2. frontmatterからタイトルとIDを抽出
 * 3. タイトルをファイル名に適した形式に変換
 * 4. IDベースのファイル名をタイトルベースにリネーム
 */

const fs = require('fs');
const path = require('path');

/**
 * frontmatterからメタデータを抽出
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return null;
  }
  
  const frontmatter = match[1];
  const lines = frontmatter.split('\n');
  const metadata = {};
  
  let currentKey = null;
  let isMultiline = false;
  let multilineValue = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 複数行の値を処理中の場合
    if (isMultiline) {
      // インデントされた行は複数行の値の続き
      if (line.match(/^\s{2,}/) && currentKey) {
        multilineValue.push(line.trim());
      } else {
        // 複数行の値が終了
        metadata[currentKey] = multilineValue.join(' ');
        isMultiline = false;
        multilineValue = [];
        // 現在の行を再処理
        i--;
        continue;
      }
    } else {
      // キー:値の形式をチェック
      const keyValueMatch = line.match(/^(\w+):\s*(.*)$/);
      if (keyValueMatch) {
        currentKey = keyValueMatch[1];
        const value = keyValueMatch[2].trim();
        
        // 複数行の値の開始（>- または > など）
        if (value === '>-' || value === '>' || value === '|-' || value === '|') {
          isMultiline = true;
          multilineValue = [];
        } else if (value.length > 1 && value.startsWith("'") && value.endsWith("'")) {
          // 値が引用符で囲まれている場合は除去
          metadata[currentKey] = value.slice(1, -1);
        } else if (value.length > 1 && value.startsWith('"') && value.endsWith('"')) {
          metadata[currentKey] = value.slice(1, -1);
        } else {
          metadata[currentKey] = value;
        }
      }
    }
  }
  
  // 最後の複数行の値を保存
  if (isMultiline && currentKey) {
    metadata[currentKey] = multilineValue.join(' ');
  }
  
  return metadata;
}

/**
 * タイトルを安全なファイル名に変換
 * - ファイルシステムで使用できない文字を削除または置換
 * - スペースをハイフンに変換
 * - 長すぎる場合は切り詰める（最大100文字）
 */
function sanitizeFilename(title) {
  if (!title) {
    return null;
  }
  
  // ファイル名として使用できない文字を削除または置換
  let filename = title
    .replace(/[<>:"/\\|?*]/g, '') // ファイルシステムで禁止されている文字を削除
    .replace(/\s+/g, '-') // スペースをハイフンに変換
    .replace(/[・]/g, '-') // 日本語の中黒をハイフンに変換
    .replace(/[、。，．]/g, '') // 日本語の句読点を削除
    .replace(/[-]+/g, '-') // 連続するハイフンを1つに
    .replace(/^-+|-+$/g, ''); // 先頭と末尾のハイフンを削除
  
  // 長すぎる場合は切り詰める（最大100文字、拡張子を除く）
  if (filename.length > 100) {
    filename = filename.substring(0, 100);
    // 途中で切れた場合、最後のハイフンまでで切る
    const lastHyphen = filename.lastIndexOf('-');
    if (lastHyphen > 50) {
      filename = filename.substring(0, lastHyphen);
    }
  }
  
  return filename;
}

/**
 * メイン処理
 */
function main() {
  const publicDir = path.join(__dirname, '../../public');
  
  if (!fs.existsSync(publicDir)) {
    console.error(`エラー: ${publicDir} が見つかりません`);
    process.exit(1);
  }
  
  // 処理対象ディレクトリのリスト（public直下のみ）
  const targetDirs = [
    publicDir
  ];
  
  console.log(`処理対象ディレクトリ: ${targetDirs.length}個`);
  targetDirs.forEach(dir => console.log(`  - ${path.relative(publicDir, dir) || '.'}`));
  
  let totalRenamed = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  
  for (const targetDir of targetDirs) {
    console.log(`\n=== ${path.relative(publicDir, targetDir) || 'public'} ディレクトリを処理中 ===`);
    
    // ディレクトリ内の全.mdファイルを取得
    const files = fs.readdirSync(targetDir)
      .filter(file => file.endsWith('.md') && !file.startsWith('.'));
    
    console.log(`${files.length}個のマークダウンファイルを見つけました`);
    
    const renamedFiles = [];
    const skippedFiles = [];
    const errors = [];
    
    // 重複チェック用のマップ
    const usedFilenames = new Map();
    
    for (const file of files) {
      const filePath = path.join(targetDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // frontmatterを抽出
      const metadata = extractFrontmatter(content);
      
      if (!metadata) {
        console.warn(`警告: ${file} のfrontmatterが見つかりません - スキップ`);
        skippedFiles.push({ file, reason: 'frontmatterなし' });
        continue;
      }
      
      if (!metadata.title) {
        console.warn(`警告: ${file} にタイトルがありません - スキップ`);
        skippedFiles.push({ file, reason: 'タイトルなし' });
        continue;
      }
      
      if (!metadata.id) {
        console.warn(`警告: ${file} にIDがありません - スキップ`);
        skippedFiles.push({ file, reason: 'IDなし' });
        continue;
      }
      
      // タイトルベースのファイル名を生成
      let newFilename = sanitizeFilename(metadata.title);
      
      if (!newFilename) {
        console.warn(`警告: ${file} のタイトルから有効なファイル名を生成できません - スキップ`);
        skippedFiles.push({ file, reason: 'ファイル名生成失敗' });
        continue;
      }
      
      // 重複チェックと処理
      if (usedFilenames.has(newFilename)) {
        // 既に使用されているファイル名の場合、IDを末尾に追加
        const shortId = metadata.id.length >= 8 ? metadata.id.substring(0, 8) : metadata.id;
        newFilename = `${newFilename}-${shortId}`;
        console.log(`重複を検出: ${metadata.title} -> ${newFilename}.md`);
      }
      
      usedFilenames.set(newFilename, file);
      newFilename = `${newFilename}.md`;
      
      // 既に正しいファイル名の場合はスキップ
      if (file === newFilename) {
        console.log(`スキップ (既に正しいファイル名): ${file}`);
        skippedFiles.push({ file, reason: '既に正しい名前' });
        continue;
      }
      
      // ファイルをリネーム
      const newFilePath = path.join(targetDir, newFilename);
      
      // 新しいファイル名が既に存在する場合
      if (fs.existsSync(newFilePath)) {
        console.warn(`警告: ${newFilename} は既に存在します - ${file} をスキップ`);
        skippedFiles.push({ file, reason: '新ファイル名が既に存在' });
        continue;
      }
      
      try {
        fs.renameSync(filePath, newFilePath);
        console.log(`✓ ${file} -> ${newFilename}`);
        renamedFiles.push({ old: file, new: newFilename, title: metadata.title });
      } catch (error) {
        console.error(`エラー: ${file} のリネームに失敗: ${error.message}`);
        errors.push({ file, error: error.message });
      }
    }
    
    // ディレクトリごとのサマリーを表示
    console.log(`\nリネーム成功: ${renamedFiles.length}件`);
    console.log(`スキップ: ${skippedFiles.length}件`);
    console.log(`エラー: ${errors.length}件`);
    
    totalRenamed += renamedFiles.length;
    totalSkipped += skippedFiles.length;
    totalErrors += errors.length;
    
    if (errors.length > 0) {
      console.log('\n=== エラー ===');
      errors.forEach(({ file, error }) => {
        console.log(`  ${file}: ${error}`);
      });
    }
  }
  
  // 全体のサマリーを表示
  console.log('\n=== 全体の処理結果 ===');
  console.log(`リネーム成功: ${totalRenamed}件`);
  console.log(`スキップ: ${totalSkipped}件`);
  console.log(`エラー: ${totalErrors}件`);
  
  if (totalErrors > 0) {
    process.exit(1);
  }
}

// スクリプトとして実行された場合のみmainを実行
if (require.main === module) {
  main();
}

module.exports = { extractFrontmatter, sanitizeFilename };
