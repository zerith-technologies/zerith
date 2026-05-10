package com.zerith.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "telemetria")
public class Telemetria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Instant timestamp;
    private String pid;
    private String name;
    private Double value;
    private String unit;

    @Column(name = "raw_bytes")
    @JsonProperty("raw_bytes")
    private String rawBytes;

    @Column(name = "vehicle_id")
    @JsonProperty("vehicle_id")
    private String vehicleId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
}
