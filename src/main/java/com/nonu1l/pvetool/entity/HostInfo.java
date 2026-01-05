package com.nonu1l.pvetool.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "host_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HostInfo {
    @Id
    @Column(name = "node", nullable = false, length = 100)
    private String node;

    @Column(name = "explain", columnDefinition = "TEXT")
    private String explain;
}
