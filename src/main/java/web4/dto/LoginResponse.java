package web4.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String username;
    private String groupNumber;
    private String token;
    private String message;

    public LoginResponse(String username, String groupNumber, String token) {
        this.username = username;
        this.groupNumber = groupNumber;
        this.token = token;
        this.message = "Login successful";
    }
}
