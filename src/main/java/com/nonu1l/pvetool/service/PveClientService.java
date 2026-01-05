package com.nonu1l.pvetool.service;

import it.corsinvest.proxmoxve.api.PveClient;
import it.corsinvest.proxmoxve.api.PveExceptionAuthentication;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PveClientService {

    private final ConfigService configService;

    @Getter
    private PveClient client;

    /**
     * 初始化 PVE 客户端
     * 从数据库读取配置
     */
    public void init() {
        Map<String, String> pveConfig = configService.getPveConfig();

        String pveHost = pveConfig.get("ip");
        String pvePortStr = pveConfig.get("port");
        String pveUsername = pveConfig.get("username");
        String pvePassword = pveConfig.get("password");

        // 检查必要配置
        if (pveHost == null || pveHost.isEmpty() ||
            pveUsername == null || pveUsername.isEmpty() ||
            pvePassword == null || pvePassword.isEmpty()) {
            log.warn("PVE 配置不完整，请先完成配置");
            return;
        }

        int pvePort = 8006; // 默认端口
        try {
            pvePort = Integer.parseInt(pvePortStr);
        } catch (NumberFormatException e) {
            log.warn("PVE 端口配置无效，使用默认端口 8006");
        }

        client = new PveClient(pveHost, pvePort);
        try {
            boolean login = client.login(pveUsername, pvePassword);
            if (!login) {
                log.error("登录 PVE 失败");
            } else {
                log.info("登录 PVE 成功: {}:{}", pveHost, pvePort);
            }
        } catch (PveExceptionAuthentication e) {
            log.error("PVE 认证失败，请检查配置", e);
        }
    }

    /**
     * 重新初始化客户端（配置更新后调用）
     */
    public void reinit() {
        log.info("重新初始化 PVE 客户端");
        init();
    }
}

