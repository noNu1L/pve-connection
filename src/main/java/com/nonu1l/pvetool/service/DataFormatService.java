package com.nonu1l.pvetool.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

/**
 * 数据格式化服务
 * 负责将原始数据转换为前端友好的格式
 */
@Service
public class DataFormatService {

    /**
     * 将字节转换为GB（保留1位小数）
     */
    public String formatGB(Long bytes) {
        if (bytes == null || bytes == 0) {
            return "0.0";
        }
        BigDecimal gb = new BigDecimal(bytes)
                .divide(new BigDecimal(1024 * 1024 * 1024), 1, RoundingMode.HALF_UP);
        return gb.toPlainString();
    }

    /**
     * 将小数转换为百分比（保留2位小数）
     */
    public String formatPercent(Double value) {
        if (value == null) {
            return "-";
        }
        BigDecimal percent = new BigDecimal(value * 100)
                .setScale(2, RoundingMode.HALF_UP);
        return percent.toPlainString() + "%";
    }

    /**
     * 将秒转换为小时（保留1位小数）
     */
    public String formatUptime(Double seconds) {
        if (seconds == null || seconds <= 0) {
            return "-";
        }
        BigDecimal hours = new BigDecimal(seconds / 3600)
                .setScale(1, RoundingMode.HALF_UP);
        return hours.toPlainString() + " 小时";
    }

    /**
     * 为虚拟机/宿主机数据添加格式化字段
     */
    public void enrichWithFormattedData(Map<String, Object> data) {
        // 格式化内存
        if (data.containsKey("mem")) {
            Long mem = ((Number) data.get("mem")).longValue();
            data.put("memFormatted", formatGB(mem));
        }

        if (data.containsKey("maxmem")) {
            Long maxmem = ((Number) data.get("maxmem")).longValue();
            data.put("maxmemFormatted", formatGB(maxmem));
        }

        // 计算并格式化内存使用率
        if (data.containsKey("mem") && data.containsKey("maxmem")) {
            Long mem = ((Number) data.get("mem")).longValue();
            Long maxmem = ((Number) data.get("maxmem")).longValue();
            if (maxmem > 0) {
                double memUsageRatio = (double) mem / maxmem;
                data.put("memUsageFormatted", formatPercent(memUsageRatio));
            } else {
                data.put("memUsageFormatted", "-");
            }
        }

        // 格式化磁盘
        if (data.containsKey("disk")) {
            Long disk = ((Number) data.get("disk")).longValue();
            data.put("diskFormatted", formatGB(disk));
        }

        if (data.containsKey("maxdisk")) {
            Long maxdisk = ((Number) data.get("maxdisk")).longValue();
            data.put("maxdiskFormatted", formatGB(maxdisk));
        }

        // 格式化CPU使用率
        if (data.containsKey("cpuUsage")) {
            Double cpuUsage = ((Number) data.get("cpuUsage")).doubleValue();
            data.put("cpuUsageFormatted", formatPercent(cpuUsage));
        }

        // 格式化运行时长
        if (data.containsKey("uptime")) {
            Double uptime = ((Number) data.get("uptime")).doubleValue();
            data.put("uptimeFormatted", formatUptime(uptime));
        }

        // 格式化存储信息（如果有）
        if (data.containsKey("storages") && data.get("storages") instanceof java.util.List) {
            @SuppressWarnings("unchecked")
            java.util.List<Map<String, Object>> storages = (java.util.List<Map<String, Object>>) data.get("storages");
            for (Map<String, Object> storage : storages) {
                enrichStorageData(storage);
            }
        }
    }

    /**
     * 为存储数据添加格式化字段
     */
    private void enrichStorageData(Map<String, Object> storage) {
        // 格式化存储容量
        if (storage.containsKey("used")) {
            Long used = ((Number) storage.get("used")).longValue();
            storage.put("usedFormatted", formatGB(used));
        }

        if (storage.containsKey("total")) {
            Long total = ((Number) storage.get("total")).longValue();
            storage.put("totalFormatted", formatGB(total));
        }

        if (storage.containsKey("avail")) {
            Long avail = ((Number) storage.get("avail")).longValue();
            storage.put("availFormatted", formatGB(avail));
        }

        // 计算并格式化存储使用率
        if (storage.containsKey("used") && storage.containsKey("total")) {
            Long used = ((Number) storage.get("used")).longValue();
            Long total = ((Number) storage.get("total")).longValue();
            if (total > 0) {
                double usageRatio = (double) used / total;
                storage.put("usageFormatted", formatPercent(usageRatio));
            } else {
                storage.put("usageFormatted", "-");
            }
        }
    }
}
