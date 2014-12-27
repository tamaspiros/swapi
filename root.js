'use strict';

exports.indexHandler = {
  handler: function(request, response) {
    response('please chose an endpoint: /films or /actors');
  }
}
