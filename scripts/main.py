from parse_requests import Request

# Usage example. Radius in meter
# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    RADIUS = "100"
    LAT = "59.281431"
    LONG = "18.079613"
    request = Request(RADIUS, LAT, LONG)
    request.print_features()
    print()
    for feature in request.get_allowed_features():
        print(feature['VF_PLATS_TYP'])
    print(len(request.get_allowed_features()))

