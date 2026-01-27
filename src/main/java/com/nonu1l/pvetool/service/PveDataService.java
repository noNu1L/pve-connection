package com.nonu1l.pvetool.service;

import com.fasterxml.jackson.databind.JsonNode;
import it.corsinvest.proxmoxve.api.PveClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * PVE 数据获取服务
 * 负责从 Proxmox VE API 获取虚拟机、宿主机、存储等数据
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PveDataService {

    private final PveClientService pveClientService;
    private final DataFormatService dataFormatService;

    /**
     * 获取所有虚拟机和宿主机数据
     */
    public Map<String, Object> getAllData() {
        Map<String, Object> result = new HashMap<>();
        try {
            PveClient client = pveClientService.getClient();
            if (client == null) {
                result.put("hosts", null);
                result.put("vms", null);
                result.put("error", "PVE 客户端未初始化，请先在设置中配置 PVE 连接信息");
                return result;
            }
            JsonNode data = client.getCluster().getResources().resources().getData();

            List<Map<String, Object>> vms = new ArrayList<>();
            Map<String, Map<String, Object>> hostsMap = new HashMap<>();
            Map<String, List<Map<String, Object>>> storagesByNode = new HashMap<>();

            // 第一遍遍历：收集宿主机和存储信息
            for (JsonNode node : data) {
                String type = node.has("type") ? node.get("type").asText() : "";

                if ("node".equals(type)) {
                    processHostNode(node, hostsMap, storagesByNode, client);
                } else if ("storage".equals(type)) {
                    processStorageNode(node, storagesByNode);
                }
            }

            // 将存储信息附加到对应的宿主机
            attachStoragesToHosts(hostsMap, storagesByNode);

            List<Map<String, Object>> hosts = new ArrayList<>(hostsMap.values());

            // 为宿主机数据添加格式化字段
            for (Map<String, Object> host : hosts) {
                dataFormatService.enrichWithFormattedData(host);
            }

            // 第二遍遍历：处理虚拟机
            for (JsonNode node : data) {
                String type = node.has("type") ? node.get("type").asText() : "";
                if ("qemu".equals(type) || "lxc".equals(type)) {
                    processVirtualMachine(node, vms, client);
                }
            }

            // 为虚拟机数据添加格式化字段
            for (Map<String, Object> vm : vms) {
                dataFormatService.enrichWithFormattedData(vm);
            }

            result.put("hosts", hosts);
            result.put("vms", vms);
            result.put("error", null);
            log.debug("成功获取 {} 个宿主机和 {} 个虚拟机信息", hosts.size(), vms.size());
        } catch (Exception e) {
            log.error("获取虚拟机数据失败", e);
            result.put("hosts", null);
            result.put("vms", null);
            result.put("error", "无法获取数据: " + e.getMessage());
        }
        return result;
    }

    /**
     * 处理宿主机节点信息
     */
    private void processHostNode(JsonNode node, Map<String, Map<String, Object>> hostsMap,
                                  Map<String, List<Map<String, Object>>> storagesByNode,
                                  PveClient client) {
        String nodeName = node.has("node") ? node.get("node").asText() : "";
        Map<String, Object> hostData = new HashMap<>();

        // 获取节点配置中的 description
        try {
            JsonNode nodeConfig = client.getNodes().get(nodeName).getConfig().getConfig().getData();
            hostData.put("description", nodeConfig.has("description") ? nodeConfig.get("description").asText() : "");
        } catch (Exception e) {
            log.warn("无法获取节点 {} 的配置信息: {}", nodeName, e.getMessage());
            hostData.put("description", "");
        }

        hostData.put("node", nodeName);
        hostData.put("status", node.has("status") ? node.get("status").asText() : "");
        hostData.put("cpus", node.has("maxcpu") ? node.get("maxcpu").asInt() : 0);
        hostData.put("maxmem", node.has("maxmem") ? node.get("maxmem").asLong() : 0L);
        hostData.put("maxdisk", node.has("maxdisk") ? node.get("maxdisk").asLong() : 0L);
        hostData.put("mem", node.has("mem") ? node.get("mem").asLong() : 0L);
        hostData.put("disk", node.has("disk") ? node.get("disk").asLong() : 0L);
        hostData.put("uptime", node.has("uptime") ? node.get("uptime").asDouble() : 0.0);
        hostData.put("cpuUsage", node.has("cpu") ? node.get("cpu").asDouble() : 0.0);
        hostData.put("type", "host");
        hostData.put("storages", new ArrayList<>());

        hostsMap.put(nodeName, hostData);
        storagesByNode.put(nodeName, new ArrayList<>());
    }

    /**
     * 处理存储节点信息
     */
    private void processStorageNode(JsonNode node, Map<String, List<Map<String, Object>>> storagesByNode) {
        String nodeName = node.has("node") ? node.get("node").asText() : "";
        String storageName = node.has("storage") ? node.get("storage").asText() : "";

        if (!nodeName.isEmpty() && !storageName.isEmpty()) {
            Map<String, Object> storageInfo = new HashMap<>();
            storageInfo.put("storage", storageName);
            storageInfo.put("type", node.has("plugintype") ? node.get("plugintype").asText() : "");
            storageInfo.put("content", node.has("content") ? node.get("content").asText() : "");
            storageInfo.put("status", node.has("status") ? node.get("status").asText() : "");
            storageInfo.put("used", node.has("disk") ? node.get("disk").asLong() : 0L);
            storageInfo.put("total", node.has("maxdisk") ? node.get("maxdisk").asLong() : 0L);
            storageInfo.put("avail", node.has("maxdisk") && node.has("disk") ?
                    node.get("maxdisk").asLong() - node.get("disk").asLong() : 0L);
            storageInfo.put("active", "available".equals(node.has("status") ? node.get("status").asText() : "") ? 1 : 0);

            if (storagesByNode.containsKey(nodeName)) {
                storagesByNode.get(nodeName).add(storageInfo);
            }
        }
    }

    /**
     * 将存储信息附加到宿主机
     */
    private void attachStoragesToHosts(Map<String, Map<String, Object>> hostsMap,
                                       Map<String, List<Map<String, Object>>> storagesByNode) {
        for (Map.Entry<String, List<Map<String, Object>>> entry : storagesByNode.entrySet()) {
            String nodeName = entry.getKey();
            if (hostsMap.containsKey(nodeName)) {
                hostsMap.get(nodeName).put("storages", entry.getValue());
            }
        }
    }

    /**
     * 处理虚拟机信息
     */
    private void processVirtualMachine(JsonNode node, List<Map<String, Object>> vms, PveClient client) {
        String vmidStr = node.has("vmid") ? node.get("vmid").asText() : null;
        if (vmidStr == null) return;

        String type = node.has("type") ? node.get("type").asText() : "";
        Map<String, Object> vmData = new HashMap<>();

        vmData.put("vmid", Integer.parseInt(vmidStr));
        vmData.put("node", node.has("node") ? node.get("node").asText() : "");
        vmData.put("name", node.has("name") ? node.get("name").asText() : "");
        vmData.put("type", type);
        vmData.put("status", node.has("status") ? node.get("status").asText() : "");
        vmData.put("cpus", node.has("maxcpu") ? node.get("maxcpu").asInt() : 0);
        vmData.put("maxmem", node.has("maxmem") ? node.get("maxmem").asLong() : 0L);
        vmData.put("maxdisk", node.has("maxdisk") ? node.get("maxdisk").asLong() : 0L);
        vmData.put("mem", node.has("mem") ? node.get("mem").asLong() : 0L);
        vmData.put("disk", node.has("disk") ? node.get("disk").asLong() : 0L);
        vmData.put("uptime", node.has("uptime") ? node.get("uptime").asDouble() : 0.0);
        vmData.put("cpuUsage", node.has("cpu") ? node.get("cpu").asDouble() : 0.0);
        vmData.put("tags", node.has("tags") ? node.get("tags").asText() : "");

        // 获取虚拟机备注
        String nodeName = String.valueOf(vmData.get("node"));
        try {
            JsonNode clientConfig;
            if ("qemu".equals(type)) {
                clientConfig = client.getNodes().get(nodeName).getQemu().get(vmidStr).getConfig().vmConfig().getData();
            } else {
                clientConfig = client.getNodes().get(nodeName).getLxc().get(vmidStr).getConfig().vmConfig().getData();
            }
            vmData.put("description", clientConfig.has("description") ? clientConfig.get("description").asText() : "");
        } catch (Exception e) {
            log.warn("无法获取虚拟机 {} 的配置信息: {}", vmidStr, e.getMessage());
            vmData.put("description", "");
        }

        vms.add(vmData);
    }
}
