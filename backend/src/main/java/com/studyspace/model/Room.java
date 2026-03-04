package com.studyspace.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Integer floor;

    @Column
    private String description;

    @Column
    private String color;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "room_amenities", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "amenity")
    private List<String> amenities;

    @Column(nullable = false)
    private Boolean active = true;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> bookings;

    public Room() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public Integer getCapacity() { return capacity; }
    public Integer getFloor() { return floor; }
    public String getDescription() { return description; }
    public String getColor() { return color; }
    public List<String> getAmenities() { return amenities; }
    public Boolean getActive() { return active; }
    public List<Booking> getBookings() { return bookings; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setFloor(Integer floor) { this.floor = floor; }
    public void setDescription(String description) { this.description = description; }
    public void setColor(String color) { this.color = color; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }
    public void setActive(Boolean active) { this.active = active; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Room r = new Room();
        public Builder name(String v) { r.name = v; return this; }
        public Builder capacity(Integer v) { r.capacity = v; return this; }
        public Builder floor(Integer v) { r.floor = v; return this; }
        public Builder description(String v) { r.description = v; return this; }
        public Builder color(String v) { r.color = v; return this; }
        public Builder amenities(List<String> v) { r.amenities = v; return this; }
        public Room build() { return r; }
    }
}