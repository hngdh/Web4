package web4.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PointRequest {

    @NotNull(message = "Coordinate X is required")
    private BigDecimal x;

    @NotNull(message = "Coordinate Y is required")
    private BigDecimal y;

    @NotNull(message = "Radius R is required")
    private BigDecimal r;
}
