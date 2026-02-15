package web4.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web4.dto.PointDTO;
import web4.dto.PointRequest;
import web4.dto.PointResponse;
import web4.model.Point;
import web4.model.User;
import web4.repository.PointRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PointService {

    private final PointRepository pointRepository;
    private final AreaCheckService areaCheckService;

    @Transactional
    public PointResponse checkAndSavePoint(PointRequest request, User user) {
        long startTime = System.nanoTime();

        boolean hit = areaCheckService.checkHit(request.getX(), request.getY(), request.getR());

        long endTime = System.nanoTime();
        BigDecimal calcTime = BigDecimal.valueOf((endTime - startTime) / 1000.0);

        Point point = new Point(
                user,
                request.getX(),
                request.getY(),
                request.getR(),
                hit,
                calcTime
        );

        Point savedPoint = pointRepository.save(point);

        return convertToResponse(savedPoint);
    }

    @Transactional(readOnly = true)
    public List<PointResponse> getAllUserPoints(User user) {
        return pointRepository.findAllByUserOrderByReleaseTimeDesc(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PointDTO> getUserPointsForCanvas(User user) {
        return pointRepository.findAllByUserOrderByReleaseTimeDesc(user)
                .stream()
                .map(point -> new PointDTO(point.getX(), point.getY()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAllUserPoints(User user) {
        pointRepository.deleteAllByUser(user);
    }

    private PointResponse convertToResponse(Point point) {
        return new PointResponse(
                point.getId(),
                point.getX(),
                point.getY(),
                point.getR(),
                point.isHit(),
                point.getCalcTime(),
                point.getReleaseTime()
        );
    }
}
