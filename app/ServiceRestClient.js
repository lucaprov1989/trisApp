angular.module("app.proxy", []).factory("RestClient", ["$http", "config", "$filter", "$rootScope",
    function($http, config, $filter, $rootScope) {

        $rootScope.NET_STATUS_ON = false;

        function getResponse(response) {
            return {
                error: response.status == 200 ? 0 : response.status,
                description: response.statusText,
                data: response.data
            };
        }

        function makeRequest(req, callBack) {
            // Si mostra lo spinner
            $rootScope.NET_STATUS_ON = true;


            $http(req).
            then(function(response) {

                $rootScope.NET_STATUS_ON = false;
                if (callBack !== undefined) {

                    callBack(getResponse(response));

                } else {
                    console.log("PostRequestSuccess: " + req.url + "?" + $httpParamSerializer(rp));
                    console.log(response);
                }
            }, function(response) {
                $rootScope.NET_STATUS_ON = false;
                if (callBack !== undefined) {
                    callBack(getResponse(response));

                } else {
                    console.error("PostRequestError: " + req.url + "?" + $httpParamSerializer(rp));
                    console.error(response);
                }
            });
        }

        function dataRequest(method, path, rp, callBack) {
            var req = {
                method: method,
                url: config.endpoint + path,
                data: rp
            };

            makeRequest(req, callBack);
        }

        function queryRequest(method, path, callBack) {
            var req = {
                method: method,
                url: config.endpoint + path
            };

            makeRequest(req, callBack);
        }

        function putRequest(path, rp, callBack) {
            dataRequest("PUT", path, rp, callBack);
        }

        function postRequest(path, rp, callBack) {
            dataRequest("POST", path, rp, callBack);
        }

        function getRequest(path, callBack) {
            queryRequest("GET", path, callBack);
        }

        function deleteRequest(path, callBack) {
            queryRequest("DELETE", path, callBack);
        }


        return {
            get_matches: function(callBack) {
                getRequest("/tris/", callBack);
            },
            save_match: function(match, callBack) {
                postRequest("/tris/", match, callBack);
            }

        };
    }
]);
