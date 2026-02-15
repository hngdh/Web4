package web4.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web4.model.Point;
import web4.model.User;

import java.util.List;

@Repository
public interface PointRepository extends JpaRepository<Point, Long> {

    List<Point> findAllByUserOrderByReleaseTimeDesc(User user);

    void deleteAllByUser(User user);
}
