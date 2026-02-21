package org.medassistant.service;

import org.medassistant.dto.LocationDto;
import org.springframework.stereotype.Service;

import java.util.List;

public interface LocationService {
    List<LocationDto> getLocation(String request, Float lat, Float lon, Integer radius);
}
