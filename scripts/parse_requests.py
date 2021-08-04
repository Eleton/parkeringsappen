import requests
import datetime as dt

# SPOT_TYPES = ['Reserverad p-plats motorcykel', 'Reserverad p-plats rörelsehindrad', 'Reserverad p-plats beskickningsbil', 'Tidsreglerad lastplats', 'P Avgift, boende', 'P-avgift endast besök']
WEEKDAYS = ['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag']


class Request(object):
    def __init__(self,lat, long, radius):
        self.radius = radius
        self.lat = lat
        self.long = long
        self.object_features = None
        self.service_features = None
        self.parse()

    def parse(self):
        object_string = "https://openparking.stockholm.se/LTF-Tolken/v1/ptillaten/within" \
                          + "?radius=" + self.radius \
                          + "&lat=" + self.lat \
                          + "&lng=" + self.long + "&outputFormat=JSON&apiKey=a34d27d3-37a5-4b30-9044-6730e6ca6769"
        service_string = "https://openparking.stockholm.se/LTF-Tolken/v1/servicedagar/within" \
                          + "?radius=" + self.radius \
                          + "&lat=" + self.lat \
                          + "&lng=" + self.long + "&outputFormat=JSON&apiKey=a34d27d3-37a5-4b30-9044-6730e6ca6769"

        object_req = requests.get(object_string)
        service_req = requests.get(service_string)
        print(service_req.text)
        service_data = service_req.json()
        object_data = object_req.json()

        self.object_features = object_data['features']
        self.service_features = service_data['features']


    # Not necessary feature, but helpful for testing
    def print_features(self):
        count = 0
        spot_types = []
        for feature in self.object_features:
            count += 1
            feature_properties = feature['properties']
            print("Feature {}: {}".format(count, feature_properties))
            # print("Spot type: {}".format(feature_properties['VF_PLATS_TYP']))
            spot_types.append(feature_properties['VF_PLATS_TYP'])

            # if 'OTHER_INFO' in feature_properties:
            #     print("Feature {} other info: {}".format(count, feature_properties['OTHER_INFO'].split()))
        # print(set(spot_types))


    def before(self, now, month, day):
        if now.month < month:
            return True
        return now.month == month and now.day < day

    def after(self, now, month, day):
        if now.month > month:
            return True
        return now.month == month and now.day > day

    # New function, used for sorting
    def distance_to_origin(self, feature):
        feature_point = feature['geometry']['coordinates'][0]
        return (float(self.long) - feature_point[0]) ** 2 + (float(self.lat) - feature_point[1]) ** 2

    def is_allowed(self, spot_dict, service_dict):
        # NAIVE. Allowed if not regulated or reserved and not currently service time.
        spot_type = spot_dict['VF_PLATS_TYP']
        is_regulated = 'Tidsreglerad' in spot_type
        is_reserved = 'Reserverad' in spot_type
        if service_dict is not None:
            # now = dt.datetime.now()
            now = dt.datetime(2021,12,6,5)
            weekday = WEEKDAYS[now.weekday()]
            if weekday == service_dict['START_WEEKDAY']:
                start_time = int(service_dict['START_TIME'])
                end_time = int(service_dict['END_TIME'])
                start_time = (start_time // 100, start_time % 100)
                end_time = (end_time // 100, end_time % 100)
                if cyclic_between((now.hour, now.minute), start_time, end_time):
                    if 'START_MONTH' not in service_dict:
                        return "Servicetid"
                    if cyclic_between((now.month, now.day), (service_dict['START_MONTH'], service_dict['START_DAY']), (service_dict['END_MONTH'], service_dict['END_DAY'])):
                        return "Servicetid"
        if is_regulated:
            return "Regulerad lastplats"
        if is_reserved:
            return "Ditt fordon får ej parkera här"
        return "Ja"

    # Returns list of property dicts. These have a field "ADDRESS" which is particularly relevant
    def get_allowed_features(self):
        allowed_features = []
        distinct_addresses = []
        for feature in self.object_features:
            FID = feature['properties']['FEATURE_OBJECT_ID']
            service_dict = None
            for service_feature in self.service_features:
                if service_feature['properties']['FEATURE_OBJECT_ID'] == FID:
                    # print("Found service dict")
                    service_dict = service_feature['properties']
            if not feature['properties']['ADDRESS'] in distinct_addresses:
                feature['properties']['PARKING_ALLOWED'] = self.is_allowed(feature['properties'], service_dict)
                allowed_features.append(feature)
                distinct_addresses.append(feature['properties']['ADDRESS'])
        return allowed_features

    def get_sorted_feature_properties(self):
        allowed_features = self.get_allowed_features()
        allowed_features.sort(key=self.distance_to_origin)
        feature_properties = [feature['properties'] for feature in allowed_features]
        return feature_properties

# Inputs: Either all ints
# or time Datetime object and start, end, int tuples
def cyclic_between(time, start, end):
    if before(end, start):
        return before(time, end) or after(time, start)
    else:
        return before(time, end) and after(time, start)

# Input: Either datetime time and (month, day) comparison
# Or floats time and comparison
def before(time, comparison):
    if time[0] < comparison[0]: return True
    return time[0] == comparison[0] and time[1] <= comparison[1]


def after(time, comparison):
    if time[0] > comparison[0]: return True
    return time[0] == comparison[0] and time[1] >= comparison[1]






