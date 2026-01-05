package com.nonu1l.pvetool.repository;

import com.nonu1l.pvetool.entity.HostInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HostInfoRepository extends JpaRepository<HostInfo, String> {
}
