FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY . .

# 루트 디렉토리에서 의존성 설치
RUN pnpm install -r

WORKDIR /app/packages/frontend

# 포트 20064 노출
EXPOSE 3000

# 기본적으로 production 모드로 실행, 환경 변수에 따라 dev 모드로 실행
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'development' ]; then pnpm run dev; else pnpm run build && pnpm run start; fi"]