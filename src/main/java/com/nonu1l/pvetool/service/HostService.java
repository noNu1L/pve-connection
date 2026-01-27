package com.nonu1l.pvetool.service;

import com.nonu1l.pvetool.model.HostConnection;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class HostService {

    private final JsonStorageService jsonStorageService;

    public String getExplain(String node) {
        return jsonStorageService.getHostExplain(node);
    }

    public void saveExplain(String node, String explain) {
        jsonStorageService.saveHostExplain(node, explain);
        log.info("保存宿主机 {} 说明成功", node);
    }

    public List<HostConnection> getConnections(String node) {
        return jsonStorageService.getHostConnections(node);
    }

    public HostConnection saveConnection(String node, HostConnection connection) {
        HostConnection saved = jsonStorageService.saveHostConnection(node, connection);
        log.info("保存宿主机 {} 连接信息成功: {}", node, connection.getName());
        return saved;
    }

    public void deleteConnection(Long id) {
        jsonStorageService.deleteHostConnection(id);
        log.info("删除宿主机连接信息成功: {}", id);
    }
}
