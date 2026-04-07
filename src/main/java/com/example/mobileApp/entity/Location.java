package com.example.mobileApp.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.BatchSize;
import org.locationtech.jts.geom.Point;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;

@Entity
@Table(name = "locations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"external_id", "source"})
}, indexes = {
    @jakarta.persistence.Index(name = "idx_location_geo", columnList = "geo")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String address;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(columnDefinition = "geography(Point, 4326)")
    private Point geo;

    @Column(name = "rating_average")
    private Double ratingAverage;

    @Column(name = "review_count")
    private Integer reviewCount;

    @Column(name = "source")
    private String source;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "phone")
    private String phone;

    @Column(name = "website")
    private String website;

    @ManyToMany
    @JoinTable(name = "location_interests", 
               joinColumns = @JoinColumn(name = "location_id"), 
               inverseJoinColumns = @JoinColumn(name = "interest_id"))
    @BatchSize(size = 20)
    private Set<Interest> interests;

    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    @BatchSize(size = 20)
    private List<LocationImage> images = new ArrayList<>();

    @PrePersist
    @PreUpdate
    public void updateGeo() {
        if (latitude != null && longitude != null) {
            GeometryFactory factory = new GeometryFactory(new PrecisionModel(), 4326);
            this.geo = factory.createPoint(new org.locationtech.jts.geom.Coordinate(longitude, latitude));
        }
    }
}
