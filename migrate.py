"""
将 pve-connection-helper.db (SQLite) 数据迁移到 config.json
"""
import sqlite3
import json
import os
import sys

DB_FILE = "pve-connection-helper.db"
JSON_FILE = "config.json"


def migrate():
    if not os.path.exists(DB_FILE):
        print(f"错误: 数据库文件 {DB_FILE} 不存在")
        sys.exit(1)

    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row

    data = {
        "config": {},
        "hostExplains": {},
        "vmExplains": {},
        "hostConnections": [],
        "vmConnections": [],
        "nextConnectionId": 1
    }

    max_id = 0

    # 1. 迁移 config 表
    try:
        rows = conn.execute("SELECT key, value FROM config").fetchall()
        for row in rows:
            data["config"][row["key"]] = row["value"]
        print(f"  config: {len(rows)} 条记录")
    except Exception as e:
        print(f"  config: 跳过 ({e})")

    # 2. 迁移 host_info 表
    try:
        rows = conn.execute("SELECT node, explain FROM host_info").fetchall()
        for row in rows:
            if row["explain"]:
                data["hostExplains"][row["node"]] = row["explain"]
        print(f"  host_info: {len(rows)} 条记录")
    except Exception as e:
        print(f"  host_info: 跳过 ({e})")

    # 3. 迁移 host_connections 表
    try:
        rows = conn.execute(
            "SELECT id, node, conn_type, name, address, port, username, password FROM host_connections"
        ).fetchall()
        for row in rows:
            conn_id = row["id"]
            if conn_id > max_id:
                max_id = conn_id
            data["hostConnections"].append({
                "id": conn_id,
                "node": row["node"],
                "connType": row["conn_type"],
                "name": row["name"],
                "address": row["address"],
                "port": row["port"],
                "username": row["username"],
                "password": row["password"]
            })
        print(f"  host_connections: {len(rows)} 条记录")
    except Exception as e:
        print(f"  host_connections: 跳过 ({e})")

    # 4. 迁移 virtual_machines 表
    try:
        rows = conn.execute("SELECT vmid, explain FROM virtual_machines").fetchall()
        for row in rows:
            if row["explain"]:
                data["vmExplains"][str(row["vmid"])] = row["explain"]
        print(f"  virtual_machines: {len(rows)} 条记录")
    except Exception as e:
        print(f"  virtual_machines: 跳过 ({e})")

    # 5. 迁移 vm_connections 表
    try:
        rows = conn.execute(
            "SELECT id, vmid, conn_type, name, address, port, username, password FROM vm_connections"
        ).fetchall()
        for row in rows:
            conn_id = row["id"]
            if conn_id > max_id:
                max_id = conn_id
            data["vmConnections"].append({
                "id": conn_id,
                "vmid": row["vmid"],
                "connType": row["conn_type"],
                "name": row["name"],
                "address": row["address"],
                "port": row["port"],
                "username": row["username"],
                "password": row["password"]
            })
        print(f"  vm_connections: {len(rows)} 条记录")
    except Exception as e:
        print(f"  vm_connections: 跳过 ({e})")

    conn.close()

    # 设置 nextConnectionId
    data["nextConnectionId"] = max_id + 1

    # 写入 JSON
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n迁移完成 -> {JSON_FILE}")


if __name__ == "__main__":
    print(f"开始迁移: {DB_FILE} -> {JSON_FILE}\n")
    migrate()
