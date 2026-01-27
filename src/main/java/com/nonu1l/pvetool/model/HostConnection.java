package com.nonu1l.pvetool.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HostConnection {
    private Long id;
    private String node;
    private String connType;
    private String name;
    private String address;
    private Integer port;
    private String username;
    private String password;
}
