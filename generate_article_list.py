#!/usr/bin/env python3
"""
記事一覧を生成するスクリプト
public/ディレクトリ内のマークダウンファイルからタイトルと更新日を抽出し、
README.mdに記載するための記事一覧を生成します。
"""

import os
import re
from pathlib import Path
from datetime import datetime

def extract_frontmatter(file_path):
    """マークダウンファイルからfrontmatterを抽出する"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # frontmatterの抽出（---で囲まれた部分）
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if not match:
        return None
    
    frontmatter = match.group(1)
    
    # titleとupdated_atを抽出
    # まず title: >- の形式（複数行にまたがる場合）をチェック
    multiline_match = re.search(r'^title:\s*>-\s*\n((?:  .+(?:\n|$))+)', frontmatter, re.MULTILINE)
    if multiline_match:
        # 複数行のタイトルを1行に結合
        title_lines = multiline_match.group(1).strip().split('\n')
        title = ' '.join(line.strip() for line in title_lines)
    else:
        # 通常の形式（title: "タイトル" または title: タイトル）
        title_match = re.search(r'^title:\s*["\']?(.*?)["\']?\s*$', frontmatter, re.MULTILINE)
        if not title_match:
            return None
        title = title_match.group(1).strip()
    
    updated_match = re.search(r'^updated_at:\s*["\']?(.*?)["\']?\s*$', frontmatter, re.MULTILINE)
    
    updated_at = updated_match.group(1).strip() if updated_match else None
    
    return {
        'title': title,
        'updated_at': updated_at,
        'filename': file_path.name
    }

def parse_date(date_str):
    """日付文字列をパース"""
    if not date_str:
        return datetime.min
    try:
        # ISO 8601形式をパース
        return datetime.fromisoformat(date_str.replace('+09:00', ''))
    except:
        return datetime.min

def generate_article_list():
    """記事一覧を生成"""
    public_dir = Path(__file__).parent / 'public'
    
    if not public_dir.exists():
        print("Error: public/ ディレクトリが見つかりません")
        return
    
    # すべてのマークダウンファイルを取得
    articles = []
    for md_file in public_dir.glob('*.md'):
        frontmatter = extract_frontmatter(md_file)
        if frontmatter:
            articles.append(frontmatter)
    
    # 更新日でソート（新しい順）
    articles.sort(key=lambda x: parse_date(x['updated_at']), reverse=True)
    
    # 記事一覧を出力
    print("## 記事一覧\n")
    print(f"全 {len(articles)} 件の記事があります。\n")
    
    for article in articles:
        filename = article['filename']
        title = article['title']
        updated_at = article['updated_at']
        
        # 日付をフォーマット
        date_str = ""
        if updated_at:
            try:
                dt = parse_date(updated_at)
                if dt != datetime.min:
                    date_str = f" (更新: {dt.strftime('%Y-%m-%d')})"
            except:
                pass
        
        print(f"- [{title}](./public/{filename}){date_str}")

if __name__ == '__main__':
    generate_article_list()
