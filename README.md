# PVE Connection

Proxmox VE 连接管理工具，统一展示节点与虚拟机信息，支持一键生成 RDP / SSH / SMB 连接文件。

## 功能

- **说明** — 为节点或虚拟机添加自定义说明
- **连接凭据管理** — 集中管理各连接类型的用户名、密码、端口
- **快速连接** — 一键下载 RDP、SSH (Xshell)、SMB 连接脚本，或打开 Web 链接

## 项目结构

```
pve-connection/
├── src/main/java/com/nonu1l/pvetool/
│   ├── controller/              # REST API
│   ├── service/                 # PVE 客户端、JSON 存储
│   └── model/                   # 数据模型
├── frontend/                    # React + TypeScript + Bulma 前端
│   ├── src/
│   │   ├── components/          # UI 组件
│   │   ├── api.ts               # API 请求
│   │   ├── context.tsx           # 全局状态
│   │   └── types.ts             # 类型定义
│   └── index.html
├── docker-compose/              # Docker 部署
│   └── docker-compose.yaml
├── data/                        # 本地数据目录
└── pom.xml
```

## Docker 部署

准备 `docker-compose/` 目录，放入 `pve-connection.jar`，然后启动：

```bash
cd docker-compose
docker compose up -d
```

浏览器访问 `http://your-server-ip:80`

## 开发

`src/main/resources/static/` 为前端构建产物，不纳入版本控制，**Maven 打包前需先在本地构建前端**。

```bash
# 1. 构建前端 (需要 Node.js 18+)
cd frontend
npm install
npm run build      # 输出到 ../src/main/resources/static/

# 2. 打包后端 (需要 JDK 17 + Maven)
cd ..
mvn clean package -DskipTests
# 产物: target/pve-connection.jar
```

前端开发模式（需后端同时运行在 8080 端口）：

```bash
cd frontend
npm run dev
```

