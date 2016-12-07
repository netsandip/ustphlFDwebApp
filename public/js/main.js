/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', [
  'ngRoute', 'firebase', 'ngAnimate', 'ngTouch', 'ui.grid', 'tutorialWebApp.factories',
  'timer'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      // Home
      .when("/", { templateUrl: "partials/Register.html", controller: "PageCtrl" })
      // Pages
  
      .when("/lucky", { templateUrl: "partials/Luckygenerate.html", controller: "PageCtrl" })
       .when("/vote", { templateUrl: "partials/Vote.html", controller: "VoteCtrl" })
      .when("/chart", { templateUrl: "partials/Chart.html", controller: "PageCtrl" })
        .when("/admin", { templateUrl: "partials/admin.html", controller: "AdminCtrl" })
      // else 404
      .otherwise("/404", { templateUrl: "partials/404.html", controller: "PageCtrl" });
}]);

/**
 * Controls the Blog
 */
app.controller('BlogCtrl', function (/* $scope, $location, $http */) {

});

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function ($scope, $firebaseArray, $firebaseObject, fireBaseData) {
    console.log("Page Controller reporting for duty.");

    var appref = new Firebase("https://ustglobalphl.firebaseio.com/userRegistration");
    // Attach an asynchronous callback to read the data at our posts reference   

    $scope.RegisteredUsers = $firebaseArray(appref);
    $scope.RegisteredUsers.$loaded().then(function (data) {
        console.log('Initial data loaded', data.length);
        $scope.AppCount = data.length;
    });

    var fdref = new Firebase("https://ustglobalphl.firebaseio.com/fdRegisteredUsers");
    // Attach an asynchronous callback to read the data at our posts reference   

    $scope.fdRegisteredUsers = $firebaseArray(fdref);
    $scope.fdRegisteredUsers.$loaded().then(function (data) {
        console.log('Initial data loaded', data.length);
        $scope.fdCount = data.length;
    });
    var ref = new Firebase("https://ustglobalphl.firebaseio.com/voteDashBoard");
    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function (snapshot) {
        console.log(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

   

    $scope.RegisterButton = function () {

        var strValidUserCheck = "";
        $scope.userdetails = $firebaseArray(fireBaseData.refListUid());
        $scope.userdetails.$loaded().then(function (userdetails) {
            strValidUserCheck = $scope.userdetails.filter(function (user) {
                return user.userId.toUpperCase() == $scope.UID.toUpperCase()
            })
            //  });

            if (strValidUserCheck.length > 0) {
                var CurrentDate = new Date();
                $scope.fdRegusers = $firebaseArray(fdref);
                $scope.fdRegusers.$loaded().then(function (fdRegusers) {
                    console.log("hi");
                    flag = $scope.fdRegusers.filter(function (userlist) { return userlist.userId.toUpperCase() == $scope.UID.toUpperCase() }); //$scope.user.userId
            
                    if (flag.length == 0) {
                        $scope.saveReguserdetails = $scope.fdRegusers.$add({
                            userName: $scope.Name,
                            userId: $scope.UID,
                            lastRegistered: CurrentDate.toLocaleString()
                        }).then(function (fdRegusers) {
                            var syncObject = $firebaseArray(fdref);
                            //$scope.fdRegisteredUsers = $firebase(fdref);
                            syncObject.$loaded().then(function (data) {
                                console.log('Initial data loaded', data.length);
                                $scope.fdCount = data.length;
                            });
                            $scope.message = 'Success!!';
                            $scope.UID = null;
                            $scope.Name = null;
                            //   console.log(ref);
                        }, function (error) {
                            //console.log("Error:", error);
                        });
                    }
                    else {
                        alert("Already registered!!");
                        $scope.message = "Already registered!!";
                    }
                })
            }
            else {
                 $scope.message = 'Duplicate Entry!!';
                 alert("Please input valid UST User ID!!");
            }
        })
   
    flag = true;
   

}
});

app.controller('MainCtrl', ['$scope', '$http', 'uiGridConstants', '$firebaseArray', function ($scope, $http, uiGridConstants, $firebaseArray) {
    var today = new Date();
    var nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
        if (col.filters[0].term) {
            return 'header-filtered';
        } else {
            return '';
        }
    };

    var fdref = new Firebase("https://ustglobalphl.firebaseio.com/fdRegisteredUsers");
    // Attach an asynchronous callback to read the data at our posts reference   



    $scope.gridOptions = {
        enableFiltering: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
        columnDefs: [
          // default
          { field: 'userName', displayName: "Name", headerCellClass: $scope.highlightFilteredHeader, width: '30%' },
          { field: 'userId', displayName: "UID", headerCellClass: $scope.highlightFilteredHeader, width: '30%' },
          {
              field: 'lastRegistered', displayName: "Reg Date", cellFilter: 'date:"longDate"', filterCellFiltered: true, width: '40%',
          }
        ]
    };



    $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
      .success(function (data) {
          $scope.fdRegisteredUsers = $firebaseArray(fdref);
          $scope.fdRegisteredUsers.$loaded().then(function (data) {
              $scope.gridOptions.data = data;
          });
          //var ref = new Firebase(fdref);
          //ref.orderByChild("lastRegistered").on("child_added", function (snapshot) {
          //    console.log(snapshot.key());
          //});
          //$scope.gridOptions.data = data;
          //$scope.gridOptions.data[0].age = -5;

          //data.forEach(function addDates(row, index) {
          //    row.mixedDate = new Date();
          //    row.mixedDate.setDate(today.getDate() + (index % 14));
          //    row.gender = row.gender === 'male' ? '1' : '2';
          //});
      });


}])
.filter('mapGender', function () {
    var genderHash = {
        1: 'male',
        2: 'female'
    };

    return function (input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    };
});


