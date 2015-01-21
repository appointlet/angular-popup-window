(function() {
  'use strict';

  angular.module('popup', [])

  /**
   * @ngdoc service
   * @name popup.service.PopUp
   * @module popup
   * @description
   * Opens/manages browser pop-up windows.
   */
  .service('PopUp', ['$log', '$window', '$q', '$interval',
    function($log, $window, $q, $interval) {
      /**
       * @ngdoc method
       * @name popup.service.PopUp#open
       * @description
       * Opens a new window and returns a promise that will resolve when the
       * window is closed.
       *
       * @param  {string} url to point the window to.
       * @param  {string} name of the window.
       * @param  {string} options to apply to the window (likely height/width).
       */
      this.open = function(url, name, options) {
        $log.debug('PopUp', 'opening', url, name, options);

        var d = $q.defer();

        var optionsPieces = [];
        angular.forEach(options, function(val, key) {
          optionsPieces.push(key + '=' + val);
        });

        // open the window
        var win = $window.open(url, name, optionsPieces.join(','));

        // setup an interval to watch the window for manual dismiss.
        var watcher = $interval(function() {
          if (win.closed) {
            $log.debug('PopUp', 'closed');
            d.resolve();
            $interval.cancel(watcher);
          }
        }, 100, 0, false);

        // ship back the promise so that the caller can know when the
        // window closes
        return d.promise;
      };

    }
  ]);

})();
