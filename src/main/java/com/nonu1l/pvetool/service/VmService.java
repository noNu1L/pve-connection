package com.nonu1l.pvetool.service;

import com.nonu1l.pvetool.model.VmConnection;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class VmService {

    private final JsonStorageService jsonStorageService;

    public String getExplain(Integer vmid) {
        return jsonStorageService.getVmExplain(vmid);
    }

    public void saveExplain(Integer vmid, String explain) {
        jsonStorageService.saveVmExplain(vmid, explain);
        log.info("保存虚拟机 {} 说明成功", vmid);
    }

    public List<VmConnection> getConnections(Integer vmid) {
        return jsonStorageService.getVmConnections(vmid);
    }

    public VmConnection saveConnection(Integer vmid, VmConnection connection) {
        VmConnection saved = jsonStorageService.saveVmConnection(vmid, connection);
        log.info("保存虚拟机 {} 连接信息成功: {}", vmid, connection.getName());
        return saved;
    }

    public void deleteConnection(Long id) {
        jsonStorageService.deleteVmConnection(id);
        log.info("删除虚拟机连接信息成功: {}", id);
    }
}
