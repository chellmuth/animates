import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    dataGenerated: function(dataURL) {
      console.log(dataURL);
    }
  }
});
