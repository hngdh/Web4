package web4.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AreaCheckService {

    public boolean checkHit(BigDecimal x, BigDecimal y, BigDecimal r) {
        return checkSquare(x, y, r) || checkCircle(x, y, r) || checkTriangle(x, y, r);
    }

    private boolean checkSquare(BigDecimal x, BigDecimal y, BigDecimal r) {
        if (r.compareTo(BigDecimal.ZERO) >=0) {
            return x.compareTo(BigDecimal.ZERO) <= 0
                && y.compareTo(BigDecimal.ZERO) >= 0
                && x.compareTo(r.negate()) >= 0
                && y.compareTo(r) <= 0;
        } else {
            return x.compareTo(BigDecimal.ZERO) >= 0
                && y.compareTo(BigDecimal.ZERO) <= 0
                && x.compareTo(r.negate()) <= 0
                && y.compareTo(r) >= 0;
        }
    }

    private boolean checkCircle(BigDecimal x, BigDecimal y, BigDecimal r) {
        if (r.compareTo(BigDecimal.ZERO) >=0) {
            return x.compareTo(BigDecimal.ZERO) >= 0
                && y.compareTo(BigDecimal.ZERO) >= 0
                && (x.multiply(x).add(y.multiply(y)).compareTo(r.multiply(r)) <= 0);
        } else {
            return x.compareTo(BigDecimal.ZERO) <= 0
                && y.compareTo(BigDecimal.ZERO) <= 0
                && (x.multiply(x).add(y.multiply(y)).compareTo(r.multiply(r)) <= 0);
        }
    }

    private boolean checkTriangle(BigDecimal x, BigDecimal y, BigDecimal r) {
        if (r.compareTo(BigDecimal.ZERO) >=0) {
            return x.compareTo(BigDecimal.ZERO) >= 0
                && y.compareTo(BigDecimal.ZERO) <= 0
                && (x.add(y.negate()).compareTo(r.divide(BigDecimal.valueOf(2))) <= 0);
        } else {
            return x.compareTo(BigDecimal.ZERO) <= 0
                && y.compareTo(BigDecimal.ZERO) >= 0
                && (x.add(y.negate()).compareTo(r.divide(BigDecimal.valueOf(2))) >= 0);
        }
    }
}
