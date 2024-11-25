# 실행 방법

### 개발 환경

```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

개발환경과 mysql 컨테이너를 동시에 실행합니다.

### 배포 환경 (애플리케이션)

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

배포 환경 애플리케이션 컨테이너를 생성 후 실행합니다.

### 배포 환경 (db)

```
docker-compose -f docker-compose.mysql.yml up -d
```

배포 환경 데이터베이스 (mysql) 컨테이너를 실행합니다.
배포 환경에서는 데이터베이스를 많이 실행할 일이 없으므로 따로 사용합니다.

# 설정 관련

### 만약 docker 설정을 변경했거나 패키지를 설치했을 땐

```
docker-compose down
docker network prune
```

을 하고 위 명령어를 실행한다.
(주의) DB 볼륨이 같이 날아가니 db에 정보 있을 땐 하지 말자.

### 평소

CTRL+C 한다.
