package com.nonu1l.pvetool.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VmConnection {
    private Long id;
    private Integer vmid;
    private String connType;
    private String name;
    private String address;
    private Integer port;
    private String username;
    private String password;
}
