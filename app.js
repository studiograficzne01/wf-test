//I set app and load two dependencies, one for routing, second downloaded by bower needed to make image picker easily
var app = angular.module('app', ['ngRoute', 'ng-file-model'])

    .config(function ($routeProvider){
        $routeProvider
            .when('/start', {
                templateUrl: 'no_selected.html',
            })
            .when('/profile/:profile_index', {
                templateUrl: 'profile_info.html',
                controller: 'profileInfoCtrl'
            })
            .when('/add', {
                templateUrl: 'profile_form.html',
                controller: 'addProfileCtrl'
            })
            .when('/edit/:profile_index', {
                templateUrl: 'profile_form.html',
                controller: 'editProfileCtrl'
            })
            .otherwise({redirectTo: '/start'});
    })

    .controller('startCtrl', function ($scope, $http){
        $scope.profiles = [];
        $scope.photos = [];

        $http.get("http://jsonplaceholder.typicode.com/users")
            .then(function(response) {
                $scope.profiles = response.data;
                console.dir($scope.profiles);
                //after I have array ob profiles object I add to the profiles model also photos, that profiles hadn't assigned
                $scope.assignPhotos();
            });

        $scope.assignPhotos = function() {
            $http.get("http://jsonplaceholder.typicode.com/photos")
                .then(function(response) {
                    $scope.photos = response;

                    for (var profile in $scope.profiles) {
                        $scope.profiles[profile].photo = {
                            data: $scope.photos.data[profile].thumbnailUrl
                        };
                    }
                })
            ;
        }
    })

    .controller('profileInfoCtrl', function ($scope, $routeParams){
        //I use route params to get argument set in another controller, I could also use some service, or Input in Angular 2
        //profile_index is also order of the profile in the profiles array
        $scope.profile = $scope.profiles[$routeParams.profile_index];
    })

    .controller('addProfileCtrl', function ($scope, $location) {
        //variable path is used on the view to define visibility of correct button, because both controllers addProfileCtrl and editProfileCtrl uses the same view profile_form.html
        $scope.path = $location.path();

        $scope.createProfile = function () {
            //when confirmed I get data from the form's view
            var newProfile = $scope.profile;
            //then I assign id for this, because I need it in route params
            newProfile.id = $scope.profiles.length;
            //I add new profile to the profiles array
            $scope.profiles.push(newProfile);
        };
    })

    .controller('editProfileCtrl', function ($scope, $routeParams){
        $scope.index = $routeParams.profile_index;
        $scope.profile = $scope.profiles[$scope.index];
    })

    .directive('profile', function () {
        // this directive is defined to display single element of list of profiles, restrict 'E' means I may use 'profile' name as tag
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'profile.html'
        }
    });

