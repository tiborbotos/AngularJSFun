class State2Controller
	constructor: ($log, $scope) ->
		$scope.state = 'state two'

angular.module('app').controller 'state2Controller', ['$log', '$scope', State2Controller]