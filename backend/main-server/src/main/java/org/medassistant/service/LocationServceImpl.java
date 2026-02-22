package org.medassistant.service;

import lombok.RequiredArgsConstructor;
import org.medassistant.dto.LocationDto;
import org.medassistant.mapper.LocationMapper;
import org.medassistant.repository.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationServceImpl implements LocationService {
    final LocationRepository locationRepository;
    final LocationMapper locationMapper;
    
    private static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0; // km
        double phi1 = Math.toRadians(lat1);
        double phi2 = Math.toRadians(lat2);
        double dPhi = Math.toRadians(lat2 - lat1);
        double dLambda = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dPhi / 2) * Math.sin(dPhi / 2)
                + Math.cos(phi1) * Math.cos(phi2)
                * Math.sin(dLambda / 2) * Math.sin(dLambda / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000;
    }
    
    @Override
    public List<LocationDto> getLocation(String request, Float lat, Float lon, Integer radius) {
        List<LocationDto> locations = locationRepository.findAllByRequest(request).stream().map(locationMapper::toDto).toList();
        List<LocationDto> nearLocations = new ArrayList<>();
        for (LocationDto location : locations) {
            if(haversineKm(location.getLat(), location.getLon(), lat, lon) <= radius) {
                nearLocations.add(location);
            }
        }
        nearLocations.sort(Comparator.comparing(LocationDto::getRating).reversed());
        return nearLocations;
    }
}
