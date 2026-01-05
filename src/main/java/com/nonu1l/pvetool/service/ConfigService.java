package com.nonu1l.pvetool.service;

import com.nonu1l.pvetool.entity.Config;
import com.nonu1l.pvetool.repository.ConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 配置管理服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ConfigService {

    private final ConfigRepository configRepository;

    // 配置键常量
    public static final String KEY_PVE_IP = "pve_ip";
    public static final String KEY_PVE_PORT = "pve_port";
    public static final String KEY_PVE_USERNAME = "pve_username";
    public static final String KEY_PVE_PASSWORD = "pve_password";
    public static final String KEY_MENU_SHOW_DESCRIPTION = "menu_show_description";
    public static final String KEY_FIRST_RUN = "first_run";

    /**
     * 获取配置值
     */
    public String getValue(String key) {
        return configRepository.findById(key)
                .map(Config::getValue)
                .orElse(null);
    }

    /**
     * 获取配置值（带默认值）
     */
    public String getValue(String key, String defaultValue) {
        String value = getValue(key);
        return value != null ? value : defaultValue;
    }

    /**
     * 获取所有配置
     */
    public Map<String, String> getAllConfig() {
        List<Config> configs = configRepository.findAll();
        Map<String, String> result = new HashMap<>();
        for (Config config : configs) {
            result.put(config.getKey(), config.getValue());
        }
        return result;
    }

    /**
     * 保存配置值
     */
    @Transactional
    public void setValue(String key, String value) {
        Config config = configRepository.findById(key)
                .orElse(new Config(key, value, null));
        config.setValue(value);
        configRepository.save(config);
        log.info("配置已更新: {} = {}", key, key.contains("password") ? "******" : value);
    }

    /**
     * 批量保存配置
     */
    @Transactional
    public void saveAll(Map<String, String> configs) {
        for (Map.Entry<String, String> entry : configs.entrySet()) {
            setValue(entry.getKey(), entry.getValue());
        }
    }

    /**
     * 检查是否首次运行
     */
    public boolean isFirstRun() {
        String firstRun = getValue(KEY_FIRST_RUN, "1");
        return "1".equals(firstRun);
    }

    /**
     * 设置已完成首次配置
     */
    @Transactional
    public void markConfigured() {
        setValue(KEY_FIRST_RUN, "0");
        log.info("首次运行标记已更新");
    }

    /**
     * 获取 PVE 连接配置
     */
    public Map<String, String> getPveConfig() {
        Map<String, String> pveConfig = new HashMap<>();
        pveConfig.put("ip", getValue(KEY_PVE_IP, ""));
        pveConfig.put("port", getValue(KEY_PVE_PORT, "8006"));
        pveConfig.put("username", getValue(KEY_PVE_USERNAME, ""));
        pveConfig.put("password", getValue(KEY_PVE_PASSWORD, ""));
        return pveConfig;
    }

    /**
     * 检查菜单是否显示备注
     */
    public boolean isMenuShowDescription() {
        String value = getValue(KEY_MENU_SHOW_DESCRIPTION, "1");
        return "1".equals(value);
    }
}
