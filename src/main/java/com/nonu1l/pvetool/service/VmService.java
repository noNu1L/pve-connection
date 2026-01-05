package com.nonu1l.pvetool.service;

import com.nonu1l.pvetool.entity.VirtualMachine;
import com.nonu1l.pvetool.entity.VmConnection;
import com.nonu1l.pvetool.repository.VirtualMachineRepository;
import com.nonu1l.pvetool.repository.VmConnectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 虚拟机业务服务
 * 负责虚拟机的说明和连接信息管理
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VmService {

    private final VirtualMachineRepository virtualMachineRepository;
    private final VmConnectionRepository vmConnectionRepository;

    /**
     * 获取虚拟机说明
     */
    public String getExplain(Integer vmid) {
        Optional<VirtualMachine> vm = virtualMachineRepository.findById(vmid);
        return vm.map(VirtualMachine::getExplain).orElse("");
    }

    /**
     * 保存虚拟机说明
     */
    @Transactional
    public void saveExplain(Integer vmid, String explain) {
        VirtualMachine vm = virtualMachineRepository.findById(vmid)
                .orElse(new VirtualMachine(vmid, explain));
        vm.setExplain(explain);
        virtualMachineRepository.save(vm);
        log.info("保存虚拟机 {} 说明成功", vmid);
    }

    /**
     * 获取虚拟机连接信息列表
     */
    public List<VmConnection> getConnections(Integer vmid) {
        return vmConnectionRepository.findByVmid(vmid);
    }

    /**
     * 保存虚拟机连接信息
     */
    @Transactional
    public VmConnection saveConnection(Integer vmid, VmConnection connection) {
        connection.setVmid(vmid);
        VmConnection saved = vmConnectionRepository.save(connection);
        log.info("保存虚拟机 {} 连接信息成功: {}", vmid, connection.getName());
        return saved;
    }

    /**
     * 删除虚拟机连接信息
     */
    @Transactional
    public void deleteConnection(Long id) {
        vmConnectionRepository.deleteById(id);
        log.info("删除虚拟机连接信息成功: {}", id);
    }
}
