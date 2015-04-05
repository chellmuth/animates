import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    dataGenerated: function(pngURL) {
      console.log(pngURL);
    }
  }
});
