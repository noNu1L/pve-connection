package com.nonu1l.pvetool.controller;

import com.nonu1l.pvetool.model.HostConnection;
import com.nonu1l.pvetool.model.VmConnection;
import com.nonu1l.pvetool.service.HostService;
import com.nonu1l.pvetool.service.PveClientService;
import com.nonu1l.pvetool.service.PveDataService;
import com.nonu1l.pvetool.service.VmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 虚拟机管理控制器
 * 只负责接收 HTTP 请求和返回响应，业务逻辑委托给 Service 层处理
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class VmController {

    private final PveClientService pveClientService;
    private final PveDataService pveDataService;
    private final VmService vmService;
    private final HostService hostService;

    /**
     * 首页
     */
    @GetMapping("/")
    public String index() {
        pveClientService.init();
        return "index";
    }

    /**
     * 获取所有虚拟机和宿主机数据
     */
    @GetMapping("/api/data")
    @ResponseBody
    public Map<String, Object> getData() {
        return pveDataService.getAllData();
    }

    // ========== 虚拟机相关 API ==========

    /**
     * 获取虚拟机说明
     */
    @GetMapping("/api/vm/{vmid}/explain")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getVmExplain(@PathVariable Integer vmid) {
        try {
            String explain = vmService.getExplain(vmid);
            Map<String, Object> result = new HashMap<>();
            result.put("explain", explain);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("获取虚拟机说明失败", e);
            Map<String, Object> result = new HashMap<>();
            result.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(result);
        }
    }

    /**
     * 保存虚拟机说明
     */
    @PostMapping("/api/vm/{vmid}/explain")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> saveVmExplain(@PathVariable Integer vmid,
                                                             @RequestBody Map<String, String> request) {
        try {
            String explain = request.get("explain");
            vmService.saveExplain(vmid, explain);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("保存虚拟机说明失败", e);
            Map<String, Object> result = new HashMap<>();
            result.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(result);
        }
    }

    /**
     * 获取虚拟机连接信息
     */
    @GetMapping("/api/vm/{vmid}/connections")
    @ResponseBody
    public ResponseEntity<List<VmConnection>> getVmConnections(@PathVariable Integer vmid) {
        try {
            List<VmConnection> connections = vmService.getConnections(vmid);
            return ResponseEntity.ok(connections);
        } catch (Exception e) {
            log.error("获取虚拟机连接信息失败", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 保存虚拟机连接信息
     */
    @PostMapping("/api/vm/{vmid}/connections")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> saveVmConnection(@PathVariable Integer vmid,
                                                                @RequestBody VmConnection connection) {
        try {
            VmConnection saved = vmService.saveConnection(vmid, connection);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("id", saved.getId());
            result.put("data", saved);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("保存虚拟机连接信息失败", e);
            Map<String, Object> result = new HashMap<>();
            result.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(result);
        }
    }

    /**
     * 删除虚拟机连接信息
     */
    @DeleteMapping("/api/connections/{id}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> deleteVmConnection(@PathVariable Long id) {
        try {
            vmService.deleteConnection(id);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("删除虚拟机连接信息失败", e);
            Map<String, Object> result = new HashMap<>();
            result.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(result);
        }
    }

    // ========== 宿主机相关 API ==========

    /**
     * 获取宿主机说明
     */
    @GetMapping("/api/host/{node}/explain")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getHostExplain(@PathVariable String node) {
        try {
            String explain = hostService.getExplain(node);
            Map<String, Object> result = new HashMap<>();
            result.put("explain", explain);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("获取宿主机说明失败", e);
            Map<String, Object> result = new HashMap<>();
            result.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(result);
        }
    }

    /**
     * 保存宿主机说明
     */
    @PostMapping("/api/host/{node}/explain")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> saveHostExplain(@PathVariable String node,
                                                               @RequestBody Map<String, String> request) {
        try {
            String explain = request.get("explain");
            hostService.saveExplain(node, explain);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("保存宿主机说明失败", e);
            Map<String, Object> result = new HashMap<>();
            result.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(result);
        }
    }

    /**
     * 获取宿主机连接信息
     */
    @GetMapping("/api/host/{node}/connections")
    @ResponseBody
    public ResponseEntity<List<HostConnection>> getHostConnections(@PathVariable String node) {
        try {
            List<HostConnection> connections = hostService.getConnections(node);
            return ResponseEntity.ok(connections);
        } catch (Exception e) {
            log.error("获取宿主机连接信息失败", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 保存宿主机连接信息
     */
    @PostMapping("/api/host/{node}/connections")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> saveHostConnection(@PathVariable String node,
                                                                  @RequestBody HostConnection connection) {
        try {
            HostConnection saved = hostService.saveConnection(node, connection);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("id", saved.getId());
            result.put("data", saved);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("保存宿主机连接信息失败", e);
            Map<String, Object> result = new HashMap<>();
            result.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(result);
        }
    }

    /**
     * 删除宿主机连接信息
     */
    @DeleteMapping("/api/host/connections/{id}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> deleteHostConnection(@PathVariable Long id) {
        try {
            hostService.deleteConnection(id);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("删除宿主机连接信息失败", e);
            Map<String, Object> result = new HashMap<>();
            result.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(result);
        }
    }
}
