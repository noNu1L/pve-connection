package com.nonu1l.pvetool.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.nonu1l.pvetool.model.HostConnection;
import com.nonu1l.pvetool.model.StorageData;
import com.nonu1l.pvetool.model.VmConnection;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.stream.Collectors;

@Slf4j
@Service
public class JsonStorageService {

    private static final String CONFIG_FILE = "config.json";
    private final ObjectMapper objectMapper;
    private StorageData data;
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();

    public JsonStorageService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
        this.data = load();
    }

    private StorageData load() {
        File file = new File(CONFIG_FILE);
        if (!file.exists()) {
            log.info("配置文件不存在，创建默认配置");
            return new StorageData();
        }
        try {
            return objectMapper.readValue(file, StorageData.class);
        } catch (IOException e) {
            log.error("读取配置文件失败", e);
            return new StorageData();
        }
    }

    private void save() {
        try {
            objectMapper.writeValue(new File(CONFIG_FILE), data);
        } catch (IOException e) {
            log.error("保存配置文件失败", e);
        }
    }

    // ========== Config ==========

    public String getConfigValue(String key) {
        lock.readLock().lock();
        try {
            return data.getConfig().get(key);
        } finally {
            lock.readLock().unlock();
        }
    }

    public Map<String, String> getAllConfig() {
        lock.readLock().lock();
        try {
            return new HashMap<>(data.getConfig());
        } finally {
            lock.readLock().unlock();
        }
    }

    public void setConfigValue(String key, String value) {
        lock.writeLock().lock();
        try {
            data.getConfig().put(key, value);
            save();
        } finally {
            lock.writeLock().unlock();
        }
    }

    public void setAllConfig(Map<String, String> configs) {
        lock.writeLock().lock();
        try {
            for (Map.Entry<String, String> entry : configs.entrySet()) {
                data.getConfig().put(entry.getKey(), entry.getValue());
            }
            save();
        } finally {
            lock.writeLock().unlock();
        }
    }

    // ========== Host Explain ==========

    public String getHostExplain(String node) {
        lock.readLock().lock();
        try {
            return data.getHostExplains().getOrDefault(node, "");
        } finally {
            lock.readLock().unlock();
        }
    }

    public void saveHostExplain(String node, String explain) {
        lock.writeLock().lock();
        try {
            data.getHostExplains().put(node, explain);
            save();
        } finally {
            lock.writeLock().unlock();
        }
    }

    // ========== VM Explain ==========

    public String getVmExplain(Integer vmid) {
        lock.readLock().lock();
        try {
            return data.getVmExplains().getOrDefault(String.valueOf(vmid), "");
        } finally {
            lock.readLock().unlock();
        }
    }

    public void saveVmExplain(Integer vmid, String explain) {
        lock.writeLock().lock();
        try {
            data.getVmExplains().put(String.valueOf(vmid), explain);
            save();
        } finally {
            lock.writeLock().unlock();
        }
    }

    // ========== Host Connections ==========

    public List<HostConnection> getHostConnections(String node) {
        lock.readLock().lock();
        try {
            return data.getHostConnections().stream()
                    .filter(c -> node.equals(c.getNode()))
                    .collect(Collectors.toList());
        } finally {
            lock.readLock().unlock();
        }
    }

    public HostConnection saveHostConnection(String node, HostConnection connection) {
        lock.writeLock().lock();
        try {
            connection.setNode(node);
            if (connection.getId() != null) {
                data.getHostConnections().removeIf(c -> c.getId().equals(connection.getId()));
            } else {
                connection.setId(data.getNextConnectionId());
                data.setNextConnectionId(data.getNextConnectionId() + 1);
            }
            data.getHostConnections().add(connection);
            save();
            return connection;
        } finally {
            lock.writeLock().unlock();
        }
    }

    public void deleteHostConnection(Long id) {
        lock.writeLock().lock();
        try {
            data.getHostConnections().removeIf(c -> c.getId().equals(id));
            save();
        } finally {
            lock.writeLock().unlock();
        }
    }

    // ========== VM Connections ==========

    public List<VmConnection> getVmConnections(Integer vmid) {
        lock.readLock().lock();
        try {
            return data.getVmConnections().stream()
                    .filter(c -> vmid.equals(c.getVmid()))
                    .collect(Collectors.toList());
        } finally {
            lock.readLock().unlock();
        }
    }

    public VmConnection saveVmConnection(Integer vmid, VmConnection connection) {
        lock.writeLock().lock();
        try {
            connection.setVmid(vmid);
            if (connection.getId() != null) {
                data.getVmConnections().removeIf(c -> c.getId().equals(connection.getId()));
            } else {
                connection.setId(data.getNextConnectionId());
                data.setNextConnectionId(data.getNextConnectionId() + 1);
            }
            data.getVmConnections().add(connection);
            save();
            return connection;
        } finally {
            lock.writeLock().unlock();
        }
    }

    public void deleteVmConnection(Long id) {
        lock.writeLock().lock();
        try {
            data.getVmConnections().removeIf(c -> c.getId().equals(id));
            save();
        } finally {
            lock.writeLock().unlock();
        }
    }
}
