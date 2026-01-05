package com.nonu1l.pvetool.repository;

import com.nonu1l.pvetool.entity.VirtualMachine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VirtualMachineRepository extends JpaRepository<VirtualMachine, Integer> {
}
