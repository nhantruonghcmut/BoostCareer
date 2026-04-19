package site.boostcareer.app.exception;

import java.time.Instant;
import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiErrorResponse {
    private final int status;
    private final String error;
    private final String message;
    private final List<String> details;
    private final Instant timestamp;
}
