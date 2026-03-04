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
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Create, view and cancel bookings")
@SecurityRequirement(name = "Bearer Authentication")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Validate times
        if (!req.endTime.isAfter(req.startTime))
            return ResponseEntity.badRequest().body(Map.of("error", "End time must be after start time."));
        if (req.date.isBefore(LocalDate.now()))
            return ResponseEntity.badRequest().body(Map.of("error", "Cannot book in the past."));

        // Check conflict
        boolean conflict = bookingRepository.existsConflict(req.roomId, req.date, req.startTime, req.endTime, null);
        if (conflict)
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Time slot already booked."));

        Room room = roomRepository.findById(req.roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = Booking.builder()
                .room(room).user(user).date(req.date)
                .startTime(req.startTime).endTime(req.endTime)
                .purpose(req.purpose).build();

        return ResponseEntity.ok(BookingResponse.from(bookingRepository.save(booking)));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        List<Booking> bookings = bookingRepository.findByUserIdOrderByDateDescStartTimeDesc(user.getId());
        return ResponseEntity.ok(bookings.stream().map(BookingResponse::from).collect(Collectors.toList()));
    }

    @GetMapping("/today")
    @Operation(summary = "Get all bookings for today")
    public ResponseEntity<List<BookingResponse>> getTodayBookings() {
        List<Booking> bookings = bookingRepository.findByDateAndStatus(LocalDate.now(), Booking.Status.ACTIVE);
        return ResponseEntity.ok(bookings.stream().map(BookingResponse::from).collect(Collectors.toList()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return bookingRepository.findById(id).map(booking -> {
            boolean isOwner = booking.getUser().getUsername().equals(userDetails.getUsername());
            boolean isAdmin = userDetails.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isOwner && !isAdmin)
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Not authorized."));
            booking.setStatus(Booking.Status.CANCELLED);
            bookingRepository.save(booking);
            return ResponseEntity.ok(Map.of("message", "Booking cancelled."));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ADMIN: all bookings
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[Admin] Get all bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings(
            @RequestParam(required = false) LocalDate date) {
        List<Booking> bookings = date != null
                ? bookingRepository.findByDateAndStatus(date, Booking.Status.ACTIVE)
                : bookingRepository.findAll();
        return ResponseEntity.ok(bookings.stream().map(BookingResponse::from).collect(Collectors.toList()));
    }

    // Dashboard stats
    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<?> getStats(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        long totalRooms = roomRepository.countByActiveTrue() ;
        long activeToday = bookingRepository.countActiveBookingsByDate(LocalDate.now());
        long myBookings = bookingRepository.findByUserIdOrderByDateDescStartTimeDesc(user.getId()).size();
        return ResponseEntity.ok(Map.of(
            "totalRooms", totalRooms,
            "activeBookingsToday", activeToday,
            "myBookings", myBookings
        ));
    }

    // ── Inner DTOs ────────────────────────────────────────────────────────────

    @Data static class BookingRequest {
        @NotNull Long roomId;
        @NotNull LocalDate date;
        @NotNull LocalTime startTime;
        @NotNull LocalTime endTime;
        @NotBlank @Size(max=200) String purpose;
    }

    @Data static class BookingResponse {
        Long id; Long roomId; String roomName; String roomColor; Integer roomFloor;
        Long userId; String userName; String userFullName;
        LocalDate date; LocalTime startTime; LocalTime endTime;
        String purpose; String status; LocalDateTime createdAt;

        static BookingResponse from(Booking b) {
            BookingResponse d = new BookingResponse();
            d.id=b.getId(); d.roomId=b.getRoom().getId(); d.roomName=b.getRoom().getName();
            d.roomColor=b.getRoom().getColor(); d.roomFloor=b.getRoom().getFloor();
            d.userId=b.getUser().getId(); d.userName=b.getUser().getUsername();
            d.userFullName=b.getUser().getFullName();
            d.date=b.getDate(); d.startTime=b.getStartTime(); d.endTime=b.getEndTime();
            d.purpose=b.getPurpose(); d.status=b.getStatus().name(); d.createdAt=b.getCreatedAt();
            return d;
        }
    }
}
