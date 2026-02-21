package org.medassistant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "location_phones")
@Getter
@Setter
public class LocationPhoneEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "location_id")
    private LocationEntity location;

    @Column(name = "phone_number", nullable = false, length = 50)
    private String phoneNumber;
}