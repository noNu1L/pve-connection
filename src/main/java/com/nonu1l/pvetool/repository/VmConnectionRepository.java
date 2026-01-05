package com.nonu1l.pvetool.repository;

import com.nonu1l.pvetool.entity.VmConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VmConnectionRepository extends JpaRepository<VmConnection, Long> {
    List<VmConnection> findByVmid(Integer vmid);
}
