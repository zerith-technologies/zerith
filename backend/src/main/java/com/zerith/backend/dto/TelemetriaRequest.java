package com.zerith.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.Instant;

public class TelemetriaRequest {

    @NotNull
    private Instant timestamp;

    @NotBlank
    @Pattern(regexp = "0x(05|0B|0C|0D|24)", message = "PID não suportado")
    private String pid;

    @NotBlank
    private String name;

    @NotNull
    private Double value;

    @NotBlank
    private String unit;

    @JsonProperty("raw_bytes")
    private String rawBytes;

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public String getPid() { return pid; }
    public void setPid(String pid) { this.pid = pid; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public String getRawBytes() { return rawBytes; }
    public void setRawBytes(String rawBytes) { this.rawBytes = rawBytes; }
}
