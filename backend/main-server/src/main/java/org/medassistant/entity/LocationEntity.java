package org.medassistant.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "medical_locations")
@Getter
@Setter
public class LocationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "external_id", unique = true, length = 50)
    private String externalId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "text")
    private String address;

    private Double lat;
    private Double lon;

    private Float rating;

    @Column(name = "reviews_count")
    private Integer reviewsCount;

    @Column(columnDefinition = "jsonb")
    private String metadata; // проще строкой, чтобы не тянуть доп. либы

    // categories (many-to-many через location_categories)
    @ManyToMany
    @JoinTable(
            name = "location_categories",
            joinColumns = @JoinColumn(name = "location_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<CategoryEntity> categories = new HashSet<>();

    // phones (one-to-many)
    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<LocationPhoneEntity> phones = new HashSet<>();
}
