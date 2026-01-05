package com.nonu1l.pvetool.service;

import com.nonu1l.pvetool.entity.HostConnection;
import com.nonu1l.pvetool.entity.HostInfo;
import com.nonu1l.pvetool.repository.HostConnectionRepository;
import com.nonu1l.pvetool.repository.HostInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 宿主机业务服务
 * 负责宿主机的说明和连接信息管理
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class HostService {

    private final HostInfoRepository hostInfoRepository;
    private final HostConnectionRepository hostConnectionRepository;

    /**
     * 获取宿主机说明
     */
    public String getExplain(String node) {
        Optional<HostInfo> host = hostInfoRepository.findById(node);
        return host.map(HostInfo::getExplain).orElse("");
    }

    /**
     * 保存宿主机说明
     */
    @Transactional
    public void saveExplain(String node, String explain) {
        HostInfo host = hostInfoRepository.findById(node)
                .orElse(new HostInfo(node, explain));
        host.setExplain(explain);
        hostInfoRepository.save(host);
        log.info("保存宿主机 {} 说明成功", node);
    }

    /**
     * 获取宿主机连接信息列表
     */
    public List<HostConnection> getConnections(String node) {
        return hostConnectionRepository.findByNode(node);
    }

    /**
     * 保存宿主机连接信息
     */
    @Transactional
    public HostConnection saveConnection(String node, HostConnection connection) {
        connection.setNode(node);
        HostConnection saved = hostConnectionRepository.save(connection);
        log.info("保存宿主机 {} 连接信息成功: {}", node, connection.getName());
        return saved;
    }

    /**
     * 删除宿主机连接信息
     */
    @Transactional
    public void deleteConnection(Long id) {
        hostConnectionRepository.deleteById(id);
        log.info("删除宿主机连接信息成功: {}", id);
    }
}
