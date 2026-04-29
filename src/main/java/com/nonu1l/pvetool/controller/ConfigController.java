package com.nonu1l.pvetool.controller;

import com.nonu1l.pvetool.service.ConfigService;
import com.nonu1l.pvetool.service.PveClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 配置管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/config")
@RequiredArgsConstructor
public class ConfigController {

    private final ConfigService configService;
    private final PveClientService pveClientService;

    /**
     * 获取所有配置
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllConfig() {
        try {
            Map<String, String> configs = configService.getAllConfig();

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", configs);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("获取配置失败", e);
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(result);
        }
    }

    /**
     * 检查是否首次运行
     */
    @GetMapping("/first-run")
    public ResponseEntity<Map<String, Object>> checkFirstRun() {
        try {
            boolean firstRun = configService.isFirstRun();
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("firstRun", firstRun);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("检查首次运行状态失败", e);
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(result);
        }
    }

    /**
     * 保存配置
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> saveConfig(@RequestBody Map<String, String> configs) {
        try {
            // 如果密码是脱敏的，不更新
            if ("******".equals(configs.get(ConfigService.KEY_PVE_PASSWORD))) {
                configs.remove(ConfigService.KEY_PVE_PASSWORD);
            }

            configService.saveAll(configs);

            // 如果是首次配置，标记为已配置
            if (configService.isFirstRun()) {
                configService.markConfigured();
            }

            // 重新初始化 PVE 客户端
            pveClientService.reinit();

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "配置保存成功");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("保存配置失败", e);
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(result);
        }
    }

    /**
     * 获取菜单是否显示备注的配置
     */
    @GetMapping("/menu-show-description")
    public ResponseEntity<Map<String, Object>> getMenuShowDescription() {
        try {
            boolean showDescription = configService.isMenuShowDescription();
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("showDescription", showDescription);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("获取菜单显示配置失败", e);
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(result);
        }
    }
}
