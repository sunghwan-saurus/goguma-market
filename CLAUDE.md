# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 고구마마켓

중고 물품을 사고팔 수 있는 웹 서비스.

## 기술 스택

- **Next.js** (App Router)
- **Supabase** (데이터베이스, 인증)
- **Tailwind CSS** (스타일링)
- **TypeScript**

## MCP

Supabase MCP 연결됨 — DB 조작 시 MCP를 통해 직접 수행

## 규칙

- 한국어 UI
- 가격은 원화(₩) — "₩10,000" 형태로 표시
- 모바일 반응형 필수
- 디자인은 깔끔하고 모던한 스타일
- 색상 테마: 주황색 계열 (고구마 컨셉)

## 주요 기능

- 상품 목록 (메인 페이지)
- 상품 등록/상세/수정/삭제
- 소셜 로그인 (카카오/구글)
- 결제 (토스페이먼츠)

## 데이터베이스

### products (상품)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK, 자동 생성 |
| title | TEXT | 상품명 (필수) |
| description | TEXT | 상품 설명 |
| price | INTEGER | 가격, 원화 (필수) |
| image_url | TEXT | 이미지 URL |
| seller_name | TEXT | 판매자 이름 (필수) |
| status | TEXT | 판매중 / 예약중 / 판매완료 (기본값: 판매중) |
| created_at | TIMESTAMPTZ | 등록일, 자동 생성 |
