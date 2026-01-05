package com.nonu1l.pvetool.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vm_connections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VmConnection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vmid", nullable = false)
    private Integer vmid;

    @Column(name = "conn_type", nullable = false, length = 50)
    private String connType;

    @Column(name = "name", length = 255)
    private String name;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "port")
    private Integer port;

    @Column(name = "username", length = 100)
    private String username;

    @Column(name = "password", length = 255)
    private String password;
}
