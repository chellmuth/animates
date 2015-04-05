import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    dataGenerated: function(dataURL) {
      console.log(dataURL);
    }
  }
});
