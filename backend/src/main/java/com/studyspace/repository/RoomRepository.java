package com.studyspace.repository;

import com.studyspace.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByActiveTrue();

    long countByActiveTrue();

    List<Room> findByActiveTrueAndCapacityGreaterThanEqual(Integer capacity);

    List<Room> findByActiveTrueAndFloor(Integer floor);

    @Query("""
        SELECT r FROM Room r WHERE r.active = true
        AND r.id NOT IN (
            SELECT b.room.id FROM Booking b
            WHERE b.date = :date
            AND b.status = 'ACTIVE'
            AND b.startTime < :endTime
            AND b.endTime > :startTime
        )
    """)
    List<Room> findAvailableRooms(
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );
}
