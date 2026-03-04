package com.studyspace.repository;

import com.studyspace.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByDateDescStartTimeDesc(Long userId);

    List<Booking> findByRoomIdAndDateAndStatus(Long roomId, LocalDate date, Booking.Status status);

    List<Booking> findByDateAndStatus(LocalDate date, Booking.Status status);

    @Query("""
        SELECT COUNT(b) > 0 FROM Booking b
        WHERE b.room.id = :roomId
        AND b.date = :date
        AND b.status = 'ACTIVE'
        AND b.startTime < :endTime
        AND b.endTime > :startTime
        AND (:excludeId IS NULL OR b.id != :excludeId)
    """)
    boolean existsConflict(
        @Param("roomId") Long roomId,
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime,
        @Param("excludeId") Long excludeId
    );

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.date = :date AND b.status = 'ACTIVE'")
    long countActiveBookingsByDate(@Param("date") LocalDate date);
}
