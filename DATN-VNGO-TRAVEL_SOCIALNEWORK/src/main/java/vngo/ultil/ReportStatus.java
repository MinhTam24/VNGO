package vngo.ultil;

public enum ReportStatus {
    PENDING("Pending"),   // Báo cáo đang chờ xử lý
    APPROVED("Approved"), // Báo cáo đã được phê duyệt
    REJECTED("Rejected"); // Báo cáo bị từ chối

    private final String status;

    ReportStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    @Override
    public String toString() {
        return this.status;
    }
}
