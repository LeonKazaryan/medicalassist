package org.medassistant.mapper;

import org.medassistant.dto.LocationDto;
import org.medassistant.entity.LocationEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

//@Mapper(componentModel = "spring");
@Component
public class LocationMapper {

    public LocationDto toDto(LocationEntity e) {
        if (e == null) return null;

        LocationDto dto = new LocationDto();

        // id: у entity Long, у dto Integer (может переполниться, но обычно ок)
        dto.setId(e.getId() == null ? null : Math.toIntExact(e.getId()));

        dto.setName(e.getName());

        // primitive double -> если null, ставим 0.0
        dto.setLat(e.getLat() != null ? e.getLat() : 0.0);
        dto.setLon(e.getLon() != null ? e.getLon() : 0.0);

        dto.setReviewsNumber(e.getReviewsCount() != null ? e.getReviewsCount() : 0);

        // rating у тебя Float -> double
        dto.setRating(e.getRating() != null ? e.getRating() : 0.0);

        dto.setAddress(e.getAddress());

        return dto;
    }

    public List<LocationDto> toDtoList(List<LocationEntity> entities) {
        if (entities == null) return List.of();
        return entities.stream()
                .filter(Objects::nonNull)
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}