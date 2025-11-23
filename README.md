# Photo Diary (Static GitHub Pages + Firebase)

이 프로젝트는 **GitHub Pages**와 **Firebase**를 이용해 개인 사진 일기(달력형)를 만드는 간단한 예제입니다.
도메인을 사지 않아도 GitHub Pages 주소로 배포해 개인용으로 사용할 수 있습니다.

## 특징
- 월간 달력에서 날짜 클릭 -> 사진 업로드 + 일기 작성
- 사진 중 대표 사진을 선택하면 달력에 표시
- 사람 태그, 해시태그, 위치 정보 저장 가능
- Firebase Firestore에 메타데이터 저장, Firebase Storage에 이미지 저장

## 준비물
1. Firebase 프로젝트 (https://console.firebase.google.com)
2. Firestore와 Storage 활성화(규칙은 초기 개발용으로 테스트 모드 사용 가능)
3. `firebase-init.js`의 firebaseConfig를 본인 프로젝트 정보로 교체

## 배포
1. GitHub에 레포 생성
2. 이 폴더의 내용을 커밋하고 GitHub에 푸시
3. GitHub Pages에서 `main` 브랜치의 `root`(루트)로 배포 설정
4. 배포된 URL(예: https://yourname.github.io/photo_diary)에서 접속

## 보안 노트
- demo 목적입니다. 실제로 공개 저장소에 Firebase config를 올려도 `apiKey` 등은 공개되지만, Firestore/Storage 규칙을 적절히 설정해야 합니다.
- 배포 전에는 Firebase 보안 규칙을 반드시 확인하세요.

## 확장 아이디어
- 사진 썸네일 생성(저장 시 리사이징)
- 인증(익명 또는 이메일 로그인)
- 사진 삭제, 수정 기능
- 위치 검색 자동완성(구글/카카오 API)

감사합니다!
