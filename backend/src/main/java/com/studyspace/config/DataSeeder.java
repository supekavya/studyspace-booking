package com.studyspace.config;

import com.studyspace.model.Room;
import com.studyspace.model.User;
import com.studyspace.repository.RoomRepository;
import com.studyspace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedRooms();
        seedAdminUser();
    }

    private void seedRooms() {
        if (roomRepository.count() > 0) return;
        System.out.println("Seeding rooms...");
        List<Room> rooms = List.of(
            Room.builder().name("Atlas").capacity(2).floor(1).color("#4ADE80")
                .description("Quiet 2-person study pod").amenities(List.of("Whiteboard", "TV Screen")).build(),
            Room.builder().name("Meridian").capacity(4).floor(1).color("#60A5FA")
                .description("Mid-size group room").amenities(List.of("Projector", "Whiteboard", "TV Screen")).build(),
            Room.builder().name("Zenith").capacity(6).floor(2).color("#F472B6")
                .description("Collaborative room with video conferencing").amenities(List.of("Projector", "Whiteboard", "Video Call")).build(),
            Room.builder().name("Vertex").capacity(8).floor(2).color("#FACC15")
                .description("Large team room").amenities(List.of("Dual Projector", "Whiteboard", "Video Call", "TV Screen")).build(),
            Room.builder().name("Solstice").capacity(2).floor(3).color("#FB923C")
                .description("Quiet focus room").amenities(List.of("TV Screen")).build(),
            Room.builder().name("Equinox").capacity(10).floor(3).color("#A78BFA")
                .description("Boardroom-style, fully equipped").amenities(List.of("Dual Projector", "Whiteboard", "Video Call", "TV Screen", "Soundproof")).build()
        );
        roomRepository.saveAll(rooms);
        System.out.println("Seeded " + rooms.size() + " rooms.");
    }

    private void seedAdminUser() {
        if (userRepository.existsByUsername("admin")) return;
        System.out.println("Creating default admin user...");
        userRepository.save(User.builder()
            .username("admin")
            .email("admin@studyspace.edu")
            .password(passwordEncoder.encode("admin123"))
            .fullName("System Administrator")
            .role(User.Role.ADMIN)
            .build());
        System.out.println("Admin created — username: admin, password: admin123");
    }
}