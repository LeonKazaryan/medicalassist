package org.medassistant.dto;

import lombok.Data;

@Data
public class LocationDto {
    private Integer id;
    private String name;
    private double lat;
    private double lon;
    private Integer reviewsNumber;
    private double rating;
    private String address;
}
