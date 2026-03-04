package com.studyspace.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.STUDENT;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> bookings;

    public enum Role { STUDENT, ADMIN }

    public User() {}

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getFullName() { return fullName; }
    public Role getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<Booking> getBookings() { return bookings; }

    public void setId(Long id) { this.id = id; }
    public void setUsername(String u) { this.username = u; }
    public void setEmail(String e) { this.email = e; }
    public void setPassword(String p) { this.password = p; }
    public void setFullName(String f) { this.fullName = f; }
    public void setRole(Role r) { this.role = r; }
    public void setCreatedAt(LocalDateTime c) { this.createdAt = c; }
    public void setBookings(List<Booking> b) { this.bookings = b; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final User u = new User();
        public Builder username(String v) { u.username = v; return this; }
        public Builder email(String v) { u.email = v; return this; }
        public Builder password(String v) { u.password = v; return this; }
        public Builder fullName(String v) { u.fullName = v; return this; }
        public Builder role(Role v) { u.role = v; return this; }
        public User build() { return u; }
    }
}