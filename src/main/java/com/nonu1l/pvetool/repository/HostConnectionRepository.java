package com.nonu1l.pvetool.repository;

import com.nonu1l.pvetool.entity.HostConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostConnectionRepository extends JpaRepository<HostConnection, Long> {
    List<HostConnection> findByNode(String node);
}
