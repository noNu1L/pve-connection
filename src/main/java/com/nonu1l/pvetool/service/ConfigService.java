package com.nonu1l.pvetool.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConfigService {

    private final JsonStorageService jsonStorageService;

    public static final String KEY_PVE_IP = "pve_ip";
    public static final String KEY_PVE_PORT = "pve_port";
    public static final String KEY_PVE_USERNAME = "pve_username";
    public static final String KEY_PVE_PASSWORD = "pve_password";
    public static final String KEY_MENU_SHOW_DESCRIPTION = "menu_show_description";
    public static final String KEY_FIRST_RUN = "first_run";

    public String getValue(String key) {
        return jsonStorageService.getConfigValue(key);
    }

    public String getValue(String key, String defaultValue) {
        String value = getValue(key);
        return value != null ? value : defaultValue;
    }

    public Map<String, String> getAllConfig() {
        return jsonStorageService.getAllConfig();
    }

    public void setValue(String key, String value) {
        jsonStorageService.setConfigValue(key, value);
        log.info("配置已更新: {} = {}", key, key.contains("password") ? "******" : value);
    }

    public void saveAll(Map<String, String> configs) {
        jsonStorageService.setAllConfig(configs);
        log.info("批量配置已更新");
    }

    public boolean isFirstRun() {
        String firstRun = getValue(KEY_FIRST_RUN, "1");
        return "1".equals(firstRun);
    }

    public void markConfigured() {
        setValue(KEY_FIRST_RUN, "0");
        log.info("首次运行标记已更新");
    }

    public Map<String, String> getPveConfig() {
        Map<String, String> pveConfig = new HashMap<>();
        pveConfig.put("ip", getValue(KEY_PVE_IP, ""));
        pveConfig.put("port", getValue(KEY_PVE_PORT, "8006"));
        pveConfig.put("username", getValue(KEY_PVE_USERNAME, ""));
        pveConfig.put("password", getValue(KEY_PVE_PASSWORD, ""));
        return pveConfig;
    }

    public boolean isMenuShowDescription() {
        String value = getValue(KEY_MENU_SHOW_DESCRIPTION, "1");
        return "1".equals(value);
    }
}