app.controller('VoteCtrl', function ($scope, $firebaseArray, fireBaseData, $window, $route) {
    $scope.Employees = $firebaseArray(fireBaseData.refEmpList());



    $scope.v = {};
    $scope.isDisable = false;




    $scope.doSaveVote = function (v) {
        var foundnumber = "";



        $scope.isDuplicate = false;

        $scope.EmpVoteCounts = $firebaseArray(fireBaseData.refVoteCount());
        $scope.EmpVoteCounts.$loaded().then(function (EmpVoteCounts) {
            console.log(EmpVoteCounts);
            angular.forEach(EmpVoteCounts, function (emp) {
                if (emp.voterId == $scope.userEmailId + "@ust-global.com") {
                    $scope.v = emp.voteTo;
                    // $scope.isDisable = true;
                    $scope.isDuplicate = true;

                }
            });
        });


        $scope.validUserId = $firebaseArray(fireBaseData.refListUid());
        $scope.validUserId.$loaded().then(function (validUserId) {
            foundnumber = $scope.validUserId.filter(function (validUserId) { return validUserId.userId == $scope.userEmailId })
        })
        $scope.userdetails = $firebaseArray(fireBaseData.refListUid());
        $scope.userdetails.$loaded().then(function (userdetails) {
            foundnumber = $scope.userdetails.filter(function (user) {
                return user.userId.toUpperCase() == $scope.userEmailId.toUpperCase()
            });



            // });
            //var userEmailId = $scope.userEmailId;
            if (foundnumber.length > 0 && $scope.userEmailId != undefined && $scope.userEmailId != "") {


                if (!$scope.isDuplicate) {
                    var confirmPopup = $window.confirm('please confirm your selection(Ok for confirm)?');


                    if (confirmPopup) {
                        // $scope.isDisable = true;
                        $scope.saveEmpVoteCounts = $scope.EmpVoteCounts.$add({
                            voterId: $scope.userEmailId + "@ust-global.com",
                            voteTo: v.choice
                        }).then(function (ref) {
                            console.log(ref);
                        }, function (error) {
                            console.log("Error:", error);
                        });
                        $scope.Employees.$loaded().then(function (Employees) {
                            angular.forEach(Employees, function (emp, value) {
                                if (emp.empId == v.choice) {
                                    var ref = new Firebase('https://ustglobalphl.firebaseio.com/employeeList/' + value);
                                    ref.update({
                                        "totalVote": emp.totalVote == undefined ? 1 : parseInt(emp.totalVote) + 1
                                    });
                                };
                            });
                        });						
                        $route.reload();

                    }

                } else {
                    alert("Already Voted!!");
                    $route.reload();
                }
            }
            else {
                alert("Enter a valid UID");
                $route.reload();
            }
        })
    }
	
	});
app.controller('AdminCtrl', function ($scope, $firebaseArray, fireBaseData, $window, $route) {
    $scope.Enable = false;;
    $scope.ButtonText = "Disable Voting";
    $scope.VoteReset = function () {
        $scope.Employees = $firebaseArray(fireBaseData.refEmpList());
        $scope.EmpVoteCounts = $firebaseArray(fireBaseData.refVoteCount());
        $scope.Employees.$loaded().then(function (Employees) {
            angular.forEach(Employees, function (emp, value) {
                var ref = new Firebase('https://ustglobalphl.firebaseio.com/employeeList/' + value);
                ref.update({ "totalVote": 0 });
            });

        });
        $scope.EmpVoteCounts.$loaded().then(function (EmpVoteCounts) {
            angular.forEach(EmpVoteCounts, function (emp, value) {
                var ref = new Firebase('https://ustglobalphl.firebaseio.com/empVoteCount/' + emp.$id);
                ref.remove();
            });
        });
    }

    $scope.FDReset = function () {
        $scope.FdRegusers = $firebaseArray(fireBaseData.refFdRegusers());
        $scope.FdRegusers.$loaded().then(function (FdRegusers) {
            angular.forEach(FdRegusers, function (emp, value) {
                var ref = new Firebase('https://ustglobalphl.firebaseio.com/fdRegisteredUsers/' + emp.$id);
                ref.remove();
            });
        });
    }

    $scope.EnableDisableVoting = function () {
        $scope.Employees = $firebaseArray(fireBaseData.refEmpList());
        var flag = 1;
        if ($scope.Enable) {
            flag = 0
            $scope.Enable = false;;
            $scope.ButtonText = "Enable Voting";
        }
        else {
            flag = 1;
            $scope.Enable = true;;
            $scope.ButtonText = "Disable Voting";
        }
        $scope.Employees.$loaded().then(function (Employees) {
            angular.forEach(Employees, function (emp, value) {
                var ref = new Firebase('https://ustglobalphl.firebaseio.com/employeeList/' + value);
                ref.update({ "isActive": flag });
            });

        });
    }

    $scope.AddUser = function () {
        if (!$scope.userEmailId) {
            alert("Enter a valid UID");
            return
        }
        var alreadyExists = false;
        $scope.EmpUIDs = $firebaseArray(fireBaseData.refListUid());
        $scope.EmpUIDs.$loaded().then(function (EmpUIDs) {
            angular.forEach(EmpUIDs, function (emp) {
                if (emp.userId == $scope.userEmailId) {
                    alreadyExists = true;
                }
            });
            if (!alreadyExists) {

                $scope.EmpUIDs.$add({
                    userId: $scope.userEmailId,
                    userName: $scope.userName
                }).then(function (ref) {
                    $scope.userEmailId = null;
                    $scope.userName = null;
                }, function (error) {
                    console.log("Error:", error);
                });
                //$scope.userEmailId = null;
            }
            else {
                alert("Already Exists!!");
            }
        });


    }
});