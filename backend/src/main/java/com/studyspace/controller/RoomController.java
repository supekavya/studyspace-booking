package com.studyspace.controller;

import com.studyspace.model.*;
import com.studyspace.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Tag(name = "Rooms", description = "View and manage study rooms")
@SecurityRequirement(name = "Bearer Authentication")
public class RoomController {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    @GetMapping
    @Operation(summary = "Get all active rooms")
    public ResponseEntity<List<RoomResponse>> getAllRooms(
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) Integer floor) {
        List<Room> rooms;
        if (capacity != null) rooms = roomRepository.findByActiveTrueAndCapacityGreaterThanEqual(capacity);
        else if (floor != null) rooms = roomRepository.findByActiveTrueAndFloor(floor);
        else rooms = roomRepository.findByActiveTrue();
        return ResponseEntity.ok(rooms.stream().map(RoomResponse::from).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single room by ID")
    public ResponseEntity<RoomResponse> getRoom(@PathVariable Long id) {
        return roomRepository.findById(id)
                .map(r -> ResponseEntity.ok(RoomResponse.from(r)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/available")
    @Operation(summary = "Get rooms available for a given date and time range")
    public ResponseEntity<List<RoomResponse>> getAvailableRooms(
            @RequestParam LocalDate date,
            @RequestParam LocalTime startTime,
            @RequestParam LocalTime endTime) {
        List<Room> rooms = roomRepository.findAvailableRooms(date, startTime, endTime);
        return ResponseEntity.ok(rooms.stream().map(RoomResponse::from).collect(Collectors.toList()));
    }

    @GetMapping("/{id}/slots")
    @Operation(summary = "Get hourly slot availability for a room on a given date")
    public ResponseEntity<List<SlotStatus>> getRoomSlots(
            @PathVariable Long id,
            @RequestParam LocalDate date) {
        Room room = roomRepository.findById(id).orElseThrow();
        List<Booking> dayBookings = bookingRepository.findByRoomIdAndDateAndStatus(id, date, Booking.Status.ACTIVE);

        List<String> slots = List.of("08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00");
        List<SlotStatus> result = new ArrayList<>();
        for (String slot : slots) {
            LocalTime t = LocalTime.parse(slot);
            SlotStatus s = new SlotStatus();
            s.time = slot;
            Optional<Booking> match = dayBookings.stream()
                .filter(b -> !t.isBefore(b.getStartTime()) && t.isBefore(b.getEndTime()))
                .findFirst();
            s.available = match.isEmpty();
            match.ifPresent(b -> {
                s.bookingId = b.getId();
                s.bookedBy = b.getUser().getFullName();
                s.purpose = b.getPurpose();
            });
            result.add(s);
        }
        return ResponseEntity.ok(result);
    }

    // ADMIN endpoints
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[Admin] Create a new room")
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomRequest req) {
        Room room = Room.builder()
                .name(req.name).capacity(req.capacity).floor(req.floor)
                .description(req.description).color(req.color).amenities(req.amenities)
                .build();
        return ResponseEntity.ok(RoomResponse.from(roomRepository.save(room)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[Admin] Update a room")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long id, @Valid @RequestBody RoomRequest req) {
        return roomRepository.findById(id).map(room -> {
            room.setName(req.name); room.setCapacity(req.capacity); room.setFloor(req.floor);
            room.setDescription(req.description); room.setColor(req.color); room.setAmenities(req.amenities);
            return ResponseEntity.ok(RoomResponse.from(roomRepository.save(room)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[Admin] Deactivate a room")
    public ResponseEntity<?> deactivateRoom(@PathVariable Long id) {
        return roomRepository.findById(id).map(room -> {
            room.setActive(false);
            roomRepository.save(room);
            return ResponseEntity.ok(Map.of("message", "Room deactivated."));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Inner DTOs ────────────────────────────────────────────────────────────

    @Data static class RoomResponse {
        Long id; String name; Integer capacity; Integer floor;
        String description; String color; List<String> amenities; Boolean active;
        static RoomResponse from(Room r) {
            RoomResponse d = new RoomResponse();
            d.id=r.getId(); d.name=r.getName(); d.capacity=r.getCapacity(); d.floor=r.getFloor();
            d.description=r.getDescription(); d.color=r.getColor(); d.amenities=r.getAmenities(); d.active=r.getActive();
            return d;
        }
    }

    @Data static class RoomRequest {
        @NotBlank String name;
        @NotNull @Min(1) Integer capacity;
        @NotNull @Min(1) Integer floor;
        String description; String color; List<String> amenities;
    }

    @Data static class SlotStatus {
        String time; boolean available; Long bookingId; String bookedBy; String purpose;
    }
}
