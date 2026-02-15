package web4.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import web4.dto.PointDTO;
import web4.dto.PointRequest;
import web4.dto.PointResponse;
import web4.model.User;
import web4.service.PointService;
import web4.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/points")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class PointController {

    private final PointService pointService;
    private final UserService userService;

    @PostMapping("/check")
    public ResponseEntity<PointResponse> checkPoint(
            @Valid @RequestBody PointRequest request,
            Authentication authentication
    ) {
        User user = userService.findByUsername(authentication.getName());
        PointResponse response = pointService.checkAndSavePoint(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<PointResponse>> getAllPoints(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        List<PointResponse> points = pointService.getAllUserPoints(user);
        return ResponseEntity.ok(points);
    }

    @GetMapping("/canvas")
    public ResponseEntity<List<PointDTO>> getCanvasPoints(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        List<PointDTO> points = pointService.getUserPointsForCanvas(user);
        return ResponseEntity.ok(points);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearAllPoints(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        pointService.deleteAllUserPoints(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "All points cleared successfully");
        return ResponseEntity.ok(response);
    }
}
