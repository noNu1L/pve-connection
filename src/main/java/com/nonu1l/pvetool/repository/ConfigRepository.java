package com.nonu1l.pvetool.repository;

import com.nonu1l.pvetool.entity.Config;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConfigRepository extends JpaRepository<Config, String> {
    Optional<Config> findByKey(String key);
}
