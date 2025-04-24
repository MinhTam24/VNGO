package vngo.ultil;

public enum Gender {
	 MALE("Nam"), 
     FEMALE("Nữ"), 
     OTHER("Khác");

     private final String displayName;

     Gender(String displayName) {
         this.displayName = displayName;
     }

     public String getDisplayName() {
         return this.displayName;
     }
}
