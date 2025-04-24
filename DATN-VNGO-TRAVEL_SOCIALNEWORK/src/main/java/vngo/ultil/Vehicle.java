package vngo.ultil;

public enum Vehicle {
    CAR("Car"),
    BUS("Bus"),
    TRAIN("Train"),
    PLANE("Plane"),
    BICYCLE("Bicycle"),
    BOAT("Boat");

    private String displayName;

    Vehicle(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

}
