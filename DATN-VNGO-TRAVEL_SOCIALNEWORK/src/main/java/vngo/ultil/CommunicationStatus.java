package vngo.ultil;

public enum CommunicationStatus {
    PENDING("Pending"),     // Đang chờ xử lý
    SENT("Sent"),           // Đã gửi
    READ("Read"),           // Đã đọc
    FAILED("Failed"),       // Gửi thất bại
    DISMISSED("Dismissed"); // Bị bỏ qua hoặc xóa

    private final String status;

    CommunicationStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    // Chuyển từ chuỗi sang enum
    public static CommunicationStatus fromString(String status) {
        for (CommunicationStatus communicationStatus : CommunicationStatus.values()) {
            if (communicationStatus.getStatus().equalsIgnoreCase(status)) {
                return communicationStatus;
            }
        }
        throw new IllegalArgumentException("Unknown status: " + status);
    }
}
