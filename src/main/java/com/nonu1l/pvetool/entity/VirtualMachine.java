package com.nonu1l.pvetool.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "virtual_machines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirtualMachine {
    @Id
    @Column(name = "vmid", nullable = false)
    private Integer vmid;

    @Column(name = "explain", columnDefinition = "TEXT")
    private String explain;
}
