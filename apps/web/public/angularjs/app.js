/*
INPUT:
- AngularJS search form values
- selected flight
- booking form values

PROCESS:
- loads airports
- searches flights using $http
- loads seat data for one flight
- creates booking

OUTPUT:
- flight list
- booking result
- error messages
*/
(function () {
  // Create AngularJS app.
  var app = angular.module("flightApp", []);

  var API_URL = "https://airplaneapp-api.onrender.com";
  var FALLBACK_AIRPORTS = [
    { code: "DEL", city: "New Delhi", name: "Indira Gandhi International", country: "India" },
    { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International", country: "India" },
    { code: "BLR", city: "Bengaluru", name: "Kempegowda International", country: "India" },
    { code: "DXB", city: "Dubai", name: "Dubai International", country: "United Arab Emirates" },
    { code: "LHR", city: "London", name: "Heathrow", country: "United Kingdom" },
    { code: "SIN", city: "Singapore", name: "Singapore Changi", country: "Singapore" },
    { code: "JFK", city: "New York", name: "John F. Kennedy International", country: "United States" },
    { code: "SFO", city: "San Francisco", name: "San Francisco International", country: "United States" },
    { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
    { code: "DOH", city: "Doha", name: "Hamad International", country: "Qatar" },
  ];

  app.controller("FlightController", [
    "$scope",
    "$http",
    function ($scope, $http) {
      // Basic page state.
      $scope.airports = FALLBACK_AIRPORTS;
      $scope.flights = [];
      $scope.selectedFlight = null;
      $scope.availableSeats = [];
      $scope.loadingFlights = false;
      $scope.searchError = "";
      $scope.bookingError = "";
      $scope.bookingResult = null;

      // Search form model.
      $scope.search = {
        origin: "DEL",
        destination: "DXB",
        date: tomorrowDate(),
        cabin: "economy",
      };

      // Booking form model.
      $scope.booking = {
        seatId: "",
        firstName: "",
        lastName: "",
        email: "",
        checkedBags: 0,
        priorityBoarding: false,
      };

      $scope.formatInr = function (value) {
        // Format amount in INR.
        return "INR " + Number(value || 0).toLocaleString("en-IN");
      };

      $scope.loadAirports = function () {
        // Load airport list from backend.
        $http.get(API_URL +"/api/airports").then(function (response) {
          $scope.airports = response.data.data.length ? response.data.data : FALLBACK_AIRPORTS;
        }).catch(function () {
          $scope.airports = FALLBACK_AIRPORTS;
        });
      };

      $scope.searchFlights = function () {
        // Clear old messages before a new search.
        $scope.searchError = "";
        $scope.bookingError = "";
        $scope.bookingResult = null;

        // Simple validation.
        if ($scope.search.origin === $scope.search.destination) {
          $scope.searchError = "Origin and destination must be different.";
          return;
        }

        $scope.loadingFlights = true;
        $http({
          method: "GET",
          url: API_URL + "/api/flights/search",
          params: {
            origin: $scope.search.origin,
            destination: $scope.search.destination,
            date: 
            typeof $scope.search.date === "string"
              ? $scope.search.date
              : $scope.search.date.toISOString().slice(0, 10),
            cabin: $scope.search.cabin,
            passengers: 1,
          },
        })
          .then(function (response) {
            // Save flight list and clear old selection.
            $scope.flights = response.data.data;
            $scope.selectedFlight = null;
            $scope.availableSeats = [];
          })
          .catch(function () {
            $scope.searchError = "Could not load flights.";
          })
          .finally(function () {
            $scope.loadingFlights = false;
          });
      };

      $scope.selectFlight = function (flight) {
        // Load one flight in detail, especially its seat map.
        $scope.selectedFlight = flight;
        $scope.bookingError = "";
        $scope.bookingResult = null;
        $scope.booking.seatId = "";

        $http.get(API_URL + "/api/flights/" + encodeURIComponent(flight.id)).then(function (response) {
          $scope.selectedFlight = response.data.data;
          // Keep only seats that are available for the selected cabin.
          $scope.availableSeats = response.data.data.seatMap.filter(function (seat) {
            return seat.cabin === $scope.search.cabin && seat.isAvailable;
          });
        });
      };

      $scope.createBooking = function () {
        // Clear old messages.
        $scope.bookingError = "";
        $scope.bookingResult = null;

        // Basic validation before sending request.
        if (!$scope.selectedFlight || !$scope.booking.seatId || !$scope.booking.firstName || !$scope.booking.lastName || !$scope.booking.email) {
          $scope.bookingError = "Fill all details before booking.";
          return;
        }

        $http
          .post(API_URL + "/api/bookings", {
            flightId: $scope.selectedFlight.id,
            cabin: $scope.search.cabin,
            seatId: $scope.booking.seatId,
            passenger: {
              firstName: $scope.booking.firstName,
              lastName: $scope.booking.lastName,
              email: $scope.booking.email,
            },
            extras: {
              checkedBags: Number($scope.booking.checkedBags),
              priorityBoarding: $scope.booking.priorityBoarding,
            },
          })
          .then(function (response) {
            // Save successful booking and clear form fields.
            $scope.bookingResult = response.data.data;
            $scope.booking = {
              seatId: "",
              firstName: "",
              lastName: "",
              email: "",
              checkedBags: 0,
              priorityBoarding: false,
            };
            // Reload flight details so the seat list updates.
            $scope.selectFlight($scope.selectedFlight);
          })
          .catch(function (error) {
            $scope.bookingError =
              (error.data && error.data.error && error.data.error.message) || "Could not complete booking.";
          });
      };

      // First page load.
      $scope.loadAirports();
      $scope.searchFlights();
    },
  ]);

  function tomorrowDate() {
    // Returns tomorrow's date in YYYY-MM-DD format.
    var date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  }
})();
