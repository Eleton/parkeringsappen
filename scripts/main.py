from parse_requests import Request

# Usage example. Radius in meter
# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    RADIUS = "200"
    LAT = "59.281431"
    LONG = "18.079613"
    request = Request(LAT, LONG, RADIUS)
    request.print_features()
    print()
    for feature in request.get_sorted_feature_properties():
        print(feature['PARKING_ALLOWED'])
        print(feature['OTHER_INFO'])
    print(len(request.get_allowed_features()))
    print(request.get_sorted_feature_properties()[0]['PARKING_ALLOWED'])

