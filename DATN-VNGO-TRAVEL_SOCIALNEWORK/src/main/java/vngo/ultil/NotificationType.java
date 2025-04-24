package vngo.ultil;

public enum NotificationType {
	BLOG,
	ACCOUNT,
	TOUR,
	LOCATION,
	MESSAGE,
	LIKE,
	COMMENT;
	
	NotificationType() {
	}
	
	private String displayName;

	NotificationType(String displayName) {
		this.displayName = displayName;
	}

	public String getDisplayName() {
		return displayName;
	}

}
