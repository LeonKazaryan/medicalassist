package org.medassistant.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.medassistant.dto.LocationDto;
import org.medassistant.service.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class LocationsController {

    final LocationService locationService;
    @GetMapping("/locations")
    public ResponseEntity<List<LocationDto>> getLocations(@RequestParam(required = false) String request,
                                                          @RequestParam(required = false) Float lat,
                                                          @RequestParam(required = false) Float lon,
                                                          @RequestParam(required = false) Integer radius) {
        return ResponseEntity.ok().body(locationService.getLocation(request, lat, lon, radius));
    }
}
