package com.studyspace.dto;

import com.studyspace.model.Booking;
import com.studyspace.model.Room;
import com.studyspace.model.User;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

// ─── Auth DTOs ───────────────────────────────────────────────────────────────

@Data
class RegisterRequest {
    @NotBlank @Size(min=3, max=50) public String username;
    @NotBlank @Email                public String email;
    @NotBlank @Size(min=6)          public String password;
    @NotBlank                       public String fullName;
}

@Data
class LoginRequest {
    @NotBlank public String username;
    @NotBlank public String password;
}

@Data
class AuthResponse {
    public String token;
    public String type = "Bearer";
    public Long id;
    public String username;
    public String email;
    public String fullName;
    public String role;

    public AuthResponse(String token, User user) {
        this.token = token;
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.role = user.getRole().name();
    }
}

// ─── Room DTOs ────────────────────────────────────────────────────────────────

@Data
class RoomResponse {
    public Long id;
    public String name;
    public Integer capacity;
    public Integer floor;
    public String description;
    public String color;
    public List<String> amenities;
    public Boolean active;

    public static RoomResponse from(Room room) {
        RoomResponse dto = new RoomResponse();
        dto.id = room.getId();
        dto.name = room.getName();
        dto.capacity = room.getCapacity();
        dto.floor = room.getFloor();
        dto.description = room.getDescription();
        dto.color = room.getColor();
        dto.amenities = room.getAmenities();
        dto.active = room.getActive();
        return dto;
    }
}

@Data
class RoomRequest {
    @NotBlank                 public String name;
    @NotNull @Min(1) @Max(50) public Integer capacity;
    @NotNull @Min(1)          public Integer floor;
    public String description;
    public String color;
    public List<String> amenities;
}

// ─── Booking DTOs ─────────────────────────────────────────────────────────────

@Data
class BookingRequest {
    @NotNull                  public Long roomId;
    @NotNull @FutureOrPresent public LocalDate date;
    @NotNull                  public LocalTime startTime;
    @NotNull                  public LocalTime endTime;
    @NotBlank @Size(max=200)  public String purpose;
}

@Data
class BookingResponse {
    public Long id;
    public Long roomId;
    public String roomName;
    public String roomColor;
    public Integer roomFloor;
    public Long userId;
    public String userName;
    public String userFullName;
    public LocalDate date;
    public LocalTime startTime;
    public LocalTime endTime;
    public String purpose;
    public String status;
    public LocalDateTime createdAt;

    public static BookingResponse from(Booking b) {
        BookingResponse dto = new BookingResponse();
        dto.id = b.getId();
        dto.roomId = b.getRoom().getId();
        dto.roomName = b.getRoom().getName();
        dto.roomColor = b.getRoom().getColor();
        dto.roomFloor = b.getRoom().getFloor();
        dto.userId = b.getUser().getId();
        dto.userName = b.getUser().getUsername();
        dto.userFullName = b.getUser().getFullName();
        dto.date = b.getDate();
        dto.startTime = b.getStartTime();
        dto.endTime = b.getEndTime();
        dto.purpose = b.getPurpose();
        dto.status = b.getStatus().name();
        dto.createdAt = b.getCreatedAt();
        return dto;
    }
}

// ─── Availability ─────────────────────────────────────────────────────────────

@Data
class SlotStatus {
    public String time;
    public boolean available;
    public Long bookingId;
    public String bookedBy;
    public String purpose;
}

@Data
class RoomAvailability {
    public Long roomId;
    public String roomName;
    public LocalDate date;
    public List<SlotStatus> slots;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

@Data
class DashboardStats {
    public long totalRooms;
    public long availableNow;
    public long activeBookingsToday;
    public long myBookings;
}

// ─── Public exports (package-private inner classes pattern) ──────────────────

public class Dtos {
    public static final class Register extends RegisterRequest {}
    public static final class Login extends LoginRequest {}
    public static final class Auth extends AuthResponse {
        public Auth(String token, User user) { super(token, user); }
    }
    public static final class RoomReq extends RoomRequest {}
    public static final class RoomRes extends RoomResponse {}
    public static final class BookingReq extends BookingRequest {}
    public static final class BookingRes extends BookingResponse {}
    public static final class Slot extends SlotStatus {}
    public static final class Availability extends RoomAvailability {}
    public static final class Stats extends DashboardStats {}
}
