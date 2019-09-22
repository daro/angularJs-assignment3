(function () {
        "use strict";

        angular.module("NarrowItDownApp", [])
            .controller("NarrowItDownController", NarrowItDownController)
            .service("MenuSearchService", MenuSearchService)
            .directive("foundItems", FoundItemsDirective)
            .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");


        function FoundItemsDirective() {
            return {
                templateUrl: "templates/foundItems.html",
                scope: {
                    items: '<',
                    message: '@message',
                    onRemove: '&'
                },
                controller: FoundItemsDirectiveController,
                controllerAs: 'list',
                bindToController: true
            };
        }

        function FoundItemsDirectiveController() {
            const list = this;

            list.nothingInList = function () {
                return  list.items.length === 0
            };

        }

        NarrowItDownController.$inject = ['MenuSearchService'];

        function NarrowItDownController(MenuSearchService) {
            const ctrl = this;
            ctrl.found=[];
            ctrl.searchTerm = "";
            ctrl.search = function () {
                ctrl.found = [];
                ctrl.warning = "";
                if (ctrl.searchTerm !=="" ) {
                    MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
                        .then(function (items) {
                            ctrl.found = items;
                            if (items.length === 0) {
                                ctrl.warning = "Nothing found";
                            }
                        }
                    );
                }
            };

            ctrl.removeItem = function (itemIndex) {
                // remove item form list
                ctrl.found.splice(itemIndex,1);
            };
        }

        MenuSearchService.$inject = ['$http', 'ApiBasePath'];

        function MenuSearchService($http, ApiBasePath) {
            const service = this;

            service.getMatchedMenuItems = function (searchTerm) {
                return $http({
                    method: "GET",
                    url: (ApiBasePath + "/menu_items.json"),
                })
                    .then(function (result) {
                            // return processed items
                            return result.data.menu_items.filter(
                                function (x) {
                                    return (x.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 );
                                }
                            );
                        }
                    )
            };
        }
    }
)();
