# PVE Connection Helper - Proxmox VE 连接助手

[![Java](https://img.shields.io/badge/Java-17-blue.svg?style=flat-square&logo=openjdk)](https://www.java.com)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-green.svg?style=flat-square&logo=spring)](https://spring.io/projects/spring-boot)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D.svg?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-latest-409EFF.svg?style=flat-square)](https://element-plus.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57.svg?style=flat-square&logo=sqlite)](https://www.sqlite.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED.svg?style=flat-square&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

一个轻量级的 Proxmox VE 虚拟机连接管理工具，提供统一的虚拟机和宿主机信息展示，支持快速生成 RDP、SSH、SMB 连接文件和 Web 链接。

## ✨ 功能特性

- **🖥️ 虚拟机管理**: 统一展示所有 PVE 虚拟机（KVM/LXC）的运行状态、资源使用情况
- **🏠 宿主机监控**: 实时查看宿主机 CPU、内存、磁盘、存储等资源信息
- **⚡ 快速连接**:
  - **RDP**: 一键下载 `.rdp` 文件，直接连接 Windows 虚拟机
  - **SSH**: 生成 Xshell 批处理脚本，快速连接 Linux 虚拟机
  - **SMB**: 自动生成 Windows 共享文件夹连接脚本
  - **Web链接**: 直接在浏览器打开虚拟机 Web 服务
- **📝 说明管理**: 为虚拟机和宿主机添加详细说明
- **🔐 连接信息管理**: 集中存储和管理连接凭据（用户名/密码/端口等）

## 📸 界面预览

![img.png](https://github.com/noNu1L/pve-connection-helper/blob/master/document/images/v1.0.0.png?raw=true)

## 🚀 Docker 部署
使用 Docker Compose 部署应用

#### 1. 准备文件
创建项目目录并准备以下文件：
```bash
pve-connection-helper/
├── docker-compose.yml
├── pve-connection-helper-1.0.jar      # 应用程序 JAR 包
└── pve-connection-helper.db           # 数据库文件
```

#### 2. 创建 docker-compose.yml

```yaml
version: '3'
services:
  pve-connection-helper:
    image: eclipse-temurin:17-jre-jammy
    container_name: pve-connection-helper
    restart: unless-stopped
    ports:
      - "80:8080"
    environment:
      - TZ=Asia/Shanghai
      - JAVA_OPTS=-Xms512M -Xmx1024M -XX:MetaspaceSize=256m -XX:MaxMetaspaceSize=512m
    volumes:
      - ./pve-connection-helper-1.0.jar:/pve-connection-helper.jar
      - ./pve-connection-helper.db:/pve-connection-helper.db
```

#### 3. 启动服务

```bash
# 启动容器
docker compose up -d

# 查看日志
docker compose logs -f

# 停止服务
docker compose down
```

#### 4. 访问应用

打开浏览器访问: `http://your-server-ip:port`

## 🔒 安全建议

- ⚠️ **密码使用明文储存，请执行进行安全管理**

