package com.nonu1l.pvetool.model;

import lombok.Data;

import java.util.*;

@Data
public class StorageData {
    private Map<String, String> config = new HashMap<>();
    private Map<String, String> hostExplains = new HashMap<>();
    private Map<String, String> vmExplains = new HashMap<>();
    private List<HostConnection> hostConnections = new ArrayList<>();
    private List<VmConnection> vmConnections = new ArrayList<>();
    private long nextConnectionId = 1;
}
