package vngo.ultil;

public enum ImageType {
	BLOG,
	ACCOUNT,
	AVATAR,
	TOUR,
	LOCATION;
	
	ImageType() {
	}
	
	private String displayName;

	ImageType(String displayName) {
		this.displayName = displayName;
	}

	public String getDisplayName() {
		return displayName;
	}

}
